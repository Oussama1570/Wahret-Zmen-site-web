import axios from 'axios';
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaPlusCircle, FaTools } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md"; // Product Management Icon
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5C3E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      Swal.fire({
        title: "Logged Out!",
        text: "Admin session ended successfully.",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
        timer: 2000,
      });
      navigate("/");
    }
  };

  return (
    <section className="flex md:bg-gray-100 min-h-screen overflow-hidden">

            <Helmet>
             <title> Your Admin Dashboard</title>
            </Helmet>

      {/* Sidebar */}
      <aside className="hidden sm:flex sm:flex-col bg-gray-800 text-white">
        <a href="/" className="inline-flex items-center justify-center h-20 w-20 bg-[#8B5C3E] hover:bg-[#74452D] focus:bg-[#74452D] transition-all">
          <img src="/fav-icon.png" alt="Logo" />
        </a>
        <div className="flex-grow flex flex-col justify-between">
          <nav className="flex flex-col mx-4 my-6 space-y-4">
            {/* Dashboard Button */}
            <Link to="/dashboard" className="inline-flex items-center justify-center py-3 text-white bg-[#8B5C3E] rounded-lg">
              <span className="sr-only">Dashboard</span>
              <FaTachometerAlt className="h-6 w-6" />
            </Link>

            {/* Add Product Button */}
            <Link to="/dashboard/add-new-product" className="inline-flex items-center justify-center py-3 text-gray-300 hover:text-white hover:bg-[#8B5C3E] rounded-lg transition-all">
              <span className="sr-only">Add Product</span>
              <FaPlusCircle className="h-6 w-6"/>
            </Link>

            {/* Manage Products Button */}
            <Link to="/dashboard/manage-products" className="inline-flex items-center justify-center py-3 text-gray-300 hover:text-white hover:bg-[#8B5C3E] rounded-lg transition-all">
              <span className="sr-only">Manage Products</span>
              <MdProductionQuantityLimits className="h-6 w-6"/>
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="inline-flex items-center justify-center h-20 w-20 border-t border-gray-700">
            <button onClick={handleLogout} className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all focus:ring-2 focus:ring-red-500">
              <span className="sr-only">Logout</span>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <div className="flex-grow text-gray-800">
        {/* Header with Logout Button */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#8B5C3E]">Dashboard</h1>

          <div className="flex items-center space-x-4">
            <Link to="/dashboard/add-new-product">
              <button className="inline-flex items-center py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
                <FaPlusCircle className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </Link>

            <Link to="/dashboard/manage-products">
              <button className="inline-flex items-center py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all">
                <FaTools className="h-5 w-5 mr-2" />
                Manage Products
              </button>
            </Link>

            <button onClick={handleLogout} className="inline-flex items-center py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all">
              Logout
            </button>
          </div>
        </header>

        {/* Main Dashboard Layout */}
        <main className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
            <div className="mr-6">
              <h2 className="text-gray-600 ml-0.5">Product Store Inventory</h2>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
