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
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté du panneau d'administration.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5C3E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Déconnectez-moi !",
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      Swal.fire({
        title: "Déconnecté !",
        text: "La session administrateur a été terminée avec succès.",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
        timer: 2000,
      });
      navigate("/");
    }
  };

  return (
    <section dir="ltr" className="flex md:bg-gray-100 min-h-screen overflow-hidden"> {/* ⬅️ Forces LTR */}
      <Helmet>
        <title>Votre Tableau de Bord Administrateur</title>
      </Helmet>

      {/* Sidebar */}
      <aside className="hidden sm:flex sm:flex-col bg-gray-800 text-white">
        <a href="/" className="inline-flex items-center justify-center h-20 w-20 bg-[#8B5C3E] hover:bg-[#74452D] transition-all">
          <img src="/fav-icon.png" alt="Logo" />
        </a>
        <div className="flex-grow flex flex-col justify-between">
          <nav className="flex flex-col mx-4 my-6 space-y-4">
            <Link to="/dashboard" className="inline-flex items-center justify-center py-3 text-white bg-[#8B5C3E] rounded-lg">
              <span className="sr-only">Tableau de Bord</span>
              <FaTachometerAlt className="h-6 w-6" />
            </Link>

            <Link to="/dashboard/add-new-product" className="inline-flex items-center justify-center py-3 text-gray-300 hover:text-white hover:bg-[#8B5C3E] rounded-lg transition-all">
              <span className="sr-only">Ajouter un Produit</span>
              <FaPlusCircle className="h-6 w-6"/>
            </Link>

            <Link to="/dashboard/manage-products" className="inline-flex items-center justify-center py-3 text-gray-300 hover:text-white hover:bg-[#8B5C3E] rounded-lg transition-all">
              <span className="sr-only">Gérer les Produits</span>
              <MdProductionQuantityLimits className="h-6 w-6"/>
            </Link>
          </nav>

          <div className="inline-flex items-center justify-center h-20 w-20 border-t border-gray-700">
            <button onClick={handleLogout} className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all focus:ring-2 focus:ring-red-500">
              <span className="sr-only">Se Déconnecter</span>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <div className="flex-grow text-gray-800">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#8B5C3E]">Tableau de Bord</h1>

          <div className="flex items-center space-x-4">
            <Link to="/dashboard/add-new-product">
              <button className="inline-flex items-center py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
                <FaPlusCircle className="h-5 w-5 mr-2" />
                Ajouter un Produit
              </button>
            </Link>

            <Link to="/dashboard/manage-products">
              <button className="inline-flex items-center py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all">
                <FaTools className="h-5 w-5 mr-2" />
                Gérer les Produits
              </button>
            </Link>

            <button onClick={handleLogout} className="inline-flex items-center py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all">
            Se Déconnecter
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
            <div className="mr-6">
              <h2 className="text-gray-600 ml-0.5">Inventaire du Magasin de Produits</h2>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
