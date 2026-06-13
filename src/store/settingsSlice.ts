import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
}

export interface Position {
  id: string;
  name: string;
  departmentId: string;
  grade: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: string;
  trigger: string;
  action: string;
  active: boolean;
}

interface SettingsState {
  departments: Department[];
  positions: Position[];
  automations: AutomationRule[];
}

const mockDepartments: Department[] = [
  { id: 'd1', name: 'المبيعات', description: 'مسؤول عن تحويل العملاء المحتملين إلى عقود مبيعات فعالة.', manager: 'محمود عبد السلام' },
  { id: 'd2', name: 'التسويق', description: 'مسؤول عن إدارة الحملات الإعلانية ومواقع التواصل والتحليلات.', manager: 'دينا الشافعي' },
  { id: 'd3', name: 'الموارد البشرية', description: 'مسؤول عن شؤون الموظفين، الحضور والانضباط والتوظيف.', manager: 'شريف النجار' },
  { id: 'd4', name: 'المالية', description: 'مسؤول عن الإيرادات والمصروفات والأرباح والخسائر والرواتب.', manager: 'سارة خالد محمود' }
];

const mockPositions: Position[] = [
  { id: 'p1', name: 'مدير حسابات العملاء', departmentId: 'd1', grade: 'Senior' },
  { id: 'p2', name: 'أخصائي حملات إعلانية', departmentId: 'd2', grade: 'Mid' },
  { id: 'p3', name: 'مسؤول شؤون الموظفين', departmentId: 'd3', grade: 'Junior' },
  { id: 'p4', name: 'محاسب عام', departmentId: 'd4', grade: 'Senior' }
];

// The 15 Automation Rules requested
const mockAutomations: AutomationRule[] = [
  { id: 'a1', name: 'Lead Creation Automation', description: 'إرسال إشعار فوري عند تسجيل عميل جديد من فيسبوك.', type: 'Lead Creation', trigger: 'New Lead Inbound', action: 'Send Email Notification', active: true },
  { id: 'a2', name: 'Lead Assignment Automation', description: 'توزيع تلقائي للعملاء بالتساوي على موظفي المبيعات النشطين.', type: 'Lead Assignment', trigger: 'New Lead Saved', action: 'Round Robin Assign', active: true },
  { id: 'a3', name: 'WhatsApp Automation', description: 'إرسال رسالة ترحيبية عبر واتساب للعميل الجديد فور دخوله للنظام.', type: 'WhatsApp', trigger: 'Lead Assigned', action: 'Send Template Message #1', active: false },
  { id: 'a4', name: 'Follow-Up Automation', description: 'إنشاء تذكير ومهمة متابعة تلقائية إذا لم يتغير حالة العميل خلال 48 ساعة.', type: 'Follow-Up', trigger: 'Lead Stagnant 2 Days', action: 'Create Follow-up Task', active: true },
  { id: 'a5', name: 'Lead Stage Automation', description: 'تحديث حالة العميل تلقائياً إلى "Negotiation" عند إرسال مسودة العقد.', type: 'Lead Stage', trigger: 'Contract PDF Uploaded', action: 'Set Status to Negotiation', active: true },
  { id: 'a6', name: 'Tasks Automation', description: 'إنشاء مهمة إعداد العرض تلقائياً عند تحول حالة العميل إلى "Meeting".', type: 'Tasks', trigger: 'Status = Meeting', action: 'Assign "Prepare Proposal" Task', active: false },
  { id: 'a7', name: 'KPI Automation', description: 'تحديث مؤشر إغلاق الصفقات تلقائياً عند تحويل حالة العميل إلى "Won".', type: 'KPI', trigger: 'Lead Won', action: 'Increment Monthly KPI Score', active: true },
  { id: 'a8', name: 'Employee Performance Automation', description: 'إرسال تهنئة أوتوماتيكية للموظف عندما يحقق 100% من مستهدفه الشهري.', type: 'Employee Performance', trigger: 'KPI Score >= 100%', action: 'Send Slack Kudos & Notification', active: true },
  { id: 'a9', name: 'Finance Automation', description: 'توليد فاتورة مبدئية تلقائية وإرسالها بمجرد تحويل العميل إلى "Won".', type: 'Finance', trigger: 'Status = Won', action: 'Generate Client Invoice PDF', active: false },
  { id: 'a10', name: 'Dashboard Automation', description: 'تحديث الرسومات البيانية للـ CEO في التوقيت الفعلي وتحديث مؤشرات التحليلات.', type: 'Dashboard', trigger: 'Hourly Trigger', action: 'Refresh CEO Widgets cache', active: true },
  { id: 'a11', name: 'Daily Reports Automation', description: 'تجميع وإرسال ملخص مبيعات اليوم للبريد الإلكتروني للـ CEO في الـ 9 مساءً.', type: 'Daily Reports', trigger: 'Time = 21:00 Daily', action: 'Email Sales Summary PDF', active: true },
  { id: 'a12', name: 'Weekly Reports Automation', description: 'تصدير تقارير الأداء المالي والأسبوعي صباح كل أحد للمدير العام.', type: 'Weekly Reports', trigger: 'Time = Sunday 09:00', action: 'Email Weekly Financial Report', active: true },
  { id: 'a13', name: 'Alerts & Notifications', description: 'تنبيه المدير المالي فوراً إذا تم إدخال مصروف يتخطى 15,000 ج.م.', type: 'Alerts', trigger: 'New Expense > 15k', action: 'Send Alert to Finance Manager', active: true },
  { id: 'a14', name: 'Smart CRM Automation', description: 'تصنيف العملاء تلقائياً كـ "مستثمر كبير" بناءً على حجم الشركة المدخل.', type: 'Smart CRM', trigger: 'Lead Company Size > 50', action: 'Apply VIP Tag', active: false },
  { id: 'a15', name: 'Marketing ROI Automation', description: 'إيقاف الحملة الإعلانية تلقائياً إذا تجاوزت تكلفة العميل CPL حاجز 150 ج.م.', type: 'Marketing ROI', trigger: 'Campaign CPL > 150', action: 'Pause Campaign', active: true }
];

