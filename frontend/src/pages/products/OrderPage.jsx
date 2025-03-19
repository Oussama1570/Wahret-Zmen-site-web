import React from "react";
import {
  useGetOrderByEmailQuery,
  useDeleteOrderMutation,
} from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { getImgUrl } from "../../utils/getImgUrl";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../components/Loading";
import Swal from "sweetalert2";

const OrderPage = () => {
  const { currentUser } = useAuth();

  // ✅ Ensure user is logged in before fetching orders
  const userEmail = currentUser?.email;
  const { data: orders = [], isLoading, refetch } = useGetOrderByEmailQuery(userEmail, {
    skip: !userEmail, // ✅ Skip query if userEmail is undefined
  });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  if (!userEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Please log in to view your orders.
        </p>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  const handleDelete = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. Your order will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder({ orderId }).unwrap();
          Swal.fire("Deleted!", "Your order has been deleted.", "success");
          refetch();
        } catch (error) {
          Swal.fire("Error", "Failed to delete order. Please try again.", "error");
        }
      }
    });
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <Helmet>
        <title>My Orders</title>
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found!</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order._id} className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-700 font-medium">
                    <span className="text-gray-900 font-semibold">Order #:</span> {index + 1}
                  </p>
                  <p className="text-gray-600">{new Date(order?.createdAt).toLocaleDateString()}</p>
                </div>

                <h2 className="font-semibold text-gray-900">Order ID: {order._id}</h2>
                <p className="text-gray-700">Name: {order.name}</p>
                <p className="text-gray-700">Email: {order.email}</p>
                <p className="text-gray-700">Phone: {order.phone}</p>
                <p className="text-lg font-semibold text-gray-800">
                  Total Price: <span className="text-green-600">${order.totalPrice}</span>
                </p>

                <h3 className="font-semibold text-lg mt-4 mb-2">Ordered Products:</h3>
                <ul className="space-y-4">
                  {order.products.map((product, idx) => {
                    if (!product.productId) return null;
                    return (
                      <li key={`${product.productId._id}-${idx}`} className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-sm">
                        <img
                          src={getImgUrl(product.color?.image || product.productId.coverImage)}
                          alt={product.productId.title}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{product.productId.title || "No Title"}</p>
                          <p className="text-gray-600">Quantity: {product.quantity}</p>
                          <p className="text-gray-600 capitalize">Color: {product.color?.colorName || "Original Product"}</p>
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
