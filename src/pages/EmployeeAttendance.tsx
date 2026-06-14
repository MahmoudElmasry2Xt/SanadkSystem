import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useAppSelector } from '../store';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  AlertTriangle 
} from 'lucide-react';

export const EmployeeAttendance: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  // Zustand store state and actions
  const { employees, addEmployee, serverCheckIn, serverCheckOut } = useAppStore();

  // Redux authentication user details
  const loggedInUser = useAppSelector((state) => state.auth.user);
  const role = loggedInUser?.role || 'Employee';
  const roleLower = role.toLowerCase();

  // Role permissions helpers
  const isGeneralManager = roleLower === 'general manager';
  const isDepartmentManager = [
    'sales manager',
    'marketing manager',
    'finance manager'
  ].includes(roleLower);
  const isTeamLead = roleLower === 'team leader';
  const isHRorCEO = roleLower === 'ceo' || roleLower === 'hr manager';
  const isEmployee = roleLower === 'employee';
  
  const hasTabs = isHRorCEO || isGeneralManager || isDepartmentManager || isTeamLead;

  const getManagerDeptName = (userRole: string) => {
    const roleL = userRole.toLowerCase();
    if (roleL.includes('sales')) return 'المبيعات';
    if (roleL.includes('marketing')) return 'التسويق';
    if (roleL.includes('finance')) return 'المالية';
    if (roleL.includes('hr')) return 'الموارد البشرية';
    return '';
  };
  
  // 1. Find or provision Zustand employee record for current user
  const myEmployee = employees.find(e => e.email.toLowerCase() === loggedInUser?.email?.toLowerCase());

  useEffect(() => {
    if (loggedInUser && !myEmployee) {
      // Auto-provision employee record in Zustand if it doesn't exist
      addEmployee({
        name: loggedInUser.name,
        email: loggedInUser.email,
        department: loggedInUser.department || (isRtl ? 'الإدارة العامة' : 'General Management'),
        jobTitle: loggedInUser.position || loggedInUser.role,
        directManager: isRtl ? 'المدير العام' : 'General Manager',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        phone: loggedInUser.phone || '',
        address: loggedInUser.address || '',
        username: loggedInUser.username || '',
        role: loggedInUser.role,
        status: 'Active'
      });
    }
  }, [loggedInUser, myEmployee, addEmployee, isRtl]);

  // Determine selectable employees list based on role
  const getSelectableEmployees = () => {
    if (isHRorCEO || isGeneralManager) {
      return employees;
    }
    if (isDepartmentManager) {
      const deptName = getManagerDeptName(role) || myEmployee?.department || '';
      return employees.filter(e => 
        e.department === deptName || 
        e.email.toLowerCase() === loggedInUser?.email?.toLowerCase()
      );
    }
    if (isTeamLead) {
      const managerName = loggedInUser?.name || '';
      const firstName = managerName.split(' ')[0] || '';
      return employees.filter(e => 
        e.directManager?.includes(firstName) || 
        e.email.toLowerCase() === loggedInUser?.email?.toLowerCase()
      );
    }
    // Regular employees can only view themselves
    return myEmployee ? [myEmployee] : [];
  };

  const selectableEmployees = getSelectableEmployees();

  // Group selectable employees by department for dropdown UI
  const getGroupedEmployees = () => {
    const groups: Record<string, typeof employees> = {};
    selectableEmployees.forEach(emp => {
      const dept = emp.department || (isRtl ? 'أخرى' : 'Other');
      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(emp);
    });
    return groups;
  };

  const groupedEmployees = getGroupedEmployees();

  // Local state for selected employee, dates, and API feedback
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [apiFeedback, setApiFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'personal' | 'team'>('personal');

  const defaultEmp = selectableEmployees.find(e => e.email.toLowerCase() === loggedInUser?.email?.toLowerCase()) || selectableEmployees[0];
  const activeEmployee = hasTabs && activeTab === 'team'
    ? (employees.find(e => e.id === selectedEmpId) || defaultEmp)
    : (myEmployee || defaultEmp);
  const isSelf = activeEmployee && myEmployee && activeEmployee.id === myEmployee.id;
  // Debug Requirement
  useEffect(() => {
    console.log("Current Role:", role);
  }, [role]);

  // Calculate today's status
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = activeEmployee?.attendance.find(a => a.date === todayStr);

  // Quick Stats
  const attendanceLogs = activeEmployee?.attendance || [];
  const daysPresent = attendanceLogs.length;
  const totalHours = attendanceLogs.reduce((acc, curr) => acc + curr.workingHours, 0);
  const totalDelay = attendanceLogs.reduce((acc, curr) => acc + curr.delayMinutes, 0);

  // Trigger Parameter-free Check-In Action
  const handleCheckIn = async () => {
    if (!activeEmployee) return;
    setIsLoading(true);
    setApiFeedback(null);
    
    // Artificial delay to show loading state
    setTimeout(() => {
      try {
        const res = serverCheckIn(activeEmployee.id);
        setApiFeedback(res);
      } catch (err) {
        setApiFeedback({ success: false, message: err instanceof Error ? err.message : 'Error checking in' });
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };

  // Trigger Parameter-free Check-Out Action
  const handleCheckOut = async () => {
    if (!activeEmployee) return;
    setIsLoading(true);
    setApiFeedback(null);

    // Artificial delay to show loading state
    setTimeout(() => {
      try {
        const res = serverCheckOut(activeEmployee.id);
        setApiFeedback(res);
      } catch (err) {
        setApiFeedback({ success: false, message: err instanceof Error ? err.message : 'Error checking out' });
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };

  // Filter logs by date filter
  const filteredLogs = attendanceLogs.filter(log => {
    if (!dateFilter) return true;
    return log.date === dateFilter;
  });

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('attendance')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl 
              ? `لوحة الحضور والانصراف الذاتية وسجلات الفريق - دورك: ${role}` 
              : `Self Clock-In & Team Ledger - Role: ${role}`}
          </p>
        </div>

        {/* Dropdown selector for Managers/Admins in Team Monitor Tab */}
        {hasTabs && activeTab === 'team' && selectableEmployees.length > 0 && (
          <div className="w-full sm:w-64">
            <label className="block text-[10px] font-bold text-gray-500 mb-1">
              {isRtl ? 'عرض سجل حضور الموظف:' : 'Viewing Attendance for:'}
            </label>
            <select
              value={selectedEmpId || defaultEmp?.id || ""}
              onChange={(e) => {
                setSelectedEmpId(e.target.value);
                setApiFeedback(null);
              }}
              className="custom-input py-2 text-xs font-semibold"
            >
              {Object.entries(groupedEmployees).map(([deptName, deptEmps]) => (
                <optgroup key={deptName} label={deptName}>
                  {deptEmps.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs for Managers/Admins */}
      {hasTabs && (
        <div className="flex border-b border-gray-200 gap-2 mb-4 bg-white p-2.5 rounded-xl border border-gray-100">
          <button
            onClick={() => {
              setActiveTab('personal');
              setApiFeedback(null);
            }}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'personal'
                ? 'bg-red-50 text-red-600 shadow-sm border border-red-100'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {isRtl ? 'تسجيل الحضور الشخصي' : 'My Attendance'}
          </button>
          <button
            onClick={() => {
              setActiveTab('team');
              setApiFeedback(null);
            }}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'team'
                ? 'bg-red-50 text-red-600 shadow-sm border border-red-100'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {isRtl ? 'متابعة الموظفين' : 'Employee Monitor'}
          </button>
        </div>
      )}

      {activeEmployee ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Action and Shift Rule Display Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Clock Panel Card */}
            <div className="custom-card relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
              <div className="absolute top-0 right-0 p-12 bg-red-500/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-600" />
                  {isRtl ? 'تسجيل الدوام اليومي' : 'Daily Shift Punch'}
                </span>
                {isSelf ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-[10px] font-bold text-red-600">
                    {isRtl ? 'حسابي الشخصي' : 'My Account'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold text-amber-700">
                    {isRtl 
                      ? (isEmployee ? 'عرض الفريق (قراءة)' : 'عرض الفريق (إدارة)') 
                      : (isEmployee ? 'Team View (Read-only)' : 'Team View (Manage)')}
                  </span>
                )}
              </div>

              {/* Time display */}
              <div className="text-center py-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {isRtl ? 'التاريخ واليوم الحالي' : 'Current System Date'}
                </p>
                <h2 className="text-2xl font-black text-gray-950 mt-1 font-mono">{todayStr}</h2>
                <p className="text-[10px] text-gray-400 mt-1 font-mono">
                  {isRtl ? 'مواعيد الدوام: 09:00 ص - 05:00 م' : 'Shift hours: 09:00 AM - 05:00 PM'}
                </p>
              </div>

              {/* Today Status Tracker */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{isRtl ? 'تسجيل الحضور:' : 'Clocked In:'}</span>
                  <span className="font-bold text-gray-900 font-mono">
                    {todayRecord ? todayRecord.checkIn : '--:--'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{isRtl ? 'تسجيل الانصراف:' : 'Clocked Out:'}</span>
                  <span className="font-bold text-gray-900 font-mono">
                    {todayRecord?.checkOut ? todayRecord.checkOut : '--:--'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-gray-50 pt-2.5">
                  <span className="text-gray-500">{isRtl ? 'حالة حضور اليوم:' : 'Status:'}</span>
                  {todayRecord ? (
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      todayRecord.status === 'Present' 
                        ? 'bg-green-50 text-green-700' 
                        : todayRecord.status === 'Late' 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'bg-red-50 text-red-700'
                    }`}>
                      {todayRecord.status || 'Present'}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic text-[11px]">
                      {isRtl ? 'لم يتم الحضور بعد' : 'Not recorded yet'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons (Strictly parameterless, UI-only execution) */}
              {isSelf ? (
                <div className="space-y-2.5">
                  {!todayRecord ? (
                    <button
                      onClick={handleCheckIn}
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      ) : (
                        isRtl ? 'تسجيل حضور الآن' : 'Clock In Now'
                      )}
                    </button>
                  ) : !todayRecord.checkOut ? (
                    <button
                      onClick={handleCheckOut}
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      ) : (
                        isRtl ? 'تسجيل انصراف الآن' : 'Clock Out Now'
                      )}
                    </button>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-center text-gray-500 text-xs font-semibold">
                      {isRtl ? 'لقد أكملت تسجيل الدوام اليوم بنجاح!' : 'Today\'s shift successfully completed!'}
                    </div>
                  )}
                </div>
              ) : (
                isEmployee ? (
                  <div className="p-3 bg-amber-50/50 border border-amber-100/60 rounded-xl text-center text-amber-800 text-[11px] font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      {isRtl 
                        ? 'لا يمكنك تسجيل الدوام لغيرك. واجهة العرض للفريق للقراءة فقط.' 
                        : 'You cannot perform actions on behalf of team members. View-only mode.'}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-center text-gray-500 text-[11px] font-semibold">
                    {isRtl ? 'أنت تستعرض حالياً سجل هذا الموظف.' : 'You are currently viewing this employee\'s schedule.'}
                  </div>
                )
              )}

              {/* API Action Response Feedback */}
              {apiFeedback && (
                <div className={`mt-4 p-3 rounded-xl border flex items-start gap-2 text-[11px] animate-fadeIn ${
                  apiFeedback.success 
                    ? 'bg-green-50 border-green-100 text-green-800' 
                    : 'bg-red-50 border-red-100 text-red-800'
                }`}>
                  {apiFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{apiFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Shift Rules & Policies Display (No calculations in FE) */}
            <div className="custom-card bg-gray-50 border border-gray-100 p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-900 border-b border-gray-200 pb-2">
                {isRtl ? 'قواعد وقوانين الحضور:' : 'Shift Policies & Settings:'}
              </h4>
              <ul className="space-y-2 text-[11px] text-gray-600">
                <li className="flex justify-between">
                  <span>{isRtl ? 'بداية الدوام الرسمي:' : 'Official Start Time:'}</span>
                  <span className="font-semibold text-gray-900">09:00 AM</span>
                </li>
                <li className="flex justify-between">
                  <span>{isRtl ? 'فترة السماح (Grace Period):' : 'Grace Period:'}</span>
                  <span className="font-semibold text-gray-900">15 mins (09:15 AM)</span>
                </li>
                <li className="flex justify-between">
                  <span>{isRtl ? 'بداية احتساب الغياب (Cutoff):' : 'Cutoff Limit:'}</span>
                  <span className="font-semibold text-gray-900">09:15 AM - 10:30 AM (Late) / &gt;10:30 AM (Absent)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Metrics and History Table */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="custom-card">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {isRtl ? 'أيام الحضور' : 'Days Present'}
                    </span>
                    <h3 className="text-xl font-black text-gray-950 mt-1">
                      {daysPresent} {isRtl ? 'أيام' : 'Days'}
                    </h3>
                  </div>
                  <div className="p-2 rounded-lg bg-red-50 text-red-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="custom-card">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {t('workingHours')}
                    </span>
                    <h3 className="text-xl font-black text-gray-950 mt-1">
                      {totalHours.toFixed(1)} {isRtl ? 'ساعة' : 'Hrs'}
                    </h3>
                  </div>
                  <div className="p-2 rounded-lg bg-red-50 text-red-600">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="custom-card">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {t('delay')}
                    </span>
                    <h3 className={`text-xl font-black mt-1 ${totalDelay > 0 ? 'text-red-600' : 'text-gray-950'}`}>
                      {totalDelay} {isRtl ? 'دقيقة' : 'Mins'}
                    </h3>
                  </div>
                  <div className="p-2 rounded-lg bg-red-50 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Logs Table Card */}
            <div className="custom-card p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50">
                <span className="font-bold text-xs text-gray-900">
                  {isRtl ? `جدول حضور الموظف: ${activeEmployee.name}` : `Attendance Log Ledger: ${activeEmployee.name}`}
                </span>

                {/* Date Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="custom-input py-1 px-2.5 text-[11px] w-full sm:w-40 font-mono"
                  />
                  {dateFilter && (
                    <button
                      onClick={() => setDateFilter('')}
                      className="text-[10px] text-red-600 hover:underline font-bold"
                    >
                      {isRtl ? 'إلغاء' : 'Clear'}
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse text-xs">
                  <thead>
                    <tr className="bg-red-50/10 border-b border-gray-100 text-gray-900 font-bold">
                      <th className="p-3.5 text-start">{t('date')}</th>
                      <th className="p-3.5 text-start">{isRtl ? 'حضور' : 'Clock In'}</th>
                      <th className="p-3.5 text-start">{isRtl ? 'انصراف' : 'Clock Out'}</th>
                      <th className="p-3.5 text-start">{t('workingHours')}</th>
                      <th className="p-3.5 text-start">{t('delay')}</th>
                      <th className="p-3.5 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredLogs.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors font-mono">
                        <td className="p-3.5 font-bold text-gray-950">{log.date}</td>
                        <td className="p-3.5 text-gray-600">{log.checkIn}</td>
                        <td className="p-3.5 text-gray-600">{log.checkOut || '--:--'}</td>
                        <td className="p-3.5 text-gray-600">{log.workingHours} {isRtl ? 'ساعة' : 'hrs'}</td>
                        <td className="p-3.5">
                          {log.delayMinutes > 0 ? (
                            <span className="text-red-600 font-bold">
                              {log.delayMinutes} {isRtl ? 'د' : 'mins'}
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                            log.status === 'Present' 
                              ? 'bg-green-50 text-green-700' 
                              : log.status === 'Late' 
                                ? 'bg-amber-50 text-amber-700' 
                                : 'bg-red-50 text-red-700'
                          }`}>
                            {log.status || 'Present'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-gray-400 text-xs italic">
                          {isRtl ? 'لا يوجد سجلات مطابقة للبحث.' : 'No matching attendance logs found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 text-xs">
          {isRtl ? 'جاري تحميل سجلات الموظف...' : 'Loading employee records...'}
        </div>
      )}
    </div>
  );
};
