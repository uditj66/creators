"use client";
import React, { useEffect, useState } from "react";

const MouseEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouse);

    // 1. **THE BUG FIX**: Use removeEventListener for cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div
      className="fixed h-96 w-96 
                 rounded-full 
                 pointer-events-none 
                 z-0 
                 opacity-50 
                 blur-3xl 
                 bg-linear-to-r from-cyan-400 to-indigo-600"
      style={{
        // 2. **SLEEKER ANIMATION**: Use transform for performance
        transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)`,
        // 3. **SMOOTHER TIMING**: A slightly faster, smoother transition
        transition: "all  0.2s ease-out",
      }}
    ></div>
  );
};

export default MouseEffect;
