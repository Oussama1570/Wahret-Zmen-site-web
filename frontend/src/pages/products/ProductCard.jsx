import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getImgUrl } from "../../utils/getImgUrl";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  const lang = i18n.language; // Current selected language

  // Dynamic translated fields:
  const title = product.translations?.[lang]?.title || product.title;
  const description = product.translations?.[lang]?.description || product.description;

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
      <div className="relative w-full h-52 border rounded-md overflow-hidden group">
        <Link to={`/products/${product._id}`}>
          <img
            src={getImgUrl(product?.coverImage)}
            alt={title}
            className="w-full h-full object-cover p-2 cursor-pointer transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full ${product.stockQuantity > 0 ? "bg-green-500" : "bg-red-500"} text-white`}>
          {product.stockQuantity > 0 ? `${t("stock")}: ${product.stockQuantity}` : t("out_of_stock")}
        </div>
        {product.trending && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {t("trending")}
          </div>
        )}
      </div>
      <div className="mt-3 px-2">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600">{title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mt-2">
          {description.length > 60 ? `${description.slice(0, 60)}...` : description}
        </p>
        <p className="font-medium mt-3 text-lg">
          <span className="text-green-600 font-bold">${product?.newPrice}</span>
          {product?.oldPrice && (
            <span className="text-gray-500 line-through ml-2 text-sm">
              ${Math.round(product?.oldPrice)}
            </span>
          )}
        </p>
        <div className="flex items-center justify-center mt-3 text-sm">
          <label className="mr-2">{t("quantity")}:</label>
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
        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          className={`mt-4 px-6 py-2 rounded-md text-white text-sm font-medium ${
            product.stockQuantity > 0 ? "bg-[#8B5C3E] hover:bg-[#74452D]" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <FiShoppingCart className="inline mr-2" />
          {product.stockQuantity > 0 ? t("add_to_cart") : t("out_of_stock")}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
