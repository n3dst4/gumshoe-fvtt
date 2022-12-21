const noop = () => {};

global.Hooks = {
  once: noop,
  on: noop,
};
