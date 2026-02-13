// PWA Utilities for Disney/Astro Bot Math Learning App

export class PWAUtils {
  // Check if app is running as installed PWA
  static isRunningAsPWA(): boolean {
    const nav = window.navigator as Navigator & { standalone?: boolean };
    return window.matchMedia('(display-mode: standalone)').matches ||
           Boolean(nav.standalone) ||
           document.referrer.includes('android-app://');
  }

  // Check if PWA install is available
  static isPWAInstallable(): boolean {
    return 'beforeinstallprompt' in window;
  }

  // Get install prompt (call this in beforeinstallprompt event handler)
  static async showInstallPrompt(deferredPrompt: { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> } | null): Promise<boolean> {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`PWA install outcome: ${outcome}`);
      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA install prompt failed:', error);
      return false;
    }
  }

  // Check for updates
  static async checkForUpdates(): Promise<boolean> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          return true;
        }
      } catch (error) {
        console.error('PWA update check failed:', error);
      }
    }
    return false;
  }

  // Get device info for responsive behavior
  static getDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase();

    return {
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      isMobile: /mobile|tablet|ipad|iphone|android/.test(userAgent),
      isTablet: /ipad|tablet|playbook|silk/.test(userAgent),
      isDesktop: !/mobile|tablet|ipad|iphone|android/.test(userAgent),
      hasTouchScreen: 'ontouchstart' in window,
      supportsWebAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
      supportsPWA: 'serviceWorker' in navigator && 'PushManager' in window
    };
  }

  // Optimize for mobile performance
  static optimizeForMobile() {
    const deviceInfo = this.getDeviceInfo();

    if (deviceInfo.isMobile) {
      // Disable zooming on inputs
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover'
        );
      }

      // Add touch-action CSS for better touch handling
      document.body.style.touchAction = 'manipulation';

      // Prevent pull-to-refresh on mobile
      document.body.style.overscrollBehavior = 'contain';

      // Add iOS safe area handling
      if (deviceInfo.isIOS) {
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      }
    }
  }

  // Handle app lifecycle events
  static setupLifecycleHandlers() {
    // Handle visibility changes (app backgrounded/foregrounded)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('📱 App backgrounded - could pause audio/animations');
      } else {
        console.log('📱 App foregrounded - could resume audio/animations');
      }
    });

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      console.log('🔄 Orientation changed');
      // Could adjust layout or pause game
    });

    // Handle memory pressure (mostly for iOS)
    window.addEventListener('pagehide', () => {
      console.log('💾 Page hidden - cleanup resources');
      // Could cleanup audio contexts, pause games
    });
  }

  // Show native-like install banner
  static createInstallBanner(onInstall: () => void): HTMLElement | null {
    if (this.isRunningAsPWA()) return null;

    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 10000;
        font-family: 'Nunito', sans-serif;
        animation: slideUp 0.3s ease-out;
      ">
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">
            📱 Install Math Adventure
          </div>
          <div style="font-size: 14px; opacity: 0.9;">
            Add to home screen for the best experience!
          </div>
        </div>
        <button class="install-btn" style="
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-left: 12px;
        ">Install</button>
        <button class="close-btn" style="
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          margin-left: 8px;
          opacity: 0.7;
        ">&times;</button>
      </div>
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Event handlers
    banner.querySelector('.install-btn')?.addEventListener('click', onInstall);
    banner.querySelector('.close-btn')?.addEventListener('click', () => {
      banner.remove();
      style.remove();
    });

    return banner;
  }
}