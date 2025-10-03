import VoicevoxTTS from "./voicevoxEngine.js";

// 建立全域實例
const voicevoxTTS = new VoicevoxTTS();

// 匯出函數
export const speakWithVoicevox = async (text, options = {}) => {
  return await voicevoxTTS.speak(text, options);
};

export const clearVoicevoxCache = () => {
  voicevoxTTS.clearCache();
};

export const preloadVoicevoxSpeech = async (texts, options = {}) => {
  return await voicevoxTTS.preloadSpeech(texts, options);
};

export const checkVoicevoxEngine = async () => {
  return await voicevoxTTS.checkEngine();
};

export const getVoicevoxSpeakers = async () => {
  return await voicevoxTTS.getSpeakers();
};

export const setVoicevoxSpeaker = (speakerId) => {
  voicevoxTTS.setDefaultSpeaker(speakerId);
};

export const getVoicevoxInfo = async () => {
  return await voicevoxTTS.getEngineInfo();
};

// 便利函數：快速測試 VOICEVOX
export const testVoicevox = async () => {
  console.log("🧪 測試 VOICEVOX 服務");

  const engineInfo = await voicevoxTTS.getEngineInfo();
  console.log("引擎資訊:", engineInfo);

  if (engineInfo.available) {
    console.log("🎤 測試語音合成...");
    const success = await voicevoxTTS.speak("こんにちは", { speaker: 1 });
    console.log(`語音測試結果: ${success ? "成功" : "失敗"}`);
    return success;
  } else {
    console.log("❌ VOICEVOX 引擎不可用");
    return false;
  }
};

export default voicevoxTTS;
