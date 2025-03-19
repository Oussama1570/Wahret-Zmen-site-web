import { Link } from "react-router-dom";
import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import logoImg from "../../src/assets/Logo/Logo Boutique Wahret Zmen.jpg";
import "../Styles/StylesNavbar.css";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const cartItems = useSelector(state => state.cart.cartItems);
    const { currentUser, logout } = useAuth();
    const token = localStorage.getItem('token');

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <header className="navbar-container">
            <nav className="navbar-content">
                {/* Logo */}
                <Link to="/" className="logo">
                    <img src={logoImg} alt="Wahret Zmen Logo" className="logo-img" />
                    <span className="logo-text">Wahret Zmen</span>
                </Link>

                {/* Hamburger Menu Button for Mobile */}
                <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
                </button>

                {/* Navigation Menu */}
                <ul className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
                    <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link></li>
                    <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>
                    <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
                </ul>

                {/* Right Side Icons */}
                <div className="nav-icons">
                    {/* Cart */}
                    <Link to="/cart" className="cart-icon">
                        <FiShoppingBag className="icon" />
                        {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                    </Link>

                    {/* User Menu */}
                    {currentUser ? (
                        <div className="user-menu" ref={dropdownRef}>
                            <button className="user-avatar-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <FiUser className="user-icon logged-in" />
                            </button>
                            {isDropdownOpen && (
                                <div className="user-dropdown active">
                                    <ul>
                                        <li><Link to="/user-dashboard">Dashboard</Link></li>
                                        <li><Link to="/orders">Orders</Link></li>
                                        <li><button onClick={logout}>Logout</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : token ? (
                        <Link to="/dashboard" className="dashboard-link">Dashboard</Link>
                    ) : (
                        <Link to="/login" className="login-icon">
                            <FiUser className="icon" />
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;