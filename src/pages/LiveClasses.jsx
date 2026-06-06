import { useState, useEffect, useMemo } from 'react';
import { Clock, Users, ArrowRight, User, Star, Play, X, Video } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { useNow } from '../hooks/useNow';
import { formatCountdownParts, formatLocalDateTime, formatRelativeStart, getTimerPhase, getUrgencyTone } from '../utils/countdown';
import { useAuth } from '../context/AuthContext';

const LiveClasses = () => {
  const nowMs = useNow();
  const { token, API_BASE_URL } = useAuth();

  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'live' | 'past'

  // Video modal player states
  const [activePlaybackUrl, setActivePlaybackUrl] = useState(null);
  const [activePlaybackTitle, setActivePlaybackTitle] = useState('');

  const fetchWebinars = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/webinars`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setWebinars(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load webinars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, [token]);

  // Transform raw webinars database objects to the component schema
  const parsedSchedule = useMemo(() => {
    return webinars.map(web => {
      const startMs = new Date(web.date_time).getTime();
      // Default duration to 90 minutes
      const lengthMinutes = 90;
      const endMs = startMs + lengthMinutes * 60 * 1000;

      return {
        id: web.id,
        title: web.title,
        host: web.mentor_name || 'Robert Sterling',
        lengthMinutes,
        startAt: new Date(startMs).toISOString(),
        endAt: new Date(endMs).toISOString(),
        isLiveType: web.is_live,
        streamLink: web.stream_link,
        recordingUrl: web.recording_url,
        attendeesLabel: '850+ Seniors',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000'
      };
    });
  }, [webinars]);

  // Determine active hero element (the closest active Live or upcoming class)
  const heroEvent = useMemo(() => {
    if (parsedSchedule.length === 0) return null;
    // Prefer any currently Live class
    const liveNow = parsedSchedule.find(event => {
      const phase = getTimerPhase({ nowMs, startAt: event.startAt, endAt: event.endAt });
      return phase.phase === 'live';
    });
    if (liveNow) return liveNow;

    // Or the next upcoming class
    const upcoming = parsedSchedule.filter(event => {
      const phase = getTimerPhase({ nowMs, startAt: event.startAt, endAt: event.endAt });
      return phase.phase === 'upcoming';
    }).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    if (upcoming.length > 0) return upcoming[0];

    // Fallback to the newest entry
    return parsedSchedule[0];
  }, [parsedSchedule, nowMs]);

  // Filter the list below the hero card
  const filteredSchedule = useMemo(() => {
    let list = parsedSchedule;
    // Exclude the hero event to avoid duplication
    if (heroEvent) {
      list = list.filter(item => item.id !== heroEvent.id);
    }

    if (filterMode === 'live') {
      return list.filter(item => item.isLiveType);
    }
    if (filterMode === 'past') {
      return list.filter(item => !item.isLiveType || new Date(item.endAt).getTime() < nowMs);
    }
    return list;
  }, [parsedSchedule, heroEvent, filterMode, nowMs]);

  // Video embed utility
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('/').pop().split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('/').pop().split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  const handleWatch = (title, url) => {
    if (!url) {
      alert("Stream/Playback link is not available yet.");
      return;
    }
    setActivePlaybackTitle(title);
    setActivePlaybackUrl(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-premium-accent border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Connecting Broadcast feeds...</p>
        </div>
      </div>
    );
  }

  const heroPhase = heroEvent ? getTimerPhase({ nowMs, startAt: heroEvent.startAt, endAt: heroEvent.endAt }) : null;
  const heroRemainingMs = heroEvent && heroPhase
    ? (heroPhase.phase === 'live'
        ? Math.max(0, new Date(heroEvent.endAt).getTime() - nowMs)
        : Math.max(0, new Date(heroEvent.startAt).getTime() - nowMs))
    : 0;
  const heroTone = getUrgencyTone(heroRemainingMs);

  return (
    <div className="space-y-8 animate-in text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Live Broadcasts &amp; Webinars</h1>
          <p className="text-sm text-slate-400 font-bold">Participate in live real-estate deal audits, legal code reviews, and closer strategies.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant={filterMode === 'all' ? 'primary' : 'outline'} 
            onClick={() => setFilterMode('all')}
            className="h-10 text-xs font-black uppercase tracking-widest shadow-sm"
          >
            All Broadcasts
          </Button>
          <Button 
            variant={filterMode === 'live' ? 'primary' : 'outline'} 
            onClick={() => setFilterMode('live')}
            className="h-10 text-xs font-black uppercase tracking-widest shadow-sm"
          >
            Live Schedule
          </Button>
          <Button 
            variant={filterMode === 'past' ? 'primary' : 'outline'} 
            onClick={() => setFilterMode('past')}
            className="h-10 text-xs font-black uppercase tracking-widest shadow-sm"
          >
            Recorded Replays
          </Button>
        </div>
      </div>

      {heroEvent ? (
        <GlassCard className="p-0 overflow-hidden relative group border border-slate-900 shadow-2xl">
          <div className="absolute inset-0 z-0 bg-slate-950">
            <img 
              src={heroEvent.image}
              className="w-full h-full object-cover opacity-25 group-hover:scale-101 transition-transform duration-1000"
              alt="Webinar Audience"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
          </div>

          <div className="relative z-10 p-8 md:p-12 max-w-2xl space-y-6">
            {heroPhase.phase === 'live' ? (
              <Badge variant="danger" className={`px-4 py-1.5 text-xs font-black rounded-lg tracking-widest border ${
                heroTone === 'critical' ? 'bg-red-500/15 text-red-350 border-red-500/30 animate-pulse' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${heroTone === 'critical' ? 'bg-red-400 animate-ping' : 'bg-red-500 animate-pulse'}`}></span>
                  LIVE NOW • Ends in {formatCountdownParts(heroRemainingMs)}
                </span>
              </Badge>
            ) : heroPhase.phase === 'upcoming' ? (
              <Badge variant="premium" className="px-4 py-1.5 text-xs font-black rounded-lg tracking-widest bg-violet-500/10 text-violet-300 border border-violet-500/20">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
                  {formatRelativeStart({ nowMs, startAt: heroEvent.startAt })}
                </span>
              </Badge>
            ) : (
              <Badge variant="outline" className="px-4 py-1.5 text-xs font-black rounded-lg tracking-widest bg-slate-900/40 text-slate-400 border border-slate-800">
                <span>REPLAY AVAILABLE</span>
              </Badge>
            )}
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {heroEvent.title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-bold">
              Join {heroEvent.host} live as we build comprehensive capitalization rate, debt-split calculations, and syndication structures.
            </p>
            
            <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-premium-accent/10 border-2 border-premium-accent flex items-center justify-center text-premium-accent font-black">
                  {heroEvent.host.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-white leading-none">{heroEvent.host}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1.5">LMS Subject Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-premium-accent" />
                </div>
                <div>
                  <p className="font-bold text-white leading-none">{heroEvent.attendeesLabel}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1.5">Students Scheduled</p>
                </div>
              </div>
            </div>
            
            <div className="block pt-2">
              <Button 
                variant="gold" 
                size="lg" 
                onClick={() => handleWatch(heroEvent.title, heroPhase.phase === 'ended' ? heroEvent.recordingUrl || heroEvent.streamLink : heroEvent.streamLink)}
                className="h-13 px-8 text-xs font-black uppercase tracking-widest flex items-center gap-2"
              >
                {heroPhase.phase === 'ended' ? (
                  <>Watch Replay <Play className="w-4.5 h-4.5 fill-current" /></>
                ) : (
                  <>Enter Deal Room <ArrowRight className="w-4.5 h-4.5" /></>
                )}
              </Button>
            </div>
          </div>
        </GlassCard>
      ) : (
        <div className="bg-[#0b0b0d] border border-premium-border p-12 rounded-3xl text-center text-slate-500 font-bold">
          No live broadcasts scheduled at this moment.
        </div>
      )}

      {/* Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-white">
            {filterMode === 'live' ? 'Live Classes Schedule' : filterMode === 'past' ? 'Past Recorded Replays' : 'Upcoming Webinar Schedule'}
          </h3>
          {filteredSchedule.length === 0 ? (
            <div className="bg-[#0b0b0d] border border-premium-border p-8 rounded-3xl text-center text-slate-500 font-bold">
              No matching broadcasts.
            </div>
          ) : (
            filteredSchedule.map((item, i) => {
              const phase = getTimerPhase({ nowMs, startAt: item.startAt, endAt: item.endAt });
              const startMs = new Date(item.startAt).getTime();
              const endMs = new Date(item.endAt).getTime();
              const remainingMs = phase.phase === 'live' ? Math.max(0, endMs - nowMs) : Math.max(0, startMs - nowMs);
              const tone = getUrgencyTone(remainingMs);

              const pill = (() => {
                if (phase.phase === 'invalid') {
                  return { text: 'Schedule TBD', cls: 'bg-slate-900/5 text-slate-500 border-[#1e1e22]' };
                }
                if (phase.phase === 'ended') {
                  return { text: 'Replay Available', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
                }
                if (phase.phase === 'live') {
                  return {
                    text: `LIVE • ${formatCountdownParts(remainingMs)} left`,
                    cls: tone === 'critical'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                      : 'bg-red-500/10 text-red-500 border-red-500/20',
                  };
                }
                // upcoming
                return {
                  text: `Starts in ${formatCountdownParts(remainingMs)}`,
                  cls: tone === 'critical'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                    : tone === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-[#0f0f12] text-premium-accent border-[#1a1a1c]',
                };
              })();

              return (
                <GlassCard key={i} className="group hover:bg-[#0f0f12]/80 bg-[#0b0b0d] border border-premium-border p-6 shadow-sm duration-300">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="shrink-0 text-center md:border-r md:border-[#1a1a1c] md:pr-8">
                      <p className="text-3xl font-black text-premium-accent">
                        {new Intl.DateTimeFormat(undefined, { day: '2-digit' }).format(new Date(item.startAt))}
                      </p>
                      <p className="text-xs font-black uppercase text-slate-400 tracking-widest mt-0.5">
                        {new Intl.DateTimeFormat(undefined, { month: 'short' }).format(new Date(item.startAt))}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono font-bold">
                        {formatLocalDateTime(item.startAt)}
                      </p>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <h4 className="text-lg font-bold text-white group-hover:text-premium-accent transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                          <User className="w-4 h-4 text-premium-accent" /> {item.host}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                          <Clock className="w-4 h-4 text-premium-accent" /> {item.lengthMinutes} Minutes
                        </span>
                        <Badge variant="premium" className="text-[8px] py-0.5 px-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 font-black">Accredited Hour</Badge>
                        <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border ${pill.cls}`}>
                          {pill.text}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Button 
                        variant={phase.phase === 'ended' ? "outline" : "primary"}
                        onClick={() => handleWatch(item.title, phase.phase === 'ended' ? item.recordingUrl || item.streamLink : item.streamLink)}
                        className="text-xs font-black uppercase tracking-widest h-10 bg-[#0b0b0d] border border-premium-border text-slate-300 hover:bg-[#0f0f12] shadow-sm"
                      >
                        {phase.phase === 'ended' ? 'Watch Replay' : 'Enter Room'}
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>

        {/* Top Mentors */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white">Live Session Mentors</h3>
          <div className="space-y-4">
            {[
              { name: "Robert Sterling", role: "CRE Underwriting", rating: "4.9", rev: "1.2k", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" },
              { name: "Elena Rodriguez", role: "Luxury Listings", rating: "4.8", rev: "980", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" },
              { name: "Marcus Thorne", role: "Property Flipping", rating: "4.9", rev: "840", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100" }
            ].map((mentor, i) => (
              <GlassCard key={i} className="p-4 flex items-center gap-4 group cursor-pointer border border-premium-border bg-[#0b0b0d] shadow-sm hover:shadow-[0_12px_45px_rgba(15,23,42,0.06)] duration-300">
                <div className="relative shrink-0">
                   <div className="w-14 h-14 rounded-xl bg-premium-accent/10 border border-premium-accent flex items-center justify-center text-premium-accent font-black">
                     {mentor.name.split(' ').map(n=>n[0]).join('')}
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-premium-accent rounded-lg border-2 border-white flex items-center justify-center">
                     <Star className="w-2.5 h-2.5 text-white fill-current" />
                   </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-bold text-white group-hover:text-premium-accent transition-colors leading-none truncate">{mentor.name}</p>
                  <p className="text-xs text-slate-400 font-bold mt-1.5 truncate">{mentor.role}</p>
                  <div className="flex items-center gap-1 mt-1.5 font-bold">
                    <Star className="w-3 h-3 text-premium-accent fill-current" />
                    <span className="text-[10px] font-black text-white">{mentor.rating}</span>
                    <span className="text-[9px] text-slate-400 ml-1">({mentor.rev} reviews)</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Cinematic Custom Video Player Modal */}
      {activePlaybackUrl && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8">
          <div className="bg-[#0b0b0d] border border-premium-border rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col">
            <div className="p-5 border-b border-[#1a1a1c] flex items-center justify-between">
              <div className="flex items-center gap-2 text-premium-accent">
                <Video className="w-5 h-5" />
                <span className="text-sm font-black text-white">{activePlaybackTitle}</span>
              </div>
              <button 
                onClick={() => { setActivePlaybackUrl(null); setActivePlaybackTitle(''); }}
                className="text-slate-400 hover:text-white font-extrabold text-lg cursor-pointer active:scale-95 transition-transform"
              >
                ✕ Close Stream
              </button>
            </div>
            
            <div className="relative aspect-video w-full bg-black">
              {activePlaybackUrl.includes('youtube.com') || activePlaybackUrl.includes('youtu.be') || activePlaybackUrl.includes('vimeo.com') ? (
                <iframe
                  src={getEmbedUrl(activePlaybackUrl)}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activePlaybackUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClasses;
