import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Bell, Check } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 text-red-600 border border-red-100';
      case 'warning':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      case 'success':
        return 'bg-green-50 text-green-600 border border-green-100';
      default:
        return 'bg-blue-50 text-blue-600 border border-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('notifications')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'استعراض وقراءة التنبيهات الإدارية، إشعارات المهام والتحديثات المالية.' : 'Review system alert notifications.'}
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="w-full sm:w-auto custom-btn-secondary py-2 text-xs flex items-center justify-center gap-1.5 font-bold"
        >
          <Check className="w-4 h-4" />
          <span>{isRtl ? 'تحديد الكل كمقروء' : 'Mark all as read'}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'all' ? 'bg-red-600 text-white shadow-sm' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isRtl ? 'الكل' : 'All'}
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'unread' ? 'bg-red-600 text-white shadow-sm' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isRtl ? 'غير المقروءة' : 'Unread'}
        </button>
      </div>

      {/* Notifications Ledger List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`custom-card p-4 flex items-start justify-between cursor-pointer border-s-4 transition-all ${
              !n.read ? 'border-s-red-600 bg-red-50/5/30' : 'border-s-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className={`p-2 rounded-xl shrink-0 ${getAlertBadgeColor(n.type)}`}>
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-xs text-gray-950 flex items-center gap-2">
                  <span>{n.title}</span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  )}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-gray-400 font-mono mt-3 block">
                  {new Date(n.date).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <button className="text-gray-400 hover:text-red-600 p-1 rounded-xl transition-colors">
              <Check className="w-4 h-4" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="custom-card py-20 text-center text-gray-400 text-xs">
            لا توجد إشعارات جديدة حالياً
          </div>
        )}
      </div>
    </div>
  );
};
