/* ═══════════════════════════════════════════════════════════════
   TapFlow — Ad Monetization Manager
   Uses Capacitor AdMob plugin (@capacitor-community/admob)
   Falls back gracefully when running in browser (no native app)
   ═══════════════════════════════════════════════════════════════ */

// ─── Ad Unit IDs (configurable — replace with real AdMob IDs) ──
const AD_UNIT_IDS = {
  // Test IDs from Google — always use these for development
  // Replace with your real AdMob unit IDs before publishing
  android: {
    rewarded:   'ca-app-pub-3940256099942544/5224354917',  // Test rewarded
    interstitial: 'ca-app-pub-3940256099942544/1033173712', // Test interstitial
  },
  ios: {
    rewarded:   'ca-app-pub-3940256099942544/1712485313',  // Test rewarded
    interstitial: 'ca-app-pub-3940256099942544/4411468910', // Test interstitial
  },
};

// ─── Constants ──────────────────────────────────────────────
const INTERSTITIAL_COOLDOWN_MS = 30000; // 30 seconds between interstitials

// ─── State ──────────────────────────────────────────────────
let adsReady = false;
let lastInterstitialTime = 0;

// ─── Check if running inside Capacitor native app ────────────
function isNativeApp() {
  return typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
}

// ─── Detect platform ────────────────────────────────────────
function getPlatform() {
  if (!isNativeApp()) return 'web';
  try {
    return Capacitor.getPlatform(); // 'ios' or 'android'
  } catch {
    return 'web';
  }
}

// ─── Get unit ID for current platform ───────────────────────
function getUnitId(type) {
  const platform = getPlatform();
  if (platform === 'web') return null;
  return AD_UNIT_IDS[platform]?.[type] || null;
}

// ─── Initialize Ads ─────────────────────────────────────────
function initAds() {
  return new Promise((resolve) => {
    if (!isNativeApp()) {
      console.log('📢 Ads disabled — running in browser');
      adsReady = false;
      resolve(false);
      return;
    }

    try {
      const { AdMob } = Capacitor.Plugins;

      // Initialize AdMob
      AdMob.initialize({
        requestTrackingAuthorization: true,
      }).then(() => {
        console.log('📢 AdMob initialized');
        adsReady = true;
        resolve(true);
      }).catch((err) => {
        console.warn('📢 AdMob init failed:', err);
        adsReady = false;
        resolve(false);
      });
    } catch (err) {
      console.warn('📢 AdMob plugin not available:', err);
      adsReady = false;
      resolve(false);
    }
  });
}

// ─── Show Rewarded Video Ad ─────────────────────────────────
// Returns a promise that resolves to:
//   { rewarded: true }  — user watched the full ad
//   { rewarded: false } — user skipped, ad failed, or not available
function showRewardedVideo() {
  return new Promise((resolve) => {
    if (!adsReady || !isNativeApp()) {
      resolve({ rewarded: false, reason: 'ads_not_ready' });
      return;
    }

    const unitId = getUnitId('rewarded');
    if (!unitId) {
      resolve({ rewarded: false, reason: 'no_unit_id' });
      return;
    }

    try {
      const { AdMob } = Capacitor.Plugins;

      // Prepare the rewarded ad
      AdMob.prepareRewardedVideoAd({
        adId: unitId,
      }).then(() => {
        // Show it
        return AdMob.showRewardedVideoAd();
      }).then((result) => {
        if (result && result.reward) {
          console.log('📢 Rewarded ad completed — granting reward');
          resolve({ rewarded: true });
        } else {
          console.log('📢 Rewarded ad closed without reward');
          resolve({ rewarded: false, reason: 'skipped' });
        }
      }).catch((err) => {
        console.warn('📢 Rewarded ad error:', err);
        resolve({ rewarded: false, reason: 'error' });
      });
    } catch (err) {
      console.warn('📢 Rewarded ad plugin error:', err);
      resolve({ rewarded: false, reason: 'error' });
    }
  });
}

// ─── Show Interstitial Ad ───────────────────────────────────
// Respects cooldown — won't show more often than INTERSTITIAL_COOLDOWN_MS
function showInterstitial() {
  return new Promise((resolve) => {
    const now = Date.now();
    if (now - lastInterstitialTime < INTERSTITIAL_COOLDOWN_MS) {
      resolve({ shown: false, reason: 'cooldown' });
      return;
    }

    if (!adsReady || !isNativeApp()) {
      resolve({ shown: false, reason: 'ads_not_ready' });
      return;
    }

    const unitId = getUnitId('interstitial');
    if (!unitId) {
      resolve({ shown: false, reason: 'no_unit_id' });
      return;
    }

    try {
      const { AdMob } = Capacitor.Plugins;

      AdMob.prepareInterstitial({
        adId: unitId,
      }).then(() => {
        return AdMob.showInterstitial();
      }).then(() => {
        console.log('📢 Interstitial shown');
        lastInterstitialTime = now;
        resolve({ shown: true });
      }).catch((err) => {
        console.warn('📢 Interstitial error:', err);
        resolve({ shown: false, reason: 'error' });
      });
    } catch (err) {
      console.warn('📢 Interstitial plugin error:', err);
      resolve({ shown: false, reason: 'error' });
    }
  });
}
