# 🐩 日文單字與句子記憶遊戲

一個基於 React 開發的日文學習應用，幫助您學習和記憶日文詞彙和例句，並提供語音朗讀功能。

## 🌟 功能特色

- 📚 **多分組學習**：包含基礎詞彙、動作動詞、形容詞等多個學習分組
- 🎯 **智能答題**：支援漢字和假名輸入，自動判斷答案正確性
- 🔊 **高品質語音**：
  - 優先使用 VOICEVOX 提供專業級免費日文語音
  - 自動回退至瀏覽器內建 Web Speech API
  - 智能語音快取，提升響應速度
- 📊 **錯題統計**：記錄錯題次數和詳細信息，支援錯題重做
- ⌨️ **鍵盤支援**：支援 Enter 鍵快速答題和操作
- 💻 **響應式設計**：適配各種螢幕尺寸
- 🎮 **互動體驗**：即時反饋，Modal 提示正確答案

## 🚀 在線體驗

訪問：https://japanese-vocab-game.web.app

## 🛠 技術棧

- **前端框架**：React 18
- **樣式**：純 CSS，響應式設計
- **語音功能**：
  - VOICEVOX TTS（主要，免費高品質日文語音）
  - Web Speech API（備用）
- **部署平台**：Firebase Hosting
- **狀態管理**：React Hooks (useState, useCallback, useEffect)

## 📦 本地開發

### 1. 克隆項目

```bash
git clone https://github.com/big50201/japanese-vocab-game.git
cd japanese-vocab-game
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 設定 VOICEVOX（可選，但強烈推薦）

為了使用高品質的免費日文語音功能：

1. 前往 [VOICEVOX 官網](https://voicevox.hiroshiba.jp/) 下載並安裝 VOICEVOX
2. 啟動 VOICEVOX 應用程式（會在背景運行 ENGINE）
3. 或者使用 Docker：

```bash
docker run --rm -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest
```

**注意**：如果不安裝 VOICEVOX，系統會自動回退使用瀏覽器內建的 Web Speech API。

### 4. 開發模式運行

```bash
npm start
```

應用將在 http://localhost:3000 打開

### 5. 構建生產版本

```bash
npm run build
```

## 🎮 遊戲玩法

1. **選擇分組**：在首頁選擇您想要練習的詞彙分組
2. **答題**：根據中文意思和例句，輸入對應的日文詞彙（支援漢字和假名）
3. **語音朗讀**：正確或錯誤答題後會自動播放完整例句
4. **複習模式**：完成所有題目後，系統會自動進入錯題複習模式
5. **詳細統計**：查看錯題統計，包含錯誤次數和最後錯誤答案

## 🔊 語音功能說明

本應用提供兩種語音合成方案：

### VOICEVOX TTS（主要，強烈推薦）

- **完全免費**：無需任何費用或 API Key
- **專業品質**：專為日文設計的高品質語音合成
- **多角色選擇**：超過 30 個不同風格的虛擬角色聲音
- **本地運行**：保護隱私，不依賴外部服務
- **智能快取**：重複內容瞬間播放

### Web Speech API（備用）

- **免費使用**：瀏覽器內建功能，無需額外費用
- **離線可用**：不依賴網路連接
- **相容性佳**：支援多數現代瀏覽器

**自動切換機制**：

- 若 VOICEVOX 運行中，優先使用 VOICEVOX TTS
- 若 VOICEVOX 不可用，自動回退到 Web Speech API
- 確保語音功能始終可用

**VOICEVOX 安裝指南**：詳見 [VOICEVOX_GUIDE.md](./VOICEVOX_GUIDE.md)

## 📂 項目結構

```
src/
├── components/         # React 組件
│   ├── GroupScreen.js  # 分組選擇畫面
│   ├── GameScreen.js   # 遊戲答題畫面
│   └── Modal.js        # 答題結果彈窗
├── data/
│   └── vocabulary.js   # 詞彙數據
├── utils/
│   └── gameUtils.js    # 遊戲邏輯和語音工具
├── App.js             # 主應用組件
├── index.js           # 應用入口
└── index.css          # 全局樣式
```

## ⌨️ 鍵盤快捷鍵

- **Enter**：提交答案 / 下一題
- **空白鍵**：下一題（在結果彈窗中）

## 🔧 自定義詞彙

您可以在 `src/data/vocabulary.js` 中添加或修改詞彙數據：

```javascript
export const groups = {
  新分組: [
    {
      meaning: "中文意思",
      word: "日文漢字",
      kana: "平假名讀音",
      sentence: "例句",
      alts: ["替代答案1", "替代答案2"], // 可選
    },
  ],
};
```

## 📱 瀏覽器兼容性

- Chrome（推薦）
- Safari
- Firefox
- Edge

_註：語音功能需要瀏覽器支援 Web Speech API_

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 👨‍💻 作者

[big50201](https://github.com/big50201)

---

⭐ 如果這個項目對您有幫助，請給個星星！

您可以通過編輯 `src/data/vocabulary.js` 文件來添加或修改詞彙分組。

## 授權

此項目僅供學習和個人使用。
