import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const CodeLine = ({ text, isActive }) => {
    const [typedText, setTypedText] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);
  
    useEffect(() => {
      if (isActive) {
        let i = 0;
        const typingEffect = setInterval(() => {
          if (i < text.length) {
            setTypedText(prev => text.slice(0, i + 1));
            i++;
            
          } else {
            setIsTypingComplete(true);
            clearInterval(typingEffect);
          }
        }, 50);
  
        return () => clearInterval(typingEffect);
      } else {
        setTypedText('');
        setIsTypingComplete(false);
      }
    }, [text, isActive]);
  
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="font-mono text-sm text-white"
      >
        <span className="text-green-500">~ </span>{typedText}
        {isTypingComplete && <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity,
            ease: "easeInOut"
          }} 
          className="ml-1 inline-block"
        >
          │
        </motion.span>}
      </motion.div>
    );
  };
  
  CodeLine.propTypes = {
    text: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  };
  
const PageLoader = ({ isLoading, children }) => {
  const codeSnippet = 'git connect -with "Manu" 🚀';
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setIsActive(true);
      timer = setTimeout(() => {
        setIsActive(false);
      }, codeSnippet.length * 50 + 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gray-950 flex items-center justify-center"
        >
          <div className="w-full max-w-md p-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-2xl"
            >
              <div className="mb-4">
                <div className="h-3 w-3 bg-red-500 rounded-full inline-block mr-2"></div>
                <div className="h-3 w-3 bg-yellow-500 rounded-full inline-block mr-2"></div>
                <div className="h-3 w-3 bg-green-500 rounded-full inline-block"></div>
              </div>
              <CodeLine text={codeSnippet} isActive={isActive} />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        children
      )}
    </AnimatePresence>
  );
};

PageLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default PageLoader;