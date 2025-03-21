import React, { useState, useEffect } from 'react';
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useSendOrderNotificationMutation,
} from '../../../redux/features/orders/ordersApi';
import Swal from 'sweetalert2';

const AdminOrdersProgress = () => {
  const { data: orders, isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [sendNotification] = useSendOrderNotificationMutation();
  const [progressChanges, setProgressChanges] = useState({});
  const [editingProductKey, setEditingProductKey] = useState(null); // ✅ Track the specific product being edited

  const progressSteps = [20, 40, 60, 80, 100];

  // ✅ Load saved progress from backend on mount
  useEffect(() => {
    if (orders) {
      const initial = {};
      orders.forEach(order => {
        const progressMap = order.productProgress || {};
        order.products.forEach(prod => {
          const key = `${order._id}|${prod.productId._id}|${prod.color.colorName}`;
          const savedProgress = progressMap[`${prod.productId._id}|${prod.color.colorName}`] || 0;
          initial[key] = savedProgress;
        });
      });
      setProgressChanges(initial);
    }
  }, [orders]);

  const handleCheckboxChange = (key, value) => {
    if (editingProductKey === key) { // ✅ Only allow editing the selected product
      setProgressChanges((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async (orderId, productKey) => {
    // Step 1: Collect the updated value
    const updatedValue = progressChanges[`${orderId}|${productKey}`];
  
    // Step 2: Get the full existing productProgress for this order
    const order = orders.find((o) => o._id === orderId);
    const existingProgress = order?.productProgress || {};
  
    // Step 3: Create a merged progress object (keep all previous values and update just one)
    const updatedProgress = {
      ...existingProgress,
      [productKey]: updatedValue,
    };
  
    try {
      await updateOrder({ orderId, productProgress: updatedProgress }).unwrap();
  
      Swal.fire('Saved!', 'Progress has been saved.', 'success');
      setEditingProductKey(null); // Disable edit mode
      refetch(); // Refresh orders
    } catch (error) {
      console.error("Save Error:", error);
      Swal.fire('Error', 'Failed to save progress.', 'error');
    }
  };
  

  const handleEdit = (productKey) => {
    setEditingProductKey(productKey); // ✅ Enable editing only for this product
  };

  const handleNotify = async (order, productKey, progress) => {
    if (progress === 60 || progress === 100) {
      try {
        await sendNotification({
          orderId: order._id,
          email: order.email,
          productKey,
          progress,
        }).unwrap();
        Swal.fire('Notification Sent', `${progress}% email sent to ${order.name}`, 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to send notification.', 'error');
      }
    }
  };

  if (isLoading) return <p>Loading orders...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Orders Progress</h2>
      {orders.map(order => (
        <div key={order._id} className="border p-4 rounded mb-6">
          <h3 className="text-lg font-semibold mb-2">Order #{order._id.slice(0, 8)} - {order.name}</h3>
          {order.products.map((prod) => {
            const key = `${order._id}|${prod.productId._id}|${prod.color.colorName}`;
            const productKey = `${prod.productId._id}|${prod.color.colorName}`;
            const currentValue = progressChanges[key] ?? 0;

            return (
              <div key={key} className="mb-4 border-t pt-4">
                <p><strong>{prod.productId.title}</strong> — Color: {prod.color.colorName}</p>
                <div className="flex flex-wrap gap-4 items-center mt-2">
                  {progressSteps.map((val) => (
                    <label key={val} className="mr-2">
                      <input
                        type="radio"
                        name={key}
                        value={val}
                        checked={progressChanges[key] === val}  // ✅ Ensure saved value is checked
                        onChange={() => handleCheckboxChange(key, val)}
                        disabled={editingProductKey !== key} // ✅ Only the selected product can be edited
                      />
                      <span className="ml-1">{val}%</span>
                    </label>
                  ))}

                  {editingProductKey === key ? (
                    <button
                      onClick={() => handleSave(order._id, productKey)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(key)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleNotify(order, productKey, currentValue)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Notify
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersProgress;
