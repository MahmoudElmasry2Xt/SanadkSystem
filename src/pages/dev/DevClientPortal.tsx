import React, { useState } from 'react';
import { useDevModuleStore } from '../../store/devModuleStore';
import { 
  CheckCircle2, Calendar
} from 'lucide-react';

export const DevClientPortal: React.FC = () => {
  const { projects, changeRequests } = useDevModuleStore();

  // Find project associated with client "مجموعة الصاوي العقارية"
  const clientProject = projects.find(p => p.clientName === 'مجموعة الصاوي العقارية') || projects[0];

  const [activeTab, setActiveTab] = useState<'progress' | 'stages' | 'cr' | 'invoices'>('progress');

  if (!clientProject) {
    return (
      <div className="bg-gray-50 p-8 rounded-2xl text-center text-gray-400">
        لا توجد أي مشروعات نشطة تابعة لحسابك حالياً.
      </div>
    );
  }



  // Invoices
  const clientInvoices = [
    { id: 'inv-1', title: 'دفعة مقدمة - بدء مرحلة التأسيس والتصاميم', amount: '25,000 USD', status: 'Paid', date: '2026-05-12' },
    { id: 'inv-2', title: 'دفعة ثانية - بدء مرحلة التطوير والبرمجة', amount: '30,000 USD', status: 'Paid', date: '2026-06-11' },
    { id: 'inv-3', title: 'دفعة نهائية - إطلاق وتشغيل المشروع والتدريب', amount: '40,000 USD', status: 'Pending', date: '2026-08-30' }
  ];

  const projectCRs = changeRequests.filter(cr => cr.projectId === clientProject.id);

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="bg-gradient-to-r from-red-600 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-black tracking-widest uppercase text-white">بوابة العميل الآمنة</span>
        <h1 className="text-xl font-black mt-2">مرحباً بك في لوحة متابعة مشروعك</h1>
        <p className="text-xs text-gray-200 mt-1">تابع سير العمل، التقدم، المراحل الزمنية، والملفات دون تفاصيل فنية معقدة</p>
      </div>

      {/* Project Status Overview */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-[10px] text-gray-400 block font-semibold">المشروع الحالي</span>
          <span className="text-xs font-extrabold text-gray-900 mt-1 block">{clientProject.name}</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 block font-semibold">تاريخ التسليم النهائي المتوقع</span>
          <span className="text-xs font-extrabold text-gray-900 mt-1 block flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            {clientProject.deadline}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 block font-semibold">نسبة التقدم الإجمالية</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: `${clientProject.progress}%` }}></div>
            </div>
            <span className="text-xs font-mono font-black text-red-600">{clientProject.progress}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-2 bg-white p-1 rounded-xl shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'progress' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          نسبة التقدم
        </button>
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'stages' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          مراحل المشروع
        </button>

        <button
          onClick={() => setActiveTab('cr')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'cr' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          طلبات التعديل
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'invoices' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          الفواتير والدفعات المالية
        </button>
      </div>

      {/* Restricted Details Panel */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900">تقرير المتابعة ونسب الإنجاز</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              يسير العمل في المشروع حالياً وفق الخطة الزمنية المقررة. تم الانتهاء بالكامل من مرحلة تحليل المتطلبات والتصميمات، ويقوم فريق التطوير الآن بالبرمجة الخلفية وبناء خوادم الدفع والعمليات.
            </p>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>التقدم الإجمالي</span>
                <span className="text-red-600 font-mono">{clientProject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: `${clientProject.progress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stages' && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-sm text-gray-900 mb-4">الخط الزمني المعتمد للمراحل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientProject.stages.map((stage, idx) => (
                <div key={idx} className="p-4 border border-gray-50 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${
                    stage.status === 'Completed' ? 'text-green-500' : 'text-gray-300'
                  }`} />
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 block">{stage.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">الحالة: {stage.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === 'cr' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900">طلبات التعديل المقدمة من طرفكم</h3>
            <div className="space-y-2">
              {projectCRs.map(cr => (
                <div key={cr.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-gray-800 block">{cr.requestTitle}</span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">التكلفة الإضافية: {cr.costImpact} USD | الحالة: {cr.status}</span>
                  </div>
                </div>
              ))}
              {projectCRs.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-400">لا توجد أي طلبات تعديل جارية.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900">سجل الفواتير والدفعات المالية للمشروع</h3>
            <div className="space-y-2">
              {clientInvoices.map(inv => (
                <div key={inv.id} className="p-3 border border-gray-100 rounded-xl flex justify-between items-center text-xs hover:border-red-100 transition-colors">
                  <div>
                    <span className="font-extrabold text-gray-850 block">{inv.title}</span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">تاريخ الفاتورة: {inv.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-gray-900 font-mono">{inv.amount}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700 animate-pulse'
                    }`}>
                      {inv.status === 'Paid' ? 'تم الدفع' : 'مستحقة'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevClientPortal;
