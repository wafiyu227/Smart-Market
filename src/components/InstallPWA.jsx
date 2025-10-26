import { useEffect, useState } from "react";
import { X, Download, Smartphone, Share } from "lucide-react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState("unknown");

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      localStorage.removeItem('pwa-install-dismissed');
      return;
    }

    // Check if user previously dismissed the modal
    const userDismissed = localStorage.getItem('pwa-install-dismissed');
    
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isDesktop = !isIOS && !isAndroid;

    if (isIOS) {
      setPlatform("ios");
      
      // For iOS, show button if previously dismissed, otherwise show modal after delay
      if (userDismissed === 'true') {
        setShowButton(true);
      } else {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
      return;
    } else if (isAndroid || isDesktop) {
      setPlatform(isAndroid ? "android" : "desktop");
    }

    // If user dismissed and we have no prompt, show button
    if (userDismissed === 'true') {
      setShowButton(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log("beforeinstallprompt event captured");
      setDeferredPrompt(e);
      
      // Show modal after 5 seconds only if user hasn't previously dismissed
      if (userDismissed !== 'true') {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 5000);
        
        return () => clearTimeout(timer);
      } else {
        // User dismissed before, just show the button
        setShowButton(true);
      }
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed successfully");
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
      setShowButton(false);
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (platform === "ios") {
      // For iOS, we can't programmatically install, just close modal
      setShowModal(false);
      setShowButton(true);
      localStorage.setItem('pwa-install-dismissed', 'true');
      return;
    }

    if (!deferredPrompt) {
      console.log("No install prompt available");
      setShowModal(false);
      setShowButton(true);
      return;
    }
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
        setShowModal(false);
        setShowButton(false);
        localStorage.removeItem('pwa-install-dismissed');
      } else {
        console.log("User dismissed the install prompt");
        setShowModal(false);
        setShowButton(true);
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error("Error during installation:", error);
      setShowModal(false);
      setShowButton(true);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setShowButton(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
    console.log("User dismissed the install modal");
  };

  const handleButtonClick = () => {
    setShowModal(true);
    setShowButton(false);
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from {
                  transform: translateY(20px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
              .modal-backdrop {
                animation: fadeIn 0.3s ease-out;
              }
              .modal-content {
                animation: slideUp 0.3s ease-out;
              }
            `}
          </style>
          <div className="modal-backdrop absolute inset-0" onClick={handleCancel}></div>
          <div className="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Download className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Install Smart Market
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {platform === "ios" 
                ? "Install our app for quick access and a better experience!"
                : "Get quick access and work offline by installing Smart Market on your device."}
            </p>

            {/* iOS Instructions */}
            {platform === "ios" && (
              <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-sm text-gray-700">
                <p className="font-semibold mb-2 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2 text-indigo-600" />
                  How to install on iPhone:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-6">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Tap the <Share className="w-4 h-4 inline mx-1" /> Share button below</span>
                  </li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right corner</li>
                </ol>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Maybe Later
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {platform === "ios" ? "Got it!" : "Install Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Install Button (shown after canceling) */}
      {showButton && !isInstalled && (deferredPrompt || platform === "ios") && (
        <>
          <style>
            {`
              @keyframes bounce {
                0%, 100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-10px);
                }
              }
              .install-button {
                animation: bounce 2s infinite;
              }
            `}
          </style>
          <button
            onClick={handleButtonClick}
            className="install-button fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-full shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-110 flex items-center space-x-2 z-40"
          >
            <Download className="w-5 h-5" />
            <span className="font-semibold">Install App</span>
          </button>
        </>
      )}
    </>
  );
};

export default InstallPWA;