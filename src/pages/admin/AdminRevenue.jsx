import React, { useState } from 'react';
import { 
  DollarSign, CreditCard, ArrowUpRight, ArrowDownRight, TrendingUp, 
  Download, Eye, ExternalLink, RefreshCw, Filter, 
  Tag, Award, Sparkles, BookOpen, AlertCircle, CheckCircle, Search
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, ComposedChart, Line
} from 'recharts';
import { AdminTable } from '../../components/admin/AdminComponents';
import { Button, GlassCard, Badge } from '../../components/UI';

// Mock datasets for different date range filters
const dataset30Days = {
  monthlySales: [
    { month: 'Jan', grossSales: 45000, refunds: 1500, netSales: 43500 },
    { month: 'Feb', grossSales: 52000, refunds: 800, netSales: 51200 },
    { month: 'Mar', grossSales: 61000, refunds: 2100, netSales: 58900 },
    { month: 'Apr', grossSales: 58000, refunds: 1200, netSales: 56800 },
    { month: 'May', grossSales: 78000, refunds: 900, netSales: 77100 },
    { month: 'Jun', grossSales: 95000, refunds: 1400, netSales: 93600 },
  ],
  topCourses: [
    { name: 'Commercial Leases', value: 145000, percentage: 35, fill: '#2563eb' },
    { name: 'Luxury Flipping', value: 104000, percentage: 25, fill: '#7c3aed' },
    { name: 'Deal Underwriting', value: 83000, percentage: 20, fill: '#10b981' },
    { name: 'REIT Modeling', value: 50000, percentage: 12, fill: '#f59e0b' },
    { name: 'Zoning & Permits', value: 33000, percentage: 8, fill: '#f43f5e' },
  ],
  kpi: {
    gross: "$428,950",
    grossTrend: "+14.2%",
    netGrowth: "$93,600",
    netTrend: "+22.4%",
    cartSize: "$1,850",
    cartTrend: "+5.1%",
    refundRate: "0.8% Net",
    refundTrend: "-0.3%"
  },
  transactions: [
    { id: "TXN-89201", student: "Cody Fisher", email: "cody.f@realestate.com", plan: "Luxury Flipping Class", amount: 1499, coupon: "NONE", type: "Course Sale", gateway: "Stripe", status: "Completed", date: "2026-05-23" },
    { id: "TXN-89190", student: "Albert Flores", email: "albert.flores@century21.com", plan: "REIT Modeling Guide", amount: 2100, coupon: "WELCOME50 (-$50)", type: "Course Sale", gateway: "Stripe", status: "Completed", date: "2026-05-22" },
    { id: "TXN-89182", student: "Dianne Russell", email: "dianne.r@gmail.com", plan: "Negotiation Crashcourse", amount: 999, coupon: "RESTART20 (-$250)", type: "Course Sale", gateway: "PayPal", status: "Completed", date: "2026-05-20" },
    { id: "TXN-89173", student: "Ronald Richards", email: "ronald.r@richardsprops.com", plan: "Zoning Codes Guide", amount: 1200, coupon: "NONE", type: "Refund Credit", gateway: "Stripe", status: "Refunded", date: "2026-05-18" },
    { id: "TXN-89164", student: "Kristin Watson", email: "kristin.w@watsongroup.org", plan: "Premium Academy Pass", amount: 4999, coupon: "VIPREALTOR (-$1000)", type: "Subscription", gateway: "Wire Transfer", status: "Completed", date: "2026-05-15" },
    { id: "TXN-89155", student: "Bessie Cooper", email: "bessie.c@gmail.com", plan: "Multifamily Deal Underwriting", amount: 1499, coupon: "NONE", type: "Course Sale", gateway: "Apple Pay", status: "Completed", date: "2026-05-12" },
    { id: "TXN-89142", student: "Wade Warren", email: "wade.w@warrenhomes.co", plan: "Premium Academy Pass", amount: 5999, coupon: "NONE", type: "Subscription", gateway: "Stripe", status: "Pending", date: "2026-05-09" },
    { id: "TXN-89131", student: "Jenny Wilson", email: "jenny.w@sothebys.com", plan: "Negotiation Crashcourse", amount: 999, coupon: "WELCOME50 (-$50)", type: "Course Sale", gateway: "PayPal", status: "Failed", date: "2026-05-05" }
  ]
};

