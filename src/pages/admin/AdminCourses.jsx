import React, { useState } from 'react';
import { BookOpen, Layers, Edit, Eye, Trash2, ShieldAlert, Plus, CheckCircle, FolderOpen } from 'lucide-react';
import { AdminTable, AdminDrawer } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

const initialCourses = [
  { id: 1, title: "Luxury Flipping Masterclass", instructor: "Sarah Jenkins", price: "$1,499", duration: "12 Weeks", modules: 18, status: "Published", rating: 4.9, students: 480 },
  { id: 2, title: "Commercial Underwriting & Modeling", instructor: "Alex Mercer", price: "$2,100", duration: "10 Weeks", modules: 15, status: "Published", rating: 4.8, students: 320 },
  { id: 3, title: "High-Ticket Real Estate Negotiation", instructor: "Sarah Jenkins", price: "$999", duration: "6 Weeks", modules: 10, status: "Published", rating: 5.0, students: 240 },
  { id: 4, title: "Multifamily Deal Syndicate Sourcing", instructor: "Alex Mercer", price: "$1,850", duration: "8 Weeks", modules: 12, status: "Draft", rating: 0.0, students: 0 },
  { id: 5, title: "Zoning Codes, Permits & Legal Structuring", instructor: "Michael Chang", price: "$1,200", duration: "14 Weeks", modules: 20, status: "Archived", rating: 4.6, students: 110 },
];

export default function AdminCourses() {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formState, setFormState] = useState({ title: '', instructor: 'Sarah Jenkins', price: '999', duration: '8 Weeks', modules: 10, status: 'Published' });

  const handleCreateCourse = (e) => {
    e.preventDefault();
    const newCourse = {
      id: courses.length + 1,
      title: formState.title,
      instructor: formState.instructor,
      price: `$${formState.price}`,
      duration: formState.duration,
      modules: Number(formState.modules),
      status: formState.status,
      rating: 0.0,
      students: 0
    };
    setCourses([...courses, newCourse]);
    setDrawerOpen(false);
    setFormState({ title: '', instructor: 'Sarah Jenkins', price: '999', duration: '8 Weeks', modules: 10, status: 'Published' });
  };

  const handleEditCourse = (e) => {
    e.preventDefault();
    setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { 
      ...c, 
      title: formState.title, 
      instructor: formState.instructor, 
      price: formState.price.startsWith('$') ? formState.price : `$${formState.price}`, 
      duration: formState.duration, 
      modules: Number(formState.modules), 
      status: formState.status 
    } : c));
    setDrawerOpen(false);
    alert("Course catalog updated successfully!");
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "Published" ? "Draft" : "Published";
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    alert(`Course status updated to ${nextStatus}!`);
  };

  const courseColumns = [
    {
      header: "Course Name",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center gap-3 max-w-[280px]">
          <div className="h-10 w-10 rounded-xl bg-gradient-violet/10 flex items-center justify-center text-premium-violet border border-premium-border/40 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-premium-heading dark:text-white truncate max-w-[220px]">{row.title}</p>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{row.duration}</span>
          </div>
        </div>
      )
    },
    {
      header: "Mentor",
      accessor: "instructor",
      cellClassName: "text-slate-650 dark:text-slate-350"
    },
    {
      header: "Price",
      accessor: "price",
      cellClassName: "font-black text-premium-heading dark:text-white"
    },
    {
      header: "Syllabus Size",
      accessor: "modules",
      render: (row) => (
        <span className="font-extrabold text-slate-600 dark:text-slate-400">
          {row.modules} Modules
        </span>
      )
    },
    {
      header: "Enrolled",
      accessor: "students",
      render: (row) => (
        <span className="font-black text-slate-700 dark:text-slate-300">
          {row.students} Students
        </span>
      )
    },
    {
      header: "Publishing Status",
      accessor: "status",
      render: (row) => {
        const styles = {
          Published: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
          Draft: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900",
          Archived: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[row.status] || ''}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: "Manage",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-[10px] font-black py-0"
            onClick={() => {
              setSelectedCourse(row);
              setFormState({ title: row.title, instructor: row.instructor, price: row.price.replace('$', ''), duration: row.duration, modules: row.modules, status: row.status });
              setDrawerOpen(true);
            }}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-[10px] font-black py-0"
            onClick={() => handleToggleStatus(row.id, row.status)}
          >
            {row.status === "Published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Courses Inventory</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Configure luxury flips modules, upload underwriting blueprints, assign mentors, and customize pricing gates.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setSelectedCourse(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Course
        </Button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-premium-violet">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Catalog</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{courses.length} Masterclasses</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Published Classes</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{courses.filter(c=>c.status === "Published").length} Live</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Drafts & Blueprints</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">{courses.filter(c=>c.status === "Draft").length} In-Dev</p>
          </div>
        </div>
      </div>

      {/* Main Course Table */}
      <AdminTable
        title="Course Management System"
        subtitle="Publishing channels, pricing structures, syllabus volume logs"
        columns={courseColumns}
        data={courses}
        searchPlaceholder="Filter classes..."
        filterOptions={{
          field: "status",
          label: "Status",
          options: [
            { value: "Published", label: "Published" },
            { value: "Draft", label: "Draft" },
            { value: "Archived", label: "Archived" }
          ]
        }}
      />

      {/* Slide-out Drawer */}
      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedCourse ? "Modify Masterclass" : "Publish Masterclass"}
      >
        <form onSubmit={selectedCourse ? handleEditCourse : handleCreateCourse} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Masterclass Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Commercial Syndication Secrets"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lead Mentor</label>
              <select
                value={formState.instructor}
                onChange={(e) => setFormState({ ...formState, instructor: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              >
                <option value="Sarah Jenkins">Sarah Jenkins (Broker)</option>
                <option value="Alex Mercer">Alex Mercer (Analyst)</option>
                <option value="Michael Chang">Michael Chang (Attorney)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Syllabus Scale (Modules)</label>
              <input
                type="number"
                min="1"
                value={formState.modules}
                onChange={(e) => setFormState({ ...formState, modules: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Duration Schedule</label>
              <input
                type="text"
                placeholder="e.g. 10 Weeks"
                value={formState.duration}
                onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tuition Fees ($)</label>
              <input
                type="number"
                min="0"
                placeholder="1499"
                value={formState.price}
                onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Catalog Status</label>
            <select
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            >
              <option value="Published">Published (Active)</option>
              <option value="Draft">Draft (In Development)</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Masterclass
            </Button>
          </div>
        </form>
      </AdminDrawer>

    </div>
  );
}
