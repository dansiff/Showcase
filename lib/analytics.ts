// lib/analytics.ts
// Analytics tracking utilities for Google Analytics 4

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

/**
 * Initialize Google Analytics
 */
export function initGA() {
  if (typeof window === 'undefined') return

  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!GA_MEASUREMENT_ID) {
    console.warn('[Analytics] GA_MEASUREMENT_ID not configured')
    return
  }

  // Load gtag script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.async = true
  document.head.appendChild(script)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!GA_MEASUREMENT_ID) return

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', eventName, params)
}

// ============================================================================
// GENERATOR SPECIFIC EVENTS
// ============================================================================

/**
 * Track when user views pricing page
 */
export function trackPricingPageView() {
  trackEvent('view_pricing', {
    page_title: 'Generator Pricing',
    page_location: window.location.href,
  })
}

/**
 * Track when user clicks upgrade button
 */
export function trackUpgradeClick(planName: string) {
  trackEvent('begin_checkout', {
    item_name: planName,
    item_category: 'generator_plan',
    value: planName === 'Pro' ? 29.99 : 0,
    currency: 'USD',
  })
}

/**
 * Track successful upgrade
 */
export function trackUpgradeComplete(planName: string, trialDays?: number) {
  trackEvent('purchase', {
    item_name: planName,
    item_category: 'generator_plan',
    value: planName === 'Pro' ? 29.99 : 0,
    currency: 'USD',
    transaction_id: Date.now().toString(),
    trial_days: trialDays,
  })
}

/**
 * Track when user starts creating a website
 */
export function trackWebsiteCreationStart(templateType?: string) {
  trackEvent('website_creation_start', {
    template_type: templateType || 'custom',
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track website generation completion
 */
export function trackWebsiteGenerated(data: {
  templateType?: string
  customization?: string
  timeSpent?: number
  plan: string
}) {
  trackEvent('website_generated', {
    template_type: data.templateType || 'custom',
    customization_level: data.customization || 'basic',
    time_spent_seconds: data.timeSpent,
    user_plan: data.plan,
  })
}

/**
 * Track website download/export
 */
export function trackWebsiteExport(format: string) {
  trackEvent('website_export', {
    export_format: format,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track feature usage (for Pro features)
 */
export function trackFeatureUsage(featureName: string, plan: string) {
  trackEvent('feature_usage', {
    feature_name: featureName,
    user_plan: plan,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track subscription cancellation
 */
export function trackSubscriptionCancelled(reason?: string) {
  trackEvent('subscription_cancelled', {
    cancellation_reason: reason || 'not_specified',
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track trial ended
 */
export function trackTrialEnded(converted: boolean) {
  trackEvent('trial_ended', {
    converted_to_paid: converted,
    timestamp: new Date().toISOString(),
  })
}

// ============================================================================
// USER ENGAGEMENT EVENTS
// ============================================================================

/**
 * Track sign up
 */
export function trackSignUp(method: string = 'email') {
  trackEvent('sign_up', {
    method,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track login
 */
export function trackLogin(method: string = 'email') {
  trackEvent('login', {
    method,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track user completing profile
 */
export function trackProfileComplete() {
  trackEvent('profile_complete', {
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup() {
  trackEvent('newsletter_signup', {
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track social share
 */
export function trackSocialShare(platform: string, contentType: string) {
  trackEvent('share', {
    method: platform,
    content_type: contentType,
  })
}

// ============================================================================
// ERROR TRACKING
// ============================================================================

/**
 * Track errors
 */
export function trackError(error: Error, context?: string) {
  trackEvent('exception', {
    description: error.message,
    fatal: false,
    context: context || 'unknown',
  })
}

/**
 * Track 404 errors
 */
export function track404(path: string) {
  trackEvent('page_not_found', {
    page_path: path,
  })
}
