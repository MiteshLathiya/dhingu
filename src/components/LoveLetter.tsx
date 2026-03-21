import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

const LETTER_TEXT = `Dhingu, you are the most special person in my life.
I am lucky to have you.
Happy Birthday my love ❤️`;

const LoveLetter = ({ onComplete }: Props) => {
  const [opened, setOpened] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

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
            onClick={() => setOpened(true)}
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
                  onClick={onComplete}
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
