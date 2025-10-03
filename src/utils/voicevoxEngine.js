// 🎌 VOICEVOX TTS 服務
// 專門處理 VOICEVOX ENGINE 的語音合成功能

class VoicevoxTTS {
  constructor() {
    this.baseURL = this.getVoicevoxUrl();
    this.audioCache = new Map();
    this.cacheLimit = parseInt(process.env.REACT_APP_VOICE_CACHE_SIZE) || 50;
    this.timeout = parseInt(process.env.REACT_APP_VOICEVOX_TIMEOUT) || 3000;
    this.defaultSpeaker = 1; // 四國めたん

    console.log(`🎌 VOICEVOX TTS 初始化`);
    // console.log(`🌐 服務端點: ${this.baseURL}`);
    console.log(`⏱️  超時設定: ${this.timeout}ms`);
  }

  // 獲取 VOICEVOX URL（優先使用環境變數）
  getVoicevoxUrl() {
    const cloudUrl = process.env.REACT_APP_VOICEVOX_URL;

    if (cloudUrl && cloudUrl !== "https://voicevox-engine-xxxxx.a.run.app") {
      //console.log(`🌐 使用雲端 VOICEVOX: ${cloudUrl}`);
      return cloudUrl;
    }
  }

  // 檢查 VOICEVOX ENGINE 是否可用
  async checkEngine() {
    try {
      const response = await fetch(`${this.baseURL}/version`, {
        method: "GET",
        signal: AbortSignal.timeout(this.timeout),
      });

      if (response.ok) {
        const version = await response.text();
        console.log(`✅ VOICEVOX ENGINE 可用 (版本: ${version})`);
        return { available: true, version: version.replace(/"/g, "") };
      } else {
        console.warn(`⚠️  VOICEVOX ENGINE HTTP 錯誤: ${response.status}`);
        return { available: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.warn(`❌ VOICEVOX ENGINE 連接失敗: ${error.message}`);
      return { available: false, error: error.message };
    }
  }

  // 獲取可用的說話者列表
  async getSpeakers() {
    try {
      const response = await fetch(`${this.baseURL}/speakers`, {
        method: "GET",
        signal: AbortSignal.timeout(this.timeout),
      });

      if (response.ok) {
        const speakers = await response.json();
        console.log(`🗣️  獲取到 ${speakers.length} 個說話者`);
        return speakers;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 獲取說話者列表失敗:", error);
      return [];
    }
  }

  // 設定預設說話者
  setDefaultSpeaker(speakerId) {
    this.defaultSpeaker = speakerId;
    console.log(`🎭 設定預設說話者: ${speakerId}`);
  }

  // 語音合成主函數
  async speak(text, options = {}) {
    if (!text || text.trim() === "") {
      console.warn("⚠️  空白文字，跳過語音合成");
      return false;
    }

    console.log(`🎤 VOICEVOX 合成語音: "${text}"`);

    // 檢查快取
    const cacheKey = this.getCacheKey(text, options);
    if (this.audioCache.has(cacheKey)) {
      console.log("🔄 使用快取的語音");
      return this.playAudio(this.audioCache.get(cacheKey));
    }

    try {
      // Step 1: 生成語音查詢
      const audioQuery = await this.generateAudioQuery(text, options);
      if (!audioQuery) {
        return false;
      }

      // Step 2: 合成語音
      const audioBlob = await this.synthesizeAudio(audioQuery, options);
      if (!audioBlob) {
        return false;
      }

      // 更新快取
      this.updateCache(cacheKey, audioBlob);

      // Step 3: 播放語音
      return this.playAudio(audioBlob);
    } catch (error) {
      console.error("❌ VOICEVOX 語音合成失敗:", error);
      return false;
    }
  }

  // 生成語音查詢
  async generateAudioQuery(text, options = {}) {
    const speaker = options.speaker || this.defaultSpeaker;
    const encodedText = encodeURIComponent(text);

    try {
      const response = await fetch(
        `${this.baseURL}/audio_query?text=${encodedText}&speaker=${speaker}`,
        {
          method: "POST",
          signal: AbortSignal.timeout(this.timeout),
        }
      );

      if (response.ok) {
        const audioQuery = await response.json();

        // 應用語音參數調整
        if (options.speedScale !== undefined) {
          audioQuery.speedScale = options.speedScale;
        }
        if (options.pitchScale !== undefined) {
          audioQuery.pitchScale = options.pitchScale;
        }
        if (options.intonationScale !== undefined) {
          audioQuery.intonationScale = options.intonationScale;
        }

        console.log("✅ 語音查詢生成成功");
        return audioQuery;
      } else {
        console.error(`❌ 語音查詢失敗: HTTP ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error("❌ 語音查詢錯誤:", error);
      return null;
    }
  }

  // 合成語音
  async synthesizeAudio(audioQuery, options = {}) {
    const speaker = options.speaker || this.defaultSpeaker;

    try {
      const response = await fetch(
        `${this.baseURL}/synthesis?speaker=${speaker}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(audioQuery),
          signal: AbortSignal.timeout(this.timeout * 2), // 合成需要更長時間
        }
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        console.log(`✅ 語音合成成功 (${audioBlob.size} bytes)`);
        return audioBlob;
      } else {
        console.error(`❌ 語音合成失敗: HTTP ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error("❌ 語音合成錯誤:", error);
      return null;
    }
  }

  // 播放音訊
  async playAudio(audioBlob) {
    return new Promise((resolve) => {
      try {
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);

        audio.onended = () => {
          URL.revokeObjectURL(audioURL);
          console.log("✅ VOICEVOX 語音播放完成");
          resolve(true);
        };

        audio.onerror = (error) => {
          URL.revokeObjectURL(audioURL);
          console.error("❌ 音訊播放錯誤:", error);
          resolve(false);
        };

        audio.play().catch((error) => {
          URL.revokeObjectURL(audioURL);
          console.error("❌ 音訊播放失敗:", error);
          resolve(false);
        });
      } catch (error) {
        console.error("❌ 音訊對象創建失敗:", error);
        resolve(false);
      }
    });
  }

  // 生成快取鍵
  getCacheKey(text, options) {
    const speaker = options.speaker || this.defaultSpeaker;
    const speedScale = options.speedScale || 1.0;
    const pitchScale = options.pitchScale || 0.0;
    const intonationScale = options.intonationScale || 1.0;

    return `${text}_${speaker}_${speedScale}_${pitchScale}_${intonationScale}`;
  }

  // 更新快取
  updateCache(key, audioBlob) {
    // 如果快取已滿，刪除最舊的項目
    if (this.audioCache.size >= this.cacheLimit) {
      const firstKey = this.audioCache.keys().next().value;
      this.audioCache.delete(firstKey);
    }

    this.audioCache.set(key, audioBlob);
    console.log(`💾 語音快取更新 (${this.audioCache.size}/${this.cacheLimit})`);
  }

  // 清除快取
  clearCache() {
    this.audioCache.clear();
    console.log("🧹 VOICEVOX 快取已清除");
  }

  // 預載語音
  async preloadSpeech(texts, options = {}) {
    console.log(`🚀 預載 ${texts.length} 段 VOICEVOX 語音`);

    const preloadOptions = { ...options, preload: true };
    const promises = texts.map((text) => this.speak(text, preloadOptions));

    const results = await Promise.allSettled(promises);
    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value
    ).length;

    console.log(`✅ 成功預載 ${successful}/${texts.length} 段語音`);
    return successful;
  }

  // 獲取引擎資訊
  async getEngineInfo() {
    try {
      const [versionResult, speakers] = await Promise.all([
        this.checkEngine(),
        this.getSpeakers(),
      ]);

      return {
        version: versionResult.version,
        available: versionResult.available,
        speakers: speakers.length,
        endpoint: this.baseURL,
        cache: {
          size: this.audioCache.size,
          limit: this.cacheLimit,
        },
      };
    } catch (error) {
      console.error("❌ 獲取引擎資訊失敗:", error);
      return {
        available: false,
        error: error.message,
      };
    }
  }
}

export default VoicevoxTTS;
