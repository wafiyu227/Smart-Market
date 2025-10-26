import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Check, 
  ArrowLeft, 
  Zap, 
  Star, 
  TrendingUp,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/Authcontext';
import { useShop } from '../context/ShopContext';
import PaystackPaymentButton from '../components/PaystackPaymentButton';

export default function UpgradeToProPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shop, loading } = useShop();
  const [showSuccess, setShowSuccess] = useState(false);

  const isPro = shop?.subscription_plan === 'pro' && shop?.subscription_status === 'active';

  const proFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Unlimited Products",
      description: "Add as many products as you want to your shop",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Customer Reviews",
      description: "Build trust with customer reviews and ratings",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track your shop performance with detailed insights",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Priority Support",
      description: "Get faster response times for any issues",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Pro Badge",
      description: "Stand out with a Pro badge on your shop",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Detailed Reports",
      description: "Access monthly performance reports",
      color: "bg-pink-100 text-pink-600"
    }
  ];

  const handlePaymentSuccess = (reference) => {
    console.log('Payment successful:', reference);
    setShowSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You're Already Pro! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Your shop is currently on the Pro plan with all premium features unlocked.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Pro! 🚀
          </h1>
          <p className="text-gray-600 mb-8">
            Your upgrade was successful. Redirecting you to the dashboard...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full mb-6">
            <Crown className="w-5 h-5" />
            <span className="font-bold">Upgrade to Pro</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unlock Your Shop's
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Full Potential
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited products, customer reviews, and advanced features to grow your business faster
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-indigo-500 p-8 mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-4">
              <Crown className="w-4 h-4" />
              <span className="font-semibold">Pro Plan</span>
            </div>
            
            <div className="mb-4">
              <span className="text-6xl font-bold text-gray-900">₵29.99</span>
              <span className="text-2xl text-gray-500">/month</span>
            </div>
            
            <p className="text-gray-600">
              Billed monthly • Cancel anytime • No hidden fees
            </p>
          </div>

          {/* Payment Button */}
          {user && shop && (
            <PaystackPaymentButton
              shop={shop}
              user={user}
              onSuccess={handlePaymentSuccess}
              variant="large"
              className="mb-6"
            />
          )}

          <p className="text-center text-sm text-gray-500">
            🔒 Secure payment powered by Paystack
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Everything You Get with Pro
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {proFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Standard vs Pro
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 px-6 text-left text-gray-900 font-bold">Feature</th>
                  <th className="py-4 px-6 text-center text-gray-900 font-bold">Standard</th>
                  <th className="py-4 px-6 text-center text-indigo-600 font-bold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-700">Product Listings</td>
                  <td className="py-4 px-6 text-center text-gray-600">Up to 10</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                      <Check className="w-5 h-5" />
                      Unlimited
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Customer Reviews</td>
                  <td className="py-4 px-6 text-center text-gray-400">✗</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Analytics</td>
                  <td className="py-4 px-6 text-center text-gray-600">Basic</td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-indigo-600 font-semibold">Advanced</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Support</td>
                  <td className="py-4 px-6 text-center text-gray-600">Email</td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-indigo-600 font-semibold">Priority</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Pro Badge</td>
                  <td className="py-4 px-6 text-center text-gray-400">✗</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your Pro subscription at any time. You'll continue to have Pro features until the end of your current billing period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit/debit cards and mobile money (MTN, Vodafone, AirtelTigo) through Paystack.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens to my products if I downgrade?
              </h3>
              <p className="text-gray-600">
                If you have more than 10 products when you downgrade, your products will remain visible, but you won't be able to add new ones until you're back under the limit or upgrade again.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12">
          {user && shop && (
            <PaystackPaymentButton
              shop={shop}
              user={user}
              onSuccess={handlePaymentSuccess}
              variant="large"
            />
          )}
          <p className="text-sm text-gray-500 mt-4">
            Join hundreds of shops already growing with Pro
          </p>
        </div>
      </div>
    </div>
  );
}