const DEFAULT_TICK_MS = 1000;

let listeners = new Set();
let intervalId = null;
let tickMs = DEFAULT_TICK_MS;
let now = Date.now();

const start = () => {
  if (intervalId !== null) return;
  intervalId = setInterval(() => {
    now = Date.now();
    listeners.forEach((listener) => {
      try { listener(); } catch { /* ignore */ }
    });
  }, tickMs);
};

const stop = () => {
  if (intervalId === null) return;
  clearInterval(intervalId);
  intervalId = null;
};

export const configureClock = ({ intervalMs }) => {
  const next = Number(intervalMs);
  if (!Number.isFinite(next) || next <= 0) return;
  tickMs = next;
  if (intervalId !== null) {
    stop();
    start();
  }
};

export const subscribe = (listener) => {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
};

export const getSnapshot = () => now;

