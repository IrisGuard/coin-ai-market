
// Simple store utilities for testing without external dependencies
export const createTestStore = (initialState?: any) => {
  return {
    getState: () => initialState || {},
    setState: (newState: any) => {
      Object.assign(initialState, newState);
    },
    subscribe: () => () => {},
    destroy: () => {}
  };
};
