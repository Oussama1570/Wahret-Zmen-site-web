import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";
import { getImgUrl } from "../../../utils/getImgUrl";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../../components/Loading";
import { useTranslation } from "react-i18next";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading } = useGetOrderByEmailQuery(currentUser?.email);
  const { t } = useTranslation();

  if (isLoading) return <LoadingSpinner />;

  const customerName =
    orders.length > 0
      ? orders[0].name
      : currentUser?.username || t("userDashboard.defaultUser");

  return (
    <div className="bg-[#F8F1E9] py-12 min-h-screen">
      <Helmet>
        <title>{t("userDashboard.title")}</title>
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-[#A67C52]">
        <h1 className="text-3xl font-bold text-[#A67C52] mb-2 text-center">
          {t("userDashboard.welcome", { name: customerName })}
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          {t("userDashboard.overview")}
        </p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-[#A67C52] mb-4 text-center">
            {t("userDashboard.yourOrders")}
          </h2>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-100 p-6 rounded-lg shadow-sm border-l-4 border-[#A67C52]"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-700 font-medium">
                      <span className="text-[#A67C52] font-semibold">
                        {t("userDashboard.orderId")}:
                      </span>{" "}
                      <span dir="ltr" className="inline-block break-all">
                        {order._id}
                      </span>
                    </p>

                    <p className="text-gray-600">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-gray-800 font-semibold">
                    {t("userDashboard.total")}:{" "}
                    <span className="text-[#A67C52]">${order.totalPrice}</span>
                  </p>

                  <h3 className="font-semibold text-lg mt-4 mb-2 text-[#A67C52]">
                    {t("userDashboard.orderedProducts")}
                  </h3>
                  <ul className="space-y-4">
                    {order.products.map((product, index) => {
                      if (!product.productId) return null;
                      return (
                        <li
                          key={`${product.productId._id}-${index}`}
                          className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-sm border border-[#A67C52]"
                        >
                          <img
                            src={
                              product.color?.image
                                ? getImgUrl(product.color.image)
                                : getImgUrl(product.productId.coverImage)
                            }
                            alt={
                              product.productId.title ||
                              t("userDashboard.noTitle")
                            }
                            className="w-32 h-32 object-cover rounded-lg border-2 border-[#A67C52]"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {product.productId.title ||
                                t("userDashboard.noTitle")}
                            </p>
                            <p className="text-gray-600">
                              {t("userDashboard.quantity")}: {product.quantity}
                            </p>
                            <p className="text-gray-600 capitalize">
                              {t("userDashboard.color")}:{" "}
                              {product.color?.colorName ||
                                t("userDashboard.original")}
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
            <p className="text-gray-500 text-center">
              {t("userDashboard.noOrders")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
