/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Mail, 
  ExternalLink, 
  Code2, 
  Database, 
  Terminal as TerminalIcon, 
  Moon, 
  Sun, 
  User, 
  Cpu, 
  Linkedin,
  Copy,
  Check,
  X,
  Sparkles,
  Coffee,
  Zap,
  Flame,
  ChevronRight,
  Menu,
  Volume2,
  VolumeX,
  Monitor
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InteractiveGridCanvas } from "./components/InteractiveGridCanvas";
import { MatrixSection, MatrixText } from "./components/MatrixReveal";
import { FloatingNavbar } from "./components/FloatingNavbar";
import { TerminalOverlay } from "./components/TerminalOverlay";

import { sound } from "./lib/sound";
import profilePhoto from "./assets/pj.jpeg";

// C Code Sample
const C_CODE_SAMPLE = `#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char name[30];
    float price;
} MenuItem;

void displayMenu(MenuItem menu[], int size) {
    printf("=== RESTAURANT ORDER MANAGEMENT ===\\n");
    for (int i = 0; i < size; i++) {
        printf("[%d] %-20s $%.2f\\n", menu[i].id, menu[i].name, menu[i].price);
    }
}

int main() {
    MenuItem menu[3] = {
        {1, "Classic Burger", 8.99},
        {2, "Margherita Pizza", 11.50},
        {3, "Iced Espresso", 3.75}
    };
    displayMenu(menu, 3);
    printf("\\nStatus: System Ready for Order Processing...\\n");
    return 0;
}`;

