import React, { useState, useId } from 'react';
import contentData from '../data/contentData.json';
import { 
  PiggyBank, 
  Coins, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Video,
  Sparkles
} from 'lucide-react';

export const FeatureDepositCalculator: React.FC = () => {
  const { depositSection } = contentData;
  const depositInputId = useId();
  const termSelectId = useId();
  const rateInputId = useId();

  // State
  const [depositAmountStr, setDepositAmountStr] = useState<string>('100000000'); // 100M VND
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(12);
  const [interestRateStr, setInterestRateStr] = useState<string>('4.8'); // 4.8%
  
  // Validation errors
  const [amountError, setAmountError] = useState<string | null>(null);
  const [termError, setTermError] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  // Quick chips for amounts
  const quickAmounts = [
    { label: '50 Triệu', value: 50000000 },
    { label: '100 Triệu', value: 100000000 },
    { label: '200 Triệu', value: 200000000 },
    { label: '500 Triệu', value: 500000000 },
    { label: '1 Tỷ', value: 1000000000 }
  ];

  // Format currency
  const formatVND = (val: number): string => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' VND';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ''); // Numbers only
    setDepositAmountStr(raw);

    const num = Number(raw);
    if (!raw || num <= 0) {
      setAmountError('Vui lòng nhập số tiền gửi hợp lệ.');
    } else if (num < depositSection.validationRules.minAmount) {
      setAmountError('Số tiền gửi tối thiểu là 1.000.000 VND.');
    } else {
      setAmountError(null);
    }
  };

  const handleTermChange = (termMonths: number) => {
    setSelectedTermMonths(termMonths);
    setTermError(null);
    // Auto populate VietinBank benchmark rate for this term
    const matched = depositSection.terms.find((t) => t.months === termMonths);
    if (matched) {
      setInterestRateStr(matched.rate.toString());
      setRateError(null);
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInterestRateStr(val);
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      setRateError('Vui lòng nhập lãi suất hợp lệ.');
    } else if (num > depositSection.validationRules.maxRate) {
      setRateError(`Lãi suất không được vượt quá mức trần ${depositSection.validationRules.maxRate}%/năm.`);
    } else {
      setRateError(null);
    }
  };

  // Calculation: Tiền lãi = (Số tiền gửi * Lãi suất %/năm * Số tháng gửi) / 12
  const amountNum = parseFloat(depositAmountStr) || 0;
  const rateNum = parseFloat(interestRateStr) || 0;
  const isValid = !amountError && !termError && !rateError && amountNum >= depositSection.validationRules.minAmount;

  const estimatedInterest = isValid
    ? (amountNum * (rateNum / 100) * selectedTermMonths) / 12
    : 0;
  const totalReceived = amountNum + estimatedInterest;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#004B87] via-[#003B73] to-[#0284C7] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            <PiggyBank className="w-3.5 h-3.5" />
            Tính năng 04 · Tiết kiệm sinh lời
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {depositSection.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-100 font-medium">
            {depositSection.productName}
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs + Real-time Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#004B87]" />
            <span>Thông tin tiền gửi dự tính</span>
          </h3>

          {/* 1. Deposit Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={depositInputId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tổng tiền gửi (VND) <span className="text-red-500">*</span>
              </label>
              {amountNum > 0 && (
                <span className="text-xs font-bold text-[#004B87] tabular-nums">
                  {formatVND(amountNum)}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id={depositInputId}
                type="text"
                value={depositAmountStr ? new Intl.NumberFormat('vi-VN').format(Number(depositAmountStr)) : ''}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi (ví dụ: 100.000.000)"
                className={`w-full px-4 py-3.5 rounded-xl border text-base font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none transition-all tabular-nums ${
                  amountError ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-[#004B87] focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                VND
              </span>
            </div>

            {amountError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{amountError}</span>
              </p>
            )}

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickAmounts.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => {
                    setDepositAmountStr(q.value.toString());
                    setAmountError(null);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Term Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={termSelectId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Kỳ hạn gửi (Tháng) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Đang chọn: {selectedTermMonths} tháng
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {depositSection.terms.map((t) => {
                const isSelected = selectedTermMonths === t.months;
                return (
                  <button
                    key={t.months}
                    type="button"
                    onClick={() => handleTermChange(t.months)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#004B87] text-white border-[#004B87] shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div>{t.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {t.rate}%/năm
                    </div>
                  </button>
                );
              })}
            </div>

            {termError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{termError}</span>
              </p>
            )}
          </div>

          {/* 3. Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={rateInputId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Lãi suất (% / năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Biểu lãi suất VietinBank áp dụng
              </span>
            </div>

            <div className="relative">
              <input
                id={rateInputId}
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={interestRateStr}
                onChange={handleRateChange}
                placeholder="Nhập lãi suất (ví dụ: 4.8)"
                className={`w-full px-4 py-3.5 rounded-xl border text-base font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none transition-all tabular-nums ${
                  rateError ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-[#004B87] focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                %/năm
              </span>
            </div>

            {rateError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{rateError}</span>
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Estimated Returns (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border-2 border-[#004B87]/20 shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h4 className="text-base font-extrabold text-[#004B87] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Kết quả dự tính</span>
              </h4>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Lãi cuối kỳ
              </span>
            </div>

            {/* Interest outcome box */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tiền lãi dự tính
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums">
                {isValid ? formatVND(estimatedInterest) : '—'}
              </div>
              <div className="text-[11px] text-slate-400">
                (Áp dụng cho kỳ hạn {selectedTermMonths} tháng với lãi suất {rateNum}%/năm)
              </div>
            </div>

            {/* Total principal + interest box */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tổng tiền nhận về (Gốc + Lãi)
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#004B87] tabular-nums">
                {isValid ? formatVND(totalReceived) : '—'}
              </div>
              <div className="text-[11px] text-slate-400">
                Tiền gốc: {formatVND(amountNum)}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tiền gửi được bảo hiểm theo quy định của Ngân hàng Nhà nước</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hỗ trợ cầm cố sổ tiết kiệm khi có nhu cầu vốn đột xuất</span>
              </div>
            </div>

          </div>

          {/* TikTok Guide Video Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Video hướng dẫn gửi tiết kiệm</h5>
                <p className="text-[11px] text-slate-500">Xem mẹo tối ưu lãi suất tiền gửi trên TikTok</p>
              </div>
            </div>

            <a
              href={depositSection.tiktokVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              <span>Xem video</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
