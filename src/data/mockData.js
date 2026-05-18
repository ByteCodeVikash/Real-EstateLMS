import { BookOpen, Video, Users, CheckCircle, Clock, Shield, Award, Zap, Monitor, Smartphone, Tablet } from 'lucide-react';

export const mockData = {
  stats: [
    { label: "Active Courses", value: "5 Premium", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Mentorship Hours", value: "32h / 50h", icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Accredited Certs", value: "2 Earned", icon: Award, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Academy Progress", value: "Top 2%", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  ],
  
  weeklyActivity: [
    { name: 'Mon', hours: 1.8 },
    { name: 'Tue', hours: 3.5 },
    { name: 'Wed', hours: 4.2 },
    { name: 'Thu', hours: 2.1 },
    { name: 'Fri', hours: 5.6 },
    { name: 'Sat', hours: 8.0 },
    { name: 'Sun', hours: 4.5 },
  ],

  courses: [
    {
      id: 1,
      title: "Commercial Real Estate: Investment & Underwriting",
      instructor: "Robert Sterling",
      progress: 75,
      duration: "24h 45m",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      category: "Investment",
      status: "In Progress",
      isPremium: true,
      lessons: 32,
      description: "Master multi-family underwriting, commercial lease structures, cap rate modeling, and advanced debt/equity leverage strategies."
    },
    {
      id: 2,
      title: "High-Ticket Property Flipping & Development",
      instructor: "Marcus Thorne",
      progress: 40,
      duration: "18h 15m",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      category: "Development",
      status: "In Progress",
      isPremium: true,
      lessons: 24,
      description: "Learn how to source off-market properties, calculate ARV, manage renovation contracts, and exit with maximum profit margins."
    },
    {
      id: 3,
      title: "Luxury Real Estate Listings & Brand Authority",
      instructor: "Elena Rodriguez",
      progress: 100,
      duration: "12h 30m",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
      category: "Luxury Marketing",
      status: "Completed",
      isPremium: true,
      lessons: 18,
      description: "Establish elite presence, market high-net-worth properties, secure exclusive mandates, and construct immersive digital tours."
    },
    {
      id: 4,
      title: "Real Estate Negotiation & Closing Secrets",
      instructor: "Robert Sterling",
      progress: 0,
      duration: "15h 20m",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      category: "Sales Coaching",
      status: "Not Started",
      isPremium: true,
      lessons: 20,
      description: "Acquire game-changing psychological tactics to handle difficult buyers, anchor offers, and close multi-million dollar deals."
    },
    {
      id: 5,
      title: "Real Estate Marketing & Digital Funnel Mastery",
      instructor: "Samantha Vance",
      progress: 0,
      duration: "10h 50m",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      category: "Lead Generation",
      status: "Not Started",
      isPremium: true,
      lessons: 16,
      description: "Set up automated lead pipelines on Meta/Google Ads, design high-converting property landing pages, and optimize your CRM."
    }
  ],

  liveClasses: [
    {
      id: 1,
      title: "Live Deal Analysis: High-Cap Multi-Family Underwriting",
      mentor: "Robert Sterling",
      time: "Starts in 10:45",
      date: "Today, 9:00 PM EST",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      isLive: true
    },
    {
      id: 2,
      title: "Luxury Mandates: Pitching to High-Net-Worth Sellers",
      mentor: "Elena Rodriguez",
      time: "Tomorrow",
      date: "May 19, 11:30 AM EST",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      isLive: false
    }
  ],

  lectures: [
    { id: 1, title: "Macroeconomic Real Estate Cycles & Timing", duration: "12:15", completed: true, locked: false },
    { id: 2, title: "Cap Rate Decoupling & Sensitivity Analysis", duration: "18:40", completed: true, locked: false },
    { id: 3, title: "Structuring GP/LP Equity Splits & Cascades", duration: "25:30", completed: true, locked: false },
    { id: 4, title: "Commercial Debt Leveraging & DSCR Modeling", duration: "32:10", completed: false, locked: false },
    { id: 5, title: "Asset Optimization & Post-Purchase Value Add", duration: "22:50", completed: false, locked: true },
    { id: 6, title: "Exit Underwriting & Refinancing Recaps", duration: "28:15", completed: false, locked: true },
  ],

  devices: [
    { id: 1, name: "SaaS Dashboard Workstation", type: "Desktop", location: "New York, US", status: "Active Now", icon: Monitor },
    { id: 2, name: "Field Broker iPhone 15", type: "Mobile", location: "Miami, US", status: "Active 2h ago", icon: Smartphone },
    { id: 3, name: "Investor iPad Pro", type: "Tablet", location: "Los Angeles, US", status: "Inactive", icon: Tablet },
  ],

  notifications: [
    { id: 1, title: "Live Underwriting Deal", message: "Robert Sterling is breaking down a real Dallas commercial property in 10 mins.", time: "10m ago", type: "urgent", icon: Video },
    { id: 2, title: "Resource Vault Updated", message: "Download the '2026 High-Ticket Real Estate Agreement Templates' now.", time: "2h ago", type: "info", icon: Zap },
    { id: 3, title: "Active Encryption Activated", message: "New login verified from secure node in Miami, US.", time: "5h ago", type: "warning", icon: Shield },
    { id: 4, title: "Accredited Certificate Issued", message: "Congratulations! You completed 'Luxury Listings & Brand Authority'.", time: "1d ago", type: "success", icon: Award },
  ]
};
