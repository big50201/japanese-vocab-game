const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");
const textToSpeech = require("@google-cloud/text-to-speech");

// 初始化 TTS 客戶端
const client = new textToSpeech.TextToSpeechClient();

// 支援的日文語音
const JAPANESE_VOICES = {
  1: {name: "ja-JP-Standard-A", gender: "FEMALE"}, // 女性聲音 1
  2: {name: "ja-JP-Standard-B", gender: "MALE"}, // 男性聲音 1
  3: {name: "ja-JP-Standard-C", gender: "FEMALE"}, // 女性聲音 2
  4: {name: "ja-JP-Standard-D", gender: "MALE"}, // 男性聲音 2
  5: {name: "ja-JP-Wavenet-A", gender: "FEMALE"}, // 高品質女聲 1
  6: {name: "ja-JP-Wavenet-B", gender: "MALE"}, // 高品質男聲 1
  7: {name: "ja-JP-Wavenet-C", gender: "FEMALE"}, // 高品質女聲 2
  8: {name: "ja-JP-Wavenet-D", gender: "MALE"}, // 高品質男聲 2
};

// 語音合成 Function
exports.speak = onRequest({cors: true}, async (req, res) => {
  try {
    // 只允許 POST 請求
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method not allowed"});
    }

    const {text, speaker = 1} = req.body;

    if (!text) {
      return res.status(400).json({error: "Text is required"});
    }

    // 獲取語音設定
    const voice = JAPANESE_VOICES[speaker] || JAPANESE_VOICES[1];

    logger.info("TTS request received", {text, speaker, voice: voice.name});

    // TTS 請求設定
    const request = {
      input: {text},
      voice: {
        languageCode: "ja-JP",
        name: voice.name,
        ssmlGender: voice.gender,
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.0,
        pitch: 0.0,
      },
    };

    // 執行語音合成
    const [response] = await client.synthesizeSpeech(request);

    // 設定回應 headers
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.audioContent.length,
      "Cache-Control": "public, max-age=3600", // 快取 1 小時
    });

    logger.info("TTS synthesis successful", {textLength: text.length});

    // 回傳音頻
    res.send(response.audioContent);
  } catch (error) {
    logger.error("TTS synthesis failed", error);
    res.status(500).json({
      error: "Speech synthesis failed",
      details: error.message,
    });
  }
});

// 獲取可用語音列表
exports.getSpeakers = onRequest({cors: true}, (req, res) => {
  const speakers = Object.entries(JAPANESE_VOICES).map(([id, voice]) => ({
    id: parseInt(id),
    name: voice.name,
    gender: voice.gender,
    displayName: `${voice.gender === "FEMALE" ? "女性" : "男性"}聲音 ${id}`,
    isWavenet: voice.name.includes("Wavenet"), // 高品質標記
  }));

  logger.info("Speakers list requested", {count: speakers.length});
  res.json(speakers);
});

// 健康檢查
exports.health = onRequest({cors: true}, (req, res) => {
  res.json({status: "OK", service: "Firebase Functions TTS"});
});
