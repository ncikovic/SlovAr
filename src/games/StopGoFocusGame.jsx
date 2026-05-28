import React, { useEffect, useMemo, useRef, useState } from "react";
import RewardBar from "../components/RewardBar.jsx";
import SpeakButton from "../components/SpeakButton.jsx";
import { levels } from "../data/games.js";
import { feedbackMessages } from "../data/rewards.js";
import { badgeForGame } from "../utils/gameHelpers.js";
import { speak } from "../utils/speech.js";

const gameId = "focus";
const totalSeconds = 40;

export default function StopGoFocusGame({ level, settings, t, onFinish, onMap }) {
  const [seconds, setSeconds] = useState(totalSeconds);
  const [signal, setSignal] = useState("stop");
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState(t.focusWait);
  const starsRef = useRef(0);
  const clickedStopRef = useRef(false);
  const lang = levels[level].speechLang;
  const instruction = useMemo(
    () => t.focusInstruction,
    [t],
  );

  useEffect(() => {
    speak(instruction, lang, settings.soundOn);
  }, [instruction, lang, settings.soundOn]);

  useEffect(() => {
    setMessage(t.focusWait);
  }, [t.focusWait]);

  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          onFinish({
            gameId,
            starsEarned: starsRef.current,
            badgeId: starsRef.current >= 5 ? badgeForGame(gameId) : null,
          });
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [onFinish]);

  useEffect(() => {
    const signalTimer = window.setInterval(() => {
      setSignal((current) => {
        if (current === "stop" && !clickedStopRef.current) {
          addStar(t.focusGoodWait);
        }
        clickedStopRef.current = false;
        return current === "go" ? "stop" : "go";
      });
    }, 1800);

    return () => window.clearInterval(signalTimer);
  }, [t]);

  function addStar(nextMessage) {
    setStars((current) => current + 1);
    setMessage(nextMessage);
  }

  function tapSignal() {
    if (signal === "go") {
      addStar(t.focusGreat);
      return;
    }

    clickedStopRef.current = true;
    setMessage(t[feedbackMessages.waitRetryKey]);
  }

  return (
    <section className="gameScreen">
      <header className="gameHeader">
        <button className="quietButton" type="button" onClick={onMap}>
          {t.map}
        </button>
        <h2>{t.gameFocus}</h2>
        <span />
      </header>
      <RewardBar stars={stars} badgeName={t.focusCaptain} showBadge={stars >= 5} t={t} />

      <div className="taskPanel focusPanel">
        <p className="taskInstruction">{t.instFocus}</p>
        <SpeakButton
          text={instruction}
          lang={lang}
          soundOn={settings.soundOn}
          label={t.listen}
        />
        <button
          className={`signalOrb ${signal}`}
          type="button"
          onClick={tapSignal}
          aria-label={signal === "go" ? "GO" : "STOP"}
        >
          <span>{signal === "go" ? "GO" : "STOP"}</span>
        </button>
        <p className="focusMessage" role="status">{message}</p>
        <div className="softTimer" aria-label={`${seconds} ${t.secondsLeft}`}>
          <span style={{ width: `${(seconds / totalSeconds) * 100}%` }} />
        </div>
        <p className="roundCount">{t.focusGlow}</p>
      </div>
    </section>
  );
}
