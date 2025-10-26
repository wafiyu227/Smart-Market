import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle, Scale, Shield } from 'lucide-react';
import Footer from '../components/Footer';

export default function TermsOfService() {
  const navigate = useNavigate();

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

      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-indigo-100">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Welcome to Smart Market! These Terms of Service ("Terms") govern your use of our platform. By accessing or using Smart Market, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700">
              Please read these Terms carefully before using our services. If you do not agree with these Terms, you may not use Smart Market.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p>By creating an account or using Smart Market, you confirm that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are at least 18 years old or have parental/guardian consent</li>
                <li>You have the legal capacity to enter into this agreement</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>All information you provide is accurate and up-to-date</li>
              </ul>
            </div>
          </section>

          {/* Platform Description */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Platform Description</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Smart Market is a shop listing platform.</strong> We provide tools for sellers to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create online shop profiles</li>
                <li>List products with images, descriptions, and prices</li>
                <li>Connect with potential customers</li>
                <li>Receive reviews (Pro users only)</li>
              </ul>
              <p className="mt-4">
                <strong>Important:</strong> Smart Market does NOT process transactions, handle payments between buyers and sellers, or manage inventory. All transactions occur directly between buyers and sellers.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Creation</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You must provide accurate, complete information</li>
                  <li>One account per user/business</li>
                  <li>You're responsible for maintaining account security</li>
                  <li>You must notify us immediately of unauthorized access</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
                <p>You are solely responsible for:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>All activity under your account</li>
                  <li>Keeping your password secure</li>
                  <li>Content you post or upload</li>
                  <li>Compliance with these Terms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Subscription Plans */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Subscription Plans</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Standard Plan (Free)</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Up to 10 product listings</li>
                  <li>Basic shop profile</li>
                  <li>Free forever, no credit card required</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pro Plan (₵29.99/month)</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Unlimited product listings</li>
                  <li>Customer reviews and ratings</li>
                  <li>Advanced analytics</li>
                  <li>Priority support</li>
                  <li>Pro badge</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Payment Terms</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pro subscriptions are billed monthly</li>
                  <li>Payments processed securely via Paystack</li>
                  <li>You can cancel anytime</li>
                  <li>No refunds for partial months</li>
                  <li>Pro features remain active until subscription period ends</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Prohibited Activities</h2>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p><strong>You may NOT:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>List illegal products or services</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Infringe on intellectual property rights</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spam or send unsolicited messages</li>
                <li>Use automated systems to scrape or access the platform</li>
                <li>Attempt to hack, disrupt, or damage the platform</li>
                <li>Impersonate others or create fake shops</li>
                <li>Sell counterfeit or stolen goods</li>
                <li>Engage in price manipulation or unfair practices</li>
              </ul>
            </div>
          </section>

          {/* Content Guidelines */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content Guidelines</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
                <p>You retain ownership of content you post, but you grant Smart Market a license to:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Display your shop and products on the platform</li>
                  <li>Use for marketing and promotional purposes</li>
                  <li>Make necessary technical modifications</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Content Requirements</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Must be accurate and truthful</li>
                  <li>Must not violate any laws</li>
                  <li>Must not infringe on others' rights</li>
                  <li>Must be appropriate and non-offensive</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Transactions */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">7. Buyer-Seller Transactions</h2>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p><strong>IMPORTANT DISCLAIMER:</strong></p>
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Smart Market is NOT involved in transactions between buyers and sellers</li>
                  <li>We do NOT process payments or handle money</li>
                  <li>We do NOT ship products or manage inventory</li>
                  <li>We are NOT responsible for product quality, delivery, or disputes</li>
                  <li>Buyers and sellers interact directly via WhatsApp</li>
                </ul>
              </div>
              <p className="mt-4">
                <strong>Buyer Responsibility:</strong> Verify seller credibility, inspect products, and use secure payment methods.
              </p>
              <p>
                <strong>Seller Responsibility:</strong> Provide accurate descriptions, honor commitments, and maintain good customer service.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Smart Market's name, logo, design, and features are protected by intellectual property laws. You may not copy, modify, or use them without permission.
              </p>
              <p>
                If you believe content on Smart Market infringes your rights, contact us at <a href="mailto:ssmartmarket098@gmail.com" className="text-indigo-600 hover:underline">ssmartmarket098@gmail.com</a>.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>We may suspend or terminate your account if you:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Abuse the platform or other users</li>
                <li>Fail to pay for Pro subscription</li>
              </ul>
              <p className="mt-4">
                <strong>You may terminate your account</strong> at any time by contacting support. Pro subscriptions will remain active until the current billing period ends.
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">10. Disclaimer of Warranties</h2>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 uppercase font-semibold mb-2">
                Smart Market is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>We don't guarantee uninterrupted or error-free service</li>
                <li>We don't warrant accuracy of shop or product information</li>
                <li>We're not responsible for user-generated content</li>
                <li>We don't guarantee specific results or sales</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <div className="text-gray-700">
              <p className="mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMART MARKET SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Disputes between buyers and sellers</li>
                <li>Product quality, delivery, or transaction issues</li>
                <li>User conduct or content</li>
              </ul>
              <p className="mt-4">
                Our total liability is limited to the amount you paid us in the past 12 months.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these Terms periodically. We'll notify you of significant changes via email or platform notice. Continued use after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of Ghana. Any disputes shall be resolved in the courts of Ghana.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              Questions about these Terms? Contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> <a href="mailto:ssmartmarket098@gmail.com" className="text-indigo-600 hover:underline">ssmartmarket098@gmail.com</a></p>
              <p><strong>Support:</strong> <a href="/contact" className="text-indigo-600 hover:underline">Visit Contact Page</a></p>
              <p><strong>Address:</strong> 123 Business Street, Accra, Ghana</p>
            </div>
          </section>

          {/* Acceptance */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <p className="text-center text-gray-600 italic">
              By using Smart Market, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}