// @mui
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

// @project
import { Hero17 } from '@/blocks/hero';

/***************************  HERO 17 - DATA  ***************************/

const data = {
  chip: {
    label: (
      <>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          One resume,
        </Typography>
        <Chip
          label={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              one portfolio
            </Typography>
          }
          sx={{ height: 24, bgcolor: 'primary.lighter', mr: -1, ml: 0.75, '& .MuiChip-label': { px: 1.25 } }}
          icon={
            <CardMedia
              component="img"
              image="/assets/images/shared/celebration.svg"
              sx={{ width: 16, height: 16 }}
              alt="celebration"
              loading="lazy"
            />
          }
        />
      </>
    )
  },
  headLine: 'Transform your resume into a portfolio website',
  captionLine: 'Let AI extract your experience and turn it into a polished personal site in minutes.',
  primaryBtn: { children: 'Start building' },
  videoSrc: 'https://d2elhhoq00m1pj.cloudfront.net/nexfolio-intro.mp4',
  videoThumbnail: '/assets/videos/thumbnails/intro-thumbnail.png',
  listData: [
    { image: '/assets/images/shared/react.svg', title: 'Resume parsing' },
    { image: '/assets/images/shared/next-js.svg', title: 'Portfolio templates' },
    { image: '/assets/images/shared/material-ui.svg', title: 'Live editor' },
    { image: '/assets/images/shared/typescript.svg', title: 'SEO ready' },
    { image: '/assets/images/shared/javascript.svg', title: 'Source export' },
    { image: '/assets/images/shared/m3.svg', title: 'One-click deploy' },
    { image: '/assets/images/shared/figma.svg', title: 'Custom domain' }
  ]
};

/***************************  BLOCK - HERO 17  ***************************/

export default function BlockHero17() {
  return <Hero17 {...data} />;
}
