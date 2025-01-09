import React from 'react';

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed z-50 grid w-full max-w-lg scale-100 gap-4 border bg-white p-6 shadow-lg duration-200 rounded-lg">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className = "", children }) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ className = "", children }) {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ className = "", children }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className = "", children }) {
  return (
    <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
}