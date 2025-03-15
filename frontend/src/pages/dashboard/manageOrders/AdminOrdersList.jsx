import React, { useState } from "react";
import { useGetAllOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation, useSendOrderNotificationMutation } from "../../../redux/features/orders/ordersApi.js";
import Swal from "sweetalert2";

const AdminOrdersList = () => {
  const { data: orders, isLoading, error, refetch } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [sendOrderNotification] = useSendOrderNotificationMutation();

  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});

  // ✅ Handle Edit Order
const handleEdit = async (orderId) => {
  try {
    await updateOrder({
      orderId,
      ...updatedValues,
    }).unwrap();

    Swal.fire("Success", "Order updated successfully!", "success");
    setEditingOrder(null);
    setUpdatedValues({}); // ✅ Reset values after saving
    refetch();
  } catch (error) {
    Swal.fire("Error", "Failed to update order. Please try again.", "error");
  }
};


  // ✅ Handle Change in Editable Fields
const handleChange = (field, value) => {
  setUpdatedValues((prev) => ({
    ...prev,
    [field]: value,
  }));
};

// ✅ Handle Setting Up for Editing
const startEditingOrder = (order) => {
  setEditingOrder(order._id);
  setUpdatedValues({
    isPaid: order.isPaid,
    isDelivered: order.isDelivered,
    completionPercentage: order.completionPercentage, // ✅ Ensure correct value
  });
};


  // ✅ Handle Delete Order
  const handleDelete = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
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

  // ✅ Handle Send Notification
  const handleSendNotification = async (orderId, email, name, completionPercentage) => {
    try {
      await sendOrderNotification({ orderId, email, completionPercentage }).unwrap();

      const message =
        completionPercentage < 100
          ? `We've sent an update to ${name}: Your order is currently ${completionPercentage}% completed. We are working hard to prepare it for you!`
          : `Great news! We've informed ${name} that their order is now fully completed and ready for pickup/delivery!`;

      Swal.fire("Notification Sent", message, "success");
    } catch (error) {
      Swal.fire("Error", `Failed to send notification to ${name}. Please try again.`, "error");
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
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">#</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Order ID</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Products</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Customer</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Mail</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Phone</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Address</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Total Price</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Paid</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Delivered</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Total Completion %</th>
    <th className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium uppercase">Actions</th>
  </tr>
</thead>

<tbody className="text-sm font-medium text-gray-600">
  {orders.map((order, index) => (
    <tr key={order._id} className="border-b border-gray-300 hover:bg-gray-100 transition">
      <td className="px-6 py-3 border border-gray-300">{index + 1}</td>
      <td className="px-6 py-3 border border-gray-300">{order._id.slice(0, 8)}...</td>
      <td className="px-6 py-3 border border-gray-300">
        {Array.isArray(order.products) && order.products.length > 0 ? (
          order.products.map((prod) => (
            <div key={prod.productId?._id || prod.productId}>
              <strong>ID:</strong> {(prod.productId?._id || prod.productId || "").toString().slice(0, 8)}...
              <strong> Qty:</strong> {prod.quantity ?? 0}
            </div>
          ))
        ) : (
          "No Products"
        )}
      </td>
      <td className="px-6 py-3 border border-gray-300">{order.name}</td>
      <td className="px-6 py-3 border border-gray-300">{order.email}</td>
      <td className="px-6 py-3 border border-gray-300">{order.phone}</td>
      <td className="px-6 py-3 border border-gray-300">
        {order.address.city}, {order.address.street}
      </td>
      <td className="px-6 py-3 border border-gray-300">{order.totalPrice} USD</td>
      <td className="px-6 py-3 border border-gray-300">
        <select
          value={editingOrder === order._id ? updatedValues.isPaid ?? order.isPaid : order.isPaid}
          onChange={(e) => handleChange("isPaid", e.target.value === "true")}
          disabled={editingOrder !== order._id}
          className="px-2 py-1 rounded-md border border-gray-400"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td className="px-6 py-3 border border-gray-300">
        <select
          value={editingOrder === order._id ? updatedValues.isDelivered ?? order.isDelivered : order.isDelivered}
          onChange={(e) => handleChange("isDelivered", e.target.value === "true")}
          disabled={editingOrder !== order._id}
          className="px-2 py-1 rounded-md border border-gray-400"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td className="px-6 py-3 border border-gray-300 text-center">
  <input
    type="number" 
    value={editingOrder === order._id ? updatedValues.completionPercentage ?? order.completionPercentage : order.completionPercentage}
    onChange={(e) => handleChange("completionPercentage", parseInt(e.target.value))}
    disabled={editingOrder !== order._id}
    className="w-16 border px-2 py-1 text-center"
  />
</td>

      <td className="px-6 py-3 border border-gray-300 flex flex-col space-y-2">
        <button
          onClick={() => startEditingOrder(order)}
          className="font-medium bg-yellow-500 py-2 px-4 rounded-full text-white text-sm hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => handleEdit(order._id)}
          className="bg-blue-500 py-2 px-4 rounded-full text-white text-sm hover:bg-blue-600 transition"
        >
          Save
        </button>
        <button
          onClick={() => handleSendNotification(order._id, order.email, order.name, order.completionPercentage)}
          className="bg-green-500 py-2 px-4 rounded-full text-white text-sm hover:bg-green-600 transition"
        >
          Send Notification
        </button>
        <button
          onClick={() => handleDelete(order._id)}
          className="font-medium bg-red-500 py-1 px-4 rounded-full text-white mr-2"
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

export default AdminOrdersList;
