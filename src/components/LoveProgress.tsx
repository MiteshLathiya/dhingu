import { motion } from "framer-motion";

interface LoveProgressProps {
  giftOpened: boolean;
  letterOpened: boolean;
  gameCompleted: boolean;
}

// Track all possible progress items
const TOTAL_ITEMS = 3; // gift, letter, game

const LoveProgress = ({
  giftOpened,
  letterOpened,
  gameCompleted,
}: LoveProgressProps) => {
  // Total progress calculation
  let completedItems = 0;
  if (giftOpened) completedItems += 1;
  if (letterOpened) completedItems += 1;
  if (gameCompleted) completedItems += 1;
  
  const percentage = Math.min(100, Math.round((completedItems / TOTAL_ITEMS) * 100));
  
  const isComplete = percentage === 100;

  // Progress items for visual indicator
  const items = [
    { 
      label: "Gift", 
      completed: giftOpened, 
      icon: "🎁",
      color: "bg-pink-300"
    },
    { 
      label: "Letter", 
      completed: letterOpened, 
      icon: "💌",
      color: "bg-rose-300"
    },
    { 
      label: "Game", 
      completed: gameCompleted, 
      icon: "🎮",
      color: "bg-purple-300"
    },
  ];

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-primary/20">
        <div className="flex items-center gap-3">
          {/* Heart icon */}
          <motion.div
            className="text-primary"
            animate={{
              scale: isComplete ? [1, 1.2, 1] : [1, 1.05, 1],
            }}
            transition={{
              duration: isComplete ? 0.6 : 1.5,
              repeat: isComplete ? 2 : Infinity,
            }}
          >
            {isComplete ? "💖" : "💕"}
          </motion.div>

          {/* Progress items dots */}
          <div className="flex gap-1.5">
            {items.map((item, index) => (
              <motion.div
                key={item.label}
                className={`w-2.5 h-2.5 rounded-full ${
                  item.completed 
                    ? item.color 
                    : "bg-muted"
                }`}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  backgroundColor: item.completed 
                    ? `hsl(${index === 0 ? 340 : index * 30 + 280}, 70%, 70%)`
                    : "hsl(340, 20%, 80%)"
                }}
                transition={{ delay: index * 0.1 }}
                title={item.label}
              />
            ))}
          </div>

          {/* Percentage */}
          <div className="text-sm font-body font-semibold">
            <motion.span
              className={isComplete ? "text-primary" : "text-muted-foreground"}
              animate={{ 
                scale: isComplete ? [1, 1.1, 1] : 1 
              }}
              transition={{ duration: 0.3 }}
            >
              {percentage}%
            </motion.span>
          </div>

          {/* Complete message */}
          {isComplete && (
            <motion.span
              className="text-xs text-primary font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              ❤️
            </motion.span>
          )}
        </div>

        {/* Progress bar */}
        <motion.div
          className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-300 via-rose-400 to-primary"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>

        {/* Complete message */}
        {isComplete && (
          <motion.p
            className="text-center text-xs text-primary font-semibold mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            100% – Forever Yours ❤️
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default LoveProgress;
