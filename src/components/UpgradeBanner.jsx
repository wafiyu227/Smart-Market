import { X, Zap, Star, TrendingUp, Crown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UpgradeBanner({ 
  variant = "default", // "default", "compact", "modal"
  onClose,
  reason = "unlock premium features" // Custom message
}) {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/upgrade');
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  // Compact Banner (for dashboard top)
  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl shadow-lg mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Upgrade to Pro</p>
              <p className="text-xs text-indigo-100">
                Unlock unlimited products & reviews for ₵29.99/month
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpgrade}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors whitespace-nowrap"
            >
              Upgrade Now
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal Banner (for blocking actions)
  if (variant === "modal") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Upgrade to Pro
            </h3>
            <p className="text-gray-600 mb-6">
              Upgrade your plan to {reason}
            </p>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-800 font-medium">
                    Unlimited Products
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-800 font-medium">
                    Customer Reviews & Ratings
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-800 font-medium">
                    Advanced Analytics
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-gray-900">₵29.99</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg"
            >
              Upgrade to Pro Now
            </button>
            <button
              onClick={handleClose}
              className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Banner (full width)
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl overflow-hidden mb-8">
      <div className="p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
            <Crown className="w-10 h-10 text-white" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              Unlock Your Shop's Full Potential
            </h3>
            <p className="text-indigo-100 text-lg">
              Upgrade to Pro and get unlimited products, customer reviews, and advanced analytics for just ₵29.99/month
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpgrade}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg whitespace-nowrap"
            >
              Upgrade to Pro
            </button>
            <span className="text-white/80 text-sm text-center">
              No credit card required
            </span>
          </div>
        </div>

        {/* Benefits Strip */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 text-white">
              <Zap className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Unlimited Products</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Star className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Customer Reviews</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <TrendingUp className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Advanced Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}