import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { 
  Sparkles, 
  Star, 
  Gift, 
  Phone, 
  X, 
  ChevronRight, 
  CheckCircle,
  Eye,
  Maximize2
} from 'lucide-react';

export const FeatureFeaturedProducts: React.FC = () => {
  const { featuredProductsSection, branding } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [interestModalItem, setInterestModalItem] = useState<{ title: string; image: string } | null>(null);
  const [zoomPoster, setZoomPoster] = useState<string | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? featuredProductsSection.items
    : featuredProductsSection.items.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Featured Header Card with subtle red/blue border and star icon */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-red-50/40 rounded-2xl p-6 sm:p-8 border-2 border-[#004B87]/30 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-[#EE3124] text-white shadow-xs">
                <Star className="w-3 h-3 fill-white" />
                Nổi bật
              </span>
              <span className="text-xs font-bold text-slate-500">
                Tính năng 06 · Giải pháp toàn diện
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004B87] tracking-tight">
              {featuredProductsSection.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {featuredProductsSection.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#004B87] to-[#EE3124] text-white flex items-center justify-center shadow-md">
              <Gift className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto pb-1">
          {featuredProductsSection.categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Posters Carousel / Vertical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-[#004B87] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Poster Image Container */}
            <div className="relative overflow-hidden bg-slate-100 aspect-4/3 flex items-center justify-center border-b border-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Top Badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-white/95 text-[#004B87] shadow-sm backdrop-blur-xs">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {item.badge}
                </span>
              </div>

              {/* Preview Button */}
              <button
                onClick={() => setZoomPoster(item.image)}
                className="absolute bottom-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                title="Phóng to poster"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Poster Content & Actions */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EE3124]">
                  {item.highlight}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004B87] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setInterestModalItem({ title: item.title, image: item.image })}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#004B87] hover:bg-[#003B73] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* "Tôi quan tâm" Support Advisory Modal */}
      {interestModalItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-200 animate-scaleUp text-center relative">
            <button
              onClick={() => setInterestModalItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#004B87] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Yêu cầu tư vấn sản phẩm
              </span>
              <h4 className="text-lg font-black text-slate-900">
                {interestModalItem.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
            </div>

            {/* Consultant Contact Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Hoặc liên hệ trực tiếp:</div>
              <div className="font-bold text-slate-900 text-sm">
                Chuyên viên tư vấn {branding.consultant.name}
              </div>
              <a
                href={`tel:${branding.consultant.phoneRaw}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#EE3124] hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>Hotline: {branding.consultant.phone}</span>
              </a>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={`tel:${branding.consultant.phoneRaw}`}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#EE3124] hover:bg-[#d61b1b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi ngay</span>
              </a>
              <button
                onClick={() => setInterestModalItem(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Zoom Poster Modal */}
      {zoomPoster && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setZoomPoster(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl p-4 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomPoster(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomPoster}
              alt="Poster chi tiết"
              className="max-h-[82vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
