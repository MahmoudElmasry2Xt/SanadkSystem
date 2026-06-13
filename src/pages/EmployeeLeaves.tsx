import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Check, X, Plus } from 'lucide-react';

export const EmployeeLeaves: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { employees, updateLeaveStatus, addLeaveRequest } = useAppStore();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [leaveForm, setLeaveForm] = useState({
    type: 'إجازة سنوية',
    fromDate: '',
    toDate: '',
    status: 'Pending' as const
  });

  // Flat list of all leave requests
  const allLeaves = employees.flatMap((emp) =>
    (emp.leaves || []).map((leave) => ({
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      ...leave
    }))
  );

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) return;
    addLeaveRequest(selectedEmpId, leaveForm);
    setFormOpen(false);
    setLeaveForm({
      type: 'إجازة سنوية',
      fromDate: '',
      toDate: '',
      status: 'Pending'
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('leaveRequests')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'عرض طلبات الإجازات المعلقة والموافقة عليها أو رفضها.' : 'Review and process employee leave applications.'}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedEmpId(employees[0]?.id || '');
            setFormOpen(true);
          }}
          className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'تقديم طلب إجازة' : 'Request Leave'}</span>
        </button>
      </div>

      {/* Leaves Ledger */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <span className="font-bold text-xs text-gray-900">{isRtl ? 'طلبات الإجازات الواردة' : 'Incoming Leave Requests'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{t('employeeList')}</th>
                <th className="p-4 text-start">{t('department')}</th>
                <th className="p-4 text-start">{isRtl ? 'نوع الإجازة' : 'Leave Type'}</th>
                <th className="p-4 text-start">{isRtl ? 'من تاريخ' : 'From Date'}</th>
                <th className="p-4 text-start">{isRtl ? 'إلى تاريخ' : 'To Date'}</th>
                <th className="p-4 text-start">{t('status')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{leave.employeeName}</td>
                  <td className="p-4 text-gray-500">{leave.department}</td>
                  <td className="p-4 text-gray-600 font-medium">{leave.type}</td>
                  <td className="p-4 text-gray-500 font-mono">{leave.fromDate}</td>
                  <td className="p-4 text-gray-500 font-mono">{leave.toDate}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      leave.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                      leave.status === 'Approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {leave.status === 'Pending' && t('pending')}
                      {leave.status === 'Approved' && t('approved')}
                      {leave.status === 'Rejected' && t('rejected')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {leave.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => updateLeaveStatus(leave.employeeId, leave.id, 'Approved')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-xl transition-colors border border-green-100"
                            title={t('approve')}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => updateLeaveStatus(leave.employeeId, leave.id, 'Rejected')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-100"
                            title={t('reject')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">--</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {allLeaves.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    لا توجد طلبات إجازة مسجلة حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Application Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <form
            onSubmit={handleCreateLeave}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-black text-gray-900 text-sm mb-6">{isRtl ? 'تقديم طلب إجازة موظف' : 'Apply Employee Leave'}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('employeeList')}</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="custom-input text-xs"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'نوع الإجازة' : 'Leave Type'}</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="custom-input text-xs"
                >
                  <option value="إجازة سنوية">إجازة سنوية</option>
                  <option value="إجازة عارضة">إجازة عارضة</option>
                  <option value="إجازة مرضية">إجازة مرضية</option>
                  <option value="إجازة بدون مرتب">إجازة بدون مرتب</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'من تاريخ' : 'From Date'}</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.fromDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'إلى تاريخ' : 'To Date'}</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.toDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {t('submit')}
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
