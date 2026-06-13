import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: number;
  delayMinutes: number;
}

export interface LeaveRequest {
  id: string;
  type: string;
  fromDate: string;
  toDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  jobTitle: string; // Position
  directManager: string;
  hireDate: string;
  salary: number;
  email: string;
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
}

interface EmployeesState {
  employees: Employee[];
}

const mockEmployees: Employee[] = [
  {
    id: 'emp1',
    name: 'محمود عبد السلام',
    department: 'المبيعات',
    jobTitle: 'مدير حسابات العملاء',
    directManager: 'ياسر جلال',
    hireDate: '2025-01-15',
    salary: 12000,
    email: 'm.abdelsalam@crm.com',
    attendance: [
      { date: '2026-06-11', checkIn: '09:00', checkOut: '17:00', workingHours: 8, delayMinutes: 0 },
      { date: '2026-06-12', checkIn: '09:15', checkOut: '17:30', workingHours: 8.25, delayMinutes: 15 },
      { date: '2026-06-13', checkIn: '08:55', checkOut: '17:00', workingHours: 8.08, delayMinutes: 0 },
    ],
    leaves: [
      { id: 'lv1', type: 'إجازة عارضة', fromDate: '2026-06-25', toDate: '2026-06-26', status: 'Pending' }
    ]
  },
  {
    id: 'emp2',
    name: 'دينا الشافعي',
    department: 'التسويق',
    jobTitle: 'أخصائي حملات إعلانية',
    directManager: 'ياسر جلال',
    hireDate: '2025-03-01',
    salary: 10000,
    email: 'dina.shafik@crm.com',
    attendance: [
      { date: '2026-06-11', checkIn: '09:05', checkOut: '17:00', workingHours: 7.9, delayMinutes: 5 },
      { date: '2026-06-12', checkIn: '09:00', checkOut: '17:00', workingHours: 8, delayMinutes: 0 },
      { date: '2026-06-13', checkIn: '09:30', checkOut: '17:00', workingHours: 7.5, delayMinutes: 30 },
    ],
    leaves: [
      { id: 'lv2', type: 'إجازة سنوية', fromDate: '2026-05-10', toDate: '2026-05-15', status: 'Approved' }
    ]
  },
  {
    id: 'emp3',
    name: 'شريف النجار',
    department: 'الموارد البشرية',
    jobTitle: 'مسؤول شؤون الموظفين',
    directManager: 'أحمد علي (المدير العام)',
    hireDate: '2024-06-01',
    salary: 9500,
    email: 'sherif.naggar@crm.com',
    attendance: [
      { date: '2026-06-11', checkIn: '08:45', checkOut: '17:00', workingHours: 8.25, delayMinutes: 0 },
      { date: '2026-06-12', checkIn: '08:50', checkOut: '17:00', workingHours: 8.16, delayMinutes: 0 },
      { date: '2026-06-13', checkIn: '08:58', checkOut: '17:00', workingHours: 8.03, delayMinutes: 0 },
    ],
    leaves: []
  }
];

const initialState: EmployeesState = {
  employees: mockEmployees
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee(state, action: PayloadAction<Omit<Employee, 'id' | 'attendance' | 'leaves'>>) {
      const newEmployee: Employee = {
        ...action.payload,
        id: 'emp' + (state.employees.length + 1),
        attendance: [],
        leaves: []
      };
      state.employees.unshift(newEmployee);
    },
    updateEmployee(state, action: PayloadAction<Employee>) {
      const idx = state.employees.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) {
        state.employees[idx] = action.payload;
      }
    },
    addAttendance(state, action: PayloadAction<{ empId: string; record: AttendanceRecord }>) {
      const { empId, record } = action.payload;
      const emp = state.employees.find(e => e.id === empId);
      if (emp) {
        emp.attendance.unshift(record);
      }
    },
    addLeaveRequest(state, action: PayloadAction<{ empId: string; request: Omit<LeaveRequest, 'id'> }>) {
      const { empId, request } = action.payload;
      const emp = state.employees.find(e => e.id === empId);
      if (emp) {
        const newLeave: LeaveRequest = {
          ...request,
          id: 'lv' + (emp.leaves.length + 1)
        };
        emp.leaves.unshift(newLeave);
      }
    },
    updateLeaveStatus(state, action: PayloadAction<{ empId: string; requestId: string; status: 'Approved' | 'Rejected' }>) {
      const { empId, requestId, status } = action.payload;
      const emp = state.employees.find(e => e.id === empId);
      if (emp) {
        const leave = emp.leaves.find(l => l.id === requestId);
        if (leave) {
          leave.status = status;
        }
      }
    }
  }
});

export const {
  addEmployee,
  updateEmployee,
  addAttendance,
  addLeaveRequest,
  updateLeaveStatus
} = employeesSlice.actions;

export default employeesSlice.reducer;
