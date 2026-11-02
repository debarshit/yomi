import Image from 'next/image';
import type { SupabaseClient } from '@supabase/supabase-js';
import posthog from 'posthog-js';
import { useTranslation } from '@/hooks/useTranslation';
import { getOSPlatform } from '@/utils/misc';
import { trackYomiSignupClicked } from '@/utils/telemetry';
import { isTauriAppPlatform } from '@/services/environment';
import { openSafariView } from '@/utils/open';
import EmailPasswordAuth from './EmailPasswordAuth';

const basePath = process.env['NEXT_PUBLIC_BASE_PATH'] || '';

interface AuthPanelProps {
  supabaseClient: SupabaseClient;
  redirectTo?: string;
  magicLink?: boolean;
  onProviderSignIn?: (provider: any) => Promise<void>;
}

export default function AuthPanel({
  supabaseClient,
  redirectTo,
  magicLink = false,
}: AuthPanelProps) {
  const _ = useTranslation();

  const getSignupUrl = () => {
    try {
      const osPlatform = getOSPlatform();
      const distinctId = typeof window !== 'undefined' ? posthog.get_distinct_id() : '';
      const params = new URLSearchParams({
        source: 'yomi',
        from_platform: osPlatform,
      });
      if (distinctId) {
        params.set('yomi_id', distinctId);
      }
      return `https://biblophile.com/signupLogin?${params.toString()}`;
    } catch {
      return 'https://biblophile.com/signupLogin?source=yomi';
    }
  };

  return (
    <div className='flex w-full max-w-sm flex-col items-center gap-6'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <Image
          src={`${basePath}/icon.png`}
          alt=''
          width={56}
          height={56}
          className='eink-bordered rounded-xl'
        />
        <div>
          <h1 className='text-xl font-semibold tracking-tight'>
            {_('Sign in with your Biblophile account')}
          </h1>
          <p className='text-base-content/70 mt-1.5 text-sm leading-relaxed'>
            {_('Use your Biblophile account to sync your library and reading progress.')}
          </p>
          <p className='text-base-content/50 mt-2 text-xs'>
            {_("Don't have an account?")}{' '}
            <a
              href={getSignupUrl()}
              target='_blank'
              rel='noopener noreferrer'
              onClick={(e) => {
                if (isTauriAppPlatform()) {
                  e.preventDefault();
                  void openSafariView(getSignupUrl());
                }
                trackYomiSignupClicked(getOSPlatform());
              }}
              className='underline underline-offset-2 hover:text-base-content transition-colors cursor-pointer'
            >
              {_('Sign up on Biblophile')}
            </a>
          </p>
        </div>
      </div>
      <EmailPasswordAuth
        supabaseClient={supabaseClient}
        redirectTo={redirectTo}
        magicLink={magicLink}
      />
    </div>
  );
}
