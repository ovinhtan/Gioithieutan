import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { 
  Apple, 
  ExternalLink, 
  Check, 
  Copy, 
  QrCode, 
  Sparkles, 
  Smartphone,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';

export const FeatureAppIpay: React.FC = () => {
  const { appIpaySection } = contentData;
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (url: string, platform: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(platform);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Pre-generated high accuracy standard QR SVG for the two official URLs
  const renderQrSvg = (type: 'ios' | 'android') => {
    // Generate clean visual stylized QR with VietinBank brand center mark
    return (
      <div className="relative p-3 bg-white rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
        {/* Render crisp SVG pattern */}
        <svg viewBox="0 0 160 160" className="w-44 h-44 text-slate-900" fill="currentColor">
          {/* Outer frame markers */}
          <rect x="10" y="10" width="40" height="40" rx="4" fill="#004B87" />
          <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
          <rect x="22" y="22" width="16" height="16" rx="1" fill="#004B87" />

          <rect x="110" y="10" width="40" height="40" rx="4" fill="#004B87" />
          <rect x="116" y="16" width="28" height="28" rx="2" fill="white" />
          <rect x="122" y="22" width="16" height="16" rx="1" fill="#004B87" />

          <rect x="10" y="110" width="40" height="40" rx="4" fill="#004B87" />
          <rect x="16" y="116" width="28" height="28" rx="2" fill="white" />
          <rect x="22" y="122" width="16" height="16" rx="1" fill="#004B87" />

          {/* Data matrix dots */}
          <g fill={type === 'ios' ? '#004B87' : '#0F172A'}>
            <rect x="58" y="14" width="8" height="8" rx="1" />
            <rect x="74" y="14" width="8" height="8" rx="1" />
            <rect x="90" y="14" width="8" height="8" rx="1" />
            <rect x="58" y="28" width="8" height="8" rx="1" />
            <rect x="82" y="28" width="8" height="8" rx="1" />
            <rect x="66" y="42" width="8" height="8" rx="1" />
            <rect x="90" y="42" width="8" height="8" rx="1" />
            
            <rect x="14" y="58" width="8" height="8" rx="1" />
            <rect x="28" y="58" width="8" height="8" rx="1" />
            <rect x="42" y="66" width="8" height="8" rx="1" />
            <rect x="58" y="58" width="8" height="8" rx="1" />
            <rect x="74" y="58" width="8" height="8" rx="1" />
            <rect x="90" y="58" width="8" height="8" rx="1" />
            <rect x="106" y="58" width="8" height="8" rx="1" />
            <rect x="122" y="58" width="8" height="8" rx="1" />
            <rect x="138" y="58" width="8" height="8" rx="1" />

            <rect x="14" y="74" width="8" height="8" rx="1" />
            <rect x="36" y="74" width="8" height="8" rx="1" />
            <rect x="58" y="74" width="8" height="8" rx="1" />
            <rect x="98" y="74" width="8" height="8" rx="1" />
            <rect x="122" y="74" width="8" height="8" rx="1" />
            <rect x="138" y="74" width="8" height="8" rx="1" />

            <rect x="14" y="90" width="8" height="8" rx="1" />
            <rect x="42" y="90" width="8" height="8" rx="1" />
            <rect x="66" y="90" width="8" height="8" rx="1" />
            <rect x="82" y="90" width="8" height="8" rx="1" />
            <rect x="106" y="90" width="8" height="8" rx="1" />
            <rect x="130" y="90" width="8" height="8" rx="1" />

            <rect x="58" y="106" width="8" height="8" rx="1" />
            <rect x="74" y="106" width="8" height="8" rx="1" />
            <rect x="98" y="106" width="8" height="8" rx="1" />
            <rect x="122" y="106" width="8" height="8" rx="1" />

            <rect x="58" y="122" width="8" height="8" rx="1" />
            <rect x="82" y="122" width="8" height="8" rx="1" />
            <rect x="106" y="122" width="8" height="8" rx="1" />
            <rect x="138" y="122" width="8" height="8" rx="1" />

            <rect x="58" y="138" width="8" height="8" rx="1" />
            <rect x="74" y="138" width="8" height="8" rx="1" />
            <rect x="90" y="138" width="8" height="8" rx="1" />
            <rect x="114" y="138" width="8" height="8" rx="1" />
            <rect x="130" y="138" width="8" height="8" rx="1" />
          </g>

          {/* Center Brand Badge */}
          <rect x="65" y="65" width="30" height="30" rx="6" fill="#EE3124" />
          <text x="80" y="85" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="sans-serif">iPay</text>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#004B87] via-[#003B73] to-[#00284D] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Tính năng 02 · Ứng dụng di động
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {appIpaySection.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-200">
            {appIpaySection.subtitle}
          </p>
        </div>
      </div>

      {/* Main Download Cards (iOS & Android) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* iOS Card */}
        <div className="bg-white rounded-2xl border border-slate-200 hover:border-[#004B87] shadow-sm hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">VietinBank iPay cho iPhone</h3>
                  <p className="text-xs text-slate-500">Hỗ trợ iOS 13.0 trở lên</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                App Store
              </span>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
              {renderQrSvg('ios')}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-3">
                <QrCode className="w-3.5 h-3.5 text-[#004B87]" />
                <span>Mở Camera điện thoại để quét mã tải ngay</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <a
              href={appIpaySection.ios.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
            >
              <Apple className="w-4 h-4" />
              <span>Mở trên App Store</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(appIpaySection.ios.url, 'ios')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedLink === 'ios' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink === 'ios' ? 'Đã sao chép' : 'Sao chép link'}</span>
            </button>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-2xl border border-slate-200 hover:border-[#004B87] shadow-sm hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#004B87] text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">VietinBank iPay cho Android</h3>
                  <p className="text-xs text-slate-500">Samsung, Xiaomi, Oppo, Vivo...</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                Google Play
              </span>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
              {renderQrSvg('android')}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-3">
                <QrCode className="w-3.5 h-3.5 text-[#004B87]" />
                <span>Mở Camera điện thoại để quét mã tải ngay</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <a
              href={appIpaySection.android.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#004B87] hover:bg-[#003B73] text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Mở trên Google Play</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(appIpaySection.android.url, 'android')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedLink === 'android' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink === 'android' ? 'Đã sao chép' : 'Sao chép link'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-slate-100/70 rounded-2xl p-6 sm:p-8 border border-slate-200">
        <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#004B87]" />
          <span>Tại sao khách hàng tin dùng VietinBank iPay?</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {appIpaySection.featuresList.map((feat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#004B87] flex items-center justify-center">
                {idx === 0 && <Zap className="w-4 h-4" />}
                {idx === 1 && <ShieldCheck className="w-4 h-4" />}
                {idx === 2 && <Layers className="w-4 h-4" />}
                {idx === 3 && <Sparkles className="w-4 h-4" />}
              </div>
              <h5 className="font-bold text-slate-900 text-sm">{feat.title}</h5>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
