import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle, AlertCircle, MessageSquare, Download, 
  Calendar, X, UploadCloud, Trash2, RefreshCw, Check, AlertTriangle, Info, HelpCircle
} from 'lucide-react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { GlassCard, Badge, Button } from '../components/UI';
import { useNow } from '../hooks/useNow';
import { formatCountdownParts, formatLocalDateTime, getUrgencyTone, safeParseDate } from '../utils/countdown';

// Default seed — used as fallback when localStorage is empty
const DEFAULT_ASSIGNMENTS = [
  {
    id: 1,
    title: "Multi-Family Underwriting Sheet",
    course: "Commercial Real Estate: Investment & Underwriting",
    dueDate: "May 22, 2026",
    status: "Pending",
    difficulty: "Hard",
    description: "Construct a comprehensive 10-year cash flow model for a 40-unit multi-family asset including debt splits, GP/LP cascades, and DSCR covenants.",
    acceptedFormats: "XLSX, PDF",
    submittedFile: null
  },
  {
    id: 2,
    title: "Off-Market Distressed ARV Formula",
    course: "High-Ticket Property Flipping & Development",
    dueDate: "May 19, 2026",
    status: "Revision Requested",
    difficulty: "Medium",
    description: "Settle probate/distress purchase parameters, draft estimated rehabilitation budgets, and calculate precise After Repair Value exit metrics.",
    acceptedFormats: "PDF, DOCX",
    submittedFile: {
      name: "distressed_arv_v1.docx",
      size: "1.8 MB",
      submittedAt: "May 18, 2026 at 4:12 PM",
      feedback: "Please adjust the rehabilitation contingency budget from 10% to 15% for the probate case study."
    }
  },
  {
    id: 3,
    title: "HNW Luxury Listing Presentation",
    course: "Luxury Real Estate Listings & Brand Authority",
    dueDate: "May 15, 2026",
    status: "Graded",
    grade: "A+",
    difficulty: "Easy",
    description: "Design a pitch presentation deck for an exclusive $8.5M waterfront estate outline, focusing on international marketing, media tours, and commission models.",
    acceptedFormats: "PDF, ZIP",
    submittedFile: {
      name: "hnw_waterfront_pitch.pdf",
      size: "4.2 MB",
      submittedAt: "May 14, 2026 at 11:30 AM",
      feedback: "Outstanding branding styling codes and localized hyper-targeted marketing outline."
    }
  }
];

