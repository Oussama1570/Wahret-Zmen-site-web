import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [message, setMessage] = useState("");
    const { registerUser, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const showSuccessAlert = (title, text) => {
        Swal.fire({
            title,
            text,
            icon: "success",
            confirmButtonColor: "#8B5C3E",
            confirmButtonText: "Continue Shopping",
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
            await registerUser(data.email, data.password);
            showSuccessAlert("Registration Successful!", "Welcome to Wahret Zmen Boutique.");
            navigate("/");
        } catch (error) {
            showErrorAlert("Registration Failed", "Please provide a valid email and password.");
            console.error(error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            showSuccessAlert("Google Registration Successful!", "Welcome to Wahret Zmen Boutique.");
            navigate("/");
        } catch (error) {
            showErrorAlert("Google Sign-In Failed", "Please try again.");
            console.error(error);
        }
    };

    return (
        <div className='h-[calc(100vh-120px)] flex justify-center items-center'>
            <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <h2 className='text-xl font-semibold mb-4 text-[#8B5C3E]'>Please Register</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                        <input 
                            {...register("email", { required: true })} 
                            type="email" 
                            placeholder='Email Address'
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

                    <button className='bg-[#8B5C3E] hover:bg-[#74452D] text-white font-bold py-2 px-8 rounded focus:outline-none'>
                        Register
                    </button>
                </form>

                <p className='mt-4 text-sm'>Already have an account? <Link to="/login" className='text-[#8B5C3E] hover:text-[#74452D]'>Login</Link></p>

                <button 
                    onClick={handleGoogleSignIn}
                    className='google-button mt-4 w-full flex items-center justify-center'
                >
                    <FaGoogle className='mr-2' />
                    Sign in with Google
                </button>

                <p className='mt-5 text-center text-gray-500 text-xs'>©2025 Wahret Zmen Boutique. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Register;
