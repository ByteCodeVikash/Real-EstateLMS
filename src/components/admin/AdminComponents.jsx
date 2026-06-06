import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, 
  ArrowUpRight, ArrowDownRight, X, Download
} from 'lucide-react';
import { cn } from '../UI';

// ─────────────────────────────────────────────────────────
// Premium Admin Stat Card — fully dark
// ─────────────────────────────────────────────────────────
export const AdminStatCard = ({
  title,
  value,
  change,
  isPositive = true,
  timeframe = 'vs last month',
  icon: Icon,
  gradient = 'from-premium-accent/8 to-premium-accent/3',
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="relative overflow-hidden rounded-2xl bg-[#0b0b0d] border border-[#1a1a1c] p-6
                 shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:border-premium-accent/20
                 hover:shadow-[0_8px_32px_rgba(212,175,55,0.07)] transition-all duration-300 group"
    >
      {/* Decorative glow */}
      <div className={cn(
        'absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-60',
        gradient
      )} />

      <div className="relative flex items-center justify-between mb-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{title}</span>
        <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#111115] border border-[#1e1e22] text-premium-accent">
          {Icon && <Icon className="w-4.5 h-4.5" />}
        </div>
      </div>

      <span className="text-3xl font-black text-white tracking-tight">{value}</span>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className={cn(
          'inline-flex items-center gap-0.5 font-black px-1.5 py-0.5 rounded-lg',
          isPositive
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-red-500/10 text-red-400'
        )}>
          {isPositive
            ? <ArrowUpRight className="w-3 h-3" />
            : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </span>
        <span className="text-slate-600 font-semibold">{timeframe}</span>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// Advanced paginated admin table — dark luxury
// ─────────────────────────────────────────────────────────
export const AdminTable = ({
  title,
  subtitle,
  columns,
  data = [],
  searchPlaceholder = 'Search records...',
  actions,
  filterOptions,
  onFilterChange,
  emptyStateText = 'No records found.',
  exportable = true,
}) => {
  const [searchTerm, setSearchTerm]     = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const itemsPerPage = 8;

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterOptions && selectedFilter !== 'all') {
      return matchesSearch && item[filterOptions.field] === selectedFilter;
    }
    return matchesSearch;
  });

  const totalPages   = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex   = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterSelect = (val) => {
    setSelectedFilter(val);
    setCurrentPage(1);
    if (onFilterChange) onFilterChange(val);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const downloadCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = filteredData.map(item =>
      columns.map(c => {
        const val = typeof c.accessor === 'function' ? c.accessor(item) : item[c.accessor];
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl bg-[#0b0b0d] border border-[#1a1a1c] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="p-6 border-b border-[#1a1a1c] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-white tracking-tight uppercase">{title}</h3>
          {subtitle && <p className="text-xs font-semibold text-slate-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full bg-[#111114] border border-[#1e1e22] rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-premium-accent/25 focus:border-premium-accent/30 transition-all"
            />
          </div>

          {filterOptions && (
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={e => handleFilterSelect(e.target.value)}
                className="appearance-none bg-[#111114] border border-[#1e1e22] rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-premium-accent/25 transition-all cursor-pointer"
              >
                <option value="all">All {filterOptions.label}</option>
                {filterOptions.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-slate-600">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {exportable && filteredData.length > 0 && (
            <button
              onClick={downloadCSV}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#111114] border border-[#1e1e22] text-slate-500 hover:text-premium-accent hover:border-premium-accent/30 transition-all cursor-pointer active:scale-95 shrink-0"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {actions}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1a1a1c] bg-[#080809]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn('px-5 py-4 text-[9px] font-black uppercase tracking-widest text-slate-600', col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111114]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="transition-colors hover:bg-white/[0.018]">
                  {columns.map((col, colIdx) => {
                    const cellContent = col.render
                      ? col.render(row)
                      : typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : row[col.accessor];
                    return (
                      <td
                        key={colIdx}
                        className={cn('px-5 py-4 text-xs text-slate-400 font-bold', col.cellClassName)}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-600">
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-black text-sm">{emptyStateText}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-[#1a1a1c] flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#111114] border border-[#1e1e22] text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'h-8 w-8 text-xs font-black rounded-lg transition-all cursor-pointer',
                    currentPage === page
                      ? 'bg-gradient-premium text-black shadow-gold-sm'
                      : 'bg-[#111114] border border-[#1e1e22] text-slate-500 hover:text-white'
                  )}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#111114] border border-[#1e1e22] text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Admin Drawer  — dark luxury slide-out
// ─────────────────────────────────────────────────────────
export const AdminDrawer = ({ isOpen, onClose, title, children }) => {
  React.useEffect(() => {
    if (isOpen) document.body.classList.add('overflow-hidden');
    else         document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#0b0b0d] border-l border-[#1a1a1c] z-[151] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.7)] text-left"
          >
            {/* Drawer top accent line */}
            <div className="h-0.5 w-full bg-gradient-premium shrink-0" />

            <div className="p-6 border-b border-[#1a1a1c] flex items-center justify-between shrink-0">
              <h3 className="text-base font-black text-white tracking-tight uppercase">{title}</h3>
              <button
                onClick={onClose}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#111114] border border-[#1e1e22] text-slate-400 hover:text-white hover:border-red-500/30 hover:bg-red-500/10 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

// ─────────────────────────────────────────────────────────
// Admin Modal  — dark luxury dialog
// ─────────────────────────────────────────────────────────
export const AdminModal = ({ isOpen, onClose, title, children }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
          />
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', damping: 24, stiffness: 200 }}
              className="w-full max-w-md bg-[#0b0b0d] rounded-2xl border border-[#1a1a1c] shadow-[0_24px_80px_rgba(0,0,0,0.65)] overflow-hidden text-left"
            >
              {/* Top gold accent */}
              <div className="h-0.5 w-full bg-gradient-premium" />

              <div className="p-5 border-b border-[#1a1a1c] flex items-center justify-between">
                <h3 className="text-base font-black text-white tracking-tight uppercase">{title}</h3>
                <button
                  onClick={onClose}
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#111114] border border-[#1e1e22] text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
