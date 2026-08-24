import React from 'react';

export const ScrapePage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-2">Tạo tác vụ cào dữ liệu mới</h3>
        <p className="text-xs text-slate-400 mb-6">
          Hỗ trợ cào dữ liệu từ Shopee và Lazada theo từ khóa hoặc đường dẫn chi tiết.
        </p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Loại đầu vào</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="KEYWORD">Từ khóa (Keyword)</option>
              <option value="URL">Đường dẫn chi tiết (URL)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Giá trị tìm kiếm / URL</label>
            <input
              type="text"
              placeholder="VD: áo thun nam, giày sneaker..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nền tảng</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                <option value="SHOPEE">Shopee</option>
                <option value="LAZADA">Lazada</option>
                <option value="ALL">Tất cả (All)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Số lượng tối đa</label>
              <input
                type="number"
                defaultValue={5}
                min={1}
                max={50}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 active:scale-98 cursor-pointer"
          >
            🚀 Bắt đầu cào dữ liệu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScrapePage;
