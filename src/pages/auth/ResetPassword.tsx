import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert
} from '@mui/material';

export const ResetPassword: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
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

  const onSubmit = (data: any) => {
    console.log('Resetting password with:', data);
    setSuccess(true);
    setTimeout(() => {
      navigate('/auth/login');
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
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
            {isRtl ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isRtl ? 'يرجى كتابة كلمة المرور الجديدة أدناه.' : 'Please enter your new password below.'}
          </Typography>
        </Box>

        {success ? (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {isRtl
              ? 'تمت إعادة تعيين كلمة المرور بنجاح! جاري توجيهك لصفحة الدخول...'
              : 'Password reset successfully! Redirecting to login...'}
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
                mt: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
              }}
            >
              {isRtl ? 'حفظ وإعادة تعيين' : 'Save & Reset'}
            </Button>
          </form>
        )}

        <Box sx={{ mt: 3 }}>
          <Link to="/auth/login" style={{ textDecoration: 'none', color: '#dc2626', fontWeight: 'bold' }}>
            {isRtl ? 'العودة لصفحة الدخول' : 'Back to Login'}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};
export default ResetPassword;
