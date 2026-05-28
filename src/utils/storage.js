const storageKey = "slovaj-progress-v2";

export const defaultProgress = {
  selectedLevel: "easy",
  totalStars: 0,
  completedGames: [],
  badges: [],
  starsPerGame: {
    letters: 0,
    words: 0,
    memory: 0,
    focus: 0,
  },
};

export function loadProgress() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return {
      ...defaultProgress,
      ...parsed,
      starsPerGame: {
        ...defaultProgress.starsPerGame,
        ...(parsed.starsPerGame ?? {}),
      },
      completedGames: parsed.completedGames ?? [],
      badges: parsed.badges ?? [],
    };
  } catch {
    return null;
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // Progress saving is helpful, but the game should still work without it.
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage errors so reset never blocks play.
  }
}
