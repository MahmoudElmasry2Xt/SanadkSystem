import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowLeft,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  MessageSquare,
  Clock,
  User,
  Plus
} from 'lucide-react';

export const CRMLeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { leads } = useAppStore();
  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="text-center py-16">
        <h3 className="text-sm font-bold text-gray-900">العميل غير موجود</h3>
        <Link to="/crm/leads" className="text-red-600 hover:underline text-xs mt-2 inline-block">
          العودة لقائمة العملاء
        </Link>
      </div>
    );
  }

  // Mock Communication Timeline Activities
  const activities = [
    { id: 1, type: 'call', title: isRtl ? 'مكالمة هاتفية مع العميل' : 'Phone call with client', desc: isRtl ? 'تم الاتفاق على إرسال العرض المالي قبل نهاية الأسبوع.' : 'Agreed to send proposal before weekend.', date: '2026-06-12 11:30 AM', user: 'محمود عبد السلام' },
    { id: 2, type: 'whatsapp', title: isRtl ? 'رسالة واتساب مستلمة' : 'WhatsApp message received', desc: isRtl ? 'طلب العميل مناقشة الأسعار وبنود الصيانة.' : 'Client requested to negotiate maintenance terms.', date: '2026-06-11 04:15 PM', user: 'محمود عبد السلام' },
    { id: 3, type: 'email', title: isRtl ? 'إرسال بريد إلكتروني تلقائي' : 'Email sent', desc: isRtl ? 'إرسال الملف الترويجي لنظام سندك برو.' : 'Sent Sanadk PRO presentation brochure.', date: '2026-06-10 09:00 AM', user: 'نظام إدارة المبيعات' },
    { id: 4, type: 'note', title: isRtl ? 'ملاحظة داخلية' : 'Internal Note', desc: isRtl ? 'العميل من طرف الأستاذ خالد الصاوي، يرجى تقديم خصم 5%.' : 'Referred by Mr. Khaled Sawi, please give 5% discount.', date: '2026-06-08 02:00 PM', user: 'أحمد علي محمد' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with back navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/crm/leads"
          className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-950 m-0">{lead.name}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{lead.company} - {lead.jobTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Client profile card */}
        <div className="space-y-6">
          <div className="custom-card-red-border">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-50">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl mb-3 shadow-inner">
                {lead.name.split(' ')[0][0]}
              </div>
              <h3 className="font-bold text-sm text-gray-900">{lead.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{lead.jobTitle}</p>
              
              <span className="mt-4 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
                {lead.status}
              </span>
            </div>

            {/* Quick Details List */}
            <div className="py-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600 font-mono">{lead.phone}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600 font-mono truncate">{lead.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600">{lead.company}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600">{lead.governorate}</span>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600">{isRtl ? 'المصدر' : 'Source'}: {lead.source}</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600">{isRtl ? 'تاريخ التسجيل' : 'Registered'}: {lead.dateCreated}</span>
              </div>
            </div>
          </div>

          {/* Notes Box */}
          <div className="custom-card">
            <h4 className="font-bold text-sm text-gray-900 mb-3">{t('notes')}</h4>
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {lead.notes || (isRtl ? 'لا توجد ملاحظات إضافية مسجلة.' : 'No notes available.')}
            </p>
          </div>
        </div>

        {/* Right Side: Timeline of Activities */}
        <div className="lg:col-span-2">
          <div className="custom-card h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm text-gray-900">{t('activitiesTimeline')}</h3>
              <button className="custom-btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة نشاط' : 'Add Activity'}</span>
              </button>
            </div>

            {/* Timeline */}
            <div className="relative border-s rtl:border-s-0 rtl:border-e border-gray-100 ms-3 rtl:ms-0 rtl:me-3 space-y-6 pb-4">
              {activities.map((act) => (
                <div key={act.id} className="relative ps-6 rtl:ps-0 rtl:pe-6">
                  {/* Timeline icon dot */}
                  <span className="absolute -start-3 rtl:-end-3 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-red-100 shadow-sm text-red-600">
                    {act.type === 'call' && <Phone className="w-3 h-3" />}
                    {act.type === 'whatsapp' && <MessageSquare className="w-3 h-3" />}
                    {act.type === 'email' && <Mail className="w-3 h-3" />}
                    {act.type === 'note' && <Clock className="w-3 h-3" />}
                  </span>
                  
                  <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:border-red-100 transition-colors">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="font-bold text-xs text-gray-900">{act.title}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">{act.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{act.desc}</p>
                    <div className="flex items-center gap-1.5 mt-3 text-[10px] text-gray-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      <span>{isRtl ? 'بواسطة' : 'By'}: {act.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
