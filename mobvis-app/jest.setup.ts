import "@testing-library/jest-dom";

// shadcn slider component uses resize observer, which we don't need to test.
global.ResizeObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
