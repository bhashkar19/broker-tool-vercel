import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // Adjust this in production to reduce costs
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Add useful context
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV !== 'production') {
      return null;
    }

    // Log to console for debugging
    console.error('Sentry capturing error:', hint.originalException || hint.syntheticException);

    // Add extra context for server errors
    if (event.contexts) {
      event.contexts.runtime = {
        name: 'Node',
        version: process.version,
      };
    }

    return event;
  },

  // Filter out known noisy errors
  ignoreErrors: [
    // Database timeout errors (handled gracefully)
    'PGRST',
    // Supabase errors that are expected
    'FetchError',
  ],
});
