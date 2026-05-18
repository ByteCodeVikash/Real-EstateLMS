import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertCircle, MessageSquare, Download, Calendar } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';

const assignments = [
  {
    id: 1,
    title: "Multi-Family Underwriting Sheet",
    course: "Commercial Real Estate: Investment & Underwriting",
    dueDate: "May 22, 2026",
    status: "Pending",
    difficulty: "Hard",
    description: "Construct a comprehensive 10-year cash flow model for a 40-unit multi-family asset including debt splits, GP/LP cascades, and DSCR covenants."
  },
  {
    id: 2,
    title: "Off-Market Distressed ARV Formula",
    course: "High-Ticket Property Flipping & Development",
    dueDate: "May 19, 2026",
    status: "Submitted",
    difficulty: "Medium",
    description: "Settle probate/distress purchase parameters, draft estimated rehabilitation budgets, and calculate precise After Repair Value exit metrics."
  },
  {
    id: 3,
    title: "HNW Luxury Listing Presentation",
    course: "Luxury Real Estate Listings & Brand Authority",
    dueDate: "May 15, 2026",
    status: "Graded",
    grade: "A+",
    difficulty: "Easy",
    description: "Design a pitch presentation deck for an exclusive $8.5M waterfront estate outline, focusing on international marketing, media tours, and commission models."
  }
];

const Assignments = () => {
  return (
    <div className="space-y-8 animate-in text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-premium-heading mb-2">Syllabus Assignments</h1>
          <p className="text-sm text-slate-400 font-bold">Submit deal case studies, audit your formulas, and review instructor reviews.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 text-xs font-black uppercase tracking-widest bg-white border border-premium-border text-slate-500 shadow-sm">
            <Download className="w-4 h-4 mr-2 text-premium-accent" /> Download Rubric
          </Button>
          <Button variant="primary" className="h-10 text-xs font-black uppercase tracking-widest shadow-sm">Submit Case Study</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Assignment List */}
        <div className="lg:col-span-2 space-y-6">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="group border border-premium-border bg-white p-6 shadow-sm hover:shadow-[0_12px_45px_rgba(15,23,42,0.06)] hover:border-premium-accent/20 transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                      assignment.status === 'Graded' 
                        ? 'bg-green-50 border-green-100 text-green-600' 
                        : 'bg-blue-50 border-blue-100 text-premium-accent'
                    }`}>
                      <FileText className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1 text-premium-heading group-hover:text-premium-accent transition-colors leading-snug">
                          {assignment.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold">{assignment.course}</p>
                      </div>
                      <Badge variant={
                        assignment.status === 'Pending' ? 'warning' : 
                        assignment.status === 'Submitted' ? 'info' : 'success'
                      } className="rounded-lg py-1 px-3 text-[10px] font-black uppercase tracking-wider h-6 flex items-center shrink-0 self-start md:self-center">
                        {assignment.status} {assignment.grade && `- Grade ${assignment.grade}`}
                      </Badge>
                    </div>
                    
                    <p className="text-premium-text text-xs mb-6 leading-relaxed font-medium">
                      {assignment.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-premium-border">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <Calendar className="w-4 h-4 text-premium-accent" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <AlertCircle className="w-4 h-4 text-premium-accent" />
                        <span>Level: {assignment.difficulty}</span>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-premium-heading">Details</Button>
                        {assignment.status === 'Pending' ? (
                          <Button variant="primary" size="sm" className="text-xs font-black uppercase tracking-widest h-9 px-4 shadow-sm">Upload File</Button>
                        ) : (
                          <Button variant="outline" size="sm" className="text-xs font-black uppercase tracking-widest h-9 px-4 border border-premium-border bg-white text-slate-500 hover:bg-slate-50 shadow-sm">Review File</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="space-y-6">
          <GlassCard className="border border-premium-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-premium-heading mb-6">Performance Records</h3>
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-600 w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Approval Rate</span>
                </div>
                <span className="text-sm font-black text-premium-heading">92% Passing</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="text-premium-accent w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Mentor Comments</span>
                </div>
                <span className="text-sm font-black text-premium-heading">5 Submissions</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Weekly Workload</span>
                </div>
                <span className="text-sm font-black text-premium-heading">5.6h / week</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-8 text-xs font-black uppercase tracking-widest h-11 bg-white border border-premium-border text-slate-500 hover:bg-slate-50 shadow-sm">Download Grade Sheets</Button>
          </GlassCard>

          <GlassCard className="bg-gradient-premium border-none relative overflow-hidden flex flex-col justify-between h-48 shadow-lg p-6">
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
             <div className="relative z-10 space-y-2 text-left">
                <h3 className="text-base font-black text-white">Need Deal Help?</h3>
                <p className="text-white/80 text-xs leading-relaxed font-bold">Schedule a private deal audit with Robert to review your local commercial underwriting sheet.</p>
             </div>
             <Button className="w-full bg-white text-blue-600 hover:bg-white/95 text-xs font-black uppercase tracking-widest h-11 shadow-sm mt-4">Book Private Session</Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
