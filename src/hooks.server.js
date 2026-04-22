import { dev } from '$app/environment';
import { handleErrorWithSentry, init } from '@sentry/sveltekit';

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn && dsn.trim() !== '' && dsn !== 'https://your-sentry-dsn@sentry.io/project-id') {
  init({
    dsn,
    environment: dev ? 'development' : 'production',
    tracesSampleRate: dev ? 1.0 : 0.1,
    integrations: [],
    release: 'ayishshaikh.vercel.app@' + (dev ? 'dev' : '1.0.0'),
  });
}

export const handleError = handleErrorWithSentry();