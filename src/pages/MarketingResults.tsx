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


export const MarketingResults: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { campaigns } = useAppStore();

  // Aggregate stats
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
  const totalReach = campaigns.reduce((acc, c) => acc + c.reach, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0);
  
  const avgCPL = totalLeads > 0 ? totalBudget / totalLeads : 0;
  const avgCR = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;
  // roi = ((totalRev - totalBudget) / totalBudget) * 100 — available for future ROI card

  // Chart data
  const chartData = campaigns.map(c => ({
    name: c.name,
    clicks: c.clicks,
    leads: c.leads,
  }));

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('results')}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {isRtl ? 'تحليلات أداء التسويق الرقمي: العائد على الاستثمار، تكلفة العميل ومعدلات التحويل.' : 'Marketing campaign analytics and performance.'}
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="custom-card">
          <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'إجمالي الوصول' : 'Total Reach'}</span>
          <h3 className="text-2xl font-black text-gray-950 mt-1">{totalReach.toLocaleString()}</h3>
        </div>
        
        <div className="custom-card">
          <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'إجمالي النقرات' : 'Total Clicks'}</span>
          <h3 className="text-2xl font-black text-gray-950 mt-1">{totalClicks.toLocaleString()}</h3>
        </div>

        <div className="custom-card">
          <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'متوسط تكلفة العميل CPL' : 'Avg Cost Per Lead (CPL)'}</span>
          <h3 className="text-2xl font-black text-red-600 mt-1">{avgCPL.toFixed(1)} ج.م</h3>
        </div>

        <div className="custom-card-red-border">
          <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'معدل التحويل Conversion' : 'Conversion Rate'}</span>
          <h3 className="text-2xl font-black text-red-600 mt-1">{avgCR.toFixed(2)}%</h3>
        </div>
      </div>

      {/* Chart comparison */}
      <div className="custom-card">
        <h4 className="font-bold text-sm text-gray-900 mb-4">{isRtl ? 'مقارنة التفاعل والنقرات مع العملاء المحتملين' : 'Interactions (Clicks vs Leads)'}</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" name={isRtl ? 'النقرات' : 'Clicks'} fill="#6b7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leads" name={t('leads')} fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed table list */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <span className="font-bold text-xs text-gray-900">{isRtl ? 'جدول أداء الحملات التفصيلي' : 'Detailed Campaigns Performance'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{isRtl ? 'اسم الحملة' : 'Campaign Name'}</th>
                <th className="p-4 text-center">{isRtl ? 'الوصول' : 'Reach'}</th>
                <th className="p-4 text-center">{isRtl ? 'النقرات' : 'Clicks'}</th>
                <th className="p-4 text-center">{t('leads')}</th>
                <th className="p-4 text-center">{t('budget')}</th>
                <th className="p-4 text-end">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c) => {
                const cpl = c.leads > 0 ? c.budget / c.leads : 0;
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{c.name}</td>
                    <td className="p-4 text-center text-gray-500 font-mono">{c.reach.toLocaleString()}</td>
                    <td className="p-4 text-center text-gray-500 font-mono">{c.clicks.toLocaleString()}</td>
                    <td className="p-4 text-center text-red-600 font-bold font-mono">{c.leads}</td>
                    <td className="p-4 text-center text-gray-900 font-bold font-mono">{c.budget.toLocaleString()} ج.م</td>
                    <td className="p-4 text-end text-red-600 font-bold font-mono">{cpl.toFixed(1)} ج.م</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
