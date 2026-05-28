import React from "react";
import { games, levels } from "../data/games.js";
import { badges } from "../data/rewards.js";
import Mascot from "./Mascot.jsx";
import SpeakButton from "./SpeakButton.jsx";

export default function GameMap({
  level,
  progress,
  settings,
  t,
  onSelectGame,
  onSummary,
  onChangeLevel,
}) {
  return (
    <section className="mapScreen panelWide">
      <header className="screenHeader">
        <button className="quietButton" type="button" onClick={onChangeLevel}>
          {t.changeLevel}
        </button>
        <div>
          <p className="eyebrow">{t[levels[level].titleKey]}</p>
          <h2>{t.gameMapTitle}</h2>
        </div>
        <SpeakButton
          text={t.mapInstruction}
          lang={settings.language === "hr" ? "hr-HR" : "en-US"}
          soundOn={settings.soundOn}
          label={t.listen}
        />
      </header>

      <div className="mapStatus">
        <Mascot small />
        <p>{progress.totalStars} {t.stars}</p>
        <button type="button" onClick={onSummary}>
          {t.finalSummary}
        </button>
      </div>

      <div className="galaxyMap">
        {games.map((game, index) => {
          const badge = badges[game.badgeId];
          const earned = progress.badges.includes(game.badgeId);
          return (
            <article className={`mapPlanet planetSlot${index + 1}`} key={game.id}>
              <div className={`planetIcon ${game.planetClass}`} aria-hidden="true" />
              <div className="planetInfo">
                <p>{t[game.categoryKey]}</p>
                <h3>{t[game.titleKey]}</h3>
                <span>{t[game.instructionKey]}</span>
                <strong>{progress.starsPerGame[game.id]} {t.stars}</strong>
                {earned && <em>{t[badge.nameKey]}</em>}
              </div>
              <button type="button" onClick={() => onSelectGame(game.id)}>
                {t.play}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
