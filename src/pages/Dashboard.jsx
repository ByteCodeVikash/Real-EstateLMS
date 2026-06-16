import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  BookOpen, Clock, CheckCircle, Play, Star,
  Flame, ExternalLink, Download, Video, TrendingUp, Award
} from 'lucide-react';
import { GlassCard, Badge, Button, StatCard, Skeleton } from '../components/UI';
import { Link } from 'react-router-dom';
import { useNow } from '../hooks/useNow';
import { useAuth } from '../context/AuthContext';
import { formatCountdownParts, formatLocalDateTime, formatRelativeStart, getTimerPhase, getUrgencyTone, safeParseDate } from '../utils/countdown';

// Custom dark tooltip for recharts
const DarkTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f12] border border-[#1e1e22] rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md text-left border-l-2 border-l-premium-accent">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
            <span className="text-slate-400">{p.name}:</span>
            <span>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user, token, API_BASE_URL } = useAuth();
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('Activity');
  const [dashboardData, setDashboardData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const nowMs  = useNow();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/api/my-courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.status === 'success') {
            setDashboardData(statsData.data);
          }
        }
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          if (coursesData.status === 'success') {
            setEnrolledCourses(coursesData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token, API_BASE_URL]);

  const stats = useMemo(() => {
    if (!dashboardData?.stats) {
      return [
        { label: 'Enrolled Courses',    value: '0 Programs',  detail: 'No active enrollments',             icon: BookOpen, accentClass: 'text-[#1E88E5]', bgClass: 'bg-[#0A66C2]/10', borderClass: 'border-[#0A66C2]/15' },
        { label: 'Watch Hours',         value: '0 Hrs',    detail: 'No hours recorded',               icon: Clock,    accentClass: 'text-premium-accent', bgClass: 'bg-premium-accent/10', borderClass: 'border-premium-accent/15' },
        { label: 'Course Completion',   value: '0% Avg',     detail: 'Average course progress',          icon: CheckCircle, accentClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/15' },
        { label: 'Webinar Attendance',  value: '0% Ratio',   detail: 'No live audits attended',      icon: Video,    accentClass: 'text-rose-400', bgClass: 'bg-rose-500/10', borderClass: 'border-rose-500/15' },
        { label: 'Learning Streak',     value: '0 Days',      detail: 'Personal streak record!',          icon: Flame,    accentClass: 'text-amber-400', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/15' },
      ];
    }
    const s = dashboardData.stats;
    return [
      { label: 'Enrolled Courses',    value: s.enrolled_courses,  detail: s.enrolled_detail,              icon: BookOpen, accentClass: 'text-[#1E88E5]', bgClass: 'bg-[#0A66C2]/10', borderClass: 'border-[#0A66C2]/15' },
      { label: 'Watch Hours',         value: s.watch_hours,       detail: s.watch_detail,               icon: Clock,    accentClass: 'text-premium-accent', bgClass: 'bg-premium-accent/10', borderClass: 'border-premium-accent/15' },
      { label: 'Course Completion',   value: s.completion_ratio,  detail: s.completion_detail,          icon: CheckCircle, accentClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/15' },
      { label: 'Webinar Attendance',  value: s.webinar_attendance, detail: s.webinar_detail,      icon: Video,    accentClass: 'text-rose-400', bgClass: 'bg-rose-500/10', borderClass: 'border-rose-500/15' },
      { label: 'Learning Streak',     value: s.streak,            detail: s.streak_detail,          icon: Flame,    accentClass: 'text-amber-400', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/15' },
    ];
  }, [dashboardData]);

  const weeklyActivity = [
    { name: 'Mon', hours: 4.2 }, { name: 'Tue', hours: 3.8 }, { name: 'Wed', hours: 5.5 },
    { name: 'Thu', hours: 6.2 }, { name: 'Fri', hours: 4.8 }, { name: 'Sat', hours: 7.5 }, { name: 'Sun', hours: 5.0 },
  ];

  const engagementMatrix = [
    { name: 'Underwriting',  LecturesCompleted: 24, SubmittedDeals: 3 },
    { name: 'Flipping ARV',  LecturesCompleted: 18, SubmittedDeals: 2 },
    { name: 'Luxury Brand',  LecturesCompleted: 6,  SubmittedDeals: 0 },
    { name: 'Negotiation',   LecturesCompleted: 15, SubmittedDeals: 1 },
  ];

  const upcomingBroadcast = useMemo(() => {
    if (dashboardData?.upcoming_webinar) {
      const w = dashboardData.upcoming_webinar;
      return { 
        title: w.title, 
        host: w.mentor_name || 'Academy Instructor', 
        startAt: w.date_time, 
        endAt: new Date(new Date(w.date_time).getTime() + 75 * 60 * 1000).toISOString() 
      };
    }
    // Fallback static if database is empty
    return { title: 'Dallas Multifamily Deal Audit', host: 'Robert Sterling', startAt: new Date(nowMs + 90 * 60 * 1000).toISOString(), endAt: new Date(nowMs + 165 * 60 * 1000).toISOString() };
  }, [dashboardData, nowMs]);

  const nextAssignmentDue = useMemo(() => {
    if (dashboardData?.next_assignment) {
      const a = dashboardData.next_assignment;
      return { title: a.title, dueAt: a.due_date };
    }
    // Fallback static
    return { title: 'Valuation Assignment', dueAt: new Date(nowMs + 36 * 60 * 60 * 1000).toISOString() };
  }, [dashboardData, nowMs]);

  const broadcastPhase       = getTimerPhase({ nowMs, startAt: upcomingBroadcast.startAt, endAt: upcomingBroadcast.endAt });
  const broadcastStartMs     = upcomingBroadcast.startAt ? safeParseDate(upcomingBroadcast.startAt)?.getTime?.() ?? null : null;
  const broadcastEndMs       = upcomingBroadcast.endAt ? safeParseDate(upcomingBroadcast.endAt)?.getTime?.() ?? null : null;
  const broadcastRemainingMs = (() => {
    if (!broadcastStartMs) return 0;
    if (broadcastPhase.phase === 'live' && broadcastEndMs) return Math.max(0, broadcastEndMs - nowMs);
    return Math.max(0, broadcastStartMs - nowMs);
  })();
  const broadcastTone = getUrgencyTone(broadcastRemainingMs);

  const assignmentDueMs       = nextAssignmentDue.dueAt ? safeParseDate(nextAssignmentDue.dueAt)?.getTime?.() ?? null : null;
  const assignmentRemainingMs = assignmentDueMs ? Math.max(0, assignmentDueMs - nowMs) : 0;
  const assignmentTone        = getUrgencyTone(assignmentRemainingMs);

  // ─── Skeleton ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <Skeleton className="h-32 rounded-3xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in text-left">

      {/* ── Welcome Banner ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1a1a1c] shadow-dark-lg">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#0b0b0d]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/8 via-transparent to-[#D4AF37]/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium-accent/30 to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-premium-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#0A66C2]/5 rounded-full blur-3xl" />

        <div className="relative p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="blue" className="mb-1">
              CRE Student Workspace
            </Badge>
            <h1 className="text-3xl font-black text-white">Welcome back, {user?.full_name || 'Student'}! 👋</h1>
            {enrolledCourses.length > 0 ? (
              <p className="text-sm text-slate-400 font-semibold">
                Your <span className="text-premium-accent font-black">{enrolledCourses[0].title}</span> track is {enrolledCourses[0].progress}% complete.
              </p>
            ) : (
              <p className="text-sm text-slate-400 font-semibold">
                Explore our commercial real estate catalogs to start your professional journey!
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-amber-400 fill-current animate-bounce" />
              <div className="text-left">
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Study Streak</p>
                <p className="text-xs font-black text-white">{dashboardData?.stats?.streak || '7 Days'}</p>
              </div>
            </div>
            <Badge variant="premium" className="py-2 px-4 text-xs">
              <Star className="w-3.5 h-3.5 fill-current mr-1.5" /> Elite Member
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ── Analytics Charts + Broadcast ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Charts card */}
        <GlassCard className="lg:col-span-2 p-6 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-black text-white">Study &amp; Deal Analytics</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Weekly study hours and asset engagement matrix</p>
            </div>
            <div className="bg-[#0f0f12] border border-[#1e1e22] p-1 rounded-xl flex items-center self-start shrink-0">
              {['Activity', 'Engagement'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-premium text-black shadow-gold-sm'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {tab === 'Activity' ? 'Study Hrs' : 'Engagement'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'Activity' ? (
                <AreaChart data={weeklyActivity}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1c" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#606068', fontSize: 10, fontWeight: 700 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#606068', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="hours" name="Watch Hours" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              ) : (
                <BarChart data={engagementMatrix}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1c" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#606068', fontSize: 10, fontWeight: 700 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#606068', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#606068' }} />
                  <Bar dataKey="LecturesCompleted" name="Lectures Done" fill="#0A66C2" radius={[4,4,0,0]} barSize={14} />
                  <Bar dataKey="SubmittedDeals"    name="Deals Submitted" fill="#D4AF37" radius={[4,4,0,0]} barSize={14} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Broadcast & countdown */}
        <GlassCard className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Upcoming Broadcast</h3>
              {broadcastPhase.phase === 'live' ? (
                <Badge variant="danger" className="animate-pulse">LIVE NOW</Badge>
              ) : broadcastPhase.phase === 'ended' ? (
                <Badge variant="muted">Ended</Badge>
              ) : (
                <Badge variant={broadcastTone === 'critical' ? 'warning' : 'blue'}>
                  Upcoming
                </Badge>
              )}
            </div>

            {/* Session info */}
            <div className="p-4 rounded-2xl bg-[#0f0f12] border border-[#1e1e22] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#1e1e22]">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="mentor" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-white line-clamp-1">{upcomingBroadcast.title}</h4>
                  <p className="text-[9px] text-slate-500 font-bold mt-0.5">Mentor: {upcomingBroadcast.host}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black border-t border-[#1a1a1c] pt-2.5">
                <Clock className={`w-3.5 h-3.5 ${broadcastPhase.phase === 'live' ? 'text-red-400' : 'text-premium-accent'}`} />
                <span className={broadcastPhase.phase === 'live' ? 'text-red-400' : broadcastTone === 'critical' ? 'text-amber-400' : 'text-premium-accent'}>
                  <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                    broadcastPhase.phase === 'live' ? 'bg-red-500 animate-ping' : 'bg-premium-accent animate-pulse'
                  }`} />
                  {broadcastPhase.phase === 'invalid' ? 'Time TBD'
                    : broadcastPhase.phase === 'ended' ? 'Broadcast ended'
                    : broadcastPhase.phase === 'live' ? `Live now · ${formatCountdownParts(broadcastRemainingMs)} left`
                    : `${formatLocalDateTime(upcomingBroadcast.startAt, { withDate: true })} · ${formatCountdownParts(broadcastRemainingMs)}`
                  }
                </span>
              </div>
            </div>

            {/* Assignment due */}
            <div className="p-4 rounded-2xl bg-[#0f0f12] border border-[#1e1e22] space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Assignment Due</h4>
                {assignmentRemainingMs <= 0 ? (
                  <Badge variant="danger">Expired</Badge>
                ) : assignmentTone === 'critical' ? (
                  <Badge variant="warning" className="animate-pulse">Due Soon</Badge>
                ) : (
                  <Badge variant="muted">Active</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black">
                <Clock className={`w-3 h-3 ${assignmentRemainingMs <= 0 ? 'text-red-400' : assignmentTone === 'critical' ? 'text-amber-400' : 'text-premium-accent'}`} />
                <span className={assignmentRemainingMs <= 0 ? 'text-red-400' : assignmentTone === 'critical' ? 'text-amber-400' : 'text-premium-accent'}>
                  Due {formatLocalDateTime(nextAssignmentDue.dueAt, { withDate: true })} · {assignmentRemainingMs <= 0 ? 'Past due' : formatCountdownParts(assignmentRemainingMs)}
                </span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-[9px] text-slate-600 font-black uppercase tracking-widest pb-1.5 border-b border-[#1a1a1c]">Webinar Checklist</h4>
              {[
                'Bring your local deal underwriting sheet',
                'Verify debt leverage interest rate formulas',
                'Prepare GP/LP equity split questions',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/live" className="mt-5 block">
            <Button variant="outline" className="w-full text-[10px] uppercase font-black tracking-wider h-10 rounded-xl">
              View Webinar Schedule
            </Button>
          </Link>
        </GlassCard>
      </div>

      {/* ── Course Progress Grid ──────────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white">Continue Academy Studies</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">Track your property coaching progress</p>
          </div>
          <Link to="/courses">
            <Button variant="ghost" className="text-premium-accent hover:text-premium-gold-light text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5">
              View All Courses <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-[#0b0b0d] border border-dashed border-[#1a1a1c] rounded-2xl">
              <p className="text-slate-400 text-sm font-semibold mb-4">You are not enrolled in any courses yet.</p>
              <Link to="/courses">
                <Button variant="premium" className="text-[10px] uppercase font-black tracking-wider px-6 h-10 rounded-xl animate-pulse">
                  Explore Course Catalog
                </Button>
              </Link>
            </div>
          ) : (
            enrolledCourses.slice(0, 3).map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className="group bg-[#0b0b0d] border border-[#1a1a1c] rounded-2xl overflow-hidden flex flex-col hover:border-premium-accent/20 transition-all duration-300 shadow-dark-card"
              >
                {/* Course thumbnail */}
                <div className="relative h-44 shrink-0 overflow-hidden">
                  <img
                    src={course.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                    alt={course.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant={course.status === 'Locked Tier' ? 'warning' : 'premium'} className="mb-2">
                      {course.category}
                    </Badge>
                    <h4 className="font-black text-sm text-white line-clamp-1 leading-snug">{course.title}</h4>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                    <span>{course.instructor}</span>
                    <span>{course.duration}</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-premium-accent">{course.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 0.9, delay: 0.1 }}
                        className="progress-fill-gold"
                      />
                    </div>
                    {course.last_watched_lecture_title ? (
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-1">
                        <span className="text-premium-gold-light font-bold">Resume:</span> {course.last_watched_lecture_title}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic mt-1">
                        Not started yet
                      </p>
                    )}
                  </div>

                  <Link to={`/watch/${course.id}`}>
                    <Button
                      variant="primary"
                      className="w-full text-[10px] uppercase tracking-wider font-black h-10 rounded-xl"
                    >
                      Continue Module <Play className="ml-1.5 w-3.5 h-3.5 fill-current" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ── Recent Submissions Table ─────────────────── */}
      <GlassCard className="p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black text-white">Recent Spreadsheet Submissions</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">Underwriting valuations and exit budget audit trails</p>
          </div>
          <Link to="/assignments">
            <Button variant="outline" className="text-[10px] uppercase font-black tracking-wider h-9 px-4 rounded-xl">
              Deal Assignments
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table-dark w-full">
            <thead>
              <tr>
                <th>Asset Sheet</th>
                <th>Submission Date</th>
                <th>Category</th>
                <th>File Size</th>
                <th className="text-right">Mentor Score</th>
              </tr>
            </thead>
            <tbody>
              {!dashboardData?.recent_submissions || dashboardData.recent_submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-slate-500 text-xs py-8">
                    No submissions yet. Start your first deal assignment!
                  </td>
                </tr>
              ) : (
                dashboardData.recent_submissions.map((log, idx) => (
                  <tr key={idx} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <a 
                          href={`${API_BASE_URL}${log.file_path}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-8 h-8 bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#1E88E5] rounded-lg flex items-center justify-center shrink-0 hover:bg-[#0A66C2]/20 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <span className="text-white font-bold group-hover:text-premium-accent transition-colors">
                          {log.assignment_title}
                        </span>
                      </div>
                    </td>
                    <td className="text-slate-500">
                      {new Date(log.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-[#111114] border border-[#1e1e22] text-slate-500 font-mono text-[9px] font-black uppercase">
                        {log.course_title}
                      </span>
                    </td>
                    <td className="font-mono text-slate-500">File Submission</td>
                    <td className="text-right">
                      <span className={`font-black text-xs ${log.grade ? 'text-emerald-400' : 'text-premium-accent'}`}>
                        {log.grade ? `${log.grade}%` : log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
};

export default Dashboard;
