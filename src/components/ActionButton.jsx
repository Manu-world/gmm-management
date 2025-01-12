import React from 'react';

const ActionButton = ({ icon: Icon, label, variant = "primary", onClick }) => {
  const baseClasses = "flex items-center px-4 py-2 rounded-lg transition-colors";
  const variantClasses = variant === "secondary" ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-green-600 text-white hover:bg-green-700";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {label}
    </button>
  );
};

export default ActionButton; 