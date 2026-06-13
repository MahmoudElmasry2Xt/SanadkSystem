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
  Legend,
  ResponsiveContainer
} from 'recharts';


export const FinanceReports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { financeRecords } = useAppStore();

  const revenues = financeRecords.filter(r => r.type === 'Revenue');
  const expenses = financeRecords.filter(r => r.type === 'Expense');
  
  const totalRev = revenues.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRev - totalExp;
  const netMargin = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;

  // Monthly aggregated data for charts
  const monthlyData = [
    { month: isRtl ? 'يناير' : 'Jan', revenue: 40000, expense: 24000, profit: 16000 },
    { month: isRtl ? 'فبراير' : 'Feb', revenue: 45000, expense: 28000, profit: 17000 },
    { month: isRtl ? 'مارس' : 'Mar', revenue: 50000, expense: 32000, profit: 18000 },
    { month: isRtl ? 'أبريل' : 'Apr', revenue: 48000, expense: 29000, profit: 19000 },
    { month: isRtl ? 'مايو' : 'May', revenue: 58000, expense: 35000, profit: 23000 },
    { month: isRtl ? 'يونيو' : 'Jun', revenue: totalRev, expense: totalExp, profit: netProfit },
  ];

  // Category breakdown for expenses
  const expCategories = ['Salary', 'Ads', 'Tools', 'Operations', 'Bills'];
  const expBreakdown = expCategories.map(cat => {
    const amount = expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0);
    return { category: cat, amount };
  });

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('financialReports')}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {isRtl ? 'تحليلات الأرباح والخسائر والتدفق النقدي وتوزيع بنود المصاريف.' : 'Financial statements and Cash Flow reports.'}
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="custom-card">
          <span className="text-xs font-bold text-gray-400 uppercase">{t('revenues')}</span>
          <h3 className="text-2xl font-black text-gray-950 mt-1">{totalRev.toLocaleString()} ج.م</h3>
        </div>
        <div className="custom-card">
          <span className="text-xs font-bold text-gray-400 uppercase">{t('expenses')}</span>
          <h3 className="text-2xl font-black text-gray-950 mt-1">{totalExp.toLocaleString()} ج.م</h3>
        </div>
        <div className="custom-card-red-border">
          <span className="text-xs font-bold text-gray-400 uppercase">{t('netProfit')} ({netMargin.toFixed(0)}%)</span>
          <h3 className="text-2xl font-black text-red-600 mt-1">{netProfit.toLocaleString()} ج.م</h3>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparison chart */}
        <div className="custom-card lg:col-span-2">
          <h4 className="font-bold text-sm text-gray-900 mb-4">{isRtl ? 'التدفق المالي الشهري المقارن' : 'Monthly Financial Flow'}</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" name={t('revenues')} fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name={t('expenses')} fill="#6b7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Category Share */}
        <div className="custom-card">
          <h4 className="font-bold text-sm text-gray-900 mb-4">{isRtl ? 'تحليل هيكل المصروفات' : 'Expenses Breakdown'}</h4>
          <div className="space-y-4">
            {expBreakdown.map((item, idx) => {
              const share = totalExp > 0 ? (item.amount / totalExp) * 100 : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600">{item.category}</span>
                    <span className="text-gray-900 font-bold">{item.amount.toLocaleString()} ج.م ({share.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full" style={{ width: `${share}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profit & Loss Ledger Table */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <span className="font-bold text-xs text-gray-900">{isRtl ? 'جدول حساب الأرباح والخسائر للربع الحالي' : 'Profit & Loss Statement (Q2 2026)'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{isRtl ? 'البند المالي' : 'Financial Line Item'}</th>
                <th className="p-4 text-end">{isRtl ? 'المبلغ الإجمالي' : 'Gross Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-semibold">
              <tr>
                <td className="p-4 text-gray-900 font-bold">{isRtl ? 'إيرادات المبيعات والاشتراكات المقبوضة' : 'Gross Sales & Subscriptions Revenue'}</td>
                <td className="p-4 text-end text-green-600 font-mono font-bold">+{totalRev.toLocaleString()} ج.م</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-600 ps-8">{isRtl ? '- منها عقود وعروض فنية' : 'Contracts & Proposals Share'}</td>
                <td className="p-4 text-end text-gray-600 font-mono">
                  {financeRecords.filter(r => r.category === 'Contract').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} ج.م
                </td>
              </tr>
              <tr>
                <td className="p-4 text-gray-900 font-bold">{isRtl ? 'المصروفات التشغيلية المخصومة' : 'Total Operating Deductible Expenses'}</td>
                <td className="p-4 text-end text-red-600 font-mono font-bold">-{totalExp.toLocaleString()} ج.م</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-600 ps-8">{isRtl ? '- منها رواتب وأجور الموظفين' : 'Salaries Share'}</td>
                <td className="p-4 text-end text-gray-600 font-mono">
                  {financeRecords.filter(r => r.category === 'Salary').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} ج.m
                </td>
              </tr>
              <tr className="bg-red-50/10 font-bold">
                <td className="p-4 text-gray-900 text-sm font-black">{isRtl ? 'صافي الربح / الخسارة الصافية قبل الضرائب' : 'Net Income / Profit before Taxes'}</td>
                <td className="p-4 text-end text-red-600 text-sm font-black font-mono">{netProfit.toLocaleString()} ج.م</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
