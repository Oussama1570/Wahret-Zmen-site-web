import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import axios from "axios";
import getBaseUrl from '../utils/baseURL';
import { useNavigate } from 'react-router-dom';
import "../Styles/StylesAdminLogin.css";

const AdminLogin = () => {
    const [message, setMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const showSuccessAlert = (title, text) => {
        Swal.fire({
            title,
            text,
            icon: "success",
            confirmButtonColor: "#8B5C3E",
            confirmButtonText: "Enter Dashboard",
            timer: 2000,
            showClass: { popup: "animate__animated animate__fadeInDown" },
            hideClass: { popup: "animate__animated animate__fadeOutUp" }
        });
    };

    const showErrorAlert = (title, text) => {
        Swal.fire({
            title,
            text,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "Try Again",
            showClass: { popup: "animate__animated animate__shakeX" },
            hideClass: { popup: "animate__animated animate__fadeOut" }
        });
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            const auth = response.data;

            if (auth.token) {
                localStorage.setItem('token', auth.token);
                setTimeout(() => {
                    localStorage.removeItem('token');
                    showErrorAlert("Session Expired", "Please login again.");
                    navigate("/");
                }, 3600 * 1000);
            }

            showSuccessAlert("Admin Login Successful!", "Welcome to your dashboard.");
            navigate("/dashboard");
        } catch (error) {
            showErrorAlert("Login Failed", "Please provide a valid username and password.");
            console.error(error);
        }
    };

    return (
        <div className='admin-login-container'>
            <div className='admin-login-box'>
                <h2 className='admin-login-title text-[#8B5C3E]'>Admin Dashboard Login</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>Username</label>
                        <input 
                            {...register("username", { required: true })} 
                            type="text" 
                            placeholder='Username'
                            className='input-field'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
                        <input 
                            {...register("password", { required: true })} 
                            type="password" 
                            placeholder='Password'
                            className='input-field'
                        />
                    </div>

                    <button className='admin-login-button bg-[#8B5C3E] hover:bg-[#74452D]'>
                        Login
                    </button>
                </form>

                <p className='admin-footer-text'>©2025 Wahret Zmen Boutique. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AdminLogin;
