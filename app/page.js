"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BucketList from "@/components/BucketList";
import AddItemForm from "@/components/AddItemForm";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { CATEGORIES, CATEGORY_ICONS, CATEGORY_DISPLAY_NAMES } from "@/lib/constants";

// ユーザー設定の定義
const USER_CONFIG = [
  { id: "takahiro", displayName: "たかひろ" },
  { id: "kahoko", displayName: "かほこ" }
];

const EventOverlay = ({ event, onComplete }) => {
  useEffect(() => {
    if (event) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [event, onComplete]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4"
        >
          <div className="bg-slate-900/90 border border-blue-500/30 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] flex flex-col items-center gap-6 max-w-sm w-full">
            <div className="relative w-full aspect-square overflow-hidden rounded-2xl border-4 border-white/20">
              <img src={event.image} alt="Event" className="w-full h-full object-cover" />
            </div>
            <p className="text-2xl font-black text-white tracking-widest text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                {event.message}
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(USER_CONFIG[0].id); // ID (takahiro / kahoko) で管理
  const [viewMode, setViewMode] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [event, setEvent] = useState(null);

  // Load from Supabase
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('bucketlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    } finally {
      setIsLoaded(true);
    }
  };

  const addItem = async (newItem) => {
    const tempId = Date.now(); 
    const optimisticItem = { ...newItem, id: tempId, owner: currentUser };
    setItems((prev) => [optimisticItem, ...prev]);

    try {
      const { title, category, is_completed, created_at } = newItem;
      
      const { data, error } = await supabase
        .from('bucketlist')
        .insert([{ 
           title, 
           category, 
           is_completed, 
           created_at,
           owner: currentUser 
        }])
        .select()
        .single();

      if (error) throw error;
      setItems((prev) => prev.map(item => item.id === tempId ? data : item));

      // Event overlays
      if (currentUser === "kahoko") {
        setEvent({
          image: "/images/kahoko_create.jpg",
          message: "目標作成したよ！"
        });
      } else if (currentUser === "takahiro") {
        setEvent({
          image: "/images/takahiro_create.jpg",
          message: "新しい目標を追加！"
        });
      }
    } catch (error) {
      console.error('Error adding item:', error.message);
      setItems((prev) => prev.filter(item => item.id !== tempId));
    }
  };

  const updateItem = async (id, updates) => {
    const previousItems = [...items];
    setItems((prev) => prev.map(i => 
      i.id === id ? { ...i, ...updates } : i
    ));

    try {
      const { error } = await supabase
        .from('bucketlist')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating item:', error.message);
      setItems(previousItems);
    }
  };

  const toggleItem = async (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    setItems((prev) => prev.map(i => 
      i.id === id ? { ...i, is_completed: !i.is_completed } : i
    ));

    try {
      const { error } = await supabase
        .from('bucketlist')
        .update({ is_completed: !item.is_completed })
        .eq('id', id);

      if (error) throw error;

      // Completion Events
      if (!item.is_completed) {
        if (item.owner === "kahoko") {
          setEvent({
            image: "/images/kahoko_complete.jpg",
            message: "V^ ^V"
          });
        } else if (item.owner === "takahiro") {
          setEvent({
            image: "/images/takahiro_complete.jpg",
            message: "やったー！！"
          });
        }
      }
    } catch (error) {
      console.error('Error updating item:', error.message);
      setItems((prev) => prev.map(i => 
        i.id === id ? { ...i, is_completed: item.is_completed } : i
      ));
    }
  };

  const deleteItem = async (id) => {
    const previousItems = [...items];
    setItems((prev) => prev.filter(i => i.id !== id));

    try {
      const { error } = await supabase
        .from('bucketlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting item:', error.message);
      setItems(previousItems);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesUser = viewMode === "all" || item.owner === viewMode;
    const itemDisplayCategory = CATEGORY_DISPLAY_NAMES[item.category] || item.category || '全般';
    const matchesCategory = categoryFilter === "all" || itemDisplayCategory === categoryFilter;
    return matchesUser && matchesCategory;
  });

  const calculateStats = (userId) => {
    const userItems = items.filter(i => i.owner === userId);
    return {
      created: userItems.length,
      completed: userItems.filter(i => i.is_completed).length
    };
  };

  const userStats = {
    takahiro: calculateStats("takahiro"),
    kahoko: calculateStats("kahoko")
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className={`theme-${currentUser} theme-container pb-10`}>
      <Header userStats={userStats} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* ユーザー切り替え - 誰が追加するか */}
          <div className="flex items-center gap-3 glass-panel p-1 rounded-full border-slate-700/50">
            <div className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-400">
              <User size={16} />
              <span>私は:</span>
            </div>
            <Tabs value={currentUser} onValueChange={setCurrentUser} className="w-auto">
              <TabsList className="bg-transparent border-none">
                {USER_CONFIG.map(user => (
                  <TabsTrigger 
                    key={user.id} 
                    value={user.id}
                    className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 transition-all"
                  >
                    {user.displayName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* 表示フィルタリング - 誰のTODOを表示するか */}
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 rounded-full h-auto">
              <TabsTrigger value="all" className="rounded-full px-6 py-2 flex items-center gap-2">
                <span className="opacity-70 text-lg">🌍</span> 全員
              </TabsTrigger>
              {USER_CONFIG.map(user => (
                <TabsTrigger key={user.id} value={user.id} className="rounded-full px-6 py-2 flex items-center gap-2">
                  <span className="opacity-70 text-lg">{user.id === "takahiro" ? "🙋‍♂️" : "🙋‍♀️"}</span>
                  {user.displayName}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* ジャンルフィルタリング */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("all")}
            className={`rounded-full px-4 h-9 transition-all ${
              categoryFilter === "all" ? "bg-white text-slate-900" : "glass-panel text-slate-400 border-white/10"
            }`}
          >
            すべて
          </Button>
          {CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat];
            const isActive = categoryFilter === cat;
            return (
              <Button
                key={cat}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(isActive ? "all" : cat)}
                className={`rounded-full px-4 h-9 flex items-center gap-1.5 transition-all ${
                  isActive ? "bg-primary text-primary-foreground" : "glass-panel text-slate-400 border-white/10"
                }`}
              >
                {Icon && <Icon size={14} />}
                {cat}
              </Button>
            );
          })}
        </div>
      </div>
      
      <BucketList 
        items={filteredItems} 
        onToggle={toggleItem} 
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
      
      <AddItemForm onAdd={addItem} />

      <EventOverlay event={event} onComplete={() => setEvent(null)} />
    </main>
  );
}
