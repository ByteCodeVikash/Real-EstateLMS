import React, { useState } from 'react';
import { GraduationCap, Award, Star, Mail, Edit, ShieldCheck, UserPlus, Phone } from 'lucide-react';
import { AdminTable, AdminDrawer } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

const initialInstructors = [
  { id: 1, name: "Sarah Jenkins", email: "sarah.j@bjreality.com", phone: "+1 (555) 019-2834", courses: 3, students: 720, rating: 4.9, status: "Active", bio: "Former principal broker at Vanguard Equities with 18+ years in luxury syndicates." },
  { id: 2, name: "Alex Mercer", email: "alex.mercer@bjreality.com", phone: "+1 (555) 014-9821", courses: 2, students: 320, rating: 4.8, status: "Active", bio: "Leading financial underwriter specializing in REIT spreadsheets and spreadsheet models." },
  { id: 3, name: "Michael Chang", email: "m.chang@bjreality.com", phone: "+1 (555) 018-8832", courses: 1, students: 110, rating: 4.6, status: "Active", bio: "Real estate transaction lawyer with expertise in commercial zoning laws and contracts." },
  { id: 4, name: "Elena Rostova", email: "elena.r@bjreality.com", phone: "+1 (555) 017-7612", courses: 0, students: 0, rating: 0.0, status: "Inactive", bio: "International luxury property scout with premium deals brokerage experience." }
];

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState(initialInstructors);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', bio: '', status: 'Active' });

  const handleCreateInstructor = (e) => {
    e.preventDefault();
    const newInstructor = {
      id: instructors.length + 1,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      courses: 0,
      students: 0,
      rating: 0.0,
      status: formState.status,
      bio: formState.bio
    };
    setInstructors([...instructors, newInstructor]);
    setDrawerOpen(false);
    setFormState({ name: '', email: '', phone: '', bio: '', status: 'Active' });
  };

  const handleEditInstructor = (e) => {
    e.preventDefault();
    setInstructors(prev => prev.map(inst => inst.id === selectedInstructor.id ? {
      ...inst,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      bio: formState.bio,
      status: formState.status
    } : inst));
    setDrawerOpen(false);
    alert("Instructor records updated successfully!");
  };

  const handleStatusToggle = (id) => {
    setInstructors(prev => prev.map(inst => {
      if (inst.id === id) {
        const nextStatus = inst.status === "Active" ? "Inactive" : "Active";
        alert(`Instructor status changed to ${nextStatus}!`);
        return { ...inst, status: nextStatus };
      }
      return inst;
    }));
  };

  const instructorColumns = [
    {
      header: "Lead Instructor",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-premium/10 flex items-center justify-center font-black text-premium-accent border border-premium-border/40 shrink-0">
            {row.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-premium-heading dark:text-white leading-none">{row.name}</p>
            <span className="text-[10px] text-slate-400 font-semibold">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Phone Contact",
      accessor: "phone",
      cellClassName: "text-slate-400"
    },
    {
      header: "Syllabus Distribution",
      accessor: "courses",
      render: (row) => (
        <span className="font-extrabold text-slate-700 dark:text-slate-350">
          {row.courses} {row.courses === 1 ? 'Class' : 'Classes'}
        </span>
      )
    },
    {
      header: "Rating Average",
      accessor: "rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="font-black text-slate-700 dark:text-slate-300 text-xs">
            {row.rating === 0 ? "N/A" : row.rating.toFixed(1)}
          </span>
        </div>
      )
    },
    {
      header: "Approval State",
      accessor: "status",
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          row.status === "Active"
            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
            : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-750"
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
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-[10px] font-black py-0"
            onClick={() => {
              setSelectedInstructor(row);
              setFormState({ name: row.name, email: row.email, phone: row.phone, bio: row.bio, status: row.status });
              setDrawerOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant={row.status === "Active" ? "danger" : "secondary"}
            size="sm"
            className="h-8 px-2 text-[10px] font-black py-0"
            onClick={() => handleStatusToggle(row.id)}
          >
            {row.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Upper Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Instructor Registry</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Manage broker licenses, mentor rating scores, profiles, and classroom access credentials.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setSelectedInstructor(null); setDrawerOpen(true); }}>
          <UserPlus className="w-4 h-4 mr-2" /> Onboard Mentor
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-premium-violet">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Faculty</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{instructors.filter(i=>i.status === "Active").length} Members</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Rating</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">4.8 / 5.0 Star</p>
          </div>
        </div>
      </div>

      {/* Instructor Listing */}
      <AdminTable
        title="Active Mentors & Advisors"
        subtitle="Academic directories, ratings summaries, profile status logs"
        columns={instructorColumns}
        data={instructors}
        searchPlaceholder="Filter mentors..."
        filterOptions={{
          field: "status",
          label: "Status",
          options: [
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" }
          ]
        }}
      />

      {/* Slide-out Drawer */}
      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedInstructor ? "Modify Profile" : "Register New Instructor"}
      >
        <form onSubmit={selectedInstructor ? handleEditInstructor : handleCreateInstructor} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Johnathan Doe"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
              <input
                type="email"
                required
                placeholder="mentor@bjreality.com"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Phone</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Faculty Bio & Experience</label>
            <textarea
              rows="4"
              placeholder="Provide summary of real estate investments, licensing, or commercial accomplishments..."
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none scrollbar-thin"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Account Access</label>
            <select
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            >
              <option value="Active">Active (Permitted)</option>
              <option value="Inactive">Inactive (Suspended)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Profile Details
            </Button>
          </div>
        </form>
      </AdminDrawer>

    </div>
  );
}
