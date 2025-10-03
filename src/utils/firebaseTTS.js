// Firebase Functions TTS 語音合成服務
class FirebaseTTS {
  constructor() {
    // 從環境變數獲取專案 ID
    const projectId =
      process.env.REACT_APP_FIREBASE_PROJECT_ID || "japanese-vocab-game";
    this.baseURL = `https://us-central1-${projectId}.cloudfunctions.net`;
    this.audioCache = new Map(); // 語音快取
    this.isServiceAvailable = false;
    this.defaultSpeaker = 1; // 預設使用女性標準聲音

    // 輸出當前設定
    // console.log(`🔧 Firebase Functions TTS 端點: ${this.baseURL}`);
    // console.log(`🌍 專案 ID: ${projectId}`);
  }

  // 檢查 Firebase Functions 是否可用
  async checkService() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5秒超時
      });
      this.isServiceAvailable = response.ok;
      if (this.isServiceAvailable) {
        console.log("✅ Firebase Functions TTS 服務可用");
      }
      return this.isServiceAvailable;
    } catch (error) {
      this.isServiceAvailable = false;
      console.log("❌ Firebase Functions TTS 服務不可用:", error.message);
      return false;
    }
  }

  // 獲取可用的說話者列表
  async getSpeakers() {
    try {
      const response = await fetch(`${this.baseURL}/getSpeakers`);
      if (response.ok) {
        const speakers = await response.json();
        console.log("📢 可用的 Firebase TTS 說話者:", speakers.length);
        return speakers;
      }
    } catch (error) {
      console.error("無法獲取說話者列表:", error);
    }
    return [];
  }

  // 生成語音並播放
  async speak(text, options = {}) {
    // 檢查快取
    const speaker = options.speaker || this.defaultSpeaker;
    const cacheKey = `firebase_${text}_${speaker}`;

    if (this.audioCache.has(cacheKey)) {
      console.log("🎵 使用快取語音 (Firebase)");
      return this.playAudio(this.audioCache.get(cacheKey));
    }

    try {
      // 檢查服務是否可用
      await this.checkService();
      if (!this.isServiceAvailable) {
        throw new Error("Firebase Functions TTS 服務不可用");
      }

      const audioBlob = await this.synthesizeSpeech(text, speaker);
      this.audioCache.set(cacheKey, audioBlob);
      return this.playAudio(audioBlob);
    } catch (error) {
      console.error("Firebase TTS 語音合成失敗:", error);
      throw error;
    }
  }

  // 呼叫 Firebase Functions 進行語音合成
  async synthesizeSpeech(text, speaker) {
    console.log(`🎤 Firebase TTS 合成: "${text}" (說話者: ${speaker})`);

    const response = await fetch(`${this.baseURL}/speak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        speaker: speaker,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Firebase TTS 請求失敗: ${response.status} - ${
          errorData.error || response.statusText
        }`
      );
    }

    return await response.blob();
  }

  // 播放音頻
  playAudio(audioBlob) {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        console.log("🔊 Firebase TTS 播放完成");
        resolve();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error("音頻播放失敗"));
      };

      audio.play().catch(reject);
    });
  }

  // 清理快取
  clearCache() {
    this.audioCache.clear();
    console.log("🧹 Firebase TTS 快取已清理");
  }

  // 獲取快取狀態
  getCacheInfo() {
    return {
      size: this.audioCache.size,
      keys: Array.from(this.audioCache.keys()),
    };
  }
}

export { FirebaseTTS };
