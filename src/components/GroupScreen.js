import React from "react";
import dogImage from "../assets/1003.png";
import dogImage2 from "../assets/1003-1.png";
import dogImage3 from "../assets/1003-2.png";
import dogImage4 from "../assets/1003-3.png";
import dogImage5 from "../assets/1003-4.png";
import dogImage6 from "../assets/1003-5.png";
import dogImage7 from "../assets/1003-6.png";
const GroupScreen = ({ groups, onSelectGroup }) => {
  const images = [
    dogImage,
    dogImage2,
    dogImage3,
    dogImage4,
    dogImage5,
    dogImage6,
    dogImage7,
  ];

  // 反轉 groups 的 key 順序
  const reversedGroupKeys = Object.keys(groups).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {reversedGroupKeys.map((groupKey, index) => (
        <div
          key={groupKey}
          className="card cursor-pointer group hover:scale-105 transition-all duration-200"
          onClick={() => onSelectGroup(groupKey)}
        >
          <div className="text-6xl mb-4 group-hover:animate-bounce">
            <img
              src={images[index % images.length]}
              alt="poddle"
              className="w-16 h-16 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.7)] transition-all duration-300"
            />
          </div>
          <div className="text-xl font-semibold text-dark-text japanese-text text-center">
            {groupKey}
          </div>
          <div className="text-sm text-dark-text-secondary text-center mt-2">
            （{groups?.[groupKey]?.length} 個單字）
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupScreen;
