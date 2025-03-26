import { FaBoxOpen, FaClipboardList, FaChartLine, FaUser , FaTools } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
                const response = await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${getBaseUrl()}/api/admin`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            });
      
            setData(response.data); // ✅ Cela contient totalUsers, totalOrders, etc.
            setLoading(false);
          } catch (error) {
            console.error('Erreur:', error);
            setLoading(false);
          }
        };
      
        fetchData(); // ✅ Déclenche la récupération lors du montage du composant
      }, []);
      

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/");
    };

    if (loading) {
        return (
            <div className="loading-screen flex justify-center items-center h-screen bg-gray-100">
                <Loading />
            </div>
        );
    }
    return (
        <div dir="ltr"> {/* ⬅️ Assure un layout de gauche à droite (LTR) quelle que soit la langue */}
          {/* Aperçu des statistiques */}
          <section className="grid xl:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center p-8 bg-purple-50 shadow rounded-lg border border-gray-300">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                <FaUser className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-2xl font-bold">{data?.totalUsers}</span>
                <span className="block text-gray-500">Utilisateurs Totals</span>
              </div>
            </div>
      
            <div className="flex items-center p-8 bg-blue-50 shadow rounded-lg border border-gray-300">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                <FaBoxOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-2xl font-bold">{data?.totalProducts}</span>
                <span className="block text-gray-500">Total des Produits</span>
              </div>
            </div>
      
            <div className="flex items-center p-8 bg-green-50 shadow rounded-lg border border-gray-300">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                <FaChartLine className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-2xl font-bold">{data?.totalSales} USD</span>
                <span className="block text-gray-500">Total des Ventes</span>
              </div>
            </div>
      
            <div className="flex items-center p-8 bg-teal-50 shadow rounded-lg border border-gray-300">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-teal-600 bg-teal-100 rounded-full mr-6">
                <FaClipboardList className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-2xl font-bold">{data?.totalOrders}</span>
                <span className="block text-gray-500">Total des Commandes</span>
              </div>
            </div>
          </section>
      
          {/* Graphique des Revenus */}
          <section className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 bg-white shadow rounded-lg border border-gray-300 p-4">
              <div className="font-semibold mb-4">Le nombre de commandes par mois</div>
              <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-200 border-dashed rounded-md">
                <RevenueChart />
              </div>
            </div>
          </section>
      
          {/* Gérer les Commandes */}
          <section className="bg-white shadow rounded-lg p-8 mt-6">
            <ManageOrders />
          </section>
        </div>
      );
      
};

export default Dashboard;