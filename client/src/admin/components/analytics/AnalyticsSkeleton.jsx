import "./analytics.css";

function SkeletonCard() {
  return (
    <div className="analytics-skeleton-card">
      <div className="analytics-skeleton analytics-skeleton-icon" />

      <div className="analytics-skeleton analytics-skeleton-title" />

      <div className="analytics-skeleton analytics-skeleton-value" />

      <div className="analytics-skeleton analytics-skeleton-text" />
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="analytics-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default AnalyticsSkeleton;
