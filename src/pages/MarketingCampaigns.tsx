import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Campaign } from '../store/useAppStore';
import { Plus, X, Play, Pause } from 'lucide-react';

export const MarketingCampaigns: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { campaigns, addCampaign, updateCampaign, employees } = useAppStore();

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budget: 1000,
    platform: 'Facebook' as Campaign['platform'],
    goal: 'Leads Generation',
    assignee: '',
    status: 'Active' as Campaign['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign(formData);
    setFormOpen(false);
    setFormData({
      name: '',
      budget: 1000,
      platform: 'Facebook',
      goal: 'Leads Generation',
      assignee: employees[0]?.name || '',
      status: 'Active'
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
                <th className="p-4 text-start">{t('assignee')}</th>
                <th className="p-4 text-start">{t('status')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{camp.name}</td>
                  <td className="p-4 text-gray-600 font-medium">{camp.platform}</td>
                  <td className="p-4 font-mono font-bold text-gray-900">{camp.budget.toLocaleString()} ج.م</td>
                  <td className="p-4 text-gray-500">{camp.goal}</td>
                  <td className="p-4 text-gray-600 font-medium">{camp.assignee}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(camp.status)}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100"
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
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                    className="custom-input text-xs"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Snapchat">Snapchat</option>
                  </select>
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
