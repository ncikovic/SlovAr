import React from "react";
import { games } from "../data/games.js";
import { badges } from "../data/rewards.js";

export default function EndScreen({
  mode,
  result,
  progress,
  badgeNames,
  t,
  onPlayAgain,
  onMap,
  onContinue,
  onChangeLevel,
}) {
  const isSummary = mode === "summary";
  const completedNames = progress.completedGames
    .map((gameId) => {
      const game = games.find((item) => item.id === gameId);
      return game ? t[game.titleKey] : "";
    })
    .filter(Boolean);
  const badgeName = result?.badgeId ? t[badges[result.badgeId]?.nameKey] : null;

  return (
    <section className="endScreen panelWide">
      <p className="eyebrow">{isSummary ? t.finalSummary : t.missionComplete}</p>
      <h2>{isSummary ? t.adventureComplete : t.gameComplete}</h2>

      <div className="summaryGrid">
        <div className="summaryCard">
          <span>{isSummary ? t.totalStars : t.starsThisGame}</span>
          <strong>{isSummary ? progress.totalStars : result?.starsEarned ?? 0}</strong>
        </div>
        {!isSummary && (
          <div className="summaryCard">
            <span>{t.totalStars}</span>
            <strong>{progress.totalStars}</strong>
          </div>
        )}
        <div className="summaryCard">
          <span>{t.completedGames}</span>
          <strong>{progress.completedGames.length}</strong>
        </div>
        <div className="summaryCard">
          <span>{t.badges}</span>
          <strong>{progress.badges.length}</strong>
        </div>
      </div>

      {!isSummary && <p className="resultMessage">{t.positiveMessage} {t.readyMessage}</p>}

      {!isSummary && badgeName && (
        <div className="earnedBadge levelUp">
          <span className="badgeIcon" aria-hidden="true" />
          <strong>{badgeName}</strong>
        </div>
      )}

      {isSummary && (
        <div className="finalList">
          <p>{t.finalMessage}</p>
          <span>{completedNames.length ? completedNames.join(", ") : t.noCompletedGames}</span>
          <span>{badgeNames.length ? badgeNames.join(", ") : t.badgesWaiting}</span>
        </div>
      )}

      <div className="endActions">
        <button className="primaryButton" type="button" onClick={onPlayAgain}>
          {t.playAgain}
        </button>
        <button type="button" onClick={onMap}>
          {t.backToMap}
        </button>
        <button type="button" onClick={onContinue}>
          {t.continueAdventure}
        </button>
        <button className="quietButton" type="button" onClick={onChangeLevel}>
          {t.changeLevel}
        </button>
      </div>
    </section>
  );
}
