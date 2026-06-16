import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  BookOpen, Layers, Edit, Eye, Trash2, Plus, CheckCircle, 
  FolderOpen, Search, SlidersHorizontal, LayoutGrid, List, 
  DollarSign, Users, Award, TrendingUp, Upload, Play, 
  FileText, GripVertical, Trash, Globe, Lock, Star, Clock, 
  ArrowLeft, ChevronRight, Check, X, ShieldAlert, BookOpenCheck,
  MonitorPlay, Link2
} from 'lucide-react';
import { Button, Badge, GlassCard } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { AdminStatCard } from '../../components/admin/AdminComponents';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';

// Preset Thumbnail Gradients for realistic course covers without actual uploads
const THUMBNAIL_PRESETS = [
  { id: 'grad-blue', name: 'Sapphire Funding', classes: 'bg-gradient-to-br from-blue-600 to-indigo-900 text-white' },
  { id: 'grad-violet', name: 'Violet Masterclass', classes: 'bg-gradient-to-br from-purple-600 to-indigo-650 text-white' },
  { id: 'grad-emerald', name: 'Emerald Syndicate', classes: 'bg-gradient-to-br from-emerald-500 to-teal-800 text-white' },
  { id: 'grad-gold', name: 'Gold Premium', classes: 'bg-gradient-to-br from-amber-400 to-orange-600 text-white' },
  { id: 'grad-dark', name: 'Dark Luxury', classes: 'bg-gradient-to-br from-slate-800 to-slate-950 text-white' },
  { id: 'grad-rose', name: 'Rose Flipping', classes: 'bg-gradient-to-br from-rose-500 to-pink-700 text-white' },
];

const Portal = ({ children }) => {
  return createPortal(children, document.body);
};

