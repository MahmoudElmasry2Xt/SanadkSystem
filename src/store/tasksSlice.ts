import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignee: string; // Employee name
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed' | 'Cancelled';
}

interface TasksState {
  tasks: Task[];
}

const mockTasks: Task[] = [
  { id: '1', name: 'تجهيز عرض السعر لشركة النور', description: 'إعداد ملف PDF متكامل بالأسعار والخدمات المطلوبة وإرساله للإيميل الخاص بهم.', priority: 'High', dueDate: '2026-06-15', assignee: 'محمود عبد السلام', status: 'In Progress' },
  { id: '2', name: 'مراجعة الميزانية التسويقية لشهر مايو', description: 'تحليل أداء الحملات ومطابقتها مع الإيرادات المحققة وحساب العائد على الاستثمار.', priority: 'Medium', dueDate: '2026-06-18', assignee: 'دينا الشافعي', status: 'To Do' },
  { id: '3', name: 'تحديث عقود الموظفين الجدد', description: 'إضافة بنود العمل عن بعد وتحديث المرتبات والبدلات وتجهيزها للتوقيع.', priority: 'Low', dueDate: '2026-06-20', assignee: 'سارة خالد محمود', status: 'Review' },
  { id: '4', name: 'حل مشكلة تسجيل الحضور اليومي للموظفين', description: 'إصلاح الخلل في نظام الـ Check In التلقائي عبر تطبيق الجوال الخاص بالنظام.', priority: 'High', dueDate: '2026-06-12', assignee: 'شريف النجار', status: 'Completed' },
  { id: '5', name: 'إعداد تقرير أداء الـ KPIs للربع الأول', description: 'جمع تقييمات الموظفين وإصدار الدرجات النهائية والتقرير العام لمجلس الإدارة.', priority: 'High', dueDate: '2026-06-10', assignee: 'محمود عبد السلام', status: 'Cancelled' }
];

const initialState: TasksState = {
  tasks: mockTasks
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Omit<Task, 'id'>>) {
      const newTask: Task = {
        ...action.payload,
        id: (state.tasks.length + 1).toString()
      };
      state.tasks.unshift(newTask);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = action.payload;
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    }
  }
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
