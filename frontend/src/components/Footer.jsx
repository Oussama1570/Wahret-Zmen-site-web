import { FaHome, FaShoppingCart, FaInfoCircle, FaPhoneAlt, FaEnvelope, FaGlobe, FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa"; 
import "../Styles/StylesFooter.css";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-800 py-10 font-[Arial]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-xl font-bold uppercase mb-4">Wahret Zmen</h2>
          <p className="text-sm font-normal text-gray-700">
            Discover the elegance of traditional clothing with our high-quality handcrafted pieces.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold uppercase mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <FaHome className="text-gray-600 text-lg" />
              <a href="/" className="text-gray-700 font-medium hover:text-gray-900 transition">Home</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaShoppingCart className="text-gray-600 text-lg" />
              <a href="/products" className="text-gray-700 font-medium hover:text-gray-900 transition">Products</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaInfoCircle className="text-gray-600 text-lg" />
              <a href="/about" className="text-gray-700 font-medium hover:text-gray-900 transition">About</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaPhoneAlt className="text-gray-600 text-lg" />
              <a href="/contact" className="text-gray-700 font-medium hover:text-gray-900 transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold uppercase mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <FaGlobe className="text-gray-600 text-lg" />
              <span className="text-gray-700 font-medium">Souk essouf, Tunis, Tunisia</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaEnvelope className="text-gray-600 text-lg" />
              <span className="text-gray-700 font-medium">emnabes930@gmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaPhoneAlt className="text-gray-600 text-lg" />
              <span className="text-gray-700 font-medium">+216 55 495 816</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold uppercase mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/Wahret.zmen.jebbacaftan" className="text-gray-600 hover:text-blue-600 transition text-xl">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/wahret_zmen_by_sabri/" className="text-gray-600 hover:text-pink-500 transition text-xl">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" className="text-gray-600 hover:text-blue-400 transition text-xl">
              <FaTwitter />
            </a>
            <a href="https://www.tiktok.com/@wahretzmenbysabri" className="text-gray-600 hover:text-black transition text-xl">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-700 font-medium text-sm mt-10 border-t border-gray-400 pt-4">
        © {new Date().getFullYear()} Wahret Zmen. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
