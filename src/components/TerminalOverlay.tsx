import React, { useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal as TerminalIcon, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalLog {
  cmd?: string;
  text: string;
  isCode?: boolean;
  isError?: boolean;
}

interface TerminalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  logs: TerminalLog[];
  input: string;
  setInput: (val: string) => void;
  onSubmitCommand: (cmdStr: string) => void;
}

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({
  isOpen,
  onClose,
  logs,
  input,
  setInput,
  onSubmitCommand,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => terminalInputRef.current?.focus(), 150);
    }
  }, [logs, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitCommand(input);
  };

  const quickPrompts = [
    { label: "whoami", cmd: "whoami" },
    { label: "skills", cmd: "skills" },
    { label: "projects", cmd: "projects" },
    { label: "c-code", cmd: "c-code" },
    { label: "coffee", cmd: "coffee" },
    { label: "quote", cmd: "quote" },
    { label: "matrix", cmd: "matrix" },
    { label: "clear", cmd: "clear" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-slate-950 border border-primary/40 text-slate-200 shadow-2xl font-mono text-xs flex flex-col h-[85vh] max-h-[700px] overflow-hidden rounded-xl glow-border"
          >
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <TerminalIcon className="h-4 w-4 text-primary" />
                <span className="font-bold text-slate-200 text-xs sm:text-sm">
                  prithav@dev:~ (bash)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  Press ESC or click X to exit
                </span>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Terminal Log View */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3 font-mono">
              {logs.map((log, index) => (
                <div key={index} className="space-y-1">
                  {log.cmd && (
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <span>prithav@dev:~$</span>
                      <span className="text-slate-100">{log.cmd}</span>
                    </div>
                  )}
                  {log.text && (
                    <div
                      className={cn(
                        "whitespace-pre-wrap leading-relaxed text-xs",
                        log.isError && "text-red-400 font-semibold",
                        log.isCode &&
                          "bg-slate-900/90 p-3 border border-slate-800 text-sky-300 overflow-x-auto rounded-md font-mono",
                        !log.isError && !log.isCode && "text-slate-300"
                      )}
                    >
                      {log.text}
                    </div>
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
              <span className="text-slate-500 whitespace-nowrap font-bold mr-1">
                QUICK:
              </span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onSubmitCommand(p.cmd)}
                  className="px-2 py-1 bg-slate-800 hover:bg-primary/20 hover:text-primary text-slate-300 rounded transition-colors whitespace-nowrap border border-slate-700 font-bold"
                >
                  [{p.label}]
                </button>
              ))}
            </div>

            {/* Command Form Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
            >
              <span className="text-primary font-bold text-xs">prithav@dev:~$</span>
              <input
                ref={terminalInputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type command (e.g. 'help', 'skills', 'coffee', 'matrix')..."
                className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-600 font-mono text-xs py-1"
              />
              <button
                type="submit"
                className="p-1.5 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground rounded transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
