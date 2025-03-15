import React from "react";
import FadeInSection from "../Animations/FadeInSection.jsx"; // Import fade-in component

const SearchInput = ({ setSearchTerm }) => {
  return (
    <FadeInSection delay={0.1}>
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring focus:ring-[#A67C52] focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)} // ✅ Update searchTerm on Input Change
        />
      </div>
    </FadeInSection>
  );
};

export default SearchInput;

