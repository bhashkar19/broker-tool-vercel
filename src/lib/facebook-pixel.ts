/**
 * Facebook Pixel Safe Wrapper
 *
 * Handles race conditions and ensures events only fire when pixel is ready
 */

// Type definition for Facebook Pixel
declare global {
  interface Window {
    fbq?: {
      (command: 'track', eventName: string, parameters?: Record<string, unknown>): void;
      (command: 'trackCustom', eventName: string, parameters?: Record<string, unknown>): void;
      (command: 'init', pixelId: string): void;
      queue: unknown[];
      loaded: boolean;
    };
  }
}

/**
 * Wait for Facebook Pixel to be loaded and ready
 */
function waitForPixel(maxAttempts = 20, delayMs = 100): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      attempts++;

      if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
        console.log('✅ Facebook Pixel ready after', attempts, 'attempts');
        resolve(true);
        return;
      }

      if (attempts >= maxAttempts) {
        console.warn('⚠️ Facebook Pixel not loaded after', maxAttempts, 'attempts');
        resolve(false);
        return;
      }

      setTimeout(check, delayMs);
    };

    check();
  });
}

/**
 * Safely track Facebook Pixel event
 * Waits for pixel to be ready before firing
 */
export async function trackPixelEvent(
  eventName: string,
  parameters?: Record<string, unknown>,
  isCustomEvent = false
): Promise<boolean> {
  // Check if we're in browser
  if (typeof window === 'undefined') {
    console.warn('trackPixelEvent called on server side');
    return false;
  }

  // Wait for pixel to be ready
  const pixelReady = await waitForPixel();

  if (!pixelReady || !window.fbq) {
    console.error('❌ Facebook Pixel not available, event not sent:', eventName);
    return false;
  }

  try {
    if (isCustomEvent) {
      window.fbq('trackCustom', eventName, parameters);
      console.log('📊 Facebook trackCustom:', eventName, parameters);
    } else {
      window.fbq('track', eventName, parameters);
      console.log('📊 Facebook track:', eventName, parameters);
    }

    return true;
  } catch (error) {
    console.error('❌ Error tracking Facebook event:', eventName, error);
    return false;
  }
}

/**
 * Track standard Facebook event
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, unknown>
): Promise<boolean> {
  return trackPixelEvent(eventName, parameters, false);
}

/**
 * Track custom Facebook event
 */
export function trackCustomEvent(
  eventName: string,
  parameters?: Record<string, unknown>
): Promise<boolean> {
  return trackPixelEvent(eventName, parameters, true);
}

/**
 * Initialize Facebook Pixel PageView
 * Should be called after pixel script loads
 */
export async function initPageView(): Promise<boolean> {
  const pixelReady = await waitForPixel();

  if (!pixelReady || !window.fbq) {
    console.error('❌ Facebook Pixel not available for PageView');
    return false;
  }

  try {
    window.fbq('track', 'PageView');
    console.log('📊 Facebook PageView tracked');
    return true;
  } catch (error) {
    console.error('❌ Error tracking PageView:', error);
    return false;
  }
}

/**
 * Check if Facebook Pixel is loaded
 */
export function isPixelLoaded(): boolean {
  return typeof window !== 'undefined' &&
         typeof window.fbq === 'function';
}
