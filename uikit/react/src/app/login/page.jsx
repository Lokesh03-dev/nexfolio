'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

// @third-party
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import LogoMain from '@/components/logo/LogoMain';
import SvgIcon from '@/components/SvgIcon';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';
import { emailSchema, passwordSchema } from '@/utils/validationSchema';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';

/***************************  FORM - INPUT LABEL  ***************************/
function FieldLabel({ name }) {
  return (
    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>
      {name}
    </Typography>
  );
}

/***************************  FORM - ERROR MESSAGE  ***************************/
function ErrorMessage({ message }) {
  return (
    <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
      {message}
    </Typography>
  );
}

/***************************  LOGIN PAGE  ***************************/
export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/upload-resume');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        setStatus({ type: 'success', message: result.message });
        setTimeout(() => {
          router.push('/upload-resume');
        }, 1500);
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setStatus({ type: 'info', message: 'Opening Google Sign-In...' });

    try {
      // Popup is more reliable on localhost than redirect
      const result = await signInWithPopup(auth, googleProvider);
      setStatus({ type: 'info', message: 'Verifying with server...' });
      const idToken = await result.user.getIdToken();
      const authResult = await loginWithGoogle(idToken, 'other');
      if (authResult.success) {
        setStatus({ type: 'success', message: authResult.message });
        setTimeout(() => router.push('/upload-resume'), 1200);
      } else {
        setStatus({ type: 'error', message: authResult.message });
        setLoading(false);
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      // User closed the popup
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        setStatus({ type: '', message: '' });
      } else {
        setStatus({ type: 'error', message: error.message || 'Google Sign In failed. Please try again.' });
      }
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Left Side: Branding & Premium SaaS Preview */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          position: 'relative',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          overflow: 'hidden',
          bgcolor: 'grey.100',
          borderRight: '1px solid',
          borderColor: 'grey.300',
          ...getBackgroundDots(theme.vars.palette.grey[300], 2, 35)
        }}
      >
        {/* Subtle radial gradient background */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${withAlpha(theme.vars.palette.primary.lighter, 0.4)} 0%, rgba(255,255,255,0) 70%)`,
            filter: 'blur(80px)',
            zIndex: 0
          }}
        />

        {/* Top Section */}
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, zIndex: 1 }}>
          <LogoMain />
        </Stack>

        {/* Middle Section: Illustration/Saas preview */}
        <Box sx={{ zIndex: 1, my: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: 480 }}
          >
            <Stack sx={{ gap: 2.5, textAlign: 'center', mb: 5 }}>
              <Typography variant="h2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                Build Your Personal Site in Minutes
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                Our AI analyzes your resume, extracts your key achievements, and generates a stunning personal portfolio tailored to your domain.
              </Typography>
            </Stack>
          </motion.div>

          {/* Premium Floating Showcase UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ width: '100%', maxWidth: 460 }}
          >
            <Box
              sx={{
                position: 'relative',
                p: 3,
                bgcolor: 'background.default',
                borderRadius: 5,
                border: '1.5px solid',
                borderColor: 'grey.300',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* Fake Dashboard Header */}
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Stack direction="row" sx={{ gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                </Stack>
                <Box sx={{ px: 2, py: 0.5, bgcolor: 'grey.100', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    ✨ AI Processing Live
                  </Typography>
                </Box>
              </Stack>

              {/* Fake Content Cards */}
              <Stack sx={{ gap: 2 }}>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <Box sx={{ p: 1, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                        <SvgIcon name="tabler-file-text" size={20} color={theme.vars.palette.primary.main} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>resume_abhishek.pdf</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Uploaded • 1.2 MB</Typography>
                      </Box>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    </Stack>
                  </Box>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3.5,
                      border: '1.5px solid',
                      borderColor: 'primary.light',
                      boxShadow: `0 10px 20px ${withAlpha(theme.vars.palette.primary.main, 0.05)}`
                    }}
                  >
                    <Stack sx={{ gap: 1.5 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>AI Skill Analyzer</Typography>
                        <CircularProgress size={16} thickness={5} />
                      </Stack>
                      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
                        {['React.js', 'Next.js', 'Node.js', 'Material UI', 'Tailwind'].map((skill, i) => (
                          <Box key={i} sx={{ px: 1.5, py: 0.5, bgcolor: 'grey.100', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{skill}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </Box>
                </motion.div>
              </Stack>
            </Box>
          </motion.div>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ zIndex: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} Nexfolio. All rights reserved.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side: Glass Login Card */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, md: 6 },
          position: 'relative'
        }}
      >
        {/* Mobile Header Logo */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, width: '100%', maxWidth: 420 }}>
          <LogoMain />
        </Box>

        {/* Glow Effects in Background */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${withAlpha(theme.vars.palette.primary.lighter, 0.3)} 0%, rgba(255,255,255,0) 70%)`,
            filter: 'blur(60px)',
            zIndex: 0
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 460, zIndex: 1 }}
        >
          {/* Form Card (Glassmorphic Accent) */}
          <Box
            sx={{
              p: { xs: 3.5, sm: 5 },
              borderRadius: 5,
              bgcolor: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: 'grey.300',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Header info */}
            <Stack sx={{ gap: 1, mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 500 }}>
                Sign In
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter your credentials to manage your portfolios.
              </Typography>
            </Stack>

            {/* Notification Messages */}
            <AnimatePresence mode="wait">
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity={status.type === 'info' ? 'info' : status.type === 'success' ? 'success' : 'error'} sx={{ mb: 3, borderRadius: 3 }}>
                    {status.message}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack sx={{ gap: 2.5 }}>
                {/* Email Field */}
                <Stack>
                  <FieldLabel name="Email Address" />
                  <OutlinedInput
                    {...register('email', emailSchema)}
                    type="email"
                    placeholder="name@example.com"
                    fullWidth
                    error={Boolean(errors.email)}
                    sx={{ borderRadius: 3, bgcolor: 'background.default' }}
                    startAdornment={
                      <InputAdornment position="start" sx={{ pl: 0.5, color: 'text.secondary' }}>
                        <SvgIcon name="tabler-mail" size={18} color="inherit" />
                      </InputAdornment>
                    }
                  />
                  {errors.email?.message && <ErrorMessage message={errors.email?.message} />}
                </Stack>

                {/* Password Field */}
                <Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <FieldLabel name="Password" />
                    <Link
                      component={NextLink}
                      href="/forgot-password"
                      variant="caption"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Stack>
                  <OutlinedInput
                    {...register('password', passwordSchema)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    fullWidth
                    error={Boolean(errors.password)}
                    sx={{ borderRadius: 3, bgcolor: 'background.default' }}
                    startAdornment={
                      <InputAdornment position="start" sx={{ pl: 0.5, color: 'text.secondary' }}>
                        <SvgIcon name="tabler-lock" size={18} color="inherit" />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end" sx={{ pr: 0.5 }}>
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          <SvgIcon name={showPassword ? 'tabler-eye-off' : 'tabler-eye'} size={18} color="inherit" />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.password?.message && <ErrorMessage message={errors.password?.message} />}
                </Stack>

                {/* Remember Me Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register('remember')}
                      color="primary"
                      sx={{ borderRadius: 1.5 }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'text.secondary', userSelect: 'none' }}>
                      Remember me
                    </Typography>
                  }
                  sx={{ ml: -0.5 }}
                />

                {/* Login Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: `0 8px 24px ${withAlpha(theme.vars.palette.primary.main, 0.15)}`,
                      fontWeight: 600,
                      position: 'relative'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'background.default' }} />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </motion.div>

                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
                    or continue with
                  </Typography>
                </Divider>

                {/* Google Sign In */}
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  startIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-.63-1.44-1.42-1.81-2.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: 'grey.300',
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'grey.600',
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  Sign in with Google
                </Button>
              </Stack>
            </form>
          </Box>
        </motion.div>

        {/* Footer info (Registration Link) */}
        <Stack direction="row" sx={{ mt: 4, gap: 0.5, zIndex: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Don&apos;t have an account?
          </Typography>
          <Link
            component={NextLink}
            href="/register"
            variant="subtitle2"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Create account
          </Link>
        </Stack>
      </Grid>
      
    </Grid>
  );
}
