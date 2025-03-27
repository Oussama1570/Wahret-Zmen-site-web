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
  const [editingProductKey, setEditingProductKey] = useState(null);

  const progressSteps = [20, 40, 60, 80, 100];

  // Load existing progress on mount
  useEffect(() => {
    if (orders) {
      const initial = {};
      orders.forEach(order => {
        const progressMap = order.productProgress || {};
        order.products.forEach(prod => {
          const productKey = `${prod.productId._id}|${prod.color.colorName}`;
          initial[`${order._id}|${productKey}`] = progressMap[productKey] ?? 0;
        });
      });
      setProgressChanges(initial);
    }
  }, [orders]);

  const handleCheckboxChange = (key, value) => {
    if (editingProductKey === key) {
      setProgressChanges(prev => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSave = async (orderId, productKey) => {
    const fullKey = `${orderId}|${productKey}`;
    const updatedValue = progressChanges[fullKey];

    const order = orders.find(o => o._id === orderId);
    if (!order) {
      Swal.fire({
        title: 'Erreur',
        text: 'Commande non trouvée!',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
      return;
    }

    const email = order.email;
    const updatedProgress = { ...order.productProgress, [productKey]: updatedValue };

    try {
      // Update order progress
      await updateOrder({ orderId, productProgress: updatedProgress }).unwrap();
      Swal.fire({
        title: 'Succès!',
        text: 'Le progrès de la commande a été enregistré avec succès.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-success',
        },
      });

      // Send automatic notification if necessary
      if ([60, 100].includes(updatedValue) && productKey && email) {
        await sendNotification({ orderId, email, productKey, progress: updatedValue }).unwrap();
        Swal.fire({
          title: 'Notification envoyée',
          text: `Une notification a été envoyée à ${order.name} pour ${updatedValue}% de progression.`,
          icon: 'info',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-info',
          },
        });
      }

      setEditingProductKey(null);
      refetch(); // Refresh the UI with the latest data
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement/notification:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Échec de l\'enregistrement du progrès de la commande.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
    }
  };

  const handleEdit = (productKey) => {
    setEditingProductKey(productKey);
  };

  if (isLoading) return <p>Chargement des commandes...</p>;

  return (
    <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Gérer l'Avancement des Commandes</h2>
        <div className="max-h-[70vh] overflow-y-auto">
        {orders.map(order => (
            <div key={order._id} className="border p-4 rounded mb-6">
                <h3 className="text-lg font-semibold mb-2 text-center">
                    Commande #{order._id.slice(0, 8)} - {order.name}
                </h3>
                {order.products.map((prod) => {
                    const key = `${order._id}|${prod.productId._id}|${prod.color.colorName}`;
                    const productKey = `${prod.productId._id}|${prod.color.colorName}`;
                    const currentValue = progressChanges[key] ?? 0;

                    return (
                        <div key={key} className="mb-4 border-t pt-4 text-center">
                            <p>
                                <strong>{prod.productId.title}</strong> — Couleur: {prod.color.colorName} <br />
                                <span className="text-gray-500 text-sm">ID du Produit: {prod.productId._id}</span>
                            </p>

                            <div className="flex flex-wrap gap-4 items-center mt-2 justify-center">
                                {progressSteps.map((val, index) => (
                                    <label key={val} className="mr-4 flex flex-col items-center text-sm">
                                        <span className="text-gray-500 text-xs mb-1">Étape {index + 1}</span>
                                        <input
                                            type="radio"
                                            name={key}
                                            value={val}
                                            checked={progressChanges[key] === val}
                                            onChange={() => handleCheckboxChange(key, val)}
                                            disabled={editingProductKey !== key}
                                        />
                                        <span className="mt-1">{val}%</span>
                                    </label>
                                ))}

                                {editingProductKey === key ? (
                                    <button
                                        onClick={() => handleSave(order._id, productKey)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Enregistrer
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(key)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Modifier
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        ))}
        </div>
    </div>
);

};

export default AdminOrdersProgress;