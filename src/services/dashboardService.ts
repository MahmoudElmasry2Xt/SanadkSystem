export interface KPIMetric {
  id: string;
  title: string;
  titleAr: string;
  value: string;
  description: string;
  descriptionAr: string;
  trendType: 'up' | 'down';
  trendValue: string;
  color: 'crm' | 'finance' | 'marketing' | 'performance' | 'tasks';
  iconName: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface LeadsByGovernorate {
  name: string;
  count: number;
}

export interface FunnelData {
  stage: string;
  value: number;
}

export interface RevExpData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ProfitData {
  month: string;
  profit: number;
}

export interface EmployeeRank {
  name: string;
  department: string;
  score: number;
  avatar: string;
}

export interface DepartmentRank {
  department: string;
  score: number;
}

export interface KpiAchievementTrend {
  month: string;
  rate: number;
}

export interface MarketingRoiData {
  campaign: string;
  budget: number;
  roi: number;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  actionAr: string;
  time: string;
}

export interface DashboardData {
  metrics: KPIMetric[];
  leadsBySource: ChartDataPoint[];
  leadsByGovernorate: LeadsByGovernorate[];
  pipelineFunnel: FunnelData[];
  revenueVsExpenses: RevExpData[];
  monthlyProfitTrend: ProfitData[];
  employeePerformance: EmployeeRank[];
  departmentPerformance: DepartmentRank[];
  kpiAchievementTrend: KpiAchievementTrend[];
  marketingROI: MarketingRoiData[];
  topEmployees: EmployeeRank[];
  topDepartments: { name: string; performance: string; tasksCompleted: number }[];
  recentActivities: RecentActivity[];
}

export const getDashboardData = (filter: string): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Base multipliers to simulate data variations per filter
      let multiplier = 1.0;
      let suffix = 'This Month';

      switch (filter) {
        case 'Today':
          multiplier = 0.05;
          suffix = 'Today';
          break;
        case 'This Week':
          multiplier = 0.25;
          suffix = 'This Week';
          break;
        case 'This Month':
          multiplier = 1.0;
          suffix = 'This Month';
          break;
        case 'This Quarter':
          multiplier = 2.8;
          suffix = 'This Quarter';
          break;
        case 'This Year':
          multiplier = 11.5;
          suffix = 'This Year';
          break;
        default:
          multiplier = 1.0;
          suffix = 'Selected Period';
      }

      const formattedVal = (val: number, isCurrency = false): string => {
        if (isCurrency) {
          if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
          if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
          return `$${val}`;
        }
        return val.toLocaleString();
      };

      const metrics: KPIMetric[] = [
        {
          id: 'total_leads',
          title: 'Total Leads',
          titleAr: 'إجمالي العملاء المهتمين',
          value: formattedVal(Math.round(1240 * multiplier)),
          description: 'Total leads in the CRM system.',
          descriptionAr: 'إجمالي العملاء المسجلين بنظام المبيعات.',
          trendType: 'up',
          trendValue: `↑ +${(12.5 * (multiplier > 1 ? 1 : 0.8)).toFixed(1)}% ${suffix}`,
          color: 'crm',
          iconName: 'total_leads'
        },
        {
          id: 'new_leads',
          title: 'New Leads',
          titleAr: 'عملاء جدد',
          value: formattedVal(Math.round(850 * multiplier)),
          description: 'Leads created during the selected period.',
          descriptionAr: 'العملاء المهتمين الجدد خلال الفترة المحددة.',
          trendType: 'up',
          trendValue: `↑ +${(8.4 * multiplier).toFixed(1)}% ${suffix}`,
          color: 'crm',
          iconName: 'new_leads'
        },
        {
          id: 'active_leads',
          title: 'Active Leads',
          titleAr: 'عملاء نشطين',
          value: formattedVal(Math.round(390 * multiplier)),
          description: 'Leads currently active in the pipeline.',
          descriptionAr: 'العملاء النشطين بمراحل الإقناع حالياً.',
          trendType: 'up',
          trendValue: `↑ +${(5.2 * multiplier).toFixed(1)}% ${suffix}`,
          color: 'crm',
          iconName: 'active_leads'
        },
        {
          id: 'revenue',
          title: 'Revenue',
          titleAr: 'الإيرادات',
          value: formattedVal(Math.round(1200000 * multiplier), true),
          description: 'Total revenue generated.',
          descriptionAr: 'إجمالي التدفقات النقدية الواردة للشركة.',
          trendType: 'up',
          trendValue: `↑ +${(14.2 * (multiplier > 1 ? 0.9 : 1.1)).toFixed(1)}% ${suffix}`,
          color: 'finance',
          iconName: 'revenue'
        },
        {
          id: 'expenses',
          title: 'Expenses',
          titleAr: 'المصروفات',
          value: formattedVal(Math.round(720000 * multiplier), true),
          description: 'Total expenses recorded.',
          descriptionAr: 'إجمالي التكاليف والمصروفات المسجلة.',
          trendType: 'down',
          trendValue: `↓ -${(2.4 * multiplier).toFixed(1)}% ${suffix}`,
          color: 'finance',
          iconName: 'expenses'
        },
        {
          id: 'net_profit',
          title: 'Net Profit',
          titleAr: 'صافي الأرباح',
          value: formattedVal(Math.round(480000 * multiplier), true),
          description: 'Revenue minus expenses.',
          descriptionAr: 'الإيرادات مطروحاً منها المصروفات الإجمالية.',
          trendType: 'up',
          trendValue: `↑ +${(18.5 * multiplier).toFixed(1)}% ${suffix}`,
          color: 'finance',
          iconName: 'net_profit'
        },
        {
          id: 'roi',
          title: 'ROI',
          titleAr: 'عائد الاستثمار',
          value: `${Math.round(24 + (multiplier > 1 ? 3 : -2))}%`,
          description: 'Return on Investment.',
          descriptionAr: 'معدل العائد المالي للاستثمارات الجارية.',
          trendType: 'up',
          trendValue: `↑ +3.2% ${suffix}`,
          color: 'marketing',
          iconName: 'roi'
        },
        {
          id: 'roas',
          title: 'ROAS',
          titleAr: 'عائد الإنفاق الإعلاني',
          value: `${(4.2 + (multiplier > 1 ? 0.4 : -0.2)).toFixed(1)}x`,
          description: 'Return on Ad Spend.',
          descriptionAr: 'عائد الإنفاق الإعلاني للحملات التسويقية.',
          trendType: 'up',
          trendValue: `↑ +0.3x ${suffix}`,
          color: 'marketing',
          iconName: 'roas'
        },
        {
          id: 'staff_perf',
          title: 'Staff Performance',
          titleAr: 'أداء الموظفين',
          value: `${Math.round(92 + (multiplier > 1 ? 1 : -3))}%`,
          description: 'Average employee performance score.',
          descriptionAr: 'متوسط درجات تقييم الأداء الفردي للموظفين.',
          trendType: 'up',
          trendValue: `↑ +1.1% ${suffix}`,
          color: 'performance',
          iconName: 'staff_perf'
        },
        {
          id: 'dept_perf',
          title: 'Department Performance',
          titleAr: 'أداء الأقسام',
          value: `${Math.round(88 + (multiplier > 1 ? 2 : -2))}%`,
          description: 'Average department KPI achievement.',
          descriptionAr: 'متوسط نسبة إنجاز مؤشرات الأداء للأقسام.',
          trendType: 'up',
          trendValue: `↑ +0.8% ${suffix}`,
          color: 'performance',
          iconName: 'dept_perf'
        },
        {
          id: 'kpi_achievement',
          title: 'KPI Achievement',
          titleAr: 'تحقيق الأهداف الكلية',
          value: `${Math.round(75 + (multiplier > 1 ? 4 : -4))}%`,
          description: 'Overall company KPI achievement rate.',
          descriptionAr: 'معدل تحقيق الأهداف والمؤشرات العامة للشركة.',
          trendType: 'up',
          trendValue: `↑ +2.5% ${suffix}`,
          color: 'performance',
          iconName: 'kpi_achievement'
        },
        {
          id: 'overdue_tasks',
          title: 'Overdue Tasks',
          titleAr: 'مهام متأخرة',
          value: `${Math.round(5 + (multiplier > 1 ? 2 : -1))}`,
          description: 'Tasks that exceeded their due date.',
          descriptionAr: 'المهام التي تجاوزت الموعد المحدد للتسليم.',
          trendType: 'down',
          trendValue: `↓ -2 ${suffix}`,
          color: 'tasks',
          iconName: 'overdue_tasks'
        }
      ];

      const leadsBySource: ChartDataPoint[] = [
        { name: 'Facebook Ads', value: Math.round(520 * multiplier) },
        { name: 'Google Search', value: Math.round(340 * multiplier) },
        { name: 'Direct Traffic', value: Math.round(180 * multiplier) },
        { name: 'Referral/Agents', value: Math.round(110 * multiplier) },
        { name: 'TikTok Campaign', value: Math.round(90 * multiplier) }
      ];

      const leadsByGovernorate: LeadsByGovernorate[] = [
        { name: 'Cairo', count: Math.round(450 * multiplier) },
        { name: 'Giza', count: Math.round(320 * multiplier) },
        { name: 'Alexandria', count: Math.round(210 * multiplier) },
        { name: 'Qalyubia', count: Math.round(130 * multiplier) },
        { name: 'Dakahlia', count: Math.round(90 * multiplier) },
        { name: 'Gharbia', count: Math.round(40 * multiplier) }
      ];

      const pipelineFunnel: FunnelData[] = [
        { stage: 'New Leads', value: Math.round(1240 * multiplier) },
        { stage: 'Contacted', value: Math.round(950 * multiplier) },
        { stage: 'Meeting Scheduled', value: Math.round(680 * multiplier) },
        { stage: 'Proposal Sent', value: Math.round(420 * multiplier) },
        { stage: 'Negotiation', value: Math.round(210 * multiplier) },
        { stage: 'Closed Won', value: Math.round(110 * multiplier) }
      ];

      const revenueVsExpenses: RevExpData[] = [
        { month: 'Jan', revenue: Math.round(800000 * multiplier), expenses: Math.round(520000 * multiplier) },
        { month: 'Feb', revenue: Math.round(950000 * multiplier), expenses: Math.round(580000 * multiplier) },
        { month: 'Mar', revenue: Math.round(1100000 * multiplier), expenses: Math.round(640000 * multiplier) },
        { month: 'Apr', revenue: Math.round(1050000 * multiplier), expenses: Math.round(620000 * multiplier) },
        { month: 'May', revenue: Math.round(1150000 * multiplier), expenses: Math.round(670000 * multiplier) },
        { month: 'Jun', revenue: Math.round(1200000 * multiplier), expenses: Math.round(720000 * multiplier) }
      ];

      const monthlyProfitTrend: ProfitData[] = [
        { month: 'Jan', profit: Math.round(280000 * multiplier) },
        { month: 'Feb', profit: Math.round(370000 * multiplier) },
        { month: 'Mar', profit: Math.round(460000 * multiplier) },
        { month: 'Apr', profit: Math.round(430000 * multiplier) },
        { month: 'May', profit: Math.round(480000 * multiplier) },
        { month: 'Jun', profit: Math.round(480000 * multiplier) }
      ];

      const employeePerformance: EmployeeRank[] = [
        { name: 'محمود عبد السلام', department: 'Sales', score: 96, avatar: 'MA' },
        { name: 'دينا الشافعي', department: 'Marketing', score: 94, avatar: 'DS' },
        { name: 'يوسف شريف', department: 'Sales', score: 91, avatar: 'YS' },
        { name: 'سارة خالد', department: 'HR', score: 89, avatar: 'SK' },
        { name: 'نهال فوزي', department: 'Finance', score: 88, avatar: 'NF' }
      ];

      const departmentPerformance: DepartmentRank[] = [
        { department: 'HR', score: 92 },
        { department: 'Sales', score: 90 },
        { department: 'Marketing', score: 88 },
        { department: 'Finance', score: 85 },
        { department: 'Operations', score: 80 }
      ];

      const kpiAchievementTrend: KpiAchievementTrend[] = [
        { month: 'Jan', rate: 68 },
        { month: 'Feb', rate: 70 },
        { month: 'Mar', rate: 72 },
        { month: 'Apr', rate: 71 },
        { month: 'May', rate: 74 },
        { month: 'Jun', rate: 75 }
      ];

      const marketingROI: MarketingRoiData[] = [
        { campaign: 'FB Ramadan Campaign', budget: 15000, roi: 180 },
        { campaign: 'Google SEO Boost', budget: 8000, roi: 240 },
        { campaign: 'TikTok Summer Blitz', budget: 20000, roi: 120 },
        { campaign: 'LinkedIn B2B Outreach', budget: 12000, roi: 160 },
        { campaign: 'Insta Influencer Deal', budget: 10000, roi: 140 }
      ];

      const topEmployees: EmployeeRank[] = employeePerformance;

      const topDepartments = [
        { name: 'Human Resources (HR)', performance: '92%', tasksCompleted: Math.round(45 * multiplier) },
        { name: 'Sales & BD', performance: '90%', tasksCompleted: Math.round(180 * multiplier) },
        { name: 'Marketing & Media', performance: '88%', tasksCompleted: Math.round(75 * multiplier) },
        { name: 'Finance & Accounts', performance: '85%', tasksCompleted: Math.round(30 * multiplier) },
        { name: 'Operations', performance: '80%', tasksCompleted: Math.round(60 * multiplier) }
      ];

      const recentActivities: RecentActivity[] = [
        { id: '1', user: 'محمود عبد السلام', action: 'won a new deal from Facebook Ads', actionAr: 'أغلق صفقة رابحة جديدة من إعلانات فيسبوك', time: '10 mins ago' },
        { id: '2', user: 'دينا الشافعي', action: 'launched Google Summer Blitz campaign', actionAr: 'أطلقت الحملة الصيفية على جوجل سيرش', time: '1 hour ago' },
        { id: '3', user: 'سارة خالد', action: 'added a new employee account for IT Support', actionAr: 'أضافت حساب موظف جديد للدعم الفني', time: '3 hours ago' },
        { id: '4', user: 'ماجد سليمان', action: 'approved a quarterly expense statement', actionAr: 'اعتمد كشف المصروفات الربعي للشركة', time: '5 hours ago' },
        { id: '5', user: 'ياسر جلال', action: 'reviewed department monthly performance report', actionAr: 'راجع التقرير الشهري لأداء أقسام التشغيل', time: '1 day ago' }
      ];

      resolve({
        metrics,
        leadsBySource,
        leadsByGovernorate,
        pipelineFunnel,
        revenueVsExpenses,
        monthlyProfitTrend,
        employeePerformance,
        departmentPerformance,
        kpiAchievementTrend,
        marketingROI,
        topEmployees,
        topDepartments,
        recentActivities
      });
    }, 800); // simulate network latency
  });
};
