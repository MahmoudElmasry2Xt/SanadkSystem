import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import toast from 'react-hot-toast';
import {
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addPosition,
  updatePosition,
  deletePosition,
  type Department,
  type Position
} from '../store/settingsSlice';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import { Plus, Edit2, Trash2, Settings as SettingsIcon } from 'lucide-react';

export const Settings: React.FC = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { departments, positions } = useAppSelector((state) => state.settings);
  const [activeTab, setActiveTab] = useState(0);

  // Department Modal State
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptManager, setDeptManager] = useState('');

  // Position Modal State
  const [posDialogOpen, setPosDialogOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<Position | null>(null);
  const [posName, setPosName] = useState('');
  const [posDeptId, setPosDeptId] = useState('');
  const [posGrade, setPosGrade] = useState('');

  const isRtl = i18n.language === 'ar';

  // Department Action Handlers
  const handleOpenDeptDialog = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setDeptName(dept.name);
      setDeptDesc(dept.description);
      setDeptManager(dept.manager);
    } else {
      setEditingDept(null);
      setDeptName('');
      setDeptDesc('');
      setDeptManager('');
    }
    setDeptDialogOpen(true);
  };

  const handleSaveDept = () => {
    if (!deptName) return;
    if (editingDept) {
      dispatch(
        updateDepartment({
          id: editingDept.id,
          name: deptName,
          description: deptDesc,
          manager: deptManager
        })
      );
    } else {
      dispatch(
        addDepartment({
          name: deptName,
          description: deptDesc,
          manager: deptManager
        })
      );
    }
    setDeptDialogOpen(false);
  };

  const handleDeleteDept = (id: string) => {
    dispatch(deleteDepartment(id));
    toast.success(isRtl ? 'تم حذف القسم بنجاح!' : 'Department deleted successfully!');
  };

  // Position Action Handlers
  const handleOpenPosDialog = (pos?: Position) => {
    if (pos) {
      setEditingPos(pos);
      setPosName(pos.name);
      setPosDeptId(pos.departmentId);
      setPosGrade(pos.grade);
    } else {
      setEditingPos(null);
      setPosName('');
      setPosDeptId(departments[0]?.id || '');
      setPosGrade('Mid');
    }
    setPosDialogOpen(true);
  };

  const handleSavePos = () => {
    if (!posName || !posDeptId) return;
    if (editingPos) {
      dispatch(
        updatePosition({
          id: editingPos.id,
          name: posName,
          departmentId: posDeptId,
          grade: posGrade
        })
      );
    } else {
      dispatch(
        addPosition({
          name: posName,
          departmentId: posDeptId,
          grade: posGrade
        })
      );
    }
    setPosDialogOpen(false);
  };

  const handleDeletePos = (id: string) => {
    dispatch(deletePosition(id));
    toast.success(isRtl ? 'تم حذف الوظيفة بنجاح!' : 'Position deleted successfully!');
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{ p: 1.5, bgcolor: 'error.main', color: 'white', borderRadius: 3, boxShadow: '0 8px 16px rgba(239,68,68,0.1)' }}>
          <SettingsIcon size={24} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {isRtl ? 'الإعدادات العامة وهيكل النظام' : 'General Settings & Platform Structure'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isRtl ? 'إدارة الأقسام والوظائف ومستويات الصلاحيات الخاصة بالنظام' : 'Manage departments, job titles, positions, and security roles'}
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }} elevation={1}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { py: 2, fontWeight: 'bold' }
          }}
        >
          <Tab label={isRtl ? 'الأقسام (Departments)' : 'Departments'} />
          <Tab label={isRtl ? 'المسميات الوظيفية (Positions)' : 'Positions'} />
          <Tab label={isRtl ? 'الصلاحيات (Permissions)' : 'Permissions & Roles'} />
        </Tabs>
      </Paper>

      {/* Tab Contents */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {isRtl ? 'الأقسام الحالية للمؤسسة' : 'Company Departments'}
            </Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpenDeptDialog()}
              sx={{ borderRadius: 3, px: 3, py: 1, textTransform: 'none', fontWeight: 'bold' }}
            >
              {isRtl ? 'إضافة قسم جديد' : 'Add Department'}
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{isRtl ? 'اسم القسم' : 'Department Name'}</TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{isRtl ? 'الوصف' : 'Description'}</TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{isRtl ? 'مدير القسم' : 'Manager'}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{isRtl ? 'الإجراءات' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id} hover>
                    <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {dept.name}
                    </TableCell>
                    <TableCell align={isRtl ? 'right' : 'left'}>{dept.description}</TableCell>
                    <TableCell align={isRtl ? 'right' : 'left'}>{dept.manager}</TableCell>
                    <TableCell align="center">
                      <IconButton color="info" onClick={() => handleOpenDeptDialog(dept)} sx={{ mr: 1 }}>
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteDept(dept.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {isRtl ? 'المسميات الوظيفية والدرجات' : 'Job Titles & Hierarchy'}
            </Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpenPosDialog()}
              sx={{ borderRadius: 3, px: 3, py: 1, textTransform: 'none', fontWeight: 'bold' }}
            >
              {isRtl ? 'إضافة وظيفة جديدة' : 'Add Position'}
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{isRtl ? 'المسمى الوظيفي' : 'Job Title'}</TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{isRtl ? 'القسم التابع له' : 'Department'}</TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{isRtl ? 'الدرجة الوظيفية' : 'Grade'}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{isRtl ? 'الإجراءات' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((pos) => {
                  const dept = departments.find((d) => d.id === pos.departmentId);
                  return (
                    <TableRow key={pos.id} hover>
                      <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>
                        {pos.name}
                      </TableCell>
                      <TableCell align={isRtl ? 'right' : 'left'}>{dept ? dept.name : 'Unknown'}</TableCell>
                      <TableCell align={isRtl ? 'right' : 'left'}>{pos.grade}</TableCell>
                      <TableCell align="center">
                        <IconButton color="info" onClick={() => handleOpenPosDialog(pos)} sx={{ mr: 1 }}>
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeletePos(pos.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            {isRtl ? 'مصفوفة الصلاحيات حسب الأدوار' : 'RBAC Permissions Matrix'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {isRtl ? 'توضح هذه المصفوفة الصلاحيات الممنوحة تلقائياً لكل دور وظيفي داخل المؤسسة.' : 'Review which system actions are unlocked for each security role.'}
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{isRtl ? 'الدور الوظيفي (Role)' : 'Role'}</TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{isRtl ? 'الصلاحيات الأساسية (Permissions)' : 'Permissions Assigned'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { r: 'CEO', desc: 'كل صلاحيات النظام كاملة بدون استثناء (Full Access)' },
                  { r: 'General Manager', desc: 'إدارة العملاء، التسويق، الموظفين، مؤشرات الأداء، الأتمتة (يستثنى منها تفاصيل الرواتب والبيانات المالية الحساسة)' },
                  { r: 'HR Manager', desc: 'إدارة شؤون الموظفين، الحضور والانصراف، الإجازات، مؤشرات أداء الموارد البشرية' },
                  { r: 'Finance Manager', desc: 'إدارة الإيرادات، المصروفات، العقود، والتقارير المالية الكاملة للشركة' },
                  { r: 'Marketing Manager', desc: 'إدارة العملاء، الحملات الإعلانية، مؤشرات أداء التسويق والمهام التسويقية' },
                  { r: 'Sales Manager', desc: 'إدارة وتعيين العملاء، خط سير المبيعات، صفقات المبيعات وعروض الأسعار' },
                  { r: 'Team Leader', desc: 'متابعة مهام ومؤشرات وعملاء وأداء الفريق الخاص به فقط' },
                  { r: 'Employee', desc: 'الوصول لمهامه الخاصة، تسجيل الحضور، مؤشرات أدائه الشخصية' },
                  { r: 'Client', desc: 'الوصول لملفاته، مشاريعه الخاصة، العقود، والتواصل عبر الرسائل' }
                ].map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 'bold', color: 'error.main' }}>{row.r}</TableCell>
                    <TableCell align={isRtl ? 'right' : 'left'}>{row.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Department Dialog */}
      <Dialog open={deptDialogOpen} onClose={() => setDeptDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingDept ? (isRtl ? 'تعديل قسم' : 'Edit Department') : (isRtl ? 'إضافة قسم جديد' : 'Add Department')}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label={isRtl ? 'اسم القسم' : 'Department Name'}
            fullWidth
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={isRtl ? 'الوصف' : 'Description'}
            fullWidth
            multiline
            rows={2}
            value={deptDesc}
            onChange={(e) => setDeptDesc(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={isRtl ? 'المدير المسؤول' : 'Manager'}
            fullWidth
            value={deptManager}
            onChange={(e) => setDeptManager(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeptDialogOpen(false)} color="inherit">{isRtl ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSaveDept} color="error" variant="contained">{isRtl ? 'حفظ' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Position Dialog */}
      <Dialog open={posDialogOpen} onClose={() => setPosDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingPos ? (isRtl ? 'تعديل وظيفة' : 'Edit Position') : (isRtl ? 'إضافة وظيفة جديدة' : 'Add Position')}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label={isRtl ? 'المسمى الوظيفي' : 'Job Title'}
            fullWidth
            value={posName}
            onChange={(e) => setPosName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            select
            label={isRtl ? 'القسم' : 'Department'}
            fullWidth
            value={posDeptId}
            onChange={(e) => setPosDeptId(e.target.value)}
            sx={{ mb: 2 }}
          >
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            select
            label={isRtl ? 'الدرجة الوظيفية' : 'Grade'}
            fullWidth
            value={posGrade}
            onChange={(e) => setPosGrade(e.target.value)}
          >
            {['Junior', 'Mid', 'Senior', 'Manager'].map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPosDialogOpen(false)} color="inherit">{isRtl ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSavePos} color="error" variant="contained">{isRtl ? 'حفظ' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Settings;
