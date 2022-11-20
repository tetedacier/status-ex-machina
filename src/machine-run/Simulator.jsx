//@ts-check

import React, {
    createContext,
    createRef,
    Fragment,
    useEffect,
    useState,
} from 'react';
import propTypes from 'prop-types';
import {
    useMachine,
} from '@xstate/react';
import  {
    generateMachine,
} from '../lib/stateMachine.js';
import simpleToggle from '../embedded-machines/simple-toggle.json';

/**
 *
 * @param {*} stateDescription
 * @returns {Object}
 */
function objectOrEmpty(stateDescription) {
    if (isObject(stateDescription)) {
        return stateDescription;
    }
    console.error({ stateDescription }); //eslint-disable-line no-console
    console.error('value above is not an object'); //eslint-disable-line no-console
    return {};
}

/**
 *
 * @param {*} stateDescription
 * @returns {Object}
 */
function normalizeTransition(transition) {
    if (isObject(transition)) {
        return transition;
    }
    if (typeof transition === 'string') {
        return { target: transition };
    }
    console.error({ transition }); //eslint-disable-line no-console
    console.error('value above is neither an object or a string'); //eslint-disable-line no-console
    return {};
}

/**
 *
 * @param {any} subject
 * @returns {boolean}
 */
function isObject(subject) {
    return typeof subject === 'object' && subject !== null && !Array.isArray(subject);
}

/**
 *
 * @param {*} stateDefinition
 * @returns {object}
 */
function getAvailableTransition(stateDefinition) {
    if (!isObject(stateDefinition)) {
        return [];
    }
    if (!isObject(stateDefinition.on)) {
        return [];
    }
    return Object.entries(stateDefinition.on).map(
        ([transitionName, transitionDefinition])=> ({
            name: transitionName,
            ...normalizeTransition(transitionDefinition),
        }));
}

/**
 *
 * @param {*} boxes
 * @returns
 */
function mergeBoundingBoxes (boxes) {
    return boxes.reduce(
        (aggregatedBoxes, box) => {
            if (aggregatedBoxes.container.left) {
                aggregatedBoxes.container.left = Math.min(aggregatedBoxes.container.left, box.left);
            } else {
                aggregatedBoxes.container.left = box.left;
            }
            if (aggregatedBoxes.container.top) {
                aggregatedBoxes.container.top = Math.min(aggregatedBoxes.container.top, box.top);
            } else {
                aggregatedBoxes.container.top = box.top;
            }
            if (aggregatedBoxes.container.height) {
                aggregatedBoxes.container.height = Math.max(aggregatedBoxes.container.height, (box.top-aggregatedBoxes.container.top) + box.height);
            } else {
                aggregatedBoxes.container.height = box.height;
            }
            if (aggregatedBoxes.container.width) {
                aggregatedBoxes.container.width = Math.max(aggregatedBoxes.container.width, (box.left-aggregatedBoxes.container.left) + box.width);
            } else {
                aggregatedBoxes.container.width = box.width;
            }

            return aggregatedBoxes;

        },
        {
            container: {},
            boxes:[],
        }
    );
}

const MeasureContext = createContext(null);

/**
 *
 * @param {*} props
 * @returns
 */
function RenderingLayout ({ children }) {
    let text = Object.create(null);
    return (
        <MeasureContext.Provider
            value={{
                report: (name, measure, styles) => {
                    text[name] = measure;
                    [
                        styles,
                        text,
                        mergeBoundingBoxes(Object.entries(text).map(entries => entries[1]))
                    ].map(console.log); //eslint-disable-line no-console
                },
            }}
        >
            <section style={{
                // visibility: 'hidden',
                // position: 'absolute',
            }}>
                {children}
            </section>
        </MeasureContext.Provider>
    );
}
RenderingLayout.propTypes = {
    children: propTypes.node,
};

/**
 *
 */
function DomMeasured ({
    children,
    report,
}) {
    const [reported, setReported] = useState(false);
    const reference = createRef(null);
    useEffect(
        () => {
            if(!reported) {
                report(
                    reference.current.getBoundingClientRect(),
                    window.getComputedStyle(reference.current).font
                );
                setReported(true);
            }
        },
        [ setReported, reference, reported, report ]
    );
    return (

        <span ref={reference}>
            {children}
        </span>
    );
}
DomMeasured.propTypes = {
    children: propTypes.node,
    report: propTypes.func,
};

/**
 *
 * @param {import('../state').ShowStateProps} props
 * @returns
 */
function ShowAvailableStateTransition({
    stateDefinition,
}){
    return (
        <Fragment>
            {getAvailableTransition(stateDefinition).map((transition)=> (
                <pre
                    style={{
                        fontSize: '16px',
                        fontFamily: 'monospace',
                    }}
                    key={`transition_${transition.name}`}
                >
                    {`${
                        JSON.stringify(
                            transition,
                            null,
                            4
                        )
                    }`}
                </pre>
            ))}
        </Fragment>
    );
}
ShowAvailableStateTransition.propTypes = {
    stateDefinition: propTypes.shape({
        on: propTypes.object,
    }),
};

/**
 *
 * @param {import('../state').ShowStateDiagramProps} props
 * @returns
 */
