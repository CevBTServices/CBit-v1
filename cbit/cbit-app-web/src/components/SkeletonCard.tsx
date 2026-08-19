import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    // skeleton-card ve shimmer animasyonuyla yumuşak bir yüklenme durumu hissi yaratılıyor
    <div className="skeleton-card skeleton-shimmer">
      <div className="skeleton-img" />
      <div className="skeleton-title" />
      <div className="skeleton-text" />
      <div className="skeleton-text" />
      <div className="skeleton-text short" />
    </div>
  );
};
