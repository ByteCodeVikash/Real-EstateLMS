import React, { useState } from 'react';
import { DollarSign, CreditCard, ArrowUpRight, TrendingUp, Download, Eye, ExternalLink, RefreshCw } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { AdminTable } from '../../components/admin/AdminComponents';
import { Button } from '../../components/UI';

const monthlySales = [
  { month: 'Jan', grossSales: 45000, refunds: 1500 },
  { month: 'Feb', grossSales: 52000, refunds: 800 },
  { month: 'Mar', grossSales: 61000, refunds: 2100 },
  { month: 'Apr', grossSales: 58000, refunds: 1200 },
  { month: 'May', grossSales: 78000, refunds: 900 },
  { month: 'Jun', grossSales: 95000, refunds: 1400 },
];

const subscriptionGrowth = [
  { name: 'Q1 25', regularSub: 180, vipSub: 45 },
  { name: 'Q2 25', regularSub: 220, vipSub: 60 },
  { name: 'Q3 25', regularSub: 280, vipSub: 85 },
  { name: 'Q4 25', regularSub: 340, vipSub: 120 },
];

const mockTransactions = [
  { id: "TXN-89201", student: "Cody Fisher", email: "cody.f@realestate.com", plan: "Luxury Flipping Class", amount: 1499, gateway: "Stripe", status: "Completed", date: "2026-05-23" },
  { id: "TXN-89190", student: "Albert Flores", email: "albert.flores@century21.com", plan: "REIT Modeling Guide", amount: 2100, gateway: "Stripe", status: "Completed", date: "2026-05-22" },
  { id: "TXN-89182", student: "Dianne Russell", email: "dianne.r@gmail.com", plan: "Negotiation Crashcourse", amount: 999, gateway: "PayPal", status: "Completed", date: "2026-05-20" },
  { id: "TXN-89173", student: "Ronald Richards", email: "ronald.r@richardsprops.com", plan: "Zoning Codes Guide", amount: 1200, gateway: "Stripe", status: "Refunded", date: "2026-05-18" },
  { id: "TXN-89164", student: "Kristin Watson", email: "kristin.w@watsongroup.org", plan: "Premium Academy Pass", amount: 4999, gateway: "Wire", status: "Completed", date: "2026-05-15" }
];

export default function AdminRevenue() {
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleDownloadInvoice = (txn) => {
    alert(`Mock Success: Invoice generated for ${txn.student} (${txn.id}). PDF download started!`);
  };

  const columns = [
    {
      header: "Transaction ID",
      accessor: "id",
      cellClassName: "font-mono font-bold text-premium-heading dark:text-white"
    },
    {
      header: "Purchaser",
      accessor: "student",
      render: (row) => (
        <div>
          <p className="font-bold text-premium-heading dark:text-white leading-none">{row.student}</p>
          <span className="text-[10px] text-slate-400 font-semibold">{row.email}</span>
        </div>
      )
    },
    {
      header: "Classroom plan",
      accessor: "plan",
      cellClassName: "text-slate-600 dark:text-slate-350"
    },
    {
      header: "Price",
      accessor: "amount",
      render: (row) => (
        <span className="font-black text-premium-heading dark:text-white">
          ${row.amount.toLocaleString()}
        </span>
      )
    },
    {
      header: "Gateway",
      accessor: "gateway",
      cellClassName: "text-slate-450"
    },
    {
      header: "State",
      accessor: "status",
      render: (row) => {
        const styles = {
          Completed: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
          Refunded: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[row.status] || ''}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: "Invoice",
      accessor: "id",
      render: (row) => (
        <button
          onClick={() => handleDownloadInvoice(row)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-premium-accent dark:hover:text-premium-accent hover:border-premium-accent/30 dark:hover:border-premium-accent/30 transition-all cursor-pointer active:scale-95 shrink-0"
          title="Print Invoice"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Revenue & Transactions</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Audit platform income streams, invoices logs, subscription counts, and bank payouts scheduler.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert("Syncing with payment gateway servers...")}>
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Gateway
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-premium-accent">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gross Income</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">$389,000</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-premium-violet">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Cart Size</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">$1,850</p>
          </div>
        </div>

        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Net Monthly Sales</span>
            <p className="text-xl font-black text-premium-heading dark:text-white mt-0.5">$93,600</p>
          </div>
        </div>
      </div>

      {/* Chart Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales area chart */}
        <div className="lg:col-span-2 rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="mb-6">
            <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Monthly Gross Revenue</h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Earnings trends including gateway fees/refund deductions</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription growth bar chart */}
        <div className="rounded-2xl border border-premium-border/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="mb-6">
            <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Subscription Accounts</h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Recurring membership scale by pass types</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriptionGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
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
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="regularSub" name="Academy Pass" fill="#2563eb" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="vipSub" name="Broker VIP Pass" fill="#7c3aed" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Transactions Ledger */}
      <AdminTable
        title="Payment Registry Ledger"
        subtitle="Gateway histories, transaction records, invoice statuses"
        columns={columns}
        data={transactions}
        searchPlaceholder="Search transactions..."
        filterOptions={{
          field: "status",
          label: "Payment State",
          options: [
            { value: "Completed", label: "Completed" },
            { value: "Refunded", label: "Refunded" }
          ]
        }}
      />

    </div>
  );
}
