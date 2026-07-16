// @project
import branding from '@/branding.json';

export const contactUS = {
  heading: 'Get in touch',
  caption: 'Reach out for portfolio setup, customization, or anything you need while building your Nexfolio site.',
  list: [
    {
      icon: 'tabler-mail',
      title: 'Email',
      content: 'Send a message and I’ll get back to you quickly.',
      link: { children: 'abhishekdabas2005@gmail.com', href: branding.company.socialLink.email, target: '_blank', rel: 'noopener noreferrer' }
    },
    {
      icon: 'tabler-phone',
      title: 'Phone',
      content: 'Call or message for direct support.',
      link: { children: '+91 8708250109', href: branding.company.socialLink.phone, target: '_blank', rel: 'noopener noreferrer' }
    },
    {
      icon: 'tabler-world-www',
      title: 'Website',
      content: 'Visit the live Nexfolio portfolio.',
      link: { children: 'new-design-portfolio-tau.vercel.app', href: branding.company.url, target: '_blank', rel: 'noopener noreferrer' }
    }
  ]
};
