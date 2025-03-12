import React from "react";
import AdminOrdersList from "../manageOrders/AdminOrdersList.jsx"; // Import the Admin Orders List component

const ManageOrders = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Manage Orders</h2>
      <AdminOrdersList />
    </div>
  );
};

export default ManageOrders;
