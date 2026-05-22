import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, Star, ArrowRight, Play, CheckCircle, ShieldCheck, 
  ChevronDown, BookOpen, Calendar, HelpCircle, Award, Target, Trophy, 
  MapPin, Flame, Phone, Mail, Clock, ShieldAlert, ArrowUpRight, ChevronRight,
  TrendingUp, Download, Check, Shield, FileText, MessageSquare, Briefcase, GraduationCap, DollarSign,
  Menu, X
} from 'lucide-react';
import { Button, Badge, GlassCard } from '../components/UI';
import { BJLogo } from '../components/Layout';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // States
  const [activeDay, setActiveDay] = useState(1);
  const [activeFaq, setActiveFaq] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 44, seconds: 12 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Timer simulation for conversion urgency
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
          return { hours: 2, minutes: 44, seconds: 12 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const highlights = [
    {
      icon: Calendar,
      title: "10 Days Live Training",
      desc: "1.5 hours daily interactive online classes focused entirely on practical sales.",
      gradient: "from-blue-500/10 to-indigo-500/10",
      accent: "text-blue-500"
    },
    {
      icon: Clock,
      title: "15 Hours Total Learning",
      desc: "Fast-track intensive syllabus with no fluff. Master sales cycles, pitching and legalities.",
      gradient: "from-violet-500/10 to-purple-500/10",
      accent: "text-violet-500"
    },
    {
      icon: Users,
      title: "Skilled Mentor Guidance",
      desc: "Get taught directly by seasoned real estate developers and top sales directors.",
      gradient: "from-purple-500/10 to-pink-500/10",
      accent: "text-purple-500"
    },
    {
      icon: Target,
      title: "Real Sales Coaching",
      desc: "Learn objection handling, lead qualification, site visit tactics and deal closings.",
      gradient: "from-emerald-500/10 to-teal-500/10",
      accent: "text-emerald-500"
    },
    {
      icon: Award,
      title: "Certification Included",
      desc: "Earn a professional, shareable certificate to prove your expertise in property brokerage.",
      gradient: "from-amber-500/10 to-orange-500/10",
      accent: "text-amber-500"
    },
    {
      icon: Briefcase,
      title: "100% Job Support",
      desc: "Guaranteed placement support, resume mock drills, and direct opportunities with MRJB Realty.",
      gradient: "from-rose-500/10 to-red-500/10",
      accent: "text-rose-500"
    }
  ];

  const curriculum = [
    {
      day: 1,
      title: "Introduction to Real Estate Industry",
      description: "Understand market structures, real estate terminology, types of properties, and map out high-paying career growth paths.",
      details: ["Property asset classes (Residential, Commercial, Industrial)", "Industry vocabulary & market metrics", "Market demand cycles and dynamics", "Career roles and high-earning opportunities"]
    },
    {
      day: 2,
      title: "Property Sales & Pipeline Basics",
      description: "Master the structure of property sales, from sourcing to listings pipeline creation.",
      details: ["Real estate pipeline stages", "Seller prospecting & listing acquisition", "Property valuation basics & market comparables", "Buyer profiling framework"]
    },
    {
      day: 3,
      title: "HNW Client Communication & Pitching",
      description: "Build confidence and rapport. Learn the exact tone and formulas for communicating with high-net-worth clients.",
      details: ["Rapport building and psychology of property buyers", "Telephone scripts for qualifying prospects", "Pitching high-value locations with storytelling", "Active listening and pain-point identification"]
    },
    {
      day: 4,
      title: "Lead Qualifying & CRM Handling",
      description: "Qualify leads to save time and track them like a professional sales team.",
      details: ["Implementing the BANT framework", "Cold calling lead-warming blueprints", "Using CRMs to schedule smart follow-ups", "Handling initial client cold brush-offs"]
    },
    {
      day: 5,
      title: "The Site Visit Journey & Presentation",
      description: "Design and execute site visits that excite clients and convert them into buyers.",
      details: ["Pre-visit client checkup and mapping", "Highlighting property benefits over specifications", "Answering site-specific doubts on construction and location", "Guiding client toward token check commitments"]
    },
    {
      day: 6,
      title: "Closing Techniques & Commitment Sales",
      description: "The psychology of closing deals. Master the final scripts that prompt decisions.",
      details: ["Closing frameworks (Assumptive close, Urgency close)", "Explaining payment schedules to eliminate buyer friction", "Obtaining booking token amounts & reservation forms", "Handing over documents professionally"]
    },
    {
      day: 7,
      title: "Deal Negotiation & Concession Mapping",
      description: "Maintain your margins while giving the client a feeling of winning.",
      details: ["Managing client discount requests", "Anchoring prices to preserve broker commissions", "Handling aggressive buyer-seller compromises", "Closing the gap between budget and listing price"]
    },
    {
      day: 8,
      title: "Real Estate Legalities, RERA & Registry",
      description: "Learn essential legal rules to ensure smooth transactions and build absolute client trust.",
      details: ["RERA rules & compliance guidelines", "Verifying property titles, mutation deeds & sale deeds", "Drafting builder-buyer agreements", "Standard property registry procedures"]
    },
    {
      day: 9,
      title: "Investment Formulas, ROI & Rental Yields",
      description: "Analyze properties using investor numbers to sell multi-family and commercial spaces.",
      details: ["Rental yield calculations", "ROI & Capital appreciation equations", "Analyzing local growth micro-markets", "Property taxes and deduction benefits"]
    },
    {
      day: 10,
      title: "Career Growth & Joining MRJB Realty",
      description: "Prepare your resume, practice job interviews, and apply for direct roles.",
      details: ["Drafting an executive real estate sales resume", "Mock interviews with top property leaders", "Unlocking direct job placement channels at MRJB Realty", "Launching your freelance property brokerage business"]
    }
  ];

  const jobRoles = [
    {
      role: "Real Estate Advisor / Advisor Associate",
      company: "MRJB Realty & Partners",
      salary: "₹3.6L - ₹6.0L LPA + Commissions",
      points: ["Manage listing pipelines", "Qualify warm inbound leads", "Organize customer site visits"]
    },
    {
      role: "Property Consultant / Lead Negotiator",
      company: "Top-Tier Premium Agencies",
      salary: "₹4.8L - ₹8.0L LPA + Commissions",
      points: ["HNW client listing advisory", "Close high-ticket contracts", "Co-ordinate legal property registries"]
    },
    {
      role: "Senior Sales Closer",
      company: "Developer Direct Sales Teams",
      salary: "₹6.0L - ₹10.0L LPA + Performance Bonuses",
      points: ["Convert site visits to buyers", "Pitch premium residential projects", "Earn uncapped project commission slabs"]
    }
  ];

  const teamMembers = [
    {
      name: "Rohan Mehta",
      role: "Senior Sales Mentor",
      specialization: "Deal Sourcing & Negotiation",
      experience: "12+ Years. Closed deals valued at ₹150+ Crore. Lead Trainer for Sales & Site Visits.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
      accent: "text-blue-500",
      gradient: "from-blue-500/10 to-indigo-500/10",
      badgeStyle: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      name: "Vikram Malhotra",
      role: "Investment Advisor",
      specialization: "Commercial Underwriting & Cap Rates",
      experience: "9+ Years. Ex-CBRE senior property analyst. Expert in ROI & yields calculations.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
      accent: "text-violet-500",
      gradient: "from-violet-500/10 to-purple-500/10",
      badgeStyle: "bg-violet-50 text-violet-600 border-violet-100"
    },
    {
      name: "Simran Kaur",
      role: "Luxury Property Specialist",
      specialization: "HNW Listing Branding",
      experience: "8+ Years. Specializes in luxury builder villas, premium site layouts, and elite branding.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      accent: "text-purple-500",
      gradient: "from-purple-500/10 to-pink-500/10",
      badgeStyle: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      name: "Aditya Goel",
      role: "Closing Expert",
      specialization: "Closing & Token Commitments",
      experience: "7+ Years. Coached 2,500+ agents in high-friction client conversion and deposit collections.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      accent: "text-emerald-500",
      gradient: "from-emerald-500/10 to-teal-500/10",
      badgeStyle: "bg-green-50 text-green-600 border-green-100"
    },
    {
      name: "Priya Sharma",
      role: "Client Relationship Manager",
      specialization: "Sales CRMs & Lead Qualifying",
      experience: "6+ Years. Expert in BANT qualification setups, CRM workflows, and post-sales handovers.",
      avatar: "https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&q=80&w=300",
      accent: "text-rose-500",
      gradient: "from-rose-500/10 to-red-500/10",
      badgeStyle: "bg-red-50 text-red-600 border-red-100"
    }
  ];

  const testimonials = [
    {
      quote: "The 10-day training program was extremely practical. I applied the qualifying script from Day 4 and closed my first residential sales deal within 15 days of finishing the class. Highly recommended!",
      author: "Dustin Vance",
      deal: "Hired as Advisor, Closed ₹1.2 Cr Deal",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "Before this course, I struggled with site-visit objection handling. The sales coaching and mock rounds gave me massive confidence. Got hired directly by a developer group in Delhi NCR!",
      author: "Sarah Jenkins",
      deal: "Sales Specialist, Developer Direct",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const faqs = [
    {
      question: "What are the timings and platform for the training?",
      answer: "The training is conducted live online. Each daily class is 1.5 hours (total of 15 hours). Recorded sessions are uploaded to the Student Portal if you miss any live sessions."
    },
    {
      question: "Is there real job placement assistance?",
      answer: "Yes, we offer 100% Job Support. This includes building your real estate sales resume, conducting mock interviews, sharing active hiring vacancies, and matching you with direct interview slots at MRJB Realty and partner property firms."
    },
    {
      question: "How do I claim my certification?",
      answer: "Upon completing all 10 modules, a verified 'Certified Real Estate Sales Specialist' certificate is generated. It includes a unique serial validation hash and can be directly added to your resume and LinkedIn."
    },
    {
      question: "What is the fee, and are there any hidden charges?",
      answer: "The total fee is ₹3,999. This is a one-time payment that covers all 10 live sessions, study handouts, resume templates, certificate charges, and access to the student dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-premium-bg text-premium-text overflow-x-hidden selection:bg-premium-accent/10 selection:text-premium-accent font-sans">
      
      {/* Urgency Promo Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-600 text-white text-center py-2.5 px-4 text-xs font-bold relative z-50 flex items-center justify-center gap-3 shadow-md">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-extrabold text-[9px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">LIVE BATCH</span>
        </span>
        <span>🔥 Launch Offer: 10-Day Live Real Estate Masterclass at ₹3,999 (Limited Seats Left)</span>
        <div className="hidden md:flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded text-[10px]">
          <span>Booking closes in:</span>
          <span className="font-mono text-emerald-300">{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Sticky Premium Navbar */}
      <nav className="sticky top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-md bg-premium-dark/95 border-b border-slate-900 shadow-lg text-slate-400">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <BJLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="text-base font-black tracking-tight leading-none text-white group-hover:text-premium-accent transition-colors">
                MRJB ACADEMY
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Real Estate Training
              </span>
            </div>
          </Link>

          {/* Megamenu Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-slate-400">
            <a href="#highlights" className="hover:text-white transition-colors">Highlights</a>
            <a href="#curriculum" className="hover:text-white transition-colors">Curriculum</a>
            <a href="#job-support" className="hover:text-white transition-colors">Job Support</a>
            <a href="#certification" className="hover:text-white transition-colors">Certification</a>
            <a href="#team" className="hover:text-white transition-colors">Our Team</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          {/* Student Portal Trigger and CTA buttons */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden sm:inline-flex">
              <Button variant="ghost" className="text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider h-10 border border-slate-800 hover:bg-slate-800/40 rounded-xl px-5">
                Student Portal
              </Button>
            </Link>
            <a href="#pricing">
              <Button variant="primary" className="h-10 px-5 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-premium hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] text-white">
                Book Seat - ₹3,999
              </Button>
            </a>
            {/* Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 bg-premium-dark border-b border-slate-900 z-40 px-6 py-8 flex flex-col gap-6 lg:hidden shadow-2xl text-left"
          >
            <div className="flex flex-col gap-4 text-sm font-black uppercase tracking-wider text-slate-400">
              <a href="#highlights" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-slate-900">Highlights</a>
              <a href="#curriculum" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-slate-900">Curriculum</a>
              <a href="#job-support" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-slate-900">Job Support</a>
              <a href="#certification" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-slate-900">Certification</a>
              <a href="#team" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-slate-900">Our Team</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2">Pricing</a>
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-900">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="outline" className="w-full text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider h-11 border border-slate-800 hover:bg-slate-800/40 rounded-xl">
                  Student Portal
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-24 px-6 md:px-12 bg-premium-dark border-b border-slate-900 overflow-hidden text-left">
        {/* Soft Background Glowing Spotlights */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full h-[550px] opacity-15 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-blue-600 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div className="absolute top-20 right-1/4 w-[380px] h-[380px] bg-violet-600 rounded-full blur-[150px] animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-wrap gap-2.5">
              <Badge variant="premium" className="py-1.5 px-3.5 text-[9px] tracking-wider border-violet-500/20 bg-violet-500/10 text-violet-400 font-bold uppercase">
                10-Day Live Training Program
              </Badge>
              <Badge variant="success" className="py-1.5 px-3.5 text-[9px] tracking-wider border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                100% Job Support
              </Badge>
              <Badge variant="info" className="py-1.5 px-3.5 text-[9px] tracking-wider border-blue-500/20 bg-blue-500/10 text-blue-400 font-bold uppercase">
                Certification Included
              </Badge>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white"
            >
              Build a Successful <br />
              <span className="bg-clip-text text-transparent bg-gradient-premium">
                Real Estate Career
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed font-semibold"
            >
              Master real estate sales cycles, client communication, lead qualifying, property presentation, 
              and legal deeds. Gain practical sales skills from skilled real estate mentors and unlock job opportunities in MRJB Realty.
            </motion.p>

            {/* Program Quick Stats Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left backdrop-blur-sm"
            >
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Duration</span>
                <span className="text-base font-black text-white">10 Days Live</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Total hours</span>
                <span className="text-base font-black text-white">15 Hours</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Daily Class</span>
                <span className="text-base font-black text-white">1.5 Hrs / Day</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Special Fee</span>
                <span className="text-base font-black text-emerald-400">₹3,999</span>
              </div>
            </motion.div>

            {/* Premium CTA and Demo Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-2"
            >
              <a href="#pricing" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-premium hover:shadow-[0_6px_25px_rgba(37,99,235,0.3)] text-white">
                  Join Live Batch
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </a>
              <a href="#curriculum" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 border-slate-800 hover:bg-slate-800/40 text-white text-xs font-black uppercase tracking-wider rounded-xl bg-slate-900/50 backdrop-blur-sm">
                  <Play className="w-4 h-4 fill-current text-premium-accent" /> Watch Syllabus Preview
                </Button>
              </a>
            </motion.div>

            {/* Urgency Status Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-900/80">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                <Flame className="w-4 h-4 animate-bounce" />
                <span>Only 8 Seats Left in the current batch</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Batch booking is active now</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Column with floating components */}
          <div className="lg:col-span-5 flex items-center justify-center relative pt-8 lg:pt-0">
            <div className="relative w-full max-w-[390px] h-[390px]">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-3xl border border-slate-800 bg-gradient-to-tr from-blue-600/5 to-violet-600/5 -rotate-3 scale-102"></div>
              
              {/* Main Visual Card */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-slate-850 shadow-2xl bg-slate-950 flex flex-col justify-end"
              >
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" 
                  className="absolute inset-0 w-full h-full object-cover opacity-45"
                  alt="Modern office building representing real estate growth"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                
                {/* Visual badges overlay */}
                <div className="relative p-6 space-y-3 z-15 text-left">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" /> Job-Ready Skillset
                  </span>
                  <h3 className="text-lg font-black text-white leading-snug">Property Sales &amp; Consultation Mastery</h3>
                  <p className="text-[10px] text-slate-400 font-bold">10 Live Interactive Classes • 15 Hours Core Training</p>
                </div>
              </motion.div>

              {/* Floating Placement Card */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-6 -right-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 z-20 text-left"
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Hiring Partner</p>
                  <p className="text-xs font-black text-emerald-400">MRJB Realty</p>
                </div>
              </motion.div>

              {/* Floating Certified Badge */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 z-20 text-left"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Accreditation</p>
                  <p className="text-xs font-black text-white">Certified Advisor</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trusted Partners */}
      <section className="bg-white py-14 border-b border-premium-border text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
            Accelerating Careers at Elite Agencies &amp; Developers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['MRJB REALTY', 'CBRE', 'COMPASS', 'RE/MAX', 'SOTHEBY\'S', 'KELLER WILLIAMS'].map((name, i) => (
              <span key={i} className="text-lg md:text-xl font-black tracking-widest text-slate-400 hover:text-premium-heading transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Program Highlights Section */}
      <section className="py-24 px-6 md:px-12 bg-premium-bg border-b border-premium-border" id="highlights">
        <div className="max-w-7xl mx-auto text-left mb-16 space-y-3">
          <Badge variant="info" className="text-[9px] font-black uppercase bg-blue-50 border border-blue-100 text-blue-600">
            Training Highlights
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black text-premium-heading leading-tight">
            Designed for Real Estate Career Growth
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl font-semibold leading-relaxed">
            A comprehensive curriculum focused on practical sales skills, live interaction, mentorship, and placement assistance.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((h, i) => (
            <GlassCard key={i} className="flex flex-col text-left p-8 bg-white border border-premium-border/80 rounded-3xl transition-all duration-300 hover:border-premium-accent/20 hover:shadow-md">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${h.gradient} flex items-center justify-center mb-6`}>
                <h.icon className={`w-6 h-6 ${h.accent}`} />
              </div>
              <h3 className="text-lg font-black text-premium-heading mb-3">{h.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{h.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 5. Course Curriculum Section */}
      <section className="py-24 px-6 md:px-12 bg-white border-b border-premium-border" id="curriculum">
        <div className="max-w-7xl mx-auto text-left mb-16 space-y-3">
          <Badge variant="premium" className="text-[9px] font-black bg-violet-50 border border-violet-100 text-violet-600">
            Day-By-Day Roadmap
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black text-premium-heading leading-tight">
            10-Day Real Estate Syllabus
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl font-semibold leading-relaxed">
            Click on any day below to explore the training modules and practical goals.
          </p>
        </div>

        {/* Curriculum Layout: Master-Detail List */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Day list selector */}
          <div className="lg:col-span-5 space-y-3.5">
            {curriculum.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 cursor-pointer ${
                  activeDay === day.day 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                    : 'bg-premium-bg border-premium-border/80 text-premium-heading hover:bg-slate-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                  activeDay === day.day ? 'bg-premium-accent text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  D{day.day}
                </div>
                <div className="truncate">
                  <span className="text-[9px] uppercase tracking-wider block font-bold opacity-60">Day {day.day} Module</span>
                  <span className="text-xs md:text-sm font-black truncate block">{day.title}</span>
                </div>
                <ChevronRight className={`ml-auto w-4.5 h-4.5 shrink-0 ${
                  activeDay === day.day ? 'text-premium-accent' : 'text-slate-400'
                }`} />
              </button>
            ))}
          </div>

          {/* Day details view */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {curriculum.map((day) => day.day === activeDay && (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-premium-bg border border-premium-border rounded-3xl p-8 md:p-10 space-y-6 h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-premium-accent/10 text-premium-accent text-[10px] font-black px-3 py-1.5 rounded-xl uppercase border border-premium-accent/20">
                        Module Day {day.day}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-bold">1.5 Hours Interactive Class</span>
                    </div>

                    <h3 className="text-2xl font-black text-premium-heading">{day.title}</h3>
                    <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
                      {day.description}
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-slate-200/80 pt-6 flex-1">
                    <p className="text-[10px] text-premium-heading uppercase tracking-widest font-black">Key Focus Topics:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {day.details.map((detail, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs text-slate-500 font-semibold">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Session ends with Q&amp;A</span>
                    </div>
                    <a href="#pricing">
                      <Button variant="primary" className="h-10 text-[10px] uppercase font-black tracking-wider rounded-xl py-2">
                        Reserve Seat
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. Job Support Section */}
      <section className="py-24 px-6 md:px-12 bg-premium-bg border-b border-premium-border" id="job-support">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Job Support Left Text */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <Badge variant="success" className="text-[9px] font-black uppercase bg-green-50 border border-green-100 text-green-600">
              Career Launchpad
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading leading-tight">
              100% Job Placement Support
            </h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              We don't just teach real estate; we help you get hired. Top performers will get direct recruitment opportunities within MRJB Realty.
            </p>

            {/* List of career benefits */}
            <div className="space-y-4 pt-4 border-t border-premium-border">
              {[
                { title: "Placement Assistance", desc: "Access direct interview slots at leading property consultancies and builder sales teams." },
                { title: "Interview Preparation", desc: "Weekly mock panels to practice presentation, tone, and qualifying scripts." },
                { title: "Practical Sales Drills", desc: "Roleplay site visits and negotiation parameters under real pressure." },
                { title: "Direct Opportunity in MRJB Realty", desc: "Top graduates receive direct offers to join MRJB Realty as associates." }
              ].map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-premium-heading">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Support Right Side (Hiring Style Cards) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Potential Job Profiles:</span>
            <div className="space-y-4">
              {jobRoles.map((role, idx) => (
                <div key={idx} className="bg-white border border-premium-border rounded-2xl p-5 hover:border-premium-accent/20 transition-all duration-300 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-premium-accent group-hover:bg-premium-violet transition-colors"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-sm font-black text-premium-heading">{role.role}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{role.company}</p>
                    </div>
                    <Badge variant="success" className="bg-green-50 text-green-700 border-green-100 text-[10px] font-black">
                      {role.salary}
                    </Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                    {role.points.map((p, pIdx) => (
                      <span key={pIdx} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Hiring stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-premium-border">
              <div className="text-center bg-white border border-premium-border rounded-xl p-3 shadow-sm">
                <span className="text-xl md:text-2xl font-black text-premium-accent">92%</span>
                <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-1">Placement Success</span>
              </div>
              <div className="text-center bg-white border border-premium-border rounded-xl p-3 shadow-sm">
                <span className="text-xl md:text-2xl font-black text-premium-accent">₹4.8L</span>
                <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-1">Avg Starting Package</span>
              </div>
              <div className="text-center bg-white border border-premium-border rounded-xl p-3 shadow-sm">
                <span className="text-xl md:text-2xl font-black text-premium-accent">15+</span>
                <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-1">Hiring Partner Firms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Certification Section */}
      <section className="py-24 px-6 md:px-12 bg-white border-b border-premium-border" id="certification">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Certification Text */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <Badge variant="premium" className="text-[9px] font-black uppercase">
              Official Credentials
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading leading-tight">
              Earn Your Real Estate Certificate
            </h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Showcase your expertise. Upon successful completion of our 10-day training modules, get certified as a professional real estate sales representative.
            </p>

            <div className="space-y-4 pt-4 border-t border-premium-border">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-premium-heading">Secure Digital Verification Hash</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">Every certificate carries a unique registration hash that developers can verify online.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-premium-heading">Career &amp; Broker Value</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">Accepted and recognized by MRJB Realty and partner brokers across major metropolitan projects.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certification Visual Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[550px] aspect-[1.414] bg-stone-50 border-[12px] border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden text-center selection:bg-transparent">
              {/* Gold borders */}
              <div className="absolute inset-1.5 border border-amber-600/30 rounded-lg pointer-events-none"></div>
              {/* Corner decors */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-amber-600"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-amber-600"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-amber-600"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-amber-600"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                <BJLogo className="w-64 h-64" />
              </div>

              <div className="space-y-2 relative z-10">
                <span className="text-[9px] uppercase tracking-widest font-black text-amber-600 block">MRJB Real Estate Training Institute</span>
                <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-wide">CERTIFICATE OF COMPLETION</h3>
                <div className="w-12 h-0.5 bg-amber-600 mx-auto mt-2"></div>
              </div>

              <div className="my-3 space-y-1 relative z-10">
                <p className="text-[9px] text-slate-500 italic">This credential is proudly awarded to</p>
                <p className="text-base md:text-lg font-black text-slate-800 font-serif border-b border-dashed border-slate-300 w-3/4 mx-auto pb-1 mt-1">
                  [Your Name Here]
                </p>
              </div>

              <p className="text-[9px] md:text-[10px] text-slate-600 leading-relaxed max-w-sm mx-auto relative z-10 font-medium">
                for successfully completing the <strong>10-Day Real Estate Training &amp; Sales Program</strong>, mastering property consultation, communication, lead qualifers, site visits, and negotiation.
              </p>

              {/* Signatures */}
              <div className="flex justify-between items-end mt-4 px-4 relative z-10">
                <div className="text-left">
                  <div className="text-[10px] font-black text-slate-800 font-serif italic border-b border-slate-300 pb-1 px-1">Amit Sharma</div>
                  <span className="text-[8px] text-slate-400 block font-bold mt-1">Director, MRJB Realty</span>
                </div>

                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-600 bg-amber-500/10 flex items-center justify-center relative shadow-inner">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <div className="absolute inset-1 rounded-full border border-dashed border-amber-600/60"></div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-800 font-serif italic border-b border-slate-300 pb-1 px-1">Rajesh Verma</div>
                  <span className="text-[8px] text-slate-400 block font-bold mt-1">Lead Instructor</span>
                </div>
              </div>

              <div className="text-[8px] text-slate-400 mt-2 font-mono relative z-10">
                Verify serial: MRJB-LMS-2026-REG-{Math.floor(Math.random() * 89999 + 10000)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Vision Section */}
      <section className="py-28 px-6 md:px-12 bg-premium-dark border-b border-slate-900 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <Badge variant="premium" className="py-1 px-3 border-violet-500/20 bg-violet-500/10 text-violet-400 text-[10px] font-black uppercase">
            Our Vision
          </Badge>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-relaxed font-serif tracking-wide max-w-3xl mx-auto">
            “To empower people with real estate knowledge, enabling them to make better deals and build a career.”
          </h2>

          <div className="w-16 h-1 bg-gradient-premium mx-auto rounded-full"></div>
          
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-semibold">
            We aim to foster confidence and transparency in property transactions by building skilled, placement-ready consultants.
          </p>
        </div>
      </section>

      {/* 9. Verified Student Deals & Testimonials */}
      <section className="py-24 bg-premium-bg border-b border-premium-border" id="testimonials">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="success" className="text-[9px] font-black bg-green-50 border border-green-100 text-green-600">Alumni Success</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading">Verified Career Outcomes</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Real success paths achieved by students who completed our live 10-day training.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((test, i) => (
              <GlassCard key={i} className="flex flex-col md:flex-row gap-6 p-8 border border-premium-border bg-white shadow-sm rounded-3xl">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-premium-accent shadow-md">
                  <img src={test.avatar} className="w-full h-full object-cover" alt={test.author} />
                </div>
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-premium-heading">{test.author}</h4>
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

      {/* 10. Premium Employee & Team Showcase Section */}
      <section className="py-24 bg-white border-b border-premium-border" id="team">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Badge variant="premium" className="text-[9px] font-black">MRJB Realtors Team</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading">Meet Our Experts &amp; Advisors</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Learn directly from the active team members driving property transactions at MRJB Realty and coaching future real estate professionals.
            </p>
            
            {/* Combined Experience Indicator */}
            <div className="inline-flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-bold mt-2 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-premium-accent animate-pulse"></span>
              <span>Combined Team Experience: <strong>50+ Years</strong></span>
            </div>
          </div>

          {/* Grid of Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white border border-premium-border rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-premium-accent/20 group text-left"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${member.gradient} rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

                {/* Profile Avatar and Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-slate-150 group-hover:border-premium-accent transition-all relative">
                    <img src={member.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={member.name} />
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase mb-1.5 ${member.badgeStyle}`}>
                      {member.role}
                    </span>
                    <h3 className="text-base font-black text-premium-heading leading-tight">{member.name}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black block">Specialization</span>
                    <p className="text-xs font-black text-premium-heading leading-snug">{member.specialization}</p>
                  </div>
                  <div className="h-px bg-slate-100"></div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black block">Direct Experience</span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{member.experience}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trusted by Future Realtors Metrics Row */}
          <div className="mt-20 border border-premium-border/80 bg-premium-bg/50 rounded-3xl p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">TRUSTED BY FUTURE REALTORS</span>
              <p className="text-xs text-slate-500 font-bold mt-1">Driving career growth through authentic metrics and industry credibility.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-2xl md:text-3xl font-black text-slate-900 block">15,000+</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-1">Graduates Trained</span>
              </div>
              <div className="border-l border-slate-200/80">
                <span className="text-2xl md:text-3xl font-black text-slate-900 block">₹250Cr+</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-1">Closed Deals Volume</span>
              </div>
              <div className="border-l border-slate-200/80">
                <span className="text-2xl md:text-3xl font-black text-slate-900 block">92%</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-1">Placement Success</span>
              </div>
              <div className="border-l border-slate-200/80">
                <span className="text-2xl md:text-3xl font-black text-slate-900 block">50+</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-1">Partner Developers</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 11. FAQ Accordion */}
      <section className="py-24 bg-premium-bg border-b border-premium-border">
        <div className="max-w-3xl mx-auto px-6 text-left">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="premium" className="text-[9px] font-black">Got Questions?</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-premium-heading">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Everything you need to know about the 10-day training program.
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

      {/* 12. High-Converting Pricing & Enrollment Section */}
      <section className="py-24 px-6 md:px-12 bg-premium-dark border-b border-slate-900 text-left relative overflow-hidden" id="pricing">
        {/* Glowing background spot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Badge variant="premium" className="py-1 px-3 border-violet-500/20 bg-violet-500/10 text-violet-400 text-[10px] font-black uppercase">
              Secure Your Seat
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm text-slate-400 font-semibold leading-relaxed">
              Invest in your career growth with our all-inclusive 10-day live program. No hidden fees, no recurring bills.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Column: What's Included checklist & Urgency UI */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-premium-accent" />
                  What’s Included in Your Enrollment:
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "10 Days Live Interactive Classes",
                    "Real Estate Sales & Pitch Coaching",
                    "Closing & Token Commitment Skills",
                    "Deal Negotiation & Discount Handling",
                    "Active Real Estate Mentor Guidance",
                    "Verified Graduation Certificate",
                    "100% Placement & CV Mock Drills",
                    "Direct Hiring Interviews in MRJB Realty"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency Progress Dashboard */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">ENROLLMENT STATUS</span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5 mt-1">
                      <Flame className="w-4 h-4 animate-bounce" /> Only 8 seats remaining in the upcoming batch
                    </span>
                  </div>
                  <Badge variant="premium" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[10px] font-black">
                    84% SEATS BOOKED
                  </Badge>
                </div>

                {/* Animated progress bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700/50">
                  <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full w-[84%]"></div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>42 Booked</span>
                  <span className="text-white font-extrabold uppercase tracking-widest">Next Batch Starting Soon!</span>
                  <span>50 Max Seats</span>
                </div>
              </div>

            </div>

            {/* Right Column: Premium Glassmorphic Pricing Card */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <motion.div 
                whileHover={{ y: -6 }}
                className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-full shadow-2xl"
              >
                {/* Popular tag */}
                <div className="absolute top-4 right-4">
                  <Badge variant="premium" className="bg-gradient-premium border-none text-white text-[9px] font-extrabold px-3 py-1 uppercase tracking-wider">
                    POPULAR BATCH
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="text-left space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">ALL-INCLUSIVE ADMISSION</span>
                    <h4 className="text-lg font-black text-white leading-tight">10-Day Real Estate Masterclass</h4>
                  </div>

                  {/* Pricing tags */}
                  <div className="text-left bg-slate-950/50 border border-slate-850 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Special Discount Fee</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-400">₹3,999</span>
                        <span className="text-xs text-slate-500 line-through">₹9,999</span>
                      </div>
                    </div>
                    <Badge variant="success" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
                      SAVE 60%
                    </Badge>
                  </div>

                  {/* Countdown Timer Inside Pricing Card */}
                  <div className="space-y-2 text-left bg-slate-950/20 border border-slate-850 p-4 rounded-xl">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block">Launch Offer Closes In:</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                      <span className="font-mono text-base font-extrabold text-amber-400">
                        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-4 pt-8 border-t border-slate-800/80 mt-8">
                  <Link to="/dashboard" className="block">
                    <Button variant="gold" className="w-full h-14 uppercase text-xs font-black tracking-wider rounded-xl bg-gradient-premium text-white border-none shadow-lg hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)]">
                      Enroll Now &amp; Join Live Batch
                    </Button>
                  </Link>

                  <Link to="/dashboard" className="block">
                    <Button variant="outline" className="w-full h-12 uppercase text-[10px] font-black tracking-wider rounded-xl border-slate-800 text-slate-300 hover:text-white bg-slate-950/30">
                      Reserve Your Seat
                    </Button>
                  </Link>

                  {/* Payment logos and trust */}
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider pt-2 px-1">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Checkout</span>
                    <span>100% Satisfaction</span>
                  </div>
                </div>

              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* 13. Premium Footer */}
      <footer className="py-20 px-6 md:px-12 bg-premium-dark border-t border-slate-900 text-slate-400 text-left" id="about">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <BJLogo className="w-12 h-12" />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight leading-none text-white">
                  MRJB ACADEMY
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Real Estate Training
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-semibold">
              Practical, live training courses built for next-generation property sales advisors, consultants, and developers. Partnered with MRJB Realty.
            </p>
            <div className="space-y-2.5 text-xs text-slate-500 font-bold">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-premium-accent" /> Metro Building Sector 62, Noida, UP, India</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-premium-accent" /> +91 98765 43210</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-premium-accent" /> admissions@mrjbacademy.com</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">PROGRAM DETS</h4>
            <ul className="space-y-4 text-xs text-slate-400 font-bold">
              <li><a href="#highlights" className="hover:text-white transition-colors">Highlights</a></li>
              <li><a href="#curriculum" className="hover:text-white transition-colors">Syllabus Curriculum</a></li>
              <li><a href="#job-support" className="hover:text-white transition-colors">Job Placement Support</a></li>
              <li><a href="#certification" className="hover:text-white transition-colors">Digital Credentials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">ACADEMY PORTAL</h4>
            <ul className="space-y-4 text-xs text-slate-400 font-bold">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">My Enrolled Vault</Link></li>
              <li><Link to="/live" className="hover:text-white transition-colors">Live Class Broadcast</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Verify Certificate Hash</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] uppercase font-black tracking-widest">
          <p>© 2026 MRJB Real Estate Academy. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Accreditation Policies</a>
            <a href="#" className="hover:text-white transition-colors">RERA guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
