import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Campaign } from '../store/useAppStore';
import { useAppSelector } from '../store';
import { Plus, X, Play, Pause, Edit2, Eye, Search, Check, ChevronDown, BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  placeholder?: string;
}> = ({ selected, onChange, isRtl, placeholder }) => {
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
            <span className="text-gray-400">{placeholder || (isRtl ? 'اختر المنصات...' : 'Select platforms...')}</span>
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

export const MarketingCampaigns: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { campaigns, addCampaign, updateCampaign, employees } = useAppStore();
  const { user } = useAppSelector((state) => state.auth);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budget: 1000,
    platform: ['Facebook'] as string[],
    goal: 'Leads Generation',
    assignee: '',
    status: 'Active' as Campaign['status'],
    roas: 1.0,
    roi: 0,
    viewAttendance: 1000
  });

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
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

  const canEditCampaign = (campaign: Campaign) => {
    if (!user) return false;
    const adminRoles = ['CEO', 'General Manager', 'Marketing Manager'];
    if (adminRoles.includes(user.role)) return true;
    return campaign.assignee === user.name;
  };

  const openEditModal = (camp: Campaign) => {
    setEditingCampaign(camp);
    setEditData({
      name: camp.name,
      budget: camp.budget,
      platform: camp.platform || [],
      goal: camp.goal,
      assignee: camp.assignee,
      status: camp.status,
      description: camp.description || '',
      notes: camp.notes || '',
      roas: camp.roas || 0.0,
      roi: camp.roi || 0,
      viewAttendance: camp.viewAttendance || 0
    });
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    
    updateCampaign({
      ...editingCampaign,
      ...editData
    });
    toast.success(isRtl ? 'تم تحديث الحملة بنجاح' : 'Campaign updated successfully');
    setEditOpen(false);
    setEditingCampaign(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign(formData);
    toast.success(isRtl ? 'تم إطلاق الحملة بنجاح' : 'Campaign launched successfully');
    setFormOpen(false);
    setFormData({
      name: '',
      budget: 1000,
      platform: ['Facebook'],
      goal: 'Leads Generation',
      assignee: employees[0]?.name || '',
      status: 'Active',
      roas: 1.0,
      roi: 0,
      viewAttendance: 1000
    });
  };

  const toggleCampaignStatus = (campaign: Campaign) => {
    const nextStatus: Campaign['status'] =
      campaign.status === 'Active' ? 'Paused' :
      campaign.status === 'Paused' ? 'Active' : 'Completed';

    updateCampaign({
      ...campaign,
      status: nextStatus
    });
    toast.success(isRtl ? 'تم تحديث حالة الحملة' : 'Campaign status updated');
  };

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

  // Filter Campaigns
  const filteredCampaigns = campaigns.filter(camp => {
    const matchesSearch = searchQuery.trim() === '' ||
      camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = selectedPlatforms.length === 0 ||
      selectedPlatforms.some(p => camp.platform.includes(p));

    const matchesStatus = selectedStatus === 'All' || camp.status === selectedStatus;

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Dynamic Metrics aggregation for the search result (Adjacent to Search and Filters)
  const avgRoas = filteredCampaigns.length > 0
    ? filteredCampaigns.reduce((sum, c) => sum + (c.roas || 0), 0) / filteredCampaigns.length
    : 0;

  const avgRoi = filteredCampaigns.length > 0
    ? filteredCampaigns.reduce((sum, c) => sum + (c.roi || 0), 0) / filteredCampaigns.length
    : 0;

  const totalViews = filteredCampaigns.reduce((sum, c) => sum + (c.viewAttendance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('campaigns')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'إدارة وتمويل وتعيين المسؤولين عن الحملات الإعلانية على مختلف المنصات.' : 'Launch and manage advertising campaigns.'}
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
          <span>{isRtl ? 'إطلاق حملة جديدة' : 'Create Campaign'}</span>
        </button>
      </div>

      {/* Grid containing Neon Search and Filters and adjacent Stats summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Prominent Neon Glow Search & Filter Component */}
        <div className="lg:col-span-2 neon-glow-border rounded-2xl p-6 bg-white flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-gray-900 tracking-wide uppercase">
              {isRtl ? 'أدوات البحث والتصفية المتقدمة' : 'Advanced Search & Filters'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search input */}
              <div className="relative md:col-span-6">
                <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRtl ? 'ابحث بالاسم، الهدف، أو المسؤول...' : 'Search by name, goal, or assignee...'}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl ps-9 pe-9 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-1 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Multi-Platform Select Dropdown */}
              <div className="md:col-span-3">
                <MultiSelectDropdown
                  selected={selectedPlatforms}
                  onChange={setSelectedPlatforms}
                  isRtl={isRtl}
                  placeholder={isRtl ? 'تصفية بالمنصة' : 'Filter by Platform'}
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="custom-input text-xs min-h-[38px] py-2"
                >
                  <option value="All">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Aggregated Metrics (Adjacent to controls) */}
        <div className="custom-card border-t-4 border-t-red-600 flex flex-col justify-between p-5">
          <span className="font-bold text-xs text-gray-900 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-red-600" />
            {isRtl ? 'ملخص البيانات الحالية' : 'Filtered Stats Summary'}
          </span>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
            <div className="p-2.5 bg-gray-50/50 border border-gray-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] text-gray-400 font-bold uppercase">{isRtl ? 'متوسط ROAS' : 'Avg ROAS'}</span>
                <p className="text-xs font-black text-gray-900 mt-0.5">{avgRoas.toFixed(2)}x</p>
              </div>
              <TrendingUp className="w-4 h-4 text-red-500 shrink-0" />
            </div>

            <div className="p-2.5 bg-gray-50/50 border border-gray-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] text-gray-400 font-bold uppercase">{isRtl ? 'متوسط ROI' : 'Avg ROI'}</span>
                <p className="text-xs font-black text-gray-900 mt-0.5">{avgRoi.toFixed(0)}%</p>
              </div>
              <DollarSign className="w-4 h-4 text-red-500 shrink-0" />
            </div>

            <div className="p-2.5 bg-gray-50/50 border border-gray-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] text-gray-400 font-bold uppercase">{isRtl ? 'المشاهدات / الحضور' : 'Total Views'}</span>
                <p className="text-xs font-black text-gray-900 mt-0.5">{totalViews.toLocaleString()}</p>
              </div>
              <Users className="w-4 h-4 text-red-500 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Ledger */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <span className="font-bold text-xs text-gray-900">{isRtl ? 'الحملات الإعلانية النشطة والمكتملة' : 'Ad Campaigns Ledger'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{isRtl ? 'اسم الحملة' : 'Campaign Name'}</th>
                <th className="p-4 text-start">{isRtl ? 'المنصة' : 'Platform'}</th>
                <th className="p-4 text-start">{t('budget')}</th>
                <th className="p-4 text-start">{isRtl ? 'الهدف الرئيسي' : 'Campaign Goal'}</th>
                <th className="p-4 text-start">ROAS</th>
                <th className="p-4 text-start">ROI</th>
                <th className="p-4 text-start">{isRtl ? 'المشاهدات' : 'Views'}</th>
                <th className="p-4 text-start">{t('assignee')}</th>
                <th className="p-4 text-start">{t('status')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">
                    {camp.name}
                    {camp.description && (
                      <span className="block text-[10px] text-gray-400 font-normal mt-0.5 truncate max-w-[160px]">{camp.description}</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    <div className="flex flex-wrap gap-1">
                      {camp.platform.map(plat => (
                        <span key={plat} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlatformColor(plat)}`}>
                          {plat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-gray-900">{camp.budget.toLocaleString()} ج.م</td>
                  <td className="p-4 text-gray-500">{camp.goal}</td>
                  <td className="p-4 font-mono font-bold text-gray-900">{camp.roas ? `${camp.roas}x` : '0x'}</td>
                  <td className="p-4 font-mono font-bold text-gray-900">{camp.roi ? `${camp.roi}%` : '0%'}</td>
                  <td className="p-4 font-mono text-gray-500">{camp.viewAttendance?.toLocaleString() || '0'}</td>
                  <td className="p-4 text-gray-600 font-medium">{camp.assignee}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(camp.status)}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        to={`/marketing/campaigns/${camp.id}`}
                        className="p-1 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 border border-gray-100 transition-colors"
                        title={isRtl ? 'عرض التفاصيل' : 'View Details'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      {canEditCampaign(camp) && (
                        <button
                          onClick={() => openEditModal(camp)}
                          className="p-1 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 border border-gray-100 transition-colors"
                          title={isRtl ? 'تعديل الحملة' : 'Edit Campaign'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleCampaignStatus(camp)}
                        className="p-1 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 border border-gray-100 transition-colors"
                        title={camp.status === 'Active' ? 'Pause Campaign' : 'Activate Campaign'}
                      >
                        {camp.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-gray-400 text-xs">
                    {isRtl ? 'لا توجد حملات إعلانية مطابقة للبحث.' : 'No campaigns match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Campaign Modal */}
      {editOpen && editingCampaign && (
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

      {/* Add Campaign Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100 overflow-y-auto max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-gray-900 text-sm mb-6">{isRtl ? 'إطلاق حملة إعلانية جديدة' : 'Launch New Campaign'}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'اسم الحملة' : 'Campaign Name'}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="custom-input text-xs"
                  placeholder="حملة ترويج نظام الـ CRM..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'المنصة' : 'Platform'}</label>
                  <MultiSelectDropdown
                    selected={formData.platform}
                    onChange={(platforms) => setFormData({ ...formData, platform: platforms })}
                    isRtl={isRtl}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('budget')}</label>
                  <input
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
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
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="custom-input text-xs"
                    placeholder="Leads Generation"
                  />
                </div>
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
              </div>

              {/* ROAS, ROI, View Attendance New Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'ROAS' : 'ROAS'}</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.roas}
                    onChange={(e) => setFormData({ ...formData, roas: parseFloat(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono"
                    placeholder="e.g. 3.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'ROI (%)' : 'ROI (%)'}</label>
                  <input
                    type="number"
                    required
                    value={formData.roi}
                    onChange={(e) => setFormData({ ...formData, roi: parseInt(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono"
                    placeholder="e.g. 150"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'المشاهدات' : 'Views'}</label>
                  <input
                    type="number"
                    required
                    value={formData.viewAttendance}
                    onChange={(e) => setFormData({ ...formData, viewAttendance: parseInt(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono"
                    placeholder="e.g. 5000"
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
