import React, { useState } from "react";
import ProductCard from "../../src/pages/products/ProductCard.jsx";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi.js";
import SelectorsPageProducts from "../components/SelectorProductsPage.jsx";
import SearchInput from "../components/SearchInput.jsx"; // ✅ Import SearchInput Component
import "../Styles/StylesProducts.css";
import { Helmet } from "react-helmet";
import FadeInSection from "../Animations/FadeInSection"; // ✅ Import Fade-in component

// Loader component for Wahret Zmen
const WahretZmenLoader = () => (
  <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
);

const categories = ["All", "Men", "Women", "Children"];


const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Track Search Term
  const [loadMore, setLoadMore] = useState(8); // Load more products
  const { data: products = [], isLoading, isFetching } = useGetAllProductsQuery();

  // ✅ Filter Products Based on Search & Category
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
  selectedCategory === "All" ||
  ["Men", "Women", "Children"].includes(product.category) &&
  product.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .slice(0, loadMore); // Display only the first `loadMore` products

  const handleLoadMore = () => {
    setLoadMore((prev) => prev + 8); // Increase the number of products displayed
  };

  return (
    <FadeInSection>
      <div className="container mx-auto py-10 px-4 container-Products">
        {/* Set the title for the Product Page */}
        <Helmet>
          <title>Wahret Zmen - Timeless Elegance in Traditional Clothing</title>
        </Helmet>

        {/* 🏷️ Page Title */}
        <FadeInSection>
        <FadeInSection>
  <h2 className="text-4xl font-bold font-serif text-center mb-6 drop-shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C52] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 ease-in-out">
    Wahret Zmen Collection
  </h2>
</FadeInSection>

        </FadeInSection>

        

        {/* 📜 Wahret Zmen Boutique Overview */}
        <FadeInSection delay={0.2}>
          <div className="text-center text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            
            <p className="mt-4 text-lg">
              At <span className="text-[#A67C52] font-semibold">Wahret Zmen</span>, we preserve the essence of  
              Tunisian artistry by blending classic techniques with modern refinement. Whether you seek  
              a luxurious piece for a special occasion or a timeless outfit, our collection is designed  
              to celebrate the beauty of tradition.
            </p>
          </div>
        </FadeInSection>

        {/* 🔎 Filter & Search Section */}
<FadeInSection delay={0.3}>
  <div className="mb-8 flex flex-col items-center space-y-4">
    <h3 className="category-title">Category</h3>
    <SelectorsPageProducts options={categories} onSelect={setSelectedCategory} />
    <SearchInput setSearchTerm={setSearchTerm} />
  </div>
</FadeInSection>


        {/* 🛍️ Products Grid */}
        <FadeInSection delay={0.4}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No products found.</p>
            )}
          </div>
        </FadeInSection>

        {/* 🔄 Load More Button and Loader */}
        <FadeInSection delay={0.5}>
          <div className="flex justify-center mt-8">
            {isFetching ? (
              <WahretZmenLoader />
            ) : (
              <button className="wahret-zmen-btn" onClick={handleLoadMore}>
                Load More
              </button>
            )}
          </div>
        </FadeInSection>
      </div>
    </FadeInSection>
  );
};

export default Products;
