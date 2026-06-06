import React, { useState } from 'react';
import { 
  TrendingUp, Users, Clock, Award, BookOpen, Download, 
  Calendar, CheckCircle, Flame, Filter, ChevronDown, 
  HelpCircle, ArrowUpRight, ArrowDownRight, Radio, Info
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { GlassCard, Button } from '../../components/UI';

// Mock datasets for different date range filters
const dataset30Days = {
  dailyEngagement: [
    { name: 'Mon', activeStudents: 340, studyHours: 850 },
    { name: 'Tue', activeStudents: 450, studyHours: 1100 },
    { name: 'Wed', activeStudents: 410, studyHours: 980 },
    { name: 'Thu', activeStudents: 480, studyHours: 1200 },
    { name: 'Fri', activeStudents: 380, studyHours: 920 },
    { name: 'Sat', activeStudents: 290, studyHours: 720 },
    { name: 'Sun', activeStudents: 210, studyHours: 540 },
  ],
  coursePerformance: [
    { subject: 'Valuation', A: 90, B: 85 },
    { subject: 'Contracts', A: 75, B: 90 },
    { subject: 'Flipping', A: 95, B: 80 },
    { subject: 'Lending', A: 80, B: 70 },
    { subject: 'Zoning', A: 68, B: 82 },
    { subject: 'Pitching', A: 92, B: 88 },
  ],
  weeklyEnrollment: [
    { name: 'Week 1', premiumStudents: 14, regularStudents: 22 },
    { name: 'Week 2', premiumStudents: 18, regularStudents: 30 },
    { name: 'Week 3', premiumStudents: 25, regularStudents: 45 },
    { name: 'Week 4', premiumStudents: 32, regularStudents: 38 },
  ],
  funnelData: [
    { stage: 'Webinar Registrants', value: 850, percentage: 100, fill: '#2563eb' },
    { stage: 'Attended Live Room', value: 580, percentage: 68, fill: '#3b82f6' },
    { stage: 'Clicked Offer CTA', value: 290, percentage: 34, fill: '#60a5fa' },
    { stage: 'Purchased Premium', value: 116, percentage: 13, fill: '#7c3aed' },
  ],
  kpi: {
    duration: "4.8 Hrs / Wk",
    durationTrend: "+12.5%",
    activeStudents: "3,842 Students",
    activeTrend: "+8.3%",
    completion: "82.4% Net",
    completionTrend: "+3.1%",
    webinarConversion: "13.6% Avg",
    webinarTrend: "+5.7%"
  }
};

const dataset7Days = {
  dailyEngagement: [
    { name: 'Mon', activeStudents: 310, studyHours: 720 },
    { name: 'Tue', activeStudents: 380, studyHours: 910 },
    { name: 'Wed', activeStudents: 360, studyHours: 850 },
    { name: 'Thu', activeStudents: 410, studyHours: 1020 },
    { name: 'Fri', activeStudents: 330, studyHours: 810 },
    { name: 'Sat', activeStudents: 250, studyHours: 580 },
    { name: 'Sun', activeStudents: 180, studyHours: 410 },
  ],
  coursePerformance: [
    { subject: 'Valuation', A: 88, B: 85 },
    { subject: 'Contracts', A: 78, B: 90 },
    { subject: 'Flipping', A: 92, B: 80 },
    { subject: 'Lending', A: 82, B: 70 },
    { subject: 'Zoning', A: 72, B: 82 },
    { subject: 'Pitching', A: 90, B: 88 },
  ],
  weeklyEnrollment: [
    { name: 'Day 1-2', premiumStudents: 4, regularStudents: 8 },
    { name: 'Day 3-4', premiumStudents: 8, regularStudents: 12 },
    { name: 'Day 5-6', premiumStudents: 11, regularStudents: 15 },
    { name: 'Day 7', premiumStudents: 5, regularStudents: 7 },
  ],
  funnelData: [
    { stage: 'Webinar Registrants', value: 240, percentage: 100, fill: '#2563eb' },
    { stage: 'Attended Live Room', value: 172, percentage: 71, fill: '#3b82f6' },
    { stage: 'Clicked Offer CTA', value: 82, percentage: 34, fill: '#60a5fa' },
    { stage: 'Purchased Premium', value: 34, percentage: 14, fill: '#7c3aed' },
  ],
  kpi: {
    duration: "4.1 Hrs / Wk",
    durationTrend: "+6.8%",
    activeStudents: "1,248 Students",
    activeTrend: "+4.1%",
    completion: "79.1% Net",
    completionTrend: "+1.2%",
    webinarConversion: "14.1% Avg",
    webinarTrend: "+6.2%"
  }
};

const dataset90Days = {
  dailyEngagement: [
    { name: 'Mon', activeStudents: 980, studyHours: 2400 },
    { name: 'Tue', activeStudents: 1250, studyHours: 3200 },
    { name: 'Wed', activeStudents: 1180, studyHours: 2950 },
    { name: 'Thu', activeStudents: 1340, studyHours: 3500 },
    { name: 'Fri', activeStudents: 1080, studyHours: 2700 },
    { name: 'Sat', activeStudents: 850, studyHours: 2100 },
    { name: 'Sun', activeStudents: 620, studyHours: 1500 },
  ],
  coursePerformance: [
    { subject: 'Valuation', A: 92, B: 85 },
    { subject: 'Contracts', A: 84, B: 90 },
    { subject: 'Flipping', A: 96, B: 80 },
    { subject: 'Lending', A: 85, B: 70 },
    { subject: 'Zoning', A: 76, B: 82 },
    { subject: 'Pitching', A: 94, B: 88 },
  ],
  weeklyEnrollment: [
    { name: 'Month 1', premiumStudents: 64, regularStudents: 120 },
    { name: 'Month 2', premiumStudents: 82, regularStudents: 154 },
    { name: 'Month 3', premiumStudents: 110, regularStudents: 172 },
  ],
  funnelData: [
    { stage: 'Webinar Registrants', value: 2750, percentage: 100, fill: '#2563eb' },
    { stage: 'Attended Live Room', value: 1820, percentage: 66, fill: '#3b82f6' },
    { stage: 'Clicked Offer CTA', value: 910, percentage: 33, fill: '#60a5fa' },
    { stage: 'Purchased Premium', value: 345, percentage: 12, fill: '#7c3aed' },
  ],
  kpi: {
    duration: "5.1 Hrs / Wk",
    durationTrend: "+18.2%",
    activeStudents: "11,840 Students",
    activeTrend: "+15.4%",
    completion: "85.2% Net",
    completionTrend: "+5.6%",
    webinarConversion: "12.5% Avg",
    webinarTrend: "+4.1%"
  }
};

// Heatmap mock data generation (12 weeks * 7 days = 84 cells)
// Days in week: Sun, Mon, Tue, Wed, Thu, Fri, Sat
const heatmapWeekLabels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"];
const heatmapDayLabels = ["S", "M", "T", "W", "T", "F", "S"];

const activityHeatmap = Array.from({ length: 84 }, (_, idx) => {
  const weekIdx = Math.floor(idx / 7);
  const dayIdx = idx % 7;
  
  // Random activity level 0 to 4 (with Sunday/Saturday naturally lower)
  let level = 0;
  if (dayIdx !== 0 && dayIdx !== 6) {
    const r = Math.random();
    level = r < 0.1 ? 0 : r < 0.4 ? 1 : r < 0.7 ? 2 : r < 0.9 ? 3 : 4;
  } else {
    level = Math.random() < 0.6 ? 0 : 1;
  }

  const studyMins = level === 0 ? 0 : level === 1 ? 45 : level === 2 ? 120 : level === 3 ? 240 : 410;
  
  return {
    id: idx,
    week: weekIdx + 1,
    dayName: heatmapDayLabels[dayIdx],
    level,
    studyMins
  };
});

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('30days'); // '7days' | '30days' | '90days'
  
  // Choose datasets based on filter
  const currentDataset = 
    dateRange === '7days' ? dataset7Days : 
    dateRange === '90days' ? dataset90Days : dataset30Days;

  const handleExportReport = () => {
    alert(`Success: Standard audit report generated for the past ${dateRange === '7days' ? '7 Days' : dateRange === '90days' ? '90 Days' : '30 Days'}. Exporting PDF format...`);
  };

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title block with date filter & export button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a1c] border-[#1a1a1c]/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-premium-accent font-black text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Platform Statistics</span>
          </div>
          <h1 className="text-3xl font-black text-white text-white tracking-tight uppercase">
            Performance Analytics
          </h1>
          <p className="text-sm font-semibold text-slate-400 text-slate-500 mt-1">
            Analyze active student learning metrics, assignment completion ratios, study log activities, and event funnel conversions.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-[#0b0b0d] bg-[#0b0b0d] border border-premium-border border-[#1a1a1c] rounded-xl py-2.5 pl-4 pr-10 text-xs font-black text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/25 cursor-pointer shadow-sm"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <div className="absolute right-3.5 top-3 pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          <Button variant="outline" size="sm" className="h-[38px] shadow-sm font-black text-xs uppercase py-0" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" /> Export Audit
          </Button>
        </div>
      </div>

      {/* KPI Stats widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-wider">Active Students</span>
            <div className="h-9 w-9 rounded-lg bg-[#0A66C2]/10 dark:bg-blue-950/20 text-premium-accent flex items-center justify-center border border-[#0A66C2]/20 dark:border-blue-900 shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white text-white tracking-tight leading-none">{currentDataset.kpi.activeStudents}</h3>
            <span className="text-[10px] text-emerald-500 font-extrabold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentDataset.kpi.activeTrend} Growth rate
            </span>
          </div>
        </GlassCard>

        <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-wider">Avg Study Duration</span>
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 dark:bg-violet-950/20 text-premium-violet flex items-center justify-center border border-violet-500/20 dark:border-violet-900 shrink-0">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white text-white tracking-tight leading-none">{currentDataset.kpi.duration}</h3>
            <span className="text-[10px] text-emerald-500 font-extrabold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentDataset.kpi.durationTrend} Learning intensity
            </span>
          </div>
        </GlassCard>

        <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-wider">Assignment Completion</span>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 dark:border-emerald-900 shrink-0">
              <Award className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white text-white tracking-tight leading-none">{currentDataset.kpi.completion}</h3>
            <span className="text-[10px] text-emerald-500 font-extrabold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentDataset.kpi.completionTrend} Class retention
            </span>
          </div>
        </GlassCard>

        <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-wider">Webinar Conversion</span>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center border border-amber-500/20 dark:border-amber-900 shrink-0">
              <Radio className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white text-white tracking-tight leading-none">{currentDataset.kpi.webinarConversion}</h3>
            <span className="text-[10px] text-emerald-500 font-extrabold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentDataset.kpi.webinarTrend} Lead funnel
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Row 1: Daily Engagement & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Engagement Study Hours line-bar chart */}
        <div className="lg:col-span-8 rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card text-left">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white text-white tracking-tight uppercase">Daily Learning Hours</h3>
              <p className="text-[11px] font-semibold text-slate-400 text-slate-500 mt-0.5">Platform engagement log by hours & active logons</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 text-slate-500 font-mono">Real-time update</span>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentDataset.dailyEngagement} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="stroke-[#1a1a1c]" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="studyHours" name="Study Duration (Hrs)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="activeStudents" name="Active Student Logins" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Webinar Conversion Funnel */}
        <div className="lg:col-span-4 rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card text-left flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-white text-white tracking-tight uppercase">Webinar Conversion Funnel</h3>
            <p className="text-[11px] font-semibold text-slate-400 text-slate-500 mt-0.5">Leads to Premium sales conversion ratios</p>
          </div>

          <div className="my-6 space-y-3.5">
            {currentDataset.funnelData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 text-slate-300">
                  <span>{item.stage}</span>
                  <span className="font-mono font-black">{item.value} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-[#111114] bg-[#111114] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.fill }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#0A66C2]/10/50 dark:bg-blue-950/10 border border-[#0A66C2]/20 dark:border-blue-900/40 rounded-xl flex gap-2.5">
            <Info className="w-4 h-4 text-premium-accent shrink-0 mt-0.5" />
            <p className="text-[9px] font-semibold text-slate-500 text-slate-400 leading-normal">
              Industry standard conversion for high-ticket coaching is 8-10%. BG Realty Training Academy stands at <span className="text-premium-accent font-black">13.6% conversion rate</span>.
            </p>
          </div>
        </div>

      </div>

      {/* Row 2: Subject Strength (Radar) & Account Acquisitions (Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Course Performance Chart */}
        <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card text-left">
          <div className="mb-6">
            <h3 className="text-base font-black text-white text-white tracking-tight uppercase">Syllabus Subject Strength</h3>
            <p className="text-[11px] font-semibold text-slate-400 text-slate-500 mt-0.5">Performance averages across major learning paths</p>
          </div>

          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={currentDataset.coursePerformance}>
                <PolarGrid stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                <Radar name="Class Average" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                <Radar name="Pass Requirement" dataKey="B" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Acquisition Line Chart */}
        <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card text-left">
          <div className="mb-6">
            <h3 className="text-base font-black text-white text-white tracking-tight uppercase">Monthly Account Registration</h3>
            <p className="text-[11px] font-semibold text-slate-400 text-slate-500 mt-0.5">Growth comparison between premium realtors and basic logins</p>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentDataset.weeklyEnrollment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRegular" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="stroke-[#1a1a1c]" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="premiumStudents" name="Premium Academy Pass" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPremium)" />
                <Area type="monotone" dataKey="regularStudents" name="Standard Free Account" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRegular)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Advanced UI - Engagement Activity Heatmap */}
      <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card text-left space-y-6">
        <div>
          <h3 className="text-base font-black text-white text-white tracking-tight uppercase flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500 fill-current animate-pulse" /> Student Learning Activity Grid
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 text-slate-500 mt-0.5">Heatmap tracking aggregate student platform activities (in hours) over the last 12 weeks</p>
        </div>

        {/* Heatmap Grid Calendar wrapper */}
        <div className="flex flex-col space-y-4 overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex gap-3 min-w-[640px]">
            {/* Days Column Labels */}
            <div className="flex flex-col justify-between text-[10px] font-black text-slate-400 dark:text-slate-600 w-4 pr-1 mt-6">
              {heatmapDayLabels.map((lbl, idx) => (
                <span key={idx} className="h-3 leading-none">{lbl}</span>
              ))}
            </div>

            {/* Matrix of days */}
            <div className="flex-1 flex flex-col gap-1.5">
              {/* Weeks label header row */}
              <div className="flex justify-between text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest pl-2 mb-1">
                {heatmapWeekLabels.map((lbl, idx) => (
                  <span key={idx} className="w-10 text-left">{lbl}</span>
                ))}
              </div>

              {/* Grid block itself */}
              <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                {activityHeatmap.map(cell => {
                  const levelColors = [
                    "bg-[#0f0f12] bg-[#0f0f12] hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-700", // 0
                    "bg-emerald-100 dark:bg-emerald-950/30 hover:ring-1 hover:ring-emerald-300 dark:hover:ring-emerald-800", // 1
                    "bg-emerald-300 dark:bg-emerald-800 hover:ring-1 hover:ring-emerald-400 dark:hover:ring-emerald-600", // 2
                    "bg-emerald-500/100 dark:bg-emerald-600 hover:ring-1 hover:ring-emerald-600 dark:hover:ring-emerald-400", // 3
                    "bg-emerald-700 dark:bg-emerald-400 hover:ring-1 hover:ring-emerald-800 dark:hover:ring-emerald-300", // 4
                  ];

                  return (
                    <div
                      key={cell.id}
                      className={`h-4 w-10 sm:w-11 rounded transition-all cursor-pointer flex items-center justify-center ${levelColors[cell.level]}`}
                      title={`Week ${cell.week}, ${cell.dayName}: ${cell.studyMins} minutes study activity`}
                    >
                      {cell.level > 0 && (
                        <span className="text-[7px] font-mono font-black text-emerald-900 text-white opacity-40">
                          {Math.round(cell.studyMins / 60)}h
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2.5 text-[9px] font-black uppercase text-slate-400 text-slate-500 pr-4">
            <span>Low Activity</span>
            <span className="h-3 w-3 rounded bg-[#0f0f12] bg-[#0f0f12] border border-[#1e1e22] border-[#1a1a1c]"></span>
            <span className="h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-950/30"></span>
            <span className="h-3 w-3 rounded bg-emerald-300 dark:bg-emerald-800"></span>
            <span className="h-3 w-3 rounded bg-emerald-500/100 dark:bg-emerald-600"></span>
            <span className="h-3 w-3 rounded bg-emerald-700 dark:bg-emerald-400"></span>
            <span>Peak Activity</span>
          </div>
        </div>
      </div>

    </div>
  );
}
