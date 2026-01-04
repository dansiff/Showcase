// lib/email/service.ts
// Email service for sending transactional emails

import { sendEmail } from '@/lib/notifications'
import {
  welcomeEmail,
  trialStartedEmail,
  trialEndingEmail,
  subscriptionActiveEmail,
  subscriptionCancelledEmail,
  type WelcomeEmailData,
  type TrialStartedData,
  type TrialEndingData,
  type SubscriptionActiveData,
  type SubscriptionCancelledData,
} from './templates'

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const email = welcomeEmail(data)
  
  await sendEmail({
    to: data.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
  
  console.log('[EMAIL] Welcome email sent to:', data.email)
}

/**
 * Send trial started confirmation
 */
export async function sendTrialStartedEmail(data: TrialStartedData): Promise<void> {
  const email = trialStartedEmail(data)
  
  await sendEmail({
    to: data.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
  
  console.log('[EMAIL] Trial started email sent to:', data.email)
}

/**
 * Send trial ending reminder (3 days before)
 */
export async function sendTrialEndingEmail(data: TrialEndingData): Promise<void> {
  const email = trialEndingEmail(data)
  
  await sendEmail({
    to: data.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
  
  console.log('[EMAIL] Trial ending email sent to:', data.email)
}

/**
 * Send subscription activated confirmation
 */
export async function sendSubscriptionActiveEmail(data: SubscriptionActiveData): Promise<void> {
  const email = subscriptionActiveEmail(data)
  
  await sendEmail({
    to: data.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
  
  console.log('[EMAIL] Subscription active email sent to:', data.email)
}

/**
 * Send subscription cancelled confirmation
 */
export async function sendSubscriptionCancelledEmail(data: SubscriptionCancelledData): Promise<void> {
  const email = subscriptionCancelledEmail(data)
  
  await sendEmail({
    to: data.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
  
  console.log('[EMAIL] Subscription cancelled email sent to:', data.email)
}

/**
 * Schedule trial ending reminder
 * Call this 3 days before trial ends
 */
export async function scheduleTrialEndingReminder(email: string, name: string | undefined, plan: string, trialEndDate: Date): Promise<void> {
  const now = new Date()
  const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  // Only send if 3 days or less remaining
  if (daysRemaining <= 3 && daysRemaining > 0) {
    await sendTrialEndingEmail({
      email,
      name,
      daysRemaining,
      plan,
    })
  }
}
