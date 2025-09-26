# 🐩 日文單字與句子記憶遊戲

一個基於 React 開發的日文學習應用，幫助您學習和記憶日文詞彙和例句，並提供語音朗讀功能。

## 🌟 功能特色

- 📚 **多分組學習**：包含基礎詞彙、動作動詞、形容詞等多個學習分組
- 🎯 **智能答題**：支援漢字和假名輸入，自動判斷答案正確性
- 🔊 **語音朗讀**：自動選擇最佳的日文語音引擎，語音播放完整例句
- 📊 **錯題統計**：記錄錯題次數和詳細信息，支援錯題重做
- ⌨️ **鍵盤支援**：支援 Enter 鍵快速答題和操作
- 💻 **響應式設計**：適配各種螢幕尺寸
- 🎮 **互動體驗**：即時反饋，Modal 提示正確答案

## 🚀 在線體驗

訪問：https://japanese-vocab-game.web.app

## 🛠 技術棧

- **前端框架**：React 18
- **樣式**：純 CSS，響應式設計
- **語音功能**：Web Speech API
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

### 3. 開發模式運行

```bash
npm start
```

應用將在 http://localhost:3000 打開

### 4. 構建生產版本

```bash
npm run build
```

## 🎮 遊戲玩法

1. **選擇分組**：在首頁選擇您想要練習的詞彙分組
2. **答題**：根據中文意思和例句，輸入對應的日文詞彙（支援漢字和假名）
3. **語音朗讀**：正確或錯誤答題後會自動播放完整例句
4. **複習模式**：完成所有題目後，系統會自動進入錯題複習模式
5. **詳細統計**：查看錯題統計，包含錯誤次數和最後錯誤答案

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
  "新分組": [
    {
      meaning: "中文意思",
      word: "日文漢字",
      kana: "平假名讀音", 
      sentence: "例句",
      alts: ["替代答案1", "替代答案2"] // 可選
    }
  ]
};
```

## 📱 瀏覽器兼容性

- Chrome（推薦）
- Safari
- Firefox
- Edge

*註：語音功能需要瀏覽器支援 Web Speech API*

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
