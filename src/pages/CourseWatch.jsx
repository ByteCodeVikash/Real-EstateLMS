import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, SkipBack, Settings, Maximize, Volume2, Shield, Lock, CheckCircle, MessageSquare, FileText, Share2, Download, Eye, Smartphone, Monitor, Menu, X, ChevronDown, Clock } from 'lucide-react';
import { Button, GlassCard, Badge } from '../components/UI';
import { mockData } from '../data/mockData';

const CourseWatch = () => {
  const [activeLecture, setActiveLecture] = useState(mockData.lectures[3]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [watermarkPos, setWatermarkPos] = useState({ top: '15%', left: '15%' });

  // Handle dynamic watermark positioning for content protection
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 75 + 10)}%`,
        left: `${Math.floor(Math.random() * 75 + 10)}%`
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-premium-dark flex flex-col z-[60] overflow-hidden">
      {/* Platform Header */}
      <header className="h-16 border-b border-premium-border/50 px-6 flex items-center justify-between bg-premium-card/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="text-premium-accent w-5 h-5" />
            <h1 className="font-bold text-sm md:text-base truncate max-w-[200px] md:max-w-md">
              {activeLecture.title}
            </h1>
          </div>
          <Badge variant="premium" className="hidden sm:block">Verified Session</Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-premium-text">
            <Monitor className="w-4 h-4" />
            <span>Node: NYC-SEC-04</span>
          </div>
          <div className="h-4 w-px bg-premium-border"></div>
          <Button variant="danger" size="sm" className="h-9 px-4 rounded-lg">
            End Session
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Cinematic Content Player */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="relative aspect-video bg-black group overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover opacity-40 blur-[2px]"
                alt="Lecture Background"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-premium-accent rounded-full flex items-center justify-center shadow-2xl shadow-premium-accent/40 z-10"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </motion.button>
            </div>

            {/* Anti-Piracy Watermark Engine */}
            <motion.div 
              animate={{ top: watermarkPos.top, left: watermarkPos.left }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute pointer-events-none text-white/5 text-[10px] font-mono z-20 select-none whitespace-nowrap tracking-widest"
            >
              ID: RE-29384-JD <br />
              TRACE: 192.168.1.45 <br />
              AUTH: {new Date().toLocaleDateString()}
            </motion.div>

            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white">
                <Shield className="w-3 h-3 text-premium-accent" />
                Stream Encrypted
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-30">
              <div className="relative h-1 w-full bg-white/10 rounded-full mb-6 cursor-pointer group/progress">
                <div className="absolute top-0 left-0 h-full w-[45%] bg-premium-accent shadow-[0_0_10px_rgba(124,58,237,0.5)]"></div>
                <div className="absolute top-0 left-0 h-full w-[60%] bg-white/5"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="text-white/80 hover:text-premium-accent transition-colors"><SkipBack className="w-5 h-5" /></button>
                  <button className="text-white hover:text-premium-accent transition-colors"><Play className="w-6 h-6 fill-current" /></button>
                  <button className="text-white/80 hover:text-premium-accent transition-colors"><SkipForward className="w-5 h-5" /></button>
                  <div className="flex items-center gap-4 ml-4">
                    <Volume2 className="w-4 h-4 text-white/60" />
                    <div className="w-16 h-1 bg-white/10 rounded-full">
                      <div className="w-3/4 h-full bg-white/40 rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono ml-4 uppercase tracking-tighter">14:22 / 28:30</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-bold text-premium-accent tracking-widest">4K ULTRA HD</span>
                  <button className="text-white/60 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
                  <button className="text-white/60 hover:text-white transition-colors"><Maximize className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-premium-dark p-8">
             <div className="flex items-center gap-8 border-b border-premium-border/30 mb-8">
               {['Overview', 'Resources', 'Notes', 'Q&A'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-bold text-sm transition-all relative ${
                    activeTab === tab ? 'text-white' : 'text-premium-text hover:text-white'
                  }`}
                 >
                   {tab}
                   {activeTab === tab && (
                     <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-accent" />
                   )}
                 </button>
               ))}
             </div>

             <div className="max-w-4xl">
                {activeTab === 'Overview' && (
                  <div className="space-y-6 animate-in">
                    <h2 className="text-2xl font-bold">Session Overview</h2>
                    <p className="text-premium-text leading-relaxed text-sm">
                      This module focuses on advanced valuation modeling for large-scale commercial assets. 
                      We analyze the relationship between interest rate volatility and capitalization rates in the 2026 market cycle.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-premium-card/50 rounded-xl border border-premium-border/50">
                        <div className="w-10 h-10 bg-blue-500/5 rounded-lg flex items-center justify-center">
                          <CheckCircle className="text-blue-400 w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium">Cap Rate Sensitivity Analysis</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-premium-card/50 rounded-xl border border-premium-border/50">
                        <div className="w-10 h-10 bg-purple-500/5 rounded-lg flex items-center justify-center">
                          <Shield className="text-purple-400 w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium">Risk-Adjusted Return Models</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Resources' && (
                  <div className="space-y-3 animate-in">
                    {[
                      { name: 'Market_Cycle_Report_Q1_2026.pdf', size: '4.2 MB' },
                      { name: 'Valuation_Matrix_Template.xlsx', size: '1.8 MB' },
                      { name: 'Case_Study_Urban_Dev.zip', size: '24.5 MB' }
                    ].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-premium-card/30 rounded-xl border border-premium-border/30 group hover:border-premium-accent/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-premium-border/50 flex items-center justify-center rounded-lg">
                            <FileText className="w-4 h-4 text-premium-text" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{file.name}</p>
                            <p className="text-[10px] text-premium-text uppercase">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </main>

        {/* Sidebar Content Tree */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col bg-premium-card border-l border-premium-border/50"
            >
              <div className="p-6 border-b border-premium-border/50 flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest">Course Progress</h3>
                <span className="text-[10px] font-mono text-premium-accent bg-premium-accent/10 px-2 py-0.5 rounded">62%</span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {mockData.lectures.map((lecture, i) => (
                  <div 
                    key={lecture.id}
                    onClick={() => !lecture.locked && setActiveLecture(lecture)}
                    className={`p-5 border-b border-premium-border/10 cursor-pointer transition-all ${
                      activeLecture.id === lecture.id ? 'bg-premium-accent/5 border-l-2 border-l-premium-accent' : 'hover:bg-premium-border/5'
                    } ${lecture.locked ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        {lecture.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : lecture.locked ? (
                          <Lock className="w-4 h-4 text-premium-text" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border ${activeLecture.id === lecture.id ? 'border-premium-accent' : 'border-premium-border'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-xs mb-1 truncate ${activeLecture.id === lecture.id ? 'text-premium-accent' : 'text-white'}`}>
                          MOD-{i + 1}: {lecture.title}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-premium-text uppercase font-mono">
                          <span>{lecture.duration}</span>
                          {lecture.locked && <span className="text-premium-accent">Premium Only</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-premium-dark/30 border-t border-premium-border/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-premium-accent/10 rounded-lg flex items-center justify-center">
                    <Shield className="text-premium-accent w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-premium-text uppercase tracking-tighter">Session Guard</p>
                    <p className="text-xs font-bold">Active Encryption L1</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-[10px] uppercase font-bold tracking-widest h-10">Verify Access Key</Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseWatch;
