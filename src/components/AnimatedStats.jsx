// AnimatedCard.js
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
export const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="h-full"
  >
    {children}
  </motion.div>
);

// AnimatedStats.js
export const AnimatedStats = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const incrementTime = (duration / end) * 1000;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

// SkeletonLoader.js
export const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// // Add these styles to your globals.css or tailwind config
// const customStyles = `
  
// `;