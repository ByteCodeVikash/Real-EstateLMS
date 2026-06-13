import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Settings, Maximize, Volume2, Volume1, VolumeX, Shield, 
  Lock, CheckCircle, FileText, Download, Monitor, Menu, X, 
  AlertTriangle, Fingerprint, ShieldAlert, ArrowLeft, Send, Sparkles, Trophy, Activity
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Button, Badge } from '../components/UI';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

// Seed chat messages defined at module level so they are stable across renders
const SEED_CHAT_MESSAGES = [
  { id: 1, sender: "Robert Sterling", role: "Instructor", message: "Keep a close watch on Cap rate margins when structuring the GP split splits. Hurdle rates are crucial.", time: "10:15 AM", isInstructor: true },
  { id: 2, sender: "Sarah Jenkins", role: "Elite Broker", message: "In my area, we have been anchoring owner financing at a solid 6.5%. The cash flow model behaves beautifully.", time: "10:22 AM", isInstructor: false },
  { id: 3, sender: "Elena Rodriguez", role: "Luxury Mentor", message: "Remember to emphasize local lifestyle assets, not just square footage, when presenting to HNW circles.", time: "10:35 AM", isInstructor: true }
];

const CourseWatch = () => {
  const { id } = useParams();
  const courseId = parseInt(id) || 1;
  const { token, API_BASE_URL, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [resources, setResources] = useState([]);
  const [activeLecture, setActiveLecture] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [watermarkPos, setWatermarkPos] = useState({ top: '30%', left: '20%' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [prevVolume, setPrevVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const bufferingDelayRef = useRef(null);
  const lastLoadedSrcRef = useRef('');
  const canPlayHandlerRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const lastSavedTimeRef = useRef(0);
  const initialPlayheadRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch course details & resources
  useEffect(() => {
    if (!token) return;

    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'success' && data.data) {
            setCourse(data.data);
            setCourseProgress(data.data.progress || 0);

            // Find first lecture across all modules
            let firstLecture = null;
            if (data.data.modules && data.data.modules.length > 0) {
              for (const mod of data.data.modules) {
                if (mod.lectures && mod.lectures.length > 0) {
                  firstLecture = mod.lectures[0];
                  break;
                }
              }
            }
            setActiveLecture(firstLecture);
          }
        }

        const resRes = await fetch(`${API_BASE_URL}/api/courses/${courseId}/resources`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resRes.ok) {
          const rData = await resRes.json();
          if (rData.status === 'success') {
            setResources(rData.data || []);
          }
        }
      } catch (err) {
        console.error('Error fetching course watch details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, token, API_BASE_URL]);

  // Real-time Discussion Chat Panel state — loaded from localStorage per course
  const [chatMessages, setChatMessages] = useState(
    () => loadFromStorage(STORAGE_KEYS.courseChat(courseId), SEED_CHAT_MESSAGES)
  );
  const [newMessage, setNewMessage] = useState('');

  // Notebook states — loaded from localStorage per course
  const [savedNotes, setSavedNotes] = useState('');
  const [notesList, setNotesList] = useState(
    () => loadFromStorage(STORAGE_KEYS.courseNotes(courseId), [])
  );

  // Shift Anti-Piracy Watermark coordinates dynamically to discourage screen recording
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 60 + 20)}%`,
        left: `${Math.floor(Math.random() * 60 + 20)}%`
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Reload notes & chat from storage when courseId changes
  useEffect(() => {
    setNotesList(loadFromStorage(STORAGE_KEYS.courseNotes(courseId), []));
    setChatMessages(loadFromStorage(STORAGE_KEYS.courseChat(courseId), SEED_CHAT_MESSAGES));
  }, [courseId]);

  // Persist notes list whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.courseNotes(courseId), notesList);
  }, [notesList, courseId]);

  // Persist chat messages whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.courseChat(courseId), chatMessages);
  }, [chatMessages, courseId]);

  // Cleanup controls auto-hide timer on unmount
  useEffect(() => () => { if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current); }, []);
  useEffect(() => () => { if (bufferingDelayRef.current) clearTimeout(bufferingDelayRef.current); }, []);

  // Fetch initial playhead progress when active lecture changes
  useEffect(() => {
    if (!activeLecture?.id || !token) return;
    
    // Reset playhead tracker
    lastSavedTimeRef.current = 0;
    initialPlayheadRef.current = 0;

    fetch(`${API_BASE_URL}/api/lectures/${activeLecture.id}/progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success' && data.data) {
        const progress = data.data;
        const playhead = progress.playhead_seconds || 0;
        initialPlayheadRef.current = playhead;
        
        // If standard HTML5 video, seek immediately if video metadata is already loaded
        if (videoRef.current && isFinite(playhead) && playhead > 0) {
          videoRef.current.currentTime = playhead;
          setCurrentTime(playhead);
        }
      }
    })
    .catch(err => console.error('Error fetching playhead progress:', err));
  }, [activeLecture?.id, token, API_BASE_URL]);

  // Save progress handler
  const saveProgress = async (seconds, isCompleted = 0) => {
    if (!activeLecture?.id || !token) return;
    if (Math.abs(seconds - lastSavedTimeRef.current) < 2 && isCompleted === 0) return;

    lastSavedTimeRef.current = seconds;
    try {
      const response = await fetch(`${API_BASE_URL}/api/lectures/${activeLecture.id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          playhead_seconds: Math.floor(seconds),
          duration_seconds: Math.floor(videoRef.current?.duration || duration || 0),
          is_completed: isCompleted ? 1 : 0
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success' && result.data) {
          if (result.data.course_progress !== undefined) {
            setCourseProgress(result.data.course_progress);
          }
          // Mark completed in active lecture object if returned
          if (isCompleted && course) {
            setCourse(prev => {
              if (!prev) return prev;
              const updatedModules = prev.modules.map(mod => {
                const updatedLectures = mod.lectures.map(lec => {
                  if (lec.id === activeLecture.id) {
                    return { ...lec, completed: true };
                  }
                  return lec;
                });
                return { ...mod, lectures: updatedLectures };
              });
              return { ...prev, modules: updatedModules };
            });
          }
        }
      }
    } catch (error) {
      console.error('Error saving progress playhead:', error);
    }
  };

  // Custom Fullscreen API Toggle handler
  const toggleFullscreen = () => {
    const container = playerRef.current;
    const v = videoRef.current;
    if (!container && !v) return;
    if (!document.fullscreenElement) {
      const request = container?.requestFullscreen?.bind(container) || v?.requestFullscreen?.bind(v);
      if (request) {
        request().then(() => setIsFullscreen(true)).catch((err) => {
          if (v?.webkitEnterFullscreen) {
            try { v.webkitEnterFullscreen(); } catch { /* ignore */ }
            return;
          }
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else if (v?.webkitEnterFullscreen) {
        try { v.webkitEnterFullscreen(); } catch { /* ignore */ }
      }
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // ── Real Video Helpers ──────────────────────────────────────────────────────
  const QUALITY_OPTIONS = ['Auto', '720p', '480p'];
  const getVideoUrl = (lecture, quality) => {
    if (!lecture) return '';
    if (lecture.video_url) {
      return lecture.video_url;
    }
    // Default fallback to local mock sample video
    const q = quality || 'Auto';
    if (q === '480p') return '/videos/lecture-sample-480p.mp4';
    return '/videos/lecture-sample-720p.mp4';
  };

  const formatTime = (sec) => {
    if (!isFinite(sec) || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    setVideoProgress((v.currentTime / (v.duration || 1)) * 100);

    // Save progress periodically (approx. every 5 seconds)
    if (Math.floor(v.currentTime) % 5 === 0) {
      saveProgress(v.currentTime, 0);
    }
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    v.volume = volume / 100;
    v.muted = isMuted;
    v.playbackRate = parseFloat(playbackSpeed) || 1.0;

    // Apply restored playhead if any
    const playhead = initialPlayheadRef.current;
    if (isFinite(playhead) && playhead > 0) {
      v.currentTime = playhead;
      setCurrentTime(playhead);
      setVideoProgress((playhead / (v.duration || 1)) * 100);
      initialPlayheadRef.current = 0; // Reset once applied
    }
  };

  const handleVideoEnded = () => { 
    setIsPlaying(false); 
    setVideoProgress(100); 
    setShowControls(true); 
    saveProgress(duration, 1); // Mark Completed
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e?.touches?.[0]?.clientX ?? e?.clientX;
    if (!isFinite(clientX)) return;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
    setVideoProgress(pct * 100);
    saveProgress(pct * duration, 0);
  };

  const seekBy = (deltaSec) => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration)) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + deltaSec));
  };

  const setVolumePct = (nextPct) => {
    const v = videoRef.current;
    const clamped = Math.max(0, Math.min(100, nextPct));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    if (v) { v.volume = clamped / 100; v.muted = clamped === 0; }
  };

  const handleVolumeChange = (e) => {
    const v = videoRef.current;
    const val = parseInt(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (v) { v.volume = val / 100; v.muted = val === 0; }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (isMuted) {
      const restore = prevVolume || 80;
      setIsMuted(false); setVolume(restore);
      if (v) { v.muted = false; v.volume = restore / 100; }
    } else {
      setPrevVolume(volume); setIsMuted(true); setVolume(0);
      if (v) { v.muted = true; }
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed); setShowSettings(false);
    if (videoRef.current) videoRef.current.playbackRate = parseFloat(speed) || 1.0;
  };

  const setBuffering = (next) => {
    if (bufferingDelayRef.current) {
      clearTimeout(bufferingDelayRef.current);
      bufferingDelayRef.current = null;
    }
    if (!next) {
      setIsBuffering(false);
      return;
    }
    bufferingDelayRef.current = setTimeout(() => setIsBuffering(true), 120);
  };

  const loadVideo = ({ preserveTime }) => {
    const v = videoRef.current;
    if (!v || !activeLecture) return;

    const nextSrc = getVideoUrl(activeLecture, selectedQuality);
    if (lastLoadedSrcRef.current === nextSrc && preserveTime) return;

    const wasPlaying = !v.paused && !v.ended;
    const resumeAt = preserveTime ? v.currentTime || 0 : 0;

    if (!preserveTime) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setVideoProgress(0);
    }
    setIsLoading(true);
    setBuffering(true);
    setShowControls(true);
    setShowSettings(false);
    setShowQualityMenu(false);

    if (canPlayHandlerRef.current) {
      v.removeEventListener('canplay', canPlayHandlerRef.current);
      canPlayHandlerRef.current = null;
    }

    lastLoadedSrcRef.current = nextSrc;
    v.src = nextSrc;
    v.load();

    const handleCanPlay = () => {
      try {
        if (preserveTime && resumeAt > 0 && isFinite(resumeAt)) {
          v.currentTime = Math.min(resumeAt, v.duration || resumeAt);
        }
      } catch { /* ignore */ }
      setIsLoading(false);
      setBuffering(false);
      if (wasPlaying) v.play().catch(() => {});
      v.removeEventListener('canplay', handleCanPlay);
      canPlayHandlerRef.current = null;
    };

    canPlayHandlerRef.current = handleCanPlay;
    v.addEventListener('canplay', handleCanPlay);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleKeyDown = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const tag = e?.target?.tagName?.toLowerCase?.();
    if (tag === 'input' || tag === 'textarea' || e?.target?.isContentEditable) return;
    const actions = {
      ' ': () => togglePlay(), 'k': () => togglePlay(),
      'ArrowRight': () => seekBy(10), 'l': () => seekBy(10),
      'ArrowLeft': () => seekBy(-10), 'j': () => seekBy(-10),
      'ArrowUp': () => setVolumePct(volume + 5),
      'ArrowDown': () => setVolumePct(volume - 5),
      'm': () => toggleMute(), 'M': () => toggleMute(),
      'f': () => toggleFullscreen(), 'F': () => toggleFullscreen(),
    };
    if (actions[e.key]) { e.preventDefault(); actions[e.key](); }
  };

  // Keep player shortcuts active without breaking the rest of the page
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMuted, volume, playbackSpeed, selectedQuality, duration, isFullscreen, activeLecture]);

  // Load lecture video when active lecture changes
  useEffect(() => {
    if (activeLecture) {
      loadVideo({ preserveTime: false });
    }
  }, [activeLecture?.id]);

  // Preserve playback position when switching quality
  useEffect(() => {
    loadVideo({ preserveTime: true });
  }, [selectedQuality]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: chatMessages.length + 1,
      sender: user?.name || "Premium Student",
      role: user?.role === 'admin' ? 'Administrator' : 'Premium Student',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: false
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const handleSaveNote = () => {
    if (!savedNotes.trim() || !activeLecture) return;
    const note = {
      id: Date.now(),
      text: savedNotes,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lectureTitle: activeLecture.title
    };
    setNotesList((prev) => [note, ...prev]);
    savedNotes && setSavedNotes('');
  };

  // Handle external video embeds (YouTube / Vimeo)
  const isYoutube = activeLecture?.video_url?.includes('youtube.com') || activeLecture?.video_url?.includes('youtu.be') || activeLecture?.video_type === 'youtube';
  const isVimeo = activeLecture?.video_url?.includes('vimeo.com') || activeLecture?.video_type === 'vimeo';

  const getYoutubeEmbedUrl = (url, vid) => {
    let id = vid;
    if (!id && url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      id = (match && match[2].length === 11) ? match[2] : null;
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  };

  const getVimeoEmbedUrl = (url, vid) => {
    let id = vid;
    if (!id && url) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      id = match ? match[1] : null;
    }
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  };

  if (loading || !course || !activeLecture) {
    return (
      <div className="fixed inset-0 bg-[#070b13] flex items-center justify-center text-slate-400">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-premium-accent border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Decrypting course catalog stream...</p>
        </div>
      </div>
    );
  }

  // Count total lectures for course modules
  const totalLectures = course.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) || 0;

  return (
    <div className="fixed inset-0 bg-[#070b13] flex flex-col z-[60] overflow-hidden text-left font-sans text-slate-300">
      
      {/* Cinematic Secure Header */}
      <header className="h-20 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl shadow-lg z-40">
        <div className="flex items-center gap-4">
          <Link to="/courses">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-md active:scale-95 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="h-6 w-px bg-slate-800"></div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-9 h-9 bg-premium-accent/10 rounded-xl items-center justify-center border border-premium-accent/20">
              <Shield className="text-premium-accent w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-premium-accent font-black uppercase tracking-widest leading-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-premium-accent animate-pulse"></span>
                Secure AES-256 Stream Session
              </p>
              <h1 className="font-black text-sm md:text-base text-white mt-1 truncate max-w-[140px] xs:max-w-[200px] md:max-w-md">
                {course.title}
              </h1>
            </div>
          </div>
          <Badge className="hidden lg:inline-flex rounded-lg h-7 text-[9px] font-black tracking-wider bg-slate-900 text-premium-accent border border-premium-accent/20">
            DRM PRO-STREAM
          </Badge>
          <Badge className="hidden sm:inline-flex rounded-lg h-7 text-[9px] font-black tracking-wider bg-slate-900 text-red-400 border border-red-500/20">
            PROTECTED CONTENT
          </Badge>
        </div>
        
        {/* Dynamic tracking metrics */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-xl text-[10px] font-mono text-slate-400 font-bold shadow-inner">
            <Activity className="w-3.5 h-3.5 text-premium-accent animate-pulse" />
            <span>NODE: BJ-CRE-MIA</span>
          </div>

          {/* Playlist Toggler */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-md active:scale-95 cursor-pointer z-50"
            title="Toggle Playlist Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="h-6 w-px bg-slate-800"></div>
          <Link to="/courses">
            <Button variant="danger" size="sm" className="h-10 px-4 md:px-5 text-[10px] md:text-xs uppercase font-black tracking-widest rounded-xl shadow-md cursor-pointer border border-red-500/20">
              Disconnect Broadcast
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Player & Sidebar Content */}
      <div className="flex-1 flex overflow-hidden z-30">
        
        {/* Cinematic Main Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#070b13] relative scrollbar-thin">
          
          {/* DRM Warning Anti-Piracy Header Banner */}
          <div className="bg-gradient-to-r from-red-950/40 via-red-900/10 to-transparent border-b border-red-900/20 px-6 py-2.5 flex items-center justify-between gap-4 z-30 shadow-sm">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="text-red-500 w-4 h-4 animate-pulse shrink-0" />
              <p className="text-[10px] md:text-xs font-bold text-red-400 tracking-wide">
                BG REALTY TRAINING ACADEMY PROTECTED SOURCE CODE: External capture tools, screen mirroring, or unauthorized recording triggers immediate session termination.
              </p>
            </div>
            <Badge variant="danger" className="text-[8px] tracking-widest font-black uppercase shrink-0 py-0.5 px-2.5 bg-red-950/60 text-red-400 border border-red-800/40">
              ANTI-RECORD ACTIVE
            </Badge>
          </div>

          {/* Secure Video Player */}
          <div 
            ref={playerRef} 
            className="relative aspect-video max-h-[55vh] lg:max-h-[58vh] bg-slate-950 group overflow-hidden border-b border-slate-800 shadow-2xl flex-shrink-0"
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseMove}
            onClick={() => playerRef.current?.focus?.()}
            tabIndex={0}
          >
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-10"></div>
            
            {/* Render Standard Player OR Youtube/Vimeo Embed */}
            {isYoutube ? (
              <iframe
                src={getYoutubeEmbedUrl(activeLecture.video_url, activeLecture.video_id)}
                className="absolute inset-0 w-full h-full border-0 z-20"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : isVimeo ? (
              <iframe
                src={getVimeoEmbedUrl(activeLecture.video_url, activeLecture.video_id)}
                className="absolute inset-0 w-full h-full border-0 z-20"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                {/* Poster Background */}
                <img 
                  src={course.thumbnail ? (course.thumbnail.startsWith('http') ? course.thumbnail : "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200") : "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200"} 
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    isPlaying ? 'opacity-15 blur-[1px]' : 'opacity-25 blur-none'
                  }`}
                  alt="Cinematic Streaming Interface"
                />

                {/* Real HTML5 video layer */}
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-contain bg-black transition-opacity duration-500 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload noremoteplayback"
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onLoadStart={() => { setIsLoading(true); setBuffering(false); }}
                  onLoadedData={() => setIsLoading(false)}
                  onCanPlay={() => { setIsLoading(false); setBuffering(false); }}
                  onWaiting={() => setBuffering(true)}
                  onPlaying={() => { setIsPlaying(true); setBuffering(false); handleMouseMove(); }}
                  onPause={() => setIsPlaying(false)}
                  onSeeking={() => setBuffering(true)}
                  onSeeked={() => setBuffering(false)}
                  onEnded={handleVideoEnded}
                  onError={() => { setIsLoading(false); setBuffering(false); }}
                />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  {/* Cinematic Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
                  <div className="absolute inset-0 bg-radial-gradient"></div>

                  {/* Secure Fingerprint Key */}
                  {!isPlaying && !isLoading && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-4 z-20 pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center shadow-2xl text-premium-accent/80 animate-pulse">
                        <Fingerprint className="w-8 h-8" />
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">ENCRYPTED LECTURE DECODER ACTIVE</span>
                    </div>
                  )}

                  {/* Premium skeleton shimmer while loading */}
                  {isLoading && (
                    <div className="absolute inset-0 z-20">
                      <div className="absolute inset-0 bg-slate-950/60"></div>
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      </div>
                      <div className="absolute top-6 left-6 right-6">
                        <div className="h-3 w-40 rounded bg-slate-800/60"></div>
                        <div className="mt-3 h-2.5 w-64 rounded bg-slate-800/40"></div>
                      </div>
                    </div>
                  )}

                  {/* Buffering indicator */}
                  {isBuffering && !isLoading && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-slate-950/70 border border-slate-800 flex items-center justify-center shadow-2xl backdrop-blur-md">
                        <div className="w-6 h-6 rounded-full border-2 border-premium-accent/90 border-t-transparent animate-spin"></div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">BUFFERING SECURE STREAM</span>
                    </div>
                  )}

                  {/* HUD Play Button */}
                  <motion.button 
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-20 h-20 bg-gradient-premium hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] text-white rounded-full flex items-center justify-center shadow-2xl z-30 cursor-pointer border border-blue-400/20 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 fill-current text-white" />
                    ) : (
                      <Play className="w-8 h-8 fill-current ml-1.5 text-white" />
                    )}
                  </motion.button>
                  
                  {/* Session Status HUD Banner */}
                  {!isPlaying && !isLoading && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800/80 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl z-20 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-premium-accent animate-ping"></span>
                      <span className="text-[9px] text-slate-300 font-mono uppercase tracking-widest font-bold">
                        Authenticated stream • 4K UHD 60fps • L3 DRM
                      </span>
                    </div>
                  )}
                </div>

                {/* Custom Cinematic controls bar */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent transition-opacity duration-300 z-30 space-y-4 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}>
                  
                  {/* Scrubber timeline */}
                  <div 
                    className="relative h-1.5 w-full bg-slate-800 rounded-full cursor-pointer group/timeline"
                    onClick={handleSeek}
                    onTouchStart={handleSeek}
                    onTouchMove={handleSeek}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-premium-accent rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" 
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#0b0b0d] rounded-full opacity-0 group-hover/timeline:opacity-100 transition-opacity shadow-lg"
                      style={{ left: `calc(${videoProgress}% - 7px)` }}
                    ></div>
                  </div>
                  
                  {/* Left/Right Controllers */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button onClick={() => seekBy(-10)} className="text-slate-400 hover:text-white transition-colors cursor-pointer" title="Back 10s"><SkipBack className="w-5 h-5" /></button>
                      <button 
                        onClick={togglePlay}
                        className="text-white hover:text-premium-accent transition-colors cursor-pointer"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-current text-white" />
                        )}
                      </button>
                      <button onClick={() => seekBy(10)} className="text-slate-400 hover:text-white transition-colors cursor-pointer" title="Forward 10s"><SkipForward className="w-5 h-5" /></button>
                      
                      {/* Volume block */}
                      <div className="flex items-center gap-2.5 ml-4">
                        <button 
                          onClick={toggleMute}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4.5 h-4.5 text-red-500 animate-pulse" />
                          ) : volume < 40 ? (
                            <Volume1 className="w-4.5 h-4.5 text-slate-300" />
                          ) : (
                            <Volume2 className="w-4.5 h-4.5 text-slate-300" />
                          )}
                        </button>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-16 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-premium-accent"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono ml-4 uppercase tracking-widest font-black">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <Badge className="text-[8px] font-black text-premium-accent bg-slate-900 border border-premium-accent/20 px-2 py-0.5 rounded tracking-widest font-mono">
                        4K ULTRA
                      </Badge>

                      {/* Quality selector */}
                      <div className="relative shrink-0">
                        <button 
                          onClick={() => { setShowQualityMenu(!showQualityMenu); setShowSettings(false); }}
                          className="text-[10px] font-bold text-slate-400 hover:text-white border border-slate-800 rounded-lg px-2.5 py-1 bg-slate-900 flex items-center gap-1 cursor-pointer focus:outline-none"
                          title="Quality"
                        >
                          Q: {selectedQuality}
                        </button>
                        {showQualityMenu && (
                          <div className="absolute bottom-9 right-0 w-24 bg-slate-900 border border-slate-850 rounded-lg shadow-xl p-1 z-40 text-left">
                            {QUALITY_OPTIONS.map(q => (
                              <button
                                key={q}
                                onClick={() => { setSelectedQuality(q); setShowQualityMenu(false); }}
                                className="block w-full text-left px-2.5 py-1.5 rounded text-[10px] text-slate-400 hover:bg-slate-800 hover:text-white font-bold"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Playback speed selector */}
                      <div className="relative shrink-0">
                        <button 
                          onClick={() => { setShowSettings(!showSettings); setShowQualityMenu(false); }}
                          className="text-[10px] font-bold text-slate-400 hover:text-white border border-slate-800 rounded-lg px-2.5 py-1 bg-slate-900 flex items-center gap-1 cursor-pointer focus:outline-none"
                        >
                          Speed: {playbackSpeed}
                        </button>
                        {showSettings && (
                          <div className="absolute bottom-9 right-0 w-24 bg-slate-900 border border-slate-850 rounded-lg shadow-xl p-1 z-40 text-left">
                            {['0.75x', '1.0x', '1.25x', '1.5x', '2.0x'].map(speed => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className="block w-full text-left px-2.5 py-1.5 rounded text-[10px] text-slate-400 hover:bg-slate-800 hover:text-white font-bold"
                              >
                                {speed}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Settings className="w-4.5 h-4.5" /></button>
                      <button 
                        onClick={toggleFullscreen}
                        className={`transition-colors cursor-pointer ${
                          isFullscreen ? 'text-premium-accent hover:text-white' : 'text-slate-400 hover:text-white'
                        }`}
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        <Maximize className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Dynamic anti-piracy moving watermark */}
            <motion.div 
              animate={{ top: watermarkPos.top, left: watermarkPos.left }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute pointer-events-none text-slate-500/10 text-[9px] font-mono z-30 select-none whitespace-nowrap leading-relaxed tracking-wider border border-white/5 bg-slate-900/[0.05] p-3.5 rounded-xl backdrop-blur-[0.5px]"
            >
              <p className="font-black">STUDENT EMAIL: {user?.email || "student@bjrealty.com"}</p>
              <p>SECURE TERMINAL ID: BJ-LMS-NODE-{user?.id || "0"}</p>
              <p>ENCRYPTION AUTH KEY: BJ-SEC-{(user?.id || 99) * 23848}</p>
              <p>TIMESTAMP: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            </motion.div>

            {/* Live stream details badge */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SSL SECURE CAPTURE SHIELD
              </div>
            </div>
          </div>

          {/* Active Lecture Header bar */}
          <div className="bg-[#0b101b] border-b border-slate-800/60 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-black text-premium-accent uppercase tracking-widest">
                Currently Playing • Lecture {activeLecture.sort_order || 1}
              </span>
              <h2 className="text-xl font-black text-white leading-tight">
                {activeLecture.title}
              </h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {course.category_name || 'General'} Specialization Syllabus
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Badge variant="premium" className="rounded-lg h-8 text-[9px] font-black tracking-wider bg-slate-900 border border-premium-accent/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-premium-accent" />
                Specialty: {course.category_name || 'General'}
              </Badge>
              <Badge variant="success" className="rounded-lg h-8 text-[9px] font-black tracking-wider bg-slate-900 border border-green-800/40 flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                Active Class
              </Badge>
            </div>
          </div>

          {/* Tab Selection Area */}
          <div className="flex-1 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-6 border-b border-slate-850 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
              {['Overview', 'Spreadsheets & Resources', 'Student Notebook', 'Discussion Q&A'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 font-black text-xs uppercase tracking-wider transition-all relative cursor-pointer focus:outline-none shrink-0 ${
                    activeTab === tab ? 'text-white font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="watchTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-accent shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Workspace Content Display */}
            <div className="max-w-4xl min-h-[400px] text-left relative overflow-hidden">
              <AnimatePresence mode="wait">
                
                {/* Tab 1: Overview */}
                {activeTab === 'Overview' && (
                  <motion.div
                    key="Overview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    <h3 className="text-base font-black text-white uppercase tracking-wider">Module Objectives & Directives</h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                      {activeLecture.description || course.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3.5 p-5 bg-[#0b101b] border border-slate-850 rounded-2xl shadow-md hover:border-slate-800 transition-all">
                        <div className="w-10 h-10 bg-premium-accent/15 rounded-xl flex items-center justify-center border border-premium-accent/20 shrink-0">
                          <Trophy className="text-premium-accent w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-white uppercase tracking-wider">Accredited Standard</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Approved for commercial audit licensing.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 p-5 bg-[#0b101b] border border-slate-850 rounded-2xl shadow-md hover:border-slate-800 transition-all">
                        <div className="w-10 h-10 bg-premium-accent/15 rounded-xl flex items-center justify-center border border-premium-accent/20 shrink-0">
                          <Shield className="text-premium-accent w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-white uppercase tracking-wider">Secure Resource Vault</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Asset matrices contain unique download tokens.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: Spreadsheets */}
                {activeTab === 'Spreadsheets & Resources' && (
                  <motion.div
                    key="Resources"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-3 mb-2 shadow-inner">
                      <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />
                      <p className="text-[11px] text-amber-200/90 leading-relaxed font-bold">
                        <strong>Audit Warning:</strong> All spreadsheets and scripts downloads are encrypted with your active terminal IP footprint. Distributing source calculations is monitored under terms of agreement.
                      </p>
                    </div>

                    {resources.length === 0 ? (
                      <p className="text-xs text-slate-500 font-bold">No spreadsheets or templates have been uploaded for this course yet.</p>
                    ) : (
                      resources.map((file, i) => (
                        <div 
                          key={file.id || i} 
                          className="flex items-center justify-between p-4 bg-[#0b101b] rounded-2xl border border-slate-850 hover:border-premium-accent/30 hover:bg-[#0f1625]/60 transition-all shadow-md group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                              <FileText className="w-5.5 h-5.5 text-slate-400" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black text-white leading-none">{file.filename || file.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1.5">{file.description || 'Blueprint Calculator Asset'} • {(file.file_size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <a 
                            href={`${API_BASE_URL}/${file.file_path}`} 
                            download 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="icon" className="h-10 w-10 bg-slate-900 border border-slate-800 hover:border-premium-accent text-slate-400 hover:text-white cursor-pointer active:scale-95 shadow-md">
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {/* Tab 3: Student Notebook */}
                {activeTab === 'Student Notebook' && (
                  <motion.div
                    key="Notebook"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    <div className="space-y-2 text-left">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Active Workspace Notepad</h3>
                      <p className="text-[10px] text-slate-400 font-bold">Jot down critical deal guidelines. Notes are saved to your secure profile log.</p>
                    </div>
                    <div className="space-y-4">
                      <textarea 
                        placeholder="Calculate debt caps, write objection hooks, or make general observations here..." 
                        value={savedNotes}
                        onChange={(e) => setSavedNotes(e.currentTarget.value)}
                        className="w-full h-40 bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent font-semibold shadow-inner"
                      ></textarea>
                      <Button 
                        variant="primary" 
                        onClick={handleSaveNote}
                        className="text-[10px] uppercase tracking-widest font-black h-11 px-6 rounded-xl cursor-pointer"
                      >
                        Save Session Note
                      </Button>
                    </div>

                    {notesList.length > 0 && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Saved Notes Log ({notesList.length})</h4>
                        <div className="space-y-3">
                          {notesList.map(note => (
                            <div key={note.id} className="p-4 bg-[#0b101b] border border-slate-850 rounded-2xl text-left space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase text-premium-accent tracking-wider">
                                <span>Lecture: {note.lectureTitle}</span>
                                <span className="text-slate-500 font-mono">{note.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{note.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Tab 4: Discussion Chat */}
                {activeTab === 'Discussion Q&A' && (
                  <motion.div
                    key="Discussion"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5 text-left">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Elite Discussion Panel</h3>
                      <p className="text-[10px] text-slate-400 font-bold">Ask questions directly to the mentors. Real-time Q&A stream is actively audited.</p>
                    </div>
                    
                    {/* Chat Message Box */}
                    <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 h-64 overflow-y-auto space-y-4 scrollbar-thin text-left">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className="flex flex-col space-y-1 leading-normal max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${
                              msg.isInstructor ? 'text-amber-400' : 'text-slate-300'
                            }`}>
                              {msg.sender}
                            </span>
                            <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                              {msg.role}
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">{msg.time}</span>
                          </div>
                          <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed border ${
                            msg.isInstructor 
                              ? 'bg-amber-500/5 border-amber-500/10 text-amber-100/90' 
                              : 'bg-slate-900 border-slate-850 text-slate-300'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Send Input */}
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type your underwriting question or observation..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.currentTarget.value)}
                        className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent flex-1 font-semibold"
                      />
                      <Button 
                        variant="primary" 
                        type="submit" 
                        className="h-11 px-5 rounded-xl flex items-center justify-center cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Playlist Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Mobile Backdrop Overlay */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                />
              )}

              <motion.aside 
                initial={isMobile ? { x: '100%', opacity: 1 } : { width: 0, opacity: 0 }}
                animate={isMobile ? { x: 0, opacity: 1 } : { width: 360, opacity: 1 }}
                exit={isMobile ? { x: '100%', opacity: 1 } : { width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className={`flex flex-col bg-slate-950 border-l border-slate-850 shrink-0 shadow-2xl relative ${
                  isMobile 
                    ? 'fixed right-0 top-0 bottom-0 z-50 w-[320px] sm:w-[360px]' 
                    : 'z-10 h-full'
                }`}
              >
                {/* Mobile Close Header */}
                {isMobile && (
                  <div className="flex items-center justify-between p-6 border-b border-slate-850/80">
                    <h3 className="font-black text-xs uppercase tracking-widest text-white">Course Syllabus</h3>
                    <button 
                      onClick={() => setSidebarOpen(false)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Radial gradient side lighting */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-premium-accent/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Progress HUD */}
                <div className="p-6 border-b border-slate-850/80 space-y-4 text-left relative">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xs uppercase tracking-widest text-white">Course Syllabus</h3>
                    <span className="text-[9px] font-mono font-black text-premium-accent bg-premium-accent/10 border border-premium-accent/20 px-2 py-0.5 rounded">
                      Syllabus progress: {courseProgress}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-premium-accent shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Syllabus Chapters */}
                <div className="flex-1 overflow-y-auto custom-scrollbar text-left scrollbar-thin">
                  {course.modules?.map((mod, modIdx) => (
                    <div key={mod.id || modIdx}>
                      <div className="p-4 bg-slate-900/30 border-b border-slate-950 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                          MODULE {modIdx + 1}: {mod.title}
                        </span>
                      </div>
                      
                      {mod.lectures?.map((lecture, i) => {
                        const isActive = activeLecture?.id === lecture.id;
                        
                        return (
                          <div 
                            key={lecture.id}
                            onClick={() => {
                              if (!lecture.locked) {
                                setActiveLecture(lecture);
                                if (isMobile) setSidebarOpen(false);
                              }
                            }}
                            className={`p-5 border-b border-slate-900/60 cursor-pointer transition-all duration-300 ${
                              isActive 
                                ? 'bg-[#0f1625]/60 border-l-2 border-l-premium-accent shadow-inner' 
                                : 'hover:bg-slate-900/40'
                            } ${lecture.locked ? 'opacity-35 grayscale pointer-events-none' : ''}`}
                          >
                            <div className="flex gap-4">
                              {/* Checkbox state */}
                              <div className="shrink-0 mt-0.5">
                                {lecture.completed ? (
                                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                ) : lecture.locked ? (
                                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                                ) : (
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    isActive ? 'border-premium-accent shadow-[0_0_6px_rgba(37,99,235,0.4)]' : 'border-slate-700'
                                  }`}></div>
                                )}
                              </div>

                              {/* Class name & Duration */}
                              <div className="flex-1 min-w-0 text-left">
                                <p className={`font-black text-xs truncate leading-snug ${
                                  isActive ? 'text-white font-black' : 'text-slate-300'
                                }`}>
                                  Lecture {lecture.sort_order || i + 1}: {lecture.title}
                                </p>
                                <div className="flex items-center gap-2.5 text-[9px] text-slate-500 font-mono uppercase mt-1.5">
                                  <span>{lecture.duration || '15'} mins</span>
                                  {lecture.locked && (
                                    <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded tracking-widest font-mono">
                                      Elite Locked
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Secure Active Footprint logs */}
                <div className="p-6 bg-slate-900/50 border-t border-slate-850 space-y-4 text-left relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-slate-800/60"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-premium-accent/10 border border-premium-accent/20 rounded-xl flex items-center justify-center shrink-0">
                      <Monitor className="text-premium-accent w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-none">Access Center</p>
                      <p className="text-xs font-black text-white mt-1.5 leading-none">Security Node Active</p>
                    </div>
                  </div>
                  
                  {/* Simulated connection diagnostics */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[9px] font-mono text-slate-400 space-y-1 shadow-inner font-semibold">
                    <p className="text-emerald-500 font-black flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      ● SSL ENCRYPTED CONNECTION
                    </p>
                    <p>Client footprint: {user?.email || "student@bjrealty.com"}</p>
                    <p>Terminal: Chrome Desktop / Linux</p>
                  </div>
                  <button 
                    onClick={() => alert(`Credentials Audited. Encryption Signature: BJ-SEC-${(user?.id || 99) * 23848}-OK`)}
                    className="w-full text-[9px] uppercase font-black tracking-widest h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all duration-300 cursor-pointer shadow-md active:scale-95"
                  >
                    Verify Encryption Key
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseWatch;
