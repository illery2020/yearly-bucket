"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";

export default function AddItemForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("仕事");

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
    setCategory("仕事");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed bottom-8 right-8 z-50">
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          >
            <Plus size={28} />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md glass-panel border-border p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">新規目標</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              達成したいことは何ですか？
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例: 日本一周旅行、マラソン完走..."
              className="bg-card/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/50"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              ジャンル
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className={`transition-all flex items-center gap-1.5 px-4 py-2 h-auto ${
                      category === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {Icon && <Icon size={14} />}
                    {cat}
                  </Button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-6 text-primary-foreground font-semibold bg-primary shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
          >
            バケットリストに追加
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
