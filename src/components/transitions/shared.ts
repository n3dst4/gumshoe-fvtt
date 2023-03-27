export enum TransitionState {
  startEntering = "startEntering",
  entering = "entering",
  entered = "entered",
  exiting = "exiting",
  exited = "exited",
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
