import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.jpg';
import img403 from '../assets/403.jpg';
import { ArrowLeft, Home } from 'lucide-react';

export const Forbidden: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-outfit">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl space-y-6">
        {/* Company Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto object-contain rounded-xl shadow-sm border border-gray-100"
          />
        </div>

        {/* Access Denied Illustration Image */}
        <div className="flex justify-center">
          <img
            src={img403}
            alt="403 Forbidden"
            className="w-48 h-auto object-contain rounded-2xl shadow-md border border-gray-100"
          />
        </div>

        {/* Error Info */}
        <div>
          <h1 className="text-4xl font-black text-gray-950 tracking-tight">403</h1>
          <h2 className="text-lg font-bold text-gray-900 mt-2">
            {isRtl ? 'غير مصرح بالوصول' : 'Access Denied / Forbidden'}
          </h2>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            {isRtl
              ? "عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى مراجعة مسؤول النظام."
              : "You don't have permission to access this page."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 custom-btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{isRtl ? 'العودة للخلف' : 'Go Back'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex-1 custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>{isRtl ? 'الرئيسية' : 'Dashboard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
