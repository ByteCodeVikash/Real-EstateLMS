import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, UserCheck, ShieldAlert, Award, Search, Mail, Trash2, 
  ChevronLeft, ChevronRight, X, Clock, BookOpen, Laptop, MapPin, Eye, 
  FileText, CheckCircle2, AlertCircle, RefreshCw, Star, Info, ChevronDown, 
  Check, CreditCard, ShieldCheck, Activity, Copy, Phone, Calendar, Smartphone,
  Filter, MoreVertical, Send, ShieldAlert as AlertIcon, Lock, Download
} from 'lucide-react';
import { Button, Badge, GlassCard } from '../../components/UI';

// High-fidelity rich mock data for students
const initialStudents = [
  { 
    id: 1, 
    name: "Sarah Jenkins", 
    email: "sarah.j@realtypro.com", 
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Commercial Valuation & Investment", 
    progress: 82, 
    paymentStatus: "Paid", 
    activeDevices: 2, 
    joinDate: "2026-01-15", 
    status: "Active",
    watchHours: 45.2,
    assignments: [
      { id: 1, title: "Commercial Property Valuation Report", score: "94/100", status: "Graded", date: "2026-02-10" },
      { id: 2, title: "Investment Cap Rate Case Study", score: "88/100", status: "Graded", date: "2026-03-05" },
      { id: 3, title: "Taxation and Financial Analysis", score: "-", status: "Pending Review", date: "2026-05-18" }
    ],
    loginActivity: [
      { timestamp: "2026-05-25 10:14", device: "MacBook Pro (Chrome)", ip: "192.168.1.45", location: "New York, USA" },
      { timestamp: "2026-05-24 15:30", device: "iPhone 15 Pro (Safari)", ip: "172.56.21.90", location: "New York, USA" },
      { timestamp: "2026-05-22 09:12", device: "MacBook Pro (Chrome)", ip: "192.168.1.45", location: "New York, USA" }
    ],
    enrolledCourses: [
      { id: 101, title: "Commercial Valuation & Investment", progress: 82, watchHours: 35.0, paymentStatus: "Paid", tutor: "David Miller" },
      { id: 102, title: "Real Estate Finance & Tax Law", progress: 40, watchHours: 10.2, paymentStatus: "Paid", tutor: "Sarah Vance" }
    ]
  },
  { 
    id: 2, 
    name: "Michael Chen", 
    email: "m.chen@apexrealty.com", 
    phone: "+1 (555) 876-5432",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Residential Brokerage Essentials", 
    progress: 100, 
    paymentStatus: "Paid", 
    activeDevices: 1, 
    joinDate: "2025-11-10", 
    status: "Graduated",
    watchHours: 60.0,
    assignments: [
      { id: 1, title: "Residential Client Representation", score: "98/100", status: "Graded", date: "2025-12-05" },
      { id: 2, title: "Closing Procedures & Document Audit", score: "100/100", status: "Graded", date: "2026-01-20" }
    ],
    loginActivity: [
      { timestamp: "2026-05-15 14:22", device: "Windows Desktop (Edge)", ip: "198.51.100.72", location: "San Francisco, USA" }
    ],
    enrolledCourses: [
      { id: 103, title: "Residential Brokerage Essentials", progress: 100, watchHours: 48.0, paymentStatus: "Paid", tutor: "Robert K." },
      { id: 104, title: "Digital Marketing for Realtors", progress: 100, watchHours: 12.0, paymentStatus: "Paid", tutor: "Emma Watson" }
    ]
  },
  { 
    id: 3, 
    name: "Emily Rodriguez", 
    email: "emily.r@gmail.com", 
    phone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Real Estate Law & Contracts", 
    progress: 48, 
    paymentStatus: "Partial", 
    activeDevices: 3, 
    joinDate: "2026-02-28", 
    status: "Active",
    watchHours: 22.4,
    assignments: [
      { id: 1, title: "Contract Breach Clause Analysis", score: "76/100", status: "Graded", date: "2026-03-22" },
      { id: 2, title: "Purchase Agreement Drafting", score: "Submitted", status: "Pending Review", date: "2026-05-20" }
    ],
    loginActivity: [
      { timestamp: "2026-05-25 18:45", device: "iPad Air (Safari)", ip: "192.168.1.102", location: "Miami, USA" },
      { timestamp: "2026-05-23 20:10", device: "Android Phone (Chrome)", ip: "172.56.40.23", location: "Miami, USA" }
    ],
    enrolledCourses: [
      { id: 105, title: "Real Estate Law & Contracts", progress: 48, watchHours: 22.4, paymentStatus: "Partial", tutor: "Alisha Vance" }
    ]
  },
  { 
    id: 4, 
    name: "David Kim", 
    email: "david.kim@capitalprop.com", 
    phone: "+1 (555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Property Management & Leasing", 
    progress: 15, 
    paymentStatus: "Pending", 
    activeDevices: 0, 
    joinDate: "2026-04-12", 
    status: "Suspended",
    watchHours: 3.5,
    assignments: [
      { id: 1, title: "Lease Agreement Terms Review", score: "Submitted", status: "Pending Review", date: "2026-04-28" }
    ],
    loginActivity: [
      { timestamp: "2026-04-30 11:15", device: "MacBook Air (Chrome)", ip: "192.168.10.15", location: "Seattle, USA" }
    ],
    enrolledCourses: [
      { id: 106, title: "Property Management & Leasing", progress: 15, watchHours: 3.5, paymentStatus: "Pending", tutor: "Marcus Brody" }
    ]
  },
  { 
    id: 5, 
    name: "Jessica Taylor", 
    email: "jessica.t@luxuryhome.com", 
    phone: "+1 (555) 789-0123",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Commercial Valuation & Investment", 
    progress: 95, 
    paymentStatus: "Paid", 
    activeDevices: 2, 
    joinDate: "2026-01-08", 
    status: "Active",
    watchHours: 52.8,
    assignments: [
      { id: 1, title: "Commercial Property Valuation Report", score: "92/100", status: "Graded", date: "2026-02-05" },
      { id: 2, title: "Investment Cap Rate Case Study", score: "96/100", status: "Graded", date: "2026-03-01" },
      { id: 3, title: "Taxation and Financial Analysis", score: "90/100", status: "Graded", date: "2026-04-15" }
    ],
    loginActivity: [
      { timestamp: "2026-05-25 15:40", device: "Windows Desktop (Chrome)", ip: "184.22.109.4", location: "Chicago, USA" },
      { timestamp: "2026-05-24 19:12", device: "iPhone 14 (Safari)", ip: "172.56.9.11", location: "Chicago, USA" }
    ],
    enrolledCourses: [
      { id: 101, title: "Commercial Valuation & Investment", progress: 95, watchHours: 52.8, paymentStatus: "Paid", tutor: "David Miller" }
    ]
  },
  { 
    id: 6, 
    name: "James Wilson", 
    email: "j.wilson@residentialpartners.com", 
    phone: "+1 (555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Residential Brokerage Essentials", 
    progress: 74, 
    paymentStatus: "Paid", 
    activeDevices: 1, 
    joinDate: "2026-02-15", 
    status: "Active",
    watchHours: 38.1,
    assignments: [
      { id: 1, title: "Residential Client Representation", score: "85/100", status: "Graded", date: "2026-03-12" },
      { id: 2, title: "Closing Procedures & Document Audit", score: "-", status: "Submitted", date: "2026-05-22" }
    ],
    loginActivity: [
      { timestamp: "2026-05-24 08:33", device: "MacBook Pro (Firefox)", ip: "98.137.24.1", location: "Los Angeles, USA" }
    ],
    enrolledCourses: [
      { id: 103, title: "Residential Brokerage Essentials", progress: 74, watchHours: 38.1, paymentStatus: "Paid", tutor: "Robert K." }
    ]
  },
  { 
    id: 7, 
    name: "Amanda White", 
    email: "amanda@whiteland.co", 
    phone: "+1 (555) 901-2345",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Real Estate Law & Contracts", 
    progress: 100, 
    paymentStatus: "Paid", 
    activeDevices: 1, 
    joinDate: "2025-12-01", 
    status: "Graduated",
    watchHours: 41.5,
    assignments: [
      { id: 1, title: "Contract Breach Clause Analysis", score: "95/100", status: "Graded", date: "2025-12-20" },
      { id: 2, title: "Purchase Agreement Drafting", score: "99/100", status: "Graded", date: "2026-01-18" }
    ],
    loginActivity: [
      { timestamp: "2026-05-10 16:45", device: "Windows Desktop (Firefox)", ip: "192.168.1.99", location: "Boston, USA" }
    ],
    enrolledCourses: [
      { id: 105, title: "Real Estate Law & Contracts", progress: 100, watchHours: 41.5, paymentStatus: "Paid", tutor: "Alisha Vance" }
    ]
  },
  { 
    id: 8, 
    name: "Marcus Aurelius", 
    email: "marcus.aurelius@rome.org", 
    phone: "+1 (555) 111-2222",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Property Management & Leasing", 
    progress: 60, 
    paymentStatus: "Paid", 
    activeDevices: 2, 
    joinDate: "2026-03-10", 
    status: "Active",
    watchHours: 28.0,
    assignments: [
      { id: 1, title: "Lease Agreement Terms Review", score: "90/100", status: "Graded", date: "2026-04-10" }
    ],
    loginActivity: [
      { timestamp: "2026-05-25 11:20", device: "MacBook Air (Chrome)", ip: "192.168.20.1", location: "Houston, USA" }
    ],
    enrolledCourses: [
      { id: 106, title: "Property Management & Leasing", progress: 60, watchHours: 28.0, paymentStatus: "Paid", tutor: "Marcus Brody" }
    ]
  },
  { 
    id: 9, 
    name: "Sophia Loren", 
    email: "sophia.l@cinema.it", 
    phone: "+1 (555) 333-4444",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Real Estate Law & Contracts", 
    progress: 12, 
    paymentStatus: "Pending", 
    activeDevices: 1, 
    joinDate: "2026-05-01", 
    status: "Inactive",
    watchHours: 2.1,
    assignments: [],
    loginActivity: [
      { timestamp: "2026-05-02 09:15", device: "Android Phone (Chrome)", ip: "185.10.22.44", location: "Rome, Italy" }
    ],
    enrolledCourses: [
      { id: 105, title: "Real Estate Law & Contracts", progress: 12, watchHours: 2.1, paymentStatus: "Pending", tutor: "Alisha Vance" }
    ]
  },
  { 
    id: 10, 
    name: "Ryan Gosling", 
    email: "ryan.g@drive.com", 
    phone: "+1 (555) 555-0199",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    course: "Property Management & Leasing", 
    progress: 40, 
    paymentStatus: "Partial", 
    activeDevices: 4, 
    joinDate: "2026-03-25", 
    status: "Suspended",
    watchHours: 18.3,
    assignments: [
      { id: 1, title: "Lease Agreement Terms Review", score: "82/100", status: "Graded", date: "2026-04-18" }
    ],
    loginActivity: [
      { timestamp: "2026-05-20 22:10", device: "iPhone 15 Pro (Safari)", ip: "172.56.32.122", location: "Detroit, USA" }
    ],
    enrolledCourses: [
      { id: 106, title: "Property Management & Leasing", progress: 40, watchHours: 18.3, paymentStatus: "Partial", tutor: "Marcus Brody" }
    ]
  }
];

