import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { PhoneCall, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { branding, navigation } = contentData;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 sm:gap-8">
          
          {/* Zone 1: Brand Wordmark & Branch Indicator */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('faq')}>
            <img 
              src={branding.logo} 
              alt={branding.brandName} 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                // Fallback styling if local logo loading issue
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#004B87] tracking-tight leading-none">
                {branding.brandName}
              </span>
              <span className="text-xs font-semibold text-slate-500 tracking-normal mt-0.5">
                {branding.branchTitle}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single line, clean typography) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-600">
            {navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#004B87] text-white shadow-xs'
                      : 'text-slate-700 hover:text-[#004B87] hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Hotline counter consultant) & Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={`tel:${branding.consultant.phoneRaw}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-[#EE3124] hover:bg-[#d61b1b] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 group active:scale-95"
              title="Gọi chuyên viên tư vấn hỗ trợ quầy"
            >
              <PhoneCall className="w-4 h-4 group-hover:animate-bounce" />
              <span className="hidden sm:inline">Tư vấn viên: {branding.consultant.phone}</span>
              <span className="sm:hidden">Hotline</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg animate-fadeIn">
          <div className="grid grid-cols-1 gap-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#004B87] text-white'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{item.number}. {item.name}</span>
                <span className="text-xs opacity-75">{item.description.slice(0, 28)}...</span>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Chuyên viên: {branding.consultant.name}</span>
            <a href={`tel:${branding.consultant.phoneRaw}`} className="text-[#EE3124] font-bold">
              {branding.consultant.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
