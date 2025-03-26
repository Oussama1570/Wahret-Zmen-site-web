import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useGetAllOrdersQuery } from '../../redux/features/orders/ordersApi'; // Assuming this is your API hook

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const { data: orders, error, isLoading } = useGetAllOrdersQuery(); // Fetch orders data
  const [revenueData, setRevenueData] = useState([]);

  // Helper function to extract the month from a date
  const getMonth = (date) => {
    const newDate = new Date(date);
    return newDate.getMonth(); // Returns a number from 0 (Jan) to 11 (Dec)
  };

  // Calculate revenue per month
  const calculateRevenue = () => {
    const monthlyRevenue = Array(12).fill(0); // Initialize an array with 12 zeros (for 12 months)

    if (orders) {
      orders.forEach((order) => {
        const month = getMonth(order.createdAt);
        monthlyRevenue[month] += order.totalPrice; // Add the order's total price to the correct month
      });
    }

    setRevenueData(monthlyRevenue); // Update the revenueData state with calculated monthly revenue
  };

  useEffect(() => {
    if (orders) {
      calculateRevenue(); // Recalculate revenue when orders data is available
    }
  }, [orders]);

  // Handle loading and error states
  if (isLoading) return <p>Loading revenue data...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (USD)',
        data: revenueData, // Dynamic revenue data
        backgroundColor: 'rgba(34, 197, 94, 0.7)', 
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue (USD)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Monthly Revenue (USD)</h2>
      <div className='hidden md:block'>
        <Bar data={data} options={options} className='' />
      </div>
    </div>
  );
};

export default RevenueChart;
