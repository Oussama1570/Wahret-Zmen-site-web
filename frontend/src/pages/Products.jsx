import React, { useState } from "react";
import ProductCard from "../../src/pages/products/ProductCard.jsx";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi.js";
import SelectorsPageProducts from "../components/SelectorProductsPage.jsx";
import SearchInput from "../components/SearchInput.jsx"; // ✅ Import SearchInput Component
import "../Styles/StylesProducts.css";
import { Helmet } from "react-helmet";

// Loader component for Wahret Zmen
const WahretZmenLoader = () => (
  <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
);

const categories = ["All", "Kaftan", "Jebba", "Gandoura", "Safsari", "Chachia"];

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
    <div className="container mx-auto py-10 px-4 container-Products">
      {/* Set the title for the Product Page */}
      <Helmet>
        <title> - Discover our Products | Traditional Clothing</title> {/* Dynamic product title */}
        
      </Helmet>
      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">🛍️ Our Products</h2>

      {/* Filter & Search Section */}
      <div className="mb-8 flex flex-col items-center space-y-4">
        <SelectorsPageProducts options={categories} onSelect={setSelectedCategory} label="Category" />

        {/* ✅ Pass setSearchTerm to SearchInput */}
        <SearchInput setSearchTerm={setSearchTerm} />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </div>

      {/* Load More Button and Loader */}
      <div className="flex justify-center mt-8">
  {isFetching ? (
    <WahretZmenLoader />
  ) : (
    <button className="wahret-zmen-btn" onClick={handleLoadMore}>
      Load More
    </button>
  )}
</div>

    </div>
  );
};

export default Products;
