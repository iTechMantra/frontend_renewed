// Simple wrapper for localStorage to manage app settings (like language)

export const storage = {
  getLanguage: () => {
    return localStorage.getItem("language") || "en"; // default English
  },

  setLanguage: (lang) => {
    localStorage.setItem("language", lang);
  }
};
