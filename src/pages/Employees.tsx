import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Employee } from '../store/useAppStore';
import { useAppDispatch, useAppSelector } from '../store';
import {
  createUser,
  resetUserPassword,
  updateUserStatus,
  updateUserRoleAndPermissions,
  rolePermissions,
  type UserStatus,
  type UserRole,
  type Permission
} from '../store/authSlice';
import {
  Search,
  Plus,
  Briefcase,
  User as UserIcon,
  Calendar,
  Mail,
  X,
  Edit2,
  Shield,
  Key,
  ToggleLeft,
  MapPin,
  Phone
} from 'lucide-react';

export const Employees: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const dispatch = useAppDispatch();
  
  // Zustand State
  const { employees, addEmployee, updateEmployee } = useAppStore();
  
  // Redux Auth State
  const { user: loggedInUser, registeredUsers } = useAppSelector((state) => state.auth);
  
  // Admin permissions check
  const isAdmin = loggedInUser?.role === 'CEO' || loggedInUser?.role === 'HR Manager';
  const canCreate = loggedInUser?.role === 'CEO' || loggedInUser?.role === 'HR Manager';

  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // 1. Employee & User Creation Form State
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: 'المبيعات',
    jobTitle: '',
    directManager: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 5000,
    // Account details
    username: '',
    tempPassword: '',
    role: 'Employee' as UserRole,
    permissions: rolePermissions['Employee'] as Permission[],
    status: 'Active' as 'Active' | 'Inactive'
  });

  // 2. Employee Edit Form State (Zustand only)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    jobTitle: '',
    directManager: '',
    hireDate: '',
    salary: 0
  });

  // 3. Admin Management Form State (Redux only)
  const [adminFormData, setAdminFormData] = useState({
    status: 'Active' as UserStatus,
    role: 'Employee' as UserRole,
    permissions: [] as Permission[],
    tempPassword: ''
  });

  const allPermissions: Permission[] = [
    'VIEW_LEADS', 'MANAGE_LEADS', 'VIEW_FINANCE', 'VIEW_FINANCE_SENSITIVE',
    'VIEW_EMPLOYEES', 'MANAGE_EMPLOYEES', 'VIEW_KPI', 'MANAGE_KPI',
    'VIEW_MARKETING', 'MANAGE_MARKETING', 'VIEW_REPORTS', 'MANAGE_SETTINGS',
    'MANAGE_AUTOMATIONS', 'VIEW_TASKS', 'MANAGE_TASKS'
  ];

  const roles: UserRole[] = [
    'CEO', 'General Manager', 'HR Manager', 'Finance Manager',
    'Marketing Manager', 'Sales Manager', 'Team Leader', 'Employee', 'Client'
  ];

  const handleRoleChangeInCreate = (newRole: UserRole) => {
    setCreateFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: rolePermissions[newRole] || []
    }));
  };

  const handlePermissionToggleInCreate = (perm: Permission) => {
    setCreateFormData(prev => {
      const exists = prev.permissions.includes(perm);
      const updated = exists
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: updated };
    });
  };

  const openCreateModal = () => {
    setCreateFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      department: 'المبيعات',
      jobTitle: '',
      directManager: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: 5000,
      username: '',
      tempPassword: '',
      role: 'Employee',
      permissions: rolePermissions['Employee'],
      status: 'Active'
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    setEditFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone || '',
      address: emp.address || '',
      department: emp.department,
      jobTitle: emp.jobTitle,
      directManager: emp.directManager,
      hireDate: emp.hireDate,
      salary: emp.salary
    });
    setEditModalOpen(true);
  };

  const openAdminModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    
    // Find matching Redux user
    const rUser = registeredUsers.find(u => u.email.toLowerCase() === emp.email.toLowerCase());
    
    setAdminFormData({
      status: rUser?.status || 'Active',
      role: rUser?.role || 'Employee',
      permissions: rUser?.permissions || rolePermissions['Employee'],
      tempPassword: ''
    });
    setAdminModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Add to Zustand Employee List
    addEmployee({
      name: createFormData.name,
      department: createFormData.department,
      jobTitle: createFormData.jobTitle,
      directManager: createFormData.directManager,
      hireDate: createFormData.hireDate,
      salary: createFormData.salary,
      email: createFormData.email,
      phone: createFormData.phone,
      address: createFormData.address,
      username: createFormData.username,
      role: createFormData.role,
      status: createFormData.status
    });

    // 2. Dispatch to Redux auth registeredUsers
    // Set status to Pending First Login if a temporary password is provided
    const userStatus: UserStatus = createFormData.status === 'Inactive' 
      ? 'Inactive'
      : (createFormData.tempPassword ? 'Pending First Login' : 'Active');

    dispatch(
      createUser({
        id: 'u' + (registeredUsers.length + 1),
        name: createFormData.name,
        email: createFormData.email,
        username: createFormData.username,
        address: createFormData.address,
        phone: createFormData.phone,
        department: createFormData.department,
        position: createFormData.jobTitle,
        role: createFormData.role,
        permissions: createFormData.permissions,
        status: userStatus,
        password: createFormData.tempPassword || 'Password123'
      })
    );

    setCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee) {
      updateEmployee({
        ...selectedEmployee,
        ...editFormData
      });
    }
    setEditModalOpen(false);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee) {
      // Find matching Redux user
      const rUser = registeredUsers.find(u => u.email.toLowerCase() === selectedEmployee.email.toLowerCase());
      if (rUser) {
        // Update status
        dispatch(updateUserStatus({ id: rUser.id, status: adminFormData.status }));
        
        // Update role and permissions
        dispatch(updateUserRoleAndPermissions({
          id: rUser.id,
          role: adminFormData.role,
          permissions: adminFormData.permissions
        }));

        // Reset password if provided
        if (adminFormData.tempPassword) {
          dispatch(resetUserPassword({
            id: rUser.id,
            tempPassword: adminFormData.tempPassword
          }));
        }
      }
    }
    setAdminModalOpen(false);
  };

  const getStatusBadgeClass = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Inactive':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'Suspended':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Pending First Login':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: UserStatus) => {
    if (isRtl) {
      switch (status) {
        case 'Active': return 'نشط';
        case 'Inactive': return 'غير نشط';
        case 'Suspended': return 'معلق';
        case 'Pending First Login': return 'بانتظار الدخول الأول';
      }
    }
    return status;
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('employees')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'إدارة ملفات الموظفين وبيانات الحسابات الإدارية والصلاحيات.' : 'Manage employee profiles, credentials, and access roles.'}
          </p>
        </div>

        {canCreate && (
          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة موظف ومستخدم جديد' : 'Create Employee / User'}</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="custom-card flex flex-col md:flex-row items-center gap-4 p-4">
  <div className="relative w-full md:flex-1">
    
    <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />

    <input
      type="text"
      placeholder={t('searchEmployees')}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="
        w-full
        h-10
        rounded-xl
        border
        border-gray-200
        bg-white
        ps-10
        pe-3
        text-sm
        placeholder:text-gray-400
        focus:outline-none
        focus:ring-4
        focus:ring-red-500/20
        focus:border-red-500
        transition-all
        duration-200
      "
    />
  </div>
</div>    

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => {
          // Find Redux user matching email
          const rUser = registeredUsers.find(u => u.email.toLowerCase() === emp.email.toLowerCase());
          const currentStatus = rUser?.status || 'Active';
          const currentRole = rUser?.role || 'Employee';

          return (
            <div key={emp.id} className="custom-card-red-border flex flex-col justify-between">
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                      {emp.name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-gray-950 flex items-center gap-2">
                        {emp.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">{emp.jobTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(emp)}
                      title={isRtl ? 'تعديل البيانات الشخصية' : 'Edit Personal Info'}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => openAdminModal(emp)}
                        title={isRtl ? 'إدارة الحساب والصلاحيات' : 'Manage Credentials & Role'}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Badges for Account */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(currentStatus)}`}>
                    {getStatusLabel(currentStatus)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
                    {currentRole}
                  </span>
                </div>

                {/* Attributes */}
                <div className="mt-4 space-y-2 text-[11px] text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{t('department')}: {emp.department}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{t('directManager')}: {emp.directManager}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{t('hireDate')}: {emp.hireDate}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <Mail className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{emp.email}</span>
                  </div>

                  {emp.phone && (
                    <div className="flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  )}

                  {emp.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{emp.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Salary Banner */}
              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-900 bg-red-50/20 -mx-6 -mb-6 p-4 rounded-b-2xl">
                <span>{t('salary')}</span>
                <span className="text-red-600 font-mono">{emp.salary.toLocaleString()} ج.م / {isRtl ? 'شهرياً' : 'mo'}</span>
              </div>
            </div>
          );
        })}
        {filteredEmployees.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 text-xs">
            {isRtl ? 'لا يوجد موظفون يطابقون شروط البحث' : 'No employees match your search query'}
          </div>
        )}
      </div>

      {/* 1. Create Employee & User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-2xl w-full max-w-lg p-6 z-10 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-gray-900 text-sm mb-6">
              {isRtl ? 'إضافة موظف ومستخدم جديد للمنصة' : 'Create New Employee & System User'}
            </h3>

            <div className="space-y-6">
              {/* Section 1: Personal Information */}
              <div>
                <h4 className="text-xs font-black text-red-600 uppercase tracking-wider mb-3 border-b pb-1">
                  {isRtl ? '1. البيانات الشخصية' : '1. Personal Information'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'الاسم بالكامل' : 'Full Name'}</label>
                    <input
                      type="text"
                      required
                      value={createFormData.name}
                      onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                      className="custom-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</label>
                    <input
                      type="email"
                      required
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      className="custom-input text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
                    <input
                      type="text"
                      required
                      value={createFormData.phone}
                      onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                      className="custom-input text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'العنوان' : 'Address'}</label>
                    <input
                      type="text"
                      required
                      value={createFormData.address}
                      onChange={(e) => setCreateFormData({ ...createFormData, address: e.target.value })}
                      className="custom-input text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Employment Information */}
              <div>
                <h4 className="text-xs font-black text-red-600 uppercase tracking-wider mb-3 border-b pb-1">
                  {isRtl ? '2. بيانات التوظيف' : '2. Employment Information'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('department')}</label>
                    <select
                      value={createFormData.department}
                      onChange={(e) => setCreateFormData({ ...createFormData, department: e.target.value })}
                      className="custom-input text-xs"
                    >
                      <option value="المبيعات">المبيعات</option>
                      <option value="التسويق">التسويق</option>
                      <option value="الموارد البشرية">الموارد البشرية</option>
                      <option value="الإدارة المالية">الإدارة المالية</option>
                      <option value="التشغيل">التشغيل</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'المسمى الوظيفي' : 'Position / Job Title'}</label>
                    <input
                      type="text"
                      required
                      value={createFormData.jobTitle}
                      onChange={(e) => setCreateFormData({ ...createFormData, jobTitle: e.target.value })}
                      className="custom-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('directManager')}</label>
                    <input
                      type="text"
                      required
                      value={createFormData.directManager}
                      onChange={(e) => setCreateFormData({ ...createFormData, directManager: e.target.value })}
                      className="custom-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('hireDate')}</label>
                    <input
                      type="date"
                      required
                      value={createFormData.hireDate}
                      onChange={(e) => setCreateFormData({ ...createFormData, hireDate: e.target.value })}
                      className="custom-input text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'الراتب الشهري (ج.م)' : 'Salary (EGP)'}</label>
                    <input
                      type="number"
                      required
                      value={createFormData.salary}
                      onChange={(e) => setCreateFormData({ ...createFormData, salary: parseInt(e.target.value) || 0 })}
                      className="custom-input text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Account Information */}
              <div>
                <h4 className="text-xs font-black text-red-600 uppercase tracking-wider mb-3 border-b pb-1">
                  {isRtl ? '3. بيانات حساب النظام والصلاحيات' : '3. Account Information & Permissions'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'اسم المستخدم' : 'Username'}</label>
                    <input
                      type="text"
                      required
                      value={createFormData.username}
                      onChange={(e) => setCreateFormData({ ...createFormData, username: e.target.value })}
                      className="custom-input text-xs font-mono"
                      placeholder="e.g. jdoe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'كلمة مرور مؤقتة' : 'Temporary Password'}</label>
                    <input
                      type="text"
                      required
                      value={createFormData.tempPassword}
                      onChange={(e) => setCreateFormData({ ...createFormData, tempPassword: e.target.value })}
                      className="custom-input text-xs font-mono"
                      placeholder="e.g. TempPass123"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'صلاحية النظام / الدور' : 'System Role'}</label>
                    <select
                      value={createFormData.role}
                      onChange={(e) => handleRoleChangeInCreate(e.target.value as UserRole)}
                      className="custom-input text-xs"
                    >
                      {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{isRtl ? 'حالة الحساب الأولية' : 'Initial Status'}</label>
                    <select
                      value={createFormData.status}
                      onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value as 'Active' | 'Inactive' })}
                      className="custom-input text-xs"
                    >
                      <option value="Active">{isRtl ? 'نشط (مستوجب تغيير كلمة المرور عند أول دخول)' : 'Active (Requires password change)'}</option>
                      <option value="Inactive">{isRtl ? 'غير نشط (معطل)' : 'Inactive'}</option>
                    </select>
                  </div>

                  {/* Checklist of Permissions */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 mb-2">
                      {isRtl ? 'تخصيص أذونات الوصول المحددة:' : 'Customize Specific System Permissions:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border border-gray-100 rounded-xl bg-slate-50/50">
                      {allPermissions.map((perm) => (
                        <label key={perm} className="flex items-center gap-2 text-[10px] text-gray-700 cursor-pointer hover:text-red-600 transition-colors">
                          <input
                            type="checkbox"
                            checked={createFormData.permissions.includes(perm)}
                            onChange={() => handlePermissionToggleInCreate(perm)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                          />
                          <span className="font-mono">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {isRtl ? 'إنشاء وتفعيل' : 'Create & Activate'}
              </button>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Edit Employee Modal (Zustand personal details only) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setEditModalOpen(false)} />
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-gray-900 text-sm mb-6">
              {isRtl ? 'تعديل البيانات الشخصية للموظف' : 'Edit Employee Personal Details'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'اسم الموظف' : 'Employee Name'}</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="custom-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('department')}</label>
                  <select
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="المبيعات">المبيعات</option>
                    <option value="التسويق">التسويق</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                    <option value="الإدارة المالية">الإدارة المالية</option>
                    <option value="التشغيل">التشغيل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'الوظيفة' : 'Job Title'}</label>
                  <input
                    type="text"
                    required
                    value={editFormData.jobTitle}
                    onChange={(e) => setEditFormData({ ...editFormData, jobTitle: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'البريد الإلكتروني المهني' : 'Work Email'}</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="custom-input text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'الهاتف' : 'Phone'}</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="custom-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'العنوان' : 'Address'}</label>
                  <input
                    type="text"
                    required
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('directManager')}</label>
                  <input
                    type="text"
                    required
                    value={editFormData.directManager}
                    onChange={(e) => setEditFormData({ ...editFormData, directManager: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('hireDate')}</label>
                  <input
                    type="date"
                    required
                    value={editFormData.hireDate}
                    onChange={(e) => setEditFormData({ ...editFormData, hireDate: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('salary')}</label>
                <input
                  type="number"
                  required
                  value={editFormData.salary}
                  onChange={(e) => setEditFormData({ ...editFormData, salary: parseInt(e.target.value) || 0 })}
                  className="custom-input text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {t('save')}
              </button>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Administrative Credentials Management Modal (CEO & HR Manager only) */}
      {adminModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setAdminModalOpen(false)} />
          <form
            onSubmit={handleAdminSubmit}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100 max-h-[85vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setAdminModalOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span>{isRtl ? 'إدارة حساب الموظف وصلاحياته' : 'Administrative Account Management'}</span>
            </h3>
            <p className="text-[10px] text-gray-400 mb-6">
              {isRtl ? `المستخدم: ${selectedEmployee.name}` : `System Profile: ${selectedEmployee.name}`}
            </p>

            <div className="space-y-5">
              {/* Account Status */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                  <ToggleLeft className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isRtl ? 'حالة حساب المستخدم' : 'Account Status'}</span>
                </label>
                <select
                  value={adminFormData.status}
                  onChange={(e) => setAdminFormData({ ...adminFormData, status: e.target.value as UserStatus })}
                  className="custom-input text-xs font-bold"
                >
                  <option value="Active">{isRtl ? 'نشط (Active)' : 'Active'}</option>
                  <option value="Inactive">{isRtl ? 'غير نشط (Inactive)' : 'Inactive'}</option>
                  <option value="Suspended">{isRtl ? 'معلق (Suspended)' : 'Suspended'}</option>
                  <option value="Pending First Login">{isRtl ? 'معلق بانتظار الدخول الأول (Pending First Login)' : 'Pending First Login'}</option>
                </select>
              </div>

              {/* System Role */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isRtl ? 'دور صلاحية النظام' : 'System Role'}</span>
                </label>
                <select
                  value={adminFormData.role}
                  onChange={(e) => {
                    const nextRole = e.target.value as UserRole;
                    setAdminFormData({
                      ...adminFormData,
                      role: nextRole,
                      permissions: rolePermissions[nextRole] || []
                    });
                  }}
                  className="custom-input text-xs"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Force Reset Password */}
              <div className="p-4 border border-purple-50 rounded-xl bg-purple-50/25">
                <label className="block text-xs font-bold text-purple-900 mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isRtl ? 'إعادة تعيين كلمة المرور' : 'Reset Account Password'}</span>
                </label>
                <p className="text-[10px] text-purple-600/70 mb-3">
                  {isRtl ? 'اكتب كلمة مرور مؤقتة جديدة هنا لإرغام المستخدم على إعادة تعيينها.' : 'Provide a new temporary password. This will set status back to Pending First Login.'}
                </p>
                <input
                  type="text"
                  value={adminFormData.tempPassword}
                  onChange={(e) => setAdminFormData({ ...adminFormData, tempPassword: e.target.value })}
                  placeholder={isRtl ? 'كلمة مرور مؤقتة جديدة...' : 'New temporary password...'}
                  className="custom-input text-xs bg-white font-mono"
                />
              </div>

              {/* Checklist of Permissions */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  {isRtl ? 'تخصيص أذونات الوصول المحددة:' : 'Customize Specific System Permissions:'}
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border border-gray-100 rounded-xl bg-slate-50/50">
                  {allPermissions.map((perm) => {
                    const isChecked = adminFormData.permissions.includes(perm);
                    return (
                      <label key={perm} className="flex items-center gap-2 text-[10px] text-gray-700 cursor-pointer hover:text-purple-600 transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const updated = isChecked
                              ? adminFormData.permissions.filter(p => p !== perm)
                              : [...adminFormData.permissions, perm];
                            setAdminFormData({ ...adminFormData, permissions: updated });
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                        />
                        <span className="font-mono">{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary bg-purple-600 hover:bg-purple-700 hover:shadow-purple-100 py-2.5 text-xs">
                {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
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
export default Employees;
