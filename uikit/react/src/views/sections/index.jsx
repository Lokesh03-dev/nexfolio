'use client';
import { useEffect, useState } from 'react';

// @next
import NextLink from 'next/link';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'framer-motion';

// @project
import branding from '@/branding.json';
import ContainerWrapper from '@/components/ContainerWrapper';
import { GraphicsCard } from '@/components/cards';
import SectionHero from '@/components/SectionHero';
import SvgIcon from '@/components/SvgIcon';

import useFocusWithin from '@/hooks/useFocusWithin';
import { PAGE_PATH } from '@/path';
import { generateFocusVisibleStyles } from '@/utils/CommonFocusStyle';
import GetImagePath from '@/utils/GetImagePath';

// @assets
import Background from '@/images/graphics/Background';
import Wave from '@/images/graphics/Wave';

var SectionCategory;

(function (SectionCategory) {
  SectionCategory['ESSENTIAL'] = 'essential';
  SectionCategory['MARKETING'] = 'marketing';
  SectionCategory['FEATURE'] = 'feature';
})(SectionCategory || (SectionCategory = {}));

const imagePrefix = '/assets/images/presentation';

/***************************  SECTIONS - DATA  ***************************/

const sections = [
  {
    title: 'Designer Portfolio',
    subTitle: '10 Creative Designs',
    image: '/assets/images/creative_theme.png',
    link: PAGE_PATH.navbar,
    category: SectionCategory.ESSENTIAL,
    unlocked: true
  },
  {
    title: 'Software Portfolio',
    subTitle: '19 Tech Variants',
    image: '/assets/images/modern_theme.png',
    link: PAGE_PATH.hero,
    category: SectionCategory.MARKETING,
    unlocked: true
  },
  {
    title: 'Frontend Portfolio',
    subTitle: '8 Modern Layouts',
    image: '/assets/images/minimalist_theme.png',
    link: PAGE_PATH.clientele,
    category: SectionCategory.MARKETING,
    unlocked: true
  },
  {
    title: 'Fullstack Portfolio',
    subTitle: '10 Data Layouts',
    image: '/assets/images/classic_theme.png',
    link: PAGE_PATH.metrics,
    category: SectionCategory.FEATURE,
    unlocked: true
  },
  {
    title: 'DevOps Portfolio',
    subTitle: '27 Cloud Schemes',
    image: '/assets/images/professional_theme.png',
    link: PAGE_PATH.feature,
    category: SectionCategory.FEATURE,
    unlocked: true
  },
  {
    title: 'Mobile App Builder',
    subTitle: 'Premium Only',
    image: `${imagePrefix}/process-light.svg`,
    link: '#',
    category: SectionCategory.FEATURE,
    unlocked: false
  },
  {
    title: 'Data Science Hub',
    subTitle: 'Premium Only',
    image: `${imagePrefix}/integration-light.svg`,
    link: '#',
    category: SectionCategory.FEATURE,
    unlocked: false
  },
  {
    title: 'Executive Profile',
    subTitle: 'Premium Only',
    image: `${imagePrefix}/testimonial-light.svg`,
    link: '#',
    category: SectionCategory.MARKETING,
    unlocked: false
  },
  {
    title: 'Agency Landing Page',
    subTitle: 'Premium Only',
    image: `${imagePrefix}/cta-light.svg`,
    link: '#',
    category: SectionCategory.MARKETING,
    unlocked: false
  }
];

const filterList = [
  { title: 'All Portfolios', value: '' },
  { title: 'Design & Frontend', value: SectionCategory.MARKETING },
  { title: 'Fullstack & DevOps', value: SectionCategory.FEATURE },
  { title: 'Core Services', value: SectionCategory.ESSENTIAL }
];

/***************************  SECTIONS LAYOUT  ***************************/

