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
  BrainCircuit, Eye
} from 'lucide-react';
import { Button, Badge } from '../components/UI';
import { BGLogo } from '../components/Layout';
import { Link } from 'react-router-dom';

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
  // ─── STATES ─────────────────────────────────────────────────────────
  const [activeDay, setActiveDay] = useState(1);
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 44, seconds: 12 });
  const [enrollmentCount, setEnrollmentCount] = useState(42);

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

  const careerOutcomes = [
    {
      role: "Property Consultant",
      salary: "₹4.8L - ₹8.0L LPA + Commissions",
      skills: ["Client Advisory", "Deal Negotiation", "Market Analysis"],
      roadmap: ["Junior Consultant → Senior Consultant → Team Lead → Partner"],
      gradient: "from-[#0A66C2] to-[#1E88E5]",
      icon: Building2
    },
    {
      role: "Commercial Broker",
      salary: "₹6.0L - ₹12.0L LPA + Bonuses",
      skills: ["Commercial Valuation", "Lease Negotiation", "Investment Analysis"],
      roadmap: ["Broker Associate → Senior Broker → Director → VP"],
      gradient: "from-[#D4AF37] to-[#E5C76B]",
      icon: Briefcase
    },
    {
      role: "Investment Advisor",
      salary: "₹5.0L - ₹10.0L LPA + Carry",
      skills: ["Portfolio Strategy", "ROI Modeling", "Risk Assessment"],
      roadmap: ["Analyst → Advisor → Senior Advisor → Fund Manager"],
      gradient: "from-[#0A66C2] to-[#1E88E5]",
      icon: TrendingUp
    },
    {
      role: "Luxury Property Specialist",
      salary: "₹7.0L - ₹15.0L LPA + Commission",
      skills: ["HNW Client Management", "Luxury Branding", "Exclusive Listings"],
      roadmap: ["Specialist → Senior Specialist → Director → VP Luxury"],
      gradient: "from-[#D4AF37] to-[#CFAE5D]",
      icon: Crown
    },
    {
      role: "Real Estate Entrepreneur",
      salary: "₹10.0L+ LPA (Uncapped)",
      skills: ["Business Development", "Team Building", "Portfolio Growth"],
      roadmap: ["Independent Broker → Agency Owner → Developer → Investor"],
      gradient: "from-[#0A66C2] to-[#1E88E5]",
      icon: Globe
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
      points: ["HNW client listing advisory", "Close high-ticket contracts", "Coordinate legal property registries"]
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

  const testimonials = [
    {
      quote: "The 10-day program was a career game-changer. I applied the qualifying script from Day 4 and closed my first residential deal within 15 days of finishing the class. The mentorship is world-class.",
      author: "Dustin Vance",
      role: "Real Estate Advisor",
      city: "Mumbai",
      salaryBefore: "₹2.4L",
      salaryAfter: "₹5.2L",
      dealVolume: "₹1.2Cr",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "Before this course, I struggled with site-visit objection handling. The sales coaching and mock rounds gave me massive confidence. Got hired directly by a developer group in Delhi NCR within 3 weeks!",
      author: "Sarah Jenkins",
      role: "Sales Specialist",
      city: "Delhi NCR",
      salaryBefore: "₹3.0L",
      salaryAfter: "₹6.8L",
      dealVolume: "₹3.5Cr",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "The ROI modeling and negotiation modules alone paid for the course 10x over. I'm now handling high-net-worth clients and closing premium deals I never thought possible.",
      author: "Arjun Mehta",
      role: "Investment Advisor",
      city: "Bangalore",
      salaryBefore: "₹3.6L",
      salaryAfter: "₹9.0L",
      dealVolume: "₹5.8Cr",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "From struggling with cold calls to managing a team of 5 junior brokers — this academy transformed my career trajectory. The 100% job support is real. They don't stop until you're placed.",
      author: "Neha Patel",
      role: "Senior Property Consultant",
      city: "Pune",
      salaryBefore: "₹1.8L",
      salaryAfter: "₹7.2L",
      dealVolume: "₹2.8Cr",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150"
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

  // ─── RENDER ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E7EB] overflow-x-hidden selection:bg-[#D4AF37]/20 selection:text-white font-sans">
      
      {/* TOP URGENCY BAR */}
      <div className="relative bg-[#0B0B0B] border-b border-[#D4AF37]/10 text-center z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-[#0A66C2]/5"></div>
        <div className="relative py-3 px-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
            </span>
            <span className="text-[#D4AF37] uppercase tracking-[0.15em] text-[10px] font-black">Live Batch</span>
          </span>
          <span className="text-[#E5E7EB]">🔥 Launch Offer: 10-Day Real Estate Masterclass at <span className="text-[#D4AF37] font-black">₹3,999</span></span>
          <span className="hidden md:inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <Clock className="w-3 h-3 text-[#D4AF37]" />
            <span className="font-mono text-[#D4AF37]">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </span>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 left-0 right-0 z-50 px-6 md:px-12 py-3.5 flex items-center justify-between backdrop-blur-xl bg-[#050505]/90 border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <BGLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-500" />
            <div className="flex flex-col text-left">
              <span className="text-base font-black tracking-tight leading-none text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                BG REALTY
              </span>
              <span className="text-[9px] font-bold text-[#D4AF37]/60 uppercase tracking-[0.2em] mt-0.5">
                Training Academy
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Overview', href: '#highlights' },
              { label: 'Curriculum', href: '#curriculum' },
              { label: 'Careers', href: '#careers' },
              { label: 'Placement', href: '#placement' },
              { label: 'Mentors', href: '#mentors' },
              { label: 'Pricing', href: '#pricing' },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#CFCFCF]/70 hover:text-white transition-all duration-200 rounded-xl hover:bg-white/[0.03]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden sm:inline-flex">
              <Button variant="ghost" className="text-[#CFCFCF] hover:text-white text-[10px] font-black uppercase tracking-[0.15em] h-10 border border-white/5 hover:border-[#D4AF37]/20 rounded-xl px-5">
                Student Portal
              </Button>
            </Link>
            <a href="#pricing">
              <Button variant="primary" className="h-10 px-5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] text-[#050505] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300">
                Enroll — ₹3,999
              </Button>
            </a>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#CFCFCF] hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[72px] left-0 right-0 bg-[#0B0B0B]/98 backdrop-blur-xl border-b border-[#D4AF37]/10 z-40 px-6 py-8 flex flex-col gap-5 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {[
                { label: 'Overview', href: '#highlights' },
                { label: 'Curriculum', href: '#curriculum' },
                { label: 'Careers', href: '#careers' },
                { label: 'Placement', href: '#placement' },
                { label: 'Mentors', href: '#mentors' },
                { label: 'Pricing', href: '#pricing' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-sm font-black uppercase tracking-[0.15em] text-[#CFCFCF]/60 hover:text-white transition-all rounded-xl hover:bg-white/[0.03] border-b border-white/[0.02]"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="pt-4 border-t border-white/[0.05]">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button variant="outline" className="w-full text-[#CFCFCF] hover:text-white text-[10px] font-black uppercase tracking-[0.15em] h-11 border border-white/10 hover:border-[#D4AF37]/20 rounded-xl">
                  Student Portal
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-20"
            alt="City Skyline"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/85 to-[#050505]"></div>
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
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3.5 py-1.5 rounded-full">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Certified Program</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-3.5 py-1.5 rounded-full">
                  <Users className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#0A66C2]">15,000+ Alumni</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                  <Briefcase className="w-3.5 h-3.5 text-[#E5E7EB]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#E5E7EB]">92% Placement</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">
                Master Real Estate
                <br />
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-clip-text text-transparent">
                  Investing From
                </span>
                <br />
                Industry Leaders
              </h1>

              <p className="text-base md:text-lg text-[#CFCFCF]/80 max-w-xl leading-relaxed font-medium">
                Elite 10-day live training program designed by top real estate professionals. 
                Master sales, negotiation, and investment strategies — then get placed at premium firms.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm">
                  <span className="text-2xl md:text-3xl font-black text-[#D4AF37]">15K+</span>
                  <span className="text-[9px] text-[#CFCFCF]/60 uppercase tracking-[0.1em] font-black block mt-1">Graduates</span>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm">
                  <span className="text-2xl md:text-3xl font-black text-[#D4AF37]">₹250Cr+</span>
                  <span className="text-[9px] text-[#CFCFCF]/60 uppercase tracking-[0.1em] font-black block mt-1">Deal Volume</span>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm">
                  <span className="text-2xl md:text-3xl font-black text-[#D4AF37]">92%</span>
                  <span className="text-[9px] text-[#CFCFCF]/60 uppercase tracking-[0.1em] font-black block mt-1">Placement Rate</span>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm">
                  <span className="text-2xl md:text-3xl font-black text-[#D4AF37]">50+</span>
                  <span className="text-[9px] text-[#CFCFCF]/60 uppercase tracking-[0.1em] font-black block mt-1">Partners</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#pricing" className="group">
                  <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-3 h-14 px-10 text-xs font-black uppercase tracking-[0.15em] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] text-[#050505] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-all duration-300">
                    Secure Your Seat
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <a href="#curriculum" className="group">
                  <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-3 h-14 px-10 border border-white/10 hover:border-[#D4AF37]/30 text-white text-xs font-black uppercase tracking-[0.15em] rounded-2xl bg-white/[0.02] backdrop-blur-sm">
                    <Play className="w-4 h-4 text-[#D4AF37]" /> View Curriculum
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/[0.04]">
                <div className="flex -space-x-3">
                  {teamMembers.slice(0, 4).map((m, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#050505] overflow-hidden">
                      <img src={m.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <span className="text-sm font-black text-white">Learn from 5 Elite Mentors</span>
                  <span className="text-[10px] text-[#CFCFCF]/60 font-bold block uppercase tracking-[0.1em]">50+ Years Combined Experience</span>
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
                <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                  
                  <div className="p-6 space-y-6">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                      <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                        className="w-full h-full object-cover"
                        alt="Modern real estate"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                      
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div className="bg-[#050505]/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/[0.08]">
                          <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.1em]">Live Training</span>
                          <p className="text-xs font-bold text-white mt-0.5">10 Days • 15 Hours</p>
                        </div>
                        <div className="bg-[#D4AF37]/90 backdrop-blur-md px-3 py-2 rounded-xl">
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
                          <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
                            <f.icon className="w-4 h-4" style={{ color: f.color }} />
                          </div>
                          <span className="text-xs font-bold text-[#E5E7EB]">{f.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-2xl p-3 shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#D4AF37]" />
                    <div className="text-left">
                      <span className="text-[8px] text-[#CFCFCF]/60 uppercase tracking-widest font-black block">Ranked #1</span>
                      <span className="text-xs font-black text-white">Real Estate Training</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-[#0B0B0B] border border-[#0A66C2]/20 rounded-2xl p-3 shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0A66C2]" />
                    <div className="text-left">
                      <span className="text-[8px] text-[#CFCFCF]/60 uppercase tracking-widest font-black block">Hiring Partner</span>
                      <span className="text-xs font-black text-white">MRJB Realty</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>

        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#CFCFCF]/30"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* TRUST BAR */}
      <section className="relative py-10 md:py-14 border-t border-white/[0.03] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/[0.02] via-transparent to-[#0A66C2]/[0.02]"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] text-[#CFCFCF]/50 uppercase tracking-[0.25em] font-black mb-6"
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
                    : 'text-[#CFCFCF]/30 hover:text-[#CFCFCF]/60'
                }`}
              >
                {item.name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY BG REALTY */}
      <section className="relative py-16 md:py-20 px-6 md:px-12" id="highlights">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0B0B0B]/50 to-[#050505]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-left mb-10 md:mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Why BG Realty?</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
              Premium Training.<br />
              <span className="text-[#D4AF37]">Real Results.</span>
            </h2>
            <p className="text-sm text-[#CFCFCF]/80 max-w-xl leading-relaxed font-medium">
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
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 transition-all duration-500 hover:border-[#D4AF37]/20 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${h.gradient} flex items-center justify-center mb-5 relative`}>
                  <h.icon className={`w-6 h-6 ${h.accent}`} />
                </div>
                <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">{h.title}</h3>
                <p className="text-sm text-[#CFCFCF]/70 leading-relaxed font-medium">{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-[#0B0B0B] border-t border-white/[0.03] border-b border-white/[0.03]" id="curriculum">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-left mb-10 md:mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-4 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#0A66C2]">10-Day Roadmap</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
              Executive<br />
              <span className="text-[#D4AF37]">Learning Journey</span>
            </h2>
            <p className="text-sm text-[#CFCFCF]/80 max-w-xl leading-relaxed font-medium">
              Explore each module. Every day builds toward mastery in real estate sales, 
              negotiation, legal compliance, and career readiness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-2">
              {curriculum.map((day) => (
                <motion.button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  whileHover={{ x: 4 }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 cursor-pointer ${
                    activeDay === day.day 
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-white shadow-lg' 
                      : 'bg-white/[0.02] border-white/[0.05] text-[#CFCFCF]/50 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                    activeDay === day.day 
                      ? 'bg-[#D4AF37] text-[#050505]' 
                      : 'bg-white/[0.05] text-[#CFCFCF]/50'
                  }`}>
                    {String(day.day).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[8px] uppercase tracking-[0.15em] font-black block mb-0.5 ${
                      activeDay === day.day ? 'text-[#D4AF37]/80' : 'text-[#CFCFCF]/30'
                    }`}>
                      Module {String(day.day).padStart(2, '0')}
                    </span>
                    <span className="text-xs md:text-sm font-black truncate block">{day.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${
                    activeDay === day.day ? 'text-[#D4AF37]' : 'text-[#CFCFCF]/30'
                  }`} />
                </motion.button>
              ))}
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {curriculum.map((day) => day.day === activeDay && (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 h-full overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
                          <day.icon className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.1em] border border-[#D4AF37]/20">
                              Day {day.day}
                            </span>
                            <span className="text-[10px] text-[#CFCFCF]/50 font-bold">{day.duration} Interactive</span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-white mt-2">{day.title}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-[#CFCFCF]/70 leading-relaxed font-medium">
                        {day.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.1em]">Module Progress</span>
                          <span className="text-[10px] text-[#CFCFCF]/50 font-bold">{day.day * 10}% Complete</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] rounded-full transition-all duration-500"
                            style={{ width: `${day.day * 10}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                        <span className="text-[10px] text-[#E5E7EB] font-black uppercase tracking-[0.1em]">Key Focus Areas</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {day.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                              <span className="text-xs text-[#CFCFCF]/70 font-medium">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-[#CFCFCF]/50 font-bold">
                          <Download className="w-3.5 h-3.5" />
                          Download module resources
                        </div>
                        <a href="#pricing">
                          <Button variant="primary" className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] text-[#050505]">
                            Enroll Now
                          </Button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER OUTCOMES */}
      <section className="relative py-16 md:py-20 px-6 md:px-12" id="careers">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-left mb-10 md:mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Career Outcomes</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
              Your Future<br />
              <span className="text-[#D4AF37]">Career Roadmap</span>
            </h2>
            <p className="text-sm text-[#CFCFCF]/80 max-w-xl leading-relaxed font-medium">
              Choose your path. Each career track includes salary projections, 
              skill development, and a clear progression roadmap.
            </p>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {careerOutcomes.map((career, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/20 hover:bg-white/[0.04]"
              >
                <div className={`absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-500 bg-gradient-to-b ${career.gradient}`}></div>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${career.gradient}/10 flex items-center justify-center`}>
                      <career.icon className={`w-5 h-5`} style={{ color: career.gradient.includes('D4AF37') ? '#D4AF37' : '#0A66C2' }} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-[#D4AF37] transition-colors">{career.role}</h3>
                      <span className="text-[#D4AF37] text-xs font-black">{career.salary}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.15em] font-black">Skills Acquired</span>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.map((skill, idx) => (
                        <span key={idx} className="bg-white/[0.03] border border-white/[0.06] text-[#CFCFCF]/70 text-[10px] font-bold px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.04]">
                    <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.15em] font-black block mb-2">Career Progression</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#CFCFCF]/60 font-medium">
                      {career.roadmap.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <span className="bg-white/[0.03] px-2 py-1 rounded-md">{step}</span>
                          {idx < career.roadmap.length - 1 && <ArrowRight className="w-3 h-3 text-[#D4AF37]/50" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PLACEMENT */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-[#0B0B0B] border-t border-white/[0.03] border-b border-white/[0.03]" id="placement">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-4 py-1.5 rounded-full">
                  <Briefcase className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#0A66C2]">Job Placement Command</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.05]">
                  Your Career.<br />
                  <span className="text-[#D4AF37]">We Deliver.</span>
                </h2>
                <p className="text-sm text-[#CFCFCF]/80 leading-relaxed font-medium">
                  We don't stop until you're placed. Our dedicated career support team 
                  works with you from day one until you sign your offer letter.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Building2, title: "Hiring Partners", desc: "15+ partner firms actively recruiting" },
                  { icon: MessageSquare, title: "Interview Support", desc: "Mock panels and real interview prep" },
                  { icon: FileText, title: "Resume Building", desc: "Executive real estate resume crafting" },
                  { icon: Users, title: "Recruiter Access", desc: "Direct connect with hiring managers" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-[#0A66C2]/20 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-[#D4AF37] mb-3" />
                    <h4 className="text-xs font-black text-white mb-1">{item.title}</h4>
                    <p className="text-[10px] text-[#CFCFCF]/60 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 space-y-5"
            >
              <span className="text-[10px] text-[#CFCFCF]/50 uppercase tracking-[0.2em] font-black block">Active Hiring Profiles</span>
              
              {jobRoles.map((role, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-[#D4AF37]/20 hover:bg-white/[0.04]"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#E5C76B] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-0 group-hover:pl-4 transition-all">
                    <div>
                      <h4 className="text-sm font-black text-white">{role.role}</h4>
                      <p className="text-[10px] text-[#CFCFCF]/60 font-bold mt-0.5">{role.company}</p>
                    </div>
                    <span className="inline-flex items-center bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] font-black px-3 py-1.5 rounded-full">
                      {role.salary}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-wrap gap-2">
                    {role.points.map((p, pIdx) => (
                      <span key={pIdx} className="bg-white/[0.02] border border-white/[0.05] text-[#CFCFCF]/60 text-[9px] font-bold px-2.5 py-1 rounded-md">
                        {p}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { value: "92%", label: "Placement Success" },
                  { value: "₹4.8L", label: "Avg Starting Package" },
                  { value: "15+", label: "Hiring Partners" },
                ].map((stat, i) => (
                  <div key={i} className="text-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    <span className="text-2xl font-black text-[#D4AF37]">{stat.value}</span>
                    <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.1em] font-black block mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CERTIFICATION */}
      <section className="relative py-16 md:py-20 px-6 md:px-12" id="certification">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Official Credentials</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.05]">
                Earn Your<br />
                <span className="text-[#D4AF37]">Professional Badge</span>
              </h2>
              <p className="text-sm text-[#CFCFCF]/80 leading-relaxed font-medium">
                Showcase your expertise with a premium, verifiable certificate. 
                Upon completion, receive a gold-sealed digital credential recognized across the industry.
              </p>

              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, title: "Blockchain-Verified", desc: "Unique QR verification hash for instant authentication" },
                  { icon: LinkedinIcon, title: "LinkedIn Integration", desc: "One-click share to your professional profile" },
                  { icon: BadgeCheck, title: "Industry Recognized", desc: "Accepted by 50+ partner firms and brokerages" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">{item.title}</h4>
                      <p className="text-[10px] text-[#CFCFCF]/60 font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 flex justify-center"
            >
              <div className="w-full max-w-[550px] aspect-[1.414] bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] border-2 border-[#D4AF37]/30 rounded-2xl p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative overflow-hidden text-center">
                <div className="absolute inset-2 border border-[#D4AF37]/10 rounded-xl pointer-events-none"></div>
                <div className="absolute inset-3 border border-[#D4AF37]/5 rounded-lg pointer-events-none"></div>
                
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/40"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/40"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/40"></div>

                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <BGLogo className="w-72 h-72" />
                </div>

                <div className="space-y-3 relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#D4AF37]/70 block">BG Realty Training Academy</span>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">CERTIFICATE OF COMPLETION</h3>
                  <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
                </div>

                <div className="my-4 space-y-2 relative z-10">
                  <p className="text-[10px] text-[#CFCFCF]/50 italic">This prestigious credential is awarded to</p>
                  <p className="text-lg md:text-xl font-black text-white font-serif border-b border-[#D4AF37]/20 w-3/4 mx-auto pb-2">
                    [Your Name]
                  </p>
                </div>

                <p className="text-[10px] md:text-[11px] text-[#CFCFCF]/60 leading-relaxed max-w-sm mx-auto relative z-10 font-medium">
                  for successfully completing the <strong className="text-white">10-Day Real Estate Training & Sales Program</strong>, 
                  demonstrating mastery in property consultation, communication, lead qualification, site visits, and negotiation.
                </p>

                <div className="flex justify-center relative z-10 my-2">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border-2 border-[#D4AF37]/30">
                    <div className="grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 ${i % 2 === 0 ? 'bg-[#050505]' : 'bg-white'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-3 px-4 relative z-10">
                  <div className="text-left">
                    <div className="text-xs font-black text-white font-serif border-b border-[#D4AF37]/20 pb-1 px-1">Amit Sharma</div>
                    <span className="text-[8px] text-[#CFCFCF]/50 font-bold mt-0.5 block">Director, BG Realty</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-white font-serif border-b border-[#D4AF37]/20 pb-1 px-1">Rajesh Verma</div>
                    <span className="text-[8px] text-[#CFCFCF]/50 font-bold mt-0.5 block">Lead Instructor</span>
                  </div>
                </div>

                <div className="text-[8px] text-[#CFCFCF]/40 font-mono mt-3 relative z-10">
                  verify.bgrealtyacademy.com/CERT-2026-{Math.floor(Math.random() * 89999 + 10000)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-[#0B0B0B] border-t border-white/[0.03] border-b border-white/[0.03]" id="testimonials">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-left mb-10 md:mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Alumni Success</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
              Real Success.<br />
              <span className="text-[#D4AF37]">Real Metrics.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testimonials.slice(0, 2).map((test, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 transition-all duration-500 hover:border-[#D4AF37]/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-[#D4AF37]/20">
                    <img src={test.avatar} className="w-full h-full object-cover" alt={test.author} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-black text-white">{test.author}</h4>
                        <p className="text-xs text-[#CFCFCF]/60 font-medium">{test.role} • {test.city}</p>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#CFCFCF]/70 italic leading-relaxed font-medium mb-6">
                  "{test.quote}"
                </p>

                <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/[0.04]">
                  <div className="text-center">
                    <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.1em] font-black block mb-1">Before</span>
                    <span className="text-sm font-black text-[#CFCFCF]/60">{test.salaryBefore}</span>
                  </div>
                  <div className="text-center border-x border-white/[0.04]">
                    <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.1em] font-black block mb-1">After</span>
                    <span className="text-sm font-black text-[#D4AF37]">{test.salaryAfter}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.1em] font-black block mb-1">Deal Volume</span>
                    <span className="text-sm font-black text-white">{test.dealVolume}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section className="relative py-16 md:py-20 px-6 md:px-12" id="mentors">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-left mb-10 md:mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Elite Industry Mentors</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
              Learn From<br />
              <span className="text-[#D4AF37]">The Best</span>
            </h2>
            <p className="text-sm text-[#CFCFCF]/80 max-w-xl leading-relaxed font-medium">
              Every mentor is an active practitioner closing multi-crore deals. 
              You learn strategies that work in today's market.
            </p>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              >
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${member.gradient}/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-all duration-300">
                    <img src={member.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={member.name} />
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border mb-1.5 ${
                      i % 2 === 0 
                        ? 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20' 
                        : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'
                    }`}>
                      {member.role}
                    </span>
                    <h3 className="text-base font-black text-white leading-tight">{member.name}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[8px] text-[#CFCFCF]/50 uppercase tracking-[0.15em] font-black block mb-1">Specialization</span>
                    <p className="text-xs font-black text-white">{member.specialization}</p>
                  </div>
                  
                  <div className="h-px bg-white/[0.04]"></div>
                  
                  <div>
                    <span className="text-[8px] text-[#CFCFCF]/50 uppercase tracking-[0.15em] font-black block mb-1">Transaction Volume</span>
                    <p className="text-sm font-black text-[#D4AF37]">{member.transactions}</p>
                  </div>

                  <div className="h-px bg-white/[0.04]"></div>

                  <p className="text-[11px] text-[#CFCFCF]/60 font-medium leading-relaxed">
                    {member.experience}
                  </p>

                  <a 
                    href={member.linkedin}
                    className="inline-flex items-center gap-2 text-[10px] font-bold text-[#0A66C2] hover:text-[#D4AF37] transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    View LinkedIn Profile
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-black block">Collective Expertise</span>
              <p className="text-xs text-[#CFCFCF]/60 font-medium mt-1">The numbers behind our mentor panel</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50+", label: "Years Combined" },
                { value: "₹500Cr+", label: "Total Transactions" },
                { value: "5,000+", label: "Students Mentored" },
                { value: "50+", label: "Partner Developers" },
              ].map((stat, i) => (
                <div key={i} className={i > 0 ? "border-l border-white/[0.06]" : ""}>
                  <span className="text-3xl md:text-4xl font-black text-[#D4AF37] block">{stat.value}</span>
                  <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.1em] font-black block mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-[#0B0B0B] border-t border-white/[0.03]" id="pricing">
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
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
              Premium Investment.<br />
              <span className="text-[#D4AF37]">Exceptional Returns.</span>
            </h2>
            <p className="text-sm text-[#CFCFCF]/80 max-w-lg mx-auto leading-relaxed font-medium">
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
              <div className="space-y-6 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8">
                <h3 className="text-lg font-black text-white flex items-center gap-3">
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
                      <div className="w-5 h-5 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#D4AF37]" />
                      </div>
                      <span className="text-xs font-bold text-[#E5E7EB]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#CFCFCF]/50 uppercase tracking-[0.15em] font-black">Enrollment Status</span>
                    <span className="text-[10px] text-[#D4AF37] font-black">{Math.round((enrollmentCount / 50) * 100)}% Booked</span>
                  </div>
                  <div className="h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] rounded-full transition-all duration-1000"
                      style={{ width: `${(enrollmentCount / 50) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#CFCFCF]/60 font-medium">
                    <span>{enrollmentCount} Seats Booked</span>
                    <span className="text-[#D4AF37] font-bold">{50 - enrollmentCount} Remaining</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -6 }}
              className="lg:col-span-5"
            >
              <div className="relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-2 border-[#D4AF37]/20 rounded-3xl p-8 backdrop-blur-xl h-full flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#D4AF37] text-[#050505] text-[8px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full">
                    Best Value
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="text-center pt-4">
                    <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.2em] font-black block">All-Inclusive Program Fee</span>
                    <div className="flex items-baseline justify-center gap-3 mt-3">
                      <span className="text-5xl md:text-6xl font-black text-[#D4AF37]">₹3,999</span>
                      <span className="text-sm text-[#CFCFCF]/50 line-through">₹9,999</span>
                    </div>
                    <span className="inline-block mt-2 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black px-3 py-1 rounded-full border border-[#D4AF37]/20">
                      Save 60% — Limited Offer
                    </span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 text-center">
                    <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.15em] font-black block mb-2">Offer Closes In</span>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-mono text-xl font-black text-[#D4AF37]">
                        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                    <span className="text-[9px] text-[#CFCFCF]/50 uppercase tracking-[0.15em] font-black block mb-2">EMI Options Available</span>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#CFCFCF]/70 font-medium">Starting at</span>
                      <span className="text-white font-black">₹999/month</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-8 pt-8 border-t border-white/[0.06]">
                  <Link to="/dashboard">
                    <Button variant="primary" className="w-full h-14 text-xs font-black uppercase tracking-[0.15em] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] text-[#050505] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-all duration-300">
                      Enroll Now — Join Live Batch
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full h-12 text-[10px] font-black uppercase tracking-[0.15em] rounded-2xl border-white/10 text-[#CFCFCF] hover:text-white hover:border-[#D4AF37]/30">
                      Reserve Your Seat (Free)
                    </Button>
                  </Link>

                  <div className="flex justify-between items-center text-[9px] text-[#CFCFCF]/50 font-black uppercase tracking-[0.1em] pt-2 px-1">
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

      {/* FAQ */}
      <section className="relative py-16 md:py-20 px-6 md:px-12">
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
            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.05]">
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
                className={`bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeFaq === i ? 'border-[#D4AF37]/20 bg-white/[0.03]' : ''
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 text-white hover:text-[#D4AF37] transition-colors font-bold text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#CFCFCF]/50 transition-transform duration-300 shrink-0 ${
                    activeFaq === i ? 'rotate-180 text-[#D4AF37]' : ''
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
                      <div className="px-5 pb-6 pt-2 text-sm text-[#CFCFCF]/70 leading-relaxed border-t border-white/[0.04] bg-white/[0.01] font-medium">
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
      <footer className="relative border-t border-white/[0.03] bg-[#0B0B0B]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            <div className="space-y-5">
              <Link to="/" className="flex items-center gap-3 group">
                <BGLogo className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tight leading-none text-white">
                    BG REALTY
                  </span>
                  <span className="text-[9px] font-bold text-[#D4AF37]/50 uppercase tracking-[0.15em] mt-0.5">
                    Training Academy
                  </span>
                </div>
              </Link>
              <p className="text-xs text-[#CFCFCF]/60 leading-relaxed font-medium max-w-xs">
                The official real estate training division of BG Realty. Empowering 
                professionals with elite sales, negotiation, and investment skills.
              </p>
              <div className="flex gap-3">
                {[LinkedinIcon, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#CFCFCF]/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 transition-all duration-200">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Program Highlights', href: '#highlights' },
                  { label: 'Course Curriculum', href: '#curriculum' },
                  { label: 'Career Outcomes', href: '#careers' },
                  { label: 'Placement Support', href: '#placement' },
                  { label: 'Our Mentors', href: '#mentors' },
                ].map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-xs text-[#CFCFCF]/60 hover:text-[#D4AF37] transition-colors font-medium">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-5">Programs</h4>
              <ul className="space-y-3">
                {[
                  { label: '10-Day Real Estate Masterclass', href: '#pricing' },
                  { label: 'Advanced Sales Coaching', href: '#' },
                  { label: 'Investment Analysis', href: '#' },
                  { label: 'Luxury Property Specialist', href: '#' },
                  { label: 'Custom Corporate Training', href: '#' },
                ].map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-xs text-[#CFCFCF]/60 hover:text-[#D4AF37] transition-colors font-medium">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Contact</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-xs text-[#CFCFCF]/60 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    Metro Building Sector 62, Noida, UP
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#CFCFCF]/60 font-medium">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    +91 98765 43210
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#CFCFCF]/60 font-medium">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    admissions@bgrealtyacademy.com
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Trust & Legal</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/[0.03] border border-white/[0.06] text-[#CFCFCF]/60 text-[8px] font-bold px-2.5 py-1 rounded-md">RERA Compliant</span>
                  <span className="bg-white/[0.03] border border-white/[0.06] text-[#CFCFCF]/60 text-[8px] font-bold px-2.5 py-1 rounded-md">ISO Certified</span>
                  <span className="bg-white/[0.03] border border-white/[0.06] text-[#CFCFCF]/60 text-[8px] font-bold px-2.5 py-1 rounded-md">SSL Secure</span>
                  <span className="bg-white/[0.03] border border-white/[0.06] text-[#CFCFCF]/60 text-[8px] font-bold px-2.5 py-1 rounded-md">Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-[#CFCFCF]/40 font-black uppercase tracking-[0.15em]">
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