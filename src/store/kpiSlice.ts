import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface KPIItem {
  id: string;
  name: string;
  description: string;
  weight: number;
  target: number;
  actual: number;
  type: 'Number' | 'Percentage' | 'Currency' | 'Rating' | 'Boolean';
  source: 'Manual' | 'CRM' | 'Tasks' | 'Finance' | 'Attendance';
  selfScore?: number;
  managerScore?: number;
  finalScore?: number;
}

export interface KPITemplate {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  period: string;
  items: KPIItem[];
}

interface KPIState {
  kpiTemplates: KPITemplate[];
}

const mockKpiTemplates: KPITemplate[] = [
  {
    id: 'tpl1',
    name: 'تقييم الربع الثاني لقسم المبيعات',
    department: 'المبيعات',
    jobTitle: 'مدير حسابات العملاء',
    period: 'Q2 2026',
    items: [
      { id: 'kpi_it1', name: 'تحقيق المبيعات المستهدفة', description: 'الوصول إلى الحجم المالي المستهدف للمبيعات الجديدة.', weight: 40, target: 150000, actual: 125000, type: 'Currency', source: 'CRM', selfScore: 8, managerScore: 7, finalScore: 7.5 },
      { id: 'kpi_it2', name: 'تطوير قاعدة العملاء', description: 'تحويل عملاء محتملين جدد إلى مشترين فعليين.', weight: 30, target: 20, actual: 18, type: 'Number', source: 'CRM', selfScore: 9, managerScore: 8, finalScore: 8.5 },
      { id: 'kpi_it3', name: 'التسليم وإنهاء المهام', description: 'إتمام المهام البيانية والمتابعات في الموعد المحدد.', weight: 20, target: 95, actual: 92, type: 'Percentage', source: 'Tasks', selfScore: 9, managerScore: 9, finalScore: 9 },
      { id: 'kpi_it4', name: 'ساعات الانضباط والحضور', description: 'الالتزام بمواعيد الدوام الرسمية وعدم تسجيل ساعات تأخير.', weight: 10, target: 98, actual: 95, type: 'Percentage', source: 'Attendance', selfScore: 10, managerScore: 9, finalScore: 9.5 }
    ]
  }
];

const initialState: KPIState = {
  kpiTemplates: mockKpiTemplates
};

const kpiSlice = createSlice({
  name: 'kpi',
  initialState,
  reducers: {
    addKpiTemplate(state, action: PayloadAction<KPITemplate>) {
      state.kpiTemplates.unshift(action.payload);
    },
    updateKpiItemScore(
      state,
      action: PayloadAction<{
        templateId: string;
        itemId: string;
        scores: Partial<Pick<KPIItem, 'selfScore' | 'managerScore' | 'finalScore'>>;
      }>
    ) {
      const { templateId, itemId, scores } = action.payload;
      const template = state.kpiTemplates.find(t => t.id === templateId);
      if (template) {
        const item = template.items.find(i => i.id === itemId);
        if (item) {
          Object.assign(item, scores);
        }
      }
    }
  }
});

export const { addKpiTemplate, updateKpiItemScore } = kpiSlice.actions;
export default kpiSlice.reducer;
