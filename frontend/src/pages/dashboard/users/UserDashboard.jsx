import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";
import { getImgUrl } from "../../../utils/getImgUrl";
import { Helmet } from "react-helmet";
import Dashboard from './../Dashboard';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading } = useGetOrderByEmailQuery(
    currentUser?.email
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading orders...</p>
      </div>
    );

  // ✅ Extract Customer Name from the First Order (if available)
  const customerName = orders.length > 0 ? orders[0].name : currentUser?.username;

  return (
   
    <div className="bg-gray-50 py-12 min-h-screen">
{/* Set the title for the Home Page */}
<Helmet>
       <title> My Dashboard
        </title> 
    </Helmet>


      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* ✅ Display Customer Name from Order or Default to Username */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {customerName || "User"}!
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Here is an overview of your recent orders.
        </p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Orders
          </h2>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-100 p-6 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-700 font-medium">
                      <span className="text-gray-900 font-semibold">
                        Order ID:
                      </span>{" "}
                      {order._id}
                    </p>
                    <p className="text-gray-600">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-gray-800 font-semibold">
                    Total:{" "}
                    <span className="text-green-600">${order.totalPrice}</span>
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
