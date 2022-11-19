/**
 *
 * @param {*} steps
 * @param {*} computedPercents
 * @param {*} [to]
 * @returns
 */


export default function percentRange(
    steps,
    computedPercents,
    to,
    lowerBound
) {
    return steps.slice(
        computedPercents.lastUpperBound,
        to
    ).reduce(
        (...endOfFixedPoint) => Object.assign(
            endOfFixedPoint[0],
            {
                [(
                    computedPercents.lastUpperBound +
                    endOfFixedPoint[2]
                )]: (
                        lowerBound + (endOfFixedPoint[2] + 1) *
                        (
                            100 - computedPercents.lower
                        ) /
                        (
                            to - computedPercents.lastUpperBound + 1
                        )
                    ),
            }
        ),
        {}
    );
}
