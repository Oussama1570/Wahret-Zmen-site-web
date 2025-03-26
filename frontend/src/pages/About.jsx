import React from "react";
import "../Styles/StylesAbout.css";
import FadeInSection from "../Animations/FadeInSection.jsx";
import AboutImage1 from "../../src/assets/About/About Img 1.webp";
import AboutImage2 from "../../src/assets/About/About Img 2.webp";
import AboutImage3 from "../../src/assets/About/About Img 3.webp";
import AboutImage4 from "../../src/assets/About/About Img 4.webp";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 py-12 max-w-6xl mx-auto about-section space-y-16">

      <Helmet>
        <title>{t('about.title')} | {t('navbar.brand')}</title>
        <meta
          name="description"
          content={t('home_meta_description')}
        />
      </Helmet>

      {/* Section 1: Main Title */}
      <FadeInSection>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
            {t('about.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            {t('about.description')}
          </p>
        </div>
      </FadeInSection>

      {/* Section 2: Our Mission */}
      <FadeInSection>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
            {t('about.mission_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            {t('about.mission_text1', )}
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.mission_text2')}
          </p>
        </div>
      </FadeInSection>

      {/* Image 1: Boutique Interior */}
      <FadeInSection>
        <div className="text-center">
          <img
            src={AboutImage1}
            alt="Wahret Zmen Boutique Interior"
            loading="lazy"
            className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          />
        </div>
      </FadeInSection>

      {/* Section 3: Crafted With Love */}
      <FadeInSection>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
            {t('about.crafted_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            {t('about.crafted_text1')}
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.crafted_text2')}
          </p>
        </div>
      </FadeInSection>

      {/* Image 2: Garments on Display */}
      <FadeInSection>
        <div className="text-center">
          <img
            src={AboutImage2}
            alt="Handcrafted Traditional Dresses"
            loading="lazy"
            className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          />
        </div>
      </FadeInSection>

      {/* Section 4: Behind the Boutique */}
      <FadeInSection>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
            {t('about.behind_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            {t('about.behind_text')}
          </p>
        </div>
      </FadeInSection>

      {/* Image 3: Artisan Close-Up */}
      <FadeInSection>
        <div className="text-center">
          <img
            src={AboutImage3}
            alt="Artisan Embroidery Close-up – Wahret Zmen"
            loading="lazy"
            className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          />
        </div>
      </FadeInSection>

      {/* Section 5: Join the Tradition */}
      <FadeInSection>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
            {t('about.join_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            {t('about.join_text1')}
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.join_text2')}
          </p>
        </div>
      </FadeInSection>

      {/* Image 4: Client in Garment */}
      <FadeInSection>
        <div className="text-center">
          <img
            src={AboutImage4}
            alt="Client in Traditional Garment – Wahret Zmen"
            loading="lazy"
            className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          />
        </div>
      </FadeInSection>

    </section>
  );
};

export default About;
