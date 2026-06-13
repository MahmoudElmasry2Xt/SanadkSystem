import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleAutomationActive, addAutomationRule } from '../store/settingsSlice';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Switch,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel
} from '@mui/material';
import { Play, Plus, Cpu } from 'lucide-react';

export const Automations: React.FC = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { automations } = useAppSelector((state) => state.settings);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [ruleTrigger, setRuleTrigger] = useState('');
  const [ruleAction, setRuleAction] = useState('');
  const [ruleType, setRuleType] = useState('Smart CRM');

  const isRtl = i18n.language === 'ar';

  const handleToggle = (id: string) => {
    dispatch(toggleAutomationActive(id));
  };

  const handleOpenDialog = () => {
    setRuleName('');
    setRuleDesc('');
    setRuleTrigger('');
    setRuleAction('');
    setRuleType('Smart CRM');
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!ruleName || !ruleTrigger || !ruleAction) return;
    dispatch(
      addAutomationRule({
        name: ruleName,
        description: ruleDesc,
        trigger: ruleTrigger,
        action: ruleAction,
        type: ruleType,
        active: true
      })
    );
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: 'error.main', color: 'white', borderRadius: 3, boxShadow: '0 8px 16px rgba(239,68,68,0.1)' }}>
            <Cpu size={24} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {isRtl ? 'محرك الأتمتة الذكي' : 'Smart Automation Engine'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isRtl ? 'إدارة قواعد سير العمل التلقائية للتسويق، المبيعات، المالية، والعمليات' : 'Manage automated triggers, rules, and actions for your enterprise workspace'}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<Plus size={18} />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 3, px: 3, py: 1, textTransform: 'none', fontWeight: 'bold' }}
        >
          {isRtl ? 'إضافة قاعدة جديدة' : 'Add Custom Rule'}
        </Button>
      </Box>

      {/* Grid of Automations using Tailwind */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((rule) => (
          <div key={rule.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                border: '1px solid',
                borderColor: 'grey.100',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Chip
                    label={rule.type}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ fontWeight: 'bold', borderRadius: 2 }}
                  />
                  <Chip
                    label={rule.active ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                    size="small"
                    color={rule.active ? 'success' : 'default'}
                    sx={{ fontWeight: 'bold', borderRadius: 2 }}
                  />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, color: 'text.primary', fontWeight: 'bold' }}>
                  {rule.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                  {rule.description}
                </Typography>

                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, fontSize: '0.8rem' }}>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="caption" sx={{ width: 60, color: 'error.main', fontWeight: 'bold' }}>
                      TRIGGER:
                    </Typography>
                    <Typography variant="caption" color="text.primary">
                      {rule.trigger}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="caption" sx={{ width: 60, color: 'success.main', fontWeight: 'bold' }}>
                      ACTION:
                    </Typography>
                    <Typography variant="caption" color="text.primary">
                      {rule.action}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rule.active}
                      onChange={() => handleToggle(rule.id)}
                      color="error"
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {isRtl ? 'تفعيل القاعدة' : 'Enable Rule'}
                    </Typography>
                  }
                />
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={<Play size={12} />}
                  sx={{ borderRadius: 2, textTransform: 'none', px: 2 }}
                  onClick={() => alert(isRtl ? 'تم تشغيل القاعدة بنجاح!' : 'Rule triggered manually!')}
                >
                  {isRtl ? 'تشغيل الآن' : 'Run Now'}
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {isRtl ? 'إضافة قاعدة أتمتة جديدة' : 'Create Automation Rule'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label={isRtl ? 'اسم القاعدة' : 'Rule Name'}
            fullWidth
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={isRtl ? 'الوصف' : 'Description'}
            fullWidth
            multiline
            rows={2}
            value={ruleDesc}
            onChange={(e) => setRuleDesc(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={isRtl ? 'النوع (مثال: Smart CRM, Finance)' : 'Type'}
            fullWidth
            value={ruleType}
            onChange={(e) => setRuleType(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={isRtl ? 'الحدث المشغّل (Trigger)' : 'Trigger'}
            fullWidth
            value={ruleTrigger}
            onChange={(e) => setRuleTrigger(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={isRtl ? 'الإجراء المتخذ (Action)' : 'Action'}
            fullWidth
            value={ruleAction}
            onChange={(e) => setRuleAction(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">{isRtl ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSave} color="error" variant="contained">{isRtl ? 'حفظ' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Automations;
