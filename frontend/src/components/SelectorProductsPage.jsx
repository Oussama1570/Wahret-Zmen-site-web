import React from "react";
import FadeInSection from "../Animations/FadeInSection.jsx"; // Import fade-in component

const SelectorsPageProducts = ({ options, onSelect, label }) => {
  return (
    <FadeInSection delay={0.1}>
      <div className="flex flex-col items-center mb-6">
        <label className="text-lg font-medium text-gray-700 mb-3">{label}</label>
        <div className="flex flex-wrap gap-4 justify-center">
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={option}
                onChange={(e) => onSelect(e.target.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 text-base">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
};

export default SelectorsPageProducts;

