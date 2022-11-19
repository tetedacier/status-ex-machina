import { createContext } from 'react';
import propTypes from 'prop-types';
import getFixedPoint from '../lib/getFixedPoint';
import fillKeyPercent from '../lib/fillKeyPercent';
export const Constraint = createContext(
    /** @type {import('../../writer').Constraint} */
    (null)
);

export function Constrainer({
    children,
    source,
    setItem,
    rules
}) {


    const {
        fixedPoint,
    } = getFixedPoint(source);

    return (
        <Constraint.Provider
            value={{
                getComputedPercent: (index) => {
                    if (typeof source[index].fixedKeyFrame === 'number') {
                        return source[index].fixedKeyFrame;
                    }
                    return fixedPoint[index];
                },
                setFixedKey: (index, value) => {
                    setItem(fillKeyPercent(source.map((step, i) => i === index
                        ? {
                            ...step,
                            fixedKeyFrame: value,
                        }
                        : step
                    )));
                },
                isInRange: (value, index) => {
                    const allowedBound = { upper: 100, lower: 0 };

                    for (const previous of source.slice(0, index).reverse()) {
                        if (typeof previous.fixedKeyFrame === 'number') {

                            allowedBound.lower = previous.fixedKeyFrame;
                            break;
                        }

                    }

                    for (const next of source.slice(index + 1)) {
                        if (typeof next.fixedKeyFrame === 'number') {
                            allowedBound.upper = next.fixedKeyFrame;
                            break;
                        }
                    }

                    return (value > allowedBound.lower && value < allowedBound.upper);
                },
            }}
        >
            {children}
        </Constraint.Provider>
    )
}
Constrainer.propTypes = {
    rules: propTypes.any,
    children: propTypes.node,
    source: propTypes.any
}

export const Constrained = Constraint.Consumer;
