// @project
import { PAGE_PATH, SECTION_PATH } from '@/path';

// @assets
const imagePrefix = '/assets/images/presentation';

// @project
import branding from '@/branding.json';

export const other = {
  heading: `${branding.brandName} portfolio sections `,
  description: 'Explore ready-made portfolio sections—from hero to social proof and contact—to launch a polished site faster.',
  primaryBtn: { children: 'Browse portfolio sections', href: SECTION_PATH },
  sections: [
    {
      animationDelay: 0.2,
      title: 'Hero',
      subTitle: 'A strong first impression',
      image: `${imagePrefix}/hero-light.svg`,
      link: PAGE_PATH.hero
    },
    {
      animationDelay: 0.3,
      title: 'Call to Action',
      subTitle: 'Turn visits into applications',
      image: `${imagePrefix}/cta-light.svg`,
      link: PAGE_PATH.cta
    },
    {
      animationDelay: 0.4,
      title: 'Highlights',
      subTitle: 'Showcase skills and wins',
      image: `${imagePrefix}/feature-light.svg`,
      link: PAGE_PATH.feature
    },
    {
      animationDelay: 0.2,
      title: 'Proof',
      subTitle: 'Make your impact easy to see',
      image: `${imagePrefix}/metrics-light.svg`,
      link: PAGE_PATH.metrics
    },
    {
      animationDelay: 0.3,
      title: 'Workflow',
      subTitle: 'Guide visitors step by step',
      image: `${imagePrefix}/process-light.svg`,
      link: PAGE_PATH.process
    },
    {
      animationDelay: 0.4,
      title: 'Integrations',
      subTitle: 'Connect the tools you already use',
      image: `${imagePrefix}/integration-light.svg`,
      link: PAGE_PATH.integration
    }
  ]
};

export const other3 = {
  heading: 'Built for modern professionals',
  caption: 'Nexfolio turns your resume into a polished portfolio with less work, better content, and a faster path to launch.',
  other: [
    {
      title: 'Upload Your Resume',
      description: 'Import a PDF or DOCX and let AI extract your skills, projects, education, and experience.',
      chips: [
        {
          icon: 'tabler-map-pin',
          name: 'AI Parsed'
        },
        {
          icon: 'tabler-history',
          name: 'Fast Setup'
        }
      ],
      btn: { children: 'Try it free', href: '#' }
    },
    {
      title: 'Customize the Look',
      description: 'Choose a portfolio template, adjust colors, and refine every section in the live editor.',
      chips: [
        {
          icon: 'tabler-map-pin',
          name: 'Live Preview'
        },
        {
          icon: 'tabler-history',
          name: 'No Code'
        }
      ],
      btn: { children: 'Edit Portfolio', href: '#' }
    },
    {
      title: 'Publish Anywhere',
      description: 'Download the source code or deploy your portfolio to Vercel, Netlify, or GitHub Pages.',
      chips: [
        {
          icon: 'tabler-map-pin',
          name: 'Export Code'
        },
        {
          icon: 'tabler-history',
          name: 'One-Click Deploy'
        }
      ],
      btn: { children: 'Launch Site', href: '#' }
    },
    {
      title: 'Get Found Faster',
      description: 'Ship an SEO-friendly portfolio that helps recruiters discover your work and remember your name.',
      chips: [
        {
          icon: 'tabler-map-pin',
          name: 'SEO Ready'
        },
        {
          icon: 'tabler-history',
          name: 'Recruiter-Friendly'
        }
      ],
      btn: { children: 'Improve SEO', href: '#' }
    }
  ]
};
