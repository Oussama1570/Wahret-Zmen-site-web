import React from 'react';
import '../../Styles/StylesBanner.css';
import bannerImg from "../../assets/banner.png";
import { Link } from 'react-router-dom';
import FadeInSection from '../../Animations/FadeInSection.jsx'; // Import fade-in component
import { useTranslation, Trans } from "react-i18next";


const Banner = () => {
  const { t } = useTranslation();

  return (
    <FadeInSection>
      <div className="banner-container rounded-2xl shadow-md overflow-hidden mx-4">

        {/* Banner Image */}
        <div className="banner-image">
          <img src={bannerImg} alt={t("banner_img_alt")} />
        </div>

        {/* Banner Text */}
        <div className="banner-text">
          <h1>{t("banner_title")}</h1>
          <p>
            {t("banner_description")}
          </p>
          <Link to="/products">
            <button className="banner-btn">{t("discover_now")}</button>
          </Link>
        </div>

      </div>
    </FadeInSection>
  );
};


export default Banner;
