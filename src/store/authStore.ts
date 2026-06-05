// Store temporal
let _isAuthenticated = false;

export const authStore = {
    isAuthenticated: () => _isAuthenticated,
    login: () => { _isAuthenticated = true; },
    logout: () => { _isAuthenticated = false; },
};