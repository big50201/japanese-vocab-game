// 文字正規化函數
export const normalize = (s) => (s || "").replace(/[\u3000\s]+/g, " ").trim();

// 片假名轉平假名
export const toHira = (s) =>
  (s || "").replace(/[ァ-ン]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );

// 判斷答案是否正確
export const isCorrect = (ans, item) => {
  if (!item) return false;

  const user = toHira(normalize(ans));
  const candidates = [item.word, item.kana].concat(item.alts || []);

  return candidates.some((c) => toHira(normalize(c)) === user);
};

// 語音朗讀函數 - 改進版日文語音
export const speak = (text) => {
  if (!("speechSynthesis" in window)) {
    console.warn("瀏覽器不支援語音合成");
    return;
  }

  // 停止任何正在播放的語音
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // 設定語言為日文
  utterance.lang = "ja-JP";

  // 語音參數調整，讓日文發音更清楚
  utterance.rate = 0.8; // 稍慢一些，有利於學習
  utterance.pitch = 1.0; // 正常音調
  utterance.volume = 1.0; // 最大音量

  // 等待語音列表載入完成
  const setVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();

    // 優先選擇更好的日文語音
    const preferredJaVoices = [
      "Kyoko",
      "Otoya",
      "Google 日本語",
      "Microsoft Haruka",
      "Microsoft Ichiro",
      "Microsoft Sayaka",
    ];

    let selectedVoice = null;

    // 首先尋找偏好的日文語音
    for (const voiceName of preferredJaVoices) {
      selectedVoice = voices.find(
        (v) =>
          v.name.includes(voiceName) &&
          v.lang &&
          v.lang.toLowerCase().startsWith("ja")
      );
      if (selectedVoice) break;
    }

    // 如果沒找到偏好語音，就找任何日文語音
    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) => v.lang && v.lang.toLowerCase().startsWith("ja")
      );
    }

    // 設定語音
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`使用日文語音: ${selectedVoice.name}`);
    } else {
      console.warn("未找到日文語音，使用系統預設語音");
    }

    // 錯誤處理
    utterance.onerror = (event) => {
      console.error("語音合成錯誤:", event.error);
    };

    utterance.onend = () => {
      console.log("語音播放完成");
    };

    // 播放語音
    window.speechSynthesis.speak(utterance);
  };

  // 如果語音列表還沒載入完成，等待載入
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
  } else {
    setVoiceAndSpeak();
  }
};

// 停止語音播放
export const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

// 確保語音可用 - 改進版
if ("speechSynthesis" in window) {
  // 確保語音列表載入完成
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    const jaVoices = voices.filter(
      (v) => v.lang && v.lang.toLowerCase().startsWith("ja")
    );
    console.log(`可用的日文語音數量: ${jaVoices.length}`);
    jaVoices.forEach((v) => console.log(`- ${v.name} (${v.lang})`));
  };
}
