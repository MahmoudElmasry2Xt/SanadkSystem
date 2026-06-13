import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  date: string;
  read: boolean;
}

interface NotificationsState {
  notifications: Notification[];
}

const mockNotifications: Notification[] = [
  { id: 'n1', title: 'عميل محتمل جديد', message: 'سجل العميل "أحمد علي محمد" اهتمامه عبر إعلانات فيسبوك.', type: 'info', date: '2026-06-13T17:45:00', read: false },
  { id: 'n2', title: 'مهمة متأخرة!', message: 'المهمة "تجهيز عرض السعر لشركة النور" تجاوزت موعد التسليم المحدد.', type: 'danger', date: '2026-06-13T16:00:00', read: false },
  { id: 'n3', title: 'طلب إجازة جديد', message: 'قدم الموظف "محمود عبد السلام" طلب إجازة عارضة ليومين.', type: 'warning', date: '2026-06-12T11:30:00', read: true },
  { id: 'n4', title: 'متابعة مستحقة للعميل', message: 'يحين موعد الاتصال بالعميل "ليلى يوسف خليل" لمناقشة العقد.', type: 'info', date: '2026-06-13T10:15:00', read: false },
  { id: 'n5', title: 'تسجيل مصروف جديد', message: 'سجل المحاسب "سارة خالد" مصروفاً بقيمة 2200 ج.م فاتورة كهرباء.', type: 'success', date: '2026-06-13T09:00:00', read: true }
];

const initialState: NotificationsState = {
  notifications: mockNotifications
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<Notification, 'id' | 'date' | 'read'>>) {
      const newNotification: Notification = {
        ...action.payload,
        id: 'n' + (state.notifications.length + 1),
        date: new Date().toISOString(),
        read: false
      };
      state.notifications.unshift(newNotification);
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach(n => {
        n.read = true;
      });
    }
  }
});

export const { addNotification, markNotificationRead, markAllNotificationsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
