import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Lead } from '../store/useAppStore';
import { useAppSelector } from '../store';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, Phone } from 'lucide-react';

export const CRMPipeline: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { leads, updateLead } = useAppStore();
  const { user } = useAppSelector((state) => state.auth);

  const stages: Lead['status'][] = [
    'New',
    'Contacted',
    'Follow Up',
    'Meeting',
    'Proposal Sent',
    'Negotiation',
    'Won',
    'Lost'
  ];

  const stageLabels: Record<Lead['status'], string> = {
    'New': isRtl ? 'جديد' : 'New',
    'Contacted': isRtl ? 'تم التواصل' : 'Contacted',
    'Follow Up': isRtl ? 'متابعة' : 'Follow Up',
    'Meeting': isRtl ? 'اجتماع' : 'Meeting',
    'Proposal Sent': isRtl ? 'تقديم عرض' : 'Proposal Sent',
    'Negotiation': isRtl ? 'تفاوض' : 'Negotiation',
    'Won': isRtl ? 'مكتمل ناجح' : 'Won',
    'Lost': isRtl ? 'خسارة' : 'Lost'
  };

  const stageColors: Record<Lead['status'], string> = {
    'New': 'border-t-blue-500 bg-blue-50/20 text-blue-700',
    'Contacted': 'border-t-purple-500 bg-purple-50/20 text-purple-700',
    'Follow Up': 'border-t-indigo-500 bg-indigo-50/20 text-indigo-700',
    'Meeting': 'border-t-yellow-500 bg-yellow-50/20 text-yellow-700',
    'Proposal Sent': 'border-t-orange-500 bg-orange-50/20 text-orange-700',
    'Negotiation': 'border-t-pink-500 bg-pink-50/20 text-pink-700',
    'Won': 'border-t-green-500 bg-green-50/20 text-green-700',
    'Lost': 'border-t-red-500 bg-red-50/20 text-red-700'
  };

  const moveLead = (lead: Lead, direction: 'forward' | 'backward') => {
    const currentIndex = stages.indexOf(lead.status);
    let nextIndex = currentIndex;
    
    if (direction === 'forward' && currentIndex < stages.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'backward' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }
    
    if (nextIndex !== currentIndex) {
      updateLead({
        ...lead,
        status: stages[nextIndex]
      });
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('pipeline')}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {isRtl
            ? 'مخطط كانبان لمراحل المبيعات وتتبع تحركات العملاء من الاتصال إلى إتمام التعاقد.'
            : 'Kanban board for sales workflow and lead progression.'}
        </p>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1600px] h-[calc(100vh-14rem)] items-start">
          {stages.map((stage) => {
            const stageLeads = leads.filter((l) => {
              if (l.status !== stage) return false;
              if (user?.role === 'Employee') {
                return l.assignedTo === 'محمد حسن (Employee)' || l.assignedTo === user.name;
              }
              return true;
            });
            return (
              <div
                key={stage}
                className="w-72 bg-white rounded-2xl border border-gray-100 flex flex-col max-h-full shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Column Header */}
                <div className={`p-4 border-b border-gray-50 flex items-center justify-between rounded-t-2xl border-t-4 ${stageColors[stage]}`}>
                  <span className="font-bold text-xs">{stageLabels[stage]}</span>
                  <span className="text-[10px] font-extrabold bg-white/80 px-2 py-0.5 rounded-full border border-gray-100">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Body - Leads Cards */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1 min-h-[200px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm hover:shadow hover:border-red-100 transition-all duration-200 group relative"
                    >
                      <h4 className="font-bold text-xs text-gray-950 group-hover:text-red-600 transition-colors">
                        <Link to={`/crm/leads/${lead.id}`}>
                          {lead.name}
                        </Link>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{lead.company}</p>
                      
                      <div className="flex items-center gap-1.5 mt-3 text-[10px] font-mono text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-red-600" />
                        <span>{lead.phone}</span>
                      </div>

                      {/* Control buttons to transition stages */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => moveLead(lead, isRtl ? 'forward' : 'backward')}
                          disabled={isRtl ? stages.indexOf(lead.status) === stages.length - 1 : stages.indexOf(lead.status) === 0}
                          className="p-1 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-20 transition-all"
                          title={isRtl ? 'نقل للمرحلة التالية' : 'Move Backward'}
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        
                        <Link
                          to={`/crm/leads/${lead.id}`}
                          className="p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => moveLead(lead, isRtl ? 'backward' : 'forward')}
                          disabled={isRtl ? stages.indexOf(lead.status) === 0 : stages.indexOf(lead.status) === stages.length - 1}
                          className="p-1 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-20 transition-all"
                          title={isRtl ? 'نقل للمرحلة السابقة' : 'Move Forward'}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="py-8 text-center text-[10px] text-gray-400 border border-dashed border-gray-100 rounded-xl">
                      لا يوجد عملاء
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
