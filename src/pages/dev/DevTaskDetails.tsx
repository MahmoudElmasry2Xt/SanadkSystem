import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDevModuleStore } from '../../store/devModuleStore';
import { 
  ArrowLeft, CheckSquare, Clock, AlertTriangle, Send,
  Plus, ShieldAlert, UserCheck, CheckCircle2,
  ArrowRightLeft
} from 'lucide-react';

export const DevTaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { 
    tasks, developers, projects, currentRole, addTaskComment, addWorkLog,
    toggleSubtask, addSubtask, approveTaskCompletion, updateTaskStatus
  } = useDevModuleStore();

  const task = tasks.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'logs' | 'dependencies' | 'transfers'>('details');

  // Input states
  const [newComment, setNewComment] = useState('');
  const [logHours, setLogHours] = useState(2);
  const [logDesc, setLogDesc] = useState('');

  // Subtask input states
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [newSubtaskAssignee, setNewSubtaskAssignee] = useState('');

  // Manager Approval State
  const [approvalComment, setApprovalComment] = useState('');

  if (!task) {
    return (
      <div className="bg-red-50 text-red-700 p-5 rounded-xl text-center">
        <h3 className="font-extrabold">المهمة غير موجودة!</h3>
        <button onClick={() => navigate('/dev/tasks')} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs">
          العودة للوحة المهام
        </button>
      </div>
    );
  }

  const project = projects.find(p => p.id === task.projectId);

  // Find tasks that block this task (dependencies of this task)
  const blockingTasks = tasks.filter(t => task.dependencies.includes(t.id));
  // Find tasks that depend on this task
  const dependentTasks = tasks.filter(t => t.dependencies.includes(task.id));

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addTaskComment(task.id, newComment);
    setNewComment('');
  };

  const handleAddWorkLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (logHours <= 0 || !logDesc) return;
    addWorkLog(task.id, {
      hours: Number(logHours),
      description: logDesc
    });
    setLogHours(2);
    setLogDesc('');
    alert('تم تسجيل ساعات العمل بنجاح!');
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskName) return;
    addSubtask(task.id, newSubtaskName, newSubtaskAssignee || 'غير معين');
    setNewSubtaskName('');
  };

  const handleManagerApproval = (approved: boolean) => {
    approveTaskCompletion(task.id, 'مدير الفريق الحالي', approvalComment || 'تمت المراجعة والاعتماد', approved);
    setApprovalComment('');
    alert(approved ? 'تمت الموافقة وإغلاق المهمة!' : 'تم رفض المهمة وإعادتها للمطور للتعديل.');
  };

  // Helper: Developer requests code review
  const handleRequestReview = () => {
    updateTaskStatus(task.id, 'Code Review');
    alert('تم نقل المهمة لمرحلة مراجعة الكود بنجاح!');
  };

  const canApprove = currentRole === 'CEO' || currentRole === 'Tech Lead' || currentRole === 'Team Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dev/tasks')}
          className="p-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </button>
        <div>
          <span className="text-[10px] text-red-600 font-black tracking-widest uppercase">تفاصيل المهمة البرمجية</span>
          <h1 className="text-xl font-black text-gray-950">{task.name}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto gap-2 bg-white p-1 rounded-xl shadow-sm">
        {(
          [
            { id: 'details', label: 'التفاصيل والفرعيات', icon: CheckSquare },
            { id: 'comments', label: 'المناقشات والتعليقات', icon: Send },
            { id: 'logs', label: 'سجلات العمل والوقت', icon: Clock },
            { id: 'dependencies', label: 'العلاقات والاعتمادات', icon: AlertTriangle },
            { id: 'transfers', label: 'سجل التحويلات', icon: ArrowRightLeft }
          ] as const
        ).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tab Content Box */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
          
          {/* TAB 1: DETAILS & SUBTASKS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 mb-2">وصف المهمة</h3>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {task.description || 'لا يوجد وصف تفصيلي لهذه المهمة.'}
                </p>
              </div>

              {/* Subtasks checklist */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center justify-between">
                  <span>المهام الفرعية (Subtasks)</span>
                  <span className="text-[10px] text-gray-400">التقدم: {task.progress}%</span>
                </h3>

                {/* Subtasks List */}
                <div className="space-y-2">
                  {task.subtasks.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center p-3 border border-gray-50 rounded-xl bg-gray-50/20 hover:border-red-100 transition-colors">
                      <label className="flex items-center gap-3 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          onChange={() => toggleSubtask(task.id, sub.id)}
                          className="rounded text-red-600 focus:ring-red-100 w-4 h-4"
                        />
                        <span className={`font-bold ${sub.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {sub.name}
                        </span>
                      </label>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold">
                        المسؤول: {sub.assigneeName}
                      </span>
                    </div>
                  ))}
                  {task.subtasks.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-400">لا توجد مهام فرعية مضافة بعد.</div>
                  )}
                </div>

                {/* Add Subtask Form */}
                {canApprove && (
                  <form onSubmit={handleAddSubtaskSubmit} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-[9px] font-bold text-gray-500 mb-1">اسم المهمة الفرعية</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: مراجعة كود الواجهات والتجاوب"
                        value={newSubtaskName}
                        onChange={(e) => setNewSubtaskName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 mb-1">المطور الفرعي</label>
                      <select
                        value={newSubtaskAssignee}
                        onChange={(e) => setNewSubtaskAssignee(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none"
                      >
                        <option value="">اختر المطور</option>
                        {developers.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-xs flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      إضافة
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COMMENTS */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900">المناقشات الفنية حول المهمة</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {task.comments.map(c => (
                  <div key={c.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-gray-900">{c.author}</span>
                      <span className="text-[9px] text-gray-400 font-mono">{c.date}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{c.text}</p>
                  </div>
                ))}
                {task.comments.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400">لا توجد أي تعليقات فنية بعد.</div>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2 border-t border-gray-50 pt-3">
                <input
                  type="text"
                  required
                  placeholder="اكتب تعليقك الفني هنا..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                  إرسال
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WORK LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <h3 className="font-extrabold text-sm text-gray-900">سجل تتبع ساعات العمل البرمجية</h3>
                <span className="text-xs text-gray-500 font-mono">الإجمالي الفعلي: {task.actualHours} ساعة / المقدر: {task.estimatedHours}ساعة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Log Hours Form */}
                <form onSubmit={handleAddWorkLog} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                  <h4 className="text-xs font-extrabold text-gray-900">تسجيل ساعات عمل جديدة</h4>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">عدد الساعات المستغرقة</label>
                    <input
                      type="number"
                      required
                      min={0.5}
                      step={0.5}
                      value={logHours}
                      onChange={(e) => setLogHours(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">وصف الإنجاز الفني</label>
                    <textarea
                      required
                      placeholder="اكتب ما قمت بإنجازه بالتفصيل في هذه الساعات..."
                      value={logDesc}
                      onChange={(e) => setLogDesc(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs h-16"
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold">
                    تسجيل ساعات العمل
                  </button>
                </form>

                {/* Log history */}
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  <h4 className="text-xs font-extrabold text-gray-900">السجل التاريخي للمهمة</h4>
                  {task.workLogs.map(wl => (
                    <div key={wl.id} className="p-2.5 bg-white border border-gray-100 rounded-lg space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span className="font-bold text-gray-700">{wl.developer}</span>
                        <span>{wl.date}</span>
                      </div>
                      <p className="text-xs text-gray-600">{wl.description}</p>
                      <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-bold font-mono">
                        +{wl.hours} ساعات عمل
                      </span>
                    </div>
                  ))}
                  {task.workLogs.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-400">لا توجد ساعات مسجلة بعد.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEPENDENCIES */}
          {activeTab === 'dependencies' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-sm text-gray-900">إدارة الاعتمادات والارتباطات البرمجية</h3>
              
              {/* Blocking Tasks */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-red-600 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" />
                  مهام تعطل هذه المهمة (Blocking Tasks)
                </h4>
                {blockingTasks.map(t => (
                  <div key={t.id} className="p-3 bg-red-50/20 border border-red-100 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-extrabold text-gray-900">{t.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      t.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.status === 'Done' ? 'مكتملة (لا تعطل)' : `معطلة (${t.status})`}
                    </span>
                  </div>
                ))}
                {blockingTasks.length === 0 && (
                  <div className="text-center py-4 text-xs text-gray-400 bg-gray-50 rounded-xl">لا توجد أي مهام تعطل هذه المهمة حالياً.</div>
                )}
              </div>

              {/* Dependent Tasks */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-blue-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  مهام تعتمد على اكتمال هذه المهمة (Dependent Tasks)
                </h4>
                {dependentTasks.map(t => (
                  <div key={t.id} className="p-3 bg-blue-50/20 border border-blue-100 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-extrabold text-gray-900">{t.name}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold">{t.status}</span>
                  </div>
                ))}
                {dependentTasks.length === 0 && (
                  <div className="text-center py-4 text-xs text-gray-400 bg-gray-50 rounded-xl">لا توجد مهام معتمدة على هذه المهمة.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: TRANSFERS */}
          {activeTab === 'transfers' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900">السجل التاريخي لنقل وإسناد المهمة</h3>
              <div className="space-y-4">
                {task.transferHistory.map((tr, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="relative">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      <div className="absolute top-4 bottom-0 start-[3px] w-0.5 bg-gray-100"></div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">تم نقل المهمة</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">من: {tr.from} ← إلى: {tr.to}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">بواسطة: {tr.transferredBy} | السبب: {tr.reason}</p>
                      <span className="text-[9px] font-mono text-gray-400">{tr.date}</span>
                    </div>
                  </div>
                ))}
                {task.transferHistory.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400">لم يتم تدوير أو نقل هذه المهمة سابقاً.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & Workflows */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-950 border-b border-gray-50 pb-2">تفاصيل جانبية للمهمة</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold">المشروع البرمجي</span>
                <span className="font-extrabold text-gray-900">{project?.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold">المسؤول عن المهمة</span>
                <span className="font-extrabold text-red-600">{task.assigneeName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold">تاريخ الاستحقاق</span>
                <span className="font-mono text-gray-900 font-semibold">{task.deadline}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold">أولوية المهمة</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-black">{task.priority}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold">حالة المهمة الحالية</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black">{task.status}</span>
              </div>
            </div>

            {/* Quick action for developers to request code review */}
            {currentRole === 'Developer' && task.status === 'In Progress' && (
              <button
                onClick={handleRequestReview}
                className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl text-xs font-black shadow transition-all"
              >
                طلب مراجعة الكود (Code Review)
              </button>
            )}
          </div>

          {/* MANAGER APPROVAL WORKFLOW SECTION */}
          {task.status === 'Code Review' && (
            <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl space-y-4">
              <h3 className="font-extrabold text-sm text-red-800 flex items-center gap-1.5">
                <UserCheck className="w-5 h-5 text-red-600" />
                اعتماد جودة وإكمال المهمة
              </h3>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                هذه المهمة الآن في مرحلة مراجعة الكود. لا يمكن للمطور إغلاقها مباشرة بل تتطلب موافقة واعتماد مدير الفريق المسؤول.
              </p>

              {canApprove ? (
                <div className="space-y-3">
                  <textarea
                    placeholder="اكتب ملاحظات المراجعة الفنية هنا..."
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs h-16"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManagerApproval(false)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shadow"
                    >
                      رفض وإعادة
                    </button>
                    <button
                      onClick={() => handleManagerApproval(true)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow"
                    >
                      موافقة وإغلاق (Done)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white/50 border border-dashed border-red-200 rounded-xl text-center text-[10px] text-red-600 font-bold">
                  في انتظار مراجعة مدير الفريق. غير مصرح لك كـ {currentRole} بالاعتماد.
                </div>
              )}
            </div>
          )}

          {/* Approval History Logs widget */}
          {task.approvalHistory.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold text-gray-900 border-b border-gray-50 pb-1.5">سجل مراجعات واعتماد الجودة</h4>
              <div className="space-y-2">
                {task.approvalHistory.map((ap, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded-lg text-[10px] space-y-1">
                    <div className="flex justify-between items-center text-gray-400">
                      <span className="font-bold text-gray-700">{ap.reviewer}</span>
                      <span>{ap.date}</span>
                    </div>
                    <p className="text-xs text-gray-600">الإجراء: <span className={ap.action === 'Approve' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{ap.action}</span></p>
                    <p className="text-gray-500 italic">" {ap.comments} "</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevTaskDetails;
