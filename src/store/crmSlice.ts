import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  source: string;
  governorate: string;
  status: 'New' | 'Contacted' | 'Follow Up' | 'Meeting' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  notes: string;
  dateCreated: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'client';
  text: string;
  time: string;
}

export interface ChatSession {
  id: string;
  clientName: string;
  clientPhone: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}

export interface CallLog {
  id: string;
  clientName: string;
  clientPhone: string;
  result: string;
  duration: string; // e.g. "02:15"
  followUpDate: string;
  date: string;
}

interface CRMState {
  leads: Lead[];
  chats: ChatSession[];
  callLogs: CallLog[];
}

const mockLeads: Lead[] = [
  { id: '1', name: 'أحمد علي محمد', phone: '+20 1012345678', email: 'ahmed.ali@gmail.com', company: 'النور للاستيراد والتصدير', jobTitle: 'مدير المشتريات', source: 'Facebook', governorate: 'القاهرة', status: 'New', notes: 'مهتم بالخدمات اللوجستية ويطلب عرض سعر.', dateCreated: '2026-06-10' },
  { id: '2', name: 'سارة خالد محمود', phone: '+20 1198765432', email: 'sara.khalid@gmail.com', company: 'تكنو سوفت', jobTitle: 'رئيس قسم الموارد البشرية', source: 'Google Ads', governorate: 'الجيزة', status: 'Contacted', notes: 'تم التواصل معها وطلب تفاصيل حول نظام إدارة الموظفين.', dateCreated: '2026-06-11' },
  { id: '3', name: 'محمد عبد الرحمن', phone: '+20 1234567890', email: 'm.abdulrahman@yahoo.com', company: 'ريد للمقاولات', jobTitle: 'المدير العام', source: 'WhatsApp Campaign', governorate: 'الإسكندرية', status: 'Proposal Sent', notes: 'تم إرسال العرض المالي والفني وفي انتظار الرد.', dateCreated: '2026-06-08' },
  { id: '4', name: 'ليلى يوسف خليل', phone: '+20 1599988877', email: 'laila.youssef@outlook.com', company: 'ستار فودز', jobTitle: 'مديرة التسويق', source: 'TikTok', governorate: 'القليوبية', status: 'Negotiation', notes: 'تفاوض على السعر النهائي وعدد الحسابات المطلوبة للموظفين.', dateCreated: '2026-06-05' },
  { id: '5', name: 'محمود الصاوي', phone: '+20 1022233344', email: 'm.sawi@sawi-group.com', company: 'مجموعة الصاوي العقارية', jobTitle: 'الرئيس التنفيذي', source: 'Direct Contact', governorate: 'الغربية', status: 'Won', notes: 'تم توقيع العقد وبدء مرحلة الإعداد والتنفيذ.', dateCreated: '2026-06-01' }
];

const mockChats: ChatSession[] = [
  {
    id: 'ch1',
    clientName: 'أحمد علي محمد',
    clientPhone: '+20 1012345678',
    lastMessage: 'تمام، في انتظار عرض السعر اليوم إن شاء الله.',
    time: '05:30 PM',
    unread: true,
    messages: [
      { id: 'm1', sender: 'client', text: 'السلام عليكم ورحمة الله، كنت بسأل عن خدمات الـ CRM', time: '11:00 AM' },
      { id: 'm2', sender: 'user', text: 'وعليكم السلام ورحمة الله وبركاته يا فندم. يسعدنا جداً تواصلك معنا. نظام سندك برو بيقدملك لوحة تحكم كاملة لإدارة المبيعات والتسويق والموظفين والـ KPIs.', time: '11:15 AM' },
      { id: 'm3', sender: 'client', text: 'رائع جداً، هل يدعم اللغة العربية بشكل كامل؟', time: '11:20 AM' },
      { id: 'm4', sender: 'user', text: 'نعم، يدعم الاتجاهين العربي والإنجليزي بالكامل، مع تقارير مالية وتتبع حضور الموظفين بالـ GPS.', time: '11:25 AM' },
      { id: 'm5', sender: 'client', text: 'تمام، في انتظار عرض السعر اليوم إن شاء الله.', time: '05:30 PM' }
    ]
  },
  {
    id: 'ch2',
    clientName: 'محمد عبد الرحمن',
    clientPhone: '+20 1234567890',
    lastMessage: 'تم إرسال التحويل البنكي وتأكيده.',
    time: 'أمس',
    unread: false,
    messages: [
      { id: 'm6', sender: 'user', text: 'مرحبا أستاذ محمد، هل قمت بمراجعة مسودة العقد؟', time: '02:00 PM' },
      { id: 'm7', sender: 'client', text: 'نعم تم المراجعة والتوقيع من جهتنا.', time: '02:30 PM' },
      { id: 'm8', sender: 'client', text: 'تم إرسال التحويل البنكي وتأكيده.', time: '03:00 PM' }
    ]
  }
];

const mockCallLogs: CallLog[] = [
  { id: 'cl1', clientName: 'أحمد علي محمد', clientPhone: '+20 1012345678', result: 'تم الرد وطلب عرض السعر', duration: '03:40', followUpDate: '2026-06-15', date: '2026-06-12' },
  { id: 'cl2', clientName: 'محمد عبد الرحمن', clientPhone: '+20 1234567890', result: 'تم الاتفاق وتوقيع العقد', duration: '05:15', followUpDate: '2026-06-20', date: '2026-06-13' }
];

const initialState: CRMState = {
  leads: mockLeads,
  chats: mockChats,
  callLogs: mockCallLogs
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    addLead(state, action: PayloadAction<Omit<Lead, 'id' | 'dateCreated'>>) {
      const newLead: Lead = {
        ...action.payload,
        id: (state.leads.length + 1).toString(),
        dateCreated: new Date().toISOString().split('T')[0]
      };
      state.leads.unshift(newLead);
    },
    updateLead(state, action: PayloadAction<Lead>) {
      const idx = state.leads.findIndex(l => l.id === action.payload.id);
      if (idx !== -1) {
        state.leads[idx] = action.payload;
      }
    },
    deleteLead(state, action: PayloadAction<string>) {
      state.leads = state.leads.filter(l => l.id !== action.payload);
    },
    importLeads(state, action: PayloadAction<Omit<Lead, 'id' | 'dateCreated'>[]>) {
      const startId = state.leads.length + 1;
      const formatted = action.payload.map((l, index) => ({
        ...l,
        id: (startId + index).toString(),
        dateCreated: new Date().toISOString().split('T')[0]
      }));
      state.leads = [...formatted, ...state.leads];
    },
    sendChatMessage(state, action: PayloadAction<{ chatId: string; text: string; sender?: 'user' | 'client' }>) {
      const { chatId, text, sender = 'user' } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsg: ChatMessage = {
          id: (chat.messages.length + 1).toString(),
          sender,
          text,
          time
        };
        chat.messages.push(newMsg);
        chat.lastMessage = text;
        chat.time = time;
        if (sender === 'client') {
          chat.unread = true;
        }
      }
    },
    addCallLog(state, action: PayloadAction<Omit<CallLog, 'id' | 'date'>>) {
      const newLog: CallLog = {
        ...action.payload,
        id: (state.callLogs.length + 1).toString(),
        date: new Date().toISOString().split('T')[0]
      };
      state.callLogs.unshift(newLog);
    }
  }
});

export const {
  addLead,
  updateLead,
  deleteLead,
  importLeads,
  sendChatMessage,
  addCallLog
} = crmSlice.actions;

export default crmSlice.reducer;