// Developer Quotes
const DEV_QUOTES = [
  "\"Talk is cheap. Show me the code.\" — Linus Torvalds",
  "\"Simplicity is prerequisite for reliability.\" — Edsger W. Dijkstra",
  "\"First, solve the problem. Then, write the code.\" — John Johnson",
  "\"Code is like humor. When you have to explain it, it's bad.\" — Cory House",
  "\"Make it work, make it right, make it fast.\" — Kent Beck",
  "\"C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do it blows your whole leg off.\" — Bjarne Stroustrup"
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(() => sound.getIsMuted());

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  // Initial Boot Loader sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + 20;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    setIsMuted(sound.toggleSound());
  };

  // Tactile Scroll Audio Ticks
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScrollTicks = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastScrollY.current) > 160) {
        sound.playScrollTick();
        lastScrollY.current = currentY;
      }
    };

    window.addEventListener("scroll", handleScrollTicks, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollTicks);
  }, []);

  // Terminal & Easter Egg States
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<Array<{ cmd?: string; text: string; isCode?: boolean; isError?: boolean }>>([
    { text: "PrithavOS Kernel v2.4.0 (x86_64-pc-linux-gnu)" },
    { text: "Welcome to PrithavDevelops System Terminal." },
    { text: "Type 'help' or click quick prompt buttons below to explore." },
  ]);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "c-code">("overview");
  const [activeSection, setActiveSection] = useState("hero");

  // Easter Eggs State
  const [coffeeCount, setCoffeeCount] = useState(42);
  const [coffeeParticles, setCoffeeParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [activeQuote, setActiveQuote] = useState<string | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showOverclockBanner, setShowOverclockBanner] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Konami Code Sequence Tracking
  const konamiSequence = useRef<string[]>([]);

  // Sync Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Section Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );

    document.querySelectorAll("section").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Konami Code & Keyboard Shortcuts
  useEffect(() => {
    const targetKonami = [
      "ArrowUp", "ArrowUp", 
      "ArrowDown", "ArrowDown", 
      "ArrowLeft", "ArrowRight", 
      "ArrowLeft", "ArrowRight", 
      "b", "a"
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle terminal
      if (e.key === "`" || e.key === "~") {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          setTerminalOpen((prev) => !prev);
        }
      }

      // Konami code check
      konamiSequence.current.push(e.key);
      if (konamiSequence.current.length > targetKonami.length) {
        konamiSequence.current.shift();
      }

      if (konamiSequence.current.join(",").toLowerCase() === targetKonami.join(",").toLowerCase()) {
        triggerOverclockMode();
        konamiSequence.current = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerOverclockMode = () => {
    setShowOverclockBanner(true);
    setTerminalLogs((prev) => [
      ...prev,
      { text: "🎮 KONAMI CODE DETECTED: OVERCLOCK MODE ACTIVATED! (+1000 C_CODE VELOCITY)" }
    ]);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("prithav.develops@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Coffee Easter Egg Click
  const handleCoffeeClick = (e: MouseEvent<HTMLButtonElement>) => {
    setCoffeeCount((prev) => prev + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const particleId = Date.now();
    setCoffeeParticles((prev) => [
      ...prev,
      { id: particleId, x: e.clientX - rect.left, y: e.clientY - rect.top }
    ]);

    setTimeout(() => {
      setCoffeeParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 1000);
  };

  // Portrait Easter Egg Glitch
  const handlePortraitClick = () => {
    setIsGlitching(true);
    const randomQuote = DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)];
    setActiveQuote(randomQuote);
    setTimeout(() => setIsGlitching(false), 400);
  };

  const executeTerminalCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    const newLogs = [...terminalLogs, { cmd: cmdStr, text: "" }];

    switch (trimmed) {
      case "help":
        newLogs.push({
          text: `AVAILABLE TERMINAL COMMANDS:
• whoami    : Print bio & identity statement
• skills    : Inspect technical stack & status
• projects  : List featured GitHub repositories
• c-code    : View C Order Management Source
• coffee    : Increment developer fuel level
• quote     : Fetch random system wisdom
• matrix    : Run matrix code stream
• konami    : Unlock overclocked cyber mode
• sudo      : Execute root command
• contact   : Print direct email & social handles
• clear     : Flush shell output`,
        });
        break;

      case "whoami":
        newLogs.push({
          text: "PrithavDevelops // Hi! I am Prithav Jha, an aspiring developer who is curious and excited to build and work on cool projects with cool people.",
        });
        break;

      case "skills":
        newLogs.push({
          text: `TECHNICAL TOOLKIT MATRIX:
[✓] HTML / CSS      — Proficient (Layout & Styling) [Orange/Blue Accent]
[✓] C Language      — Proficient (CLI Applications & Logic) [Indigo Accent]
[➜] Python          — Learning (Automation & Scripting) [Yellow Accent]
[➜] JavaScript      — Learning (Frontend Mechanics & ES6) [Gold Accent]
[➜] SQL & MySQL     — Learning (Database Schemas) [Cyan Accent]
[⏱] Linux          — Planned (Systems Administration) [Emerald Accent]`,
        });
        break;

      case "projects":
        newLogs.push({
          text: `FEATURED REPOSITORIES:
1. Human Rights Presentation (HTML/CSS)
   -> https://github.com/PrithavDevelops/HumanRightsPresentation
2. Wireless Power Transfer System (HTML/CSS)
   -> https://github.com/PrithavDevelops/wptsPresentation
3. Restaurant Order Management System (C)
   -> https://github.com/PrithavDevelops/restaurant-order-management-system`,
        });
        break;

      case "c-code":
        newLogs.push({
          text: C_CODE_SAMPLE,
          isCode: true,
        });
        break;

      case "coffee":
        setCoffeeCount((c) => c + 1);
        newLogs.push({ text: `☕ Coffee consumed! Current Fuel Level: ${coffeeCount + 1} cups. C Code Velocity increased by +15%.` });
        break;

      case "quote":
        const q = DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)];
        newLogs.push({ text: `SYSTEM WISDOM: ${q}` });
        break;

      case "matrix":
        newLogs.push({
          text: `01000000 01010000 01010010 01001001 01010100 01001000 01000001 01010110\n01000100 01000101 01010110 01000101 01001100 01001111 01010000 01010011\n[SYSTEM MATRIX OK] — Sky grid connection active at 1000 Gbps.`,
        });
        break;

      case "konami":
        triggerOverclockMode();
        break;

      case "sudo":
        newLogs.push({
          text: "PERMISSION DENIED: Prithav has already claimed root privileges on this machine.",
          isError: true,
        });
        break;

      case "contact":
        newLogs.push({
          text: `DIRECT DISPATCH HANDLES:
Email:    prithav.develops@gmail.com
GitHub:   https://github.com/PrithavDevelops
LinkedIn: https://www.linkedin.com/in/prithavjha/`,
        });
        break;

      case "clear":
        setTerminalLogs([]);
        setTerminalInput("");
        return;

      default:
        newLogs.push({
          text: `Command not recognized: '${trimmed}'. Type 'help' for available command list.`,
          isError: true,
        });
        break;
    }

    setTerminalLogs(newLogs);
    setTerminalInput("");
  };

  const projects = [
    {
      id: "proj-1",
      title: "Human Rights in the Age of Inequality",
      category: "Web Presentation",
      description: "An interactive, structured web presentation analyzing human rights challenges, equity gaps, and modern social governance.",
      tags: ["HTML5", "CSS3", "Typography", "Editorial Layout"],
      type: "Web Application",
      repo: "https://github.com/PrithavDevelops/HumanRightsPresentation",
      icon: <User className="h-5 w-5 text-orange-400" />,
      tagColor: "border-orange-500/30 text-orange-400 bg-orange-500/10"
    },
    {
      id: "proj-2",
      title: "Wireless Power Transfer System",
      category: "Scientific UI / Physics",
      description: "Technical presentation interface demonstrating electromagnetic induction, resonance, and wireless energy distribution concepts.",
      tags: ["HTML5", "CSS3", "Scientific UI", "Diagrams"],
      type: "Web Application",
      repo: "https://github.com/PrithavDevelops/wptsPresentation",
      icon: <Cpu className="h-5 w-5 text-sky-400" />,
      tagColor: "border-sky-500/30 text-sky-400 bg-sky-500/10"
    },
    {
      id: "proj-3",
      title: "Restaurant Order Management System",
      category: "Systems & CLI in C",
      description: "A robust C console application built for structured order entry, item menu rendering, subtotal calculations, and receipt formatting.",
      tags: ["C", "Structs", "CLI Application", "Data Logic"],
      type: "C Systems App",
      repo: "https://github.com/PrithavDevelops/restaurant-order-management-system",
      icon: <TerminalIcon className="h-5 w-5 text-indigo-400" />,
      tagColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10"
    }
  ];

  // Personalized color matrix for skills toolkit
  const skillsList = [
    { 
      name: "HTML5", 
      status: "Proficient", 
      category: "Frontend", 
      notes: "Semantic structures, accessible layout hierarchy", 
      icon: <Code2 className="h-4 w-4 text-orange-400" />,
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/40" 
    },
    { 
      name: "CSS3", 
      status: "Proficient", 
      category: "Styling", 
      notes: "Custom layouts, responsive grids, transitions", 
      icon: <Code2 className="h-4 w-4 text-sky-400" />,
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/40" 
    },
    { 
      name: "C Language", 
      status: "Proficient", 
      category: "Core Programming", 
      notes: "Data structures, memory allocation, CLI tools", 
      icon: <TerminalIcon className="h-4 w-4 text-indigo-400" />,
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/40" 
    },
    { 
      name: "Python", 
      status: "Learning", 
      category: "General Purpose", 
      notes: "Scripting, logic syntax, data structures & automation", 
      icon: <TerminalIcon className="h-4 w-4 text-amber-400" />,
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/50 glow-primary-sm" 
    },
    { 
      name: "JavaScript", 
      status: "Learning", 
      category: "Frontend Mechanics", 
      notes: "DOM manipulation, ES6+, async concepts", 
      icon: <Code2 className="h-4 w-4 text-yellow-400" />,
      badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/40" 
    },
    { 
      name: "SQL", 
      status: "Learning", 
      category: "Database Systems", 
      notes: "Relational queries, table schemas, JOINs", 
      icon: <Database className="h-4 w-4 text-cyan-400" />,
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
    },
    { 
      name: "MySQL", 
      status: "Learning", 
      category: "Database Management", 
      notes: "Relational data modeling & query testing", 
      icon: <Database className="h-4 w-4 text-cyan-400" />,
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
    },
    { 
      name: "Linux", 
      status: "Planned", 
      category: "Systems & OS", 
      notes: "Bash scripting, system administration, toolchains", 
      icon: <TerminalIcon className="h-4 w-4 text-emerald-400" />,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/40" 
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/25 selection:text-primary relative bg-grain overflow-x-hidden">
      
      {/* INITIAL QUICK MINIMAL BOOT LOADING OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-mono text-xs select-none"
          >
            <div className="max-w-md w-full space-y-4 border border-primary/40 bg-card/90 p-6 rounded-2xl glow-border shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 text-[10px] text-muted-foreground uppercase">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  SYSTEM BOOT
                </span>
                <span>NEPAL NODE</span>
              </div>

              <div className="space-y-2 py-2">
                <div className="font-display text-lg font-extrabold uppercase">
                  <span className="text-foreground dark:text-white">Prithav</span>
                  <span className="text-primary glow-text">Develops</span>
                </div>
                <div className="text-muted-foreground text-[11px] font-mono">
                  <MatrixText text="[ DECRYPTING PRITHAV_OS KERNEL v2.4.0 ... ]" triggerOnScroll={false} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>LOADING MODULES</span>
                  <span className="text-primary font-bold">{loadingProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full"
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground pt-1 flex justify-between items-center font-mono">
                <span>STATUS: READY</span>
                <span className="text-emerald-400 font-bold">[ OK ]</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Interactive Cursor Canvas Grid */}
      <InteractiveGridCanvas isDarkMode={isDarkMode} />

      {/* FLOATING NAVBAR (Appears as user scrolls down) */}
      <FloatingNavbar
        activeSection={activeSection}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenTerminal={() => setTerminalOpen(true)}
        coffeeCount={coffeeCount}
        onCoffeeClick={handleCoffeeClick}
        coffeeParticles={coffeeParticles}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* OVERCLOCK EASTER EGG BANNER */}
      <AnimatePresence>
        {showOverclockBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 inset-x-0 z-50 bg-primary text-primary-foreground py-2 px-4 shadow-xl flex items-center justify-between font-mono text-xs border-b border-primary/50"
          >
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 animate-bounce" />
              <span><strong>🎮 OVERCLOCK MODE ACTIVATED:</strong> Secret Konami Code Unlocked! (+1000 C_CODE Speed)</span>
            </div>
            <button
              onClick={() => setShowOverclockBanner(false)}
              className="p-1 hover:bg-black/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Top Header Bar (Static at Hero level) */}
      <header className="w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between font-mono text-xs">
          
          {/* Identity Brand Logo: PrithavDevelops */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <a href="#hero" className="font-bold tracking-tight hover:text-primary transition-colors flex items-center gap-1.5">
              <span className="font-display text-base sm:text-lg tracking-tight font-extrabold uppercase">
                <span className="text-foreground dark:text-white">Prithav</span>
                <span className="text-primary glow-text">Develops</span>
              </span>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {[
              { id: "hero", label: "01 // INDEX" },
              { id: "about", label: "02 // DOSSIER" },
              { id: "skills", label: "03 // TOOLKIT" },
              { id: "projects", label: "04 // WORK" },
              { id: "contact", label: "05 // DISPATCH" },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={cn(
                  "hover:text-primary transition-all py-1 border-b-2 border-transparent font-bold",
                  activeSection === link.id && "border-primary text-primary glow-text"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Coffee Counter */}
            <button
              onClick={handleCoffeeClick}
              className="relative flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold transition-all group"
              title="Click to fuel Prithav (+1 Coffee)"
            >
              <Coffee className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="font-mono text-[11px]">{coffeeCount} CUPS</span>

              {coffeeParticles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -25, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none font-mono text-[10px] text-amber-400 font-bold"
                  style={{ left: p.x, top: p.y }}
                >
                  +1 C_CODE
                </motion.span>
              ))}
            </button>

            {/* Terminal Shell Button */}
            <button
              onClick={() => setTerminalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/30 text-primary font-mono text-xs transition-all glow-primary-sm font-bold"
              title="Open Interactive Shell (` ~ `)"
            >
              <TerminalIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">&gt;_ SHELL</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                handleToggleSound();
                sound.playClick();
              }}
              className="p-1.5 rounded hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-muted-foreground" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                sound.playClick();
              }}
              className="p-1.5 rounded hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5 text-sky-400" /> : <Moon className="h-3.5 w-3.5 text-primary" />}
            </button>

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded hover:bg-muted border border-border text-foreground transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu for Top Header */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border bg-background px-4 py-3 font-mono text-xs space-y-2 overflow-hidden"
            >
              {[
                { id: "hero", label: "01 // INDEX" },
                { id: "about", label: "02 // DOSSIER" },
                { id: "skills", label: "03 // TOOLKIT" },
                { id: "projects", label: "04 // WORK" },
                { id: "contact", label: "05 // DISPATCH" },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block py-2 px-3 rounded hover:bg-muted font-bold transition-colors",
                    activeSection === link.id ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-24 sm:space-y-32 lg:space-y-40 pb-28 sm:pb-36 relative z-10">
        
        {/* HERO SECTION WITH MATRIX DECODE */}
        <MatrixSection id="hero" className="pt-2 sm:pt-6 min-h-[85vh] flex flex-col justify-center scroll-mt-20">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* Main Hero Card */}
            <div className="lg:col-span-7 flex flex-col justify-between border border-primary/30 bg-card/80 backdrop-blur-sm p-4 xs:p-6 sm:p-8 md:p-10 relative overflow-hidden glow-border rounded-xl space-y-6">
              
              {/* Corner Telemetry Tag */}
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest pt-1 sm:pt-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>[ NEPAL • SYS_ACTIVE ]</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-[10px] rounded-full">
                  <Monitor className="h-3 w-3 text-sky-400 shrink-0" />
                  <span className="font-semibold">* Best experienced on desktop *</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-mono text-xs tracking-wider rounded-full glow-primary-sm max-w-full">
                  <Flame className="h-3.5 w-3.5 animate-pulse text-amber-400 shrink-0" />
                  <span className="font-semibold text-[11px] sm:text-xs md:text-sm truncate">ASPIRING SYSTEMS & WEB DEVELOPER</span>
                </div>

                {/* Display Title: PrithavDevelops */}
                <div className="space-y-3">
                  <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display uppercase leading-[0.95]">
                    <span className="text-foreground dark:text-white">
                      <MatrixText text="Prithav" delay={100} />
                    </span>
                    <br />
                    <span className="text-primary glow-text underline decoration-primary/40 underline-offset-8">
                      <MatrixText text="Develops" delay={300} />
                    </span>
                  </h1>

                  {/* Personalized Tech Badge Row */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 font-mono text-[10px] sm:text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">C</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/40 glow-primary-sm">PYTHON</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">HTML/CSS</span>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">JS</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">SQL</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">LINUX</span>
                  </div>
                </div>

                <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Building structured console apps, responsive web interfaces, and exploring low-level systems logic with curiosity and code.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 sm:pt-8 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5 sm:gap-3 font-mono text-xs">
                <a
                  href="#projects"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg xs:rounded-none font-mono text-xs tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-sm font-bold py-2.5 px-5 text-center justify-center"
                  )}
                >
                  [ EXPLORE WORK ]
                </a>
                <button
                  onClick={() => setTerminalOpen(true)}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-lg xs:rounded-none font-mono text-xs tracking-wider uppercase border-primary/40 hover:border-primary hover:text-primary font-bold py-2.5 px-5 text-center justify-center"
                  )}
                >
                  &gt;_ RUN TERMINAL
                </button>
                <a
                  href="https://github.com/PrithavDevelops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "rounded-lg xs:rounded-none font-mono text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground font-bold text-center justify-center"
                  )}
                >
                  <Github className="h-4 w-4 mr-1.5 text-primary inline-block" />
                  GITHUB
                </a>
              </div>
            </div>

            {/* Right Hero Code Inspector */}
            <div className="lg:col-span-5 border border-primary/30 bg-slate-950 text-slate-200 p-5 font-mono text-xs flex flex-col justify-between relative shadow-2xl rounded-xl glow-border">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-slate-200 font-bold ml-2">restaurant_order.c</span>
                  </div>
                  <div className="flex gap-2 text-[10px]">
                    <button 
                      onClick={() => setActiveTab("overview")} 
                      className={cn("px-2 py-0.5 rounded transition-colors font-bold", activeTab === "overview" ? "bg-primary/20 text-primary border border-primary/40" : "text-slate-500 hover:text-slate-300")}
                    >
                      SPEC
                    </button>
                    <button 
                      onClick={() => setActiveTab("c-code")} 
                      className={cn("px-2 py-0.5 rounded transition-colors font-bold", activeTab === "c-code" ? "bg-primary/20 text-primary border border-primary/40" : "text-slate-500 hover:text-slate-300")}
                    >
                      C_CODE
                    </button>
                  </div>
                </div>

                <div className="py-4 overflow-x-auto min-h-[200px] sm:min-h-[230px]">
                  {activeTab === "overview" ? (
                    <div className="space-y-3 text-slate-300">
                      <p className="text-primary font-bold">// SYSTEM SPECIFICATIONS</p>
                      <div className="space-y-2 text-[11px] text-slate-400">
                        <p><span className="text-slate-200 font-semibold">Display Handle:</span> <span className="text-white font-bold">Prithav</span><span className="text-primary font-bold">Develops</span></p>
                        <p><span className="text-slate-200 font-semibold">Developer:</span> Prithav Jha</p>
                        <p><span className="text-slate-200 font-semibold">Primary Focus:</span> Systems & C Programming</p>
                        <p><span className="text-slate-200 font-semibold">Web Stack:</span> HTML5, CSS3, Modern JS</p>
                        <p><span className="text-slate-200 font-semibold">Databases:</span> SQL, MySQL</p>
                        <p><span className="text-slate-200 font-semibold">Scripting:</span> <span className="text-amber-400 font-bold">Python</span></p>
                        <p><span className="text-slate-200 font-semibold">Target OS:</span> <span className="text-emerald-400 font-bold">Linux Administration</span></p>
                      </div>
                      <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
                        Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded font-bold border border-slate-700">~</kbd> or click shell button to open CLI terminal.
                      </div>
                    </div>
                  ) : (
                    <pre className="text-[11px] text-sky-300 leading-relaxed font-mono whitespace-pre overflow-x-auto">
                      {C_CODE_SAMPLE}
                    </pre>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  BUILD: OK (0 ERRORS)
                </span>
                <button
                  onClick={() => setTerminalOpen(true)}
                  className="text-primary hover:underline flex items-center gap-1 font-bold"
                >
                  <TerminalIcon className="h-3 w-3" />
                  Interactive Shell &gt;
                </button>
              </div>
            </div>

          </div>
        </MatrixSection>

        {/* ABOUT SECTION WITH MATRIX DECODE */}
        <MatrixSection id="about" className="scroll-mt-20 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
                <MatrixText text="02 // DOSSIER" />
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display uppercase tracking-tight">
                <MatrixText text="About Prithav Jha" />
              </h2>
            </div>
            <div className="font-mono text-xs text-muted-foreground hidden sm:block">
              [ IDENTITY STATEMENT ]
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            {/* Interactive Portrait Card */}
            <div className="md:col-span-5 border border-primary/30 bg-card p-4 relative group glow-border rounded-xl">
              <div 
                onClick={handlePortraitClick}
                className={cn(
                  "aspect-[4/5] relative overflow-hidden bg-muted border border-border cursor-pointer group rounded-lg",
                  isGlitching && "animate-cyber-glitch border-primary"
                )}
                title="Click portrait to trigger cyber glitch & dev quote easter egg!"
              >
                <img
                  src={profilePhoto}
                  alt="Prithav Jha"
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/prithav/800/1000";
                  }}
                />
                
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-background/90 text-primary font-mono text-[10px] font-bold border border-primary/30 rounded">
                  PRITHAV JHA // @PrithavDevelops
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-primary text-primary-foreground font-mono text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded">
                  [ CLICK FOR WISDOM ]
                </div>
              </div>

              {/* Developer Handles */}
              <div className="mt-3 font-mono text-[11px] space-y-1.5 text-muted-foreground">
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span>Display Brand:</span>
                  <span className="font-bold"><span className="text-foreground dark:text-white">Prithav</span><span className="text-primary">Develops</span></span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span>Core Focus:</span>
                  <span className="text-foreground">C, Web, Systems</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Target:</span>
                  <span className="text-amber-400 font-bold">Python & Linux</span>
                </div>
              </div>
            </div>

            {/* Statement & Details */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Bio Statement */}
              <div className="border-l-4 border-primary pl-4 sm:pl-6 py-2 bg-primary/5 rounded-r-lg">
                <p className="text-lg sm:text-2xl md:text-3xl font-display font-bold leading-snug tracking-tight text-foreground">
                  "Hi! I am <span className="text-primary glow-text">Prithav Jha</span>, an aspiring developer who is curious and excited to build and work on cool projects with cool people."
                </p>
              </div>

              {/* Wisdom Toast Display */}
              {activeQuote && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-primary/10 border border-primary/30 text-primary font-mono text-xs rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>{activeQuote}</span>
                  </div>
                  <button onClick={() => setActiveQuote(null)} className="text-primary hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}

              {/* Philosophy Cards */}
              <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                <div className="p-4 border border-border bg-card/80 rounded-lg space-y-2 hover:border-primary/40 transition-colors">
                  <div className="text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-indigo-400" />
                    SYSTEMS & WEB LOGIC
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Focused on foundational algorithms in C, clean structural HTML/CSS layouts, and expanding into full-stack backend mechanics.
                  </p>
                </div>

                <div className="p-4 border border-border bg-card/80 rounded-lg space-y-2 hover:border-primary/40 transition-colors">
                  <div className="text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    CURRENT GOALS
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Mastering Python automation, refining SQL query optimization, and diving deep into Linux command line tooling.
                  </p>
                </div>
              </div>

              {/* Direct Email Dispatch Card */}
              <div className="p-4 border border-primary/40 bg-primary/5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 glow-border">
                <div className="font-mono text-xs">
                  <div className="text-muted-foreground text-[10px] uppercase font-bold">DIRECT CONTACT ADDRESS</div>
                  <div className="font-bold text-foreground text-sm sm:text-base">prithav.develops@gmail.com</div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="w-full sm:w-auto px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-bold glow-primary-sm rounded-lg"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-4 w-4" />
                      [ COPIED TO CLIPBOARD! ]
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      [ COPY EMAIL ]
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </MatrixSection>

        {/* TECHNICAL TOOLKIT SECTION WITH PERSONALIZED COLORS & MATRIX DECODE */}
        <MatrixSection id="skills" className="scroll-mt-20 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
                <MatrixText text="03 // SPECIFICATIONS" />
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display uppercase tracking-tight">
                <MatrixText text="Technical Toolkit" />
              </h2>
            </div>
            <div className="font-mono text-xs text-muted-foreground hidden sm:block">
              [ DATASHEET MATRIX ]
            </div>
          </div>

          <div className="grid xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillsList.map((skill, i) => (
              <div 
                key={i} 
                className="p-5 border border-border bg-card rounded-xl hover:border-primary/60 transition-all flex flex-col justify-between space-y-4 group hover:shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 bg-muted/80 border border-border rounded-md group-hover:scale-105 transition-transform">
                      {skill.icon}
                    </span>
                    <span className={cn(
                      "font-mono text-[10px] px-2 py-0.5 border uppercase font-bold rounded",
                      skill.badgeColor
                    )}>
                      {skill.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">{skill.name}</h3>
                    <p className="font-mono text-[11px] text-muted-foreground uppercase">{skill.category}</p>
                  </div>
                </div>

                <p className="font-mono text-[11px] text-muted-foreground border-t border-border/50 pt-2 leading-relaxed">
                  {skill.notes}
                </p>
              </div>
            ))}
          </div>
        </MatrixSection>

        {/* PROJECTS SHOWCASE SECTION WITH MATRIX DECODE */}
        <MatrixSection id="projects" className="scroll-mt-20 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
                <MatrixText text="04 // REPOSITORIES" />
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display uppercase tracking-tight">
                <MatrixText text="Featured Work" />
              </h2>
            </div>
            <a
              href="https://github.com/PrithavDevelops"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-primary hover:underline flex items-center gap-1 font-bold"
            >
              VIEW ALL ON GITHUB &gt;
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div 
                key={proj.id}
                className="border border-border bg-card rounded-xl flex flex-col justify-between p-6 hover:border-primary transition-all group hover:glow-border shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted border border-border uppercase text-foreground font-semibold rounded">{proj.type}</span>
                    <span className="text-primary font-bold">{proj.category}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="p-2 bg-muted border border-border rounded-md shrink-0">
                      {proj.icon}
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors leading-tight">
                      {proj.title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={cn("font-mono text-[10px] px-2 py-0.5 border rounded font-semibold", proj.tagColor)}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-6">
                  <a
                    href={proj.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-muted hover:bg-primary hover:text-primary-foreground border border-border rounded-lg font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-bold"
                  >
                    <Github className="h-4 w-4" />
                    [ INSPECT REPOSITORY ]
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </MatrixSection>

        {/* DISPATCH / CONTACT SECTION WITH MATRIX DECODE */}
        <MatrixSection id="contact" className="scroll-mt-20 space-y-8">
          <div className="border border-primary/30 bg-card p-6 sm:p-12 relative overflow-hidden glow-border rounded-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />

            <div className="max-w-3xl space-y-6">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
                <MatrixText text="05 // DISPATCH CONSOLE" />
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-display uppercase tracking-tight">
                <MatrixText text="Let's Build Something Cool." />
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                I'm always looking for interesting projects, code reviews, and people to collaborate with. Reach out directly or check out my handles below.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-xs">
                <a
                  href="mailto:prithav.develops@gmail.com"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg font-mono text-xs tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 glow-primary-sm font-bold"
                  )}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  SEND EMAIL
                </a>

                <a
                  href="https://github.com/PrithavDevelops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-lg font-mono text-xs tracking-wider uppercase border-border hover:border-primary hover:text-primary py-3 px-6 font-bold"
                  )}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GITHUB
                </a>

                <a
                  href="https://www.linkedin.com/in/prithavjha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-lg font-mono text-xs tracking-wider uppercase border-border hover:border-primary hover:text-primary py-3 px-6 font-bold"
                  )}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LINKEDIN
                </a>
              </div>
            </div>
          </div>
        </MatrixSection>

        {/* BOTTOM GIANT BRAND WATERMARK SECTION */}
        <section className="pt-16 pb-12 text-center select-none overflow-hidden relative w-full">
          <div className="w-full max-w-full mx-auto overflow-hidden px-2">
            <h2 className="text-[clamp(1.75rem,7.8vw,9.5rem)] font-black uppercase leading-tight py-2 cursor-default whitespace-nowrap opacity-25 hover:opacity-85 transition-opacity duration-500 font-mono tracking-tight">
              <span className="text-foreground dark:text-white" style={{ fontFamily: "monospace" }}>Prithav</span><span className="text-primary glow-text" style={{ fontFamily: "monospace" }}>Develops</span>
            </h2>

            {/* Tech Stack Accent Subtitle */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-4 font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest pt-4">
              <span>EXPLORE & BUILD</span>
              <span>•</span>
              <span className="text-indigo-400 font-bold">C_SYSTEMS</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">PYTHON</span>
              <span>•</span>
              <span className="text-orange-400 font-bold">HTML/CSS</span>
              <span>•</span>
              <span className="text-yellow-400 font-bold">JS</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">LINUX</span>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background/90 py-8 font-mono text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold font-display text-sm">
              <span className="text-foreground dark:text-white">Prithav</span>
              <span className="text-primary">Develops</span>
            </span>
            <span>© {new Date().getFullYear()} — HANDCRAFTED WITH CODE</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/PrithavDevelops" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GITHUB</a>
            <a href="https://www.linkedin.com/in/prithavjha/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LINKEDIN</a>
            <button onClick={() => setTerminalOpen(true)} className="hover:text-primary transition-colors">&gt;_ TERMINAL</button>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE TERMINAL SHELL OVERLAY */}
      <TerminalOverlay
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        logs={terminalLogs}
        input={terminalInput}
        setInput={setTerminalInput}
        onSubmitCommand={executeTerminalCommand}
      />

    </div>
  );
}
