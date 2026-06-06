import React, { useState } from 'react';
import { Bell, Send, CheckCircle, Mail, Globe, Users, Trash2 } from 'lucide-react';
import { AdminTable } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

const initialAlerts = [
  { id: 1, title: "Syllabus Update: Luxury Flipping Module 8", message: "New valuation spreadsheet modeling exercises uploaded. Check classroom modules.", target: "Luxury Flipping Students", channel: "In-App + Email", sentDate: "2026-05-22", author: "Sarah Jenkins" },
  { id: 2, title: "Urgent: Live Webinar Zoom room updated", message: "Zoom ID is now 912-834-19. Live webinar starting in 15 minutes.", target: "All Students", channel: "In-App Push", sentDate: "2026-05-23", author: "Console System" },
  { id: 3, title: "Server Maintenance Downtime Notice", message: "Database syncing on Sunday from 02:00 to 04:00 EST. Expect minor speed delays.", target: "All Platform Accounts", channel: "In-App Header", sentDate: "2026-05-18", author: "Admin Dev" }
];

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [composer, setComposer] = useState({ title: '', message: '', target: 'All Students', emailChannel: true, pushChannel: true });

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    const channels = [];
    if (composer.emailChannel) channels.push("Email");
    if (composer.pushChannel) channels.push("In-App");
    
    const newAlert = {
      id: alerts.length + 1,
      title: composer.title,
      message: composer.message,
      target: composer.target,
      channel: channels.join(" + ") || "In-App System",
      sentDate: new Date().toISOString().split('T')[0],
      author: "Vikash Sharma"
    };

    setAlerts([newAlert, ...alerts]);
    alert(`Broadcast dispatched to ${composer.target} via ${channels.join(" & ") || "System Dashboard"}!`);
    setComposer({ title: '', message: '', target: 'All Students', emailChannel: true, pushChannel: true });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this alert from student feed logs?")) {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }
  };

  const columns = [
    {
      header: "Announcement Subject",
      accessor: "title",
      render: (row) => (
        <div className="max-w-[280px]">
          <p className="font-bold text-white text-white leading-normal">{row.title}</p>
          <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{row.message}</p>
        </div>
      )
    },
    {
      header: "Audience Target",
      accessor: "target",
      render: (row) => (
        <span className="font-extrabold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-premium-accent" /> {row.target}
        </span>
      )
    },
    {
      header: "Channels",
      accessor: "channel",
      cellClassName: "text-slate-450 font-mono font-bold"
    },
    {
      header: "Dispatch Date",
      accessor: "sentDate",
      cellClassName: "text-slate-400"
    },
    {
      header: "Dispatched By",
      accessor: "author",
      cellClassName: "text-slate-600 dark:text-slate-450 font-bold"
    },
    {
      header: "Clear",
      accessor: "id",
      render: (row) => (
        <Button 
          variant="danger" 
          size="sm" 
          className="h-8 px-2 text-[10px] font-black py-0"
          onClick={() => handleDelete(row.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white text-white tracking-tight uppercase">System Alerts Broadcast</h1>
        <p className="text-xs font-semibold text-slate-400 text-slate-500 mt-1">Broadcast pushing notifications to student dashboard grids, dispatch emails, or alert system downtime.</p>
      </div>

      {/* Broadcast Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Composer Form card */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card">
          <h3 className="text-base font-black text-white text-white tracking-tight uppercase mb-4">Compose Broadcast</h3>
          
          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Announcement Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Schedule Update: Live webinars shift to Zoom ID 920"
                value={composer.title}
                onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Recipient Target</label>
                <select
                  value={composer.target}
                  onChange={(e) => setComposer({ ...composer, target: e.target.value })}
                  className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none"
                >
                  <option value="All Students">All Students</option>
                  <option value="Luxury Flipping Students">Luxury Flipping Program only</option>
                  <option value="Commercial Underwriting Students">Commercial Underwriting only</option>
                  <option value="Instructors">Instructors & Mentors</option>
                </select>
              </div>

              {/* Delivery channel checkmarks */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Delivery Channels</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-450 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={composer.emailChannel}
                      onChange={(e) => setComposer({ ...composer, emailChannel: e.target.checked })}
                      className="rounded text-premium-accent border-premium-border border-[#1e1e22] w-4 h-4 cursor-pointer"
                    />
                    Dispatch Email
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-450 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={composer.pushChannel}
                      onChange={(e) => setComposer({ ...composer, pushChannel: e.target.checked })}
                      className="rounded text-premium-accent border-premium-border border-[#1e1e22] w-4 h-4 cursor-pointer"
                    />
                    Push Notification
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Announcement Message</label>
              <textarea
                rows="4"
                required
                placeholder="Compose notification content. Keep it short and actionable..."
                value={composer.message}
                onChange={(e) => setComposer({ ...composer, message: e.target.value })}
                className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none scrollbar-thin"
              />
            </div>

            <div className="pt-4 border-t border-[#1a1a1c] dark:border-slate-850 flex justify-end">
              <Button variant="primary" size="sm" type="submit">
                <Send className="w-4 h-4 mr-2" /> Dispatch Announcement
              </Button>
            </div>
          </form>
        </div>

        {/* Channel Details Info */}
        <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card">
          <h3 className="text-base font-black text-white text-white tracking-tight uppercase mb-4">Notification Channels</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-[#0A66C2]/100/10 flex items-center justify-center text-premium-accent shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs text-left">
                <h5 className="font-black text-white text-white">Email dispatch SMTP</h5>
                <p className="text-slate-400 dark:text-slate-555 mt-0.5 leading-relaxed">Broadcast messages will queue and dispatch to all user profiles associated with the target audience group.</p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-violet-500/100/10 flex items-center justify-center text-premium-violet shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-xs text-left">
                <h5 className="font-black text-white text-white">In-App Live Stream</h5>
                <p className="text-slate-400 dark:text-slate-555 mt-0.5 leading-relaxed">Alert banner is immediately push-synchronized onto student main panels using WebSocket ping triggers.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Broadcast logs */}
      <AdminTable
        title="Broadcast Dispatch Logs"
        subtitle="Historical alert catalogs, receipt channels, target audience audits"
        columns={columns}
        data={alerts}
        searchPlaceholder="Filter sent notifications..."
      />

    </div>
  );
}
