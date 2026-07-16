'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

// @third-party
import { motion, AnimatePresence } from 'motion/react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import LogoMain from '@/components/logo/LogoMain';
import SvgIcon from '@/components/SvgIcon';
import axiosInstance from '@/utils/axios';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';

const PROCESSING_STEPS = [
  { id: 0, label: 'Scanning Resume...', icon: 'tabler-scan', duration: 1500 },
  { id: 1, label: 'Extracting Skills...', icon: 'tabler-tools-kitchen-2', duration: 2000 },
  { id: 2, label: 'Reading Experience...', icon: 'tabler-briefcase', duration: 2500 },
  { id: 3, label: 'Analyzing Education...', icon: 'tabler-school', duration: 1500 },
  { id: 4, label: 'Finding Projects...', icon: 'tabler-folder', duration: 2000 },
  { id: 5, label: 'Generating Summary...', icon: 'tabler-message-chatbot', duration: 2500 }
];

export default function ResumeProcessingPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [apiReady, setApiReady] = useState(false);
  const [error, setError] = useState('');

  const pollIntervalRef = useRef(null);
  const stepTimeoutRef = useRef(null);

  // Protected route redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Poll backend for parsed resume data
  const pollResumeData = async () => {
    try {
      const response = await axiosInstance.get('/resume-data');
      if (response.status === 200 && response.data && response.data.basics) {
        setApiReady(true);
        // Clear interval when ready
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      }
    } catch (err) {
      // 404 is expected while the backend is still running Gemini parsing
      if (err.response?.status !== 404) {
        console.error('Error polling resume data:', err);
      }
    }
  };

  useEffect(() => {
    // Start polling immediately
    pollResumeData();
    pollIntervalRef.current = setInterval(pollResumeData, 2000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Handle step-by-step progress animation
  useEffect(() => {
    const runSteps = (stepIndex) => {
      if (stepIndex >= PROCESSING_STEPS.length) {
        // If animation completed but API is not ready, stay on last step and wait
        return;
      }

      const currentStep = PROCESSING_STEPS[stepIndex];
      setActiveStep(stepIndex);

      // Interpolate progress bar
      const startProgress = (stepIndex / PROCESSING_STEPS.length) * 100;
      const endProgress = ((stepIndex + 1) / PROCESSING_STEPS.length) * 100;
      const stepDuration = currentStep.duration;

      const startTime = Date.now();
      const progressTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(elapsed / stepDuration, 1);
        setProgress(startProgress + ratio * (endProgress - startProgress));

        if (ratio === 1) {
          clearInterval(progressTimer);
          setCompletedSteps((prev) => [...prev, stepIndex]);
          runSteps(stepIndex + 1);
        }
      }, 50);
    };

    runSteps(0);

    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, []);

  // Monitor both animation status and API readiness before redirecting
  useEffect(() => {
    const allAnimationsDone = completedSteps.length === PROCESSING_STEPS.length;
    if (allAnimationsDone && apiReady) {
      setTimeout(() => {
        router.push('/resume-analysis');
      }, 1000);
    }
  }, [completedSteps, apiReady, router]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        display: 'flex',
        flexDirection: 'column',
        ...getBackgroundDots(theme.vars.palette.grey[300], 2, 35)
      }}
    >
      {/* App Navbar */}
      <Box sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'grey.300', py: 2 }}>
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <LogoMain />
            <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
              <Stack sx={{ alignItems: 'flex-end', display: { xs: 'none', sm: 'flex' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {user?.domain} Developer
                </Typography>
              </Stack>
              <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 600, width: 40, height: 40, border: '1px solid', borderColor: 'primary.light' }}>
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </Avatar>
              <IconButton onClick={logout} sx={{ color: 'text.secondary' }}>
                <SvgIcon name="tabler-logout" size={20} color="inherit" />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 6 }}>
        <Box sx={{ width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card
              elevation={0}
              sx={{
                p: { xs: 4, sm: 5 },
                borderRadius: 5,
                bgcolor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: 'grey.300',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Rotating AI Icon */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '50%',
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      boxShadow: `0 0 20px ${withAlpha(theme.vars.palette.primary.main, 0.15)}`
                    }}
                  >
                    <SvgIcon name="tabler-brain" size={40} color="inherit" />
                  </Box>
                </motion.div>
              </Box>

              <Typography variant="h3" align="center" sx={{ fontWeight: 500, mb: 1 }}>
                AI Analysis in Progress
              </Typography>
              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                Please wait while Gemini extracts your details and prepares the design data.
              </Typography>

              {/* Progress Slider */}
              <Stack sx={{ gap: 1.5, mb: 4 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                    }
                  }}
                />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {Math.round(progress)}% Completed
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Estimated time: 10s
                  </Typography>
                </Stack>
              </Stack>

              {/* Step By Step Checklist */}
              <Stack sx={{ gap: 2.5 }}>
                {PROCESSING_STEPS.map((step) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isActive = activeStep === step.id;

                  return (
                    <Stack
                      key={step.id}
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        px: 2,
                        borderRadius: 3,
                        bgcolor: isActive ? 'primary.lighter' : 'transparent',
                        border: '1px solid',
                        borderColor: isActive ? 'primary.light' : 'transparent',
                        transition: 'all 0.3s'
                      }}
                    >
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
                        <Box sx={{ color: isActive ? 'primary.main' : isCompleted ? 'success.main' : 'text.secondary' }}>
                          <SvgIcon name={step.icon} size={20} color="inherit" />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: isActive || isCompleted ? 600 : 400,
                            color: isActive ? 'primary.main' : isCompleted ? 'text.primary' : 'text.secondary'
                          }}
                        >
                          {step.label}
                        </Typography>
                      </Stack>

                      <Box>
                        {isCompleted ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Box sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                              <SvgIcon name="tabler-circle-check" size={20} color="inherit" />
                            </Box>
                          </motion.div>
                        ) : isActive ? (
                          <CircularProgress size={16} thickness={5} />
                        ) : (
                          <Box sx={{ color: 'grey.300', display: 'flex', alignItems: 'center' }}>
                            <SvgIcon name="tabler-circle" size={20} color="inherit" />
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
