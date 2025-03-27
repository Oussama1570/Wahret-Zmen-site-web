import { FaBoxOpen, FaClipboardList, FaChartLine, FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import RevenueChart from './RevenueChart';
import ManageOrders from './manageOrders/manageOrder';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const usersResponse = await axios.get(`${getBaseUrl()}/api/user/admin/users/count`);

        setData({
          ...statsResponse.data,
          totalUsers: usersResponse.data.totalUsers,
        });

        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loading />
      </div>
    );
  }

  return (
    <div dir="ltr" className="p-4 lg:p-8 overflow-x-auto dashboard-container">
      {/* Dashboard Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: <FaUser className="h-6 w-6" />,
            value: data?.totalUsers,
            label: "Utilisateurs MongoDB",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            borderColor: "border-purple-300"
          },
          {
            icon: <FaBoxOpen className="h-6 w-6" />,
            value: data?.totalProducts,
            label: "Total des Produits",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            borderColor: "border-blue-300"
          },
          {
            icon: <FaChartLine className="h-6 w-6" />,
            value: `${data?.totalSales} USD`,
            label: "Total des Ventes",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            borderColor: "border-green-300"
          },
          {
            icon: <FaClipboardList className="h-6 w-6" />,
            value: data?.totalOrders,
            label: "Total des Commandes",
            bgColor: "bg-teal-50",
            textColor: "text-teal-600",
            borderColor: "border-teal-300"
          },
        ].map((stat, index) => (
          <div key={index} className={`flex items-center p-4 shadow-sm rounded-lg border ${stat.borderColor} ${stat.bgColor}`}>
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mr-4 ${stat.textColor}`}>
              {stat.icon}
            </div>
            <div>
              <span className="block text-lg font-semibold">{stat.value}</span>
              <span className="block text-sm text-gray-500">{stat.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Revenue Chart */}
      <section className="bg-white shadow-md rounded-lg border border-gray-300 p-6 mb-6">
        <div className="font-semibold mb-4 text-lg">Le nombre de commandes par mois</div>
        <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-200 border-dashed rounded-md p-4">
          <RevenueChart />
        </div>
      </section>

      {/* Manage Orders */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <ManageOrders />
      </section>
    </div>
  );
};

export default Dashboard;
