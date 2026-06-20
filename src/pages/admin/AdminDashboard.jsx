import React, { useState, useEffect } from 'react';
import {
  DollarSign, Users, Award, Calendar, Play, FileText,
  Send, Shield, CheckCircle2, ChevronRight, UserPlus, BookOpen,
  TrendingUp, Laptop, LifeBuoy, AlertTriangle, Activity, HardDrive,
  Cpu, Server, ShieldCheck, Radio, Users2,
  Sparkles, Bell, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Legend, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { AdminStatCard, AdminTable, AdminDrawer, AdminModal } from '../../components/admin/AdminComponents';
import { Button, Badge } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

// Dark luxury tooltip for charts
const DarkTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f12]/95 border border-[#1e1e22] backdrop-blur-md px-4 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-left border-l-2 border-l-premium-accent">
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

// Shared dark input class for forms
const DI = "w-full bg-[#111114] border border-[#1e1e22] focus:border-premium-accent/40 focus:ring-1 focus:ring-premium-accent/20 outline-none rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-600 transition-all";
const DS = "w-full bg-[#111114] border border-[#1e1e22] focus:border-premium-accent/40 focus:ring-1 focus:ring-premium-accent/20 outline-none rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer";

export default function AdminDashboard() {
  const { token, API_BASE_URL } = useAuth();
  const [analyticsTab, setAnalyticsTab] = useState('overview');
  const [activityTab, setActivityTab]   = useState('enrollments');

  const [liveStats, setLiveStats] = useState({
    cpu: 4.8, latency: 12, activeSessions: 148,
    droppedFrames: 0.005, bandwidth: 4.2, blockedThreats: 32, failedLogins: 12
  });

  const [courseDrawerOpen,       setCourseDrawerOpen]       = useState(false);
  const [instructorModalOpen,    setInstructorModalOpen]    = useState(false);
  const [webinarModalOpen,       setWebinarModalOpen]       = useState(false);
  const [notificationModalOpen,  setNotificationModalOpen]  = useState(false);
  const [certificateModalOpen,   setCertificateModalOpen]   = useState(false);

  const [courseForm,      setCourseForm]      = useState({ title: '', category: 'Commercial', instructor: 'Sarah Jenkins', price: '1499', status: 'Published' });
  const [instructorForm,  setInstructorForm]  = useState({ name: '', email: '', expertise: 'Flipping', bio: '' });
  const [webinarForm,     setWebinarForm]     = useState({ title: '', date: '', time: '', link: '', instructor: 'Sarah Jenkins' });
  const [notificationForm,setNotificationForm]= useState({ title: '', message: '', audience: 'All Students', priority: 'Medium' });
  const [certificateForm, setCertificateForm] = useState({ studentName: '', courseName: 'Luxury Flipping Masterclass', issueDate: new Date().toISOString().split('T')[0], certId: `BG-CERT-${Math.floor(100000 + Math.random() * 900000)}` });

  const [coursesCount,        setCoursesCount]        = useState(0);
  const [webinarsCount,       setWebinarsCount]        = useState(0);
  const [totalStudentsCount,  setTotalStudentsCount]   = useState(0);
  const [supportTicketsCount, setSupportTicketsCount]  = useState(0);
  const [totalRevenue,        setTotalRevenue]         = useState(0);

  const [enrollments, setEnrollments] = useState([
    { id: 1, name: 'Robert Fox',     email: 'robert@foxrealestate.com', course: 'Luxury Flipping Masterclass',      amount: '₹1,499', status: 'Success', date: 'Just now',   avatar: 'RF' },
    { id: 2, name: 'Jane Cooper',    email: 'jane.cooper@realty.io',    course: 'Commercial Underwriting',          amount: '₹2,100', status: 'Success', date: '12 mins ago',avatar: 'JC' },
    { id: 3, name: 'Wade Warren',    email: 'wade.warren@century21.com',course: 'High-Ticket Real Estate Sales',    amount: '₹999',   status: 'Pending', date: '1 hr ago',   avatar: 'WW' },
    { id: 4, name: 'Esther Howard',  email: 'esther.h@gmail.com',       course: 'Luxury Flipping Masterclass',      amount: '₹1,499', status: 'Success', date: '3 hrs ago',  avatar: 'EH' },
  ]);

  const [submissions, setSubmissions] = useState([
    { id: 1, student: 'Guy Hawkins',       course: 'Commercial Underwriting',      assignment: 'Module 3: DSCR Spreadsheet',         status: 'Needs Review', date: '5 mins ago',  avatar: 'GH' },
    { id: 2, student: 'Leslie Alexander',  course: 'Luxury Flipping Masterclass',  assignment: 'Module 1: Comparables Presentation', status: 'Graded', grade: 'A+', date: '45 mins ago',avatar: 'LA' },
    { id: 3, student: 'Kristin Watson',    course: 'High-Ticket Real Estate Sales',assignment: 'Module 2: Listing Presentation Video',status: 'Graded', grade: 'A',  date: '2 hrs ago',  avatar: 'KW' },
  ]);

  const [webinarJoins, setWebinarJoins] = useState([
    { id: 1, student: 'Cody Fisher',       webinar: 'Multi-Family Sourcing & Deal Flow', duration: '45 mins', status: 'Connected', date: '10 mins ago', avatar: 'CF' },
    { id: 2, student: 'Brooklyn Simmons',  webinar: 'Multi-Family Sourcing & Deal Flow', duration: '12 mins', status: 'Left',      date: '25 mins ago', avatar: 'BS' },
    { id: 3, student: 'Jenny Wilson',      webinar: 'Multi-Family Sourcing & Deal Flow', duration: '50 mins', status: 'Connected', date: 'Just now',    avatar: 'JW' },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, invoice: 'INV-9021', student: 'Albert Flores',    course: 'Luxury Flipping Masterclass', gateway: 'Stripe', amount: '₹1,499', status: 'Succeeded', date: '8 mins ago',  avatar: 'AF' },
    { id: 2, invoice: 'INV-9020', student: 'Eleanor Pena',     course: 'Commercial Underwriting',     gateway: 'PayPal', amount: '₹2,100', status: 'Succeeded', date: '1 hr ago',    avatar: 'EP' },
    { id: 3, invoice: 'INV-9019', student: 'Marvin McKinney',  course: 'BRRRR Strategy Secrets',      gateway: 'Stripe', amount: '₹1,299', status: 'Failed',    date: '3 hrs ago',   avatar: 'MM' },
  ]);

  const [logins, setLogins] = useState([
    { id: 1, user: 'admin_backup',  ip: '185.220.101.4', location: 'Moscow, RU',   device: 'Chrome / Linux',  status: 'Blocked (MFA Required)',  date: '15 mins ago' },
    { id: 2, user: 'johndoe_re',    ip: '92.119.177.21', location: 'Shenzhen, CN', device: 'Safari / iOS',    status: 'Blocked (Invalid Pass)',   date: '40 mins ago' },
    { id: 3, user: 'vikash_owner',  ip: '103.88.22.41',  location: 'Mumbai, IN',   device: 'Firefox / MacOS', status: 'Allowed (Geo Trust)',      date: '2 hrs ago' },
  ]);

  // Load live stats from backend API
  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            const data = resData.data;
            if (data.total_students !== undefined) setTotalStudentsCount(data.total_students);
            if (data.total_courses !== undefined) setCoursesCount(data.total_courses);
            if (data.total_webinars !== undefined) setWebinarsCount(data.total_webinars);
            if (data.gross_revenue !== undefined) setTotalRevenue(data.gross_revenue);
            if (data.pending_reviews !== undefined) setSupportTicketsCount(data.pending_reviews);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [token, API_BASE_URL]);

  // Live system simulation
  useEffect(() => {
    const t = setInterval(() => {
      setLiveStats(prev => ({
        cpu:            Math.max(1, Math.min(99, parseFloat((prev.cpu + (Math.random() - 0.5) * 1.5).toFixed(1)))),
        latency:        Math.max(5, Math.min(120, Math.round(prev.latency + (Math.random() - 0.5) * 2))),
        activeSessions: Math.max(50, prev.activeSessions + (Math.random() > 0.5 ? 1 : -1)),
        droppedFrames:  Math.max(0.001, Math.min(1.0, parseFloat((prev.droppedFrames + (Math.random() - 0.5) * 0.001).toFixed(4)))),
        bandwidth:      Math.max(1.0, Math.min(10.0, parseFloat((prev.bandwidth + (Math.random() - 0.5) * 0.2).toFixed(1)))),
        blockedThreats: Math.random() > 0.85 ? prev.blockedThreats + 1 : prev.blockedThreats,
        failedLogins:   Math.random() > 0.95 ? prev.failedLogins + 1 : prev.failedLogins,
      }));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Form handlers
  const handleCourseSubmit = (e) => {
    e.preventDefault();
    setCoursesCount(p => p + 1);
    setEnrollments(p => [{ id: Date.now(), name: 'New Student', email: 'student@bgrealtyacademy.com', course: courseForm.title, amount: `₹${parseFloat(courseForm.price).toLocaleString()}`, status: 'Success', date: 'Just now', avatar: 'NS' }, ...p]);
    alert(`Masterclass "${courseForm.title}" published successfully!`);
    setCourseDrawerOpen(false);
  };
  const handleInstructorSubmit = (e) => {
    e.preventDefault();
    alert(`Instructor "${instructorForm.name}" onboarded successfully!`);
    setInstructorModalOpen(false);
  };
  const handleWebinarSubmit = (e) => {
    e.preventDefault();
    setWebinarsCount(p => p + 1);
    alert(`Broadcast "${webinarForm.title}" scheduled for ${webinarForm.date} at ${webinarForm.time}!`);
    setWebinarModalOpen(false);
  };
  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    alert(`Notification "${notificationForm.title}" pushed! Priority: ${notificationForm.priority}`);
    setNotificationModalOpen(false);
  };
  const handleCertificateSubmit = (e) => {
    e.preventDefault();
    alert(`Certificate ${certificateForm.certId} issued to "${certificateForm.studentName}"!`);
    setCertificateModalOpen(false);
  };

  // Chart data
  const revenueTrendData = [
    { name: 'Jan', revenue: 45000, registrations: 120, expenses: 15000 },
    { name: 'Feb', revenue: 52000, registrations: 150, expenses: 18000 },
    { name: 'Mar', revenue: 61000, registrations: 180, expenses: 22000 },
    { name: 'Apr', revenue: 58000, registrations: 170, expenses: 19000 },
    { name: 'May', revenue: 78000, registrations: 240, expenses: 28000 },
    { name: 'Jun', revenue: 95000, registrations: 310, expenses: 32000 },
  ];
  const studentGrowthData = [
    { name: 'Jan', newStudents: 80,  activeStudents: 850  },
    { name: 'Feb', newStudents: 110, activeStudents: 960  },
    { name: 'Mar', newStudents: 135, activeStudents: 1095 },
    { name: 'Apr', newStudents: 95,  activeStudents: 1190 },
    { name: 'May', newStudents: 160, activeStudents: 1350 },
    { name: 'Jun', newStudents: 210, activeStudents: 1560 },
  ];
  const courseEngagementData = [
    { name: 'Luxury Flipping',   watchHours: 1240, activeStudents: 310, completionRate: 88 },
    { name: 'Comm Underwriting', watchHours: 1890, activeStudents: 240, completionRate: 82 },
    { name: 'High-Ticket Sales', watchHours:  950, activeStudents: 180, completionRate: 79 },
    { name: 'Legal & Codes',     watchHours:  640, activeStudents: 150, completionRate: 91 },
    { name: 'BRRRR Strategy',    watchHours: 1100, activeStudents: 290, completionRate: 85 },
  ];
  const webinarConversions = [
    { name: 'Comm JV',         registered: 450, attended: 290 },
    { name: 'Flipping Taxes',  registered: 600, attended: 420 },
    { name: 'Tenant Underwrite',registered: 350, attended: 210 },
    { name: 'Multi-Family',    registered: 520, attended: 340 },
  ];
  const completionMetrics = [
    { name: 'Completed',    value: 84.2, color: '#10b981' },
    { name: 'In Progress',  value: 12.3, color: '#0A66C2' },
    { name: 'Dropped',      value:  3.5, color: '#D4AF37' },
  ];

  const ANALYTICS_TABS = ['overview', 'revenue', 'engagement', 'webinar'];
  const ACTIVITY_TABS  = ['enrollments','submissions','webinarJoins','payments','logins'];

  // shared chart axis style
  const axTick = { fill: '#606068', fontSize: 10, fontWeight: 700 };

  return (
    <div className="space-y-8 animate-in text-left">

      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-[#1a1a1c]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-premium-accent animate-pulse" />
            <span className="text-[9px] font-black text-premium-accent uppercase tracking-widest">Enterprise Console</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">BG Realty Training Academy</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Control center for students, courses, webinars, and real-time portal operations.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setNotificationModalOpen(true)}>
            <Send className="w-4 h-4 mr-2 text-premium-accent" /> Alert Broadcast
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWebinarModalOpen(true)}>
            <Calendar className="w-4 h-4 mr-2 text-[#1E88E5]" /> Schedule Webinar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setCourseDrawerOpen(true)}>
            <BookOpen className="w-4 h-4 mr-2" /> Add Course
          </Button>
        </div>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Core Portal Metrics</span>
          <span className="text-[9px] font-bold text-slate-600 bg-[#111114] px-2 py-1 rounded-lg border border-[#1e1e22]">Live Updates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AdminStatCard title="Total Students"           value={totalStudentsCount.toLocaleString()} change="+8.2%"  isPositive={true}  icon={Users}     gradient="from-[#0A66C2]/15 to-[#1E88E5]/5" />
          <AdminStatCard title="Active Courses"           value={coursesCount.toString()}             change="+12.0%" isPositive={true}  icon={BookOpen}  gradient="from-premium-accent/15 to-premium-accent/5" />
          <AdminStatCard title="Gross Revenue"            value={`₹${totalRevenue.toLocaleString()}`} change="+18.4%" isPositive={true}  icon={DollarSign}gradient="from-emerald-500/12 to-emerald-500/4" />
          <AdminStatCard title="Live Classes Scheduled"   value={webinarsCount.toString()}            change="-2.3%"  isPositive={false} icon={Calendar}  gradient="from-amber-500/12 to-amber-500/4" timeframe="vs last week" />
          <AdminStatCard title="Assignment Completion"    value="84.2%"                               change="+1.8%"  isPositive={true}  icon={FileText}  gradient="from-rose-500/12 to-rose-500/4" />
          <AdminStatCard title="Monthly Growth"           value="+14.5%"                              change="+3.1%"  isPositive={true}  icon={TrendingUp} gradient="from-cyan-500/12 to-cyan-500/4" />
          <AdminStatCard title="Active Devices"           value={liveStats.activeSessions.toString()} change="+10.5%" isPositive={true}  icon={Laptop}    gradient="from-lime-500/12 to-lime-500/4" timeframe="vs last hour" />
          <AdminStatCard title="Support Tickets"          value={supportTicketsCount.toString()}       change="95% Solved" isPositive={true} icon={LifeBuoy} gradient="from-red-500/12 to-red-500/4" timeframe="resolved this week" />
        </div>
      </div>

      {/* ── Analytics Charts Card ────────────────────── */}
      <div className="rounded-2xl bg-[#0b0b0d] border border-[#1a1a1c] p-6 shadow-dark-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1a1a1c]">
          <div>
            <h3 className="text-base font-black text-white tracking-tight uppercase">Portal Analytics &amp; Performance</h3>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Visualize user engagement, stream metrics, and revenue trends</p>
          </div>
          <div className="flex items-center gap-1 bg-[#0f0f12] border border-[#1e1e22] p-1 rounded-xl self-start sm:self-auto flex-wrap">
            {ANALYTICS_TABS.map(t => (
              <button
                key={t}
                onClick={() => setAnalyticsTab(t)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all whitespace-nowrap ${
                  analyticsTab === t
                    ? 'bg-gradient-premium text-black shadow-gold-sm'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {t === 'overview' ? 'Overview' : t === 'revenue' ? 'Revenue' : t === 'engagement' ? 'Engagement' : 'Webinars'}
              </button>
            ))}
          </div>
        </div>

        {/* Overview */}
        {analyticsTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Revenue &amp; Signup Growth</span>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#0A66C2" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#0A66C2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1c" vertical={false} />
                    <XAxis dataKey="name" stroke="none" tick={axTick} />
                    <YAxis stroke="none" tick={axTick} />
                    <Tooltip content={<DarkTooltip />} />
                    <Area name="Gross Revenue (₹)" type="monotone" dataKey="revenue"  stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#revGlow)" />
                    <Area name="Expenses (₹)"       type="monotone" dataKey="expenses" stroke="#0A66C2" strokeWidth={2}   fillOpacity={1} fill="url(#expGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Completion Rate</span>
              <div className="h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={completionMetrics} cx="50%" cy="50%" innerRadius={55} outerRadius={72} paddingAngle={4} dataKey="value">
                      {completionMetrics.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">84.2%</span>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Completion</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {completionMetrics.map((item, idx) => (
                  <div key={idx} className="bg-[#0f0f12] border border-[#1e1e22] p-2 rounded-xl">
                    <span className="h-2 w-2 rounded-full inline-block mr-1" style={{ backgroundColor: item.color }} />
                    <span className="text-[9px] font-black text-slate-500">{item.name}</span>
                    <p className="text-xs font-black text-white mt-0.5">{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {analyticsTab === 'revenue' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Monthly Cash Flow</span>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1c" vertical={false} />
                    <XAxis dataKey="name" stroke="none" tick={axTick} />
                    <YAxis stroke="none" tick={axTick} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar name="Revenue"  dataKey="revenue"  fill="#D4AF37" radius={[5,5,0,0]} />
                    <Bar name="Expenses" dataKey="expenses" fill="#0A66C2" radius={[5,5,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Student Growth Base</span>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="studGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1c" vertical={false} />
                    <XAxis dataKey="name" stroke="none" tick={axTick} />
                    <YAxis stroke="none" tick={axTick} />
                    <Tooltip content={<DarkTooltip />} />
                    <Area  name="Active Base"      type="monotone" dataKey="activeStudents" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#studGlow)" />
                    <Line  name="New Enrollments"  type="monotone" dataKey="newStudents"    stroke="#0A66C2" strokeWidth={2} dot={{ r: 3, fill: '#0A66C2' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {analyticsTab === 'engagement' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Watch Hours by Course</span>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseEngagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1c" vertical={false} />
                    <XAxis dataKey="name" stroke="none" tick={{ ...axTick, fontSize: 9 }} />
                    <YAxis stroke="none" tick={axTick} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar name="Watch Hours" dataKey="watchHours" fill="#0A66C2" radius={[5,5,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Engagement Radar</span>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={courseEngagementData}>
                    <PolarGrid stroke="#1a1a1c" />
                    <PolarAngleAxis dataKey="name" tick={{ ...axTick, fontSize: 9 }} stroke="none" />
                    <PolarRadiusAxis tick={axTick} stroke="none" />
                    <Radar name="Active Students"  dataKey="activeStudents" stroke="#0A66C2" fill="#0A66C2" fillOpacity={0.3} />
                    <Radar name="Completion Rate %" dataKey="completionRate" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} />
                    <Legend wrapperStyle={{ color: '#606068', fontSize: 10, fontWeight: 700 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {analyticsTab === 'webinar' && (
          <div className="space-y-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Webinar Attendance vs. Registrations</span>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={webinarConversions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1c" vertical={false} />
                  <XAxis dataKey="name" stroke="none" tick={axTick} />
                  <YAxis stroke="none" tick={axTick} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar  name="Registrations" dataKey="registered" fill="#0A66C2" radius={[5,5,0,0]} />
                  <Line name="Attendees"     type="monotone" dataKey="attended" stroke="#D4AF37" strokeWidth={2.5} dot={{ r: 4, fill: '#D4AF37' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ── Quick Actions + Live Status + Activity Feed ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Quick Actions + Live System Status */}
        <div className="xl:col-span-1 space-y-6">

          {/* Quick Commands */}
          <div className="rounded-2xl bg-[#0b0b0d] border border-[#1a1a1c] p-6 shadow-dark-card">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#1a1a1c]">
              <Sparkles className="w-4.5 h-4.5 text-premium-accent" />
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Console Quick Commands</h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { icon: BookOpen, label: 'Publish Masterclass',         color: 'text-premium-accent', onClick: () => setCourseDrawerOpen(true) },
                { icon: UserPlus, label: 'Add Mentor / Instructor',     color: 'text-[#1E88E5]',      onClick: () => setInstructorModalOpen(true) },
                { icon: Calendar, label: 'Schedule Live Webinar',       color: 'text-amber-400',       onClick: () => setWebinarModalOpen(true) },
                { icon: Send,     label: 'Send Broadcast Notification', color: 'text-cyan-400',        onClick: () => setNotificationModalOpen(true) },
                { icon: Award,    label: 'Generate Certificate',        color: 'text-emerald-400',     onClick: () => setCertificateModalOpen(true) },
              ].map(({ icon: Icon, label, color, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#1e1e22] hover:border-premium-accent/30 bg-[#0f0f12] hover:bg-[#111115] transition-all text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="font-black text-[10px] uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">{label}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Live System Status */}
          <div className="rounded-2xl bg-[#0b0b0d] border border-[#1a1a1c] p-6 shadow-dark-card">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1a1a1c]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white uppercase">Live System Status</h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-5">
              {/* CPU */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-slate-500 flex items-center gap-1.5"><Cpu className="w-3 h-3" /> CPU Load</span>
                  <span className="text-white">{liveStats.cpu}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill-gold transition-all duration-1000" style={{ width: `${liveStats.cpu}%` }} />
                </div>
              </div>
              {/* Latency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-slate-500 flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> DB Latency</span>
                  <span className="text-white">{liveStats.latency}ms</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill-blue transition-all duration-1000" style={{ width: `${Math.min(100, liveStats.latency * 1.5)}%` }} />
                </div>
              </div>
              {/* Stream health */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-slate-500 flex items-center gap-1.5"><Radio className="w-3 h-3 text-[#1E88E5]" /> Stream Health</span>
                  <Badge variant="success" className="text-[8px] py-0 px-1.5">Optimal</Badge>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0f0f12] border border-[#1e1e22] flex justify-between text-[9px] font-black text-slate-500">
                  <span>Jitter: <span className="text-white">1.8ms</span></span>
                  <span>Drops: <span className="text-white">{(liveStats.droppedFrames * 100).toFixed(3)}%</span></span>
                  <span>Egress: <span className="text-white">{liveStats.bandwidth} Gbps</span></span>
                </div>
              </div>
              {/* Security */}
              <div className="space-y-2.5 pt-2 border-t border-[#1a1a1c]">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Firewall Shield</span>
                  <span className="text-emerald-400 text-[9px] flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#0f0f12] border border-[#1e1e22] p-2.5 rounded-xl text-left">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Threats Blocked</span>
                    <p className="text-base font-black text-white mt-0.5">{liveStats.blockedThreats}</p>
                  </div>
                  <div className="bg-[#0f0f12] border border-[#1e1e22] p-2.5 rounded-xl text-left">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Fail Auth Alerts</span>
                    <p className="text-base font-black text-red-400 mt-0.5">{liveStats.failedLogins}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Activity Feed */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-[#0b0b0d] border border-[#1a1a1c] p-6 shadow-dark-card h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#1a1a1c] shrink-0">
              <div>
                <h3 className="text-base font-black text-white uppercase">Recent Activity Logs</h3>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Real-time trace of operations, payments, and security triggers</p>
              </div>
              <span className="text-[9px] font-bold text-slate-600 flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin-slow" /> Auto-Refreshing
              </span>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-thin shrink-0">
              {[
                { key: 'enrollments',  label: 'Enrollments' },
                { key: 'submissions',  label: 'Submissions' },
                { key: 'webinarJoins', label: 'Webinar Joins' },
                { key: 'payments',     label: 'Payments' },
                { key: 'logins',       label: 'Suspicious Logins' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActivityTab(key)}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-xl border transition-all shrink-0 cursor-pointer ${
                    activityTab === key
                      ? 'bg-gradient-premium text-black border-transparent shadow-gold-sm'
                      : 'bg-[#0f0f12] border-[#1e1e22] text-slate-500 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Feed content */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px] pr-1 scrollbar-thin">

              {activityTab === 'enrollments' && enrollments.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-[#0f0f12] border border-[#1e1e22] hover:border-premium-accent/20 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#111115] border border-[#1e1e22] flex items-center justify-center font-black text-premium-accent text-[10px] shrink-0">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-black text-xs text-white">{item.name}</p>
                      <span className="text-[10px] text-slate-500 font-semibold">{item.email}</span>
                      <p className="text-[9px] font-black text-slate-600 mt-0.5 uppercase tracking-wide">{item.course}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-xs text-white">{item.amount}</p>
                    <Badge variant={item.status === 'Success' ? 'success' : 'warning'} className="text-[8px] py-0 px-1.5 mt-1">{item.status}</Badge>
                    <span className="text-[9px] text-slate-600 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

              {activityTab === 'submissions' && submissions.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-[#0f0f12] border border-[#1e1e22] hover:border-[#1E88E5]/20 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#111115] border border-[#1e1e22] flex items-center justify-center font-black text-[#1E88E5] text-[10px] shrink-0">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-black text-xs text-white">{item.student}</p>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{item.course}</span>
                      <p className="text-[9px] font-semibold text-slate-600 mt-0.5 italic">{item.assignment}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {item.status === 'Graded'
                      ? <Badge variant="success" className="text-[8px] py-0 px-1.5">Grade: {item.grade}</Badge>
                      : <Badge variant="warning" className="text-[8px] py-0 px-1.5">{item.status}</Badge>
                    }
                    <span className="text-[9px] text-slate-600 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

              {activityTab === 'webinarJoins' && webinarJoins.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-[#0f0f12] border border-[#1e1e22] hover:border-amber-500/20 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#111115] border border-[#1e1e22] flex items-center justify-center font-black text-amber-400 text-[10px] shrink-0">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-black text-xs text-white">{item.student}</p>
                      <span className="text-[10px] text-slate-500 font-semibold">{item.webinar}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-500 font-bold">Duration: <span className="text-white font-black">{item.duration}</span></p>
                    <Badge variant={item.status === 'Connected' ? 'success' : item.status === 'Scheduled' ? 'info' : 'muted'} className="text-[8px] py-0 px-1.5 mt-1">{item.status}</Badge>
                    <span className="text-[9px] text-slate-600 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

              {activityTab === 'payments' && payments.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-[#0f0f12] border border-[#1e1e22] hover:border-emerald-500/20 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#111115] border border-[#1e1e22] flex items-center justify-center font-black text-emerald-400 text-[10px] shrink-0">
                      {item.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-xs text-white">{item.student}</p>
                        <span className="text-[8px] font-black bg-[#1a1a1c] px-1.5 py-0.5 rounded text-slate-500">{item.invoice}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{item.course}</span>
                      <p className="text-[9px] text-slate-600 font-semibold mt-0.5">via {item.gateway}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-xs text-white">{item.amount}</p>
                    <Badge variant={item.status === 'Succeeded' ? 'success' : 'danger'} className="text-[8px] py-0 px-1.5 mt-1">{item.status}</Badge>
                    <span className="text-[9px] text-slate-600 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

              {activityTab === 'logins' && logins.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-[#0f0f12] border border-red-500/15 hover:border-red-500/30 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-red-500/100/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-xs text-red-400">@{item.user}</p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="text-[9px] text-slate-500 font-bold">IP: {item.ip}</span>
                        <span className="text-[9px] text-slate-600">({item.location})</span>
                        <span className="text-[8px] text-slate-600 bg-[#1a1a1c] px-1.5 py-0.5 rounded">{item.device}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={item.status.includes('Blocked') ? 'danger' : 'success'} className="text-[8px] py-0 px-1.5">{item.status}</Badge>
                    <span className="text-[9px] text-slate-600 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* ── Drawers & Modals ────────────────────────── */}

      {/* Course Drawer */}
      <AdminDrawer isOpen={courseDrawerOpen} onClose={() => setCourseDrawerOpen(false)} title="Publish New Masterclass">
        <form onSubmit={handleCourseSubmit} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Course Title</label>
            <input type="text" required placeholder="e.g. Commercial Multifamily Syndication" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} className={DI} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Category</label>
              <select value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })} className={DS}>
                <option>Commercial</option><option>Luxury Flipping</option><option>Underwriting</option><option>Legal &amp; Codes</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Tuition Fee (₹)</label>
              <input type="number" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} className={DI} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Lead Instructor</label>
            <select value={courseForm.instructor} onChange={e => setCourseForm({ ...courseForm, instructor: e.target.value })} className={DS}>
              <option>Sarah Jenkins (Brokerage)</option><option>Michael Chang (Attorney)</option><option>Alex Mercer (Analyst)</option>
            </select>
          </div>
          <div className="pt-4 border-t border-[#1a1a1c] flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setCourseDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Publish Class</Button>
          </div>
        </form>
      </AdminDrawer>

      {/* Instructor Modal */}
      <AdminModal isOpen={instructorModalOpen} onClose={() => setInstructorModalOpen(false)} title="Onboard New Instructor">
        <form onSubmit={handleInstructorSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Full Name</label>
            <input type="text" required placeholder="e.g. Richard Hendricks" value={instructorForm.name} onChange={e => setInstructorForm({ ...instructorForm, name: e.target.value })} className={DI} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Email Address</label>
            <input type="email" required placeholder="mentor@bgrealtyacademy.com" value={instructorForm.email} onChange={e => setInstructorForm({ ...instructorForm, email: e.target.value })} className={DI} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Specialty</label>
            <select value={instructorForm.expertise} onChange={e => setInstructorForm({ ...instructorForm, expertise: e.target.value })} className={DS}>
              <option>Luxury Flipping</option><option>Commercial Assets</option><option>Underwriting &amp; Analytics</option><option>Legal &amp; Compliance</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Brief Biography</label>
            <textarea rows={3} placeholder="15+ years experience in syndicating real estate properties..." value={instructorForm.bio} onChange={e => setInstructorForm({ ...instructorForm, bio: e.target.value })} className={DI + ' resize-none'} />
          </div>
          <div className="pt-4 border-t border-[#1a1a1c] flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setInstructorModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Onboard Mentor</Button>
          </div>
        </form>
      </AdminModal>

      {/* Webinar Modal */}
      <AdminModal isOpen={webinarModalOpen} onClose={() => setWebinarModalOpen(false)} title="Schedule Live Broadcast">
        <form onSubmit={handleWebinarSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Webinar Topic</label>
            <input type="text" required placeholder="e.g. Navigating Multi-Family Syndication Deal Flow" value={webinarForm.title} onChange={e => setWebinarForm({ ...webinarForm, title: e.target.value })} className={DI} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Date</label>
              <input type="date" required value={webinarForm.date} onChange={e => setWebinarForm({ ...webinarForm, date: e.target.value })} className={DS} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Start Time</label>
              <input type="time" required value={webinarForm.time} onChange={e => setWebinarForm({ ...webinarForm, time: e.target.value })} className={DS} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Host Instructor</label>
            <select value={webinarForm.instructor} onChange={e => setWebinarForm({ ...webinarForm, instructor: e.target.value })} className={DS}>
              <option>Sarah Jenkins (Brokerage)</option><option>Michael Chang (Attorney)</option><option>Alex Mercer (Analyst)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Broadcast Link</label>
            <input type="url" required placeholder="https://zoom.us/j/..." value={webinarForm.link} onChange={e => setWebinarForm({ ...webinarForm, link: e.target.value })} className={DI} />
          </div>
          <div className="pt-4 border-t border-[#1a1a1c] flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setWebinarModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Activate Stream</Button>
          </div>
        </form>
      </AdminModal>

      {/* Notification Modal */}
      <AdminModal isOpen={notificationModalOpen} onClose={() => setNotificationModalOpen(false)} title="Broadcast System Notification">
        <form onSubmit={handleNotificationSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Notification Title</label>
            <input type="text" required placeholder="e.g. Schedule Update: Live Q&A moved to 4 PM" value={notificationForm.title} onChange={e => setNotificationForm({ ...notificationForm, title: e.target.value })} className={DI} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Message Content</label>
            <textarea required rows={4} placeholder="Enter notification description..." value={notificationForm.message} onChange={e => setNotificationForm({ ...notificationForm, message: e.target.value })} className={DI + ' resize-none'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Target Segment</label>
              <select value={notificationForm.audience} onChange={e => setNotificationForm({ ...notificationForm, audience: e.target.value })} className={DS}>
                <option>All Students</option><option>Underwriting Cohorts</option><option>Flipping Cohorts</option><option>Instructors Only</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Alert Priority</label>
              <select value={notificationForm.priority} onChange={e => setNotificationForm({ ...notificationForm, priority: e.target.value })} className={DS}>
                <option>Low</option><option>Medium</option><option>High (Immediate)</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-[#1a1a1c] flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setNotificationModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Broadcast Message</Button>
          </div>
        </form>
      </AdminModal>

      {/* Certificate Modal */}
      <AdminModal isOpen={certificateModalOpen} onClose={() => setCertificateModalOpen(false)} title="Issue Course Certificate">
        <form onSubmit={handleCertificateSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Student Full Name</label>
            <input type="text" required placeholder="e.g. Courtney Henry" value={certificateForm.studentName} onChange={e => setCertificateForm({ ...certificateForm, studentName: e.target.value })} className={DI} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Accredited Course</label>
            <select value={certificateForm.courseName} onChange={e => setCertificateForm({ ...certificateForm, courseName: e.target.value })} className={DS}>
              <option>Luxury Flipping Masterclass</option><option>Commercial Real Estate Underwriting</option><option>High-Ticket Sales Academy</option><option>BRRRR Strategy Secrets</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Issue Date</label>
              <input type="date" required value={certificateForm.issueDate} onChange={e => setCertificateForm({ ...certificateForm, issueDate: e.target.value })} className={DS} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Certificate ID</label>
              <input type="text" disabled value={certificateForm.certId} className={DI + ' opacity-50 cursor-not-allowed'} />
            </div>
          </div>
          <div className="pt-4 border-t border-[#1a1a1c] flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setCertificateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Sign &amp; Generate</Button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
}