function ShowStateDiagram ({
    definition,
    state,
}) {
    const mappedNodes = Object.entries(definition.states).reduce(
        /**
         *
         * @param {import('../state').MappedStates} mappedNodes
         * @param {*} param1
         * @returns
         */
        (
            mappedNodes,
            [
                stateName,
                stateDescription
            ]
        ) => {
            if (stateName === definition.initial) {
                mappedNodes.initial = {
                    name: stateName,
                    ...objectOrEmpty(stateDescription),
                };
            } else {
                mappedNodes.states.push({
                    name: stateName,
                    ...objectOrEmpty(stateDescription),
                });
            }
            return mappedNodes;
        },
        { states: [] }
    );
    console.log({ //eslint-disable-line no-console
        state,
        mappedNodes,
    });

    useEffect(() => {
        const background = document.getElementById('background');
        const fore = document.getElementById('fore');
        const container = document.getElementById('container');
        if(
            background !== null
            && fore !== null
            && container !== null
        ) {
            const {
                width,
                height,
                left,
                top,
                x,
                y,
            } = fore.getBoundingClientRect();
            console.log({ //eslint-disable-line no-console
                fore: {
                    width,
                    height,
                    left,
                    top,
                    x,
                    y,
                },
            });
            const {
                x: containerX,
                y: containerY,
            } = container.getBoundingClientRect();
            const foreX = fore.getAttribute('x');
            const padding = 20;
            if(foreX !== null) {
                const renderingRatio = (x - containerX)/parseFloat(foreX);
                background.setAttribute('x', (x - containerX-padding)/renderingRatio);
                background.setAttribute('y', (y - containerY-padding)/renderingRatio);
                background.setAttribute('width', (width + 2*padding)/renderingRatio);
                background.setAttribute('height', (height + 2*padding)/renderingRatio);
                console.log({ renderingRatio }); //eslint-disable-line no-console
            }
            console.log({ background: background.getBoundingClientRect() }); //eslint-disable-line no-console
            console.log(fore.getAttribute('x')); //eslint-disable-line no-console
            console.log(fore.getAttribute('y')); //eslint-disable-line no-console
            console.log(fore.getAttribute('width')); //eslint-disable-line no-console
            console.log(fore.getAttribute('height')); //eslint-disable-line no-console
        }
    });
    return (
        <section>
            <h1>{definition.id}</h1>
            {mappedNodes.initial ? (

                <RenderingLayout>
                    <fieldset id="initial">
                        <legend>
                            <MeasureContext.Consumer>
                                {({ report }) => (
                                    <DomMeasured report={(measure, styles)=> report('initialName', measure, styles)}>
                                        {mappedNodes.initial.name}
                                    </DomMeasured>
                                )}
                            </MeasureContext.Consumer>
                        </legend>

                        <ShowAvailableStateTransition
                            stateDefinition={mappedNodes.initial}
                        />
                    </fieldset>
                    {mappedNodes.states.map((state, index)=> (
                        <fieldset key={index}>
                            <legend>
                                <MeasureContext.Consumer>
                                    {({ report }) => (
                                        <DomMeasured report={(measure, styles)=> report(`stateName_${index}`, measure, styles)}>
                                            {state.name}
                                        </DomMeasured>
                                    )}
                                </MeasureContext.Consumer>
                            </legend>

                            <ShowAvailableStateTransition
                                stateDefinition={state}
                            />
                        </fieldset>
                    ))}
                </RenderingLayout>
            ): (
                <pre
                    style={{
                        fontSize: '16px',
                    }}
                >
                    {`missing initial state in given definition\n${
                        JSON.stringify(
                            definition,
                            null,
                            4
                        )
                    }`}
                </pre>
            )}
            <svg
                viewBox="0 0 220 100"
                xmlns="http://www.w3.org/2000/svg"
                id="container"
            >
                <style>
                    .Rrrrr {'{'}
                        font: italic 40px serif; fill: red;
                        color: black;
                    {'}'}
                </style>
                {/* Simple rectangle */}
                <rect
                    width="100"
                    height="100"
                />
                <rect
                    x="120"
                    y="0"
                    width="100"
                    height="100"
                    rx="15"
                    fill="green"
                    id="background"
                />
                <text
                    x="65"
                    y="55"
                    className="Rrrrr"
                    id="fore"
                >
                    Grumpy!
                </text>
            </svg>
        </section>
    );
}
ShowStateDiagram.propTypes = {
    definition: propTypes.shape({
        initial: propTypes.oneOfType([
            propTypes.string,
            propTypes.shape({
                name: propTypes.string,
            }),
        ]),
        states: propTypes.oneOfType([
            propTypes.object,
            propTypes.arrayOf(
                propTypes.shape({
                    name: propTypes.string,
                })
            )
        ]),
        id: propTypes.string,
    }),
    state: propTypes.object,
};

/**
 *
 * @returns
 */
export default function Simulator({
    definition
}) {
    const [state, send] = useMachine(
        generateMachine(definition),
        {
            actions: {
                displaySwitchForTheFirstTime: (...args) => {
                    console.log( //eslint-disable-line no-console
                        args
                    );
                },
            },
        }
    );
    console.log({ //eslint-disable-line no-console
        definition,
    });
    return (
        <Fragment>
            <ShowStateDiagram
                {...{
                    definition,
                    state,
                }}
            />
            <button onClick={() => send('TOGGLE')}>
                {state.value === 'inactive'
                    ? 'Click to activate'
                    : 'Active! Click to deactivate'
                }
            </button>
        </Fragment>
    );
}
Simulator.defaultProps = {
    definition: simpleToggle,
};
Simulator.propTypes = {
    definition: propTypes.object,
};
