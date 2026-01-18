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
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          >
            <Plus size={28} />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md glass-panel border-border p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">New Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              What do you want to achieve?
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Visit Japan, Run a Marathon..."
              className="bg-card/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/50"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
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
                  className={`transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
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
            className="w-full py-6 text-primary-foreground font-semibold bg-primary shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
          >
            Add to Bucket List
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
