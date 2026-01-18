"use client";

import { motion } from "framer-motion";
import { User, Trophy, Rocket } from "lucide-react";

const GOAL_TARGET = 100;

const UserProgressCard = ({ name, stats, color }) => {
  const createdPercentage = Math.min((stats.created / GOAL_TARGET) * 100, 100);
  const completedPercentage = Math.min((stats.completed / GOAL_TARGET) * 100, 100);

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex-1 group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${color} to-transparent opacity-30 group-hover:opacity-60 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800/50 text-white group-hover:scale-110 transition-transform">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-400 font-medium">100個の目標への挑戦</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{stats.completed}</span>
          <span className="text-slate-500 text-xs ml-1">/ 100</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Created Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-1">
              <Rocket size={10} className="text-blue-400" />
              <span>目標の登録数</span>
            </div>
            <span className="text-slate-300">{stats.created} / 100</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${createdPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            />
          </div>
        </div>

        {/* Completed Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-1">
              <Trophy size={10} className="text-emerald-400" />
              <span>目標の達成数</span>
            </div>
            <span className="text-slate-300">{stats.completed} / 100</span>
          </div>
          <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completedPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Header({ userStats }) {
  return (
    <header className="py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 text-center md:text-left">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
            <span className="text-gradient">100 BUCKET</span> LIST
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            2人で叶える、一生モノの100個の夢。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserProgressCard 
          name="たかひろ" 
          stats={userStats.takahiro} 
          color="via-blue-500"
        />
        <UserProgressCard 
          name="かほこ" 
          stats={userStats.kahoko} 
          color="via-pink-500"
        />
      </div>
    </header>
  );
}
