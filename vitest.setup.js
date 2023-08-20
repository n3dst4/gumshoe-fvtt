import { vi } from "vitest";

const noop = () => {};

global.Hooks = {
  once: noop,
  on: noop,
};

// see https://github.com/testing-library/react-testing-library/issues/1197
// and https://github.com/testing-library/user-event/issues/1115
global.jest = {
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};
