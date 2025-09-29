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
      setModalBody(`完整句子：${item.sentence}`);
      setShowModal(true);
      speak(item.sentence);

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
          lastWrong: "",
        };
        stat.count += 1;
        stat.lastWrong = trimmedAnswer;
        newStats.set(key, stat);
        return newStats;
      });

      setModalTitle("❌ 錯誤");
      setModalBody(
        `正確答案：${item.word}（${item.kana}）\n例句：${item.sentence}`
      );
      setShowModal(true);
      speak(item.sentence);
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
      speak(item.sentence);
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

    return (
      <div className="game-container">
        <h1>🐩 日文單字與句子記憶遊戲 ({totalWords})</h1>
        <GroupScreen groups={groups} onSelectGroup={startGroup} />
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>🐩 日文單字與句子記憶遊戲({vocab.length})</h1>
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
  );
}

export default App;
