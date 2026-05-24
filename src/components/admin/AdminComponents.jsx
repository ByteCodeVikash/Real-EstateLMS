import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, 
  ArrowUpRight, ArrowDownRight, Check, X, Download
} from 'lucide-react';
import { cn } from '../UI';

// Premium Stat Card with hover effects, trend indicator, and glowing backgrounds
export const AdminStatCard = ({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  timeframe = "vs last month", 
  icon: Icon,
  gradient = "from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30"
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-premium-border/80 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]",
        "dark:bg-slate-900 dark:border-slate-800"
      )}
    >
      {/* Decorative gradient glow on hover */}
      <div className={cn("absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br blur-3xl opacity-20 transition-all duration-500 group-hover:scale-150", gradient)} />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-premium-accent border border-premium-border/60 dark:border-slate-700">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-black text-premium-heading dark:text-white tracking-tight">{value}</span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className={cn(
          "inline-flex items-center gap-0.5 font-black px-1.5 py-0.5 rounded-lg",
          isPositive 
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" 
            : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
        )}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {change}
        </span>
        <span className="font-semibold text-slate-400 dark:text-slate-500">{timeframe}</span>
      </div>
    </motion.div>
  );
};

// Advanced Paginated Table with search, sorting, filtering, and bulk actions
export const AdminTable = ({
  title,
  subtitle,
  columns,
  data = [],
  searchPlaceholder = "Search records...",
  actions,
  filterOptions,
  onFilterChange,
  emptyStateText = "No records found.",
  exportable = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const itemsPerPage = 8;

  // Filter and Search Logic
  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filterOptions && selectedFilter !== 'all') {
      return matchesSearch && item[filterOptions.field] === selectedFilter;
    }
    
    return matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
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
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-premium-border/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      {/* Table Header Section */}
      <div className="p-6 border-b border-premium-border/60 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-premium-heading dark:text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
        </div>
        
        {/* Table Toolbar */}
        <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/25 transition-all"
            />
          </div>

          {filterOptions && (
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => handleFilterSelect(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/25 transition-all cursor-pointer"
              >
                <option value="all">All {filterOptions.label}</option>
                {filterOptions.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-3.5 top-2.5 pointer-events-none text-slate-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {exportable && filteredData.length > 0 && (
            <button
              onClick={downloadCSV}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-premium-accent dark:hover:text-premium-accent hover:border-premium-accent/30 dark:hover:border-premium-accent/30 transition-all cursor-pointer active:scale-95 shrink-0"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-premium-border/60 dark:border-slate-800">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={cn(
                    "px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-premium-border/40 dark:divide-slate-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  {columns.map((col, colIdx) => {
                    const cellContent = col.render 
                      ? col.render(row) 
                      : typeof col.accessor === 'function' 
                        ? col.accessor(row) 
                        : row[col.accessor];
                    
                    return (
                      <td 
                        key={colIdx} 
                        className={cn(
                          "px-6 py-4.5 text-xs text-slate-500 dark:text-slate-400 font-bold",
                          col.cellClassName
                        )}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="font-bold text-sm">{emptyStateText}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-premium-border/60 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "h-8 w-8 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  currentPage === i + 1
                    ? "bg-premium-accent text-white"
                    : "bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 text-slate-500 hover:bg-slate-100"
                )}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Slide-out Drawer Panel for complex detail edits (e.g., adding courses/editing student accounts)
export const AdminDrawer = ({ isOpen, onClose, title, children }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[150]"
          />
          {/* Right Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white dark:bg-slate-900 border-l border-premium-border dark:border-slate-800 z-[151] flex flex-col shadow-2xl text-left"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-premium-border/60 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-black text-premium-heading dark:text-white tracking-tight uppercase">{title}</h3>
              <button
                onClick={onClose}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 text-slate-400 hover:text-premium-heading dark:hover:text-white transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Premium Modal Dialog (e.g., Delete actions, quick setup modals)
export const AdminModal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[200]"
          />
          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-premium-border dark:border-slate-800 shadow-2xl overflow-hidden text-left"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-premium-border/60 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">{title}</h3>
                <button
                  onClick={onClose}
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-premium-border dark:border-slate-700 text-slate-400 hover:text-premium-heading dark:hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Modal Body */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
