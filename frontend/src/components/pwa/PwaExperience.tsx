import { useEffect, useState } from 'react';
import { Download, RefreshCw, WifiOff } from 'lucide-react';

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function PwaExperience() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => isStandalone());
  const [online, setOnline] = useState(() => navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const showInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const markInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('beforeinstallprompt', showInstallPrompt);
    window.addEventListener('appinstalled', markInstalled);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    navigator.serviceWorker?.getRegistration().then((currentRegistration) => {
      if (!currentRegistration) return;
      setRegistration(currentRegistration);

      const watchInstallingWorker = () => {
        const worker = currentRegistration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
          }
        });
      };

      currentRegistration.addEventListener('updatefound', watchInstallingWorker);
      watchInstallingWorker();
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', showInstallPrompt);
      window.removeEventListener('appinstalled', markInstalled);
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setInstallPrompt(null);
  };

  const update = async () => {
    await registration?.update();
    registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] mx-auto flex w-[calc(100%-2rem)] max-w-md flex-col gap-3 sm:w-full">
      {!online && (
        <div role="status" className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl">
          <WifiOff size={20} aria-hidden="true" />
          <span>You’re offline. Cached KisanBot pages are still available.</span>
        </div>
      )}

      {updateAvailable && (
        <div role="status" className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
          <span>New version available</span>
          <button type="button" onClick={update} className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-white">
            <RefreshCw size={16} aria-hidden="true" /> Update
          </button>
        </div>
      )}

      {!installed && installPrompt && (
        <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-2xl">
          <div>
            <p className="text-sm font-bold text-slate-900">Install KisanBot</p>
            <p className="text-xs text-slate-600">Get faster access from your home screen.</p>
          </div>
          <button type="button" onClick={install} className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            <Download size={16} aria-hidden="true" /> Install
          </button>
        </div>
      )}
    </div>
  );
}

export default PwaExperience;
