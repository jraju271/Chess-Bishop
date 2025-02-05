import { setMemojiState } from "../Meta/StateController";
import { Store } from "../Store";
var CurrentSpeaker;

export const SPEAK = async (input, lang ='hi-IN') => {
  if (CurrentSpeaker) {
    window.speechSynthesis.cancel();
    CurrentSpeaker = null;
  }

  let utterance = new SpeechSynthesisUtterance(input);
  utterance.onstart = () => {
    Store.dispatch(setMemojiState('Speak'));
  };

  // Set the language to hi-EN (Hindi-English)
  utterance.lang = lang;

  // Optionally, you can set the voice based on available voices in your system
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find(voice => voice.lang === lang) || voices[0];

  CurrentSpeaker = utterance;

  utterance.onend = () => {
    Store.dispatch(setMemojiState('Sleep'));
  };
  speechSynthesis.speak(utterance)
};
