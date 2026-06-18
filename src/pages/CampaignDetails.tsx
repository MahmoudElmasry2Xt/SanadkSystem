import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Campaign } from '../store/useAppStore';
import {
  ArrowLeft,
  Eye,
  Users,
  MousePointerClick,
  DollarSign,
  Target,
  Download,
  Upload,
  Megaphone,
  BarChart3,
  FileText,
  TrendingUp,
  Edit2,
  X,
  Check,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

// Platform Colors helper
const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Facebook':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Instagram':
      return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Google Ads':
      return 'bg-red-50 text-red-600 border-red-100';
    case 'TikTok':
      return 'bg-pink-50 text-pink-600 border-pink-100';
    case 'Snapchat':
      return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

// Custom Multi-Select Dropdown for Platforms
const MultiSelectDropdown: React.FC<{
  selected: string[];
  onChange: (platforms: string[]) => void;
  isRtl: boolean;
}> = ({ selected, onChange, isRtl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const platforms = ['Facebook', 'Instagram', 'Google Ads', 'TikTok', 'Snapchat'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePlatform = (plat: string) => {
    if (selected.includes(plat)) {
      onChange(selected.filter(p => p !== plat));
    } else {
      onChange([...selected, plat]);
    }
  };

  return (
    <div className="relative w-full text-start" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="custom-input text-xs flex items-center justify-between min-h-[38px] w-full text-start py-2"
      >
        <div className="flex flex-wrap gap-1 max-w-[90%]">
          {selected.length === 0 ? (
            <span className="text-gray-400">{isRtl ? 'اختر المنصات...' : 'Select platforms...'}</span>
          ) : (
            selected.map(plat => (
              <span key={plat} className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPlatformColor(plat)}`}>
                {plat}
              </span>
            ))
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      </button>
      {isOpen && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-100 shadow-xl rounded-xl p-2 space-y-0.5">
          {platforms.map(plat => {
            const isChecked = selected.includes(plat);
            return (
              <label
                key={plat}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer text-xs text-gray-700 font-medium transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => togglePlatform(plat)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                />
                <span>{plat}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-red-600 ms-auto" />}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { campaigns, updateCampaign, employees } = useAppStore();
  const campaign = campaigns.find((c) => c.id === id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    budget: 1000,
    platform: [] as string[],
    goal: '',
    assignee: '',
    status: 'Active' as Campaign['status'],
    description: '',
    notes: '',
    roas: 0.0,
    roi: 0,
    viewAttendance: 0
  });

  if (!campaign) {
    return (
      <div className="text-center py-16">
        <h3 className="text-sm font-bold text-gray-900">
          {isRtl ? 'الحملة غير موجودة' : 'Campaign not found'}
        </h3>
        <Link to="/marketing/campaigns" className="text-red-600 hover:underline text-xs mt-2 inline-block">
          {isRtl ? 'العودة لقائمة الحملات' : 'Back to campaigns'}
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-600 border border-green-100';
      case 'Paused':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      case 'Completed':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  const openEditModal = () => {
    setEditData({
      name: campaign.name,
      budget: campaign.budget,
      platform: campaign.platform || [],
      goal: campaign.goal,
      assignee: campaign.assignee,
      status: campaign.status,
      description: campaign.description || '',
      notes: campaign.notes || '',
      roas: campaign.roas || 0.0,
      roi: campaign.roi || 0,
      viewAttendance: campaign.viewAttendance || 0
    });
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCampaign({
      ...campaign,
      ...editData
    });
    toast.success(isRtl ? 'تم تحديث الحملة بنجاح' : 'Campaign updated successfully');
    setEditOpen(false);
  };

  // Calculate performance metrics
  const ctr = campaign.reach > 0 ? ((campaign.clicks / campaign.reach) * 100).toFixed(2) : '0.00';
  const costPerLead = campaign.leads > 0 ? (campaign.budget / campaign.leads).toFixed(0) : '0';
  const displayRoi = campaign.roi !== undefined && campaign.roi !== 0
    ? campaign.roi.toString()
    : (campaign.budget > 0 ? (((campaign.revenueGenerated - campaign.budget) / campaign.budget) * 100).toFixed(0) : '0');

  // Export campaign data as CSV
  const handleExport = () => {
    const headers = [
      'ID', 'Name', 'Platform', 'Budget', 'Goal', 'Status', 'Assignee',
      'Reach', 'Clicks', 'Leads', 'Revenue Generated', 'Description', 'Notes',
      'ROAS', 'ROI', 'View Attendance'
    ];

    const allCampaigns = campaigns;
    const rows = allCampaigns.map((c) => [
      c.id,
      c.name,
      c.platform.join('; '),
      c.budget.toString(),
      c.goal,
      c.status,
      c.assignee,
      c.reach.toString(),
      c.clicks.toString(),
      c.leads.toString(),
      c.revenueGenerated.toString(),
      c.description || '',
      c.notes || '',
      (c.roas || 0).toString(),
      (c.roi || 0).toString(),
      (c.viewAttendance || 0).toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campaigns_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(isRtl ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully');
  };

  // Import campaigns from CSV
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          toast.error(isRtl ? 'الملف فارغ أو غير صالح' : 'File is empty or invalid');
          return;
        }

        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (!values || values.length < 7) continue;

          const clean = values.map((v) => v.replace(/^"|"$/g, '').replace(/""/g, '"'));

          const existingCampaign = campaigns.find((c) => c.id === clean[0]);
          if (existingCampaign) {
            const platformVal = clean[2] ? clean[2].split(';').map(p => p.trim()) : existingCampaign.platform;

            updateCampaign({
              ...existingCampaign,
              name: clean[1] || existingCampaign.name,
              platform: platformVal,
              budget: parseInt(clean[3]) || existingCampaign.budget,
              goal: clean[4] || existingCampaign.goal,
              status: (clean[5] as Campaign['status']) || existingCampaign.status,
              assignee: clean[6] || existingCampaign.assignee,
              reach: parseInt(clean[7]) || existingCampaign.reach,
              clicks: parseInt(clean[8]) || existingCampaign.clicks,
              leads: parseInt(clean[9]) || existingCampaign.leads,
              revenueGenerated: parseInt(clean[10]) || existingCampaign.revenueGenerated,
              description: clean[11] || existingCampaign.description,
              notes: clean[12] || existingCampaign.notes,
              roas: clean[13] ? parseFloat(clean[13]) : existingCampaign.roas,
              roi: clean[14] ? parseInt(clean[14]) : existingCampaign.roi,
              viewAttendance: clean[15] ? parseInt(clean[15]) : existingCampaign.viewAttendance
            });
            importedCount++;
          }
        }

        toast.success(
          isRtl
            ? `تم تحديث ${importedCount} حملة بنجاح`
            : `Successfully updated ${importedCount} campaigns`
        );
      } catch {
        toast.error(isRtl ? 'خطأ في قراءة الملف' : 'Error reading file');
      }
    };
    reader.readAsText(file, 'UTF-8');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const kpiCards = [
    {
      label: isRtl ? 'الوصول' : 'Reach',
      value: campaign.reach.toLocaleString(),
      icon: Eye,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      label: isRtl ? 'النقرات' : 'Clicks',
      value: campaign.clicks.toLocaleString(),
      icon: MousePointerClick,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100'
    },
    {
      label: isRtl ? 'العملاء المحتملين' : 'Leads',
      value: campaign.leads.toLocaleString(),
      icon: Users,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      label: isRtl ? 'الإيرادات' : 'Revenue',
      value: `${campaign.revenueGenerated.toLocaleString()} ${isRtl ? 'ج.م' : 'EGP'}`,
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100'
    },
    {
      label: isRtl ? 'عائد الإعلانات ROAS' : 'ROAS',
      value: `${campaign.roas !== undefined ? campaign.roas : '0'}x`,
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600',
      iconBg: 'bg-indigo-100'
    },
    {
      label: isRtl ? 'عائد الاستثمار ROI' : 'ROI',
      value: `${displayRoi}%`,
      icon: BarChart3,
      color: 'bg-teal-50 text-teal-600',
      iconBg: 'bg-teal-100'
    },
    {
      label: isRtl ? 'المشاهدات / الحضور' : 'View Attendance',
      value: (campaign.viewAttendance || 0).toLocaleString(),
      icon: Users,
      color: 'bg-rose-50 text-rose-600',
      iconBg: 'bg-rose-100'
    }
  ];

  const performanceMetrics = [
    {
      label: isRtl ? 'معدل النقر (CTR)' : 'Click-Through Rate (CTR)',
      value: `${ctr}%`,
      description: isRtl ? 'نسبة النقرات من إجمالي الوصول' : 'Percentage of clicks from total reach'
    },
    {
      label: isRtl ? 'تكلفة العميل المحتمل' : 'Cost Per Lead (CPL)',
      value: `${parseInt(costPerLead).toLocaleString()} ${isRtl ? 'ج.م' : 'EGP'}`,
      description: isRtl ? 'متوسط التكلفة لكل عميل محتمل' : 'Average cost for each acquired lead'
    },
    {
      label: isRtl ? 'العائد على الاستثمار (ROI)' : 'Return on Investment (ROI)',
      value: `${displayRoi}%`,
      description: isRtl ? 'نسبة العائد مقارنة بالتكلفة' : 'Return percentage compared to cost'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with back navigation and edit controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/marketing/campaigns"
            className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-950 m-0">{campaign.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {campaign.platform.map(plat => (
                <span key={plat} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPlatformColor(plat)}`}>
                  {plat}
                </span>
              ))}
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Edit, Export, Import */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openEditModal}
            className="custom-btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تعديل الحملة' : 'Edit Campaign'}</span>
          </button>

          <button
            onClick={handleExport}
            className="custom-btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 border border-red-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تصدير Excel' : 'Export Excel'}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="custom-btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 border border-gray-200"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استيراد Excel' : 'Import Excel'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className="custom-card flex flex-col justify-between hover:shadow-md transition-shadow p-4 min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{card.label}</span>
              <div className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                <card.icon className={`w-4 h-4 ${card.color.split(' ')[1]}`} />
              </div>
            </div>
            <p className="text-base font-black text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campaign Info Card */}
        <div className="space-y-6">
          <div className="custom-card-red-border">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-50">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl mb-3 shadow-inner">
                <Megaphone className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">{campaign.name}</h3>
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {campaign.platform.map(plat => (
                  <span key={plat} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-md px-1.5 py-0.5">
                    {plat}
                  </span>
                ))}
              </div>

              <span className={`mt-4 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>

            {/* Quick Details */}
            <div className="py-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600">{isRtl ? 'الهدف' : 'Goal'}: {campaign.goal}</span>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600 font-mono">{isRtl ? 'الميزانية' : 'Budget'}: {campaign.budget.toLocaleString()} {isRtl ? 'ج.م' : 'EGP'}</span>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-gray-600">{t('assignee')}: {campaign.assignee}</span>
              </div>
            </div>
          </div>

          {/* Description & Notes */}
          {(campaign.description || campaign.notes) && (
            <div className="custom-card">
              {campaign.description && (
                <div className="mb-4">
                  <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-red-600" />
                    {isRtl ? 'وصف الحملة' : 'Description'}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {campaign.description}
                  </p>
                </div>
              )}
              {campaign.notes && (
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-2">{t('notes')}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {campaign.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Performance Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Performance Metrics */}
          <div className="custom-card">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-sm text-gray-900">
                {isRtl ? 'مقاييس الأداء التفصيلية' : 'Detailed Performance Metrics'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {performanceMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:border-red-100 transition-colors"
                >
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{metric.label}</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{metric.value}</p>
                  <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary Table */}
          <div className="custom-card">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-sm text-gray-900">
                {isRtl ? 'ملخص أداء الحملة' : 'Campaign Performance Summary'}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-xs">
                <thead>
                  <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                    <th className="p-3 text-start">{isRtl ? 'المقياس' : 'Metric'}</th>
                    <th className="p-3 text-start">{isRtl ? 'القيمة' : 'Value'}</th>
                    <th className="p-3 text-start">{isRtl ? 'التقييم' : 'Assessment'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{isRtl ? 'إجمالي الوصول' : 'Total Reach'}</td>
                    <td className="p-3 font-mono text-gray-700">{campaign.reach.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${campaign.reach > 50000 ? 'bg-green-50 text-green-600' : campaign.reach > 20000 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                        {campaign.reach > 50000 ? (isRtl ? 'ممتاز' : 'Excellent') : campaign.reach > 20000 ? (isRtl ? 'جيد' : 'Good') : (isRtl ? 'يحتاج تحسين' : 'Needs Improvement')}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{isRtl ? 'إجمالي النقرات' : 'Total Clicks'}</td>
                    <td className="p-3 font-mono text-gray-700">{campaign.clicks.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${campaign.clicks > 5000 ? 'bg-green-50 text-green-600' : campaign.clicks > 2000 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                        {campaign.clicks > 5000 ? (isRtl ? 'ممتاز' : 'Excellent') : campaign.clicks > 2000 ? (isRtl ? 'جيد' : 'Good') : (isRtl ? 'يحتاج تحسين' : 'Needs Improvement')}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{isRtl ? 'معدل النقر (CTR)' : 'Click-Through Rate'}</td>
                    <td className="p-3 font-mono text-gray-700">{ctr}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parseFloat(ctr) > 3 ? 'bg-green-50 text-green-600' : parseFloat(ctr) > 1 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                        {parseFloat(ctr) > 3 ? (isRtl ? 'ممتاز' : 'Excellent') : parseFloat(ctr) > 1 ? (isRtl ? 'جيد' : 'Good') : (isRtl ? 'يحتاج تحسين' : 'Needs Improvement')}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{isRtl ? 'تكلفة العميل المحتمل' : 'Cost Per Lead'}</td>
                    <td className="p-3 font-mono text-gray-700">{parseInt(costPerLead).toLocaleString()} {isRtl ? 'ج.م' : 'EGP'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parseInt(costPerLead) < 30 ? 'bg-green-50 text-green-600' : parseInt(costPerLead) < 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                        {parseInt(costPerLead) < 30 ? (isRtl ? 'ممتاز' : 'Excellent') : parseInt(costPerLead) < 60 ? (isRtl ? 'جيد' : 'Good') : (isRtl ? 'مرتفع' : 'High')}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{isRtl ? 'العائد على الاستثمار' : 'ROI'}</td>
                    <td className="p-3 font-mono text-gray-700">{displayRoi}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parseInt(displayRoi) > 200 ? 'bg-green-50 text-green-600' : parseInt(displayRoi) > 50 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                        {parseInt(displayRoi) > 200 ? (isRtl ? 'ممتاز' : 'Excellent') : parseInt(displayRoi) > 50 ? (isRtl ? 'جيد' : 'Good') : (isRtl ? 'يحتاج تحسين' : 'Needs Improvement')}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 bg-red-50/20">
                    <td className="p-3 font-black text-gray-900">{isRtl ? 'الإيرادات المحققة' : 'Revenue Generated'}</td>
                    <td className="p-3 font-mono font-bold text-red-600">{campaign.revenueGenerated.toLocaleString()} {isRtl ? 'ج.م' : 'EGP'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${campaign.revenueGenerated > campaign.budget * 3 ? 'bg-green-50 text-green-600' : campaign.revenueGenerated > campaign.budget ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                        {campaign.revenueGenerated > campaign.budget * 3 ? (isRtl ? 'ممتاز' : 'Excellent') : campaign.revenueGenerated > campaign.budget ? (isRtl ? 'جيد' : 'Good') : (isRtl ? 'خسارة' : 'Loss')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Campaign Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-2xl w-full max-w-lg p-6 z-10 shadow-2xl relative border border-gray-100 overflow-y-auto max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-gray-900 text-sm mb-6">
              {isRtl ? 'تعديل الحملة الإعلانية' : 'Edit Campaign'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'اسم الحملة' : 'Campaign Name'}</label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="custom-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'المنصة' : 'Platform'}</label>
                  <MultiSelectDropdown
                    selected={editData.platform}
                    onChange={(platforms) => setEditData({ ...editData, platform: platforms })}
                    isRtl={isRtl}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('budget')}</label>
                  <input
                    type="number"
                    required
                    value={editData.budget}
                    onChange={(e) => setEditData({ ...editData, budget: parseInt(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'الهدف الرئيسي' : 'Goal'}</label>
                  <input
                    type="text"
                    required
                    value={editData.goal}
                    onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('assignee')}</label>
                  <select
                    value={editData.assignee}
                    onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                    className="custom-input text-xs"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ROAS, ROI, View Attendance New Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'عائد الإعلانات ROAS' : 'ROAS'}</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editData.roas}
                    onChange={(e) => setEditData({ ...editData, roas: parseFloat(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'عائد الاستثمار ROI (%)' : 'ROI (%)'}</label>
                  <input
                    type="number"
                    required
                    value={editData.roi}
                    onChange={(e) => setEditData({ ...editData, roi: parseInt(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'الحضور / المشاهدات' : 'View Attendance'}</label>
                  <input
                    type="number"
                    required
                    value={editData.viewAttendance}
                    onChange={(e) => setEditData({ ...editData, viewAttendance: parseInt(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('status')}</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as Campaign['status'] })}
                  className="custom-input text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'وصف الحملة' : 'Description'}</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={2}
                  className="custom-input text-xs"
                  placeholder={isRtl ? 'وصف مختصر...' : 'Brief description...'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('notes')}</label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows={2}
                  className="custom-input text-xs"
                  placeholder={isRtl ? 'ملاحظات إضافية...' : 'Additional notes...'}
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {t('save')}
              </button>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
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
