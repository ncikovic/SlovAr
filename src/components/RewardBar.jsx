import React from "react";

export default function RewardBar({ stars, badgeName, showBadge, t }) {
  const progress = Math.min(100, (stars % 5) * 20);

  return (
    <section className="rewardBar" aria-label="Stars and badge progress">
      <div className="starReadout">
        <span className="cssStar" aria-hidden="true" />
        <strong>{stars}</strong>
        <span>{t.stars}</span>
      </div>
      <div className="badgeTrack" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className={`badgeMini ${showBadge ? "badgePop" : ""}`}>
        {badgeName ?? t.nextBadge}
      </div>
    </section>
  );
}
