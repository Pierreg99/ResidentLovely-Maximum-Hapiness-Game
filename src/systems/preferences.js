// Preferences are shared by rendering, input, and the pause menu.
const KEY = 'resident-lovely-preferences-v8';
export const preferences = { quality: 'auto', skin: 'sakura', reducedMotion: false, sound: true };
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  if (['auto', 'low', 'med', 'high', 'ultra'].includes(saved.quality)) preferences.quality = saved.quality;
  if (['starlight', 'sakura', 'jade'].includes(saved.skin)) preferences.skin = saved.skin;
  if (typeof saved.reducedMotion === 'boolean') preferences.reducedMotion = saved.reducedMotion;
  if (typeof saved.sound === 'boolean') preferences.sound = saved.sound;
} catch (_) { /* Storage can be unavailable in private browsing. */ }

export function savePreferences() {
  try { localStorage.setItem(KEY, JSON.stringify(preferences)); } catch (_) {}
}

export function motionReduced() {
  return preferences.reducedMotion || (typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
