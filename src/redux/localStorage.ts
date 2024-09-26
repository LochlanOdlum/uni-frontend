export const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem('auth');
    if (serializedState === null) {
      return undefined; // No saved state yet
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load auth state", err);
    return undefined;
  }
};

export const saveAuthState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('auth', serializedState);
  } catch (err) {
    console.error("Could not save auth state", err);
  }
};
