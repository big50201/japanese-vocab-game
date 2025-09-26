import React from "react";
import { speak } from "../utils/gameUtils";
const GameScreen = ({
  selectedGroup,
  currentItem,
  currentIndex,
  vocabLength,
  wrongCount,
  userAnswer,
  setUserAnswer,
  onSubmitAnswer,
  onBackToGroups,
  onReplay,
  showReplay,
  retryMode,
  gameEnded,
  wrongStats,
  onRestartGroup,
  inputRef,
  showModal,
}) => {
  if (!currentItem && !gameEnded) {
    return (
      <div className="card">
        <div className="question-content">載入中…</div>
      </div>
    );
  }

  const renderGameEndSummary = () => {
    if (wrongStats.size > 0) {
      return (
        <div className="summary-section">
          <hr />
          <h3>📝 錯題總結</h3>
          {Array.from(wrongStats.values()).map((stat, index) => (
            <details key={index}>
              <summary>
                {stat.meaning} — 正解：{stat.word}（{stat.kana}）｜錯誤次數：
                {stat.count}
              </summary>
              {stat.lastWrong && (
                <div>
                  你最後一次輸入：<b>{stat.lastWrong}</b>
                </div>
              )}
              <div>
                例句：{stat.sentence}
                <button onClick={() => speak(stat.sentence)}>🔊</button>
              </div>
            </details>
          ))}
        </div>
      );
    } else {
      return (
        <div className="summary-section">
          <hr />
          <div>太強了！沒有任何錯題 🎉</div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="toolbar">
        <button onClick={onBackToGroups}>⟵ 返回分組</button>
        <span className="group-count">
          目前進度：
          {retryMode
            ? `錯題複習 ${currentIndex + 1} / ${wrongCount}`
            : `${Math.max(0, currentIndex + 1)} / ${vocabLength} 題`}
        </span>
        <span className="wrong-count">剩餘錯題：{wrongCount}</span>
      </div>

      <div className="card">
        {gameEnded ? (
          <>
            <div className="question-content">🎉 恭喜完成所有題目！</div>
            <div className="input-button-group">
              <button onClick={onRestartGroup}>🔄 重新開始此分組</button>
            </div>
            {renderGameEndSummary()}
          </>
        ) : currentItem ? (
          <>
            {retryMode && (
              <div className="question-content">🔁 錯題複習中...</div>
            )}
            <div className="question-content">
              中文意思：<b>{currentItem.meaning}</b>
              <small>
                例句:
                {currentItem.sentence.replaceAll(currentItem.word, "____")}
              </small>
              <small>
                中文翻譯:
                {currentItem.sentence_zh}
              </small>
            </div>

            <div className="answer-section">
              <div className="input-button-group">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="輸入日文 (漢字或假名)"
                  disabled={showModal}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      userAnswer.trim() !== "" &&
                      !showModal
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      onSubmitAnswer();
                    }
                  }}
                />
                <button
                  onClick={onSubmitAnswer}
                  disabled={userAnswer.trim() === "" || showModal}
                >
                  下一題
                </button>
              </div>
            </div>

            {showReplay && (
              <div className="replay-section">
                <span className="link" onClick={onReplay}>
                  🔊 再聽一次
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="question-content">載入中…</div>
        )}
      </div>
    </>
  );
};

export default GameScreen;
