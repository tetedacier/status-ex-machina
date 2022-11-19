import percentRange from "./percentRange";

export default function getFixedPoint(steps) {
    return steps.reduce(
        (computedPercents, currentStep, index) => {
            console.log(computedPercents, index, steps); //eslint-disable-line no-console
            if (steps.length - 1 === index) {
                return {
                    ...computedPercents,
                    fixedPoint: {
                        ...computedPercents.fixedPoint,
                        ...percentRange(
                            steps,
                            computedPercents,
                            steps.length,
                            computedPercents.lower
                        ),
                    },
                };
            }
            if (typeof currentStep.fixedKeyFrame === 'number') {
                return {
                    lower: currentStep.fixedKeyFrame,
                    lastUpperBound: index,
                    fixedPoint: {
                        ...computedPercents.fixedPoint,
                        ...{ [index]: currentStep.fixedKeyFrame },
                        ...percentRange(
                            steps,
                            computedPercents,
                            index,
                            computedPercents.lower
                        ),
                    },
                };
            }
            return computedPercents;
        },
        {
            lower: 0,
            lastUpperBound: 0,
            fixedPoint: {},
        }
    );
}
