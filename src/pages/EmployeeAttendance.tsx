import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

export const EmployeeAttendance: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { employees } = useAppStore();

  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || 'emp1');
  const activeEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];

  // Calculate quick stats
  const attendanceLogs = activeEmployee?.attendance || [];
  const daysPresent = attendanceLogs.length;
  
  const totalHours = attendanceLogs.reduce((acc, curr) => acc + curr.workingHours, 0);
  const totalDelay = attendanceLogs.reduce((acc, curr) => acc + curr.delayMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('attendance')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'سجل الحضور والانصراف اليومي للموظفين ومعدلات التأخير.' : 'Employee attendance logs and delay tracker.'}
          </p>
        </div>

        {/* Dropdown selector */}
        <div className="w-full sm:w-64">
          <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'اختر الموظف لعرض السجل' : 'Select Employee'}</label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="custom-input py-2 text-xs"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>

      {activeEmployee ? (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="custom-card">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'أيام الحضور' : 'Days Present'}</span>
                  <h3 className="text-2xl font-black text-gray-950 mt-1">{daysPresent} {isRtl ? 'أيام' : 'Days'}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="custom-card">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{t('workingHours')}</span>
                  <h3 className="text-2xl font-black text-gray-950 mt-1">{totalHours.toFixed(1)} {isRtl ? 'ساعة' : 'Hours'}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="custom-card-red-border">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{t('delay')}</span>
                  <h3 className={`text-2xl font-black mt-1 ${totalDelay > 0 ? 'text-red-600' : 'text-gray-950'}`}>
                    {totalDelay} {isRtl ? 'دقيقة' : 'Minutes'}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Ledger */}
          <div className="custom-card p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-900">{isRtl ? 'جدول الحضور اليومي للموظف' : 'Daily Attendance Ledger'}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-xs">
                <thead>
                  <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                    <th className="p-4 text-start">{t('date')}</th>
                    <th className="p-4 text-start">{isRtl ? 'وقت الحضور' : 'Clock In'}</th>
                    <th className="p-4 text-start">{isRtl ? 'وقت الانصراف' : 'Clock Out'}</th>
                    <th className="p-4 text-start">{t('workingHours')}</th>
                    <th className="p-4 text-start">{t('delay')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attendanceLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-900 font-mono">{log.date}</td>
                      <td className="p-4 text-gray-600 font-mono">{log.checkIn}</td>
                      <td className="p-4 text-gray-600 font-mono">{log.checkOut}</td>
                      <td className="p-4 text-gray-600 font-mono">{log.workingHours} {isRtl ? 'ساعة' : 'hrs'}</td>
                      <td className="p-4">
                        {log.delayMinutes > 0 ? (
                          <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            {log.delayMinutes} {isRtl ? 'دقيقة تأخير' : 'mins delay'}
                          </span>
                        ) : (
                          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            {isRtl ? 'منضبط' : 'On Time'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {attendanceLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-400">
                        {isRtl ? 'لا يوجد سجلات حضور مسجلة لهذا الموظف.' : 'No attendance logs recorded for this employee.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400 text-xs">
          يرجى إضافة موظفين أولاً
        </div>
      )}
    </div>
  );
};
