import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Download, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { AdminTable, AdminDrawer } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

/* ─── Certificate preview banner ─── */
const CertPreview = ({ borderColor }) => (
  <div
    className="w-full max-w-lg aspect-[1.414/1] bg-[#0f0f12] p-6 rounded-xl border-8 relative flex flex-col items-center justify-between text-center transition-all duration-300 mx-auto"
    style={{ borderColor }}
  >
    <div className="flex flex-col items-center gap-2 mt-4">
      <Award className="w-10 h-10 text-amber-500 animate-pulse" />
      <h4 className="text-base font-black text-white tracking-wide uppercase mt-1">Certificate of Completion</h4>
      <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">BG REALTY TRAINING ACADEMY</p>
    </div>
    <div className="my-3">
      <p className="text-[10px] text-slate-400 font-semibold italic">This credential certifies that</p>
      <h3 className="text-lg font-black text-white mt-1 uppercase tracking-tight">Johnathan Student</h3>
      <p className="text-[10px] text-slate-400 font-semibold max-w-xs mx-auto mt-2">
        has successfully finished and passed all required grading modules for the premium syllabus program
      </p>
      <h5 className="text-xs font-black text-premium-accent mt-1.5 uppercase">Luxury Flipping Masterclass</h5>
    </div>
    <div className="w-full flex items-center justify-between border-t border-[#1e1e22] pt-3 text-[9px] font-bold text-slate-400">
      <div className="text-left">
        <p>Issued: <span className="text-slate-300">June 17, 2026</span></p>
        <p>Serial: <span className="text-slate-300 font-mono">CERT-PREVIEW</span></p>
      </div>
      <div className="text-right">
        <span className="italic font-serif text-white text-xs">Robert Sterling</span>
        <p className="border-t border-slate-700 pt-0.5">Authorized Principal</p>
      </div>
    </div>
  </div>
);

export default function AdminCertificates() {
  const { token, API_BASE_URL } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Template designer state (cosmetic)
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [borderColor, setBorderColor] = useState('#d97706');

  /* ── Fetch all certificates (admin) ── */
  const fetchCertificates = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setCerts(data.data || []);
      } else {
        setError(data.message || 'Failed to load certificates.');
      }
    } catch (e) {
      setError('Network error. Could not load certificates.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) fetchCertificates();
  }, [token, API_BASE_URL]);

  const formatDate = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const columns = [
    {
      header: 'Credential ID',
      accessor: 'certificate_number',
      cellClassName: 'font-mono font-black text-white text-xs'
    },
    {
      header: 'Awarded To',
      accessor: 'user_id',
      render: (row) => (
        <div>
          <p className="font-bold text-white text-xs leading-none">{row.student_name || `User #${row.user_id}`}</p>
          {row.student_email && (
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">{row.student_email}</p>
          )}
        </div>
      )
    },
    {
      header: 'Syllabus Program',
      accessor: 'course_title',
      cellClassName: 'text-slate-300 text-xs font-semibold'
    },
    {
      header: 'Issue Date',
      accessor: 'issued_at',
      render: (row) => (
        <span className="text-slate-400 text-xs">{formatDate(row.issued_at)}</span>
      )
    },
    {
      header: 'Verification',
      accessor: 'id',
      render: () => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          Verified
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'certificate_number',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-[10px] font-black py-0"
          onClick={() => alert(`Certificate ID: ${row.certificate_number}\nStudent: ${row.student_name || 'N/A'}\nCourse: ${row.course_title}\nIssued: ${formatDate(row.issued_at)}`)}
        >
          <Download className="w-3.5 h-3.5 mr-1" /> View
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Certificates Designer</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Design academic credentials, approve completions, configure certificate template styles, and check verifications.
          </p>
        </div>
        <button
          onClick={() => fetchCertificates(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-premium-border text-slate-400 hover:text-white hover:border-slate-600 text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 bg-transparent shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Template Designer Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Controls */}
        <div className="rounded-2xl border border-[#1a1a1c] bg-[#0b0b0d] p-6 shadow-dark-card">
          <h3 className="text-base font-black text-white tracking-tight uppercase mb-4">Template Designer</h3>
          <div className="space-y-4 text-xs font-semibold text-slate-400">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Visual Preset Style</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-[#111114] border border-[#1e1e22] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none"
              >
                <option value="classic">Classic Academy Gold</option>
                <option value="modern">Modern Professional Blue</option>
                <option value="minimalist">Minimalist Charcoal</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Highlight Border Accent</label>
              <div className="flex items-center gap-3 mt-1">
                {['#2563eb', '#7c3aed', '#d97706', '#0f172a'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBorderColor(c)}
                    className="h-8 w-8 rounded-full border-2 transition-all cursor-pointer"
                    style={{
                      backgroundColor: c,
                      borderColor: borderColor === c ? '#3b82f6' : 'transparent',
                      transform: borderColor === c ? 'scale(1.15)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[#1a1a1c] flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signature Verification</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Active</span>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1a1a1c] bg-[#0b0b0d] p-6 flex flex-col items-center justify-center shadow-dark-card min-h-[300px]">
          <CertPreview borderColor={borderColor} />
        </div>
      </div>

      {/* Issued Certificates Registry */}
      {loading ? (
        <div className="bg-[#0b0b0d] rounded-2xl border border-[#1a1a1c] p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-premium-accent animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Loading Certificates Registry...</p>
        </div>
      ) : error ? (
        <div className="bg-[#0b0b0d] rounded-2xl border border-red-500/20 p-12 flex flex-col items-center justify-center gap-3 text-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-sm font-black text-red-400">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchCertificates()}>Retry</Button>
        </div>
      ) : (
        <AdminTable
          title="Issued Credentials Ledger"
          subtitle={`${certs.length} verified credential${certs.length !== 1 ? 's' : ''} — verification status, student completion logs, download audits`}
          columns={columns}
          data={certs}
          searchPlaceholder="Search certificates..."
          emptyStateText="No certificates have been issued yet. Students earn certificates upon 100% course completion."
        />
      )}

    </div>
  );
}
