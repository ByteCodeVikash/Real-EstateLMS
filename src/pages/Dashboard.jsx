import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  BookOpen, Clock, CheckCircle, Play, Star, 
  Flame, ExternalLink, Download, Video
} from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { useNow } from '../hooks/useNow';
import { formatCountdownParts, formatLocalDateTime, formatRelativeStart, getTimerPhase, getUrgencyTone, safeParseDate } from '../utils/countdown';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Activity');
  const nowMs = useNow();
  // Capture a stable "session opened at" time without calling Date.now() during render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const baseMs = useMemo(() => nowMs, []);

  // Simulate premium skeleton loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "Enrolled Courses", value: "5 Programs", detail: "4 Active, 1 Locked", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100/60" },
    { label: "Watch Hours", value: "48.5 Hrs", detail: "12 Hours this week", icon: Clock, color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100/60" },
    { label: "Course Completion", value: "64% Avg", detail: "Commercial track at 75%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100/60" },
    { label: "Webinar Attendance", value: "88% Ratio", detail: "7 of 8 live audits attended", icon: Video, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100/60" },
    { label: "Learning Streak", value: "7 Days Active", detail: "Personal streak record!", icon: Flame, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100/60" }
  ];

  const dashboardCourses = [
    {
      id: 1,
      title: "Property Sales Mastery: Advanced Closing bluebook",
      instructor: "Robert Sterling",
      category: "Sales Coaching",
      progress: 75,
      duration: "15 Hours",
      status: "Active",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Real Estate Investment: Commercial Underwriting",
      instructor: "Robert Sterling",
      category: "Investment",
      progress: 40,
      duration: "24.5 Hours",
      status: "Active",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Closing Techniques: Creative Deal Financing",
      instructor: "Marcus Thorne",
      category: "Negotiations",
      progress: 90,
      duration: "18 Hours",
      status: "Active",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 4,
      title: "Lead Conversion Strategies & Digital Funnels",
      instructor: "Elena Rodriguez",
      category: "Lead Gen",
      progress: 12,
      duration: "10 Hours",
      status: "Active",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 5,
      title: "Luxury Property Training: HNW Listings Branding",
      instructor: "Elena Rodriguez",
      category: "Luxury Marketing",
      progress: 0,
      duration: "12 Hours",
      status: "Locked Tier",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const weeklyActivity = [
    { name: 'Mon', hours: 4.2, tasks: 2 },
    { name: 'Tue', hours: 3.8, tasks: 1 },
    { name: 'Wed', hours: 5.5, tasks: 3 },
    { name: 'Thu', hours: 6.2, tasks: 4 },
    { name: 'Fri', hours: 4.8, tasks: 2 },
    { name: 'Sat', hours: 7.5, tasks: 5 },
    { name: 'Sun', hours: 5.0, tasks: 3 }
  ];

  const engagementMatrix = [
    { name: 'Underwriting', LecturesCompleted: 24, SubmittedDeals: 3 },
    { name: 'Flipping ARV', LecturesCompleted: 18, SubmittedDeals: 2 },
    { name: 'Luxury Branding', LecturesCompleted: 6, SubmittedDeals: 0 },
    { name: 'Negotiation', LecturesCompleted: 15, SubmittedDeals: 1 }
  ];

  const workstationLogs = [
    { deal: "52-Unit Apartment Underwriting Model", date: "May 18, 2026", type: "Spreadsheet", size: "4.8 MB", score: "94%" },
    { deal: "Dallas Single-Family Rehab ARV Worksheet", date: "May 15, 2026", type: "Valuation Matrix", size: "2.4 MB", score: "88%" },
    { deal: "Lease Waterfall Commission Agreement Template", date: "May 12, 2026", type: "Legal Draft", size: "1.2 MB", score: "Accredited Completed" }
  ];

  const upcomingBroadcast = useMemo(() => {
    const base = baseMs;
    const startAt = new Date(base + 90 * 60 * 1000).toISOString(); // ~90 minutes from page open
    const endAt = new Date(base + 90 * 60 * 1000 + 75 * 60 * 1000).toISOString();
    return {
      title: 'Dallas Multifamily Deal Audit',
      host: 'Robert Sterling',
      startAt,
      endAt,
    };
  }, [baseMs]);

  const nextAssignmentDue = useMemo(() => {
    // Keep this in sync with the demo Assignments page seed dates (and safe if missing)
    const seededDueDates = ['May 22, 2026', 'May 19, 2026', 'May 15, 2026'];
    const parsed = seededDueDates
      .map((d) => safeParseDate(d))
      .filter(Boolean)
      .sort((a, b) => a.getTime() - b.getTime());

    const future = parsed.find((d) => d.getTime() > baseMs);
    const dueAt = (future || parsed[0])?.toISOString?.() || new Date(baseMs + 36 * 60 * 60 * 1000).toISOString();
    return { title: 'Next Assignment Deadline', dueAt };
  }, [baseMs]);

  const broadcastPhase = getTimerPhase({ nowMs, startAt: upcomingBroadcast.startAt, endAt: upcomingBroadcast.endAt });
  const broadcastStartMs = safeParseDate(upcomingBroadcast.startAt)?.getTime?.() ?? null;
  const broadcastEndMs = safeParseDate(upcomingBroadcast.endAt)?.getTime?.() ?? null;
  const broadcastRemainingMs = (() => {
    if (!broadcastStartMs) return 0;
    if (broadcastPhase.phase === 'live' && broadcastEndMs) return Math.max(0, broadcastEndMs - nowMs);
    return Math.max(0, broadcastStartMs - nowMs);
  })();
  const broadcastTone = getUrgencyTone(broadcastRemainingMs);

  const assignmentDueMs = safeParseDate(nextAssignmentDue.dueAt)?.getTime?.() ?? null;
  const assignmentRemainingMs = assignmentDueMs ? Math.max(0, assignmentDueMs - nowMs) : 0;
  const assignmentTone = getUrgencyTone(assignmentRemainingMs);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        {/* Welcome Header Skeleton */}
        <div className="h-28 bg-slate-200 rounded-3xl w-full"></div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-20 bg-slate-200 rounded-2xl w-full"></div>
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-80 bg-slate-200 rounded-3xl lg:col-span-2 w-full"></div>
          <div className="h-80 bg-slate-200 rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Welcome Banner Widget - Deep Navy anchor for visual weight */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 to-premium-dark p-8 rounded-3xl border border-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="space-y-1">
          <Badge variant="premium" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[9px] font-black uppercase mb-1">
            CRE Student Workspace
          </Badge>
          <h1 className="text-3xl font-black text-white">Welcome back, Johnathan! 👋</h1>
          <p className="text-xs text-slate-400 font-bold">
            Your Property Sales Mastery track is 75% complete. Next live commercial audit starts in 1 hour!
          </p>
        </div>

        {/* Member and stats indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner">
            <Flame className="w-5 h-5 text-amber-500 fill-current animate-bounce" />
            <div className="text-left">
              <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black">Study Streak</p>
              <p className="text-xs font-black text-white">7 Days Active</p>
            </div>
          </div>
          <Badge variant="premium" className="py-2.5 px-4 rounded-xl text-xs font-black tracking-wider border-violet-500/20 bg-violet-500/10 text-violet-400">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-current text-premium-accent" /> Elite Member
            </span>
          </Badge>
        </div>
      </div>

      {/* 5 Premium Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className={`relative overflow-hidden group border ${stat.border} bg-white p-6 shadow-sm hover:shadow-[0_12px_35px_rgba(15,23,42,0.05)] hover:border-premium-accent/20 transition-all duration-300 rounded-2xl`}>
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">{stat.label}</span>
                <div className={`${stat.bg} ${stat.color} p-2 rounded-xl border border-slate-50`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-premium-heading">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-bold">{stat.detail}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Grid - Double Chart tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Double Analytics Charts Card */}
        <GlassCard className="lg:col-span-2 border border-premium-border bg-white p-6 shadow-sm rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-black text-premium-heading">Study &amp; Deal Analytics</h3>
              <p className="text-xs text-slate-400 font-bold">Weekly study hours and asset engagement matrix</p>
            </div>
            
            {/* Chart toggle controls */}
            <div className="bg-slate-50 border border-premium-border p-1 rounded-xl flex items-center self-start">
              {['Activity', 'Engagement'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-premium-accent shadow-sm border border-premium-border/40' 
                      : 'text-slate-400 hover:text-premium-heading'
                  }`}
                >
                  {tab === 'Activity' ? 'Study Hours' : 'Engagement Grid'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'Activity' ? (
                <AreaChart data={weeklyActivity}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                      color: '#0f172a',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    name="Watch Hours"
                    stroke="#2563eb" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorHours)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={engagementMatrix}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  <Bar dataKey="LecturesCompleted" name="Lectures Completed" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="SubmittedDeals" name="Deals Submitted" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Right Live Broadcast Countdown Banner */}
        <GlassCard className="border border-premium-border bg-white p-6 shadow-sm rounded-3xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-premium-heading">Upcoming Broadcast</h3>
              {broadcastPhase.phase === 'live' ? (
                <Badge variant="danger" className="bg-red-50 text-red-500 border border-red-100 text-[8px] font-black uppercase animate-pulse">
                  LIVE NOW
                </Badge>
              ) : broadcastPhase.phase === 'ended' ? (
                <Badge variant="outline" className="bg-slate-50 text-slate-500 border border-slate-100 text-[8px] font-black uppercase">
                  Ended
                </Badge>
              ) : broadcastPhase.phase === 'invalid' ? (
                <Badge variant="outline" className="bg-slate-50 text-slate-500 border border-slate-100 text-[8px] font-black uppercase">
                  TBD
                </Badge>
              ) : (
                <Badge variant="premium" className={`text-[8px] font-black uppercase border ${
                  broadcastTone === 'critical'
                    ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                    : 'bg-violet-50 text-violet-600 border-violet-100'
                }`}>
                  Upcoming
                </Badge>
              )}
            </div>
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-premium-border/40 text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-premium-border">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="mentor" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-premium-heading line-clamp-1 leading-snug">{upcomingBroadcast.title}</h4>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">Mentor: {upcomingBroadcast.host}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-premium-accent font-black border-t border-slate-200/50 pt-3">
                <Clock className="w-3.5 h-3.5" />
                <span className={`flex items-center gap-2 ${
                  broadcastPhase.phase === 'live'
                    ? 'text-red-500'
                    : broadcastTone === 'critical'
                      ? 'text-amber-700'
                      : 'text-premium-accent'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    broadcastPhase.phase === 'live'
                      ? 'bg-red-500 animate-ping'
                      : broadcastTone === 'critical'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-premium-accent/80 animate-pulse'
                  }`} />
                  {broadcastPhase.phase === 'invalid'
                    ? 'Time TBD'
                    : broadcastPhase.phase === 'ended'
                      ? `Broadcast ended • ${formatLocalDateTime(upcomingBroadcast.startAt, { withDate: true })}`
                      : broadcastPhase.phase === 'live'
                        ? `Live now • ${formatCountdownParts(broadcastRemainingMs)} left`
                        : `${formatLocalDateTime(upcomingBroadcast.startAt, { withDate: true })} • ${formatRelativeStart({ nowMs, startAt: upcomingBroadcast.startAt })} • ${formatCountdownParts(broadcastRemainingMs)}`
                  }
                </span>
              </div>
            </div>

            {/* Assignment deadline countdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-premium-border/40 text-left space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Assignment Due</h4>
                {assignmentRemainingMs <= 0 ? (
                  <Badge variant="danger" className="bg-red-50 text-red-500 border border-red-100 text-[8px] font-black uppercase">
                    Expired
                  </Badge>
                ) : assignmentTone === 'critical' ? (
                  <Badge variant="danger" className="bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-black uppercase animate-pulse">
                    Due Soon
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-white/70 text-slate-500 border border-slate-200/60 text-[8px] font-black uppercase">
                    Active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black">
                <Clock className={`w-3.5 h-3.5 ${
                  assignmentRemainingMs <= 0 ? 'text-red-500' : assignmentTone === 'critical' ? 'text-amber-600' : 'text-premium-accent'
                }`} />
                <span className={`${
                  assignmentRemainingMs <= 0 ? 'text-red-500' : assignmentTone === 'critical' ? 'text-amber-700' : 'text-premium-accent'
                }`}>
                  Due {formatLocalDateTime(nextAssignmentDue.dueAt, { withDate: true })} • {assignmentRemainingMs <= 0 ? 'Past due' : formatCountdownParts(assignmentRemainingMs)}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-50 pb-2">Webinar Checklist</h4>
              {[
                "Bring your local deal underwriting sheet",
                "Verify debt leverage interest rate formulas",
                "Prepare GP/LP equity split questions"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/live" className="w-full">
            <Button variant="outline" className="w-full text-[10px] uppercase font-black tracking-wider mt-6 h-11 rounded-xl shadow-none">
              View Webinar Schedule
            </Button>
          </Link>
        </GlassCard>
      </div>

      {/* Progress Section - Realistic Real Estate Course Data (Continue Studies Grid) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-premium-heading">Continue Academy Studies</h3>
            <p className="text-xs text-slate-400 font-bold">Track your realistic property coaching progress</p>
          </div>
          <Link to="/courses">
            <Button variant="ghost" className="text-premium-accent hover:text-blue-700 text-xs uppercase font-black tracking-widest flex items-center gap-1">
              View Enrolled Catalog <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {dashboardCourses.slice(0, 3).map((course) => (
            <GlassCard key={course.id} className="group p-0 overflow-hidden flex flex-col border border-premium-border bg-white shadow-sm hover:shadow-[0_12px_35px_rgba(15,23,42,0.05)] hover:border-premium-accent/20 transition-all duration-300 rounded-3xl">
              <div className="relative h-44 shrink-0">
                <img 
                  src={course.image} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90" 
                  alt={course.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant={course.status === 'Locked Tier' ? 'premium' : 'success'} className="mb-2 text-[8px] font-black uppercase">
                    {course.category}
                  </Badge>
                  <h4 className="font-bold text-base text-white line-clamp-1 leading-snug">{course.title}</h4>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Instructor: {course.instructor}</span>
                  <span>{course.duration}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-slate-400">Syllabus Progress</span>
                    <span className="text-premium-accent">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 border border-slate-200/40 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className="h-full bg-premium-accent rounded-full"
                    ></motion.div>
                  </div>
                </div>

                <Link to={`/watch/${course.id}`}>
                  <Button variant="primary" className="w-full group text-xs uppercase tracking-wider font-black h-11 rounded-xl text-white">
                    Continue Module
                    <Play className="ml-1.5 w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Recent Lectures & Spreadsheet Workstation Logs */}
      <div className="pt-4">
        <GlassCard className="border border-premium-border bg-white p-6 shadow-sm rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-premium-heading">Recent Spreadsheet Submissions</h3>
              <p className="text-xs text-slate-400 font-bold">Underwriting valuations and exit budget audit trails</p>
            </div>
            <Link to="/assignments">
              <Button variant="outline" className="text-[10px] uppercase font-black tracking-wider h-10 px-4 rounded-xl shadow-none">
                Deal Assignments Desk
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-500 font-bold">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-wider text-left">
                  <th className="pb-4 font-black">Asset Sheet</th>
                  <th className="pb-4 font-black">Submission Date</th>
                  <th className="pb-4 font-black">Category</th>
                  <th className="pb-4 font-black">File Size</th>
                  <th className="pb-4 font-black text-right">Mentor Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {workstationLogs.map((log, index) => (
                  <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-premium-heading font-bold flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 border border-blue-100 text-blue-500 rounded-lg flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </div>
                      <span className="group-hover:text-premium-accent transition-colors cursor-pointer">{log.deal}</span>
                    </td>
                    <td className="py-4 text-slate-400">{log.date}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-500 font-mono text-[9px] uppercase font-black border border-slate-200/50">{log.type}</span>
                    </td>
                    <td className="py-4 text-slate-400 font-mono">{log.size}</td>
                    <td className="py-4 text-right">
                      <span className={`font-black text-xs ${log.score.includes('%') ? 'text-emerald-500' : 'text-premium-accent'}`}>{log.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default Dashboard;
