import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroWelcome } from './components/HeroWelcome';
import { FeatureFaq } from './components/FeatureFaq';
import { FeatureAppIpay } from './components/FeatureAppIpay';
import { FeatureGames } from './components/FeatureGames';
import { FeatureDepositCalculator } from './components/FeatureDepositCalculator';
import { FeatureLoanSchedule } from './components/FeatureLoanSchedule';
import { FeatureFeaturedProducts } from './components/FeatureFeaturedProducts';
import { FeatureBranches } from './components/FeatureBranches';
import { Footer } from './components/Footer';
import contentData from './data/contentData.json';
import { PhoneCall } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const { branding } = contentData;

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    // Smooth scroll down slightly to feature viewport
    const contentEl = document.getElementById('feature-content-viewport');
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Sticky Banking Top Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Kiosk Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Welcome & 7 Features Navigator */}
        <HeroWelcome activeTab={activeTab} onSelectTab={handleSelectTab} />

        {/* Feature Display Viewport */}
        <div id="feature-content-viewport" className="scroll-mt-24 pt-4">
          {activeTab === 'faq' && <FeatureFaq />}
          {activeTab === 'ipay' && <FeatureAppIpay />}
          {activeTab === 'game' && <FeatureGames />}
          {activeTab === 'deposit' && <FeatureDepositCalculator />}
          {activeTab === 'loan' && <FeatureLoanSchedule />}
          {activeTab === 'products' && <FeatureFeaturedProducts />}
          {activeTab === 'branches' && <FeatureBranches />}
        </div>

      </main>

      {/* Floating Kiosk Quick Call button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`tel:${branding.consultant.phoneRaw}`}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#EE3124] hover:bg-[#d61b1b] text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group active:scale-95"
          title={`Gọi hỗ trợ quầy: ${branding.consultant.name} (${branding.consultant.phone})`}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <PhoneCall className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden sm:block pr-1">
            <div className="text-[10px] text-white/80 font-medium uppercase leading-tight">Hỗ trợ quầy</div>
            <div className="text-xs font-black text-white">{branding.consultant.phone}</div>
          </div>
        </a>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
