import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertTriangle, Shield, Video, Zap, Award, Search, Filter, MoreVertical, Trash2 } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { mockData } from '../data/mockData';

const Notifications = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
          <p className="text-premium-text">Stay updated with your courses and security alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">Mark all as read</Button>
          <Button variant="outline" size="icon"><Trash2 className="w-5 h-5" /></Button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-premium-border pb-1">
        {['All', 'Courses', 'Security', 'Achievements'].map((tab) => (
          <button 
            key={tab}
            className={`pb-3 px-4 text-sm font-bold transition-all relative ${
              tab === 'All' ? 'text-white' : 'text-premium-text hover:text-white'
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
            <GlassCard className="group hover:border-premium-accent/30">
              <div className="flex gap-6">
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  notif.type === 'urgent' ? 'bg-red-500/10' : 
                  notif.type === 'success' ? 'bg-green-500/10' : 
                  notif.type === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                }`}>
                  <notif.icon className={`w-6 h-6 ${
                    notif.type === 'urgent' ? 'text-red-400' : 
                    notif.type === 'success' ? 'text-green-400' : 
                    notif.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg group-hover:text-premium-accent transition-colors">{notif.title}</h3>
                    <span className="text-xs text-premium-text font-medium">{notif.time}</span>
                  </div>
                  <p className="text-premium-text text-sm leading-relaxed mb-4">{notif.message}</p>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">View Details</Button>
                    <div className="h-4 w-px bg-premium-border/50"></div>
                    <button className="text-xs text-premium-text hover:text-white transition-colors">Dismiss</button>
                  </div>
                </div>
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-premium-text hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="pt-10 flex flex-col items-center">
        <p className="text-premium-text text-sm mb-6">You're all caught up!</p>
        <div className="w-12 h-12 bg-premium-border/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-premium-text" />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
