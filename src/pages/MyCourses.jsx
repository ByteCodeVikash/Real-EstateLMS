import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Clock, BookOpen, Star, Lock, SlidersHorizontal, ChevronDown, CheckCircle } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('highest-progress');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Simulated premium stagger load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['All', 'Investment', 'Sales Coaching', 'Negotiations', 'Luxury Marketing', 'Lead Gen'];

  const courseList = [
    {
      id: 1,
      title: "Real Estate Sales Masterclass: Objections & Pitching",
      instructor: "Robert Sterling",
      category: "Sales Coaching",
      progress: 75,
      duration: "12 Hours",
      lessons: 24,
      status: "Active",
      isPremium: true,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      description: "Master high-ticket closing structures, property value pitches, and objection bypass scripts."
    },
    {
      id: 2,
      title: "Property Investment Blueprint: Deal Underwriting & Excel",
      instructor: "Marcus Thorne",
      category: "Investment",
      progress: 40,
      duration: "18 Hours",
      lessons: 36,
      status: "Active",
      isPremium: true,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      description: "Build active spreadsheets for multi-family property assets modeling, GP/LP waterfalls, and DSCR metrics."
    },
    {
      id: 3,
      title: "Broker Closing Psychology: Creative Financing anchor",
      instructor: "Robert Sterling",
      category: "Negotiations",
      progress: 95,
      duration: "8 Hours",
      lessons: 16,
      status: "Active",
      isPremium: false,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      description: "Learn advanced neuro-anchoring sales matrices and high-urgency closing signatures."
    },
    {
      id: 4,
      title: "Luxury Housing Market Training: Elite Brokerage branding",
      instructor: "Elena Rodriguez",
      category: "Luxury Marketing",
      progress: 0,
      duration: "10 Hours",
      lessons: 15,
      status: "Locked Tier",
      isPremium: true,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      description: "Uncover HNW networking circles, secret off-market listing templates, and brand styling codes."
    },
    {
      id: 5,
      title: "Real Estate Lead Funnel: Hyper-Local Ad Blueprints",
      instructor: "Elena Rodriguez",
      category: "Lead Gen",
      progress: 15,
      duration: "6 Hours",
      lessons: 12,
      status: "Active",
      isPremium: false,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
      description: "Launch targeted local campaigns, landing lead magnets, and automated high-response CRMs."
    }
  ];

  // Filters logic
  let filteredCourses = courseList.filter(course => {
    const matchesCategory = filter === 'All' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Active Only') matchesStatus = course.status === 'Active';
    if (statusFilter === 'Locked Only') matchesStatus = course.status === 'Locked Tier';

    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Sorting logic
  filteredCourses.sort((a, b) => {
    if (sortBy === 'highest-progress') return b.progress - a.progress;
    if (sortBy === 'lowest-progress') return a.progress - b.progress;
    if (sortBy === 'title-az') return a.title.localeCompare(b.title);
    return 0;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="flex justify-between items-center h-20 bg-slate-100 rounded-2xl w-full"></div>
        <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-96 bg-slate-100 rounded-3xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Top Filter Megabar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-premium-border shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-premium-heading leading-tight">My Academy Blueprints</h1>
          <p className="text-xs text-slate-400 font-bold">Manage, sort, and resume your elite property credentials</p>
        </div>

        {/* Filters and Inputs Grid */}
        <div className="flex flex-wrap items-center gap-4 flex-1 max-w-3xl justify-end">
          {/* Search bar */}
          <div className="relative group flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-premium-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search blueprint files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-premium-border rounded-xl py-2.5 pl-11 pr-4 text-xs text-premium-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:bg-white w-full transition-all font-semibold"
            />
          </div>

          {/* Progress Sorting Dropdown */}
          <div className="relative shrink-0">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-premium-border rounded-xl py-2.5 pl-9 pr-8 text-[11px] font-black uppercase text-slate-600 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer appearance-none"
            >
              <option value="highest-progress">Highest Progress</option>
              <option value="lowest-progress">Lowest Progress</option>
              <option value="title-az">Course A-Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-premium-border rounded-xl py-2.5 pl-9 pr-8 text-[11px] font-black uppercase text-slate-600 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer appearance-none"
            >
              <option value="All">All Licenses</option>
              <option value="Active Only">Active Only</option>
              <option value="Locked Only">Locked Only</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 shrink-0 uppercase tracking-wider border cursor-pointer ${
              filter === cat 
                ? 'bg-gradient-premium border-premium-accent/20 text-white shadow-lg shadow-blue-500/10' 
                : 'bg-white border border-premium-border text-premium-text hover:bg-slate-50 hover:text-premium-heading'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid containing high-fidelity course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredCourses.map((course, index) => {
            const isLocked = course.status === 'Locked Tier';

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <GlassCard className="p-0 overflow-hidden flex flex-col h-full group border border-premium-border bg-white shadow-sm hover:shadow-[0_12px_35px_rgba(15,23,42,0.05)] hover:border-premium-accent/20 transition-all duration-300 relative rounded-3xl">
                  
                  {/* Card Thumbnail / Header */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 border-b border-premium-border shrink-0">
                    <img 
                      src={course.image} 
                      className={`w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ${
                        isLocked ? 'opacity-30 blur-[1px] grayscale' : ''
                      }`} 
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    
                    {/* Premium Gold Badge Star */}
                    {course.isPremium && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/30 p-1.5 rounded-xl">
                          <Star className="w-4.5 h-4.5 text-premium-accent fill-current" />
                        </div>
                      </div>
                    )}

                    {/* Highly Polished Locked Screen Cover Overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20 space-y-3 p-6 text-center">
                        <div className="w-11 h-11 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center shadow-sm">
                          <Lock className="w-5 h-5 text-premium-accent" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-black tracking-widest text-premium-accent leading-none">Elite License Required</span>
                          <p className="text-[10px] text-slate-400 font-bold leading-normal max-w-[180px]">Contact enrollment mentors to unlock this CRE syllabus module.</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <Badge variant={course.progress === 100 ? 'success' : isLocked ? 'danger' : 'premium'} className="text-[8px] font-black uppercase">
                        {isLocked ? 'Locked' : course.progress === 100 ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Description Elements */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="font-bold text-base text-premium-heading group-hover:text-premium-accent transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <span>Mentor: <strong className="text-slate-500">{course.instructor}</strong></span>
                      </div>
                      <p className="text-[11px] text-premium-text/90 line-clamp-2 leading-relaxed font-medium">{course.description}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-premium-text font-black">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-4 h-4 text-premium-accent" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <BookOpen className="w-4 h-4 text-premium-accent" />
                          <span>{course.lessons} Lectures</span>
                        </div>
                      </div>

                      {/* Course Progress Indicators */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                          <span className="text-slate-400">Blueprint Progress</span>
                          <span className="text-premium-accent">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 border border-slate-200/40 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="h-full bg-premium-accent rounded-full"
                          ></motion.div>
                        </div>
                      </div>

                      {/* CTA Controls */}
                      {isLocked ? (
                        <Button variant="outline" className="w-full text-[10px] uppercase tracking-widest font-black border-premium-border text-slate-400 h-11 rounded-xl cursor-not-allowed shadow-none" disabled>
                          Access Locked
                        </Button>
                      ) : (
                        <Link to={`/watch/${course.id}`} className="block w-full">
                          <Button variant="primary" className="w-full group text-xs uppercase tracking-wider font-black h-11 rounded-xl">
                            {course.progress === 100 ? 'Review Blueprint' : 'Resume Syllabus'} 
                            <Play className="ml-1.5 w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No matching courses fallback screen */}
      {filteredCourses.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-premium-border shadow-sm">
          <div className="w-14 h-14 bg-slate-50 border border-premium-border rounded-full flex items-center justify-center mb-5">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-black text-premium-heading mb-1">No Matching Blueprints</h3>
          <p className="text-xs text-premium-text max-w-xs leading-normal font-medium">We couldn't locate any matching profiles under the search tags.</p>
          <Button variant="outline" className="mt-5 text-[10px] uppercase font-black tracking-wider bg-white h-10 px-4 rounded-xl shadow-none" onClick={() => { setFilter('All'); setSearchQuery(''); setStatusFilter('All'); }}>
            Reset Filter Desk
          </Button>
        </div>
      )}

    </div>
  );
};

export default MyCourses;
