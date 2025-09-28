export const storage = {
  /**
   * Save a session object in localStorage
   * @param {Object} session - { role, name, timestamp }
   */
  setSession: (session) => {
    localStorage.setItem('currentSession', JSON.stringify(session));
  },

  /**
   * Retrieve the current session from localStorage
   * @returns {Object|null} session object or null if not found
   */
  getSession: () => {
    const session = localStorage.getItem('currentSession');
    return session ? JSON.parse(session) : null;
  },

  /**
   * Clear the current session from localStorage
   */
  clearSession: () => {
    localStorage.removeItem('currentSession');
  }
};