function Youtube({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

const MOCK_MENTORS = [
  { name: 'Sarah Jenkins', role: 'Premium Broker', avatar: 'SJ', bio: 'Former Sotheby\'s director with ₹2B+ in lifetime residential volume.' },
  { name: 'Alex Mercer', role: 'Lead Underwriting Analyst', avatar: 'AM', bio: 'Ex-Wall Street commercial modeler specializing in syndication mathematics.' },
  { name: 'Michael Chang', role: 'Real Estate Attorney', avatar: 'MC', bio: 'Author of "Zoning Codes Decoded" and compliance expert for multifamily developments.' }
];

const initialCourses = [
  { 
    id: 1, 
    title: "Luxury Flipping Masterclass", 
    instructor: "Sarah Jenkins", 
    price: 1499, 
    duration: "12 Weeks", 
    students: 480, 
    completionRate: 88, 
    revenue: 719520, 
    status: "Published", 
    rating: 4.9,
    category: "Luxury Brokerage",
    tags: ["High Ticket", "Flipping", "Staging"],
    thumbnailPreset: "grad-violet",
    description: "Learn to identify undervalued luxury assets, negotiate premium acquisition prices, manage high-end rehab designs, and stage properties to secure maximum ROI.",
    modules: [
      {
        id: "mod-1-1",
        title: "Module 1: High-End Comparables & Analysis",
        lectures: [
          { id: "lec-1-1", title: "Identifying Affluent Demographics", duration: "18m", type: "video" },
          { id: "lec-1-2", title: "Analyzing Premium Upgrades ROI", duration: "25m", type: "video" },
          { id: "lec-1-3", title: "Luxury Comp Valuation Sheet", duration: "10m", type: "document" }
        ]
      },
      {
        id: "mod-1-2",
        title: "Module 2: High-End Renovations & Contractor Deals",
        lectures: [
          { id: "lec-1-4", title: "Negotiating with Elite Subcontractors", duration: "32m", type: "video" },
          { id: "lec-1-5", title: "Material Sourcing & Staging Blueprints", duration: "45m", type: "video" }
        ]
      }
    ]
  },
  { 
    id: 2, 
    title: "Commercial Underwriting & Modeling", 
    instructor: "Alex Mercer", 
    price: 2100, 
    duration: "10 Weeks", 
    students: 320, 
    completionRate: 75, 
    revenue: 672000, 
    status: "Published", 
    rating: 4.8,
    category: "Underwriting",
    tags: ["Excel Modeling", "LTV & DSCR", "Commercial"],
    thumbnailPreset: "grad-blue",
    description: "Master the financial tools required to evaluate office spaces, industrial buildings, and retail strip centers. Build models for loan-to-value (LTV) and debt service coverage ratios (DSCR).",
    modules: [
      {
        id: "mod-2-1",
        title: "Module 1: Commercial Asset Classes Overview",
        lectures: [
          { id: "lec-2-1", title: "Triple Net (NNN) Leases Demystified", duration: "20m", type: "video" },
          { id: "lec-2-2", title: "CAP Rates vs Cash-on-Cash Return", duration: "35m", type: "video" }
        ]
      },
      {
        id: "mod-2-2",
        title: "Module 2: Advanced Financial Modeling",
        lectures: [
          { id: "lec-2-3", title: "Structuring the Pro-Forma Worksheet", duration: "42m", type: "video" },
          { id: "lec-2-4", title: "Commercial Debt Modeling Spreadsheet", duration: "15m", type: "document" },
          { id: "lec-2-5", title: "Sensitivity & Stress Analysis Quiz", duration: "20m", type: "quiz" }
        ]
      }
    ]
  },
  { 
    id: 3, 
    title: "High-Ticket Real Estate Negotiation", 
    instructor: "Sarah Jenkins", 
    price: 999, 
    duration: "6 Weeks", 
    students: 240, 
    completionRate: 92, 
    revenue: 239760, 
    status: "Published", 
    rating: 5.0,
    category: "Negotiation",
    tags: ["Negotiation", "Closing Deals", "Client Psych"],
    thumbnailPreset: "grad-rose",
    description: "Acquire the negotiation toolsets used by top 1% agents to close luxury real estate transactions without yielding commissions or leaving money on the table.",
    modules: [
      {
        id: "mod-3-1",
        title: "Module 1: Cognitive Frameworks of Negotiating",
        lectures: [
          { id: "lec-3-1", title: "Establishing the Anchor Price", duration: "22m", type: "video" },
          { id: "lec-3-2", title: "Mirroring & Labeling Techniques", duration: "18m", type: "video" }
        ]
      }
    ]
  },
  { 
    id: 4, 
    title: "Multifamily Deal Syndicate Sourcing", 
    instructor: "Alex Mercer", 
    price: 1850, 
    duration: "8 Weeks", 
    students: 0, 
    completionRate: 0, 
    revenue: 0, 
    status: "Draft", 
    rating: 0.0,
    category: "Syndication",
    tags: ["Multifamily", "Syndication", "Sourcing"],
    thumbnailPreset: "grad-gold",
    description: "A blueprint to locate, structure, and fund large apartment complexes by raising capital from passive investors under SEC Regulation D exemptions.",
    modules: [
      {
        id: "mod-4-1",
        title: "Module 1: Sourcing Off-Market Multifamily Deals",
        lectures: [
          { id: "lec-4-1", title: "Cold Sourcing & Broker Relationships", duration: "30m", type: "video" },
          { id: "lec-4-2", title: "Letter of Intent (LOI) Template Guide", duration: "12m", type: "document" }
        ]
      }
    ]
  },
  { 
    id: 5, 
    title: "Zoning Codes, Permits & Legal Structuring", 
    instructor: "Michael Chang", 
    price: 1200, 
    duration: "14 Weeks", 
    students: 110, 
    completionRate: 82, 
    revenue: 132000, 
    status: "Archived", 
    rating: 4.6,
    category: "Zoning",
    tags: ["Zoning", "Legal", "Due Diligence"],
    thumbnailPreset: "grad-dark",
    description: "Avoid catastrophic compliance failures. Discover how municipal zoning maps work, how to execute entitlement approvals, and how to structure legal partnerships.",
    modules: [
      {
        id: "mod-5-1",
        title: "Module 1: Analyzing Municipal Master Plans",
        lectures: [
          { id: "lec-5-1", title: "Reading Zoning Ordinances & Tables", duration: "28m", type: "video" },
          { id: "lec-5-2", title: "Determining FAR (Floor Area Ratio)", duration: "24m", type: "video" }
        ]
      }
    ]
  },
];

// Recharts Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800/80 backdrop-blur-md p-3 rounded-xl shadow-xl text-left border-l-4 border-l-premium-accent">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="mt-1 space-y-1">
          {payload.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color || p.fill }}></span>
              <span>{p.name}: <span className="font-extrabold text-slate-200">{typeof p.value === 'number' && p.name.includes('₹') ? `₹${p.value.toLocaleString()}` : p.value.toLocaleString()}</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdminCourses() {
  const { token, API_BASE_URL } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success' && data.data?.courses) {
        const mapped = data.data.courses.map(c => ({
          id: c.id,
          title: c.title,
          instructor: c.mentor_name || 'Robert Sterling',
          price: Number(c.price) || 0,
          duration: c.duration || '8 Weeks',
          students: Number(c.students_count) || 0,
          completionRate: 85,
          revenue: (Number(c.students_count) || 0) * (Number(c.price) || 0),
          status: c.status || 'Draft',
          rating: 4.8,
          category: c.category_name || 'Luxury Brokerage',
          tags: c.tags ? (typeof c.tags === 'string' ? JSON.parse(c.tags) : c.tags) : ['Underwriting'],
          thumbnailPreset: c.thumbnail || 'grad-blue',
          description: c.description || '',
          modules: c.modules || []
        }));
        setCourses(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateCategoryId = async (catName) => {
    if (!token) return 1;
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success') {
        const found = data.data.find(c => c.name.toLowerCase() === catName.toLowerCase());
        if (found) return found.id;
      }
      // Create new category
      const createResponse = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: catName, description: `Category for ${catName}`, status: 'Active' })
      });
      const createData = await createResponse.json();
      if (createData.status === 'success' || createResponse.status === 201) {
        return createData.data.id;
      }
    } catch (err) {
      console.error("Failed to find/create category:", err);
    }
    return 1;
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);
  const [viewMode, setViewMode] = useState('grid'); // grid | table
  const [showAnalytics, setShowAnalytics] = useState(true);
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('title'); // title | students | revenue | completion

  // Modals & Active Drawer states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalTab, setModalTab] = useState('details'); // details | curriculum
  const [previewCourse, setPreviewCourse] = useState(null);

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    instructor: 'Sarah Jenkins',
    price: '',
    duration: '',
    category: 'Luxury Brokerage',
    tags: '',
    thumbnailPreset: 'grad-blue',
    modules: []
  });

  // Preview Mode Interaction State
  const [previewActiveLecture, setPreviewActiveLecture] = useState(null);
  const [previewReviews, setPreviewReviews] = useState([
    { name: "John Davis", rating: 5, date: "2 days ago", text: "Incredible depth. The underwriting model spreadsheets saved me dozens of hours." },
    { name: "Linda K.", rating: 4, date: "1 week ago", text: "Excellent strategies for negotiating with seller clients. Highly recommended!" }
  ]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Calculations for stats
  const totalRevenue = courses.reduce((acc, c) => acc + c.revenue, 0);
  const totalStudents = courses.reduce((acc, c) => acc + c.students, 0);
  const publishedCourses = courses.filter(c => c.status === "Published").length;
  const avgCompletion = Math.round(courses.filter(c => c.students > 0).reduce((acc, c) => acc + c.completionRate, 0) / (courses.filter(c => c.students > 0).length || 1));

  // Analytics Chart Data
  const revenueChartData = courses.map(c => ({ name: c.title, Revenue: c.revenue, Students: c.students }));
  const completionChartData = courses.filter(c => c.students > 0).map(c => ({ name: c.title, Completion: c.completionRate }));

  // Dropdown list categories
  const categories = ['All', ...new Set(courses.map(c => c.category))];

  // Filtering & Sorting Logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || course.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'students') return b.students - a.students;
    if (sortBy === 'revenue') return b.revenue - a.revenue;
    if (sortBy === 'completion') return b.completionRate - a.completionRate;
    return 0;
  });

  // Modal Open Handlers
  const openCreateModal = () => {
    setSelectedCourse(null);
    setFormState({
      title: '',
      description: '',
      instructor: 'Sarah Jenkins',
      price: '',
      duration: '',
      category: 'Luxury Brokerage',
      tags: '',
      thumbnailPreset: 'grad-blue',
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: "Module 1: General Introduction",
          lectures: [
            { id: `lec-${Date.now()}-1`, title: "Welcome & Overview", duration: "10m", type: "video" }
          ]
        }
      ]
    });
    setModalTab('details');
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormState({
      title: course.title || '',
      description: course.description || '',
      instructor: course.instructor || 'Sarah Jenkins',
      price: course.price !== undefined && course.price !== null ? course.price : '',
      duration: course.duration || '',
      category: course.category || 'Luxury Brokerage',
      tags: Array.isArray(course.tags) ? course.tags.join(', ') : '',
      thumbnailPreset: course.thumbnailPreset || 'grad-blue',
      modules: Array.isArray(course.modules) ? JSON.parse(JSON.stringify(course.modules)) : []
    });
    setModalTab('details');
    setModalOpen(true);
  };

  // Status controls
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Published" ? "Draft" : "Published";
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    try {
      await fetch(`${API_BASE_URL}/api/courses/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: nextStatus })
      });
      fetchCourses();
    } catch (err) {
      console.error("Failed to toggle course status:", err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (confirm("Are you absolutely sure you want to delete this course from the inventory? This cannot be undone.")) {
      setCourses(prev => prev.filter(c => c.id !== id));
      try {
        await fetch(`${API_BASE_URL}/api/courses/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchCourses();
      } catch (err) {
        console.error("Failed to delete course:", err);
      }
    }
  };

  // Form Submissions
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!formState.title || !formState.duration || !formState.price) {
      alert("Please fill in all required fields.");
      return;
    }

    const tagsArray = formState.tags 
      ? formState.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const categoryId = await getOrCreateCategoryId(formState.category);

    const payload = {
      category_id: categoryId,
      title: formState.title,
      description: formState.description,
      thumbnail: formState.thumbnailPreset,
      mentor_name: formState.instructor,
      duration: formState.duration,
      price: Number(formState.price),
      status: selectedCourse ? selectedCourse.status : "Draft",
      modules: formState.modules.map((m, mIdx) => ({
        title: m.title,
        description: m.description || '',
        sort_order: mIdx + 1,
        lectures: (m.lectures || []).map((l, lIdx) => ({
          title: l.title,
          description: l.description || '',
          video_url: l.video_url || '',
          duration: l.duration || '15m',
          sort_order: lIdx + 1,
          is_preview: l.is_preview ? 1 : 0,
          video_type: l.video_type || 'html5',
          video_id: l.video_id || ''
        }))
      }))
    };

    if (selectedCourse) {
      // Edit
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses/${selectedCourse.id}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
          fetchCourses();
        }
      } catch (err) {
        console.error("Failed to update course:", err);
      }
    } else {
      // Create
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success' || res.status === 201) {
          fetchCourses();
        }
      } catch (err) {
        console.error("Failed to create course:", err);
      }
    }
    setModalOpen(false);
  };

  // Curriculum State Modifiers
  const handleAddModule = () => {
    const newModule = {
      id: `mod-${Date.now()}`,
      title: `Module ${formState.modules.length + 1}: New Module Section`,
      lectures: []
    };
    setFormState(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const handleRemoveModule = (moduleId) => {
    setFormState(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId)
    }));
  };

  const handleUpdateModuleTitle = (moduleId, newTitle) => {
    setFormState(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m)
    }));
  };

  const handleAddLecture = (moduleId, lectureData) => {
    if (!lectureData || !lectureData.title) return;
    const newLec = {
      id: `lec-${Date.now()}`,
      title: lectureData.title,
      duration: lectureData.duration || "15m",
      type: lectureData.type || "video",
      video_url: lectureData.video_url || '',
      video_type: lectureData.video_type || 'html5',
      video_id: lectureData.video_id || '',
      is_preview: lectureData.is_preview || false
    };

    setFormState(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lectures: [...m.lectures, newLec] };
        }
        return m;
      })
    }));
  };

  const handleRemoveLecture = (moduleId, lectureId) => {
    setFormState(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lectures: m.lectures.filter(l => l.id !== lectureId) };
        }
        return m;
      })
    }));
  };

  const handleReorderLectures = (moduleId, reorderedLectures) => {
    setFormState(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lectures: reorderedLectures };
        }
        return m;
      })
    }));
  };

  // Student Preview actions
  const openPreview = (course) => {
    setPreviewCourse(course);
    if (course.modules && course.modules.length > 0 && course.modules[0].lectures.length > 0) {
      setPreviewActiveLecture(course.modules[0].lectures[0]);
    } else {
      setPreviewActiveLecture(null);
    }
    // Set some mock initial reviews
    setPreviewReviews([
      { name: "Marcus Brody", rating: 5, date: "Yesterday", text: `I closed a 12-unit syndicate deal utilizing techniques outlined in ${course.title}!` },
      { name: "Elena Rostova", rating: 4, date: "3 days ago", text: `Outstanding layout, clear materials. Recommend checking the downloads.` }
    ]);
  };

  const submitPreviewReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const reviewObj = {
      name: "Anonymous Admin (Mock Student)",
      rating: newReviewRating,
      date: "Just now",
      text: newReviewText
    };
    setPreviewReviews(prev => [reviewObj, ...prev]);
    setNewReviewText("");
  };

  // Preset renderer helper
  const getThumbnailClass = (presetId) => {
    const p = THUMBNAIL_PRESETS.find(p => p.id === presetId);
    return p ? p.classes : 'bg-gradient-to-br from-slate-700 to-slate-900 text-white';
  };

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e22] border-[#1a1a1c] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-premium-violet animate-pulse"></span>
            <span className="text-[10px] font-black text-premium-violet uppercase tracking-widest">Masterclass Catalog</span>
          </div>
          <h1 className="text-2xl font-black text-white text-white tracking-tight uppercase mt-1">LMS Course Management</h1>
          <p className="text-xs font-semibold text-slate-400 text-slate-500 mt-0.5">Author curriculums, organize modules, configure dynamic pricing tags, and toggle live availability doors.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-premium-accent" />
            <span>{showAnalytics ? "Hide Charts" : "Show Analytics"}</span>
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Masterclass
          </Button>
        </div>
      </div>

      {/* Analytics Banner Section */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-6"
          >
            {/* Core Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AdminStatCard 
                title="Active Catalog" 
                value={`${courses.length} courses`} 
                change={`+${courses.filter(c => c.status === "Published").length} Published`} 
                isPositive={true} 
                icon={BookOpen}
                gradient="from-violet-500/10 to-indigo-500/10"
                timeframe="current live catalog"
              />
              <AdminStatCard 
                title="Total Registrations" 
                value={totalStudents.toLocaleString()} 
                change="+14.2%" 
                isPositive={true} 
                icon={Users}
                gradient="from-blue-500/10 to-cyan-500/10"
                timeframe="vs last month"
              />
              <AdminStatCard 
                title="Syllabus Avg Completion" 
                value={`${avgCompletion}%`} 
                change="+2.4%" 
                isPositive={true} 
                icon={CheckCircle}
                gradient="from-emerald-500/10 to-teal-500/10"
                timeframe="student progress efficiency"
              />
              <AdminStatCard 
                title="Catalog Gross Revenue" 
                value={`₹${totalRevenue.toLocaleString()}`} 
                change="+18.9%" 
                isPositive={true} 
                icon={DollarSign}
                gradient="from-amber-500/10 to-orange-500/10"
                timeframe="vs last month"
              />
            </div>

            {/* Recharts Analytics Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card">
                <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-widest block mb-4">Masterclass Financial Revenue Contribution</span>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="stroke-[#1a1a1c]" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickFormatter={(t) => t.length > 15 ? `${t.slice(0, 15)}...` : t} />
                      <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar name="Total Revenue (₹)" dataKey="Revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-6 shadow-dark-card flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-400 text-slate-500 uppercase tracking-widest block mb-4">Syllabus Completion Efficiency</span>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={completionChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <defs>
                          <linearGradient id="compGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="stroke-[#1a1a1c]" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickFormatter={(t) => t.slice(0, 8)} />
                        <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area name="Avg Completion Rate (%)" type="monotone" dataKey="Completion" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#compGlow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1a1a1c] dark:border-slate-850 flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Student Target completion: 75%</span>
                  <span className="text-emerald-500 font-black">Optimal Status</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtering Toolbar */}
      <div className="rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d]/70 bg-[#0b0b0d]/70 backdrop-blur-md p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Filters */}
        <div className="flex items-center gap-3 flex-wrap flex-1">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag, mentor..."
              className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 transition-all"
            />
          </div>

          {/* Category Select */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 transition-all cursor-pointer"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-2.5 pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Status Select */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 transition-all cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
            <div className="absolute right-3.5 top-2.5 pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 transition-all cursor-pointer"
            >
              <option value="title">Sort: Title</option>
              <option value="students">Sort: Students</option>
              <option value="revenue">Sort: Revenue</option>
              <option value="completion">Sort: Completion Rate</option>
            </select>
            <div className="absolute right-3.5 top-2.5 pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Right Toggle */}
        <div className="flex items-center gap-1.5 bg-[#111114] bg-[#111114] p-1 rounded-xl border border-[#1e1e22]/50 dark:border-slate-750 self-end md:self-auto shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#0b0b0d] dark:bg-slate-700 text-premium-accent shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:text-white'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[#0b0b0d] dark:bg-slate-700 text-premium-accent shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:text-white'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Catalog View rendering */}
      {filteredCourses.length > 0 ? (
        viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <motion.div
                key={course.id}
                layout
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="group relative overflow-hidden rounded-2xl border border-[#1a1a1c] border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] shadow-[0_6px_20px_rgba(0,0,0,0.01)] flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className={`h-40 w-full flex flex-col justify-between p-4 relative ${getThumbnailClass(course.thumbnailPreset)}`}>
                  {/* Glass Top Badges */}
                  <div className="flex justify-between items-start z-10 w-full">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#0b0b0d]/20 backdrop-blur-md border border-white/10 text-white">
                      {course.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md ${
                      course.status === 'Published' 
                        ? 'bg-emerald-500/100/20 text-emerald-100 border-emerald-500/30' 
                        : course.status === 'Draft' 
                          ? 'bg-amber-500/100/20 text-amber-100 border-amber-500/30' 
                          : 'bg-[#0f0f12]0/20 text-slate-200 border-slate-500/30'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  
                  {/* Decorative Logo / Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <BookOpenCheck className="w-24 h-24" />
                  </div>

                  {/* Pricing Tag */}
                  <div className="self-end z-10">
                    <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#0b0b0d]/10 bg-[#0b0b0d]/40 backdrop-blur-md border border-white/20 text-white shadow-sm">
                      ₹{course.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Course Metadata Content */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-white text-white leading-tight line-clamp-1 group-hover:text-premium-accent transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 text-slate-500 font-semibold flex items-center gap-1.5">
                      <span className="h-6 w-6 rounded-full bg-[#111114] bg-[#111114] flex items-center justify-center text-[10px] font-bold text-premium-violet border border-[#1e1e22] border-[#1e1e22]">
                        {course.instructor.split(' ').map(n=>n[0]).join('')}
                      </span>
                      <span>Mentor: {course.instructor}</span>
                    </p>
                    <p className="text-xs text-slate-500 text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Core Metrics grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 my-3 border-y border-[#1a1a1c] dark:border-slate-850 text-[11px] font-bold text-slate-500 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.students} Enrolled</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.completionRate}% Completion</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-white text-white font-black">₹{course.revenue.toLocaleString()} Rev</span>
                    </div>
                  </div>

                  {/* Tags list */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    {course.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#0f0f12] bg-[#0f0f12] border border-[#1e1e22]/50 border-[#1a1a1c] rounded text-[9px] font-black uppercase text-slate-400 text-slate-500 tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bars */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black uppercase bg-[#0f0f12] bg-[#0f0f12] hover:bg-[#111114] hover:bg-[#111114] border border-[#1a1a1c] border-[#1a1a1c] text-slate-600 dark:text-slate-350 transition-all cursor-pointer active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Configure</span>
                    </button>
                    
                    <button
                      onClick={() => openPreview(course)}
                      className="p-2 rounded-xl bg-[#0f0f12] bg-[#0f0f12] hover:bg-premium-accent/10 hover:text-premium-accent border border-[#1a1a1c] border-[#1a1a1c] text-slate-400 transition-all cursor-pointer active:scale-95"
                      title="Preview Course Curriculum"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(course.id, course.status)}
                      className={`px-3 py-2 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer active:scale-95 ${
                        course.status === 'Published'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-100'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-100'
                      }`}
                      title={course.status === 'Published' ? "Unpublish Course" : "Publish Course"}
                    >
                      {course.status === 'Published' ? "Live" : "Draft"}
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-100 border border-red-500/20/60 text-red-500 transition-all cursor-pointer active:scale-95"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="rounded-2xl border border-[#1a1a1c] bg-[#0b0b0d] shadow-dark-card bg-[#0b0b0d] border-[#1a1a1c] overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f0f12] bg-[#0b0b0d]/60 border-b border-[#1a1a1c] border-[#1a1a1c]">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Course</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Lead Mentor</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Tuition Price</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Duration</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Enrolled</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Completion</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Gross Rev</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-premium-border/40 dark:divide-slate-800">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-[#0f0f12]/50 hover:bg-[#111114]/20 transition-colors">
                      {/* Name + thumbnail preset */}
                      <td className="px-6 py-4 font-bold text-white text-white max-w-[240px]">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-12 rounded-lg ${getThumbnailClass(course.thumbnailPreset)} shrink-0 flex items-center justify-center text-[10px] font-black`}>
                            LMS
                          </div>
                          <div className="truncate">
                            <p className="truncate text-xs font-black">{course.title}</p>
                            <span className="text-[9px] text-slate-400 font-semibold uppercase">{course.tags.slice(0, 1).join('')}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 text-slate-400">
                        <span className="px-2 py-0.5 bg-[#0f0f12] bg-[#0f0f12] rounded-full border border-[#1e1e22]/50 border-[#1a1a1c]">
                          {course.category}
                        </span>
                      </td>

                      {/* Mentor */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-650 dark:text-slate-350">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-[#111114] bg-[#111114] flex items-center justify-center text-[8px] font-black text-premium-accent border border-[#1e1e22] border-[#1e1e22]">
                            {course.instructor.split(' ').map(n=>n[0]).join('')}
                          </span>
                          <span>{course.instructor}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-xs font-black text-white text-white">
                        ₹{course.price.toLocaleString()}
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 text-slate-400">
                        {course.duration}
                      </td>

                      {/* Enrolled */}
                      <td className="px-6 py-4 text-xs font-black text-slate-600 text-slate-300">
                        {course.students}
                      </td>

                      {/* Completion */}
                      <td className="px-6 py-4 text-xs font-extrabold">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-[#111114] bg-[#111114] rounded-full overflow-hidden shrink-0">
                            <div className="h-full bg-emerald-500/100" style={{ width: `${course.completionRate}%` }}></div>
                          </div>
                          <span className="text-slate-600 text-slate-400 text-[10px]">{course.completionRate}%</span>
                        </div>
                      </td>

                      {/* Gross revenue */}
                      <td className="px-6 py-4 text-xs font-black text-white text-white">
                        ₹{course.revenue.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-xs font-black">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          course.status === 'Published' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' 
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900'
                        }`}>
                          {course.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(course)}
                            className="p-1.5 rounded-lg bg-[#0f0f12] bg-[#0f0f12] hover:bg-[#111114] hover:bg-[#111114] border border-[#1a1a1c] border-[#1a1a1c] text-slate-500 hover:text-white hover:text-white transition-all cursor-pointer"
                            title="Edit Course"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openPreview(course)}
                            className="p-1.5 rounded-lg bg-[#0f0f12] bg-[#0f0f12] hover:bg-premium-accent/10 hover:text-premium-accent border border-[#1a1a1c] border-[#1a1a1c] text-slate-500 transition-all cursor-pointer"
                            title="Preview Student Experience"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(course.id, course.status)}
                            className="px-2 py-1 rounded-lg text-[9px] font-black uppercase border bg-[#0f0f12] bg-[#0f0f12] border-[#1a1a1c] border-[#1a1a1c] hover:border-premium-accent/30 text-slate-500 hover:text-premium-accent transition-all cursor-pointer"
                          >
                            {course.status === 'Published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-100 border border-red-500/20/60 text-red-500 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-[#1a1a1c] bg-[#0b0b0d] bg-[#0b0b0d] p-12 text-center text-slate-400">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#111114] bg-[#0f0f12] flex items-center justify-center text-slate-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="font-black text-sm text-white text-white">No courses match your filter settings</p>
            <p className="text-xs text-slate-400 max-w-sm mt-0.5">Try clearing search inputs or adjusting the categories select boxes.</p>
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); }} className="mt-2">
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 1. CREATE / EDIT MASTERCLASS MODAL                 */}
      {/* ================================================== */}
      <AnimatePresence>
        {modalOpen && (
          <Portal>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0b0b0d] bg-[#0b0b0d] rounded-2xl border border-premium-border border-[#1a1a1c] shadow-2xl overflow-hidden flex flex-col text-left z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#1a1a1c] border-[#1a1a1c] flex items-center justify-between bg-[#0f0f12]/50 bg-[#0b0b0d]/60">
                <div>
                  <h3 className="text-base font-black text-white text-white tracking-tight uppercase">
                    {selectedCourse ? "Modify Masterclass Configuration" : "Author New Masterclass Portal"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    {selectedCourse ? `ID: CL-${selectedCourse.id} • STATUS: ${selectedCourse.status}` : "Status: Draft blueprint development"}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#111114] bg-[#111114] hover:bg-[#16161a] dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-[#1a1a1c] border-[#1a1a1c] bg-[#0f0f12]/20">
                <button
                  onClick={() => setModalTab('details')}
                  className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    modalTab === 'details'
                      ? 'border-premium-accent text-premium-accent bg-[#0b0b0d] bg-[#0b0b0d]'
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:text-white'
                  }`}
                >
                  1. General Details
                </button>
                <button
                  onClick={() => setModalTab('curriculum')}
                  className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    modalTab === 'curriculum'
                      ? 'border-premium-accent text-premium-accent bg-[#0b0b0d] bg-[#0b0b0d]'
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:text-white'
                  }`}
                >
                  2. Syllabus & Curriculum Builder ({formState.modules.reduce((sum,m)=>sum + m.lectures.length, 0)} Lectures)
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-6">
                
                {modalTab === 'details' ? (
                  /* TAB 1: GENERAL DETAILS */
                  <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Form Fields */}
                    <div className="md:col-span-2 space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Course Title *</label>
                        <input
                          type="text"
                          required
                          value={formState.title}
                          onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                          placeholder="e.g. Commercial Syndication Secrets"
                          className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                        <textarea
                          rows="4"
                          value={formState.description}
                          onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                          placeholder="Provide a comprehensive marketing overview of the course goals and student target skills..."
                          className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lead Mentor / Instructor</label>
                          <select
                            value={formState.instructor}
                            onChange={(e) => setFormState({ ...formState, instructor: e.target.value })}
                            className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                          >
                            {MOCK_MENTORS.map((m, idx) => (
                              <option key={idx} value={m.name}>{m.name} ({m.role})</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category</label>
                          <select
                            value={formState.category}
                            onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                            className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                          >
                            <option value="Luxury Brokerage">Luxury Brokerage</option>
                            <option value="Underwriting">Underwriting</option>
                            <option value="Negotiation">Negotiation</option>
                            <option value="Syndication">Syndication</option>
                            <option value="Zoning">Zoning & Permitting</option>
                            <option value="BRRRR Strategy">BRRRR Strategy</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Duration Schedule *</label>
                          <input
                            type="text"
                            required
                            value={formState.duration}
                            onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                            placeholder="e.g. 10 Weeks"
                            className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tuition Fees (₹ INR) *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={formState.price}
                            onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                            placeholder="1499"
                            className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Metadata Tags (Comma Separated)</label>
                        <input
                          type="text"
                          value={formState.tags}
                          onChange={(e) => setFormState({ ...formState, tags: e.target.value })}
                          placeholder="e.g. High Ticket, Excel Modeling, Multifamily"
                          className="w-full bg-[#0f0f12] bg-[#111114] border border-premium-border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                        />
                      </div>
                    </div>

                    {/* Right Column: Thumbnail Selector */}
                    <div className="md:col-span-1 space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Course Portal Cover</label>
                        {/* Interactive Preview Cover */}
                        <div className={`h-40 rounded-2xl flex flex-col justify-between p-4 ${getThumbnailClass(formState.thumbnailPreset)} shadow-md border border-premium-border/10`}>
                          <span className="px-2 py-0.5 rounded bg-[#0b0b0d]/20 text-[9px] font-black uppercase tracking-wider self-start border border-white/10">
                            {formState.category || 'Category'}
                          </span>
                          <BookOpenCheck className="w-12 h-12 self-center opacity-30 animate-pulse-slow" />
                          <div className="text-[10px] font-black text-white/90 truncate">
                            {formState.title || 'Untitled Masterclass'}
                          </div>
                        </div>
                      </div>

                      {/* Gradient Selector Presets */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Preset Cover Gradients</label>
                        <div className="grid grid-cols-2 gap-2">
                          {THUMBNAIL_PRESETS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setFormState({ ...formState, thumbnailPreset: p.id })}
                              className={`p-2.5 rounded-xl border text-[10px] font-bold text-left transition-all relative ${
                                formState.thumbnailPreset === p.id 
                                  ? 'border-premium-accent ring-2 ring-premium-accent/20 text-premium-accent' 
                                  : 'border-premium-border border-[#1a1a1c] hover:border-slate-400 dark:hover:border-slate-750'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className={`h-3 w-3 rounded-full shrink-0 ${p.classes}`}></span>
                                <span className="truncate text-[9px]">{p.name}</span>
                              </div>
                              {formState.thumbnailPreset === p.id && (
                                <span className="absolute right-2 top-2 h-2.5 w-2.5 bg-premium-accent rounded-full flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mock File Upload UI */}
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Alternative Media Attachment</label>
                        <div className="border border-dashed border-premium-border border-[#1a1a1c] rounded-xl p-4 text-center hover:border-premium-accent/40 hover:bg-[#0f0f12]/50 dark:hover:bg-slate-850/50 transition-all cursor-pointer">
                          <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <span className="text-[10px] font-extrabold text-slate-600 text-slate-300 block">Select Custom Blueprint JPG</span>
                          <span className="text-[8px] text-slate-400 mt-0.5 block">Mocked workflow. Maximum size: 5MB</span>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* TAB 2: CURRICULUM & SYLLABUS BUILDER */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">Curriculum Outline</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Author sections, add lessons, and reorder elements within modules.</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleAddModule} className="h-9 px-3 text-[10px] font-black uppercase">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Module Section
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formState.modules.map((module, mIdx) => (
                        <div 
                          key={module.id} 
                          className="border border-[#1a1a1c] border-[#1a1a1c] rounded-2xl bg-[#0f0f12]/50 bg-[#0b0b0d]/60 p-5 space-y-4 text-left"
                        >
                          {/* Module Header Details */}
                          <div className="flex items-center justify-between gap-4 border-b border-[#1e1e22]/50 border-[#1a1a1c]/80 pb-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="h-6 w-6 rounded-lg bg-premium-violet/10 text-premium-violet flex items-center justify-center text-[10px] font-black shrink-0">
                                M{mIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={module.title}
                                onChange={(e) => handleUpdateModuleTitle(module.id, e.target.value)}
                                placeholder="Module Title Section"
                                className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-premium-accent focus:outline-none text-xs font-black text-white text-white px-1.5 py-0.5 flex-1"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveModule(module.id)}
                              className="p-1 rounded bg-red-500/10 hover:bg-red-100 text-red-500 border border-red-500/20/60 transition-all cursor-pointer"
                              title="Delete Module"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Lectures List with Drag Handle */}
                          <div className="space-y-2">
                            {module.lectures.length > 0 ? (
                              <Reorder.Group 
                                axis="y" 
                                values={module.lectures} 
                                onReorder={(newOrder) => handleReorderLectures(module.id, newOrder)}
                                className="space-y-2"
                              >
                                {module.lectures.map((lecture) => (
                                  <Reorder.Item 
                                    key={lecture.id} 
                                    value={lecture}
                                    className="p-3 bg-[#0b0b0d] dark:bg-slate-950 border border-premium-border border-[#1a1a1c] rounded-xl flex items-center justify-between gap-4 shadow-sm"
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      {/* Drag Handle */}
                                      <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 hover:text-white p-1 select-none">
                                        <GripVertical className="w-4 h-4" />
                                      </div>
                                      
                                      {/* Icon representation */}
                                      <span className={`p-1.5 rounded-lg shrink-0 ${
                                        lecture.type === 'video' 
                                          ? 'bg-[#0A66C2]/10 text-blue-500 dark:bg-blue-950/20' 
                                          : lecture.type === 'document'
                                            ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-950/20'
                                            : 'bg-amber-500/10 text-amber-500 dark:bg-amber-950/20'
                                      }`}>
                                        {lecture.type === 'video' ? <Play className="w-3.5 h-3.5" /> : lecture.type === 'document' ? <FileText className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                                      </span>

                                      <div className="truncate">
                                        <p className="text-xs font-bold text-white text-white truncate">{lecture.title}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{lecture.duration} • {lecture.type}</span>
                                          {lecture.video_type && lecture.video_type !== 'html5' && (
                                            <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                              lecture.video_type === 'youtube' 
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                              {lecture.video_type === 'youtube' ? 'YT' : 'Vimeo'}
                                            </span>
                                          )}
                                          {lecture.is_preview && (
                                            <span className="text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                              Preview
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action button */}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveLecture(module.id, lecture.id)}
                                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-[#0f0f12] hover:bg-[#0f0f12] rounded transition-all"
                                      title="Delete Lecture"
                                    >
                                      <Trash className="w-3.5 h-3.5" />
                                    </button>
                                  </Reorder.Item>
                                ))}
                              </Reorder.Group>
                            ) : (
                              <p className="text-[10px] text-slate-400 font-bold text-center py-4 bg-[#111114]/40 bg-[#0b0b0d]/20 border border-dashed border-[#1a1a1c] border-[#1a1a1c] rounded-xl">
                                Syllabus empty. Add lessons utilizing the form below.
                              </p>
                            )}
                          </div>

                          {/* Quick Lecture Add Form */}
                          <LectureAddForm 
                            onAdd={(lectureData) => handleAddLecture(module.id, lectureData)} 
                          />
                        </div>
                      ))}
                    </div>

                    {formState.modules.length === 0 && (
                      <div className="border border-dashed border-premium-border border-[#1a1a1c] rounded-2xl p-10 text-center text-slate-400">
                        <FolderOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                        <span className="text-xs font-black text-white text-white block">No syllabus outlines defined</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Click "Add Module Section" above to define folders.</span>
                        <Button variant="outline" size="sm" onClick={handleAddModule} className="mt-3">
                          Add First Module
                        </Button>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[#1a1a1c] border-[#1a1a1c] flex items-center justify-between bg-[#0f0f12]/50 bg-[#0b0b0d]/60 shrink-0">
                <div className="flex items-center gap-2">
                  {modalTab === 'curriculum' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button" 
                      onClick={() => setModalTab('details')}
                      className="text-xs h-9 px-3"
                    >
                      Back to General Info
                    </Button>
                  )}
                  {modalTab === 'details' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button" 
                      onClick={() => setModalTab('curriculum')}
                      className="text-xs h-9 px-3 text-premium-violet hover:border-premium-violet/30"
                    >
                      Next: Build Curriculum
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)} className="h-9 px-4 text-xs font-bold">
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="button" onClick={handleSaveCourse} className="h-9 px-4 text-xs font-bold">
                    {selectedCourse ? "Update Catalog Masterclass" : "Create Masterclass"}
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>

      {/* ================================================== */}
      {/* 2. STUDENT COURSE PREVIEW INTERACTIVE PORTAL      */}
      {/* ================================================== */}
      <AnimatePresence>
        {previewCourse && (
          <Portal>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 overflow-y-auto bg-slate-950/75 backdrop-blur-md">
            {/* Immersive Window container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              className="relative w-full h-full bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-100 text-left z-10"
            >
              {/* Preview Header */}
              <div className="px-6 py-4.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setPreviewCourse(null)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer active:scale-95 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-500/100/20 text-emerald-400 border border-emerald-500/30">
                        {previewCourse.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Portal Preview Mode</span>
                    </div>
                    <h3 className="text-sm font-black text-white truncate max-w-md mt-0.5">{previewCourse.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-bold hidden sm:inline">Tuition Gate: <span className="text-emerald-400 font-extrabold">₹{previewCourse.price}</span></span>
                  <button 
                    onClick={() => setPreviewCourse(null)}
                    className="h-8 px-3 rounded-lg bg-red-500/100/10 text-red-400 hover:bg-red-500/100/100 hover:text-white transition-all text-xs font-black uppercase cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>

              {/* Preview Workspace split */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Sidebar: Interactive Syllabus Outline */}
                <div className="w-full lg:w-80 border-r border-slate-800 bg-slate-950 overflow-y-auto flex flex-col shrink-0">
                  <div className="p-4 border-b border-slate-900">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syllabus Index</span>
                  </div>

                  <div className="p-3 space-y-3">
                    {previewCourse.modules && previewCourse.modules.map((mod, mIdx) => (
                      <div key={mod.id} className="space-y-1">
                        <div className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-between text-left">
                          <span className="text-[10px] font-black text-slate-300 line-clamp-1">M{mIdx+1}: {mod.title.replace(/^Module \d+:\s*/, '')}</span>
                          <span className="text-[8px] font-black text-slate-500 uppercase shrink-0 ml-1">{mod.lectures.length} lessons</span>
                        </div>

                        <div className="space-y-1 pl-1">
                          {mod.lectures.map((lec) => (
                            <button
                              key={lec.id}
                              onClick={() => setPreviewActiveLecture(lec)}
                              className={`w-full text-left p-2 rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                previewActiveLecture?.id === lec.id 
                                  ? 'bg-premium-accent text-white shadow-sm' 
                                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`p-1 rounded ${previewActiveLecture?.id === lec.id ? 'bg-[#0b0b0d]/20' : 'bg-slate-900'}`}>
                                  {lec.type === 'video' ? <Play className="w-3 h-3 text-slate-300" /> : <FileText className="w-3 h-3 text-slate-300" />}
                                </span>
                                <span className="text-[11px] font-bold truncate">{lec.title}</span>
                              </div>
                              <span className="text-[9px] font-semibold text-slate-500 shrink-0">{lec.duration}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Area: Interactive Viewer Panel */}
                <div className="flex-1 overflow-y-auto bg-slate-900 p-6 scrollbar-thin flex flex-col space-y-6">
                  
                  {previewActiveLecture ? (
                    /* ACTIVE LECTURE SELECTED VIEW */
                    <div className="space-y-6">
                      {/* Video Player Mock */}
                      <div className="w-full aspect-video rounded-2xl bg-black border border-slate-800 relative overflow-hidden group shadow-lg">
                        {/* Play placeholder cover */}
                        <div className={`absolute inset-0 flex flex-col justify-between p-6 opacity-80 ${getThumbnailClass(previewCourse.thumbnailPreset)}`}>
                          <span className="px-3 py-1 rounded bg-black/40 text-[10px] font-black uppercase text-white/95 self-start tracking-wider">
                            Real Estate LMS Video Node
                          </span>
                          <BookOpenCheck className="w-20 h-20 self-center opacity-20" />
                          <div className="text-white text-left">
                            <span className="text-xs text-white/70 block uppercase tracking-wider">Active: {previewActiveLecture.type}</span>
                            <span className="text-base font-black truncate block mt-0.5">{previewActiveLecture.title}</span>
                          </div>
                        </div>

                        {/* Interactive Play Overlay Button */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-950/20 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all cursor-pointer">
                          <div className="h-16 w-16 rounded-full bg-premium-accent text-white flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition-all">
                            <Play className="w-6 h-6 fill-white ml-1" />
                          </div>
                        </div>

                        {/* Control Bar Overlay */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 fill-white" /> 00:00 / {previewActiveLecture.duration}</span>
                          <div className="w-1/2 h-1 bg-slate-700 rounded-full overflow-hidden relative">
                            <div className="h-full bg-premium-accent w-1/12"></div>
                          </div>
                          <span>1080p HD</span>
                        </div>
                      </div>

                      {/* Video description metadata */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Active Curriculum Node</span>
                            <h4 className="text-base font-black text-white mt-0.5">{previewActiveLecture.title}</h4>
                            <span className="text-[10px] text-slate-400 font-bold block mt-1">Mentor: {previewCourse.instructor} • Run time: {previewActiveLecture.duration}</span>
                          </div>
                          
                          {previewActiveLecture.type === 'document' && (
                            <button
                              onClick={() => alert(`[Mock Sandbox]: Initiating download of "${previewActiveLecture.title} Blueprint Template.pdf"`)}
                              className="px-4 py-2 bg-emerald-500/100 text-white rounded-xl text-xs font-black uppercase hover:shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Download PDF Blueprint</span>
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                          This is a live interactive mock view of the real-estate student platform. In production, this video player syncs progress metrics back to the Admin database panel to track student performance and completion metrics dynamically.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* COURSE OVERVIEW BANNER - DEFAULT IF NO LECTURES */
                    <div className={`p-8 rounded-2xl ${getThumbnailClass(previewCourse.thumbnailPreset)} flex flex-col justify-between h-56 shadow-lg relative`}>
                      <span className="px-3 py-1 bg-black/30 rounded text-xs font-black uppercase text-white/90 self-start tracking-wider">
                        {previewCourse.category}
                      </span>
                      <div className="text-left space-y-2 z-10">
                        <h2 className="text-2xl font-black text-white tracking-tight">{previewCourse.title}</h2>
                        <p className="text-sm text-white/80 max-w-xl font-medium leading-relaxed">{previewCourse.description}</p>
                      </div>
                      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                    </div>
                  )}

                  {/* Split column details: Left is Mentor details, Right is student feedback reviews */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mentor Information */}
                    <div className="md:col-span-1 bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-3.5">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2">Your Lead Mentor</h4>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800 text-premium-accent flex items-center justify-center font-black text-xs border border-slate-700">
                          {previewCourse.instructor.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">{previewCourse.instructor}</p>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                            {MOCK_MENTORS.find(m => m.name === previewCourse.instructor)?.role || 'Mentor Expert'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed italic">
                        "{MOCK_MENTORS.find(m => m.name === previewCourse.instructor)?.bio || 'Expert instructor onboarding complete.'}"
                      </p>
                    </div>

                    {/* Student Reviews & Mock Ratings Sandbox */}
                    <div className="md:col-span-2 bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Student Reviews (Sandbox)</h4>
                        <div className="flex items-center gap-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="font-extrabold">{previewCourse.rating || 5.0} Rating</span>
                        </div>
                      </div>

                      {/* Add new mock review form */}
                      <form onSubmit={submitPreviewReview} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          placeholder="Type a mock student feedback review..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-premium-accent"
                        />
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-black text-amber-500 focus:outline-none"
                        >
                          <option value="5">5 ★</option>
                          <option value="4">4 ★</option>
                          <option value="3">3 ★</option>
                        </select>
                        <button
                          type="submit"
                          className="px-3 py-2 bg-premium-accent text-white text-xs font-black uppercase rounded-xl hover:bg-blue-600 transition-all cursor-pointer"
                        >
                          Post
                        </button>
                      </form>

                      {/* Review Items */}
                      <div className="space-y-3.5 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                        {previewReviews.map((rev, idx) => (
                          <div key={idx} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-slate-300">{rev.name}</span>
                              <span className="text-slate-500">{rev.date}</span>
                            </div>
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500' : 'text-slate-700'}`} />
                              ))}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{rev.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>

    </div>
  );
}

// Inner helper component for adding lessons inside modules cleanly
function LectureAddForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('15m');
  const [type, setType] = useState('video');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('html5');
  const [videoId, setVideoId] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, duration, type, video_url: videoUrl, video_type: videoType, video_id: videoId, is_preview: isPreview });
    setTitle('');
    setDuration('15m');
    setType('video');
    setVideoUrl('');
    setVideoType('html5');
    setVideoId('');
    setIsPreview(false);
    setIsFormOpen(false);
  };

  return (
    <div className="pt-2 border-t border-[#1e1e22]/40 border-[#1a1a1c]/60">
      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="p-3 bg-[#0b0b0d] dark:bg-slate-950 border border-premium-border border-[#1a1a1c] rounded-xl space-y-3 text-left">
          {/* Row 1: Title, Duration, Lesson Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1 space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Lesson Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Underwriting Spreadsheet Demo"
                className="w-full bg-[#0f0f12] bg-[#0b0b0d] border border-premium-border border-[#1a1a1c] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white text-white focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Duration Estimate</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 15m or 1h 10m"
                className="w-full bg-[#0f0f12] bg-[#0b0b0d] border border-premium-border border-[#1a1a1c] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Lesson Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#0f0f12] bg-[#0b0b0d] border border-premium-border border-[#1a1a1c] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white text-white focus:outline-none"
              >
                <option value="video">Video Node</option>
                <option value="document">PDF Document</option>
                <option value="quiz">Interactive Quiz</option>
              </select>
            </div>
          </div>

          {/* Row 2: Video URL & Video Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Link2 className="w-3 h-3" /> Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or direct .mp4 link"
                className="w-full bg-[#0f0f12] bg-[#0b0b0d] border border-premium-border border-[#1a1a1c] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <MonitorPlay className="w-3 h-3" /> Video Type
              </label>
              <select
                value={videoType}
                onChange={(e) => setVideoType(e.target.value)}
                className="w-full bg-[#0f0f12] bg-[#0b0b0d] border border-premium-border border-[#1a1a1c] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white text-white focus:outline-none"
              >
                <option value="html5">HTML5 (Direct MP4)</option>
                <option value="youtube">YouTube Embed</option>
                <option value="vimeo">Vimeo Embed</option>
              </select>
            </div>
          </div>

          {/* Row 3: Video ID & Preview Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Youtube className="w-3 h-3" /> Video ID (Optional)
              </label>
              <input
                type="text"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                placeholder="e.g. dQw4w9WgXcQ"
                className="w-full bg-[#0f0f12] bg-[#0b0b0d] border border-premium-border border-[#1a1a1c] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 pb-0.5">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPreview}
                  onChange={(e) => setIsPreview(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-600 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white"></div>
              </label>
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Free Preview Lecture</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-2.5 py-1.5 rounded-lg border border-premium-border border-[#1a1a1c] text-[10px] font-black text-slate-400 hover:text-slate-600 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-premium-accent text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
            >
              Append Lesson
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 py-1 px-3 text-[10px] font-black text-premium-accent hover:text-[#1E88E5] transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Lecture / File Resource</span>
        </button>
      )}
    </div>
  );
}
