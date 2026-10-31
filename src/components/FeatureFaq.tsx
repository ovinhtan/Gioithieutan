import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { FaqTopic, FaqStep } from '../types';
import { 
  KeyRound, 
  CreditCard, 
  ScanFace, 
  Receipt, 
  CalendarClock, 
  Youtube, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';

const topicIcons: Record<string, React.ReactNode> = {
  'forgot-password': <KeyRound className="w-6 h-6 text-[#004B87]" />,
  'close-card': <CreditCard className="w-6 h-6 text-[#EE3124]" />,
  'biometrics': <ScanFace className="w-6 h-6 text-emerald-600" />,
  'tax-payment': <Receipt className="w-6 h-6 text-amber-600" />,
  'appointment-booking': <CalendarClock className="w-6 h-6 text-indigo-600" />
};

export const FeatureFaq: React.FC = () => {
  const { faqSection, branding } = contentData;
  const [selectedTopic, setSelectedTopic] = useState<FaqTopic | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'ok' | 'not-ok' | 'ended'>('idle');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const handleSelectTopic = (topic: FaqTopic) => {
    setSelectedTopic(topic);
    setFeedbackStatus('idle');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleBackToMenu = () => {
    setSelectedTopic(null);
    setFeedbackStatus('idle');
  };

  const handleEndConversation = () => {
    setFeedbackStatus('ended');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#004B87] to-[#002D54] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            Tính năng 01 · Hỗ trợ giao dịch
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {faqSection.question}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-200">
            {faqSection.promptSubtitle}
          </p>
        </div>
      </div>

      {/* View 1: Topics Selection Grid (Cards) */}
      {!selectedTopic && feedbackStatus !== 'ended' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {faqSection.topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleSelectTopic(topic as FaqTopic)}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-[#004B87] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                    {topicIcons[topic.id] || <KeyRound className="w-6 h-6 text-[#004B87]" />}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {topic.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004B87] transition-colors leading-snug">
                  {topic.cardTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Bao gồm {topic.steps.length} bước hướng dẫn trực quan có ảnh minh hoạ
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004B87]">
                <span>Xem hướng dẫn chi tiết</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Step-by-Step Guide for Selected Topic */}
      {selectedTopic && feedbackStatus !== 'ended' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh mục</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#004B87]">
                {selectedTopic.badge}
              </span>
              <span className="text-xs text-slate-500">
                {selectedTopic.steps.length} bước thực hiện
              </span>
            </div>
          </div>

          {/* Guide Title */}
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {selectedTopic.cardTitle}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Thực hiện theo các bước dưới đây trên ứng dụng VietinBank iPay của Quý khách.
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-8">
            {selectedTopic.steps.map((step: FaqStep) => (
              <div
                key={step.stepNumber}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                {/* Text Explanation */}
                <div className="md:col-span-7 flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#004B87] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Bước {step.stepNumber}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-700 whitespace-pre-line leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>

                {/* Illustration Image */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <div 
                    onClick={() => setZoomImage(step.image)}
                    className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white max-h-72 w-full flex items-center justify-center p-2 shadow-xs"
                  >
                    <img
                      src={step.image}
                      alt={`Minh hoạ bước ${step.stepNumber}`}
                      className="max-h-64 object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg shadow-md">
                        <Maximize2 className="w-3.5 h-3.5" />
                        Phóng to ảnh
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 mt-1.5 italic">Nhấn để phóng to ảnh</span>
                </div>
              </div>
            ))}
          </div>

          {/* YouTube Video link at the end of content */}
          {selectedTopic.videoUrl && (
            <div className="p-5 sm:p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Video hướng dẫn chi tiết trên YouTube
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Xem video thực tế từng thao tác để nắm rõ hơn quy trình xử lý
                  </p>
                </div>
              </div>

              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-xs transition-colors shrink-0"
              >
                <span>Xem trên YouTube</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Feedback Section & Conversation Actions */}
          <div className="pt-6 border-t border-slate-200 space-y-6">
            
            {/* Question: Khách hàng thực hiện ổn hay chưa? */}
            {feedbackStatus === 'idle' && (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-4">
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {faqSection.feedbackPrompt}
                </h4>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setFeedbackStatus('ok')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã ổn, tôi đã làm được</span>
                  </button>

                  <button
                    onClick={() => setFeedbackStatus('not-ok')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Chưa ổn, cần hỗ trợ thêm</span>
                  </button>
                </div>
              </div>
            )}

            {/* Feedback: If Đã ổn */}
            {feedbackStatus === 'ok' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{faqSection.feedbackSuccessMessage}</span>
                </div>
                <p className="text-xs text-slate-600">
                  Quý khách có thể quay lại danh mục để tra cứu nội dung khác hoặc kết thúc phiên tư vấn.
                </p>
              </div>
            )}

            {/* Feedback: If Chưa ổn */}
            {feedbackStatus === 'not-ok' && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 text-base">Hỗ trợ trực tiếp từ Chuyên viên quầy</h5>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      “{faqSection.feedbackSupportMessage}”
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`tel:${branding.consultant.phoneRaw}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EE3124] hover:bg-[#d61b1b] text-white text-sm font-bold rounded-lg shadow-sm transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi Chuyên viên {branding.consultant.name} ({branding.consultant.phone})</span>
                  </a>
                </div>
              </div>
            )}

            {/* Bottom Navigation Buttons: Quay lại menu chính & Kết thúc cuộc trò chuyện */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={handleBackToMenu}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại menu chính</span>
              </button>

              <button
                onClick={handleEndConversation}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
              >
                <span>Kết thúc cuộc trò chuyện</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* View 3: Farewell Message when "Kết thúc cuộc trò chuyện" */}
      {feedbackStatus === 'ended' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto animate-scaleUp">
          <div className="w-16 h-16 bg-blue-50 text-[#004B87] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">
              Cảm ơn Quý khách!
            </h3>
            <p className="text-base text-slate-700 font-medium">
              {faqSection.farewellMessage}
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                setSelectedTopic(null);
                setFeedbackStatus('idle');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#004B87] hover:bg-[#003B73] text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>Bắt đầu phiên hỏi đáp mới</span>
            </button>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-4 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage}
              alt="Phóng to minh hoạ"
              className="max-h-[82vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
