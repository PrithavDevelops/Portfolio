import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { sound } from "../lib/sound";

interface MatrixTextProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
}

const MATRIX_CHARS = "01010101#$@&%*<>?/\\{}[]!~XYZ";
const MATRIX_COLORS = [
  "text-emerald-400",
  "text-cyan-400",
  "text-sky-400",
  "text-amber-400",
  "text-indigo-400",
  "text-primary",
];

export const MatrixText: React.FC<MatrixTextProps> = ({
  text,
  className = "",
  delay = 0,
  triggerOnScroll = true,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentColorClass, setCurrentColorClass] = useState<string>("");
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!triggerOnScroll) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            setTimeout(() => {
              startAnimation();
            }, delay);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [text, delay, triggerOnScroll]);

  const startAnimation = () => {
    setIsAnimating(true);
    let iteration = 0;
    const maxIterations = text.length * 3;

    const interval = setInterval(() => {
      // Pick a random subtle matrix color while decoding
      const randomColor = MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)];
      setCurrentColorClass(randomColor);
      sound.playDecryptTick();

      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char;
            if (index < iteration / 3) {
              return text[index];
            }
            return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          })
          .join("")
      );

      iteration += 1;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, 35);
  };

  return (
    <span
      ref={elementRef}
      className={`${className} ${isAnimating ? `font-mono ${currentColorClass} transition-colors duration-75` : ""}`}
    >
      {displayText}
    </span>
  );
};

interface MatrixSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const MatrixSection: React.FC<MatrixSectionProps> = ({
  children,
  id,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            sound.playTick(1000, 0.03, 0.02);
            sound.triggerHaptics(10);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16 pointer-events-none"
      } ${className}`}
    >
      {/* Matrix Decode Scanline Indicator when entering */}
      {isVisible && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0.9 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute -top-3 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent z-20 pointer-events-none"
        />
      )}
      {children}
    </section>
  );
};
