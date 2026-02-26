import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  MessageSquare, 
  Sparkles, 
  Home, 
  Users, 
  Package,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  Furniture, 
  Friend, 
  FURNITURE_CATALOG, 
  FRIEND_TEMPLATES, 
  RoomItem 
} from './types';
import { getFriendMessage, generateApartmentStory } from './services/geminiService';

export default function App() {
  const [items, setItems] = useState<RoomItem[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'furniture' | 'friends'>('furniture');
  const [chatFriend, setChatFriend] = useState<Friend | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [apartmentStory, setApartmentStory] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  const addItem = (furniture: Furniture) => {
    const newItem: RoomItem = {
      id: Math.random().toString(36).substr(2, 9),
      furnitureId: furniture.id,
      position: { x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10 }
    };
    setItems([...items, newItem]);
  };

  const addFriend = (template: typeof FRIEND_TEMPLATES[0]) => {
    const newFriend: Friend = {
      id: Math.random().toString(36).substr(2, 9),
      ...template,
      position: { x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10 }
    };
    setFriends([...friends, newFriend]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const removeFriend = (id: string) => {
    setFriends(friends.filter(f => f.id !== id));
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatFriend || !chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { sender: 'You', text: userMsg }]);
    setIsTyping(true);

    const furnitureNames = items.map(i => FURNITURE_CATALOG.find(f => f.id === i.furnitureId)?.name || '');
    const context = furnitureNames.join(', ');
    
    const response = await getFriendMessage(chatFriend, context, userMsg);
    
    setChatHistory(prev => [...prev, { sender: chatFriend.name, text: response }]);
    setIsTyping(false);
  };

  const handleGenerateStory = async () => {
    if (friends.length === 0) return;
    const furnitureNames = items.map(i => FURNITURE_CATALOG.find(f => f.id === i.furnitureId)?.name || '');
    const story = await generateApartmentStory(friends, furnitureNames);
    setApartmentStory(story);
    setShowStory(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-cozy-clay p-6 flex flex-col gap-6 z-10 shadow-lg">
        <header>
          <h1 className="text-3xl font-bold text-cozy-terracotta flex items-center gap-2">
            <Home className="w-8 h-8" />
            Cozy Friends
          </h1>
          <p className="text-sm text-gray-500 italic mt-1">Build your little sanctuary.</p>
        </header>

        <div className="flex bg-cozy-cream rounded-full p-1">
          <button 
            onClick={() => setActiveTab('furniture')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'furniture' ? 'bg-white shadow-sm text-cozy-terracotta' : 'text-gray-500'}`}
          >
            <Package size={16} /> Furniture
          </button>
          <button 
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'friends' ? 'bg-white shadow-sm text-cozy-terracotta' : 'text-gray-500'}`}
          >
            <Users size={16} /> Friends
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {activeTab === 'furniture' ? (
            <div className="grid grid-cols-2 gap-3">
              {FURNITURE_CATALOG.map(f => (
                <motion.button
                  key={f.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addItem(f)}
                  className="bg-cozy-cream hover:bg-white border border-transparent hover:border-cozy-clay p-4 rounded-2xl flex flex-col items-center gap-2 transition-all"
                >
                  <span className="text-3xl">{f.icon}</span>
                  <span className="text-xs font-medium text-gray-600">{f.name}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {FRIEND_TEMPLATES.map(t => (
                <motion.button
                  key={t.name}
                  whileHover={{ x: 5 }}
                  onClick={() => addFriend(t)}
                  className="bg-cozy-cream hover:bg-white border border-transparent hover:border-cozy-clay p-4 rounded-2xl flex items-center gap-4 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner" style={{ backgroundColor: t.color }}>
                    {t.species === 'Cat' ? '🐱' : t.species === 'Bird' ? '🐦' : t.species === 'Bear' ? '🐻' : '🦋'}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.personality}</div>
                  </div>
                  <Plus size={16} className="ml-auto text-cozy-terracotta" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={handleGenerateStory}
          disabled={friends.length === 0}
          className="mt-auto bg-cozy-terracotta text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
        >
          <Sparkles size={18} /> Generate Story
        </button>
      </div>

      {/* Main Apartment View */}
      <main className="flex-1 relative bg-cozy-cream p-4 md:p-12 overflow-hidden">
        <div 
          ref={gridRef}
          className="w-full h-full bg-white rounded-[40px] shadow-2xl border-8 border-cozy-clay relative pixel-grid overflow-hidden"
        >
          {/* Furniture Items */}
          <AnimatePresence>
            {items.map(item => {
              const catalogItem = FURNITURE_CATALOG.find(f => f.id === item.furnitureId);
              return (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  drag
                  dragConstraints={gridRef}
                  className="absolute cursor-grab active:cursor-grabbing group"
                  style={{ left: `${item.position.x}%`, top: `${item.position.y}%` }}
                >
                  <div className="text-5xl md:text-6xl select-none drop-shadow-sm">
                    {catalogItem?.icon}
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Friends */}
          <AnimatePresence>
            {friends.map(friend => (
              <motion.div
                key={friend.id}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                drag
                dragConstraints={gridRef}
                className="absolute cursor-grab active:cursor-grabbing group flex flex-col items-center"
                style={{ left: `${friend.position.x}%`, top: `${friend.position.y}%` }}
              >
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-lg border-4 border-white relative"
                  style={{ backgroundColor: friend.color }}
                >
                  {friend.species === 'Cat' ? '🐱' : friend.species === 'Bird' ? '🐦' : friend.species === 'Bear' ? '🐻' : '🦋'}
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-sm"
                  >
                    <MessageSquare size={12} className="text-cozy-terracotta" />
                  </motion.div>
                </div>
                <div className="mt-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-cozy-clay">
                  {friend.name}
                </div>
                
                <div className="absolute -top-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setChatFriend(friend);
                      setChatHistory([]);
                    }}
                    className="bg-cozy-sage text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button 
                    onClick={() => removeFriend(friend.id)}
                    className="bg-red-400 text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && friends.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cozy-clay pointer-events-none">
              <Plus size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-serif italic opacity-40">Add some furniture or friends to start...</p>
            </div>
          )}
        </div>
      </main>

      {/* Chat Modal */}
      <AnimatePresence>
        {chatFriend && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 flex items-center gap-4 border-b border-cozy-cream" style={{ backgroundColor: `${chatFriend.color}20` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm border-2 border-white" style={{ backgroundColor: chatFriend.color }}>
                  {chatFriend.species === 'Cat' ? '🐱' : chatFriend.species === 'Bird' ? '🐦' : chatFriend.species === 'Bear' ? '🐻' : '🦋'}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{chatFriend.name}</h3>
                  <p className="text-xs text-gray-500 italic">{chatFriend.personality}</p>
                </div>
                <button onClick={() => setChatFriend(null)} className="ml-auto p-2 hover:bg-white/50 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-cozy-cream/30">
                {chatHistory.length === 0 && (
                  <p className="text-center text-gray-400 italic text-sm my-8">Say hello to {chatFriend.name}!</p>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender === 'You' ? 'bg-cozy-terracotta text-white rounded-tr-none' : 'bg-white text-cozy-ink rounded-tl-none border border-cozy-clay'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1 uppercase tracking-wider font-bold">{msg.sender}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-400 italic text-xs">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <span>{chatFriend.name} is thinking...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleChat} className="p-4 bg-white border-t border-cozy-cream flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={`Chat with ${chatFriend.name}...`}
                  className="flex-1 bg-cozy-cream border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-cozy-terracotta outline-none"
                />
                <button 
                  type="submit"
                  disabled={!chatMessage.trim() || isTyping}
                  className="bg-cozy-terracotta text-white p-3 rounded-full shadow-md disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  <ChevronRight size={20} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Modal */}
      <AnimatePresence>
        {showStory && apartmentStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 2 }}
              className="bg-white p-12 rounded-[48px] shadow-2xl max-w-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cozy-terracotta via-cozy-sage to-cozy-clay" />
              <Sparkles className="mx-auto mb-6 text-cozy-terracotta w-12 h-12" />
              <h2 className="text-4xl font-serif italic mb-6 text-cozy-ink">A Cozy Tale</h2>
              <p className="text-xl font-serif leading-relaxed text-gray-700 italic">
                "{apartmentStory}"
              </p>
              <button 
                onClick={() => setShowStory(false)}
                className="mt-10 bg-cozy-ink text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all"
              >
                Close Story
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e8d5c4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d67d61;
        }
      `}</style>
    </div>
  );
}
