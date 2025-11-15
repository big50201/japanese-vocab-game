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
          className="bg-dark-surface backdrop-blur-sm border border-white/20 rounded-2xl p-6 cursor-pointer group hover:scale-105 transition-all duration-300 hover:bg-white/15 shadow-xl hover:shadow-indigo-500/20"
          onClick={() => onSelectGroup(groupKey)}
        >
          <div className="text-6xl mb-4 group-hover:animate-bounce">
            <img
              src={images[index % images.length]}
              alt="poddle"
              className="w-24 h-24 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(148,163,184,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(199,210,254,0.6)] transition-all duration-300 transform group-hover:rotate-2"
            />
          </div>
          <div className="text-xl font-semibold text-slate-200 japanese-text text-center mt-4 group-hover:text-indigo-200 transition-colors duration-300">
            {index + 1}.{groupKey}
          </div>
          <div className="text-sm text-slate-400 group-hover:text-slate-300 text-center mt-2 transition-colors duration-300">
            （{groups?.[groupKey]?.length} 個單字）
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupScreen;
