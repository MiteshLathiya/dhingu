import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoveLetterOpen, useButtonClick, useRomanticKiss } from "../hooks/useSounds";

interface Props {
  onComplete: () => void;
}

const LETTER_TEXT = `Dhingu, you are the most special person in my life.
I am lucky to have you.
Happy Birthday my love ❤️`;

// Random romantic messages
const ROMANTIC_MESSAGES = [
  "You look very cute today 💕",
  "I am lucky to have you ❤️",
  "Don't forget I love you 🤍",
  "You are my everything 💖",
  "Every moment with you is special 💝",
  "I love your smile 😊",
  "You are my dream come true 🌟",
  "My heart beats for you 💗",
];

const LoveLetter = ({ onComplete }: Props) => {
  const [opened, setOpened] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [romanticMessage, setRomanticMessage] = useState("");

  const playLoveLetterOpen = useLoveLetterOpen();
  const playClick = useButtonClick();
  const playKiss = useRomanticKiss();

  // Play sound when letter opens
  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      // Sound #6 - paper envelope opening + soft heartbeat
      playLoveLetterOpen();
    }
  };

  // Play romantic kiss sound when showing message
  useEffect(() => {
    if (opened) {
      // Show random romantic message after letter opens
      const randomMsg = ROMANTIC_MESSAGES[Math.floor(Math.random() * ROMANTIC_MESSAGES.length)];
      setRomanticMessage(randomMsg);
      setTimeout(() => {
        setShowMessage(true);
        // Sound #14 - romantic shimmer sound
        playKiss();
      }, 1500);
    }
  }, [opened, playKiss]);

  useEffect(() => {
    if (!opened) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < LETTER_TEXT.length) {
        setDisplayedText(LETTER_TEXT.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [opened]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope"
            className="cursor-pointer flex flex-col items-center"
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, rotateX: 90 }}
          >
            <motion.p className="text-lg text-muted-foreground font-body mb-6">
              You have a love letter 💌 Tap to open!
            </motion.p>
            <motion.div
              className="text-[120px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.1 }}
            >
              💌
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="card-romantic max-w-lg w-full p-8 md:p-12"
            initial={{ opacity: 0, y: 40, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="text-center mb-4">
              <span className="text-4xl">💕</span>
            </div>
            <p className="font-display text-lg md:text-xl leading-relaxed text-foreground whitespace-pre-line min-h-[100px]">
              {displayedText}
              {!typingDone && (
                <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
              )}
            </p>
            
            {/* Random Romantic Message Popup */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  className="mt-4 p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.p
                    className="text-sm font-body text-pink-700 dark:text-pink-300 italic"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {romanticMessage} 💘
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {typingDone && (
              <motion.div
                className="mt-6 text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-display italic text-muted-foreground">With all my love,</p>
                <p className="font-display text-xl text-gradient-rose font-bold">Mitesh ❤️</p>
                <motion.button
                  onClick={() => {
                    playClick(); // Sound #2 - soft warm UI click
                    onComplete();
                  }}
                  className="mt-6 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold glow-pink"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoveLetter;
