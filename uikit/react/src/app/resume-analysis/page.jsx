'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';

// @third-party
import { motion, AnimatePresence } from 'motion/react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import LogoMain from '@/components/logo/LogoMain';
import SvgIcon from '@/components/SvgIcon';
import axiosInstance from '@/utils/axios';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';

const SECTIONS = [
  { id: 'basics', label: 'Basic Details', icon: 'tabler-user' },
  { id: 'services', label: 'Services offered', icon: 'tabler-award' },
  { id: 'experience', label: 'Work Experience', icon: 'tabler-briefcase' },
  { id: 'education', label: 'Education', icon: 'tabler-school' },
  { id: 'skills', label: 'Skills & Expertise', icon: 'tabler-tools' }
];

export default function ResumeAnalysisPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('basics');
  const [resumeData, setResumeData] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Protected route redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch parsed resume data on load
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axiosInstance.get('/resume-data');
        if (response.data) {
          setResumeData(response.data);
          // Set initial editing copy
          setEditingData(JSON.parse(JSON.stringify(response.data)));
        }
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError('Could not retrieve parsed resume details. Please complete the resume upload first.');
      } finally {
        setFetching(false);
      }
    };
    if (isAuthenticated) {
      fetchResumeData();
    }
  }, [isAuthenticated]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edits, restore original data
      setEditingData(JSON.parse(JSON.stringify(resumeData)));
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleFieldChange = (section, field, value, index = null, subField = null) => {
    setEditingData((prev) => {
      const copy = { ...prev };
      if (index === null) {
        // Direct field (e.g. basics.name)
        copy[section][field] = value;
      } else if (subField === null) {
        // Array item direct field (e.g. basics.about[0])
        copy[section][field][index] = value;
      } else {
        // Array of objects (e.g. services[0].title)
        copy[section][index][subField] = value;
      }
      return copy;
    });
  };

  const handleAddItem = (section) => {
    setEditingData((prev) => {
      const copy = { ...prev };
      if (section === 'services') {
        copy.services.push({ title: 'New Service', description: 'Description of the service offered.', icon: 'https://placehold.co/40x40/cccccc/333333?text=NS' });
      } else if (section === 'education') {
        copy.education.push({ title: 'New Degree', dates: '2024 - Present', description: 'Institution name or details.' });
      } else if (section === 'experience') {
        copy.experience.push({ title: 'New Job Title', dates: '2024 - Present', description: 'Responsibilities and achievements.' });
      } else if (section === 'skills') {
        copy.skills.push({ title: 'New Skill', percentage: 80 });
      }
      return copy;
    });
  };

  const handleRemoveItem = (section, index) => {
    setEditingData((prev) => {
      const copy = { ...prev };
      copy[section].splice(index, 1);
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.post('/resume-data', editingData);
      if (response.data) {
        setResumeData(editingData);
        setSuccess('Resume details saved successfully! 💾');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async () => {
    // Save any pending edits
    if (isEditing) {
      await handleSave();
    }
    router.push('/template-selection');
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

      {/* Content Area */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 6 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 500 }}>
              Resume Analysis
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Review and customize the extracted details below before selecting your portfolio theme.
            </Typography>
          </Box>
          <Stack direction="row" sx={{ gap: 2 }}>
            <Button
              variant="outlined"
              color={isEditing ? 'error' : 'primary'}
              onClick={handleEditToggle}
              startIcon={<SvgIcon name={isEditing ? 'tabler-x' : 'tabler-edit'} size={18} color="inherit" />}
              sx={{ borderRadius: 3, px: 3, fontWeight: 600 }}
              disabled={saving}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Section'}
            </Button>
            {isEditing && (
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SvgIcon name="tabler-check" size={18} color="inherit" />}
                sx={{ borderRadius: 3, px: 3, fontWeight: 600 }}
                disabled={saving}
              >
                Save
              </Button>
            )}
            {!isEditing && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinue}
                endIcon={<SvgIcon name="tabler-arrow-right" size={18} color="inherit" />}
                sx={{ borderRadius: 3, px: 3, py: 1, fontWeight: 600, boxShadow: `0 8px 20px ${withAlpha(theme.vars.palette.primary.main, 0.15)}` }}
              >
                Continue
              </Button>
            )}
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left Sidebar Navigation */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'grey.300',
                bgcolor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 90
              }}
            >
              <Stack sx={{ gap: 1 }}>
                {SECTIONS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant={isActive ? 'contained' : 'text'}
                      color={isActive ? 'primary' : 'inherit'}
                      fullWidth
                      startIcon={<SvgIcon name={tab.icon} size={18} color="inherit" />}
                      sx={{
                        justifyContent: 'flex-start',
                        py: 1.5,
                        px: 2.5,
                        borderRadius: 3,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'primary.contrastText' : 'text.secondary',
                        bgcolor: isActive ? 'primary.main' : 'transparent',
                        '&:hover': {
                          bgcolor: isActive ? 'primary.dark' : 'grey.100',
                          color: isActive ? 'primary.contrastText' : 'text.primary'
                        }
                      }}
                    >
                      {tab.label}
                    </Button>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Main Edit Area */}
          <Grid size={{ xs: 12, md: 9 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    p: { xs: 3.5, sm: 5 },
                    borderRadius: 5,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    bgcolor: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {/* BASICS SECTION */}
                  {activeTab === 'basics' && editingData?.basics && (
                    <Stack sx={{ gap: 3.5 }}>
                      <Typography variant="h3" sx={{ fontWeight: 500, mb: 1 }}>Basic Information</Typography>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Full Name"
                            value={editingData.basics.name}
                            onChange={(e) => handleFieldChange('basics', 'name', e.target.value)}
                            disabled={!isEditing}
                            fullWidth
                            variant="outlined"
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Professional Title"
                            value={editingData.basics.label}
                            onChange={(e) => handleFieldChange('basics', 'label', e.target.value)}
                            disabled={!isEditing}
                            fullWidth
                            variant="outlined"
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Email Address"
                            value={editingData.basics.email}
                            onChange={(e) => handleFieldChange('basics', 'email', e.target.value)}
                            disabled={!isEditing}
                            fullWidth
                            variant="outlined"
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Phone Number"
                            value={editingData.basics.phone}
                            onChange={(e) => handleFieldChange('basics', 'phone', e.target.value)}
                            disabled={!isEditing}
                            fullWidth
                            variant="outlined"
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Location"
                            value={editingData.basics.location}
                            onChange={(e) => handleFieldChange('basics', 'location', e.target.value)}
                            disabled={!isEditing}
                            fullWidth
                            variant="outlined"
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Birthday / Other Details"
                            value={editingData.basics.birthday}
                            onChange={(e) => handleFieldChange('basics', 'birthday', e.target.value)}
                            disabled={!isEditing}
                            fullWidth
                            variant="outlined"
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          />
                        </Grid>
                        <Grid size={12}>
                          <TextField
                            label="About & Biography"
                            value={editingData.basics.about?.[0] || ''}
                            onChange={(e) => handleFieldChange('basics', 'about', e.target.value, 0)}
                            disabled={!isEditing}
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  )}

                  {/* SERVICES SECTION */}
                  {activeTab === 'services' && editingData?.services && (
                    <Stack sx={{ gap: 4 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500 }}>Services Offered</Typography>
                        {isEditing && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleAddItem('services')}
                            startIcon={<SvgIcon name="tabler-plus" size={16} />}
                            sx={{ borderRadius: 2.5 }}
                          >
                            Add Service
                          </Button>
                        )}
                      </Stack>
                      <Stack sx={{ gap: 3.5 }}>
                        {editingData.services.map((service, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 3,
                              border: '1.5px solid',
                              borderColor: 'grey.300',
                              borderRadius: 4,
                              position: 'relative',
                              bgcolor: 'background.default'
                            }}
                          >
                            {isEditing && (
                              <IconButton
                                onClick={() => handleRemoveItem('services', index)}
                                sx={{ position: 'absolute', top: 12, right: 12, color: 'error.main' }}
                              >
                                <SvgIcon name="tabler-trash" size={18} />
                              </IconButton>
                            )}
                            <Stack sx={{ gap: 2.5 }}>
                              <TextField
                                label="Service Title"
                                value={service.title}
                                onChange={(e) => handleFieldChange('services', null, e.target.value, index, 'title')}
                                disabled={!isEditing}
                                fullWidth
                                variant="outlined"
                                slotProps={{ input: { sx: { borderRadius: 3 } } }}
                              />
                              <TextField
                                label="Service Description"
                                value={service.description}
                                onChange={(e) => handleFieldChange('services', null, e.target.value, index, 'description')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                slotProps={{ input: { sx: { borderRadius: 3 } } }}
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </Stack>
                  )}

                  {/* EXPERIENCE SECTION */}
                  {activeTab === 'experience' && editingData?.experience && (
                    <Stack sx={{ gap: 4 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500 }}>Work Experience</Typography>
                        {isEditing && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleAddItem('experience')}
                            startIcon={<SvgIcon name="tabler-plus" size={16} />}
                            sx={{ borderRadius: 2.5 }}
                          >
                            Add Experience
                          </Button>
                        )}
                      </Stack>
                      <Stack sx={{ gap: 3.5 }}>
                        {editingData.experience.map((exp, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 3,
                              border: '1.5px solid',
                              borderColor: 'grey.300',
                              borderRadius: 4,
                              position: 'relative',
                              bgcolor: 'background.default'
                            }}
                          >
                            {isEditing && (
                              <IconButton
                                onClick={() => handleRemoveItem('experience', index)}
                                sx={{ position: 'absolute', top: 12, right: 12, color: 'error.main' }}
                              >
                                <SvgIcon name="tabler-trash" size={18} />
                              </IconButton>
                            )}
                            <Stack sx={{ gap: 2.5 }}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                  <TextField
                                    label="Role & Company"
                                    value={exp.title}
                                    onChange={(e) => handleFieldChange('experience', null, e.target.value, index, 'title')}
                                    disabled={!isEditing}
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <TextField
                                    label="Dates Active"
                                    value={exp.dates}
                                    onChange={(e) => handleFieldChange('experience', null, e.target.value, index, 'dates')}
                                    disabled={!isEditing}
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                                  />
                                </Grid>
                              </Grid>
                              <TextField
                                label="Job Description & Key Responsibilities"
                                value={exp.description}
                                onChange={(e) => handleFieldChange('experience', null, e.target.value, index, 'description')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                slotProps={{ input: { sx: { borderRadius: 3 } } }}
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </Stack>
                  )}

                  {/* EDUCATION SECTION */}
                  {activeTab === 'education' && editingData?.education && (
                    <Stack sx={{ gap: 4 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500 }}>Education History</Typography>
                        {isEditing && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleAddItem('education')}
                            startIcon={<SvgIcon name="tabler-plus" size={16} />}
                            sx={{ borderRadius: 2.5 }}
                          >
                            Add Education
                          </Button>
                        )}
                      </Stack>
                      <Stack sx={{ gap: 3.5 }}>
                        {editingData.education.map((edu, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 3,
                              border: '1.5px solid',
                              borderColor: 'grey.300',
                              borderRadius: 4,
                              position: 'relative',
                              bgcolor: 'background.default'
                            }}
                          >
                            {isEditing && (
                              <IconButton
                                onClick={() => handleRemoveItem('education', index)}
                                sx={{ position: 'absolute', top: 12, right: 12, color: 'error.main' }}
                              >
                                <SvgIcon name="tabler-trash" size={18} />
                              </IconButton>
                            )}
                            <Stack sx={{ gap: 2.5 }}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                  <TextField
                                    label="Degree & Major"
                                    value={edu.title}
                                    onChange={(e) => handleFieldChange('education', null, e.target.value, index, 'title')}
                                    disabled={!isEditing}
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <TextField
                                    label="Dates Active"
                                    value={edu.dates}
                                    onChange={(e) => handleFieldChange('education', null, e.target.value, index, 'dates')}
                                    disabled={!isEditing}
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                                  />
                                </Grid>
                              </Grid>
                              <TextField
                                label="Institution details / GPA"
                                value={edu.description}
                                onChange={(e) => handleFieldChange('education', null, e.target.value, index, 'description')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                slotProps={{ input: { sx: { borderRadius: 3 } } }}
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </Stack>
                  )}

                  {/* SKILLS SECTION */}
                  {activeTab === 'skills' && editingData?.skills && (
                    <Stack sx={{ gap: 4 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500 }}>Skills & Expertise</Typography>
                        {isEditing && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleAddItem('skills')}
                            startIcon={<SvgIcon name="tabler-plus" size={16} />}
                            sx={{ borderRadius: 2.5 }}
                          >
                            Add Skill
                          </Button>
                        )}
                      </Stack>
                      <Stack sx={{ gap: 3 }}>
                        {editingData.skills.map((skill, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 2.5,
                              px: 3,
                              border: '1.5px solid',
                              borderColor: 'grey.300',
                              borderRadius: 4,
                              position: 'relative',
                              bgcolor: 'background.default'
                            }}
                          >
                            {isEditing && (
                              <IconButton
                                onClick={() => handleRemoveItem('skills', index)}
                                sx={{ position: 'absolute', top: 12, right: 12, color: 'error.main' }}
                              >
                                <SvgIcon name="tabler-trash" size={18} />
                              </IconButton>
                            )}
                            <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                  label="Skill Name"
                                  value={skill.title}
                                  onChange={(e) => handleFieldChange('skills', null, e.target.value, index, 'title')}
                                  disabled={!isEditing}
                                  fullWidth
                                  variant="outlined"
                                  slotProps={{ input: { sx: { borderRadius: 3 } } }}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack sx={{ px: 1 }}>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                                    Expertise Level: {skill.percentage}%
                                  </Typography>
                                  <Slider
                                    value={skill.percentage}
                                    onChange={(e, newVal) => handleFieldChange('skills', null, newVal, index, 'percentage')}
                                    disabled={!isEditing}
                                    valueLabelDisplay="auto"
                                    min={10}
                                    max={100}
                                    step={5}
                                  />
                                </Stack>
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                      </Stack>
                    </Stack>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
