"use client";

import { motion } from "framer-motion";
import { User, Trophy, Rocket } from "lucide-react";

const GOAL_TARGET = 100;

const UserProgressCard = ({ name, stats, color, image }) => {
  const createdPercentage = Math.min((stats.created / GOAL_TARGET) * 100, 100);
  const completedPercentage = Math.min((stats.completed / GOAL_TARGET) * 100, 100);

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex-1 group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${color} to-transparent opacity-30 group-hover:opacity-60 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted/50 overflow-hidden group-hover:scale-110 transition-transform flex items-center justify-center border border-foreground/10">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-foreground" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground font-medium">100個の目標への挑戦</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-foreground">{stats.completed}</span>
          <span className="text-muted-foreground text-xs ml-1">/ 100</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Created Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <div className="flex items-center gap-1">
              <Rocket size={10} className="text-primary" />
              <span>目標の登録数</span>
            </div>
            <span className="text-foreground/80">{stats.created} / 100</span>
          </div>
          <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${createdPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary shadow-sm"
            />
          </div>
        </div>

        {/* Completed Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <div className="flex items-center gap-1">
              <Trophy size={10} className="text-emerald-500" />
              <span>目標の達成数</span>
            </div>
            <span className="text-foreground/80">{stats.completed} / 100</span>
          </div>
          <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden border border-border/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completedPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm"
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
          <p className="text-muted-foreground text-lg md:text-xl font-medium">
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
          image="/images/kahoko_profile.jpg"
        />
      </div>
    </header>
  );
}
