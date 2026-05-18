import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertTriangle, Shield, Video, Zap, Award, Search, Filter, MoreVertical, Trash2 } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { mockData } from '../data/mockData';

const Notifications = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-premium-heading mb-2">Notification Center</h1>
          <p className="text-sm text-slate-400 font-bold">Stay updated with your courses and security alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-premium-heading font-black text-xs">
            Mark all as read
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 p-0 flex items-center justify-center bg-white border border-premium-border hover:border-premium-accent/40 rounded-xl shadow-sm text-slate-400 hover:text-premium-heading">
            <Trash2 className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-premium-border pb-1">
        {['All', 'Courses', 'Security', 'Achievements'].map((tab) => (
          <button 
            key={tab}
            className={`pb-3 px-4 text-sm font-black transition-all relative ${
              tab === 'All' ? 'text-premium-accent' : 'text-slate-400 hover:text-premium-heading'
            }`}
          >
            {tab}
            {tab === 'All' && (
              <motion.div layoutId="notifTab" className="absolute bottom-0 left-0 right-0 h-1 bg-premium-accent rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mockData.notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="group hover:border-premium-accent/20 bg-white border border-premium-border p-6 shadow-sm rounded-2xl transition-all">
              <div className="flex gap-6">
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${
                  notif.type === 'urgent' ? 'bg-red-50 text-red-500 border-red-100' : 
                  notif.type === 'success' ? 'bg-green-50 text-green-500 border-green-100' : 
                  notif.type === 'warning' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                }`}>
                  <notif.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-base text-premium-heading group-hover:text-premium-accent transition-colors">{notif.title}</h3>
                    <span className="text-xs text-slate-400 font-bold">{notif.time}</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 font-semibold">{notif.message}</p>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-premium-border/40 font-bold">
                      View Details
                    </Button>
                    <div className="h-4 w-px bg-premium-border"></div>
                    <button className="text-xs text-slate-400 hover:text-premium-heading transition-colors font-bold">Dismiss</button>
                  </div>
                </div>
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-premium-heading transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="pt-10 flex flex-col items-center">
        <p className="text-slate-400 text-sm font-bold mb-4">You're all caught up!</p>
        <div className="w-12 h-12 bg-slate-100 border border-premium-border rounded-full flex items-center justify-center shadow-sm">
          <CheckCircle className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
