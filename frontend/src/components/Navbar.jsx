import { Link } from "react-router-dom";
import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import logoImg from "../../src/assets/Logo/Logo Boutique Wahret Zmen.jpg";
import "../Styles/StylesNavbar.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation();


    return (
        <header className="navbar-container">
          <nav className="navbar-content">
            {/* Logo */}
            <div className="flex items-center gap-10">
  <Link to="/" className="logo flex items-center gap-2">
    <img src={logoImg} alt="Wahret Zmen Logo" className="logo-img" />
    <span className="logo-text">{t("navbar.brand")}</span>
  </Link>
  <div className="ml-2">
    <LanguageSwitcher />
  </div>
</div>




           
            
            {/* Hamburger Menu Button for Mobile */}
            
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
            </button>
      
            {/* Navigation Menu */}
            <ul className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
              <li>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t("home")}</Link>
              </li>
              <li>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("products")}</Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>{t("about-menu")}</Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t("contact-menu")}</Link>
              </li>
            </ul>
      
            {/* Right Side Icons */}
            <div className="nav-icons">
              {/* 🌐 Language Switcher */}
              
      
              {/* 🛒 Cart */}
              <Link to="/cart" className="cart-icon">
                <FiShoppingBag className="icon" />
                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
              </Link>
      
              {/* 👤 User Menu */}
              {currentUser ? (
                <div className="user-menu" ref={dropdownRef}>
                  <button className="user-avatar-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <FiUser className="user-icon logged-in" />
                  </button>
                  {isDropdownOpen && (
                    <div className="user-dropdown active">
                      <ul>
                        <li><Link to="/user-dashboard">{t("dashboard")}</Link></li>
                        <li><Link to="/orders">{t("orders")}</Link></li>
                        <li><button onClick={logout}>{t("logout")}</button></li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : token ? (
                <Link to="/dashboard" className="dashboard-link">{t("dashboard")}</Link>
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