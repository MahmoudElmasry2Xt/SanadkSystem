import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Task } from '../store/useAppStore';
import {
  List,
  Kanban,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  X,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { tasks, addTask, updateTask, deleteTask, employees } = useAppStore();

  const [activeView, setActiveView] = useState<'list' | 'kanban' | 'calendar'>('list');
  const [formOpen, setFormOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Medium' as Task['priority'],
    dueDate: '',
    assignee: '',
    status: 'To Do' as Task['status']
  });

  const statuses: Task['status'][] = ['To Do', 'In Progress', 'Review', 'Completed', 'Cancelled'];
  const statusLabels: Record<Task['status'], string> = {
    'To Do': t('todo'),
    'In Progress': t('inProgress'),
    'Review': t('review'),
    'Completed': t('completed'),
    'Cancelled': t('cancelled')
  };

  const statusColors: Record<Task['status'], string> = {
    'To Do': 'border-t-gray-400 bg-gray-50/30 text-gray-700',
    'In Progress': 'border-t-yellow-500 bg-yellow-50/20 text-yellow-700',
    'Review': 'border-t-purple-500 bg-purple-50/20 text-purple-700',
    'Completed': 'border-t-green-500 bg-green-50/20 text-green-700',
    'Cancelled': 'border-t-red-500 bg-red-50/20 text-red-700'
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(formData);
    setFormOpen(false);
    setFormData({
      name: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
      assignee: employees[0]?.name || '',
      status: 'To Do'
    });
  };

  const changeStatus = (task: Task, newStatus: Task['status']) => {
    updateTask({
      ...task,
      status: newStatus
    });
  };

  const moveTaskStatus = (task: Task, direction: 'forward' | 'backward') => {
    const currentIndex = statuses.indexOf(task.status);
    let nextIndex = currentIndex;
    if (direction === 'forward' && currentIndex < statuses.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'backward' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }
    if (nextIndex !== currentIndex) {
      changeStatus(task, statuses[nextIndex]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('tasks')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'تتبع المهام اليومية، توزيع المسؤوليات وتعيين تواريخ التسليم.' : 'Track daily team workflow and tasks.'}
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ ...formData, assignee: employees[0]?.name || '' });
            setFormOpen(true);
          }}
          className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createTask')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white p-1 rounded-2xl border w-full max-w-md">
        <button
          onClick={() => setActiveView('list')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeView === 'list'
              ? 'bg-red-600 text-white shadow-md shadow-red-100'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50/30'
          }`}
        >
          <List className="w-4 h-4" />
          <span>{isRtl ? 'قائمة' : 'List'}</span>
        </button>

        <button
          onClick={() => setActiveView('kanban')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeView === 'kanban'
              ? 'bg-red-600 text-white shadow-md shadow-red-100'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50/30'
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span>{isRtl ? 'كانبان' : 'Kanban'}</span>
        </button>

        <button
          onClick={() => setActiveView('calendar')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeView === 'calendar'
              ? 'bg-red-600 text-white shadow-md shadow-red-100'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50/30'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>{isRtl ? 'تقويم' : 'Calendar'}</span>
        </button>
      </div>

      {/* View Content Panels */}
      {activeView === 'list' && (
        <div className="custom-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                  <th className="p-4 text-start">{t('taskName')}</th>
                  <th className="p-4 text-start">{t('priority')}</th>
                  <th className="p-4 text-start">{t('dueDate')}</th>
                  <th className="p-4 text-start">{t('assignee')}</th>
                  <th className="p-4 text-start">{t('status')}</th>
                  <th className="p-4 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">
                      {task.name}
                      <span className="block text-[10px] text-gray-400 font-normal mt-0.5">{task.description}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        task.priority === 'High' ? 'bg-red-50 text-red-600' :
                        task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 font-mono">{task.dueDate}</td>
                    <td className="p-4 text-gray-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-[9px]">
                          {task.assignee.substring(0, 2)}
                        </span>
                        <span>{task.assignee}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={task.status}
                        onChange={(e) => changeStatus(task, e.target.value as Task['status'])}
                        className="custom-input py-1 px-2 text-[10px] w-28 bg-white border border-gray-200"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px] items-start">
            {statuses.map((status) => {
              const statusTasks = tasks.filter(t => t.status === status);
              return (
                <div key={status} className="w-72 bg-white rounded-2xl border border-gray-100 flex flex-col shadow-sm">
                  <div className={`p-4 border-b border-gray-50 rounded-t-2xl border-t-4 flex items-center justify-between font-bold text-xs ${statusColors[status]}`}>
                    <span>{statusLabels[status]}</span>
                    <span className="bg-white/80 border border-gray-100 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-gray-900">
                      {statusTasks.length}
                    </span>
                  </div>
                  
                  <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto min-h-[200px]">
                    {statusTasks.map((task) => (
                      <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                        <h4 className="font-bold text-xs text-gray-950">{task.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                        
                        <div className="flex justify-between items-center mt-4 text-[10px] text-gray-500">
                          <span className={`px-2 py-0.5 rounded-full font-bold ${
                            task.priority === 'High' ? 'bg-red-50 text-red-600' :
                            task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="font-mono">{task.dueDate}</span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50 justify-between">
                          <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
                            <span className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
                              {task.assignee.substring(0, 1)}
                            </span>
                            <span>{task.assignee}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveTaskStatus(task, 'backward')}
                              disabled={statuses.indexOf(task.status) === 0}
                              className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 disabled:opacity-20"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveTaskStatus(task, 'forward')}
                              disabled={statuses.indexOf(task.status) === statuses.length - 1}
                              className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 disabled:opacity-20"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {statusTasks.length === 0 && (
                      <div className="py-8 text-center text-[10px] text-gray-400 border border-dashed border-gray-100 rounded-xl">
                        لا توجد مهام
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'calendar' && (
        <div className="custom-card">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center mb-4">
            <span className="font-bold text-sm text-gray-900">{isRtl ? 'يونيو 2026' : 'June 2026'}</span>
          </div>
          
          {/* 7-days Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-gray-400 mb-2">
            <div>{isRtl ? 'الأحد' : 'Sun'}</div>
            <div>{isRtl ? 'الإثنين' : 'Mon'}</div>
            <div>{isRtl ? 'الثلاثاء' : 'Tue'}</div>
            <div>{isRtl ? 'الأربعاء' : 'Wed'}</div>
            <div>{isRtl ? 'الخميس' : 'Thu'}</div>
            <div>{isRtl ? 'الجمعة' : 'Fri'}</div>
            <div>{isRtl ? 'السبت' : 'Sat'}</div>
          </div>
          
          {/* Days Calendar Cells */}
          <div className="grid grid-cols-7 gap-2 min-h-[350px]">
            {Array.from({ length: 30 }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayTasks = tasks.filter(t => t.dueDate === dateStr);
              
              return (
                <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-xl p-2 flex flex-col justify-between items-start hover:border-red-100 transition-colors">
                  <span className="font-bold text-[10px] text-gray-400">{dayNum}</span>
                  <div className="w-full space-y-1 mt-1">
                    {dayTasks.map(t => (
                      <div key={t.id} className="bg-red-600 text-white rounded-lg p-1 text-[8px] font-bold truncate" title={t.name}>
                        {t.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <form
            onSubmit={handleCreateTask}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-black text-gray-900 text-sm mb-6">{t('createTask')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('taskName')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="custom-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('description')}</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="custom-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('priority')}</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                    className="custom-input text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('dueDate')}</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('assignee')}</label>
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className="custom-input text-xs"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('status')}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                    className="custom-input text-xs"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {t('save')}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
