import React from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import news1 from "../../assets/news/news n°1 Wahret Zmen.webp";
import news2 from "../../assets/news/news n°2 Wahret Zmen.webp";
import news3 from "../../assets/news/news n°3 Wahret Zmen.webp";
import FadeInSection from '../../Animations/FadeInSection.jsx';

const News = () => {
  const { t } = useTranslation();

  // Get translated news items safely
  const newsItems = t("news.items", { returnObjects: true }) || [];

  const images = [news1, news2, news3];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <FadeInSection>
      <div className="py-8 mb-0">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {t("news.section_title")}
        </h2>

        <div className="px-4">
          <Slider {...settings}>
            {Array.isArray(newsItems) &&
              newsItems.map((item, index) => (
                <div key={index} className="p-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    
                    <div className="flex-shrink-0">
                      <img
                        src={images[index] || news1}
                        alt={item.title}
                        className="w-[80px] sm:w-[100px] h-auto object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <Link to="/" className="block hover:text-blue-500">
                        <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                      </Link>
                      <div className="w-8 h-[2px] bg-primary mb-2"></div>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>
    </FadeInSection>
  );
};

export default News;
