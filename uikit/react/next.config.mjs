/** @type {import('next').NextConfig} */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://vercel.live https://va.vercel-scripts.com https://*.clarity.ms https://fomo.codedthemes.com https://apis.google.com https://*.firebaseapp.com;
    style-src 'self' 'unsafe-inline' https://fomo.codedthemes.com https://fonts.googleapis.com;
    img-src 'self' blob: data: https://www.googletagmanager.com https://flagcdn.com https://*.openstreetmap.org https://*.clarity.ms https://*.bing.com https://fomo.codedthemes.com;
    font-src 'self' https://*.gstatic.com;
    object-src 'self';
    base-uri 'self';
    form-action 'self';
    media-src 'self' https://*.cloudfront.net;
    frame-src 'self' https://*.firebaseapp.com http://localhost:5000 https://*.onrender.com;
    connect-src 'self' https://www.googletagmanager.com https://raw.githubusercontent.com https://fomo.codedthemes.com https://*.clarity.ms https://*.azurewebsites.net https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseapp.com http://localhost:5000 https://*.onrender.com;
`;

const nextConfig = {
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, '')
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
