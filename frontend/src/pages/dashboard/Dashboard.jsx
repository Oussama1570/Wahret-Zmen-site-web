import { FaBoxOpen, FaClipboardList, FaChartLine, FaPlusCircle, FaTools } from 'react-icons/fa';
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
                console.error('Error:', error);
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
            <div className="loading-screen flex justify-center items-center h-screen bg-gray-100">
                <Loading />
            </div>
        );
    }

    return (
        <>
            {/* Statistics Overview */}
            <section className="grid xl:grid-cols-3 gap-6 mb-6">

            {/* Set the title for the Home Page */}
            {/* Set the title for the Home Page */}
            

                <div className="flex items-center p-8 bg-blue-50 shadow rounded-lg border border-gray-300">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <FaBoxOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{data?.totalProducts}</span>
                        <span className="block text-gray-500">Total Products</span>
                    </div>
                </div>
                <div className="flex items-center p-8 bg-green-50 shadow rounded-lg border border-gray-300">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                        <FaChartLine className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{data?.totalSales} USD</span>
                        <span className="block text-gray-500">Total Sales</span>
                    </div>
                </div>
                <div className="flex items-center p-8 bg-teal-50 shadow rounded-lg border border-gray-300">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-teal-600 bg-teal-100 rounded-full mr-6">
                        <FaClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{data?.totalOrders}</span>
                        <span className="block text-gray-500">Total Orders</span>
                    </div>
                </div>
            </section>

            {/* Revenue Chart and Users by Average Order */}
            <section className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 bg-white shadow rounded-lg border border-gray-300 p-4">
                    <div className="font-semibold mb-4">The number of orders per month</div>
                    <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-200 border-dashed rounded-md">
                        <RevenueChart />
                    </div>
                </div>

                <div className="flex-1 bg-white shadow rounded-lg border border-gray-300 p-4">
                    <div className="font-semibold mb-4">Users by Average Order</div>
                    <div className="text-xl text-gray-500">
                        Average Orders: {data?.averageOrder || 'N/A'}
                    </div>
                </div>
            </section>

            <section className="bg-white shadow rounded-lg p-8 mt-6">
                <ManageOrders />
            </section>
        </>
    );
};

export default Dashboard;
