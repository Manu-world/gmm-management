import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ defaultValue, className = "", children }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", children }) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }) {
  const { value: selectedValue, setValue } = useContext(TabsContext);
  const isSelected = value === selectedValue;

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${isSelected 
          ? "bg-white text-gray-900 shadow-sm" 
          : "text-gray-500 hover:text-gray-900"}`}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const { value: selectedValue } = useContext(TabsContext);

  if (value !== selectedValue) return null;

  return (
    <div className="mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2">
      {children}
    </div>
  );
}