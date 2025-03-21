import React, { useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useSendOrderNotificationMutation,
} from "../../../redux/features/orders/ordersApi.js";
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";

const AdminManageOrders = () => {
  const { data: orders, isLoading, error, refetch } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [sendOrderNotification] = useSendOrderNotificationMutation();
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [tailorAssignments, setTailorAssignments] = useState({});

  const handleEdit = async (orderId, order) => {
    try {
      const existingTailorAssignments = order.tailorAssignments || {};
      const orderTailorAssignments = {
        ...existingTailorAssignments,
        ...tailorAssignments,
      };

      Object.keys(orderTailorAssignments).forEach((key) => {
        if (tailorAssignments[key] === "") {
          delete orderTailorAssignments[key];
        }
      });

      await updateOrder({
        orderId,
        isPaid:
          updatedValues.isPaid !== undefined
            ? updatedValues.isPaid
            : order.isPaid,
        isDelivered:
          updatedValues.isDelivered !== undefined
            ? updatedValues.isDelivered
            : order.isDelivered,
        tailorAssignments: orderTailorAssignments,
      }).unwrap();

      Swal.fire("Success", "Order updated successfully!", "success");
      setEditingOrder(null);
      setUpdatedValues({});
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to update order. Please try again.", "error");
    }
  };

  const handleChange = (field, value) => {
    setUpdatedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const startEditingOrder = (order) => {
    setEditingOrder(order._id);
    setUpdatedValues({
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
    });
  };

  const handleTailorChange = (orderId, productId, colorName, tailorName) => {
    const key = `${orderId}|${productId}|${colorName}`;
    setTailorAssignments((prev) => {
      const updatedAssignments = { ...prev };
      if (tailorName === "") {
        delete updatedAssignments[key];
      } else {
        updatedAssignments[key] = tailorName;
      }
      return updatedAssignments;
    });
  };

  const handleDelete = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder({ orderId }).unwrap();
          Swal.fire("Deleted!", "The order has been deleted.", "success");
          refetch();
        } catch (error) {
          Swal.fire("Error", "Failed to delete order. Please try again.", "error");
        }
      }
    });
  };

  const handleSendNotification = async (orderId, email, name) => {
    try {
      await sendOrderNotification({ orderId, email }).unwrap();
      Swal.fire(
        "Notification Sent",
        `We've informed ${name} about the update on their order.`,
        "success"
      );
    } catch (error) {
      Swal.fire(
        "Error",
        `Failed to send notification to ${name}. Please try again.`,
        "error"
      );
    }
  };

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">All Products</h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse ">
              <thead>
                <tr className="border-b border-gray-300 text-left text-md font-semibold text-gray-800">
                  <th className="px-6 py-3 border">#</th>
                  <th className="px-6 py-3 border">Order ID</th>
                  <th className="px-6 py-3 border">Products</th>
                  <th className="px-6 py-3 border">Customer</th>
                  <th className="px-6 py-3 border">Mail</th>
                  <th className="px-6 py-3 border">Phone</th>
                  <th className="px-6 py-3 border">Address</th>
                  <th className="px-6 py-3 border">Total Price</th>
                  <th className="px-6 py-3 border">Paid</th>
                  <th className="px-6 py-3 border">Delivered</th>
                  <th className="px-6 py-3 border">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm font-medium text-gray-600">
                {orders.map((order, index) => (
                  <tr key={`${order._id}-${index}`} className="border-b hover:bg-gray-100 transition">
                    <td className="px-6 py-3 border">{index + 1}</td>
                    <td className="px-6 py-3 border">{order._id.slice(0, 8)}...</td>
                    <td className="px-6 py-3 border">
                      {order.products.map((prod, idx) => {
                        const tailorKey = `${order._id}|${prod.productId?._id}|${prod.color.colorName}`;
                        const assignedTailor =
                          tailorAssignments[tailorKey] ||
                          order.tailorAssignments?.[tailorKey];

                        return (
                          <div key={`${prod.productId?._id || prod.productId}-${idx}`} className="mb-2">
                            <strong>ID:</strong> {prod.productId?._id?.slice(0, 8) || "N/A"} <br />
                            <strong>Qty:</strong> {prod.quantity} <br />
                            {prod.color && (
                              <div>
                                <strong>Color:</strong> {prod.color.colorName || "Original"} <br />
                                {prod.color.image && (
                                  <img
                                    src={getImgUrl(prod.color.image)}
                                    alt={prod.color.colorName}
                                    className="w-16 h-16 rounded border mt-1"
                                  />
                                )}
                                <input
                                  type="text"
                                  placeholder="Tailor"
                                  value={assignedTailor || ""}
                                  onChange={(e) =>
                                    handleTailorChange(order._id, prod.productId?._id, prod.color.colorName, e.target.value)
                                  }
                                  className="mt-2 p-1 border rounded w-full"
                                  disabled={editingOrder !== order._id}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-6 py-3 border">{order.name}</td>
                    <td className="px-6 py-3 border">{order.email}</td>
                    <td className="px-6 py-3 border">{order.phone}</td>
                    <td className="px-6 py-3 border">
                      {order.address.city}, {order.address.street}
                    </td>
                    <td className="px-6 py-3 border">{order.totalPrice} USD</td>
                    <td className="px-6 py-3 border">
                      <select
                        value={editingOrder === order._id ? updatedValues.isPaid ?? order.isPaid : order.isPaid}
                        onChange={(e) => handleChange("isPaid", e.target.value === "true")}
                        disabled={editingOrder !== order._id}
                        className="px-2 py-1 rounded-md border"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="px-6 py-3 border">
                      <select
                        value={editingOrder === order._id ? updatedValues.isDelivered ?? order.isDelivered : order.isDelivered}
                        onChange={(e) => handleChange("isDelivered", e.target.value === "true")}
                        disabled={editingOrder !== order._id}
                        className="px-2 py-1 rounded-md border"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="px-6 py-3 border flex flex-col space-y-2">
                      {editingOrder !== order._id ? (
                        <button
                          onClick={() => startEditingOrder(order)}
                          className="bg-yellow-500 py-2 px-4 rounded-full text-white text-sm hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(order._id, order)}
                          className="bg-blue-500 py-2 px-4 rounded-full text-white text-sm hover:bg-blue-600 transition"
                        >
                          Save
                        </button>
                      )}

                      <button
                        onClick={() => handleSendNotification(order._id, order.email, order.name)}
                        className="bg-green-500 py-2 px-4 rounded-full text-white text-sm hover:bg-green-600 transition"
                      >
                        Notify
                      </button>

                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 py-1 px-4 rounded-full text-white text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminManageOrders;
