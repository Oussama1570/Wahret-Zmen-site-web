import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./contextLanguage/LanguageContext";
import { useState, useEffect } from "react";
import Loading from "./components/Loading";
import "../src/i18n.js";
import { useTranslation } from "react-i18next";

function App() {
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // ✅ Set <html lang="" dir=""> dynamically
  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr"; // Set the direction dynamically
  }, [i18n.language]);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <Navbar />
        <main className="min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary">
          <Outlet />
        </main>
        <Footer />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;