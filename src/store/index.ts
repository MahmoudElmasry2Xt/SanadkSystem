import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import authReducer from './authSlice';
import crmReducer from './crmSlice';
import tasksReducer from './tasksSlice';
import employeesReducer from './employeesSlice';
import kpiReducer from './kpiSlice';
import financeReducer from './financeSlice';
import marketingReducer from './marketingSlice';
import filesReducer from './filesSlice';
import notificationsReducer from './notificationsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crm: crmReducer,
    tasks: tasksReducer,
    employees: employeesReducer,
    kpi: kpiReducer,
    finance: financeReducer,
    marketing: marketingReducer,
    files: filesReducer,
    notifications: notificationsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks to avoid repeating type references in components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
