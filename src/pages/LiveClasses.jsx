import { useMemo } from 'react';
import { Clock, Users, ArrowRight, User, Star } from 'lucide-react';
import { GlassCard, Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { useNow } from '../hooks/useNow';
import { formatCountdownParts, formatLocalDateTime, formatRelativeStart, getTimerPhase, getUrgencyTone } from '../utils/countdown';

const LiveClasses = () => {
  const nowMs = useNow();
  // Capture a stable "page opened at" time without calling Date.now() during render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const baseMs = useMemo(() => nowMs, []);

  const schedule = useMemo(() => {
    const base = baseMs;
    return [
      {
        id: 'hero',
        title: 'Live Underwriting Audit: NYC & Dallas Multi-Family Analysis',
        host: 'Robert Sterling',
        lengthMinutes: 90,
        startAt: new Date(base - 12 * 60 * 1000).toISOString(), // started 12m ago (feels live)
        endAt: new Date(base - 12 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
        attendeesLabel: '1,240+',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000',
      },
      {
        id: 'w1',
        title: 'Luxury Mandates: Pitching to High-Net-Worth Sellers',
        host: 'Elena Rodriguez',
        lengthMinutes: 90,
        startAt: new Date(base + 45 * 60 * 1000).toISOString(),
        endAt: new Date(base + 45 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      },
      {
        id: 'w2',
        title: 'Off-Market Distressed Sourcing & ARV Calculations',
        host: 'Marcus Thorne',
        lengthMinutes: 120,
        startAt: new Date(base + 6 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(base + 6 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
      },
      {
        id: 'w3',
        title: 'GP/LP Waterfall Splitting & Complex Syndication',
        host: 'Robert Sterling',
        lengthMinutes: 90,
        startAt: new Date(base + 28 * 60 * 60 * 1000).toISOString(), // tomorrow-ish
        endAt: new Date(base + 28 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      },
    ];
  }, [baseMs]);

  const heroEvent = schedule[0];
  const heroPhase = getTimerPhase({ nowMs, startAt: heroEvent.startAt, endAt: heroEvent.endAt });
  const heroRemainingMs = heroPhase.phase === 'live'
    ? Math.max(0, new Date(heroEvent.endAt).getTime() - nowMs)
    : Math.max(0, new Date(heroEvent.startAt).getTime() - nowMs);
  const heroTone = getUrgencyTone(heroRemainingMs);

  return (
    <div className="space-y-8 animate-in text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Live Broadcasts &amp; Webinars</h1>
          <p className="text-sm text-slate-400 font-bold">Participate in live real-estate deal audits, legal code reviews, and closer strategies.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 text-xs font-black uppercase tracking-widest bg-[#0b0b0d] border border-premium-border text-slate-500 shadow-sm">Past Broadcasts</Button>
          <Button variant="primary" className="h-10 text-xs font-black uppercase tracking-widest shadow-sm">My Academy Schedule</Button>
        </div>
      </div>

      {/* Hero Section for Next Big Class (Cinematic Dramatic layout) */}
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
              heroTone === 'critical' ? 'bg-red-500/100/15 text-red-300 border-red-500/30 animate-pulse' : 'bg-red-500/100/10 text-red-400 border-red-500/20'
            }`}>
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${heroTone === 'critical' ? 'bg-red-400 animate-ping' : 'bg-red-500/100 animate-pulse'}`}></span>
                LIVE NOW • Ends in {formatCountdownParts(heroRemainingMs)}
              </span>
            </Badge>
          ) : (
            <Badge variant="premium" className="px-4 py-1.5 text-xs font-black rounded-lg tracking-widest bg-violet-500/100/10 text-violet-300 border border-violet-500/20">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
                {formatRelativeStart({ nowMs, startAt: heroEvent.startAt })}
              </span>
            </Badge>
          )}
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {heroEvent.title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-bold">
            Join Robert Sterling live as he builds comprehensive capitalization rate and debt-split spreadsheets for real, off-market commercial assets.
          </p>
          
          <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-2 border-premium-accent object-cover" alt="mentor" />
              <div>
                <p className="font-bold text-white leading-none">Robert Sterling</p>
                <p className="text-xs text-slate-500 font-bold mt-1.5">Former CRE Director</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-premium-accent" />
              </div>
              <div>
                <p className="font-bold text-white leading-none">{heroEvent.attendeesLabel}</p>
                <p className="text-xs text-slate-500 font-bold mt-1.5">Seniors Attending</p>
              </div>
            </div>
          </div>
          
          <Link to="/watch/1" className="block pt-2">
            <Button variant="gold" size="lg" className="h-13 px-8 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              Enter Deal Room <ArrowRight className="w-4.5 h-4.5" />
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-white">Upcoming Webinar Schedule</h3>
          {schedule.slice(1).map((item, i) => {
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
                return { text: 'Ended', cls: 'bg-slate-900/5 text-slate-500 border-[#1e1e22]' };
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
                text: `${formatCountdownParts(remainingMs)}`,
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
                    <Badge variant="premium" className="text-[8px] py-0.5 px-2 bg-violet-500/100/10 text-violet-400 border border-violet-500/20 font-black">Accredited Hour</Badge>
                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border ${pill.cls}`}>
                      {pill.text}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button variant="outline" className="text-xs font-black uppercase tracking-widest h-10 bg-[#0b0b0d] border border-premium-border text-slate-500 hover:bg-[#0f0f12] shadow-sm">Notify Me</Button>
                </div>
              </div>
            </GlassCard>
          );
          })}
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
                   <img src={mentor.avatar} className="w-14 h-14 rounded-xl object-cover border border-premium-border" alt={mentor.name} />
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
    </div>
  );
};

export default LiveClasses;
