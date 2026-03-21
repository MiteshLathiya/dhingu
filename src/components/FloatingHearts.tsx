import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Heart particle class for canvas rendering
interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  blur: number;
  depth: number; // 0-1 for parallax
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface FloatingHeartsProps {
  count?: number;
  sparkles?: boolean;
}

// Image for the puzzle (placeholder URL - can be changed)
const PUZZLE_IMAGE = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop";

const FloatingHearts = ({ count = 20, sparkles = true }: FloatingHeartsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const heartsRef = useRef<HeartParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Sparkle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Initialize hearts
  const initHearts = useCallback(() => {
    const hearts: HeartParticle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height - dimensions.height,
      size: 15 + Math.random() * 25,
      speedY: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.3 + Math.random() * 0.5,
      blur: Math.random() * 2,
      depth: 0.3 + Math.random() * 0.7, // More depth variation
    }));
    heartsRef.current = hearts;
  }, [count, dimensions.width, dimensions.height]);

  // Draw heart shape on canvas
  const drawHeart = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      blur: number,
      rotation: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Apply blur for depth effect
      if (blur > 0) {
        ctx.filter = `blur(${blur}px)`;
      }

      // Create gradient for glow effect
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(0.4, `rgba(255, 220, 230, ${opacity * 0.8})`);
      gradient.addColorStop(0.7, `rgba(255, 180, 200, ${opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(255, 150, 180, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();

      // Draw heart shape
      const scale = size / 20;
      ctx.moveTo(0, -8 * scale);
      ctx.bezierCurveTo(0, -15 * scale, -15 * scale, -15 * scale, -15 * scale, -5 * scale);
      ctx.bezierCurveTo(-15 * scale, 5 * scale, 0, 15 * scale, 0, 25 * scale);
      ctx.bezierCurveTo(0, 15 * scale, 15 * scale, 5 * scale, 15 * scale, -5 * scale);
      ctx.bezierCurveTo(15 * scale, -15 * scale, 0, -15 * scale, 0, -8 * scale);

      ctx.fill();

      // Add outer glow
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 20;
      ctx.globalAlpha = opacity * 0.5;
      ctx.fill();

      ctx.restore();
    },
    []
  );

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with fade effect for trails
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Calculate parallax offset based on mouse position
    const parallaxX = (mouseRef.current.x - dimensions.width / 2) / dimensions.width;
    const parallaxY = (mouseRef.current.y - dimensions.height / 2) / dimensions.height;

    // Update and draw each heart
    heartsRef.current.forEach((heart) => {
      // Update position with parallax
      heart.y += heart.speedY;
      heart.x += heart.speedX + parallaxX * heart.depth * 2;
      heart.rotation += heart.rotationSpeed;

      // Wrap around screen
      if (heart.y > dimensions.height + heart.size) {
        heart.y = -heart.size;
        heart.x = Math.random() * dimensions.width;
      }
      if (heart.x < -heart.size) heart.x = dimensions.width + heart.size;
      if (heart.x > dimensions.width + heart.size) heart.x = -heart.size;

      // Draw heart with parallax depth effect
      const depthMultiplier = heart.depth;
      drawHeart(
        ctx,
        heart.x + parallaxX * 30 * depthMultiplier,
        heart.y + parallaxY * 20 * depthMultiplier,
        heart.size * (0.8 + depthMultiplier * 0.4),
        heart.opacity * depthMultiplier,
        heart.blur * (1 - depthMultiplier),
        heart.rotation
      );
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, drawHeart]);

  // Handle mouse move for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize and start animation
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    initHearts();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, initHearts, animate]);

  // Generate sparkle particles (keep for overlay effects)
  useEffect(() => {
    if (sparkles) {
      const generatedSparkles = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1000,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 5,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 5,
      }));
      setParticles(generatedSparkles);
    }
  }, [sparkles]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Canvas for 3D hearts */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />

      {/* Sparkle Particles Overlay */}
      <AnimatePresence>
        {sparkles &&
          particles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute text-yellow-400"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                fontSize: sparkle.size,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.8, 1, 0],
                scale: [0, 1, 0.8, 1.2, 0],
                rotate: [0, 45, 90, 135, 180],
              }}
              transition={{
                duration: sparkle.duration,
                delay: sparkle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingHearts;

