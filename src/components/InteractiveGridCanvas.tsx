import React, { useEffect, useRef } from "react";

interface InteractiveGridCanvasProps {
  isDarkMode: boolean;
}

export const InteractiveGridCanvas: React.FC<InteractiveGridCanvasProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const GRID_SIZE = 40; // Size of grid squares
    const RADIUS = 220;   // Subtle radius around the cursor

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const baseColor = isDarkMode ? "56, 189, 248" : "2, 132, 199"; // Sky Blue
      const subtleLineColor = isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)";

      // 1. Render persistent background grid lines across entire canvas
      ctx.lineWidth = 1;
      ctx.strokeStyle = subtleLineColor;

      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // 2. Draw highlighted grid segments & intersections around cursor if active
      if (mouse.active && mouse.x >= 0 && mouse.y >= 0) {
        const startX = Math.floor((mouse.x - RADIUS) / GRID_SIZE) * GRID_SIZE;
        const endX = Math.ceil((mouse.x + RADIUS) / GRID_SIZE) * GRID_SIZE;
        const startY = Math.floor((mouse.y - RADIUS) / GRID_SIZE) * GRID_SIZE;
        const endY = Math.ceil((mouse.y + RADIUS) / GRID_SIZE) * GRID_SIZE;

        // Draw vertical grid line segments around cursor
        for (let x = startX; x <= endX; x += GRID_SIZE) {
          if (x < 0 || x > canvas.width) continue;

          for (let y = startY; y <= endY; y += 4) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < RADIUS) {
              const alpha = Math.pow(1 - dist / RADIUS, 2) * (isDarkMode ? 0.35 : 0.25);
              ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y + 4);
              ctx.stroke();
            }
          }
        }

        // Draw horizontal grid line segments around cursor
        for (let y = startY; y <= endY; y += GRID_SIZE) {
          if (y < 0 || y > canvas.height) continue;

          for (let x = startX; x <= endX; x += 4) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < RADIUS) {
              const alpha = Math.pow(1 - dist / RADIUS, 2) * (isDarkMode ? 0.35 : 0.25);
              ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + 4, y);
              ctx.stroke();
            }
          }
        }

        // Highlight intersection dots near cursor
        for (let x = startX; x <= endX; x += GRID_SIZE) {
          for (let y = startY; y <= endY; y += GRID_SIZE) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < RADIUS) {
              const dotAlpha = Math.pow(1 - dist / RADIUS, 2) * (isDarkMode ? 0.6 : 0.5);
              ctx.fillStyle = `rgba(${baseColor}, ${dotAlpha})`;
              ctx.beginPath();
              ctx.arc(x, y, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Subtle spotlight radial gradient at cursor center
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          RADIUS
        );
        gradient.addColorStop(0, `rgba(${baseColor}, ${isDarkMode ? 0.12 : 0.08})`);
        gradient.addColorStop(1, `rgba(${baseColor}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
    />
  );
};
