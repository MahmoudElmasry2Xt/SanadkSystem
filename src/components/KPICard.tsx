import React from 'react';
import { useTranslation } from 'react-i18next';
import { type KPIMetric } from '../services/dashboardService';
import {
  Users,
  UserPlus,
  UserCheck,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  Target,
  Smile,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';

interface KPICardProps {
  metric: KPIMetric;
}

export const KPICard: React.FC<KPICardProps> = ({ metric }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const title = isRtl ? metric.titleAr : metric.title;
  const description = isRtl ? metric.descriptionAr : metric.description;

  // Select category specific icon
  const getIcon = () => {
    switch (metric.iconName) {
      case 'total_leads':
        return <Users className="h-5 w-5" />;
      case 'new_leads':
        return <UserPlus className="h-5 w-5" />;
      case 'active_leads':
        return <UserCheck className="h-5 w-5" />;
      case 'revenue':
        return <DollarSign className="h-5 w-5" />;
      case 'expenses':
        return <TrendingDown className="h-5 w-5" />;
      case 'net_profit':
        return <TrendingUp className="h-5 w-5" />;
      case 'roi':
        return <Percent className="h-5 w-5" />;
      case 'roas':
        return <Target className="h-5 w-5" />;
      case 'staff_perf':
        return <Smile className="h-5 w-5" />;
      case 'dept_perf':
        return <Layers className="h-5 w-5" />;
      case 'kpi_achievement':
        return <Award className="h-5 w-5" />;
      case 'overdue_tasks':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  // Category Colors
  const getColorStyles = () => {
    switch (metric.color) {
      case 'crm':
        return {
          bgIcon: 'bg-orange-50 text-orange-600',
          accent: 'bg-orange-600'
        };
      case 'finance':
        return {
          bgIcon: 'bg-emerald-50 text-emerald-600',
          accent: 'bg-emerald-600'
        };
      case 'marketing':
        return {
          bgIcon: 'bg-blue-50 text-blue-600',
          accent: 'bg-blue-600'
        };
      case 'performance':
        return {
          bgIcon: 'bg-purple-50 text-purple-600',
          accent: 'bg-purple-600'
        };
      case 'tasks':
        return {
          bgIcon: 'bg-rose-50 text-rose-600',
          accent: 'bg-rose-600'
        };
      default:
        return {
          bgIcon: 'bg-gray-50 text-gray-600',
          accent: 'bg-gray-600'
        };
    }
  };

  const style = getColorStyles();

  // Determine trend badge semantic styling
  // positive is green, negative is red, neutral is gray.
  // Expenses and Overdue Tasks have reversed direction (i.e. 'up' is negative for business).
  const isNegativeMetric = ['expenses', 'overdue_tasks'].includes(metric.id);
  const isUp = metric.trendType === 'up';
  
  const isPositive = isNegativeMetric ? !isUp : isUp;
  
  const trendBadgeStyle = isPositive 
    ? 'bg-green-50 text-green-700' 
    : 'bg-red-50 text-red-700';

  return (
    <div
      className="relative bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Category accent bar on top */}
      <div className={`absolute top-0 inset-x-0 h-[3px] ${style.accent}`} />

      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 block truncate">
            {title}
          </span>
          <h3 className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight truncate">
            {metric.value}
          </h3>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.bgIcon} shrink-0`}>
          {getIcon()}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
        <p className="text-[11px] text-gray-400 leading-snug truncate flex-1">
          {description}
        </p>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${trendBadgeStyle}`}>
          {metric.trendValue}
        </span>
      </div>
    </div>
  );
};

export default KPICard;
