import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: () => void;
}

const BIRTHDAY = new Date("2026-03-23T00:00:00");

const BirthdayCountdown = ({ onComplete }: Props) => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, BIRTHDAY.getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.h2
        className="text-3xl md:text-4xl font-display text-gradient-rose mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Counting Down to Your Day 🎂
      </motion.h2>
      <motion.p
        className="text-muted-foreground font-body mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        March 23, 2026
      </motion.p>

      <div className="flex gap-4 md:gap-6">
        {units.map((u, i) => (
          <motion.div
            key={u.label}
            className="card-romantic p-4 md:p-6 min-w-[70px] md:min-w-[90px] text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <motion.span
              key={u.value}
              className="text-3xl md:text-4xl font-display font-bold text-gradient-rose block"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {String(u.value).padStart(2, "0")}
            </motion.span>
            <span className="text-xs md:text-sm font-body text-muted-foreground">{u.label}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={onComplete}
        className="mt-10 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold glow-pink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Open Your Surprise ❤️
      </motion.button>
    </div>
  );
};

export default BirthdayCountdown;
