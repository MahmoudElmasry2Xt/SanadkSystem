import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Campaign {
  id: string;
  name: string;
  budget: number;
  platform: 'Facebook' | 'Google Ads' | 'TikTok' | 'Snapchat';
  goal: string;
  status: 'Active' | 'Paused' | 'Completed';
  assignee: string;
  reach: number;
  clicks: number;
  leads: number;
  revenueGenerated: number;
}

interface MarketingState {
  campaigns: Campaign[];
}

const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'حملة ترويج نظام الـ CRM للمؤسسات', budget: 5000, platform: 'Facebook', goal: 'Leads Generation', status: 'Active', assignee: 'دينا الشافعي', reach: 65000, clicks: 3200, leads: 145, revenueGenerated: 35000 },
  { id: 'c2', name: 'حملة البحث وجوجل إعلانات Lead Gen', budget: 4000, platform: 'Google Ads', goal: 'Sales Conversion', status: 'Active', assignee: 'دينا الشافعي', reach: 45000, clicks: 5100, leads: 180, revenueGenerated: 54000 },
  { id: 'c3', name: 'حملة توعية وإطلاق هوية سندك', budget: 3000, platform: 'TikTok', goal: 'Reach & Views', status: 'Completed', assignee: 'شريف النجار', reach: 180000, clicks: 12500, leads: 40, revenueGenerated: 12000 },
  { id: 'c4', name: 'توسعات السوق الخليجي عقارات', budget: 6000, platform: 'Snapchat', goal: 'App Installs', status: 'Paused', assignee: 'دينا الشافعي', reach: 90000, clicks: 4300, leads: 75, revenueGenerated: 18000 }
];

const initialState: MarketingState = {
  campaigns: mockCampaigns
};

const marketingSlice = createSlice({
  name: 'marketing',
  initialState,
  reducers: {
    addCampaign(state, action: PayloadAction<Omit<Campaign, 'id' | 'reach' | 'clicks' | 'leads' | 'revenueGenerated'>>) {
      const newCampaign: Campaign = {
        ...action.payload,
        id: 'c' + (state.campaigns.length + 1),
        reach: Math.floor(Math.random() * 50000) + 1000,
        clicks: Math.floor(Math.random() * 5000) + 100,
        leads: Math.floor(Math.random() * 200) + 5,
        revenueGenerated: Math.floor(Math.random() * 20000)
      };
      state.campaigns.unshift(newCampaign);
    },
    updateCampaign(state, action: PayloadAction<Campaign>) {
      const idx = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.campaigns[idx] = action.payload;
      }
    }
  }
});

export const { addCampaign, updateCampaign } = marketingSlice.actions;
export default marketingSlice.reducer;
