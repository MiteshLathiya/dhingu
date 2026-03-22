import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGiftBoxOpen, useButtonClick, useHeartBurst } from "../hooks/useSounds";

interface Props {
  onComplete: () => void;
  onVideoStart?: () => void;
  onVideoEnd?: () => void;
}

const GiftBox = ({ onComplete, onVideoStart, onVideoEnd }: Props) => {
  const [opened, setOpened] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playGiftOpen = useGiftBoxOpen();
  const playClick = useButtonClick();
  const playHeartBurst = useHeartBurst();

  // Vibrate on mobile when opening gift
  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      
      // Play gift box opening sound (sound #4 - cute box opening + magical sparkle burst)
      playGiftOpen();
      
      // Play heart burst after opening (sound #5)
      setTimeout(() => playHeartBurst(), 300);
      
      // Vibrate on mobile devices
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
      
      // Show video after the initial animation
      setTimeout(() => {
        setShowVideo(true);
        onVideoStart?.();
      }, 1500);
    }
  };

  const handleVideoEnd = () => {
    // Video finished, show continue button
    onVideoEnd?.();
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
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-pink-500"
                  style={{ fontSize: `${Math.random() * 20 + 16}px` }}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1.5, 2],
                    x: Math.cos((i / 20) * Math.PI * 2) * (100 + Math.random() * 80),
                    y: Math.sin((i / 20) * Math.PI * 2) * (100 + Math.random() * 80) - 60,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 2, delay: i * 0.05 }}
                >
                  {i % 3 === 0 ? "💖" : i % 3 === 1 ? "💕" : "❤️"}
                </motion.span>
              ))}

              {/* Sparkle effects */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.span
                  key={`sparkle-${i}`}
                  className="absolute text-yellow-300"
                  style={{ fontSize: `${Math.random() * 12 + 8}px` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos((i / 15) * Math.PI * 2) * (80 + Math.random() * 60),
                    y: Math.sin((i / 15) * Math.PI * 2) * (80 + Math.random() * 60) - 40,
                  }}
                  transition={{ duration: 1.5, delay: 0.3 + i * 0.08, repeat: Infinity, repeatDelay: 1 }}
                >
                  ✨
                </motion.span>
              ))}

              <motion.div
                className="text-[100px]"
                initial={{ rotateY: 0, scale: 0 }}
                animate={{ rotateY: 360, scale: 1 }}
                transition={{ duration: 1, type: "spring" }}
              >
                🎉
              </motion.div>

              <motion.p
                className="text-2xl md:text-3xl font-display text-gradient-rose mt-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Your birthday adventure begins, Dhingu ❤️
              </motion.p>
              
              {/* Romantic sub-message */}
              <motion.p
                className="text-lg font-body text-muted-foreground mt-3 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                I prepared something special for you... 💝
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
              {/* Romantic frame around video */}
              <div className="relative">
                {/* Floating hearts around video */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.span
                    key={`video-hearts-${i}`}
                    className="absolute text-pink-400"
                    style={{
                      fontSize: `${Math.random() * 16 + 12}px`,
                      left: i < 4 ? `${(i + 1) * 15}%` : 'auto',
                      right: i >= 4 ? `${(i - 3) * 15}%` : 'auto',
                      top: i < 4 ? '-20px' : 'auto',
                      bottom: i >= 4 ? '-20px' : 'auto',
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      y: [0, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    {i % 2 === 0 ? '💕' : '💖'}
                  </motion.span>
                ))}
                
                <video
                  ref={videoRef}
                  className="max-w-full max-h-[60vh] rounded-lg shadow-lg border-4 border-pink-200 dark:border-pink-800"
                  controls
                  autoPlay
                  onEnded={handleVideoEnd}
                  // Placeholder path - replace with your actual video file
                  // Put your video in public/assets/video/birthday-message.mp4
                  src="/assets/video/bday-wish.mp4"
                >
                  Your browser does not support video playback.
                </video>
              </div>
              
              {/* Romantic message below video */}
              <motion.p
                className="mt-4 text-lg font-body text-center text-foreground/80 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Watch this special message just for you... 💝
              </motion.p>
              
              <motion.button
                onClick={handleContinue}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-lg font-semibold shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)" }}
                whileTap={{ scale: 0.95 }}
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
