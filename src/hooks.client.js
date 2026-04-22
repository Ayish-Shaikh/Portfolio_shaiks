import { dev } from '$app/environment';
import { handleErrorWithSentry, init as initSentry } from '@sentry/sveltekit';

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

// Only initialize Sentry if DSN is configured
if (dsn && dsn.trim() !== '' && dsn !== 'https://your-sentry-dsn@sentry.io/project-id') {
  initSentry({
    dsn,
    environment: dev ? 'development' : 'production',
    tracesSampleRate: dev ? 1.0 : 0.1,

    // Performance monitoring
    integrations: [],

    // Release tracking
    release: 'ayishshaikh.vercel.app@' + (dev ? 'dev' : '1.0.0'),

    // Error filtering
    beforeSend(event) {
      // Filter out development errors in production
      if (!dev && event.exception) {
        console.error('Error captured by Sentry:', event.exception);
      }
      return event;
    }
  });
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();

export function init() {}