
import { Link } from "react-router-dom";
import {
  Store,
  MessageCircle,
  MapPin,
  Camera,
  ArrowRight,
  Users,
  Smartphone,
  Share2,
  Menu,
  X,
  Search,
  ShoppingBag,
  Eye,
  CheckCircle,
} from "lucide-react";

import { useState } from "react";
import InstallPWA from "../components/InstallPWA";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      <InstallPWA />

      {/* Top Navigation Bar - Simplified */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <img src="/pwa-192x192.png" className="w-12 h-12 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Smart Market</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/search"
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors px-4 py-2"
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Browse Shops</span>
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2"
              >
                I'm a Seller
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md"
              >
                Start Selling Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-indigo-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/search"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                onClick={toggleMenu}
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Browse Shops</span>
              </Link>
              <Link
                to="/login"
                className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                onClick={toggleMenu}
              >
                I'm a Seller
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-center"
                onClick={toggleMenu}
              >
                Start Selling Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Clearer Value Proposition */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Audience Identifier Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 border-2 border-green-500 px-6 py-3 rounded-full mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-bold text-sm sm:text-base">
                🇬🇭 Made for Ghanaian Small Businesses
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Your Products,
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Always Online.
                </span>
                <br />
                Always Selling.
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
                WhatsApp status disappears after 24 hours. Facebook posts get buried.
                <span className="font-semibold text-gray-900"> Smart Market keeps your shop online 24/7</span> — 
                even when you're sleeping. 💤
              </p>

              {/* Two Clear Paths */}
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 mb-8 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">Want to Buy?</p>
                      <p className="text-sm text-gray-600">
                        Browse shops and buy products. <span className="font-semibold">No signup needed!</span>
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Store className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">Want to Sell?</p>
                      <p className="text-sm text-gray-600">
                        Create your free shop in 5 minutes. <span className="font-semibold">It's 100% FREE!</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/search"
                  className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center space-x-2 text-lg shadow-md"
                >
                  <Search className="w-5 h-5" />
                  <span>Browse Shops (Free)</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 text-lg"
                >
                  <Store className="w-5 h-5" />
                  <span>Start Selling (Free)</span>
                </Link>
              </div>

              <p className="text-center lg:text-left text-sm text-gray-500 mt-4">
                ✓ No credit card needed &nbsp; ✓ Setup in 5 minutes &nbsp; ✓ Cancel anytime
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-6 lg:p-8 shadow-2xl">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/african-people-selling-products-online-marketplace-RzESdZq0Rr6VPjF2M5jKNRNj3ZWDkm.jpg"
                  alt="African entrepreneurs selling online"
                  className="w-full h-auto rounded-2xl shadow-xl object-cover"
                />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">1000+</p>
                    <p className="text-xs text-gray-600">Shops</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">24/7</p>
                    <p className="text-xs text-gray-600">Online</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">FREE</p>
                    <p className="text-xs text-gray-600">Forever</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tired of Losing Customers? 😓
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most small business owners face these problems every day:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Problems */}
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                <p className="text-red-900 font-semibold mb-2">❌ WhatsApp Status Disappears</p>
                <p className="text-red-700 text-sm">Your products vanish after 24 hours. Customers can't find you.</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                <p className="text-red-900 font-semibold mb-2">❌ Facebook Posts Get Buried</p>
                <p className="text-red-700 text-sm">Your posts disappear in people's feeds. No one sees your products.</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                <p className="text-red-900 font-semibold mb-2">❌ Missing Sales at Night</p>
                <p className="text-red-700 text-sm">When you sleep, you lose customers. No one can buy from you.</p>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <p className="text-green-900 font-semibold mb-2">✅ Your Shop Stays Online 24/7</p>
                <p className="text-green-700 text-sm">Customers can find your products anytime, anywhere.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <p className="text-green-900 font-semibold mb-2">✅ One Link, All Products</p>
                <p className="text-green-700 text-sm">Share ONE link everywhere. All your products in one place.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <p className="text-green-900 font-semibold mb-2">✅ Sell While You Sleep</p>
                <p className="text-green-700 text-sm">Customers browse and WhatsApp you anytime they want to buy.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-xl text-lg"
            >
              <span>Yes! I Want This</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section - How It Works */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-4 shadow-md">
              <Camera className="w-5 h-5 text-indigo-600 animate-pulse" />
              <span className="text-indigo-700 font-bold uppercase text-sm tracking-wide">
                👋 Watch How Easy It Is!
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4">
              Start Selling in{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Each video is less than 1 minute. Watch and see how simple it is!
            </p>
          </div>

          {/* 3 Video Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            
            {/* Step 1 Video */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-indigo-600 font-bold text-xl">1</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold opacity-90 tracking-wider">STEP 1</p>
                      <h3 className="text-white font-bold text-xl">Sign Up Free</h3>
                    </div>
                  </div>
                  <Users className="w-9 h-9 text-white opacity-80" />
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-indigo-900 to-black" style={{ aspectRatio: '9/16', maxHeight: '600px' }}>
                <iframe
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://www.youtube.com/embed/Hud8kGlLWmQ?rel=0"
                  title="Step 1: Sign up free"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-6 lg:p-8">
                <h4 className="font-bold text-gray-900 text-xl mb-3">
                  Create Your Account
                </h4>
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  Just your name, phone number, and password. That's it!
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-indigo-600 text-sm font-bold bg-indigo-50 px-4 py-2 rounded-full">
                    <span>⏱️ &lt; 1 min</span>
                  </div>
                  <div className="text-gray-400 text-xs font-medium">
                    📱 Phone friendly
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Video */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-purple-600 font-bold text-xl">2</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold opacity-90 tracking-wider">STEP 2</p>
                      <h3 className="text-white font-bold text-xl">Add Products</h3>
                    </div>
                  </div>
                  <Camera className="w-9 h-9 text-white opacity-80" />
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-purple-900 to-black" style={{ aspectRatio: '9/16', maxHeight: '600px' }}>
                <iframe
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://www.youtube.com/embed/-3jzpMnqphQ?rel=0"
                  title="Step 2: Add products"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-6 lg:p-8">
                <h4 className="font-bold text-gray-900 text-xl mb-3">
                  Upload Your Products
                </h4>
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  Take photos with your phone, add prices. Very simple!
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-purple-600 text-sm font-bold bg-purple-50 px-4 py-2 rounded-full">
                    <span>⏱️ &lt; 1 min</span>
                  </div>
                  <div className="text-gray-400 text-xs font-medium">
                    📱 Phone friendly
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 Video */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-green-600 font-bold text-xl">3</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold opacity-90 tracking-wider">STEP 3</p>
                      <h3 className="text-white font-bold text-xl">Share & Sell</h3>
                    </div>
                  </div>
                  <Share2 className="w-9 h-9 text-white opacity-80" />
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-green-900 to-black" style={{ aspectRatio: '9/16', maxHeight: '600px' }}>
                <iframe
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://www.youtube.com/embed/h5grgFTO7PA?rel=0"
                  title="Step 3: Share and sell"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-6 lg:p-8">
                <h4 className="font-bold text-gray-900 text-xl mb-3">
                  Share Your Shop Link
                </h4>
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  Copy your link, share on WhatsApp, Facebook. Done!
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-4 py-2 rounded-full">
                    <span>⏱️ &lt; 1 min</span>
                  </div>
                  <div className="text-gray-400 text-xs font-medium">
                    📱 Phone friendly
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CTA Below Videos */}
          <div className="mt-12 lg:mt-16 text-center">
            <p className="text-gray-600 mb-6 text-lg lg:text-xl font-medium">
              See? It's very easy! Ready to start?
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span>Create My Free Shop Now</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-gray-500 text-sm mt-4">✓ 100% Free &nbsp; ✓ No credit card &nbsp; ✓ Setup in 5 minutes</p>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Join 1000+ Ghanaian Sellers
            </h2>
            <p className="text-xl text-gray-600">
              Real people making real money with Smart Market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <p className="font-bold text-gray-900">Ama (Accra)</p>
                  <p className="text-sm text-gray-600">Fashion Seller</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Before Smart Market, I was posting on WhatsApp every day. Now my shop is always online. I get orders even at night! 🙏"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <div>
                  <p className="font-bold text-gray-900">Kofi (Kumasi)</p>
                  <p className="text-sm text-gray-600">Electronics Seller</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Very easy to use. I created my shop in 10 minutes on my phone. My customers love it!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  F
                </div>
                <div>
                  <p className="font-bold text-gray-900">Fatima (Tamale)</p>
                  <p className="text-sm text-gray-600">Food Products</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "No more missing customers! They can see all my products anytime. Sales have doubled! 📈"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Stop Losing Sales? 🚀
          </h2>
          <p className="text-xl text-indigo-100 mb-4">
            Start your free shop today. No credit card. No hidden fees.
          </p>
          <p className="text-2xl font-bold text-white mb-8">
            100% FREE FOREVER! 🎉
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-3 bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            <Store className="w-6 h-6" />
            <span>Create My Free Shop Now</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-white text-sm mt-6 opacity-90">
            ⭐ Join 1000+ sellers already making money with Smart Market
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Smart Market</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering local businesses in Ghana to sell online and connect
                with customers through WhatsApp.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/pricing"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/search"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Browse Shops
                </Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link
                  to="/help-center"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
                <Link
                  to="/contact-us"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  to="/privacy"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Smart Market. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}