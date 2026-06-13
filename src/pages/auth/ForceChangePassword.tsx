import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store';
import { changePasswordAndActivate } from '../../store/authSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert
} from '@mui/material';

export const ForceChangePassword: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.status !== 'Pending First Login') {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data: any) => {
    dispatch(changePasswordAndActivate({
      email: user.email,
      newPassword: data.password
    }));

    setSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const isRtl = i18n.language === 'ar';

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" color="error" sx={{ fontWeight: 'black', mb: 1 }}>
            {isRtl ? 'تغيير كلمة المرور الإلزامي' : 'Force Change Password'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isRtl
              ? 'يرجى تعيين كلمة مرور جديدة لتفعيل حسابك قبل الدخول للنظام.'
              : 'Please set a new password to activate your account before proceeding.'}
          </Typography>
        </Box>

        {success ? (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {isRtl
              ? 'تم تغيير كلمة المرور وتفعيل الحساب بنجاح! جاري تحويلك لوحة التحكم...'
              : 'Password changed and account activated successfully! Redirecting...'}
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              fullWidth
              type="password"
              label={isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
              {...register('password', {
                required: isRtl ? 'كلمة المرور مطلوبة' : 'Password is required',
                minLength: {
                  value: 8,
                  message: isRtl ? 'يجب ألا تقل عن 8 أحرف' : 'Must be at least 8 characters'
                },
                validate: (value) => {
                  const hasUpper = /[A-Z]/.test(value);
                  const hasNum = /[0-9]/.test(value);
                  if (!hasUpper || !hasNum) {
                    return isRtl
                      ? 'يجب أن تحتوي على حرف كبير ورقم واحد على الأقل'
                      : 'Must contain an uppercase letter and a number';
                  }
                  return true;
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField
              margin="normal"
              fullWidth
              type="password"
              label={isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              {...register('confirmPassword', {
                required: isRtl ? 'تأكيد كلمة المرور مطلوب' : 'Confirm password is required',
                validate: (value) =>
                  value === watchPassword ||
                  (isRtl ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              sx={{
                py: 1.5,
                mt: 3,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
              }}
            >
              {isRtl ? 'تغيير كلمة المرور وتفعيل الحساب' : 'Change Password & Activate'}
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};
export default ForceChangePassword;
