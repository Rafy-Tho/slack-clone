import * as Sentry from '@sentry/node';
import { ENV } from './src/config/env.js';
Sentry.init({
  dsn: ENV.SENTRY_DSN,
  environment: ENV.NODE_ENV,
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  includeLocalVariables: true,
  sendDefaultPii: true,
});
