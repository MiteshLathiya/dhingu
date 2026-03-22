import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScratchCardProps {
  onReveal?: () => void;
}

// The hidden message revealed after scratching
const HIDDEN_MESSAGE = "You are my greatest win in life 💕";
const PHOTO_SRC = "/assets/images/birthday-memory.JPG";

const ScratchCard = ({ onReveal }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [showFullReveal, setShowFullReveal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Initialize canvas with scratch layer
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill with scratch layer (silver/gray)
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some texture/lines to make it look like a real scratch card
    ctx.strokeStyle = "#a0a0a0";
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Add "Scratch Here" text
    ctx.fillStyle = "#808080";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("💫 Scratch to reveal 💫", canvas.width / 2, canvas.height / 2);

    // Enable scratch detection
    ctx.globalCompositeOperation = "destination-out";
  }, []);

  // Calculate scratch percentage
  const calculateScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Check every 10th pixel for performance
    for (let i = 3; i < pixels.length; i += 40) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 40;
    const percentage = (transparentPixels / totalPixels) * 100;
    return percentage;
  }, []);

  // Handle mouse/touch move for scratching
  const handleScratch = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isScratched || showFullReveal) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      let x, y;

      if ("touches" in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      // Draw scratch path
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Update progress
      const progress = calculateScratchPercentage();
      setScratchProgress(progress);

      // Auto-reveal when 60% scratched
      if (progress >= 60) {
        setShowFullReveal(true);
        setIsScratched(true);
        // Clear remaining scratch layer
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Trigger callback
        onReveal?.();
      }
    },
    [isScratched, showFullReveal, calculateScratchPercentage, onReveal]
  );

  const startScratch = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    handleScratch(e);
  };

  const endScratch = () => {
    isDrawing.current = false;
  };

  const moveScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    handleScratch(e);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!showFullReveal ? (
          <motion.div
            key="scratch-card"
            className="relative w-72 h-72 md:w-80 md:h-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hidden content underneath */}
            <div
              ref={containerRef}
              className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-rose-400 to-pink-600 p-4"
            >
              {/* Photo */}
              <img
                src={PHOTO_SRC}
                alt="Us together"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/50 shadow-lg mb-3"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              {/* Fallback emoji */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/50 shadow-lg mb-3 hidden items-center justify-center bg-gradient-to-br from-rose-300 to-pink-500">
                <span className="text-6xl">💕</span>
              </div>

              {/* Hidden message */}
              <p className="text-white font-display text-lg md:text-xl text-center font-bold drop-shadow-md">
                {HIDDEN_MESSAGE}
              </p>
            </div>

            {/* Scratch canvas overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 rounded-2xl cursor-crosshair touch-none"
              onMouseDown={startScratch}
              onMouseUp={endScratch}
              onMouseLeave={endScratch}
              onMouseMove={moveScratch}
              onTouchStart={startScratch}
              onTouchEnd={endScratch}
              onTouchMove={moveScratch}
            />

            {/* Progress indicator */}
            <motion.div
              className="absolute -bottom-10 left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-muted-foreground font-body">
                {scratchProgress < 60
                  ? `Scratched: ${Math.round(scratchProgress)}%`
                  : "Revealing..."}
              </p>
              <div className="w-32 h-2 bg-secondary rounded-full mt-1 mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${scratchProgress}%` }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Full reveal animation
          <motion.div
            key="revealed"
            className="w-72 h-72 md:w-80 md:h-80 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex flex-col items-center justify-center p-4 shadow-2xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            {/* Floating hearts */}
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-white"
                style={{
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                  fontSize: 16 + Math.random() * 16,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                💖
              </motion.span>
            ))}

            {/* Photo */}
            <img
              src={PHOTO_SRC}
              alt="Us together"
              className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white/70 shadow-xl mb-3"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            {/* Fallback emoji */}
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white/70 shadow-xl mb-3 hidden items-center justify-center bg-gradient-to-br from-rose-300 to-pink-500">
              <span className="text-7xl">💕</span>
            </div>

            {/* Message */}
            <motion.p
              className="text-white font-display text-lg md:text-xl text-center font-bold drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {HIDDEN_MESSAGE}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showFullReveal && (
        <motion.p
          className="mt-12 text-muted-foreground font-body text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Scratch the card to reveal your surprise! 🎁
        </motion.p>
      )}
    </div>
  );
};

export default ScratchCard;