const dataset7Days = {
  monthlySales: [
    { month: 'May 21', grossSales: 12000, refunds: 0, netSales: 12000 },
    { month: 'May 22', grossSales: 15000, refunds: 300, netSales: 14700 },
    { month: 'May 23', grossSales: 18000, refunds: 100, netSales: 17900 },
    { month: 'May 24', grossSales: 14000, refunds: 400, netSales: 13600 },
    { month: 'May 25', grossSales: 22000, refunds: 200, netSales: 21800 },
    { month: 'May 26', grossSales: 25000, refunds: 150, netSales: 24850 },
  ],
  topCourses: [
    { name: 'Commercial Leases', value: 35000, percentage: 38, fill: '#2563eb' },
    { name: 'Luxury Flipping', value: 23000, percentage: 25, fill: '#7c3aed' },
    { name: 'Deal Underwriting', value: 18000, percentage: 20, fill: '#10b981' },
    { name: 'REIT Modeling', value: 9000, percentage: 10, fill: '#f59e0b' },
    { name: 'Zoning & Permits', value: 6500, percentage: 7, fill: '#f43f5e' },
  ],
  kpi: {
    gross: "$91,500",
    grossTrend: "+8.3%",
    netGrowth: "$24,850",
    netTrend: "+12.1%",
    cartSize: "$1,720",
    cartTrend: "+1.8%",
    refundRate: "1.2% Net",
    refundTrend: "+0.2%"
  },
  transactions: [
    { id: "TXN-89201", student: "Cody Fisher", email: "cody.f@realestate.com", plan: "Luxury Flipping Class", amount: 1499, coupon: "NONE", type: "Course Sale", gateway: "Stripe", status: "Completed", date: "2026-05-23" },
    { id: "TXN-89190", student: "Albert Flores", email: "albert.flores@century21.com", plan: "REIT Modeling Guide", amount: 2100, coupon: "WELCOME50 (-$50)", type: "Course Sale", gateway: "Stripe", status: "Completed", date: "2026-05-22" },
    { id: "TXN-89182", student: "Dianne Russell", email: "dianne.r@gmail.com", plan: "Negotiation Crashcourse", amount: 999, coupon: "RESTART20 (-$250)", type: "Course Sale", gateway: "PayPal", status: "Completed", date: "2026-05-20" }
  ]
};

const dataset90Days = {
  monthlySales: [
    { month: 'Month 1', grossSales: 145000, refunds: 4500, netSales: 140500 },
    { month: 'Month 2', grossSales: 172000, refunds: 3100, netSales: 168900 },
    { month: 'Month 3', grossSales: 218000, refunds: 5200, netSales: 212800 },
  ],
  topCourses: [
    { name: 'Commercial Leases', value: 410000, percentage: 32, fill: '#2563eb' },
    { name: 'Luxury Flipping', value: 335000, percentage: 26, fill: '#7c3aed' },
    { name: 'Deal Underwriting', value: 245000, percentage: 19, fill: '#10b981' },
    { name: 'REIT Modeling', value: 180000, percentage: 14, fill: '#f59e0b' },
    { name: 'Zoning & Permits', value: 110000, percentage: 9, fill: '#f43f5e' },
  ],
  kpi: {
    gross: "$1,280,450",
    grossTrend: "+19.4%",
    netGrowth: "$212,800",
    netTrend: "+28.2%",
    cartSize: "$1,910",
    cartTrend: "+8.3%",
    refundRate: "0.7% Net",
    refundTrend: "-0.5%"
  },
  transactions: [
    { id: "TXN-89201", student: "Cody Fisher", email: "cody.f@realestate.com", plan: "Luxury Flipping Class", amount: 1499, coupon: "NONE", type: "Course Sale", gateway: "Stripe", status: "Completed", date: "2026-05-23" },
    { id: "TXN-89190", student: "Albert Flores", email: "albert.flores@century21.com", plan: "REIT Modeling Guide", amount: 2100, coupon: "WELCOME50 (-$50)", type: "Course Sale", gateway: "Stripe", status: "Completed", date: "2026-05-22" },
    { id: "TXN-89182", student: "Dianne Russell", email: "dianne.r@gmail.com", plan: "Negotiation Crashcourse", amount: 999, coupon: "RESTART20 (-$250)", type: "Course Sale", gateway: "PayPal", status: "Completed", date: "2026-05-20" },
    { id: "TXN-89173", student: "Ronald Richards", email: "ronald.r@richardsprops.com", plan: "Zoning Codes Guide", amount: 1200, coupon: "NONE", type: "Refund Credit", gateway: "Stripe", status: "Refunded", date: "2026-05-18" },
    { id: "TXN-89164", student: "Kristin Watson", email: "kristin.w@watsongroup.org", plan: "Premium Academy Pass", amount: 4999, coupon: "VIPREALTOR (-$1000)", type: "Subscription", gateway: "Wire Transfer", status: "Completed", date: "2026-05-15" }
  ]
};

