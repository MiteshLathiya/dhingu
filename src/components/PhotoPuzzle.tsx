import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface PhotoPuzzleProps {
  onComplete: () => void;
  onPuzzleComplete?: () => void;
}

// Puzzle image - romantic couple placeholder
const PUZZLE_IMAGE = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=600&fit=crop";

const GRID_SIZE = 3; // 3x3 grid
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

interface PuzzlePiece {
  id: number; // Correct position (0-8)
  currentPos: number; // Current position in grid
  isCorrect: boolean;
}

const PhotoPuzzle = ({ onComplete, onPuzzleComplete }: PhotoPuzzleProps) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const confettiFired = useRef(false);

  // Initialize puzzle with shuffled pieces
  const initializePuzzle = useCallback(() => {
    const newPieces: PuzzlePiece[] = [];
    
    // Create pieces in correct order
    for (let i = 0; i < TOTAL_PIECES; i++) {
      newPieces.push({
        id: i,
        currentPos: i,
        isCorrect: i === 0,
      });
    }

    // Shuffle the pieces (Fisher-Yates algorithm)
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
    }

    // Update current positions after shuffle
    newPieces.forEach((piece, index) => {
      piece.currentPos = index;
      piece.isCorrect = piece.id === index;
    });

    setPieces(newPieces);
    setMoves(0);
    setIsSolved(false);
    setShowCelebration(false);
    confettiFired.current = false;
  }, []);

  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  // Check if puzzle is solved
  const checkSolved = useCallback((currentPieces: PuzzlePiece[]) => {
    const solved = currentPieces.every((piece) => piece.id === piece.currentPos);
    return solved;
  }, []);

  // Fire confetti celebration
  const fireConfetti = useCallback(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#e88ca5", "#b76e79", "#ffd1dc", "#ff69b4"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#e88ca5", "#b76e79", "#ffd1dc", "#ff69b4"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Big center burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#e88ca5", "#b76e79", "#ffd1dc", "#ff69b4", "#ffd700"],
      ticks: 200,
      gravity: 1.2,
      shapes: ["circle", "heart"],
    });
  }, []);

  // Handle piece click (swap mechanism)
  const handlePieceClick = useCallback(
    (clickedPos: number) => {
      if (isSolved || showCelebration) return;

      const clickedPiece = pieces.find((p) => p.currentPos === clickedPos);
      if (!clickedPiece) return;

      if (selectedPiece === null) {
        // First click - select piece
        setSelectedPiece(clickedPos);
      } else if (selectedPiece === clickedPos) {
        // Clicked same piece - deselect
        setSelectedPiece(null);
      } else {
        // Second click - swap pieces
        const newPieces = [...pieces];
        
        // Find pieces at both positions
        const pieceAtSelected = newPieces.find((p) => p.currentPos === selectedPiece);
        const pieceAtClicked = newPieces.find((p) => p.currentPos === clickedPos);

        if (pieceAtSelected && pieceAtClicked) {
          // Swap positions
          const tempPos = pieceAtSelected.currentPos;
          pieceAtSelected.currentPos = pieceAtClicked.currentPos;
          pieceAtClicked.currentPos = tempPos;

          // Update isCorrect
          pieceAtSelected.isCorrect = pieceAtSelected.id === pieceAtSelected.currentPos;
          pieceAtClicked.isCorrect = pieceAtClicked.id === pieceAtClicked.currentPos;

          setPieces(newPieces);
          setMoves((m) => m + 1);
          setSelectedPiece(null);

          // Check if solved
          if (checkSolved(newPieces)) {
            setIsSolved(true);
            setShowCelebration(true);
            fireConfetti();
            onPuzzleComplete?.();
          }
        }
      }
    },
    [pieces, selectedPiece, isSolved, showCelebration, checkSolved, onPuzzleComplete, fireConfetti]
  );

  // Get piece at position
  const getPieceAtPos = (pos: number) => pieces.find((p) => p.currentPos === pos);

  // Calculate piece background position
  const getBackgroundPosition = (pieceId: number) => {
    const row = Math.floor(pieceId / GRID_SIZE);
    const col = pieceId % GRID_SIZE;
    return {
      backgroundPosition: `${-col * (100 / (GRID_SIZE - 1))}% ${-row * (100 / (GRID_SIZE - 1))}%`,
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
      <motion.h2
        className="text-3xl md:text-4xl font-display text-gradient-rose mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Complete the Puzzle 💝
      </motion.h2>

      <motion.p
        className="text-muted-foreground font-body mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Click two pieces to swap them. Complete the image to unlock your surprise!
      </motion.p>

      {/* Moves counter */}
      <motion.div
        className="mb-6 px-4 py-2 rounded-full bg-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="font-body text-sm">
          Moves: <span className="font-bold text-primary">{moves}</span>
        </span>
      </motion.div>

      {/* Puzzle Grid */}
      <div className="relative">
        {/* Puzzle Container */}
        <motion.div
          className="grid grid-cols-3 gap-1 p-2 bg-secondary/50 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Array.from({ length: TOTAL_PIECES }).map((_, pos) => {
            const piece = getPieceAtPos(pos);
            const isSelected = selectedPiece === pos;

            return (
              <motion.div
                key={pos}
                className={`relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? "ring-4 ring-primary ring-offset-2 ring-offset-background z-10"
                    : "hover:ring-2 hover:ring-primary/50"
                }`}
                onClick={() => handlePieceClick(pos)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isSelected ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {piece && (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${PUZZLE_IMAGE})`,
                      backgroundSize: `${GRID_SIZE * 100}%`,
                      ...getBackgroundPosition(piece.id),
                    }}
                  />
                )}
                
                {/* Piece number overlay (optional - shows piece order) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white/80 font-bold text-lg">
                    {piece ? piece.id + 1 : ""}
                  </span>
                </div>

                {/* Correct position indicator */}
                {piece?.isCorrect && (
                  <motion.div
                    className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Solved overlay - show full image */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-2xl z-20"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="text-center"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                <motion.img
                  src={PUZZLE_IMAGE}
                  alt="Completed puzzle"
                  className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl mx-auto mb-4 shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.p
                  className="text-xl md:text-2xl font-display text-gradient-rose"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Every moment with you is special ❤️
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex gap-4">
        <motion.button
          onClick={initializePuzzle}
          className="px-6 py-3 rounded-full font-body font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Shuffle Again 🔀
        </motion.button>

        {isSolved && (
          <motion.button
            onClick={onComplete}
            className="px-8 py-3 rounded-full font-body font-bold bg-primary text-primary-foreground glow-pink"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue 💕
          </motion.button>
        )}
      </div>

      {/* Hint text */}
      <motion.p
        className="mt-6 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {!isSolved && `${TOTAL_PIECES - pieces.filter((p) => p.isCorrect).length} pieces remaining`}
      </motion.p>
    </div>
  );
};

export default PhotoPuzzle;
