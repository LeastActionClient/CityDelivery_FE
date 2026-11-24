const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';

let loader = null;

function loadScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Checkout is available in a browser only.'));
  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  if (loader) return loader;

  loader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      if (typeof window.Cashfree !== 'function') {
        loader = null;
        return reject(new Error('The payment checkout could not be initialised.'));
      }
      resolve(window.Cashfree);
    };
    script.onerror = () => {
      loader = null;
      reject(new Error('The payment checkout could not be loaded. Check your connection and try again.'));
    };
    document.head.appendChild(script);
  });
  return loader;
}

export async function openCashfreeCheckout({ paymentSessionId, environment = 'sandbox' }) {
  if (!paymentSessionId) throw new Error('A payment session was not returned. Please try again.');
  const mode = environment === 'production' ? 'production' : 'sandbox';
  const Cashfree = await loadScript();
  const cashfree = Cashfree({ mode });
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: '_self',
  });
}
