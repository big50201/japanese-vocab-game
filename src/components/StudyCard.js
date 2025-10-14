import React, { useState } from "react";
import { speak } from "../utils/gameUtils";

const StudyCard = ({ stat, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = (e) => {
    e.stopPropagation(); // 防止觸發翻卡
    speak(stat.sentence);
  };

  return (
    <div
      className="mb-4 w-full max-w-xs sm:max-w-sm mx-auto px-2"
      style={{ perspective: "1000px" }}
    >
      <div
        className={`relative w-full h-[26rem] sm:h-[28rem] cursor-pointer transition-transform duration-700 ease-in-out rounded-xl preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={handleFlip}
      >
        {/* 正面 - 只顯示中文翻譯和例句 */}
        <div className="absolute inset-0 w-full h-full p-3 sm:p-4 flex flex-col bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600 rounded-xl shadow-2xl backface-hidden">
          <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 border-b border-slate-600 flex-shrink-0">
            <span className="text-xs sm:text-sm text-slate-400 font-semibold">
              #{index + 1}
            </span>
            <span className="text-xs text-red-400 bg-red-400/10 px-1.5 sm:px-2 py-1 rounded border border-red-400/30">
              錯誤 {stat.count} 次
            </span>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
            <div className="text-base sm:text-lg font-bold text-slate-100 text-center leading-relaxed break-words mb-3 sm:mb-4 flex-shrink-0">
              {stat.meaning}
            </div>

            <div className="flex-1 flex flex-col gap-2 sm:gap-3">
              <div className="flex flex-col gap-1 sm:gap-2 relative">
                <div className="text-xs sm:text-sm text-slate-400 font-medium">
                  例句：
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed pr-6 sm:pr-8 japanese-text break-words min-h-[2.5rem] sm:min-h-[3rem]">
                  {stat.sentence}
                </div>
                <button
                  className="absolute top-0 right-0 bg-blue-500/10 border border-blue-500/30 rounded px-1 sm:px-1.5 py-0.5 text-xs text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200"
                  onClick={handlePlayAudio}
                  title="播放發音"
                >
                  🔊
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
                {stat.sentence_zh}
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 opacity-70 flex-shrink-0">
            點擊查看答案 →
          </div>
        </div>

        {/* 背面 - 顯示正確答案 */}
        <div className="absolute inset-0 w-full h-full p-3 sm:p-4 flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-600 rounded-xl shadow-2xl rotate-y-180 backface-hidden">
          <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 border-b border-slate-600 flex-shrink-0">
            <span className="text-xs sm:text-sm text-slate-400 font-semibold">
              #{index + 1}
            </span>
            <span className="text-xs text-green-400 bg-green-400/10 px-1.5 sm:px-2 py-1 rounded border border-green-400/30">
              正確答案
            </span>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
            <div className="text-center mb-3 sm:mb-4 flex-shrink-0">
              <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1 sm:mb-2 japanese-text break-words">
                {stat.word}
              </div>
              <div className="text-sm sm:text-base text-slate-400 font-medium break-words">
                （{stat.kana}）
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 text-center break-words mb-3 sm:mb-4 flex-shrink-0">
              意思：{stat.meaning}
            </div>

            <div className="flex-1 flex flex-col gap-2 sm:gap-3">
              {stat.lastWrong && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mb-2">
                  <div className="text-xs text-slate-400 mb-1">
                    你最後輸入：
                  </div>
                  <div className="text-xs sm:text-sm text-red-400 font-semibold break-words">
                    {stat.lastWrong}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1 sm:gap-2 relative">
                <div className="text-xs sm:text-sm text-slate-400 font-medium">
                  例句：
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed pr-6 sm:pr-8 japanese-text break-words min-h-[2.5rem] sm:min-h-[3rem]">
                  {stat.sentence}
                </div>
                <button
                  className="absolute top-0 right-0 bg-blue-500/10 border border-blue-500/30 rounded px-1 sm:px-1.5 py-0.5 text-xs text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200"
                  onClick={handlePlayAudio}
                  title="播放發音"
                >
                  🔊
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
                {stat.sentence_zh}
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 opacity-70 flex-shrink-0">
            點擊返回正面 ←
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyCard;
