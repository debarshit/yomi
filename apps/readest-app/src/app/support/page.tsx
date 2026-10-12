import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  Instagram,
  Bug,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  FileQuestion,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support & Help - Yomi by Biblophile',
  description:
    'Need help with Yomi? Reach out to help@biblophile.com, join our community on Discord, or find answers to frequently asked questions.',
};

const basePath = process.env['NEXT_PUBLIC_BASE_PATH'] || '';

const FAQS = [
  {
    q: 'How does reading progress and library synchronization work?',
    a: 'When you are signed in, Yomi seamlessly synchronizes your reading positions, bookmarks, highlights, and annotations across all your devices using Biblophile Cloud. Your progress is saved automatically and restored whenever you open a book.',
  },
  {
    q: 'Which ebook formats does Yomi support?',
    a: 'Yomi natively supports EPUB, MOBI, AZW, AZW3, FB2, CBZ comics, PDF documents, plain text (.txt), and Markdown (.md) files.',
  },
  {
    q: 'Can I read offline?',
    a: 'Yes! Yomi is built offline-first. Downloaded books, dictionary gloss packs, reading progress, and custom fonts are cached locally on your device so you can read without an internet connection.',
  },
  {
    q: 'How does WordLens dictionary lookup work?',
    a: 'WordLens lets you select any word or sentence in a book to view instant definitions, grammar breakdowns, and translations. You can also download offline language packs from settings to look up words without network access.',
  },
  {
    q: 'How do I send books or articles to Yomi?',
    a: 'You can import files directly from your computer or phone, use our "Send to Yomi" browser extension for Chrome and Firefox, or upload documents directly via the Web Reader.',
  },
  {
    q: 'How do I update to the latest version?',
    a: 'On macOS and Windows, Yomi checks for updates automatically in the background and prompts you when a new release is ready. You can also manually trigger an update check in Settings > About or download the latest release from the Download page.',
  },
];

export default function SupportPage() {
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
              href='/download'
              className='text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
            >
              Downloads
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
      <main className='flex-1 max-w-6xl mx-auto px-4 py-12 md:py-16 w-full'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 mb-6'>
            <HelpCircle className='w-3.5 h-3.5' />
            <span>Support & Community</span>
          </div>
          <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight mb-4'>
            How can we help you?
          </h1>
          <p className='text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed'>
            Have questions about Yomi, need help with your account, or want to report an issue? We
            are here to help.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
          {/* Email Support */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400'>
                <Mail className='w-5 h-5' />
              </div>
              <h2 className='text-lg font-bold mb-1'>Email Support</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                Get direct support from the Biblophile development team for any questions or account
                issues.
              </p>
            </div>
            <a
              href='mailto:help@biblophile.com'
              className='inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
            >
              <span>help@biblophile.com</span>
              <ArrowRight className='w-3.5 h-3.5' />
            </a>
          </div>

          {/* Discord Community */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400'>
                <MessageSquare className='w-5 h-5' />
              </div>
              <h2 className='text-lg font-bold mb-1'>Discord Community</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                Chat with other readers, share reading lists, give feedback, and participate in
                feature discussions.
              </p>
            </div>
            <a
              href='https://discord.gg/tyg7WVeTmQ'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors'
            >
              <span>Join Discord</span>
              <ExternalLink className='w-3.5 h-3.5' />
            </a>
          </div>

          {/* Instagram */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-11 h-11 rounded-xl bg-pink-50 dark:bg-pink-950/50 flex items-center justify-center mb-4 text-pink-600 dark:text-pink-400'>
                <Instagram className='w-5 h-5' />
              </div>
              <h2 className='text-lg font-bold mb-1'>Instagram</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                Follow updates, product announcements, reading tips, and community showcases on
                Instagram.
              </p>
            </div>
            <a
              href='https://instagram.com/__biblophile__'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
            >
              <span>@__biblophile__</span>
              <ExternalLink className='w-3.5 h-3.5' />
            </a>
          </div>

          {/* GitHub Issues */}
          <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <div className='w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400'>
                <Bug className='w-5 h-5' />
              </div>
              <h2 className='text-lg font-bold mb-1'>Bug Reports</h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6'>
                Found a rendering bug or issue with an ebook file? Submit an issue on our public
                GitHub repository.
              </p>
            </div>
            <a
              href='https://github.com/debarshit/yomi/issues'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
            >
              <span>GitHub Issues</span>
              <ExternalLink className='w-3.5 h-3.5' />
            </a>
          </div>
        </div>

        {/* FAQs Section */}
        <div className='max-w-3xl mx-auto'>
          <div className='flex items-center gap-2 mb-8'>
            <FileQuestion className='w-5 h-5 text-primary' />
            <h2 className='text-2xl font-bold tracking-tight'>Frequently Asked Questions</h2>
          </div>

          <div className='space-y-4'>
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className='rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm'
              >
                <h3 className='font-semibold text-base mb-2 text-neutral-900 dark:text-neutral-100'>
                  {faq.q}
                </h3>
                <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
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
            <Link href='/download' className='hover:underline'>
              Downloads
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
