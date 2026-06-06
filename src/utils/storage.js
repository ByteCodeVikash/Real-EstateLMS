/**
 * BG Realty Training Academy — localStorage Persistence Utilities
 * Provides safe read/write/clear operations for demo-mode persistence.
 * All operations are wrapped in try/catch to silently handle corrupted
 * or unavailable storage without crashing the application.
 */

// ─── Organized Storage Key Constants ──────────────────────────────────────────
export const STORAGE_KEYS = {
  // CourseWatch: per-course note lists
  courseNotes: (courseId) => `bglms_notes_${courseId}`,
  // CourseWatch: per-course student chat messages
  courseChat:  (courseId) => `bglms_chat_${courseId}`,
  // Notifications: dismissed notification IDs
  notifDismissed: 'bglms_notifications_dismissed',
  // Notifications: read notification IDs
  notifRead: 'bglms_notifications_read',
  // Assignments: full assignments state array
  assignments: 'bglms_assignments',
};

// ─── saveToStorage ────────────────────────────────────────────────────────────
/**
 * Serialize `value` to JSON and persist it under `key`.
 * @param {string} key   - localStorage key
 * @param {*}      value - any JSON-serializable value
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Quota exceeded or private browsing restrictions — fail silently
    console.warn(`[Storage] Could not save key "${key}":`, err);
  }
}

// ─── loadFromStorage ──────────────────────────────────────────────────────────
/**
 * Read and parse the JSON value stored under `key`.
 * Returns `fallback` if the key is absent, the value is null, or parsing fails.
 * @param {string} key      - localStorage key
 * @param {*}      fallback - value to return on any failure
 * @returns {*} Parsed value or fallback
 */
export function loadFromStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    // Corrupted JSON — return fallback and clean up
    console.warn(`[Storage] Corrupted data at key "${key}", using fallback.`, err);
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    return fallback;
  }
}

// ─── clearStorage ─────────────────────────────────────────────────────────────
/**
 * Remove a single key from localStorage.
 * @param {string} key - localStorage key to remove
 */
export function clearStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Could not clear key "${key}":`, err);
  }
}

// ─── clearAllAppStorage ───────────────────────────────────────────────────────
/**
 * Remove ALL bglms_* and bjlms_* keys from localStorage (full demo reset).
 */
export function clearAllAppStorage() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('bglms_'))
      .forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('[Storage] Could not clear all app storage:', err);
  }
}
