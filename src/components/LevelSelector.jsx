import React from "react";
import { levels } from "../data/games.js";
import SpeakButton from "./SpeakButton.jsx";

export default function LevelSelector({ level, settings, t, onChoose, onBack }) {
  const speechLang = settings.language === "hr" ? "hr-HR" : "en-US";

  return (
    <section className="levelScreen panelWide">
      <header className="screenHeader">
        <button className="quietButton" type="button" onClick={onBack}>
          {t.back}
        </button>
        <div>
          <p className="eyebrow">{t.choosePath}</p>
          <h2>{t.chooseLevel}</h2>
        </div>
        <SpeakButton
          text={t.levelInstruction}
          lang={speechLang}
          soundOn={settings.soundOn}
          label={t.listen}
        />
      </header>

      <div className="levelGrid">
        {Object.values(levels).map((item) => (
          <button
            className={`levelCard ${level === item.id ? "selected" : ""}`}
            key={item.id}
            type="button"
            onClick={() => onChoose(item.id)}
            aria-pressed={level === item.id}
          >
            <span className={`levelOrb ${item.id}`} aria-hidden="true" />
            <strong>{t[item.titleKey]}</strong>
            <span>{t[item.languageKey]}</span>
            <small>{t[item.detailKey]}</small>
            <small>{t[item.recommendedKey]}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
