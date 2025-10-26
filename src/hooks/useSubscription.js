// src/hooks/useSubscription.js
import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  isProShop,
  isStandardShop,
  canAddProduct as checkCanAddProduct,
  canReceiveReviews,
  getSubscriptionStatus,
  getDaysRemaining,
  getProductLimit
} from '../utils/subscriptionUtils';
import { supabase } from '../lib/supabaseClient';

export const useSubscription = () => {
  const { shop, refreshShop } = useShop();
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load product count
  useEffect(() => {
    const loadProductCount = async () => {
      if (!shop?.id) {
        setLoading(false);
        return;
      }

      try {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('shop_id', shop.id);

        if (error) throw error;
        setProductCount(count || 0);
      } catch (error) {
        console.error('Error loading product count:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductCount();
  }, [shop?.id]);

  // Check if can add more products
  const canAddProduct = async () => {
    return await checkCanAddProduct(shop?.id, productCount);
  };

  // Get current plan details
  const isPro = isProShop(shop);
  const isStandard = isStandardShop(shop);
  const status = getSubscriptionStatus(shop);
  const daysRemaining = getDaysRemaining(shop);
  const productLimit = getProductLimit(shop);
  const hasReviews = canReceiveReviews(shop);

  // Calculate product usage percentage
  const productUsagePercentage = productLimit 
    ? Math.min((productCount / productLimit) * 100, 100)
    : 0;

  // Check if approaching limit (80% or more)
  const isApproachingLimit = productLimit && productUsagePercentage >= 80;

  // Check if at limit
  const isAtLimit = productLimit && productCount >= productLimit;

  return {
    // Shop & subscription info
    shop,
    isPro,
    isStandard,
    status,
    daysRemaining,
    
    // Product limits
    productCount,
    productLimit,
    productUsagePercentage,
    isApproachingLimit,
    isAtLimit,
    canAddProduct,
    
    // Features
    hasReviews,
    hasUnlimitedProducts: isPro,
    
    // Loading state
    loading,
    
    // Refresh function
    refresh: refreshShop
  };
};