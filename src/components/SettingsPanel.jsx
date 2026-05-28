import React from "react";
import { clearProgress } from "../utils/storage.js";

export default function SettingsPanel({ open, settings, t, onChange, onClose, onReset }) {
  if (!open) return null;

  function updateSetting(key, value) {
    onChange({ ...settings, [key]: value });
  }

  function resetAll() {
    clearProgress();
    onReset();
    onClose();
  }

  return (
    <div className="settingsLayer">
      <section className="settingsPanel" aria-label={t.settings}>
        <header>
          <h2>{t.settings}</h2>
          <button className="quietButton" type="button" onClick={onClose}>
            {t.close}
          </button>
        </header>

        <label className="settingRow">
          <span>{t.sound}</span>
          <input
            type="checkbox"
            checked={settings.soundOn}
            onChange={(event) => updateSetting("soundOn", event.target.checked)}
          />
        </label>

        <div className="settingGroup">
          <span>{t.language}</span>
          <button
            type="button"
            className={settings.language === "hr" ? "selected" : ""}
            onClick={() => updateSetting("language", "hr")}
          >
            {t.croatian}
          </button>
          <button
            type="button"
            className={settings.language === "en" ? "selected" : ""}
            onClick={() => updateSetting("language", "en")}
          >
            {t.english}
          </button>
        </div>

        <div className="settingGroup">
          <span>{t.textSize}</span>
          <button
            type="button"
            className={settings.textSize === "normal" ? "selected" : ""}
            onClick={() => updateSetting("textSize", "normal")}
          >
            {t.normal}
          </button>
          <button
            type="button"
            className={settings.textSize === "large" ? "selected" : ""}
            onClick={() => updateSetting("textSize", "large")}
          >
            {t.large}
          </button>
        </div>

        <div className="settingGroup">
          <span>{t.contrast}</span>
          <button
            type="button"
            className={settings.contrast === "default" ? "selected" : ""}
            onClick={() => updateSetting("contrast", "default")}
          >
            {t.defaultContrast}
          </button>
          <button
            type="button"
            className={settings.contrast === "high" ? "selected" : ""}
            onClick={() => updateSetting("contrast", "high")}
          >
            {t.highContrast}
          </button>
        </div>

        <button className="dangerButton" type="button" onClick={resetAll}>
          {t.resetProgress}
        </button>
      </section>
    </div>
  );
}
