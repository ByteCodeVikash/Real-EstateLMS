import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, BookOpen, Tag, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PublicNavbar } from '../components/Layout';
import { mockData } from '../data/mockData';

/* ─── Coming Soon Placeholder Data ─────────────────────────────── */
const COMING_SOON_COURSES = [
  {
    id: 'cs-1',
    title: 'RERA Certification Program',
    category: 'Certifications',
    description: 'Complete RERA compliance training for agents, developers, and brokers across India.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    price: 4999,
  },
  {
    id: 'cs-2',
    title: 'Luxury Real Estate Sales',
    category: 'Sales',
    description: 'Master high-ticket luxury mandates, HNI client psychology, and premium listing strategies.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    price: 6999,
  },
  {
    id: 'cs-3',
    title: 'Commercial Real Estate Mastery',
    category: 'Investment',
    description: 'Advanced commercial leasing, cap rate mastery, and institutional deal structuring.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    price: 5999,
  },
  {
    id: 'cs-4',
    title: 'Real Estate Marketing with AI',
    category: 'Marketing',
    description: 'Use AI tools, ChatGPT workflows, and automation to scale your real estate lead pipeline.',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800',
    price: 3999,
  },
  {
    id: 'cs-5',
    title: 'CRM for Real Estate Agents',
    category: 'Tools',
    description: 'Set up, automate, and master CRM systems built specifically for real estate brokerages.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    price: 2499,
  },
  {
    id: 'cs-6',
    title: 'Property Investment Advanced',
    category: 'Investment',
    description: 'Deep dive into portfolio construction, REITs, syndication waterfalls, and exit strategies.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    price: 7999,
  },
  {
    id: 'cs-7',
    title: 'Real Estate Lead Generation',
    category: 'Marketing',
    description: 'Build high-converting funnels, Meta and Google ad campaigns, and referral systems.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    price: 3499,
  },
];

/* ─── Category config ────────────────────────────────────────────── */
const CATEGORY_SECTIONS = [
  { key: 'All',           label: 'All Courses' },
  { key: 'Investment',    label: 'Investment Courses' },
  { key: 'Sales',         label: 'Real Estate Sales' },
  { key: 'Marketing',     label: 'Marketing & Lead Gen' },
  { key: 'Certifications',label: 'Professional Certifications' },
];

/* ─── Animation variants ─────────────────────────────────────────── */
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } } };

/* ─── Thumbnail helper ───────────────────────────────────────────── */
const resolveThumbnail = (src) => {
  if (!src || src === 'grad-violet') return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800';
  if (src === 'grad-blue') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
  if (!src.startsWith('http')) return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';
  return src;
};

/* ─── Section header ─────────────────────────────────────────────── */
const SectionHeader = ({ title, count, isDarkMode }) => (
  <div className="flex items-end justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#E5C76B]" />
      <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0b0b0d]'}`}>{title}</h2>
    </div>
    {count != null && (
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        {count} Course{count !== 1 ? 's' : ''}
      </span>
    )}
  </div>
);

