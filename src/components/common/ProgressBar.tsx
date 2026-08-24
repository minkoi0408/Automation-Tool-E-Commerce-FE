import React from 'react';

interface ProgressBarProps {
  progress?: number;
  total?: number;
  processed?: number;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total = 0, processed = 0, showText = true }) => {
  let percent = progress;
  if (percent === undefined || percent === null) {
    percent = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
  }

  return (
    <div className="w-full">
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
          <span>{total > 0 ? `${processed}/${total} sản phẩm` : `${percent}%`}</span>
          <span>{percent}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
