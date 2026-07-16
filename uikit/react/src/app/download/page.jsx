'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// @third-party
import { motion } from 'motion/react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import LogoMain from '@/components/logo/LogoMain';
import SvgIcon from '@/components/SvgIcon';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';
import axiosInstance from '@/utils/axios';

export default function DownloadPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [downloading, setDownloading] = useState(false);
  const [subdomain, setSubdomain] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Protected route check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Set initial subdomain suggestion based on user name
  useEffect(() => {
    if (user?.name) {
      setSubdomain(user.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
  }, [user]);

  const handleDownloadZip = async () => {
    setDownloading(true);
    setError('');
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const downloadUrl = apiBase.replace('/api', '/download-portfolio');
      
      // Perform window download
      window.location.href = downloadUrl;
      setSuccess('Your portfolio ZIP package is downloading! 📦');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error(err);
      setError('Could not generate the download package.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeploy = async () => {
    if (!user?.isPremium) {
      setError('Hosting is a premium feature. Please upgrade your subscription on the dashboard to unlock! 💎');
      return;
    }
    if (!subdomain) {
      setError('Please choose a valid subdomain name.');
      return;
    }
    setDeploying(true);
    setError('');
    setSuccess('');
    try {
      // Simulate API deployment request
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setDeployedUrl(`https://${subdomain}.nexfolio.io`);
      setSuccess('Your portfolio site is now hosted live! 🚀');
    } catch (err) {
      console.error(err);
      setError('Hosting deployment failed. Please try again.');
    } finally {
      setDeploying(false);
    }
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        ...getBackgroundDots(theme.vars.palette.grey[300], 2, 40)
      }}
    >
      {/* Header bar */}
      <Box sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'grey.300', py: 2 }}>
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <LogoMain />
            <Button
              variant="outlined"
              size="small"
              onClick={() => router.push('/portfolio-preview')}
              startIcon={<SvgIcon name="tabler-arrow-left" size={16} />}
              sx={{ borderRadius: 2.5, fontWeight: 600 }}
            >
              Back to Preview
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Main Content Body */}
      <Container maxWidth="md" sx={{ py: 6, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
        <Stack sx={{ gap: 4, mb: 5, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 600 }}>
            Claim Your Portfolio Website
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            Download your portfolio files to run locally, or deploy them directly to our global cloud CDN network with a single click.
          </Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>{success}</Alert>}

        <Grid container spacing={4}>
          {/* Card 1: Direct Zip Download */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Card sx={{ p: 4, height: '100%', borderRadius: 5, border: '1px solid', borderColor: 'grey.300', boxShadow: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 4 }}>
                <Stack sx={{ gap: 2 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'primary.lighter', borderRadius: 3.5, width: 'fit-content' }}>
                    <SvgIcon name="tabler-file-zip" size={24} color={theme.vars.palette.primary.main} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>Download Source Code</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Get a production-ready package containing all HTML, CSS, JavaScript, assets, and parsed data. Ready to load in any browser or edit yourself.
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleDownloadZip}
                  disabled={downloading}
                  startIcon={downloading ? <CircularProgress size={18} /> : <SvgIcon name="tabler-download" size={18} />}
                  sx={{ borderRadius: 3, py: 1.5, fontWeight: 600 }}
                >
                  {downloading ? 'Preparing ZIP...' : 'Download ZIP Package'}
                </Button>
              </Card>
            </motion.div>
          </Grid>

          {/* Card 2: Custom Domain Hosting */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Card sx={{ p: 4, height: '100%', borderRadius: 5, border: '1px solid', borderColor: 'primary.light', bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 4 }}>
                <Stack sx={{ gap: 2.5 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ p: 1.5, bgcolor: 'success.lighter', borderRadius: 3.5, width: 'fit-content' }}>
                      <SvgIcon name="tabler-cloud-upload" size={24} color={theme.vars.palette.success.main} />
                    </Box>
                    <Paper elevation={0} sx={{ px: 1.5, py: 0.5, bgcolor: 'primary.lighter', borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>PREMIUM</Typography>
                    </Paper>
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>Deploy & Host Live</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Select a unique domain name to publish your portfolio. We deploy your files to our worldwide high-speed servers instantly.
                  </Typography>

                  <TextField
                    label="Subdomain"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    fullWidth
                    disabled={deploying || Boolean(deployedUrl)}
                    variant="outlined"
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">.nexfolio.io</InputAdornment>,
                        sx: { borderRadius: 3 }
                      }
                    }}
                  />
                </Stack>

                {deployedUrl ? (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    href={deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<SvgIcon name="tabler-external-link" size={18} />}
                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 600, boxShadow: 'none' }}
                  >
                    Open Live Portfolio
                  </Button>
                ) : !user?.isPremium ? (
                  <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    onClick={async () => {
                      router.push('/dashboard');
                    }}
                    startIcon={<SvgIcon name="tabler-crown" size={18} />}
                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 600, boxShadow: `0 6px 20px ${withAlpha(theme.vars.palette.warning.main, 0.15)}` }}
                  >
                    Unlock Live Hosting
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleDeploy}
                    disabled={deploying}
                    startIcon={deploying ? <CircularProgress size={18} color="inherit" /> : <SvgIcon name="tabler-rocket" size={18} />}
                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 600, boxShadow: `0 6px 20px ${withAlpha(theme.vars.palette.primary.main, 0.15)}` }}
                  >
                    {deploying ? 'Deploying to cloud...' : 'Deploy to Nexfolio'}
                  </Button>
                )}
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
