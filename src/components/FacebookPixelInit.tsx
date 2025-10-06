'use client';

import { useEffect } from 'react';
import { initPageView } from '@/lib/facebook-pixel';

/**
 * Client-side component to initialize Facebook Pixel PageView
 * Must be loaded AFTER the pixel script loads
 */
export default function FacebookPixelInit() {
  useEffect(() => {
    // Track PageView when component mounts (client-side only)
    initPageView();
  }, []);

  return null; // This component doesn't render anything
}
