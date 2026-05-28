export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text, lang = "en-US", soundOn = true) {
  if (!soundOn) {
    return { ok: false, message: "Sound is turned off." };
  }

  if (!speechSupported()) {
    return { ok: false, message: "Speech is not supported in this browser." };
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.82;
  utterance.pitch = 1.04;
  utterance.volume = 0.95;
  window.speechSynthesis.speak(utterance);

  return { ok: true, message: "" };
}

export function speakLetterSequence(letters, lang = "en-US", soundOn = true, delay = 720) {
  if (!soundOn) {
    return { ok: false, message: "Sound is turned off." };
  }

  if (!speechSupported()) {
    return { ok: false, message: "Speech is not supported in this browser." };
  }

  window.speechSynthesis.cancel();
  letters.forEach((letter, index) => {
    window.setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = lang;
      utterance.rate = 0.72;
      utterance.pitch = 1.05;
      utterance.volume = 0.95;
      window.speechSynthesis.speak(utterance);
    }, index * delay);
  });

  return { ok: true, message: "" };
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}
