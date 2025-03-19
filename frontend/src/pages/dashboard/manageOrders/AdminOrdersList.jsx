import React, { useState } from "react";
import { useGetAllOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation, useSendOrderNotificationMutation } from "../../../redux/features/orders/ordersApi.js";
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";

const AdminOrdersList = () => {
  const { data: orders, isLoading, error, refetch } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [sendOrderNotification] = useSendOrderNotificationMutation();
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [tailorAssignments, setTailorAssignments] = useState({});


  

  // ✅ Handle Edit Order
  const handleEdit = async (orderId, order) => {
    try {
      // Get existing tailor assignments from the backend
      const existingTailorAssignments = order.tailorAssignments || {};
  
      // Merge existing assignments with the ones being edited
      const orderTailorAssignments = { ...existingTailorAssignments, ...tailorAssignments };
  
      // Remove tailor names that were cleared
      Object.keys(orderTailorAssignments).forEach((key) => {
        if (tailorAssignments[key] === "") {
          delete orderTailorAssignments[key];
        }
      });
  
      await updateOrder({
        orderId,
        isPaid: updatedValues.isPaid !== undefined ? updatedValues.isPaid : order.isPaid, // Preserve existing if not changed
        isDelivered: updatedValues.isDelivered !== undefined ? updatedValues.isDelivered : order.isDelivered,
        completionPercentage:
          updatedValues.completionPercentage !== undefined
            ? updatedValues.completionPercentage
            : order.completionPercentage,
        tailorAssignments: orderTailorAssignments, // ✅ Send merged tailor assignments
      }).unwrap();
  
      Swal.fire("Success", "Order updated successfully!", "success");
  
      setEditingOrder(null); // ✅ Disable editing mode after saving
      setUpdatedValues({});
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to update order. Please try again.", "error");
    }
  };
  


  // ✅ Handle Change in Editable Fields
  const handleChange = (field, value) => {
    setUpdatedValues((prev) => ({
      ...prev,
      [field]: field === "completionPercentage" ? (value ? parseInt(value) : 0) : value,
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


const handleTailorChange = (orderId, productId, colorName, tailorName) => {
  const key = `${orderId}|${productId}|${colorName}`; // Unique key per order-product-color

  setTailorAssignments((prev) => {
    const updatedAssignments = { ...prev };

    if (tailorName === "") {
      delete updatedAssignments[key]; // ✅ Remove only this tailor name
    } else {
      updatedAssignments[key] = tailorName;
    }

    return updatedAssignments;
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
    <tr key={`${order._id}-${index}`} className="border-b border-gray-300 hover:bg-gray-100 transition">
      <td className="px-6 py-3 border border-gray-300">{index + 1}</td>
      <td className="px-6 py-3 border border-gray-300">{order._id.slice(0, 8)}...</td>
      <td className="px-6 py-3 border border-gray-300">
  {order.products.map((prod, idx) => {
    const tailorKey = `${order._id}|${prod.productId?._id}|${prod.color.colorName}`;
    const assignedTailor = tailorAssignments[tailorKey] || order.tailorAssignments?.[tailorKey];

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
            {/* Updated Tailor Input Field with "Tailor" Placeholder */}
            <input
              type="text"
              placeholder="Tailor" // ✅ New placeholder added
              value={assignedTailor || ""}
              onChange={(e) =>
                handleTailorChange(order._id, prod.productId?._id, prod.color.colorName, e.target.value)
              }
              className="mt-2 p-1 border rounded w-full"
              disabled={editingOrder !== order._id} // ✅ Editable only when in Edit Mode
            />
          </div>
        )}
      </div>
    );
  })}
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
  {/* Show "Edit" button when not in editing mode */}
  {editingOrder !== order._id ? (
    <button
      onClick={() => setEditingOrder(order._id)} // ✅ Enable edit mode for this order
      className="font-medium bg-yellow-500 py-2 px-4 rounded-full text-white text-sm hover:bg-yellow-600 transition"
    >
      Edit
    </button>
  ) : (
    <button
  onClick={() => handleEdit(order._id, order)} // ✅ Pass the current order data
  className="bg-blue-500 py-2 px-4 rounded-full text-white text-sm hover:bg-blue-600 transition"
>
  Save
</button>

  )}

  {/* Notify button */}
  <button
    onClick={() => handleSendNotification(order._id, order.email, order.name, order.completionPercentage)}
    className="bg-green-500 py-2 px-4 rounded-full text-white text-sm hover:bg-green-600 transition"
  >
    Notify
  </button>

  {/* Delete button */}
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







