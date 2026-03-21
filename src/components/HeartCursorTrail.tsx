import { useEffect, useState, useCallback } from "react";

interface Trail {
  id: number;
  x: number;
  y: number;
}

const HeartCursorTrail = () => {
  const [trails, setTrails] = useState<Trail[]>([]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    const point = "touches" in e ? e.touches[0] : e;
    if (!point) return;
    const newTrail = { id: Date.now() + Math.random(), x: point.clientX, y: point.clientY };
    setTrails((prev) => [...prev.slice(-12), newTrail]);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    const interval = setInterval(() => {
      setTrails((prev) => prev.slice(1));
    }, 150);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      clearInterval(interval);
    };
  }, [handleMove]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trails.map((t, i) => (
        <span
          key={t.id}
          className="absolute text-primary transition-all duration-300"
          style={{
            left: t.x - 8,
            top: t.y - 8,
            opacity: (i + 1) / trails.length * 0.6,
            fontSize: 10 + (i / trails.length) * 8,
            transform: `scale(${0.5 + (i / trails.length) * 0.5})`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
};

export default HeartCursorTrail;
