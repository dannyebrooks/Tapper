/* ═══════════════════════════════════════════════════════════════
   TapFlow — Session Analytics
   Tracks gameplay stats using localStorage
   ═══════════════════════════════════════════════════════════════ */

const ANALYTICS_KEY = 'tapflow_analytics';

// ─── Data Schema ────────────────────────────────────────────
// Stored in localStorage under ANALYTICS_KEY as JSON:
// {
//   version: 1,
//   totalSessions: 0,        // total games started
//   totalPlayTimeMs: 0,      // cumulative play time in ms
//   totalGemsCollected: 0,   // lifetime gem pickups
//   bestScore: 0,            // all-time high score
//   recentScores: [],        // last 100 scores
//   dailySessions: {},       // "2026-06-10": count
//   lastPlayedDate: "",      // "2026-06-10" for retention calc
//   sessionsToday: 0,        // quick-access today's count
//   currentDate: "",         // date of sessionsToday
// }

// ─── State ──────────────────────────────────────────────────
let analyticsData = null;
let sessionStartTime = 0;
let currentSessionGems = 0;

// ─── Load / Save ────────────────────────────────────────────
function loadAnalytics() {
  if (analyticsData) return analyticsData;
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (raw) {
      analyticsData = JSON.parse(raw);
      // Ensure daily sessions object exists
      if (!analyticsData.dailySessions) analyticsData.dailySessions = {};
      if (!analyticsData.recentScores) analyticsData.recentScores = [];
      return analyticsData;
    }
  } catch (e) {
    console.warn('📊 Analytics load failed:', e);
  }
  // Default data
  analyticsData = {
    version: 1,
    totalSessions: 0,
    totalPlayTimeMs: 0,
    totalGemsCollected: 0,
    bestScore: 0,
    recentScores: [],
    dailySessions: {},
    lastPlayedDate: '',
    sessionsToday: 0,
    currentDate: '',
  };
  return analyticsData;
}

function saveAnalytics() {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analyticsData));
  } catch (e) {
    console.warn('📊 Analytics save failed:', e);
  }
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0]; // "2026-06-16"
}

// ─── Track: Game Started ────────────────────────────────────
function trackGameStart() {
  const data = loadAnalytics();
  const today = getTodayDate();

  data.totalSessions++;
  data.lastPlayedDate = today;

  // Daily session tracking
  if (data.currentDate !== today) {
    data.currentDate = today;
    data.sessionsToday = 0;
  }
  data.sessionsToday++;
  if (!data.dailySessions[today]) {
    data.dailySessions[today] = 0;
  }
  data.dailySessions[today]++;

  saveAnalytics();

  // Start timing
  sessionStartTime = Date.now();
  currentSessionGems = 0;
}

// ─── Track: Game Over ───────────────────────────────────────
function trackGameOver(score, gemsCollected) {
  const data = loadAnalytics();

  // Play time
  if (sessionStartTime > 0) {
    const elapsed = Date.now() - sessionStartTime;
    data.totalPlayTimeMs += elapsed;
  }

  // Gems
  if (gemsCollected > 0) {
    data.totalGemsCollected += gemsCollected;
    currentSessionGems = gemsCollected;
  }

  // High score
  if (score > data.bestScore) {
    data.bestScore = score;
  }

  // Recent scores (keep last 100)
  data.recentScores.push(score);
  if (data.recentScores.length > 100) {
    data.recentScores.shift();
  }

  saveAnalytics();
}

// ─── Get Stats Summary ──────────────────────────────────────
function getStats() {
  const data = loadAnalytics();
  const avgScore = data.recentScores.length > 0
    ? Math.round(data.recentScores.reduce((a, b) => a + b, 0) / data.recentScores.length)
    : 0;
  const avgPlayTimeSec = data.totalSessions > 0
    ? Math.round(data.totalPlayTimeMs / data.totalSessions / 1000)
    : 0;

  return {
    totalSessions: data.totalSessions,
    totalPlayTimeMs: data.totalPlayTimeMs,
    totalPlayTimeFormatted: formatPlayTime(data.totalPlayTimeMs),
    bestScore: data.bestScore,
    averageScore: avgScore,
    averagePlayTimeSec: avgPlayTimeSec,
    totalGemsCollected: data.totalGemsCollected,
    sessionsToday: data.sessionsToday,
    lastPlayedDate: data.lastPlayedDate,
  };
}

// ─── Get DAU (sessions today) ───────────────────────────────
function getDailyDAU() {
  const data = loadAnalytics();
  const today = getTodayDate();
  return data.dailySessions[today] || 0;
}

// ─── Get Retention (days since last play) ───────────────────
function getRetention() {
  const data = loadAnalytics();
  if (!data.lastPlayedDate) return null;
  const last = new Date(data.lastPlayedDate);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ─── Format play time ───────────────────────────────────────
function formatPlayTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

// ─── Quick stats string for UI ──────────────────────────────
function getStatsString() {
  const stats = getStats();
  let str = '';
  if (stats.totalSessions > 0) {
    str += `Played ${stats.totalSessions} game${stats.totalSessions !== 1 ? 's' : ''}`;
    str += ` · Best: ${stats.bestScore}`;
    if (stats.averageScore > 0) str += ` · Avg: ${stats.averageScore}`;
    str += ` · Total: ${stats.totalPlayTimeFormatted}`;
    if (stats.totalGemsCollected > 0) str += ` · 💎 ${stats.totalGemsCollected}`;
  }
  return str;
}