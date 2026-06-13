import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Lead } from '../store/useAppStore';
import { useAppSelector } from '../store';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Upload,
  Eye,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet
} from 'lucide-react';


export const CRMLeads: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { leads, addLead, updateLead, deleteLead, importLeads, assignLead, autoAssignLeads } = useAppStore();
  const { user } = useAppSelector((state) => state.auth);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedGov, setSelectedGov] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // File Import State
  const [importOpen, setImportOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    jobTitle: '',
    source: 'Facebook',
    governorate: 'القاهرة',
    status: 'New' as Lead['status'],
    notes: ''
  });

  const openAddModal = () => {
    setEditingLead(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      company: '',
      jobTitle: '',
      source: 'Facebook',
      governorate: 'القاهرة',
      status: 'New',
      notes: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      company: lead.company,
      jobTitle: lead.jobTitle,
      source: lead.source,
      governorate: lead.governorate,
      status: lead.status,
      notes: lead.notes
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      updateLead({
        ...editingLead,
        ...formData
      });
    } else {
      addLead(formData);
    }
    setModalOpen(false);
  };

  // Mock CSV import
  const handleCsvImport = () => {
    const imported: Omit<Lead, 'id' | 'dateCreated'>[] = [
      { name: 'كريم محمود يسرى', phone: '+20 1000111222', email: 'kareem.yousry@gmail.com', company: 'النساجون الشرقيون', jobTitle: 'مدير تسويق', source: 'Google Ads', governorate: 'الشرقية', status: 'New', notes: 'تم الاستيراد من ملف إكسيل.' },
      { name: 'ميادة عبد العزيز', phone: '+20 1288877766', email: 'mayada.aziz@outlook.com', company: 'جلوبال للتأمين', jobTitle: 'مشرف مبيعات', source: 'TikTok', governorate: 'الجيزة', status: 'Contacted', notes: 'مستوردة عبر ملف إكسيل مبيعات.' }
    ];
    importLeads(imported);
    setImportOpen(false);
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    // If user is Employee (Sales Agent), they only see leads assigned to them.
    // They cannot see unassigned leads.
    if (user?.role === 'Employee') {
      if (lead.assignedTo !== 'محمد حسن (Employee)' && lead.assignedTo !== user.name) {
        return false;
      }
    }

    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = selectedSource ? lead.source === selectedSource : true;
    const matchesGov = selectedGov ? lead.governorate === selectedGov : true;

    return matchesSearch && matchesSource && matchesGov;
  });

  // Extract unique sources and governorates for filters
  const sources = Array.from(new Set(leads.map((l) => l.source)));
  const governorates = Array.from(new Set(leads.map((l) => l.governorate)));

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('leads')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'إدارة وتتبع قائمة العملاء المحتملين وتحديث بيانات الاتصال بهم.' : 'Manage and track prospects and communications.'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['CEO', 'Sales Manager'].includes(user?.role || '') && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  autoAssignLeads(e.target.value as any);
                  e.target.value = '';
                }
              }}
              className="custom-input py-2 text-xs w-44 bg-red-50/10 border-red-200 text-red-700 font-bold"
            >
              <option value="">⚡ {isRtl ? 'توزيع تلقائي للعملاء' : 'Auto-Assign Leads'}</option>
              <option value="workload">{isRtl ? 'حسب ضغط العمل' : 'By Workload'}</option>
              <option value="performance">{isRtl ? 'حسب الكفاءة' : 'By Performance'}</option>
              <option value="location">{isRtl ? 'حسب الموقع الجغرافي' : 'By Location'}</option>
            </select>
          )}

          <button
            onClick={() => setImportOpen(true)}
            className="flex-1 sm:flex-none custom-btn-secondary py-2 text-xs flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('importExcelCsv')}</span>
          </button>
          
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-none custom-btn-primary py-2 text-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addNewLead')}</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="custom-card flex flex-col md:flex-row items-center gap-4 p-4">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute start-3 top-3.5" />
          <input
            type="text"
            placeholder={t('searchLeads')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="custom-input ps-9 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="custom-input py-2 text-xs md:w-40"
          >
            <option value="">{t('allSources')}</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={selectedGov}
            onChange={(e) => setSelectedGov(e.target.value)}
            className="custom-input py-2 text-xs md:w-40"
          >
            <option value="">{t('allGovernorates')}</option>
            {governorates.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="custom-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 text-gray-900 border-b border-gray-100 font-bold">
                <th className="p-4 text-start">{t('leadName')}</th>
                <th className="p-4 text-start">{t('company')}</th>
                <th className="p-4 text-start">{t('phone')}</th>
                <th className="p-4 text-start">{t('source')}</th>
                <th className="p-4 text-start">{t('governorate')}</th>
                <th className="p-4 text-start">{isRtl ? 'المسؤول' : 'Assigned Agent'}</th>
                <th className="p-4 text-start">{t('status')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">
                    <Link to={`/crm/leads/${lead.id}`} className="hover:text-red-600 hover:underline">
                      {lead.name}
                    </Link>
                    <span className="block text-[10px] text-gray-400 font-normal mt-0.5">{lead.jobTitle}</span>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{lead.company}</td>
                  <td className="p-4 text-gray-600 font-mono">{lead.phone}</td>
                  <td className="p-4 text-gray-600">{lead.source}</td>
                  <td className="p-4 text-gray-600">{lead.governorate}</td>
                  <td className="p-4">
                    {['CEO', 'Sales Manager'].includes(user?.role || '') ? (
                      <select
                        value={lead.assignedTo || ''}
                        onChange={(e) => assignLead(lead.id, e.target.value)}
                        className="custom-input py-1 px-2 text-[11px] w-40"
                      >
                        <option value="">⚠️ {isRtl ? 'غير معين (مدير المبيعات)' : 'Unassigned (Sales Manager)'}</option>
                        <option value="محمد حسن (Employee)">محمد حسن (Employee)</option>
                        <option value="محمود عبد السلام">محمود عبد السلام</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.assignedTo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {lead.assignedTo || (isRtl ? 'غير معين' : 'Unassigned')}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lead.status === 'New' ? 'bg-blue-50 text-blue-600' :
                      lead.status === 'Contacted' ? 'bg-purple-50 text-purple-600' :
                      lead.status === 'Proposal Sent' ? 'bg-orange-50 text-orange-600' :
                      lead.status === 'Won' ? 'bg-green-50 text-green-600' :
                      lead.status === 'Lost' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        to={`/crm/leads/${lead.id}`}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title={t('viewDetails')}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openEditModal(lead)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title={t('edit')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    {isRtl ? 'لا يوجد عملاء يطابقون خيارات البحث والفلترة.' : 'No leads matching query found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {importOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setImportOpen(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setImportOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-red-600" />
              <span>{t('importExcelCsv')}</span>
            </h3>
            
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 flex flex-col items-center justify-center gap-3">
              <Upload className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-xs font-bold text-gray-900">{isRtl ? 'اسحب الملف هنا أو انقر للتصفح' : 'Drag file here or click to browse'}</p>
                <p className="text-[10px] text-gray-400 mt-1">يدعم امتدادات .xlsx, .csv فقط</p>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button
                onClick={handleCsvImport}
                className="flex-1 custom-btn-primary py-2 text-xs"
              >
                {isRtl ? 'تحميل واستيراد البيانات تجريبياً' : 'Process Demo Data'}
              </button>
              <button
                onClick={() => setImportOpen(false)}
                className="flex-1 custom-btn-secondary py-2 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Lead Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-full max-w-lg p-6 z-10 shadow-2xl relative border border-gray-100 overflow-y-auto max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-black text-gray-900 text-sm mb-6">
              {editingLead ? t('editLead') : t('addNewLead')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('leadName')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="custom-input text-xs"
                  placeholder={isRtl ? 'أدخل اسم العميل ثلاثي' : 'e.g. John Doe'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('phone')}</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="custom-input text-xs font-mono"
                    placeholder="+20 1000..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('email')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="custom-input text-xs font-mono"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('company')}</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('jobTitle')}</label>
                  <input
                    type="text"
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('source')}</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="WhatsApp Campaign">WhatsApp Campaign</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Snapchat">Snapchat</option>
                    <option value="Direct Contact">Direct Contact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('governorate')}</label>
                  <input
                    type="text"
                    required
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('status')}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Lead['status'] })}
                    className="custom-input text-xs"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="custom-input text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button
                type="submit"
                className="flex-1 custom-btn-primary py-2.5 text-xs"
              >
                {t('save')}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
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
