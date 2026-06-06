import React, { useState, useEffect } from 'react';
import { ClipboardList, FileText, CheckCircle, Clock, AlertTriangle, MessageSquare, Send } from 'lucide-react';
import { AdminTable, AdminDrawer } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

const initialSubmissions = [
  { id: 1, student: "Robert Fox", course: "Luxury Flipping Masterclass", topic: "Off-Market Deal Sourcing Assignment", submitted: "2026-05-22", score: "88/100", status: "Graded", feedback: "Excellent deal finding report. Solid comps!" },
  { id: 2, student: "Jane Cooper", course: "Commercial Underwriting", topic: "REIT Model spreadsheet build", submitted: "2026-05-23", score: "—", status: "Pending", feedback: "" },
  { id: 3, student: "Guy Hawkins", course: "High-Ticket Real Estate Negotiation", topic: "Buyer objection handling audio log", submitted: "2026-05-21", score: "94/100", status: "Graded", feedback: "Perfect negotiation framing. Good objection handling." },
  { id: 4, student: "Esther Howard", course: "Luxury Flipping Masterclass", topic: "Off-Market Deal Sourcing Assignment", submitted: "2026-05-22", score: "—", status: "Pending", feedback: "" },
  { id: 5, student: "Albert Flores", course: "Commercial Underwriting", topic: "REIT Model spreadsheet build", submitted: "2026-05-18", score: "62/100", status: "Needs Revision", feedback: "Math error in debt service coverage ratio. Please fix and re-submit." }
];

export default function AdminAssignments() {
  const { token, API_BASE_URL } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gradeInput, setGradeInput] = useState('80');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [statusInput, setStatusInput] = useState('Graded');

  const fetchSubmissions = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        const mapped = data.data.map(s => {
          let scoreStr = "—";
          if (s.marks !== null) {
            scoreStr = `${s.marks}/${s.max_marks || 100}`;
          }
          
          let uiStatus = "Pending";
          if (s.status === "Graded") uiStatus = "Graded";
          if (s.status === "Revision Requested" || s.status === "Needs Revision") uiStatus = "Needs Revision";
          
          return {
            id: s.id,
            student: s.student_name || "Unknown Student",
            course: s.course_title || "LMS Course",
            topic: s.assignment_title || "Assignment Task",
            submitted: s.submitted_at ? s.submitted_at.substring(0, 10) : "",
            score: scoreStr,
            status: uiStatus,
            feedback: s.feedback || "",
            file_path: s.file_path || ""
          };
        });
        setSubmissions(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token]);

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    
    let apiStatus = "Graded";
    if (statusInput === "Needs Revision") apiStatus = "Revision Requested";
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions/${selectedSub.id}/grade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          marks: Number(gradeInput),
          feedback: feedbackInput,
          status: apiStatus
        })
      });
      const resData = await response.json();
      if (resData.status === 'success') {
        alert("Submission graded successfully!");
        fetchSubmissions();
      } else {
        alert("Failed to save grade: " + (resData.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to submit grade:", err);
      alert("Error grading submission.");
    }
    
    setDrawerOpen(false);
    setSelectedSub(null);
  };

  const columns = [
    {
      header: "Student",
      accessor: "student",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#111114] bg-[#111114] flex items-center justify-center font-bold text-premium-accent text-[11px] shrink-0">
            {row.student.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-white text-white leading-none">{row.student}</p>
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
        <span className={`font-black text-xs ${row.score === "—" ? "text-slate-400" : "text-white text-white"}`}>
          {row.score}
        </span>
      )
    },
    {
      header: "Grading State",
      accessor: "status",
      render: (row) => {
        const styles = {
          Graded: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
          Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900",
          "Needs Revision": "bg-red-500/10 text-red-650 border-red-500/20 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
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
        <h1 className="text-2xl font-black text-white text-white tracking-tight uppercase">Assignments Review</h1>
        <p className="text-xs font-semibold text-slate-400 text-slate-500 mt-1">Audit submitted underwriting spreadsheets, transaction playbooks, valuation summaries, and assign final grades.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/100/10 flex items-center justify-center text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 text-slate-500 uppercase tracking-wider">Awaiting Evaluation</span>
            <p className="text-xl font-black text-white text-white mt-0.5">{submissions.filter(s=>s.status === "Pending").length} Submissions</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/100/10 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 text-slate-500 uppercase tracking-wider">Graded portfolios</span>
            <p className="text-xl font-black text-white text-white mt-0.5">{submissions.filter(s=>s.status === "Graded").length} Submissions</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-500/100/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 text-slate-500 uppercase tracking-wider">Revisions Flagged</span>
            <p className="text-xl font-black text-white text-white mt-0.5">{submissions.filter(s=>s.status === "Needs Revision").length} Flagged</p>
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
            
            <div className="bg-[#0f0f12] bg-[#0f0f12] p-4 rounded-xl border border-[#1a1a1c] border-[#1a1a1c]">
              <span className="text-[9px] font-black uppercase text-premium-accent tracking-wider">Submitted File</span>
              <p className="text-sm font-black text-white text-white mt-1">{selectedSub.topic}</p>
              <p className="text-[11px] font-semibold text-slate-450 text-slate-400 mt-0.5">By {selectedSub.student} on {selectedSub.submitted}</p>
              <div className="mt-3.5 flex items-center gap-2">
                {selectedSub.file_path ? (
                  <a 
                    href={selectedSub.file_path.startsWith('http') ? selectedSub.file_path : `${API_BASE_URL}/${selectedSub.file_path}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" type="button" className="py-2 px-3 text-[11px] h-auto cursor-pointer">
                      <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> View/Download Uploaded File
                    </Button>
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 font-semibold italic">No file uploaded</span>
                )}
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
                className="w-full h-1.5 bg-[#111114] bg-[#111114] rounded-lg appearance-none cursor-pointer accent-premium-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Evaluation Status</label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none"
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
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none scrollbar-thin"
              />
            </div>

            <div className="pt-4 border-t border-[#1a1a1c] dark:border-slate-850 flex items-center justify-end gap-2.5">
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
