import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RomanticMessageProps {
  triggerOn?: string; // step name to trigger on
}

// Random romantic messages that appear throughout the journey
const MESSAGES = [
  "You look very cute today 💕",
  "I am lucky to have you ❤️",
  "Don't forget I love you 🤍",
  "You are my everything 💖",
  "Every moment with you is special 💝",
  "I love your smile 😊",
  "You are my dream come true 🌟",
  "My heart beats for you 💗",
  "Thinking of you right now 💭",
  "You make my life complete 💞",
  "I'm so in love with you 💘",
  "You are my sunshine ☀️",
  "Forever isn't long enough with you 💏",
  "My love for you grows every day 💓",
];

const RomanticMessage = ({ triggerOn }: RomanticMessageProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    // Show message periodically (every 15-25 seconds)
    const showRandomMessage = () => {
      const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setCurrentMessage(randomMsg);
      setShowMessage(true);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 4000);
    };

    // Initial random delay
    const initialDelay = 5000 + Math.random() * 10000;
    const initialTimer = setTimeout(showRandomMessage, initialDelay);

    // Then show periodically
    const interval = setInterval(() => {
      showRandomMessage();
    }, 15000 + Math.random() * 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg border border-pink-200/50"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.p
            className="text-sm md:text-base font-body text-pink-600 dark:text-pink-300 whitespace-nowrap"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {currentMessage} 💘
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RomanticMessage;
