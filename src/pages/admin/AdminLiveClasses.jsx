import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar, Eye, Play, X, Trash2, Plus, Clock, ExternalLink, 
  Users, Activity, CheckCircle, UploadCloud, Info, AlertTriangle, 
  ShieldCheck, ArrowRight, ChevronLeft, ChevronRight, BarChart2, 
  Star, Download, PlayCircle, Radio, Settings, Sparkles, Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminTable, AdminModal } from '../../components/admin/AdminComponents';
import { Button, Badge, GlassCard } from '../../components/UI';

// Modern preset Unsplash images for webinars
const PRESET_BANNERS = [
  { id: 'underwriting', label: 'Deal Underwriting', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600' },
  { id: 'commercial', label: 'Commercial Leases', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600' },
  { id: 'flipping', label: 'Luxury Flipping', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' },
  { id: 'zoning', label: 'Zoning & Permits', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600' },
  { id: 'venture', label: 'Joint Ventures', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600' },
];

const MENTORS = [
  { name: "Sarah Jenkins", role: "Commercial Broker", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
  { name: "Alex Mercer", role: "Underwriting Analyst", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
  { name: "Michael Chang", role: "Real Estate Attorney", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
  { name: "Dave Miller", role: "Syndicate Organizer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" }
];

const initialWebinars = [
  { 
    id: 1, 
    topic: "Multifamily Deal Underwriting & Excel Templates", 
    instructor: "Alex Mercer", 
    date: "2026-05-28", 
    time: "15:00", 
    endTime: "16:30",
    link: "https://zoom.us/j/91283419", 
    students: 145, 
    status: "Upcoming",
    duration: "90 Mins",
    banner: PRESET_BANNERS[0].url,
    description: "Walkthrough of real-world underwriting models, calculating IRR, equity multiple, and debt service coverage ratio (DSCR)."
  },
  { 
    id: 2, 
    topic: "Negotiating High-Ticket Commercial Leases", 
    instructor: "Sarah Jenkins", 
    date: "2026-05-27", 
    time: "20:00", 
    endTime: "21:30",
    link: "https://zoom.us/j/84920491", 
    students: 198, 
    status: "Live",
    duration: "90 Mins",
    banner: PRESET_BANNERS[1].url,
    description: "Dive into lease structures, NNN negotiations, landlord concessions, and tenant improvement (TI) allowances."
  },
  { 
    id: 3, 
    topic: "Luxury Flipping: Sourcing Off-Market Deals", 
    instructor: "Dave Miller", 
    date: "2026-05-26", 
    time: "14:00", 
    endTime: "15:30",
    link: "https://zoom.us/j/32019842", 
    students: 310, 
    status: "Completed",
    duration: "90 Mins",
    banner: PRESET_BANNERS[2].url,
    description: "Finding off-market high-end residential listings using direct mail campaign systems and sheriff sale data mining."
  },
  { 
    id: 4, 
    topic: "Permitting, Zoning, & Land Easements", 
    instructor: "Michael Chang", 
    date: "2026-05-29", 
    time: "17:30", 
    endTime: "19:00",
    link: "https://zoom.us/j/75620931", 
    students: 90, 
    status: "Upcoming",
    duration: "90 Mins",
    banner: PRESET_BANNERS[3].url,
    description: "Detailed guide on rezoning parcels, appealing zoning boards, checking easements, and utility access pathways."
  },
  { 
    id: 5, 
    topic: "Joint Venture Structuring & Syndicate Raising", 
    instructor: "Dave Miller", 
    date: "2026-06-03", 
    time: "10:00", 
    endTime: "11:30",
    link: "https://zoom.us/j/41920831", 
    students: 215, 
    status: "Upcoming",
    duration: "90 Mins",
    banner: PRESET_BANNERS[4].url,
    description: "Legal frameworks, GP/LP splits, waterfall distributions, and SEC regulations for pooling investor capital."
  }
];

const initialPerformance = [
  { id: 101, topic: "Sourcing Motivated Sellers via Tax Delinquencies", date: "2026-05-20", instructor: "Sarah Jenkins", peakViewers: 245, registered: 280, engagement: 88, rating: 4.9 },
  { id: 102, topic: "Analyzing Retail Plaza Debt Coverage Ratios", date: "2026-05-15", instructor: "Alex Mercer", peakViewers: 172, registered: 210, engagement: 82, rating: 4.7 },
  { id: 103, topic: "Title Cleansing & Foreclosure Auction Hazards", date: "2026-05-10", instructor: "Michael Chang", peakViewers: 298, registered: 340, engagement: 91, rating: 5.0 }
];

export default function AdminLiveClasses() {
  const [webinars, setWebinars] = useState(initialWebinars);
  const [performance, setPerformance] = useState(initialPerformance);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form State
  const [formState, setFormState] = useState({ 
    topic: '', 
    instructor: 'Sarah Jenkins', 
    date: '', 
    time: '', 
    endTime: '',
    link: '', 
    description: '',
    banner: PRESET_BANNERS[0].url
  });

  // Simulated live ticking clock representing current system time
  const [now, setNow] = useState(new Date("2026-05-27T20:43:11"));
  
  // Simulated changing live viewer metrics
  const [liveViewers, setLiveViewers] = useState({ 2: 156 });
  const [streamHealth, setStreamHealth] = useState("Excellent");
  const [bitrate, setBitrate] = useState(4850); // kbps

  // Calendar State
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // 4 = May
  const [selectedDate, setSelectedDate] = useState("2026-05-27");

  // Keep simulated time updated
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep live metrics moving dynamically
  useEffect(() => {
    const liveMetricsTimer = setInterval(() => {
      // Fluctuate viewers
      setLiveViewers(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
          next[id] = Math.max(25, next[id] + change);
        });
        return next;
      });

      // Fluctuate bitrate
      setBitrate(prev => {
        const change = Math.floor(Math.random() * 300) - 150; // -150 to +150 kbps
        return Math.max(3500, Math.min(6000, prev + change));
      });

      // Occasional random stream health fluctuations
      if (Math.random() < 0.1) {
        const healths = ["Excellent", "Good", "Fair"];
        const nextHealth = healths[Math.floor(Math.random() * healths.length)];
        setStreamHealth(nextHealth);
      }
    }, 3000);
    return () => clearInterval(liveMetricsTimer);
  }, []);

  // Helper: Format countdown for upcoming webinars
  const getCountdownString = (dateStr, timeStr) => {
    const target = new Date(`${dateStr}T${timeStr}:00`);
    const diff = target - now;
    if (diff <= 0) return "Starting now...";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Helper: Calculate duration
  const calculateDurationMinutes = (start, end) => {
    if (!start || !end) return "60 Mins";
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    let diffMins = (eH * 60 + eM) - (sH * 60 + sM);
    if (diffMins < 0) diffMins += 24 * 60; // next day
    return `${diffMins} Mins`;
  };

  // Handle Create / Edit Webinar
  const handleSaveWebinar = (e) => {
    e.preventDefault();
    const duration = calculateDurationMinutes(formState.time, formState.endTime);
    
    if (isEditing) {
      setWebinars(prev => prev.map(w => {
        if (w.id === editId) {
          return {
            ...w,
            topic: formState.topic,
            instructor: formState.instructor,
            date: formState.date,
            time: formState.time,
            endTime: formState.endTime,
            link: formState.link,
            description: formState.description,
            banner: formState.banner,
            duration: duration
          };
        }
        return w;
      }));
      setIsEditing(false);
      setEditId(null);
    } else {
      const newWebinar = {
        id: Date.now(),
        topic: formState.topic,
        instructor: formState.instructor,
        date: formState.date,
        time: formState.time,
        endTime: formState.endTime,
        link: formState.link,
        students: 0,
        status: "Upcoming",
        duration: duration,
        banner: formState.banner,
        description: formState.description || "Interactive masterclass."
      };
      setWebinars([newWebinar, ...webinars]);
    }
    
    setModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormState({ 
      topic: '', 
      instructor: 'Sarah Jenkins', 
      date: '', 
      time: '', 
      endTime: '',
      link: '', 
      description: '',
      banner: PRESET_BANNERS[0].url
    });
  };

  // Open scheduler Modal
  const openCreateModal = (prefilledDate = '') => {
    setIsEditing(false);
    resetForm();
    if (prefilledDate) {
      setFormState(prev => ({ ...prev, date: prefilledDate }));
    }
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (webinar) => {
    setIsEditing(true);
    setEditId(webinar.id);
    setFormState({
      topic: webinar.topic,
      instructor: webinar.instructor,
      date: webinar.date,
      time: webinar.time,
      endTime: webinar.endTime || '',
      link: webinar.link,
      description: webinar.description || '',
      banner: webinar.banner || PRESET_BANNERS[0].url
    });
    setModalOpen(true);
  };

  // Broadcast activation/completion simulation
  const handleStartStream = (id) => {
    setWebinars(prev => prev.map(w => {
      if (w.id === id) {
        // Initialize dynamic viewers
        setLiveViewers(prevL => ({ ...prevL, [id]: 45 }));
        return { ...w, status: "Live" };
      }
      return w;
    }));
  };

  const handleCompleteStream = (id) => {
    const webinar = webinars.find(w => w.id === id);
    if (!webinar) return;

    setWebinars(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, status: "Completed" };
      }
      return w;
    }));

    // Add to performance log
    const viewersPeak = liveViewers[id] || Math.floor(webinar.students * 0.8) || 50;
    const regCount = webinar.students || 60;
    const newPerf = {
      id: Date.now(),
      topic: webinar.topic,
      date: webinar.date,
      instructor: webinar.instructor,
      peakViewers: viewersPeak,
      registered: regCount,
      engagement: Math.floor(Math.random() * 15) + 75, // 75-90%
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1))
    };
    setPerformance([newPerf, ...performance]);

    // Cleanup live state
    setLiveViewers(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDeleteWebinar = (id) => {
    if (confirm("Are you sure you want to delete and cancel this webinar broadcast? Enrolled students will be notified.")) {
      setWebinars(prev => prev.filter(w => w.id !== id));
      // Cleanup live if any
      setLiveViewers(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  // Calendar Engine
  const daysInMonthList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year, month) => {
    // Leap year check for February
    if (month === 1) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    }
    return daysInMonthList[month];
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  // Render Calendar Grid Cells
  const generateCalendarCells = () => {
    const daysCount = getDaysInMonth(currentYear, currentMonth);
    const startOffset = getFirstDayOfMonth(currentYear, currentMonth);
    const cells = [];
    
    // Add empty spacer cells for previous month padding
    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null, dateStr: null });
    }

    // Add days
    for (let day = 1; day <= daysCount; day++) {
      const monthStr = (currentMonth + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      cells.push({ day, dateStr });
    }

    return cells;
  };

  const calendarCells = generateCalendarCells();
  
  // Filter webinars for calendar day
  const getDayWebinars = (dateStr) => {
    if (!dateStr) return [];
    return webinars.filter(w => w.date === dateStr);
  };

  // Filter webinars for currently selected date
  const selectedDateWebinars = getDayWebinars(selectedDate);

  // Compute Analytics Metrics
  const totalScheduled = webinars.length;
  const activeStreamsCount = webinars.filter(w => w.status === "Live").length;
  const totalRegisteredCount = webinars.reduce((sum, w) => sum + w.students, 0);
  const avgRatingVal = performance.length > 0 
    ? (performance.reduce((sum, p) => sum + p.rating, 0) / performance.length).toFixed(1)
    : "4.8";

  // Table Columns Setup
  const webinarColumns = [
    {
      header: "Webinar Title",
      accessor: "topic",
      render: (row) => (
        <div className="flex items-center gap-4 min-w-[280px]">
          <div className="h-12 w-20 rounded-lg overflow-hidden border border-[#1e1e22] border-[#1a1a1c] bg-[#111114] shrink-0 relative group">
            <img src={row.banner} alt={row.topic} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            {row.status === "Live" && (
              <span className="absolute top-1 left-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            )}
          </div>
          <div>
            <p className="font-bold text-white text-white line-clamp-1 max-w-[240px] hover:text-premium-accent transition-colors cursor-pointer" onClick={() => openEditModal(row)}>{row.topic}</p>
            <p className="text-[10px] text-slate-400 font-semibold line-clamp-1 mt-0.5">{row.description}</p>
          </div>
        </div>
      )
    },
    {
      header: "Lead Mentor",
      accessor: "instructor",
      render: (row) => {
        const mentor = MENTORS.find(m => m.name === row.instructor) || MENTORS[0];
        return (
          <div className="flex items-center gap-2.5">
            <img src={mentor.avatar} alt={row.instructor} className="h-8 w-8 rounded-full border border-[#1e1e22] border-[#1e1e22] object-cover" />
            <div>
              <p className="font-bold text-slate-700 text-slate-300 leading-none">{row.instructor}</p>
              <span className="text-[9px] text-slate-400 text-slate-500 font-bold uppercase tracking-wider">{mentor.role}</span>
            </div>
          </div>
        );
      }
    },
    {
      header: "Scheduled Date & Time",
      accessor: "date",
      render: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-slate-700 text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {row.date}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {row.time} - {row.endTime || "1.5 hrs"}
          </span>
        </div>
      )
    },
    {
      header: "Attendees",
      accessor: "students",
      render: (row) => {
        if (row.status === "Live") {
          return (
            <div className="flex flex-col">
              <span className="font-black text-premium-accent flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {liveViewers[row.id] || row.students} Active
              </span>
              <span className="text-[9px] text-slate-400 font-semibold">{row.students} Registrations</span>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-1.5 font-bold text-slate-700 text-slate-300">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{row.students} Enrolled</span>
          </div>
        );
      }
    },
    {
      header: "Live Status",
      accessor: "status",
      render: (row) => {
        const config = {
          Live: "bg-red-500/10 text-red-400 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900 animate-pulse font-black",
          Upcoming: "bg-[#0A66C2]/10 text-[#1E88E5] border-[#0A66C2]/20 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
          Completed: "bg-[#111114] text-slate-500 border-[#1e1e22] bg-[#111114] text-slate-400 border-[#1e1e22]"
        };
        return (
          <div className="flex flex-col items-start gap-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${config[row.status] || ''}`}>
              {row.status}
            </span>
            {row.status === "Upcoming" && (
              <span className="text-[9px] text-slate-400 font-medium font-mono">{getCountdownString(row.date, row.time)}</span>
            )}
          </div>
        );
      }
    },
    {
      header: "Duration",
      accessor: "duration"
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "Upcoming" && (
            <Button 
              variant="primary" 
              size="sm" 
              className="h-8 px-3 text-[10px] font-black uppercase py-0"
              onClick={() => handleStartStream(row.id)}
            >
              <Radio className="w-3 h-3 mr-1" /> Start Live
            </Button>
          )}
          {row.status === "Live" && (
            <Button 
              variant="gold" 
              size="sm" 
              className="h-8 px-3 text-[10px] font-black uppercase py-0"
              onClick={() => handleCompleteStream(row.id)}
            >
              <CheckCircle className="w-3 h-3 mr-1" /> Complete
            </Button>
          )}
          <button
            onClick={() => openEditModal(row)}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#0f0f12] bg-[#111114] border border-premium-border dark:border-slate-750 text-slate-500 hover:text-premium-accent hover:border-premium-accent/30 transition-all cursor-pointer"
            title="Edit Details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <Button 
            variant="danger" 
            size="sm" 
            className="h-8 w-8 p-0 flex items-center justify-center"
            onClick={() => handleDeleteWebinar(row.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a1c] border-[#1a1a1c]/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-premium-accent font-black text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse text-red-500" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-black text-white text-white tracking-tight uppercase">
            Live Webinars & Classes
          </h1>
          <p className="text-sm font-semibold text-slate-400 text-slate-500 mt-1">
            Schedule live masterclass broadcasts, manage mentor listings, view active streaming health, and run post-event analytics.
          </p>
        </div>
        <Button variant="primary" size="md" className="shadow-lg shrink-0" onClick={() => openCreateModal()}>
          <Plus className="w-5 h-5 mr-2" /> Schedule Broadcast
        </Button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex items-center gap-4 bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl">
          <div className="h-12 w-12 rounded-xl bg-[#0A66C2]/10 dark:bg-blue-950/20 text-premium-accent flex items-center justify-center border border-[#0A66C2]/20 dark:border-blue-900 shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-slate-500 text-xs font-black uppercase tracking-wider">Total Broadcasts</p>
            <p className="text-2xl font-black text-white text-white tracking-tight mt-0.5">{totalScheduled}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 dark:bg-red-950/20 text-red-500 flex items-center justify-center border border-red-500/20 dark:border-red-900/60 shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-slate-400 text-slate-500 text-xs font-black uppercase tracking-wider">Live Broadcasts</p>
            <p className="text-2xl font-black text-white text-white tracking-tight mt-0.5">{activeStreamsCount}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 dark:bg-violet-950/20 text-premium-violet flex items-center justify-center border border-violet-500/20 dark:border-violet-900 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-slate-500 text-xs font-black uppercase tracking-wider">Total Registrations</p>
            <p className="text-2xl font-black text-white text-white tracking-tight mt-0.5">{totalRegisteredCount}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center border border-amber-500/20 dark:border-amber-900 shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-slate-500 text-xs font-black uppercase tracking-wider">Avg Class Rating</p>
            <p className="text-2xl font-black text-white text-white tracking-tight mt-0.5">{avgRatingVal} / 5.0</p>
          </div>
        </GlassCard>
      </div>

      {/* Live Stream Panel (Active streams UI monitor) */}
      {webinars.some(w => w.status === "Live") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-premium-border/40 dark:border-slate-850 pb-2">
            <span className="h-2 w-2 rounded-full bg-red-500/100 animate-ping"></span>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-200 text-white">Active Streaming Server Health</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {webinars.filter(w => w.status === "Live").map(liveWebinar => {
              const viewers = liveViewers[liveWebinar.id] || liveWebinar.students;
              return (
                <GlassCard key={liveWebinar.id} className="relative overflow-hidden bg-slate-950 text-white border-red-500/20 dark:border-red-950 p-6 rounded-2xl flex flex-col gap-6 shadow-[0_15px_40px_rgba(239,68,68,0.1)]">
                  {/* Decorative glowing background */}
                  <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />
                  
                  {/* Streaming Video Simulation Box */}
                  <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 group">
                    <img src={liveWebinar.banner} alt={liveWebinar.topic} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-102 transition-transform duration-700" />
                    
                    {/* Simulator top overlays */}
                    <div className="flex justify-between items-start z-10 w-full">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 text-[10px] font-black tracking-widest uppercase shadow-sm">
                        <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-sm ${
                        streamHealth === "Excellent" ? "bg-emerald-600 text-white" : 
                        streamHealth === "Good" ? "bg-blue-600 text-white" : "bg-amber-600 text-white"
                      }`}>
                        <Activity className="w-3 h-3" /> Health: {streamHealth}
                      </span>
                    </div>

                    {/* Simulator Center Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="h-14 w-14 rounded-full bg-[#0b0b0d]/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                      </div>
                    </div>

                    {/* Simulator bottom overlays */}
                    <div className="flex justify-between items-end z-10 w-full bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-2 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Stream Quality</span>
                        <span className="text-xs font-mono font-black">1080p @ 60fps • {(bitrate / 1000).toFixed(1)} Mbps</span>
                      </div>
                      <span className="text-[10px] font-black font-mono bg-black/60 px-2 py-1 rounded text-slate-300">
                        Live: {getCountdownString(liveWebinar.date, liveWebinar.time) === "Starting now..." ? "00:45:12" : "01:24:08"}
                      </span>
                    </div>
                  </div>

                  {/* Class Info & Controls */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-black text-white leading-tight uppercase line-clamp-1">{liveWebinar.topic}</h3>
                      <p className="text-slate-400 text-xs font-semibold mt-1">Lead Instructor: <span className="text-white font-bold">{liveWebinar.instructor}</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-800 rounded-xl p-3">
                      <div>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Active Attendees</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Users className="w-4 h-4 text-red-400" />
                          <span className="text-base font-black text-white animate-pulse">{viewers} Students</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Target Room</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <ExternalLink className="w-4 h-4 text-premium-accent" />
                          <a href={liveWebinar.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-premium-accent hover:underline truncate">Zoom Conference</a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="gold" className="flex-1 text-xs py-2.5 h-10" onClick={() => handleCompleteStream(liveWebinar.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" /> Complete Stream
                      </Button>
                      <button 
                        onClick={() => alert(`Broadcasting settings and ingestion tokens configured for RTMP server stream: ${liveWebinar.id}`)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Stream Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Advanced UI: Interactive Calendar-Style Schedule & Detail Panel */}
      <div className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-tight text-slate-200 text-white border-b border-premium-border/40 dark:border-slate-850 pb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-premium-accent" /> Interactive Webinar Calendar
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Grid - Left Panel */}
          <div className="lg:col-span-8 bg-[#0b0b0d] bg-[#0b0b0d] border border-[#1a1a1c] border-[#1a1a1c] rounded-2xl shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-white text-white uppercase tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={prevMonth}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] text-slate-500 text-slate-400 hover:text-premium-accent transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextMonth}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] text-slate-500 text-slate-400 hover:text-premium-accent transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center border-b border-[#1a1a1c] border-[#1a1a1c]/80 pb-3 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <span key={day} className="text-[10px] font-black uppercase text-slate-400 text-slate-500 tracking-wider">
                  {day}
                </span>
              ))}
            </div>

            {/* Monthly Days Cells Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((cell, idx) => {
                const isSelected = cell.dateStr === selectedDate;
                const isToday = cell.dateStr === "2026-05-27";
                const dayWebinarsList = getDayWebinars(cell.dateStr);
                const hasEvents = dayWebinarsList.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => cell.dateStr && setSelectedDate(cell.dateStr)}
                    className={`min-h-[75px] sm:min-h-[85px] p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                      cell.day === null 
                        ? "bg-[#0f0f12]/40 bg-[#0b0b0d]/40 border-transparent cursor-default pointer-events-none" 
                        : isSelected
                          ? "bg-[#0A66C2]/10/60 dark:bg-blue-950/20 border-premium-accent dark:border-premium-accent/40 shadow-sm"
                          : isToday
                            ? "bg-[#0f0f12] bg-[#0f0f12] border-slate-300 border-[#1e1e22] text-white text-white"
                            : "bg-[#0b0b0d] bg-[#0b0b0d] border-[#1a1a1c] border-[#1a1a1c] hover:border-premium-accent/30 dark:hover:border-premium-accent/20"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold font-mono ${
                        isSelected 
                          ? "text-premium-accent font-black" 
                          : isToday 
                            ? "text-premium-accent font-black ring-1 ring-premium-accent/25 rounded-md px-1.5 py-0.5 bg-[#0A66C2]/10 dark:bg-blue-950/40"
                            : "text-slate-600 text-slate-400"
                      }`}>
                        {cell.day}
                      </span>
                    </div>

                    {/* Small preview of scheduled events */}
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {dayWebinarsList.map(w => {
                        const statusColor = 
                          w.status === "Live" ? "bg-red-500/100" : 
                          w.status === "Completed" ? "bg-slate-400" : "bg-[#0A66C2]/100";
                        return (
                          <div key={w.id} className="flex items-center gap-1">
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusColor}`}></span>
                            <span className="text-[8px] font-black text-slate-500 text-slate-400 truncate hidden sm:inline max-w-full">
                              {w.topic}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agenda Right Panel Detail */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-[#1a1a1c] border-[#1a1a1c] p-6 rounded-2xl shadow-sm flex flex-col gap-5 text-left">
              <div className="flex justify-between items-center border-b border-[#1a1a1c] border-[#1a1a1c] pb-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Selected Day</span>
                  <h3 className="text-sm font-black text-white text-white uppercase mt-0.5">
                    {selectedDate === "2026-05-27" ? "Today, May 27" : selectedDate}
                  </h3>
                </div>
                <button
                  onClick={() => openCreateModal(selectedDate)}
                  className="h-8 px-2.5 rounded-lg bg-[#0f0f12] bg-[#111114] border border-[#1e1e22] border-[#1e1e22] text-[10px] font-black uppercase text-premium-accent hover:bg-premium-accent hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {selectedDateWebinars.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateWebinars.map(w => {
                    const statusStyles = {
                      Live: "bg-red-500/10 text-red-400 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900 animate-pulse font-black",
                      Upcoming: "bg-[#0A66C2]/10 text-[#1E88E5] border-[#0A66C2]/20 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
                      Completed: "bg-[#111114] text-slate-500 border-[#1e1e22] bg-[#111114] text-slate-400 border-[#1e1e22]"
                    };

                    return (
                      <div key={w.id} className="p-3.5 rounded-xl border border-[#1a1a1c] border-[#1a1a1c]/80 bg-[#0f0f12]/50 bg-[#0b0b0d]/50 flex flex-col gap-2.5 hover:border-premium-accent/20 transition-all">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-black text-white text-white uppercase leading-tight line-clamp-2">{w.topic}</h4>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full border shrink-0 tracking-wider uppercase ${statusStyles[w.status] || ''}`}>
                            {w.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 text-slate-500 font-semibold line-clamp-1">{w.description}</p>
                        
                        <div className="flex items-center justify-between border-t border-[#1a1a1c] border-[#1a1a1c]/50 pt-2.5 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-500 text-slate-400 font-mono">{w.time} ({w.duration})</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 text-slate-500">Host: {w.instructor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#0f0f12] bg-[#0f0f12] flex items-center justify-center text-slate-400">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 text-slate-400">No Masterclasses Scheduled</p>
                    <p className="text-[10px] text-slate-400 mt-1">Easily configure a live stream block for this calendar day.</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 text-[10px] font-black uppercase py-2" onClick={() => openCreateModal(selectedDate)}>
                    Schedule Stream Now
                  </Button>
                </div>
              )}
            </GlassCard>

            {/* Quick Tips Box */}
            <div className="p-4 rounded-xl border border-[#0A66C2]/20 dark:border-blue-900/40 bg-[#0A66C2]/10/30 dark:bg-blue-950/10 flex gap-3 text-left">
              <Sparkles className="w-5 h-5 text-premium-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-slate-200 text-white uppercase tracking-wider">Mentor Reminders</h4>
                <p className="text-[10px] text-slate-500 text-slate-400 mt-1 leading-normal">
                  Mentors receive automatic SMS pings 15 minutes before going live. Direct Zoom room access keys are generated via the active broadcast room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Webinar Scheduler Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-premium-border/40 dark:border-slate-850 pb-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-slate-200 text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-premium-accent" /> Masterclass Logs & Configuration
          </h2>
        </div>
        
        <AdminTable
          title="Scheduled Live Broadcasts"
          subtitle="Configure broadcasting feeds, verify room hyperlinks, and track student registrations."
          columns={webinarColumns}
          data={webinars}
          searchPlaceholder="Search topics, mentors, and dates..."
          filterOptions={{
            field: "status",
            label: "Stream Status",
            options: [
              { value: "Upcoming", label: "Upcoming" },
              { value: "Live", label: "Live" },
              { value: "Completed", label: "Completed" }
            ]
          }}
        />
      </div>

      {/* Advanced UI: Recent Webinar Performance & Analytics log */}
      <div className="space-y-4 bg-[#0b0b0d] bg-[#0b0b0d] border border-[#1a1a1c] border-[#1a1a1c] p-6 rounded-2xl shadow-sm">
        <div>
          <h3 className="text-base font-black text-white text-white uppercase tracking-tight">Recent Broadcast Performance Metrics</h3>
          <p className="text-xs font-semibold text-slate-400 text-slate-500 mt-1">Review peak concurrent attendance statistics and student rating distributions for recently completed sessions.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1c] border-[#1a1a1c] pb-3">
                <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Completed Webinar</th>
                <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Instructor</th>
                <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500 text-center">Peak Views</th>
                <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500 text-center">Attendance %</th>
                <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500 text-center">Avg Rating</th>
                <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500 text-right">Archived Recording</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {performance.map((item) => {
                const attendanceRate = Math.round((item.peakViewers / item.registered) * 100);
                return (
                  <tr key={item.id} className="hover:bg-[#0f0f12]/50 dark:hover:bg-slate-850/20 transition-colors">
                    <td className="py-3.5 pr-4 text-xs font-black text-white text-white uppercase max-w-[280px] truncate">{item.topic}</td>
                    <td className="py-3.5 text-xs text-slate-600 text-slate-400 font-bold">{item.instructor}</td>
                    <td className="py-3.5 text-xs font-mono font-black text-center text-slate-700 text-slate-300">{item.peakViewers}</td>
                    <td className="py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-mono font-black text-slate-700 text-slate-300">{attendanceRate}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-[#111114] bg-[#111114] overflow-hidden hidden sm:block">
                          <div className="bg-premium-accent h-full rounded-full" style={{ width: `${attendanceRate}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-black">
                        <Star className="w-3 h-3 fill-current" /> {item.rating}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <a
                        href="#download-recording"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Downloading recording payload archive: "${item.topic}".mp4`);
                        }}
                        className="inline-flex items-center gap-1.5 text-premium-accent hover:underline text-[10px] font-black uppercase tracking-wider"
                      >
                        <Download className="w-3.5 h-3.5" /> Download (.mp4)
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webinar Scheduler Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Live Masterclass" : "Schedule Live Masterclass"}
      >
        <form onSubmit={handleSaveWebinar} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Webinar Topic / Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Zoning Codes & High-Ticket Commercial Lease Contracts"
              value={formState.topic}
              onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Masterclass Description</label>
            <textarea
              placeholder="Provide key takeaways, agendas, and prerequisites for the students..."
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              rows={2}
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-2.5 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lead Mentor Assignment</label>
              <select
                value={formState.instructor}
                onChange={(e) => setFormState({ ...formState, instructor: e.target.value })}
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-2.5 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
              >
                {MENTORS.map(mentor => (
                  <option key={mentor.name} value={mentor.name}>{mentor.name} ({mentor.role})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Scheduled Date</label>
              <input
                type="date"
                required
                value={formState.date}
                onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-2.5 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Start Time</label>
              <input
                type="time"
                required
                value={formState.time}
                onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-2.5 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">End Time</label>
              <input
                type="time"
                required
                value={formState.endTime}
                onChange={(e) => setFormState({ ...formState, endTime: e.target.value })}
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-2.5 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Conference Link (Zoom / Meet)</label>
            <input
              type="url"
              required
              placeholder="https://zoom.us/j/..."
              value={formState.link}
              onChange={(e) => setFormState({ ...formState, link: e.target.value })}
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-2.5 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          {/* Banner Upload / Select UI */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Webinar Banner Cover</label>
            
            {/* Visual File Uploader Zone */}
            <div className="border-2 border-dashed border-premium-border border-[#1a1a1c] rounded-xl p-4 flex flex-col items-center justify-center bg-[#0f0f12]/50 bg-[#0b0b0d]/50 hover:bg-[#0f0f12] hover:bg-[#111114]/80 transition-all cursor-pointer">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-[11px] font-bold text-slate-600 text-slate-300">Drag and drop banner here or click to upload</p>
              <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wide">PNG, JPG, WEBP (Recommended ratio 16:9)</p>
            </div>

            {/* Quick Presets Selection */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Or select from modern real-estate covers:</span>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_BANNERS.map(preset => {
                  const isSelected = formState.banner === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFormState({ ...formState, banner: preset.url })}
                      className={`h-11 rounded-lg overflow-hidden border relative transition-all cursor-pointer ${
                        isSelected ? 'border-premium-accent ring-2 ring-premium-accent/20' : 'border-[#1e1e22] border-[#1a1a1c] opacity-60 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-premium-accent/20 flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5 text-white fill-premium-accent" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1a1a1c] border-[#1a1a1c]/80 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => { setModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {isEditing ? "Save Adjustments" : "Schedule Broadcast"}
            </Button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
}
