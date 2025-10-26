// src/utils/subscriptionUtils.js
import { supabase } from "../lib/supabaseClient";

/**
 * Check if a shop is on Pro plan
 */
export const isProShop = (shop) => {
  if (!shop) return false;
  return shop.subscription_plan === 'pro' && shop.subscription_status === 'active';
};

/**
 * Check if a shop is on Standard (Free) plan
 */
export const isStandardShop = (shop) => {
  if (!shop) return true;
  return shop.subscription_plan === 'standard' || !shop.subscription_plan;
};

/**
 * Get product limit for a shop
 */
export const getProductLimit = (shop) => {
  if (isProShop(shop)) return null; // Unlimited
  return 10; // Standard limit
};

/**
 * Check if shop can add more products
 */
export const canAddProduct = async (shopId, currentProductCount) => {
  try {
    // Get shop details
    const { data: shop, error } = await supabase
      .from('shops')
      .select('subscription_plan')
      .eq('id', shopId)
      .single();

    if (error) throw error;

    // Pro plans have unlimited products
    if (shop.subscription_plan === 'pro') {
      return { canAdd: true, limit: null, current: currentProductCount };
    }

    // Standard plan has 10 product limit
    const limit = 10;
    const canAdd = currentProductCount < limit;

    return { 
      canAdd, 
      limit, 
      current: currentProductCount,
      remaining: Math.max(0, limit - currentProductCount)
    };
  } catch (error) {
    console.error('Error checking product limit:', error);
    return { canAdd: false, limit: 10, current: currentProductCount, error };
  }
};

/**
 * Check if shop can receive reviews
 */
export const canReceiveReviews = (shop) => {
  return isProShop(shop);
};

/**
 * Get subscription status display
 */
export const getSubscriptionStatus = (shop) => {
  if (!shop) return { text: 'Unknown', color: 'gray' };

  if (isProShop(shop)) {
    return { 
      text: 'Pro', 
      color: 'indigo',
      badge: '✨ Pro'
    };
  }

  return { 
    text: 'Standard', 
    color: 'gray',
    badge: 'Free'
  };
};

/**
 * Calculate days remaining in subscription
 */
export const getDaysRemaining = (shop) => {
  if (!shop?.subscription_end_date) return null;

  const endDate = new Date(shop.subscription_end_date);
  const today = new Date();
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

/**
 * Format subscription end date
 */
export const formatSubscriptionDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get plan features
 */
export const getPlanFeatures = (planName) => {
  const features = {
    standard: [
      'Basic Shop Profile',
      'Up to 10 Product Listings',
      'Product Photo Uploads',
      'Basic Analytics (shop visits)',
      'Customer WhatsApp Chat Link'
    ],
    pro: [
      'Everything in Standard, PLUS:',
      'Unlimited Product Listings',
      'Shop Reviews & Ratings',
      'Priority Customer Support',
      'Advanced Analytics',
      'Featured Shop Badge'
    ]
  };

  return features[planName] || features.standard;
};

/**
 * Get plan pricing
 */
export const getPlanPricing = () => {
  return {
    standard: {
      name: 'Standard (Free)',
      price: 0,
      currency: 'GHS',
      displayPrice: '₵0',
      frequency: 'forever'
    },
    pro: {
      name: 'Pro',
      price: 29.99,
      currency: 'GHS',
      displayPrice: '₵29.99',
      frequency: 'month'
    }
  };
};

/**
 * Validate subscription status
 */
export const validateSubscription = (shop) => {
  if (!shop) return false;

  // Check if pro subscription is still valid
  if (shop.subscription_plan === 'pro') {
    if (!shop.subscription_end_date) return true; // No end date means active
    
    const endDate = new Date(shop.subscription_end_date);
    const today = new Date();
    
    return endDate > today;
  }

  return true; // Standard is always valid
};

/**
 * Create payment record
 */
export const createPaymentRecord = async (paymentData) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        shop_id: paymentData.shop_id,
        amount: paymentData.amount,
        currency: paymentData.currency || 'GHS',
        payment_reference: paymentData.reference,
        payment_provider: 'paystack',
        payment_status: 'pending',
        plan_name: paymentData.plan_name,
        subscription_start_date: paymentData.subscription_start_date,
        subscription_end_date: paymentData.subscription_end_date,
        metadata: paymentData.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating payment record:', error);
    return { success: false, error };
  }
};

/**
 * Update shop subscription after successful payment
 */
export const updateShopSubscription = async (shopId, subscriptionData) => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({
        subscription_plan: subscriptionData.plan,
        subscription_status: 'active',
        subscription_start_date: subscriptionData.start_date,
        subscription_end_date: subscriptionData.end_date,
        payment_reference: subscriptionData.payment_reference,
        last_payment_date: new Date().toISOString()
      })
      .eq('id', shopId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating shop subscription:', error);
    return { success: false, error };
  }
};

/**
 * Get shop payment history
 */
export const getPaymentHistory = async (shopId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Cancel subscription (downgrade to standard)
 */
export const cancelSubscription = async (shopId) => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({
        subscription_plan: 'standard',
        subscription_status: 'cancelled',
        subscription_end_date: new Date().toISOString()
      })
      .eq('id', shopId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return { success: false, error };
  }
};