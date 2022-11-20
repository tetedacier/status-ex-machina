interface NormalizedState {
    name: string;
}

interface NormalizedMachine {
    initial: string;
    states: NormalizedState[];
    id: string;
}

export interface ShowStateDiagramProps {

    definition: NormalizedMachine;
    state: any;
}

interface TransitionDetails {
    target: string;
}

type Transition = string | TransitionDetails;

interface StateDefinition {
    name: string;
    on: Record<string, Transition>;
}

export interface MappedStates {
    initial?: NormalizedState;
    states: NormalizedState[];
}

export interface ShowStateProps {
    stateDefinition: StateDefinition
}
