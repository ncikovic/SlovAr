export function getSpeechLang(level) {
  return level === "easy" ? "hr-HR" : "en-US";
}

export function pickMessage(messages, index) {
  return messages[index % messages.length];
}

export function pickTranslated(keys, index, t) {
  const key = keys[index % keys.length];
  return t[key];
}

export function makeChoices(items, target, count, key = "id") {
  const choices = [target];
  items.forEach((item) => {
    if (choices.length < count && item[key] !== target[key]) choices.push(item);
  });
  return rotateArray(choices, target[key].length % choices.length);
}

export function rotateArray(items, amount) {
  return items.slice(amount).concat(items.slice(0, amount));
}

export function shuffleArray(items) {
  return [...items]
    .map((item, index) => ({ item, sort: (index * 37 + 11) % 101 }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

export function generateLetterChoices(allLetters, sequence, level, round) {
  const count = level === "easy" ? 4 : 6;
  const needed = Array.from(new Set(sequence));
  const extras = allLetters.filter((letter) => !needed.includes(letter));
  return shuffleArray([...needed, ...rotateArray(extras, round).slice(0, count - needed.length)]);
}

export function badgeForGame(gameId) {
  const badgeMap = {
    letters: "listener",
    words: "explorer",
    memory: "pilot",
    focus: "captain",
  };
  return badgeMap[gameId];
}
