import React, { useEffect } from "react";

const Modal = ({ show, title, body, onOk }) => {
  // 處理鍵盤事件
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onOk();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onOk]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onOk}
    >
      <div
        className="bg-dark-surface border border-dark-border rounded-lg p-6 max-w-md w-full mx-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-dark-text mb-4 text-center">
          {title}
        </h3>
        <div className="text-dark-text-secondary mb-6 text-center japanese-text">
          {body}
        </div>
        <div className="text-center">
          <button className="btn-primary" onClick={onOk} autoFocus>
            下一題
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
