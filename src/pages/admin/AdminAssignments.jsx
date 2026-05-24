import React, { useState } from 'react';
import { ClipboardList, FileText, CheckCircle, Clock, AlertTriangle, MessageSquare, Send } from 'lucide-react';
import { AdminTable, AdminDrawer } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

const initialSubmissions = [
  { id: 1, student: "Robert Fox", course: "Luxury Flipping Masterclass", topic: "Off-Market Deal Sourcing Assignment", submitted: "2026-05-22", score: "88/100", status: "Graded", feedback: "Excellent deal finding report. Solid comps!" },
  { id: 2, student: "Jane Cooper", course: "Commercial Underwriting", topic: "REIT Model spreadsheet build", submitted: "2026-05-23", score: "—", status: "Pending", feedback: "" },
  { id: 3, student: "Guy Hawkins", course: "High-Ticket Real Estate Negotiation", topic: "Buyer objection handling audio log", submitted: "2026-05-21", score: "94/100", status: "Graded", feedback: "Perfect negotiation framing. Good objection handling." },
  { id: 4, student: "Esther Howard", course: "Luxury Flipping Masterclass", topic: "Off-Market Deal Sourcing Assignment", submitted: "2026-05-22", score: "—", status: "Pending", feedback: "" },
  { id: 5, student: "Albert Flores", course: "Commercial Underwriting", topic: "REIT Model spreadsheet build", submitted: "2026-05-18", score: "62/100", status: "Needs Revision", feedback: "Math error in debt service coverage ratio. Please fix and re-submit." }
];

export default function AdminAssignments() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedSub, setSelectedSub] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gradeInput, setGradeInput] = useState('80');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [statusInput, setStatusInput] = useState('Graded');

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    setSubmissions(prev => prev.map(s => {
      if (s.id === selectedSub.id) {
        alert(`Graded submission for "${s.student}"! Score: ${gradeInput}/100.`);
        return {
          ...s,
          score: `${gradeInput}/100`,
          status: statusInput,
          feedback: feedbackInput
        };
      }
      return s;
    }));
    setDrawerOpen(false);
    setSelectedSub(null);
  };

  const columns = [
    {
      header: "Student",
      accessor: "student",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-premium-accent text-[11px] shrink-0">
            {row.student.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-premium-heading dark:text-white leading-none">{row.student}</p>
            <span className="text-[10px] text-slate-400 font-semibold">{row.course}</span>
          </div>
        </div>
      )
    },
    {
      header: "Topic / Lesson Task",
      accessor: "topic",
      cellClassName: "text-slate-600 dark:text-slate-350 max-w-[250px] truncate"
    },
    {
      header: "Submitted On",
      accessor: "submitted",
      cellClassName: "text-slate-400"
    },
    {
      header: "Score Assigned",
      accessor: "score",
      render: (row) => (
        <span className={`font-black text-xs ${row.score === "—" ? "text-slate-400" : "text-premium-heading dark:text-white"}`}>
          {row.score}
        </span>
      )
    },
    {
      header: "Grading State",
      accessor: "status",
      render: (row) => {
        const styles = {
          Graded: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
          Pending: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900",
          "Needs Revision": "bg-red-50 text-red-650 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[row.status] || ''}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: "Grade Portfolio",
      accessor: "id",
      render: (row) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 text-[10px] font-black py-0"
          onClick={() => {
            setSelectedSub(row);
            setGradeInput(row.score === "—" ? "80" : row.score.split('/')[0]);
            setFeedbackInput(row.feedback);
            setStatusInput(row.status === "Pending" ? "Graded" : row.status);
            setDrawerOpen(true);
          }}
        >
          {row.status === "Pending" ? "Grade Now" : "Re-Grade"}
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Assignments Review</h1>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Audit submitted underwriting spreadsheets, transaction playbooks, valuation summaries, and assign final grades.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Awaiting Evaluation</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{submissions.filter(s=>s.status === "Pending").length} Submissions</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Graded portfolios</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{submissions.filter(s=>s.status === "Graded").length} Submissions</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Revisions Flagged</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{submissions.filter(s=>s.status === "Needs Revision").length} Flagged</p>
          </div>
        </div>
      </div>

      {/* Main Submissions table */}
      <AdminTable
        title="Student Assignments Ledger"
        subtitle="Evaluation logs, course details, grades database"
        columns={columns}
        data={submissions}
        searchPlaceholder="Search student, course, topic..."
        filterOptions={{
          field: "status",
          label: "Grading State",
          options: [
            { value: "Pending", label: "Pending" },
            { value: "Graded", label: "Graded" },
            { value: "Needs Revision", label: "Needs Revision" }
          ]
        }}
      />

      {/* Grading Drawer */}
      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Grade Assignment Submission"
      >
        {selectedSub && (
          <form onSubmit={handleGradeSubmit} className="space-y-6">
            
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-premium-border/60 dark:border-slate-800">
              <span className="text-[9px] font-black uppercase text-premium-accent tracking-wider">Submitted File</span>
              <p className="text-sm font-black text-premium-heading dark:text-white mt-1">{selectedSub.topic}</p>
              <p className="text-[11px] font-semibold text-slate-450 dark:text-slate-400 mt-0.5">By {selectedSub.student} on {selectedSub.submitted}</p>
              <div className="mt-3.5 flex items-center gap-2">
                <Button variant="outline" size="sm" type="button" className="py-2 px-3 text-[11px] h-auto">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-450" /> Download PDF/Asset
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex justify-between">
                <span>Score Assigned</span>
                <span className="text-premium-accent font-black">{gradeInput} / 100</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-premium-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Evaluation Status</label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              >
                <option value="Graded">Graded (Approve & Close)</option>
                <option value="Needs Revision">Needs Revision (Reject & Return)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Feedback & Advisory Comments</label>
              <textarea
                rows="4"
                required
                placeholder="Give constructive critique of their financial model, zoning layout, or sales pitching recording..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none scrollbar-thin"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-2.5">
              <Button variant="outline" size="sm" type="button" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                <Send className="w-4 h-4 mr-2" /> Submit Grading
              </Button>
            </div>

          </form>
        )}
      </AdminDrawer>

    </div>
  );
}
