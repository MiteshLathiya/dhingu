import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  onComplete: () => void;
}

const memories = [
  { date: "18 March 2023", text: "First time I said I love you ❤️", emoji: "💕" },
  { date: "16 April 2023", text: "Our first hug 🤗", emoji: "🤗" },
  { date: "24 September 2023", text: "Our first kiss 💋", emoji: "💋" },
  { date: "∞", text: "And many more memories waiting for us...", emoji: "✨" },
];

const MemoryTimeline = ({ onComplete }: Props) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Check which items are in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleItems((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.3, rootMargin: "-50px" }
    );

    const items = document.querySelectorAll(".timeline-item");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16" ref={containerRef}>
      <motion.h2
        className="text-3xl md:text-4xl font-display text-gradient-rose mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Our Beautiful Memories 💕
      </motion.h2>

      <motion.p
        className="text-muted-foreground font-body mb-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Scroll through our special moments together
      </motion.p>

      <div className="relative max-w-md w-full">
        {/* Timeline line with gradient */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-soft-pink to-primary" />

        {memories.map((m, i) => (
          <motion.div
            key={i}
            data-index={i}
            className="timeline-item relative pl-16 pb-10"
            initial={{ opacity: 0, x: -30 }}
            animate={visibleItems.has(i) ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            {/* Dot with pulse animation */}
            <motion.div
              className="absolute left-4 top-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
              animate={visibleItems.has(i) ? {
                boxShadow: [
                  "0 0 0 0 hsl(340 60% 65% / 0.4)",
                  "0 0 0 8px hsl(340 60% 65% / 0)",
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
            </motion.div>

            {/* Card */}
            <motion.div
              className="card-romantic p-5"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 40px hsl(340 60% 65% / 0.2)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-3xl block mb-2"
                animate={visibleItems.has(i) ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
              >
                {m.emoji}
              </motion.span>
              <p className="font-body text-sm text-muted-foreground font-semibold">{m.date}</p>
              <p className="font-display text-lg text-foreground">{m.text}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Animated continue button */}
      <motion.button
        onClick={onComplete}
        className="mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold glow-pink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: memories.length * 0.1 + 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue →
      </motion.button>
    </div>
  );
};

export default MemoryTimeline;
