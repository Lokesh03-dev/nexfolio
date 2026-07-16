// @project
import branding from '@/branding.json';

export const faq = {
  heading: 'Frequently Asked Questions',
  caption: `Answers to common questions about ${branding.brandName} and how it turns resumes into portfolio websites.`,
  defaultExpanded: 'Getting Started',
  faqList: [
    {
      question: `What is ${branding.brandName}?`,
      answer: `${branding.brandName} is an AI resume-to-portfolio builder that turns your resume into a polished personal website you can customize and publish quickly.`,
      category: 'Getting Started'
    },
    {
      question: `How do I create a portfolio with Nexfolio?`,
      answer: `Upload your resume, let the AI extract your details, choose a template, and customize the result in the live editor before publishing.`,
      category: 'Getting Started'
    },
    {
      question: `Can I edit every section before publishing?`,
      answer: {
        content: `Yes, you can edit sections, refine copy, swap layouts, and preview every change before you go live.`,
        type: 'list',
        data: [
          { primary: 'Live section editing' },
          { primary: 'Color and font controls' },
          { primary: 'Instant preview' }
        ]
      },
      category: 'Customization'
    },
    {
      question: `Can I export or deploy my portfolio?`,
      answer:
        'Yes. You can download the source code and deploy directly to Vercel, Netlify, or GitHub Pages when you are ready to publish.',
      category: 'Export & Deploy'
    },
    {
      question: 'Is the portfolio mobile responsive?',
      answer: 'Yes. Nexfolio is designed to look polished on mobile, tablet, and desktop screens.',
      category: 'Customization'
    },
    {
      question: `How does AI help with the content?`,
      answer: {
        content: 'The AI helps organize your resume data into clear sections and can enhance the content for a stronger portfolio story.',
        type: 'list',
        data: [
          { primary: 'Skills and projects organized automatically' },
          { primary: 'Cleaner portfolio copy' },
          { primary: 'Professional presentation' }
        ]
      },
      category: 'Getting Started'
    },
    {
      question: `Can recruiters view my portfolio easily?`,
      answer: {
        content:
          'Yes. The portfolio is built to be clean, fast, and recruiter-friendly so your work is easy to scan and remember.',
        type: 'list',
        data: [
          { primary: 'SEO-friendly structure' },
          { primary: 'Fast-loading pages' },
          { primary: 'Clear project storytelling' }
        ]
      },
      category: 'Export & Deploy'
    },

    {
      question: 'Do you offer support after launch?',
      answer:
        'Yes. Reach out by email or phone if you need help with setup, content updates, or deployment guidance.',
      category: 'Support'
    },
    {
      question: 'Can I use my own custom domain?',
      answer: {
        content:
          'Yes. You can connect your own domain when you publish your portfolio so your personal brand feels complete and professional.',
        type: 'list',
        data: [{ primary: 'Custom domain support' }, { primary: 'Professional branding' }]
      },
      category: 'Export & Deploy'
    },
    {
      question: 'Does Nexfolio keep my content private?',
      answer: {
        content:
          'Yes. Your resume content and portfolio details are handled with privacy in mind and used only to generate your portfolio.',
        type: 'list',
        data: [{ primary: 'Resume data protection' }, { primary: 'Private editing flow' }, { primary: 'Secure publishing' }]
      },
      category: 'Support'
    }
  ],
  getInTouch: {
    link: { children: 'Contact Us', href: branding.company.socialLink.support, target: '_blank', rel: 'noopener noreferrer' }
  },
  categories: ['Getting Started', 'Customization', 'Export & Deploy', 'Support'],
  activeCategory: 'Getting Started'
};
