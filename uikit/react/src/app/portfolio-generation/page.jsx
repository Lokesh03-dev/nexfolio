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
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';

const GENERATION_STEPS = [
  { id: 0, label: 'Verifying selected template...', icon: 'tabler-template', duration: 1500 },
  { id: 1, label: 'Compiling theme files...', icon: 'tabler-file-code-2', duration: 1800 },
  { id: 2, label: 'Injecting parsed resume data...', icon: 'tabler-database-import', duration: 2200 },
  { id: 3, label: 'Optimizing assets and styles...', icon: 'tabler-photo-sparkle', duration: 1500 },
  { id: 4, label: 'Generating static HTML site...', icon: 'tabler-html', duration: 2000 },
  { id: 5, label: 'Deploying live preview URL...', icon: 'tabler-cloud-share', duration: 1800 }
];

export default function PortfolioGenerationPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Protected route redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle step progress animations
  useEffect(() => {
    if (!isAuthenticated) return;

    const runSteps = (stepIndex) => {
      if (stepIndex >= GENERATION_STEPS.length) {
        // Redirect to preview page when complete
        setTimeout(() => {
          router.push('/portfolio-preview');
        }, 1200);
        return;
      }

      const currentStep = GENERATION_STEPS[stepIndex];
      setActiveStep(stepIndex);

      const startProgress = (stepIndex / GENERATION_STEPS.length) * 100;
      const endProgress = ((stepIndex + 1) / GENERATION_STEPS.length) * 100;
      const stepDuration = currentStep.duration;

      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(elapsed / stepDuration, 1);
        setProgress(startProgress + ratio * (endProgress - startProgress));

        if (ratio === 1) {
          clearInterval(progressInterval);
          setCompletedSteps((prev) => [...prev, stepIndex]);
          runSteps(stepIndex + 1);
        }
      }, 50);
    };

    runSteps(0);
  }, [isAuthenticated, router]);

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
        bgcolor: 'grey.100',
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
              {user?.isPremium && (
                <Box sx={{ px: 2, py: 0.5, bgcolor: '#FFF3CD', border: '1px solid #FFEBAA', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#856404', fontWeight: 700 }}>
                    👑 PRO PLAN
                  </Typography>
                </Box>
              )}
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
            transition={{ duration: 0.6, ease: 'easeOut' }}
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
              {/* Rotating Gear/Progress Indicator */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '50%',
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      boxShadow: `0 0 20px ${withAlpha(theme.vars.palette.primary.main, 0.15)}`,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <SvgIcon name="tabler-settings-spark" size={40} color="inherit" />
                  </Box>
                </motion.div>
              </Box>

              <Typography variant="h3" align="center" sx={{ fontWeight: 500, mb: 1 }}>
                Generating Your Portfolio
              </Typography>
              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                Please stand by while we build and configure your static web templates.
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
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Finalizing code bundle...
                  </Typography>
                </Stack>
              </Stack>

              {/* Step By Step Checklist */}
              <Stack sx={{ gap: 2.5 }}>
                {GENERATION_STEPS.map((step) => {
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
