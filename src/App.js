import React, { useState, useRef, useCallback, useEffect } from "react";
import GroupScreen from "./components/GroupScreen";
import GameScreen from "./components/GameScreen";
import Modal from "./components/Modal";
import { groups } from "./data/vocabulary";
import { isCorrect, speak, stopSpeaking } from "./utils/gameUtils";
import "./index.css";

function App() {
  // 遊戲狀態
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [vocab, setVocab] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [wrongList, setWrongList] = useState([]);
  const [retryMode, setRetryMode] = useState(false);
  const [nextDelta, setNextDelta] = useState(1);
  const [wrongStats, setWrongStats] = useState(new Map());
  const [gameEnded, setGameEnded] = useState(false);

  // Modal 狀態
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  // 答案輸入狀態
  const [userAnswer, setUserAnswer] = useState("");
  const [showReplay, setShowReplay] = useState(false);
  // 搜尋狀態
  const [searchText, setSearchText] = useState("");

  // VOICEVOX 測試狀態
  const [voicevoxStatus, setVoicevoxStatus] = useState("未知");

  useEffect(() => {
    // 檢查 VOICEVOX 服務狀態
    const checkVoicevoxStatus = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_VOICEVOX_URL + "/version"
        );
        if (response.ok) {
          setVoicevoxStatus("可用");
        } else {
          setVoicevoxStatus("不可用");
        }
      } catch (error) {
        setVoicevoxStatus("不可用");
      }
    };

    checkVoicevoxStatus();
  }, []);

  const inputRef = useRef(null);

  // 組件卸載時停止語音播放
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // 重置遊戲狀態
  const resetGameState = () => {
    setCurrentIndex(-1);
    setWrongList([]);
    setRetryMode(false);
    setNextDelta(1);
    setWrongStats(new Map());
    setUserAnswer("");
    setShowReplay(false);
    setGameEnded(false);
  };

  // 開始選定分組的遊戲
  const startGroup = (groupName) => {
    resetGameState();
    setSelectedGroup(groupName);
    const groupVocab = groups[groupName] || [];
    setVocab(groupVocab);

    // 確保資料載入完成後才開始第一題
    if (groupVocab.length > 0) {
      setTimeout(() => {
        setGameEnded(false);
        setCurrentIndex(0);
        showQuestion(groupVocab[0]);
      }, 100);
    } else {
      // 如果沒有資料，結束遊戲
      setGameEnded(true);
    }
  };

  // 回到分組選擇
  const backToGroups = () => {
    setSelectedGroup(null);
    resetGameState();
  };

  // 取得當前題目
  const getCurrentItem = useCallback(() => {
    // 如果currentIndex為-1，表示遊戲還未開始
    if (currentIndex === -1) {
      return null;
    }

    if (!retryMode) {
      return vocab[currentIndex] || null;
    }
    return currentIndex >= 0 && currentIndex < wrongList.length
      ? wrongList[currentIndex]
      : null;
  }, [currentIndex, retryMode, vocab, wrongList]);

  // 下一題邏輯
  const nextQuestion = () => {
    if (retryMode) {
      if (wrongList.length === 0) {
        endGame();
        return;
      }

      const newIndex = currentIndex + nextDelta;
      setNextDelta(1);

      if (newIndex >= wrongList.length) {
        setCurrentIndex(0);
      } else if (newIndex < 0) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(newIndex);
      }

      const finalIndex =
        newIndex >= wrongList.length ? 0 : newIndex < 0 ? 0 : newIndex;
      const item = wrongList[finalIndex];
      if (!item) {
        endGame();
        return;
      }
      showQuestion(item);
      return;
    }

    // 主回合
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    if (newIndex >= vocab.length) {
      if (wrongList.length > 0) {
        setRetryMode(true);
        setCurrentIndex(0);
        showQuestion(wrongList[0]);
        return;
      } else {
        endGame();
        return;
      }
    }
    showQuestion(vocab[newIndex]);
  };

  // 顯示題目
  const showQuestion = (item) => {
    if (!item) return;
    setUserAnswer("");
    setShowReplay(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // 處理答題
  const handleSubmitAnswer = useCallback(() => {
    const item = getCurrentItem();
    if (!item) return;

    const trimmedAnswer = userAnswer.trim();
    if (trimmedAnswer === "") return;

    setNextDelta(1);

    if (isCorrect(trimmedAnswer, item)) {
      setModalTitle("🎯 正確！");
      setModalBody(
        <>
          <p>完整句子：{item.sentence}</p>
          <p>中文翻譯：{item.sentence_zh}</p>
        </>
      );
      setShowModal(true);
      speak(item.sentence).catch((err) => console.error("語音播放失敗:", err));

      if (retryMode) {
        const newWrongList = wrongList.filter((w) => w !== item);
        setWrongList(newWrongList);
        setNextDelta(0);
        if (currentIndex >= newWrongList.length) {
          setCurrentIndex(newWrongList.length - 1);
        }
      }
    } else {
      if (
        !retryMode &&
        !wrongList.some((w) => w.word === item.word && w.kana === item.kana)
      ) {
        setWrongList((prev) => [...prev, item]);
      }

      const key = `${item.word}|${item.kana}`;
      setWrongStats((prev) => {
        const newStats = new Map(prev);
        const stat = newStats.get(key) || {
          count: 0,
          meaning: item.meaning,
          word: item.word,
          kana: item.kana,
          sentence: item.sentence,
          sentence_zh: item.sentence_zh,
          lastWrong: "",
        };
        stat.count += 1;
        stat.lastWrong = trimmedAnswer;
        newStats.set(key, stat);
        return newStats;
      });

      setModalTitle("❌ 錯誤");
      setModalBody(
        <>
          <p>
            正確答案：{item.word}（{item.kana}）
          </p>
          <p>例句：{item.sentence}</p>
          <p>中文翻譯：{item.sentence_zh}</p>
        </>
      );
      setShowModal(true);
      speak(item.sentence).catch((err) => console.error("語音播放失敗:", err));
    }
  }, [currentIndex, getCurrentItem, retryMode, userAnswer, wrongList]);

  // 結束遊戲
  const endGame = () => {
    setGameEnded(true);
    setShowReplay(false);
  };

  // 重新開始當前分組
  const restartCurrentGroup = () => {
    if (selectedGroup) {
      startGroup(selectedGroup);
    }
  };

  // 重播句子
  const handleReplay = () => {
    const item = getCurrentItem();
    if (item) {
      speak(item.sentence).catch((err) => console.error("語音播放失敗:", err));
    }
  };

  // Modal 確認處理
  const handleModalOk = () => {
    setShowModal(false);
    setShowReplay(true);
    if (retryMode && wrongList.length === 0) {
      endGame();
      return;
    }
    nextQuestion();
  };

  // 如果沒有選擇分組，顯示分組選擇畫面
  if (!selectedGroup) {
    // 計算所有分組的單詞總數
    const totalWords = Object.values(groups).reduce(
      (sum, arr) => sum + arr.length,
      0
    );

    // 過濾分組
    const filteredGroups = searchText
      ? Object.keys(groups).filter((groupName) =>
          groupName.toLowerCase().includes(searchText.toLowerCase())
        )
      : Object.keys(groups);

    const filteredGroupsObject = filteredGroups.reduce((acc, groupName) => {
      acc[groupName] = groups[groupName];
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-dark-text mb-4 japanese-text">
              🐩 日文單字與句子記憶遊戲
            </h1>
            <p className="text-base text-dark-text-secondary mb-4">
              {Object.keys(filteredGroupsObject).length} 組共 {totalWords}
              個單字
            </p>
            <p className="text-lg text-dark-text-secondary mb-4">
              高品質音声合成で日本語を学習しよう
            </p>

            {/* VOICEVOX 狀態顯示 */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-surface">
                <div
                  className={`w-3 h-3 rounded-full ${
                    voicevoxStatus === "可用"
                      ? "bg-green-500"
                      : voicevoxStatus === "不可用"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-sm text-dark-text-secondary">
                  VOICEVOX TTS: {voicevoxStatus}
                </span>
              </div>
            </div>
          </div>

          {/* 搜尋列 */}
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              placeholder="搜尋分組或單字..."
              className="input w-full"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>

          <GroupScreen
            groups={filteredGroupsObject}
            onSelectGroup={startGroup}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-text mb-4 japanese-text">
            🐩 日文單字與句子記憶遊戲({vocab.length})
          </h1>

          {/* VOICEVOX 狀態顯示 */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-surface">
              <div
                className={`w-3 h-3 rounded-full ${
                  voicevoxStatus === "可用"
                    ? "bg-green-500"
                    : voicevoxStatus === "不可用"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-sm text-dark-text-secondary">
                VOICEVOX TTS: {voicevoxStatus}
              </span>
            </div>
          </div>
        </div>

        <GameScreen
          vocabLength={vocab.length}
          selectedGroup={selectedGroup}
          currentItem={getCurrentItem()}
          currentIndex={currentIndex}
          wrongCount={wrongList.length}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onBackToGroups={backToGroups}
          onReplay={handleReplay}
          showReplay={showReplay}
          retryMode={retryMode}
          gameEnded={gameEnded}
          wrongStats={wrongStats}
          onRestartGroup={restartCurrentGroup}
          inputRef={inputRef}
          showModal={showModal}
        />

        <Modal
          show={showModal}
          title={modalTitle}
          body={modalBody}
          onOk={handleModalOk}
        />
      </div>
    </div>
  );
}

export default App;
