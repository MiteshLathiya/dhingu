import { motion } from "framer-motion";
import FloatingHearts from "./FloatingHearts";

interface Props {
  onStart: () => void;
}

const Sparkle = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute text-primary/40"
    style={{ left: x, top: y }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180] }}
    transition={{ duration: 2, delay, repeat: Infinity }}
  >
    ✦
  </motion.div>
);

const WelcomeScreen = ({ onStart }: Props) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      <FloatingHearts count={20} />
      
      {[
        { d: 0, x: "10%", y: "20%" },
        { d: 1, x: "85%", y: "15%" },
        { d: 0.5, x: "75%", y: "70%" },
        { d: 1.5, x: "15%", y: "75%" },
        { d: 2, x: "50%", y: "10%" },
      ].map((s, i) => (
        <Sparkle key={i} delay={s.d} x={s.x} y={s.y} />
      ))}

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ❤️
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient-rose mb-4">
          Hey Dhingu ❤️
        </h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground font-body mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Mitesh made something special for you.
        </motion.p>

        <motion.button
          onClick={onStart}
          className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-body font-semibold text-lg glow-pink hover:scale-105 transition-transform"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Start Your Birthday Journey ✨
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
