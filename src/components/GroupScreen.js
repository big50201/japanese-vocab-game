import React from "react";

const GroupScreen = ({ groups, onSelectGroup }) => {
  const emojis = ["🐕", "🐶", "🦮", "🐕‍🦺", "🐩", "🐈", "🐱", "🐈‍⬛", "🐾", "🦥"];

  return (
    <div className="group-screen">
      {Object.keys(groups).map((groupKey, index) => (
        <div
          key={groupKey}
          className="group-card"
          onClick={() => onSelectGroup(groupKey)}
        >
          <div className="dog">{emojis[index % emojis.length]}</div>
          <div className="group-title">
            {groupKey}（{groups?.[groupKey]?.length}）
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupScreen;
