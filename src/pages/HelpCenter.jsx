import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Store,
  Package,
  CreditCard,
  Users,
  MessageCircle,
  HelpCircle,
  Search,
  ShoppingBag,
  Star,
  Settings,
  Smartphone,
} from 'lucide-react';
import Footer from "../components/Footer"

export default function HelpCenter() {
  const navigate = useNavigate();

  const faqs = [
    {
      category: "Getting Started",
      icon: <Store className="w-6 h-6" />,
      questions: [
        {
          q: "How do I create a shop?",
          a: "Sign up for an account, then click 'Create Shop' from your dashboard. Fill in your shop details and add at least one product to get started."
        },
        {
          q: "Is it free to create a shop?",
          a: "Yes! Creating a shop is completely free. The Standard plan includes up to 10 products at no cost. Upgrade to Pro for unlimited products and additional features."
        },
        {
          q: "What information do I need to create a shop?",
          a: "You'll need a shop name, category, location, description, and WhatsApp number for customer contact. You'll also need to add at least one product with a name, price, and optional image."
        }
      ]
    },
    {
      category: "Products & Listings",
      icon: <Package className="w-6 h-6" />,
      questions: [
        {
          q: "How many products can I add?",
          a: "Standard (Free) plan: Up to 10 products. Pro plan: Unlimited products."
        },
        {
          q: "Can I add product images?",
          a: "Yes! You can upload images for all your products. Supported formats: JPG, PNG, GIF, WebP. Maximum file size: 5MB per image."
        },
        {
          q: "How do I edit or delete a product?",
          a: "From your dashboard, click the 'Edit' button on any product to update its details, or 'Delete' to remove it from your shop."
        },
        {
          q: "Can I change product prices?",
          a: "Yes, you can edit product prices anytime from your dashboard. Changes are reflected immediately on your shop page."
        }
      ]
    },
    {
      category: "Plans & Pricing",
      icon: <CreditCard className="w-6 h-6" />,
      questions: [
        {
          q: "What's the difference between Standard and Pro?",
          a: "Standard (Free): Up to 10 products, basic analytics. Pro (₵29.99/month): Unlimited products, customer reviews & ratings, advanced analytics, priority support, and Pro badge."
        },
        {
          q: "How do I upgrade to Pro?",
          a: "Click 'Upgrade to Pro' from your dashboard or visit the Upgrade page. Payment is processed securely through Paystack using cards or mobile money."
        },
        {
          q: "Can I cancel my Pro subscription?",
          a: "Yes, you can cancel anytime. You'll keep Pro features until the end of your current billing period, then automatically switch to Standard."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept credit/debit cards (Visa, Mastercard) and mobile money (MTN, Vodafone, AirtelTigo) through Paystack."
        }
      ]
    },
    {
      category: "Customer Reviews",
      icon: <Star className="w-6 h-6" />,
      questions: [
        {
          q: "Can customers leave reviews on my shop?",
          a: "Customer reviews are available only for Pro shops. Upgrade to Pro to enable reviews and build trust with potential customers."
        },
        {
          q: "How do reviews work?",
          a: "Customers can leave a star rating (1-5) and written feedback about their experience with your shop. Reviews are displayed on your shop page."
        },
        {
          q: "Can I delete negative reviews?",
          a: "No, reviews cannot be deleted to maintain authenticity and trust. Focus on providing excellent service to earn positive reviews."
        }
      ]
    },
    {
      category: "Shop Management",
      icon: <Settings className="w-6 h-6" />,
      questions: [
        {
          q: "How do customers contact me?",
          a: "Customers can click 'Chat with Seller' on your products or shop page, which opens WhatsApp with your shop's WhatsApp number."
        },
        {
          q: "Can I change my shop name or details?",
          a: "Currently, shop names and categories are set during creation. For major changes, please contact support."
        },
        {
          q: "How do I share my shop?",
          a: "From your dashboard, click 'Share Shop' to get your unique shop link. Share it via WhatsApp, social media, or copy the link to share anywhere."
        },
        {
          q: "Can I see how many people visit my shop?",
          a: "Yes! Your dashboard shows total shop visits. Pro users get access to advanced analytics with more detailed insights."
        }
      ]
    },
    {
      category: "Buying & Shopping",
      icon: <ShoppingBag className="w-6 h-6" />,
      questions: [
        {
          q: "How do I buy products?",
          a: "Browse shops and products, then click 'Chat with Seller' on any product you're interested in. This opens WhatsApp to discuss pricing, delivery, and payment directly with the seller."
        },
        {
          q: "Does Smart Market handle payments?",
          a: "No, Smart Market is a shop listing platform. All transactions happen directly between buyers and sellers. We recommend using secure payment methods."
        },
        {
          q: "How do I search for products?",
          a: "Use the search bar on the homepage to find products by name or category. You can also filter by location to find shops near you."
        }
      ]
    }
  ];

  return (
    <>
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Find answers to common questions about Smart Market
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <a
            href="/contact"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-600 text-sm">Get in touch with our support team</p>
          </a>

          <a
            href="/upgrade"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Upgrade to Pro</h3>
            <p className="text-gray-600 text-sm">Unlock unlimited products & features</p>
          </a>

          <a
            href="/dashboard"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Dashboard</h3>
            <p className="text-gray-600 text-sm">Manage your shop and products</p>
          </a>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-8">
          {faqs.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {section.category}
                </h2>
              </div>

              <div className="space-y-6">
                {section.questions.map((item, qIdx) => (
                  <div key={qIdx} className="border-l-4 border-indigo-500 pl-6">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                      {item.q}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-indigo-100 mb-6 text-lg">
            Our support team is here to assist you
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}