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
    <div className="overlay" onClick={onOk}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{body}</p>
        <button onClick={onOk} autoFocus>
          下一題
        </button>
      </div>
    </div>
  );
};

export default Modal;
