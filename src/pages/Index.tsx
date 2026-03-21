import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import HeartCursorTrail from "@/components/HeartCursorTrail";
import BackgroundMusic from "@/components/BackgroundMusic";
import LoveProgress from "@/components/LoveProgress";
import WelcomeScreen from "@/components/WelcomeScreen";
import GiftBox from "@/components/GiftBox";
import LoveLetter from "@/components/LoveLetter";
import MemoryGallery from "@/components/MemoryGallery";
import HeartCatchGame from "@/components/HeartCatchGame";
import ReasonsILoveYou from "@/components/ReasonsILoveYou";
import BirthdayCountdown from "@/components/BirthdayCountdown";
import FinalSurprise from "@/components/FinalSurprise";

const steps = [
  "welcome",
  "gift",
  "letter",
  "gallery",
  "game",
  "reasons",
  "countdown",
  "finale",
] as const;

type Step = (typeof steps)[number];

const TOTAL_MEMORIES = 4;

const Index = () => {
  const [step, setStep] = useState<Step>("welcome");
  
  // Progress tracking states
  const [giftOpened, setGiftOpened] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const goTo = (next: Step) => setStep(next);

  // Track gift completion
  const handleGiftComplete = useCallback(() => {
    setGiftOpened(true);
    goTo("letter");
  }, []);

  // Track letter completion
  const handleLetterComplete = useCallback(() => {
    setLetterOpened(true);
    goTo("gallery");
  }, []);

  // Track game completion
  const handleGameComplete = useCallback(() => {
    setGameCompleted(true);
    goTo("reasons");
  }, []);

  // Finale is always unlocked now
  const isFinaleUnlocked = true;

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Global Background Effects */}
      <FloatingHearts count={15} sparkles={true} />
      <HeartCursorTrail />
      <BackgroundMusic />

      {/* Global Progress Tracker */}
      <LoveProgress
        giftOpened={giftOpened}
        letterOpened={letterOpened}
        gameCompleted={gameCompleted}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative z-10"
        >
          {step === "welcome" && <WelcomeScreen onStart={() => goTo("gift")} />}
          
          {step === "gift" && (
            <GiftBox onComplete={handleGiftComplete} />
          )}
          
          {step === "letter" && (
            <LoveLetter onComplete={handleLetterComplete} />
          )}
          
          {step === "gallery" && (
            <MemoryGallery
              onReveal={() => {}}
              onAllRevealed={() => {}}
              revealedCount={0}
              totalCount={TOTAL_MEMORIES}
              onComplete={() => goTo("game")}
            />
          )}
          
          {step === "game" && (
            <HeartCatchGame onComplete={handleGameComplete} />
          )}
          
          {step === "reasons" && (
            <ReasonsILoveYou onComplete={() => goTo("countdown")} />
          )}
          
          {step === "countdown" && (
            <BirthdayCountdown onComplete={() => goTo("finale")} />
          )}
          
          {step === "finale" && (
            <FinalSurprise isUnlocked={isFinaleUnlocked} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
