import React, { useState } from 'react';
import { Video, Calendar, Eye, Play, X, Trash2, Plus, Clock, ExternalLink } from 'lucide-react';
import { AdminTable, AdminModal } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

const initialWebinars = [
  { id: 1, topic: "Multifamily Deal Underwriting & Excel Templates", instructor: "Alex Mercer", date: "2026-05-24", time: "18:00", link: "https://zoom.us/j/91283419", students: 145, status: "Upcoming" },
  { id: 2, topic: "Negotiating High-Ticket Commercial Leases", instructor: "Sarah Jenkins", date: "2026-05-23", time: "14:00", link: "https://zoom.us/j/84920491", students: 84, status: "Live" },
  { id: 3, topic: "Luxury Flipping: Sourcing Off-Market Deals", instructor: "Sarah Jenkins", date: "2026-05-20", time: "16:00", link: "https://zoom.us/j/32019842", students: 210, status: "Completed" },
  { id: 4, topic: "Permitting, Zoning, & Land Easements", instructor: "Michael Chang", date: "2026-05-29", time: "17:30", link: "https://zoom.us/j/75620931", students: 90, status: "Upcoming" }
];

export default function AdminLiveClasses() {
  const [webinars, setWebinars] = useState(initialWebinars);
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState({ topic: '', instructor: 'Sarah Jenkins', date: '', time: '', link: '' });

  const handleCreateWebinar = (e) => {
    e.preventDefault();
    const newWebinar = {
      id: webinars.length + 1,
      topic: formState.topic,
      instructor: formState.instructor,
      date: formState.date,
      time: formState.time,
      link: formState.link,
      students: 0,
      status: "Upcoming"
    };
    setWebinars([newWebinar, ...webinars]);
    setModalOpen(false);
    setFormState({ topic: '', instructor: 'Sarah Jenkins', date: '', time: '', link: '' });
  };

  const handleStartStream = (id) => {
    setWebinars(prev => prev.map(w => {
      if (w.id === id) {
        alert(`Broadcast stream activated for: "${w.topic}"! Zoom link pinged to enrolled students.`);
        return { ...w, status: "Live" };
      }
      return w;
    }));
  };

  const handleCompleteStream = (id) => {
    setWebinars(prev => prev.map(w => {
      if (w.id === id) {
        alert(`Broadcast for "${w.topic}" completed. Recording will process and save to Course modules.`);
        return { ...w, status: "Completed" };
      }
      return w;
    }));
  };

  const handleDeleteWebinar = (id) => {
    if (confirm("Are you sure you want to cancel and remove this scheduled broadcast?")) {
      setWebinars(prev => prev.filter(w => w.id !== id));
    }
  };

  const webinarColumns = [
    {
      header: "Webinar Details",
      accessor: "topic",
      render: (row) => (
        <div className="flex items-center gap-3 max-w-[280px]">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${
            row.status === "Live"
              ? "bg-red-50 text-red-500 border-red-200 animate-pulse"
              : "bg-blue-50 text-premium-accent border-blue-100"
          }`}>
            <Video className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-premium-heading dark:text-white truncate max-w-[220px]">{row.topic}</p>
            <span className="text-[10px] text-slate-400 font-semibold">{row.instructor}</span>
          </div>
        </div>
      )
    },
    {
      header: "Broadcast Schedule",
      accessor: "date",
      render: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {row.date}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-slate-400" /> {row.time}
          </span>
        </div>
      )
    },
    {
      header: "Classroom link",
      accessor: "link",
      render: (row) => (
        <a 
          href={row.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1 text-premium-accent hover:underline text-xs font-bold"
        >
          Zoom Room <ExternalLink className="w-3 h-3" />
        </a>
      )
    },
    {
      header: "Registered",
      accessor: "students",
      render: (row) => (
        <span className="font-black text-slate-700 dark:text-slate-300">
          {row.students} Students
        </span>
      )
    },
    {
      header: "Broadcast State",
      accessor: "status",
      render: (row) => {
        const styles = {
          Live: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900 animate-pulse",
          Upcoming: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
          Completed: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
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
          {row.status === "Upcoming" && (
            <Button 
              variant="primary" 
              size="sm" 
              className="h-8 px-2 text-[10px] font-black py-0"
              onClick={() => handleStartStream(row.id)}
            >
              Start Live
            </Button>
          )}
          {row.status === "Live" && (
            <Button 
              variant="gold" 
              size="sm" 
              className="h-8 px-2 text-[10px] font-black py-0"
              onClick={() => handleCompleteStream(row.id)}
            >
              Complete
            </Button>
          )}
          <Button 
            variant="danger" 
            size="sm" 
            className="h-8 px-2 text-[10px] font-black py-0"
            onClick={() => handleDeleteWebinar(row.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
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
          <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Live webinars scheduling</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Schedule and broadcast live mentorship calls, joint venture underwriting sessions, and student Q&As.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Schedule Stream
        </Button>
      </div>

      {/* Main Webinars Schedule table */}
      <AdminTable
        title="Scheduled Masterclass Broadcasts"
        subtitle="Webinar URLs, calendar log dates, status of streaming servers"
        columns={webinarColumns}
        data={webinars}
        searchPlaceholder="Search webinars..."
        filterOptions={{
          field: "status",
          label: "Stream Status",
          options: [
            { value: "Upcoming", label: "Upcoming" },
            { value: "Live", label: "Live" },
            { value: "Completed", label: "Completed" }
          ]
        }}
      />

      {/* Webinar Scheduler Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Live Broadcast"
      >
        <form onSubmit={handleCreateWebinar} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Webinar Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Zoning Codes & High-Ticket Commercial Lease Contracts"
              value={formState.topic}
              onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lead Mentor</label>
              <select
                value={formState.instructor}
                onChange={(e) => setFormState({ ...formState, instructor: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              >
                <option value="Sarah Jenkins">Sarah Jenkins (Broker)</option>
                <option value="Alex Mercer">Alex Mercer (Analyst)</option>
                <option value="Michael Chang">Michael Chang (Attorney)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date</label>
              <input
                type="date"
                required
                value={formState.date}
                onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Start Time</label>
              <input
                type="time"
                required
                value={formState.time}
                onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Broadcast Room (Zoom/Meet)</label>
              <input
                type="url"
                required
                placeholder="https://zoom.us/j/..."
                value={formState.link}
                onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Schedule Broadcast
            </Button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
}
