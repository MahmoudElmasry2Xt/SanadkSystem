import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type KPITemplate, type KPIItem } from '../store/useAppStore';
import { Plus, Trash2, X, Settings, Database, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';

export const KPIBuilder: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { kpiTemplates, addKpiTemplate } = useAppStore();

  const [formOpen, setFormOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [department, setDepartment] = useState('المبيعات');
  const [jobTitle, setJobTitle] = useState('');
  const [period, setPeriod] = useState('Q2 2026');

  // Temporary list of items being built for a template
  const [tempItems, setTempItems] = useState<Omit<KPIItem, 'id' | 'actual' | 'target'>[]>([
    { name: 'تحقيق المبيعات المستهدفة', description: 'الوصول إلى الحجم المالي المستهدف للمبيعات الجديدة.', weight: 40, type: 'Currency', source: 'CRM' },
    { name: 'تطوير قاعدة العملاء', description: 'تحويل عملاء محتملين جدد إلى مشترين فعليين.', weight: 30, type: 'Number', source: 'CRM' }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(10);
  const [newItemType, setNewItemType] = useState<KPIItem['type']>('Percentage');
  const [newItemSource, setNewItemSource] = useState<KPIItem['source']>('Manual');

  const addTempItem = () => {
    if (!newItemName.trim()) return;
    setTempItems([
      ...tempItems,
      {
        name: newItemName,
        description: newItemDesc,
        weight: newItemWeight,
        type: newItemType,
        source: newItemSource
      }
    ]);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemWeight(10);
  };

  const removeTempItem = (idx: number) => {
    setTempItems(tempItems.filter((_, i) => i !== idx));
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || tempItems.length === 0) return;
    
    const totalWeight = tempItems.reduce((acc, curr) => acc + curr.weight, 0);
    if (totalWeight !== 100) {
      toast.error(isRtl ? 'مجموع الأوزان النسبية للبنود يجب أن يساوي 100% بالتمام والكمال!' : 'The sum of weights must equal 100%!');
      return;
    }

    const newTemplate: KPITemplate = {
      id: 'tpl_' + (kpiTemplates.length + 1),
      name: templateName,
      department,
      jobTitle,
      period,
      items: tempItems.map((item, index) => ({
        ...item,
        id: 'kpi_it_' + (kpiTemplates.length + 1) + '_' + index,
        target: 100, // default target
        actual: 0
      }))
    };

    addKpiTemplate(newTemplate);
    toast.success(isRtl ? 'تم إنشاء قالب تقييم الأداء بنجاح!' : 'KPI Appraisal template created successfully!');
    setFormOpen(false);
    setTemplateName('');
    setJobTitle('');
    setTempItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('kpiBuilder')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'تصميم وبناء قوالب التقييم لمختلف الإدارات والوظائف وتوزيع الأوزان النسبية.' : 'Design and construct KPI templates.'}
          </p>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إنشاء نموذج تقييم' : 'Create KPI Template'}</span>
        </button>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kpiTemplates.map((tpl) => (
          <div key={tpl.id} className="custom-card-red-border flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{tpl.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{tpl.department} | {tpl.jobTitle} | {tpl.period}</p>
                </div>
                <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                  <Settings className="w-4 h-4" />
                </div>
              </div>

              {/* Items in template */}
              <div className="mt-4 space-y-3">
                {tpl.items.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50/50 rounded-xl border border-gray-50 flex justify-between items-start">
                    <div>
                      <p className="font-bold text-xs text-gray-900">{item.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.25 rounded-md">
                        <Database className="w-2.5 h-2.5" />
                        <span>{item.source}</span>
                      </span>
                    </div>
                    
                    <div className="text-end">
                      <span className="text-xs font-bold text-gray-900">{item.weight}%</span>
                      <span className="block text-[9px] text-gray-400 font-medium mt-0.5">{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
              <span>{isRtl ? 'عدد المؤشرات' : 'Indicators'}: {tpl.items.length}</span>
              <span className="text-red-600">100% {isRtl ? 'إجمالي الوزن' : 'Total Weight'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* KPI Template Creation Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <form
            onSubmit={handleCreateTemplate}
            className="bg-white rounded-2xl w-full max-w-2xl p-6 z-10 shadow-2xl relative border border-gray-100 overflow-y-auto max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-black text-gray-900 text-sm mb-6">{isRtl ? 'منشئ نموذج مؤشرات الأداء الجديد' : 'KPI Template Builder'}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('kpiTemplateName')}</label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="custom-input text-xs"
                  placeholder={isRtl ? 'مثال: تقييم النصف الأول لقسم التسويق' : 'e.g. H1 Marketing KPI'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('department')}</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="custom-input text-xs"
                >
                  <option value="المبيعات">المبيعات</option>
                  <option value="التسويق">التسويق</option>
                  <option value="الموارد البشرية">الموارد البشرية</option>
                  <option value="الإدارة المالية">الإدارة المالية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'المسمى الوظيفي المستهدف' : 'Job Title'}</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="custom-input text-xs"
                  placeholder="أخصائي حملات إعلانية"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'الفترة الزمنية' : 'Period'}</label>
                <input
                  type="text"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="custom-input text-xs"
                  placeholder="Q2 2026"
                />
              </div>
            </div>

            {/* Sub-form: Add KPI item */}
            <div className="border border-red-100 rounded-2xl p-4 bg-red-50/10 mb-6 space-y-4">
              <h4 className="font-bold text-xs text-red-600 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>{isRtl ? 'إضافة مؤشر قياس فرعي' : 'Add Measurement Indicator'}</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'اسم المؤشر' : 'Indicator Name'}</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="custom-input py-2 text-xs"
                    placeholder="معدل النقر إلى الظهور CTR"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'الوصف' : 'Description'}</label>
                  <input
                    type="text"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="custom-input py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('weight')} (%)</label>
                  <input
                    type="number"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(parseInt(e.target.value) || 0)}
                    className="custom-input py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('measurementType')}</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as KPIItem['type'])}
                    className="custom-input py-2 text-xs"
                  >
                    <option value="Number">Number</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Currency">Currency</option>
                    <option value="Rating">Rating</option>
                    <option value="Boolean">Boolean</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'مصدر البيانات' : 'Data Source'}</label>
                  <select
                    value={newItemSource}
                    onChange={(e) => setNewItemSource(e.target.value as KPIItem['source'])}
                    className="custom-input py-2 text-xs"
                  >
                    <option value="Manual">Manual</option>
                    <option value="CRM">CRM</option>
                    <option value="Tasks">Tasks</option>
                    <option value="Finance">Finance</option>
                    <option value="Attendance">Attendance</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={addTempItem}
                className="w-full custom-btn-primary py-2 text-xs"
              >
                <span>{isRtl ? 'أضف مؤشر للنموذج' : 'Push Indicator'}</span>
              </button>
            </div>

            {/* List of items built so far */}
            <div className="space-y-2 mb-6">
              <span className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'المؤشرات الحالية في النموذج' : 'Active Indicators'}</span>
              {tempItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl text-xs bg-gray-50/50">
                  <div>
                    <span className="font-bold text-gray-900">{item.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{item.description} | {item.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-600">{item.weight}%</span>
                    <button
                      type="button"
                      onClick={() => removeTempItem(idx)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-end text-xs font-bold text-red-600 mt-2">
                {isRtl ? 'المجموع الكلي' : 'TotalSum'}: {tempItems.reduce((acc, curr) => acc + curr.weight, 0)}%
              </div>
            </div>

            <div className="flex gap-2.5 border-t border-gray-50 pt-4">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {isRtl ? 'حفظ النموذج بالكامل' : 'Commit Template'}
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
