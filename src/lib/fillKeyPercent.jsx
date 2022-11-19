//@ts-check
/**
 *
 * @param {*} steps
 * @returns
 */

export default function fillKeyPercent(steps) {
    /** @type {number | null} */
    let lower = null;
    return steps.reduce(
        (computedSteps, step, index) => {

            computedSteps.push(step);

            if (typeof step.fixedKeyFrame === 'number') {
                computedSteps[index].displayedKey = step.fixedKeyFrame;
                if (lower === null) {
                    for (let iterator = 0; iterator < index; iterator++) {
                        computedSteps[iterator].displayedKey = step.fixedKeyFrame * (iterator + 1) / (index + 1);
                    }
                } else {
                    for (let iterator = lower + 1; iterator < index; iterator++) {
                        computedSteps[iterator].displayedKey = computedSteps[lower].fixedKeyFrame + (step.fixedKeyFrame - computedSteps[lower].fixedKeyFrame) * (iterator - lower) / (index - lower);
                    }
                }
                lower = index;
            }
            if (index === steps.length - 1) {
                if (lower === null) {
                    for (let iterator = 0; iterator < steps.length; iterator++) {
                        computedSteps[iterator].displayedKey = 100 * (iterator + 1) / (steps.length + 1);
                    }
                } else {
                    for (let iterator = lower + 1; iterator < steps.length; iterator++) {
                        computedSteps[iterator].displayedKey = computedSteps[lower].fixedKeyFrame + (100 - computedSteps[lower].fixedKeyFrame) * (iterator - lower) / (steps.length - lower);
                    }
                }
            }
            return computedSteps;
        },

        /** @type {import('../../writer').StepState[]} */
        ([])
    );
}
