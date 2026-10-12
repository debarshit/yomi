import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Apple,
  Laptop,
  Smartphone,
  Globe,
  Download,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download Yomi - Beautiful, Cross-Platform Ebook Reader | Biblophile',
  description:
    'Download Yomi for macOS, Windows, Linux, iOS, and Android. Fast, distraction-free reading with seamless cloud sync and built-in dictionary lookups.',
};

const basePath = process.env['NEXT_PUBLIC_BASE_PATH'] || '';
const GITHUB_RELEASES_URL = 'https://github.com/debarshit/yomi/releases/latest';

export default function DownloadPage() {
  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col'>
      {/* Navigation Bar */}
      <header className='border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-4 h-16 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-3 hover:opacity-85 transition-opacity'>
            <Image
              src={`${basePath}/icon.png`}
              alt='Yomi Logo'
              width={36}
              height={36}
              className='rounded-xl shadow-sm'
            />
            <span className='font-bold text-xl tracking-tight'>Yomi</span>
            <span className='text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'>
              by Biblophile
            </span>
          </Link>
          <div className='flex items-center gap-4 text-sm font-medium'>
            <Link
              href='/support'
              className='text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
            >
              Support
            </Link>
            <Link
              href='/'
              className='px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity'
            >
              Open Web Reader
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='flex-1 max-w-6xl mx-auto px-4 py-12 md:py-20 w-full'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 mb-6'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>Cross-platform reading without compromises</span>
          </div>
          <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight mb-4'>
            Read comfortably on every screen with <span className='text-primary'>Yomi</span>
          </h1>
          <p className='text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8'>
            Fast, typography-focused reader with instant dictionary lookups, continuous cloud sync,
            and support for EPUB, MOBI, AZW3, PDF, and CBZ.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500 dark:text-neutral-400'>
            <div className='flex items-center gap-1.5'>
              <ShieldCheck className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              <span>Free & Open Source</span>
            </div>
            <span>•</span>
            <div className='flex items-center gap-1.5'>
              <Zap className='w-4 h-4 text-amber-600 dark:text-amber-400' />
              <span>Offline-first & Private</span>
            </div>
            <span>•</span>
            <div className='flex items-center gap-1.5'>
              <BookOpen className='w-4 h-4 text-blue-600 dark:text-blue-400' />
              <span>Cloud Library Sync</span>
            </div>
          </div>
        </div>

        {/* Downloads Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16'>
          {/* macOS */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5 text-neutral-800 dark:text-neutral-200'>
                <Apple className='w-6 h-6' />
              </div>
              <h2 className='text-xl font-bold mb-1'>macOS</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                macOS 12.0 Monterey or later
              </p>
              <div className='space-y-2.5 mb-6'>
                <a
                  href={`${GITHUB_RELEASES_URL}`}
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity'
                >
                  <span className='flex items-center gap-2'>
                    <Download className='w-4 h-4' />
                    Apple Silicon (M1/M2/M3/M4)
                  </span>
                  <span className='text-xs opacity-75'>.dmg</span>
                </a>
                <a
                  href={`${GITHUB_RELEASES_URL}`}
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
                >
                  <span className='flex items-center gap-2'>
                    <Download className='w-4 h-4' />
                    Intel Mac
                  </span>
                  <span className='text-xs text-neutral-500'>.dmg</span>
                </a>
              </div>
            </div>
            <a
              href='https://apps.apple.com/app/yomi/id6478832049'
              target='_blank'
              rel='noreferrer'
              className='text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1'
            >
              <span>Download from Mac App Store</span>
              <ExternalLink className='w-3 h-3' />
            </a>
          </div>

          {/* Windows */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5 text-neutral-800 dark:text-neutral-200'>
                <Laptop className='w-6 h-6' />
              </div>
              <h2 className='text-xl font-bold mb-1'>Windows</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                Windows 10 / 11 (64-bit)
              </p>
              <div className='space-y-2.5 mb-6'>
                <a
                  href={`${GITHUB_RELEASES_URL}`}
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity'
                >
                  <span className='flex items-center gap-2'>
                    <Download className='w-4 h-4' />
                    Installer (.exe)
                  </span>
                  <span className='text-xs opacity-75'>x64</span>
                </a>
                <a
                  href={`${GITHUB_RELEASES_URL}`}
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
                >
                  <span className='flex items-center gap-2'>
                    <Download className='w-4 h-4' />
                    Portable (.zip)
                  </span>
                  <span className='text-xs text-neutral-500'>no install</span>
                </a>
              </div>
            </div>
            <span className='text-xs text-neutral-400 dark:text-neutral-500'>
              Signed binaries with automatic in-app updates
            </span>
          </div>

          {/* Linux */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5 text-neutral-800 dark:text-neutral-200'>
                <Laptop className='w-6 h-6' />
              </div>
              <h2 className='text-xl font-bold mb-1'>Linux</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                Ubuntu, Debian, Fedora, Arch & more
              </p>
              <div className='space-y-2.5 mb-6'>
                <a
                  href={`${GITHUB_RELEASES_URL}`}
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity'
                >
                  <span className='flex items-center gap-2'>
                    <Download className='w-4 h-4' />
                    AppImage
                  </span>
                  <span className='text-xs opacity-75'>Universal</span>
                </a>
                <div className='grid grid-cols-2 gap-2'>
                  <a
                    href={`${GITHUB_RELEASES_URL}`}
                    className='flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  >
                    <Download className='w-3.5 h-3.5' />
                    .deb (Debian)
                  </a>
                  <a
                    href={`${GITHUB_RELEASES_URL}`}
                    className='flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  >
                    <Download className='w-3.5 h-3.5' />
                    .rpm (Fedora)
                  </a>
                </div>
              </div>
            </div>
            <span className='text-xs text-neutral-400 dark:text-neutral-500'>
              Native GTK3 / WebKitGTK with Wayland support
            </span>
          </div>

          {/* Android */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5 text-neutral-800 dark:text-neutral-200'>
                <Smartphone className='w-6 h-6' />
              </div>
              <h2 className='text-xl font-bold mb-1'>Android</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                Phones, Tablets, and E-ink devices
              </p>
              <div className='space-y-2.5 mb-6'>
                <a
                  href={`${GITHUB_RELEASES_URL}`}
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity'
                >
                  <span className='flex items-center gap-2'>
                    <Download className='w-4 h-4' />
                    Direct APK Download
                  </span>
                  <span className='text-xs opacity-75'>Universal</span>
                </a>
                <a
                  href='https://play.google.com/store/apps/details?id=com.biblophile.yomi'
                  target='_blank'
                  rel='noreferrer'
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
                >
                  <span className='flex items-center gap-2'>
                    <ExternalLink className='w-4 h-4' />
                    Google Play Store
                  </span>
                  <span className='text-xs text-neutral-500'>Coming soon</span>
                </a>
              </div>
            </div>
            <span className='text-xs text-neutral-400 dark:text-neutral-500'>
              Special high-contrast mode for E-ink ereaders
            </span>
          </div>

          {/* iOS / iPadOS */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5 text-neutral-800 dark:text-neutral-200'>
                <Smartphone className='w-6 h-6' />
              </div>
              <h2 className='text-xl font-bold mb-1'>iOS / iPadOS</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                iOS 16.4 or later
              </p>
              <div className='space-y-2.5 mb-6'>
                <a
                  href='https://apps.apple.com/app/yomi/id6478832049'
                  target='_blank'
                  rel='noreferrer'
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity'
                >
                  <span className='flex items-center gap-2'>
                    <ExternalLink className='w-4 h-4' />
                    Apple App Store
                  </span>
                  <span className='text-xs opacity-75'>iPhone & iPad</span>
                </a>
              </div>
            </div>
            <span className='text-xs text-neutral-400 dark:text-neutral-500'>
              Includes Safari Share Extension and Reading Home Widgets
            </span>
          </div>

          {/* Web App */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5 text-neutral-800 dark:text-neutral-200'>
                <Globe className='w-6 h-6' />
              </div>
              <h2 className='text-xl font-bold mb-1'>Web Reader</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                Runs in Chrome, Safari, Firefox, Edge
              </p>
              <div className='space-y-2.5 mb-6'>
                <Link
                  href='/'
                  className='w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity'
                >
                  <span className='flex items-center gap-2'>
                    <Globe className='w-4 h-4' />
                    Launch Web Reader
                  </span>
                  <ArrowRight className='w-4 h-4' />
                </Link>
              </div>
            </div>
            <span className='text-xs text-neutral-400 dark:text-neutral-500'>
              PWA installable directly from your browser
            </span>
          </div>
        </div>

        {/* Release notes & GitHub section */}
        <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 p-8 text-center max-w-2xl mx-auto'>
          <h3 className='text-lg font-bold mb-2'>
            Looking for release notes or previous versions?
          </h3>
          <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-6'>
            All release packages, checksums, and changelogs are published transparently on GitHub.
          </p>
          <a
            href={GITHUB_RELEASES_URL}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors'
          >
            <span>View all GitHub Releases</span>
            <ExternalLink className='w-4 h-4' />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8 text-xs text-neutral-500 dark:text-neutral-400'>
        <div className='max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <span>© {new Date().getFullYear()} Biblophile.</span>
            <span>All rights reserved.</span>
          </div>
          <div className='flex items-center gap-6'>
            <Link href='/support' className='hover:underline'>
              Support
            </Link>
            <a
              href='https://biblophile.com/privacy'
              target='_blank'
              rel='noreferrer'
              className='hover:underline'
            >
              Privacy Policy
            </a>
            <a
              href='https://biblophile.com/terms'
              target='_blank'
              rel='noreferrer'
              className='hover:underline'
            >
              Terms of Service
            </a>
            <a
              href='https://github.com/debarshit/yomi'
              target='_blank'
              rel='noreferrer'
              className='hover:underline'
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
