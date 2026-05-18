import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, SkipForward, SkipBack, Settings, Maximize, Volume2, Shield, 
  Lock, CheckCircle, FileText, Download, Monitor, Menu, X, Eye, 
  AlertTriangle, Fingerprint, ShieldAlert, BadgeAlert, HelpCircle, ArrowLeft
} from 'lucide-react';
import { Button, GlassCard, Badge } from '../components/UI';
import { mockData } from '../data/mockData';
import { Link } from 'react-router-dom';

const CourseWatch = () => {
  const [activeLecture, setActiveLecture] = useState(mockData.lectures[3]); // Default to "Commercial Debt Leveraging"
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [watermarkPos, setWatermarkPos] = useState({ top: '20%', left: '15%' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showSettings, setShowSettings] = useState(false);
  const [videoProgress, setVideoProgress] = useState(45); // default progress percentage

  // Shifting Anti-Piracy Watermark positioning for maximum security
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 65 + 15)}%`,
        left: `${Math.floor(Math.random() * 65 + 15)}%`
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-premium-bg flex flex-col z-[60] overflow-hidden text-left font-sans">
      
      {/* Platform Header (Light Premium Navbar) */}
      <header className="h-20 border-b border-premium-border px-6 flex items-center justify-between bg-white/95 backdrop-blur-md shadow-sm z-40">
        <div className="flex items-center gap-4">
          <Link to="/courses">
            <Button variant="outline" size="icon" className="h-10 w-10 text-slate-500 hover:text-premium-heading border border-premium-border bg-white shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="h-6 w-px bg-premium-border"></div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-9 h-9 bg-blue-50 rounded-lg items-center justify-center border border-blue-100">
              <Shield className="text-premium-accent w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-premium-accent font-black uppercase tracking-widest leading-none">Active Blueprint Session</p>
              <h1 className="font-black text-sm md:text-base text-premium-heading mt-1.5 truncate max-w-[200px] md:max-w-md">
                {activeLecture.title}
              </h1>
            </div>
          </div>
          <Badge variant="premium" className="hidden lg:inline-flex rounded-lg h-7 text-[9px] font-black tracking-wider bg-violet-50 text-violet-600 border border-violet-100">L3 DRM Stream</Badge>
        </div>
        
        {/* Connection status */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-premium-border px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-500 font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>NODE: MIA-SEC-08</span>
          </div>
          <div className="h-6 w-px bg-premium-border"></div>
          <Link to="/courses">
            <Button variant="danger" size="sm" className="h-10 px-5 text-xs uppercase font-black tracking-widest rounded-lg shadow-sm">
              Close Broadcast
            </Button>
          </Link>
        </div>
      </header>

      {/* Main UI Area */}
      <div className="flex-1 flex overflow-hidden z-30">
        
        {/* Immersive Content Player & Video controls */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-premium-bg relative">
          
          {/* ANTI-RECORDING DRM INDICATOR (Soft pastel rose alerts) */}
          <div className="bg-red-50 border-b border-red-100 px-6 py-2.5 flex items-center justify-between gap-4 z-30 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-red-500 w-4 h-4 animate-pulse shrink-0" />
              <p className="text-[10px] md:text-xs font-bold text-red-600 tracking-wide">
                BJ REALITY PROTECTION SYSTEM ACTIVE: Screen sharing, capture utilities, or external recordings will trigger session termination.
              </p>
            </div>
            <Badge variant="danger" className="text-[8px] tracking-widest font-black uppercase shrink-0 py-0.5 px-2 bg-red-100 text-red-700 border border-red-200">DRM SHIELD ENABLED</Badge>
          </div>

          {/* Immersive Video Screen (Keep dark background for media display) */}
          <div className="relative aspect-video max-h-[55vh] lg:max-h-[60vh] bg-slate-950 group overflow-hidden border-b border-slate-900 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Background Mock Thumbnail */}
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isPlaying ? 'opacity-30 blur-[1px]' : 'opacity-40 blur-none'
                }`}
                alt="Lecture Visual"
              />
              
              {/* Dark Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85"></div>

              {/* Large Play/Pause Toggle Indicator */}
              <motion.button 
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-gradient-premium text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/25 z-30 cursor-pointer border border-blue-400/20"
              >
                {isPlaying ? (
                  <div className="flex gap-1.5 justify-center items-center">
                    <div className="w-2.5 h-7 bg-white rounded-full"></div>
                    <div className="w-2.5 h-7 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1 text-white" />
                )}
              </motion.button>
              
              {/* Pulsing Encrypted stream banner */}
              {!isPlaying && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-800 px-6 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl z-20">
                  <Fingerprint className="text-premium-accent w-5 h-5 animate-pulse" />
                  <span className="text-[10px] text-white font-mono uppercase tracking-widest font-bold">Secure AES-256 Underwriting Stream Locked</span>
                </div>
              )}
            </div>

            {/* Anti-Piracy Dynamic Watermark Overlay */}
            <motion.div 
              animate={{ top: watermarkPos.top, left: watermarkPos.left }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute pointer-events-none text-white/5 text-[9px] font-mono z-30 select-none whitespace-nowrap leading-relaxed tracking-wider border border-white/5 bg-white/[0.01] p-3 rounded-lg"
            >
              <p className="font-bold">USER: john.doe@bjreality.com</p>
              <p>SECURE NODE: 192.168.1.104</p>
              <p>AUTH KEY: BJ-SEC-2938481</p>
              <p>TIMESTAMP: {new Date().toISOString().slice(0, 19).replace('T', ' ')}</p>
            </motion.div>

            {/* Encrypted Stream indicator overlay (top corner of video) */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Secure Stream Authenticated
              </div>
            </div>

            {/* Cinematic Controls Panel overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-30 space-y-4">
              
              {/* Custom Scrubbing Timeline Bar */}
              <div className="relative h-1.5 w-full bg-white/15 rounded-full cursor-pointer group/timeline">
                <div 
                  className="absolute top-0 left-0 h-full bg-premium-accent rounded-full shadow-[0_0_10px_rgba(37,99,235,0.6)]" 
                  style={{ width: `${videoProgress}%` }}
                ></div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover/timeline:opacity-100 transition-opacity shadow-lg"
                  style={{ left: `calc(${videoProgress}% - 7px)` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="text-white/70 hover:text-premium-accent transition-colors cursor-pointer"><SkipBack className="w-5 h-5" /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-premium-accent transition-colors cursor-pointer"
                  >
                    {isPlaying ? (
                      <span className="font-bold text-xs uppercase tracking-wider font-mono">PAUSE</span>
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
                    )}
                  </button>
                  <button className="text-white/70 hover:text-premium-accent transition-colors cursor-pointer"><SkipForward className="w-5 h-5" /></button>
                  
                  {/* Volume Slider */}
                  <div className="flex items-center gap-3 ml-4">
                    <Volume2 className="w-4 h-4 text-white/50" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-16 h-1 bg-white/25 rounded-full appearance-none cursor-pointer accent-premium-accent"
                    />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono ml-4 uppercase tracking-widest">14:15 / 32:10</span>
                </div>
                
                <div className="flex items-center gap-5">
                  <span className="text-[9px] font-bold text-premium-accent bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded tracking-widest font-mono">4K UHD</span>
                  <button className="text-white/60 hover:text-white transition-colors cursor-pointer"><Settings className="w-4.5 h-4.5" /></button>
                  <button className="text-white/60 hover:text-white transition-colors cursor-pointer"><Maximize className="w-4.5 h-4.5" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Area */}
          <div className="flex-1 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-6 border-b border-premium-border mb-6">
              {['Overview', 'Spreadsheets & Resources', 'Student Notes', 'Q&A Chat'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-bold text-sm transition-all relative cursor-pointer ${
                    activeTab === tab ? 'text-premium-heading font-extrabold' : 'text-slate-400 hover:text-premium-heading'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="watchTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-accent" />
                  )}
                </button>
              ))}
            </div>

            <div className="max-w-4xl space-y-6 text-left">
              {activeTab === 'Overview' && (
                <div className="space-y-6 animate-in">
                  <h2 className="text-xl font-black text-premium-heading">Syllabus Overview</h2>
                  <p className="text-sm text-premium-text leading-relaxed font-medium">
                    This active underwriting module breaks down debt and equity cascading models. 
                    We walk through multi-family mortgage amortization rules, debt service coverage ratio (DSCR) underwriting 
                    benchmarks, and exit valuation models using modern caps rates.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-white border border-premium-border rounded-xl shadow-sm">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <CheckCircle className="text-premium-accent w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-premium-heading">Advanced DSCR Leveraging models</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white border border-premium-border rounded-xl shadow-sm">
                      <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                        <Shield className="text-premium-accent w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-premium-heading">Risk Sensitivity Matrices</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Spreadsheets & Resources' && (
                <div className="space-y-3 animate-in">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 mb-4 shadow-sm">
                    <AlertTriangle className="text-amber-600 w-5 h-5 shrink-0" />
                    <p className="text-xs text-premium-text leading-normal font-bold">
                      <strong>Intellectual Property Protected:</strong> Downloaded Excel files contain active student digital watermarks to audit external file leaking.
                    </p>
                  </div>

                  {[
                    { name: 'Commercial_Underwriting_Matrix_v4.xlsx', size: '3.4 MB', desc: 'Cap rate calculator, GP/LP waterfall split formulas.' },
                    { name: 'Multi-Family_DSCR_Modeler.xlsx', size: '1.9 MB', desc: 'Mortgage amortization tables, DSCR audit spreadsheets.' },
                    { name: 'Real_Estate_Lease_Due_Diligence.pdf', size: '8.5 MB', desc: 'Full commercial tenant lease review checklist.' }
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-premium-border group hover:border-premium-accent/40 transition-all shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 border border-premium-border flex items-center justify-center rounded-lg">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-premium-heading leading-none">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1.5">{file.desc} • {file.size}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="icon" className="h-9 w-9 bg-white border border-premium-border hover:border-premium-accent/40 text-slate-400">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Student Notes' && (
                <div className="space-y-4 animate-in">
                  <textarea 
                    placeholder="Jot down active formulas, cap rate findings, or course notes..." 
                    className="w-full h-40 bg-white border border-premium-border rounded-xl p-4 text-sm text-premium-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent font-semibold shadow-sm"
                  ></textarea>
                  <Button variant="primary" className="text-xs uppercase tracking-wider font-black h-11 px-6">Save Session Notes</Button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar Content Tree & Security Monitor (Light Theme) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col bg-white border-l border-premium-border shrink-0 z-10 shadow-sm"
            >
              
              {/* Progress and Header */}
              <div className="p-6 border-b border-premium-border space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-widest text-premium-heading">Course Syllabus</h3>
                  <span className="text-[10px] font-mono font-black text-premium-accent bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">62% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
                  <div className="h-full bg-premium-accent" style={{ width: '62%' }}></div>
                </div>
              </div>
              
              {/* Lecture Playlist */}
              <div className="flex-1 overflow-y-auto custom-scrollbar text-left">
                {mockData.lectures.map((lecture, i) => (
                  <div 
                    key={lecture.id}
                    onClick={() => !lecture.locked && setActiveLecture(lecture)}
                    className={`p-5 border-b border-slate-100 cursor-pointer transition-all ${
                      activeLecture.id === lecture.id 
                        ? 'bg-blue-50/50 border-l-2 border-l-premium-accent' 
                        : 'hover:bg-slate-50'
                    } ${lecture.locked ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-0.5">
                        {lecture.completed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : lecture.locked ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border ${
                            activeLecture.id === lecture.id ? 'border-premium-accent' : 'border-premium-border'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-xs mb-1 truncate leading-none ${
                          activeLecture.id === lecture.id ? 'text-premium-accent font-black' : 'text-premium-heading'
                        }`}>
                          Module {i + 1}: {lecture.title}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono uppercase mt-1.5">
                          <span>{lecture.duration}</span>
                          {lecture.locked && <span className="text-premium-accent font-black">Premium Only</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secure Active Device Logs (Light Grey) */}
              <div className="p-6 bg-slate-50 border-t border-premium-border space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <Monitor className="text-premium-accent w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">Security Center</p>
                    <p className="text-xs font-bold text-premium-heading mt-1">Active: Workstation Node</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-premium-border text-[9px] font-mono text-slate-500 space-y-1 shadow-sm font-semibold">
                  <p className="text-emerald-600 font-black">● NODE VERIFIED SECURE</p>
                  <p>IP Trace: 192.168.1.104</p>
                  <p>Device: Chrome Desktop (Linux)</p>
                </div>
                <Button variant="outline" className="w-full text-[10px] uppercase font-black tracking-widest h-10 bg-white border border-premium-border text-slate-500">
                  Audit Security Keys
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseWatch;
