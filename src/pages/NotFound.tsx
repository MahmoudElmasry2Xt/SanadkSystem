import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store';
import logo from '../assets/logo.jpg';
import img404 from '../assets/404.gif';
import { Home, LogIn } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { isAuthenticated } = useAppSelector((state) => state.auth);

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

        {/* 404 Illustration Image */}
        <div className="flex justify-center">
          <img
            src={img404}
            alt="404 Not Found"
            className="w-48 h-auto object-contain rounded-2xl shadow-md border border-gray-100"
          />
        </div>

        {/* Error Info */}
        <div>
          <h1 className="text-5xl font-black text-gray-950 tracking-tight">404</h1>
          <h2 className="text-base font-bold text-gray-900 mt-2">
            {isRtl ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </h2>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            {isRtl
              ? "عذراً! الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
              : "Oops! The page you're looking for doesn't exist or has been moved."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/')}
              className="w-full custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>{isRtl ? 'العودة للوحة التحكم' : 'Back to Dashboard'}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRtl ? 'العودة لتسجيل الدخول' : 'Back to Login'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
