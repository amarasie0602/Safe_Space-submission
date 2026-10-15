// Suspense fallback for lazy-loaded routes (admin, counselor portal). Kept
// intentionally minimal and still — a loading state shouldn't itself be a
// distraction.
const PageLoading = () => (
  <div className="page-loading" role="status" aria-live="polite">
    <span className="page-loading-dot" aria-hidden="true" />
    <span className="sr-only">Loading…</span>
  </div>
);

export default PageLoading;
