/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Avoid failing the production build on ESLint issues
		ignoreDuringBuilds: true,
	},
	async headers() {
		const securityHeaders = [
			// Prevent MIME type sniffing
			{ key: 'X-Content-Type-Options', value: 'nosniff' },
			// Basic clickjacking protection
			{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
			// Referrer policy
			{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
			// HSTS (enabled only on HTTPS; Vercel serves HTTPS in prod)
			{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
			// Enable a report-only CSP to observe violations without breaking the app
			{
				key: 'Content-Security-Policy-Report-Only',
				value: [
					"default-src 'self'",
					// Allow Next.js images, fonts, and inline styles in dev
					"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
					"font-src 'self' https://fonts.gstatic.com data:",
					// Supabase endpoints
					"connect-src 'self' https: wss:",
					// Media and images
					"img-src 'self' data: blob: https:",
					// Scripts (allow Stripe, Supabase, and Next.js runtime)
					"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com",
					// Frames (Stripe Checkout)
					"frame-src https://js.stripe.com https://hooks.stripe.com https://*.supabase.co",
				].join('; '),
			},
		];

		return [
			{
				source: '/(.*)',
				headers: securityHeaders,
			},
		];
	},
};

module.exports = nextConfig;
