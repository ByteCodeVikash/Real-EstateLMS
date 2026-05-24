import React, { useState } from 'react';
import { Users, UserPlus, UserCheck, ShieldAlert, Award, Search, Mail, Trash2 } from 'lucide-react';
import { AdminTable, AdminDrawer } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

// Mock students data
const initialStudents = [
  { id: 1, name: "Cody Fisher", email: "cody.f@realestate.com", registered: "2026-01-12", courses: 3, completion: "92%", status: "Active" },
  { id: 2, name: "Albert Flores", email: "albert.flores@century21.com", registered: "2026-02-15", courses: 1, completion: "45%", status: "Active" },
  { id: 3, name: "Kristin Watson", email: "kristin.w@watsongroup.org", registered: "2025-11-20", courses: 4, completion: "100%", status: "Graduated" },
  { id: 4, name: "Dianne Russell", email: "dianne.r@gmail.com", registered: "2026-03-01", courses: 2, completion: "75%", status: "Active" },
  { id: 5, name: "Savannah Nguyen", email: "savannah@nguyenrealty.co", registered: "2026-04-10", courses: 2, completion: "12%", status: "Suspended" },
  { id: 6, name: "Guy Hawkins", email: "guy.hawkins@outlook.com", registered: "2026-01-05", courses: 5, completion: "88%", status: "Active" },
  { id: 7, name: "Eleanor Pena", email: "eleanor.pena@yahoo.com", registered: "2026-02-28", courses: 1, completion: "95%", status: "Active" },
  { id: 8, name: "Ronald Richards", email: "ronald.r@richardsprops.com", registered: "2025-12-15", courses: 3, completion: "60%", status: "Suspended" },
];

export default function AdminStudents() {
  const [students, setStudents] = useState(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', status: 'Active', completion: '0%', courses: 1 });

  const handleStatusToggle = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === "Active" ? "Suspended" : "Active";
        alert(`Student "${s.name}" account status updated to ${nextStatus}!`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      id: students.length + 1,
      name: formState.name,
      email: formState.email,
      registered: new Date().toISOString().split('T')[0],
      courses: Number(formState.courses),
      completion: formState.completion || "0%",
      status: formState.status
    };
    setStudents([newStudent, ...students]);
    setDrawerOpen(false);
    setFormState({ name: '', email: '', status: 'Active', completion: '0%', courses: 1 });
  };

  const studentColumns = [
    {
      header: "Student Profile",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-premium/10 flex items-center justify-center font-black text-premium-accent border border-premium-border/40">
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
      header: "Registered",
      accessor: "registered",
      cellClassName: "text-slate-400"
    },
    {
      header: "Enrolled Courses",
      accessor: "courses",
      render: (row) => (
        <span className="font-extrabold text-slate-700 dark:text-slate-300">
          {row.courses} {row.courses === 1 ? 'Course' : 'Courses'}
        </span>
      )
    },
    {
      header: "Completion Rate",
      accessor: "completion",
      render: (row) => (
        <div className="flex items-center gap-2 max-w-[120px]">
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-premium rounded-full" 
              style={{ width: row.completion }}
            />
          </div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 w-8 text-right shrink-0">{row.completion}</span>
        </div>
      )
    },
    {
      header: "Account Status",
      accessor: "status",
      render: (row) => {
        const styles = {
          Active: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
          Graduated: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-900",
          Suspended: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[row.status] || ''}`}>
            {row.status}
          </span>
        );
      }
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
              setSelectedStudent(row);
              setFormState({ name: row.name, email: row.email, status: row.status, completion: row.completion, courses: row.courses });
              setDrawerOpen(true);
            }}
          >
            Edit
          </Button>
          <Button 
            variant={row.status === "Suspended" ? "secondary" : "danger"} 
            size="sm" 
            className="h-8 px-2 text-[10px] font-black py-0"
            onClick={() => handleStatusToggle(row.id)}
          >
            {row.status === "Suspended" ? "Activate" : "Suspend"}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Students Management</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Audit enrolled real estate developers, student status, course progress, and grading portfolios.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setSelectedStudent(null); setDrawerOpen(true); }}>
          <UserPlus className="w-4 h-4 mr-2" /> Add Student
        </Button>
      </div>

      {/* Mini banner cards for metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-premium-accent">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{students.length} Students</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Learning</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{students.filter(s=>s.status === "Active").length} Students</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-premium-violet">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Graduated Alumni</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{students.filter(s=>s.status === "Graduated").length} Alumni</p>
          </div>
        </div>
      </div>

      {/* Main Student Registry Table */}
      <AdminTable
        title="Student Register"
        subtitle="Platform registration details, metrics, and permissions control"
        columns={studentColumns}
        data={students}
        searchPlaceholder="Search by name, email, company..."
        filterOptions={{
          field: "status",
          label: "Status",
          options: [
            { value: "Active", label: "Active" },
            { value: "Graduated", label: "Graduated" },
            { value: "Suspended", label: "Suspended" }
          ]
        }}
      />

      {/* Edit/Create Student Drawer */}
      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedStudent ? "Edit Student Details" : "Register Student"}
      >
        <form onSubmit={selectedStudent ? (e) => {
          e.preventDefault();
          setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, name: formState.name, email: formState.email, status: formState.status, completion: formState.completion, courses: Number(formState.courses) } : s));
          setDrawerOpen(false);
          alert("Student record saved successfully!");
        } : handleCreateStudent} className="space-y-5">
          
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

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="john@doe.com"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Enrolled Courses</label>
              <input
                type="number"
                min="0"
                value={formState.courses}
                onChange={(e) => setFormState({ ...formState, courses: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Completion Rate (%)</label>
              <input
                type="text"
                placeholder="75%"
                value={formState.completion}
                onChange={(e) => setFormState({ ...formState, completion: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Account Status</label>
            <select
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Graduated">Graduated</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Student Record
            </Button>
          </div>
        </form>
      </AdminDrawer>

    </div>
  );
}
