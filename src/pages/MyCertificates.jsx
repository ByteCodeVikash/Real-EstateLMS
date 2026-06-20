import React, { useState, useEffect } from 'react';
import { Award, Download, Calendar, BookOpen, Hash, RefreshCw, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────
   Certificate HTML template rendered off-screen
   then captured via window.print() trick or
   a lightweight canvas-based approach.
   We use an iframe-based print strategy so no
   external PDF library is needed.
───────────────────────────────────────────── */
function buildCertificateHTML(cert, userName) {
  const issueDate = new Date(cert.issued_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Certificate – ${cert.course_title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:wght@700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', sans-serif;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 40px;
  }
  .cert {
    width: 900px; height: 636px;
    background: linear-gradient(135deg, #0a0a0f 0%, #0f1220 50%, #0a0a0f 100%);
    border: 8px solid #D4AF37;
    border-radius: 16px;
    padding: 48px 64px;
    position: relative;
    overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between;
    box-shadow: 0 0 60px rgba(212,175,55,0.18);
  }
  .corner {
    position: absolute; width: 120px; height: 120px;
    border: 3px solid rgba(212,175,55,0.25);
    border-radius: 4px;
  }
  .corner.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
  .corner.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
  .corner.bl { bottom: 12px; left: 12px; border-right: none; border-top: none; }
  .corner.br { bottom: 12px; right: 12px; border-left: none; border-top: none; }
  .watermark {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 180px; font-weight: 900;
    color: rgba(212,175,55,0.03);
    font-family: 'Playfair Display', serif;
    white-space: nowrap; pointer-events: none; user-select: none;
  }
  .header { text-align: center; }
  .academy-name {
    font-size: 11px; font-weight: 700; letter-spacing: 0.35em;
    color: #D4AF37; text-transform: uppercase; margin-bottom: 4px;
  }
  .seal {
    width: 52px; height: 52px; margin: 12px auto;
    background: linear-gradient(135deg, #D4AF37, #F5D76E);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 20px rgba(212,175,55,0.4);
  }
  .seal svg { width: 28px; height: 28px; fill: #0a0a0f; }
  .cert-of { font-size: 12px; color: #94a3b8; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 2px; }
  .cert-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 900;
    color: #fff; letter-spacing: 0.02em;
    text-shadow: 0 0 30px rgba(212,175,55,0.2);
  }
  .body { text-align: center; }
  .presented-to { font-size: 12px; color: #64748b; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
  .student-name {
    font-family: 'Playfair Display', serif;
    font-size: 38px; font-weight: 700;
    color: #D4AF37;
    border-bottom: 2px solid rgba(212,175,55,0.3);
    display: inline-block; padding-bottom: 8px; margin-bottom: 14px;
  }
  .has-completed { font-size: 12px; color: #94a3b8; margin-bottom: 6px; letter-spacing: 0.05em; }
  .course-name {
    font-size: 20px; font-weight: 900;
    color: #fff; letter-spacing: 0.03em;
  }
  .footer {
    display: flex; justify-content: space-between; align-items: flex-end;
    border-top: 1px solid rgba(212,175,55,0.15); padding-top: 18px;
  }
  .footer-block { font-size: 10px; color: #64748b; line-height: 1.7; }
  .footer-block strong { color: #94a3b8; font-size: 11px; display: block; margin-bottom: 2px; }
  .footer-block .value { color: #d1d5db; font-weight: 600; }
  .signature { text-align: right; }
  .signature .sig-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700; color: #fff;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 4px; margin-bottom: 4px;
  }
  .signature .sig-title { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; }
  @media print {
    body { padding: 0; background: #fff; }
    .cert { box-shadow: none; }
  }
</style>
</head>
<body>
<div class="cert">
  <div class="corner tl"></div>
  <div class="corner tr"></div>
  <div class="corner bl"></div>
  <div class="corner br"></div>
  <div class="watermark">BG</div>

  <div class="header">
    <div class="academy-name">BG Realty Training Academy</div>
    <div class="seal">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
    </div>
    <div class="cert-of">This is to certify that</div>
    <div class="cert-title">Certificate of Completion</div>
  </div>

  <div class="body">
    <div class="presented-to">Is Proudly Presented To</div>
    <div class="student-name">${userName || 'Graduate'}</div>
    <div class="has-completed">Has successfully completed all modules and requirements for the course</div>
    <div class="course-name">${cert.course_title}</div>
  </div>

  <div class="footer">
    <div class="footer-block">
      <strong>Issue Date</strong>
      <span class="value">${issueDate}</span>
    </div>
    <div class="footer-block" style="text-align:center;">
      <strong>Certificate ID</strong>
      <span class="value" style="font-family:monospace;">${cert.certificate_number}</span>
    </div>
    <div class="footer-block signature">
      <div class="sig-name">Robert Sterling</div>
      <div class="sig-title">Academy Principal · Authorized Signature</div>
    </div>
  </div>
</div>
</body>
</html>`;
}

function downloadCertificate(cert, userName) {
  const html = buildCertificateHTML(cert, userName);
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-10000px;left:-10000px;width:1100px;height:750px;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  // Wait for fonts to load then print
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } finally {
      setTimeout(() => document.body.removeChild(iframe), 2000);
    }
  }, 1200);
}

/* ─── Empty State ─── */
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-28 flex flex-col items-center justify-center text-center bg-[#0b0b0d] rounded-3xl border border-premium-border"
  >
    <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
      <Award className="w-9 h-9 text-amber-500" />
    </div>
    <h3 className="text-xl font-black text-white mb-2">No Certificates Yet</h3>
    <p className="text-xs text-slate-400 font-bold max-w-sm leading-relaxed">
      Complete 100% of a course to earn your official BG Realty Academy Certificate of Completion.
    </p>
  </motion.div>
);

/* ─── Certificate Card ─── */
const CertCard = ({ cert, userName, index }) => {
  const [downloading, setDownloading] = useState(false);

  const issueDate = new Date(cert.issued_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleDownload = () => {
    setDownloading(true);
    downloadCertificate(cert, userName);
    setTimeout(() => setDownloading(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
      className="group relative"
    >
      {/* Gold glow on hover */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-amber-500/20 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <div className="relative bg-[#0b0b0d] border border-premium-border rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] group-hover:border-amber-500/30 group-hover:-translate-y-1 transition-all duration-300">

        {/* Certificate Banner */}
        <div className="relative h-36 bg-gradient-to-br from-[#0f1220] via-[#0a0e1a] to-[#0f0f12] overflow-hidden flex items-center justify-center border-b border-[#1a1a1c]">
          {/* Decorative elements */}
          <div className="absolute top-3 left-3 w-16 h-16 border border-amber-500/10 rounded-sm" style={{ borderRight: 'none', borderBottom: 'none' }} />
          <div className="absolute bottom-3 right-3 w-16 h-16 border border-amber-500/10 rounded-sm" style={{ borderLeft: 'none', borderTop: 'none' }} />
          <div className="absolute inset-0 flex items-center justify-center text-[100px] font-black text-amber-500/5 select-none pointer-events-none font-serif">BG</div>

          {/* Seal */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-7 h-7 text-slate-950 fill-current" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400/80">Certificate of Completion</span>
          </div>

          {/* Verified badge */}
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          {/* Course Title */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-premium-accent mb-1">BG Realty Training Academy</p>
            <h3 className="text-base font-black text-white leading-snug">{cert.course_title}</h3>
            {cert.mentor_name && (
              <p className="text-[11px] text-slate-400 font-bold mt-1">by {cert.mentor_name}</p>
            )}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f0f12]/80 border border-[#1a1a1c] rounded-xl p-3 space-y-0.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3 h-3 text-premium-accent" />
                <span className="text-[9px] font-black uppercase tracking-wider">Issued</span>
              </div>
              <p className="text-[11px] font-black text-white">{issueDate}</p>
            </div>
            <div className="bg-[#0f0f12]/80 border border-[#1a1a1c] rounded-xl p-3 space-y-0.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Hash className="w-3 h-3 text-premium-accent" />
                <span className="text-[9px] font-black uppercase tracking-wider">Cert ID</span>
              </div>
              <p className="text-[11px] font-black text-white font-mono truncate" title={cert.certificate_number}>
                {cert.certificate_number}
              </p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:from-amber-400 hover:to-yellow-300 active:scale-[0.98]"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Certificate
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Page ─── */
export default function MyCertificates() {
  const { token, API_BASE_URL, user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCertificates = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setCertificates(data.data || []);
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

  const userName = user?.full_name || 'Graduate';

  return (
    <div className="space-y-8 text-left min-h-screen pb-12">

      {/* Header */}
      <div className="bg-[#0b0b0d] p-8 rounded-3xl border border-premium-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-500/15">
                Credentials Vault
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight mt-1">My Certificates</h1>
            <p className="text-xs text-slate-400 font-bold tracking-wide">
              Download your official BG Realty Training Academy credentials
            </p>
          </div>

          <button
            onClick={() => fetchCertificates(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-premium-border text-slate-400 hover:text-white hover:border-slate-600 text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 bg-transparent"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Row */}
      {!loading && certificates.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: Award, label: 'Total Earned', value: certificates.length, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { icon: CheckCircle, label: 'Verified', value: certificates.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { icon: BookOpen, label: 'Courses Completed', value: certificates.length, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[#0b0b0d] border ${stat.border} rounded-2xl p-5 flex items-center gap-4`}
            >
              <div className={`w-11 h-11 ${stat.bg} border ${stat.border} rounded-xl flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#0b0b0d] border border-premium-border rounded-3xl overflow-hidden">
              <div className="h-36 bg-[#111114]" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-[#111114] rounded-lg w-3/4" />
                <div className="h-3 bg-[#111114] rounded-lg w-1/2" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-14 bg-[#111114] rounded-xl" />
                  <div className="h-14 bg-[#111114] rounded-xl" />
                </div>
                <div className="h-12 bg-[#111114] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-[#0b0b0d] rounded-3xl border border-red-500/20">
          <p className="text-sm font-black text-red-400 mb-4">{error}</p>
          <Button variant="outline" onClick={() => fetchCertificates()}>
            Try Again
          </Button>
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} userName={userName} index={i} />
          ))}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-amber-500/5 via-amber-500/3 to-transparent border border-amber-500/15 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          <Award className="w-4.5 h-4.5 text-amber-500" />
        </div>
        <div>
          <p className="text-xs font-black text-white mb-1">How to Earn Certificates</p>
          <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
            Complete 100% of all course lectures for any enrolled course. Your certificate is automatically generated and verified — download it anytime in PDF-print format.
          </p>
        </div>
      </div>
    </div>
  );
}
