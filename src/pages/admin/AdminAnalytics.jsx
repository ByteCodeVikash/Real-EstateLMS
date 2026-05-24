import React from 'react';
import { TrendingUp, Users, Clock, Award, BookOpen } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

const dailyEngagement = [
  { name: 'Mon', activeStudents: 340, studyHours: 850 },
  { name: 'Tue', activeStudents: 450, studyHours: 1100 },
  { name: 'Wed', activeStudents: 410, studyHours: 980 },
  { name: 'Thu', activeStudents: 480, studyHours: 1200 },
  { name: 'Fri', activeStudents: 380, studyHours: 920 },
  { name: 'Sat', activeStudents: 290, studyHours: 720 },
  { name: 'Sun', activeStudents: 210, studyHours: 540 },
];

const coursePerformance = [
  { subject: 'Valuation', A: 90, B: 85, fullMark: 100 },
  { subject: 'Contracts', A: 75, B: 90, fullMark: 100 },
  { subject: 'Flipping', A: 95, B: 80, fullMark: 100 },
  { subject: 'Lending', A: 80, B: 70, fullMark: 100 },
  { subject: 'Zoning', A: 68, B: 82, fullMark: 100 },
  { subject: 'Pitching', A: 92, B: 88, fullMark: 100 },
];

const weeklyEnrollment = [
  { week: 'Wk 1', premiumStudents: 14, regularStudents: 22 },
  { week: 'Wk 2', premiumStudents: 18, regularStudents: 30 },
  { week: 'Wk 3', premiumStudents: 25, regularStudents: 45 },
  { week: 'Wk 4', premiumStudents: 32, regularStudents: 38 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Performance Analytics</h1>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Audit learning curve stats, active study duration metrics, syllabus performance, and platform traffic logs.</p>
      </div>

      {/* Analytics Summary Widget Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Study Duration</span>
            <Clock className="w-4 h-4 text-premium-accent" />
          </div>
          <p className="text-2xl font-black text-premium-heading dark:text-white mt-2">4.2 Hrs / Wk</p>
          <span className="text-[10px] text-emerald-500 font-extrabold mt-1 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.5% increase vs last month
          </span>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Daily Logins</span>
            <Users className="w-4 h-4 text-premium-violet" />
          </div>
          <p className="text-2xl font-black text-premium-heading dark:text-white mt-2">368 Students</p>
          <span className="text-[10px] text-emerald-500 font-extrabold mt-1 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +4.8% growth this week
          </span>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lessons Completion Curve</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-premium-heading dark:text-white mt-2">78.5% Net</p>
          <span className="text-[10px] text-emerald-500 font-extrabold mt-1 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +2.1% course retention rate
          </span>
        </div>
      </div>

      {/* First Chart Row: Engagement & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Engagement Study Hours line-bar chart */}
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="mb-6">
            <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Daily Learning Hours</h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Platform engagement log by hours & active logons</p>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyEngagement} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
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

        {/* Radar course performance chart */}
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="mb-6">
            <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Syllabus Subject Strength</h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Performance averages across major learning paths</p>
          </div>

          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={coursePerformance}>
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

      </div>

      {/* Second Chart Row: Weekly enrollments trend */}
      <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="mb-6">
          <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Monthly Account Registration</h3>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Growth comparison between premium realtors and basic logins</p>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyEnrollment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
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
              <Line type="monotone" dataKey="premiumStudents" name="Premium Academy Enrollments" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="regularStudents" name="Basic Accounts Registered" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
