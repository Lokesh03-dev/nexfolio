'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

// @third-party
import { motion, AnimatePresence } from 'motion/react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import LogoMain from '@/components/logo/LogoMain';
import SvgIcon from '@/components/SvgIcon';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';

const TEMPLATES = [
  {
    id: 'classic',
    title: 'Classic vCard Theme',
    description: 'Dark-themed vCard portfolio with yellow accent colors. Features a fixed sidebar (photo, contact info, socials) and tabbed pages: About, Resume, Portfolio, Blog & Contact.',
    image: '/assets/images/classic_theme.png',
    color: '#FFD700',
    isPremium: false
  },
  {
    id: 'minimalist',
    title: 'Minimalist Theme',
    description: 'Clean space, stark layout, and exquisite typography. Ideal for minimalist designers and writers.',
    image: '/assets/images/minimalist_theme.png',
    color: '#333333',
    isPremium: true
  },
  {
    id: 'modern',
    title: 'Modern Theme',
    description: 'Vibrant glassmorphic elements, soft glow backdrops, and interactive cards. Best for modern tech stack portfolios.',
    image: '/assets/images/modern_theme.png',
    color: '#1877F2',
    isPremium: true
  },
  {
    id: 'creative',
    title: 'Creative Theme',
    description: 'Bold purple-violet gradients, abstract grid flows, and micro-interactions. Best for artists and UI designers.',
    image: '/assets/images/creative_theme.png',
    color: '#7B2CBF',
    isPremium: true
  },
  {
    id: 'professional',
    title: 'Professional Theme',
    description: 'Highly structured layout grid with blue business accents. Ideal for managers and backend/DevOps engineers.',
    image: '/assets/images/professional_theme.png',
    color: '#0077B5',
    isPremium: true
  }
];