export default function AdminStudents() {
  const [students, setStudents] = useState(initialStudents);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Searching & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: 'joinDate', direction: 'desc' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Drawers & Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('overview'); // overview, analytics, assignments, activity
  
  const [modalOpen, setModalOpen] = useState(null); // 'add' | 'edit' | 'suspend' | 'reset-password' | 'notify' | 'bulk-suspend' | 'bulk-reset-password' | 'bulk-notify'
  const [activeModalStudent, setActiveModalStudent] = useState(null);
  
  // Notification form states
  const [notifSubject, setNotifSubject] = useState('');
  const [notifContent, setNotifContent] = useState('');
  const [notifType, setNotifType] = useState('Email');
  
  // Add/Edit form state
  const [formState, setFormState] = useState({
    name: '', email: '', phone: '', course: 'Commercial Valuation & Investment', 
    progress: 0, paymentStatus: 'Paid', status: 'Active', activeDevices: 1
  });
  
  // Temp Password display state
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };
  
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);
  
  // Unique courses for filter select
  const availableCourses = [
    "Commercial Valuation & Investment",
    "Residential Brokerage Essentials",
    "Real Estate Law & Contracts",
    "Property Management & Leasing"
  ];
  
  // Sorting Logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Filter Logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
    const matchesPayment = paymentFilter === 'all' || student.paymentStatus === paymentFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesCourse && matchesPayment && matchesStatus;
  });
  
  // Sort Executed
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Pagination Executed
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + itemsPerPage);
  
  // Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = paginatedStudents.map(s => s.id);
      setSelectedIds(prev => {
        const unique = new Set([...prev, ...currentPageIds]);
        return Array.from(unique);
      });
    } else {
      const currentPageIds = paginatedStudents.map(s => s.id);
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };
  
  const handleSelectRow = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };
  
  // Quick Action triggers
  const handleSingleSuspendToggle = (e, student) => {
    e.stopPropagation();
    setActiveModalStudent(student);
    setModalOpen('suspend');
  };
  
  const handleSingleResetPassword = (e, student) => {
    e.stopPropagation();
    setActiveModalStudent(student);
    const tempPass = `RELMS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGeneratedPassword(tempPass);
    setModalOpen('reset-password');
  };
  
  const handleSingleSendNotification = (e, student) => {
    e.stopPropagation();
    setActiveModalStudent(student);
    setNotifSubject('');
    setNotifContent('');
    setNotifType('Email');
    setModalOpen('notify');
  };
  
  const handleSingleViewActivity = (e, student) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setDrawerTab('activity');
    setDrawerOpen(true);
  };
  
  const openProfileDrawer = (student) => {
    setSelectedStudent(student);
    setDrawerTab('overview');
    setDrawerOpen(true);
  };
  
  // Confirm actions
  const confirmSuspendToggle = () => {
    setStudents(prev => prev.map(s => {
      if (s.id === activeModalStudent.id) {
        const nextStatus = s.status === 'Suspended' ? 'Active' : 'Suspended';
        showToast(`User "${s.name}" account is now ${nextStatus}`, 'success');
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    setModalOpen(null);
  };
  
  const confirmSendNotification = (e) => {
    e.preventDefault();
    if (!notifSubject.trim() || !notifContent.trim()) {
      showToast("Subject and content are required", "danger");
      return;
    }
    
    showToast(`Notification sent to ${activeModalStudent ? activeModalStudent.name : `${selectedIds.length} students`} via ${notifType}`, 'success');
    setModalOpen(null);
    setNotifSubject('');
    setNotifContent('');
  };
  
  const confirmResetPassword = () => {
    showToast(`Password successfully reset for ${activeModalStudent.name}`, 'success');
    setModalOpen(null);
  };
  
  // Bulk Actions
  const handleBulkSuspend = () => {
    setModalOpen('bulk-suspend');
  };
  
  const confirmBulkSuspend = () => {
    setStudents(prev => prev.map(s => {
      if (selectedIds.includes(s.id)) {
        return { ...s, status: 'Suspended' };
      }
      return s;
    }));
    showToast(`Suspended ${selectedIds.length} students successfully`, 'success');
    setSelectedIds([]);
    setModalOpen(null);
  };
  
  const handleBulkResetPassword = () => {
    setModalOpen('bulk-reset-password');
  };
  
  const confirmBulkResetPassword = () => {
    showToast(`Sent password reset instructions to ${selectedIds.length} students`, 'success');
    setSelectedIds([]);
    setModalOpen(null);
  };
  
  const handleBulkNotify = () => {
    setNotifSubject('');
    setNotifContent('');
    setNotifType('Email');
    setModalOpen('bulk-notify');
  };
  
  const confirmBulkNotify = (e) => {
    e.preventDefault();
    if (!notifSubject.trim() || !notifContent.trim()) {
      showToast("Subject and content are required", "danger");
      return;
    }
    showToast(`Bulk notification sent to ${selectedIds.length} students`, 'success');
    setSelectedIds([]);
    setModalOpen(null);
  };
  
  // Exporter
  const handleExportCSV = (exportSelected = false) => {
    const listToExport = exportSelected 
      ? students.filter(s => selectedIds.includes(s.id))
      : sortedStudents;
      
    if (listToExport.length === 0) {
      showToast("No data to export", "danger");
      return;
    }
    
    const headers = ["ID", "Name", "Email", "Phone", "Enrolled Course", "Progress %", "Payment Status", "Devices", "Join Date", "Account Status", "Watch Hours"];
    const rows = listToExport.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.phone,
      `"${s.course.replace(/"/g, '""')}"`,
      s.progress,
      s.paymentStatus,
      s.activeDevices,
      s.joinDate,
      s.status,
      s.watchHours
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LMS_Students_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} student records`, 'success');
  };
  
  // Form submission (Add / Edit Student)
  const handleCreateStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      id: Date.now(),
      name: formState.name,
      email: formState.email,
      phone: formState.phone || "+1 (555) 000-0000",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", // Default avatar
      course: formState.course,
      progress: Number(formState.progress) || 0,
      paymentStatus: formState.paymentStatus,
      activeDevices: Number(formState.activeDevices) || 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: formState.status,
      watchHours: parseFloat((Math.random() * 20).toFixed(1)),
      assignments: [],
      loginActivity: [
        { timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), device: "Web App (Chrome)", ip: "192.168.1.1", location: "Registration IP" }
      ],
      enrolledCourses: [
        { id: 110, title: formState.course, progress: Number(formState.progress) || 0, watchHours: 0, paymentStatus: formState.paymentStatus, tutor: "Lead Instructor" }
      ]
    };
    
    setStudents([newStudent, ...students]);
    setModalOpen(null);
    showToast(`Registered new student "${newStudent.name}" successfully!`, 'success');
    resetFormState();
  };
  
  const handleEditStudent = (e) => {
    e.preventDefault();
    setStudents(prev => prev.map(s => {
      if (s.id === activeModalStudent.id) {
        return {
          ...s,
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          course: formState.course,
          progress: Number(formState.progress),
          paymentStatus: formState.paymentStatus,
          status: formState.status,
          activeDevices: Number(formState.activeDevices)
        };
      }
      return s;
    }));
    
    // Also update selected student detail drawer if open
    if (selectedStudent && selectedStudent.id === activeModalStudent.id) {
      setSelectedStudent(prev => ({
        ...prev,
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        course: formState.course,
        progress: Number(formState.progress),
        paymentStatus: formState.paymentStatus,
        status: formState.status,
        activeDevices: Number(formState.activeDevices)
      }));
    }
    
    setModalOpen(null);
    showToast(`Updated student details for "${formState.name}"`, 'success');
    resetFormState();
  };
  
  const resetFormState = () => {
    setFormState({
      name: '', email: '', phone: '', course: 'Commercial Valuation & Investment', 
      progress: 0, paymentStatus: 'Paid', status: 'Active', activeDevices: 1
    });
    setActiveModalStudent(null);
  };
  
  const triggerEditStudentModal = (e, student) => {
    e.stopPropagation();
    setActiveModalStudent(student);
    setFormState({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      progress: student.progress,
      paymentStatus: student.paymentStatus,
      status: student.status,
      activeDevices: student.activeDevices
    });
    setModalOpen('edit');
  };
  
  const triggerAddStudentModal = () => {
    resetFormState();
    setModalOpen('add');
  };

  // Helper styles
  const paymentStyles = {
    Paid: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
    Partial: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900",
    Pending: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900"
  };

  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
    Graduated: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900",
    Suspended: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
  };
  
  // Analytics Metrics computation
  const totalStudents = students.length;
  const activeLearners = students.filter(s => s.status === 'Active').length;
  const avgProgress = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.progress, 0) / totalStudents) 
    : 0;
  const totalHours = students.reduce((acc, curr) => acc + curr.watchHours, 0).toFixed(1);
  const activeDevicesTotal = students.reduce((acc, curr) => acc + curr.activeDevices, 0);

  // Pagination current check items
  const isPageAllSelected = paginatedStudents.length > 0 && paginatedStudents.every(s => selectedIds.includes(s.id));
  const isPageAnySelected = paginatedStudents.some(s => selectedIds.includes(s.id));

  return (
    <div className="space-y-8 animate-in text-left relative pb-20">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[250] flex items-center gap-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-4.5 rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-200 max-w-sm"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <p className="text-xs font-bold leading-tight">{toast.message}</p>
            <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="text-slate-400 hover:text-white dark:hover:text-slate-900 ml-auto cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-premium-heading dark:text-white tracking-tight uppercase">Student Management</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Track student enrollment progress, active devices, payment logs, and manage accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => handleExportCSV(false)}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={triggerAddStudentModal}>
            <UserPlus className="w-4 h-4 mr-2" /> Add Student
          </Button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex items-center gap-4.5 p-5">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 dark:bg-blue-950/30 flex items-center justify-center text-blue-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Students</span>
            <p className="text-2xl font-black text-premium-heading dark:text-white mt-0.5">{totalStudents}</p>
            <span className="text-[10px] font-extrabold text-emerald-500 flex items-center gap-0.5 mt-0.5">
              +12.4% <span className="text-slate-400 font-semibold uppercase">this month</span>
            </span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4.5 p-5">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Learners</span>
            <p className="text-2xl font-black text-premium-heading dark:text-white mt-0.5">{activeLearners}</p>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> {students.filter(s => s.activeDevices > 0).length} currently online
            </span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4.5 p-5">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-500">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Course Progress</span>
            <p className="text-2xl font-black text-premium-heading dark:text-white mt-0.5">{avgProgress}%</p>
            {/* Visual Mini Progress Bar */}
            <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
              <div className="h-full bg-gradient-violet rounded-full" style={{ width: `${avgProgress}%` }} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4.5 p-5">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 dark:bg-violet-950/30 flex items-center justify-center text-violet-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Study Watch Hours</span>
            <p className="text-2xl font-black text-premium-heading dark:text-white mt-0.5">{totalHours} hrs</p>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
              Across {activeDevicesTotal} active devices
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Advanced Filters & Search Panel */}
      <GlassCard className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by student name, email, course..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/25 focus:border-premium-accent transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {/* Course Filter */}
            <div className="relative">
              <select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                className="w-full lg:w-48 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-4 pr-10 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/25 transition-all cursor-pointer"
              >
                <option value="all">All Courses</option>
                {availableCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Payment Filter */}
            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
                className="w-full lg:w-40 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-4 pr-10 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/25 transition-all cursor-pointer"
              >
                <option value="all">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
              <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Account Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full lg:w-40 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-4 pr-10 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/25 transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          {/* Reset Filters Option */}
          {(searchTerm || courseFilter !== 'all' || paymentFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCourseFilter('all');
                setPaymentFilter('all');
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className="text-xs font-black text-premium-accent hover:underline flex items-center gap-1.5 self-center lg:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </GlassCard>

      {/* Main Student Registry Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
                {/* Checkbox Header */}
                <th className="px-6 py-4.5 w-10">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isPageAllSelected}
                      ref={input => {
                        if (input) {
                          input.indeterminate = isPageAnySelected && !isPageAllSelected;
                        }
                      }}
                      onChange={handleSelectAll}
                      className="h-4.5 w-4.5 rounded border-slate-350 text-premium-accent focus:ring-premium-accent cursor-pointer"
                    />
                  </div>
                </th>
                
                {/* Photo & Name */}
                <th onClick={() => handleSort('name')} className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    Student Profile
                    {sortConfig.key === 'name' && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                
                {/* Enrolled Course */}
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                  Enrolled Course
                </th>
                
                {/* Progress */}
                <th onClick={() => handleSort('progress')} className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    Progress
                    {sortConfig.key === 'progress' && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                
                {/* Payment Status */}
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                  Payment Status
                </th>
                
                {/* Active Device Count */}
                <th onClick={() => handleSort('activeDevices')} className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 cursor-pointer select-none text-center">
                  <div className="flex items-center justify-center gap-1">
                    Devices
                    {sortConfig.key === 'activeDevices' && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                
                {/* Join Date */}
                <th onClick={() => handleSort('joinDate')} className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    Join Date
                    {sortConfig.key === 'joinDate' && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                
                {/* Account Status */}
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                  Account Status
                </th>
                
                {/* Actions */}
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none text-right">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((row) => {
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => openProfileDrawer(row)}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(e, row.id)}
                            className="h-4.5 w-4.5 rounded border-slate-350 text-premium-accent focus:ring-premium-accent cursor-pointer"
                          />
                        </div>
                      </td>
                      
                      {/* Student Profile Card */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {row.avatar ? (
                            <img 
                              src={row.avatar} 
                              alt={row.name} 
                              className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-150"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-gradient-premium/15 flex items-center justify-center font-black text-premium-accent border border-premium-border/40 text-xs">
                              {row.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-premium-heading dark:text-white leading-tight hover:text-premium-accent transition-colors">
                              {row.name}
                            </p>
                            <span className="text-[10px] text-slate-400 font-semibold">{row.email}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Enrolled Course */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-700 dark:text-slate-300 max-w-[200px] truncate block text-[11px]">
                          {row.course}
                        </span>
                      </td>
                      
                      {/* Progress Bar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[130px]">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-premium`} 
                              style={{ width: `${row.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 w-8 text-right shrink-0">
                            {row.progress}%
                          </span>
                        </div>
                      </td>
                      
                      {/* Payment Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${paymentStyles[row.paymentStatus]}`}>
                          {row.paymentStatus}
                        </span>
                      </td>
                      
                      {/* Active Devices */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-black ${
                          row.activeDevices > 0 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900' 
                            : 'bg-slate-50 text-slate-400 border border-slate-100 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-700'
                        }`}>
                          <Laptop className="w-3 h-3 mr-1" /> {row.activeDevices}
                        </span>
                      </td>
                      
                      {/* Join Date */}
                      <td className="px-6 py-4">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(row.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      
                      {/* Account Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyles[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => openProfileDrawer(row)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-450 hover:text-premium-accent border border-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-750 dark:border-slate-700 transition-all cursor-pointer"
                            title="View Detailed Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button 
                            onClick={(e) => handleSingleSendNotification(e, row)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-455 hover:text-premium-violet border border-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-750 dark:border-slate-700 transition-all cursor-pointer"
                            title="Send Notification"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          
                          <button 
                            onClick={(e) => handleSingleResetPassword(e, row)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-455 hover:text-amber-600 border border-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-750 dark:border-slate-700 transition-all cursor-pointer"
                            title="Reset Password"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                          
                          <button 
                            onClick={(e) => handleSingleSuspendToggle(e, row)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              row.status === 'Suspended' 
                                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-250 text-emerald-600 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30' 
                                : 'bg-rose-50 hover:bg-rose-100 border-rose-250 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/30'
                            }`}
                            title={row.status === 'Suspended' ? "Activate Account" : "Suspend Account"}
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                          
                          <div className="relative group">
                            <button 
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-450 border border-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-750 dark:border-slate-700 transition-all cursor-pointer"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block z-40 bg-slate-900 text-white rounded-lg p-1 shadow-xl text-left border border-slate-800 min-w-[120px]">
                              <button onClick={(e) => triggerEditStudentModal(e, row)} className="w-full text-left px-2.5 py-1.5 text-[10px] font-bold hover:bg-slate-800 rounded flex items-center gap-1.5">
                                Edit Student
                              </button>
                              <button onClick={(e) => handleSingleViewActivity(e, row)} className="w-full text-left px-2.5 py-1.5 text-[10px] font-bold hover:bg-slate-800 rounded flex items-center gap-1.5">
                                View Activity Logs
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-16 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-black text-sm text-premium-heading dark:text-white uppercase tracking-wider">No Students Found</h4>
                      <p className="text-xs font-semibold text-slate-400">No student records matched your current search filters. Try adjusting your query or resetting filters.</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                        setSearchTerm(''); setCourseFilter('all'); setPaymentFilter('all'); setStatusFilter('all');
                      }}>
                        Reset All Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedStudents.length)} of {sortedStudents.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8.5 w-8.5 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8.5 w-8.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-premium-accent text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8.5 w-8.5 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
          >
            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between flex-wrap gap-3 backdrop-blur-xl bg-opacity-95">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black tracking-wider uppercase">
                  {selectedIds.length} {selectedIds.length === 1 ? 'Student' : 'Students'} Selected
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkNotify}
                  className="px-3 py-2 text-[10px] font-black uppercase rounded-lg bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <Send className="w-3 h-3" /> Notify
                </button>
                <button
                  onClick={handleBulkResetPassword}
                  className="px-3 py-2 text-[10px] font-black uppercase rounded-lg bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <Lock className="w-3 h-3" /> Reset Pass
                </button>
                <button
                  onClick={handleBulkSuspend}
                  className="px-3 py-2 text-[10px] font-black uppercase rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/20 border border-red-900/50 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3 h-3" /> Suspend
                </button>
                <button
                  onClick={() => handleExportCSV(true)}
                  className="px-3 py-2 text-[10px] font-black uppercase rounded-lg bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3 h-3" /> Export
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="px-3 py-2 text-[10px] font-black uppercase rounded-lg hover:underline transition-all cursor-pointer text-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Profile Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedStudent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[150]"
            />
            {/* Right Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-[151] flex flex-col shadow-2xl text-left"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  {selectedStudent.avatar ? (
                    <img 
                      src={selectedStudent.avatar} 
                      alt={selectedStudent.name} 
                      className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-2xl bg-gradient-premium/15 flex items-center justify-center font-black text-premium-accent border border-premium-border/40 text-lg">
                      {selectedStudent.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-black text-premium-heading dark:text-white tracking-tight leading-tight">
                      {selectedStudent.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-bold">{selectedStudent.email}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] text-slate-400 font-bold">{selectedStudent.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyles[selectedStudent.status]}`}>
                    {selectedStudent.status}
                  </span>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Drawer Tabs Selection */}
              <div className="px-6 border-b border-slate-100 dark:border-slate-850 flex items-center gap-5 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setDrawerTab('overview')}
                  className={`py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    drawerTab === 'overview'
                      ? 'border-premium-accent text-premium-accent'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Overview & Courses
                </button>
                <button
                  onClick={() => setDrawerTab('analytics')}
                  className={`py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    drawerTab === 'analytics'
                      ? 'border-premium-accent text-premium-accent'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Learning Analytics
                </button>
                <button
                  onClick={() => setDrawerTab('assignments')}
                  className={`py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    drawerTab === 'assignments'
                      ? 'border-premium-accent text-premium-accent'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Assignments ({selectedStudent.assignments.length})
                </button>
                <button
                  onClick={() => setDrawerTab('activity')}
                  className={`py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    drawerTab === 'activity'
                      ? 'border-premium-accent text-premium-accent'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Login Activity
                </button>
              </div>
              
              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-6">
                
                {/* 1. OVERVIEW & COURSES TAB */}
                {drawerTab === 'overview' && (
                  <div className="space-y-5 animate-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Enrolled Courses ({selectedStudent.enrolledCourses.length})</h4>
                      <span className="text-[10px] font-bold text-slate-450">Join Date: {selectedStudent.joinDate}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {selectedStudent.enrolledCourses.map((c) => (
                        <div key={c.id} className="border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4.5 bg-slate-50/40 dark:bg-slate-900/40 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h5 className="text-xs font-black text-premium-heading dark:text-white leading-snug">{c.title}</h5>
                              <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Instructor: {c.tutor}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border shrink-0 ${paymentStyles[c.paymentStatus]}`}>
                              {c.paymentStatus}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
                            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> Progress</span>
                            <span>{c.progress}% Completed</span>
                          </div>
                          
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-gradient-premium rounded-full" style={{ width: `${c.progress}%` }} />
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Spent Study Time</span>
                            <span className="font-extrabold text-slate-700 dark:text-slate-300">{c.watchHours} hours</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 2. LEARNING ANALYTICS TAB */}
                {drawerTab === 'analytics' && (
                  <div className="space-y-6 animate-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Performance Metrics</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/30 dark:bg-slate-850/40">
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Total Watch Time</span>
                        <p className="text-2xl font-black text-premium-heading dark:text-white mt-1">{selectedStudent.watchHours} Hrs</p>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Across all lessons</span>
                      </div>
                      
                      <div className="border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/30 dark:bg-slate-850/40">
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Assignments Done</span>
                        <p className="text-2xl font-black text-premium-heading dark:text-white mt-1">
                          {selectedStudent.assignments.filter(a => a.status === 'Graded').length} / {selectedStudent.assignments.length}
                        </p>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Graded submissions</span>
                      </div>

                      <div className="border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/30 dark:bg-slate-850/40">
                        <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Active Devices</span>
                        <p className="text-2xl font-black text-premium-heading dark:text-white mt-1">{selectedStudent.activeDevices}</p>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Maximum concurrent limit: 5</span>
                      </div>

                      <div className="border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/30 dark:bg-slate-850/40">
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Billing Portfolio</span>
                        <p className="text-2xl font-black text-emerald-500 mt-1">{selectedStudent.paymentStatus === 'Paid' ? 'Cleared' : 'Due'}</p>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Status: {selectedStudent.paymentStatus}</span>
                      </div>
                    </div>
                    
                    {/* Visual Study Bar Graph Representing Weekly Engagement */}
                    <div className="border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Lesson Interaction</span>
                          <h5 className="text-xs font-black text-premium-heading dark:text-white mt-0.5">Study Activity Log (Hours/Day)</h5>
                        </div>
                        <span className="text-[10px] text-premium-accent font-black">May 2026</span>
                      </div>
                      
                      <div className="flex justify-between items-end h-28 pt-2">
                        {[
                          { day: "Mon", hrs: 1.5, height: "h-[35%]" },
                          { day: "Tue", hrs: 0.0, height: "h-[0%]" },
                          { day: "Wed", hrs: 3.2, height: "h-[75%]" },
                          { day: "Thu", hrs: 2.1, height: "h-[50%]" },
                          { day: "Fri", hrs: 4.5, height: "h-[100%]" },
                          { day: "Sat", hrs: 1.0, height: "h-[25%]" },
                          { day: "Sun", hrs: 0.5, height: "h-[12%]" }
                        ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2 w-8 group">
                            <div className="text-[9px] font-bold text-slate-450 opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-900 text-white rounded px-1 py-0.5">
                              {item.hrs}h
                            </div>
                            <div className={`w-3.5 rounded-t-md bg-gradient-premium group-hover:opacity-80 transition-all ${item.height}`} />
                            <span className="text-[10px] font-semibold text-slate-400 mt-1">{item.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 3. ASSIGNMENT HISTORY TAB */}
                {drawerTab === 'assignments' && (
                  <div className="space-y-4 animate-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Submitted Assessments</h4>
                    
                    {selectedStudent.assignments.length > 0 ? (
                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-850">
                        {selectedStudent.assignments.map((asg) => (
                          <div key={asg.id} className="p-4 flex items-center justify-between gap-4 bg-slate-50/10 hover:bg-slate-55/20 transition-colors">
                            <div className="space-y-1">
                              <h5 className="text-xs font-black text-premium-heading dark:text-white leading-tight">{asg.title}</h5>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {asg.date}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-premium-heading dark:text-white">{asg.score}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                asg.status === 'Graded'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900'
                                  : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900'
                              }`}>
                                {asg.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-bold">No assignments submitted yet.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 4. LOGIN SECURITY LOG TAB */}
                {drawerTab === 'activity' && (
                  <div className="space-y-4 animate-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Security Access Logs</h4>
                    
                    <div className="space-y-3">
                      {selectedStudent.loginActivity.map((log, idx) => (
                        <div key={idx} className="border border-slate-200/60 dark:border-slate-800 rounded-xl p-3.5 flex items-start gap-3 bg-slate-50/20 dark:bg-slate-900/20">
                          <div className="h-8.5 w-8.5 rounded-lg bg-blue-500/10 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center shrink-0">
                            <Laptop className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-extrabold text-premium-heading dark:text-white truncate block">{log.device}</span>
                              <span className="text-[9px] text-slate-400 font-semibold shrink-0">{log.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
                              <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {log.location}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-350"></span>
                              <span>IP: {log.ip}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-850 flex items-center justify-between shrink-0 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    setDrawerOpen(false);
                    triggerEditStudentModal(e, selectedStudent);
                  }}
                >
                  Edit Profile
                </Button>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={(e) => {
                      setDrawerOpen(false);
                      handleSingleSuspendToggle(e, selectedStudent);
                    }}
                  >
                    {selectedStudent.status === 'Suspended' ? 'Activate Account' : 'Suspend Account'}
                  </Button>
                  <Button 
                    variant="gold" 
                    size="sm"
                    onClick={(e) => {
                      setDrawerOpen(false);
                      handleSingleSendNotification(e, selectedStudent);
                    }}
                  >
                    Send Notification
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. QUICK ACTION MODALS */}
      <AnimatePresence>
        
        {/* ADD STUDENT MODAL */}
        {modalOpen === 'add' && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(null)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[200]" />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Register New Student</h3>
                  <button onClick={() => setModalOpen(null)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-850 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                
                <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                      <input
                        type="text" required placeholder="John Doe"
                        value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                      <input
                        type="email" required placeholder="john.doe@gmail.com"
                        value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone Number</label>
                      <input
                        type="text" placeholder="+1 (555) 123-4567"
                        value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Devices Limit</label>
                      <input
                        type="number" min="1" max="5" required
                        value={formState.activeDevices} onChange={(e) => setFormState({ ...formState, activeDevices: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Enrolled Course</label>
                    <select
                      value={formState.course} onChange={(e) => setFormState({ ...formState, course: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
                    >
                      {availableCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Course Progress (%)</label>
                      <input
                        type="number" min="0" max="100" required
                        value={formState.progress} onChange={(e) => setFormState({ ...formState, progress: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Payment Status</label>
                      <select
                        value={formState.paymentStatus} onChange={(e) => setFormState({ ...formState, paymentStatus: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Account Status</label>
                      <select
                        value={formState.status} onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                    <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(null)}>Cancel</Button>
                    <Button variant="primary" size="sm" type="submit">Create Record</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}

        {/* EDIT STUDENT MODAL */}
        {modalOpen === 'edit' && activeModalStudent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(null)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[200]" />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Edit Student Record</h3>
                  <button onClick={() => setModalOpen(null)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-850 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                
                <form onSubmit={handleEditStudent} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                      <input
                        type="text" required
                        value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                      <input
                        type="email" required
                        value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone Number</label>
                      <input
                        type="text"
                        value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Devices Limit</label>
                      <input
                        type="number" min="1" max="5" required
                        value={formState.activeDevices} onChange={(e) => setFormState({ ...formState, activeDevices: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Enrolled Course</label>
                    <select
                      value={formState.course} onChange={(e) => setFormState({ ...formState, course: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
                    >
                      {availableCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Course Progress (%)</label>
                      <input
                        type="number" min="0" max="100" required
                        value={formState.progress} onChange={(e) => setFormState({ ...formState, progress: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Payment Status</label>
                      <select
                        value={formState.paymentStatus} onChange={(e) => setFormState({ ...formState, paymentStatus: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Account Status</label>
                      <select
                        value={formState.status} onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                    <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(null)}>Cancel</Button>
                    <Button variant="primary" size="sm" type="submit">Save Changes</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}

        {/* NOTIFICATION MODAL (SINGLE) */}
        {modalOpen === 'notify' && activeModalStudent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(null)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[200]" />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Send Notification</h3>
                  <button onClick={() => setModalOpen(null)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-850 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                
                <form onSubmit={confirmSendNotification} className="p-6 space-y-4">
                  <div className="text-xs bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-150 dark:border-slate-800">
                    <span className="font-semibold text-slate-400">Recipient:</span>
                    <span className="font-extrabold text-premium-heading dark:text-white ml-1.5">{activeModalStudent.name} ({activeModalStudent.email})</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Channel</label>
                    <select
                      value={notifType} onChange={(e) => setNotifType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
                    >
                      <option value="Email">Email Message</option>
                      <option value="Push">Mobile Push Notification</option>
                      <option value="System">LMS Inbox Broadcast</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Subject Title</label>
                    <input
                      type="text" required placeholder="e.g. Action Required: Update Profile"
                      value={notifSubject} onChange={(e) => setNotifSubject(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Message Content</label>
                    <textarea
                      required rows="4" placeholder="Write message body..."
                      value={notifContent} onChange={(e) => setNotifContent(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                    <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(null)}>Cancel</Button>
                    <Button variant="primary" size="sm" type="submit">Dispatch Notification</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}

        {/* NOTIFICATION MODAL (BULK) */}
        {modalOpen === 'bulk-notify' && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(null)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[200]" />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">Bulk Dispatch Notification</h3>
                  <button onClick={() => setModalOpen(null)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-855 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                
                <form onSubmit={confirmBulkNotify} className="p-6 space-y-4">
                  <div className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-955/30 dark:text-blue-400 p-3.5 rounded-xl border border-blue-100/60 font-black">
                    Broadcasting message to {selectedIds.length} selected students.
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Broadcast Channel</label>
                    <select
                      value={notifType} onChange={(e) => setNotifType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-accent/20 cursor-pointer"
                    >
                      <option value="Email">Email Message</option>
                      <option value="Push">Mobile Push Notification</option>
                      <option value="System">LMS Inbox Broadcast</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Broadcast Subject</label>
                    <input
                      type="text" required placeholder="e.g. Schedule Update: Upcoming Live Class"
                      value={notifSubject} onChange={(e) => setNotifSubject(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Broadcast Content</label>
                    <textarea
                      required rows="4" placeholder="Write broadcast message..."
                      value={notifContent} onChange={(e) => setNotifContent(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-premium-heading dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                    <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(null)}>Cancel</Button>
                    <Button variant="primary" size="sm" type="submit">Broadcast Message</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}

        {/* SUSPEND USER CONFIRMATION MODAL (SINGLE) */}
        {modalOpen === 'suspend' && activeModalStudent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(null)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[200]" />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">
                      {activeModalStudent.status === 'Suspended' ? 'Re-Activate Student Account?' : 'Suspend Student Account?'}
                    </h3>
                    <p className="text-xs font-semibold text-slate-450 dark:text-slate-400 mt-1">
                      {activeModalStudent.status === 'Suspended' 
                        ? `Are you sure you want to restore learning access for ${activeModalStudent.name}? They will immediately be allowed to login and watch courses.`
                        : `Are you sure you want to suspend learning access for ${activeModalStudent.name}? This will terminate their current session and lock access to all LMS content.`
                      }
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <Button variant="outline" size="sm" onClick={() => setModalOpen(null)}>Cancel</Button>
                  <Button 
                    variant={activeModalStudent.status === 'Suspended' ? 'primary' : 'danger'} 
                    size="sm" 
                    onClick={confirmSuspendToggle}
                  >
                    {activeModalStudent.status === 'Suspended' ? 'Activate Account' : 'Suspend Account'}
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* BULK SUSPEND CONFIRMATION MODAL */}
        {modalOpen === 'bulk-suspend' && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(null)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[200]" />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">
                      Suspend Selected Accounts?
                    </h3>
                    <p className="text-xs font-semibold text-slate-450 dark:text-slate-400 mt-1">
                      Are you sure you want to suspend account access for the <strong>{selectedIds.length} selected students</strong>? 
                      They will not be able to log in to the system until activated again.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <Button variant="outline" size="sm" onClick={() => setModalOpen(null)}>Cancel</Button>
                  <Button variant="danger" size="sm" onClick={confirmBulkSuspend}>
                    Suspend {selectedIds.length} Accounts
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* BULK PASSWORD RESET CONFIRMATION MODAL */}
        {modalOpen === 'bulk-reset-password' && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(null)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[200]" />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-955/20 flex items-center justify-center text-amber-600 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">
                      Reset Password for Selected?
                    </h3>
                    <p className="text-xs font-semibold text-slate-450 dark:text-slate-400 mt-1">
                      This will reset passwords for the <strong>{selectedIds.length} selected students</strong>. 
                      An automated email will be sent containing temporary passwords to access their profile.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <Button variant="outline" size="sm" onClick={() => setModalOpen(null)}>Cancel</Button>
                  <Button variant="gold" size="sm" onClick={confirmBulkResetPassword}>
                    Reset Passwords
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* RESET PASSWORD MODAL (SINGLE) */}
        {modalOpen === 'reset-password' && activeModalStudent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(null)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[200]" />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-955/20 flex items-center justify-center text-amber-600 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-premium-heading dark:text-white tracking-tight uppercase">
                      Reset Password for Student
                    </h3>
                    <p className="text-xs font-semibold text-slate-450 dark:text-slate-450 mt-1">
                      Generate a secure random credentials token for <strong>{activeModalStudent.name}</strong>.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Temporary Password</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPassword);
                        showToast("Password copied to clipboard!", "success");
                      }}
                      className="text-[10px] font-black text-premium-accent hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </button>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center text-sm font-black tracking-widest text-premium-heading dark:text-white font-mono select-all">
                    {generatedPassword}
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">Copy and send this credentials key to the student. They will be forced to change it on their next login session.</p>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <Button variant="outline" size="sm" onClick={() => setModalOpen(null)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={confirmResetPassword}>Confirm Reset</Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
        
      </AnimatePresence>

    </div>
  );
}
