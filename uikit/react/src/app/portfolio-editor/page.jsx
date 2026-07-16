'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';

// @third-party
import { motion } from 'motion/react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import LogoMain from '@/components/logo/LogoMain';
import SvgIcon from '@/components/SvgIcon';
import axiosInstance from '@/utils/axios';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';

export default function PortfolioEditorPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [resumeData, setResumeData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [iframeUrl, setIframeUrl] = useState('');

  // Protected route redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch resume data
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axiosInstance.get('/resume-data');
        if (response.data) {
          setResumeData(response.data);
        }
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError('Could not retrieve portfolio details.');
      } finally {
        setFetching(false);
      }
    };
    if (isAuthenticated) {
      fetchResumeData();
    }
  }, [isAuthenticated]);

  // Construct iframe preview URL
  useEffect(() => {
    if (isAuthenticated) {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      setIframeUrl(apiBase.replace('/api', '/portfolio'));
    }
  }, [isAuthenticated]);

  const handleFieldChange = (section, field, value, index = null, subField = null) => {
    setResumeData((prev) => {
      const copy = { ...prev };
      if (index === null) {
        copy[section][field] = value;
      } else if (subField === null) {
        copy[section][field][index] = value;
      } else {
        copy[section][index][subField] = value;
      }
      return copy;
    });
  };

  const handleAddProject = () => {
    setResumeData((prev) => {
      const copy = { ...prev };
      if (!copy.portfolio) copy.portfolio = [];
      copy.portfolio.push({ name: 'New Project', description: 'Project description.', image: './images/project-1.jpg', url: 'https://github.com' });
      return copy;
    });
  };

  const handleRemoveProject = (index) => {
    setResumeData((prev) => {
      const copy = { ...prev };
      copy.portfolio.splice(index, 1);
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Keep contactInfo inside JSON matching basic details
      const copy = { ...resumeData };
      copy.contactInfo = [
        { icon: 'mail-outline', title: 'Email', link: `mailto:${copy.basics.email}`, value: copy.basics.email },
        { icon: 'phone-portrait-outline', title: 'Phone', link: `tel:${copy.basics.phone}`, value: copy.basics.phone },
        { icon: 'calendar-outline', title: 'Birthday', value: copy.basics.birthday },
        { icon: 'location-outline', title: 'Location', value: copy.basics.location }
      ];

      const response = await axiosInstance.post('/resume-data', copy);
      if (response.data) {
        setResumeData(copy);
        setSuccess('Changes applied to preview! 🚀');
        // Refresh iframe to see updates
        setIframeKey(Date.now());
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to apply changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleExit = () => {
    router.push('/portfolio-preview');
  };

  if (isLoading || fetching) {
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
        bgcolor: 'grey.50',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Editor Topbar Header */}
      <Box sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'grey.300', py: 1.5, px: 3, zIndex: 10 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
            <LogoMain />
            <Divider orientation="vertical" flexItem />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Live Portfolio Editor
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleExit}
              startIcon={<SvgIcon name="tabler-arrow-back" size={16} />}
              sx={{ borderRadius: 2.5, fontWeight: 600 }}
            >
              Exit Editor
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SvgIcon name="tabler-device-floppy" size={16} />}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 3 }}
            >
              Apply Changes
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Editor Core Body */}
      <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Left Scrollable Customize Panel */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ height: '100%', overflowY: 'auto', p: 3, borderRight: '1px solid', borderColor: 'grey.300' }}>
          <Stack sx={{ gap: 3.5, pb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>Customize Portfolio</Typography>
            
            {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}

            {/* Profile Basics Accordion */}
            <Accordion elevation={0} defaultExpanded sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: '12px !important', overflow: 'hidden' }}>
              <AccordionSummary expandIcon={<SvgIcon name="tabler-chevron-down" size={18} />} sx={{ bgcolor: 'grey.50', py: 1 }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                  <SvgIcon name="tabler-user" size={18} color={theme.vars.palette.primary.main} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Profile Details</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Name"
                  value={resumeData?.basics?.name || ''}
                  onChange={(e) => handleFieldChange('basics', 'name', e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{ input: { sx: { borderRadius: 3 } } }}
                />
                <TextField
                  label="Professional Title"
                  value={resumeData?.basics?.label || ''}
                  onChange={(e) => handleFieldChange('basics', 'label', e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{ input: { sx: { borderRadius: 3 } } }}
                />
                <TextField
                  label="Email"
                  value={resumeData?.basics?.email || ''}
                  onChange={(e) => handleFieldChange('basics', 'email', e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{ input: { sx: { borderRadius: 3 } } }}
                />
                <TextField
                  label="Phone"
                  value={resumeData?.basics?.phone || ''}
                  onChange={(e) => handleFieldChange('basics', 'phone', e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{ input: { sx: { borderRadius: 3 } } }}
                />
                <TextField
                  label="Location"
                  value={resumeData?.basics?.location || ''}
                  onChange={(e) => handleFieldChange('basics', 'location', e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{ input: { sx: { borderRadius: 3 } } }}
                />
                <TextField
                  label="Biography / About"
                  value={resumeData?.basics?.about?.[0] || ''}
                  onChange={(e) => handleFieldChange('basics', 'about', e.target.value, 0)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  slotProps={{ input: { sx: { borderRadius: 3 } } }}
                />
              </AccordionDetails>
            </Accordion>

            {/* Projects / Works Accordion */}
            <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: '12px !important', overflow: 'hidden' }}>
              <AccordionSummary expandIcon={<SvgIcon name="tabler-chevron-down" size={18} />} sx={{ bgcolor: 'grey.50', py: 1 }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                  <SvgIcon name="tabler-briefcase" size={18} color={theme.vars.palette.primary.main} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Portfolio Projects</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Manage works displayed in the portfolio section.
                  </Typography>
                  <Button variant="outlined" size="small" onClick={handleAddProject} startIcon={<SvgIcon name="tabler-plus" size={14} />} sx={{ borderRadius: 2 }}>
                    Add Project
                  </Button>
                </Stack>
                {resumeData?.portfolio?.map((proj, idx) => (
                  <Paper key={idx} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.300', borderRadius: 3.5, position: 'relative', bgcolor: 'background.default' }}>
                    <IconButton onClick={() => handleRemoveProject(idx)} sx={{ position: 'absolute', top: 8, right: 8, color: 'error.main' }}>
                      <SvgIcon name="tabler-trash" size={16} />
                    </IconButton>
                    <Stack sx={{ gap: 2, mt: 1 }}>
                      <TextField
                        label="Project Name"
                        value={proj.name}
                        onChange={(e) => handleFieldChange('portfolio', null, e.target.value, idx, 'name')}
                        fullWidth
                        variant="outlined"
                        slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                      />
                      <TextField
                        label="Project Link / URL"
                        value={proj.url}
                        onChange={(e) => handleFieldChange('portfolio', null, e.target.value, idx, 'url')}
                        fullWidth
                        variant="outlined"
                        slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                      />
                      <TextField
                        label="Project Description"
                        value={proj.description}
                        onChange={(e) => handleFieldChange('portfolio', null, e.target.value, idx, 'description')}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                      />
                    </Stack>
                  </Paper>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Achievements Accordion */}
            <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: '12px !important', overflow: 'hidden' }}>
              <AccordionSummary expandIcon={<SvgIcon name="tabler-chevron-down" size={18} />} sx={{ bgcolor: 'grey.50', py: 1 }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                  <SvgIcon name="tabler-award" size={18} color={theme.vars.palette.primary.main} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Achievements</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {resumeData?.achievements?.map((ach, idx) => (
                  <Stack key={idx} sx={{ gap: 2 }}>
                    <TextField
                      label={`Achievement #${idx + 1}`}
                      value={ach.title}
                      onChange={(e) => handleFieldChange('achievements', null, e.target.value, idx, 'title')}
                      fullWidth
                      variant="outlined"
                      slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                    />
                    <TextField
                      label="Description"
                      value={ach.description}
                      onChange={(e) => handleFieldChange('achievements', null, e.target.value, idx, 'description')}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                    />
                    {idx < resumeData.achievements.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Stack>
                ))}
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>

        {/* Right IFrame Preview Panel */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ height: '100%', bgcolor: 'grey.200', p: 3, display: 'flex', flexDirection: 'column' }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'grey.50',
              border: '1.5px solid',
              borderColor: 'grey.300',
              borderBottom: 'none',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              px: 2.5,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {/* Mock browser dots */}
            <Stack direction="row" sx={{ gap: 1, mr: 3 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
            </Stack>

            {/* Address bar */}
            <Box
              sx={{
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                flexGrow: 1,
                maxWidth: 400,
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <SvgIcon name="tabler-lock-check" size={12} color={theme.vars.palette.success.main} />
                preview.nexfolio.io
              </Typography>
            </Box>
          </Paper>
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
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
              position: 'relative'
            }}
          >
            {iframeUrl ? (
              <iframe
                key={iframeKey}
                src={`${iframeUrl}?cb=${iframeKey}`}
                title="Live editor preview"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
