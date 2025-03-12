import React from "react";

const SearchInput = ({ setSearchTerm }) => {
  return (
    <div className="w-full max-w-md relative">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring focus:ring-[#A67C52] focus:outline-none"
        onChange={(e) => setSearchTerm(e.target.value)} // ✅ Update searchTerm on Input Change
      />
    </div>
  );
};

export default SearchInput;
