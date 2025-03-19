import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext"; // ✅ Fixed typo
import { LanguageProvider } from "./contextLanguage/LanguageContext"; // ✅ Ensure correct path
import { useState, useEffect } from "react";
import Loading from "./components/Loading";
import "../src/i18n.js"; // Import translations

function App() {
  const [loading, setLoading] = useState(true);

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
      <AuthProvider> {/* ✅ Fixed provider name */}
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
