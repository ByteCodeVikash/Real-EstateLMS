import React, { useState, useEffect } from 'react';
import { 
  UserCheck, BookOpen, GraduationCap, Award, Trash2, Edit, Plus, 
  SlidersHorizontal, CheckCircle, Clock, AlertTriangle, X, ShieldAlert 
} from 'lucide-react';
import { AdminTable, AdminDrawer, AdminModal, AdminStatCard } from '../../components/admin/AdminComponents';
import { Button, Badge, GlassCard } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

export default function AdminEnrollments() {
  const { token, API_BASE_URL } = useAuth();
  
  // Data State
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Drawer States
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
  const [enrollmentToRevoke, setEnrollmentToRevoke] = useState(null);

  // Form inputs
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [enrollCourseId, setEnrollCourseId] = useState('');
  
  const [progressInput, setProgressInput] = useState(0);
  const [statusInput, setStatusInput] = useState('Active');
  const [certificateInput, setCertificateInput] = useState(0);

  // Fetch all enrollments
  const fetchEnrollments = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success' && data.data?.enrollments) {
        setEnrollments(data.data.enrollments);
      }
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    }
  };

  // Fetch students list (role=student)
  const fetchStudents = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/users?role=student&limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success' && data.data?.users) {
        setStudents(data.data.users);
      }
    } catch (err) {
      console.error("Failed to fetch students list:", err);
    }
  };

  // Fetch courses list
  const fetchCourses = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success' && data.data?.courses) {
        setCourses(data.data.courses);
      }
    } catch (err) {
      console.error("Failed to fetch courses list:", err);
    }
  };

  // Load all initial data
  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchEnrollments(), fetchStudents(), fetchCourses()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Handle manual enrollment
  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!enrollStudentId || !enrollCourseId) {
      alert("Please select both a student and a course.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: Number(enrollStudentId),
          course_id: Number(enrollCourseId)
        })
      });
      const data = await response.json();
      if (response.status === 201 || data.status === 'success') {
        alert("Student enrolled successfully!");
        setEnrollModalOpen(false);
        setEnrollStudentId('');
        setEnrollCourseId('');
        fetchEnrollments();
      } else {
        alert(data.message || "Failed to enroll student.");
      }
    } catch (err) {
      console.error("Error creating enrollment:", err);
      alert("An error occurred during enrollment.");
    }
  };

  // Handle edit enrollment submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnrollment) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments/${selectedEnrollment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          progress: Number(progressInput),
          completion_status: statusInput,
          status: statusInput,
          certificate_issued: Number(certificateInput)
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert("Enrollment updated successfully!");
        setEditDrawerOpen(false);
        fetchEnrollments();
      } else {
        alert(data.message || "Failed to update enrollment.");
      }
    } catch (err) {
      console.error("Error updating enrollment:", err);
      alert("An error occurred during update.");
    }
  };

  // Handle revoke access (delete enrollment)
  const handleRevokeEnrollment = async () => {
    if (!enrollmentToRevoke) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments/${enrollmentToRevoke.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert("Enrollment revoked successfully.");
        setRevokeConfirmOpen(false);
        setEnrollmentToRevoke(null);
        fetchEnrollments();
      } else {
        alert(data.message || "Failed to revoke access.");
      }
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      alert("An error occurred while revoking access.");
    }
  };

  // Setup table columns
  const columns = [
    {
      header: "Student",
      accessor: "student_name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#111114] flex items-center justify-center font-bold text-premium-accent text-[11px] shrink-0">
            {row.student_name ? row.student_name.split(' ').map(n=>n[0]).join('') : 'U'}
          </div>
          <div>
            <p className="font-bold text-white leading-none">{row.student_name || 'Unknown student'}</p>
            <span className="text-[10px] text-slate-500 font-semibold">{row.student_email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Course Enrolled",
      accessor: "course_title",
      cellClassName: "text-slate-300 font-bold max-w-[220px] truncate"
    },
    {
      header: "Progress",
      accessor: "progress",
      render: (row) => (
        <div className="flex items-center gap-3 w-36">
          <div className="flex-1 h-1.5 rounded-full bg-[#111114] overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${row.progress === 100 ? 'from-emerald-500 to-teal-400' : 'from-premium-accent to-violet-500'}`}
              style={{ width: `${row.progress}%` }} 
            />
          </div>
          <span className="text-[10px] font-black text-white shrink-0 w-8 text-right">{row.progress}%</span>
        </div>
      )
    },
    {
      header: "State / Status",
      accessor: "completion_status",
      render: (row) => {
        const status = row.completion_status || row.status || 'Active';
        const styles = {
          Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          Completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          Dropped: "bg-red-500/10 text-red-400 border-red-500/20"
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[status] || styles.Active}`}>
            {status}
          </span>
        );
      }
    },
    {
      header: "Enrolled On",
      accessor: "enrolled_at",
      render: (row) => (
        <span className="text-[10px] text-slate-500">
          {row.enrolled_at ? row.enrolled_at.substring(0, 10) : '—'}
        </span>
      )
    },
    {
      header: "Manage Access",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-[10px] py-0"
            onClick={() => {
              setSelectedEnrollment(row);
              setProgressInput(row.progress);
              setStatusInput(row.completion_status || row.status || 'Active');
              setCertificateInput(row.certificate_issued);
              setEditDrawerOpen(true);
            }}
          >
            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            className="h-8 px-2 text-[10px] py-0"
            onClick={() => {
              setEnrollmentToRevoke(row);
              setRevokeConfirmOpen(true);
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Revoke
          </Button>
        </div>
      )
    }
  ];

  // Stats
  const totalEnrollments = enrollments.length;
  const activeCount = enrollments.filter(e => (e.completion_status || e.status) === 'Active').length;
  const completedCount = enrollments.filter(e => (e.completion_status || e.status) === 'Completed').length;
  const droppedCount = enrollments.filter(e => (e.completion_status || e.status) === 'Dropped').length;

  return (
    <div className="space-y-8 animate-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a1c] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-premium-accent animate-pulse"></span>
            <span className="text-[10px] font-black text-premium-accent uppercase tracking-widest">Enrollment Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase mt-1">Enrollment & Access Control</h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Manually enroll students in masterclasses, monitor syllabus progression, and revoke/terminate course materials access.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={() => setEnrollModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Enroll Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Total Enrollments" 
          value={totalEnrollments} 
          change="Live Records" 
          isPositive={true} 
          icon={UserCheck}
          gradient="from-violet-500/10 to-indigo-500/10"
          timeframe="total system registry"
        />
        <AdminStatCard 
          title="Active Students" 
          value={activeCount} 
          change={`${activeCount} current`} 
          isPositive={true} 
          icon={Clock}
          gradient="from-emerald-500/10 to-teal-500/10"
          timeframe="currently learning"
        />
        <AdminStatCard 
          title="Graduated/Completed" 
          value={completedCount} 
          change={`${completedCount} issued`} 
          isPositive={true} 
          icon={Award}
          gradient="from-blue-500/10 to-cyan-500/10"
          timeframe="completed syllabus"
        />
        <AdminStatCard 
          title="Dropped Out" 
          value={droppedCount} 
          change={`${droppedCount} revoked`} 
          isPositive={false} 
          icon={AlertTriangle}
          gradient="from-red-500/10 to-orange-500/10"
          timeframe="withdrawn access"
        />
      </div>

      {/* Enrollment Data Table */}
      {loading ? (
        <GlassCard className="p-8 flex justify-center items-center h-64 border border-[#1a1a1c]">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Clock className="w-8 h-8 animate-spin text-premium-accent" />
            <p className="text-xs font-bold uppercase tracking-wider">Loading system database...</p>
          </div>
        </GlassCard>
      ) : (
        <AdminTable
          title="Student Registration logs"
          subtitle="Course catalog enrollments, syllabus progress tracker, and licensing access indicators."
          columns={columns}
          data={enrollments}
          searchPlaceholder="Search student name, email, course title..."
          filterOptions={{
            field: "completion_status",
            label: "Syllabus Status",
            options: [
              { value: "Active", label: "Active" },
              { value: "Completed", label: "Completed" },
              { value: "Dropped", label: "Dropped" }
            ]
          }}
          emptyStateText="No enrollment records in database."
        />
      )}

      {/* Enroll Student Modal */}
      <AdminModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title="Enroll Student in Masterclass"
      >
        <form onSubmit={handleEnrollSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Student</label>
            <select
              required
              value={enrollStudentId}
              onChange={(e) => setEnrollStudentId(e.target.value)}
              className="w-full bg-[#111114] border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-premium-accent/20"
            >
              <option value="">-- Choose student profile --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Course</label>
            <select
              required
              value={enrollCourseId}
              onChange={(e) => setEnrollCourseId(e.target.value)}
              className="w-full bg-[#111114] border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-premium-accent/20"
            >
              <option value="">-- Choose masterclass course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1a1a1c]">
            <Button variant="outline" size="sm" type="button" onClick={() => setEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Enroll Now
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Enrollment Access Drawer */}
      <AdminDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        title="Modify Enrollment Status"
      >
        {selectedEnrollment && (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="bg-[#0f0f12] p-4 rounded-xl border border-[#1a1a1c]">
              <span className="text-[9px] font-black uppercase text-premium-accent tracking-wider">Syllabus Access Details</span>
              <p className="text-sm font-black text-white mt-1">{selectedEnrollment.student_name}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{selectedEnrollment.student_email}</p>
              <div className="h-px bg-[#1a1a1c] my-3" />
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Target Course</span>
              <p className="text-xs font-bold text-slate-300 mt-0.5">{selectedEnrollment.course_title}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Syllabus Progress</label>
                <span className="text-premium-accent font-black text-xs">{progressInput}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressInput}
                onChange={(e) => setProgressInput(Number(e.target.value))}
                className="w-full h-1.5 bg-[#111114] rounded-lg appearance-none cursor-pointer accent-premium-accent"
              />
              <span className="text-[9px] text-slate-500 font-semibold italic block">Note: Setting progress to 100% will automatically flag completion status.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Access Status</label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="w-full bg-[#111114] border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none"
              >
                <option value="Active">Active (Learning Progress Open)</option>
                <option value="Completed">Completed (Syllabus Finished)</option>
                <option value="Dropped">Dropped (Access Terminated)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Certificate Status</label>
              <select
                value={certificateInput}
                onChange={(e) => setCertificateInput(Number(e.target.value))}
                className="w-full bg-[#111114] border border-[#1e1e22] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none"
              >
                <option value={0}>Not Issued</option>
                <option value={1}>Certificate Issued</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#1a1a1c] flex items-center justify-end gap-3">
              <Button variant="outline" size="sm" type="button" onClick={() => setEditDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Apply Updates
              </Button>
            </div>
          </form>
        )}
      </AdminDrawer>

      {/* Custom Revocation Confirmation Modal */}
      <AdminModal
        isOpen={revokeConfirmOpen}
        onClose={() => {
          setRevokeConfirmOpen(false);
          setEnrollmentToRevoke(null);
        }}
        title="Revoke Course Access"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Warning: Irreversible Action</p>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">Revoking access will delete all progress log history and certificates generated for this course.</p>
            </div>
          </div>

          {enrollmentToRevoke && (
            <div className="bg-[#111114] p-4 rounded-xl border border-[#1e1e22] space-y-2">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Student Name</span>
                <p className="text-xs font-bold text-white mt-0.5">{enrollmentToRevoke.student_name}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Course Title</span>
                <p className="text-xs font-bold text-white mt-0.5">{enrollmentToRevoke.course_title}</p>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Are you sure you want to terminate this student's access to the course and delete their registry records?
          </p>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1a1a1c]">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setRevokeConfirmOpen(false);
                setEnrollmentToRevoke(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={handleRevokeEnrollment}
            >
              Confirm Revocation
            </Button>
          </div>
        </div>
      </AdminModal>

    </div>
  );
}
