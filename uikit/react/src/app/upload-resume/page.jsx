'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';

// @third-party
import { motion, AnimatePresence } from 'motion/react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import LogoMain from '@/components/logo/LogoMain';
import SvgIcon from '@/components/SvgIcon';
import axiosInstance from '@/utils/axios';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';

export default function UploadResumePage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Protected route redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndSetFile = (selectedFile) => {
    setError('');
    setSuccess(false);

    if (!selectedFile) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    const isDoc = fileExtension === 'doc' || fileExtension === 'docx';
    const isPdf = fileExtension === 'pdf';

    if (!allowedTypes.includes(selectedFile.type) && !isPdf && !isDoc) {
      setError('Invalid file type. Please upload a PDF or Word (.docx) document.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/processing');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setUploadProgress(0);
    setSuccess(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIconAndColor = () => {
    if (!file) return { icon: 'tabler-file', color: 'grey.500', bgColor: 'grey.100' };
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'pdf') {
      return { icon: 'tabler-file-type-pdf', color: '#E4405F', bgColor: '#FDE8EB' };
    }
    return { icon: 'tabler-file-text', color: '#1877F2', bgColor: '#E8F2FD' };
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!isAuthenticated) return null;

  const fileInfo = getFileIconAndColor();

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
      <Box
        sx={{
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'grey.300',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <LogoMain />
            <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
              <Stack sx={{ alignItems: 'flex-end', display: { xs: 'none', sm: 'flex' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {user?.domain || 'Focus Area'} Developer
                </Typography>
              </Stack>
              <Avatar
                sx={{
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  fontWeight: 600,
                  width: 40,
                  height: 40,
                  border: '1.5px solid',
                  borderColor: 'primary.light'
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </Avatar>
              <IconButton onClick={logout} title="Sign Out" sx={{ color: 'text.secondary' }}>
                <SvgIcon name="tabler-logout" size={20} color="inherit" />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ width: '100%' }}
        >
          <Box
            sx={{
              p: { xs: 4, sm: 5.5 },
              borderRadius: 5,
              bgcolor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: 'grey.300',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Header Description */}
            <Stack sx={{ gap: 1, mb: 4.5, textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 500 }}>
                Upload Your Resume
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                Gemini will scan your resume to build your customized portfolio.
              </Typography>
            </Stack>

            {error && (
              <Fade in={Boolean(error)}>
                <Alert severity="error" sx={{ mb: 3.5, borderRadius: 3 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {success && (
              <Fade in={success}>
                <Alert severity="success" sx={{ mb: 3.5, borderRadius: 3 }}>
                  Upload complete! Launching AI parser... 🤖
                </Alert>
              </Fade>
            )}

            {/* Upload Area */}
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="upload-zone"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={onButtonClick}
                    sx={{
                      border: '2px dashed',
                      borderColor: dragActive ? 'primary.main' : 'grey.400',
                      bgcolor: dragActive ? withAlpha(theme.vars.palette.primary.lighter, 0.3) : 'grey.50',
                      borderRadius: 4.5,
                      p: 5,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: withAlpha(theme.vars.palette.primary.lighter, 0.15)
                      }
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <Stack sx={{ alignItems: 'center', gap: 2.5 }}>
                      <Box
                        sx={{
                          p: 2.2,
                          bgcolor: dragActive ? 'primary.main' : 'primary.lighter',
                          borderRadius: '50%',
                          color: dragActive ? 'background.default' : 'primary.main',
                          transition: 'all 0.25s',
                          display: 'flex',
                          alignItems: 'center',
                          boxShadow: `0 8px 16px ${withAlpha(theme.vars.palette.primary.main, 0.08)}`
                        }}
                      >
                        <SvgIcon name="tabler-cloud-upload" size={32} color="inherit" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Drag and drop your resume here
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.75 }}>
                          or <span style={{ color: theme.palette.primary.main, fontWeight: 700 }}>browse files</span> from your device
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Supported formats: PDF, DOCX (Max 5MB)
                      </Typography>
                    </Stack>
                  </Box>
                </motion.div>
              ) : (
                <motion.div
                  key="file-preview"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      border: '1.5px solid',
                      borderColor: 'grey.300',
                      borderRadius: 4.5,
                      bgcolor: 'background.default'
                    }}
                  >
                    <Stack sx={{ gap: 3 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1.8,
                            bgcolor: fileInfo.bgColor,
                            borderRadius: 3.5,
                            color: fileInfo.color,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <SvgIcon name={fileInfo.icon} size={24} color="inherit" />
                        </Box>
                        
                        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </Typography>
                        </Box>

                        {!uploading && (
                          <IconButton onClick={handleDelete} sx={{ color: 'error.main', bgcolor: 'error.lighter', '&:hover': { bgcolor: 'error.light', color: '#fff' } }}>
                            <SvgIcon name="tabler-trash" size={18} color="inherit" />
                          </IconButton>
                        )}
                      </Stack>

                      {uploading && (
                        <Stack sx={{ gap: 1.2 }}>
                          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {uploadProgress < 100 ? 'Uploading files...' : 'Processing resume...'}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {uploadProgress}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                              }
                            }}
                          />
                        </Stack>
                      )}

                      {!uploading && (
                        <Stack direction="row" sx={{ gap: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={onButtonClick}
                            fullWidth
                            sx={{
                              borderRadius: 3,
                              borderColor: 'grey.300',
                              color: 'text.primary',
                              fontWeight: 600,
                              py: 1.2,
                              '&:hover': { borderColor: 'grey.500', bgcolor: 'grey.50' }
                            }}
                          >
                            Replace File
                          </Button>
                          <motion.div style={{ flexGrow: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={handleUpload}
                              sx={{
                                borderRadius: 3,
                                py: 1.4,
                                fontWeight: 700,
                                boxShadow: `0 8px 20px ${withAlpha(theme.vars.palette.primary.main, 0.15)}`
                              }}
                            >
                              Analyze Resume
                            </Button>
                          </motion.div>
                        </Stack>
                      )}
                    </Stack>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
