import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Play, Lock, Clock, BookOpen, ChevronDown, Sparkles, 
  ShieldCheck, HelpCircle, ArrowLeft, ArrowRight, Video, 
  BookMarked, Users, Award, ShieldAlert, CheckCircle2, ChevronRight, Tag
} from 'lucide-react';
import { GlassCard, Badge, Button, Divider, Skeleton } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const SyllabusAccordion = ({ modules }) => {
  const [expandedModuleId, setExpandedModuleId] = useState(modules[0]?.id || null);

  const toggleModule = (id) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {modules.map((module) => {
        const isExpanded = expandedModuleId === module.id;
        return (
          <div 
            key={module.id} 
            className="border border-[#1a1a1c] rounded-2xl overflow-hidden bg-[#0f0f12]/30 hover:border-premium-accent/20 transition-colors duration-300"
          >
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-xs uppercase tracking-wider text-white hover:bg-slate-900/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-premium-accent/10 flex items-center justify-center border border-premium-accent/20">
                  <BookOpen className="w-4 h-4 text-premium-accent" />
                </div>
                <span>{module.title}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {isExpanded && (
              <div className="overflow-hidden border-t border-[#1a1a1c]/60 bg-[#070b13]/40">
                <div className="p-5 space-y-3">
                  {module.description && (
                    <p className="text-xs text-slate-400 font-medium mb-4 italic">
                      {module.description}
                    </p>
                  )}
                  {module.lectures?.length > 0 ? (
                    module.lectures.map((lecture) => (
                      <div 
                        key={lecture.id} 
                        className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#08080a]/60 border border-[#141416]/50 hover:border-[#222226] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Video className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="text-xs font-semibold text-slate-300">{lecture.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {lecture.duration && (
                            <span className="text-[11px] font-bold text-slate-500">{lecture.duration}</span>
                          )}
                          {lecture.is_preview ? (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-black uppercase tracking-wider border border-emerald-500/20">
                              Preview
                            </span>
                          ) : (
                            <span className="text-[9px] bg-slate-800/30 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase border border-slate-800/50">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 font-bold text-left">No lectures available in this module.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, API_BASE_URL } = useAuth();

  const [course, setCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      // Build headers — include token only if available (supports public access)
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [detailRes, allRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/courses/${id}`, { headers }),
        fetch(`${API_BASE_URL}/api/courses`, { headers })
      ]);

      if (detailRes.ok) {
        const detailData = await detailRes.json();
        if (detailData.status === 'success') {
          setCourse(detailData.data);
        }
      }

      if (allRes.ok) {
        const allData = await allRes.json();
        if (allData.status === 'success') {
          setAllCourses(allData.data.courses || []);
        }
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id, token, API_BASE_URL]);

  // Buy Now handler — requires auth; redirects to login preserving return path
  const handleBuyNow = async () => {
    if (!user) {
      // Redirect to login; after login the user will be sent back to this course detail
      navigate('/login', { state: { from: location } });
      return;
    }
    if (isEnrolling) return;
    setIsEnrolling(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: parseInt(id) })
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        navigate(`/watch/${id}`);
      } else {
        alert(data.message || 'Enrollment failed.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Network error. Failed to enroll.');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Dynamic Course properties mapping
  const courseDetails = useMemo(() => {
    if (!course) return null;

    let image = course.thumbnail;
    if (image === 'grad-violet') {
      image = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800";
    } else if (image === 'grad-blue') {
      image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800";
    } else if (!image || !image.startsWith('http')) {
      image = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
    }

    let instructorAvatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100";
    let instructorRole = "Academy Instructor";
    let instructorBio = "Robert Sterling is a high-ticket commercial real estate veteran with over 20 years of experience structuring syndications, underwriting institutional assets, and coaching top brokers.";
    if (course.mentor_name?.toLowerCase().includes('sarah')) {
      instructorRole = "Behavioral Sales Coach";
      instructorAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100";
      instructorBio = "Sarah Jenkins specializes in consumer psychology, behavioral negotiation, and high-conversion client communication models tailored to residential brokers.";
    } else if (course.mentor_name?.toLowerCase().includes('elena')) {
      instructorRole = "Ultra-Luxury Broker";
      instructorAvatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100";
      instructorBio = "Elena Rodriguez operates in the top 1% of luxury coastal brokerage markets. She designs private branding blueprints for high-net-worth listing acquisitions.";
    }

    // Determine custom outcomes based on course title
    let outcomes = [
      "Establish a dominant local market presence and build a consistent client pipeline.",
      "Master high-impact closing scripts and objection handling techniques.",
      "Leverage digital tools and database automation to scale your lead generation.",
      "Navigate complex contracts, disclosures, and fiduciary responsibilities.",
      "Implement structured follow-up systems to turn past clients into repeat business."
    ];
    if (course.title?.toLowerCase().includes('underwriting') || course.title?.toLowerCase().includes('valuation') || course.title?.toLowerCase().includes('financial')) {
      outcomes = [
        "Build comprehensive multi-family and commercial underwriting models from scratch.",
        "Analyze internal rates of return (IRR), cap rates, equity multiples, and debt service coverage ratios (DSCR).",
        "Structure joint venture waterfalls and GP/LP splits for syndicated deals.",
        "Perform market stress-testing and vacancy risk analysis on real assets.",
        "Present financial underwriting packages to commercial lenders and equity partners."
      ];
    } else if (course.title?.toLowerCase().includes('luxury') || course.title?.toLowerCase().includes('high-ticket')) {
      outcomes = [
        "Identify and engage High-Net-Worth Individuals (HNWIs) in the luxury real estate sector.",
        "Master the psychology of luxury positioning and off-market listing presentations.",
        "Develop high-end marketing campaigns using storytelling and lifestyle branding.",
        "Negotiate multi-million dollar transactions with institutional and private buyers.",
        "Build a sustainable network of wealth managers, family offices, and luxury brokers."
      ];
    }

    let requirements = [
      "Access to a computer or smartphone with an active internet connection.",
      "Basic communication skills and enthusiasm for client service.",
      "No prior real estate experience is strictly required."
    ];
    if (course.title?.toLowerCase().includes('underwriting') || course.title?.toLowerCase().includes('valuation')) {
      requirements = [
        "Comfort with basic arithmetic and spreadsheet operations (Excel/Sheets).",
        "Access to a computer to review underwriting models.",
        "Basic understanding of commercial leasing is helpful but not mandatory."
      ];
    }

    return {
      ...course,
      image,
      instructorAvatar,
      instructorRole,
      instructorBio,
      outcomes,
      requirements,
      lessons: course.modules ? course.modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) : 0,
      duration: course.duration || '12 Hours',
      category: course.category_name || 'General'
    };
  }, [course]);

  // Related courses selection
  const relatedCoursesList = useMemo(() => {
    if (!course || !allCourses.length) return [];
    return allCourses
      .filter(c => c.id !== course.id && c.status === 'Published')
      .map(c => {
        let img = c.thumbnail;
        if (img === 'grad-violet') img = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800";
        else if (img === 'grad-blue') img = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800";
        else if (!img || !img.startsWith('http')) img = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
        return { ...c, image: img };
      })
      .sort((a, b) => {
        // Prioritize same category
        if (a.category_id === course.category_id && b.category_id !== course.category_id) return -1;
        if (b.category_id === course.category_id && a.category_id !== course.category_id) return 1;
        return 0;
      })
      .slice(0, 3);
  }, [course, allCourses]);

  const faqs = [
    {
      q: "Is this course self-paced?",
      a: "Yes, all lectures and syllabus guides are fully pre-recorded and accessible 24/7. You can study at your own pace and revisit modules whenever needed."
    },
    {
      q: "Will I receive a certificate upon completion?",
      a: "Absolutely. Once all modules are marked 100% complete and assignments are passed, you can download your official BG Realty Training Academy Certificate."
    },
    {
      q: "Are the underwriting templates downloadable?",
      a: "Yes, all spreadsheet models, checklist PDFs, and underwriting files are fully downloadable from the 'Resources' tab in the course watch space once enrolled."
    },
    {
      q: "Can I ask questions if I get stuck?",
      a: "Yes, each course workspace includes a dedicated community feed where you can interact with fellow elite students and receive periodic guidance from your instructors."
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="h-6 w-32 bg-[#16161a] rounded-lg"></div>
        <div className="h-[320px] bg-[#16161a] rounded-3xl w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-2/3 bg-[#16161a] rounded-lg"></div>
            <div className="h-4 w-full bg-[#16161a] rounded-lg"></div>
            <div className="h-4 w-5/6 bg-[#16161a] rounded-lg"></div>
          </div>
          <div className="space-y-6">
            <div className="h-[240px] bg-[#16161a] rounded-3xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-xl font-black text-white">Course Not Found</h3>
        <p className="text-xs text-slate-500 font-bold mt-2">The blueprint syllabus was not found or is currently archived.</p>
        <Link to="/courses" className="mt-6 inline-block">
          <Button variant="outline" className="text-xs uppercase font-black tracking-wider gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = courseDetails.is_enrolled;

  // Back link depends on context: if user is logged in show dashboard-style back, else catalog
  const backTo = user ? '/courses' : '/courses';

  return (
    <div className="space-y-8 text-left relative pb-20">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link to="/courses">
          <button className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Course Catalog</span>
          </button>
        </Link>
        <Badge variant={isEnrolled ? 'success' : 'premium'}>
          {isEnrolled ? 'Enrolled' : parseFloat(courseDetails.price) > 0 ? `₹${parseFloat(courseDetails.price).toLocaleString('en-IN')}` : 'Free'}
        </Badge>
      </div>

      {/* Cinematic Banner / Hero Area */}
      <div className="relative rounded-3xl overflow-hidden border border-premium-border bg-[#0b0b0d] shadow-2xl h-[280px] sm:h-[360px] flex items-end">
        <img 
          src={courseDetails.image} 
          alt={courseDetails.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
        <div className="absolute top-6 left-6 z-10">
          <span className="bg-premium-accent/20 text-premium-accent border border-premium-accent/30 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
            {courseDetails.category}
          </span>
        </div>
        
        <div className="relative p-6 sm:p-10 z-10 w-full max-w-4xl space-y-4">
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            {courseDetails.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-premium-accent" />
              <span>{courseDetails.duration} Course Content</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-premium-accent" />
              <span>{courseDetails.lessons} Lectures</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-premium-accent" />
              <span>{courseDetails.mentor_name || 'Robert Sterling'}</span>
            </div>
            {/* Price shown in hero */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-black text-[#D4AF37] text-sm">
                {parseFloat(courseDetails.price) > 0
                  ? `₹${parseFloat(courseDetails.price).toLocaleString('en-IN')}`
                  : 'Free'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Content (2/3), Right Pricing Sidebar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description Section */}
          <GlassCard className="p-8 space-y-4">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-premium-accent" />
              Course Syllabus Blueprint
            </h2>
            <Divider />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-line pt-2">
              {courseDetails.description}
            </p>
          </GlassCard>

          {/* Learning Outcomes */}
          <GlassCard className="p-8 space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-premium-accent" />
              What You Will Master
            </h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {courseDetails.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-premium-emerald/10 p-1 border border-premium-emerald/20 text-premium-emerald shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    {outcome}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Curriculum Accordion */}
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 pl-2">
              <Video className="w-5 h-5 text-premium-accent" />
              Course Curriculum
            </h2>
            {courseDetails.modules?.length > 0 ? (
              <SyllabusAccordion modules={courseDetails.modules} />
            ) : (
              <GlassCard className="p-6 text-center">
                <p className="text-xs text-slate-500 font-bold italic">No syllabus modules defined for this course yet.</p>
              </GlassCard>
            )}
          </div>

          {/* Requirements Section */}
          <GlassCard className="p-8 space-y-4">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-premium-accent" />
              Course Pre-requisites
            </h2>
            <Divider />
            <div className="space-y-3 pt-2">
              {courseDetails.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-premium-accent"></div>
                  <p className="text-xs text-slate-300 font-semibold">{req}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* FAQ Accordion */}
          <GlassCard className="p-8 space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-premium-accent" />
              Frequently Asked Questions
            </h2>
            <Divider />
            <div className="space-y-4 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border-b border-[#1a1a1c] pb-4 last:border-0 last:pb-0">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-white hover:text-premium-accent transition-colors py-2 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-2 pl-1">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Pricing & CTA Card */}
          <GlassCard className="p-6 border-premium-accent/20 bg-gradient-gold-subtle relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-premium-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-black tracking-widest text-premium-accent">Investment</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {parseFloat(courseDetails.price) > 0 ? `$${parseFloat(courseDetails.price).toFixed(2)}` : 'Free Tier'}
                  </span>
                  {parseFloat(courseDetails.price) > 0 && (
                    <span className="text-xs text-slate-500 font-bold line-through">$299.00</span>
                  )}
                </div>
              </div>

              <Divider />

              {/* Course quick stats list */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-500">Access Duration</span>
                  <span className="text-white">Lifetime Access</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-500">Resource Assets</span>
                  <span className="text-white">Spreadsheets & PDFs</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-500">Certification Status</span>
                  <span className="text-white">Eligible</span>
                </div>
              </div>

              {isEnrolled ? (
                <Link to={`/watch/${courseDetails.id}`} className="block">
                  <Button className="w-full h-12 uppercase tracking-wider font-extrabold gap-2">
                    <span>Resume Course</span>
                    <Play className="w-4 h-4 fill-current text-black" />
                  </Button>
                </Link>
              ) : (
                <Button
                  id="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={isEnrolling}
                  className="w-full h-12 uppercase tracking-wider font-extrabold gap-2 bg-gradient-premium shadow-gold-sm flex items-center justify-center"
                >
                  <span>
                    {isEnrolling ? 'Processing...' : !user ? 'Login to Buy Now' : 'Buy Now'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Button>
              )}
            </div>
          </GlassCard>

          {/* Instructor Bio Card */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-xs font-black uppercase text-premium-accent tracking-widest">Mentor Blueprint</h3>
            <Divider />
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#1a1a1c] shrink-0">
                <img 
                  src={courseDetails.instructorAvatar} 
                  alt={courseDetails.mentor_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-black text-white leading-none">{courseDetails.mentor_name || 'Robert Sterling'}</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{courseDetails.instructorRole}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {courseDetails.instructorBio}
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Related Courses Section */}
      {relatedCoursesList.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-[#1a1a1c]">
          <h2 className="text-lg font-black text-white uppercase tracking-wider pl-2">
            Related Syllabus Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCoursesList.map((c) => (
              <GlassCard 
                key={c.id} 
                className="overflow-hidden hover:border-premium-accent/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-[#0b0b0d]"
              >
                <div className="h-32 overflow-hidden bg-[#111114] relative">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent"></div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-slate-950/80 backdrop-blur-md text-white border border-white/10 px-2 py-0.5 rounded-md text-[8px] font-black tracking-wider uppercase">
                      {c.category_name || 'General'}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-left">
                    <h3 className="font-black text-sm text-white line-clamp-1 group-hover:text-premium-accent transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1c]/60">
                    <span className="text-[11px] font-black text-white">
                      {parseFloat(c.price) > 0 ? `$${parseFloat(c.price).toFixed(2)}` : 'Free'}
                    </span>
                    <Link to={`/courses/${c.id}`} className="text-[10px] uppercase font-black tracking-wider text-premium-accent hover:text-white flex items-center gap-1">
                      <span>Blueprint</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
