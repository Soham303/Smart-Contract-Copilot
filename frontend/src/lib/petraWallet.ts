'use client';

/**
 * Robust Aptos / Petra Wallet Adapter
 * Supports both:
 * 1. AIP-62 Modern Wallet Standard (event-based discovery: wallet-standard:register-wallet / wallet-standard:app-ready)
 * 2. Legacy window injections (window.aptos, window.petra, etc.)
 * Includes asynchronous detection & polling to avoid extension injection race conditions.
 */

export interface UnifiedPetraWallet {
  name: string;
  isStandard: boolean;
  connect: () => Promise<{ address: string; publicKey?: string }>;
  disconnect: () => Promise<void>;
  account: () => Promise<{ address: string } | null>;
  network: () => Promise<string>;
  signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
}

let standardWalletInstance: any = null;
let standardListenersAttached = false;

// Attach Wallet Standard event listeners once in browser
export function initWalletStandardListeners(): void {
  if (typeof window === 'undefined' || standardListenersAttached) return;
  standardListenersAttached = true;

  const handleRegister = (wallet: any) => {
    if (!wallet) return;
    const name = String(wallet.name || '').toLowerCase();
    // Accept Petra or any Aptos-compatible standard wallet
    if (name.includes('petra') || name.includes('aptos') || !standardWalletInstance) {
      standardWalletInstance = wallet;
    }
  };

  // 1. Listen for wallets registering dynamically
  window.addEventListener('wallet-standard:register-wallet', (event: any) => {
    try {
      if (typeof event?.detail === 'function') {
        event.detail({ register: handleRegister });
      } else if (event?.detail && typeof event.detail.register === 'function') {
        event.detail.register(handleRegister);
      }
    } catch (e) {
      console.warn('[Wallet Standard] register listener error:', e);
    }
  });

  // 2. Announce app ready so already-injected wallets register
  dispatchAppReady(handleRegister);
}

function dispatchAppReady(registerCallback: (wallet: any) => void): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent('wallet-standard:app-ready', {
        detail: {
          register: registerCallback,
        },
      })
    );
  } catch (e) {
    console.warn('[Wallet Standard] app-ready dispatch error:', e);
  }
}

// Check legacy window objects
function getLegacyPetra(): any {
  if (typeof window === 'undefined') return null;
  const w = window as any;
  return w.aptos || w.petra || w.petraWallet || w.martian || w.pontem || null;
}

/**
 * Returns a normalized UnifiedPetraWallet if Petra / Aptos wallet is available,
 * or null if not detected.
 */
export function getPetraProvider(): UnifiedPetraWallet | null {
  if (typeof window === 'undefined') return null;

  // 1. Check AIP-62 standard wallet instance
  if (standardWalletInstance) {
    const sw = standardWalletInstance;
    return {
      name: sw.name || 'Petra Wallet',
      isStandard: true,
      connect: async () => {
        const connectFeature = sw.features?.['standard:connect'];
        if (!connectFeature) {
          throw new Error('Standard wallet does not support standard:connect');
        }
        const res = await connectFeature.connect();
        const address =
          res?.accounts?.[0]?.address ||
          sw.accounts?.[0]?.address ||
          res?.address;
        if (!address) throw new Error('No address returned from standard wallet connect');
        return { address };
      },
      disconnect: async () => {
        try {
          const disconnectFeature = sw.features?.['standard:disconnect'];
          if (disconnectFeature) await disconnectFeature.disconnect();
        } catch (e) {
          console.warn('Standard wallet disconnect error:', e);
        }
      },
      account: async () => {
        const acc = sw.accounts?.[0];
        if (acc?.address) return { address: acc.address };
        const aptosAccFeature = sw.features?.['aptos:account'];
        if (aptosAccFeature) {
          const res = await aptosAccFeature.account();
          return res?.address ? { address: res.address } : null;
        }
        return null;
      },
      network: async () => {
        try {
          const netFeature = sw.features?.['aptos:network'];
          if (netFeature) {
            const net = await netFeature.network();
            return typeof net === 'string' ? net : net?.name || 'testnet';
          }
          if (sw.chains && sw.chains.length > 0) {
            return String(sw.chains[0]).replace('aptos:', '');
          }
        } catch {}
        return 'testnet';
      },
      signAndSubmitTransaction: async (transaction: any) => {
        const signFeature =
          sw.features?.['aptos:signAndSubmitTransaction'] ||
          sw.features?.['standard:signAndSubmitTransaction'];
        if (signFeature) {
          const res = await signFeature.signAndSubmitTransaction({
            payload: transaction?.payload || transaction,
          });
          return { hash: res?.hash || res?.txnHash || '' };
        }
        throw new Error('Transaction signing not supported by this wallet standard interface');
      },
    };
  }

  // 2. Check legacy window objects
  const legacy = getLegacyPetra();
  if (legacy) {
    return {
      name: legacy.isPetra ? 'Petra Wallet' : 'Aptos Wallet',
      isStandard: false,
      connect: async () => {
        const res = await legacy.connect();
        const address = res?.address || (await legacy.account?.())?.address;
        if (!address) throw new Error('No account address returned from legacy wallet');
        return { address, publicKey: res?.publicKey };
      },
      disconnect: async () => {
        if (typeof legacy.disconnect === 'function') {
          await legacy.disconnect();
        }
      },
      account: async () => {
        if (typeof legacy.account === 'function') {
          return await legacy.account();
        }
        return null;
      },
      network: async () => {
        try {
          if (typeof legacy.network === 'function') {
            const net = await legacy.network();
            return typeof net === 'string' ? net : net?.name || 'testnet';
          }
        } catch {}
        return 'testnet';
      },
      signAndSubmitTransaction: async (transaction: any) => {
        if (typeof legacy.signAndSubmitTransaction === 'function') {
          const res = await legacy.signAndSubmitTransaction(transaction);
          return { hash: res?.hash || '' };
        }
        throw new Error('signAndSubmitTransaction not supported on legacy provider');
      },
    };
  }

  return null;
}

/**
 * Asynchronously detects Petra / Aptos wallet with retries
 * to handle extension script injection delay.
 */
export async function detectPetraWallet(maxWaitMs = 1200): Promise<UnifiedPetraWallet | null> {
  if (typeof window === 'undefined') return null;

  initWalletStandardListeners();

  const provider = getPetraProvider();
  if (provider) return provider;

  // Poll every 80ms until maxWaitMs
  const interval = 80;
  let elapsed = 0;

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      elapsed += interval;
      // Re-dispatch app-ready periodically to trigger late-injected extensions
      if (elapsed % 240 === 0) {
        dispatchAppReady((wallet: any) => {
          if (wallet) standardWalletInstance = wallet;
        });
      }

      const p = getPetraProvider();
      if (p) {
        clearInterval(timer);
        resolve(p);
        return;
      }

      if (elapsed >= maxWaitMs) {
        clearInterval(timer);
        resolve(null);
      }
    }, interval);
  });
}
