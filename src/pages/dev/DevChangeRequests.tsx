import React, { useState } from 'react';
import { useDevModuleStore, type ChangeRequest } from '../../store/devModuleStore';
import { RefreshCw, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

export const DevChangeRequests: React.FC = () => {
  const { changeRequests, projects, addChangeRequest, updateChangeRequestStatus, currentRole } = useDevModuleStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProject, setNewProject] = useState(projects[0]?.id || '');
  const [newCost, setNewCost] = useState(5000);
  const [newTime, setNewTime] = useState('5 Days');

  const handleCreateCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newProject) return;

    const proj = projects.find(p => p.id === newProject);

    addChangeRequest({
      projectId: newProject,
      projectName: proj ? proj.name : 'مشروع برمجيات',
      requestTitle: newTitle,
      description: newDesc,
      costImpact: Number(newCost),
      timeImpact: newTime
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleApproveStatus = (id: string, status: ChangeRequest['status']) => {
    if (currentRole !== 'CEO' && currentRole !== 'Tech Lead' && currentRole !== 'Team Manager') {
      alert('غير مصرح لك بتحديث حالة طلبات التعديل.');
      return;
    }
    updateChangeRequestStatus(id, status);
    alert(`تم تعديل حالة طلب التعديل إلى: ${status}`);
  };

  const canApprove = currentRole === 'CEO' || currentRole === 'Tech Lead' || currentRole === 'Team Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-950 flex items-center gap-2">
            <RefreshCw className="text-red-600 w-7 h-7" />
            طلبات التعديل والتغيير (Change Requests)
          </h1>
          <p className="text-xs text-gray-400">إدارة طلبات تعديل النطاق البرمجي وحساب التكلفة الزمنية والمالية الإضافية</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg text-xs"
        >
          تقديم طلب تعديل جديد
        </button>
      </div>

      {/* Requests list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {changeRequests.map(cr => (
          <div key={cr.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-red-600 font-mono block">مشروع: {cr.projectName}</span>
                <h4 className="text-xs font-black text-gray-950 mt-1">{cr.requestTitle}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                cr.status === 'Approved' ? 'bg-green-100 text-green-700' :
                cr.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                cr.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {cr.status}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{cr.description}</p>

            <div className="grid grid-cols-2 gap-2 text-center p-2.5 bg-gray-50 rounded-xl text-[10px] font-mono text-gray-500">
              <div>
                <span>التكلفة المالية الإضافية</span>
                <span className="block font-black text-gray-800 mt-0.5">+{cr.costImpact.toLocaleString()} USD</span>
              </div>
              <div>
                <span>التأثير الزمني المتوقع</span>
                <span className="block font-black text-gray-800 mt-0.5">+{cr.timeImpact}</span>
              </div>
            </div>

            {/* Approvals action buttons for managers */}
            {cr.status === 'Pending' && (
              <div className="flex gap-2 pt-2 justify-end">
                {canApprove ? (
                  <>
                    <button
                      onClick={() => handleApproveStatus(cr.id, 'Rejected')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-[10px] flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      رفض الطلب
                    </button>
                    <button
                      onClick={() => handleApproveStatus(cr.id, 'Approved')}
                      className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg text-[10px] flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      اعتماد وموافقة
                    </button>
                  </>
                ) : (
                  <span className="text-[9px] text-gray-400 font-semibold italic">في انتظار مراجعة مدير الفريق...</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900">تقديم طلب تعديل جديد</span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCR} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الطلب</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: زيادة بوابات الدفع الإلكتروني"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">المشروع المرتبط</label>
                <select
                  required
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                >
                  <option value="">اختر المشروع</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الوصف التفصيلي</label>
                <textarea
                  required
                  placeholder="اكتب تفاصيل التعديل الفنية المطلوبة..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">التكلفة الإضافية ($)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">التأثير الزمني المقدر</label>
                  <input
                    type="text"
                    placeholder="مثال: 5 Days"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md"
                >
                  حفظ وتقديم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevChangeRequests;
