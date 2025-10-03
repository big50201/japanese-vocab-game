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
        <div className="flex items-center justify-center py-12">
          <div className="text-dark-text-secondary text-lg">載入中…</div>
        </div>
      </div>
    );
  }

  const renderGameEndSummary = () => {
    if (wrongStats.size > 0) {
      return (
        <div className="mt-6 p-4 bg-dark-surface rounded-lg">
          <h3 className="text-lg font-semibold text-dark-text mb-4">
            📝 錯題總結
          </h3>
          <div className="space-y-3">
            {Array.from(wrongStats.values()).map((stat, index) => (
              <details
                key={index}
                className="bg-dark-bg p-3 rounded border border-dark-border"
              >
                <summary className="cursor-pointer text-dark-text hover:text-dark-accent text-lg font-bold">
                  {stat.meaning} — 正解：{stat.word}（{stat.kana}）｜錯誤次數：
                  {stat.count}
                </summary>
                <div className="mt-2 space-y-2 text-dark-text-secondary">
                  {stat.lastWrong && (
                    <div>
                      你最後一次輸入：
                      <span className="font-semibold text-red-400">
                        {stat.lastWrong}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    例句：<span className="japanese-text">{stat.sentence}</span>
                    <button
                      className="btn-secondary px-2 py-1 text-sm"
                      onClick={() => speak(stat.sentence)}
                    >
                      🔊
                    </button>
                  </div>
                  <div>中文翻譯：{stat.sentence_zh}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="text-green-400 font-semibold text-center">
            太強了！沒有任何錯題 🎉
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-dark-surface rounded-lg">
        <button className="btn-secondary" onClick={onBackToGroups}>
          ⟵ 返回分組
        </button>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-dark-text">
            目前進度：
            {retryMode
              ? `錯題複習 ${
                  currentIndex + 1 > wrongCount ? wrongCount : currentIndex + 1
                } / ${wrongCount}`
              : `${
                  Math.max(0, currentIndex + 1) > vocabLength
                    ? vocabLength
                    : Math.max(0, currentIndex + 1)
                } / ${vocabLength} 題`}
          </span>

          <span
            className={`px-2 py-1 rounded text-xs ${
              wrongCount > 0
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            剩餘錯題：{wrongCount}
          </span>
        </div>
      </div>

      <div className="card">
        {gameEnded ? (
          <>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-dark-text mb-6">
                恭喜完成所有題目！
              </div>
              <button className="btn-primary" onClick={onRestartGroup}>
                🔄 重新開始此分組
              </button>
            </div>
            {renderGameEndSummary()}
          </>
        ) : currentItem ? (
          <>
            {retryMode && (
              <div className="text-center mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <span className="text-orange-400 font-semibold">
                  🔁 錯題複習中...
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div className="text-center">
                <div className="text-xl font-semibold text-dark-text mb-4">
                  中文意思：
                  <span className="text-dark-accent">
                    {currentItem.meaning}
                  </span>
                </div>

                <div className="space-y-3 text-dark-text-secondary">
                  <div className="p-3 bg-dark-surface rounded-lg">
                    <div className="text-sm text-dark-text-secondary mb-1">
                      例句:
                    </div>
                    <div className="japanese-text text-base">
                      {currentItem.sentence.replaceAll(
                        currentItem.word,
                        "____"
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-dark-surface rounded-lg">
                    <div className="text-sm text-dark-text-secondary mb-1">
                      中文翻譯:
                    </div>
                    <div className="text-base">{currentItem.sentence_zh}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="輸入日文 (漢字或假名)"
                  className="input flex-1"
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
                  className="btn-primary whitespace-nowrap"
                  onClick={onSubmitAnswer}
                  disabled={userAnswer.trim() === "" || showModal}
                >
                  下一題
                </button>
              </div>
            </div>

            {showReplay && (
              <div className="text-center mt-6">
                <button className="btn-secondary" onClick={onReplay}>
                  🔊 再聽一次
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-dark-text-secondary text-lg">載入中…</div>
          </div>
        )}
      </div>
    </>
  );
};

export default GameScreen;
