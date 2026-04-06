import React from 'react';

const EmptyState = ({ icon: Icon, title, subtitle, buttonText = "Start Shopping", accentColor = "green" }) => {

  const colors = {
    green: {
      bg: "bg-green-50/50",
      text: "text-green-600",
      btn: "bg-green-600 hover:bg-green-700 shadow-green-200/50",
      dot: "bg-green-50"
    },
    red: {
      bg: "bg-red-50/50",
      text: "text-red-600",
      btn: "bg-red-600 hover:bg-red-700 shadow-red-200/50",
      dot: "bg-red-50"
    },
    blue: {
      bg: "bg-blue-50/50",
      text: "text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-200/50",
      dot: "bg-blue-50"
    }
  };

  const activeColor = colors[accentColor] || colors.green;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center animate-fadeIn">
      <div className="bg-white w-full border border-gray-100/80 shadow-xl shadow-gray-200/40 p-10 md:p-16 relative overflow-hidden flex flex-col items-center text-center">
        {/* Decorative background elements */}
        <div className={`absolute top-10 left-10 w-16 h-16 ${activeColor.dot} rounded-full blur-2xl opacity-60`}></div>
        <div className={`absolute bottom-10 right-10 w-24 h-24 ${activeColor.dot} rounded-full blur-3xl opacity-80`}></div>

        {/* Animated Icon Container - Scaled down */}
        <div className="relative mb-8">
          <div className={`w-28 h-28 md:w-32 md:h-32 ${activeColor.bg} rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-700 relative z-10 shadow-inner`}>
            <Icon size={48} strokeWidth={1.5} className={`${activeColor.text} drop-shadow-sm animate-bounce-subtle`} />
          </div>
          {/* Shadow beneath the icon */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-900/5 blur-lg rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 tracking-tighter leading-tight">
            {title}
          </h3>
          <p className="text-gray-400 font-bold text-xs md:text-sm uppercase tracking-widest mb-10 leading-relaxed px-4 opacity-80">
            {subtitle}
          </p>

          {/* <button 
            onClick={() => navigate('/')}
            className={`group flex items-center gap-3 ${activeColor.btn} text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 active:translate-y-1 mb-2`}
          >
            <Icon size={14} className="group-hover:rotate-12 transition-transform" />
            <span>{buttonText}</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
