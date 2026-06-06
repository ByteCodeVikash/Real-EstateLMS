import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Award, BarChart3, Zap, Users, BookOpen, 
  Shield, HelpCircle, TrendingUp, Globe, Plus, Search, 
  Edit2, Trash2, SlidersHorizontal, Check, X, AlertTriangle, 
  Info, ShieldAlert, FolderOpen
} from 'lucide-react';
import { Button, GlassCard } from '../../components/UI';
import { AdminStatCard } from '../../components/admin/AdminComponents';
import { useAuth } from '../../context/AuthContext';

// Map icon names to Lucide icon components
const ICON_MAP = {
  Layers: Layers,
  Award: Award,
  BarChart3: BarChart3,
  Zap: Zap,
  Users: Users,
  BookOpen: BookOpen,
  Shield: Shield,
  HelpCircle: HelpCircle,
  TrendingUp: TrendingUp,
  Globe: Globe
};

// Available icons to select in the form
const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export default function AdminCategories() {
  const { token, API_BASE_URL } = useAuth();
  
  // API State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }
  
  // Toolbar State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = Create Mode
  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Layers',
    status: 'Active'
  });
  const [autoSlug, setAutoSlug] = useState(true);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setCategories(data.data || []);
      } else {
        setErrorMessage(data.message || 'Failed to retrieve categories.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Failed to reach server.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Handle Name Input Change (with auto-slug option)
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormState(prev => {
      const updated = { ...prev, name: val };
      if (autoSlug && !editingCategory) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      return updated;
    });
  };

  // Handle manual slug edits
  const handleSlugChange = (e) => {
    setAutoSlug(false);
    setFormState(prev => ({
      ...prev,
      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    }));
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormState({
      name: '',
      slug: '',
      description: '',
      icon: 'Layers',
      status: 'Active'
    });
    setAutoSlug(true);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormState({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || 'Layers',
      status: cat.status || 'Active'
    });
    setAutoSlug(false);
    setModalOpen(true);
  };

  // Submit Form Handler
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      showToast('error', 'Category name is required.');
      return;
    }

    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory 
      ? `${API_BASE_URL}/api/categories/${editingCategory.id}`
      : `${API_BASE_URL}/api/categories`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formState)
      });
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        showToast('success', editingCategory ? 'Category updated successfully.' : 'Category created successfully.');
        setModalOpen(false);
        fetchCategories();
      } else {
        showToast('error', data.message || 'An error occurred while saving.');
      }
    } catch (err) {
      showToast('error', 'Network error. Could not connect to server.');
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${cat.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        showToast('success', 'Category deleted successfully.');
        fetchCategories();
      } else {
        // Typically a 409 Conflict if linked to courses
        showToast('error', data.message || 'Failed to delete category.');
      }
    } catch (err) {
      showToast('error', 'Network error. Could not delete category.');
    }
  };

  // Statistics calculation
  const totalCount = categories.length;
  const activeCount = categories.filter(c => c.status === 'Active').length;
  const inactiveCount = categories.filter(c => c.status === 'Inactive').length;

  // Filtering Logic
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border ${
              toast.type === 'success' 
                ? 'bg-slate-900/95 dark:bg-slate-950/95 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900/95 dark:bg-slate-950/95 border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="text-xs font-bold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-85 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a1c] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-premium-accent animate-pulse"></span>
            <span className="text-[10px] font-black text-premium-accent uppercase tracking-widest">Metadata Directory</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase mt-1">Course Categories</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Manage course tags, customize visual category symbols, define custom slugs, and control directory indexing doors.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <AdminStatCard 
          title="Total Categories" 
          value={`${totalCount}`} 
          change={`${totalCount} categories in database`} 
          isPositive={true} 
          icon={FolderOpen}
          gradient="from-violet-500/10 to-indigo-500/10"
          timeframe="catalog taxonomy"
        />
        <AdminStatCard 
          title="Active Categories" 
          value={`${activeCount}`} 
          change="Available for course cataloging" 
          isPositive={true} 
          icon={Check}
          gradient="from-emerald-500/10 to-teal-500/10"
          timeframe="public indexing active"
        />
        <AdminStatCard 
          title="Inactive Categories" 
          value={`${inactiveCount}`} 
          change="Hidden from students" 
          isPositive={false} 
          icon={X}
          gradient="from-slate-500/10 to-slate-800/10"
          timeframe="restricted mode"
        />
      </div>

      {/* Toolbar Filter */}
      <div className="rounded-2xl border border-[#1a1a1c] bg-[#0b0b0d]/90 backdrop-blur-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name, slug, description..."
            className="w-full bg-slate-50 bg-[#111114] border border-premium-border dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative self-end sm:self-auto shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-50 bg-[#111114] border border-premium-border dark:border-slate-700 rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 transition-all cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
          <div className="absolute right-3.5 top-2.5 pointer-events-none text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Categories Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-2xl border border-[#1a1a1c] bg-[#0b0b0d] p-5 animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-10 w-10 rounded-xl bg-slate-200 bg-[#111114]"></div>
                <div className="h-5 w-16 rounded-full bg-slate-200 bg-[#111114]"></div>
              </div>
              <div className="h-4 w-3/4 rounded bg-slate-200 bg-[#111114]"></div>
              <div className="h-3 w-5/6 rounded bg-slate-200 bg-[#111114]"></div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/100/5 p-6 text-center text-red-500">
          <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <p className="text-xs font-bold">{errorMessage}</p>
          <Button variant="outline" size="sm" onClick={fetchCategories} className="mt-3 mx-auto">
            Retry Connection
          </Button>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(cat => {
            const IconComponent = ICON_MAP[cat.icon] || Layers;
            return (
              <motion.div
                key={cat.id}
                layout
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative overflow-hidden rounded-2xl border border-[#1a1a1c] bg-[#0b0b0d] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-premium-accent/10 text-premium-accent flex items-center justify-center border border-premium-accent/10">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      cat.status === 'Active' 
                        ? 'bg-emerald-500/100/10 text-emerald-400 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                    }`}>
                      {cat.status}
                    </span>
                  </div>

                  {/* Title & Slug */}
                  <div className="mt-4 space-y-1">
                    <h3 className="text-base font-black text-white leading-tight uppercase group-hover:text-premium-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide font-mono">
                      /{cat.slug}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850 border border-[#1a1a1c] text-slate-600 dark:text-slate-350 cursor-pointer active:scale-95 transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="flex items-center justify-center p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/100/100/10 cursor-pointer active:scale-95 transition-all"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#1a1a1c] bg-[#0b0b0d]/60 p-10 text-center">
          <FolderOpen className="w-10 h-10 mx-auto text-slate-400 opacity-60 mb-3" />
          <h3 className="text-sm font-black text-white uppercase">No categories found</h3>
          <p className="text-xs text-slate-400 mt-1">Refine your search terms or create a new taxonomy index now.</p>
          <Button variant="primary" size="sm" onClick={openCreateModal} className="mt-4 mx-auto">
            Create First Category
          </Button>
        </div>
      )}

      {/* Create / Edit Slideover Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[80]"
            />
            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-x-4 top-20 bottom-10 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:h-auto max-h-[85vh] bg-[#0b0b0d] border border-[#1a1a1c] rounded-2xl shadow-2xl z-[81] flex flex-col overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-wide">
                    {editingCategory ? 'Edit Category' : 'Create Category'}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                    Define tags and icon branding assets for the course taxonomy.
                  </p>
                </div>
                <button onClick={() => setModalOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveCategory} className="p-5 space-y-4 overflow-y-auto flex-1">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Category Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Luxury Flipping"
                    className="w-full bg-slate-50 bg-[#111114]/80 border border-premium-border dark:border-slate-700 rounded-xl py-2 px-3.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent transition-all"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">URL Slug</label>
                    {!editingCategory && (
                      <button 
                        type="button" 
                        onClick={() => setAutoSlug(prev => !prev)}
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded border transition-all ${
                          autoSlug 
                            ? 'bg-premium-accent/15 border-premium-accent/25 text-premium-accent'
                            : 'bg-slate-100 bg-[#111114] border-slate-300 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {autoSlug ? 'Auto-Sync ON' : 'Manual Edit'}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formState.slug}
                    onChange={handleSlugChange}
                    placeholder="e.g. luxury-flipping"
                    className="w-full bg-slate-50 bg-[#111114]/80 border border-premium-border dark:border-slate-700 rounded-xl py-2 px-3.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Description</label>
                  <textarea
                    rows="3"
                    value={formState.description}
                    onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Explain what topics are covered under this catalog node..."
                    className="w-full bg-slate-50 bg-[#111114]/80 border border-premium-border dark:border-slate-700 rounded-xl py-2 px-3.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent transition-all resize-none"
                  />
                </div>

                {/* Icon Grid Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Catalog Icon Asset</label>
                  <div className="grid grid-cols-5 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800">
                    {AVAILABLE_ICONS.map(iconName => {
                      const SelectedIcon = ICON_MAP[iconName];
                      const isSelected = formState.icon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setFormState(prev => ({ ...prev, icon: iconName }))}
                          className={`h-11 rounded-lg flex flex-col items-center justify-center gap-1 border transition-all ${
                            isSelected 
                              ? 'bg-premium-accent text-white border-premium-accent shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
                              : 'bg-white bg-[#111114] text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 border-slate-200 dark:border-slate-750'
                          }`}
                          title={iconName}
                        >
                          <SelectedIcon className="w-4 h-4" />
                          <span className="text-[8px] font-semibold tracking-tighter truncate max-w-full px-1">{iconName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Directory Visibility Status</label>
                  <div className="flex gap-3">
                    {['Active', 'Inactive'].map(statusVal => (
                      <button
                        key={statusVal}
                        type="button"
                        onClick={() => setFormState(prev => ({ ...prev, status: statusVal }))}
                        className={`flex-1 py-2 px-3.5 rounded-xl border text-xs font-black uppercase tracking-wide cursor-pointer transition-all ${
                          formState.status === statusVal
                            ? statusVal === 'Active'
                              ? 'bg-emerald-500/100/10 text-emerald-400 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
                            : 'bg-slate-50 bg-[#111114]/80 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {statusVal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Panel */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-850 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 cursor-pointer"
                  >
                    Save Category
                  </Button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
