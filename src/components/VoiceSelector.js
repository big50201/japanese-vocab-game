import React, { useState, useEffect } from "react";

const VoiceSelector = ({ voicevoxEngine, onVoiceChange }) => {
  const [speakers, setSpeakers] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // 獲取說話者列表
  useEffect(() => {
    const loadSpeakers = async () => {
      if (!voicevoxEngine) return;

      setIsLoading(true);
      try {
        const speakerList = await voicevoxEngine.getSpeakers();
        setSpeakers(speakerList);
      } catch (error) {
        console.error("載入說話者列表失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpeakers();
  }, [voicevoxEngine]);

  // 處理說話者變更
  const handleSpeakerChange = (speakerId, speakerName) => {
    setCurrentSpeaker(speakerId);
    if (voicevoxEngine) {
      voicevoxEngine.setDefaultSpeaker(speakerId);
    }
    if (onVoiceChange) {
      onVoiceChange(speakerId, speakerName);
    }
    setIsOpen(false);
  };

  // 測試選中的聲音
  const testVoice = async (speakerId) => {
    if (!voicevoxEngine) return;

    const originalSpeaker = currentSpeaker;
    voicevoxEngine.setDefaultSpeaker(speakerId);

    try {
      await voicevoxEngine.speak("こんにちは、よろしくお願いします。");
    } catch (error) {
      console.error("測試語音失敗:", error);
    } finally {
      voicevoxEngine.setDefaultSpeaker(originalSpeaker);
    }
  };

  if (isLoading) {
    return (
      <div className="voice-selector-loading">
        <div className="loading-spinner mr-2"></div>
        <span className="text-dark-text-secondary text-sm">載入語音中...</span>
      </div>
    );
  }

  if (!speakers.length) {
    return (
      <div className="text-dark-text-secondary text-sm">📢 無可用語音</div>
    );
  }

  const currentSpeakerInfo = speakers.find((s) =>
    s.styles?.some((style) => style.id === currentSpeaker)
  );
  const currentStyleInfo = currentSpeakerInfo?.styles?.find(
    (style) => style.id === currentSpeaker
  );

  return (
    <div className="voice-selector relative">
      {/* 當前選中的語音顯示 */}
      <button
        className="voice-selector-button flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-dark-text hover:bg-dark-border transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">🎭</span>
        <div className="text-left">
          <div className="text-sm font-medium">
            {currentSpeakerInfo?.name || "說話者"}
          </div>
          <div className="text-xs text-dark-text-secondary">
            {currentStyleInfo?.name || "預設"}
          </div>
        </div>
        <span
          className={`ml-10 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <div className="voice-selector-dropdown absolute top-full left-0 right-0 mt-1 bg-dark-surface border border-dark-border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {speakers.map((speaker) => (
            <div key={speaker.speaker_uuid} className="speaker-group">
              <div className="speaker-name px-3 py-2 text-sm font-semibold text-dark-accent border-b border-dark-border">
                {speaker.name}
              </div>
              {speaker.styles?.map((style) => (
                <button
                  key={style.id}
                  className={`voice-option w-full px-4 py-2 text-left hover:bg-dark-border transition-colors duration-150 flex items-center justify-between ${
                    currentSpeaker === style.id
                      ? "bg-dark-accent text-white"
                      : "text-dark-text"
                  }`}
                  onClick={() =>
                    handleSpeakerChange(
                      style.id,
                      `${speaker.name} (${style.name})`
                    )
                  }
                >
                  <span className="text-sm">{style.name}</span>
                  <div className="flex gap-1">
                    <button
                      className="test-voice-btn px-2 py-1 text-xs bg-dark-border hover:bg-dark-accent rounded transition-colors duration-150"
                      onClick={(e) => {
                        e.stopPropagation();
                        testVoice(style.id);
                      }}
                      title="測試此語音"
                    >
                      🔊
                    </button>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 點擊外部關閉下拉選單 */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default VoiceSelector;
