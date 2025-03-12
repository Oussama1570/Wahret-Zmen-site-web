import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import "../Styles/StylesLogin.css";

const Login = () => {
  const [message, setMessage] = useState("");
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#8B5C3E", // Wahret Zmen Boutique's Rich Brown
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
      await loginUser(data.email, data.password);
      showSuccessAlert("Welcome Back!", "You have successfully logged in.");
      navigate("/");
    } catch (error) {
      showErrorAlert("Login Failed", "Please provide a valid email and password.");
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showSuccessAlert("Google Login Successful!", "Welcome to Wahret Zmen Boutique.");
      navigate("/");
    } catch (error) {
      showErrorAlert("Google Sign-In Failed", "Please try again.");
      console.error(error);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2 className='login-title'>Please Login</h2>

        {message && <p className="error-text text-red-500 mb-3">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
            <input
              {...register("email", { required: true })}
              type="email" name="email" id="email"
              placeholder='Email Address'
              className='input-field'
            />
            {errors.email && <p className='error-text'>Email is required.</p>}
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
            <input
              {...register("password", { required: true })}
              type="password" name="password" id="password"
              placeholder='Password'
              className='input-field'
            />
            {errors.password && <p className='error-text'>Password is required.</p>}
          </div>

          <button className='login-button'>Login</button>
        </form>

        <p className='align-baseline font-medium mt-4 text-sm'>
          Haven't an account? Please <Link to="/register" className='text-[#8B5C3E] hover:text-[#74452D]'>Register</Link>
        </p>

        {/* Google Sign In */}
        <button onClick={handleGoogleSignIn} className='google-button'>
          <FaGoogle className='mr-2' />
          Sign in with Google
        </button>

        <p className='footer-text'>©2025 Wahret Zmen Boutique. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
