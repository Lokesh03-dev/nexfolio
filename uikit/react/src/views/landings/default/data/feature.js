// @project
import branding from '@/branding.json';
import { IconType } from '@/enum';
import { SECTION_PATH, BUY_NOW_URL, ADMIN_PATH, DOCS_URL } from '@/path';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

export const feature2 = {
  heading: 'Built for personal branding',
  caption: 'Nexfolio helps professionals turn career stories into portfolio sites that feel refined, modern, and recruiter-ready.',
  features: [
    {
      icon: { name: 'tabler-users', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Resume-first flow',
      content: 'Start with a resume upload and let AI organize your profile automatically.'
    },
    {
      icon: { name: 'tabler-star', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Professional polish',
      content: 'Give your portfolio a consistent look with elegant layouts and clear hierarchy.'
    },
    {
      icon: { name: 'tabler-chart-histogram', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Faster applications',
      content: 'Publish a site that helps recruiters understand your value in seconds.'
    }
  ]
};

export const feature5 = {
  heading: 'Everything you need to launch',
  caption: 'Nexfolio includes the essentials to build, customize, and publish a portfolio without extra tooling.',
  image1: '/assets/images/graphics/ai/graphics3-light.svg',
  image2: '/assets/images/graphics/ai/graphics2-light.svg',
  features: [
    {
      icon: 'tabler-coin',
      title: 'Resume import',
      content: 'Bring in PDF or DOCX files and let AI extract your profile details.'
    },
    {
      icon: 'tabler-health-recognition',
      title: 'Live editor',
      content: 'Update sections, styles, and copy while seeing the result instantly.'
    }
  ],
  features2: [
    {
      icon: 'tabler-briefcase',
      title: 'Templates',
      content: 'Choose from portfolio layouts made for different professions.'
    },
    {
      icon: 'tabler-users',
      title: 'Deploy anywhere',
      content: 'Export source or publish to your preferred hosting platform.'
    }
  ],
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '10k+ portfolios launched'
  },
  content: 'Build faster, present better, and launch a portfolio that reflects your work.',
  actionBtn: { children: 'Explore Portfolio Features', href: '#' }
};

export const feature20 = {
  heading: 'Powerful features for an AI portfolio builder',
  caption: 'Upload your resume, refine the content, and publish a portfolio that feels ready for recruiters.',
  actionBtn: { children: 'Start Free', href: BUY_NOW_URL, ...linkProps },
  secondaryBtn: { children: 'See Templates', href: SECTION_PATH },
  features: [
    {
      icon: 'tabler-accessible',
      title: 'AI Resume Parsing',
      content: 'Upload your resume and let AI automatically extract your skills, projects, experience, and education.'
    },
    {
      icon: 'tabler-brand-google',
      title: 'SEO Ready',
      content: 'Publish pages that are structured for discoverability and better search performance.'
    },
    {
      icon: 'tabler-stack-2',
      title: 'One-Click Deployment',
      content: 'Download your portfolio or deploy it instantly to platforms like Vercel, Netlify, or GitHub Pages.'
    },
    {
      icon: 'tabler-rocket',
      title: 'Live Customization',
      content: 'Edit text, colors, layouts, fonts, and sections with real-time preview before publishing.'
    },
    {
      icon: 'tabler-help',
      title: 'Portfolio Templates',
      content: 'Choose from modern, responsive portfolio templates designed to showcase your professional profile.'
    },
    {
      icon: 'tabler-refresh',
      title: 'Regular Updates',
      content: 'Receive consistent updates to keep the platform fresh and ready for new portfolio needs.'
    }
  ]
};

export const feature21 = {
  heading: `Design faster with ${branding.brandName} templates`,
  caption: 'Preview portfolio layouts quickly and tailor them to your personal brand without starting from scratch.',
  image: '/assets/images/graphics/ai/desktop1-light.svg',
  primaryBtn: { children: 'View Templates', href: SECTION_PATH, ...linkProps },
  secondaryBtn: {
    children: 'Open Portfolio Editor',
    href: BUY_NOW_URL,
    ...linkProps
  },
  features: [
    {
      animationDelay: 0.1,
      icon: 'tabler-components',
      title: 'Portfolio Blocks'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-moon',
      title: 'Dark Mode'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-brightness-auto',
      title: 'Auto Layout'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-accessible',
      title: 'Accessible'
    },
    {
      animationDelay: 0.1,
      icon: 'tabler-icons',
      title: 'Custom Icons'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-file-stack',
      title: 'Portfolio Pages'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-brand-matrix',
      title: 'Clean System'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-click',
      title: 'Quick Customization'
    }
  ]
};

export const feature = {
  heading: `What’s inside of ${branding.brandName}`,
  features: [
    {
      image: '/assets/images/shared/react.svg',
      title: 'Resume parsing',
      content: 'Turn resume data into structured portfolio content automatically.'
    },
    {
      image: '/assets/images/shared/next-js.svg',
      title: 'Responsive layout',
      content: 'Keep every section readable and balanced on every screen size.'
    },
    {
      image: '/assets/images/shared/react.svg',
      title: 'Live editor',
      content: 'Customize colors, fonts, and content with instant visual feedback.'
    },
    {
      image: '/assets/images/shared/next-js.svg',
      title: 'Fast deployment',
      content: 'Publish your portfolio to your preferred hosting platform quickly.'
    },
    {
      image: '/assets/images/shared/figma.svg',
      title: 'SEO copy',
      content: 'Generate cleaner content and metadata that supports better discoverability.'
    },
    {
      title: 'See pricing',
      content: 'Pick the plan that fits your portfolio building needs.',
      actionBtn: { children: 'Pricing', href: BUY_NOW_URL, ...linkProps }
    }
  ]
};

export const feature7 = {
  heading: 'Real-Time Performance Insights',
  caption: 'Gain a competitive edge with real-time performance monitoring.',
  testimonials: [
    {
      image: '/assets/images/graphics/ai/graphics6-light.svg',
      features: [
        {
          icon: 'tabler-star',
          title: 'Core Value',
          content: 'Unlock growth potential through continuous monitoring, enabling proactive strategies in a competitive landscape.'
        }
      ]
    },
    {
      image: '/assets/images/graphics/ai/graphics8-light.svg',
      features: [
        {
          icon: 'tabler-route',
          title: 'Multi-Cloud Orchestration',
          content: 'Enhances flexibility and resilience in a multi-cloud environment.'
        }
      ]
    },
    {
      image: '/assets/images/graphics/ai/graphics3-light.svg',
      features: [
        {
          icon: 'tabler-history',
          title: 'Story',
          content: 'Real-time performance insights empower teams to respond swiftly, optimizing operations and driving growth.'
        }
      ]
    }
  ],
  breadcrumbs: [{ title: 'Core Value' }, { title: 'Culture' }, { title: 'Story' }]
};

export const feature23 = {
  heading: 'Culture of Innovation',
  caption:
    'Join a team that embraces forward-thinking ideas, fosters innovation, and cultivates an environment where your creativity can flourish.',
  heading2: 'Growth',
  caption2: 'Our culture prioritizes continuous learning, encouraging personal and professional development. ',
  image: '/assets/images/graphics/default/feature23-light.png',
  primaryBtn: { children: 'Join  Our Team', href: '#' },

  features: [
    {
      icon: 'tabler-users',
      title: 'Teamwork',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    },
    {
      icon: 'tabler-star',
      title: 'Inclusivity',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    }
  ]
};

export const feature18 = {
  heading: 'Powerful portfolio editor',
  caption: 'Edit resume content, refine your layout, and publish a personal site with confidence.',
  topics: [
    {
      icon: 'tabler-sparkles',
      title: 'Live editing',
      title2: 'Customize every section',
      description: 'Refine copy, visuals, and structure without breaking the flow of your portfolio.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'Resume import and parsing' },
        { primary: 'Customizable portfolio templates' },
        { primary: 'Responsive sections' },
        { primary: 'SEO-friendly structure' }
      ],
      actionBtn: { children: 'Open Builder', href: ADMIN_PATH, ...linkProps },
      actionBtn2: { children: 'Docs', href: DOCS_URL, ...linkProps }
    },
    {
      icon: 'tabler-palette',
      title: 'Customizable styles',
      title2: 'Flexible theming options',
      description: 'Tailor colors, fonts, and spacing effortlessly to match your personal brand.',
      image: '/assets/images/graphics/default/admin-dashboard-2.png',
      list: [
        { primary: 'Easy theming controls' },
        { primary: 'Layout options' },
        { primary: 'Personal branding presets' },
        { primary: 'Consistent design system' }
      ],
      actionBtn: { children: 'Open Builder', href: ADMIN_PATH, ...linkProps },
      actionBtn2: { children: 'Docs', href: DOCS_URL, ...linkProps }
    },
    {
      icon: 'tabler-rocket',
      title: 'Faster launch',
      title2: 'Rapid publishing',
      description: 'Launch a portfolio quicker with pre-built layouts and export options.',
      image: '/assets/images/graphics/default/admin-dashboard-3.png',
      list: [
        { primary: 'Time saving' },
        { primary: 'Tested and reliable' },
        { primary: 'Customization ready' },
        { primary: 'Better recruiter experience' }
      ],
      actionBtn: { children: 'Open Builder', href: ADMIN_PATH, ...linkProps },
      actionBtn2: { children: 'Docs', href: DOCS_URL, ...linkProps }
    },
    {
      icon: 'tabler-scale',
      title: 'Scalability',
      title2: 'Ready to grow',
      description: 'Expand your portfolio as your experience grows with modular, extensible sections.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'Modular architecture' },
        { primary: 'Performance optimized' },
        { primary: 'Future-proof sections' },
        { primary: 'Maintainable code structure' }
      ],
      actionBtn: { children: 'Open Builder', href: ADMIN_PATH, ...linkProps },
      actionBtn2: { children: 'Docs', href: DOCS_URL, ...linkProps }
    }
  ]
};