/* ─── Skeleton loader card ───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-[#0b0b0d] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
    <div className="h-48 bg-[#16161a]" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-[#16161a] rounded w-3/4" />
      <div className="h-11 bg-[#16161a] rounded-xl mt-4" />
    </div>
  </div>
);

/* ─── Active Course Card (matches Landing Page exactly) ──────────── */
const ActiveCourseCard = ({ course, isDarkMode, onBuyNow }) => {
  const price = parseFloat(course.price);
  const thumbnail = resolveThumbnail(course.thumbnail || course.image);
  const themeCard      = isDarkMode ? 'bg-[#0d0d10] border border-white/[0.06]' : 'bg-white border border-black/[0.06] shadow-sm';
  const themeCardHover = isDarkMode ? 'hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_rgba(212,175,55,0.08)]' : 'hover:border-[#D4AF37]/40 hover:shadow-[0_20px_50px_rgba(212,175,55,0.12)]';
  const themeTitle     = isDarkMode ? 'text-white' : 'text-[#0b0b0d]';

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -8 }} className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${themeCard} ${themeCardHover}`}>
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#0d0d10]' : 'from-white'} via-transparent to-transparent`} />

        {/* Price Badge — top right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-[#D4AF37] text-[#050505] font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Free'}
          </span>
        </div>

        {/* Category — bottom left */}
        {(course.category_name || course.category) && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-[#050505]/80 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase">
              {course.category_name || course.category}
            </span>
          </div>
        )}

        {/* Premium badge — top left */}
        {price > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gradient-to-r from-[#0A66C2] to-[#1E88E5] text-white font-extrabold text-[9px] uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Premium
            </span>
          </div>
        )}
      </div>

      {/* Card Body — Name + Buy Now only */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className={`text-base font-black transition-colors duration-300 leading-snug group-hover:text-[#D4AF37] ${themeTitle}`}>
            {course.title}
          </h3>
        </div>
        <div>
          <Link to={`/courses/${course.id}`} className="block">
            <button
              id={`buy-now-${course.id}`}
              onClick={onBuyNow ? (e) => { e.preventDefault(); onBuyNow(course.id); } : undefined}
              className="w-full py-3 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all duration-300 border flex items-center justify-center gap-2 cursor-pointer bg-[#D4AF37] border-transparent text-[#050505] hover:bg-[#E5C76B] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Buy Now
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Coming Soon Card (same layout, disabled CTA) ───────────────── */
const ComingSoonCard = ({ course, isDarkMode }) => {
  const price = parseFloat(course.price);
  const themeCard  = isDarkMode ? 'bg-[#0d0d10] border border-white/[0.06]' : 'bg-white border border-black/[0.06] shadow-sm';
  const themeTitle = isDarkMode ? 'text-white/60' : 'text-[#0b0b0d]/60';

  return (
    <motion.div variants={fadeUp} className={`group flex flex-col rounded-2xl overflow-hidden ${themeCard} opacity-80`}>
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover grayscale-[40%]" />
        <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#0d0d10]' : 'from-white'} via-transparent to-transparent`} />

        {/* Coming Soon badge — top left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#9B59B6] text-white font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
            <Clock className="w-2.5 h-2.5" />
            Coming Soon
          </span>
        </div>

        {/* Price teaser — top right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/10 backdrop-blur-md text-white/70 border border-white/10 font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Free'}
          </span>
        </div>

        {/* Category — bottom left */}
        {course.category && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-[#050505]/80 backdrop-blur-md text-white/60 border border-white/10 px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase">
              {course.category}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className={`text-base font-black leading-snug ${themeTitle}`}>
            {course.title}
          </h3>
        </div>
        <div>
          <button
            disabled
            className="w-full py-3 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl border flex items-center justify-center gap-2 cursor-not-allowed bg-white/5 border-white/10 text-white/30"
          >
            <Clock className="w-3.5 h-3.5" />
            Coming Soon
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────────── */
const PublicCoursesPage = () => {
  const { API_BASE_URL, user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [courses, setCourses]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  /* Fetch live courses — fall back to mockData if API returns nothing */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        if (res.ok) {
          const data = await res.json();
          const apiCourses = data?.data?.courses || [];
          // Use API courses if available, otherwise fall back to mockData
          if (apiCourses.length > 0) {
            setCourses(apiCourses);
          } else {
            // Normalise mockData shape to match API shape
            const fallback = mockData.courses.map(c => ({
              ...c,
              category_name: c.category,
              thumbnail: c.image,
              mentor_name: c.instructor,
            }));
            setCourses(fallback);
          }
        } else {
          const fallback = mockData.courses.map(c => ({
            ...c, category_name: c.category, thumbnail: c.image, mentor_name: c.instructor,
          }));
          setCourses(fallback);
        }
      } catch (err) {
        console.error('Failed to fetch courses, using mockData:', err);
        const fallback = mockData.courses.map(c => ({
          ...c, category_name: c.category, thumbnail: c.image, mentor_name: c.instructor,
        }));
        setCourses(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [API_BASE_URL]);

  /* Filter live courses */
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const cat = c.category_name || c.category || '';
      const matchesCat = activeFilter === 'All' || cat === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        c.mentor_name?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [courses, searchQuery, activeFilter]);

  /* Filter coming-soon courses */
  const filteredComingSoon = useMemo(() => {
    return COMING_SOON_COURSES.filter(c => {
      const matchesCat = activeFilter === 'All' || c.category === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  const handleBuyNow = (courseId) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/courses/${courseId}` } } });
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  /* Dynamic category pills from live data */
  const liveCategories = useMemo(() => {
    const set = new Set();
    courses.forEach(c => { if (c.category_name) set.add(c.category_name); });
    return Array.from(set);
  }, [courses]);

  const allFilterKeys = ['All', ...new Set([...liveCategories, ...COMING_SOON_COURSES.map(c => c.category)])];

  /* Theme tokens */
  const bg        = isDarkMode ? 'bg-[#050505]'   : 'bg-[#f8f8f8]';
  const headerBg  = isDarkMode ? 'bg-[#0b0b0d]'   : 'bg-white';
  const border    = isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.06]';
  const inputBg   = isDarkMode ? 'bg-[#0b0b0d] border-white/[0.08] text-white placeholder-slate-500' : 'bg-white border-black/10 text-[#0b0b0d] placeholder-slate-400';
  const dividerBg = isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.06]';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* ── Full Landing-Page-identical Navbar ── */}
      <PublicNavbar />

      {/* ── Page Header ── */}
      <div className={`relative ${headerBg} border-b ${border} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/5 via-transparent to-[#D4AF37]/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#D4AF37]/4 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#D4AF37]">Premium Curriculum</span>
          </div>
          <h1 className={`text-3xl md:text-5xl font-black leading-tight tracking-tight mb-3 ${isDarkMode ? 'text-white' : 'text-[#0b0b0d]'}`}>
            Explore Our{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-xl leading-relaxed">
            Browse expert-led real estate training programs. Purchase a course for full access — no subscription required.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-14">

        {/* ── Search + Category Filters ── */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 transition-all ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {allFilterKeys.map(key => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeFilter === key
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] text-[#050505] border-transparent shadow-[0_4px_16px_rgba(212,175,55,0.25)]'
                    : isDarkMode
                      ? 'bg-[#0b0b0d] border-white/[0.08] text-slate-400 hover:border-[#D4AF37]/40 hover:text-white'
                      : 'bg-white border-black/10 text-slate-500 hover:border-[#D4AF37]/40 hover:text-[#0b0b0d]'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* ── Available Courses ── */}
        <section>
          <SectionHeader
            title={activeFilter === 'All' ? 'Available Courses' : `${activeFilter} — Available`}
            count={loading ? null : filteredCourses.length}
            isDarkMode={isDarkMode}
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className={`py-16 flex flex-col items-center text-center rounded-3xl border border-dashed ${dividerBg}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-[#111115] border border-white/[0.06]' : 'bg-white border border-black/[0.06]'}`}>
                <Search className="w-5 h-5 text-slate-500" />
              </div>
              <h3 className={`text-base font-black mb-1 ${isDarkMode ? 'text-white' : 'text-[#0b0b0d]'}`}>No Courses Found</h3>
              <p className="text-xs text-slate-500 font-medium max-w-xs">Try a different keyword or category filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                className="mt-5 px-5 py-2 rounded-xl border border-[#D4AF37]/30 text-[10px] font-black uppercase tracking-wider text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              key={`live-${activeFilter}-${searchQuery}`}
              variants={stagger} initial="hidden" animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredCourses.map(course => (
                  <ActiveCourseCard
                    key={course.id}
                    course={course}
                    isDarkMode={isDarkMode}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* ── Divider ── */}
        {filteredComingSoon.length > 0 && (
          <div className={`border-t ${dividerBg}`} />
        )}

        {/* ── Coming Soon Section ── */}
        {filteredComingSoon.length > 0 && (
          <section>
            {/* Section header with purple badge */}
            <div className="flex items-end justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#9B59B6]" />
                <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0b0b0d]'}`}>
                  Coming Soon
                </h2>
                <span className="bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#9B59B6] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Launching Soon
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {filteredComingSoon.length} Upcoming
              </span>
            </div>

            <p className="text-sm text-slate-500 font-medium mb-8 max-w-2xl leading-relaxed">
              These courses are in development. Stay tuned — they'll be available for enrollment soon.
            </p>

            <motion.div
              key={`cs-${activeFilter}-${searchQuery}`}
              variants={stagger} initial="hidden" animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredComingSoon.map(course => (
                  <ComingSoonCard key={course.id} course={course} isDarkMode={isDarkMode} />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}

        {/* ── Footer note ── */}
        {!loading && (
          <p className="text-[11px] text-slate-600 font-bold text-center pb-4">
            {filteredCourses.length} available · {filteredComingSoon.length} coming soon
          </p>
        )}
      </div>
    </div>
  );
};

export default PublicCoursesPage;
