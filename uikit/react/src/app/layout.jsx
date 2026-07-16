import PropTypes from 'prop-types';
import Script from 'next/script';

// @style
import './globals.css';

// @mui
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// @project
import ProviderWrapper from './ProviderWrapper';
import { mainMetadata } from '@/metadata';

const gaId = process.env.NEXT_PUBLIC_ANALYTICS_ID || '';

/***************************  METADATA - MAIN  ***************************/

export const metadata = { ...mainMetadata };

/***************************  LAYOUT - MAIN  ***************************/

// Root layout component that wraps the entire application
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body suppressHydrationWarning>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ProviderWrapper>{children}</ProviderWrapper>
        </AppRouterCacheProvider>
        {gaId && <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />}
      </body>
    </html>
  );
}

RootLayout.propTypes = { children: PropTypes.any };
