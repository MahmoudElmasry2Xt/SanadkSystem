import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { FileText, Download, BarChart2, CheckCircle2, UserCheck, DollarSign } from 'lucide-react';

import toast from 'react-hot-toast';

export const Reports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { leads, tasks, financeRecords, campaigns } = useAppStore();

  const [selectedReport, setSelectedReport] = useState<'crm' | 'marketing' | 'tasks' | 'finance'>('crm');

  const handleExport = () => {
    toast.success(isRtl ? 'تم تصدير التقرير بنجاح بصيغة PDF / Excel!' : 'Report exported successfully to PDF / Excel!');
  };

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('reports')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'مركز التقارير الموحد: توليد واستخراج الإحصائيات الكاملة لجميع أقسام النظام.' : 'Unified report center for downloading statements.'}
          </p>
        </div>

        <button
          onClick={handleExport}
          className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>{isRtl ? 'تصدير التقرير' : 'Export Statement'}</span>
        </button>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedReport('crm')}
          className={`custom-card p-5 cursor-pointer text-center flex flex-col items-center gap-3 border-t-4 transition-all ${
            selectedReport === 'crm' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <BarChart2 className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{isRtl ? 'تقرير المبيعات والعملاء' : 'CRM Leads Report'}</h4>
            <p className="text-[9px] text-gray-400 mt-0.5">{leads.length} {isRtl ? 'سجل عميل فعال' : 'records'}</p>
          </div>
        </div>

        <div
          onClick={() => setSelectedReport('marketing')}
          className={`custom-card p-5 cursor-pointer text-center flex flex-col items-center gap-3 border-t-4 transition-all ${
            selectedReport === 'marketing' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <CheckCircle2 className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{isRtl ? 'تقرير الأداء التسويقي' : 'Marketing Report'}</h4>
            <p className="text-[9px] text-gray-400 mt-0.5">{campaigns.length} {isRtl ? 'حملات إعلانية' : 'campaigns'}</p>
          </div>
        </div>

        <div
          onClick={() => setSelectedReport('tasks')}
          className={`custom-card p-5 cursor-pointer text-center flex flex-col items-center gap-3 border-t-4 transition-all ${
            selectedReport === 'tasks' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <UserCheck className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{isRtl ? 'تقرير إنجاز المهام' : 'Tasks Summary'}</h4>
            <p className="text-[9px] text-gray-400 mt-0.5">{tasks.length} {isRtl ? 'إجمالي المهام' : 'tasks'}</p>
          </div>
        </div>

        <div
          onClick={() => setSelectedReport('finance')}
          className={`custom-card p-5 cursor-pointer text-center flex flex-col items-center gap-3 border-t-4 transition-all ${
            selectedReport === 'finance' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <DollarSign className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{isRtl ? 'التقرير المالي العام' : 'Financial Statement'}</h4>
            <p className="text-[9px] text-gray-400 mt-0.5">{financeRecords.length} {isRtl ? 'عملية مقيدة' : 'entries'}</p>
          </div>
        </div>
      </div>

      {/* Selected Report details render */}
      <div className="custom-card p-6">
        <h3 className="font-black text-sm text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-600" />
          <span>
            {selectedReport === 'crm' && (isRtl ? 'مسودة تقرير العملاء والمبيعات' : 'CRM Leads Performance Statement')}
            {selectedReport === 'marketing' && (isRtl ? 'مسودة تقرير الحملات الإعلانية' : 'Marketing Ad Campaigns Audit')}
            {selectedReport === 'tasks' && (isRtl ? 'تقرير نسب إنجاز المهام والإنتاجية' : 'Productivity & Tasks Completion Summary')}
            {selectedReport === 'finance' && (isRtl ? 'التقرير المالي التفصيلي للأرباح والخسائر' : 'Financial Revenue & Expenses Ledger')}
          </span>
        </h3>

        {/* Dynamic preview text */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-xs text-gray-600 space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200/50">
            <div>
              <span className="block text-gray-400 font-semibold mb-0.5">{isRtl ? 'مستخرج التقرير' : 'Generated by'}</span>
              <span className="font-bold text-gray-900">{isRtl ? 'مدير النظام' : 'System Admin'}</span>
            </div>
            <div>
              <span className="block text-gray-400 font-semibold mb-0.5">{isRtl ? 'تاريخ التوليد' : 'Generation Date'}</span>
              <span className="font-bold text-gray-900 font-mono">{new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 mb-2">{isRtl ? 'ملخص إحصائيات التقرير:' : 'Summary statistics:'}</h4>
            {selectedReport === 'crm' && (
              <ul className="list-disc list-inside space-y-1">
                <li>{isRtl ? 'إجمالي العملاء المسجلين: ' : 'Total Leads: '} {leads.length}</li>
                <li>{isRtl ? 'العملاء المكتملون بنجاح: ' : 'Won Leads: '} {leads.filter(l => l.status === 'Won').length}</li>
                <li>{isRtl ? 'معدل نجاح إتمام الصفقات: ' : 'Deal conversion rate: '} {((leads.filter(l => l.status === 'Won').length / leads.length) * 100).toFixed(0)}%</li>
              </ul>
            )}
            {selectedReport === 'marketing' && (
              <ul className="list-disc list-inside space-y-1">
                <li>{isRtl ? 'إجمالي الحملات النشطة: ' : 'Active Campaigns: '} {campaigns.filter(c => c.status === 'Active').length}</li>
                <li>{isRtl ? 'الميزانية التسويقية الإجمالية: ' : 'Total marketing budget: '} {campaigns.reduce((acc, c) => acc + c.budget, 0).toLocaleString()} ج.م</li>
                <li>{isRtl ? 'العائد المالي العام المحقق: ' : 'Total sales revenue: '} {campaigns.reduce((acc, c) => acc + c.revenueGenerated, 0).toLocaleString()} ج.م</li>
              </ul>
            )}
            {selectedReport === 'tasks' && (
              <ul className="list-disc list-inside space-y-1">
                <li>{isRtl ? 'إجمالي المهام المجدولة: ' : 'Total scheduled tasks: '} {tasks.length}</li>
                <li>{isRtl ? 'المهام المكتملة بنجاح: ' : 'Completed tasks: '} {tasks.filter(t => t.status === 'Completed').length}</li>
                <li>{isRtl ? 'المهام قيد التنفيذ: ' : 'Tasks in progress: '} {tasks.filter(t => t.status === 'In Progress').length}</li>
              </ul>
            )}
            {selectedReport === 'finance' && (
              <ul className="list-disc list-inside space-y-1">
                <li>{isRtl ? 'إجمالي الإيرادات المسجلة: ' : 'Revenues: '} {financeRecords.filter(r => r.type === 'Revenue').reduce((acc, c) => acc + c.amount, 0).toLocaleString()} ج.م</li>
                <li>{isRtl ? 'إجمالي المصروفات التشغيلية: ' : 'Expenses: '} {financeRecords.filter(r => r.type === 'Expense').reduce((acc, c) => acc + c.amount, 0).toLocaleString()} ج.م</li>
                <li>{isRtl ? 'صافي الربح قبل الضرائب: ' : 'Net Profit: '} {(financeRecords.filter(r => r.type === 'Revenue').reduce((acc, c) => acc + c.amount, 0) - financeRecords.filter(r => r.type === 'Expense').reduce((acc, c) => acc + c.amount, 0)).toLocaleString()} ج.م</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
