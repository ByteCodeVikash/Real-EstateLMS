export const safeParseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const pad2 = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');

export const formatCountdownParts = (msRemaining) => {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad2(days)}d ${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
};

export const getTimerPhase = ({ nowMs, startAt, endAt }) => {
  const start = safeParseDate(startAt);
  if (!start) return { phase: 'invalid', start: null, end: null };
  const end = safeParseDate(endAt) || null;

  const startMs = start.getTime();
  const endMs = end?.getTime?.() ?? null;

  if (nowMs < startMs) return { phase: 'upcoming', start, end };
  if (endMs !== null && nowMs >= endMs) return { phase: 'ended', start, end };
  return { phase: 'live', start, end };
};

export const getUrgencyTone = (msRemaining) => {
  const m = Math.max(0, msRemaining);
  if (m <= 10 * 60 * 1000) return 'critical';
  if (m <= 60 * 60 * 1000) return 'warning';
  return 'normal';
};

export const formatRelativeStart = ({ nowMs, startAt }) => {
  const start = safeParseDate(startAt);
  if (!start) return 'Schedule TBD';
  const diffMs = start.getTime() - nowMs;
  if (diffMs <= 0) return 'Starting now';

  const minutes = Math.round(diffMs / (60 * 1000));
  if (minutes < 60) return `Live in ${minutes} minute${minutes === 1 ? '' : 's'}`;

  const hours = Math.round(diffMs / (60 * 60 * 1000));
  if (hours < 24) return `Starts in ${hours} hour${hours === 1 ? '' : 's'}`;

  const days = Math.round(diffMs / (24 * 60 * 60 * 1000));
  if (days === 1) return 'Starts Tomorrow';
  return `Starts in ${days} days`;
};

export const formatLocalDateTime = (dateInput, { withDate = false } = {}) => {
  const d = safeParseDate(dateInput);
  if (!d) return 'TBD';
  const fmt = new Intl.DateTimeFormat(undefined, {
    ...(withDate ? { month: 'short', day: 'numeric' } : null),
    hour: 'numeric',
    minute: '2-digit',
  });
  return fmt.format(d);
};

