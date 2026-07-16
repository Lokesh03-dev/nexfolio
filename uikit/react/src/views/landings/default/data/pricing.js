// @project
import { BUY_NOW_URL, FREEBIES_URL } from '@/path';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

export const pricing = {
  heading: 'Simple pricing for portfolio builders',
  caption: 'Choose the plan that fits how quickly you want to launch your Nexfolio portfolio.',
  features: [
    { id: 1, label: 'Resume upload' },
    { id: 2, label: 'AI resume parsing' },
    { id: 3, label: 'Portfolio templates' },
    { id: 4, label: 'Live editor' },
    { id: 5, label: 'Dark & light mode' },
    { id: 6, label: 'Unlimited portfolio generation' },
    { id: 7, label: 'Download source code' },
    { id: 8, label: 'Custom domain' },
    { id: 9, label: 'Deploy to Vercel' },
    { id: 10, label: 'SEO optimization' }
  ],
  plans: [
    {
      title: 'Free',
      price: 0,
      active: false,
      featureTitle: 'Features',
      content: 'Start building your portfolio with the essentials.',
      contentLink: { children: 'details', href: '/pricing', ...linkProps },
      exploreLink: { children: 'Start Free', href: FREEBIES_URL, ...linkProps },
      featuresID: [1, 3]
    },
    {
      title: 'Pro',
      active: false,
      price: 69,
      featureTitle: 'Features',
      content: 'Unlock the full Nexfolio experience with every premium feature.',
      contentLink: { children: 'details', href: '/pricing', ...linkProps },
      exploreLink: { children: 'Start Pro', href: BUY_NOW_URL, ...linkProps },
      featuresID: [2, 4, 5, 6, 7, 8, 9, 10]
    }
  ]
};