export default function AdminRevenue() {
  const [dateRange, setDateRange] = useState('30days'); // '7days' | '30days' | '90days'

  // Pick dataset
  const currentDataset = 
    dateRange === '7days' ? dataset7Days : 
    dateRange === '90days' ? dataset90Days : dataset30Days;

  const handleDownloadInvoice = (txn) => {
    alert(`Success: Invoice generated for ${txn.student} (${txn.id}). Download initiated!`);
  };

  const handleSyncGateway = () => {
    alert("Re-indexing billing records from Stripe, PayPal, and Apple Pay core servers. Ingestion sync successful.");
  };

  // Payment table columns
  const columns = [
    {
      header: "Transaction ID",
      accessor: "id",
      cellClassName: "font-mono font-bold text-white text-white"
    },
    {
      header: "Purchaser Details",
      accessor: "student",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#111114] bg-[#111114] flex items-center justify-center font-black text-xs text-premium-accent shrink-0 uppercase">
            {row.student.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-white text-white leading-none">{row.student}</p>
            <span className="text-[10px] text-slate-400 font-semibold">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Purchase Item & Type",
      accessor: "plan",
      render: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-slate-700 text-slate-300">{row.plan}</span>
          <span className="text-[9px] text-slate-400 text-slate-500 font-bold uppercase tracking-wider mt-0.5">{row.type}</span>
        </div>
      )
    },
    {
      header: "Coupon Code",
      accessor: "coupon",
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.coupon === "NONE" ? (
            <span className="text-[10px] text-slate-400 font-semibold uppercase">None</span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-500/10 text-premium-violet border border-violet-500/20 text-[10px] font-black uppercase">
              <Tag className="w-2.5 h-2.5" /> {row.coupon}
            </span>
          )}
        </div>
      )
    },
    {
      header: "Price Net",
      accessor: "amount",
      render: (row) => (
        <span className="font-black text-white text-white">
          ${row.amount.toLocaleString()}
        </span>
      )
    },
    {
      header: "Gateway",
      accessor: "gateway",
      cellClassName: "text-slate-500 text-slate-400"
    },
    {
      header: "Payment Status",
      accessor: "status",
      render: (row) => {
        const styles = {
          Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
          Refunded: "bg-red-500/10 text-red-400 border-red-500/20 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900",
          Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900",
          Failed: "bg-[#111114] text-slate-500 border-[#1e1e22] bg-[#111114] text-slate-400 border-[#1e1e22]"
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[row.status] || ''}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: "Invoice Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadInvoice(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] text-slate-500 text-slate-400 hover:text-premium-accent dark:hover:text-premium-accent hover:border-premium-accent/30 dark:hover:border-premium-accent/30 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Download PDF Invoice"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {row.status === "Completed" && (
            <button
              onClick={() => {
                if (confirm(`Process full refund of $${row.amount} for txn: ${row.id}?`)) {
                  alert(`Transaction ${row.id} credited. Gateway refund request dispatched.`);
                }
              }}
              className="flex h-8 px-2 items-center justify-center rounded-lg bg-red-500/10/50 dark:bg-red-950/10 border border-red-500/20/60 dark:border-red-950 text-red-500 hover:bg-red-500/100/10 hover:text-red-400 text-[10px] font-black uppercase tracking-wide cursor-pointer active:scale-95 shrink-0"
              title="Process Refund"
            >
              Refund
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Header Block with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a1c] border-[#1a1a1c]/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-premium-accent font-black text-xs uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Revenue Control Console</span>
          </div>
          <h1 className="text-3xl font-black text-white text-white tracking-tight uppercase">
            Revenue & Invoicing
          </h1>
          <p className="text-sm font-semibold text-slate-400 text-slate-500 mt-1">
            Track subscription income streams, audit ledger accounts, process refunds, and sync payment gateways.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-[#0b0b0d] bg-[#0b0b0d] border border-premium-border border-[#1a1a1c] rounded-xl py-2.5 pl-4 pr-10 text-xs font-black text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/25 cursor-pointer shadow-sm"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <div className="absolute right-3.5 top-3 pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          <Button variant="outline" size="sm" className="h-[38px] shadow-sm font-black text-xs uppercase py-0" onClick={handleSyncGateway}>
            <RefreshCw className="w-4 h-4 mr-2" /> Sync Gateways
          </Button>
        </div>
      </div>

      {/* KPI Stats widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-wider">Gross Income</span>
            <div className="h-9 w-9 rounded-lg bg-[#0A66C2]/10 dark:bg-blue-950/20 text-premium-accent flex items-center justify-center border border-[#0A66C2]/20 dark:border-blue-900 shrink-0">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white text-white tracking-tight leading-none">{currentDataset.kpi.gross}</h3>
            <span className="text-[10px] text-emerald-500 font-extrabold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentDataset.kpi.grossTrend} Gross volume
            </span>
          </div>
        </GlassCard>

        <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-wider">Net Growth</span>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 dark:border-emerald-900 shrink-0">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white text-white tracking-tight leading-none">{currentDataset.kpi.netGrowth}</h3>
            <span className="text-[10px] text-emerald-500 font-extrabold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentDataset.kpi.netTrend} Net profit sales
            </span>
          </div>
        </GlassCard>

        <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-wider">Average Cart Size</span>
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 dark:bg-violet-950/20 text-premium-violet flex items-center justify-center border border-violet-500/20 dark:border-violet-900 shrink-0">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white text-white tracking-tight leading-none">{currentDataset.kpi.cartSize}</h3>
            <span className="text-[10px] text-emerald-500 font-extrabold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentDataset.kpi.cartTrend} Sales ticket size
            </span>
          </div>
        </GlassCard>

        <GlassCard className="bg-[#0b0b0d] bg-[#0b0b0d] border-premium-border border-[#1a1a1c] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-wider">Refund Rate</span>
            <div className="h-9 w-9 rounded-lg bg-red-500/10 dark:bg-red-950/20 text-red-500 flex items-center justify-center border border-red-500/20 dark:border-red-900 shrink-0">
              <RefreshCw className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white text-white tracking-tight leading-none">{currentDataset.kpi.refundRate}</h3>
            <span className="text-[10px] text-emerald-500 font-extrabold mt-2 flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" /> {currentDataset.kpi.refundTrend} Chargeback drops
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Row 1: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales area/line composed chart - Left Panel */}
        <div className="lg:col-span-8 rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card text-left">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-white text-white tracking-tight uppercase">Monthly Gross & Net Revenue</h3>
              <p className="text-[11px] font-semibold text-slate-400 text-slate-500 mt-0.5">Earnings trends including gateway fees and refund deductions</p>
            </div>
            <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0A66C2]/100"></span> Gross</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-500/100"></span> Net Profit</span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentDataset.monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="stroke-[#1a1a1c]" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px'
                  }} 
                />
                <Area type="monotone" dataKey="grossSales" name="Gross Sales ($)" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="netSales" name="Net Sales ($)" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top selling courses pie/donut chart - Right Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card text-left flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-white text-white tracking-tight uppercase">Top-Selling Courses</h3>
            <p className="text-[11px] font-semibold text-slate-400 text-slate-500 mt-0.5">Sales distribution shares across platform modules</p>
          </div>

          <div className="h-44 flex items-center justify-center my-3 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentDataset.topCourses}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {currentDataset.topCourses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider leading-none">Net Sales</span>
              <span className="text-lg font-black text-white text-white mt-1">$415K</span>
            </div>
          </div>

          {/* Detailed list legends table */}
          <div className="space-y-1.5">
            {currentDataset.topCourses.map((course, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: course.fill }}></span>
                  <span className="text-slate-650 dark:text-slate-450 line-clamp-1">{course.name}</span>
                </div>
                <span className="font-mono text-slate-700 dark:text-slate-350 shrink-0 font-black">
                  ${(course.value / 1000).toFixed(0)}k ({course.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Transactions Registry Ledger Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-premium-border/40 dark:border-slate-850 pb-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-slate-200 text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-premium-accent" /> Payment Registry Ledger
          </h2>
        </div>

        <AdminTable
          title="Recent Payment Registry Ledger"
          subtitle="Audit platform income transactions, filter payment statuses, and review coupon discounts."
          columns={columns}
          data={currentDataset.transactions}
          searchPlaceholder="Search purchaser name, email, transaction ID, plans..."
          filterOptions={{
            field: "status",
            label: "Payment State",
            options: [
              { value: "Completed", label: "Completed" },
              { value: "Refunded", label: "Refunded" },
              { value: "Pending", label: "Pending" },
              { value: "Failed", label: "Failed" }
            ]
          }}
        />
      </div>

    </div>
  );
}
