import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Settings, Maximize, Volume2, Shield, 
  Lock, CheckCircle, FileText, Download, Monitor, Menu, X, Eye, 
  AlertTriangle, Fingerprint, ShieldAlert, ArrowLeft, Send, Sparkles, Trophy, HelpCircle, Activity
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Button, GlassCard, Badge } from '../components/UI';

const CourseWatch = () => {
  const { id } = useParams();
  const courseId = parseInt(id) || 1;

  // Course specifications map
  const coursesData = {
    1: {
      title: "Real Estate Sales Masterclass",
      category: "Sales Coaching",
      specializationBadge: "High Ticket",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
      lectures: [
        { id: 1, title: "Introduction to High-Ticket Sales Psychology", duration: "12:15", completed: true, locked: false, videoUrl: "" },
        { id: 2, title: "Structuring the Ideal Discovery Call", duration: "18:40", completed: true, locked: false, videoUrl: "" },
        { id: 3, title: "Overcoming Seller Fee & Commissions Objections", duration: "25:30", completed: true, locked: false, videoUrl: "" },
        { id: 4, title: "Constructing the Irresistible Listing Pitch", duration: "32:10", completed: false, locked: false, videoUrl: "" },
        { id: 5, title: "Creative Closing Anchors & Urgency Matrices", duration: "22:50", completed: false, locked: true, videoUrl: "" },
        { id: 6, title: "Exit Closing Roleplay: Luxury Buyers", duration: "28:15", completed: false, locked: true, videoUrl: "" }
      ],
      resources: [
        { name: "High_Ticket_Objection_Handling_Scripts.pdf", size: "4.2 MB", desc: "Verbatim bypass scripts for commission pushback." },
        { name: "BJ_Academy_Listing_Presentation_Deck.pptx", size: "12.8 MB", desc: "Editable premium slides for high-end pitches." }
      ],
      overviewText: "This active coaching syllabus details high-ticket sales objection handling, value positioning, and negotiation structures. Learn key objection-bypasses, high-impact listing slides, and behavioral close anchor formulas used by elite listing agents."
    },
    2: {
      title: "Property Investment Blueprint",
      category: "Investment",
      specializationBadge: "CRE Underwriting",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
      lectures: [
        { id: 1, title: "Macroeconomic Real Estate Cycles & Timing", duration: "14:20", completed: true, locked: false, videoUrl: "" },
        { id: 2, title: "Cap Rate Decoupling & Sensitivity Analysis", duration: "19:15", completed: true, locked: false, videoUrl: "" },
        { id: 3, title: "Structuring GP/LP Equity Splits & Cascades", duration: "28:45", completed: true, locked: false, videoUrl: "" },
        { id: 4, title: "Commercial Debt Leveraging & DSCR Modeling", duration: "34:50", completed: false, locked: false, videoUrl: "" },
        { id: 5, title: "Asset Optimization & Post-Purchase Value Add", duration: "24:10", completed: false, locked: true, videoUrl: "" },
        { id: 6, title: "Exit Underwriting & Refinancing Recaps", duration: "30:15", completed: false, locked: true, videoUrl: "" }
      ],
      resources: [
        { name: "Commercial_Underwriting_Matrix_v5.xlsx", size: "6.8 MB", desc: "GP/LP waterfall calculator, cap rate sensitivity templates." },
        { name: "Multi-Family_DSCR_Modeler_Sheet.xlsx", size: "3.2 MB", desc: "Debt amortization rules and DSCR leveraging matrices." }
      ],
      overviewText: "This premium underwriting syllabus breaks down debt and equity cascading models. We walk through multi-family mortgage amortization rules, debt service coverage ratio (DSCR) underwriting benchmarks, and exit valuation models using modern cap rates."
    },
    3: {
      title: "Broker Closing Psychology",
      category: "Negotiations",
      specializationBadge: "Creative Finance",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      lectures: [
        { id: 1, title: "Cognitive Reframing in High-Urgencies", duration: "11:45", completed: true, locked: false, videoUrl: "" },
        { id: 2, title: "Neuro-Anchoring Sales Matrices", duration: "16:20", completed: true, locked: false, videoUrl: "" },
        { id: 3, title: "Designing Creative Financing Proposals", duration: "24:10", completed: true, locked: false, videoUrl: "" },
        { id: 4, title: "Signature Stage Negotiation Overcomes", duration: "30:30", completed: false, locked: false, videoUrl: "" },
        { id: 5, title: "Advanced Deal Salvaging Under Stress", duration: "27:15", completed: false, locked: true, videoUrl: "" }
      ],
      resources: [
        { name: "Creative_Finance_Agreement_Templates.docx", size: "2.8 MB", desc: "Standard contracts for seller-financing and subject-to purchases." },
        { name: "Neuro_Anchoring_Sales_Handout.pdf", size: "1.5 MB", desc: "Visual anchor matrices and high-pressure close guidelines." }
      ],
      overviewText: "Uncover advanced psychological mechanisms used by the industry's top 1% brokers. Learn neuro-anchoring, seller-financing framing strategies, and transaction rescue protocols during high-stress closing standoffs."
    },
    4: {
      title: "Luxury Housing Market Training",
      category: "Luxury Marketing",
      specializationBadge: "HNW Residential",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      lectures: [
        { id: 1, title: "Unlocking HNW Networking Circles", duration: "15:30", completed: true, locked: false, videoUrl: "" },
        { id: 2, title: "Elite Branding & Property Styling Codes", duration: "20:45", completed: true, locked: false, videoUrl: "" },
        { id: 3, title: "Sourcing Secret Off-Market Listings", duration: "26:15", completed: false, locked: false, videoUrl: "" },
        { id: 4, title: "Concierge Listing Campaigns & Showings", duration: "31:40", completed: false, locked: true, videoUrl: "" },
        { id: 5, title: "High-Value Client Retention Secrets", duration: "22:15", completed: false, locked: true, videoUrl: "" }
      ],
      resources: [
        { name: "HNW_Client_Outreach_Swipe_File.docx", size: "1.9 MB", desc: "Concierge cold emails, exclusive listing agreements." },
        { name: "Luxury_House_Styling_Codebook.pdf", size: "7.4 MB", desc: "High-end staging protocols and off-market showing criteria." }
      ],
      overviewText: "Enter the ultra-high-net-worth real estate tier. This curriculum covers staging and branding rules, accessing HNW networking groups, securing highly exclusive off-market listings, and arranging high-value concierge showings."
    },
    5: {
      title: "Real Estate Lead Funnel",
      category: "Lead Gen",
      specializationBadge: "Digital Lead Gen",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      lectures: [
        { id: 1, title: "Hyper-Local Target Ads Strategy", duration: "10:15", completed: true, locked: false, videoUrl: "" },
        { id: 2, title: "Building High-Response Landing Magnets", duration: "15:50", completed: true, locked: false, videoUrl: "" },
        { id: 3, title: "Creating Automatic Email Nurture CRM", duration: "21:30", completed: false, locked: false, videoUrl: "" },
        { id: 4, title: "Lead Scoring & Fast Calling Workflows", duration: "26:40", completed: false, locked: true, videoUrl: "" },
        { id: 5, title: "Analytics: Optimizing Cost Per Acquisition", duration: "19:45", completed: false, locked: true, videoUrl: "" }
      ],
      resources: [
        { name: "Lead_Funnel_Google_Ads_Keywords.csv", size: "0.8 MB", desc: "Curated high-intent search keywords for buyer campaigns." },
        { name: "Auto_CRM_Nurture_Workflow.pdf", size: "2.2 MB", desc: "Visual automation maps and copy-paste SMS/email sequences." }
      ],
      overviewText: "Construct a automated marketing asset that sources listing leads on autopilot. This guide steps through high-impact Meta/Google Ads target parameters, custom lead magnets, automated CRMs, and call-back structures."
    }
  };

  const activeCourse = coursesData[courseId] || coursesData[1];

  const [activeLecture, setActiveLecture] = useState(activeCourse.lectures[3] || activeCourse.lectures[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [watermarkPos, setWatermarkPos] = useState({ top: '30%', left: '20%' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [showSettings, setShowSettings] = useState(false);
  const [videoProgress, setVideoProgress] = useState(38); // default progress percentage
  
  // Real-time Discussion Chat Panel state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Robert Sterling", role: "Instructor", message: "Keep a close watch on Cap rate margins when structuring the GP split splits. Hurdle rates are crucial.", time: "10:15 AM", isInstructor: true },
    { id: 2, sender: "Sarah Jenkins", role: "Elite Broker", message: "In my area, we have been anchoring owner financing at a solid 6.5%. The cash flow model behaves beautifully.", time: "10:22 AM", isInstructor: false },
    { id: 3, sender: "Elena Rodriguez", role: "Luxury Mentor", message: "Remember to emphasize local lifestyle assets, not just square footage, when presenting to HNW circles.", time: "10:35 AM", isInstructor: true }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Notebook states
  const [savedNotes, setSavedNotes] = useState('');
  const [notesList, setNotesList] = useState([]);

  // Shift Anti-Piracy Watermark coordinates dynamically to discourage screen recording
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 60 + 20)}%`,
        left: `${Math.floor(Math.random() * 60 + 20)}%`
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update active lecture if route parameter changes
  useEffect(() => {
    setActiveLecture(activeCourse.lectures[3] || activeCourse.lectures[0]);
  }, [courseId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: chatMessages.length + 1,
      sender: "Johnathan Doe",
      role: "Premium Student",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: false
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const handleSaveNote = () => {
    if (!savedNotes.trim()) return;
    const note = {
      id: notesList.length + 1,
      text: savedNotes,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lectureTitle: activeLecture.title
    };
    setNotesList([note, ...notesList]);
    setSavedNotes('');
    alert("Session note logged successfully in security dashboard!");
  };

  return (
    <div className="fixed inset-0 bg-[#070b13] flex flex-col z-[60] overflow-hidden text-left font-sans text-slate-300">
      
      {/* Cinematic Secure Header */}
      <header className="h-20 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl shadow-lg z-40">
        <div className="flex items-center gap-4">
          <Link to="/courses">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-md active:scale-95 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="h-6 w-px bg-slate-800"></div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-9 h-9 bg-premium-accent/10 rounded-xl items-center justify-center border border-premium-accent/20">
              <Shield className="text-premium-accent w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-premium-accent font-black uppercase tracking-widest leading-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-premium-accent animate-pulse"></span>
                Secure AES-256 Stream Session
              </p>
              <h1 className="font-black text-sm md:text-base text-white mt-1 truncate max-w-[200px] md:max-w-md">
                {activeCourse.title}
              </h1>
            </div>
          </div>
          <Badge className="hidden lg:inline-flex rounded-lg h-7 text-[9px] font-black tracking-wider bg-slate-900 text-premium-accent border border-premium-accent/20">
            DRM PRO-STREAM
          </Badge>
        </div>
        
        {/* Dynamic tracking metrics */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-xl text-[10px] font-mono text-slate-400 font-bold shadow-inner">
            <Activity className="w-3.5 h-3.5 text-premium-accent animate-pulse" />
            <span>NODE: BJ-CRE-MIA</span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <Link to="/courses">
            <Button variant="danger" size="sm" className="h-10 px-5 text-xs uppercase font-black tracking-widest rounded-xl shadow-md cursor-pointer border border-red-500/20">
              Disconnect Broadcast
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Player & Sidebar Content */}
      <div className="flex-1 flex overflow-hidden z-30">
        
        {/* Cinematic Main Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#070b13] relative scrollbar-thin">
          
          {/* DRM Warning Anti-Piracy Header Banner */}
          <div className="bg-gradient-to-r from-red-950/40 via-red-900/10 to-transparent border-b border-red-900/20 px-6 py-2.5 flex items-center justify-between gap-4 z-30 shadow-sm">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="text-red-500 w-4 h-4 animate-pulse shrink-0" />
              <p className="text-[10px] md:text-xs font-bold text-red-400 tracking-wide">
                BJ ACADEMY PROTECTED SOURCE CODE: External capture tools, screen mirroring, or unauthorized recording triggers immediate session termination.
              </p>
            </div>
            <Badge variant="danger" className="text-[8px] tracking-widest font-black uppercase shrink-0 py-0.5 px-2.5 bg-red-950/60 text-red-400 border border-red-800/40">
              ANTI-RECORD ACTIVE
            </Badge>
          </div>

          {/* Secure Video Player */}
          <div className="relative aspect-video max-h-[55vh] lg:max-h-[58vh] bg-slate-950 group overflow-hidden border-b border-slate-800 shadow-2xl flex-shrink-0">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-10"></div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* Media Visual background */}
              <img 
                src={activeCourse.image} 
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  isPlaying ? 'opacity-20 blur-[1px]' : 'opacity-35 blur-none'
                }`}
                alt="Cinematic Streaming Interface"
              />
              
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
              <div className="absolute inset-0 bg-radial-gradient"></div>

              {/* Secure Fingerprint Key */}
              {!isPlaying && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-4 z-20 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center shadow-2xl text-premium-accent/80 animate-pulse">
                    <Fingerprint className="w-8 h-8" />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">ENCRYPTED LECTURE DECODER ACTIVE</span>
                </div>
              )}

              {/* HUD Play Button */}
              <motion.button 
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-gradient-premium hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] text-white rounded-full flex items-center justify-center shadow-2xl z-30 cursor-pointer border border-blue-400/20 transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current text-white" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1.5 text-white" />
                )}
              </motion.button>
              
              {/* Session Status HUD Banner */}
              {!isPlaying && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800/80 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl z-20 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-premium-accent animate-ping"></span>
                  <span className="text-[9px] text-slate-300 font-mono uppercase tracking-widest font-bold">
                    Authenticated stream • 4K UHD 60fps • L3 DRM
                  </span>
                </div>
              )}
            </div>

            {/* Dynamic anti-piracy moving watermark */}
            <motion.div 
              animate={{ top: watermarkPos.top, left: watermarkPos.left }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute pointer-events-none text-slate-500/10 text-[9px] font-mono z-30 select-none whitespace-nowrap leading-relaxed tracking-wider border border-white/5 bg-slate-900/[0.05] p-3.5 rounded-xl backdrop-blur-[0.5px]"
            >
              <p className="font-black">STUDENT ID: john.doe@bjreality.academy</p>
              <p>SECURE TERMINAL: 192.168.1.104</p>
              <p>ENCRYPTION AUTH KEY: BJ-SEC-2983848</p>
              <p>TIMESTAMP: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            </motion.div>

            {/* Live stream details badge */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SSL SECURE CAPTURE SHIELD
              </div>
            </div>

            {/* Custom Cinematic controls bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 space-y-4">
              
              {/* Scrubber timeline */}
              <div 
                className="relative h-1.5 w-full bg-slate-800 rounded-full cursor-pointer group/timeline"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percentage = Math.round((clickX / rect.width) * 100);
                  setVideoProgress(percentage);
                }}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-premium-accent rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" 
                  style={{ width: `${videoProgress}%` }}
                ></div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover/timeline:opacity-100 transition-opacity shadow-lg"
                  style={{ left: `calc(${videoProgress}% - 7px)` }}
                ></div>
              </div>
              
              {/* Left/Right Controllers */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><SkipBack className="w-5 h-5" /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-premium-accent transition-colors cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-current text-white" />
                    )}
                  </button>
                  <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><SkipForward className="w-5 h-5" /></button>
                  
                  {/* Volume block */}
                  <div className="flex items-center gap-2.5 ml-4">
                    <Volume2 className="w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-16 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-premium-accent"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono ml-4 uppercase tracking-widest font-black">
                    {Math.floor((videoProgress / 100) * 32)}:15 / 32:10
                  </span>
                </div>
                
                <div className="flex items-center gap-5">
                  <Badge className="text-[8px] font-black text-premium-accent bg-slate-900 border border-premium-accent/20 px-2 py-0.5 rounded tracking-widest font-mono">
                    4K ULTRA
                  </Badge>

                  {/* Playback speed selector */}
                  <div className="relative shrink-0">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-[10px] font-bold text-slate-400 hover:text-white border border-slate-800 rounded-lg px-2.5 py-1 bg-slate-900 flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      Speed: {playbackSpeed}
                    </button>
                    {showSettings && (
                      <div className="absolute bottom-9 right-0 w-24 bg-slate-900 border border-slate-850 rounded-lg shadow-xl p-1 z-40 text-left">
                        {['0.75x', '1.0x', '1.25x', '1.5x', '2.0x'].map(speed => (
                          <button
                            key={speed}
                            onClick={() => { setPlaybackSpeed(speed); setShowSettings(false); }}
                            className="block w-full text-left px-2.5 py-1.5 rounded text-[10px] text-slate-400 hover:bg-slate-800 hover:text-white font-bold"
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Settings className="w-4.5 h-4.5" /></button>
                  <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Maximize className="w-4.5 h-4.5" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Lecture Header bar */}
          <div className="bg-[#0b101b] border-b border-slate-800/60 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-black text-premium-accent uppercase tracking-widest">
                Currently Playing • Module {activeLecture.id}
              </span>
              <h2 className="text-xl font-black text-white leading-tight">
                {activeLecture.title}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {activeCourse.category} SPECIALIZATION SYLLABUS
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Badge variant="premium" className="rounded-lg h-8 text-[9px] font-black tracking-wider bg-slate-900 border border-premium-accent/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-premium-accent" />
                Specialty: {activeCourse.specializationBadge}
              </Badge>
              <Badge variant="success" className="rounded-lg h-8 text-[9px] font-black tracking-wider bg-slate-900 border border-green-800/40 flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                Active Class
              </Badge>
            </div>
          </div>

          {/* Tab Selection Area */}
          <div className="flex-1 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-6 border-b border-slate-850 mb-6">
              {['Overview', 'Spreadsheets & Resources', 'Student Notebook', 'Discussion Q&A'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 font-black text-xs uppercase tracking-wider transition-all relative cursor-pointer focus:outline-none ${
                    activeTab === tab ? 'text-white font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="watchTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-accent shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Workspace Content Display */}
            <div className="max-w-4xl space-y-6 text-left">
              
              {/* Tab 1: Overview */}
              {activeTab === 'Overview' && (
                <div className="space-y-6 animate-in">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">Module Objectives & Directives</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                    {activeCourse.overviewText}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3.5 p-5 bg-[#0b101b] border border-slate-850 rounded-2xl shadow-md hover:border-slate-800 transition-all">
                      <div className="w-10 h-10 bg-premium-accent/15 rounded-xl flex items-center justify-center border border-premium-accent/20 shrink-0">
                        <Trophy className="text-premium-accent w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white uppercase tracking-wider">Accredited Standard</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Approved for commercial audit licensing.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-5 bg-[#0b101b] border border-slate-850 rounded-2xl shadow-md hover:border-slate-800 transition-all">
                      <div className="w-10 h-10 bg-premium-accent/15 rounded-xl flex items-center justify-center border border-premium-accent/20 shrink-0">
                        <Shield className="text-premium-accent w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white uppercase tracking-wider">Secure Resource Vault</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Asset matrices contain unique download tokens.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Spreadsheets */}
              {activeTab === 'Spreadsheets & Resources' && (
                <div className="space-y-4 animate-in">
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-3 mb-2 shadow-inner">
                    <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />
                    <p className="text-[11px] text-amber-200/90 leading-relaxed font-bold">
                      <strong>Audit Warning:</strong> All spreadsheets and scripts downloads are encrypted with your active terminal IP footprint. Distributing source calculations is monitored under terms of agreement.
                    </p>
                  </div>

                  {activeCourse.resources.map((file, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-4 bg-[#0b101b] rounded-2xl border border-slate-850 hover:border-premium-accent/30 hover:bg-[#0f1625]/60 transition-all shadow-md group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <FileText className="w-5.5 h-5.5 text-slate-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-white leading-none">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1.5">{file.desc} • {file.size}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="icon" className="h-10 w-10 bg-slate-900 border border-slate-800 hover:border-premium-accent text-slate-400 hover:text-white cursor-pointer active:scale-95 shadow-md">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Student Notebook */}
              {activeTab === 'Student Notebook' && (
                <div className="space-y-6 animate-in">
                  <div className="space-y-2 text-left">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Active Workspace Notepad</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Jot down critical deal guidelines. Notes are saved to your secure profile log.</p>
                  </div>
                  <div className="space-y-4">
                    <textarea 
                      placeholder="Calculate debt caps, write objection hooks, or make general observations here..." 
                      value={savedNotes}
                      onChange={(e) => setSavedNotes(e.currentTarget.value)}
                      className="w-full h-40 bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent font-semibold shadow-inner"
                    ></textarea>
                    <Button 
                      variant="primary" 
                      onClick={handleSaveNote}
                      className="text-[10px] uppercase tracking-widest font-black h-11 px-6 rounded-xl cursor-pointer"
                    >
                      Save Session Note
                    </Button>
                  </div>

                  {notesList.length > 0 && (
                    <div className="space-y-3.5 pt-4 border-t border-slate-850">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Saved Notes Log ({notesList.length})</h4>
                      <div className="space-y-3">
                        {notesList.map(note => (
                          <div key={note.id} className="p-4 bg-[#0b101b] border border-slate-850 rounded-2xl text-left space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-premium-accent tracking-wider">
                              <span>Lecture: {note.lectureTitle}</span>
                              <span className="text-slate-500 font-mono">{note.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Discussion Chat */}
              {activeTab === 'Discussion Q&A' && (
                <div className="space-y-5 animate-in">
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Elite Discussion Panel</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Ask questions directly to the mentors. Real-time Q&A stream is actively audited.</p>
                  </div>
                  
                  {/* Chat Message Box */}
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 h-64 overflow-y-auto space-y-4 scrollbar-thin text-left">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className="flex flex-col space-y-1 leading-normal max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            msg.isInstructor ? 'text-amber-400' : 'text-slate-300'
                          }`}>
                            {msg.sender}
                          </span>
                          <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                            {msg.role}
                          </span>
                          <span className="text-[8px] text-slate-500 font-mono">{msg.time}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed border ${
                          msg.isInstructor 
                            ? 'bg-amber-500/5 border-amber-500/10 text-amber-100/90' 
                            : 'bg-slate-900 border-slate-850 text-slate-300'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Send Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type your underwriting question or observation..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.currentTarget.value)}
                      className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent flex-1 font-semibold"
                    />
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="h-11 px-5 rounded-xl flex items-center justify-center cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </main>

        {/* Playlist Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col bg-slate-950 border-l border-slate-850 shrink-0 z-10 shadow-2xl relative"
            >
              {/* Radial gradient side lighting */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-premium-accent/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Progress HUD */}
              <div className="p-6 border-b border-slate-850/80 space-y-4 text-left relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-widest text-white">Course Syllabus</h3>
                  <span className="text-[9px] font-mono font-black text-premium-accent bg-premium-accent/10 border border-premium-accent/20 px-2 py-0.5 rounded">
                    Syllabus progress: 62%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-premium-accent shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ width: '62%' }}></div>
                </div>
              </div>
              
              {/* Syllabus Chapters */}
              <div className="flex-1 overflow-y-auto custom-scrollbar text-left scrollbar-thin">
                <div className="p-4 bg-slate-900/30 border-b border-slate-950">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">MODULE 1: ACQUISITION DEEP DIVE</span>
                </div>
                {activeCourse.lectures.map((lecture, i) => {
                  const isActive = activeLecture.id === lecture.id;
                  
                  return (
                    <div 
                      key={lecture.id}
                      onClick={() => !lecture.locked && setActiveLecture(lecture)}
                      className={`p-5 border-b border-slate-900/60 cursor-pointer transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#0f1625]/60 border-l-2 border-l-premium-accent shadow-inner' 
                          : 'hover:bg-slate-900/40'
                      } ${lecture.locked ? 'opacity-35 grayscale pointer-events-none' : ''}`}
                    >
                      <div className="flex gap-4">
                        {/* Checkbox state */}
                        <div className="shrink-0 mt-0.5">
                          {lecture.completed ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          ) : lecture.locked ? (
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              isActive ? 'border-premium-accent shadow-[0_0_6px_rgba(37,99,235,0.4)]' : 'border-slate-700'
                            }`}></div>
                          )}
                        </div>

                        {/* Class name & Duration */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className={`font-black text-xs truncate leading-snug ${
                            isActive ? 'text-white font-black' : 'text-slate-300'
                          }`}>
                            Lecture {i + 1}: {lecture.title}
                          </p>
                          <div className="flex items-center gap-2.5 text-[9px] text-slate-500 font-mono uppercase mt-1.5">
                            <span>{lecture.duration} mins</span>
                            {lecture.locked && (
                              <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded tracking-widest">
                                Elite Locked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secure Active Footprint logs */}
              <div className="p-6 bg-slate-900/50 border-t border-slate-850 space-y-4 text-left relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-slate-800/60"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-premium-accent/10 border border-premium-accent/20 rounded-xl flex items-center justify-center shrink-0">
                    <Monitor className="text-premium-accent w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-none">Access Center</p>
                    <p className="text-xs font-black text-white mt-1.5 leading-none">Security Node Active</p>
                  </div>
                </div>
                
                {/* Simulated connection diagnostics */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[9px] font-mono text-slate-400 space-y-1 shadow-inner font-semibold">
                  <p className="text-emerald-500 font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    ● SSL ENCRYPTED CONNECTION
                  </p>
                  <p>Client footprint: 192.168.1.104</p>
                  <p>Terminal: Chrome Desktop / Linux</p>
                </div>
                <button 
                  onClick={() => alert("Credentials Audited. Encryption Signature: BJ-SEC-2983848-OK")}
                  className="w-full text-[9px] uppercase font-black tracking-widest h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all duration-300 cursor-pointer shadow-md active:scale-95"
                >
                  Verify Encryption Key
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseWatch;
