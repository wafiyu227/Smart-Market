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
} from "lucide-react";

import { useState } from "react";
import InstallPWA from "../components/InstallPWA"; // Import the new component

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* PWA Install Component */}
      <InstallPWA />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/pwa-192x192.png" className="w-10 h-10" alt="Smart Market Logo" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Smart Market
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              {/* Always visible Login button on mobile */}
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>

              {/* Menu Toggle Button */}
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
            <Link
              to="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block w-full text-center mt-2 px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              onClick={toggleMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Stop losing sales when your{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  WhatsApp status disappears
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Tired of your products getting buried in Facebook posts and
                WhatsApp statuses? Create your permanent online shop that works
                24/7 — even while you sleep.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Create My Shop</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/search"
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore Shops</span>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-4 lg:p-8 overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/african-people-selling-products-online-marketplace-RzESdZq0Rr6VPjF2M5jKNRNj3ZWDkm.jpg"
                  alt="African people selling products online marketplace"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Onboarding Section - 3 Quick Steps */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Attention-grabbing header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-4">
              <Camera className="w-5 h-5 text-indigo-600 animate-pulse" />
              <span className="text-indigo-700 font-bold uppercase text-sm tracking-wide">
                👋 New Here? Quick Start Guide!
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                3 Easy Steps
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Watch these quick 1-minute videos to create your shop and start selling today
            </p>
          </div>

          {/* 3 Video Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Step 1 Video */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Step Badge */}
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-lg">1</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium opacity-90">STEP 1</p>
                      <h3 className="text-white font-bold text-lg">Sign Up</h3>
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>

              {/* Video Container */}
              <div className="relative bg-black aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/SB6XU_QNiU8?rel=0"
                  title="Step 1: Sign up & create your profile"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Description */}
              <div className="p-6">
                <h4 className="font-bold text-gray-900 text-lg mb-2">
                  Create Your Profile
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Learn how to sign up and set up your seller profile in under 1 minute
                </p>
                <div className="mt-4 flex items-center text-indigo-600 text-sm font-semibold">
                  <span>⏱️ Less than 1 min</span>
                </div>
              </div>
            </div>

            {/* Step 2 Video */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Step Badge */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-lg">2</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium opacity-90">STEP 2</p>
                      <h3 className="text-white font-bold text-lg">Add Products</h3>
                    </div>
                  </div>
                  <Camera className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>

              {/* Video Container */}
              <div className="relative bg-black aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/Z0FLJIMrUNw?rel=0"
                  title="Step 2: Add your products with photos"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Description */}
              <div className="p-6">
                <h4 className="font-bold text-gray-900 text-lg mb-2">
                  Upload Your Products
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  See how easy it is to add photos, prices, and descriptions to your products
                </p>
                <div className="mt-4 flex items-center text-purple-600 text-sm font-semibold">
                  <span>⏱️ Less than 1 min</span>
                </div>
              </div>
            </div>

            {/* Step 3 Video */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Step Badge */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-lg">3</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium opacity-90">STEP 3</p>
                      <h3 className="text-white font-bold text-lg">Share & Sell</h3>
                    </div>
                  </div>
                  <Share2 className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>

              {/* Video Container */}
              <div className="relative bg-black aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/F2Bdzun46Go?rel=0"
                  title="Step 3: Share your shop & start selling"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Description */}
              <div className="p-6">
                <h4 className="font-bold text-gray-900 text-lg mb-2">
                  Start Getting Customers
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover how to share your shop link and connect with buyers on WhatsApp
                </p>
                <div className="mt-4 flex items-center text-green-600 text-sm font-semibold">
                  <span>⏱️ Less than 1 min</span>
                </div>
              </div>
            </div>

          </div>

          {/* CTA Below Videos */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6 text-lg">
              Ready to start your journey?
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Create My Free Shop Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Your products, always visible to customers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlike Facebook posts and WhatsApp statuses that disappear, your
              Smart Market shop stays online 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Always open, never disappears
              </h3>
              <p className="text-gray-600">
                Your shop link works 24/7. No more lost sales because your
                WhatsApp status expired or Facebook post got buried.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Connect instantly via WhatsApp
              </h3>
              <p className="text-gray-600">
                When customers see something they like, they can message you
                directly on WhatsApp with one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Reach local customers easily
              </h3>
              <p className="text-gray-600">
                Share your shop link anywhere — WhatsApp groups, Facebook,
                Instagram. People can find you even when you're sleeping.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Professional product showcase
              </h3>
              <p className="text-gray-600">
                Display all your products beautifully in one place. No more
                cramming everything into a single WhatsApp status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Smart Market Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your business online in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sign up as a Seller
              </h3>
              <p className="text-gray-600">
                Create your free account and set up your seller profile in just
                a few minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Add your products
              </h3>
              <p className="text-gray-600">
                Upload photos, add descriptions, and set prices for all your
                products with our easy tools.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Share your shop link
              </h3>
              <p className="text-gray-600">
                Share your unique shop link on WhatsApp, Facebook, or anywhere
                to start getting customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to grow your small business online?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start selling today — it's free! Join thousands of local businesses
            already using Smart Market.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-3 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Create My Shop</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
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