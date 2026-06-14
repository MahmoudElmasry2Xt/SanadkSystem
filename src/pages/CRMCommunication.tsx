import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  Plus,
  BookOpen,
  Star,
  CheckCheck
} from 'lucide-react';

interface MockEmail {
  id: number;
  sender?: string;
  receiver?: string;
  subject: string;
  preview: string;
  date: string;
  content: string;
}

export const CRMCommunication: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { chats, sendChatMessage } = useAppStore();

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'calls'>('whatsapp');
  
  // WhatsApp State
  const [activeChatId, setActiveChatId] = useState('ch1');
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatId, activeChat.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendChatMessage(activeChat.id, messageText);
    setMessageText('');
  };

  const whatsappTemplates = [
    { title: isRtl ? 'ترحيب عميل جديد' : 'Welcome Template', text: isRtl ? 'أهلاً بك يا فندم في سندك برو. سعداء بتواصلك معنا، كيف يمكننا مساعدتك اليوم؟' : 'Hello and welcome to Sanadk PRO. How can we assist you today?' },
    { title: isRtl ? 'إرسال عرض مالي' : 'Send Proposal', text: isRtl ? 'مرفق لسيادتكم العرض المالي والفني المفصل بخصوص باقات إدارة النظام. يرجى الاطلاع والمراجعة.' : 'Please find attached the financial and technical proposal for the system packages.' },
    { title: isRtl ? 'حجز موعد اجتماع' : 'Book Meeting', text: isRtl ? 'نرغب في التنسيق معكم لحجز موعد اجتماع عبر زووم لمناقشة التفاصيل. هل يناسبكم غداً الساعة 12 ظهراً؟' : 'We would like to book a Zoom meeting to discuss details. Does tomorrow at 12 PM suit you?' }
  ];

  const useTemplate = (text: string) => {
    setMessageText(text);
  };

  // Email state
  const [activeMailBox, setActiveMailBox] = useState<'inbox' | 'sent' | 'drafts'>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState(1);

  const mockEmails: Record<'inbox' | 'sent' | 'drafts', MockEmail[]> = {
    inbox: [
      { id: 1, sender: 'سارة خالد (HR)', subject: 'طلب مراجعة لائحة الحضور والانصراف', preview: 'أرجو مراجعة التحديثات المرفقة بخصوص أوقات التأخير وبدء العمل.', date: '02:30 PM', content: 'مرحباً، أرفق لكم مسودة اللائحة الجديدة للحضور والانصراف بعد تعديل ساعات التأخير المسموح بها لتكون 15 دقيقة بدلاً من 10 دقائق.' },
      { id: 2, sender: 'أحمد علي (CEO)', subject: 'تقرير المبيعات والـ ROI الأسبوعي', preview: 'يرجى إرسال ملف الإحصائيات للمطابقة المالية قبل اجتماع الغد.', date: '11:00 AM', content: 'السادة رؤساء الأقسام، يرجى إتمام إدخال كافة البيانات المالية وحملات التسويق وإغلاق المهام للربع الحالي قبل اجتماع الغد الساعة العاشرة صباحاً.' }
    ],
    sent: [
      { id: 3, receiver: 'ahmed.ali@gmail.com', subject: 'العرض الفني لنظام CRM المبيعات', preview: 'نشكركم لتواصلكم، تجدون في المرفقات تفاصيل عرض السعر.', date: 'أمس', content: 'عزيزي العميل أحمد علي، نشكركم لاهتمامكم بنظام سندك برو. مرفق العرض المالي وباقة المميزات المطلوبة.' }
    ],
    drafts: [
      { id: 4, receiver: 'm.abdulrahman@yahoo.com', subject: 'تأكيد موعد العقد والتشغيل', preview: 'مسودة رسالة لتأكيد موعد اللقاء القادم بمكتب الشركة.', date: '10 Jun', content: 'أهلاً أستاذ محمد، نود تأكيد موعدنا يوم الإثنين القادم لتوقيع بنود التعاقد وبدء تشغيل سيرفرات النظام.' }
    ]
  };

  const currentEmailList = mockEmails[activeMailBox];
  const selectedEmail = currentEmailList.find(e => e.id === selectedEmailId) || currentEmailList[0];


  // Calls logs state
  const [callLogs, setCallLogs] = useState([
    { id: 1, client: 'أحمد علي محمد', phone: '+20 1012345678', date: '2026-06-13', status: 'Answered', note: 'مكالمة ترحيبية، مهتم بالخدمات وموعد المتابعة غداً.', followUp: '2026-06-14' },
    { id: 2, client: 'ليلى يوسف خليل', phone: '+20 1599988877', date: '2026-06-12', status: 'No Answer', note: 'لم يرد على المكالمة، سأقوم بالاتصال لاحقاً.', followUp: '2026-06-13' },
    { id: 3, client: 'محمد عبد الرحمن', phone: '+20 1234567890', date: '2026-06-11', status: 'Busy', note: 'الخط مشغول، تم إرسال رسالة واتساب بديلة.', followUp: '2026-06-11' }
  ]);

  const [newCall, setNewCall] = useState({
    client: '',
    phone: '',
    status: 'Answered',
    note: '',
    followUp: ''
  });

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCall.client || !newCall.phone) return;
    setCallLogs([
      {
        id: callLogs.length + 1,
        client: newCall.client,
        phone: newCall.phone,
        date: new Date().toISOString().split('T')[0],
        status: newCall.status,
        note: newCall.note,
        followUp: newCall.followUp || 'N/A'
      },
      ...callLogs
    ]);
    setNewCall({
      client: '',
      phone: '',
      status: 'Answered',
      note: '',
      followUp: ''
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('communication')}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {isRtl ? 'مركز التواصل الشامل: رسائل الواتساب، البريد الإلكتروني الداخلي، وسجل المكالمات.' : 'Omnichannel communication panel.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white p-1 rounded-2xl border ">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-red-600 text-white shadow-md shadow-red-100'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50/30'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('whatsapp')}</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'email'
              ? 'bg-red-600 text-white shadow-md shadow-red-100'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50/30'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>{isRtl ? 'البريد الإلكتروني' : 'Email'}</span>
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'calls'
              ? 'bg-red-600 text-white shadow-md shadow-red-100'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50/30'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>{t('calls')}</span>
        </button>
      </div>

      {/* Content Panels */}
      <div className="flex-1 min-h-[500px]">
        {/* WHATSAPP TAB */}
        {activeTab === 'whatsapp' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-20rem)] min-h-[500px]">
            {/* Chats List Sidebar */}
            <div className="border-e border-gray-100 flex flex-col h-full bg-gray-50/30 min-h-0 overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-white shrink-0">
                <span className="font-bold text-xs text-gray-900">{isRtl ? 'المحادثات النشطة' : 'Active Chats'}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {chats.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors ${
                      c.id === activeChatId
                        ? 'bg-red-50 border border-red-100'
                        : 'bg-white border border-gray-50 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-gray-900">{c.clientName}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{c.lastMessage}</p>
                    {c.unread && (
                      <span className="mt-2 inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Screen */}
            <div className="lg:col-span-2 flex flex-col h-full bg-white relative min-h-0 overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white z-10">
                <div>
                  <h4 className="font-bold text-xs text-gray-900">{activeChat.clientName}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{activeChat.clientPhone}</p>
                </div>
                
                {/* Templates Quick selector */}
                <div className="relative group">
                  <button className="custom-btn-secondary py-1 px-2.5 text-[10px] flex items-center gap-1.5 font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t('templates')}</span>
                  </button>
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-1 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-20 hidden group-hover:block p-1">
                    {whatsappTemplates.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => useTemplate(t.text)}
                        className="w-full text-start p-2 text-[10px] rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <span className="block font-bold">{t.title}</span>
                        <span className="block text-gray-400 line-clamp-1">{t.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/20">
                {activeChat.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl text-xs ${
                        m.sender === 'user'
                          ? 'bg-red-600 text-white rounded-te-none'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-ts-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-75">
                        <span>{m.time}</span>
                        {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-50 flex gap-2 items-center shrink-0 bg-white z-10">
                <input
                  type="text"
                  placeholder={t('chatPlaceholder')}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="custom-input py-2 text-xs flex-1"
                />
                <button type="submit" className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shrink-0">
                  <Send className="w-4 h-4 rotate-45" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* EMAIL TAB */}
        {activeTab === 'email' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-20rem)] min-h-[500px]">
            {/* Email Folders Sidebar */}
            <div className="border-e border-gray-100 flex flex-col h-full bg-gray-50/30">
              <div className="p-3.5 border-b border-gray-50 bg-white">
                <button className="w-full custom-btn-primary py-2 text-xs flex items-center justify-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إنشاء بريد' : 'Compose'}</span>
                </button>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => { setActiveMailBox('inbox'); setSelectedEmailId(1); }}
                  className={`w-full text-start px-3 py-2 text-xs rounded-xl font-bold flex justify-between items-center ${
                    activeMailBox === 'inbox' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{t('inbox')}</span>
                  </div>
                  <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">2</span>
                </button>

                <button
                  onClick={() => { setActiveMailBox('sent'); setSelectedEmailId(3); }}
                  className={`w-full text-start px-3 py-2 text-xs rounded-xl font-bold flex justify-between items-center ${
                    activeMailBox === 'sent' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>{t('sent')}</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveMailBox('drafts'); setSelectedEmailId(4); }}
                  className={`w-full text-start px-3 py-2 text-xs rounded-xl font-bold flex justify-between items-center ${
                    activeMailBox === 'drafts' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>{t('drafts')}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Email List Column */}
            <div className="border-e border-gray-100 flex flex-col h-full">
              <div className="p-4 border-b border-gray-50 bg-white">
                <span className="font-bold text-xs text-gray-900">{isRtl ? 'قائمة الرسائل' : 'Messages'}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-gray-50/20">
                {currentEmailList.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmailId(email.id)}
                    className={`p-3 rounded-xl cursor-pointer border transition-colors ${
                      email.id === selectedEmailId
                        ? 'bg-red-50/30 border-red-200'
                        : 'bg-white border-gray-50 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[11px] text-gray-900 truncate max-w-[150px]">
                        {email.sender || email.receiver}
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold">{email.date}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-gray-800 line-clamp-1">{email.subject}</p>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{email.preview}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Reader */}
            <div className="flex flex-col h-full bg-white p-6 overflow-y-auto">
              {selectedEmail ? (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-sm text-gray-950">{selectedEmail.subject}</h3>
                    <div className="flex justify-between items-center mt-3 text-xs">
                      <span className="font-bold text-gray-600">
                        {isRtl ? 'المرسل' : 'Sender'}: {selectedEmail.sender || selectedEmail.receiver}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{selectedEmail.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl">
                    {selectedEmail.content}
                  </p>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400 text-xs">
                  لا توجد رسالة محددة
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALLS LOG TAB */}
        {activeTab === 'calls' && (
          <div className="space-y-6">
            {/* Add Call Log Form */}
            <div className="custom-card">
              <h3 className="font-bold text-sm text-gray-900 mb-4">{isRtl ? 'تسجيل مكالمة جديدة' : 'Log a Call'}</h3>
              <form onSubmit={handleLogCall} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('leadName')}</label>
                  <input
                    type="text"
                    required
                    value={newCall.client}
                    onChange={(e) => setNewCall({ ...newCall, client: e.target.value })}
                    className="custom-input py-2 text-xs"
                    placeholder={isRtl ? 'اسم العميل' : 'Client Name'}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('phone')}</label>
                  <input
                    type="text"
                    required
                    value={newCall.phone}
                    onChange={(e) => setNewCall({ ...newCall, phone: e.target.value })}
                    className="custom-input py-2 text-xs"
                    placeholder="+20 100..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'الحالة' : 'Status'}</label>
                  <select
                    value={newCall.status}
                    onChange={(e) => setNewCall({ ...newCall, status: e.target.value })}
                    className="custom-input py-2 text-xs"
                  >
                    <option value="Answered">Answered</option>
                    <option value="No Answer">No Answer</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('followUpDate')}</label>
                  <input
                    type="date"
                    value={newCall.followUp}
                    onChange={(e) => setNewCall({ ...newCall, followUp: e.target.value })}
                    className="custom-input py-2 text-xs"
                  />
                </div>
                <div>
                  <button type="submit" className="w-full custom-btn-primary py-2 text-xs">
                    <span>{isRtl ? 'حفظ المكالمة' : 'Log Call'}</span>
                  </button>
                </div>
                <div className="sm:col-span-2 md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('callResult')}</label>
                  <input
                    type="text"
                    required
                    value={newCall.note}
                    onChange={(e) => setNewCall({ ...newCall, note: e.target.value })}
                    className="custom-input py-2 text-xs"
                    placeholder={isRtl ? 'اكتب ملخص المكالمة هنا...' : 'e.g. Discussed pricing details...'}
                  />
                </div>
              </form>
            </div>

            {/* Calls Log Table */}
            <div className="custom-card p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-50">
                <span className="font-bold text-xs text-gray-900">{t('callLog')}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse text-xs">
                  <thead>
                    <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                      <th className="p-4 text-start">{t('leadName')}</th>
                      <th className="p-4 text-start">{t('phone')}</th>
                      <th className="p-4 text-start">{t('date')}</th>
                      <th className="p-4 text-start">{isRtl ? 'حالة المكالمة' : 'Call Status'}</th>
                      <th className="p-4 text-start">{t('callResult')}</th>
                      <th className="p-4 text-start">{t('followUpDate')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {callLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-gray-900">{log.client}</td>
                        <td className="p-4 text-gray-500 font-mono">{log.phone}</td>
                        <td className="p-4 text-gray-500 font-mono">{log.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'Answered' ? 'bg-green-50 text-green-600' :
                            log.status === 'Busy' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{log.note}</td>
                        <td className="p-4 font-mono text-red-600 font-bold">{log.followUp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
