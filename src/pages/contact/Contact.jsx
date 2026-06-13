import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, Phone, Mail, Clock, Send, CheckCircle2, 
  ChevronDown, HelpCircle, Sparkles, Crown, Menu, X, Globe, 
  FileText, MessageSquare, Laptop
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

export default function Contact() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Form state
  const [form, setForm] = useState({ name: '', email: '', phone: '', queryType: 'Admissions', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[0-9]{10,12}$/.test(form.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', queryType: 'Admissions', message: '' });
    }, 1200);
  };

  const contactFaqs = [
    {
      q: "Where is the BG Realty Training Academy located?",
      a: "Our primary campus and executive briefing center is located at the Metro Building, Sector 62, Noida, UP. We are easily accessible via the Sector 62 metro station."
    },
    {
      q: "What are the visiting hours for the campus?",
      a: "We welcome prospective students and corporate partners from Monday to Saturday, between 10:00 AM and 7:00 PM. We recommend scheduling an appointment in advance."
    },
    {
      q: "How can builders contact the Academy for recruitment?",
      a: "Developers, recruitment firms, and brokerages seeking placement access can email corporate@bgrealtyacademy.com or call our placements division directly."
    },
    {
      q: "Can I enroll in the program online?",
      a: "Yes, you can register and pay online via our portal. Once enrolled, you will receive immediate credentials to access the student dashboard and all pre-read materials."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#4B5563] selection:bg-[#D4AF37]/15 selection:text-[#D4AF37] text-left">
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
            <Link to="/about" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-[#D4AF37] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5">
              About
            </Link>
            <Link to="/courses" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-[#D4AF37] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5">
              Courses
            </Link>
            <Link to="/contact" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#D4AF37] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5">
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
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-sm font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-black transition-all rounded-xl hover:bg-[#D4AF37]/5 border-b border-black/[0.02]">
                  About
                </Link>
                <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-sm font-black uppercase tracking-[0.15em] text-[#4B5563] hover:text-black transition-all rounded-xl hover:bg-[#D4AF37]/5 border-b border-black/[0.02]">
                  Courses
                </Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-sm font-black uppercase tracking-[0.15em] text-[#D4AF37] transition-all rounded-xl hover:bg-[#D4AF37]/5 border-b border-black/[0.02]">
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

      {/* HERO HEADER */}
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-[#E5E7EB]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-[0.07]"
            alt="Office Lobby"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/85 to-white"></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[180px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Connect With Placements & Admissions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#111827] leading-none tracking-tight">
              Get in Touch with our<br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-clip-text text-transparent">Academy Advisory Team</span>
            </h1>
            <p className="text-sm text-[#4B5563] max-w-xl mx-auto leading-relaxed font-medium">
              Have questions about the 10-day masterclass syllabus, corporate batches, or placement channels? Submit your query below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAIN LAYOUT: Form (Left) & Info + Map (Right) */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Contact Form Card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-10 rounded-3xl border border-[#E5E7EB] bg-white relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-[#111827]">Send an Inquiry</h2>
                  <p className="text-xs text-[#6B7280] font-medium mt-1">We typically respond within 2-4 business hours.</p>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-black text-[#111827]">Inquiry Received Successfully</h3>
                      <p className="text-xs text-[#4B5563] max-w-md mx-auto leading-relaxed font-medium">
                        Thank you for contacting BG Realty Academy. An admissions coordinator or corporate relations executive has been assigned to your query.
                      </p>
                      <Button 
                        onClick={() => setSubmitted(false)}
                        variant="outline" 
                        className="h-10 text-[10px] font-black uppercase tracking-wider border-[#E5E7EB] text-[#4B5563] hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-xl px-6 bg-white transition-all"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#4B5563] uppercase tracking-widest block">Full Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className={`w-full h-12 bg-white border rounded-xl px-4 text-xs font-semibold text-[#111827] placeholder-gray-400 focus:outline-none transition-all ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'}`}
                          />
                          {errors.name && <span className="text-[10px] text-red-500 font-bold block">{errors.name}</span>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#4B5563] uppercase tracking-widest block">Email Address</label>
                          <input 
                            type="email" 
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className={`w-full h-12 bg-white border rounded-xl px-4 text-xs font-semibold text-[#111827] placeholder-gray-400 focus:outline-none transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'}`}
                          />
                          {errors.email && <span className="text-[10px] text-red-500 font-bold block">{errors.email}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#4B5563] uppercase tracking-widest block">Phone Number</label>
                          <input 
                            type="text" 
                            name="phone"
                            value={form.phone}
                            onChange={handleInputChange}
                            placeholder="+91 9876543210"
                            className={`w-full h-12 bg-white border rounded-xl px-4 text-xs font-semibold text-[#111827] placeholder-gray-400 focus:outline-none transition-all ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'}`}
                          />
                          {errors.phone && <span className="text-[10px] text-red-500 font-bold block">{errors.phone}</span>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#4B5563] uppercase tracking-widest block">Inquiry Type</label>
                          <select 
                            name="queryType"
                            value={form.queryType}
                            onChange={handleInputChange}
                            className="w-full h-12 bg-white border border-[#E5E7EB] rounded-xl px-4 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                          >
                            <option value="Admissions">Admissions & Syllabus</option>
                            <option value="Corporate">Corporate Training Partnerships</option>
                            <option value="Builders">Builder Placement Tie-ups</option>
                            <option value="General">General Inquiries</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#4B5563] uppercase tracking-widest block">Your Message</label>
                        <textarea 
                          name="message"
                          value={form.message}
                          onChange={handleInputChange}
                          rows="4"
                          placeholder="Tell us how we can help you..."
                          className={`w-full bg-white border rounded-xl p-4 text-xs font-semibold text-[#111827] placeholder-gray-400 focus:outline-none transition-all resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'}`}
                        ></textarea>
                        {errors.message && <span className="text-[10px] text-red-500 font-bold block">{errors.message}</span>}
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-12 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] text-[#050505] rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                      >
                        <span>{isSubmitting ? 'Submitting...' : 'Send Message'}</span>
                        <Send className="w-3.5 h-3.5 text-black" />
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Contact Information & Google Map */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Information Cards */}
            <div className="grid grid-cols-1 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex gap-4 hover:border-[#D4AF37]/40 shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#6B7280]">Campus Location</span>
                  <h4 className="text-xs font-black text-[#111827]">Metro Building, Sector 62, Noida, UP</h4>
                  <p className="text-[11px] text-[#4B5563] font-semibold leading-relaxed">Executive briefing rooms & deal negotiation lab (Floor 4).</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex gap-4 hover:border-[#D4AF37]/40 shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#6B7280]">Direct Admissions Hotlines</span>
                  <h4 className="text-xs font-black text-[#111827]">+91 98765 43210</h4>
                  <p className="text-[11px] text-[#4B5563] font-semibold leading-relaxed">Available Mon-Sat (10:00 AM - 7:00 PM).</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex gap-4 hover:border-[#D4AF37]/40 shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#6B7280]">Official Email Channels</span>
                  <h4 className="text-xs font-black text-[#111827]">admissions@bgrealtyacademy.com</h4>
                  <p className="text-[11px] text-[#4B5563] font-semibold leading-relaxed">Admissions: admissions@bgrealtyacademy.com<br />Corporate Partnerships: corporate@bgrealtyacademy.com</p>
                </div>
              </div>
            </div>

            {/* Google Map Placeholder (Styled real Map iframe) */}
            <div className="p-2 rounded-3xl border border-[#E5E7EB] bg-white h-[260px] overflow-hidden relative group shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562013898253!2d77.36195537550098!3d28.612911975674706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce56191c944eb%3A0xe54e60ef2e557b49!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 rounded-2xl opacity-90 transition-opacity group-hover:opacity-100 duration-300"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="BG Realty Training Academy Map Location"
              ></iframe>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-[#E5E7EB] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5 pointer-events-none shadow-sm">
                <Globe className="w-3.5 h-3.5" /> Noida Campus Map
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 bg-[#F9FAFB] border-t border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
              <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Admissions Help</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] leading-tight">
              Admissions FAQ
            </h2>
          </div>

          <div className="space-y-5">
            {contactFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-[#E5E7EB] bg-white rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-black text-xs uppercase tracking-wider text-[#111827] hover:text-[#D4AF37] transition-colors p-5 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-[#E5E7EB]">
                      <p className="text-xs text-[#4B5563] font-semibold leading-relaxed mt-2">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 bg-white overflow-hidden text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">Begin Your Journey</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[#111827] leading-tight">
            Elevate Your Real Estate Career<br />
            with <span className="text-[#D4AF37]">BG Realty Academy</span>
          </h2>

          <p className="text-xs md:text-sm text-[#4B5563] max-w-xl mx-auto leading-relaxed font-medium">
            Join the ranks of certified closers in luxury sales and commercial financial modeling. Start learning immediately.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link to="/#pricing">
              <Button variant="primary" className="h-12 px-8 text-xs font-black uppercase tracking-[0.15em] rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] text-[#050505]">
                View Programs
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
