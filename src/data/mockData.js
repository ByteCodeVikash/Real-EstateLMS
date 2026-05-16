import { BookOpen, Video, Users, CheckCircle, Clock, Layout, Shield, Bell, Settings, Award, Calendar, Zap, Play, Check, Lock, Globe, MessageSquare, Download, Share2, Eye, ShieldCheck, Fingerprint, Monitor, Smartphone, Tablet } from 'lucide-react';

export const mockData = {
  stats: [
    { label: "Active Courses", value: "8", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Study Hours", value: "124h", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Certifications", value: "3", icon: Award, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Knowledge Rank", value: "Top 5%", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
  ],
  
  weeklyActivity: [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 4.2 },
    { name: 'Wed', hours: 3.8 },
    { name: 'Thu', hours: 5.1 },
    { name: 'Fri', hours: 2.9 },
    { name: 'Sat', hours: 6.4 },
    { name: 'Sun', hours: 4.5 },
  ],

  courses: [
    {
      id: 1,
      title: "Commercial Real Estate: Investment & Analysis",
      instructor: "Robert Sterling",
      progress: 75,
      duration: "18h 30m",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      category: "Investment",
      status: "In Progress",
      isPremium: true
    },
    {
      id: 2,
      title: "High-Ticket Property Flipping Masterclass",
      instructor: "Elena Rodriguez",
      progress: 45,
      duration: "12h 45m",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      category: "Strategy",
      status: "In Progress",
      isPremium: true
    },
    {
      id: 3,
      title: "Real Estate Laws & Compliance 2026",
      instructor: "Marcus Thorne",
      progress: 100,
      duration: "8h 15m",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      category: "Legal",
      status: "Completed",
      isPremium: true
    },
    {
      id: 4,
      title: "Sustainable Urban Development Models",
      instructor: "Samantha Vance",
      progress: 0,
      duration: "14h 20m",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
      category: "Development",
      status: "Not Started",
      isPremium: true
    }
  ],

  liveClasses: [
    {
      id: 1,
      title: "Live Analysis: NYC Market Trends",
      mentor: "Robert Sterling",
      time: "Starts in 12:45",
      date: "Today, 9:00 PM",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      isLive: true
    },
    {
      id: 2,
      title: "Negotiation Tactics for High-End Closings",
      mentor: "Elena Rodriguez",
      time: "Tomorrow",
      date: "May 17, 11:30 AM",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      isLive: false
    }
  ],

  lectures: [
    { id: 1, title: "Market Cycle Fundamentals", duration: "08:20", completed: true, locked: false },
    { id: 2, title: "Commercial Valuation Models", duration: "15:45", completed: true, locked: false },
    { id: 3, title: "Debt & Equity Structuring", duration: "22:10", completed: true, locked: false },
    { id: 4, title: "Risk Mitigation in Large-Scale Assets", duration: "28:30", completed: false, locked: false },
    { id: 5, title: "Advanced Portfolio Diversification", duration: "18:50", completed: false, locked: true },
    { id: 6, title: "Exit Strategies & Capital Gains", duration: "24:15", completed: false, locked: true },
  ],

  devices: [
    { id: 1, name: "Studio Workstation", type: "Desktop", location: "New York, US", status: "Active Now", icon: Monitor },
    { id: 2, name: "Field Tablet Pro", type: "Tablet", location: "London, UK", status: "Active 4h ago", icon: Smartphone },
    { id: 3, name: "Personal iPhone", type: "Mobile", location: "Dubai, UAE", status: "Inactive", icon: Tablet },
  ],

  notifications: [
    { id: 1, title: "Live Market Analysis", message: "Robert Sterling is analyzing NYC property trends in 10 mins.", time: "10m ago", type: "urgent", icon: Video },
    { id: 2, title: "New Resource Added", message: "Download the '2026 Global Real Estate Outlook' PDF now.", time: "3h ago", type: "info", icon: Zap },
    { id: 3, title: "Authorized Access", message: "New login verified from London, UK office.", time: "6h ago", type: "warning", icon: Shield },
    { id: 4, title: "Certificate Earned", message: "Congratulations! You completed 'RE Laws & Compliance'.", time: "2d ago", type: "success", icon: Award },
  ]
};
