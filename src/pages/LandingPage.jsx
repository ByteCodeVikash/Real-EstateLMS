import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, Star, ArrowRight, Play, CheckCircle, ShieldCheck, 
  ChevronDown, BookOpen, Calendar, HelpCircle, Award, Target, Trophy, 
  MapPin, Flame, Phone, Mail, Clock, ShieldAlert, ArrowUpRight, ChevronRight,
  TrendingUp, Download, Check, Shield, FileText, MessageSquare, Briefcase, 
  GraduationCap, DollarSign, Menu, X, ExternalLink, 
  BarChart3, Zap, Globe, Layers, Sparkles, Gem, Crown, 
  Server, BadgeCheck,
  BrainCircuit, Eye, Sun, Moon
} from 'lucide-react';
import { Button } from '../components/UI';
import { BGLogo } from '../components/Layout';
import { Link } from 'react-router-dom';
import { mockData } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

// Hoisted SVG components to avoid Temporal Dead Zone issues
function Rocket({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Twitter({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function Instagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Youtube({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

const LandingPage = () => {
  // ─── THEME ───────────────────────────────────────────────────────────
  const { isDarkMode, toggleTheme } = useTheme();

  // ─── STATES ─────────────────────────────────────────────────────────
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 44, seconds: 12 });
  const [enrollmentCount, setEnrollmentCount] = useState(42);
  const [currentReview, setCurrentReview] = useState(0);
  const [curriculumExpanded, setCurriculumExpanded] = useState(false);

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 44, seconds: 12 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Enrollment counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setEnrollmentCount(prev => {
        if (prev < 48) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Student Review carousel auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % studentReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // ─── DATA ────────────────────────────────────────────────────────────

  const highlights = [
    {
      icon: Calendar,
      title: "10 Days Live Training",
      desc: "1.5 hours daily interactive online classes focused entirely on practical sales.",
      gradient: "from-[#D4AF37]/10 to-[#E5C76B]/10",
      accent: "text-[#D4AF37]"
    },
    {
      icon: Clock,
      title: "15 Hours Total Learning",
      desc: "Fast-track intensive syllabus with no fluff — master sales cycles, pitching and legalities.",
      gradient: "from-[#0A66C2]/10 to-[#1E88E5]/10",
      accent: "text-[#0A66C2]"
    },
    {
      icon: Users,
      title: "Skilled Mentor Guidance",
      desc: "Get taught directly by seasoned real estate developers and top sales directors.",
      gradient: "from-[#D4AF37]/10 to-[#CFAE5D]/10",
      accent: "text-[#CFAE5D]"
    },
    {
      icon: Target,
      title: "Real Sales Coaching",
      desc: "Learn objection handling, lead qualification, site visit tactics and deal closings.",
      gradient: "from-[#0A66C2]/10 to-[#1E88E5]/10",
      accent: "text-[#1E88E5]"
    },
    {
      icon: Award,
      title: "Certification Included",
      desc: "Earn a professional, shareable certificate to prove your expertise in property brokerage.",
      gradient: "from-[#D4AF37]/10 to-[#E5C76B]/10",
      accent: "text-[#D4AF37]"
    },
    {
      icon: Briefcase,
      title: "100% Job Support",
      desc: "Guaranteed placement support, resume mock drills and direct opportunities with partner firms.",
      gradient: "from-[#0A66C2]/10 to-[#1E88E5]/10",
      accent: "text-[#0A66C2]"
    }
  ];

  const curriculum = [
    {
      day: 1,
      title: "Introduction to Real Estate Industry",
      description: "Understand market structures, real estate terminology, types of properties, and map out high-paying career growth paths.",
      details: [
        "Property asset classes — Residential, Commercial, Industrial",
        "Industry vocabulary and market metrics",
        "Market demand cycles and dynamics",
        "Career roles and high-earning opportunities"
      ],
      icon: Building2,
      duration: "1.5 hours"
    },
    {
      day: 2,
      title: "Property Sales & Pipeline Basics",
      description: "Master the structure of property sales, from sourcing to listings pipeline creation.",
      details: [
        "Real estate pipeline stages",
        "Seller prospecting and listing acquisition",
        "Property valuation basics and market comparables",
        "Buyer profiling framework"
      ],
      icon: Layers,
      duration: "1.5 hours"
    },
    {
      day: 3,
      title: "HNW Client Communication & Pitching",
      description: "Build confidence and rapport. Learn the exact tone and formulas for communicating with high-net-worth clients.",
      details: [
        "Rapport building and psychology of property buyers",
        "Telephone scripts for qualifying prospects",
        "Pitching high-value locations with storytelling",
        "Active listening and pain-point identification"
      ],
      icon: MessageSquare,
      duration: "1.5 hours"
    },
    {
      day: 4,
      title: "Lead Qualifying & CRM Handling",
      description: "Qualify leads to save time and track them like a professional sales team.",
      details: [
        "Implementing the BANT framework",
        "Cold calling lead-warming blueprints",
        "Using CRMs to schedule smart follow-ups",
        "Handling initial client cold brush-offs"
      ],
      icon: Server,
      duration: "1.5 hours"
    },
    {
      day: 5,
      title: "The Site Visit Journey & Presentation",
      description: "Design and execute site visits that excite clients and convert them into buyers.",
      details: [
        "Pre-visit client checkup and mapping",
        "Highlighting property benefits over specifications",
        "Answering site-specific doubts on construction and location",
        "Guiding client toward token check commitments"
      ],
      icon: Eye,
      duration: "1.5 hours"
    },
    {
      day: 6,
      title: "Closing Techniques & Commitment Sales",
      description: "The psychology of closing deals. Master the final scripts that prompt decisions.",
      details: [
        "Closing frameworks — Assumptive close, Urgency close",
        "Explaining payment schedules to eliminate buyer friction",
        "Obtaining booking token amounts and reservation forms",
        "Handling over documents professionally"
      ],
      icon: Zap,
      duration: "1.5 hours"
    },
    {
      day: 7,
      title: "Deal Negotiation & Concession Mapping",
      description: "Maintain your margins while giving the client a feeling of winning.",
      details: [
        "Managing client discount requests",
        "Anchoring prices to preserve broker commissions",
        "Handling aggressive buyer-seller compromises",
        "Closing the gap between budget and listing price"
      ],
      icon: BrainCircuit,
      duration: "1.5 hours"
    },
    {
      day: 8,
      title: "Real Estate Legalities, RERA & Registry",
      description: "Learn essential legal rules to ensure smooth transactions and build absolute client trust.",
      details: [
        "RERA rules and compliance guidelines",
        "Verifying property titles, mutation deeds and sale deeds",
        "Drafting builder-buyer agreements",
        "Standard property registry procedures"
      ],
      icon: Shield,
      duration: "1.5 hours"
    },
    {
      day: 9,
      title: "Investment Formulas, ROI & Rental Yields",
      description: "Analyze properties using investor numbers to sell multi-family and commercial spaces.",
      details: [
        "Rental yield calculations",
        "ROI and Capital appreciation equations",
        "Analyzing local growth micro-markets",
        "Property taxes and deduction benefits"
      ],
      icon: BarChart3,
      duration: "1.5 hours"
    },
    {
      day: 10,
      title: "Career Growth & Joining BG Network",
      description: "Prepare your resume, practice job interviews, and apply for direct roles.",
      details: [
        "Drafting an executive real estate sales resume",
        "Mock interviews with top property leaders",
        "Unlocking direct job placement channels",
        "Launching your freelance property brokerage business"
      ],
      icon: Rocket,
      duration: "2 hours"
    }
  ];

  const teamMembers = [
    {
      name: "Rohan Mehta",
      role: "Senior Sales Mentor",
      specialization: "Deal Sourcing & Negotiation",
      experience: "12+ Years. Closed deals valued at ₹150+ Crore. Lead Trainer for Sales & Site Visits.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
      accent: "text-[#0A66C2]",
      gradient: "from-[#0A66C2] to-[#1E88E5]",
      transactions: "₹150Cr+",
      linkedin: "#"
    },
    {
      name: "Vikram Malhotra",
      role: "Investment Advisor",
      specialization: "Commercial Underwriting & Cap Rates",
      experience: "9+ Years. Ex-CBRE senior property analyst. Expert in ROI & yields calculations.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
      accent: "text-[#D4AF37]",
      gradient: "from-[#D4AF37] to-[#E5C76B]",
      transactions: "₹80Cr+",
      linkedin: "#"
    },
    {
      name: "Simran Kaur",
      role: "Luxury Property Specialist",
      specialization: "HNW Listing Branding",
      experience: "8+ Years. Specializes in luxury builder villas, premium site layouts, and elite branding.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      accent: "text-[#0A66C2]",
      gradient: "from-[#0A66C2] to-[#1E88E5]",
      transactions: "₹60Cr+",
      linkedin: "#"
    },
    {
      name: "Aditya Goel",
      role: "Closing Expert",
      specialization: "Closing & Token Commitments",
      experience: "7+ Years. Coached 2,500+ agents in high-friction client conversion and deposit collections.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      accent: "text-[#D4AF37]",
      gradient: "from-[#CFAE5D] to-[#D4AF37]",
      transactions: "200Cr+ Portfolio",
      linkedin: "#"
    },
    {
      name: "Priya Sharma",
      role: "Client Relationship Manager",
      specialization: "Sales CRMs & Lead Qualifying",
      experience: "6+ Years. Expert in BANT qualification setups, CRM workflows, and post-sales handovers.",
      avatar: "https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&q=80&w=300",
      accent: "text-[#0A66C2]",
      gradient: "from-[#0A66C2] to-[#1E88E5]",
      transactions: "500+ Clients",
      linkedin: "#"
    }
  ];

  const studentReviews = [
    {
      name: "Dustin Vance",
      course: "Commercial Real Estate: Investment & Underwriting",
      feedback: "The underwriting framework was game-changing. I closed my first commercial listing deal within weeks of completing the program. Highly recommend it to anyone starting out!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      outcome: "Closed ₹1.2Cr Commercial Deal"
    },
    {
      name: "Sarah Jenkins",
      course: "Real Estate Negotiation & Closing Secrets",
      feedback: "The objection handling strategies are pure gold. I went from being afraid of high-net-worth client phone calls to leading key pitches. The mock sessions gave me massive confidence.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      outcome: "Hired at MRJB Realty"
    },
    {
      name: "Arjun Mehta",
      course: "Luxury Real Estate Listings & Brand Authority",
      feedback: "I learned how to build a premium listing portfolio and negotiate exclusive mandates. The branding strategies helped me stand out in a crowded market.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      outcome: "Commission increased by 40%"
    },
    {
      name: "Neha Patel",
      course: "Real Estate Marketing & Digital Funnel Mastery",
      feedback: "From struggling with cold calls to managing a team of 5 junior brokers — this academy transformed my career trajectory. The 100% job support is real. They don't stop until you're placed.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
      outcome: "25+ Qualified Hot Leads/Month"
    }
  ];

  const faqs = [
    {
      question: "What are the timings and platform for the training?",
      answer: "The training is conducted live online via our premium student portal. Each daily class runs 1.5 hours (total of 15 hours). All recorded sessions are uploaded to your personal dashboard within 24 hours, accessible anytime."
    },
    {
      question: "Is there real job placement assistance?",
      answer: "Absolutely. We offer 100% Job Support including executive resume building, mock interview panels, direct interview slots at MRJB Realty and 15+ partner property firms, and dedicated recruiter access throughout your job search."
    },
    {
      question: "How do I claim my certification?",
      answer: "Upon completing all 10 modules, a verified 'Certified Real Estate Sales Specialist' certificate is generated with a unique QR verification hash. It integrates directly with LinkedIn and includes blockchain-verified credentials."
    },
    {
      question: "What is the fee structure and are there EMI options?",
      answer: "The total investment is ₹3,999 — a one-time fee covering all 10 live sessions, study materials, resume templates, certification charges, and placement support. EMI options starting at ₹999/month are available through our partners."
    },
    {
      question: "Who is this program designed for?",
      answer: "This program is designed for aspiring real estate professionals, fresh graduates, career switchers, and existing agents looking to upgrade their sales skills. No prior real estate experience is required."
    },
    {
      question: "What makes BG Realty Academy different from other courses?",
      answer: "We are the official training division of BG Realty — a live operating real estate firm. You learn directly from active practitioners closing deals daily, not academic trainers. Plus, you get direct hiring pipeline access."
    }
  ];

  // ─── ANIMATION VARIANTS ────────────────────────────────────────────
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } })
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  // ─── THEME STYLING CONFIG ──────────────────────────────────────────
  const themeBg = isDarkMode ? 'bg-[#0A0A0C] text-[#E5E7EB]' : 'bg-[#F9FAFB] text-[#1F2937]';
  const themeText = isDarkMode ? 'text-[#CFCFCF]/80' : 'text-[#4B5563]';
  const themeTextMuted = isDarkMode ? 'text-[#CFCFCF]/50' : 'text-[#6B7280]';
  const themeTextTitle = isDarkMode ? 'text-white' : 'text-[#111827]';
  const themeBorder = isDarkMode ? 'border-white/[0.06]' : 'border-[#E5E7EB]';
  const themeCard = isDarkMode ? 'bg-[#111115] border border-white/[0.06] text-[#E5E7EB]' : 'bg-white border border-[#E5E7EB] text-[#1F2937] shadow-[0_10px_30px_rgba(0,0,0,0.03)]';
  const themeCardHover = isDarkMode ? 'hover:bg-[#16161B] hover:border-[#D4AF37]/30' : 'hover:border-[#D4AF37]/50 hover:shadow-xl';

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden selection:bg-[#D4AF37]/20 selection:text-white font-sans ${themeBg}`}>
      
      {/* TOP URGENCY BAR */}
      <div className="relative bg-[#0B0B0B]/95 border-b border-white/[0.04] z-50 overflow-hidden py-2 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/[0.03] via-transparent to-[#0A66C2]/[0.03]"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-x-3 gap-y-2 relative z-10 text-xs font-bold text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]"></span>
            </span>
            <span className="text-[#D4AF37] uppercase tracking-[0.1em] text-[8px] font-black">Live Batch</span>
          </span>
          <span className="text-[#CFCFCF] text-[11px] sm:text-xs">
            🔥 Launch Offer: 10-Day Real Estate Masterclass at <span className="text-white font-black">₹3,999</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-mono text-[#D4AF37] font-bold">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </span>
          <a 
            href="#pricing" 
            className="text-[9px] font-black uppercase tracking-[0.1em] text-[#050505] bg-[#D4AF37] hover:bg-white hover:text-[#050505] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] px-3 py-1 rounded transition-all shrink-0 ml-1 border border-transparent"
          >
            Apply Now
          </a>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`sticky top-0 left-0 right-0 z-50 px-8 md:px-16 py-4 backdrop-blur-xl border-b shadow-lg transition-all duration-300 ${
        isDarkMode ? 'bg-[#0A0A0C]/90 border-white/[0.04] shadow-black/40' : 'bg-white/90 border-[#E5E7EB] shadow-slate-200/50'
      }`}>
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <BGLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-500" />
            <div className="flex flex-col text-left">
              <span className={`text-base font-black tracking-tight leading-none transition-colors duration-300 ${
                isDarkMode ? 'text-white group-hover:text-[#D4AF37]' : 'text-[#111827] group-hover:text-[#D4AF37]'
              }`}>
                BG REALTY
              </span>
              <span className="text-[9px] font-bold text-[#D4AF37]/60 uppercase tracking-[0.2em] mt-0.5">
                Training Academy
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'About', to: '/about' },
              { label: 'Courses', to: '/courses' },
              { label: 'Contact', to: '/contact' }
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className={`px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5 ${
                  link.to === '/' 
                    ? 'text-[#D4AF37]' 
                    : isDarkMode 
                      ? 'text-[#CFCFCF]/70 hover:text-[#D4AF37]' 
                      : 'text-[#4B5563] hover:text-[#D4AF37]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`h-9 w-9 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 ${
                isDarkMode
                  ? 'bg-white/[0.06] border-white/[0.12] text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30'
                  : 'bg-black/[0.04] border-black/[0.1] text-[#4B5563] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login button — premium gold, visible in both modes */}
            <Link to="/dashboard" className="hidden sm:inline-flex">
              <Button 
                id="nav-login-btn"
                className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 bg-[#D4AF37] text-[#050505] border border-transparent hover:bg-[#E5C76B] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95"
              >
                Login
              </Button>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors cursor-pointer ${isDarkMode ? 'text-[#CFCFCF] hover:text-white' : 'text-[#4B5563] hover:text-black'}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`absolute top-full left-0 right-0 border-b z-50 px-6 py-8 flex flex-col gap-5 lg:hidden shadow-2xl ${
                isDarkMode ? 'bg-[#0B0B0B] border-[#D4AF37]/10' : 'bg-white border-[#E5E7EB]'
              }`}
            >
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'About', to: '/about' },
                  { label: 'Courses', to: '/courses' },
                  { label: 'Contact', to: '/contact' }
                ].map((link, idx) => (
                  <Link 
                    key={idx}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-3 px-4 text-sm font-black uppercase tracking-[0.15em] transition-all rounded-xl hover:bg-[#D4AF37]/5 ${
                      link.to === '/'
                        ? 'text-[#D4AF37]'
                        : isDarkMode
                          ? 'text-[#CFCFCF]/60 hover:text-white border-b border-white/[0.02]'
                          : 'text-[#4B5563] hover:text-black border-b border-black/[0.02]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className={`pt-4 border-t flex items-center justify-between gap-4 ${isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.05]'}`}>
                {/* Mobile theme toggle */}
                <button
                  onClick={toggleTheme}
                  className={`h-11 px-4 flex items-center gap-2 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isDarkMode
                      ? 'bg-white/[0.05] border-white/[0.1] text-[#CFCFCF] hover:text-[#D4AF37]'
                      : 'bg-black/[0.03] border-black/[0.08] text-[#4B5563] hover:text-[#D4AF37]'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDarkMode ? 'Light' : 'Dark'}
                </button>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button className="w-full text-center h-11 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl bg-[#D4AF37] text-[#050505] border border-transparent hover:bg-[#E5C76B] active:scale-95">
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-[0.07]"
            alt="City Skyline"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? 'from-[#0A0A0C] via-[#0A0A0C]/85 to-[#0A0A0C]' : 'from-white via-white/85 to-white'}`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A66C2]/5 via-transparent to-[#D4AF37]/5"></div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#0A66C2]/5 rounded-full blur-[200px] animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[200px] animate-pulse-slow pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3.5 py-1.5 rounded-full">
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Ranked #1 Real Estate Program</span>
                </div>
              </div>

              <h1 className={`text-4xl md:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight ${themeTextTitle}`}>
                Master Real Estate
                <br />
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-clip-text text-transparent">
                  Investing From
                </span>
                <br />
                Industry Leaders
              </h1>

              <p className={`text-base md:text-lg max-w-xl leading-relaxed font-medium transition-colors ${themeText}`}>
                Elite 10-day live training program designed by top real estate professionals. 
                Master sales, negotiation, and investment strategies — then get placed at premium firms.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a href="#pricing" className="group">
                  <Button id="hero-cta-primary" variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-3 h-14 px-10 text-xs font-black uppercase tracking-[0.15em] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] text-[#050505] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95">
                    Secure Your Seat
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <a href="#pricing" className="group">
                  <Button id="hero-cta-secondary" variant="outline" className={`w-full sm:w-auto flex items-center justify-center gap-3 h-14 px-10 transition-all duration-300 text-xs font-black uppercase tracking-[0.15em] rounded-2xl backdrop-blur-sm ${
                    isDarkMode
                      ? 'border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white/[0.04]'
                      : 'border border-[#1F2937]/25 text-[#1F2937] bg-white hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}>
                    <Play className="w-4 h-4 text-[#D4AF37]" /> View Syllabus
                  </Button>
                </a>
              </div>

              <div className={`flex items-center gap-4 pt-6 border-t ${themeBorder}`}>
                <div className="flex -space-x-3">
                  {teamMembers.slice(0, 4).map((m, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full border-2 overflow-hidden ${isDarkMode ? 'border-[#0A0A0C]' : 'border-white'}`}>
                      <img src={m.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <span className={`text-sm font-black transition-colors ${themeTextTitle}`}>Learn from 5 Elite Mentors</span>
                  <span className={`text-[10px] font-bold block uppercase tracking-[0.1em] transition-colors ${themeTextMuted}`}>50+ Years Combined Experience</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex items-center justify-center"
            >
              <div className="relative w-full max-w-[450px]">
                <div className={`relative rounded-3xl overflow-hidden border backdrop-blur-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] shadow-[0_20px_80px_rgba(0,0,0,0.6)]' 
                    : 'border-[#E5E7EB] bg-white shadow-xl'
                }`}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                  
                  <div className="p-6 space-y-6">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                      <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                        className="w-full h-full object-cover"
                        alt="Modern real estate"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#0A0A0C]' : 'from-white'} via-transparent to-transparent`}></div>
                      
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div className={`backdrop-blur-md px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-[#050505]/80 border-white/[0.08]' : 'bg-white/95 border-[#E5E7EB]'}`}>
                          <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.1em]">Live Training</span>
                          <p className={`text-xs font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>10 Days • 15 Hours</p>
                        </div>
                        <div className="bg-[#D4AF37] px-3 py-2 rounded-xl">
                          <span className="text-[9px] text-[#050505] font-black uppercase tracking-[0.1em]">Batch</span>
                          <p className="text-xs font-black text-[#050505] mt-0.5">Starting Soon</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: ShieldCheck, text: "Industry-Recognized Certification", color: "#D4AF37" },
                        { icon: Briefcase, text: "100% Job Placement Support", color: "#0A66C2" },
                        { icon: GraduationCap, text: "Learn from Active Industry Mentors", color: "#D4AF37" },
                      ].map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-white/[0.03]' : 'bg-black/[0.03]'}`}>
                            <f.icon className="w-4 h-4" style={{ color: f.color }} />
                          </div>
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#4B5563]'}`}>{f.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 ${isDarkMode ? 'text-[#CFCFCF]/30' : 'text-black/30'}`}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* FEATURED COURSES */}
      <section className={`relative py-20 md:py-28 px-6 md:px-12 border-t border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-[#111115] border-white/[0.03]' : 'bg-white border-[#E5E7EB]'
      }`}>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/2 rounded-full blur-[180px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-left mb-12 md:mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Premium Curriculum</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] ${themeTextTitle}`}>
                  Featured Courses to<br />
                  <span className="text-[#D4AF37]">Elevate Your Expertise</span>
                </h2>
                <p className={`text-sm max-w-xl leading-relaxed font-medium mt-4 ${themeText}`}>
                  Explore our premium courses covering commercial underwriting, development, luxury sales, and lead generation funnels.
                </p>
              </div>
              <Link to="/courses">
                <Button
                  id="explore-courses-btn"
                  variant="outline"
                  className={`h-12 px-6 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl border flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${
                    isDarkMode
                      ? 'border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white/[0.03]'
                      : 'border-[#1F2937]/30 text-[#1F2937] bg-white hover:border-[#D4AF37] hover:text-[#D4AF37] shadow-sm hover:shadow-md'
                  }`}
                >
                  Explore All Courses
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {mockData.courses.map((course, i) => (
              <motion.div
                key={course.id}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${themeCard} ${themeCardHover}`}
              >
                {/* Course Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#111115]' : 'from-white'} via-transparent to-transparent`} />

                  {/* Price Badge — top right of thumbnail */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-[#D4AF37] text-[#050505] font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-md">
                      {course.price && parseFloat(course.price) > 0
                        ? `₹${parseFloat(course.price).toLocaleString('en-IN')}`
                        : 'Free'}
                    </span>
                  </div>
                </div>

                {/* Course Details — Name + Buy Now only */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className={`text-base font-black transition-colors duration-300 leading-snug ${themeTextTitle} group-hover:text-[#D4AF37]`}>
                      {course.title}
                    </h3>
                  </div>

                  <div>
                    <Link to={`/courses/${course.id}`} className="block">
                      <Button
                        className={`w-full py-3 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all duration-300 border flex items-center justify-center gap-2 ${
                          isDarkMode
                            ? 'bg-[#D4AF37] border-transparent text-[#050505] hover:bg-[#E5C76B] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                            : 'bg-[#050505] border-transparent text-white hover:bg-[#D4AF37] hover:text-[#050505] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                        }`}
                      >
                        Buy Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY BG REALTY */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 transition-colors duration-300" id="highlights">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/0 via-[#0B0B0B]/0 to-[#050505]/0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-left mb-10 md:mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Why Choose Us</span>
            </div>
            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] ${themeTextTitle}`}>
              Why Choose BG Realty?<br />
              <span className="text-[#D4AF37]">Premium Training. Real Results.</span>
            </h2>
            <p className={`text-sm max-w-xl leading-relaxed font-medium ${themeText}`}>
              A comprehensive curriculum focused on practical sales skills, live interaction, 
              executive mentorship, and guaranteed placement assistance.
            </p>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                className={`group relative rounded-3xl p-6 transition-all duration-500 border ${themeCard} ${themeCardHover}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${h.gradient} flex items-center justify-center mb-5 relative`}>
                  <h.icon className={`w-6 h-6 ${h.accent}`} />
                </div>
                <h3 className={`text-lg font-black mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 ${themeTextTitle}`}>{h.title}</h3>
                <p className={`text-sm leading-relaxed font-medium ${themeText}`}>{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU'LL ACHIEVE & CAREER OUTCOMES */}
      <section className={`relative py-20 md:py-28 px-6 md:px-12 border-t border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0A0A0C] border-white/[0.03]' : 'bg-[#F9FAFB] border-[#E5E7EB]'
      }`} id="careers">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-4 py-1.5 rounded-full">
                <Briefcase className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#0A66C2]">Outcome-Driven Academy</span>
              </div>
              <h2 className={`text-3xl md:text-5xl font-black leading-[1.1] ${themeTextTitle}`}>
                What You'll Achieve: <br />
                <span className="text-[#D4AF37]">Career Acceleration</span>
              </h2>
              <p className={`text-sm leading-relaxed font-medium ${themeText}`}>
                We prepare you for the absolute reality of high-ticket real estate. Our graduates gain practical, operational sales knowledge that puts them months ahead of traditional candidates.
              </p>
              
              <div className="space-y-4 pt-4">
                {[
                  { title: "Day-One Job Readiness", desc: "Crafting executive real estate CVs and mock panel interviews with sales directors." },
                  { title: "Direct Recruiter Placement", desc: "Gain interview entries with our verified network of 15+ real estate developers." },
                  { title: "Growth & Brokerage Setup", desc: "Get mentored on initiating your own premium property brokerage business." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-black ${themeTextTitle}`}>{item.title}</h4>
                      <p className={`text-[11px] font-bold ${themeTextMuted} mt-0.5`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { 
                    icon: GraduationCap, 
                    title: "Executive Skillset", 
                    desc: "Objection handling, valuation mechanics, pipeline building, CRM analytics, and RERA compliance." 
                  },
                  { 
                    icon: Target, 
                    title: "HNW Sales Execution", 
                    desc: "Direct scripts and psychology formulas to approach, pitch, and close high-net-worth buyers." 
                  },
                  { 
                    icon: Building2, 
                    title: "Partner Agency Openings", 
                    desc: "Direct hiring access at premium firms like MRJB Realty, CBRE, Compass, and Sotheby's." 
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Uncapped Earning Slabs", 
                    desc: "High basic salaries starting from ₹4.8L LPA, supplemented by lucrative property closure commissions." 
                  }
                ].map((item, i) => (
                  <div key={i} className={`p-5 rounded-2xl border transition-all duration-300 ${themeCard} hover:border-[#D4AF37]/30 hover:scale-[1.02]`}>
                    <item.icon className="w-6 h-6 text-[#D4AF37] mb-3" />
                    <h4 className={`text-xs font-black mb-1 ${themeTextTitle}`}>{item.title}</h4>
                    <p className={`text-[11px] font-medium leading-normal ${themeText}`}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className={`grid grid-cols-3 gap-4 p-5 rounded-2xl border ${themeCard}`}>
                {[
                  { value: "92%", label: "Placement Rate" },
                  { value: "₹4.8L", label: "Avg Fresher CTC" },
                  { value: "15+", label: "Hiring Partners" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <span className="text-2xl font-black text-[#D4AF37] block">{stat.value}</span>
                    <span className={`text-[9px] uppercase tracking-[0.1em] font-black block mt-1 ${themeTextMuted}`}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STUDENT SUCCESS & REVIEWS */}
      <section className={`relative py-20 md:py-28 px-6 md:px-12 border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-[#111115] border-white/[0.03]' : 'bg-white border-[#E5E7EB]'
      }`} id="reviews">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#D4AF37]/[0.02] rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Student Success & Reviews</span>
            </div>
            <h2 className={`text-3xl md:text-5xl font-black ${themeTextTitle}`}>
              Reviews From Our <span className="text-[#D4AF37]">Future Leaders</span>
            </h2>
            <p className={`text-sm max-w-xl mx-auto leading-relaxed font-medium ${themeText}`}>
              See how our alumni transformed their careers, landed premium roles, and scaled their property brokerage pipelines.
            </p>
          </motion.div>

          {/* Testimonial Slider Wrapper */}
          <div className="relative overflow-hidden min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {studentReviews.map((review, i) => i === currentReview && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full p-8 md:p-12 rounded-3xl text-left flex flex-col md:flex-row gap-8 items-center ${themeCard}`}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 border-2 border-[#D4AF37]/40 shadow-lg">
                    <img src={review.avatar} className="w-full h-full object-cover" alt={review.name} />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className={`text-lg font-black ${themeTextTitle}`}>{review.name}</h4>
                        <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">{review.course}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 text-[#D4AF37] fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <p className={`text-sm md:text-base italic leading-relaxed font-medium ${themeText}`}>
                      "{review.feedback}"
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="inline-flex items-center bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Outcome: {review.outcome}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2.5 mt-8">
            {studentReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentReview(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentReview === i
                    ? 'bg-[#D4AF37] w-6'
                    : isDarkMode
                      ? 'w-2.5 bg-white/20 hover:bg-white/40'
                      : 'w-2.5 bg-black/20 hover:bg-black/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={`relative py-20 md:py-28 px-6 md:px-12 border-t border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0A0A0C] border-[#0A0A0C]' : 'bg-[#F9FAFB] border-[#E5E7EB]'
      }`} id="pricing">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/3 rounded-full blur-[200px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Secure Your Future</span>
            </div>
            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] ${themeTextTitle}`}>
              Premium Investment.<br />
              <span className="text-[#D4AF37]">Exceptional Returns.</span>
            </h2>
            <p className={`text-sm max-w-lg mx-auto leading-relaxed font-medium ${themeText}`}>
              One-time investment for a lifetime career. No hidden fees, no recurring charges. 
              Just pure, actionable real estate expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className={`space-y-6 rounded-3xl p-8 ${themeCard}`}>
                <h3 className={`text-lg font-black flex items-center gap-3 ${themeTextTitle}`}>
                  <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                  Everything Included
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
                    "Direct Hiring Interviews at Partners",
                    "Lifetime Portal Access",
                    "EMI Options Available",
                    "Money-Back Guarantee",
                    "LinkedIn Profile Badge",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isDarkMode ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/20'
                      }`}>
                        <Check className="w-3 h-3 text-[#D4AF37]" />
                      </div>
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#4B5563]'}`}>{item}</span>
                    </div>
                  ))}
                </div>

                <div className={`border rounded-2xl p-5 space-y-3 ${isDarkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-[#E5E7EB]'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] uppercase tracking-[0.15em] font-black ${themeTextMuted}`}>Enrollment Status</span>
                    <span className="text-[10px] text-[#D4AF37] font-black">{Math.round((enrollmentCount / 50) * 100)}% Booked</span>
                  </div>
                  <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/[0.05]' : 'bg-slate-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] rounded-full transition-all duration-1000"
                      style={{ width: `${(enrollmentCount / 50) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className={themeTextMuted}>{enrollmentCount} Seats Booked</span>
                    <span className="text-[#D4AF37] font-bold">{50 - enrollmentCount} Remaining</span>
                  </div>
                </div>

                {/* 10-Day Syllabus Collapsible Accordion */}
                <div className={`mt-6 pt-6 border-t ${themeBorder}`}>
                  <button 
                    onClick={() => setCurriculumExpanded(!curriculumExpanded)}
                    className="flex items-center justify-between w-full group py-2"
                  >
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-[#D4AF37]">
                      <BookOpen className="w-4 h-4" />
                      <span>View 10-Day Masterclass Syllabus</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#CFCFCF]/50 transition-transform duration-300 ${curriculumExpanded ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {curriculumExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-4 space-y-3"
                      >
                        {curriculum.map((day) => (
                          <div key={day.day} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-slate-50 border-[#E5E7EB]'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">
                                Day {day.day} • {day.duration}
                              </span>
                            </div>
                            <h4 className={`text-xs font-black ${themeTextTitle}`}>{day.title}</h4>
                            <p className={`text-[11px] font-medium mt-1 leading-relaxed ${themeText}`}>{day.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {day.details.slice(0, 2).map((detail, idx) => (
                                <span key={idx} className={`text-[9px] px-2 py-0.5 rounded font-bold ${isDarkMode ? 'bg-white/5 text-[#CFCFCF]/70' : 'bg-white text-[#4B5563] border border-[#E5E7EB]'}`}>
                                  ✓ {detail}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -6 }}
              className="lg:col-span-5"
            >
              <div className={`relative border-2 border-[#D4AF37]/30 rounded-3xl p-8 backdrop-blur-xl h-full flex flex-col shadow-lg transition-all ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-white/[0.03] to-white/[0.01]' 
                  : 'bg-white'
              }`}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#D4AF37] text-[#050505] text-[8px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full">
                    Best Value
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="text-center pt-4">
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-black block ${themeTextMuted}`}>All-Inclusive Program Fee</span>
                    <div className="flex items-baseline justify-center gap-3 mt-3">
                      <span className="text-5xl md:text-6xl font-black text-[#D4AF37]">₹3,999</span>
                      <span className={`text-sm line-through ${themeTextMuted}`}>₹9,999</span>
                    </div>
                    <span className="inline-block mt-2 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black px-3 py-1 rounded-full border border-[#D4AF37]/20">
                      Save 60% — Limited Offer
                    </span>
                  </div>

                  <div className={`border rounded-2xl p-4 text-center ${isDarkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-[#E5E7EB]'}`}>
                    <span className={`text-[9px] uppercase tracking-[0.15em] font-black block mb-2 ${themeTextMuted}`}>Offer Closes In</span>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-mono text-xl font-black text-[#D4AF37]">
                        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  </div>

                  <div className={`border rounded-2xl p-4 ${isDarkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-[#E5E7EB]'}`}>
                    <span className={`text-[9px] uppercase tracking-[0.15em] font-black block mb-2 ${themeTextMuted}`}>EMI Options Available</span>
                    <div className="flex justify-between text-xs">
                      <span className={`font-medium ${themeText}`}>Starting at</span>
                      <span className={`font-black ${themeTextTitle}`}>₹999/month</span>
                    </div>
                  </div>
                </div>

                <div className={`space-y-3 mt-8 pt-8 border-t ${isDarkMode ? 'border-white/[0.06]' : 'border-[#E5E7EB]'}`}>
                  <Link to="/dashboard">
                    <Button id="pricing-enroll-btn" variant="primary" className="w-full h-14 text-xs font-black uppercase tracking-[0.15em] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] text-[#050505] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95">
                      Enroll Now — Join Live Batch
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button id="pricing-reserve-btn" variant="outline" className={`w-full h-12 text-[10px] font-black uppercase tracking-[0.15em] rounded-2xl border transition-all duration-200 ${
                      isDarkMode
                        ? 'border-white/20 text-white hover:text-[#D4AF37] hover:border-[#D4AF37]/40 bg-white/[0.03]'
                        : 'border-[#1F2937]/25 text-[#1F2937] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 bg-transparent'
                    }`}>
                      Reserve Your Seat (Free)
                    </Button>
                  </Link>

                  <div className={`flex justify-between items-center text-[9px] font-black uppercase tracking-[0.1em] pt-2 px-1 ${themeTextMuted}`}>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> Secure Checkout
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#D4AF37]" /> Money-Back Guarantee
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className={`relative py-12 md:py-16 border-t border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-[#111115] border-white/[0.03]' : 'bg-[#F9FAFB] border-[#E5E7EB]'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/[0.01] via-transparent to-[#0A66C2]/[0.01]"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={`text-[10px] uppercase tracking-[0.25em] font-black mb-8 ${themeTextMuted}`}
          >
            Trusted by Elite Agencies & Developers
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center items-center gap-10 md:gap-16"
          >
            {[
              { name: 'MRJB REALTY', gold: true },
              { name: 'CBRE', gold: false },
              { name: 'COMPASS', gold: true },
              { name: 'RE/MAX', gold: false },
              { name: "SOTHEBY'S", gold: true },
              { name: 'KELLER WILLIAMS', gold: false },
            ].map((item, i) => (
              <span 
                key={i} 
                className={`text-lg md:text-xl font-black tracking-[0.15em] transition-all duration-300 cursor-default ${
                  item.gold 
                    ? 'text-[#D4AF37]/60 hover:text-[#D4AF37]' 
                    : isDarkMode 
                      ? 'text-[#CFCFCF]/30 hover:text-[#CFCFCF]/60'
                      : 'text-[#1F2937]/35 hover:text-[#1F2937]/75'
                }`}
              >
                {item.name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`relative py-20 md:py-28 px-6 md:px-12 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0A0A0C]' : 'bg-white'
      }`}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-10 md:mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">FAQ</span>
            </div>
            <h2 className={`text-3xl md:text-5xl font-black leading-[1.05] ${themeTextTitle}`}>
              Everything<br />
              <span className="text-[#D4AF37]">You Need to Know</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeFaq === i 
                    ? 'border-[#D4AF37]/40 bg-gradient-to-r ' + (isDarkMode ? 'from-white/[0.03]' : 'from-slate-50')
                    : isDarkMode 
                      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' 
                      : 'bg-white border-[#E5E7EB] hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className={`w-full p-5 text-left flex justify-between items-center gap-4 transition-colors font-bold text-sm ${
                    isDarkMode ? 'text-white hover:text-[#D4AF37]' : 'text-[#1F2937] hover:text-[#D4AF37]'
                  }`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 shrink-0 ${
                    activeFaq === i ? 'rotate-180 text-[#D4AF37]' : 'text-[#CFCFCF]/50'
                  }`} />
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={`px-5 pb-6 pt-2 text-sm leading-relaxed font-medium border-t ${
                        isDarkMode ? 'text-[#CFCFCF]/70 border-white/[0.04]' : 'text-[#4B5563] border-[#E5E7EB]'
                      }`}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`relative border-t transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0C] border-white/[0.04]' : 'bg-white border-[#E5E7EB]'}`}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            <div className="space-y-5">
              <Link to="/" className="flex items-center gap-3 group">
                <BGLogo className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className={`text-base font-black tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                    BG REALTY
                  </span>
                  <span className="text-[9px] font-bold text-[#D4AF37]/55 uppercase tracking-[0.15em] mt-0.5">
                    Training Academy
                  </span>
                </div>
              </Link>
              <p className={`text-xs leading-relaxed font-medium max-w-xs ${themeText}`}>
                The official real estate training division of BG Realty. Empowering 
                professionals with elite sales, negotiation, and investment skills.
              </p>
              <div className="flex gap-3">
                {[LinkedinIcon, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                    isDarkMode 
                      ? 'bg-white/[0.03] border-white/[0.06] text-[#CFCFCF]/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/20' 
                      : 'bg-black/[0.02] border-[#E5E7EB] text-[#4B5563] hover:text-[#D4AF37] hover:border-[#D4AF37]/40'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.15em] mb-5 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className={`text-xs hover:text-[#D4AF37] transition-colors font-medium ${themeText}`}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={`text-xs hover:text-[#D4AF37] transition-colors font-medium ${themeText}`}>
                    Contact Us
                  </Link>
                </li>
                {[
                  { label: 'Program Highlights', href: '#highlights' },
                  { label: 'Course Curriculum', href: '#pricing' },
                  { label: 'Career Outcomes', href: '#careers' },
                  { label: 'Placement Support', href: '#careers' },
                  { label: 'Student Reviews', href: '#reviews' },
                ].map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className={`text-xs hover:text-[#D4AF37] transition-colors font-medium ${themeText}`}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.15em] mb-5 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>Programs</h4>
              <ul className="space-y-3">
                {[
                  { label: '10-Day Real Estate Masterclass', href: '#pricing' },
                  { label: 'Advanced Sales Coaching', href: '#' },
                  { label: 'Investment Analysis', href: '#' },
                  { label: 'Luxury Property Specialist', href: '#' },
                  { label: 'Custom Corporate Training', href: '#' },
                ].map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className={`text-xs hover:text-[#D4AF37] transition-colors font-medium ${themeText}`}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>Contact</h4>
                <ul className="space-y-3">
                  <li className={`flex items-start gap-2 text-xs font-medium ${themeText}`}>
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    Metro Building Sector 62, Noida, UP
                  </li>
                  <li className={`flex items-center gap-2 text-xs font-medium ${themeText}`}>
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    +91 98765 43210
                  </li>
                  <li className={`flex items-center gap-2 text-xs font-medium ${themeText}`}>
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    admissions@bgrealtyacademy.com
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>Trust & Legal</h4>
                <div className="flex flex-wrap gap-2">
                  {['RERA Compliant', 'ISO Certified', 'SSL Secure', 'Verified'].map((lbl, idx) => (
                    <span key={idx} className={`text-[8px] font-bold px-2.5 py-1 rounded-md border ${
                      isDarkMode 
                        ? 'bg-white/[0.03] border-white/[0.06] text-[#CFCFCF]/60' 
                        : 'bg-black/[0.02] border-[#E5E7EB] text-[#4B5563]'
                    }`}>
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-[0.15em] font-black ${
            isDarkMode ? 'border-white/[0.04] text-[#CFCFCF]/40' : 'border-[#E5E7EB] text-[#6B7280]'
          }`}>
            <p>© 2026 BG Realty Training Academy. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;