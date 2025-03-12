import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useGetProductByIdQuery } from "../../redux/features/products/productsApi";
import "../../Styles/StylesSingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Error loading product info</div>;

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(value > product.stockQuantity ? product.stockQuantity : value);
  };

  const handleAddToCart = () => {
    if (product.stockQuantity > 0 && quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto shadow-lg p-6 bg-white rounded-lg product-cart">
      {/* ✅ Product Header */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">{product?.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Product Image Section */}
        <div className="relative">
          <img
            src={getImgUrl(product?.coverImage)}
            alt={product?.title}
            className="w-full rounded-lg shadow-md"
          />

          {/* ✅ Stock Badge */}
          <div
            className={`absolute top-2 left-2 px-3 py-1 text-xs font-bold rounded-full ${
              product.stockQuantity > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {product.stockQuantity > 0 ? `Stock: ${product.stockQuantity}` : "Out of Stock"}
          </div>

          {/* ✅ Trending Badge */}
          {product.trending && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Trending
            </div>
          )}
        </div>

        {/* ✅ Product Details Section */}
        <div>
          {/* ✅ Category & Published Date */}
          <p className="text-gray-700 mb-2">
            <strong>Category:</strong> {product?.category}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Published:</strong> {new Date(product?.createdAt).toLocaleDateString()}
          </p>

          {/* ✅ Description */}
          <p className="text-gray-700 text-md mb-5">{product?.description}</p>

          {/* ✅ Price Section */}
          <p className="text-2xl font-semibold mb-5">
            <span className="text-green-600">${product?.newPrice}</span>
            {product?.oldPrice && (
              <span className="text-gray-500 line-through ml-3 text-lg">
                ${Math.round(product?.oldPrice)}
              </span>
            )}
          </p>

          {/* ✅ Quantity Selector */}
          <div className="flex items-center mb-5">
            <label className="mr-3 font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stockQuantity}
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded px-3 py-1 w-20 text-center"
              disabled={product.stockQuantity === 0}
            />
          </div>

          {/* ✅ Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`w-full py-3 rounded-lg text-white font-medium text-lg ${
              product.stockQuantity > 0 ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FiShoppingCart className="inline mr-2 text-xl" />
            {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
