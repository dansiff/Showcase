# Email Customization Guide

## How to Customize Supabase Authentication Emails

### Step 1: Access Email Templates in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

---

### Step 2: Customize the "Confirm Signup" Template

Click on **Confirm Signup** template and replace with this custom template:

```html
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 32px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 32px;
    }
    .content h2 {
      color: #1f2937;
      font-size: 24px;
      margin: 0 0 16px 0;
    }
    .content p {
      color: #6b7280;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 16px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #9ca3af;
      font-size: 14px;
      margin: 0;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Welcome to Showcase</h1>
    </div>
    
    <div class="content">
      <h2>Confirm Your Email</h2>
      <p>Hi there! 👋</p>
      <p>
        Thanks for signing up for Showcase! We're excited to have you join our community 
        of creators and fans.
      </p>
      <p>
        To complete your registration and start exploring, please confirm your email 
        address by clicking the button below:
      </p>
      
      <center>
        <a href="{{ .ConfirmationURL }}" class="button">
          Confirm Email Address
        </a>
      </center>
      
      <p style="margin-top: 32px; font-size: 14px; color: #9ca3af;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="{{ .ConfirmationURL }}" style="color: #667eea; word-break: break-all;">
          {{ .ConfirmationURL }}
        </a>
      </p>
      
      <p style="margin-top: 24px; font-size: 14px; color: #9ca3af;">
        This link will expire in 24 hours. If you didn't create an account, you can 
        safely ignore this email.
      </p>
    </div>
    
    <div class="footer">
      <p>
        © 2025 Showcase. All rights reserved.<br>
        <a href="{{ .SiteURL }}">Visit our website</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

### Step 3: Update Email Settings

In **Authentication** → **Settings** → **Email Settings**:

1. **Sender Name**: Change from "Supabase" to "Showcase Team"
2. **Sender Email**: Use your custom domain email (e.g., `noreply@showcase.com`)
3. **Email Provider**: Consider upgrading to a custom SMTP provider like SendGrid or AWS SES for production

---

### Step 4: Configure Redirect URLs

In **Authentication** → **URL Configuration**:

1. **Site URL**: 
   - Dev: `http://localhost:3000`
   - Production: `https://your-domain.com`

2. **Redirect URLs** (add both):
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

---

### Step 5: Test the Email Flow

1. Sign up with a new email address
2. Check your inbox for the confirmation email
3. Click the confirmation link
4. Verify you're redirected to `/auth/confirm` page
5. Check that you're then redirected to sign in

---

## Advanced: Custom Email Provider (Production)

For production, use a dedicated email service:

### Option 1: SendGrid (Recommended)

1. Sign up at [SendGrid](https://sendgrid.com)
2. Get your API key
3. In Supabase Dashboard → **Authentication** → **SMTP Settings**:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **Username**: `apikey`
   - **Password**: Your SendGrid API key
   - **Sender Email**: Your verified email
   - **Sender Name**: Showcase Team

### Option 2: AWS SES

1. Set up AWS SES and verify your domain
2. Get SMTP credentials
3. Configure in Supabase SMTP settings

### Option 3: Resend (Modern Alternative)

1. Sign up at [Resend](https://resend.com)
2. Get API key
3. Follow similar SMTP setup

---

## Email Template Variables

Available variables in email templates:

- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .SiteURL }}` - Your site URL
- `{{ .Token }}` - Confirmation token
- `{{ .TokenHash }}` - Hashed token
- `{{ .Email }}` - User's email address

---

## Quick Settings Summary

**For Development:**
- ✅ Keep email confirmation enabled (for testing)
- ✅ Set Site URL to `http://localhost:3000`
- ✅ Add redirect URL: `http://localhost:3000/auth/callback`
- ✅ Use Supabase's built-in email service

**For Production:**
- ✅ Use custom SMTP provider (SendGrid/SES)
- ✅ Set Site URL to your production domain
- ✅ Add redirect URL: `https://your-domain.com/auth/callback`
- ✅ Customize sender name and email
- ✅ Verify email domain for better deliverability

---

## Troubleshooting

**Emails going to spam:**
- Set up SPF, DKIM, and DMARC records for your domain
- Use a verified sender email
- Use a dedicated email service provider

**Confirmation link not working:**
- Check redirect URLs are correct in Supabase
- Verify `/auth/callback` page exists and works
- Check browser console for errors

**Not receiving emails:**
- Check spam folder
- Verify email address is correct
- Check Supabase logs for email delivery status
