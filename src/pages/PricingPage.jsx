import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Store,
  Zap,
  Shield,
  ArrowLeft,
  HelpCircle,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";

const pricingTiers = [
  {
    name: "Standard (Free)",
    tagline: "Perfect for getting started",
    price: 0,
    priceDisplay: "₵0",
    frequency: "forever",
    isHighlighted: false,
    cta: "Start Selling Free",
    planKey: "standard",
    features: [
      {
        name: "Basic Shop Profile",
        included: true,
        tip: "Your dedicated page with contact info and location.",
      },
      {
        name: "Up to 10 Product Listings",
        included: true,
        tip: "Ideal for small inventories or flagship products.",
      },
      { 
        name: "Product Photo Uploads", 
        included: true,
        tip: "Upload images for your products"
      },
      {
        name: "Basic Analytics (shop visits)",
        included: true,
        tip: "View total profile visits.",
      },
      { 
        name: "Customer WhatsApp Chat Link", 
        included: true,
        tip: "Direct WhatsApp integration"
      },
      {
        name: "Shop Reviews & Ratings",
        included: false,
        tip: "Upgrade to Pro to collect customer reviews"
      },
      {
        name: "Unlimited Products",
        included: false,
        tip: "Only available in Pro plan"
      },
    ],
  },
  {
    name: "Pro",
    tagline: "Scale your business with unlimited potential",
    price: 29.99,
    priceDisplay: "₵29.99",
    frequency: "per month",
    isHighlighted: true,
    cta: "Upgrade to Pro",
    planKey: "pro",
    features: [
      {
        name: "Everything in Standard, PLUS:",
        included: true,
        tip: "All free features are included.",
      },
      {
        name: "Unlimited Product Listings",
        included: true,
        tip: "List your entire inventory without limits.",
      },
      {
        name: "Shop Reviews & Ratings",
        included: true,
        tip: "Build trust with customer reviews and star ratings.",
      },
      {
        name: "Priority Customer Support",
        included: true,
        tip: "Get faster response times for any issues."
      },
      {
        name: "Advanced Analytics",
        included: true,
        tip: "Track product views, clicks, and customer behavior."
      },
      {
        name: "Featured Shop Badge",
        included: true,
        tip: "Stand out with a Pro badge on your shop."
      },
    ],
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  const getCTAClasses = (isHighlighted) =>
    isHighlighted
      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl"
      : "bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50";

  const handleCTAClick = (planKey) => {
    // Redirect to signup or dashboard based on plan
    if (planKey === 'standard') {
      navigate('/signup');
    } else {
      navigate('/dashboard?upgrade=pro');
    }
  };

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
      
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Grow Your Business,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Your Way
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade when you're ready. No hidden fees, no surprises.
            Just simple pricing that grows with your business.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 
                ${
                  tier.isHighlighted
                    ? "bg-white ring-4 ring-indigo-500 shadow-2xl scale-105"
                    : "bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl"
                }`}
            >
              {tier.isHighlighted && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold uppercase py-2 px-6 rounded-full shadow-lg flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600">{tier.tagline}</p>
              </div>

              {/* Price Display */}
              <div className="text-center mb-8">
                <div className="flex items-end justify-center mb-2">
                  <span className="text-6xl font-extrabold text-gray-900">
                    {tier.priceDisplay}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-xl text-gray-500 ml-2 mb-2">
                      /{tier.frequency.replace('per ', '')}
                    </span>
                  )}
                </div>
                {tier.price === 0 && (
                  <p className="text-sm text-gray-500 font-medium">
                    Free forever, no credit card required
                  </p>
                )}
                {tier.price > 0 && (
                  <p className="text-sm text-gray-600">
                    Billed monthly • Cancel anytime
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleCTAClick(tier.planKey)}
                className={`w-full py-4 px-6 text-center rounded-xl font-bold text-lg transition-all mb-8 flex items-center justify-center gap-2 ${getCTAClasses(
                  tier.isHighlighted
                )}`}
              >
                {tier.cta}
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Features List */}
              <ul className="space-y-4 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start group">
                    {feature.included ? (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                        <XCircle className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-3 flex-1">
                      <span
                        className={`text-base ${
                          feature.included
                            ? "text-gray-900 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.name}
                      </span>
                      {feature.tip && (
                        <p className="text-sm text-gray-500 mt-1">
                          {feature.tip}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Compare Plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 px-6 text-left text-gray-900 font-bold">Feature</th>
                  <th className="py-4 px-6 text-center text-gray-900 font-bold">Standard</th>
                  <th className="py-4 px-6 text-center text-gray-900 font-bold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-700">Product Listings</td>
                  <td className="py-4 px-6 text-center text-gray-600">Up to 10</td>
                  <td className="py-4 px-6 text-center text-indigo-600 font-semibold">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Shop Reviews</td>
                  <td className="py-4 px-6 text-center">
                    <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Analytics</td>
                  <td className="py-4 px-6 text-center text-gray-600">Basic</td>
                  <td className="py-4 px-6 text-center text-indigo-600 font-semibold">Advanced</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Customer Support</td>
                  <td className="py-4 px-6 text-center text-gray-600">Email</td>
                  <td className="py-4 px-6 text-center text-indigo-600 font-semibold">Priority</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Featured Badge</td>
                  <td className="py-4 px-6 text-center">
                    <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <FAQItem
              question="Is the Standard Plan truly free forever?"
              answer="Yes! Our Standard plan is 100% free with no time limits. You can run your shop with up to 10 products completely free. No credit card required to get started."
            />
            <FAQItem
              question="Can I upgrade or downgrade my plan anytime?"
              answer="Absolutely! You can upgrade to Pro instantly from your dashboard. If you downgrade, you'll continue to have Pro features until your current billing period ends."
            />
            <FAQItem
              question="What happens if I exceed 10 products on the free plan?"
              answer="You'll need to upgrade to Pro to add more products. Don't worry - you'll see a clear notification when you're approaching your limit."
            />
            <FAQItem
              question="How do I pay? Do you accept mobile money?"
              answer="We accept all major payment methods including credit/debit cards and mobile money (MTN, Vodafone, AirtelTigo) through Paystack. All payments are secure and processed in Ghana Cedis (GHS)."
            />
            <FAQItem
              question="Can customers leave reviews on free shops?"
              answer="Shop reviews are a Pro feature. Upgrade to Pro to enable customer reviews and build trust with star ratings on your shop."
            />
            <FAQItem
              question="Is there a contract or can I cancel anytime?"
              answer="No contracts! Pro is billed monthly and you can cancel anytime. If you cancel, you'll keep your Pro features until the end of your current billing period."
            />
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to grow your business?
          </h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of local shops in Ghana succeeding on Smart Market today.
            Start free and upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/dashboard?upgrade=pro')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-900 flex items-center pr-4">
          <HelpCircle className="w-5 h-5 mr-3 text-indigo-600 flex-shrink-0" />
          {question}
        </span>
        <span
          className={`transform transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-600 border-t-2 border-gray-100 pt-4 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
};