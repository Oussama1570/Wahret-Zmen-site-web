import React, { useState } from "react";
import ProductCard from "../products/ProductCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Import carousel styles
import { useGetAllProductsQuery } from "../../redux/features/products/productsApi";
import Selector from "../../components/Selector.jsx";
import "../../Styles/StylesOurSellers.css"; // Custom styles
import FadeInSection from "../../Animations/FadeInSection.jsx"; // Import fade-in animation component

const categories = ["All", "Kaftan", "Jebba", "Gandoura", "Safsari", "Chachia"];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 3, slidesToSlide: 1 },
  desktop: { breakpoint: { max: 1400, min: 1024 }, items: 3, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
};

const OurSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: products = [] } = useGetAllProductsQuery();

  // Filter products based on the selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <FadeInSection>
      <div className="py-10 bg-[#f8f1e5]"> {/* Traditional beige background */}
        {/* Title */}
        <h2 className="text-4xl text-[#5a382d] font-bold mb-6 text-center uppercase tracking-wide">
           Wahret Zmen Collection 
        </h2>

        {/* Category Filter */}
<div className="mb-8 flex flex-col items-center">
  <h3 className="select-category-title">Select Category</h3>
  <Selector options={categories} onSelect={setSelectedCategory} />
</div>


        {/* Carousel */}
        <div className="max-w-6xl mx-auto">
          {filteredProducts.length > 0 ? (
            <Carousel
              responsive={responsive}
              autoPlay={true} 
              autoPlaySpeed={3000} 
              infinite={true} 
              arrows={true} 
              swipeable={true} 
              draggable={true} 
              showDots={false} 
              className="custom-carousel"
              keyBoardControl={true}
            >
              {filteredProducts.map((product, index) => (
                <div key={index} className="p-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </Carousel>
          ) : (
            <p className="text-center text-[#5a382d] text-lg">No products found.</p>
          )}
        </div>
      </div>
    </FadeInSection>
  );
};

export default OurSellers;
