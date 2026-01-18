"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BucketList from "@/components/BucketList";
import AddItemForm from "@/components/AddItemForm";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";

// ユーザー設定の定義
const USER_CONFIG = [
  { id: "takahiro", displayName: "たかひろ" },
  { id: "kahoko", displayName: "かほこ" }
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(USER_CONFIG[0].id); // ID (takahiro / kahoko) で管理
  const [viewMode, setViewMode] = useState("all");

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

  const filteredItems = viewMode === "all" 
    ? items 
    : items.filter(item => item.owner === viewMode);

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
    <main className="min-h-screen pb-10">
      <Header userStats={userStats} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
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
            <TabsTrigger value="all" className="rounded-full px-6 py-2">全員</TabsTrigger>
            {USER_CONFIG.map(user => (
              <TabsTrigger key={user.id} value={user.id} className="rounded-full px-6 py-2">
                {user.displayName}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <BucketList 
        items={filteredItems} 
        onToggle={toggleItem} 
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
      
      <AddItemForm onAdd={addItem} />
    </main>
  );
}
