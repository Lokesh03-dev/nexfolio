// @mui
import branding from '@/branding.json';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// @project
import { NextLink } from '@/components/routes';

export const cta4 = {
  headLine: 'Why choose Nexfolio for your portfolio?',
  primaryBtn: {
    children: 'Start building',
    href: 'https://new-design-portfolio-tau.vercel.app/',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '250+ Author Reviews (4.65 out of 5)'
  },
  list: [
    { primary: 'Resume to portfolio in minutes' },
    { primary: 'AI-generated content' },
    { primary: 'Live customization' },
    { primary: 'Smooth deployment' },
    { primary: 'Source code export' },
    { primary: 'Recruiter-friendly design' }
  ],
  clientContent: 'Learn More'
};

function DescriptionLine() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      Have questions? Our community is here to help. Learn more about{' '}
      <Link component={NextLink} variant="caption2" color="primary" href={branding.company.socialLink.email} underline="hover">
        email support
      </Link>
    </Typography>
  );
}

export const cta5 = {
  label: 'Need help?',
  heading: 'Reach out directly',
  caption: 'Get support, share feedback, and launch your portfolio with confidence.',
  primaryBtn: {
    children: 'Email Abhishek',
    href: branding.company.socialLink.email,
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  description: <DescriptionLine />,
  saleData: { count: 8, defaultUnit: 'k+', caption: 'Trusted by professionals building portfolios' },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '250k+ Reviews (4.65 out of 5)'
  }
};

export const cta10 = {
  heading: 'Ready to create your portfolio?',
  caption: 'Upload your resume, customize your site, and publish a personal brand that feels polished and recruiter-ready.',
  primaryBtn: { children: 'Upload Resume', href: '#' },
  secondaryBtn: { children: 'Contact Us', href: branding.company.socialLink.email },
  image: '/assets/images/graphics/ai/graphics15-light.svg',
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '10k+ Reviews (4.5 out of 5)'
  }
};
