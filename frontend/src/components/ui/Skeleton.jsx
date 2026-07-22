// components/ui/Skeleton.jsx
import '../../styles/animations.css';

export function SkeletonCard({ rows = 3, hasAvatar }) {
  return (
    <div className="skeleton-card">
      {hasAvatar && (
        <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
          <div className="skeleton skeleton-circle" style={{ width: 40, height: 40 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-line w-60" />
            <div className="skeleton skeleton-line w-40" style={{ marginTop: 6 }} />
          </div>
        </div>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-line"
          style={{ width: `${[80, 60, 40, 70, 50][i % 5]}%`, marginBottom: 10 }}
        />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="fade-in" style={{ padding: 32 }}>
      <div className="skeleton skeleton-line w-40" style={{ height: 28, marginBottom: 8 }} />
      <div className="skeleton skeleton-line w-60" style={{ height: 16, marginBottom: 32 }} />
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[1,2,3,4].map(i => <SkeletonCard key={i} rows={2} />)}
      </div>
      <div className="grid-2">
        <SkeletonCard rows={5} />
        <SkeletonCard rows={4} hasAvatar />
      </div>
    </div>
  );
}
