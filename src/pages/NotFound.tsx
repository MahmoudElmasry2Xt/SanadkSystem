import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store';
import logo from '../assets/logo.webp';
import img404 from '../assets/404.gif';
import { Home, LogIn } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { isAuthenticated } = useAppSelector((state) => state.auth);

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
    src={img404}
  alt="404 Not Found"
  className="
    w-[60vw]
    md:w-[40vw]
    lg:w-[30vw]
    max-w-[500px]
    min-w-[250px]
    object-contain
    mx-auto
    "
  />

  {/* Content */}
  <div className="mt-4 max-w-md">
    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">
      404
    </h1>

    <h2 className="mt-2 text-lg font-bold text-gray-800">
      {isRtl ? "الصفحة غير موجودة" : "Page Not Found"}
    </h2>

    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
      {isRtl
        ? "عذراً! الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
        : "Oops! The page you're looking for doesn't exist or has been moved."}
    </p>
  </div>

  {/* Actions */}
  <div className="mt-6">
    {isAuthenticated ? (
      <button
        onClick={() => navigate("/")}
        className="
          inline-flex items-center gap-2
          rounded-xl
          bg-red-600
          px-5 py-3
          text-sm font-medium text-white
          transition hover:bg-red-700
        "
      >
        <Home className="h-4 w-4" />
        {isRtl ? "العودة للوحة التحكم" : "Back to Dashboard"}
      </button>
    ) : (
      <button
        onClick={() => navigate("/auth/login")}
        className="
          inline-flex items-center gap-2
          rounded-xl
          bg-red-600
          px-5 py-3
          text-sm font-medium text-white
          transition hover:bg-red-700
        "
      >
        <LogIn className="h-4 w-4" />
        {isRtl ? "العودة لتسجيل الدخول" : "Back to Login"}
      </button>
    )}
  </div>

</div>
  );
};

export default NotFound;
