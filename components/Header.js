"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header({ totalItems, completedItems }) {
  const [progress, setProgress] = useState(0);
  const [yearProgress, setYearProgress] = useState(0);

  useEffect(() => {
    // Calculate bucket list progress
    const newProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    setProgress(newProgress);

    // Calculate year progress
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const totalDays = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0); // Leap year check roughly
    setYearProgress((dayOfYear / totalDays) * 100);
  }, [totalItems, completedItems]);

  return (
    <header className="py-8 px-4 md:px-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            <span className="text-gradient">Yearly Bucket</span> List
          </h1>
          <p className="text-muted-foreground text-lg">
            Make this year count. Track your dreams and achievements.
          </p>
        </div>
        
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-400">Year Progress</span>
            <span className="text-blue-400">{Math.round(yearProgress)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${yearProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Bucket List Progress */}
      {totalItems > 0 && (
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-50" />
          
          <div className="flex justify-between items-end mb-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Your Progress</h2>
              <p className="text-slate-400 text-sm mt-1">
                You've completed <span className="text-white font-bold">{completedItems}</span> out of <span className="text-white font-bold">{totalItems}</span> goals
              </p>
            </div>
            <div className="text-3xl font-bold text-white">
              {Math.round(progress)}%
            </div>
          </div>
          
          <div className="h-4 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
            />
          </div>
        </div>
      )}
    </header>
  );
}
