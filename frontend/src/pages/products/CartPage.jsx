import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../redux/features/cart/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleQuantityChange = (product, quantity) => {
    if (quantity > 0) {
      dispatch(
        updateQuantity({
          _id: product._id,
          color: product.color,
          quantity,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E9] flex items-center justify-center py-12">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8 border border-[#A67C52]">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-3xl font-bold text-[#A67C52]">Shopping Cart</h2>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="mt-6">
          {cartItems.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((product, index) => (
                <li
                  key={`${product._id}-${product.color?.colorName}`}
                  className="flex items-center py-6 bg-gray-50 p-4 rounded-lg shadow-sm mb-4 border border-[#A67C52]"
                >
                  {/* Product Image */}
                  <div className="h-24 w-24 overflow-hidden rounded-lg border-2 border-[#A67C52] shadow-md">
                    <img
                      src={getImgUrl(product.color?.image || product.coverImage)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <Link to="/" className="hover:text-[#A67C52]">
                          {product.title}
                        </Link>
                      </h3>
                      <p className="text-lg font-semibold text-[#A67C52]">
                        ${(product.newPrice * product.quantity).toFixed(2)}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      Category: {product.category}
                    </p>

                    <p className="text-sm text-gray-600 capitalize mt-1">
                      Color: {product.color?.colorName || "Original"}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center">
                        <label className="mr-2 text-gray-700">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              product,
                              Number(e.target.value)
                            )
                          }
                          className="border border-[#A67C52] rounded-lg px-3 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 text-lg mt-4">
              Your cart is empty!
            </p>
          )}
        </div>

        {/* Cart Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#A67C52] pt-6 mt-6">
            <div className="flex justify-between text-lg font-semibold">
              <p>Subtotal</p>
              <p className="text-[#A67C52]">${totalPrice}</p>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block text-center bg-[#A67C52] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#8a5d3b] transition-all duration-200"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
