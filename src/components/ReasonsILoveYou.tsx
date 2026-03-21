import { motion } from "framer-motion";

interface Props {
  onComplete: () => void;
}

const reasons = [
  { text: "Your caring nature", emoji: "💗" },
  { text: "You are so beautiful", emoji: "🌹" },
  { text: "You understand everything", emoji: "🧠" },
  { text: "You handle me so well", emoji: "🤝" },
  { text: "You make my life better", emoji: "✨" },
];

const ReasonsILoveYou = ({ onComplete }: Props) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
      <motion.h2
        className="text-3xl md:text-4xl font-display text-gradient-rose mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Reasons I Love You
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg w-full">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            className="card-romantic p-6 text-center cursor-default group"
            initial={{ opacity: 0, y: 30, rotateY: 90 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 40px hsl(340 60% 65% / 0.25)" }}
          >
            <span className="text-3xl block mb-3 group-hover:scale-125 transition-transform">{r.emoji}</span>
            <p className="font-body font-semibold text-foreground">{r.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={onComplete}
        className="mt-10 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold glow-pink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reasons.length * 0.2 + 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue →
      </motion.button>
    </div>
  );
};

export default ReasonsILoveYou;
