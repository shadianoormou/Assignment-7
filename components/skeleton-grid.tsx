export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="লোড হচ্ছে">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-icon" />
          <div className="skeleton skeleton-line wide" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-price" />
        </div>
      ))}
    </div>
  );
}
