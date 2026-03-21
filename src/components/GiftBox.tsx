import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

const GiftBox = ({ onComplete }: Props) => {
  const [opened, setOpened] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      // Show video after the initial animation
      setTimeout(() => setShowVideo(true), 1500);
    }
  };

  const handleVideoEnd = () => {
    // Video finished, show continue button
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.p
        className="text-lg text-muted-foreground font-body mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {opened ? "" : "Tap the gift to open it 🎁"}
      </motion.p>

      <div className="relative cursor-pointer" onClick={handleOpen}>
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              className="text-[120px] md:text-[160px]"
              animate={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🎁
            </motion.div>
          ) : !showVideo ? (
            <motion.div
              key="opened"
              className="flex flex-col items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              {/* Floating hearts burst */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-primary text-2xl"
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1.5],
                    x: Math.cos((i / 12) * Math.PI * 2) * 120,
                    y: Math.sin((i / 12) * Math.PI * 2) * 120 - 40,
                  }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                >
                  ♥
                </motion.span>
              ))}

              <motion.div
                className="text-[100px]"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 0.8 }}
              >
                🎉
              </motion.div>

              <motion.p
                className="text-2xl md:text-3xl font-display text-gradient-rose mt-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Your birthday adventure begins ❤️
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <video
                ref={videoRef}
                className="max-w-full max-h-[60vh] rounded-lg shadow-lg"
                controls
                autoPlay
                onEnded={handleVideoEnd}
                // Placeholder path - replace with your actual video file
                // Put your video in public/assets/video/birthday-message.mp4
                src="/assets/video/birthday-message.mp4"
              >
                Your browser does not support video playback.
              </video>
              
              <motion.button
                onClick={handleContinue}
                className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Continue ❤️
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GiftBox;
