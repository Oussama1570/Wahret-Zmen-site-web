import React from "react";
import {
  useGetOrderByEmailQuery,
  useDeleteOrderMutation,
} from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { getImgUrl } from "../../utils/getImgUrl";
import { Helmet } from "react-helmet";

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, refetch } = useGetOrderByEmailQuery(
    currentUser?.email
  );
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder({ orderId }).unwrap();
        refetch(); // ✅ Refresh orders after successful deletion
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading orders...</p>
      </div>
    );

  return (
    <div className="bg-gray-50 py-12 min-h-screen">

      {/* Set the title for the Home Page */}
      <Helmet>
             <title> My Orders
              </title> 
          </Helmet>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found!</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-gray-100 p-6 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-700 font-medium">
                    <span className="text-gray-900 font-semibold">Order #:</span>{" "}
                    {index + 1}
                  </p>
                  <p className="text-gray-600">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <h2 className="font-semibold text-gray-900">
                  Order ID: {order._id}
                </h2>
                <p className="text-gray-700">Name: {order.name}</p>
                <p className="text-gray-700">Email: {order.email}</p>
                <p className="text-gray-700">Phone: {order.phone}</p>
                <p className="text-lg font-semibold text-gray-800">
                  Total Price:{" "}
                  <span className="text-green-600">${order.totalPrice}</span>
                </p>

                <h3 className="font-semibold text-lg mt-4 mb-2">Address:</h3>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </p>

                <h3 className="font-semibold text-lg mt-4 mb-2">
                  Ordered Products:
                </h3>
                <ul className="space-y-4">
                  {order.products.map((product) => {
                    if (!product.productId) return null;

                    return (
                      <li
                        key={product.productId._id}
                        className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-sm"
                      >
                        <img
                          src={
                            product.productId.coverImage
                              ? getImgUrl(product.productId.coverImage)
                              : "/default-image.jpg"
                          }
                          alt="Product"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.productId.title || "No Title"}
                          </p>
                          <p className="text-gray-600">
                            Quantity: {product.quantity}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <button
                  onClick={() => handleDelete(order._id)}
                  className={`mt-4 px-5 py-2 ${
                    isDeleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                  } text-white rounded-lg transition-all duration-200`}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Order"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
