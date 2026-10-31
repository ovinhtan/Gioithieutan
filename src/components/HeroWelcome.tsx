import React from 'react';
import contentData from '../data/contentData.json';
import { 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Sparkles, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Headphones
} from 'lucide-react';

interface HeroWelcomeProps {
  onSelectTab: (tabId: string) => void;
  activeTab: string;
}

const navIconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-5 h-5 text-[#004B87]" />,
  Smartphone: <Smartphone className="w-5 h-5 text-[#004B87]" />,
  Gamepad2: <Gamepad2 className="w-5 h-5 text-[#EE3124]" />,
  PiggyBank: <PiggyBank className="w-5 h-5 text-emerald-600" />,
  Calculator: <Calculator className="w-5 h-5 text-indigo-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  MapPin: <MapPin className="w-5 h-5 text-teal-600" />
};

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({ onSelectTab, activeTab }) => {
  const { branding, navigation } = contentData;

  return (
    <div className="space-y-6">
      {/* Kiosk Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-[#004B87] via-[#003B73] to-[#00274D] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 translate-y-12 w-64 h-64 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kính chào Quý khách đến với {branding.branchTitle}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Quầy Giao Dịch Số VietinBank
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            Trải nghiệm các tiện ích số tiện lợi trong lúc chờ phục vụ: Tra cứu hướng dẫn thao tác iPay, tính lãi tiền gửi tiết kiệm, lập lịch trả nợ khoản vay hoặc tham gia mini-game nhận ngay voucher xăng!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Chuyên viên hỗ trợ trực tiếp tại quầy: <strong>{branding.consultant.name}</strong></span>
            </div>
            <span>·</span>
            <a href={`tel:${branding.consultant.phoneRaw}`} className="text-amber-300 hover:underline">
              Hotline: {branding.consultant.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 7 Quick Access Cards */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
            Danh mục 7 tính năng quầy phục vụ
          </h2>
          <span className="text-xs text-slate-400">Chạm vào thẻ để mở nhanh</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isActive
                    ? 'bg-blue-50/70 border-2 border-[#004B87] shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {navIconMap[item.icon] || <HelpCircle className="w-5 h-5 text-[#004B87]" />}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {item.number}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold transition-colors leading-snug ${
                    isActive ? 'text-[#004B87]' : 'text-slate-900 group-hover:text-[#004B87]'
                  }`}>
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004B87]">
                  <span>{isActive ? 'Đang mở' : 'Khám phá'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
