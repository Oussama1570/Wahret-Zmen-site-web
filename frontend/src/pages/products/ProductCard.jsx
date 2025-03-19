import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 transition-transform duration-300 hover:scale-105 flex flex-col justify-between text-center w-72">
      {/* Product Image */}
      <div className="relative w-full h-52 border rounded-md overflow-hidden group">
        <Link to={`/products/${product._id}`}>
          <img
            src={getImgUrl(product?.coverImage)}
            alt={product?.title}
            className="w-full h-full object-cover p-2 cursor-pointer transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* Stock Badge */}
        <div
          className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full ${
            product.stockQuantity > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {product.stockQuantity > 0 ? `Stock: ${product.stockQuantity}` : "Out of Stock"}
        </div>

        {/* Trending Badge */}
        {product.trending && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Trending
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-3 px-2">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600">{product?.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mt-2">
          {product?.description.length > 60 ? `${product.description.slice(0, 60)}...` : product?.description}
        </p>

        {/* Price Section */}
        <p className="font-medium mt-3 text-lg">
          <span className="text-green-600 font-bold">${product?.newPrice}</span>
          {product?.oldPrice && (
            <span className="text-gray-500 line-through ml-2 text-sm">
              ${Math.round(product?.oldPrice)}
            </span>
          )}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center mt-3 text-sm">
          <label className="mr-2">Qty:</label>
          <input
            type="number"
            min="1"
            max={product.stockQuantity}
            value={quantity}
            onChange={handleQuantityChange}
            className="border rounded px-2 w-14 text-center"
            disabled={product.stockQuantity === 0}
          />
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          className={`mt-4 px-6 py-2 rounded-md text-white text-sm font-medium transition-all duration-300 ${
            product.stockQuantity > 0
              ? "bg-[#8B5C3E] hover:bg-[#74452D] shadow-md"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <FiShoppingCart className="inline mr-2" />
          {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
