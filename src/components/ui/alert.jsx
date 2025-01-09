import React from 'react';

export function Alert({ variant = "default", className = "", children }) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-900",
    destructive: "bg-red-100 text-red-900",
    warning: "bg-yellow-100 text-yellow-900",
    success: "bg-green-100 text-green-900"
  };

  return (
    <div 
      role="alert"
      className={`relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ className = "", children }) {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
}