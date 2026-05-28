import React from "react";
import Mascot from "./Mascot.jsx";
import SpeakButton from "./SpeakButton.jsx";

export default function StartScreen({ level, settings, t, onStart }) {
  const speechLang = settings.language === "hr" ? "hr-HR" : "en-US";

  return (
    <section className="heroScreen panelWide">
      <div className="heroText">
        <p className="eyebrow">{t.galaxy}</p>
        <h1>{t.startTitle}</h1>
        <p className="subtitle">{t.startSubtitle}</p>
        <p className="accessHint">{t.startHint}</p>

        <div className="heroActions">
          <button className="primaryButton" type="button" onClick={onStart}>
            {t.startAdventure}
          </button>
          <SpeakButton
            text={t.startInstruction}
            lang={speechLang}
            soundOn={settings.soundOn}
            label={t.listenInstructions}
          />
        </div>
      </div>

      <div className="heroGuide" aria-label={t.guide}>
        <Mascot />
        <div className="guideBubble">
          <strong>{t.guide}</strong>
          <span>{t.guideText}</span>
        </div>
      </div>
    </section>
  );
}
