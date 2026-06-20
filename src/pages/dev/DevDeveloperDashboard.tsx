import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevModuleStore } from '../../store/devModuleStore';
import { 
  CheckSquare, Clock, Calendar
} from 'lucide-react';

export const DevDeveloperDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, addWorkLog } = useDevModuleStore();

  // Find tasks assigned to developer Mohammad or Ziad (let's assume "زياد عمرو" is the active developer for testing)
  const developerName = 'زياد عمرو';
  const assignedTasks = tasks.filter(t => t.assigneeName === developerName && t.status !== 'Done');

  // Quick Action form states
  const [selectedTaskId, setSelectedTaskId] = useState(assignedTasks[0]?.id || '');
  const [logHours, setLogHours] = useState(2);
  const [logDesc, setLogDesc] = useState('');

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || logHours <= 0 || !logDesc) return;
    addWorkLog(selectedTaskId, {
      hours: Number(logHours),
      description: logDesc
    });
    setLogHours(2);
    setLogDesc('');
    alert('تم تسجيل الساعات والإنجاز بنجاح!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950">لوحة المطور الشخصية (Developer Dashboard)</h1>
        <p className="text-xs text-gray-400">مرحباً {developerName}، تابع مهامك الجارية وسجل ساعات عملك وإنجازاتك اليومية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Tasks and Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-4.5 h-4.5 text-red-600" />
            المهمات المسندة إليك ({assignedTasks.length})
          </h3>

          <div className="space-y-3">
            {assignedTasks.map(task => (
              <div key={task.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 hover:border-red-100 transition-colors">
                <div className="flex justify-between items-start">
                  <h4 
                    onClick={() => navigate(`/dev/tasks/${task.id}`)}
                    className="text-xs font-black text-gray-950 hover:underline cursor-pointer"
                  >
                    {task.name}
                  </h4>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-[9px] font-bold">
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>

                <div className="flex justify-between items-center text-[10px] text-gray-400 pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    تاريخ التسليم: {task.deadline}
                  </span>
                  <span className="font-mono">التقديري: {task.estimatedHours}ساعة</span>
                </div>
              </div>
            ))}
            {assignedTasks.length === 0 && (
              <div className="text-center py-12 text-xs text-gray-400 bg-white border border-gray-100 rounded-2xl">
                لا توجد أي مهمات نشطة مسندة إليك حالياً.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Actions Panel */}
        <div className="space-y-6">
          {/* Quick Work Log */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-950 border-b border-gray-50 pb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-600" />
              تسجيل سريع لساعات العمل
            </h3>
            <form onSubmit={handleQuickLog} className="space-y-3">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">اختر المهمة</label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                >
                  <option value="">اختر مهمة نشطة</option>
                  {assignedTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="col-span-1">
                  <label className="block text-[10px] text-gray-500 mb-1">الساعات</label>
                  <input
                    type="number"
                    min={1}
                    value={logHours}
                    onChange={(e) => setLogHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] text-gray-500 mb-1">تفاصيل الإنجاز</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: إصلاح خطأ الـ API..."
                    value={logDesc}
                    onChange={(e) => setLogDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow">
                حفظ وإدراج الساعات
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DevDeveloperDashboard;
