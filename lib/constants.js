import { 
  Briefcase, 
  BookOpen, 
  Heart, 
  Zap, 
  ShoppingBag, 
  Utensils,
  Sparkles
} from "lucide-react";

export const CATEGORIES = ["仕事", "勉強", "趣味", "習慣", "買い物", "ご飯"];

export const CATEGORY_ICONS = {
  "仕事": Briefcase,
  "勉強": BookOpen,
  "趣味": Heart,
  "習慣": Zap,
  "買い物": ShoppingBag,
  "ご飯": Utensils,
  "全般": Sparkles
};

export const CATEGORY_COLORS = {
  "仕事": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "勉強": "bg-violet-500/10 text-violet-500 border-violet-500/20",
  "趣味": "bg-pink-500/10 text-pink-500 border-pink-500/20",
  "習慣": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "買い物": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "ご飯": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "全般": "bg-slate-500/10 text-slate-500 border-slate-500/20"
};

export const CATEGORY_DISPLAY_NAMES = {
  // 以前の英語カテゴリの対応
  General: "全般",
  Travel: "趣味",
  Career: "仕事",
  Health: "習慣",
  Learning: "勉強",
  Finance: "買い物",
  // 日本語旧カテゴリの読み替え
  全般: "全般",
  旅行: "趣味",
  学習: "勉強",
  健康: "習慣",
  財務: "買い物"
};
