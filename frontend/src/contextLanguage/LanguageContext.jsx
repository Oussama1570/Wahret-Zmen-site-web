import React, { createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Create Language Context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  // Function to change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";

  };

  // Apply saved language on app load
  useEffect(() => {
    changeLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
