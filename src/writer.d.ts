
export interface StepState {
    insertedAt: number;
    keyFrame?: number;
    fixedKeyFrame?: number;
    displayedKey?: number;
}

export interface FixedKeyFrameProps {
    step: StepState;
    index: number;
    length: number;
}
interface ConstraintContext {
    isInRange: (value: number, index: number) => void
    getComputedPercent: (index: number) => number
    setFixedKey: (index: number, value: number) => void
}

export type Constraint = ConstraintContext | null
