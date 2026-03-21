import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// Audio path - ensure this file exists in public folder
const VOICE_MESSAGE_PATH = "/assets/audio/voice-message.mp3";

interface VoiceNoteProps {
  autoPlay?: boolean;
}

const VoiceNote = ({ autoPlay = false }: VoiceNoteProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(VOICE_MESSAGE_PATH);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audio.addEventListener("error", () => {
      setError(true);
      setIsLoaded(true);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Handle play/pause
  const togglePlay = useCallback(async () => {
    if (!audioRef.current || error) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Stop background music if needed (optional - can be customized)
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  }, [isPlaying, error]);

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Loading state
  if (!isLoaded) {
    return (
      <motion.div
        className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading voice message...</span>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        title="Voice message not available"
      >
        <span className="text-xl">🎧</span>
        <span className="text-sm text-muted-foreground">Voice message unavailable</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-secondary/30 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Play/Pause Button */}
      <motion.button
        onClick={togglePlay}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
          isPlaying
            ? "bg-primary text-primary-foreground glow-pink"
            : "bg-primary/80 text-primary-foreground hover:bg-primary"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          isPlaying
            ? {
                boxShadow: [
                  "0 0 20px rgba(255, 182, 193, 0.4)",
                  "0 0 40px rgba(255, 182, 193, 0.6)",
                  "0 0 20px rgba(255, 182, 193, 0.4)",
                ],
              }
            : {}
        }
        transition={{ duration: 1, repeat: Infinity }}
      >
        {isPlaying ? (
          // Pause icon
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play icon
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </motion.button>

      {/* Progress and info */}
      <div className="flex-1">
        <motion.p
          className="font-body font-semibold text-foreground"
          animate={{ opacity: isPlaying ? 1 : 0.7 }}
        >
          🎧 Play Mitesh's Message
        </motion.p>

        {/* Progress bar */}
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-rose-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Time display */}
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Animated sound waves when playing */}
      {isPlaying && (
        <div className="flex items-center gap-1">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary rounded-full"
              animate={{
                height: [8, 16, 24, 16, 8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default VoiceNote;
