import React from 'react';
import Slider from 'react-slick';

// Import Slick styles
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import news1 from "../../assets/news/news n°1 Wahret Zmen.webp";
import news2 from "../../assets/news/news n°2 Wahret Zmen.webp";
import news3 from "../../assets/news/news n°3 Wahret Zmen.webp";
import { Link } from 'react-router-dom';
import FadeInSection from '../../Animations/FadeInSection.jsx'; // Import fade-in animation component

const news = [
    {
        "id": 1,
        "title": "Wahret Zmen by Sabri: A Boutique of Traditional Tunisian Elegance",
        "description": "Wahret Zmen by Sabri is a boutique specializing in traditional Tunisian clothing, notably handcrafted garments with intricate silk thread embroidery.",
        "image": news1
    },
    {
        "id": 2,
        "title": "Discover the Essence of Tunisian Tradition",
        "description": "For lovers of authentic Tunisian fashion, Wahret Zmen by Sabri is a destination where tradition meets artistry!",
        "image": news2
    },
    {
        "id": 3,
        "title": "New Space Mission Aims to Explore Distant Galaxies",
        "description": "For lovers of authentic Tunisian fashion, Wahret Zmen by Sabri is a destination where tradition meets artistry!",
        "image": news3
    }
];

const News = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,  // Show 2 slides at a time
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
                <h2 className="text-2xl font-semibold mb-6 text-center">Latest News</h2>

                <div className="px-4">
                    <Slider {...settings}>
                        {news.map((item, index) => (
                            <div key={index} className="p-3">
                                <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                                    
                                    {/* Small Image */}
                                    <div className="flex-shrink-0">
                                        <img src={item.image} alt="" className="w-[80px] sm:w-[100px] h-auto object-cover rounded-md" />
                                    </div>

                                    {/* News Content */}
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
