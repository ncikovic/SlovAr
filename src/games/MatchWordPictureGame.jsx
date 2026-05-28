import React, { useEffect, useMemo, useState } from "react";
import FeedbackPanel from "../components/FeedbackPanel.jsx";
import RewardBar from "../components/RewardBar.jsx";
import SpeakButton from "../components/SpeakButton.jsx";
import { levels } from "../data/games.js";
import { feedbackMessages } from "../data/rewards.js";
import { wordSets } from "../data/words.js";
import { badgeForGame, makeChoices, pickTranslated } from "../utils/gameHelpers.js";
import { speak } from "../utils/speech.js";

const gameId = "words";
const totalRounds = 6;

export default function MatchWordPictureGame({ level, settings, t, onFinish, onMap }) {
  const [round, setRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const words = wordSets[level];
  const lang = levels[level].speechLang;
  const target = words[round % words.length];
  const choices = useMemo(
    () => makeChoices(words, target, level === "easy" ? 3 : 4, "word"),
    [words, target, level],
  );

  useEffect(() => {
    speak(target.word, lang, settings.soundOn);
  }, [target.word, lang, settings.soundOn]);

  function choose(item) {
    if (feedback) return;

    if (item.word !== target.word) {
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
      message: `${pickTranslated(feedbackMessages.correctKeys, round, t)} ${target.word}`,
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
      <GameHeader title={t.gameWords} onMap={onMap} t={t} />
      <RewardBar stars={stars} badgeName={t.wordExplorer} showBadge={stars >= 5} t={t} />

      <div className="taskPanel">
        <p className="taskInstruction">{t.wordTarget}</p>
        <div className="wordDisplay">{target.word}</div>
        <SpeakButton
          text={target.word}
          lang={lang}
          soundOn={settings.soundOn}
          label={t.listen}
        />
        <div className="pictureChoiceGrid">
          {choices.map((item) => (
            <button
              key={item.word}
              type="button"
              onClick={() => choose(item)}
              aria-label={item.label}
            >
              <span className={`pictureShape ${item.picture}`} aria-hidden="true" />
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
