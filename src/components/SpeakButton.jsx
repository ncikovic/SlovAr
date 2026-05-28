import React, { useState } from "react";
import { speak } from "../utils/speech.js";

export default function SpeakButton({ text, lang, soundOn, label = "Listen" }) {
  const [status, setStatus] = useState("");

  function handleSpeak() {
    const result = speak(text, lang, soundOn);
    setStatus(result.message);
  }

  return (
    <span className="speakWrap">
      <button className="speakButton" type="button" onClick={handleSpeak}>
        <span className="soundMark" aria-hidden="true" />
        {label}
      </button>
      {status && <small role="status">{status}</small>}
    </span>
  );
}
