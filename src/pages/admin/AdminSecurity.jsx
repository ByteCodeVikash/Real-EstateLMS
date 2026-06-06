import React, { useState } from 'react';
import { Shield, Key, Eye, ShieldAlert, FileText, CheckCircle, RefreshCw, Plus } from 'lucide-react';
import { AdminTable, AdminDrawer } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

const initialStaff = [
  { id: 1, name: "Vikash Sharma", email: "vikash@bgrealtyacademy.com", role: "Super Admin", lastActive: "2026-05-23 13:45", keys: 2 },
  { id: 2, name: "Sarah Jenkins", email: "sarah.j@bgrealtyacademy.com", role: "Instructor Manager", lastActive: "2026-05-23 11:20", keys: 1 },
  { id: 3, name: "Alex Mercer", email: "alex.mercer@bgrealtyacademy.com", role: "Grader Advisor", lastActive: "2026-05-22 17:40", keys: 1 },
];

const initialAuditLogs = [
  { id: 1029, action: "Student status suspended", executor: "Vikash Sharma", ip: "192.168.1.45", date: "2026-05-23 13:40", details: "Ronald Richards suspended due to payment failure" },
  { id: 1028, action: "Course Published", executor: "Sarah Jenkins", ip: "192.168.1.92", date: "2026-05-23 11:15", details: "Zoning Codes catalog status changed to Published" },
  { id: 1027, action: "Invoice Refund Approved", executor: "Vikash Sharma", ip: "192.168.1.45", date: "2026-05-22 14:02", details: "Refund $1,200 issued for TXN-89173" },
  { id: 1026, action: "New Admin Key generated", executor: "Vikash Sharma", ip: "192.168.1.45", date: "2026-05-21 09:30", details: "Created API Token for reporting servers" }
];

export default function AdminSecurity() {
  const [staff, setStaff] = useState(initialStaff);
  const [logs, setLogs] = useState(initialAuditLogs);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', role: 'Grader Advisor' });

  const handleRegisterStaff = (e) => {
    e.preventDefault();
    const newStaff = {
      id: staff.length + 1,
      name: formState.name,
      email: formState.email,
      role: formState.role,
      lastActive: "—",
      keys: 0
    };
    setStaff([...staff, newStaff]);
    
    // Add audit log for staff addition
    const newLog = {
      id: logs[0].id + 1,
      action: "Admin user added",
      executor: "Vikash Sharma",
      ip: "192.168.1.45",
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Registered ${formState.name} with role: ${formState.role}`
    };
    setLogs([newLog, ...logs]);

    setDrawerOpen(false);
    setFormState({ name: '', email: '', role: 'Grader Advisor' });
    alert(`Administrator "${newStaff.name}" registered successfully!`);
  };

  const staffColumns = [
    {
      header: "Admin Details",
      accessor: "name",
      render: (row) => (
        <div>
          <p className="font-bold text-white text-white leading-none">{row.name}</p>
          <span className="text-[10px] text-slate-400 font-semibold">{row.email}</span>
        </div>
      )
    },
    {
      header: "Access Role",
      accessor: "role",
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          row.role === "Super Admin"
            ? "bg-red-500/10 text-red-650 border-red-500/20 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
            : "bg-[#0A66C2]/10 text-blue-650 border-[#0A66C2]/20 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900"
        }`}>
          {row.role}
        </span>
      )
    },
    {
      header: "Last Active",
      accessor: "lastActive",
      cellClassName: "text-slate-400 font-mono text-[11px]"
    },
    {
      header: "API Access Keys",
      accessor: "keys",
      render: (row) => (
        <span className="font-extrabold text-slate-700 dark:text-slate-350">
          {row.keys} Active Keys
        </span>
      )
    }
  ];

  const logColumns = [
    {
      header: "Log Code",
      accessor: "id",
      cellClassName: "font-mono font-bold text-white text-white"
    },
    {
      header: "Action Category",
      accessor: "action",
      render: (row) => (
        <div>
          <p className="font-bold text-white text-white leading-none">{row.action}</p>
          <span className="text-[10px] text-slate-400 font-semibold">{row.details}</span>
        </div>
      )
    },
    {
      header: "Executor",
      accessor: "executor",
      cellClassName: "text-slate-650 dark:text-slate-350 font-bold"
    },
    {
      header: "IP Address",
      accessor: "ip",
      cellClassName: "font-mono text-slate-400"
    },
    {
      header: "Timestamp",
      accessor: "date",
      cellClassName: "text-slate-450"
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white text-white tracking-tight uppercase">Security & Audit Logs</h1>
          <p className="text-xs font-semibold text-slate-400 text-slate-500 mt-1">Audit administrative operations, manage dashboard access roles, configure secure keys, and trace operational audits.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Rotating encryption keys...")}>
            <RefreshCw className="w-4 h-4 mr-2" /> Rotate Keys
          </Button>
          <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Administrator
          </Button>
        </div>
      </div>

      {/* Staff Roles Registry Table */}
      <AdminTable
        title="Administrative Staff Roles"
        subtitle="Staff permissions list, last login timestamps, API keys"
        columns={staffColumns}
        data={staff}
        searchPlaceholder="Search staff..."
      />

      {/* Audit Operations Log Table */}
      <AdminTable
        title="Operational Audit Trail Logs"
        subtitle="Platform activity history tracking IP coordinates and execution details"
        columns={logColumns}
        data={logs}
        searchPlaceholder="Filter logs..."
      />

      {/* Add Administrator Drawer */}
      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add Dashboard Administrator"
      >
        <form onSubmit={handleRegisterStaff} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Staff Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Johnathan Admin"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Work Email Address</label>
            <input
              type="email"
              required
              placeholder="john@bgrealtyacademy.com"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Access Authorization Level</label>
            <select
              value={formState.role}
              onChange={(e) => setFormState({ ...formState, role: e.target.value })}
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none"
            >
              <option value="Grader Advisor">Grader Advisor (Grade assignments & submit reviews)</option>
              <option value="Instructor Manager">Instructor Manager (Manage masterclasses & live web streams)</option>
              <option value="Super Admin">Super Admin (Full root clearance)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[#1a1a1c] dark:border-slate-850 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Register Credentials
            </Button>
          </div>
        </form>
      </AdminDrawer>

    </div>
  );
}
