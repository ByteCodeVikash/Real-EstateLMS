import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, Award, Calendar, Play, FileText, 
  Send, Shield, CheckCircle2, ChevronRight, UserPlus, BookOpen,
  TrendingUp, Laptop, LifeBuoy, AlertTriangle, Activity, HardDrive,
  Cpu, Server, ShieldCheck, PlayCircle, Radio, Users2, HelpCircle,
  Smartphone, Monitor, Sparkles, Check, Info, Bell, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Legend, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { AdminStatCard, AdminTable, AdminDrawer, AdminModal } from '../../components/admin/AdminComponents';
import { Button, Badge } from '../../components/UI';

// Custom Premium Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800/80 backdrop-blur-md p-3.5 rounded-xl shadow-xl text-left border-l-4 border-l-premium-accent">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="mt-1.5 space-y-1">
          {payload.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color || p.fill }}></span>
              <span>{p.name}: <span className="font-extrabold text-slate-200">{p.value.toLocaleString()}</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  // Navigation / Tab States
  const [analyticsTab, setAnalyticsTab] = useState('overview'); // overview, revenue, engagement, webinar
  const [activityTab, setActivityTab] = useState('enrollments'); // enrollments, submissions, webinarJoins, payments, logins

  // Live System Status State (dynamic Simulation)
  const [liveStats, setLiveStats] = useState({
    cpu: 4.8,
    latency: 12,
    activeSessions: 148,
    droppedFrames: 0.005,
    bandwidth: 4.2, // Gbps
    blockedThreats: 32,
    failedLogins: 12
  });

  // Modal/Drawer States
  const [courseDrawerOpen, setCourseDrawerOpen] = useState(false);
  const [instructorModalOpen, setInstructorModalOpen] = useState(false);
  const [webinarModalOpen, setWebinarModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  // Form States
  const [courseForm, setCourseForm] = useState({ title: '', category: 'Commercial', instructor: 'Sarah Jenkins', price: '1499', status: 'Published' });
  const [instructorForm, setInstructorForm] = useState({ name: '', email: '', expertise: 'Flipping', bio: '' });
  const [webinarForm, setWebinarForm] = useState({ title: '', date: '', time: '', link: '', instructor: 'Sarah Jenkins' });
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', audience: 'All Students', priority: 'Medium' });
  const [certificateForm, setCertificateForm] = useState({ studentName: '', courseName: 'Luxury Flipping Masterclass', issueDate: new Date().toISOString().split('T')[0], certId: `BJ-CERT-${Math.floor(100000 + Math.random() * 900000)}` });

  // Mock Database State (Dynamic so quick actions update lists)
  const [coursesCount, setCoursesCount] = useState(42);
  const [webinarsCount, setWebinarsCount] = useState(18);
  const [totalStudentsCount, setTotalStudentsCount] = useState(1248);
  const [supportTicketsCount, setSupportTicketsCount] = useState(4);
  const [totalRevenue, setTotalRevenue] = useState(128450);

  const [enrollments, setEnrollments] = useState([
    { id: 1, name: "Robert Fox", email: "robert@foxrealestate.com", course: "Luxury Flipping Masterclass", amount: "$1,499", status: "Success", date: "Just now", avatar: "RF" },
    { id: 2, name: "Jane Cooper", email: "jane.cooper@realty.io", course: "Commercial Underwriting", amount: "$2,100", status: "Success", date: "12 mins ago", avatar: "JC" },
    { id: 3, name: "Wade Warren", email: "wade.warren@century21.com", course: "High-Ticket Real Estate Sales", amount: "$999", status: "Pending", date: "1 hr ago", avatar: "WW" },
    { id: 4, name: "Esther Howard", email: "esther.h@gmail.com", course: "Luxury Flipping Masterclass", amount: "$1,499", status: "Success", date: "3 hrs ago", avatar: "EH" },
  ]);

  const [submissions, setSubmissions] = useState([
    { id: 1, student: "Guy Hawkins", course: "Commercial Underwriting", assignment: "Module 3: Debt Service Coverage Ratio Spreadsheet", status: "Needs Review", date: "5 mins ago", avatar: "GH" },
    { id: 2, student: "Leslie Alexander", course: "Luxury Flipping Masterclass", assignment: "Module 1: Comparables Presentation", status: "Graded", grade: "A+", date: "45 mins ago", avatar: "LA" },
    { id: 3, student: "Kristin Watson", course: "High-Ticket Real Estate Sales", assignment: "Module 2: Listing Presentation Video Upload", status: "Graded", grade: "A", date: "2 hrs ago", avatar: "KW" },
  ]);

  const [webinarJoins, setWebinarJoins] = useState([
    { id: 1, student: "Cody Fisher", webinar: "Multi-Family Sourcing & Deal Flow", duration: "45 mins", status: "Connected", date: "10 mins ago", avatar: "CF" },
    { id: 2, student: "Brooklyn Simmons", webinar: "Multi-Family Sourcing & Deal Flow", duration: "12 mins", status: "Left", date: "25 mins ago", avatar: "BS" },
    { id: 3, student: "Jenny Wilson", webinar: "Multi-Family Sourcing & Deal Flow", duration: "50 mins", status: "Connected", date: "Just now", avatar: "JW" },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, invoice: "INV-9021", student: "Albert Flores", course: "Luxury Flipping Masterclass", gateway: "Stripe", amount: "$1,499", status: "Succeeded", date: "8 mins ago", avatar: "AF" },
    { id: 2, invoice: "INV-9020", student: "Eleanor Pena", course: "Commercial Underwriting", gateway: "PayPal", amount: "$2,100", status: "Succeeded", date: "1 hr ago", avatar: "EP" },
    { id: 3, invoice: "INV-9019", student: "Marvin McKinney", course: "BRRRR Strategy Secrets", gateway: "Stripe", amount: "$1,299", status: "Failed", date: "3 hrs ago", avatar: "MM" },
  ]);

  const [logins, setLogins] = useState([
    { id: 1, user: "admin_backup", ip: "185.220.101.4", location: "Moscow, RU", device: "Chrome / Linux", status: "Blocked (MFA Required)", date: "15 mins ago" },
    { id: 2, user: "johndoe_re", ip: "92.119.177.21", location: "Shenzhen, CN", device: "Safari / iOS", status: "Blocked (Invalid Pass)", date: "40 mins ago" },
    { id: 3, user: "vikash_owner", ip: "103.88.22.41", location: "Mumbai, IN", device: "Firefox / MacOS", status: "Allowed (Geo Trust)", date: "2 hrs ago" },
  ]);

  // Live System Status simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStats(prev => {
        const cpuDiff = (Math.random() - 0.5) * 1.5;
        const latencyDiff = (Math.random() - 0.5) * 2;
        const activeSessionsDiff = Math.random() > 0.5 ? 1 : -1;
        const droppedDiff = (Math.random() - 0.5) * 0.001;
        const bwDiff = (Math.random() - 0.5) * 0.2;
        
        return {
          cpu: Math.max(1, Math.min(99, parseFloat((prev.cpu + cpuDiff).toFixed(1)))),
          latency: Math.max(5, Math.min(120, Math.round(prev.latency + latencyDiff))),
          activeSessions: Math.max(50, prev.activeSessions + activeSessionsDiff),
          droppedFrames: Math.max(0.001, Math.min(1.0, parseFloat((prev.droppedFrames + droppedDiff).toFixed(4)))),
          bandwidth: Math.max(1.0, Math.min(10.0, parseFloat((prev.bandwidth + bwDiff).toFixed(1)))),
          blockedThreats: Math.random() > 0.85 ? prev.blockedThreats + 1 : prev.blockedThreats,
          failedLogins: Math.random() > 0.95 ? prev.failedLogins + 1 : prev.failedLogins
        };
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Form Submissions Actions
  const handleCourseSubmit = (e) => {
    e.preventDefault();
    setCoursesCount(prev => prev + 1);
    const amountVal = `$${parseFloat(courseForm.price).toLocaleString()}`;
    // Insert mock activity
    setEnrollments(prev => [
      {
        id: Date.now(),
        name: "New Student Registration",
        email: "auto-enrolled@bjrealestate.com",
        course: courseForm.title,
        amount: amountVal,
        status: "Success",
        date: "Just now",
        avatar: "NS"
      },
      ...prev
    ]);
    alert(`Success: Masterclass "${courseForm.title}" has been published and added to active inventory!`);
    setCourseDrawerOpen(false);
  };

  const handleInstructorSubmit = (e) => {
    e.preventDefault();
    alert(`Success: Instructor "${instructorForm.name}" has been onboarded and credentialed!`);
    setInstructorModalOpen(false);
  };

  const handleWebinarSubmit = (e) => {
    e.preventDefault();
    setWebinarsCount(prev => prev + 1);
    // Add mock join event
    setWebinarJoins(prev => [
      {
        id: Date.now(),
        student: "Auto Scheduler",
        webinar: webinarForm.title,
        duration: "0 mins",
        status: "Scheduled",
        date: "Just now",
        avatar: "AS"
      },
      ...prev
    ]);
    alert(`Success: Webinar broadcast "${webinarForm.title}" is scheduled for ${webinarForm.date} at ${webinarForm.time}!`);
    setWebinarModalOpen(false);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    alert(`Success: Broadcast Notification "${notificationForm.title}" pushed to all channels! Priority: ${notificationForm.priority}`);
    setNotificationModalOpen(false);
  };

  const handleCertificateSubmit = (e) => {
    e.preventDefault();
    alert(`Success: Verified Certificate ${certificateForm.certId} successfully issued to "${certificateForm.studentName}"!`);
    setCertificateModalOpen(false);
  };

  // Recharts Mock Datasets
  const revenueTrendData = [
    { name: 'Jan', revenue: 45000, registrations: 120, expenses: 15000 },
    { name: 'Feb', revenue: 52000, registrations: 150, expenses: 18000 },
    { name: 'Mar', revenue: 61000, registrations: 180, expenses: 22000 },
    { name: 'Apr', revenue: 58000, registrations: 170, expenses: 19000 },
    { name: 'May', revenue: 78000, registrations: 240, expenses: 28000 },
    { name: 'Jun', revenue: 95000, registrations: 310, expenses: 32000 },
  ];

  const studentGrowthData = [
    { name: 'Jan', newStudents: 80, activeStudents: 850 },
    { name: 'Feb', newStudents: 110, activeStudents: 960 },
    { name: 'Mar', newStudents: 135, activeStudents: 1095 },
    { name: 'Apr', newStudents: 95, activeStudents: 1190 },
    { name: 'May', newStudents: 160, activeStudents: 1350 },
    { name: 'Jun', newStudents: 210, activeStudents: 1560 },
  ];

  const courseEngagementData = [
    { name: 'Luxury Flipping', watchHours: 1240, activeStudents: 310, completionRate: 88 },
    { name: 'Comm Underwriting', watchHours: 1890, activeStudents: 240, completionRate: 82 },
    { name: 'High-Ticket Sales', watchHours: 950, activeStudents: 180, completionRate: 79 },
    { name: 'Legal & Compliance', watchHours: 640, activeStudents: 150, completionRate: 91 },
    { name: 'BRRRR Strategy', watchHours: 1100, activeStudents: 290, completionRate: 85 },
  ];

  const webinarConversions = [
    { name: 'Comm JV', registered: 450, attended: 290 },
    { name: 'Flipping Taxes', registered: 600, attended: 420 },
    { name: 'Tenant Underwrite', registered: 350, attended: 210 },
    { name: 'Multi-Family Sourcing', registered: 520, attended: 340 },
  ];

  const completionMetrics = [
    { name: 'Completed', value: 84.2, color: '#10b981' },
    { name: 'In Progress', value: 12.3, color: '#3b82f6' },
    { name: 'Dropped/Idle', value: 3.5, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-premium-accent animate-pulse"></span>
            <span className="text-[10px] font-black text-premium-accent uppercase tracking-widest">Enterprise Console</span>
          </div>
          <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase mt-1">BJ REAL ESTATE LMS</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Control center for managing students, courses, webinars, and real-time portal operations.</p>
        </div>
        
        {/* Quick actions triggers on top */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setNotificationModalOpen(true)}>
            <Send className="w-4 h-4 mr-2 text-premium-accent" /> Alert Broadcast
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWebinarModalOpen(true)}>
            <Calendar className="w-4 h-4 mr-2 text-premium-violet" /> Schedule Webinar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setCourseDrawerOpen(true)}>
            <BookOpen className="w-4 h-4 mr-2" /> Add Course
          </Button>
        </div>
      </div>

      {/* Stats Widgets Grid (8 Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4.5">
          <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Core Portal Metrics</h2>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">Live Updates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard 
            title="Total Students" 
            value={totalStudentsCount.toLocaleString()} 
            change="+8.2%" 
            isPositive={true} 
            icon={Users}
            gradient="from-blue-500/10 to-indigo-500/10"
            timeframe="vs last month"
          />
          <AdminStatCard 
            title="Active Courses" 
            value={coursesCount.toString()} 
            change="+12.0%" 
            isPositive={true} 
            icon={BookOpen}
            gradient="from-violet-500/10 to-purple-500/10"
            timeframe="vs last month"
          />
          <AdminStatCard 
            title="Gross Revenue" 
            value={`$${totalRevenue.toLocaleString()}`} 
            change="+18.4%" 
            isPositive={true} 
            icon={DollarSign}
            gradient="from-emerald-500/10 to-teal-500/10"
            timeframe="vs last month"
          />
          <AdminStatCard 
            title="Live Classes Scheduled" 
            value={webinarsCount.toString()} 
            change="-2.3%" 
            isPositive={false} 
            icon={Calendar}
            gradient="from-amber-500/10 to-orange-500/10"
            timeframe="vs last week"
          />
          <AdminStatCard 
            title="Assignment Completion" 
            value="84.2%" 
            change="+1.8%" 
            isPositive={true} 
            icon={FileText}
            gradient="from-pink-500/10 to-rose-500/10"
            timeframe="vs last month"
          />
          <AdminStatCard 
            title="Monthly Growth" 
            value="+14.5%" 
            change="+3.1%" 
            isPositive={true} 
            icon={TrendingUp}
            gradient="from-cyan-500/10 to-sky-500/10"
            timeframe="vs last month"
          />
          <AdminStatCard 
            title="Active Devices" 
            value={liveStats.activeSessions.toString()} 
            change="+10.5%" 
            isPositive={true} 
            icon={Laptop}
            gradient="from-lime-500/10 to-emerald-500/10"
            timeframe="vs last hour"
          />
          <AdminStatCard 
            title="Support Tickets" 
            value={supportTicketsCount.toString()} 
            change="95% Solved" 
            isPositive={true} 
            icon={LifeBuoy}
            gradient="from-red-500/10 to-rose-500/10"
            timeframe="resolved this week"
          />
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Portal Analytics & Performance Logs</h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Visualize user engagement, stream metrics, and revenues</p>
          </div>
          {/* Tabs switch */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 self-start sm:self-auto">
            <button 
              onClick={() => setAnalyticsTab('overview')}
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${analyticsTab === 'overview' ? 'bg-premium-accent text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setAnalyticsTab('revenue')}
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${analyticsTab === 'revenue' ? 'bg-premium-accent text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
            >
              Revenue & Growth
            </button>
            <button 
              onClick={() => setAnalyticsTab('engagement')}
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${analyticsTab === 'engagement' ? 'bg-premium-accent text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
            >
              Engagement
            </button>
            <button 
              onClick={() => setAnalyticsTab('webinar')}
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${analyticsTab === 'webinar' ? 'bg-premium-accent text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
            >
              Webinars
            </button>
          </div>
        </div>

        {/* Charts rendering depending on state */}
        {analyticsTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary chart: Revenue */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Revenue and Signups Growth</span>
                <span className="text-[9px] font-bold text-emerald-500 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 rounded">6M Trend</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expensesGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area name="Gross Revenue ($)" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#revenueGlow)" />
                    <Area name="Operational Expenses ($)" type="monotone" dataKey="expenses" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#expensesGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Side breakdown: Completion rate */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Completion Analytics</span>
              <div className="h-52 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionMetrics}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {completionMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-premium-heading dark:text-white">84.2%</span>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Completion</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                {completionMetrics.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-850 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="h-2 w-2 rounded-full inline-block mr-1" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-350">{item.name}</span>
                    <p className="text-xs font-black text-premium-heading dark:text-white mt-1">{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {analyticsTab === 'revenue' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Monthly Cash Flow</span>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar name="Revenue" dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    <Bar name="Expenses" dataKey="expenses" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Student Growth Base</span>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="activeStudentGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area name="Active Base" type="monotone" dataKey="activeStudents" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#activeStudentGlow)" />
                    <Line name="New Enrollments" type="monotone" dataKey="newStudents" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {analyticsTab === 'engagement' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Weekly Watch Engagement (Hours)</span>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseEngagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar name="Watch Hours" dataKey="watchHours" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 flex flex-col justify-between">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Course Engagement Vectors</span>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={courseEngagementData}>
                    <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                    <PolarRadiusAxis stroke="#94a3b8" fontSize={9} />
                    <Radar name="Active Students" dataKey="activeStudents" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                    <Radar name="Completion Rate (%)" dataKey="completionRate" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {analyticsTab === 'webinar' && (
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live webinar attendances vs. registrations</span>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={webinarConversions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar name="Registrations" dataKey="registered" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Line name="Attendees" type="monotone" dataKey="attended" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Left is Quick Actions & Live Status, Right is Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Actions & Live Status */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-4.5">
              <Sparkles className="w-5 h-5 text-premium-violet" />
              <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Console Quick Commands</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setCourseDrawerOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-premium-border/60 hover:border-premium-accent/40 dark:border-slate-800 dark:hover:border-premium-accent/40 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-900 transition-all text-left font-bold text-xs uppercase tracking-wider group cursor-pointer"
              >
                <span className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-premium-accent">
                  <BookOpen className="w-4 h-4 text-premium-accent" />
                  <span>Publish Masterclass</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => setInstructorModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-premium-border/60 hover:border-premium-accent/40 dark:border-slate-800 dark:hover:border-premium-accent/40 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-900 transition-all text-left font-bold text-xs uppercase tracking-wider group cursor-pointer"
              >
                <span className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-premium-accent">
                  <UserPlus className="w-4 h-4 text-premium-violet" />
                  <span>Add Mentor / Instructor</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => setWebinarModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-premium-border/60 hover:border-premium-accent/40 dark:border-slate-800 dark:hover:border-premium-accent/40 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-900 transition-all text-left font-bold text-xs uppercase tracking-wider group cursor-pointer"
              >
                <span className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-premium-accent">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Schedule live Webinar</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => setNotificationModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-premium-border/60 hover:border-premium-accent/40 dark:border-slate-800 dark:hover:border-premium-accent/40 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-900 transition-all text-left font-bold text-xs uppercase tracking-wider group cursor-pointer"
              >
                <span className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-premium-accent">
                  <Send className="w-4 h-4 text-cyan-500" />
                  <span>Send Broadcast Notification</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => setCertificateModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-premium-border/60 hover:border-premium-accent/40 dark:border-slate-800 dark:hover:border-premium-accent/40 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-900 transition-all text-left font-bold text-xs uppercase tracking-wider group cursor-pointer"
              >
                <span className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-premium-accent">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Generate certificate</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Live System Status */}
          <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Live system status</h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="space-y-4">
              
              {/* Uptime & CPU */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> CPU Load</span>
                  <span className="text-premium-heading dark:text-white font-extrabold">{liveStats.cpu}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-premium-accent rounded-full transition-all duration-1000"
                    style={{ width: `${liveStats.cpu}%` }}
                  />
                </div>
              </div>

              {/* Memory usage */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> Database Latency</span>
                  <span className="text-premium-heading dark:text-white font-extrabold">{liveStats.latency}ms</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, liveStats.latency * 1.5)}%` }}
                  />
                </div>
              </div>

              {/* Streaming Broadcast health */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5"><Radio className="w-3.5 h-3.5 text-premium-violet" /> Streaming Health</span>
                  <Badge variant="success" className="text-[9px] font-extrabold py-0 px-1.5">Optimal</Badge>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Jitter: <span className="text-premium-heading dark:text-white">1.8ms</span></span>
                  <span>Drops: <span className="text-premium-heading dark:text-white">{(liveStats.droppedFrames * 100).toFixed(3)}%</span></span>
                  <span>Egress: <span className="text-premium-heading dark:text-white">{liveStats.bandwidth} Gbps</span></span>
                </div>
              </div>

              {/* Security Alerts Firewall */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Firewall Shield</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Threats Blocked</span>
                    <p className="text-sm font-black text-premium-heading dark:text-white mt-0.5">{liveStats.blockedThreats}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fail Auth Alerts</span>
                    <p className="text-sm font-black text-premium-heading dark:text-white mt-0.5 text-red-500">{liveStats.failedLogins}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div>
                <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Recent Activity Logs</h3>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Real-time trace logs of operations, payments, and safety triggers</p>
              </div>
              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5 self-start sm:self-auto"><RefreshCw className="w-3 h-3 animate-spin-slow" /> Auto-Refreshing</span>
            </div>

            {/* Sub-tabs selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-thin shrink-0">
              <button 
                onClick={() => setActivityTab('enrollments')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all shrink-0 cursor-pointer ${activityTab === 'enrollments' ? 'bg-premium-heading border-premium-heading text-white dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-50 border-premium-border text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800'}`}
              >
                Enrollments
              </button>
              <button 
                onClick={() => setActivityTab('submissions')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all shrink-0 cursor-pointer ${activityTab === 'submissions' ? 'bg-premium-heading border-premium-heading text-white dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-50 border-premium-border text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800'}`}
              >
                Submissions
              </button>
              <button 
                onClick={() => setActivityTab('webinarJoins')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all shrink-0 cursor-pointer ${activityTab === 'webinarJoins' ? 'bg-premium-heading border-premium-heading text-white dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-50 border-premium-border text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800'}`}
              >
                Webinar Joins
              </button>
              <button 
                onClick={() => setActivityTab('payments')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all shrink-0 cursor-pointer ${activityTab === 'payments' ? 'bg-premium-heading border-premium-heading text-white dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-50 border-premium-border text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800'}`}
              >
                Payments
              </button>
              <button 
                onClick={() => setActivityTab('logins')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all shrink-0 cursor-pointer ${activityTab === 'logins' ? 'bg-premium-heading border-premium-heading text-white dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-50 border-premium-border text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800'}`}
              >
                Suspicious Logins
              </button>
            </div>

            {/* Trace Feed List */}
            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[440px] pr-2 scrollbar-thin text-left">
              {activityTab === 'enrollments' && enrollments.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:border-premium-accent/25 dark:hover:border-premium-accent/25 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-8.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-premium-accent text-[11px] border border-premium-border/60 dark:border-slate-700">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-extrabold text-premium-heading dark:text-white text-xs">{item.name}</p>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.email}</span>
                      <p className="text-[10px] font-extrabold text-slate-500 mt-0.5 uppercase tracking-wide">{item.course}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-xs text-premium-heading dark:text-white">{item.amount}</p>
                    <Badge variant={item.status === 'Success' ? 'success' : 'warning'} className="text-[8px] py-0 px-1 mt-1">{item.status}</Badge>
                    <span className="text-[9px] text-slate-400 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

              {activityTab === 'submissions' && submissions.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:border-premium-accent/25 dark:hover:border-premium-accent/25 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-8.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-premium-violet text-[11px] border border-premium-border/60 dark:border-slate-700">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-extrabold text-premium-heading dark:text-white text-xs">{item.student}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.course}</span>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5 italic">{item.assignment}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {item.status === 'Graded' ? (
                      <Badge variant="success" className="text-[8px] py-0 px-1">Grade: {item.grade}</Badge>
                    ) : (
                      <Badge variant="warning" className="text-[8px] py-0 px-1">{item.status}</Badge>
                    )}
                    <span className="text-[9px] text-slate-400 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

              {activityTab === 'webinarJoins' && webinarJoins.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:border-premium-accent/25 dark:hover:border-premium-accent/25 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-8.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-amber-500 text-[11px] border border-premium-border/60 dark:border-slate-700">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-extrabold text-premium-heading dark:text-white text-xs">{item.student}</p>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.webinar}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[10px] text-slate-500">Duration: <span className="font-extrabold text-premium-heading dark:text-white">{item.duration}</span></p>
                    <Badge variant={item.status === 'Connected' ? 'success' : item.status === 'Scheduled' ? 'info' : 'danger'} className="text-[8px] py-0 px-1 mt-1">{item.status}</Badge>
                    <span className="text-[9px] text-slate-400 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

              {activityTab === 'payments' && payments.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:border-premium-accent/25 dark:hover:border-premium-accent/25 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-8.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-emerald-500 text-[11px] border border-premium-border/60 dark:border-slate-700">
                      {item.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-premium-heading dark:text-white text-xs">{item.student}</p>
                        <span className="text-[9px] font-black bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 rounded text-slate-500">{item.invoice}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.course}</span>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Gateway: {item.gateway}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-xs text-premium-heading dark:text-white">{item.amount}</p>
                    <Badge variant={item.status === 'Succeeded' ? 'success' : 'danger'} className="text-[8px] py-0 px-1 mt-1">{item.status}</Badge>
                    <span className="text-[9px] text-slate-400 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}

              {activityTab === 'logins' && logins.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-red-100/50 dark:border-red-950/20 hover:border-red-400/40 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-8.5 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500 border border-red-100 dark:border-red-900/50 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-red-600 dark:text-red-400 text-xs">Suspicious Trace: @{item.user}</p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="text-[10px] text-slate-400 font-bold">IP: {item.ip}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">({item.location})</span>
                        <span className="text-[9px] text-slate-500 font-semibold bg-slate-200/50 dark:bg-slate-800 px-1.5 rounded">{item.device}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={item.status.includes('Blocked') ? 'danger' : 'success'} className="text-[8px] py-0 px-1">{item.status}</Badge>
                    <span className="text-[9px] text-slate-400 block mt-1">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Course Creation Drawer */}
      <AdminDrawer 
        isOpen={courseDrawerOpen} 
        onClose={() => setCourseDrawerOpen(false)} 
        title="Publish New Masterclass"
      >
        <form onSubmit={handleCourseSubmit} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Course Name / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Commercial Multifamily Syndication"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category</label>
              <select
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              >
                <option value="Commercial">Commercial</option>
                <option value="Flipping">Luxury Flipping</option>
                <option value="Underwriting">Underwriting</option>
                <option value="Legal">Legal & Codes</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tuition Fee ($)</label>
              <input
                type="number"
                value={courseForm.price}
                onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lead Mentor / Instructor</label>
            <select
              value={courseForm.instructor}
              onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            >
              <option value="Sarah Jenkins">Sarah Jenkins (Brokerage)</option>
              <option value="Michael Chang">Michael Chang (Attorney)</option>
              <option value="Alex Mercer">Alex Mercer (Financial Analyst)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setCourseDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Class
            </Button>
          </div>
        </form>
      </AdminDrawer>

      {/* Add Instructor Modal */}
      <AdminModal
        isOpen={instructorModalOpen}
        onClose={() => setInstructorModalOpen(false)}
        title="Onboard New Instructor"
      >
        <form onSubmit={handleInstructorSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Richard Hendricks"
              value={instructorForm.name}
              onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="richard@realtyacademy.com"
              value={instructorForm.email}
              onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Specialty / Field</label>
            <select
              value={instructorForm.expertise}
              onChange={(e) => setInstructorForm({ ...instructorForm, expertise: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            >
              <option value="Flipping">Luxury Flipping</option>
              <option value="Commercial">Commercial Assets</option>
              <option value="Underwriting">Underwriting & Analytics</option>
              <option value="Legal">Legal & Compliance</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Brief Biography</label>
            <textarea
              rows={3}
              placeholder="15+ years experience in syndicating real estate properties..."
              value={instructorForm.bio}
              onChange={(e) => setInstructorForm({ ...instructorForm, bio: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setInstructorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Onboard Mentor
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Webinar Scheduler Modal */}
      <AdminModal
        isOpen={webinarModalOpen}
        onClose={() => setWebinarModalOpen(false)}
        title="Schedule Live Broadcast"
      >
        <form onSubmit={handleWebinarSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Webinar Subject / Topic</label>
            <input
              type="text"
              required
              placeholder="e.g. Navigating Multi-Family Syndication Deal Flow"
              value={webinarForm.title}
              onChange={(e) => setWebinarForm({ ...webinarForm, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date</label>
              <input
                type="date"
                required
                value={webinarForm.date}
                onChange={(e) => setWebinarForm({ ...webinarForm, date: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Start Time</label>
              <input
                type="time"
                required
                value={webinarForm.time}
                onChange={(e) => setWebinarForm({ ...webinarForm, time: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Webinar Host / Instructor</label>
            <select
              value={webinarForm.instructor}
              onChange={(e) => setWebinarForm({ ...webinarForm, instructor: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            >
              <option value="Sarah Jenkins">Sarah Jenkins (Brokerage)</option>
              <option value="Michael Chang">Michael Chang (Attorney)</option>
              <option value="Alex Mercer">Alex Mercer (Financial Analyst)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Live Broadcast Link</label>
            <input
              type="url"
              required
              placeholder="https://zoom.us/j/..."
              value={webinarForm.link}
              onChange={(e) => setWebinarForm({ ...webinarForm, link: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setWebinarModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit">
              Activate Stream
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Send Notification Modal */}
      <AdminModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        title="Broadcast System Notification"
      >
        <form onSubmit={handleNotificationSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Notification Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule Update: Live Q&A is moved to 4 PM"
              value={notificationForm.title}
              onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-850 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Message Content</label>
            <textarea
              required
              rows={4}
              placeholder="Enter the notification description for students..."
              value={notificationForm.message}
              onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-850 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Segment</label>
              <select
                value={notificationForm.audience}
                onChange={(e) => setNotificationForm({ ...notificationForm, audience: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              >
                <option value="All Students">All Students</option>
                <option value="Underwriters">Underwriting Cohorts</option>
                <option value="Flippers">Flipping Cohorts</option>
                <option value="Instructors">Instructors Only</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Alert Priority</label>
              <select
                value={notificationForm.priority}
                onChange={(e) => setNotificationForm({ ...notificationForm, priority: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Immediate Alert)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setNotificationModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Broadcast Message
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Generate Certificate Modal */}
      <AdminModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        title="Issue Course Certificate"
      >
        <form onSubmit={handleCertificateSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Student Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Courtney Henry"
              value={certificateForm.studentName}
              onChange={(e) => setCertificateForm({ ...certificateForm, studentName: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-850 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Accredited Course</label>
            <select
              value={certificateForm.courseName}
              onChange={(e) => setCertificateForm({ ...certificateForm, courseName: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-850 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            >
              <option value="Luxury Flipping Masterclass">Luxury Flipping Masterclass</option>
              <option value="Commercial Real Estate Underwriting">Commercial Real Estate Underwriting</option>
              <option value="High-Ticket Sales Academy">High-Ticket Sales Academy</option>
              <option value="BRRRR Strategy Secrets">BRRRR Strategy Secrets</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Issue Date</label>
              <input
                type="date"
                required
                value={certificateForm.issueDate}
                onChange={(e) => setCertificateForm({ ...certificateForm, issueDate: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Certificate ID</label>
              <input
                type="text"
                disabled
                value={certificateForm.certId}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setCertificateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit">
              Sign & Generate
            </Button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
}
