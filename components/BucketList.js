"use client";

import { motion, AnimatePresence } from "framer-motion";
import BucketItem from "./BucketItem";

export default function BucketList({ items, onToggle, onUpdate, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700">
          <span className="text-4xl">✨</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Your list is empty</h3>
        <p className="text-slate-400 max-w-sm mx-auto">
          Start by adding some goals for this year using the + button below.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <BucketItem 
            key={item.id} 
            item={item} 
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
