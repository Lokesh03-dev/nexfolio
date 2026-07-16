// @project
import branding from '@/branding.json';
import { Faq6 } from '@/blocks/faq';

/***************************  FAQ 6 - DATA  ***************************/

const data = {
  heading: 'Frequently Asked Questions',
  caption: `Answers to common queries about ${branding.brandName} and how it turns resumes into portfolio websites.`,
  defaultExpanded: 'Getting Started',
  faqList: [
    {
      question: `What is ${branding.brandName}?`,
      answer: `${branding.brandName} is an AI resume-to-portfolio builder that helps you launch a polished personal website quickly.`,
      category: 'Getting Started'
    },
    {
      question: `How does the resume upload work?`,
      answer: `Upload a PDF or DOCX resume and the AI extracts your skills, experience, projects, education, and certifications automatically.`,
      category: 'Getting Started'
    },
    {
      question: `Can I customize the portfolio before publishing?`,
      answer: {
        content: `Yes, you can edit every section, adjust styles, and preview the result in real time.`,
        type: 'list',
        data: [
          { primary: 'Live editing' },
          { primary: 'Color and font controls' },
          { primary: 'Instant preview' }
        ]
      },
      category: 'Customization'
    },
    {
      question: `Can I download the source code?`,
      answer:
        'Yes, you can export the portfolio source and host it wherever you prefer.',
      category: 'Export & Deploy'
    },
    {
      question: 'Is Nexfolio SEO friendly?',
      answer: 'Yes. The generated portfolio is structured to help your work get discovered more easily.',
      category: 'Export & Deploy'
    },
    {
      question: `What support do I get?`,
      answer: {
        content: 'You can reach out by email or phone for help with setup, customization, and publishing.',
        type: 'list',
        data: [
          { primary: `Email support` },
          { primary: `Phone support` },
          { primary: `Website access` }
        ]
      },
      category: 'Support'
    },
    {
      question: `Can I use a custom domain?`,
      answer: {
        content:
          'Yes, you can connect your own domain to make your portfolio feel fully branded and ready to share.',
        type: 'list',
        data: [
          { primary: `Custom domain support` },
          { primary: `Professional branding` },
          { primary: `Recruiter-ready sharing` }
        ]
      },
      category: 'Export & Deploy'
    },

    {
      question: 'Is my data kept private?',
      answer:
        'Yes, your resume content and portfolio details are handled with privacy in mind and used only to generate your portfolio.',
      category: 'Support'
    },
    {
      question: 'Do I get future updates?',
      answer: {
        content:
          'Yes, you will receive ongoing product updates so Nexfolio stays fresh and ready for new portfolio needs.',
        type: 'list',
        data: [{ primary: `Ongoing updates` }, { primary: `Lifetime access` }]
      },
      category: 'Support'
    },
    {
      question: 'Can recruiters view my site on mobile?',
      answer: {
        content:
          'Yes, Nexfolio is responsive and designed to look great on mobile, tablet, and desktop screens.',
        type: 'list',
        data: [{ primary: `Responsive layouts` }, { primary: `Readable typography` }, { primary: `Easy navigation` }]
      },
      category: 'Customization'
    }
  ],
  getInTouch: { link: { children: 'Contact Us' } },
  categories: ['Getting Started', 'Customization', 'Export & Deploy', 'Support'],
  activeCategory: 'Getting Started'
};

/***************************  FAQ - 6  ***************************/

export default function BlockFaq6() {
  return <Faq6 {...data} />;
}
