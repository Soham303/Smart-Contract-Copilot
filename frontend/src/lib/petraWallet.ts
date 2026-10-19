'use client';

/**
 * Bulletproof Aptos / Petra Wallet Adapter
 * Prioritizes:
 * 1. Direct window.aptos / window.petra (official Petra extension API)
 * 2. Window event "aptos#initialized" listener
 * 3. AIP-62 Modern Wallet Standard
 * Includes responsive asynchronous polling to handle extension content script injection.
 */

export interface UnifiedPetraWallet {
  name: string;
  isStandard: boolean;
  connect: () => Promise<{ address: string; publicKey?: string }>;
  disconnect: () => Promise<void>;
  account: () => Promise<{ address: string } | null>;
  network: () => Promise<string>;
  signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
  isConnected?: () => Promise<boolean>;
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
    if (name.includes('petra') || name.includes('aptos') || !standardWalletInstance) {
      standardWalletInstance = wallet;
    }
  };

  // 1. Listen for standard wallets registering dynamically
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

  // 2. Announce app ready
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

// Check window.aptos or window.petra directly
function getWindowAptos(): any {
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

  // 1. PRIORITY 1: Check native window.aptos (Official Petra Extension)
  const legacy = getWindowAptos();
  if (legacy && (typeof legacy.connect === 'function' || typeof legacy.account === 'function')) {
    return {
      name: legacy.isPetra ? 'Petra Wallet' : 'Petra Aptos Wallet',
      isStandard: false,
      connect: async () => {
        let res: any;
        try {
          res = await legacy.connect();
        } catch (err: any) {
          // If already connected, query account directly
          if (typeof legacy.isConnected === 'function') {
            const isConn = await legacy.isConnected();
            if (isConn && typeof legacy.account === 'function') {
              res = await legacy.account();
            } else {
              throw err;
            }
          } else {
            throw err;
          }
        }

        let address = res?.address;
        if (!address && typeof legacy.account === 'function') {
          const acc = await legacy.account();
          address = acc?.address;
        }

        if (!address) {
          throw new Error('No account address returned from Petra Wallet');
        }

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
        throw new Error('signAndSubmitTransaction not supported on provider');
      },
      isConnected: async () => {
        if (typeof legacy.isConnected === 'function') {
          return await legacy.isConnected();
        }
        return Boolean(legacy.account);
      },
    };
  }

  // 2. PRIORITY 2: Check AIP-62 standard wallet instance
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
        throw new Error('Transaction signing not supported by this standard wallet interface');
      },
    };
  }

  return null;
}

/**
 * Asynchronously detects Petra / Aptos wallet with retries
 * to handle extension script injection delay.
 */
export async function detectPetraWallet(maxWaitMs = 2000): Promise<UnifiedPetraWallet | null> {
  if (typeof window === 'undefined') return null;

  initWalletStandardListeners();

  const provider = getPetraProvider();
  if (provider) return provider;

  // Poll every 50ms until maxWaitMs
  const interval = 50;
  let elapsed = 0;

  return new Promise((resolve) => {
    // Listen for Petra injection event
    const onInitialized = () => {
      const p = getPetraProvider();
      if (p) {
        window.removeEventListener('aptos#initialized', onInitialized);
        clearInterval(timer);
        resolve(p);
      }
    };
    window.addEventListener('aptos#initialized', onInitialized, { once: true });

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed % 200 === 0) {
        dispatchAppReady((wallet: any) => {
          if (wallet) standardWalletInstance = wallet;
        });
      }

      const p = getPetraProvider();
      if (p) {
        window.removeEventListener('aptos#initialized', onInitialized);
        clearInterval(timer);
        resolve(p);
        return;
      }

      if (elapsed >= maxWaitMs) {
        window.removeEventListener('aptos#initialized', onInitialized);
        clearInterval(timer);
        resolve(null);
      }
    }, interval);
  });
}
