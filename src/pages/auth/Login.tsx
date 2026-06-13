import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import logo from '../../assets/logo.jpg';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Tooltip,
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, ContentCopy, CheckCircle } from '@mui/icons-material';

export const Login: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, registeredUsers } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const isRtl = i18n.language === 'ar';

  const onSubmit = (data: any) => {
    dispatch(loginStart());
    
    // Simulate API JWT auth delay
    setTimeout(() => {
      const match = registeredUsers.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
      );

      if (match) {
        if (match.status === 'Inactive' || match.status === 'Suspended') {
          dispatch(loginFailure(isRtl ? 'حسابك معطل أو معلق. يرجى التواصل مع المسؤول.' : 'Your account is inactive or suspended. Please contact the administrator.'));
          return;
        }

        dispatch(
          loginSuccess({
            user: {
              id: match.id,
              name: match.name,
              email: match.email,
              role: match.role,
              permissions: match.permissions,
              status: match.status,
              department: match.department,
              position: match.position
            },
            token: `mock-jwt-token-${match.role.toLowerCase().replace(/\s+/g, '-')}`
          })
        );

        if (match.status === 'Pending First Login') {
          navigate('/auth/force-change-password');
        } else {
          navigate('/');
        }
      } else {
        dispatch(loginFailure(isRtl ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email address or password'));
      }
    }, 1000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMsg(`${label} copied!`);
    setSnackbarOpen(true);
  };

  const selectDemoUser = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    setSnackbarMsg(`Credentials loaded for ${email}`);
    setSnackbarOpen(true);
  };

  // We read the list of registered users as demo accounts
  const demoAccounts = registeredUsers.filter(u => 
    [
      'ceo@company.com',
      'gm@company.com',
      'hr@company.com',
      'finance@company.com',
      'marketing@company.com',
      'sales.manager@company.com',
      'teamleader@company.com',
      'employee@company.com',
      'client@company.com'
    ].includes(u.email.toLowerCase())
  );

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-outfit">
      <div className={`flex flex-col lg:flex-row items-stretch justify-center gap-6 max-w-5xl w-full`}>
        
        {/* Main Login Card */}
        <Container maxWidth="xs" sx={{ p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper
            elevation={6}
            className="w-full"
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Logo and Greeting */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={logo}
                alt="Company Logo"
                className="h-14 w-auto object-contain rounded-2xl mb-4 border border-gray-100 shadow-sm"
              />
              <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'black', letterSpacing: '-0.025em' }}>
                {isRtl ? 'تسجيل الدخول' : 'Sign In'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {isRtl ? 'أهلاً بك في منصة سندك برو' : 'Welcome to Sanadk Pro Platform'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 3, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                margin="normal"
                fullWidth
                label={isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                autoFocus
                slotProps={{
                  htmlInput: { dir: isRtl ? 'rtl' : 'ltr' }
                }}
                {...register('email', {
                  required: isRtl ? 'البريد الإلكتروني مطلوب' : 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: isRtl ? 'عنوان بريد إلكتروني غير صالح' : 'Invalid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />

              <TextField
                margin="normal"
                fullWidth
                label={isRtl ? 'كلمة المرور' : 'Password'}
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                  htmlInput: { dir: isRtl ? 'rtl' : 'ltr' },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                {...register('password', {
                  required: isRtl ? 'كلمة المرور مطلوبة' : 'Password is required'
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                  mb: 2
                }}
              >
                <FormControlLabel
                  control={<Checkbox color="error" {...register('rememberMe')} />}
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {isRtl ? 'تذكرني' : 'Remember me'}
                    </Typography>
                  }
                />
                <Link
                  to="/auth/forgot-password"
                  style={{ textDecoration: 'none', color: '#dc2626', fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                  {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="error"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : isRtl ? 'دخول' : 'Sign In'}
              </Button>
            </form>
          </Paper>
        </Container>

        {/* Development Mode Helper Sidebar Panel */}
        {isDev && (
          <Paper
            elevation={4}
            className="w-full lg:w-96 flex flex-col justify-between"
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: 'grey.50',
              border: '1px dashed rgba(220, 38, 38, 0.3)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Typography variant="subtitle2" sx={{ fontWeight: 'black', color: 'error.main', fontSize: '0.85rem' }}>
                  ⚙️ {isRtl ? 'لوحة فحص حسابات التطوير' : 'DEVELOPMENT TESTING PANEL'}
                </Typography>
                <span className="bg-red-100 text-red-700 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Dev Only
                </span>
              </div>
              
              <Typography variant="caption" color="text.secondary" className="block mb-4 leading-relaxed">
                {isRtl 
                  ? 'انقر على أي مستخدم لتعبئة البيانات تلقائياً، أو استخدم أزرار النسخ لتسهيل التجربة.'
                  : 'Click any user profile to auto-populate credentials, or copy them directly using buttons.'}
              </Typography>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {demoAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => selectDemoUser(acc.email, acc.password || '')}
                    className="p-2.5 rounded-xl bg-white border border-gray-100 hover:border-red-200 hover:shadow-sm transition-all cursor-pointer flex justify-between items-start"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[10px] text-gray-900 truncate">
                          {acc.role}
                        </span>
                        <Tooltip title={acc.permissions.join(', ')} placement="top">
                          <span className="cursor-help bg-slate-100 text-slate-600 font-mono text-[8px] px-1.5 py-0.5 rounded">
                            {acc.permissions.length} perms
                          </span>
                        </Tooltip>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{acc.email}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title={isRtl ? 'نسخ البريد' : 'Copy Email'}>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(acc.email, 'Email')}
                          sx={{ p: 0.5 }}
                        >
                          <ContentCopy sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={isRtl ? 'نسخ كلمة المرور' : 'Copy Password'}>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(acc.password || '', 'Password')}
                          sx={{ p: 0.5 }}
                        >
                          <ContentCopy sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200/50">
              <Typography variant="caption" color="text.secondary" className="block text-center font-bold text-[9px] text-gray-400 uppercase tracking-widest">
                Protected Admin Model Active
              </Typography>
            </div>
          </Paper>
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <CheckCircle sx={{ fontSize: 16, color: 'success.light' }} />
          </IconButton>
        }
      />
    </div>
  );
};

export default Login;
