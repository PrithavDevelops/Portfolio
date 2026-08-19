import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal as TerminalIcon, Sun, Moon, Coffee, Menu, X, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { sound } from "../lib/sound";

interface FloatingNavbarProps {
  activeSection: string;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenTerminal: () => void;
  coffeeCount: number;
  onCoffeeClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  coffeeParticles: Array<{ id: number; x: number; y: number }>;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  activeSection,
  isDarkMode,
  setIsDarkMode,
  onOpenTerminal,
  coffeeCount,
  onCoffeeClick,
  coffeeParticles,
  isMuted,
  onToggleSound,
}) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
      const isNearBottom = windowHeight + scrollY >= fullHeight - 320;

      if (scrollY > 160 && !isNearBottom) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "hero", label: "01 // INDEX" },
    { id: "about", label: "02 // DOSSIER" },
    { id: "skills", label: "03 // TOOLKIT" },
    { id: "projects", label: "04 // WORK" },
    { id: "contact", label: "05 // DISPATCH" },
  ];

  const handleNavClick = (id: string) => {
    sound.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {showNavbar && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 px-3 sm:px-6 max-w-6xl mx-auto pointer-events-auto"
        >
          {/* Mobile Drawer Menu (Appears above the navbar) */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="mb-3 bg-background/95 dark:bg-slate-950/95 backdrop-blur-xl border border-primary/40 rounded-2xl p-4 shadow-2xl font-mono text-xs flex flex-col space-y-2 glow-border"
              >
                <div className="text-[10px] text-muted-foreground uppercase font-bold border-b border-border/50 pb-2 flex justify-between items-center">
                  <span>NAVIGATION MATRIX</span>
                  <span className="text-primary">[ ACTIVE: {activeSection.toUpperCase()} ]</span>
                </div>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={cn(
                      "w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between font-bold transition-all",
                      activeSection === link.id
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-background/90 dark:bg-slate-950/90 backdrop-blur-md border border-primary/40 shadow-2xl rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between font-mono text-xs glow-border">
            
            {/* Logo Brand: PrithavDevelops */}
            <button
              onClick={() => handleNavClick("hero")}
              className="flex items-center gap-2 group text-left"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="font-display text-sm sm:text-base font-extrabold uppercase tracking-tight">
                <span className="text-foreground dark:text-white">Prithav</span>
                <span className="text-primary glow-text">Develops</span>
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-[11px] uppercase tracking-wider text-muted-foreground">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={cn(
                    "hover:text-primary transition-colors py-1 relative font-bold",
                    activeSection === link.id && "text-primary glow-text"
                  )}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute -bottom-1 inset-x-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Coffee Fuel Counter */}
              <button
                onClick={onCoffeeClick}
                className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[11px] font-bold transition-all group"
                title="Fuel Prithav (+1 Coffee)"
              >
                <Coffee className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform text-amber-400" />
                <span>{coffeeCount}</span>

                {coffeeParticles.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -20, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none text-[9px] text-amber-400 font-bold"
                    style={{ left: p.x, top: p.y }}
                  >
                    +1
                  </motion.span>
                ))}
              </button>

              {/* Terminal Button */}
              <button
                onClick={onOpenTerminal}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/40 text-primary text-[11px] font-bold transition-all glow-primary-sm"
                title="Open Terminal Shell"
              >
                <TerminalIcon className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">&gt;_ SHELL</span>
              </button>

              {/* Sound Audio Toggle */}
              <button
                onClick={() => {
                  onToggleSound();
                  sound.playClick();
                }}
                className="p-1.5 rounded-full hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
                title={isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  sound.playClick();
                }}
                className="p-1.5 rounded-full hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? (
                  <Sun className="h-3.5 w-3.5 text-sky-400" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-primary" />
                )}
              </button>

              {/* Mobile Burger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-full hover:bg-muted border border-border text-foreground transition-colors"
                title="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
