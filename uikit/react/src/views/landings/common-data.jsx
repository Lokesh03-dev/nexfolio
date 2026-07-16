// @mui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import branding from '@/branding.json';
import { MegaMenuType } from '@/enum';
import { ADMIN_PATH, BUY_NOW_URL, DOCS_URL, PAGE_PATH, PRIVIEW_PATH } from '@/path';
import { Themes } from '@/config';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

/***************************  MEGAMENU 4 - FOOTER  ***************************/

function FooterData() {
  return (
    <Stack direction={{ sm: 'row' }} sx={{ gap: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant="h5">Design your portfolio faster with ready-made sections</Typography>
          <Chip
            label="Featured"
            size="small"
            slotProps={{ label: { sx: { pl: 1.25, pr: 1.5, py: 0.5, typography: 'caption', my: 0.2 } } }}
            sx={{ bgcolor: 'background.default', display: { xs: 'none', sm: 'inline-flex' } }}
            icon={
              <CardMedia
                component="img"
                image="/assets/images/shared/celebration.svg"
                sx={{ width: 16, height: 16, pl: 0.5 }}
                alt="celebration"
                loading="lazy"
              />
            }
          />
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {branding.brandName} gives you a flexible portfolio builder with polished sections for storytelling, credibility, and conversion.
        </Typography>
      </Stack>
      <Button
        variant="contained"
        sx={{ display: { xs: 'none', sm: 'inline-flex' }, minWidth: 100, px: { xs: 2 }, py: 1.25 }}
        href={BUY_NOW_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Start Free
      </Button>
    </Stack>
  );
}

/***************************  NAVBAR - MEGAMENU LANDINGS  ***************************/

export const landingMegamenu = {
  id: 'landings',
  title: 'Landings',
  megaMenu: {
    type: MegaMenuType.MEGAMENU4,
    popperOffsetX: 195,
    toggleBtn: { children: 'Templates' },
    menuItems: [
      {
        title: 'Minimal',
        theme: Themes.THEME_CRM,
        image: '/assets/images/mega-menu/crm-light.svg',
        status: 'Pro'
      },
      {
        title: 'AI Creator',
        theme: Themes.THEME_AI,
        image: '/assets/images/mega-menu/ai-light.svg',
        status: 'Pro'
      },
      {
        title: 'Developer',
        theme: Themes.THEME_CRYPTO,
        image: '/assets/images/mega-menu/crypto-light.svg',
        status: 'Pro'
      },
      {
        title: 'Freelancer',
        theme: Themes.THEME_HOSTING,
        image: '/assets/images/mega-menu/hosting-light.svg',
        status: 'Pro'
      },
      {
        title: 'Designer',
        theme: Themes.THEME_PMS,
        image: '/assets/images/mega-menu/pms-light.svg',
        status: 'Pro'
      },
      {
        title: 'Student',
        theme: Themes.THEME_HRM,
        image: '/assets/images/mega-menu/hrm-light.svg',
        status: 'Pro'
      },
      {
        title: 'Creator',
        theme: Themes.THEME_PLUGIN,
        image: '/assets/images/mega-menu/plugin-light.svg',
        status: 'Pro'
      },
      {
        title: 'Portfolio Pro',
        theme: Themes.THEME_LMS,
        image: '/assets/images/mega-menu/lms-light.svg',
        status: 'Pro'
      }
    ],
    footerData: FooterData()
  }
};

/***************************  MEGAMENU 5 - BANNER  ***************************/

function BannerData() {
  return (
    <Stack sx={{ alignItems: 'flex-start', gap: 3, height: 1, justifyContent: 'center' }}>
      <Stack sx={{ gap: 1 }}>
        <Stack sx={{ alignItems: 'flex-start', gap: 1.5 }}>
          <Chip
            label={`${branding.brandName} Portfolio Builder`}
            icon={
              <CardMedia
                component="img"
                image="/assets/images/shared/celebration.svg"
                sx={{ width: 16, height: 16 }}
                alt="celebration"
                loading="lazy"
              />
            }
            size="small"
            slotProps={{ label: { sx: { px: 1.5, py: 0.5, typography: 'subtitle2' } } }}
            sx={{ bgcolor: 'background.default', '& .MuiChip-icon': { ml: 1.25 } }}
          />
          <Typography variant="h5">Stunning portfolio websites designed to get you hired.</Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Turn a resume into a polished portfolio, customize every section, and launch faster with AI.
        </Typography>
      </Stack>
      <Button href={ADMIN_PATH} variant="contained" sx={{ minWidth: 92, px: { xs: 2 }, py: 1.25 }}>
        Open Builder
      </Button>
    </Stack>
  );
}

/***************************  NAVBAR - MEGAMENU PAGES  ***************************/

export const pagesMegamenu = {
  id: 'pages',
  title: 'Pages',
  megaMenu: {
    type: MegaMenuType.MEGAMENU5,
    toggleBtn: { children: 'Pages' },
    popperWidth: 860,
    menuItems: [
      {
        title: 'General',
        itemsList: [
          { title: 'About', link: { href: 'https://stage.nexfolio.io/about', ...linkProps } },
          { title: 'Portfolio Editor', status: 'Pro' },
          { title: 'Privacy Policy', link: { href: PAGE_PATH.privacyPolicyPage, ...linkProps } },
          { title: 'Contact Us', status: 'Pro' },
          { title: 'FAQs', status: 'Pro' },
          { title: 'Pricing', status: 'Pro' }
        ]
      },
      {
        title: 'Maintenance',
        itemsList: [
          { title: 'Coming Soon', status: 'Pro' },
          { title: 'Error 404', link: { href: PRIVIEW_PATH.error404, ...linkProps } },
          { title: 'Error 500', link: { href: PRIVIEW_PATH.error500, ...linkProps } },
          { title: 'Under Maintenance', status: 'Pro' }
        ]
      },
      {
        title: 'External',
        itemsList: [
          { title: 'Website', link: { href: branding.company.url, ...linkProps } },
          { title: 'Documentation', link: { href: DOCS_URL, ...linkProps } },
          { title: 'Email', link: { href: branding.company.socialLink.email, ...linkProps } },
          {
            title: 'Instagram',
            link: { href: branding.company.socialLink.instagram, ...linkProps }
          },
          { title: 'LinkedIn', link: { href: branding.company.socialLink.linkedin, ...linkProps } }
        ]
      }
    ],
    bannerData: <BannerData />
  }
};
