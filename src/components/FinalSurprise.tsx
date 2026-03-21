import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import FloatingHearts from "./FloatingHearts";
import Cake3D from "./Cake3D";
import VoiceNote from "./VoiceNote";

interface FinalSurpriseProps {
  isUnlocked?: boolean;
}

// Enhanced fireworks system (reduced confetti)
const launchFirework = (x: number, y: number) => {
  const colors = ["#e88ca5", "#b76e79", "#ffd1dc", "#ff69b4", "#ff1493", "#f4c2c2", "#e6a4b4"];
  
  // Main burst (reduced from 80 to 40)
  confetti({
    particleCount: 40,
    spread: 100,
    origin: { x, y },
    colors,
    ticks: 200,
    gravity: 1.2,
    scalar: 1.2,
    shapes: ["circle", "heart"],
  });

  // Secondary burst (reduced from 40 to 20)
  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 80,
      origin: { x: x + (Math.random() - 0.5) * 0.2, y: y + (Math.random() - 0.5) * 0.2 },
      colors: ["#ffd700", "#ff69b4", "#ff1493"],
      angle: Math.random() * 360,
      shapes: ["star"],
    });
  }, 200);
};

// Multi-burst fireworks sequence (reduced)
const launchFireworksSequence = () => {
  // Initial burst
  launchFirework(0.5, 0.3);
  
  // Delayed bursts (reduced from 5 to 2)
  setTimeout(() => launchFirework(0.3, 0.4), 300);
  setTimeout(() => launchFirework(0.7, 0.4), 600);
  
  // Center explosion (reduced from 200 to 80)
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 150,
      origin: { y: 0.4 },
      colors: ["#e88ca5", "#ffd700", "#ff69b4", "#ff1493"],
      ticks: 300,
      gravity: 0.8,
      shapes: ["circle", "heart", "star"],
    });
  }, 1000);
};

const FinalSurprise = ({ isUnlocked = true }: FinalSurpriseProps) => {
  // Simplified states - no key/lock needed
  const [showCake, setShowCake] = useState(true);
  const [candleBlown, setCandleBlown] = useState(false);
  const confettiIntervalRef = useRef<number | null>(null);

  // Fireworks on reveal (reduced frequency)
  const startFireworks = useCallback(() => {
    // Initial burst
    launchFireworksSequence();
    
    // Continuous fireworks (reduced from 800ms to 2000ms)
    confettiIntervalRef.current = window.setInterval(() => {
      const x = Math.random() * 0.6 + 0.2;
      const y = Math.random() * 0.3 + 0.2;
      launchFirework(x, y);
    }, 2000);
  }, []);

  // Stop fireworks
  const stopFireworks = useCallback(() => {
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopFireworks();
  }, [stopFireworks]);

  // Handle candle blown
  const handleCandleBlown = useCallback(() => {
    setCandleBlown(true);
    startFireworks();
  }, [startFireworks]);

  // Show lock screen if not unlocked through the journey
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
        <FloatingHearts count={30} sparkles={true} />
        
        <motion.div
          className="z-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔒
          </motion.div>
          <h2 className="text-3xl font-display text-gradient-rose mb-4">
            Complete the Journey First 💝
          </h2>
          <p className="text-muted-foreground font-body">
            Unlock all memories to reveal your surprise!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <FloatingHearts count={15} sparkles={true} />

      <AnimatePresence mode="wait">
        {/* Cake Phase - Show directly without key/lock */}
        {!candleBlown && showCake && (
          <motion.div
            key="cake-reveal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ transform: 'none' }}
          >
            <Cake3D onCandleBlown={handleCandleBlown} />
          </motion.div>
        )}

        {/* Final Message */}
        {candleBlown && (
          <motion.div
            key="content"
            className="z-10 text-center max-w-2xl w-full"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {/* Voice Note */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <VoiceNote />
            </motion.div>

            {/* Animated decorations */}
            <motion.div
              className="flex justify-center gap-4 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {["🎉", "🎊", "🎂", "🎈", "💕"].map((emoji, i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>

            {/* Main Birthday Message */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gradient-rose mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 20px hsl(340 60% 65% / 0.5)",
                    "0 0 40px hsl(340 60% 65% / 0.8)",
                    "0 0 60px hsl(340 60% 65% / 1)",
                    "0 0 40px hsl(340 60% 65% / 0.8)",
                    "0 0 20px hsl(340 60% 65% / 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Happy Birthday Dhingu ❤️
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl font-body text-foreground leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              You are the most beautiful part of my life.
            </motion.p>

            <motion.p
              className="text-2xl md:text-3xl font-display italic text-gradient-rose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Love you forever — Mitesh 💕
            </motion.p>

            {/* Floating hearts */}
            <motion.div
              className="mt-8 flex justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {[...Array(7)].map((_, i) => (
                <motion.span
                  key={i}
                  className="text-primary"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{ fontSize: 20 + i * 2 }}
                >
                  ♥
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalSurprise;
