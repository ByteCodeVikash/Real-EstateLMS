import React from 'react';
import { motion } from 'framer-motion';
import { Video, Clock, Users, Calendar, ArrowRight, Play, User, Star } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { mockData } from '../data/mockData';

const LiveClasses = () => {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Live Classes</h1>
          <p className="text-premium-text">Join interactive sessions with industry experts.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Past Sessions</Button>
          <Button>My Schedule</Button>
        </div>
      </div>

      {/* Hero Section for Next Big Class */}
      <GlassCard className="p-0 overflow-hidden relative group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-premium-dark via-premium-dark/80 to-transparent"></div>
        </div>

        <div className="relative z-10 p-8 md:p-12 max-w-2xl">
          <Badge variant="danger" className="mb-6 animate-pulse px-4 py-1.5 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span> LIVE NOW
            </span>
          </Badge>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Advanced Cybersecurity Strategy: Protecting High-Value Content</h2>
          <p className="text-premium-text mb-8 text-lg">
            Join Dr. Sarah Chen for an exclusive deep dive into content protection strategies used by major streaming platforms.
          </p>
          <div className="flex flex-wrap items-center gap-8 mb-10">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-2 border-premium-accent" />
              <div>
                <p className="font-bold">Dr. Sarah Chen</p>
                <p className="text-sm text-premium-text">Security Architect</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-premium-border/50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-premium-accent" />
              </div>
              <div>
                <p className="font-bold">1.2k+</p>
                <p className="text-sm text-premium-text">Attending</p>
              </div>
            </div>
          </div>
          <Button size="lg" className="h-14 px-10">
            Join Session <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </GlassCard>

      {/* Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold mb-6">Upcoming Schedule</h3>
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="group hover:bg-premium-border/10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0 text-center md:border-r md:border-premium-border/50 md:pr-8">
                  <p className="text-3xl font-black text-premium-accent">17</p>
                  <p className="text-sm font-bold uppercase text-premium-text">May</p>
                  <p className="text-xs text-premium-text mt-2">10:00 AM</p>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl font-bold mb-2 group-hover:text-premium-accent transition-colors">
                    DRM Systems Architecture & Implementation
                  </h4>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-2 text-sm text-premium-text">
                      <User className="w-4 h-4" /> Michael Knight
                    </span>
                    <span className="flex items-center gap-2 text-sm text-premium-text">
                      <Clock className="w-4 h-4" /> 90 Minutes
                    </span>
                    <Badge variant="premium">Premium Only</Badge>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button variant="outline">Notify Me</Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Top Mentors */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Expert Mentors</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <GlassCard key={i} className="p-4 flex items-center gap-4 group cursor-pointer">
                <div className="relative">
                   <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-14 h-14 rounded-2xl object-cover" />
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-premium-accent rounded-lg border-2 border-premium-card flex items-center justify-center">
                     <Star className="w-3 h-3 text-white fill-current" />
                   </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold group-hover:text-premium-accent transition-colors">Alex Rivera</p>
                  <p className="text-xs text-premium-text">UX Design Principal</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold">4.9</span>
                    <span className="text-[10px] text-premium-text ml-1">(2.4k reviews)</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><ArrowRight className="w-5 h-5" /></Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
