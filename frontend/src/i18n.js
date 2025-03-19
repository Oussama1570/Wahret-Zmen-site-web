import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: {
          home: "Home",
          products: "Products",
          about: "About",
          contact: "Contact",
          search_placeholder: "Search traditional wear...",
          dashboard: "Dashboard",
          orders: "Orders",
          logout: "Logout",
        },
      },
      fr: {
        translation: {
          home: "Accueil",
          products: "Produits",
          about: "À propos",
          contact: "Contact",
          search_placeholder: "Rechercher des vêtements traditionnels...",
          dashboard: "Tableau de bord",
          orders: "Commandes",
          logout: "Se déconnecter",
        },
      },
      ar: {
        translation: {
          home: "الرئيسية",
          products: "المنتجات",
          about: "من نحن",
          contact: "اتصل بنا",
          search_placeholder: "ابحث عن الملابس التقليدية...",
          dashboard: "لوحة التحكم",
          orders: "الطلبات",
          logout: "تسجيل خروج",
        },
      },
    },
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
