import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

// Initialize Vercel Analytics
injectAnalytics({ mode: dev ? 'development' : 'production' });

// This enables prerendering for all pages
export const prerender = true;
