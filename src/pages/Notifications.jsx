import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Shield, Video, Zap, Award, MoreVertical, Trash2, X } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { mockData } from '../data/mockData';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

// Icon map for deserialized notifications (icons cannot be JSON-serialized)
const ICON_MAP = { Video, Zap, Shield, Award };

// Seed notifications injected from mockData — serialize only primitives
const SEED_NOTIFICATIONS = mockData.notifications.map((n) => ({
  id:      n.id,
  title:   n.title,
  message: n.message,
  time:    n.time,
  type:    n.type,
  iconKey: n.icon?.displayName || n.icon?.name || 'Zap',
}));

const TABS = ['All', 'Courses', 'Security', 'Achievements'];

const TAB_FILTER = {
  All:          () => true,
  Courses:      (n) => ['info'].includes(n.type),
  Security:     (n) => ['warning', 'urgent'].includes(n.type),
  Achievements: (n) => ['success'].includes(n.type),
};

const TYPE_STYLES = {
  urgent:  { card: 'bg-red-500/10 text-red-500 border-red-500/20' },
  success: { card: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  warning: { card: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  info:    { card: 'bg-[#0A66C2]/10 text-blue-500 border-[#0A66C2]/20' },
};

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');

  // Dismissed IDs persisted to localStorage
  const [dismissedIds, setDismissedIds] = useState(
    () => loadFromStorage(STORAGE_KEYS.notifDismissed, [])
  );

  // Read IDs persisted to localStorage
  const [readIds, setReadIds] = useState(
    () => loadFromStorage(STORAGE_KEYS.notifRead, [])
  );

  // Persist dismissed IDs whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.notifDismissed, dismissedIds);
  }, [dismissedIds]);

  // Persist read IDs whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.notifRead, readIds);
  }, [readIds]);

  // Visible notifications (excluding dismissed)
  const visible = SEED_NOTIFICATIONS.filter(
    (n) => !dismissedIds.includes(n.id) && TAB_FILTER[activeTab](n)
  );

  const unreadCount = SEED_NOTIFICATIONS.filter(
    (n) => !dismissedIds.includes(n.id) && !readIds.includes(n.id)
  ).length;

  const handleDismiss = (id) => {
    setDismissedIds((prev) => [...prev, id]);
    // Auto-mark as read when dismissed
    setReadIds((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleMarkRead = (id) => {
    setReadIds((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleMarkAllRead = () => {
    const allIds = SEED_NOTIFICATIONS.map((n) => n.id);
    setReadIds(allIds);
  };

  const handleClearAll = () => {
    const allIds = SEED_NOTIFICATIONS.map((n) => n.id);
    setDismissedIds(allIds);
    setReadIds(allIds);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white">Notification Center</h1>
          <p className="text-sm text-slate-400 font-bold">
            Stay updated with your courses and security alerts.
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center bg-premium-accent/10 text-premium-accent border border-premium-accent/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-slate-400 hover:text-white font-black text-xs cursor-pointer"
          >
            Mark all as read
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearAll}
            className="h-10 w-10 p-0 flex items-center justify-center bg-[#0b0b0d] border border-premium-border hover:border-red-300 hover:text-red-500 rounded-xl shadow-sm text-slate-400 cursor-pointer"
            title="Clear all notifications"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-premium-border pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-sm font-black transition-all relative cursor-pointer focus:outline-none ${
              activeTab === tab ? 'text-premium-accent' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="notifTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-premium-accent rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Notification Cards */}
      <div className="space-y-4">
        {visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center justify-center text-center bg-[#0b0b0d] rounded-3xl border border-premium-border shadow-sm"
          >
            <div className="w-14 h-14 bg-[#0f0f12] border border-premium-border rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <Bell className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-black text-white mb-1">All Clear</h3>
            <p className="text-xs text-slate-400 font-bold max-w-xs">
              No notifications in this category. Check back later.
            </p>
          </motion.div>
        ) : (
          visible.map((notif, index) => {
            const isRead = readIds.includes(notif.id);
            const IconComponent = ICON_MAP[notif.iconKey] || Zap;
            const typeStyle = TYPE_STYLES[notif.type] || TYPE_STYLES.info;

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => handleMarkRead(notif.id)}
              >
                <GlassCard
                  className={`group hover:border-premium-accent/20 bg-[#0b0b0d] border p-6 shadow-sm rounded-2xl transition-all cursor-pointer ${
                    isRead
                      ? 'border-premium-border opacity-80'
                      : 'border-premium-accent/20 shadow-md shadow-blue-500/5'
                  }`}
                >
                  <div className="flex gap-5">
                    {/* Unread dot */}
                    <div className="relative shrink-0 self-start mt-1">
                      {!isRead && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-premium-accent rounded-full border-2 border-white z-10" />
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${typeStyle.card}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1.5 gap-3">
                        <h3 className={`font-bold text-base transition-colors group-hover:text-premium-accent ${
                          isRead ? 'text-premium-text' : 'text-white'
                        }`}>
                          {notif.title}
                        </h3>
                        <span className="text-xs text-slate-400 font-bold shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 font-semibold">{notif.message}</p>
                      <div className="flex items-center gap-4">
                        {!isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                            className="h-8 px-3 text-xs bg-[#0f0f12] hover:bg-[#111114] text-slate-600 rounded-lg border border-premium-border/40 font-bold cursor-pointer"
                          >
                            Mark Read
                          </Button>
                        )}
                        <div className="h-4 w-px bg-premium-border" />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDismiss(notif.id); }}
                          className="text-xs text-slate-400 hover:text-red-500 transition-colors font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Dismiss
                        </button>
                      </div>
                    </div>

                    {/* Kebab button */}
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-[#0f0f12] cursor-pointer"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {visible.length > 0 && (
        <div className="pt-6 flex flex-col items-center gap-3">
          <p className="text-slate-400 text-sm font-bold">You're all caught up!</p>
          <div className="w-12 h-12 bg-[#111114] border border-premium-border rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
