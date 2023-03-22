export enum TransitionState {
  startEntering,
  entering,
  entered,
  exiting,
  exited,
}

export const mountedStates = [
  TransitionState.startEntering,
  TransitionState.entering,
  TransitionState.entered,
  TransitionState.exiting,
];

export const showingStates = [
  TransitionState.entering,
  TransitionState.entered,
];
