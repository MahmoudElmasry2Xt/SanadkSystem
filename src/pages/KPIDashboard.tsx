import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Award, Target, Trophy } from 'lucide-react';

export const KPIDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { } = useAppStore();

  // Mock department performance data
  const deptPerformanceData = [
    { name: isRtl ? 'المبيعات' : 'Sales', target: 100, actual: 88 },
    { name: isRtl ? 'التسويق' : 'Marketing', target: 100, actual: 92 },
    { name: isRtl ? 'الموارد البشرية' : 'HR', target: 100, actual: 95 },
    { name: isRtl ? 'المالية' : 'Finance', target: 100, actual: 97 },
  ];

  // Mock performance over time
  const monthlyPerformanceTrend = [
    { month: isRtl ? 'يناير' : 'Jan', score: 7.8 },
    { month: isRtl ? 'فبراير' : 'Feb', score: 8.0 },
    { month: isRtl ? 'مارس' : 'Mar', score: 8.2 },
    { month: isRtl ? 'أبريل' : 'Apr', score: 8.5 },
    { month: isRtl ? 'مايو' : 'May', score: 8.7 },
    { month: isRtl ? 'يونيو' : 'Jun', score: 8.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('kpiDashboard')}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {isRtl ? 'تحليل ومقارنة معدلات إنجاز مؤشرات الأداء للأقسام والموظفين.' : 'Track company and team KPI completion trends.'}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="custom-card-red-border">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'متوسط أداء الشركة' : 'Company Avg Score'}</span>
              <h3 className="text-2xl font-black text-red-600 mt-1">8.9 / 10</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="custom-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'نسبة إنجاز الأهداف' : 'Target Fulfillment'}</span>
              <h3 className="text-2xl font-black text-gray-950 mt-1">92.5%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <Target className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="custom-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'أفضل الأقسام أداءً' : 'Top Performing Dept'}</span>
              <h3 className="text-2xl font-black text-gray-950 mt-1">{isRtl ? 'المالية' : 'Finance'}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department performance */}
        <div className="custom-card">
          <h4 className="font-bold text-sm text-gray-900 mb-4">{isRtl ? 'أداء الأقسام مقارنة بالأهداف' : 'Department Performance vs Target (%)'}</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="actual" name={isRtl ? 'الإنجاز الفعلي' : 'Actual'} fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance trend over time */}
        <div className="custom-card">
          <h4 className="font-bold text-sm text-gray-900 mb-4">{isRtl ? 'معدل التطور الشهري العام للشركة' : 'Monthly Performance Score Trend'}</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPerformanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis domain={[5, 10]} stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="score" name={isRtl ? 'الدرجة المتوسطة' : 'Avg Score'} stroke="#ef4444" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leaderboard rankings */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <span className="font-bold text-xs text-gray-900">{isRtl ? 'ترتيب الموظفين حسب الكفاءة والأداء' : 'Employee KPI Performance Rankings'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-center w-16">{isRtl ? 'الترتيب' : 'Rank'}</th>
                <th className="p-4 text-start">{t('employeeList')}</th>
                <th className="p-4 text-start">{t('department')}</th>
                <th className="p-4 text-start">{isRtl ? 'المسمى الوظيفي' : 'Job Title'}</th>
                <th className="p-4 text-center">{isRtl ? 'تقييم الأداء النهائي' : 'Final Appraisal Rating'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-center font-black text-red-600">#1</td>
                <td className="p-4 font-bold text-gray-900">محمود عبد السلام</td>
                <td className="p-4 text-gray-500">المبيعات</td>
                <td className="p-4 text-gray-600 font-medium">مدير حسابات العملاء</td>
                <td className="p-4 text-center font-bold text-green-600 font-mono">9.2 / 10</td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-center font-black text-red-600">#2</td>
                <td className="p-4 font-bold text-gray-900">دينا الشافعي</td>
                <td className="p-4 text-gray-500">التسويق</td>
                <td className="p-4 text-gray-600 font-medium">أخصائي حملات إعلانية</td>
                <td className="p-4 text-center font-bold text-green-600 font-mono">8.8 / 10</td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-center font-black text-red-600">#3</td>
                <td className="p-4 font-bold text-gray-900">شريف النجار</td>
                <td className="p-4 text-gray-500">الموارد البشرية</td>
                <td className="p-4 text-gray-600 font-medium">مسؤول شؤون الموظفين</td>
                <td className="p-4 text-center font-bold text-green-600 font-mono">8.5 / 10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
