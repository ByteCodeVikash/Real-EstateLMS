import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Play, Clock, BookOpen, Star, Lock, SlidersHorizontal, ChevronDown, Sparkles, Trophy, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
  const { token, API_BASE_URL } = useAuth();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('highest-progress');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedLockedCourse, setSelectedLockedCourse] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const fetchCoursesAndEnrollments = async () => {
    try {
      const [allRes, enrolledRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/courses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/my-courses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (allRes.ok) {
        const allData = await allRes.json();
        if (allData.status === 'success') {
          setAllCourses(allData.data.courses || []);
        }
      }
      if (enrolledRes.ok) {
        const enrolledData = await enrolledRes.json();
        if (enrolledData.status === 'success') {
          setEnrolledCourses(enrolledData.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCoursesAndEnrollments();
    }
  }, [token, API_BASE_URL]);

  // Handle course enrollment
  const handleEnroll = async (courseId) => {
    if (isEnrolling) return;
    setIsEnrolling(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: courseId })
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        // Re-fetch courses and enrollments to reflect active status
        await fetchCoursesAndEnrollments();
        setShowUpgradeModal(false);
      } else {
        alert(data.message || 'Enrollment failed.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Network error. Failed to enroll in course.');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Build categories list dynamically
  const categories = useMemo(() => {
    const list = new Set(['All']);
    allCourses.forEach(c => {
      if (c.category_name) {
        list.add(c.category_name);
      }
    });
    return Array.from(list);
  }, [allCourses]);

  // Combine database courses with enrollment status
  const courseList = useMemo(() => {
    return allCourses.map(course => {
      const enrollment = enrolledCourses.find(e => e.id === course.id);
      const isLocked = !enrollment;
      
      // Map premium thumbnails if using short color keys
      let image = course.thumbnail;
      if (image === 'grad-violet') {
        image = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800";
      } else if (image === 'grad-blue') {
        image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800";
      } else if (!image) {
        image = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
      }

      // Instructor Avatar
      let instructorAvatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100";
      let instructorRole = "Academy Instructor";
      if (stripos(course.mentor_name, 'Sarah') !== -1) {
        instructorRole = "Behavioral Sales Coach";
        instructorAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100";
      } else if (stripos(course.mentor_name, 'Robert') !== -1 || stripos(course.mentor_name, 'Sterling') !== -1) {
        instructorRole = "High-Ticket Sales Veteran";
        instructorAvatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100";
      } else if (stripos(course.mentor_name, 'Elena') !== -1) {
        instructorRole = "Ultra-Luxury Broker";
        instructorAvatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100";
      }

      // Helper function for stripos equivalent in JS
      function stripos(f, s) {
        if (!f || !s) return -1;
        return f.toLowerCase().indexOf(s.toLowerCase());
      }

      return {
        id: course.id,
        title: course.title,
        subtitle: course.description,
        instructor: course.mentor_name || 'Robert Sterling',
        instructorRole: instructorRole,
        instructorAvatar: instructorAvatar,
        category: course.category_name || 'General',
        specializationBadge: course.category_name || 'General',
        progress: enrollment ? enrollment.progress : 0,
        duration: course.duration || '12 Hours',
        lessons: course.modules ? course.modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) : 0,
        status: isLocked ? 'Locked' : 'Active',
        isPremium: course.price > 0,
        image: image,
        description: course.description
      };
    });
  }, [allCourses, enrolledCourses]);

  // Filters logic
  let filteredCourses = courseList.filter(course => {
    const matchesCategory = filter === 'All' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.specializationBadge.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Active Only') matchesStatus = course.status === 'Active';
    if (statusFilter === 'Locked Only') matchesStatus = course.status === 'Locked';

    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Sorting logic
  filteredCourses.sort((a, b) => {
    if (sortBy === 'highest-progress') return b.progress - a.progress;
    if (sortBy === 'lowest-progress') return a.progress - b.progress;
    if (sortBy === 'title-az') return a.title.localeCompare(b.title);
    return 0;
  });

  const handleUnlockClick = (course) => {
    setSelectedLockedCourse(course);
    setShowUpgradeModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      } 
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 text-left animate-pulse">
        {/* Top bar skeleton */}
        <div className="bg-[#0b0b0d] rounded-3xl p-8 border border-premium-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 flex-1 w-full">
            <div className="h-9 bg-[#16161a]/80 rounded-xl w-64"></div>
            <div className="h-4 bg-[#16161a]/60 rounded-lg w-96 max-w-full"></div>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="h-11 bg-[#16161a]/80 rounded-xl w-48"></div>
            <div className="h-11 bg-[#16161a]/80 rounded-xl w-36"></div>
          </div>
        </div>

        {/* Categories skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-10 bg-[#16161a]/80 rounded-xl w-24 shrink-0"></div>
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#0b0b0d] border border-premium-border rounded-3xl overflow-hidden h-[480px] flex flex-col">
              <div className="h-48 bg-[#16161a]/80 w-full relative">
                <div className="absolute top-4 right-4 w-8 h-8 bg-[#111114] rounded-lg"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-4 bg-[#16161a]/80 rounded-md w-20"></div>
                  <div className="h-6 bg-[#16161a]/90 rounded-md w-5/6"></div>
                  <div className="h-4 bg-[#16161a]/60 rounded-md w-full"></div>
                  <div className="flex items-center gap-2.5 pt-2">
                    <div className="w-8 h-8 rounded-full bg-[#16161a]/80"></div>
                    <div className="h-4 bg-[#16161a]/70 rounded-md w-32"></div>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-[#1a1a1c]">
                  <div className="flex justify-between">
                    <div className="h-4 bg-[#16161a]/60 rounded-md w-16"></div>
                    <div className="h-4 bg-[#16161a]/60 rounded-md w-20"></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-3 bg-[#16161a]/60 rounded-md w-24"></div>
                      <div className="h-3 bg-[#16161a]/60 rounded-md w-8"></div>
                    </div>
                    <div className="h-2 w-full bg-[#111114] rounded-full"></div>
                  </div>
                  <div className="h-11 bg-[#16161a]/80 rounded-xl w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left relative min-h-screen pb-12">
      
      {/* Top Filter Control Panel */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-[#0b0b0d] p-8 rounded-3xl border border-premium-border shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-shadow duration-300">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-premium-accent/10 text-premium-accent text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-premium-accent/15">
              Academy Portal
            </span>
            <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold bg-amber-500/100/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
              <Trophy className="w-3 h-3 text-amber-500 fill-current" />
              Elite Access
            </span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight tracking-tight mt-1">BG Realty Training Academy</h1>
          <p className="text-xs text-slate-400 font-bold tracking-wide">
            Manage your credentials, underwriting syllabus blueprints, and elite closing strategies
          </p>
        </div>

        {/* Global Control Inputs */}
        <div className="flex flex-wrap items-center gap-4 flex-1 max-w-3xl justify-end w-full">
          {/* Search bar */}
          <div className="relative group flex-1 min-w-[240px] w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-premium-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search by course name, mentor, tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0f0f12]/70 border border-premium-border rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/10 focus:bg-[#0b0b0d] w-full transition-all font-semibold hover:border-slate-300"
            />
          </div>

          {/* Progress Sorting */}
          <div className="relative shrink-0">
            <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0f0f12] border border-premium-border rounded-xl py-3 pl-10 pr-9 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-premium-accent/10 hover:bg-[#111114]/50 cursor-pointer appearance-none transition-all"
            >
              <option value="highest-progress">Sort: Highest Progress</option>
              <option value="lowest-progress">Sort: Lowest Progress</option>
              <option value="title-az">Sort: Alphabetical A-Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* License Status Filter */}
          <div className="relative shrink-0">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0f0f12] border border-premium-border rounded-xl py-3 pl-10 pr-9 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-premium-accent/10 hover:bg-[#111114]/50 cursor-pointer appearance-none transition-all"
            >
              <option value="All">All Licenses</option>
              <option value="Active Only">Active Syllabus</option>
              <option value="Locked Only">Locked Tier Modules</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Tabs Section */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3.5 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 shrink-0 uppercase tracking-wider border cursor-pointer ${
              filter === cat 
                ? 'bg-gradient-premium border-premium-accent/20 text-white shadow-lg shadow-blue-500/15' 
                : 'bg-[#0b0b0d] border-premium-border text-premium-text hover:bg-[#0f0f12] hover:text-white hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredCourses.map((course, index) => {
            const isLocked = course.status === 'Locked';
            const isCompleted = course.progress === 100;

            return (
              <motion.div
                key={course.id}
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative"
              >
                <GlassCard className="p-0 overflow-hidden flex flex-col h-full bg-[#0b0b0d] border border-premium-border shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:border-premium-accent/30 hover:-translate-y-2 transition-all duration-300 relative rounded-3xl">
                  
                  {/* Card Thumbnail Area */}
                  <div className="relative h-52 overflow-hidden bg-[#111114] shrink-0 border-b border-[#1a1a1c]">
                    <img 
                      src={course.image} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                        isLocked ? 'opacity-40 blur-[1px] grayscale-[30%]' : ''
                      }`} 
                      alt={course.title}
                    />
                    
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent"></div>

                    {/* Premium Badges */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 items-end">
                      {course.isPremium && (
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-md border border-amber-300/30 flex items-center gap-1 animate-pulse-slow">
                          <Sparkles className="w-3 h-3 fill-current" />
                          <span>Elite Course</span>
                        </div>
                      )}
                      
                      {/* Access Status Pill on image */}
                      <Badge variant={isCompleted ? 'success' : isLocked ? 'danger' : 'info'} className="text-[9px] font-black uppercase shadow-sm">
                        {isLocked ? 'Locked Tier' : isCompleted ? 'Completed' : 'Active'}
                      </Badge>
                    </div>

                    {/* Left Bottom Tag */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="bg-slate-950/80 backdrop-blur-md text-white border border-white/10 px-3 py-1 rounded-lg text-[9px] font-black tracking-wider uppercase">
                        {course.specializationBadge}
                      </span>
                    </div>

                    {/* Locked overlay styling */}
                    {isLocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-[2px] z-20 space-y-4 p-6 text-center transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                          <Lock className="w-5.5 h-5.5 text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 leading-none">Upgrade Credentials Required</span>
                          <p className="text-[11px] text-slate-300 font-bold leading-relaxed max-w-[210px] mx-auto">
                            Requires Elite Syllabus Enrollment. Unlock instantly to start.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Main Info Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Category & Title */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black text-premium-accent uppercase tracking-widest">
                          {course.category}
                        </span>
                        <h3 className="font-black text-lg text-white leading-snug group-hover:text-premium-accent transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-premium-text/95 font-medium leading-relaxed line-clamp-2">
                          {course.subtitle}
                        </p>
                      </div>

                      {/* Instructor Avatar Card Block */}
                      <div className="flex items-center gap-3 bg-[#0f0f12]/50 p-2.5 rounded-xl border border-[#1a1a1c]">
                        <div className="w-9 h-9 rounded-full border border-[#1a1a1c] overflow-hidden shadow-sm shrink-0">
                          <img 
                            src={course.instructorAvatar} 
                            alt={course.instructor}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-white">{course.instructor}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{course.instructorRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress details and CTAs */}
                    <div className="space-y-4 pt-4 border-t border-[#1a1a1c]/80">
                      
                      {/* Meta information tags */}
                      <div className="flex items-center justify-between text-xs text-premium-text font-bold">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-4 h-4 text-premium-accent" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <BookOpen className="w-4 h-4 text-premium-accent" />
                          <span>{course.lessons} Lectures</span>
                        </div>
                      </div>

                      {/* Premium Progress Section */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                          <span className="text-slate-400">Blueprint Syllabus Progress</span>
                          <span className={`${isCompleted ? 'text-premium-emerald' : 'text-premium-accent'} font-black`}>
                            {course.progress}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#0f0f12] border border-[#1e1e22]/50 rounded-full overflow-hidden relative shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full rounded-full ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                                : 'bg-gradient-to-r from-blue-600 to-premium-accent shadow-[0_0_8px_rgba(37,99,235,0.3)]'
                            }`}
                          ></motion.div>
                        </div>
                      </div>

                      {/* Course CTAs Buttons */}
                      {isLocked ? (
                        <Button 
                          variant="outline" 
                          onClick={() => handleUnlockClick(course)}
                          className="w-full text-xs uppercase tracking-widest font-black border-amber-200/60 bg-amber-500/8 hover:bg-amber-500/10 hover:border-amber-400 hover:text-amber-400 h-12 rounded-xl flex items-center justify-center gap-2 shadow-none cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-amber-500" />
                          Unlock Course
                        </Button>
                      ) : (
                        <Link to={`/watch/${course.id}`} className="block w-full">
                          <Button 
                            variant={isCompleted ? 'outline' : 'primary'} 
                            className="w-full group text-xs uppercase tracking-widest font-black h-12 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                          >
                            <span>{isCompleted ? 'Review Syllabus' : 'Resume Syllabus'}</span>
                            <Play className="w-4 h-4 fill-current group-hover:translate-x-1.5 transition-transform duration-300" />
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
      </motion.div>

      {/* Fallback Empty Screen */}
      {filteredCourses.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 flex flex-col items-center justify-center text-center bg-[#0b0b0d] rounded-3xl border border-premium-border shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
        >
          <div className="w-16 h-16 bg-[#0f0f12] border border-premium-border rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Search className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-xl font-black text-white mb-1.5">No Matching Academy Blueprints</h3>
          <p className="text-xs text-premium-text max-w-sm leading-relaxed font-bold">
            We couldn't locate any credentials matching your exact search text or active filter options.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 text-[10px] uppercase font-black tracking-wider bg-[#0b0b0d] h-11 px-5 rounded-xl border-premium-accent/20 hover:border-premium-accent text-premium-accent"
            onClick={() => { setFilter('All'); setSearchQuery(''); setStatusFilter('All'); }}
          >
            Reset Active Filters
          </Button>
        </motion.div>
      )}

      {/* Ultra-Premium Upgrade Drawer Modal */}
      <AnimatePresence>
        {showUpgradeModal && selectedLockedCourse && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b0b0d] border border-[#1a1a1c] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-8 relative"
            >
              {/* Premium Glow effect */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-premium-accent/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-premium-violet/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Button */}
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-extrabold text-lg cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center space-y-6">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-200/50 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <Sparkles className="w-7 h-7 text-amber-500 fill-current animate-pulse" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-premium-accent">BG Realty Premium Syllabus</span>
                  <h2 className="text-2xl font-black text-white">{selectedLockedCourse.title}</h2>
                  <p className="text-xs text-premium-text/90 leading-relaxed font-bold px-4">
                    Upgrade to our Elite Credentials Tier to unlock high-yield multi-family underwriting models, off-market HNW leads list, and private CRE coaching modules.
                  </p>
                </div>

                {/* Offer value bullet points */}
                <div className="bg-[#0f0f12] border border-[#1a1a1c] rounded-2xl p-4 text-left space-y-3">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-premium-emerald mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-white">Access Private Resource Kits</p>
                      <p className="text-[10px] text-slate-400 font-bold">Download customized deal waterfalls and off-market pitch decks.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-premium-emerald mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-white">Weekly Live Mentorship Sessions</p>
                      <p className="text-[10px] text-slate-400 font-bold">1-on-1 Q&A deal board reviews with Robert Sterling & Elena Rodriguez.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1 text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl"
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    Close Portal
                  </Button>
                  <Button 
                    variant="gold" 
                    disabled={isEnrolling}
                    className="flex-1 text-xs uppercase tracking-wider font-extrabold h-12 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/10 bg-gradient-premium disabled:opacity-50"
                    onClick={() => handleEnroll(selectedLockedCourse.id)}
                  >
                    <span>{isEnrolling ? 'Unlocking...' : 'Unlock Instantly'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Need immediate support? Contact billing@bgrealtyacademy.com
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyCourses;
