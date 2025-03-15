import React from 'react';
import '../../Styles/StylesBanner.css';
import bannerImg from "../../assets/banner.png";
import { Link } from 'react-router-dom';
import FadeInSection from '../../Animations/FadeInSection.jsx'; // Import fade-in component

const Banner = () => {
  return (
    <FadeInSection>
      <div className='banner-container'>

        {/* Banner Image */}
        <div className='banner-image'>
          <img src={bannerImg} alt="Traditional Tunisian Clothing" />
        </div>

        {/* Banner Text */}
        <div className='banner-text'>
          <h1>Wahret Zmen by Sabri – Preserving Tunisian Heritage with Elegance</h1>
          <p>Wahret Zmen is a unique boutique of traditional Tunisian clothing located in El Aswak, Tunis, Essouf Street.
             The boutique offers a carefully selected selection of authentic Tunisian clothing, including the iconic Jebba,
             famous for its intricate craftsmanship and cultural significance.
          </p>
          <Link to='/products'><button className="banner-btn">Discover Now</button></Link>
        </div>

      </div>
    </FadeInSection>
  );
};

export default Banner;
