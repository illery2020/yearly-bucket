"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash2, Calendar, Tag, Pencil, User } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["General", "Travel", "Career", "Health", "Learning", "Finance"];

// IDから表示用へのマッピング
const OWNER_DISPLAY_NAMES = {
  takahiro: "たかひろ",
  kahoko: "かほこ"
};

export default function BucketItem({ item, onToggle, onUpdate, onDelete }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editCategory, setEditCategory] = useState(item.category);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!item.is_completed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        origin: { x, y },
        particleCount: 100,
        spread: 70,
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
      });
    }
    onToggle(item.id);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    onUpdate(item.id, { title: editTitle, category: editCategory });
    setIsEditDialogOpen(false);
  };

  const ownerName = OWNER_DISPLAY_NAMES[item.owner] || item.owner || "不明";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className={`overflow-hidden transition-all duration-300 border-border/50 ${
        item.is_completed 
          ? "bg-card/40 opacity-70" 
          : "glass-panel hover:border-primary/30 hover:shadow-lg"
      }`}>
        <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
          <div className="flex flex-col gap-2">
            <Badge variant={item.is_completed ? "secondary" : "outline"} className="w-fit flex items-center gap-1.5 px-3 py-1">
              <Tag size={12} />
              {item.category || 'General'}
            </Badge>
            {item.owner && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <User size={12} />
                <span>{ownerName}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Edit item"
                >
                  <Pencil size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md glass-panel border-border p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">Edit Goal</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-card/50 border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <Button
                          key={cat}
                          type="button"
                          variant={editCategory === cat ? "default" : "outline"}
                          size="sm"
                          onClick={() => setEditCategory(cat)}
                          className={`transition-all ${
                            editCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:opacity-90">
                    Save Changes
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Delete item"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          <h3 className={`text-xl font-semibold transition-colors ${
            item.is_completed ? "text-muted-foreground line-through decoration-muted-foreground/60" : "text-foreground"
          }`}>
            {item.title}
          </h3>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={14} />
            <span>{new Date(item.created_at).toLocaleDateString()}</span>
          </div>

          <Button
            size="icon"
            variant={item.is_completed ? "default" : "outline"}
            onClick={handleToggle}
            className={`rounded-full w-10 h-10 transition-all duration-300 ${
              item.is_completed
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30"
                : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Check size={20} className={item.is_completed ? "scale-100" : "scale-75 opacity-50"} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