const Assignments = () => {
  const nowMs = useNow();

  // Load persisted assignments on mount; fall back to DEFAULT_ASSIGNMENTS seed
  const [assignmentsState, setAssignmentsState] = useState(
    () => loadFromStorage(STORAGE_KEYS.assignments, DEFAULT_ASSIGNMENTS)
  );
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Prevent background scroll when the upload modal is open (mobile polish)
  useEffect(() => {
    if (selectedAssignment) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [selectedAssignment]);

  const getDueAt = (assignment) => {
    const explicit = safeParseDate(assignment?.dueAt);
    if (explicit) return explicit;
    const parsed = safeParseDate(assignment?.dueDate);
    if (!parsed) return null;
    const due = new Date(parsed);
    // Treat dueDate-only strings as end-of-day local deadline for a premium "deadline" feel.
    if (due.getHours() === 0 && due.getMinutes() === 0 && due.getSeconds() === 0) {
      due.setHours(23, 59, 59, 999);
    }
    return due;
  };

  const getDueMeta = (assignment) => {
    const dueAt = getDueAt(assignment);
    if (!dueAt) return { dueAt: null, remainingMs: 0, tone: 'normal', state: 'invalid' };
    const remainingMs = dueAt.getTime() - nowMs;
    const state = remainingMs <= 0 ? 'expired' : 'active';
    return { dueAt, remainingMs: Math.max(0, remainingMs), tone: getUrgencyTone(remainingMs), state };
  };
  
  // Persist assignments state whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.assignments, assignmentsState);
  }, [assignmentsState]);

  // Modal states
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [simulateError, setSimulateError] = useState(false);
  const [uploadInterval, setUploadInterval] = useState(null);

  const fileInputRef = useRef(null);

  // Clean up timer interval on unmount
  useEffect(() => {
    return () => {
      if (uploadInterval) clearInterval(uploadInterval);
    };
  }, [uploadInterval]);

  const openUploadModal = (assignment) => {
    setSelectedAssignment(assignment);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setUploading(false);
    
    // Set file state if it is already submitted
    if (assignment.submittedFile) {
      setFile({
        name: assignment.submittedFile.name,
        sizeText: assignment.submittedFile.size,
        submittedAt: assignment.submittedFile.submittedAt
      });
      setSuccess(true);
    } else {
      setFile(null);
    }
  };

  const closeUploadModal = () => {
    if (uploadInterval) clearInterval(uploadInterval);
    setUploadInterval(null);
    setSelectedAssignment(null);
    setFile(null);
    setUploading(false);
    setProgress(0);
    setSuccess(false);
    setError(null);
  };

  // Drag and drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'docx', 'xlsx', 'zip'];
    if (allowed.includes(fileExtension)) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      setProgress(0);
    } else {
      setError(`Unsupported file type. Accepted formats: PDF, DOCX, XLSX, ZIP.`);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const startUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    if (uploadInterval) clearInterval(uploadInterval);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Smooth randomized progress leaps
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setUploadInterval(null);
        
        if (simulateError) {
          setUploading(false);
          setError("Connection timeout. BG Security gateway rejected the payload. Please try again.");
        } else {
          setUploading(false);
          setSuccess(true);
          
          const formattedSize = file.sizeText || `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
          const uploadTimestamp = new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });

          const submissionMetadata = {
            name: file.name,
            size: formattedSize,
            submittedAt: uploadTimestamp
          };

          // Sync database list
          setAssignmentsState(prev => prev.map(item => {
            if (item.id === selectedAssignment.id) {
              return {
                ...item,
                status: "Submitted",
                submittedFile: submissionMetadata
              };
            }
            return item;
          }));

          // Sync current modal reference
          setSelectedAssignment(prev => ({
            ...prev,
            status: "Submitted",
            submittedFile: submissionMetadata
          }));
        }
      }
      setProgress(currentProgress);
    }, 120);

    setUploadInterval(interval);
  };

  const removeSubmission = () => {
    if (uploadInterval) clearInterval(uploadInterval);
    setUploadInterval(null);
    
    setAssignmentsState(prev => prev.map(item => {
      if (item.id === selectedAssignment.id) {
        return {
          ...item,
          status: "Pending",
          submittedFile: null
        };
      }
      return item;
    }));

    setSelectedAssignment(prev => ({
      ...prev,
      status: "Pending",
      submittedFile: null
    }));

    setFile(null);
    setSuccess(false);
    setProgress(0);
    setError(null);
  };

  const getStatusBadge = (status, grade) => {
    switch (status) {
      case 'Submitted':
        return <Badge variant="info">Submitted</Badge>;
      case 'Graded':
        return <Badge variant="success">Graded {grade && `(${grade})`}</Badge>;
      case 'Revision Requested':
        return <Badge variant="danger">Revision Requested</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const selectedDueMeta = selectedAssignment ? getDueMeta(selectedAssignment) : null;
  const selectedDueLabel = (() => {
    if (!selectedDueMeta?.dueAt) return 'TBD';
    if (selectedDueMeta.state === 'expired') return 'Past due';
    const minutes = Math.ceil(selectedDueMeta.remainingMs / (60 * 1000));
    if (minutes <= 60) return `Due in ${minutes} min`;
    return formatCountdownParts(selectedDueMeta.remainingMs);
  })();

  return (
    <div className="space-y-8 animate-in text-left relative min-h-screen pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="bg-premium-accent/10 text-premium-accent text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-premium-accent/15">
            Syllabus Tasks
          </span>
          <h1 className="text-3xl font-black text-white leading-tight tracking-tight mt-1">Assignments Desk</h1>
          <p className="text-xs text-slate-400 font-bold">
            Submit underwriting case models, creative deal structures, and audit local valuation metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => alert("Downloading Syllabus Evaluation Rubric (PDF)...")}
            className="h-11 text-xs font-black uppercase tracking-widest bg-[#0b0b0d] border border-premium-border text-slate-500 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2 text-premium-accent" /> Download Rubric
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Assignment Rows */}
        <div className="lg:col-span-2 space-y-6">
          {assignmentsState.map((assignment, index) => {
            const isGraded = assignment.status === 'Graded';
            const isSubmitted = assignment.status === 'Submitted';
            const dueMeta = getDueMeta(assignment);
            const dueLabel = (() => {
              if (!dueMeta.dueAt) return 'Due: TBD';
              if (dueMeta.state === 'expired') return 'Deadline passed';
              const minutes = Math.ceil(dueMeta.remainingMs / (60 * 1000));
              if (minutes <= 60) return `Due in ${minutes} min`;
              return `Due in ${formatCountdownParts(dueMeta.remainingMs)}`;
            })();
            
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="group border border-premium-border bg-[#0b0b0d] p-6 shadow-sm hover:shadow-[0_12px_45px_rgba(15,23,42,0.04)] hover:border-premium-accent/20 transition-all duration-300 rounded-3xl">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="shrink-0 self-start">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${
                        isGraded 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : assignment.status === 'Revision Requested'
                          ? 'bg-red-500/100/10 border-red-500/20 text-red-500 animate-pulse-slow'
                          : isSubmitted
                          ? 'bg-[#0A66C2]/10 border-[#0A66C2]/20 text-premium-accent'
                          : 'bg-amber-500/100/10 border-amber-500/20/60 text-amber-500'
                      }`}>
                        <FileText className="w-7 h-7" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-left space-y-4">
                      {/* Card Header Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <h3 className="text-lg font-black text-white group-hover:text-premium-accent transition-colors leading-snug">
                            {assignment.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-bold tracking-wide">{assignment.course}</p>
                        </div>
                        <div className="shrink-0 self-start sm:self-center">
                          {getStatusBadge(assignment.status, assignment.grade)}
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-premium-text text-xs leading-relaxed font-medium">
                        {assignment.description}
                      </p>

                      {/* Submitted File Status Details */}
                      {assignment.submittedFile && (
                        <div className="bg-[#0f0f12] border border-[#1a1a1c] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#0b0b0d] border border-[#1e1e22] rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                              <FileText className="w-5 h-5 text-premium-accent" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black text-white max-w-[240px] truncate">{assignment.submittedFile.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">Uploaded {assignment.submittedFile.submittedAt} • {assignment.submittedFile.size}</p>
                            </div>
                          </div>
                          
                          {assignment.submittedFile.feedback && (
                            <div className="flex items-start gap-2 bg-amber-500/100/8 border border-amber-500/20/50 p-2.5 rounded-xl text-left w-full sm:w-auto sm:max-w-xs shrink-0">
                              <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-[10px] text-amber-800 leading-normal font-semibold">
                                <strong className="font-extrabold block">Tutor Comments:</strong>
                                {assignment.submittedFile.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Footer Meta & Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1a1a1c]">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                            <Calendar className={`w-4 h-4 ${
                              !dueMeta.dueAt
                                ? 'text-slate-400'
                                : dueMeta.state === 'expired'
                                  ? 'text-red-500'
                                  : dueMeta.tone === 'critical'
                                    ? 'text-amber-600'
                                    : 'text-premium-accent'
                            }`} />
                            <span className={`flex items-center gap-2 ${
                              !dueMeta.dueAt
                                ? 'text-slate-400'
                                : dueMeta.state === 'expired'
                                  ? 'text-red-500'
                                  : dueMeta.tone === 'critical'
                                    ? 'text-amber-400'
                                    : 'text-slate-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                !dueMeta.dueAt
                                  ? 'bg-slate-300'
                                  : dueMeta.state === 'expired'
                                    ? 'bg-red-500/100 animate-pulse'
                                    : dueMeta.tone === 'critical'
                                      ? 'bg-amber-500/100 animate-ping'
                                      : 'bg-premium-accent/70 animate-pulse'
                              }`} />
                              {dueLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                            <AlertCircle className="w-4 h-4 text-premium-accent" />
                            <span>Level: {assignment.difficulty}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                          {assignment.status === 'Pending' || assignment.status === 'Revision Requested' ? (
                            <Button 
                              variant="primary" 
                              size="sm" 
                              onClick={() => openUploadModal(assignment)}
                              className="text-[10px] uppercase tracking-wider font-black h-10 px-4 shadow-sm cursor-pointer"
                            >
                              Upload File
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openUploadModal(assignment)}
                              className="text-[10px] uppercase tracking-wider font-black h-10 px-4 border border-premium-border bg-[#0b0b0d] text-slate-500 hover:bg-[#0f0f12] shadow-sm cursor-pointer"
                            >
                              Review File
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Statistics */}
        <div className="space-y-6">
          <GlassCard className="border border-premium-border bg-[#0b0b0d] p-6 shadow-sm rounded-3xl">
            <h3 className="text-lg font-black text-white mb-6">Performance Records</h3>
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-emerald-400 w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Approval Rate</span>
                </div>
                <span className="text-sm font-black text-white">92% Passing</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="text-premium-accent w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Mentor Comments</span>
                </div>
                <span className="text-sm font-black text-white">5 Submissions</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/100/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Weekly Workload</span>
                </div>
                <span className="text-sm font-black text-white">5.6h / week</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => alert("Downloading Full Grade Summary Record Sheets...")}
              className="w-full mt-8 text-xs font-black uppercase tracking-widest h-11 bg-[#0b0b0d] border border-premium-border text-slate-500 hover:bg-[#0f0f12] shadow-sm cursor-pointer"
            >
              Download Grade Sheets
            </Button>
          </GlassCard>

          <GlassCard className="bg-gradient-premium border-none relative overflow-hidden flex flex-col justify-between h-48 shadow-lg p-6 rounded-3xl">
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#0b0b0d]/10 rounded-full blur-3xl"></div>
             <div className="relative z-10 space-y-2 text-left">
                <h3 className="text-base font-black text-white">Need Deal Help?</h3>
                <p className="text-white/80 text-xs leading-relaxed font-bold">Schedule a private deal audit with Robert to review your local commercial underwriting sheet.</p>
             </div>
             <Button 
               onClick={() => alert("Booking System: Calendar sync opened in new window!")}
               className="w-full bg-[#0b0b0d] text-[#1E88E5] hover:bg-[#0b0b0d]/95 text-xs font-black uppercase tracking-widest h-11 shadow-sm mt-4 cursor-pointer"
             >
               Book Private Session
             </Button>
          </GlassCard>
        </div>
      </div>

      {/* Premium Upload Modal Overlay */}
      <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b0b0d] border border-[#1a1a1c] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative p-8 flex flex-col gap-6"
            >
              {/* Premium Glow decor */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-premium-accent/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Button */}
              <button 
                onClick={closeUploadModal}
                disabled={uploading}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-extrabold text-lg cursor-pointer active:scale-90 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ✕
              </button>

              {/* Header Info */}
              <div className="text-left space-y-1.5 pr-8">
                <span className="text-[9px] font-black text-premium-accent uppercase tracking-widest block">
                  {selectedAssignment.course}
                </span>
                <h2 className="text-xl font-black text-white leading-tight">{selectedAssignment.title}</h2>
                <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 pt-1">
                  <Clock className={`w-3.5 h-3.5 ${
                    selectedDueMeta?.state === 'expired'
                      ? 'text-red-500'
                      : selectedDueMeta?.tone === 'critical'
                        ? 'text-amber-600'
                        : 'text-premium-accent'
                  }`} />
                  <span className={`flex items-center gap-2 ${
                    selectedDueMeta?.state === 'expired'
                      ? 'text-red-500'
                      : selectedDueMeta?.tone === 'critical'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      selectedDueMeta?.state === 'expired'
                        ? 'bg-red-500/100 animate-pulse'
                        : selectedDueMeta?.tone === 'critical'
                          ? 'bg-amber-500/100 animate-ping'
                          : 'bg-premium-accent/70 animate-pulse'
                    }`} />
                    Due {formatLocalDateTime(selectedDueMeta?.dueAt, { withDate: true })} • {selectedDueLabel} • Format: {selectedAssignment.acceptedFormats}
                  </span>
                </p>
              </div>

              {/* Tutor Comments Area if present */}
              {selectedAssignment.submittedFile && selectedAssignment.submittedFile.feedback && (
                <div className="bg-amber-500/100/10 border border-amber-500/20 rounded-2xl p-4 text-left flex gap-3">
                  <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-amber-800">Tutor Feedback Comments</p>
                    <p className="text-xs text-amber-400 font-semibold leading-relaxed">{selectedAssignment.submittedFile.feedback}</p>
                  </div>
                </div>
              )}

              {/* Dropzone / Upload Action Desk */}
              <div className="w-full text-center">
                {/* 1. Initial State: No file chosen */}
                {!file && !uploading && !success && (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      dragActive 
                        ? 'border-premium-accent bg-premium-accent/5 shadow-inner' 
                        : 'border-[#1e1e22] bg-[#0f0f12]/50 hover:bg-[#0f0f12] hover:border-premium-accent/50'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept=".pdf,.docx,.xlsx,.zip"
                      className="hidden" 
                    />
                    
                    <div className="w-14 h-14 bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-2xl flex items-center justify-center mb-4 text-premium-accent shadow-sm group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-black text-white">Drag and drop your solution file</p>
                      <p className="text-[10px] text-slate-400 font-bold">or click to browse local files</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#1e1e22]/50 w-full">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Maximum file size: 15MB • PDF, DOCX, XLSX, ZIP</p>
                    </div>
                  </div>
                )}

                {/* 2. File Selected (But Not Uploaded) */}
                {file && !uploading && !success && !error && (
                  <div className="space-y-5">
                    <div className="bg-[#0f0f12] border border-[#1a1a1c] rounded-2xl p-5 flex items-center justify-between gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0b0b0d] border border-[#1e1e22] rounded-xl flex items-center justify-center text-slate-500">
                          <FileText className="w-5.5 h-5.5 text-premium-accent" />
                        </div>
                        <div className="text-left max-w-[260px]">
                          <p className="text-xs font-black text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            {file.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : file.sizeText}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setFile(null)}
                        className="p-1.5 hover:bg-[#16161a] rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* Simulate Error Toggle */}
                    <div className="flex items-center justify-between bg-[#0f0f12] border border-[#1a1a1c] px-4 py-3.5 rounded-2xl text-left">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Simulate Upload Failure</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={simulateError} 
                          onChange={(e) => setSimulateError(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-[#16161a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#0b0b0d] after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-premium-accent"></div>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setFile(null)}
                        className="flex-1 text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl cursor-pointer"
                      >
                        Select Another
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={startUpload}
                        className="flex-1 text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl cursor-pointer"
                      >
                        Submit Assignment
                      </Button>
                    </div>
                  </div>
                )}

                {/* 3. Uploading Progress */}
                {uploading && (
                  <div className="bg-[#0f0f12] border border-[#1a1a1c] rounded-2xl p-6 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <RefreshCw className="w-4 h-4 text-premium-accent animate-spin" />
                        <span className="text-xs font-black text-white uppercase tracking-wider">Encrypting & Uploading...</span>
                      </div>
                      <span className="text-xs font-black text-premium-accent">{progress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[#16161a] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-premium rounded-full"
                      />
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold leading-normal">
                      Submitting encrypted case packet to BG Review boards. Do not close this drawer.
                    </p>

                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (uploadInterval) clearInterval(uploadInterval);
                        setUploadInterval(null);
                        setUploading(false);
                        setProgress(0);
                      }}
                      className="w-full text-[10px] uppercase font-black tracking-wider bg-[#0b0b0d] h-10 rounded-xl cursor-pointer"
                    >
                      Cancel Submission
                    </Button>
                  </div>
                )}

                {/* 4. Upload Error Card */}
                {error && (
                  <div className="space-y-4">
                    <div className="bg-red-500/100/10 border border-red-500/20 rounded-2xl p-5 text-left flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-black text-red-800 uppercase tracking-wide">Submission Blocked</p>
                        <p className="text-xs text-red-700 font-semibold leading-relaxed">{error}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => { setError(null); setFile(null); }}
                        className="flex-1 text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl cursor-pointer"
                      >
                        Reset File
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={startUpload}
                        className="flex-1 text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl cursor-pointer"
                      >
                        Retry Upload
                      </Button>
                    </div>
                  </div>
                )}

                {/* 5. Upload Success / Already Submitted Card */}
                {success && !uploading && !error && (
                  <div className="space-y-5">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-left flex gap-4">
                      <div className="w-10 h-10 bg-green-100/50 border border-green-200 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                        <Check className="w-5 h-5 stroke-[3px]" />
                      </div>
                      <div className="space-y-1 text-left flex-1 min-w-0">
                        <p className="text-xs font-black text-green-800 uppercase tracking-wider">File Uploaded Successfully</p>
                        <p className="text-xs font-black text-white truncate">{file?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {file?.sizeText || (file?.size && `${(file.size / (1024 * 1024)).toFixed(2)} MB`)} • Submitted {file?.submittedAt || selectedAssignment.submittedFile?.submittedAt}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#0f0f12] border border-[#1a1a1c] rounded-2xl p-4 flex gap-3 text-left">
                      <CheckCircle className="w-4.5 h-4.5 text-premium-accent shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-black text-white uppercase tracking-wider">Syllabus Status: Submitted</p>
                        <p className="text-[10px] text-slate-400 font-bold leading-normal">
                          Your code models have been submitted. Grading reviews take up to 24-48 business hours.
                        </p>
                      </div>
                    </div>

                    {selectedAssignment.status !== 'Graded' ? (
                      <div className="flex gap-3">
                        <Button 
                          variant="danger" 
                          onClick={removeSubmission}
                          className="flex-1 text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove File
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => { setSuccess(false); setFile(null); triggerFileSelect(); }}
                          className="flex-1 text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl cursor-pointer"
                        >
                          Replace File
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={closeUploadModal}
                        className="w-full text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl cursor-pointer"
                      >
                        Close Desk View
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assignments;
