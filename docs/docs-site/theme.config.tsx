import type { DocsThemeConfig } from 'nextra-theme-docs';
import Search from './components/search';
import Image from 'next/image';
import Link from 'next/link';

const config: DocsThemeConfig = {
  docsRepositoryBase:
    'https://github.com/brainly/gene/tree/master/docs/docs-site/pages',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Brainly Gene',
    };
  },
  navigation: {
    next: true,
    prev: true,
  },
  project: {
    link: 'https://github.com/brainly/gene',
  },
  search: {
    component: <Search />,
  },
  darkMode: false, // wether to show theme switcher
  nextThemes: {
    defaultTheme: 'dark',
  },
  primaryHue: 177,
  primarySaturation: 89,
  sidebar: {
    // defaultMenuCollapseLevel: 0,
  },
  footer: {
    component: (
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {`${new Date().getFullYear()} © Brainly.`} All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-xs hover:underline underline-offset-4"
            href="https://github.com/brainly/gene/blob/master/LICENSE"
          >
            Apache-2.0 license
          </a>
          <a
            className="text-xs hover:underline underline-offset-4"
            href="https://github.com/brainly/gene/blob/master/CODE_OF_CONDUCT.md"
          >
            Code of conduct
          </a>
          <a
            className="text-xs hover:underline underline-offset-4"
            href="https://github.com/brainly/gene/blob/master/TRADEMARK.md"
          >
            Trademark Guidelines
          </a>
        </nav>
      </footer>
    ),
  },
  // editLink: {
  //   footer: {
  //     text: 'Edit this page on GitHub',
  //   },
  // },
  logo: (
    <Link href="/">
      <>
        <Image src="/logo.svg" alt="Gene" width={30} height={30} />
        <span className="ml-2 text-2xl font-barlow font-black">Brainly Gene</span>
      </>
    </Link>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Gene docs" />
      <meta name="og:title" content="Gene docs" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* font for Headers */}
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      {/* font for content */}
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
        rel="stylesheet"
      />
    </>
  ),
};

export default config;
