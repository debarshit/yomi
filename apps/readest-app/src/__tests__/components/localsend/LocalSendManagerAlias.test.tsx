import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';

let currentUser: any = null;
let currentCustomAlias = '';

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => (key: string, options?: Record<string, string | number>) => {
    let result = key;
    if (options) {
      for (const [k, v] of Object.entries(options)) {
        result = result.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      }
    }
    return result;
  },
}));
vi.mock('@/services/environment', () => ({ isTauriAppPlatform: () => true }));
vi.mock('@/context/EnvContext', () => ({
  useEnv: () => ({
    envConfig: {},
    appService: { osPlatform: 'macos', isIOSApp: false, isAndroidApp: false, hasHaptics: false },
  }),
}));
vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ user: currentUser }) }));
vi.mock('@/hooks/useQuotaStats', () => ({
  useQuotaStats: () => ({ userProfilePlan: 'free', customizationPurchased: false }),
}));
vi.mock('@/services/localsend/devicePrefs', () => ({
  DEFAULT_ALIAS_NAMED_KEY: "{{name}}'s {{brand}}",
  getLocalSendAlias: () => currentCustomAlias,
  isLocalSendEnabled: () => true,
}));
vi.mock('@/utils/bridge', () => ({ setMulticastLock: vi.fn(async () => {}) }));
vi.mock('@/services/localsend/sounds', () => ({ playTransferDoneCue: vi.fn() }));
vi.mock('@/services/ingestService', () => ({ ingestFile: vi.fn() }));
vi.mock('@/services/localsend/bookFile', () => ({ resolveBookSendFile: vi.fn() }));
vi.mock('@tauri-apps/plugin-haptics', () => ({ impactFeedback: vi.fn(async () => {}) }));
vi.mock('@tauri-apps/api/event', () => ({ listen: vi.fn(async () => () => {}) }));
vi.mock('@tauri-apps/plugin-os', () => ({ hostname: vi.fn(async () => null) }));

const startLocalSend = vi.fn(async (alias: string, deviceModel: string) => ({
  running: true,
  alias,
  port: 53318,
  fingerprint: 'fp',
  deviceModel,
  localIps: ['192.168.1.50'],
  multicastError: null,
}));
const stopLocalSend = vi.fn(async () => {});
const setLocalSendDiscoverable = vi.fn(async (_active?: boolean) => {});
const isLocalSendAlive = vi.fn(async () => true);

vi.mock('@/services/localsend/service', () => ({
  startLocalSend: (alias: string, deviceModel: string) => startLocalSend(alias, deviceModel),
  stopLocalSend: () => stopLocalSend(),
  setLocalSendDiscoverable: (active: boolean) => setLocalSendDiscoverable(active),
  isLocalSendAlive: () => isLocalSendAlive(),
  respondLocalSend: vi.fn(async () => true),
  cancelLocalSendReceive: vi.fn(async () => {}),
}));

import LocalSendManager from '@/components/localsend/LocalSendManager';

beforeEach(() => {
  vi.clearAllMocks();
  currentUser = null;
  currentCustomAlias = '';
});

afterEach(() => {
  cleanup();
});

describe('LocalSendManager default alias', () => {
  it('uses "<firstName>\'s Yomi" when user is signed in with full_name', async () => {
    currentUser = { user_metadata: { full_name: 'Debarshi Das' } };
    await act(async () => {
      render(<LocalSendManager />);
    });
    expect(startLocalSend).toHaveBeenCalledWith("Debarshi's Yomi", 'macOS');
  });

  it('uses "<firstName>\'s Yomi" when user is signed in with name in metadata', async () => {
    currentUser = { user_metadata: { name: 'Alice Smith' } };
    await act(async () => {
      render(<LocalSendManager />);
    });
    expect(startLocalSend).toHaveBeenCalledWith("Alice's Yomi", 'macOS');
  });

  it('defaults to "Yomi" when user is not signed in and hostname is unavailable', async () => {
    currentUser = null;
    await act(async () => {
      render(<LocalSendManager />);
    });
    expect(startLocalSend).toHaveBeenCalledWith('Yomi', 'macOS');
  });

  it('uses custom alias when specified in devicePrefs', async () => {
    currentCustomAlias = 'My Custom Reader';
    currentUser = { user_metadata: { full_name: 'Debarshi Das' } };
    await act(async () => {
      render(<LocalSendManager />);
    });
    expect(startLocalSend).toHaveBeenCalledWith('My Custom Reader', 'macOS');
  });
});
