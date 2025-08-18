import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, HelpCircle } from "lucide-react";
import SkiplyBot from "./SkiplyBot";

interface ChatbotTriggerProps {
  autoShow?: boolean;
  autoShowDelay?: number;
}

const ChatbotTrigger: React.FC<ChatbotTriggerProps> = ({
  autoShow = false,
  autoShowDelay = 5000,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownAutoPrompt, setHasShownAutoPrompt] = useState(false);

  useEffect(() => {
    // Auto-show tooltip after delay if enabled
    if (autoShow && !hasShownAutoPrompt) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        setHasShownAutoPrompt(true);

        // Hide tooltip after 5 seconds
        setTimeout(() => {
          setShowTooltip(false);
        }, 5000);
      }, autoShowDelay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, autoShowDelay, hasShownAutoPrompt]);

  const handleToggleChat = () => {
    if (isOpen) {
      setIsMinimized(!isMinimized);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
    setShowTooltip(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: 10 }}
            className="absolute bottom-20 right-4 mb-2 mr-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm relative">
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Need Help?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    Ask me anything about Skiply! I can help you with bookings,
                    account questions, and more.
                  </p>
                  <button
                    onClick={handleToggleChat}
                    className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                  >
                    Start chatting →
                  </button>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-0 right-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <SkiplyBot
            onClose={handleCloseChat}
            isMinimized={isMinimized}
            onToggleMinimize={handleToggleMinimize}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {(!isOpen || isMinimized) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-4 right-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleChat}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
          >
            {/* Pulse animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-20"></div>

            {/* Icon */}
            <MessageCircle className="w-6 h-6 text-white relative z-10" />

            {/* Notification dot */}
            {showTooltip && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ChatbotTrigger;
