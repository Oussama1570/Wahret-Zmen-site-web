import React from "react";

const Selector = ({ options, onSelect, label }) => {
    return (
        <div className="flex flex-col w-full max-w-xs">
            <label className="text-lg font-medium mb-2 text-gray-700">
                {label}
            </label>
            <select
                onChange={(e) => onSelect(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-700 cursor-pointer"
            >
                {options.map((option, index) => (
                    <option key={index} value={option} className="text-gray-900">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Selector;