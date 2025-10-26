import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  HelpCircle,
} from 'lucide-react';
import Footer from "../components/Footer"

export default function ContactUs() {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      detail: "ssmartmarket098@gmail.com",
      description: "Send us an email and we'll respond within 24 hours",
      action: "mailto:ssmartmarket098@gmail.com",
      actionText: "Send Email",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "WhatsApp Support",
      detail: "+233 59 670 5736",
      description: "Chat with us directly on WhatsApp for instant support",
      action: "https://wa.me/233596705736",
      actionText: "Chat on WhatsApp",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Help Center",
      detail: "Frequently Asked Questions",
      description: "Browse our comprehensive help documentation",
      action: "/help",
      actionText: "Visit Help Center",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" }
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
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            We're here to help! Reach out to us through any of the channels below
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mb-4`}>
                {method.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-indigo-600 font-semibold mb-3">
                {method.detail}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {method.description}
              </p>
              <a
                href={method.action}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                {method.actionText}
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </a>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Office Location */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Our Location
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                <strong className="text-gray-900">Smart Market HQ</strong>
              </p>
              <p>
                Nothern Region<br />
                Tamale, Ghana
              </p>
              <p className="text-sm text-gray-500 italic">
                Note: We operate primarily online. For in-person meetings, please schedule an appointment via email or WhatsApp.
              </p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Support Hours
              </h2>
            </div>
            
            <div className="space-y-4">
              {businessHours.map((schedule, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium text-gray-900">{schedule.day}</span>
                  <span className="text-gray-600">{schedule.hours}</span>
                </div>
              ))}
              <p className="text-sm text-gray-500 italic pt-4">
                All times are in Ghana Standard Time (GMT)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-indigo-50 rounded-2xl p-8 border-2 border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Before You Contact Us
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>✓ Check our <a href="/help" className="text-indigo-600 font-semibold hover:underline">Help Center</a> for instant answers</p>
                <p>✓ Have your shop name or email ready for faster assistance</p>
                <p>✓ For payment issues, include your transaction reference number</p>
                <p>✓ Screenshots help us understand your issue better</p>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Notice */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-xl shadow-md px-6 py-4 border border-gray-200">
            <p className="text-gray-600">
              <strong className="text-gray-900">Average Response Time:</strong> Within 24 hours
              <span className="mx-2">•</span>
              <strong className="text-gray-900">Pro Users:</strong> Priority support (faster response)
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}