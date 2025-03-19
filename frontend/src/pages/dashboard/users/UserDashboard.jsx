import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";
import { getImgUrl } from "../../../utils/getImgUrl";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../../components/Loading";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading } = useGetOrderByEmailQuery(currentUser?.email);

  if (isLoading) return <LoadingSpinner />;

  const customerName = orders.length > 0 ? orders[0].name : currentUser?.username;

  return (
    <div className="bg-[#F8F1E9] py-12 min-h-screen">
      <Helmet>
        <title>My Dashboard - Wahret Zmen</title>
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-[#A67C52]">
        <h1 className="text-3xl font-bold text-[#A67C52] mb-2 text-center">
          Welcome, {customerName || "User"}!
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          Here is an overview of your recent orders.
        </p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-[#A67C52] mb-4 text-center">
            Your Orders
          </h2>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-gray-100 p-6 rounded-lg shadow-sm border-l-4 border-[#A67C52]">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-700 font-medium">
                      <span className="text-[#A67C52] font-semibold">Order ID:</span> {order._id}
                    </p>
                    <p className="text-gray-600">{new Date(order?.createdAt).toLocaleDateString()}</p>
                  </div>

                  <p className="text-gray-800 font-semibold">
                    Total: <span className="text-[#A67C52]">${order.totalPrice}</span>
                  </p>

                  <h3 className="font-semibold text-lg mt-4 mb-2 text-[#A67C52]">Ordered Products:</h3>
                  <ul className="space-y-4">
                    {order.products.map((product, index) => {
                      if (!product.productId) return null;
                      return (
                        <li key={`${product.productId._id}-${index}`} className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-sm border border-[#A67C52]">
                          <img
                            src={
                              product.color?.image
                                ? getImgUrl(product.color.image)
                                : getImgUrl(product.productId.coverImage)
                            }
                            alt={product.productId.title || "Product"}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-[#A67C52]"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{product.productId.title || "No Title"}</p>
                            <p className="text-gray-600">Quantity: {product.quantity}</p>
                            <p className="text-gray-600 capitalize">
                              Color: {product.color?.colorName || "Original Product"}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">You have no recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
