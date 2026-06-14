import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type ActivityLog } from '../store/useAppStore';
import {
  Activity,
  Users,
  TrendingUp,
  Shield,
  Search,
  Filter,
  Clock,
  User,
  Briefcase,
  Megaphone,
  LogIn
} from 'lucide-react';

const entityIcons: Record<ActivityLog['affectedEntity'], React.ReactNode> = {
  lead: <Users className="w-3.5 h-3.5" />,
  campaign: <Megaphone className="w-3.5 h-3.5" />,
  user: <LogIn className="w-3.5 h-3.5" />,
  attendance: <Briefcase className="w-3.5 h-3.5" />,
  other: <Activity className="w-3.5 h-3.5" />
};

const entityColors: Record<ActivityLog['affectedEntity'], string> = {
  lead: 'bg-blue-50 text-blue-600 border-blue-100',
  campaign: 'bg-purple-50 text-purple-600 border-purple-100',
  user: 'bg-green-50 text-green-600 border-green-100',
  attendance: 'bg-orange-50 text-orange-600 border-orange-100',
  other: 'bg-gray-50 text-gray-600 border-gray-100'
};

export const SystemActivityLogs: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { activityLogs } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredLogs = useMemo(() => {
    return [...activityLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .filter((log) => {
        const matchesSearch =
          log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.details || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesEntity = selectedEntity ? log.affectedEntity === selectedEntity : true;

        const matchesDate = selectedDate
          ? log.timestamp.startsWith(selectedDate)
          : true;

        return matchesSearch && matchesEntity && matchesDate;
      });
  }, [activityLogs, searchTerm, selectedEntity, selectedDate]);

  // Summary metrics
  const totalLogs = activityLogs.length;
  const leadLogs = activityLogs.filter((l) => l.affectedEntity === 'lead').length;
  const attendanceLogs = activityLogs.filter((l) => l.affectedEntity === 'attendance').length;
  const authLogs = activityLogs.filter((l) => l.affectedEntity === 'user').length;
  const campaignLogs = activityLogs.filter((l) => l.affectedEntity === 'campaign').length;

  const metrics = [
    {
      label: isRtl ? 'إجمالي السجلات' : 'Total Logs',
      value: totalLogs,
      icon: <Activity className="w-5 h-5" />,
      color: 'from-red-500 to-rose-600',
      bg: 'bg-red-50',
      text: 'text-red-600'
    },
    {
      label: isRtl ? 'نشاط العملاء' : 'Lead Activity',
      value: leadLogs,
      icon: <Users className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    {
      label: isRtl ? 'سجلات الحضور' : 'Attendance Logs',
      value: attendanceLogs,
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-orange-500 to-amber-600',
      bg: 'bg-orange-50',
      text: 'text-orange-600'
    },
    {
      label: isRtl ? 'الحملات والتسويق' : 'Campaign Logs',
      value: campaignLogs,
      icon: <Megaphone className="w-5 h-5" />,
      color: 'from-purple-500 to-violet-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600'
    },
    {
      label: isRtl ? 'تسجيلات الدخول' : 'Auth / Security',
      value: authLogs,
      icon: <Shield className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      text: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">
          {isRtl ? 'سجل نشاط النظام' : 'System Activity Logs'}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {isRtl
            ? 'مراقبة وتدقيق جميع الإجراءات المنفذة في النظام بالكامل.'
            : 'Monitor and audit all actions performed across the entire system.'}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="custom-card p-4 flex flex-col gap-3 hover:shadow-md transition-all duration-200"
          >
            <div className={`w-9 h-9 rounded-xl ${m.bg} ${m.text} flex items-center justify-center`}>
              {m.icon}
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">{m.label}</p>
              <p className={`text-2xl font-black ${m.text} mt-0.5`}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="custom-card flex flex-col md:flex-row items-center gap-4 p-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'بحث بالاسم أو الإجراء أو التفاصيل...' : 'Search by user, action, or details...'}
            className="w-full h-10 rounded-xl border border-gray-200 bg-white ps-10 pe-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Entity Filter */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="custom-input py-2 text-xs ps-8 md:w-44"
            >
              <option value="">{isRtl ? 'كل الأنواع' : 'All Types'}</option>
              <option value="lead">{isRtl ? 'العملاء (Leads)' : 'Leads'}</option>
              <option value="campaign">{isRtl ? 'الحملات' : 'Campaigns'}</option>
              <option value="attendance">{isRtl ? 'الحضور' : 'Attendance'}</option>
              <option value="user">{isRtl ? 'تسجيل الدخول' : 'Auth / Login'}</option>
              <option value="other">{isRtl ? 'أخرى' : 'Other'}</option>
            </select>
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="custom-input py-2 text-xs md:w-44"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="custom-card overflow-hidden p-0">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <span className="font-bold text-xs text-gray-900">
            {isRtl ? 'سجلات النشاط' : 'Activity Records'}
          </span>
          <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-lg">
            {filteredLogs.length} {isRtl ? 'سجل' : 'records'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 text-gray-900 border-b border-gray-100 font-bold">
                <th className="p-4 text-start">{isRtl ? 'نوع النشاط' : 'Action Type'}</th>
                <th className="p-4 text-start">{isRtl ? 'المستخدم' : 'Performed By'}</th>
                <th className="p-4 text-start">{isRtl ? 'القسم' : 'Entity'}</th>
                <th className="p-4 text-start">{isRtl ? 'التفاصيل' : 'Details'}</th>
                <th className="p-4 text-start">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{isRtl ? 'التاريخ والوقت' : 'Timestamp'}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-gray-900">{log.actionType}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-gray-700">{log.performedBy}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${entityColors[log.affectedEntity]}`}>
                      {entityIcons[log.affectedEntity]}
                      <span className="capitalize">{log.affectedEntity}</span>
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 max-w-xs truncate">
                    {log.details || '—'}
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-[10px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleString(isRtl ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <TrendingUp className="w-10 h-10 text-gray-200" />
                      <p className="text-xs font-medium">
                        {isRtl ? 'لا توجد سجلات تطابق معايير البحث.' : 'No activity logs match your filters.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
