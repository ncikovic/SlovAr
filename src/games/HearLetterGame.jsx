import React, { useEffect, useMemo, useState } from "react";
import FeedbackPanel from "../components/FeedbackPanel.jsx";
import RewardBar from "../components/RewardBar.jsx";
import SpeakButton from "../components/SpeakButton.jsx";
import { levels } from "../data/games.js";
import { feedbackMessages } from "../data/rewards.js";
import { letterSets } from "../data/words.js";
import { badgeForGame, pickTranslated, rotateArray } from "../utils/gameHelpers.js";
import { speak } from "../utils/speech.js";

const gameId = "letters";
const totalRounds = 6;

function letterChoices(letters, target, level, round) {
  const count = level === "easy" ? 3 : 4;
  const others = letters.filter((letter) => letter !== target);
  return rotateArray([target, ...others.slice(0, count - 1)], round % count);
}

export default function HearLetterGame({ level, settings, t, onFinish, onMap }) {
  const [round, setRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const letters = letterSets[level];
  const lang = levels[level].speechLang;
  const target = letters[round % letters.length];
  const choices = useMemo(
    () => letterChoices(letters, target, level, round),
    [letters, target, level, round],
  );

  useEffect(() => {
    speak(target, lang, settings.soundOn);
  }, [target, lang, settings.soundOn]);

  function choose(letter) {
    if (feedback) return;

    if (letter !== target) {
      setFeedback({
        kind: "retry",
        message: pickTranslated(feedbackMessages.retryKeys, round, t),
        nextLabel: t.tryAgain,
      });
      return;
    }

    const nextStars = stars + 1;
    setStars(nextStars);
    setFeedback({
      kind: "correct",
      message: pickTranslated(feedbackMessages.correctKeys, round, t),
      nextStars,
    });
  }

  function nextRound() {
    const wasCorrect = feedback?.kind === "correct";
    const nextStars = feedback?.nextStars ?? stars;
    setFeedback(null);

    if (wasCorrect && round + 1 === totalRounds) {
      onFinish({
        gameId,
        starsEarned: nextStars,
        badgeId: nextStars >= 5 ? badgeForGame(gameId) : null,
      });
      return;
    }

    if (wasCorrect) setRound((current) => current + 1);
  }

  return (
    <section className="gameScreen">
      <GameHeader title={t.gameLetters} onMap={onMap} t={t} />
      <RewardBar stars={stars} badgeName={t.starListener} showBadge={stars >= 5} t={t} />

      <div className="taskPanel">
        <p className="taskInstruction">{t.instLetters}</p>
        <SpeakButton
          text={target}
          lang={lang}
          soundOn={settings.soundOn}
          label={t.listen}
        />
        <div className="letterChoiceGrid">
          {choices.map((letter) => (
            <button key={letter} type="button" onClick={() => choose(letter)}>
              {letter}
            </button>
          ))}
        </div>
        <p className="roundCount">{t.round} {round + 1} {t.of} {totalRounds}</p>
      </div>

      <FeedbackPanel feedback={feedback} onNext={nextRound} t={t} />
    </section>
  );
}

function GameHeader({ title, onMap, t }) {
  return (
    <header className="gameHeader">
      <button className="quietButton" type="button" onClick={onMap}>
        {t.map}
      </button>
      <h2>{title}</h2>
      <span />
    </header>
  );
}
