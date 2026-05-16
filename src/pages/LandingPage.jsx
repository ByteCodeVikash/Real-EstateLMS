import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Lock, Play, Users, CheckCircle, ChevronRight, Star, ArrowRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { Button, GlassCard, Badge } from '../components/UI';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-premium-dark text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between backdrop-blur-md bg-premium-dark/50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold">Real-EstateLMS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-premium-text">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#instructors" className="hover:text-white transition-colors">Instructors</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Login</Button>
          <Link to="/dashboard">
            <Button>Join Academy</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-premium-accent rounded-full blur-[150px] animate-pulse-slow"></div>
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl z-10"
        >
          <Badge variant="premium" className="mb-6 py-1.5 px-4 text-sm">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" /> Certified Professional Education
            </span>
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-tight">
            Master the <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-premium-accent to-blue-500">
              Real Estate
            </span> Market
          </h1>
          <p className="text-xl text-premium-text mb-12 max-w-2xl mx-auto leading-relaxed">
            Premium education for real estate professionals. Master high-ticket closings, 
            investment analysis, and legal compliance with world-class mentors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/dashboard">
              <Button size="lg" className="group h-16 px-10">
                Access Training Portal
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-10">
              <Play className="mr-2 w-5 h-5 fill-current" />
              Tour Platform
            </Button>
          </div>
        </motion.div>

        {/* Floating Cards Preview */}
        <div className="mt-20 relative w-full max-w-6xl mx-auto z-10 h-[500px] md:h-[600px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="absolute inset-0 rounded-3xl border border-white/10 bg-premium-card shadow-2xl overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
              alt="Dashboard Preview" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-premium-dark via-transparent to-transparent"></div>
          </motion.div>

          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-10 glass-premium p-6 rounded-2xl shadow-2xl z-20 hidden md:block"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-green-400 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-premium-text">Security Status</p>
                <p className="font-bold text-green-400">100% Protected</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-1 w-12 bg-green-500 rounded-full"></div>
              <div className="h-1 w-8 bg-green-500/30 rounded-full"></div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 -right-10 glass-premium p-6 rounded-2xl shadow-2xl z-20 hidden md:block"
          >
            <p className="text-sm text-premium-text mb-4">Certified Professionals</p>
            <div className="flex -space-x-3 mb-4">
              {[1,2,3,4].map(i => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/150?u=${i}`} 
                  className="w-10 h-10 rounded-full border-2 border-premium-card" 
                  alt="avatar"
                />
              ))}
              <div className="w-10 h-10 rounded-full bg-premium-accent flex items-center justify-center text-xs font-bold border-2 border-premium-card">
                +2k
              </div>
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-white">4.9/5.0</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-4">Core Capabilities</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Premium Content</h2>
          <p className="text-premium-text max-w-2xl mx-auto">
            Our platform is designed to give you peace of mind while you focus on teaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Lock, title: "Industry Accreditation", desc: "Gain recognized certifications that validate your expertise in the 2026 market." },
            { icon: Fingerprint, title: "Proprietary Data", desc: "Access exclusive market analysis and case studies not available anywhere else." },
            { icon: Globe, title: "International Reach", desc: "Learn global investment models spanning from Dubai to New York City." },
            { icon: Users, title: "Expert Networking", desc: "Connect with high-net-worth mentors and fellow real estate professionals." },
            { icon: Zap, title: "Live Deal Room", desc: "Join real-time analysis of active property deals and market movements." },
            { icon: Shield, title: "Wealth Protection", desc: "Master the legal frameworks and structures to protect your real estate assets." }
          ].map((feat, i) => (
            <GlassCard key={i} className="group hover:bg-premium-accent/5">
              <div className="w-14 h-14 bg-premium-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feat.icon className="text-premium-accent w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-premium-text leading-relaxed">{feat.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-premium-border/50 bg-premium-card/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center">
                <Shield className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">Real-EstateLMS</span>
            </div>
            <p className="text-premium-text max-w-sm mb-8">
              Empowering educators with the world's most secure learning environment. 
              Protect your content, grow your audience.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-premium-text">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DRM Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-premium-text">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-premium-border/30 flex flex-col md:row justify-between items-center gap-4 text-premium-text text-sm">
          <p>© 2026 Real-EstateLMS. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


