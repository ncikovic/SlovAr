import React, { useEffect, useMemo, useState } from "react";
import FeedbackPanel from "../components/FeedbackPanel.jsx";
import RewardBar from "../components/RewardBar.jsx";
import SpeakButton from "../components/SpeakButton.jsx";
import { levels } from "../data/games.js";
import { feedbackMessages } from "../data/rewards.js";
import { memorySets } from "../data/words.js";
import {
  badgeForGame,
  generateLetterChoices,
  pickTranslated,
  rotateArray,
} from "../utils/gameHelpers.js";
import { speakLetterSequence } from "../utils/speech.js";

const gameId = "memory";
const totalRounds = 5;
const colorClasses = ["tileBlue", "tileGreen", "tileGold", "tilePink"];

function makeSequence(letters, level, round) {
  const baseLength = level === "easy" ? 2 : 3;
  const maxLength = level === "easy" ? 3 : 4;
  const length = Math.min(maxLength, baseLength + Math.floor(round / 2));
  return Array.from({ length }, (_, index) => letters[(round + index) % letters.length]);
}

function colorFor(index, round) {
  return rotateArray(colorClasses, round)[index % colorClasses.length];
}

export default function MemorySequenceGame({ level, settings, t, onFinish, onMap }) {
  const [round, setRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [listening, setListening] = useState(true);
  const [answer, setAnswer] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const letters = memorySets[level];
  const lang = levels[level].speechLang;
  const sequence = useMemo(() => makeSequence(letters, level, round), [letters, level, round]);
  const choices = useMemo(
    () => generateLetterChoices(letters, sequence, level, round),
    [letters, sequence, level, round],
  );

  useEffect(() => {
    playSequence();
  }, [round]);

  function playSequence() {
    setListening(true);
    setAnswer([]);
    speakLetterSequence(sequence, lang, settings.soundOn, 760);
    window.setTimeout(() => setListening(false), sequence.length * 760 + 450);
  }

  function choose(letter) {
    if (listening || feedback) return;

    const nextAnswer = [...answer, letter];
    const expected = sequence[nextAnswer.length - 1];

    if (letter !== expected) {
      setAnswer([]);
      setFeedback({
        kind: "retry",
        message: t[feedbackMessages.sequenceRetryKey],
        nextLabel: t.tryAgain,
      });
      return;
    }

    setAnswer(nextAnswer);

    if (nextAnswer.length === sequence.length) {
      const nextStars = stars + 1;
      setStars(nextStars);
      setFeedback({
        kind: "correct",
        message: pickTranslated(feedbackMessages.correctKeys, round, t),
        nextStars,
      });
    }
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
      <header className="gameHeader">
        <button className="quietButton" type="button" onClick={onMap}>
          {t.map}
        </button>
        <h2>{t.gameMemory}</h2>
        <span />
      </header>
      <RewardBar stars={stars} badgeName={t.memoryPilot} showBadge={stars >= 5} t={t} />

      <div className="taskPanel">
        <p className="taskInstruction">
          {listening ? t.listenCarefully : t.chooseLettersOrder}
        </p>
        <SpeakButton
          text={t.instMemory}
          lang={settings.language === "hr" ? "hr-HR" : "en-US"}
          soundOn={settings.soundOn}
          label={t.listen}
        />

        <div className="selectedSequence" aria-label={t.selected}>
          {answer.length ? answer.join("  ") : t.selected}
        </div>

        {listening ? (
          <div className="listeningCard" role="status">
            <span className="listeningPulse" aria-hidden="true" />
            <strong>{t.listenCarefully}</strong>
          </div>
        ) : (
          <div className="memoryChoiceGrid letterMemoryGrid">
            {choices.map((letter, index) => (
              <button
                key={`${letter}-${index}`}
                className={`memoryCard ${colorFor(index, round)}`}
                type="button"
                onClick={() => choose(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        <button className="secondaryButton" type="button" onClick={playSequence}>
          {t.listenAgain}
        </button>
        <p className="roundCount">{t.round} {round + 1} {t.of} {totalRounds}</p>
      </div>

      <FeedbackPanel feedback={feedback} onNext={nextRound} t={t} />
    </section>
  );
}
