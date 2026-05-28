import React, { useEffect, useMemo, useState } from "react";
import StartScreen from "./components/StartScreen.jsx";
import LevelSelector from "./components/LevelSelector.jsx";
import GameMap from "./components/GameMap.jsx";
import EndScreen from "./components/EndScreen.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import HearLetterGame from "./games/HearLetterGame.jsx";
import MatchWordPictureGame from "./games/MatchWordPictureGame.jsx";
import MemorySequenceGame from "./games/MemorySequenceGame.jsx";
import StopGoFocusGame from "./games/StopGoFocusGame.jsx";
import { defaultProgress, loadProgress, saveProgress } from "./utils/storage.js";
import { badges } from "./data/rewards.js";
import { getTranslations } from "./data/translations.js";

const gameComponents = {
  letters: HearLetterGame,
  words: MatchWordPictureGame,
  memory: MemorySequenceGame,
  focus: StopGoFocusGame,
};

const defaultSettings = {
  soundOn: true,
  textSize: "normal",
  contrast: "default",
  language: "hr",
};

export default function App() {
  const [screen, setScreen] = useState("start");
  const [selectedGame, setSelectedGame] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress() ?? defaultProgress);
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const ActiveGame = selectedGame ? gameComponents[selectedGame] : null;
  const t = getTranslations(settings.language);
  const appClass = [
    "appShell",
    settings.textSize === "large" ? "largeText" : "",
    settings.contrast === "high" ? "highContrast" : "",
  ].join(" ");

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const earnedBadgeNames = useMemo(
    () => progress.badges.map((badgeId) => t[badges[badgeId]?.nameKey]).filter(Boolean),
    [progress.badges, t],
  );

  function chooseLevel(level) {
    setProgress((current) => ({ ...current, selectedLevel: level }));
    setScreen("map");
  }

  function startGame(gameId) {
    setSelectedGame(gameId);
    setLastResult(null);
    setScreen("game");
  }

  function finishGame(result) {
    setLastResult(result);
    setProgress((current) => {
      const nextStars = current.totalStars + result.starsEarned;
      const badgeId = result.badgeId;
      const hasBadge = badgeId && current.badges.includes(badgeId);

      return {
        ...current,
        totalStars: nextStars,
        starsPerGame: {
          ...current.starsPerGame,
          [result.gameId]: current.starsPerGame[result.gameId] + result.starsEarned,
        },
        completedGames: Array.from(new Set([...current.completedGames, result.gameId])),
        badges: badgeId && !hasBadge ? [...current.badges, badgeId] : current.badges,
      };
    });
    setScreen("gameEnd");
  }

  function resetProgress() {
    setProgress(defaultProgress);
    setSelectedGame(null);
    setLastResult(null);
    setScreen("start");
  }

  function playAgain() {
    if (selectedGame) setScreen("game");
  }

  return (
    <main className={appClass}>
      <div className="spaceBackdrop" aria-hidden="true">
        <div className="planet" />
        <div className="constellation pathOne" />
        <div className="constellation pathTwo" />
        <span className="star starA" />
        <span className="star starB" />
        <span className="star starC" />
        <span className="star starD" />
      </div>

      <button
        className="settingsToggle"
        type="button"
        onClick={() => setSettingsOpen(true)}
      >
        {t.settings}
      </button>

      <div className="screenWrap">
        {screen === "start" && (
          <StartScreen
            level={progress.selectedLevel}
            settings={settings}
            t={t}
            onStart={() => setScreen("level")}
          />
        )}

        {screen === "level" && (
          <LevelSelector
            level={progress.selectedLevel}
            settings={settings}
            t={t}
            onChoose={chooseLevel}
            onBack={() => setScreen("start")}
          />
        )}

        {screen === "map" && (
          <GameMap
            level={progress.selectedLevel}
            progress={progress}
            settings={settings}
            t={t}
            onSelectGame={startGame}
            onSummary={() => setScreen("summary")}
            onChangeLevel={() => setScreen("level")}
          />
        )}

        {screen === "game" && ActiveGame && (
          <ActiveGame
            level={progress.selectedLevel}
            settings={settings}
            t={t}
            onFinish={finishGame}
            onMap={() => setScreen("map")}
          />
        )}

        {screen === "gameEnd" && (
          <EndScreen
            mode="game"
            result={lastResult}
            progress={progress}
            badgeNames={earnedBadgeNames}
            t={t}
            onPlayAgain={playAgain}
            onMap={() => setScreen("map")}
            onContinue={() => setScreen("summary")}
            onChangeLevel={() => setScreen("level")}
          />
        )}

        {screen === "summary" && (
          <EndScreen
            mode="summary"
            progress={progress}
            badgeNames={earnedBadgeNames}
            t={t}
            onPlayAgain={() => setScreen("map")}
            onMap={() => setScreen("map")}
            onContinue={() => setScreen("map")}
            onChangeLevel={() => setScreen("level")}
          />
        )}
      </div>

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        t={t}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
        onReset={resetProgress}
      />
    </main>
  );
}
