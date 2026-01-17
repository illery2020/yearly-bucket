"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["General", "Travel", "Career", "Health", "Learning", "Finance"];

export default function AddItemForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAdd({
      title: text,
      category,
      created_at: new Date().toISOString(),
      is_completed: false
    });
    
    setText("");
    setCategory("General");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed bottom-8 right-8 z-50">
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/20 hover:scale-105 transition-transform"
          >
            <Plus size={28} />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md glass-panel border-slate-700 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">New Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              What do you want to achieve?
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Visit Japan, Run a Marathon..."
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500/50"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className={`border-slate-700 transition-all ${
                    category === cat
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-800/50 hover:bg-slate-700 text-slate-400"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-6 text-white font-semibold bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-900/20 hover:shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Add to Bucket List
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
