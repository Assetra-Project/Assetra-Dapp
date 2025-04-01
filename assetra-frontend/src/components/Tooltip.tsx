import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
}

export default function Tooltip({ content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <HelpCircle 
        className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 w-64 p-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -right-2 top-6"
          >
            <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45" />
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}