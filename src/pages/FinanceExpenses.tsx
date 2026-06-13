import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type FinancialRecord } from '../store/useAppStore';
import { Plus, CreditCard, Tag, X } from 'lucide-react';

export const FinanceExpenses: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { financeRecords, addFinancialRecord } = useAppStore();

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Salary' as FinancialRecord['category'],
    title: '',
    amount: 500,
    date: new Date().toISOString().split('T')[0]
  });

  const expenses = financeRecords.filter(r => r.type === 'Expense');
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFinancialRecord({
      type: 'Expense',
      ...formData
    });
    setFormOpen(false);
    setFormData({
      category: 'Salary',
      title: '',
      amount: 500,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const categoryLabels: Record<string, string> = {
    'Salary': isRtl ? 'رواتب' : 'Salary',
    'Ads': isRtl ? 'إعلانات' : 'Marketing/Ads',
    'Tools': isRtl ? 'أدوات برمجية' : 'Software Tools',
    'Operations': isRtl ? 'تشغيل وإيجارات' : 'Operations',
    'Bills': isRtl ? 'فواتير ومرافق' : 'Utilities/Bills'
  };

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('expenses')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'رصد وتوثيق كافة المصاريف التشغيلية، الرواتب، تمويل الحملات والتراخيص.' : 'Log and track all operational expenses.'}
          </p>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'تسجيل مصروف جديد' : 'Log Expense'}</span>
        </button>
      </div>

      {/* Expense Card Summary */}
      <div className="custom-card-red-border max-w-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'إجمالي المصروفات المحتسبة' : 'Total Expenses'}</span>
            <h3 className="text-3xl font-black text-red-600 mt-1">{totalExpense.toLocaleString()} ج.م</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <span className="font-bold text-xs text-gray-900">{isRtl ? 'دفتر قيود المصروفات' : 'Expenses Ledger'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{isRtl ? 'البيان / الوصف' : 'Description / Title'}</th>
                <th className="p-4 text-start">{t('date')}</th>
                <th className="p-4 text-start">{isRtl ? 'التصنيف' : 'Category'}</th>
                <th className="p-4 text-end">{isRtl ? 'القيمة' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{exp.title}</td>
                  <td className="p-4 text-gray-500 font-mono">{exp.date}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      <Tag className="w-3 h-3" />
                      <span>{categoryLabels[exp.category] || exp.category}</span>
                    </span>
                  </td>
                  <td className="p-4 text-end font-mono font-bold text-red-600">-{exp.amount.toLocaleString()} ج.م</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400">
                    لا يوجد مصروفات مسجلة بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-black text-gray-900 text-sm mb-6">{isRtl ? 'تسجيل قيد مصروف جديد' : 'Log Expense'}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'البيان / الوصف' : 'Description / Title'}</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="custom-input text-xs"
                  placeholder="مرتبات الموظفين لشهر مايو..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'التصنيف' : 'Category'}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="custom-input text-xs"
                  >
                    <option value="Salary">Salary</option>
                    <option value="Ads">Marketing/Ads</option>
                    <option value="Tools">Software Tools</option>
                    <option value="Operations">Operations</option>
                    <option value="Bills">Utilities/Bills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('date')}</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'مبلغ المصروف (ج.م)' : 'Amount'}</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="custom-input text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {t('save')}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
