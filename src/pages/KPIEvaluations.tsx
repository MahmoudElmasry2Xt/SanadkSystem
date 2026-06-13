import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Star, User, UserCheck } from 'lucide-react';

export const KPIEvaluations: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { kpiTemplates, updateKpiItemScore } = useAppStore();

  const [selectedTplId, setSelectedTplId] = useState(kpiTemplates[0]?.id || 'tpl1');
  const activeTemplate = kpiTemplates.find(t => t.id === selectedTplId) || kpiTemplates[0];

  // Temporary local score inputs
  const [scores, setScores] = useState<Record<string, { self: number; manager: number }>>({});

  const handleScoreChange = (itemId: string, type: 'self' | 'manager', value: number) => {
    const clampedVal = Math.min(10, Math.max(0, value));
    
    setScores(prev => {
      const current = prev[itemId] || {
        self: activeTemplate.items.find(i => i.id === itemId)?.selfScore || 0,
        manager: activeTemplate.items.find(i => i.id === itemId)?.managerScore || 0
      };
      
      const nextItem = {
        ...current,
        [type]: clampedVal
      };
      
      return {
        ...prev,
        [itemId]: nextItem
      };
    });
  };

  const handleSaveEvaluations = () => {
    if (!activeTemplate) return;
    
    activeTemplate.items.forEach(item => {
      const itemScores = scores[item.id];
      if (itemScores) {
        const finalScore = Number(((itemScores.self + itemScores.manager) / 2).toFixed(1));
        updateKpiItemScore(activeTemplate.id, item.id, {
          selfScore: itemScores.self,
          managerScore: itemScores.manager,
          finalScore: finalScore
        });
      }
    });

    alert(isRtl ? 'تم حفظ وحساب درجات التقييم بنجاح!' : 'Evaluations scores updated successfully!');
  };

  // Calculate overall rating sum
  const calculateOverallAppraisal = () => {
    if (!activeTemplate) return 0;
    
    let totalScore = 0;
    
    activeTemplate.items.forEach(item => {
      const local = scores[item.id];
      const self = local ? local.self : (item.selfScore || 0);
      const mgr = local ? local.manager : (item.managerScore || 0);
      const final = Number(((self + mgr) / 2).toFixed(1));
      
      // Weight contributes to overall score
      totalScore += (final * (item.weight / 100));
    });
    
    return Number(totalScore.toFixed(1));
  };

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('evaluationFlow')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'دورة التقييم المشتركة: تسجيل التقييم الذاتي وتقييم المدير وحساب التقييم النهائي.' : 'Perform self and manager assessments.'}
          </p>
        </div>

        {/* Template selector */}
        <div className="w-full sm:w-64">
          <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'نموذج التقييم الفعال' : 'Active Template'}</label>
          <select
            value={selectedTplId}
            onChange={(e) => {
              setSelectedTplId(e.target.value);
              setScores({});
            }}
            className="custom-input py-2 text-xs"
          >
            {kpiTemplates.map(tpl => (
              <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
            ))}
          </select>
        </div>
      </div>

      {activeTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scoring Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="custom-card p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <span className="font-bold text-xs text-gray-900">{isRtl ? 'بنود التقييم الحالي والدرجات' : 'Appraisal Metrics'}</span>
              </div>

              <div className="p-4 space-y-4">
                {activeTemplate.items.map((item) => {
                  const local = scores[item.id];
                  const selfVal = local ? local.self : (item.selfScore || 0);
                  const mgrVal = local ? local.manager : (item.managerScore || 0);
                  
                  return (
                    <div key={item.id} className="p-4 border border-gray-100 rounded-xl hover:border-red-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">{item.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.description}</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          {isRtl ? 'الوزن' : 'Weight'}: {item.weight}%
                        </span>
                      </div>

                      {/* Inputs Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 items-center">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div className="w-full">
                            <label className="block text-[9px] font-bold text-gray-400 mb-0.5">{t('selfEval')} (0-10)</label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={selfVal}
                              onChange={(e) => handleScoreChange(item.id, 'self', parseFloat(e.target.value) || 0)}
                              className="custom-input py-1.5 px-2.5 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-gray-400" />
                          <div className="w-full">
                            <label className="block text-[9px] font-bold text-gray-400 mb-0.5">{t('managerEval')} (0-10)</label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={mgrVal}
                              onChange={(e) => handleScoreChange(item.id, 'manager', parseFloat(e.target.value) || 0)}
                              className="custom-input py-1.5 px-2.5 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div className="bg-red-50/20 border border-red-100/30 rounded-xl p-2.5 text-center">
                          <span className="block text-[9px] font-bold text-red-500 uppercase">{t('finalScore')}</span>
                          <span className="text-sm font-black text-red-600 font-mono">
                            {((selfVal + mgrVal) / 2).toFixed(1)} / 10
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSaveEvaluations}
              className="w-full custom-btn-primary py-3 text-xs"
            >
              <span>{isRtl ? 'حفظ وإرسال التقييم النهائي' : 'Commit & Save Appraisal'}</span>
            </button>
          </div>

          {/* Appraisal scorecard summary */}
          <div>
            <div className="custom-card-red-border text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 fill-red-600 text-red-600" />
              </div>
              
              <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'معدل التقييم الإجمالي' : 'Overall Appraisal Score'}</span>
              <h2 className="text-4xl font-black text-red-600 mt-2 font-mono">{calculateOverallAppraisal()} / 10</h2>
              
              <div className="mt-6 w-full space-y-2 border-t border-gray-50 pt-4 text-xs text-start">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">{isRtl ? 'مستوى الأداء:' : 'Performance Level:'}</span>
                  <span className="text-red-600 font-bold">
                    {calculateOverallAppraisal() >= 9 ? (isRtl ? 'ممتاز' : 'Excellent') :
                     calculateOverallAppraisal() >= 8 ? (isRtl ? 'جيد جداً' : 'Very Good') :
                     calculateOverallAppraisal() >= 7 ? (isRtl ? 'جيد' : 'Good') : (isRtl ? 'يحتاج تطوير' : 'Needs Development')}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                  {isRtl ? 'يتم حساب التقييم الإجمالي بناءً على حاصل ضرب التقييم النهائي لكل مؤشر في وزنه النسبي المحدد مسبقاً.' : 'Calculated by multiplying each metric score by its relative weight.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 text-xs">
          لا يوجد نماذج تقييم نشطة
        </div>
      )}
    </div>
  );
};