const initialState: SettingsState = {
  departments: mockDepartments,
  positions: mockPositions,
  automations: mockAutomations
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    addDepartment(state, action: PayloadAction<Omit<Department, 'id'>>) {
      const newDept: Department = {
        ...action.payload,
        id: 'd' + (state.departments.length + 1)
      };
      state.departments.push(newDept);
    },
    updateDepartment(state, action: PayloadAction<Department>) {
      const idx = state.departments.findIndex(d => d.id === action.payload.id);
      if (idx !== -1) {
        state.departments[idx] = action.payload;
      }
    },
    deleteDepartment(state, action: PayloadAction<string>) {
      state.departments = state.departments.filter(d => d.id !== action.payload);
    },
    addPosition(state, action: PayloadAction<Omit<Position, 'id'>>) {
      const newPos: Position = {
        ...action.payload,
        id: 'p' + (state.positions.length + 1)
      };
      state.positions.push(newPos);
    },
    updatePosition(state, action: PayloadAction<Position>) {
      const idx = state.positions.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.positions[idx] = action.payload;
      }
    },
    deletePosition(state, action: PayloadAction<string>) {
      state.positions = state.positions.filter(p => p.id !== action.payload);
    },
    toggleAutomationActive(state, action: PayloadAction<string>) {
      const rule = state.automations.find(a => a.id === action.payload);
      if (rule) {
        rule.active = !rule.active;
      }
    },
    addAutomationRule(state, action: PayloadAction<Omit<AutomationRule, 'id'>>) {
      const newRule: AutomationRule = {
        ...action.payload,
        id: 'a' + (state.automations.length + 1)
      };
      state.automations.push(newRule);
    }
  }
});

export const {
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addPosition,
  updatePosition,
  deletePosition,
  toggleAutomationActive,
  addAutomationRule
} = settingsSlice.actions;

export default settingsSlice.reducer;
