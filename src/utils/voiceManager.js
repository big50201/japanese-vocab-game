// 🎤 智能語音服務管理器
// 自動選擇最佳的 TTS 服務：VOICEVOX → Firebase TTS → Web Speech API

import VoicevoxTTS from "./voicevoxEngine.js";
import { FirebaseTTS } from "./firebaseTTS.js";

class VoiceServiceManager {
  constructor() {
    this.voicevoxTTS = new VoicevoxTTS();
    this.firebaseTTS = new FirebaseTTS();
    this.serviceCache = new Map(); // 快取服務可用性
    this.cacheTimeout = 60000; // 快取 1 分鐘

    console.log(`🎤 語音服務管理器初始化`);
    console.log(`🎌 VOICEVOX: 已啟用`);
    console.log(`🔥 Firebase TTS: 已啟用`);
  }

  // 檢查服務可用性並快取結果
  async checkServiceAvailability(serviceType) {
    const cacheKey = `${serviceType}_availability`;
    const cached = this.serviceCache.get(cacheKey);

    // 如果有快取且未過期，直接回傳
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.available;
    }

    let available = false;

    try {
      switch (serviceType) {
        case "voicevox":
          const engineStatus = await this.voicevoxTTS.checkEngine();
          available = engineStatus.available;
          break;

        case "firebase":
          // Firebase TTS 通常都可用，除非有網路問題
          available = true;
          break;

        case "webspeech":
          available = "speechSynthesis" in window;
          break;

        default:
          available = false;
      }
    } catch (error) {
      console.warn(`❌ ${serviceType} 服務檢查失敗:`, error.message);
      available = false;
    }

    // 快取結果
    this.serviceCache.set(cacheKey, {
      available,
      timestamp: Date.now(),
    });

    return available;
  }

  // 主要語音播放方法
  async speak(text, options = {}) {
    console.log(`🎤 準備播放語音: "${text}"`);

    // 從環境變數獲取 TTS 優先順序
    const priority = (
      process.env.REACT_APP_TTS_PRIORITY || "voicevox,firebase,webspeech"
    )
      .split(",")
      .map((s) => s.trim());

    console.log(`📋 TTS 優先順序: ${priority.join(" → ")}`);

    // 依序嘗試每個服務
    for (const serviceType of priority) {
      try {
        const result = await this.tryService(serviceType, text, options);
        if (result) {
          console.log(`✅ ${serviceType} 播放成功`);
          return true;
        }
      } catch (error) {
        console.error(`❌ ${serviceType} 錯誤:`, error);
      }
    }

    console.error("❌ 所有語音服務都失敗了");
    return false;
  }

  // 嘗試指定的服務
  async tryService(serviceType, text, options) {
    switch (serviceType) {
      case "voicevox":
        return await this.tryVoicevox(text, options);

      case "firebase":
        return await this.tryFirebase(text, options);

      case "webspeech":
        return await this.tryWebSpeech(text, options);

      default:
        console.warn(`❓ 未知的服務類型: ${serviceType}`);
        return false;
    }
  }

  // 嘗試 VOICEVOX TTS
  async tryVoicevox(text, options) {
    console.log("🎌 嘗試 VOICEVOX TTS");

    const available = await this.checkServiceAvailability("voicevox");
    if (!available) {
      console.log("⚠️ VOICEVOX ENGINE 不可用");
      return false;
    }

    const voicevoxOptions = {
      speaker: options.speaker || 1, // 四國めたん
      speedScale: options.speedScale || 0.9,
      pitchScale: options.pitchScale || 0.0,
      intonationScale: options.intonationScale || 1.0,
      ...options,
    };

    return await this.voicevoxTTS.speak(text, voicevoxOptions);
  }

  // 嘗試 Firebase TTS
  async tryFirebase(text, options) {
    console.log("🔥 嘗試 Firebase TTS");

    const available = await this.checkServiceAvailability("firebase");
    if (!available) {
      console.log("⚠️ Firebase TTS 不可用");
      return false;
    }

    try {
      await this.firebaseTTS.speak(text, {
        speaker: options.speaker || 1,
        ...options,
      });
      return true;
    } catch (error) {
      console.error("Firebase TTS 錯誤:", error);
      return false;
    }
  }

  // 嘗試 Web Speech API
  async tryWebSpeech(text, options) {
    console.log("🗣️ 嘗試 Web Speech API");

    const available = await this.checkServiceAvailability("webspeech");
    if (!available) {
      console.log("⚠️ Web Speech API 不可用");
      return false;
    }

    return new Promise((resolve) => {
      try {
        // 停止任何正在播放的語音
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // 設定語言為日文
        utterance.lang = "ja-JP";

        // 語音參數調整
        utterance.rate = options.speedScale || 0.8;
        utterance.pitch = options.pitchScale || 1.0;
        utterance.volume = options.volume || 1.0;

        // 選擇日文語音
        const voices = window.speechSynthesis.getVoices();
        const preferredJaVoices = [
          "Kyoko",
          "Otoya",
          "Google 日本語",
          "Microsoft Haruka",
          "Microsoft Ichiro",
          "Microsoft Sayaka",
        ];

        let selectedVoice = null;
        for (const voiceName of preferredJaVoices) {
          selectedVoice = voices.find(
            (v) =>
              v.name.includes(voiceName) &&
              v.lang &&
              v.lang.toLowerCase().startsWith("ja")
          );
          if (selectedVoice) break;
        }

        if (!selectedVoice) {
          selectedVoice = voices.find(
            (v) => v.lang && v.lang.toLowerCase().startsWith("ja")
          );
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`🔊 使用日文語音: ${selectedVoice.name}`);
        }

        utterance.onend = () => {
          console.log("✅ Web Speech API 播放完成");
          resolve(true);
        };

        utterance.onerror = (event) => {
          console.error("Web Speech API 錯誤:", event.error);
          resolve(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Web Speech API 錯誤:", error);
        resolve(false);
      }
    });
  }

  // 預載語音（提升效能）
  async preloadSpeech(texts, options = {}) {
    console.log(`🚀 預載 ${texts.length} 段語音`);

    const promises = texts.map((text) =>
      this.speak(text, { ...options, preload: true })
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter((r) => r.status === "fulfilled").length;

    console.log(`✅ 成功預載 ${successful}/${texts.length} 段語音`);
    return successful;
  }

  // 清除快取
  clearCache() {
    this.serviceCache.clear();
    this.voicevoxTTS.clearCache();
    console.log("🧹 語音服務快取已清除");
  }

  // 獲取服務狀態報告
  async getServiceStatus() {
    const services = ["voicevox", "firebase", "webspeech"];
    const status = {};

    for (const service of services) {
      status[service] = await this.checkServiceAvailability(service);
    }

    return status;
  }

  // 停止所有語音播放
  stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    // 注意：VOICEVOX 和 Firebase TTS 無法中途停止
    console.log("🛑 已停止 Web Speech API 語音播放");
  }
}

// 創建全域實例
const voiceManager = new VoiceServiceManager();

// 導出便利函數
export const speak = (text, options) => voiceManager.speak(text, options);
export const stopSpeaking = () => voiceManager.stopSpeaking();
export const preloadSpeech = (texts, options) =>
  voiceManager.preloadSpeech(texts, options);
export const clearVoiceCache = () => voiceManager.clearCache();
export const getVoiceServiceStatus = () => voiceManager.getServiceStatus();

export default voiceManager;
