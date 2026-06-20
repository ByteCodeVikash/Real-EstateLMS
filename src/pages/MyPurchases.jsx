import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, CreditCard, Calendar, CheckCircle2, XCircle, AlertCircle, 
  ExternalLink, Play, ArrowRight, HelpCircle, Receipt, ArrowUpDown
} from 'lucide-react';
import { GlassCard, Badge, Button, Skeleton } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyPurchases = () => {
  const { token, API_BASE_URL } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/my-purchases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setPurchases(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPurchases();
    }
  }, [token, API_BASE_URL]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) + ' ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency helper
  const formatPrice = (amount, currency) => {
    const symbolMap = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€'
    };
    const symbol = symbolMap[currency] || '₹';
    return `${symbol}${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  // Filters logic
  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase => {
      const matchesSearch = 
        purchase.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.course.mentor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.razorpay_order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (purchase.razorpay_payment_id && purchase.razorpay_payment_id.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === 'All' || 
        purchase.payment_status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [purchases, searchQuery, statusFilter]);

  // Sorting logic
  const sortedPurchases = useMemo(() => {
    const list = [...filteredPurchases];
    if (sortOrder === 'newest') {
      return list.sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date));
    } else if (sortOrder === 'oldest') {
      return list.sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date));
    } else if (sortOrder === 'price-high') {
      return list.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === 'price-low') {
      return list.sort((a, b) => a.amount - b.amount);
    }
    return list;
  }, [filteredPurchases, sortOrder]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 text-left animate-pulse">
        {/* Header skeleton */}
        <div className="bg-[#0b0b0d] rounded-3xl p-8 border border-[#1a1a1c] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 flex-1 w-full">
            <div className="h-9 bg-[#16161a]/80 rounded-xl w-64"></div>
            <div className="h-4 bg-[#16161a]/60 rounded-lg w-96 max-w-full"></div>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="h-11 bg-[#16161a]/80 rounded-xl w-48"></div>
          </div>
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-11 bg-[#16161a]/80 rounded-xl flex-1"></div>
          <div className="h-11 bg-[#16161a]/80 rounded-xl w-40"></div>
          <div className="h-11 bg-[#16161a]/80 rounded-xl w-40"></div>
        </div>

        {/* Purchases list skeleton */}
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-[#0b0b0d] border border-[#1a1a1c] rounded-3xl h-52 w-full p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-full bg-[#16161a]/80 rounded-2xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-[#16161a]/90 rounded-md w-3/4"></div>
                <div className="h-4 bg-[#16161a]/60 rounded-md w-1/2"></div>
                <div className="h-4 bg-[#16161a]/60 rounded-md w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left relative min-h-screen pb-12">
      
      {/* Top Header Control Panel */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1a1a1c] shadow-dark-lg">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#0b0b0d]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/8 via-transparent to-[#D4AF37]/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium-accent/30 to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-premium-accent/5 rounded-full blur-3xl" />

        <div className="relative p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="premium" className="mb-1">
              Billing Ledger
            </Badge>
            <h1 className="text-3xl font-black text-white">My Purchase History</h1>
            <p className="text-xs text-slate-400 font-semibold max-w-xl">
              Track course orders, invoice reference IDs, payment status verifications, and launch purchased course portals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-[#0f0f12] border border-[#1e1e22] px-4 py-2.5 rounded-xl flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-premium-accent" />
              <div className="text-left">
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Total Purchases</p>
                <p className="text-xs font-black text-white">{purchases.length} Order{purchases.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b0b0d] p-4 rounded-2xl border border-[#1a1a1c] shadow-md">
        {/* Search */}
        <div className="relative group flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-premium-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search by course name, Order ID, Payment ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0f0f12]/70 border border-[#1e1e22] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/15 focus:bg-[#0b0b0d] w-full transition-all font-semibold hover:border-slate-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0f0f12] border border-[#1e1e22] rounded-xl py-2.5 pl-3.5 pr-8 text-xs font-bold text-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/10 hover:bg-[#111114]/50 cursor-pointer appearance-none transition-all w-full"
            >
              <option value="All">All Transactions</option>
              <option value="Paid">Paid Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Failed">Failed Only</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[9px]">▼</div>
          </div>

          {/* Sort Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#0f0f12] border border-[#1e1e22] rounded-xl py-2.5 pl-3.5 pr-8 text-xs font-bold text-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/10 hover:bg-[#111114]/50 cursor-pointer appearance-none transition-all w-full"
            >
              <option value="newest">Sort: Newest Purchase</option>
              <option value="oldest">Sort: Oldest Purchase</option>
              <option value="price-high">Sort: Amount (High to Low)</option>
              <option value="price-low">Sort: Amount (Low to High)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[9px]">▼</div>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <AnimatePresence>
          {sortedPurchases.map((purchase) => {
            const isPaid = purchase.payment_status === 'paid';
            const isPending = purchase.payment_status === 'pending';
            const isFailed = purchase.payment_status === 'failed';

            return (
              <motion.div
                key={purchase.order_id}
                variants={itemVariants}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="p-6 overflow-hidden flex flex-col md:flex-row gap-6 bg-[#0b0b0d] border border-[#1a1a1c] hover:border-premium-accent/25 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-300 rounded-3xl relative">
                  
                  {/* Premium Top Glow border */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-premium-accent/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Left: Thumbnail & Category */}
                  <div className="relative w-full md:w-52 h-36 rounded-2xl overflow-hidden bg-[#111114] border border-[#1a1a1c]/80 shrink-0">
                    <img 
                      src={purchase.course.thumbnail} 
                      alt={purchase.course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-slate-950/80 backdrop-blur-sm text-white border border-white/10 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
                        {purchase.course.category_name}
                      </span>
                    </div>
                  </div>

                  {/* Center: Details & Billing stats */}
                  <div className="flex-1 flex flex-col justify-between space-y-4 md:space-y-0 text-left">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-black text-white hover:text-premium-accent transition-colors line-clamp-1 leading-snug">
                          {purchase.course.title}
                        </h3>
                        
                        {/* Status Badge */}
                        {isPaid && (
                          <Badge variant="success" className="flex items-center gap-1.5 py-1 px-3">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Paid</span>
                          </Badge>
                        )}
                        {isPending && (
                          <Badge variant="warning" className="flex items-center gap-1.5 py-1 px-3">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span>Pending</span>
                          </Badge>
                        )}
                        {isFailed && (
                          <Badge variant="danger" className="flex items-center gap-1.5 py-1 px-3">
                            <XCircle className="w-3 h-3 text-red-400" />
                            <span>Failed</span>
                          </Badge>
                        )}
                        {purchase.payment_status === 'refunded' && (
                          <Badge variant="muted" className="flex items-center gap-1.5 py-1 px-3">
                            <span>Refunded</span>
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 font-semibold">
                        Instructor: {purchase.course.mentor_name} · {purchase.course.duration} course
                      </p>
                    </div>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0f0f12]/60 p-4 rounded-2xl border border-[#1a1a1c] text-xs font-semibold text-slate-500">
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-600 tracking-wider">Purchase Date</p>
                        <p className="text-white font-bold mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-premium-accent" />
                          {formatDate(purchase.purchase_date)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-600 tracking-wider">Amount Paid</p>
                        <p className="text-white font-bold mt-1">
                          {formatPrice(purchase.amount, purchase.currency)}
                        </p>
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <p className="text-[8px] font-black uppercase text-slate-600 tracking-wider">Transaction Identifiers</p>
                        <p className="font-mono text-[10px] text-slate-400 truncate mt-1">
                          <span className="text-slate-600">Order:</span> {purchase.razorpay_order_id || 'N/A'}<br/>
                          <span className="text-slate-600">PayID:</span> {purchase.razorpay_payment_id || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Progress tracking bar (Only visible if paid and enrolled) */}
                    {isPaid && purchase.enrollment && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                          <span className="text-slate-500">Syllabus Progress</span>
                          <span className="text-premium-accent">{purchase.enrollment.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0f0f12] border border-[#1e1e22]/50 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-premium-accent"
                            style={{ width: `${purchase.enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action failure reason if failed */}
                    {isFailed && purchase.failure_reason && (
                      <div className="bg-red-950/10 border border-red-500/25 rounded-xl px-3.5 py-2 flex items-start gap-2.5 text-red-400 text-[11px] font-bold">
                        <XCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-white text-xs font-black">Transaction Error</p>
                          <p className="mt-0.5">{purchase.failure_reason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col items-stretch justify-center gap-2.5 shrink-0 w-full md:w-44 border-t md:border-t-0 md:border-l border-[#1a1a1c] pt-4 md:pt-0 md:pl-4">
                    <Link to={`/courses/${purchase.course.id}`} className="flex-1 md:flex-initial">
                      <Button 
                        variant="outline" 
                        className="w-full text-[10px] uppercase font-black tracking-wider h-11 rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>

                    {isPaid ? (
                      <Link to={`/watch/${purchase.course.id}`} className="flex-1 md:flex-initial">
                        <Button 
                          variant="primary" 
                          className="w-full text-[10px] uppercase font-black tracking-wider h-11 rounded-xl flex items-center justify-center gap-1.5 shadow-gold-sm"
                        >
                          <span>Continue Learning</span>
                          <Play className="w-3 h-3 fill-current" />
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        disabled 
                        variant="secondary" 
                        className="flex-1 md:flex-initial text-[10px] uppercase font-black tracking-wider h-11 rounded-xl cursor-not-allowed opacity-40"
                      >
                        Locked
                      </Button>
                    )}
                  </div>

                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State UI */}
      {sortedPurchases.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 flex flex-col items-center justify-center text-center bg-[#0b0b0d] rounded-3xl border border-[#1a1a1c] shadow-lg max-w-4xl mx-auto"
        >
          <div className="w-16 h-16 bg-[#0f0f12] border border-[#1e1e22] rounded-2xl flex items-center justify-center mb-6 shadow-md">
            <Receipt className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">No Transactions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-semibold">
            You haven't initiated any payment transactions or course purchases yet. Explore our elite academy curriculum to build your real estate portfolio.
          </p>
          <Link to="/courses" className="mt-8">
            <Button 
              variant="primary" 
              className="text-[10px] uppercase font-black tracking-wider px-6 h-11 rounded-xl flex items-center gap-2"
            >
              <span>Browse Course Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Footer support prompt */}
      <div className="text-center pt-8 border-t border-[#1a1a1c] max-w-2xl mx-auto">
        <p className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-600" />
          <span>Having payment verification or checkout issues? Contact our billing desk at</span>
          <a href="mailto:billing@bgrealtyacademy.com" className="text-premium-accent hover:underline font-black">billing@bgrealtyacademy.com</a>
        </p>
      </div>

    </div>
  );
};

export default MyPurchases;
