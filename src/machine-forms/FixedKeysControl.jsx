import React from 'react';
import propTypes from 'prop-types';
import { Constrained } from "../contexts/Constraint";
import { CssFrame } from './styles';

// const validations = [
//     (value) => parseFloat(value) <= 0? 'below_or_equal_0' : '',
//     (value) => parseFloat(value) >= 100? 'above_or_equal_100' : ''
// ];

/**
 *
 * @param {import('../../writer').FixedKeyFrameProps} props
 * @returns
 */

export default function FixedKeysControl({
    step, index,
}) {
    const {
        insertedAt,
    } = step;

    return (
        <Constrained>
            {({
                isInRange, setFixedKey,
            }) => (

                <label>
                    <input
                        name={`animation-index-${insertedAt}`}
                        type="number"
                        placeholder={`${Math.floor(step.displayedKey * 100) / 100} %`}
                        value={step.fixedKeyFrame}
                        onKeyUpCapture={(event) => {
                            if (event.code === 'Enter') {
                                if (isInRange(
                                    event.target.valueAsNumber,
                                    index
                                )) {
                                    setFixedKey(index, event.target.valueAsNumber);
                                } else {
                                    console.log({
                                        valueNotInRange: event.target.valueAsNumber,
                                    });
                                }
                            }
                        }} />{' % '}
                    <CssFrame
                        src="http://localhost:4173/"
                        name={`animation-rule-${insertedAt}`}
                    ></CssFrame>
                </label>
            )}
        </Constrained>
    );
}


FixedKeysControl.propTypes = {
    step: propTypes.shape({
        insertedAt: propTypes.number,
        displayedKey: propTypes.number,
        fixedKeyFrame: propTypes.number,
    }),
    index: propTypes.number,
};
