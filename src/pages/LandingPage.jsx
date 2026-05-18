import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, Star, ArrowRight, Play, CheckCircle, ShieldCheck, 
  ChevronDown, BookOpen, Calendar, HelpCircle, Award, Target, Trophy, 
  MapPin, Flame, Phone, Mail, Clock, ShieldAlert, ArrowUpRight, ChevronRight,
  TrendingUp, Download, Check, Shield, FileText, MessageSquare
} from 'lucide-react';
import { Button, Badge, GlassCard } from '../components/UI';
import { BJLogo } from '../components/Layout';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // States
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFaq, setActiveFaq] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 44, seconds: 52 });
  const [selectedSubTab, setSelectedSubTab] = useState('Curriculum');

  // Timer simulation for conversion optimization
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 1, minutes: 44, seconds: 52 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const courseCategories = ['All', 'Investment', 'Development', 'Luxury Marketing', 'Sales Coaching'];

  const featuredCourses = [
    {
      id: 1,
      title: "Commercial Real Estate: Investment & Underwriting Masterclass",
      description: "Master multi-family and retail assets modeling, GP/LP waterfalls, cap rates decoupling, and institutional-grade debt leverage equations.",
      duration: "6 Months",
      lectures: "96 Lectures",
      projects: "4 Deal Underwrites",
      rating: 4.9,
      reviews: 1240,
      badge: "Best Seller",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      category: "Investment",
      takeaways: ["Construct 10-year cash flows", "Perform waterfall splitting", "Leverage DSCR benchmarks"]
    },
    {
      id: 2,
      title: "High-Ticket Property Flipping & Development Blueprint",
      description: "Learn to source off-market residential assets, calculate exact ARV values, coordinate contractors, and execute high-margin exit sales.",
      duration: "4 Months",
      lectures: "72 Lectures",
      projects: "3 Live Flip Case-Studies",
      rating: 4.8,
      reviews: 842,
      badge: "Trending",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      category: "Development",
      takeaways: ["Traced off-market sourcing", "Rehab budget equations", "Distressed property underwriting"]
    },
    {
      id: 3,
      title: "Luxury Brokerage Authority: Listing & Client Acquisition",
      description: "Establish elite presence, master high-net-worth (HNW) prospecting, build video portfolios, and secure exclusive architectural listings.",
      duration: "3 Months",
      lectures: "54 Lectures",
      projects: "2 Presentation Audits",
      rating: 4.9,
      reviews: 610,
      badge: "Elite Access",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
      category: "Luxury Marketing",
      takeaways: ["HNW psychological anchoring", "Exclusive listing mandates", "Architectural marketing blueprint"]
    },
    {
      id: 4,
      title: "Real Estate Closer Masterclass: Psychological Closing Secrets",
      description: "Convert high-friction sellers, handle aggressive buyer rebuttals, structure creative financing terms, and finalize massive commissions.",
      duration: "3 Months",
      lectures: "60 Lectures",
      projects: "5 Recorded Live Audits",
      rating: 4.9,
      reviews: 955,
      badge: "New Release",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      category: "Sales Coaching",
      takeaways: ["Objection decoupling framework", "Seller-financed escrow models", "Six-figure commission closer formulas"]
    }
  ];

  const filteredCourses = activeCategory === 'All' 
    ? featuredCourses 
    : featuredCourses.filter(c => c.category === activeCategory);

  const mentors = [
    {
      name: "Robert Sterling",
      role: "Former CRE Director & Dealmaker",
      track: "Closed over $450M in commercial transactions",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
      expertIn: "Underwriting & Waterfall Models"
    },
    {
      name: "Marcus Thorne",
      role: "Founder, Thorne Equity Group",
      track: "15+ years experience, flipped 400+ single family homes",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
      expertIn: "Off-Market Sourcing & ARV"
    },
    {
      name: "Elena Rodriguez",
      role: "Elite luxury broker, Palm Beach & NYC",
      track: "Top 1% broker nationwide, closed $120M in 2025",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      expertIn: "HNW Prospecting & Listing Mandates"
    }
  ];

  const testimonials = [
    {
      quote: "BJ Reality Academy transformed my property career. In my first month after Robert's Negotiation Course, I successfully closed a $3.4M multi-family deal, netting an $85,000 commission check.",
      author: "Dustin Vance",
      deal: "Closed $3.4M Multi-Family Complex",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "Before this program, I was guessing rehab estimates. Marcus's Distressed Flipping course showed me exactly how to calculate exit ARV metrics. I flipped 4 properties this year with massive profit margins.",
      author: "Sarah Jenkins",
      deal: "Flipped 4 Properties, Average $62k profit",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const faqs = [
    {
      question: "Are these courses suitable for beginners, or do I need experience?",
      answer: "We offer comprehensive blueprints designed to take you from foundational concepts (like basic property values) to highly sophisticated strategies (such as syndication underwriting and advanced HNW negotiation tactics)."
    },
    {
      question: "Do these training programs come with recognized certification?",
      answer: "Yes. Every masterclass is fully accredited by the BJ Reality Educational Board. Upon successful completion and case-study validation, you will receive a secure digital certificate carrying a unique verification hash."
    },
    {
      question: "Is there 1-on-1 mentorship available?",
      answer: "Absolutely. Our premium tracks include bi-weekly interactive live webinars, deal underwriting review boards, and access to a secure chat group where Marcus, Robert, and Elena review student spreadsheets and active deals."
    },
    {
      question: "How long do I keep access to the platform?",
      answer: "Once enrolled, you gain lifetime access to that course's materials, including video modules, resource downloads, valuation templates, and updates reflecting future market cycle adjustments."
    }
  ];

  return (
    <div className="min-h-screen bg-premium-bg text-premium-text overflow-x-hidden selection:bg-premium-accent/10 selection:text-premium-accent font-sans">
      
      {/* 1. Sticky Premium Navbar (Navy Blue Backdrop for contrast and focus) */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-md bg-premium-dark/95 border-b border-slate-900 shadow-lg text-slate-400">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <BJLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="text-base font-black tracking-tight leading-none text-white group-hover:text-premium-accent transition-colors">
                BJ REALITY
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Training Courses
              </span>
            </div>
          </Link>

          {/* Megamenu Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-slate-400">
            <div className="relative group cursor-pointer hover:text-white flex items-center gap-1.5 py-2.5">
              <span>Courses Catalog</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
              {/* Megamenu Dropdown */}
              <div className="absolute top-11 left-0 hidden group-hover:block w-72 bg-premium-dark border border-slate-900 rounded-xl p-4 shadow-2xl z-50 text-left">
                <div className="flex flex-col gap-1.5">
                  <Link to="/courses" className="hover:text-premium-accent text-[11px] block py-2.5 px-3 rounded-lg hover:bg-slate-800/40 border-b border-slate-900/60">Commercial Underwriting</Link>
                  <Link to="/courses" className="hover:text-premium-accent text-[11px] block py-2.5 px-3 rounded-lg hover:bg-slate-800/40 border-b border-slate-900/60">High-Ticket Sourcing &amp; Flipping</Link>
                  <Link to="/courses" className="hover:text-premium-accent text-[11px] block py-2.5 px-3 rounded-lg hover:bg-slate-800/40 border-b border-slate-900/60">Luxury Listings Branding</Link>
                  <Link to="/courses" className="hover:text-premium-accent text-[11px] block py-2.5 px-3 rounded-lg hover:bg-slate-800/40">Negotiation &amp; Closing Tactics</Link>
                </div>
              </div>
            </div>
            <a href="#mentorship" className="hover:text-white transition-colors">Mentorship Program</a>
            <a href="#live-webinar" className="hover:text-white transition-colors">Live Webinars</a>
            <a href="#success" className="hover:text-white transition-colors">Success Stories</a>
          </div>

          {/* Student Portal Trigger and CTA buttons */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden sm:inline-flex">
              <Button variant="ghost" className="text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider h-10 border border-slate-800 hover:bg-slate-800/40 rounded-xl px-5">
                Student Portal
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" className="h-10 px-5 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-premium hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] text-white">
                Access Courses
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section (Contrasting Navy backdrop for high-end professional feel) */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 bg-premium-dark border-b border-slate-900 overflow-hidden text-left">
        {/* Soft Background Glowing Spotlights */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full h-[550px] opacity-15 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-blue-600 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div className="absolute top-20 right-1/4 w-[380px] h-[380px] bg-violet-600 rounded-full blur-[150px] animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="premium" className="py-2 px-4 text-[10px] tracking-widest border-violet-500/20 bg-violet-500/10 text-violet-400 font-black uppercase">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-premium-violet fill-current" /> Premium Real Estate Academy
                </span>
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white"
            >
              Accelerate Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-premium">
                Real Estate Career
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed font-semibold"
            >
              Master high-cap commercial underwriting, secure off-market listings, and close premium 
              property deals. Learn from legendary advisors managing combined transaction portfolios exceeding $1 Billion.
            </motion.p>

            {/* Premium CTA and Demo Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-2"
            >
              <Link to="/courses" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-premium hover:shadow-[0_6px_25px_rgba(37,99,235,0.3)] text-white">
                  Explore Programs
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
              <a href="#live-webinar" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 border-slate-800 hover:bg-slate-800/40 text-white text-xs font-black uppercase tracking-wider rounded-xl bg-slate-900/50 backdrop-blur-sm">
                  <Play className="w-4 h-4 fill-current text-premium-accent" /> Watch Course Demo
                </Button>
              </a>
            </motion.div>

            {/* Student Success Metrics Panel */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-8 border-t border-slate-900 flex flex-wrap items-center gap-8"
            >
              <div className="flex -space-x-3.5">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?u=alumni${i}`}
                    className="w-11 h-11 rounded-full border-2 border-slate-950 object-cover shadow-lg"
                    alt="Student Avatar"
                  />
                ))}
                <div className="w-11 h-11 rounded-full bg-gradient-premium flex items-center justify-center border-2 border-slate-950 text-[10px] font-black text-white shadow-lg">
                  +15K
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4.5 h-4.5 text-premium-accent fill-current" />
                  ))}
                  <span className="text-white font-black ml-1 text-sm">4.9 / 5.0 Rating</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-bold">Industry trusted by 15,000+ brokers and developers nationwide</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Visual Column with floating components */}
          <div className="lg:col-span-5 flex items-center justify-center relative pt-8 lg:pt-0">
            <div className="relative w-full max-w-[390px] h-[390px]">
              {/* Outer decorative glowing ring */}
              <div className="absolute inset-0 rounded-3xl border border-slate-800 bg-gradient-to-tr from-blue-600/5 to-violet-600/5 -rotate-3 scale-102"></div>
              
              {/* Main Card */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-slate-850 shadow-2xl bg-slate-950"
              >
                <img 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover opacity-35"
                  alt="Luxury Property Design"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 space-y-2 text-left">
                  <Badge variant="premium" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[9px] font-black uppercase">Special Masterclass</Badge>
                  <h3 className="text-base font-black text-white leading-snug">CRE Underwriting &amp; Leverage Bluebook</h3>
                  <p className="text-[10px] text-slate-500 font-bold">Instructed by Robert Sterling • 24.5 Hours</p>
                </div>
              </motion.div>

              {/* Floating Commission Card */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-6 -right-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 z-20 text-left"
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Closed Commission</p>
                  <p className="text-base font-black text-emerald-400">+$85,000</p>
                </div>
              </motion.div>

              {/* Floating Security Badge */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 z-20 text-left"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Academy Protection</p>
                  <p className="text-xs font-black text-white">DRM Decoupled</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trusted Students/Companies Section (Clean White Background) */}
      <section className="bg-white py-14 border-b border-premium-border text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
            Accelerating Academy Grads at Leading Brokerages &amp; Developers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['CBRE', 'COMPASS', 'RE/MAX', 'SOTHEBY\'S', 'KELLER WILLIAMS', 'COLLIERS'].map((name, i) => (
              <span key={i} className="text-lg md:text-xl font-black tracking-widest text-slate-400 hover:text-premium-heading transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Real Estate Courses (Soft Gray Section, Premium Detailed Cards) */}
      <section className="py-24 px-6 md:px-12 bg-premium-bg border-b border-premium-border" id="courses">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="text-left space-y-3">
            <Badge variant="info" className="text-[9px] font-black uppercase bg-blue-50 border border-blue-100 text-blue-600">Career Blueprints</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading leading-tight">Accredited Academy Blueprints</h2>
            <p className="text-sm text-slate-500 max-w-xl font-semibold">
              Select an industry-focused program and learn step-by-step practical real estate engineering.
            </p>
          </div>

          {/* Filter tabs categories */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide shrink-0 text-left">
            {courseCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 rounded-xl text-xs font-black tracking-wider transition-all uppercase shrink-0 border ${
                  activeCategory === cat 
                    ? 'bg-gradient-premium text-white border-transparent shadow-lg shadow-blue-500/20' 
                    : 'bg-white text-slate-400 border-premium-border hover:bg-slate-50 hover:text-premium-heading'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 text-left">
          {filteredCourses.map((course) => (
            <GlassCard key={course.id} className="p-0 overflow-hidden flex flex-col md:flex-row group border border-premium-border bg-white text-left shadow-sm rounded-3xl transition-all duration-300 hover:border-premium-accent/20">
              {/* Card Image */}
              <div className="w-full md:w-2/5 relative h-56 md:h-auto min-h-[220px] overflow-hidden shrink-0">
                <img 
                  src={course.image} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                  alt={course.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/40 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge variant="premium" className="bg-slate-900/80 text-white text-[9px] font-black uppercase">{course.badge}</Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-premium-accent uppercase font-black tracking-wider">{course.category}</span>
                    <span className="text-slate-200">•</span>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">{course.duration}</span>
                  </div>
                  <h3 className="text-xl font-black text-premium-heading group-hover:text-premium-accent transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Key Takeaways Checklist */}
                <div className="space-y-2 border-t border-slate-50 pt-4">
                  {course.takeaways.map((takeaway, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                      <Check className="w-4 h-4 text-premium-accent shrink-0" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-premium-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-premium-accent fill-current" />
                    <span className="text-xs font-black text-premium-heading">{course.rating}</span>
                    <span className="text-[10px] text-slate-400 font-black">({course.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to="/dashboard">
                      <Button variant="outline" className="h-9 px-4 text-[9px] uppercase font-black tracking-wider rounded-xl shadow-none">
                        Syllabus
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button variant="primary" className="h-9 px-4 text-[9px] uppercase font-black tracking-wider rounded-xl text-white">
                        Enroll
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 5. Why Choose BJ Reality (Clean White Background, curated HSL gradients) */}
      <section className="py-24 bg-white border-b border-premium-border text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="premium" className="text-[9px] font-black uppercase">Engineered for Action</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading">Why Learn with BJ Reality?</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              We reject high-level, generic theory. We provide actual deal audits, live spreadsheets, and accredited boards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "1-on-1 Portfolio Reviews", desc: "Gain direct support where mentors review your active local property opportunities, Excel formulas, and commercial contracts." },
              { icon: Trophy, title: "Board Accredited Badges", desc: "Our blueprints carry secure nationwide verification hashes, establishing instant credibility with sellers and brokers." },
              { icon: BookOpen, title: "Spreadsheets Blueprint Vault", desc: "Acquire lifetime license rights to our active GP/LP waterfalls, Cap Rates decoupling, and rehab budget matrices." }
            ].map((item, i) => (
              <GlassCard key={i} className="flex flex-col text-left space-y-4 p-8 bg-white hover:bg-slate-50/50 border border-premium-border/80 rounded-3xl transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-premium-accent/10 rounded-2xl flex items-center justify-center mb-2">
                  <item.icon className="text-premium-accent w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-premium-heading">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Live Webinar Banner (High-contrast deep navy container for conversion focus) */}
      <section className="py-20 px-6 md:px-12 bg-premium-bg border-b border-premium-border text-left" id="live-webinar">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-900 bg-gradient-to-r from-slate-950 to-premium-dark flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl">
            {/* Spotlight decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-premium-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="space-y-4 text-left max-w-xl">
              <span className="flex items-center gap-1.5 text-[9px] text-premium-accent uppercase font-black tracking-widest">
                <Flame className="w-4 h-4 animate-bounce" /> Bi-Weekly Live Deal Audit Session
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Live Deal Audit: NYC &amp; Dallas Multi-Family Analysis
              </h2>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Watch Robert Sterling live-underwrite real off-market 50+ unit assets. 
                Bring your local opportunities and spreadsheets to get audited live in real time.
              </p>
            </div>

            <div className="space-y-4 shrink-0 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Next Session Starts In:</p>
              <div className="flex gap-4">
                {['hours', 'minutes', 'seconds'].map((unit, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-xl font-black text-premium-accent font-mono shadow-inner">
                      {String(timeLeft[unit]).padStart(2, '0')}
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase mt-2.5 tracking-wider font-black">{unit}</span>
                  </div>
                ))}
              </div>
              <Link to="/live" className="w-full">
                <Button variant="gold" className="w-full h-12 uppercase text-[10px] font-black tracking-wider mt-4 rounded-xl">
                  Secure Live Seat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Student Testimonials (Soft Gray Background) */}
      <section className="py-24 bg-premium-bg border-b border-premium-border" id="success">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="success" className="text-[9px] font-black bg-green-50 border border-green-100 text-green-600">Alumni Ledger</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading">Verified Student Deals</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Real commission structures and flipping exit returns completed by our graduates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((test, i) => (
              <GlassCard key={i} className="flex flex-col md:flex-row gap-6 p-8 border border-premium-border bg-white shadow-sm rounded-3xl">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-premium-accent shadow-md">
                  <img src={test.avatar} className="w-full h-full object-cover" alt={test.author} />
                </div>
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-premium-heading">{test.author}</h4>
                      <Badge variant="success" className="mt-1 bg-green-50 text-green-600 border border-green-100 text-[8px] font-black">{test.deal}</Badge>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="w-3.5 h-3.5 text-premium-accent fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic leading-relaxed font-semibold">
                    "{test.quote}"
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Mentor Section (White Background) */}
      <section className="py-24 bg-white border-b border-premium-border" id="mentorship">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="premium" className="text-[9px] font-black">Elite Advisors</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading">BJ Reality Mentors</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Learn directly from active, nationwide real estate dealmakers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mentors.map((mentor, i) => (
              <GlassCard key={i} className="p-0 overflow-hidden flex flex-col text-left border border-premium-border bg-white shadow-sm group rounded-3xl">
                <div className="h-68 overflow-hidden relative">
                  <img src={mentor.avatar} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" alt={mentor.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="premium" className="text-[9px] font-black uppercase bg-slate-950/80 text-white">Expert: {mentor.expertIn}</Badge>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-black text-premium-heading">{mentor.name}</h3>
                  <p className="text-[10px] text-premium-accent font-black uppercase tracking-widest leading-none">{mentor.role}</p>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">{mentor.track}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion (Soft Gray Background) */}
      <section className="py-24 bg-premium-bg border-b border-premium-border">
        <div className="max-w-3xl mx-auto px-6 text-left">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="premium" className="text-[9px] font-black">Got Questions?</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Everything you need to know about our high-ticket academy programs.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="bg-white border border-premium-border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 text-premium-heading hover:text-premium-accent transition-colors font-bold text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform duration-300 shrink-0 ${activeFaq === i ? 'rotate-180 text-premium-accent' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-xs text-slate-500 leading-relaxed border-t border-premium-border bg-slate-50 font-semibold">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Premium Footer (Navy contrast section exactly like WSCubeTech footer) */}
      <footer className="py-20 px-6 md:px-12 bg-premium-dark border-t border-slate-900 text-slate-400 text-left" id="about">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <BJLogo className="w-12 h-12" />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight leading-none text-white">
                  BJ REALITY
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Training Courses
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-semibold">
              Premium, highly targeted training courses built for next-generation property 
              flippers, commercial underwriters, and high-ticket commission closers.
            </p>
            <div className="space-y-2.5 text-xs text-slate-500 font-bold">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-premium-accent" /> 84 Luxury Way, Suite 400, Miami, FL</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-premium-accent" /> +1 (305) 998-2938</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-premium-accent" /> support@bjrealityacademy.com</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">BLUEPRINT COURSES</h4>
            <ul className="space-y-4 text-xs text-slate-400 font-bold">
              <li><Link to="/courses" className="hover:text-white transition-colors">CRE Underwriting</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Property Flipping Blueprints</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Luxury Listings Branding</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Psychological Negotiation Secrets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">ACADEMY PLATFORM</h4>
            <ul className="space-y-4 text-xs text-slate-400 font-bold">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">My Enrolled Vault</Link></li>
              <li><Link to="/live" className="hover:text-white transition-colors">Webinar Broadcast Schedule</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Verify ACC Certificate</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] uppercase font-black tracking-widest">
          <p>© 2026 BJ Reality Training Courses. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Accreditation Policies</a>
            <a href="#" className="hover:text-white transition-colors">L3 DRM Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
