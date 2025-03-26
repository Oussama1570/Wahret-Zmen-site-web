import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Banner from "./Banner";
import OurSellers from "./OurSellers";
import News from "./News";
import { Helmet } from "react-helmet"; // Importing Helmet
import FadeInSection from "../../Animations/FadeInSection.jsx"; // ✅ Import Fade-in component
import "../../Styles/StylesHome.css"; // ✅ Import CSS Styles


const Home = () => {
  const { t } = useTranslation();

  
  return (
    <div className="home-container">
      {/* Set the title for the Home Page */}
      <Helmet>
        <title>{t("home_title")}</title>
        <meta
          name="description"
          content={t("home_meta_description")}
        />
      </Helmet>
  
      {/* 🏡 Welcome Message */}
      <FadeInSection>
        <section className="text-center py-8 px-4">
          <h1 className="text-3xl font-bold" style={{ color: "#A67C52" }}>
            {t("home")}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">
            <Trans i18nKey="home_intro_html">
              Welcome to <strong>Wahret Zmen Boutique</strong>, where tradition meets elegance.
              Explore our handcrafted garments, inspired by Tunisia’s rich cultural heritage.
              Experience timeless fashion that blends history with modern refinement.
            </Trans>
          </p>
        </section>
      </FadeInSection>
  
      {/* ✨ Banner Section */}
      <FadeInSection delay={0.2}>
        <section className="mb-12">
          <Banner />
          <div className="text-center mt-6 px-4">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t("home_banner_text")}
            </p>
          </div>
        </section>
      </FadeInSection>
  
      {/* 🛍️ Our Sellers Section */}
      <FadeInSection delay={0.3}>
        <section className="py-10 bg-gray-100 rounded-2xl shadow-md mx-4">
          <div className="text-center px-4">
            <h2 className="text-2xl font-semibold" style={{ color: "#8A5D3B" }}>
              {t("our_sellers")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">
              <Trans i18nKey="our_sellers_intro_html">
                Explore our collection of traditional garments, each crafted with care and cultural authenticity.
                From elegant <strong>Kaftans</strong> to classic <strong>Jebbas</strong>, discover the beauty of heritage in every piece.
              </Trans>
            </p>
          </div>
          <OurSellers />
        </section>
      </FadeInSection>
  
      {/* 🆕 Latest News & Trends Section */}
      <FadeInSection delay={0.4}>
        <section className="py-10 bg-white rounded-2xl shadow-md mx-4">
          <div className="text-center px-4">
            <h2 className="text-2xl font-semibold" style={{ color: "#5C3D2E" }}>
              {t("latest_news")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">
              {t("latest_news_intro")}
            </p>
          </div>
          <News />
        </section>
      </FadeInSection>
    </div>
  );
  
  
  
};

export default Home;
