import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

interface GameHeart {
  id: number;
  x: number;
  y: number;
}

const HeartCatchGame = ({ onComplete }: Props) => {
  const [hearts, setHearts] = useState<GameHeart[]>([]);
  const [caught, setCaught] = useState(0);
  const TARGET = 5;

  const spawnHeart = useCallback(() => {
    const heart: GameHeart = {
      id: Date.now() + Math.random(),
      x: 10 + Math.random() * 75,
      y: 10 + Math.random() * 70,
    };
    setHearts((prev) => [...prev.slice(-8), heart]);
  }, []);

  useEffect(() => {
    if (caught >= TARGET) return;
    const interval = setInterval(spawnHeart, 900);
    return () => clearInterval(interval);
  }, [spawnHeart, caught]);

  useEffect(() => {
    if (caught >= TARGET) {
      setTimeout(onComplete, 1500);
    }
  }, [caught, onComplete]);

  const catchHeart = (id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
    setCaught((c) => c + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <motion.h2
        className="text-2xl md:text-3xl font-display text-gradient-rose mb-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {caught >= TARGET ? "You did it! 🎉" : "Catch 5 Hearts! 💕"}
      </motion.h2>

      <div className="text-xl font-body text-muted-foreground mb-8 z-10">
        {caught} / {TARGET} hearts caught
      </div>

      {/* Progress bar */}
      <div className="w-48 h-2 rounded-full bg-secondary mb-8 z-10 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${(caught / TARGET) * 100}%` }}
        />
      </div>

      {/* Game area */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.button
              key={h.id}
              className="absolute text-4xl md:text-5xl cursor-pointer select-none"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => catchHeart(h.id)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.5 }}
            >
              💖
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeartCatchGame;
