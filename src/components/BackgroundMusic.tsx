import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundMusicProps {
  src?: string;
}

const BackgroundMusic = ({ src }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play on first user interaction (required by browsers)
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      // Optionally auto-play background music
      audioRef.current?.play().catch(() => {
        // Autoplay blocked - user will need to manually play
      });
      setIsPlaying(true);
    }
  }, [hasInteracted]);

  // Listen for first interaction
  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [handleFirstInteraction]);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} src={src || "/assets/music/birthday.mp3"} loop />
      
      {/* Floating Music Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isPlaying
            ? ["0 0 20px hsl(340 60% 65% / 0.4)", "0 0 40px hsl(340 60% 65% / 0.6)", "0 0 20px hsl(340 60% 65% / 0.4)"]
            : "0 0 10px hsl(340 60% 65% / 0.2)",
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
        }}
      >
        <motion.span
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          🎵
        </motion.span>
      </motion.button>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 bg-background rounded-2xl p-4 shadow-xl border border-primary/20"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="font-body text-sm text-muted-foreground">
                Birthday Melody
              </span>
              <motion.button
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl"
                onClick={toggleMusic}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </motion.button>
              {isPlaying && (
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{
                        height: [10, 20, 15, 25, 10],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BackgroundMusic;