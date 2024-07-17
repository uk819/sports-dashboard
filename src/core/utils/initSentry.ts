
import * as Sentry from '@sentry/react';

export default (client: string)=> {
  const _pcDsn = 'https://2aa597d474565a2706b67ab5aa07b240@www.p619tp.com/3';
  const _h5Dsn = 'https://ad92399d7d0da21eac3516357c1cc93f@www.p619tp.com/4';
  // @ts-ignore
  if (!__DEV_MODE__) {
    Sentry.init({
      dsn: client==='pc'?_pcDsn:_h5Dsn,
      release: process.env.SENTRY_RELEASE_VERSION,
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }
};


