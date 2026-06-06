import React, { useState } from 'react';
import { Award, ShieldCheck, Plus, CheckCircle, Download, FileText, Settings, RefreshCw } from 'lucide-react';
import { AdminTable, AdminDrawer } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

const initialCertificates = [
  { id: 1, student: "Kristin Watson", course: "Luxury Flipping Masterclass", serial: "CERT-9201-BJ", date: "2026-05-15", status: "Verified" },
  { id: 2, student: "Guy Hawkins", course: "Commercial Underwriting & Modeling", serial: "CERT-8491-BJ", date: "2026-05-18", status: "Verified" },
  { id: 3, student: "Cody Fisher", course: "High-Ticket Real Estate Negotiation", serial: "CERT-7582-BJ", date: "2026-05-22", status: "Pending approval" },
];

export default function AdminCertificates() {
  const [certs, setCerts] = useState(initialCertificates);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formState, setFormState] = useState({ student: '', course: 'Luxury Flipping Masterclass', serial: 'CERT-' + Math.floor(1000 + Math.random()*9000) + '-BJ' });
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [borderColor, setBorderColor] = useState('#2563eb');

  const handleIssueCert = (e) => {
    e.preventDefault();
    const newCert = {
      id: certs.length + 1,
      student: formState.student,
      course: formState.course,
      serial: formState.serial,
      date: new Date().toISOString().split('T')[0],
      status: "Verified"
    };
    setCerts([newCert, ...certs]);
    setDrawerOpen(false);
    setFormState({ student: '', course: 'Luxury Flipping Masterclass', serial: 'CERT-' + Math.floor(1000 + Math.random()*9000) + '-BJ' });
  };

  const handleVerify = (id) => {
    setCerts(prev => prev.map(c => {
      if (c.id === id) {
        alert(`Certificate "${c.serial}" verification approved!`);
        return { ...c, status: "Verified" };
      }
      return c;
    }));
  };

  const columns = [
    {
      header: "Credential ID",
      accessor: "serial",
      cellClassName: "font-mono font-black text-white text-white"
    },
    {
      header: "Awarded To",
      accessor: "student",
      render: (row) => (
        <div>
          <p className="font-bold text-white text-white leading-none">{row.student}</p>
        </div>
      )
    },
    {
      header: "Syllabus Program",
      accessor: "course",
      cellClassName: "text-slate-650 dark:text-slate-350"
    },
    {
      header: "Issue Date",
      accessor: "date",
      cellClassName: "text-slate-400"
    },
    {
      header: "Verification",
      accessor: "status",
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          row.status === "Verified"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
            : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status !== "Verified" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-[10px] font-black py-0"
              onClick={() => handleVerify(row.id)}
            >
              Verify & Approve
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-[10px] font-black py-0"
            onClick={() => alert(`Mock PDF download for "${row.serial}"...`)}
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white text-white tracking-tight uppercase">Certificates Designer</h1>
          <p className="text-xs font-semibold text-slate-400 text-slate-500 mt-1">Design academic credentials, approve completions, configure certificate template styles, and check verifications.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Issue Certificate
        </Button>
      </div>

      {/* Template Designer Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Template Controls */}
        <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card">
          <h3 className="text-base font-black text-white text-white tracking-tight uppercase mb-4">Template Designer</h3>
          
          <div className="space-y-4 text-xs font-semibold text-slate-500 text-slate-400">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Visual Preset Style</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-2.5 text-xs font-bold text-white text-white focus:outline-none"
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

            <div className="pt-4 border-t border-[#1a1a1c] dark:border-slate-850 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signature Verification</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Active</span>
            </div>
          </div>
        </div>

        {/* Certificate Preview Frame */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 flex flex-col items-center justify-center shadow-dark-card min-h-[300px]">
          <div 
            className="w-full max-w-lg aspect-[1.414/1] bg-[#0f0f12] bg-[#0f0f12] p-6 rounded-xl border-8 relative flex flex-col items-center justify-between text-center transition-all duration-300"
            style={{ borderColor: borderColor }}
          >
            {/* Template layout render */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <Award className="w-10 h-10 text-amber-500 animate-pulse" />
              <h4 className="text-base font-black text-white text-white tracking-wide uppercase mt-1">Certificate of Completion</h4>
              <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">BG REALTY TRAINING ACADEMY</p>
            </div>

            <div className="my-3">
              <p className="text-[10px] text-slate-400 font-semibold italic">This credential certifies that</p>
              <h3 className="text-lg font-black text-white text-white mt-1 uppercase tracking-tight">Johnathan Student</h3>
              <p className="text-[10px] text-slate-400 font-semibold max-w-xs mx-auto mt-2">has successfully finished and passed all required grading modules for the premium syllabus program</p>
              <h5 className="text-xs font-black text-premium-accent mt-1.5 uppercase">Luxury Flipping Masterclass</h5>
            </div>

            <div className="w-full flex items-center justify-between border-t border-[#1e1e22] border-[#1a1a1c] pt-3 text-[9px] font-bold text-slate-400">
              <div className="text-left">
                <p>Issued: <span className="text-slate-650 dark:text-slate-350">May 23, 2026</span></p>
                <p>Serial: <span className="text-slate-650 dark:text-slate-350 font-mono">CERT-PREVIEW-BJ</span></p>
              </div>
              <div className="text-right">
                <span className="italic font-serif text-white text-white text-xs">Sarah Jenkins</span>
                <p className="border-t border-slate-300 border-[#1e1e22] pt-0.5">Authorized Principal Mentor</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Issued Certificates registry */}
      <AdminTable
        title="Issued Credentials ledger"
        subtitle="Verification status, student completion logs, download audits"
        columns={columns}
        data={certs}
        searchPlaceholder="Search certificates..."
      />

      {/* Issue manual certificate drawer */}
      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Issue Credential Manual"
      >
        <form onSubmit={handleIssueCert} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Student Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Johnathan Doe"
              value={formState.student}
              onChange={(e) => setFormState({ ...formState, student: e.target.value })}
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Syllabus Program</label>
            <select
              value={formState.course}
              onChange={(e) => setFormState({ ...formState, course: e.target.value })}
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none"
            >
              <option value="Luxury Flipping Masterclass">Luxury Flipping Masterclass</option>
              <option value="Commercial Underwriting & Modeling">Commercial Underwriting & Modeling</option>
              <option value="High-Ticket Real Estate Negotiation">High-Ticket Real Estate Negotiation</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Credential Serial Key</label>
            <input
              type="text"
              required
              readOnly
              value={formState.serial}
              className="w-full bg-[#111114] bg-[#0f0f12] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-slate-450 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#1a1a1c] dark:border-slate-850 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Sign & Issue
            </Button>
          </div>
        </form>
      </AdminDrawer>

    </div>
  );
}
