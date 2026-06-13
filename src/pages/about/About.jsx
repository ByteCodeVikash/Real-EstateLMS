import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, Star, ArrowRight, Play, CheckCircle, ShieldCheck, 
  ChevronDown, BookOpen, Calendar, HelpCircle, Award, Target, Trophy, 
  MapPin, Flame, Phone, Mail, Clock, ShieldAlert, ArrowUpRight, ChevronRight,
  TrendingUp, Download, Check, Shield, FileText, MessageSquare, Briefcase, 
  GraduationCap, DollarSign, Menu, X, ExternalLink, 
  BarChart3, Zap, Globe, Layers, Sparkles, Gem, Crown, 
  Server, BadgeCheck, BrainCircuit, Eye
} from 'lucide-react';
import { Button, Badge } from '../../components/UI';
import { BGLogo } from '../../components/Layout';
import { Link } from 'react-router-dom';

// SVG icons
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
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: "Vikram Singhania",
      role: "Principal Underwriting Director",
      specialization: "Commercial Real Estate & Valuation",
      transactions: "₹250Cr+",
      experience: "Ex-Director at DLF & JLL Underwriting. Managed institutional transaction boards for multi-tenant retail hubs.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
      linkedin: "#",
      gradient: "from-amber-500 to-yellow-600"
    },
    {
      name: "Riya Sharma",
      role: "Director of Luxury Retail sales",
      specialization: "Premium Residential Closing",
      transactions: "₹150Cr+",
      experience: "Former Vice President of Luxury Portfolio at Sotheby's Realty. Specialized in HNW client management and closing drills.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      linkedin: "#",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "Rohan Verma",
      role: "Head of Channel Sales Development",
      specialization: "Developer Relationships & Off-Plan",
      transactions: "₹100Cr+",
      experience: "Ex-Regional Lead at Godrej Properties channel sales. Bridged builder incentives and client closing mandates.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
      linkedin: "#",
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } 
    })
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  return (
    <div className="min-h-screen bg-white text-[#4B5563] selection:bg-[#D4AF37]/15 selection:text-[#D4AF37]">
      {/* HEADER NAVBAR */}
      <nav className="sticky top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 md:py-5 flex items-center justify-between backdrop-blur-xl bg-white/90 border-b border-[#E5E7EB] shadow-sm transition-all duration-300">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <BGLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-500" />
            <div className="flex flex-col text-left">
              <span className="text-base font-black tracking-tight leading-none text-[#111827] group-hover:text-[#D4AF37] transition-colors duration-300">
                BG REALTY
              </span>
              <span className="text-[9px] font-bold text-[#D4AF37]/60 uppercase tracking-[0.2em] mt-0.5">
                Training Academy
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-[#D4AF37] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5">
              Home
            </Link>
            <Link to="/about" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#D4AF37] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5">
              About
            </Link>
            <Link to="/courses" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-[#D4AF37] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5">
              Courses
            </Link>
            <Link to="/contact" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-[#D4AF37] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden sm:inline-flex">
              <Button 
                className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 bg-[#D4AF37] text-[#050505] border border-transparent hover:bg-[#E5C76B] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]"
              >
                Login
              </Button>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4B5563] hover:text-black transition-colors cursor-pointer"
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
              className="absolute top-full left-0 right-0 bg-white border-b border-[#E5E7EB] z-50 px-6 py-8 flex flex-col gap-5 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-sm font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-black transition-all rounded-xl hover:bg-[#D4AF37]/5 border-b border-black/[0.02]">
                  Home
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-sm font-black uppercase tracking-[0.15em] text-[#D4AF37] transition-all rounded-xl hover:bg-[#D4AF37]/5 border-b border-black/[0.02]">
                  About
                </Link>
                <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-sm font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-black transition-all rounded-xl hover:bg-[#D4AF37]/5 border-b border-black/[0.02]">
                  Courses
                </Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-sm font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-black transition-all rounded-xl hover:bg-[#D4AF37]/5 border-b border-black/[0.02]">
                  Contact
                </Link>
              </div>
              <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between gap-4">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button className="w-full text-center h-11 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl bg-[#D4AF37] text-[#050505] border border-transparent hover:bg-[#E5C76B]">
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b border-[#E5E7EB]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-[0.07]"
            alt="Office Architecture"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/85 to-white"></div>
        </div>
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[200px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Learn From Active Practitioners</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#111827] leading-none tracking-tight">
              Shaping Elite Real Estate<br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-clip-text text-transparent">Closing Professionals</span>
            </h1>
            <p className="text-sm md:text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed font-medium">
              We are the educational division of BG Realty, bridging the gap between passive theoretical studies and the realities of high-ticket real estate closures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative p-8 md:p-10 rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3">Our Mission</h3>
            <p className="text-xs md:text-sm text-[#4B5563] leading-relaxed font-medium">
              To empower aspiring agents and industry veterans alike with the exact closing, valuation, and transaction structuring methodologies needed to orchestrate premium deals. We replace textbook theory with live registry logs, deal sheets, and mock investor boards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative p-8 md:p-10 rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-[#0A66C2]" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3">Our Vision</h3>
            <p className="text-xs md:text-sm text-[#4B5563] leading-relaxed font-medium">
              To become the global benchmark for practical real estate education. We aim to construct an open ecosystem where local agents, builders, and graduates use interactive technologies to transact, upskill, and find guaranteed career placements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* COMPANY STORY & ACADEMY OVERVIEW */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 bg-[#F9FAFB] border-t border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Company Story</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-[#111827] leading-tight">
              Forged in the Fires of<br />
              <span className="text-[#D4AF37]">Live Property Closures.</span>
            </h2>

            <p className="text-xs md:text-sm text-[#4B5563] leading-relaxed font-medium">
              Founded as the educational arm of BG Realty, the Training Academy emerged from a simple observation: new real estate agents spent months struggling to close deals due to a lack of practical transaction coaching. Basic licensing courses covered zoning laws, but left out lead qualification, objection handling, and pricing spreadsheets.
            </p>
            <p className="text-xs md:text-sm text-[#6B7280] leading-relaxed font-medium">
              We decided to open our in-house training pipelines to the public. By combining active developer relationship managers, senior brokerage directors, and structured daily workshops, we built a curriculum that moves graduates from complete beginners to active deal closers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-6"
          >
            <div className="relative p-8 rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">
              <h3 className="text-lg font-black text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-4">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Academy Overview
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Practical First", desc: "No textbook lectures. Learn on commercial calculators and real CRM data." },
                  { title: "Live Underwriting", desc: "Evaluate real property ROIs, developer discounts, and tax codes." },
                  { title: "Direct Placements", desc: "Interview with active recruiters at MRJB Realty and 15+ developers." },
                  { title: "Active Instructors", desc: "All modules are taught by active sales directors closing deals weekly." }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl">
                    <span className="text-xs font-black text-[#D4AF37] block mb-1">{item.title}</span>
                    <span className="text-[11px] text-[#6B7280] font-medium leading-relaxed block">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY STUDENTS CHOOSE US */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-4 py-1.5 rounded-full">
            <Trophy className="w-3.5 h-3.5 text-[#0A66C2]" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#0A66C2]">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] leading-tight">
            The Preferred Training Platform<br />
            for <span className="text-[#D4AF37]">Aspiring Builders & Brokers</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Live Deal Simulation",
              desc: "You won't just listen. You perform qualification drills, draft commitment contracts, negotiate deal rebates, and handle investor objections live in class.",
              icon: BrainCircuit,
              color: "#D4AF37"
            },
            {
              title: "Developer Placement Network",
              desc: "Gain direct channel partnership privileges. Over 15+ premium builders invite our certified candidates to skip primary resume filters.",
              icon: HandshakeIcon,
              color: "#0A66C2"
            },
            {
              title: "Actionable Templates Library",
              desc: "Graduate with an active repository of property underwriting sheets, pitch scripts, land tax checklists, and brokerage forms.",
              icon: FileText,
              color: "#D4AF37"
            }
          ].map((card, idx) => {
            const Icon = card.icon || Award;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 md:p-8 bg-white border border-[#E5E7EB] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <h3 className="text-lg font-black text-[#111827] mb-2">{card.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed font-medium">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="relative py-12 md:py-16 bg-[#F9FAFB] border-t border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Years Combined Experience" },
            { value: "₹500Cr+", label: "Total Transactions Directed" },
            { value: "5,000+", label: "Certified Graduates" },
            { value: "15+", label: "Developer Partnerships" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <span className="text-4xl md:text-5xl font-black text-[#D4AF37] block">{stat.value}</span>
              <span className="text-[10px] text-[#6B7280] uppercase tracking-[0.1em] font-black block mt-2">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRAINERS/MENTORS */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-left mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Expert Board</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] leading-tight">
            Learn Under Active<br />
            <span className="text-[#D4AF37]">Executive Instructors</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6 }}
              className="group relative bg-white border border-[#E5E7EB] rounded-3xl p-6 overflow-hidden transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-[#D4AF37]/40 hover:shadow-xl"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-all duration-300">
                  <img src={member.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={member.name} />
                </div>
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border mb-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20`}>
                    {member.role}
                  </span>
                  <h3 className="text-base font-black text-[#111827] leading-tight">{member.name}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[8px] text-[#6B7280] uppercase tracking-[0.15em] font-black block mb-1">Specialization</span>
                  <p className="text-xs font-black text-[#1F2937]">{member.specialization}</p>
                </div>
                <div className="h-px bg-[#E5E7EB]"></div>
                <div>
                  <span className="text-[8px] text-[#6B7280] uppercase tracking-[0.15em] font-black block mb-1">Directed Closures</span>
                  <p className="text-sm font-black text-[#D4AF37]">{member.transactions}</p>
                </div>
                <div className="h-px bg-[#E5E7EB]"></div>
                <p className="text-[11px] text-[#4B5563] font-medium leading-relaxed">
                  {member.experience}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 bg-[#F9FAFB] border-t border-[#E5E7EB] overflow-hidden text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Start Training Today</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[#111827] leading-tight">
            Accelerate Your Journey with the<br />
            <span className="text-[#D4AF37]">10-Day Real Estate Masterclass</span>
          </h2>

          <p className="text-xs md:text-sm text-[#4B5563] max-w-xl mx-auto leading-relaxed font-medium">
            Gain immediate access to premium underwriting sheets, Objection templates, live training hours, and direct interviews at MRJB Realty and 15+ partner builders.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link to="/#pricing">
              <Button variant="primary" className="h-12 px-8 text-xs font-black uppercase tracking-[0.15em] rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] text-[#050505]">
                Enroll Now — ₹3,999
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="h-12 px-8 text-xs font-black uppercase tracking-[0.15em] rounded-xl border border-[#E5E7EB] hover:border-[#D4AF37] hover:text-[#D4AF37] text-[#1F2937] bg-white transition-all">
                Enter Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            <div className="space-y-5">
              <Link to="/" className="flex items-center gap-3 group">
                <BGLogo className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tight leading-none text-[#111827]">
                    BG REALTY
                  </span>
                  <span className="text-[9px] font-bold text-[#D4AF37]/50 uppercase tracking-[0.15em] mt-0.5">
                    Training Academy
                  </span>
                </div>
              </Link>
              <p className="text-xs text-[#4B5563] leading-relaxed font-medium max-w-xs">
                The official real estate training division of BG Realty. Empowering 
                professionals with elite sales, negotiation, and investment skills.
              </p>
              <div className="flex gap-3">
                {[LinkedinIcon, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-black/[0.02] border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-200">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-[0.15em] mb-5">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-xs text-[#4B5563] hover:text-[#D4AF37] transition-colors font-medium">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-xs text-[#4B5563] hover:text-[#D4AF37] transition-colors font-medium">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-xs text-[#4B5563] hover:text-[#D4AF37] transition-colors font-medium">Contact Us</Link>
                </li>
                <li>
                  <a href="/#highlights" className="text-xs text-[#4B5563] hover:text-[#D4AF37] transition-colors font-medium">Program Highlights</a>
                </li>
                <li>
                  <a href="/#curriculum" className="text-xs text-[#4B5563] hover:text-[#D4AF37] transition-colors font-medium">Course Curriculum</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-[0.15em] mb-5">Programs</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/#pricing" className="text-xs text-[#4B5563] hover:text-[#D4AF37] transition-colors font-medium">10-Day Masterclass</a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#4B5563] hover:text-[#D4AF37] transition-colors font-medium">Advanced Sales Coaching</a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#4B5563] hover:text-[#D4AF37] transition-colors font-medium">Commercial Underwriting</a>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-[0.15em]">Contact</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-xs text-[#4B5563] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    Metro Building Sector 62, Noida, UP
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#4B5563] font-medium">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    +91 98765 43210
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#4B5563] font-medium">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    admissions@bgrealtyacademy.com
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-[#6B7280] font-black uppercase tracking-[0.15em]">
            <p>© 2026 BG Realty Training Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HandshakeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 18H5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h5" />
      <path d="M14 18h5a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3h-5" />
      <path d="M12 2v20" />
      <path d="m15 5-3-3-3 3" />
      <path d="m9 19 3 3 3-3" />
    </svg>
  );
}
