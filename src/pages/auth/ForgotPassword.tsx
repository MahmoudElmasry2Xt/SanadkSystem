import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
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

export const ForgotPassword: React.FC = () => {
  const { i18n } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (data: any) => {
    console.log('Forgot password request for:', data);
    setSubmitted(true);
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
            {isRtl ? 'استعادة كلمة المرور' : 'Forgot Password'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isRtl
              ? 'أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.'
              : 'Enter your email address to receive a password reset link.'}
          </Typography>
        </Box>

        {submitted ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {isRtl
                ? 'تم إرسال رابط إعادة التعيين بنجاح! يرجى التحقق من بريدك الوارد.'
                : 'Reset link sent successfully! Please check your inbox.'}
            </Alert>
            <Typography variant="body2">
              <Link to="/auth/login" style={{ textDecoration: 'none', color: '#dc2626', fontWeight: 'bold' }}>
                {isRtl ? 'العودة لصفحة الدخول' : 'Back to Login'}
              </Link>
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              fullWidth
              label={isRtl ? 'البريد الإلكتروني' : 'Email Address'}
              autoFocus
              {...register('email', {
                required: isRtl ? 'البريد الإلكتروني مطلوب' : 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: isRtl ? 'بريد إلكتروني غير صالح' : 'Invalid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
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
              {isRtl ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'}
            </Button>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <Link to="/auth/login" style={{ textDecoration: 'none', color: '#dc2626', fontWeight: 'bold' }}>
                  {isRtl ? 'العودة لصفحة الدخول' : 'Back to Login'}
                </Link>
              </Typography>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};
export default ForgotPassword;
