// lib/email/templates.ts
// Email templates for user notifications

interface EmailTemplate {
  subject: string
  text: string
  html: string
}

export interface WelcomeEmailData {
  name?: string
  email: string
}

export interface TrialStartedData {
  name?: string
  email: string
  trialEndDate: string
  plan: string
}

export interface TrialEndingData {
  name?: string
  email: string
  daysRemaining: number
  plan: string
}

export interface SubscriptionActiveData {
  name?: string
  email: string
  plan: string
  amount: string
  nextBillingDate: string
}

export interface SubscriptionCancelledData {
  name?: string
  email: string
  plan: string
  endDate: string
}

/**
 * Welcome email sent when user creates account
 */
export function welcomeEmail(data: WelcomeEmailData): EmailTemplate {
  const firstName = data.name?.split(' ')[0] || 'there'
  
  return {
    subject: 'Welcome to Fusion Space! 🚀',
    text: `
Hi ${firstName},

Welcome to Fusion Space! We're excited to have you here.

You're now ready to start creating professional websites in minutes with our AI-powered generator.

Here's what you can do next:

1. Create your first website
   Visit: ${process.env.NEXT_PUBLIC_APP_URL}/generator

2. Explore features
   Check out our templates, themes, and customization options

3. View pricing plans
   Upgrade to Pro for unlimited websites and advanced features:
   ${process.env.NEXT_PUBLIC_APP_URL}/generator/pricing

4. Get help
   Have questions? Visit our help center or reply to this email

Quick Tips:
• Start with a template to save time
• Use the preview feature to see changes live
• Export your site anytime and host anywhere

Need Help?
Reply to this email or visit ${process.env.NEXT_PUBLIC_APP_URL}/contact

Happy building!

The Fusion Space Team

---
${process.env.NEXT_PUBLIC_APP_URL}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Fusion Space</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                🚀 Welcome to Fusion Space!
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 24px;">
                Hi ${firstName},
              </p>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 24px;">
                Welcome to <strong>Fusion Space</strong>! We're thrilled to have you here. You're now ready to start creating professional websites in minutes with our AI-powered generator.
              </p>
              
              <h2 style="margin: 30px 0 20px; color: #111827; font-size: 20px; font-weight: 600;">
                Here's what you can do next:
              </h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #9333ea;">
                    <h3 style="margin: 0 0 8px; color: #111827; font-size: 16px; font-weight: 600;">
                      1. Create Your First Website
                    </h3>
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                      Jump right in and start building!
                    </p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/generator" style="display: inline-block; padding: 10px 20px; background-color: #9333ea; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
                      Start Building →
                    </a>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 15px 0;">
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #ec4899;">
                    <h3 style="margin: 0 0 8px; color: #111827; font-size: 16px; font-weight: 600;">
                      2. Explore Pro Features
                    </h3>
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                      Upgrade for unlimited websites and advanced features
                    </p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/generator/pricing" style="display: inline-block; padding: 10px 20px; background-color: #ec4899; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
                      View Pricing →
                    </a>
                  </td>
                </tr>
              </table>
              
              <h2 style="margin: 30px 0 15px; color: #111827; font-size: 18px; font-weight: 600;">
                ✨ Quick Tips:
              </h2>
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 22px;">
                <li style="margin-bottom: 8px;">Start with a template to save time</li>
                <li style="margin-bottom: 8px;">Use the preview feature to see changes live</li>
                <li style="margin-bottom: 8px;">Export your site anytime and host anywhere</li>
              </ul>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #eff6ff; border-radius: 6px; border: 1px solid #bfdbfe;">
                <h3 style="margin: 0 0 10px; color: #1e40af; font-size: 16px; font-weight: 600;">
                  💬 Need Help?
                </h3>
                <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                  We're here for you! Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="color: #2563eb; text-decoration: underline;">help center</a>.
                </p>
              </div>
              
              <p style="margin: 30px 0 0; color: #374151; font-size: 16px; line-height: 24px;">
                Happy building!<br>
                <strong>The Fusion Space Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #9333ea; text-decoration: none;">Visit Fusion Space</a> • 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #6b7280; text-decoration: none;">Privacy</a> • 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #6b7280; text-decoration: none;">Terms</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center;">
                © 2026 Fusion Space Inc. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}

/**
 * Trial started confirmation
 */
export function trialStartedEmail(data: TrialStartedData): EmailTemplate {
  const firstName = data.name?.split(' ')[0] || 'there'
  
  return {
    subject: `Your ${data.plan} Trial Has Started! 🎉`,
    text: `
Hi ${firstName},

Great news! Your 14-day free trial of Fusion Space ${data.plan} has started.

Trial Details:
• Plan: ${data.plan}
• Trial ends: ${data.trialEndDate}
• No charge during trial

What's Included:
✓ Unlimited websites
✓ Unlimited pages per site
✓ Advanced SEO tools
✓ E-commerce features
✓ Booking system
✓ Custom domain support
✓ Priority support
✓ And much more!

Get Started:
Visit ${process.env.NEXT_PUBLIC_APP_URL}/generator to start building with Pro features.

After Your Trial:
Your trial is completely free with no credit card required. If you love it, your subscription will begin at $29.99/month after the trial period.

Questions?
Reply to this email anytime. We're here to help!

The Fusion Space Team
${process.env.NEXT_PUBLIC_APP_URL}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Trial Started</title>
</head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🎉 Your Trial Has Started!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Hi ${firstName},</p>
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Great news! Your <strong>14-day free trial</strong> of Fusion Space ${data.plan} has started.</p>
              
              <div style="margin: 20px 0; padding: 20px; background-color: #f0fdf4; border-radius: 6px; border-left: 4px solid #22c55e;">
                <h3 style="margin: 0 0 10px; color: #166534; font-size: 16px;">Trial Details:</h3>
                <p style="margin: 0; color: #166534; font-size: 14px;">
                  • Plan: <strong>${data.plan}</strong><br>
                  • Trial ends: <strong>${data.trialEndDate}</strong><br>
                  • No charge during trial
                </p>
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/generator" style="display: inline-block; margin: 20px 0; padding: 14px 28px; background-color: #9333ea; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                Start Building Now →
              </a>
              
              <p style="margin: 20px 0 0; color: #374151; font-size: 16px;">
                Happy building!<br>
                The Fusion Space Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}

/**
 * Trial ending reminder (3 days before)
 */
export function trialEndingEmail(data: TrialEndingData): EmailTemplate {
  const firstName = data.name?.split(' ')[0] || 'there'
  
  return {
    subject: `Your ${data.plan} Trial Ends in ${data.daysRemaining} Days`,
    text: `
Hi ${firstName},

Your 14-day free trial of Fusion Space ${data.plan} will end in ${data.daysRemaining} days.

We hope you've been enjoying the Pro features! To continue using them, no action is needed – your subscription will automatically begin at $29.99/month.

What happens next:
• ${data.daysRemaining} days: Trial ends
• Billing starts at $29.99/month
• Cancel anytime with no penalties

Don't want to continue?
You can cancel anytime from your account settings:
${process.env.NEXT_PUBLIC_APP_URL}/portal

Questions?
Reply to this email and we'll help you out.

The Fusion Space Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Trial Ending Soon</title></head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px;">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px; color: #111827; font-size: 24px;">Trial Ending Soon</h1>
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Hi ${firstName},</p>
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Your 14-day free trial of <strong>${data.plan}</strong> will end in <strong>${data.daysRemaining} days</strong>.</p>
              <div style="margin: 20px 0; padding: 20px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>What happens next:</strong><br>
                  • Billing starts at $29.99/month<br>
                  • Cancel anytime with no penalties
                </p>
              </div>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background: #6b7280; color: #fff; text-decoration: none; border-radius: 6px;">
                Manage Subscription
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}

/**
 * Subscription activated successfully
 */
export function subscriptionActiveEmail(data: SubscriptionActiveData): EmailTemplate {
  const firstName = data.name?.split(' ')[0] || 'there'
  
  return {
    subject: `Payment Successful - ${data.plan} Active`,
    text: `
Hi ${firstName},

Your payment was successful and your ${data.plan} subscription is now active!

Subscription Details:
• Plan: ${data.plan}
• Amount: ${data.amount}
• Next billing: ${data.nextBillingDate}

You now have full access to all Pro features. Thank you for your support!

Manage Your Subscription:
${process.env.NEXT_PUBLIC_APP_URL}/portal

Questions?
Reply to this email anytime.

The Fusion Space Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Payment Successful</title></head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px;">
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #fff; font-size: 28px;">✓ Payment Successful!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Hi ${firstName},</p>
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Your ${data.plan} subscription is now active!</p>
              <div style="margin: 20px 0; padding: 20px; background: #f0fdf4; border-radius: 6px;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                  <strong>Subscription Details:</strong><br>
                  • Plan: ${data.plan}<br>
                  • Amount: ${data.amount}<br>
                  • Next billing: ${data.nextBillingDate}
                </p>
              </div>
              <p style="margin: 20px 0; color: #374151; font-size: 16px;">Thank you for your support!</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}

/**
 * Subscription cancelled confirmation
 */
export function subscriptionCancelledEmail(data: SubscriptionCancelledData): EmailTemplate {
  const firstName = data.name?.split(' ')[0] || 'there'
  
  return {
    subject: 'Subscription Cancelled - We\'re Sorry to See You Go',
    text: `
Hi ${firstName},

Your ${data.plan} subscription has been cancelled. You'll continue to have access to Pro features until ${data.endDate}.

What's next:
• Pro access until: ${data.endDate}
• After that, you'll switch to the free Standard plan
• Your data and websites remain safe

We're sorry to see you go. If there's anything we can do better, please let us know by replying to this email.

Want to come back? You can reactivate anytime from your account settings.

The Fusion Space Team
${process.env.NEXT_PUBLIC_APP_URL}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Subscription Cancelled</title></head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px;">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px; color: #111827; font-size: 24px;">Subscription Cancelled</h1>
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Hi ${firstName},</p>
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Your ${data.plan} subscription has been cancelled.</p>
              <div style="margin: 20px 0; padding: 20px; background: #fef2f2; border-radius: 6px; border-left: 4px solid #ef4444;">
                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                  <strong>What's next:</strong><br>
                  • Pro access until: ${data.endDate}<br>
                  • Then: Free Standard plan<br>
                  • Your data remains safe
                </p>
              </div>
              <p style="margin: 20px 0; color: #374151; font-size: 16px;">We're sorry to see you go. If there's anything we can do better, please reply to this email.</p>
              <p style="margin: 20px 0; color: #6b7280; font-size: 14px;">The Fusion Space Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}