export default function Sections() {
  const theme = useTheme();
  const [filterBy, setFilterBy] = useState('');
  const [filterSections, setFilterSections] = useState(sections);

  const [searchValue, setSearchValue] = useState('');

  const handleSearchValue = (event) => {
    const search = event.target.value.trim().toLowerCase();
    setSearchValue(search);
  };

  useEffect(() => {
    const newData = sections.filter((value) => {
      if (searchValue) {
        return value.title.toLowerCase().includes(searchValue.toLowerCase());
      } else {
        return value;
      }
    });
    setFilterSections(newData);
  }, [searchValue]);

  const isFocusWithin = useFocusWithin();

  return (
    <>
      <SectionHero heading={`Choose Your Portfolio Style`} search={false} offer />
      <ContainerWrapper>
        <Stack sx={{ py: 6, gap: { xs: 3, sm: 4, md: 5 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ alignItems: 'center', justifyContent: 'space-between', gap: { xs: 2.5, md: 1.5 } }}
          >
            <OutlinedInput
              placeholder="Search portfolio templates..."
              slotProps={{ input: { 'aria-label': 'Search templates', sx: { pl: 1.5 } } }}
              sx={{ width: { sm: 456, xs: 1 } }}
              startAdornment={<SvgIcon name="tabler-search" color="grey.700" />}
              onChange={handleSearchValue}
            />
            <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
              {filterList.map((item, index) => (
                <Button
                  key={index}
                  variant={filterBy === item.value ? 'contained' : 'outlined'}
                  size="small"
                  sx={{ typography: 'subtitle2', whiteSpace: 'nowrap', [theme.breakpoints.down('sm')]: { px: 1.5, py: 1 } }}
                  onClick={() => {
                    setFilterBy(item.value);
                    setFilterSections(item.value === '' ? sections : sections.filter((section) => section.category === item.value));
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Stack>
          </Stack>
          <Grid container spacing={2}>
            {filterSections.map((item, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <GraphicsCard sx={{ overflow: 'hidden', position: 'relative' }}>
                  <motion.div
                    whileHover={item.unlocked ? { scale: 1.02 } : {}}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5
                    }}
                  >
                    <GraphicsCard
                      sx={{
                        height: { xs: 240, sm: 324, md: 380 },
                        position: 'relative',
                        overflow: 'hidden',
                        ...(!item.unlocked && {
                          filter: 'blur(3px) grayscale(40%)',
                          pointerEvents: 'none'
                        }),
                        ...(isFocusWithin && { '&:focus-within': generateFocusVisibleStyles(theme.palette.primary.main) })
                      }}
                    >
                      {item.unlocked && (
                        <Link
                          href={item.link}
                          component={NextLink}
                          aria-label={item.title}
                          sx={{ position: 'absolute', top: 0, height: 1, width: 1, borderRadius: { xs: 6, sm: 8, md: 10 }, zIndex: 1 }}
                        />
                      )}
                      <Background />
                      <Box sx={{ position: 'absolute', top: 0, width: 1, height: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {item.unlocked ? (
                          <Box sx={{ width: '82%', height: 180, overflow: 'hidden', borderRadius: 2.5, border: '1.5px solid', borderColor: 'grey.300', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', mb: 4, bgcolor: 'background.default' }}>
                            <CardMedia
                              component="img"
                              image={GetImagePath(item.image)}
                              sx={{ width: 1, height: 1, objectFit: 'cover', objectPosition: 'top' }}
                              alt={item.title}
                            />
                          </Box>
                        ) : (
                          <CardMedia
                            component="img"
                            image={GetImagePath(item.image)}
                            sx={{ px: '14.5%', pt: '16%', pb: { xs: 2, md: 1 }, objectFit: 'contain', maxHeight: 180 }}
                            alt="locked section"
                            loading="lazy"
                          />
                        )}
                        <Box sx={{ '& div': { alignItems: 'center', pt: 0.875 } }}>
                          <Wave />
                        </Box>
                      </Box>
                      <Stack
                        sx={{
                          height: 177,
                          bottom: 0,
                          width: 1,
                          position: 'absolute',
                          justifyContent: 'end',
                          textAlign: 'center',
                          gap: { xs: 0.25, md: 0.5, sm: 1 },
                          p: 3,
                          background: `linear-gradient(180deg, ${alpha(theme.palette.grey[100], 0)} 0%, ${theme.palette.grey[100]} 100%)`
                        }}
                      >
                        <Typography variant="h4" sx={{ color: 'primary.main' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {item.subTitle}
                        </Typography>
                      </Stack>
                    </GraphicsCard>
                  </motion.div>

                  {/* Absolute overlay for locked premium badges */}
                  {!item.unlocked && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }}
                    >
                      <Stack direction="row" sx={{ px: 2, py: 1, bgcolor: 'warning.main', color: 'warning.contrastText', borderRadius: 2.5, alignItems: 'center', gap: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                        <SvgIcon name="tabler-crown" size={16} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>PREMIUM</Typography>
                      </Stack>
                    </Box>
                  )}
                </GraphicsCard>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </ContainerWrapper>
    </>
  );
}
