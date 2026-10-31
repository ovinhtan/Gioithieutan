import React from 'react';
import contentData from '../data/contentData.json';
import { Phone, ShieldCheck, Clock, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { branding, branchSection } = contentData;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Mission */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl font-black text-white tracking-tight">
                {branding.brandName}
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400 border-l border-slate-700 pl-3">
                {branding.slogan}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Cổng dịch vụ số hỗ trợ khách hàng tương tác trực tiếp tại quầy giao dịch VietinBank Chi nhánh Kiên Giang.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Hệ thống bảo mật ngân hàng tiêu chuẩn quốc tế</span>
            </div>
          </div>

          {/* Working hours & Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thời gian phục vụ</h4>
            <div className="flex items-start gap-2.5 text-sm text-slate-400">
              <Clock className="w-4 h-4 text-[#EE3124] shrink-0 mt-0.5" />
              <span>{branchSection.workingHours}</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-[#004B87] shrink-0 mt-0.5" />
              <span>{branchSection.branches[0].address}</span>
            </div>
          </div>

          {/* Dedicated Consultant & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hỗ trợ trực tiếp tại quầy</h4>
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80">
              <div className="text-xs text-slate-400">{branding.consultant.role}</div>
              <div className="text-base font-bold text-white mt-0.5">{branding.consultant.name}</div>
              <a
                href={`tel:${branding.consultant.phoneRaw}`}
                className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-[#EE3124] hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>{branding.consultant.phone}</span>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam (VietinBank). Bản quyền thuộc về VietinBank.</p>
          <div className="flex items-center gap-4">
            <span>Tổng đài CSKH: 1900 558 868</span>
            <span>·</span>
            <a href="https://www.vietinbank.vn" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
              vietinbank.vn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
