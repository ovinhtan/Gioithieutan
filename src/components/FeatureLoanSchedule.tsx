import React, { useState, useId } from 'react';
import contentData from '../data/contentData.json';
import { LoanScheduleRow } from '../types';
import { 
  Calculator, 
  Calendar, 
  Table, 
  Printer, 
  Download, 
  X, 
  ArrowUpDown,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export const FeatureLoanSchedule: React.FC = () => {
  const { loanSection } = contentData;
  const loanAmountInputId = useId();
  const assetValueInputId = useId();
  const loanTermInputId = useId();
  const loanRateInputId = useId();
  const disburseDateInputId = useId();
  const dueDaySelectId = useId();

  // Form Inputs (All inputs - no sliders as mandated!)
  const [loanAmountStr, setLoanAmountStr] = useState<string>('6666666667'); // ~6.67B VND as in screenshot
  const [assetValueStr, setAssetValueStr] = useState<string>('33333333333'); // 33.3B VND
  const [termMonthsStr, setTermMonthsStr] = useState<string>('240'); // 240 months (20 years)
  const [annualRateStr, setAnnualRateStr] = useState<string>('8.0'); // 8.0%/year
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-06-16');
  const [repaymentCycle, setRepaymentCycle] = useState<'monthly' | 'quarterly' | 'halfYear' | 'yearly'>('monthly');
  const [paymentDayOfMonth, setPaymentDayOfMonth] = useState<number>(25); // Due date 25th of month
  const [roundingRule, setRoundingRule] = useState<1 | 1000>(1); // Unit VND or 1,000 VND

  // Modal State
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Currency Formatter
  const formatVND = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' VND';
  };

  const formatNumberOnly = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(num));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setLoanAmountStr(raw);
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setAssetValueStr(raw);
  };

  // Business Logic Calculations according to PDF requirements
  const loanAmount = parseFloat(loanAmountStr) || 0;
  const termMonths = parseInt(termMonthsStr, 10) || 1;
  const annualRate = parseFloat(annualRateStr) || 0;

  // Determine cycle divisor and total periods
  let cycleDivisor = 12; // monthly
  let monthsPerPeriod = 1;
  if (repaymentCycle === 'quarterly') {
    cycleDivisor = 4;
    monthsPerPeriod = 3;
  } else if (repaymentCycle === 'halfYear') {
    cycleDivisor = 2;
    monthsPerPeriod = 6;
  } else if (repaymentCycle === 'yearly') {
    cycleDivisor = 1;
    monthsPerPeriod = 12;
  }

  const totalPeriods = Math.max(1, Math.round(termMonths / monthsPerPeriod));
  const periodRate = (annualRate / 100) / cycleDivisor;

  // Generate Schedule Table Rows
  const scheduleRows: LoanScheduleRow[] = [];
  let currentBalance = loanAmount;
  let totalInterest = 0;
  let totalPrincipalPaid = 0;

  // Regular period principal
  const rawPrincipalPerPeriod = totalPeriods > 0 ? loanAmount / totalPeriods : 0;
  let regularPrincipal = roundingRule === 1000
    ? Math.round(rawPrincipalPerPeriod / 1000) * 1000
    : Math.round(rawPrincipalPerPeriod);

  // Generate date starting after disbursement
  const disburse = new Date(disbursementDate);
  const startYear = isNaN(disburse.getFullYear()) ? 2026 : disburse.getFullYear();
  const startMonth = isNaN(disburse.getMonth()) ? 5 : disburse.getMonth(); // 0-indexed

  for (let i = 1; i <= totalPeriods; i++) {
    const periodMonthOffset = i * monthsPerPeriod;
    const targetDate = new Date(startYear, startMonth + periodMonthOffset, paymentDayOfMonth);
    const dateFormatted = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`;

    const openingBalance = currentBalance;
    const periodInterestRaw = openingBalance * periodRate;
    const periodInterest = roundingRule === 1000
      ? Math.round(periodInterestRaw / 1000) * 1000
      : Math.round(periodInterestRaw);

    let periodPrincipal = regularPrincipal;

    // Adjustment for the last period to eliminate rounding drift exactly
    if (i === totalPeriods) {
      periodPrincipal = openingBalance;
    } else if (openingBalance - periodPrincipal < 0) {
      periodPrincipal = openingBalance;
    }

    const totalPayment = periodPrincipal + periodInterest;
    const closingBalance = Math.max(0, openingBalance - periodPrincipal);

    scheduleRows.push({
      period: i,
      paymentDate: dateFormatted,
      openingBalance,
      principal: periodPrincipal,
      interest: periodInterest,
      totalPayment,
      closingBalance
    });

    currentBalance = closingBalance;
    totalInterest += periodInterest;
    totalPrincipalPaid += periodPrincipal;
  }

  const firstPeriodPayment = scheduleRows.length > 0 ? scheduleRows[0].totalPayment : 0;
  const lastPeriodPayment = scheduleRows.length > 0 ? scheduleRows[scheduleRows.length - 1].totalPayment : 0;
  const totalLoanCost = totalPrincipalPaid + totalInterest;

  // Loan to Value ratio if asset provided
  const assetValue = parseFloat(assetValueStr) || 0;
  const ltvRatio = assetValue > 0 ? Math.round((loanAmount / assetValue) * 100) : null;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ['Kỳ', 'Ngày trả nợ', 'Dư nợ đầu kỳ (VND)', 'Gốc trả (VND)', 'Lãi trả (VND)', 'Tổng trả kỳ (VND)', 'Dư nợ cuối kỳ (VND)'];
    const rows = scheduleRows.map((r) => [
      r.period,
      r.paymentDate,
      r.openingBalance,
      r.principal,
      r.interest,
      r.totalPayment,
      r.closingBalance
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lich_tra_no_VietinBank_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#004B87] via-[#003B73] to-[#0A4B82] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Tính năng 05 · Tài chính vay vốn
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {loanSection.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-100 font-medium">
            Phương thức: {loanSection.method}
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs Form + Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Step 1: Input Information (7 cols) - strictly input fields, no sliders */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Bước 1: Nhập thông tin khoản vay</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Không dùng thanh trượt kéo thả
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. Loan Amount */}
            <div className="sm:col-span-2 space-y-2">
              <label htmlFor={loanAmountInputId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Số tiền vay (VND) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanAmountInputId}
                  type="text"
                  value={loanAmountStr ? new Intl.NumberFormat('vi-VN').format(Number(loanAmountStr)) : ''}
                  onChange={handleAmountChange}
                  placeholder="Nhập số tiền vay mong muốn"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#004B87] focus:ring-2 focus:ring-blue-100 outline-none tabular-nums"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                  VND
                </span>
              </div>
            </div>

            {/* 2. Collateral Asset Value */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor={assetValueInputId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Giá trị bất động sản / TSBD (VND)
                </label>
                {ltvRatio !== null && (
                  <span className="text-xs font-bold text-blue-700">
                    Tỷ lệ vay / TS: {ltvRatio}%
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id={assetValueInputId}
                  type="text"
                  value={assetValueStr ? new Intl.NumberFormat('vi-VN').format(Number(assetValueStr)) : ''}
                  onChange={handleAssetChange}
                  placeholder="Nhập giá trị tài sản (nếu có)"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-[#004B87] focus:ring-2 focus:ring-blue-100 outline-none tabular-nums"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                  VND
                </span>
              </div>
            </div>

            {/* 3. Loan Term */}
            <div className="space-y-2">
              <label htmlFor={loanTermInputId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanTermInputId}
                  type="number"
                  min="1"
                  max="420"
                  value={termMonthsStr}
                  onChange={(e) => setTermMonthsStr(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#004B87] outline-none tabular-nums"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Tháng
                </span>
              </div>
            </div>

            {/* 4. Interest Rate */}
            <div className="space-y-2">
              <label htmlFor={loanRateInputId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Lãi suất (% / năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanRateInputId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRateStr}
                  onChange={(e) => setAnnualRateStr(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#004B87] outline-none tabular-nums"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/Năm
                </span>
              </div>
            </div>

            {/* 5. Disbursement Date */}
            <div className="space-y-2">
              <label htmlFor={disburseDateInputId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={disburseDateInputId}
                  type="date"
                  value={disbursementDate}
                  onChange={(e) => setDisbursementDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#004B87] outline-none"
                />
              </div>
            </div>

            {/* 6. Repayment Cycle */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Chu kỳ trả nợ
              </label>
              <select
                value={repaymentCycle}
                onChange={(e) => setRepaymentCycle(e.target.value as 'monthly' | 'quarterly' | 'halfYear' | 'yearly')}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#004B87] outline-none"
              >
                {loanSection.cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Repayment Day of Month */}
            <div className="space-y-2">
              <label htmlFor={dueDaySelectId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Ngày trả nợ định kỳ
              </label>
              <select
                id={dueDaySelectId}
                value={paymentDayOfMonth}
                onChange={(e) => setPaymentDayOfMonth(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#004B87] outline-none"
              >
                {[5, 10, 15, 20, 25, 28].map((day) => (
                  <option key={day} value={day}>
                    Ngày {day} hằng tháng
                  </option>
                ))}
              </select>
            </div>

            {/* 8. Rounding Rule */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Quy tắc làm tròn
              </label>
              <select
                value={roundingRule}
                onChange={(e) => setRoundingRule(Number(e.target.value) as 1 | 1000)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#004B87] outline-none"
              >
                <option value={1}>Làm tròn đến đơn vị đồng</option>
                <option value={1000}>Làm tròn đến 1.000 đồng</option>
              </select>
            </div>

          </div>

          {/* Principle note */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Quy tắc nghiệp vụ ngân hàng:</span>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Gốc trả mỗi kỳ = Số tiền vay / Tổng số kỳ trả nợ</li>
              <li>Lãi kỳ hiện tại = Dư nợ đầu kỳ × Lãi suất kỳ</li>
              <li>Sai lệch làm tròn được tự động điều chỉnh chính xác vào kỳ cuối cùng</li>
            </ul>
          </div>

        </div>

        {/* Step 2: Summary KPI & "Xem chi tiết" CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-[#003B73] text-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
            
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Bước 2: Kết quả dự tính khoản vay
              </span>
              <h4 className="text-xl font-black mt-1">Lịch Trả Dư Nợ Giảm Dần</h4>
            </div>

            {/* Monthly payment range */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 space-y-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Số tiền trả mỗi kỳ
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Từ kỳ đầu:</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                    {formatNumberOnly(firstPeriodPayment)}
                  </span>
                </div>
                <div className="text-slate-400 font-bold">đến</div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Kỳ cuối:</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-300 tabular-nums">
                    {formatNumberOnly(lastPeriodPayment)}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-300 text-right">VND / kỳ</div>
            </div>

            {/* Total interest & grand total */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-slate-300">Tổng lãi phải trả:</span>
                <span className="font-extrabold text-amber-300 tabular-nums">
                  {formatVND(totalInterest)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-slate-300">Tổng tiền thanh toán (Gốc + Lãi):</span>
                <span className="font-extrabold text-white text-base tabular-nums">
                  {formatVND(totalLoanCost)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                <span>Tổng số kỳ thanh toán:</span>
                <span className="font-bold text-white">{totalPeriods} kỳ</span>
              </div>
            </div>

            {/* Primary Action Button: "Xem chi tiết" */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#EE3124] hover:bg-[#d61b1b] text-white font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Table className="w-4 h-4" />
              <span>Xem chi tiết lịch trả nợ ({totalPeriods} kỳ)</span>
            </button>

          </div>

          {/* Value proposition note */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-[#004B87] font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Ưu điểm phương thức dư nợ giảm dần</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tổng số tiền lãi khách hàng phải trả thực tế thấp hơn đáng kể so với phương thức trả góp đều. Áp lực tài chính giảm dần theo thời gian.
            </p>
          </div>
        </div>

      </div>

      {/* Detail Modal: Full Amortization Schedule Table */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khoản vay: {formatVND(loanAmount)} · Thời hạn: {termMonths} tháng · Lãi suất: {annualRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  title="Xuất bảng Excel/CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xuất CSV</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  title="In lịch trả nợ"
                >
                  <Printer className="w-3.5 h-3.5 text-[#004B87]" />
                  <span>In lịch</span>
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Table */}
            <div id="printable-loan-schedule" className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">Kỳ (Stt)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Kỳ trả nợ</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">Số gốc còn lại</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">Gốc</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">Lãi</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-blue-50/60 text-[#004B87]">
                        Tổng Gốc + Lãi
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">Dư nợ cuối kỳ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {/* Row 0: Disbursement Date */}
                    <tr className="bg-amber-50/50 text-slate-600 italic">
                      <td className="py-2 px-3 text-center font-bold">0</td>
                      <td className="py-2 px-3">
                        {new Date(disbursementDate).toLocaleDateString('vi-VN')} (Giải ngân)
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {formatNumberOnly(loanAmount)}
                      </td>
                      <td className="py-2 px-3 text-right">-</td>
                      <td className="py-2 px-3 text-right">-</td>
                      <td className="py-2 px-3 text-right">-</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {formatNumberOnly(loanAmount)}
                      </td>
                    </tr>

                    {/* All period rows */}
                    {scheduleRows.map((row) => (
                      <tr key={row.period} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 text-center font-bold text-slate-700">{row.period}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.paymentDate}</td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                          {formatNumberOnly(row.openingBalance)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-slate-800">
                          {formatNumberOnly(row.principal)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-red-600">
                          {formatNumberOnly(row.interest)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-[#004B87] bg-blue-50/30">
                          {formatNumberOnly(row.totalPayment)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">
                          {formatNumberOnly(row.closingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Summary Totals Row */}
                  <tfoot>
                    <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-950">
                      <td colSpan={3} className="py-3 px-3 uppercase tracking-wider text-left">
                        TỔNG CỘNG
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-300">
                        {formatNumberOnly(totalPrincipalPaid)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-300">
                        {formatNumberOnly(totalInterest)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-white text-sm">
                        {formatNumberOnly(totalLoanCost)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400">0</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                * Bảng tính mang tính chất tham khảo. Lãi suất và lịch trả nợ chính thức căn cứ theo Hợp đồng tín dụng ký kết.
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
