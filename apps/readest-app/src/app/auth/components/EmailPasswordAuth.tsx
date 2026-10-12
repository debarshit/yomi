import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useTranslation } from '@/hooks/useTranslation';

const apiUrl = process.env['NEXT_PUBLIC_BIBLO_API_URL'] || 'http://localhost:3001/api/v0';

type AuthView = 'sign_in' | 'sign_up' | 'magic_link' | 'verify_otp' | 'forgotten_password';

interface EmailPasswordAuthProps {
  supabaseClient: SupabaseClient;
  redirectTo?: string;
  magicLink?: boolean;
}

const FORM_IDS: Record<AuthView, string> = {
  sign_in: 'auth-sign-in',
  sign_up: 'auth-sign-up',
  magic_link: 'auth-magic-link',
  verify_otp: 'auth-verify-otp',
  forgotten_password: 'auth-forgot-password',
};

const LINK_CLASS =
  'text-base-content/70 hover:text-base-content underline underline-offset-2 transition-colors duration-150';

export default function EmailPasswordAuth({
  supabaseClient,
  redirectTo,
  magicLink = false,
}: EmailPasswordAuthProps) {
  const _ = useTranslation();
  const [view, setView] = useState<AuthView>('sign_in');
  const [defaultEmail, setDefaultEmail] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [keyboardInset, setKeyboardInset] = useState(0);

  const hasPassword = view === 'sign_in' || view === 'sign_up';

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const layoutH = document.documentElement.clientHeight;
      const offset = layoutH - vv.height - vv.offsetTop;
      setKeyboardInset(offset > 1 ? offset : 0);
    };
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    update();
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  // The Android WebView does not resize with the keyboard, and Chromium
  // resets the visual-viewport pan when the IME advances focus (keyboard
  // Next) without re-scrolling the newly focused editable. The keyboard
  // spacer gives the page scroller enough range, and the focus handler
  // scrolls the input back into the visible area above the keyboard.
  const keepAboveKeyboard = (event: React.FocusEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    setTimeout(() => {
      if (document.activeElement === input) {
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }, 300);
  };

  const switchView = (next: AuthView) => (event: React.MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (form) {
      const email = new FormData(form).get('email');
      if (typeof email === 'string' && email) {
        setDefaultEmail(email);
      }
    }
    setError('');
    setMessage('');
    setView(next);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !otpEmail || loading) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error: err } = await supabaseClient.auth.signInWithOtp({
        email: otpEmail,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: false,
        },
      });
      if (err) {
        setError(err.message);
      } else {
        setResendCooldown(60);
        setMessage(_('A new 6-digit code has been sent to your email'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Read credentials from the form's DOM state: Android/iOS password
    // managers fill WebView inputs without events React state can track.
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (view === 'sign_in') {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      } else if (view === 'sign_up') {
        const {
          data: { user, session },
          error,
        } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });
        if (error) setError(error.message);
        else if (user && !session) setMessage(_('Check your email for the confirmation link'));
      } else if (view === 'magic_link') {
        // Verify user with backend and mirror if needed
        try {
          const checkRes = await fetch(`${apiUrl}/auth/prepare-magic-link`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (!checkRes.ok) {
            const errData = await checkRes.json();
            throw new Error(
              errData.message ||
                _('Account validation failed. Please make sure you have a Biblophile account.'),
            );
          }
        } catch (err: any) {
          setError(err.message || _('Failed to verify account. Please try again.'));
          setLoading(false);
          return;
        }

        const { error } = await supabaseClient.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectTo,
            shouldCreateUser: false,
          },
        });
        if (error) {
          setError(error.message);
        } else {
          setOtpEmail(email);
          setResendCooldown(60);
          setView('verify_otp');
          setMessage(_('We sent a 6-digit code and a login link to your email'));
        }
      } else if (view === 'verify_otp') {
        const token = String(formData.get('otp') || '').trim();
        if (!token) {
          setError(_('Please enter the 6-digit verification code'));
          setLoading(false);
          return;
        }
        const { error: err } = await supabaseClient.auth.verifyOtp({
          email: otpEmail,
          token,
          type: 'email',
        });
        if (err) {
          setError(err.message);
        } else {
          setMessage(_('Verification successful. Redirecting...'));
        }
      } else {
        try {
          const res = await fetch(`${apiUrl}/auth/forgot-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || _('Failed to send reset instructions.'));
          }

          setMessage(_('Check your email for the password reset link'));
        } catch (err: any) {
          setError(err.message || _('Failed to send reset instructions. Please try again.'));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const buttonLabel = {
    sign_in: loading ? _('Signing in...') : _('Sign in'),
    sign_up: loading ? _('Signing up...') : _('Sign up'),
    magic_link: loading ? _('Sending code...') : _('Send code & magic link'),
    verify_otp: loading ? _('Verifying...') : _('Verify and sign in'),
    forgotten_password: loading
      ? _('Sending reset instructions ...')
      : _('Send reset password instructions'),
  }[view];

  return (
    <form
      key={view}
      id={FORM_IDS[view]}
      method='post'
      onSubmit={handleSubmit}
      className='w-full space-y-4'
    >
      {view === 'verify_otp' ? (
        <div className='flex flex-col space-y-2'>
          <div className='text-center text-sm text-base-content/80'>
            {_('Enter the 6-digit code sent to')}{' '}
            <span className='font-semibold text-base-content'>{otpEmail}</span>
          </div>
          <div className='flex flex-col'>
            <label
              className='flex select-none items-center justify-between px-1 py-2'
              htmlFor='otp'
            >
              <span className='text-sm'>{_('Verification code')}</span>
            </label>
            <input
              id='otp'
              name='otp'
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              maxLength={6}
              required
              autoFocus
              autoComplete='one-time-code'
              placeholder='123456'
              className='input eink-bordered w-full rounded-lg text-center font-mono text-xl tracking-[0.4em] placeholder:tracking-normal placeholder:text-sm'
              disabled={loading}
              onFocus={keepAboveKeyboard}
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col'>
          <label
            className='flex select-none items-center justify-between px-1 py-2'
            htmlFor='email'
          >
            <span className='text-sm'>{_('Email address')}</span>
          </label>
          <input
            id='email'
            name='email'
            type='email'
            required
            defaultValue={defaultEmail}
            placeholder={_('Your email address')}
            autoComplete={hasPassword ? 'username' : 'email'}
            className='input eink-bordered w-full rounded-lg placeholder:text-sm'
            disabled={loading}
            onFocus={keepAboveKeyboard}
          />
        </div>
      )}
      {hasPassword && (
        <div className='flex flex-col'>
          <label
            className='flex select-none items-center justify-between px-1 py-2'
            htmlFor='password'
          >
            <span className='text-sm'>
              {view === 'sign_in' ? _('Your Password') : _('Create a Password')}
            </span>
          </label>
          <input
            id='password'
            name='password'
            type='password'
            required
            placeholder={_('Your password')}
            autoComplete={view === 'sign_in' ? 'current-password' : 'new-password'}
            className='input eink-bordered w-full rounded-lg placeholder:text-sm'
            disabled={loading}
            onFocus={keepAboveKeyboard}
          />
        </div>
      )}
      <button type='submit' className='btn btn-primary w-full rounded-lg' disabled={loading}>
        {loading && <span className='loading loading-spinner loading-sm' aria-hidden='true' />}
        {buttonLabel}
      </button>
      {message && (
        <div className='eink-bordered border-base-200 bg-base-200/40 text-base-content/80 rounded-lg border px-3 py-2.5 text-center text-sm leading-relaxed'>
          {message}
        </div>
      )}
      {error && (
        <div className='eink-bordered border-error/30 bg-error/5 text-error rounded-lg border px-3 py-2.5 text-center text-sm leading-relaxed'>
          {error}
        </div>
      )}
      <div className='flex flex-col items-center gap-2.5 pt-1 text-sm'>
        {view === 'verify_otp' && (
          <>
            <p className='text-center text-xs text-base-content/60 px-2'>
              {_('Or tap the magic link in your email to sign in automatically.')}
            </p>
            <button
              type='button'
              className={`${LINK_CLASS} ${resendCooldown > 0 ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || loading}
            >
              {resendCooldown > 0 ? `${_('Resend code in')} ${resendCooldown}s` : _('Resend code')}
            </button>
            <button
              type='button'
              className={LINK_CLASS}
              onClick={() => {
                setError('');
                setMessage('');
                setView('magic_link');
              }}
            >
              {_('Use a different email')}
            </button>
            <button type='button' className={LINK_CLASS} onClick={switchView('sign_in')}>
              {_('Already have an account? Sign in')}
            </button>
          </>
        )}
        {view === 'sign_in' && (
          <>
            {magicLink && (
              <button type='button' className={LINK_CLASS} onClick={switchView('magic_link')}>
                {_('Send a magic link email')}
              </button>
            )}
            <button type='button' className={LINK_CLASS} onClick={switchView('forgotten_password')}>
              {_('Forgot your password?')}
            </button>
          </>
        )}
        {view !== 'sign_in' && view !== 'verify_otp' && (
          <button type='button' className={LINK_CLASS} onClick={switchView('sign_in')}>
            {_('Already have an account? Sign in')}
          </button>
        )}
      </div>
      {keyboardInset > 0 && (
        <div data-keyboard-spacer='' aria-hidden='true' style={{ height: `${keyboardInset}px` }} />
      )}
    </form>
  );
}
