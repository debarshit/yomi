import posthog from 'posthog-js';

export const TELEMETRY_OPT_OUT_KEY = 'readest-telemetry-opt-out';
export const TELEMETRY_DECISION_KEY = 'readest-telemetry-decision';

export type TelemetryDecision = 'opt-in' | 'opt-out' | 'pending';

/** Fraction of new users shown the consent prompt; the rest are opted out silently. */
export const TELEMETRY_PROMPT_BUCKET_RATE = 0.1;

export const hasOptedOutTelemetry = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TELEMETRY_OPT_OUT_KEY) === 'true';
};

export const getTelemetryDecision = (): TelemetryDecision | null => {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(TELEMETRY_DECISION_KEY);
  if (value === 'opt-in' || value === 'opt-out' || value === 'pending') return value;
  return null;
};

export const setTelemetryDecision = (decision: TelemetryDecision) => {
  localStorage.setItem(TELEMETRY_DECISION_KEY, decision);
};

/** Returns true with probability TELEMETRY_PROMPT_BUCKET_RATE. */
export const rollIntoTelemetryPromptBucket = (rng: () => number = Math.random) => {
  return rng() < TELEMETRY_PROMPT_BUCKET_RATE;
};

export const captureEvent = (event: string, properties?: Record<string, unknown>) => {
  if (!hasOptedOutTelemetry()) {
    posthog.capture(event, properties);
  }
};

export const trackReaderBookOpened = (book: {
  id?: string;
  title?: string;
  format?: string;
  author?: string;
}) => {
  captureEvent('reader_book_opened', {
    book_id: book.id,
    title: book.title,
    format: book.format,
    author: book.author,
  });
};

export const trackReadingProgress = (
  bookId: string,
  progressPercentage: number,
  currentPage?: number,
  totalPages?: number,
) => {
  captureEvent('reading_progress_updated', {
    book_id: bookId,
    progress_percentage: Math.round(progressPercentage * 100) / 100,
    current_page: currentPage,
    total_pages: totalPages,
  });
};

export const trackReaderFeatureUsed = (
  feature:
    | 'tts'
    | 'auto_scroll'
    | 'drawing'
    | 'highlight'
    | 'note'
    | 'dictionary'
    | 'translation'
    | 'font_change'
    | 'theme_change'
    | 'search'
    | 'copy'
    | 'share'
    | 'quote_card'
    | 'proofread'
    | (string & {}),
  details?: Record<string, unknown>,
) => {
  captureEvent('reader_feature_used', {
    feature_name: feature,
    ...details,
  });
};

export const trackReadingSessionEnded = (
  book: {
    id?: string;
    title?: string;
    format?: string;
    author?: string;
  },
  durationSeconds: number,
  startProgress?: number,
  endProgress?: number,
  pagesRead?: number,
) => {
  captureEvent('reading_session_ended', {
    book_id: book.id,
    title: book.title,
    format: book.format,
    author: book.author,
    duration_seconds: durationSeconds,
    duration_minutes: Math.round((durationSeconds / 60) * 10) / 10,
    start_progress: startProgress != null ? Math.round(startProgress * 100) / 100 : undefined,
    end_progress: endProgress != null ? Math.round(endProgress * 100) / 100 : undefined,
    pages_read: pagesRead,
  });
};

export const trackBookImported = (book: {
  id?: string;
  title?: string;
  format?: string;
  source?: string;
}) => {
  captureEvent('book_imported', {
    book_id: book.id,
    title: book.title,
    format: book.format,
    source: book.source || 'local',
  });
};

export const trackBooksBatchImported = (
  count: number,
  formats: Record<string, number>,
  source?: string,
) => {
  captureEvent('books_batch_imported', {
    count,
    formats,
    source: source || 'local',
  });
};

export const trackLibraryStats = (stats: {
  totalBooks: number;
  formats: Record<string, number>;
  finishedBooks: number;
  readingBooks: number;
  unreadBooks: number;
}) => {
  captureEvent('library_stats', {
    total_books: stats.totalBooks,
    formats: stats.formats,
    finished_books: stats.finishedBooks,
    reading_books: stats.readingBooks,
    unread_books: stats.unreadBooks,
  });
};

export const trackYomiSignupClicked = (platform: string) => {
  captureEvent('yomi_signup_clicked', {
    from_platform: platform,
    source: 'yomi',
  });
};

// Boot records the decision before PostHog starts; `applyPostHogConsent`
// hands it to the SDK once init has set the project token. A consent call
// before init would be stored under a token-less key that nothing reads.
export const optInTelemetry = () => {
  localStorage.setItem(TELEMETRY_OPT_OUT_KEY, 'false');
  setTelemetryDecision('opt-in');
  if (posthog.__loaded) posthog.opt_in_capturing();
};
export const optOutTelemetry = () => {
  localStorage.setItem(TELEMETRY_OPT_OUT_KEY, 'true');
  setTelemetryDecision('opt-out');
  if (posthog.__loaded) posthog.opt_out_capturing();
};

/**
 * Apply the recorded decision to PostHog right after init. This runs on every
 * boot, so an opt-in is restored without the SDK's default `$opt_in` event.
 */
export const applyPostHogConsent = () => {
  const decision = getTelemetryDecision();
  if (decision === 'opt-out' || decision === 'pending' || hasOptedOutTelemetry()) {
    posthog.opt_out_capturing();
  } else {
    posthog.opt_in_capturing({ captureEventName: false });
  }
};

/**
 * Line PostHog's consent up with the saved setting. The switch can change
 * from the settings panel, the command palette, or another window, so this
 * runs on every boot. It enforces an opt-out only: a recorded opt-out stays
 * even when the settings file says enabled, because a failed or interrupted
 * settings save must not re-enable capture. Turning telemetry back on goes
 * through the explicit controls, which update both stores.
 *
 * Returns the effective setting, so the caller can switch a stale `true` in
 * the settings file off and the settings panel shows what is in effect.
 */
export const reconcileTelemetryConsent = (telemetryEnabled: boolean) => {
  if (!telemetryEnabled && !hasOptedOutTelemetry()) {
    optOutTelemetry();
  }
  return !hasOptedOutTelemetry();
};
