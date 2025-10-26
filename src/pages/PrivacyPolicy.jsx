import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Bell } from 'lucide-react';
import Footer from "../components/Footer"

export default function PrivacyPolicy() {
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
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-indigo-100">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-lg text-gray-700 leading-relaxed">
              At Smart Market, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p>When you create an account or shop, we collect:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Email address</li>
                  <li>Shop name and details</li>
                  <li>WhatsApp number (optional, for customer contact)</li>
                  <li>Location information</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                <p>Information about products you list:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Product names, descriptions, and prices</li>
                  <li>Product images</li>
                  <li>Shop category</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                <p>We automatically collect:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Shop visit statistics</li>
                  <li>Browser type and version</li>
                  <li>IP address (for visit tracking)</li>
                  <li>Pages viewed and time spent</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage your shop account</li>
                <li>Display your shop and products to potential customers</li>
                <li>Process payments for Pro subscriptions</li>
                <li>Provide customer support</li>
                <li>Send important updates about your shop or account</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>We do NOT sell your personal information.</strong></p>
              
              <p>We may share information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Public Visibility:</strong> Shop names, products, locations, and WhatsApp numbers are publicly visible to help customers find and contact you</li>
                <li><strong>Payment Processors:</strong> Payment information is processed securely by Paystack (our payment partner)</li>
                <li><strong>Service Providers:</strong> Trusted third parties who help us operate the platform (e.g., hosting, email services)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and users</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p>We implement security measures to protect your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure database storage</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Secure payment processing via Paystack</li>
              </ul>
              <p className="mt-4 text-sm italic">
                Note: No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Update:</strong> Correct inaccurate information in your account</li>
                <li><strong>Delete:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@smartmarket.com" className="text-indigo-600 hover:underline">ssmartmarket098@gmail.com</a>
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies & Tracking</h2>
            <div className="space-y-3 text-gray-700">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Track shop visits</li>
                <li>Analyze platform usage</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. Disabling cookies may limit some platform features.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <div className="space-y-3 text-gray-700">
              <p>We use trusted third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> Database and authentication</li>
                <li><strong>Paystack:</strong> Payment processing</li>
                <li><strong>Cloudflare:</strong> Content delivery and security</li>
              </ul>
              <p className="mt-4">
                These services have their own privacy policies. We recommend reviewing them.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              Smart Market is not intended for children under 13. We do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <div className="space-y-3 text-gray-700">
              <p>We retain your information for as long as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account is active</li>
                <li>Needed to provide our services</li>
                <li>Required by law or for legitimate business purposes</li>
              </ul>
              <p className="mt-4">
                When you delete your account, we will delete or anonymize your personal information, except where retention is required by law.
              </p>
            </div>
          </section>

          {/* International Users */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Users</h2>
            <p className="text-gray-700">
              Smart Market operates in Ghana. If you access our platform from outside Ghana, your information may be transferred to and stored in Ghana. By using our platform, you consent to this transfer.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date. Continued use of Smart Market after changes constitutes acceptance of the updated policy. We will notify you of significant changes via email or platform notification.
            </p>
          </section>

          {/* Your Consent */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Consent</h2>
            <p className="text-gray-700">
              By using Smart Market, you consent to our Privacy Policy and agree to its terms. If you do not agree with this policy, please do not use our platform.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our data practices:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> <a href="mailto:ssmartmarket098@gmail.com" className="text-indigo-600 hover:underline">ssmartmarket098@gmail.com</a></p>
              <p><strong>Support:</strong> <a href="/contact" className="text-indigo-600 hover:underline">Visit Contact Page</a></p>
              <p><strong>Address:</strong> Nothern Region, Tamale, Ghana</p>
            </div>
          </section>

          {/* Acceptance */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <p className="text-center text-gray-600 italic">
              By using Smart Market, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}