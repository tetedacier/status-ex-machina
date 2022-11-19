import React, {
    Fragment,
    useState
} from 'react';
import {
    Constrainer
 } from "../contexts/Constraint";
import fillKeyPercent from "../lib/fillKeyPercent";
import FixedKeysControl from "./FixedKeysControl";
import { CssFrame } from './styles';

/**
 *
 * @returns
 */
export function States() {
    const [steps, setStep] = useState(
        /** @type {import('../../writer').StepState[]} */
        ([])
    );

    return (
        <Fragment>

            <label>
                <span>from (0%)</span>
                <CssFrame
                    src="http://localhost:4173/"
                    name={'animation-rule-from'}
                />
            </label>
            <Constrainer {...{
                setItem: setStep,
                source: steps
            }}>
                {steps.map((step, index) => (
                    <Fragment key={`step_${step.insertedAt}`}>
                        <p>
                            <button
                                name="add-sub-step-before"
                                data-rank={index}
                                type="button"
                                onClick={() => {
                                    setStep(fillKeyPercent([
                                        ...steps.slice(0, index),
                                        { insertedAt: Date.now() },
                                        ...steps.slice(index)
                                    ]));
                                }}
                            >
                                Add a step
                            </button>
                        </p>
                        <FixedKeysControl {...{
                            index,
                            step,
                        }} />
                    </Fragment>
                ))}
            </Constrainer>
            <p>
                <button
                    name="add-last-sub-step"
                    type="button"
                    onClick={() => {
                        setStep(fillKeyPercent([
                            ...steps.slice(0),
                            { insertedAt: Date.now() }
                        ]));
                    }}
                >
                    Add a step
                </button>
            </p>

            <label>
                <span>to (100 %)</span>
                <CssFrame
                    src="http://localhost:4173/"
                    name={'animation-rule-to'}
                />
            </label>
        </Fragment>
    );
}