export default function TemplateSelectionPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, upgradeUser, logout } = useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  // Protected route redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSelect = (tpl) => {
    if (tpl.isPremium && !user?.isPremium) {
      // Locked template clicked -> Open upgrade dialog
      setShowUpgradeModal(true);
      return;
    }
    setSelectedTemplate(tpl.id);
    localStorage.setItem('nexfolio_selected_template', tpl.id);
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    setAlertMsg('');
    try {
      // Simulate Stripe checkout callback
      setTimeout(async () => {
        const result = await upgradeUser();
        if (result.success) {
          setUpgradeSuccess(true);
          setUpgrading(false);
          // Auto close modal and select template after success animation
          setTimeout(() => {
            setShowUpgradeModal(false);
            setUpgradeSuccess(false);
          }, 2000);
        } else {
          setAlertMsg(result.message);
          setUpgrading(false);
        }
      }, 1500);
    } catch (error) {
      setAlertMsg('Payment processing encountered an error. Please try again.');
      setUpgrading(false);
    }
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      router.push('/portfolio-generation');
    }
  };

  const handleBack = () => {
    router.push('/resume-analysis');
  };

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
              {/* Premium user badge */}
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
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 6 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 500 }}>
              Select Portfolio Template
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Choose a design template for your portfolio site. **Classic** is free; upgrade to **Pro** to unlock all other designs.
            </Typography>
          </Box>
          <Stack direction="row" sx={{ gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<SvgIcon name="tabler-arrow-left" size={18} color="inherit" />}
              sx={{ borderRadius: 3, px: 3, fontWeight: 600 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleContinue}
              disabled={!selectedTemplate}
              endIcon={<SvgIcon name="tabler-arrow-right" size={18} color="inherit" />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                boxShadow: selectedTemplate ? `0 8px 20px ${withAlpha(theme.vars.palette.primary.main, 0.15)}` : 'none'
              }}
            >
              Generate Portfolio
            </Button>
          </Stack>
        </Stack>

        {/* Templates Grid */}
        <Grid container spacing={4}>
          {TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            const isLocked = tpl.isPremium && !user?.isPremium;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tpl.id}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    onClick={() => handleSelect(tpl)}
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 5,
                      border: '2px solid',
                      borderColor: isSelected ? 'primary.main' : isLocked ? 'grey.300' : 'grey.300',
                      bgcolor: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      boxShadow: isSelected ? `0 15px 35px ${withAlpha(theme.vars.palette.primary.main, 0.08)}` : '0 10px 25px rgba(0, 0, 0, 0.03)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Active Selection Indicator */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'primary.main',
                          color: 'background.default',
                          borderRadius: '50%',
                          p: 0.75,
                          display: 'flex',
                          zIndex: 2,
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        <SvgIcon name="tabler-check" size={16} color="inherit" stroke={3} />
                      </Box>
                    )}

                    {/* Premium / Free Lock Indicator */}
                    {tpl.isPremium && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          bgcolor: isLocked ? 'grey.900' : '#856404',
                          color: 'background.default',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          zIndex: 2,
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        <SvgIcon name={isLocked ? 'tabler-lock' : 'tabler-crown'} size={14} color="inherit" />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'inherit' }}>
                          {isLocked ? 'PREMIUM' : 'UNLOCKED'}
                        </Typography>
                      </Box>
                    )}

                    {!tpl.isPremium && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          bgcolor: 'success.main',
                          color: 'background.default',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5,
                          zIndex: 2,
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'inherit' }}>
                          FREE
                        </Typography>
                      </Box>
                    )}

                    {/* Template Preview Image */}
                    <Box sx={{ position: 'relative', pt: '60%', bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.200', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={tpl.image}
                        alt={tpl.title}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          filter: isLocked ? 'grayscale(30%) blur(1px)' : 'none',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1.2 }}>
                        {tpl.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {tpl.description}
                      </Typography>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: isSelected ? withAlpha(theme.vars.palette.primary.lighter, 0.1) : 'transparent' }}>
                      <Button
                        variant="text"
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(tpl);
                        }}
                        startIcon={<SvgIcon name="tabler-eye" size={16} />}
                        sx={{ borderRadius: 2, fontWeight: 600, color: 'text.secondary' }}
                      >
                        Preview Image
                      </Button>
                      <Button
                        variant={isSelected ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(tpl);
                        }}
                        sx={{ borderRadius: 2, fontWeight: 600, px: 2.5 }}
                      >
                        {isLocked ? 'Unlock' : isSelected ? 'Selected' : 'Select'}
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Image Preview Modal */}
      <Dialog
        open={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            overflow: 'hidden',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'grey.300',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        {previewTemplate && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {previewTemplate.title} Mockup Preview
              </Typography>
              <IconButton onClick={() => setPreviewTemplate(null)} sx={{ color: 'text.secondary' }}>
                <SvgIcon name="tabler-x" size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, pt: 1 }}>
              <Box
                sx={{
                  borderRadius: 4,
                  border: '1.5px solid',
                  borderColor: 'grey.300',
                  overflow: 'hidden',
                  bgcolor: 'grey.100',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
                }}
              >
                <img
                  src={previewTemplate.image}
                  alt={previewTemplate.title}
                  style={{ width: '100%', display: 'block', objectFit: 'contain', maxHeight: '70vh' }}
                />
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Upgrade Subscription Modal */}
      <Dialog
        open={showUpgradeModal}
        onClose={() => !upgrading && setShowUpgradeModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            overflow: 'hidden',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'grey.300',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15)',
            p: 4,
            textAlign: 'center'
          }
        }}
      >
        <AnimatePresence mode="wait">
          {!upgradeSuccess ? (
            <motion.div
              key="upgrade-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Stack sx={{ alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    boxShadow: `0 8px 24px ${withAlpha(theme.vars.palette.primary.main, 0.12)}`,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <SvgIcon name="tabler-crown" size={36} color="inherit" />
                </Box>

                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 600 }}>Upgrade to Premium</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    Unlock all premium themes, custom domains, high-fidelity exports, and PDF templates.
                  </Typography>
                </Box>

                {alertMsg && (
                  <Alert severity="error" sx={{ width: '100%', borderRadius: 3, textAlign: 'left' }}>
                    {alertMsg}
                  </Alert>
                )}

                {/* Billing Summary */}
                <Box sx={{ width: '100%', bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200', borderRadius: 4, p: 3, my: 1.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                    LIFETIME ACCESS
                  </Typography>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    $19 <span style={{ fontSize: '1rem', fontWeight: 500, color: theme.palette.text.secondary }}>one-time</span>
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack sx={{ gap: 1, textAlign: 'left' }}>
                    {[
                      'Access to Minimal, Modern, Creative & Professional themes',
                      'Direct code download and live hosting',
                      'SEO optimization & customizable blogs',
                      '24/7 dedicated support status'
                    ].map((feature, idx) => (
                      <Stack direction="row" key={idx} sx={{ gap: 1, alignItems: 'center' }}>
                        <SvgIcon name="tabler-circle-check" size={16} color={theme.vars.palette.success.main} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Checkout Simulator button */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, boxShadow: `0 8px 24px ${withAlpha(theme.vars.palette.primary.main, 0.15)}` }}
                >
                  {upgrading ? <CircularProgress size={24} sx={{ color: 'background.default' }} /> : 'Upgrade to Pro'}
                </Button>

                <Button
                  variant="text"
                  onClick={() => setShowUpgradeModal(false)}
                  disabled={upgrading}
                  sx={{ borderRadius: 2.5, color: 'text.secondary', fontWeight: 600 }}
                >
                  No thanks, continue with Classic
                </Button>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="upgrade-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Stack sx={{ alignItems: 'center', gap: 2.5, py: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'success.lighter',
                    color: 'success.main',
                    boxShadow: `0 8px 24px ${withAlpha(theme.vars.palette.success.main, 0.12)}`,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <SvgIcon name="tabler-circle-check" size={40} color="inherit" stroke={3} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 600, color: 'success.main' }}>
                    Payment Successful! 🎉
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    Thank you! Your account has been upgraded to **Pro**. All templates are now unlocked.
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </Box>
  );
}
