'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';

// @third-party
import { motion } from 'motion/react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import LogoMain from '@/components/logo/LogoMain';
import SvgIcon from '@/components/SvgIcon';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';

const VIEWPORTS = {
  desktop: { width: '100%', height: '100%', label: 'Desktop', icon: 'tabler-device-desktop' },
  tablet: { width: '768px', height: '100%', label: 'Tablet', icon: 'tabler-device-tablet' },
  mobile: { width: '375px', height: '100%', label: 'Mobile', icon: 'tabler-device-mobile' }
};

export default function PortfolioPreviewPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [viewport, setViewport] = useState('desktop');
  const [iframeUrl, setIframeUrl] = useState('');

  // Protected route redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Construct preview URL dynamically
  useEffect(() => {
    if (isAuthenticated) {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const previewUrl = apiBase.replace('/api', '/portfolio');
      // Append a cache-buster query param so the iframe reloads when user changes details
      setIframeUrl(`${previewUrl}?cb=${Date.now()}`);
    }
  }, [isAuthenticated]);

  const handleViewportChange = (event, newViewport) => {
    if (newViewport !== null) {
      setViewport(newViewport);
    }
  };

  const handleBack = () => {
    router.push('/template-selection');
  };

  const handleEditor = () => {
    router.push('/portfolio-editor');
  };

  const handleDownload = () => {
    router.push('/download');
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
        height: '100vh',
        bgcolor: 'grey.100',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* App Navbar */}
      <Box sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'grey.300', py: 1.5, zIndex: 10 }}>
        <Container maxWidth="xl">
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            
            {/* Left Section: Logo & Actions */}
            <Stack direction="row" sx={{ alignItems: 'center', gap: 3 }}>
              <LogoMain />
              <Button
                variant="outlined"
                size="small"
                onClick={handleBack}
                startIcon={<SvgIcon name="tabler-arrow-left" size={16} />}
                sx={{ borderRadius: 2.5, fontWeight: 600, display: { xs: 'none', md: 'flex' } }}
              >
                Change Theme
              </Button>
            </Stack>

            {/* Middle Section: Viewport Controls */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 3, p: 0.5, display: 'flex' }}>
              <ToggleButtonGroup
                value={viewport}
                exclusive
                onChange={handleViewportChange}
                size="small"
                aria-label="device viewport"
                sx={{ gap: 0.5, border: 'none', '& .MuiToggleButton-root': { border: 'none', borderRadius: 2 } }}
              >
                {Object.entries(VIEWPORTS).map(([key, value]) => (
                  <ToggleButton key={key} value={key} aria-label={value.label} sx={{ px: 2, py: 0.75 }}>
                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                      <SvgIcon name={value.icon} size={16} color="inherit" />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{value.label}</Typography>
                    </Stack>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Paper>

            {/* Right Section: Customization / Actions */}
            <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEditor}
                startIcon={<SvgIcon name="tabler-edit-circle" size={16} />}
                sx={{ borderRadius: 3, fontWeight: 600, py: 1 }}
              >
                Customize Details
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownload}
                endIcon={<SvgIcon name="tabler-download" size={16} />}
                sx={{ borderRadius: 3, fontWeight: 600, py: 1, boxShadow: `0 6px 16px ${withAlpha(theme.vars.palette.primary.main, 0.12)}` }}
              >
                Download & Host
              </Button>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' } }} />
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, display: { xs: 'none', sm: 'flex' } }}>
                <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 600, width: 36, height: 36, border: '1px solid', borderColor: 'primary.light' }}>
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Viewport Frame Area */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: VIEWPORTS[viewport].width }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%'
          }}
        >
          {/* Mock Browser Header */}
          <Paper
            elevation={0}
            sx={{
              border: '1.5px solid',
              borderColor: 'grey.300',
              borderBottom: 'none',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              bgcolor: 'grey.50',
              px: 2.5,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {/* Browser circles */}
            <Stack direction="row" sx={{ gap: 1, width: 60 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
            </Stack>

            {/* Address Bar */}
            <Box
              sx={{
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                width: '60%',
                maxWidth: 400,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <SvgIcon name="tabler-lock-check" size={12} color={theme.vars.palette.success.main} />
                {user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'portfolio'}.nexfolio.io
              </Typography>
            </Box>

            <Box sx={{ width: 60, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton size="small" onClick={() => setIframeUrl(prev => prev.split('?')[0] + `?cb=${Date.now()}`)} title="Reload page">
                <SvgIcon name="tabler-reload" size={14} />
              </IconButton>
            </Box>
          </Paper>

          {/* IFrame Website Body */}
          <Paper
            elevation={0}
            sx={{
              flexGrow: 1,
              border: '1.5px solid',
              borderColor: 'grey.300',
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              overflow: 'hidden',
              bgcolor: 'background.default',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
              position: 'relative'
            }}
          >
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                title="Portfolio Website Live Preview"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
