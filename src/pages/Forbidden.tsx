import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.webp';
import img403 from '../assets/403.webp';
import { ArrowLeft, Home } from 'lucide-react';

export const Forbidden: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-6 text-center">
  
  {/* Logo */}
  <img
    src={logo}
    alt="Logo"
    className="h-12 md:h-14 w-auto object-contain mb-4"
  />

  {/* Illustration */}
  <img
    src={img403}
    alt="403 Forbidden"
    className="
      w-64
      sm:w-80
      md:w-96
      lg:w-[28rem]
      max-w-full
      object-contain
      mx-auto
    "
  />

  {/* Content */}
  <div className="mt-4 max-w-md">
    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">
      403
    </h1>

    <h2 className="mt-2 text-lg font-bold text-gray-800">
      {isRtl ? "غير مصرح بالوصول" : "Access Denied"}
    </h2>

    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
      {isRtl
        ? "عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى مراجعة مسؤول النظام."
        : "You don't have permission to access this page."}
    </p>
  </div>

  {/* Actions */}
  <div className="mt-6 flex flex-col sm:flex-row gap-3">
    <button
      onClick={() => navigate(-1)}
      className="
        inline-flex items-center justify-center gap-2
        rounded-xl
        border border-gray-200
        bg-white
        px-5 py-3
        text-sm font-medium text-gray-700
        transition
        hover:bg-gray-50
      "
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
      {isRtl ? "العودة للخلف" : "Go Back"}
    </button>

    <button
      onClick={() => navigate("/")}
      className="
        inline-flex items-center justify-center gap-2
        rounded-xl
        bg-red-600
        px-5 py-3
        text-sm font-medium text-white
        transition
        hover:bg-red-700
      "
    >
      <Home className="h-4 w-4" />
      {isRtl ? "الرئيسية" : "Dashboard"}
    </button>
  </div>

</div>
  );
};

export default Forbidden;
