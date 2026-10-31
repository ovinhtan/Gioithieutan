import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { BranchItem } from '../types';
import { 
  MapPin, 
  PhoneCall, 
  Clock, 
  ExternalLink, 
  Search, 
  Building2, 
  Navigation,
  CheckCircle2,
  Maximize2,
  X
} from 'lucide-react';

export const FeatureBranches: React.FC = () => {
  const { branchSection } = contentData;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const filteredBranches = branchSection.branches.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(term) ||
      b.address.toLowerCase().includes(term) ||
      b.phone.includes(term)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#004B87] via-[#003B73] to-[#0D9488] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            Tính năng 07 · Mạng lưới phòng giao dịch
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {branchSection.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-100 font-medium">
            {branchSection.subtitle} · Giờ làm việc: {branchSection.workingHours}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 max-w-md relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên phòng giao dịch, địa chỉ..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/95 text-slate-900 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-md"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBranches.map((branch) => {
          return (
            <div
              key={branch.stt}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                branch.isHead
                  ? 'border-2 border-[#004B87] ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-[#004B87]'
              }`}
            >
              {/* Branch Image */}
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden group">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {branch.isHead && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#004B87] text-white text-[11px] font-black rounded-lg shadow-sm">
                    Trụ sở Chi nhánh
                  </span>
                )}

                <button
                  onClick={() => setZoomImage(branch.image)}
                  className="absolute bottom-2.5 right-2.5 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                  title="Phóng to ảnh phòng giao dịch"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Branch Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">
                      Điểm GD số 0{branch.stt}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Đang mở cửa
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {branch.name}
                  </h3>

                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-[#EE3124] shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{branch.address}</span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-slate-500 pt-1">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{branch.hours}</span>
                  </div>
                </div>

                {/* Direct Action Buttons: Hotline (Callable) + Google Maps with Map Icon */}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href={`tel:${branch.phoneRaw}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#EE3124] hover:bg-[#d61b1b] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
                    title="Bấm để gọi điện thoại trực tiếp"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi {branch.phone}</span>
                  </a>

                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#004B87] text-xs font-bold rounded-xl transition-all border border-blue-200 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#004B87]" />
                    <span>Chỉ đường Google Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {filteredBranches.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="font-semibold text-sm">Không tìm thấy phòng giao dịch phù hợp với từ khóa.</p>
        </div>
      )}

      {/* Image Preview Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl p-4 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage}
              alt="Hình ảnh phòng giao dịch"
              className="max-h-[82vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
