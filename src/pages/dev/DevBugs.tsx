import React, { useState } from 'react';
import { useDevModuleStore, type BugIssue } from '../../store/devModuleStore';
import { AlertTriangle, Plus, Search, Filter, CheckCircle2, RefreshCw, X } from 'lucide-react';

export const DevBugs: React.FC = () => {
  const { bugs, projects, developers, addBug, updateBugStatus, currentRole } = useDevModuleStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBugTitle, setNewBugTitle] = useState('');
  const [newBugSeverity, setNewBugSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [newBugProject, setNewBugProject] = useState(projects[0]?.id || '');
  const [newBugAssignee, setNewBugAssignee] = useState('');

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBugTitle || !newBugProject) return;

    const proj = projects.find(p => p.id === newBugProject);

    addBug({
      title: newBugTitle,
      severity: newBugSeverity,
      status: 'Open',
      assignedTo: newBugAssignee || 'غير معين',
      projectId: newBugProject,
      projectName: proj ? proj.name : 'مشروع برمجيات'
    });

    setIsModalOpen(false);
    setNewBugTitle('');
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-red-600 text-white animate-pulse';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredBugs = bugs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter ? b.severity === severityFilter : true;
    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-950 flex items-center gap-2">
            <AlertTriangle className="text-red-600 w-7 h-7" />
            البلاغات والعيوب البرمجية (Bugs & Issues)
          </h1>
          <p className="text-xs text-gray-400">تتبع الثغرات والأخطاء التقنية المكتشفة في المشروعات البرمجية</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg text-xs"
        >
          <Plus className="w-4 h-4" />
          تسجيل بلاغ خطأ جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute start-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="البحث باسم البلاغ أو المشروع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-9 pe-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
        >
          <option value="">كل درجات الخطورة</option>
          <option value="Low">Low (منخفض)</option>
          <option value="Medium">Medium (متوسط)</option>
          <option value="High">High (عالي الخطورة)</option>
          <option value="Critical">Critical (حرج ومعطل)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
        >
          <option value="">كل الحالات</option>
          <option value="Open">مفتوح (Open)</option>
          <option value="In Progress">قيد الإصلاح</option>
          <option value="Resolved">تم الحل</option>
          <option value="Closed">مغلق نهائياً</option>
        </select>
      </div>

      {/* Bugs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-start text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold">
              <th className="p-4 text-start">عنوان المشكلة</th>
              <th className="p-4 text-start">المشروع</th>
              <th className="p-4 text-start">الخطورة</th>
              <th className="p-4 text-start">حالة البلاغ</th>
              <th className="p-4 text-start">المسؤول عن الحل</th>
              <th className="p-4 text-start">تاريخ البلاغ</th>
              <th className="p-4 text-center">تحديث الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredBugs.map(bug => (
              <tr key={bug.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-extrabold text-gray-900">{bug.title}</td>
                <td className="p-4 font-bold text-gray-700">{bug.projectName}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black ${getSeverityStyle(bug.severity)}`}>
                    {bug.severity}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    bug.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    bug.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {bug.status}
                  </span>
                </td>
                <td className="p-4 font-semibold text-gray-600">{bug.assignedTo}</td>
                <td className="p-4 font-mono text-gray-400">{bug.createdDate}</td>
                <td className="p-4">
                  <div className="flex justify-center">
                    <select
                      value={bug.status}
                      onChange={(e) => updateBugStatus(bug.id, e.target.value as any)}
                      className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold focus:outline-none"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBugs.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  لا توجد بلاغات مسجلة مطابقة للبحث.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900">تسجيل بلاغ خطأ جديد</span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBug} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">عنوان المشكلة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تعطل الصفحة عند الضغط على حفظ"
                  value={newBugTitle}
                  onChange={(e) => setNewBugTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">المشروع المرتبط</label>
                <select
                  required
                  value={newBugProject}
                  onChange={(e) => setNewBugProject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                >
                  <option value="">اختر المشروع</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الخطورة</label>
                <select
                  value={newBugSeverity}
                  onChange={(e) => setNewBugSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">المطور المسؤول عن الحل</label>
                <select
                  value={newBugAssignee}
                  onChange={(e) => setNewBugAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                >
                  <option value="">اختر المطور</option>
                  {developers.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
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
                  حفظ البلاغ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevBugs;
