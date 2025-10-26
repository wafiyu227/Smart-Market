import { useState } from 'react';
// ⚠️ REMOVED: import { usePaystackPayment } from 'react-paystack';

// 🚀 ADDED: Import the Inline JS library (named PaystackPop for clarity)
import PaystackPop from '@paystack/inline-js';

import { Zap, Crown, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { paystackConfig, PLANS, calculateEndDate } from '../lib/paystackConfig';
import { createPaymentRecord, updateShopSubscription } from '../utils/subscriptionUtils';

export default function PaystackPaymentButton({
  shop,
  user,
  onSuccess,
  variant = 'default', // 'default', 'large', 'compact'
  className = ''
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Paystack configuration (The config object is still useful for parameters)
  const config = {
    reference: `pro_${shop.id}_${Date.now()}`,
    email: user.email,
    amount: PLANS.PRO.amount, // Amount in pesewas
    publicKey: paystackConfig.publicKey,
    currency: paystackConfig.currency,
    channels: paystackConfig.channels,
    metadata: {
      shop_id: shop.id,
      shop_name: shop.name,
      user_id: user.id,
      plan: 'pro',
      custom_fields: [
        {
          display_name: "Shop Name",
          variable_name: "shop_name",
          value: shop.name
        },
        {
          display_name: "Plan",
          variable_name: "plan",
          value: "Pro"
        }
      ]
    }
  };

  // Payment success handler (now accepts the full transaction object)
  const onPaymentSuccess = async (reference) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('Payment successful:', reference);

      const startDate = new Date().toISOString();
      const endDate = calculateEndDate(30);

      // 1. Create payment record
      const paymentResult = await createPaymentRecord({
        shop_id: shop.id,
        amount: PLANS.PRO.amount / 100, // Convert back to cedis
        currency: 'GHS',
        reference: reference.reference,
        plan_name: 'pro',
        subscription_start_date: startDate,
        subscription_end_date: endDate,
        metadata: {
          transaction_id: reference.transaction,
          payment_method: reference.channel,
          status: reference.status
        }
      });

      if (!paymentResult.success) {
        throw new Error('Failed to record payment');
      }

      // 2. Update payment status to successful
      await supabase
        .from('payments')
        .update({ payment_status: 'successful' })
        .eq('payment_reference', reference.reference);

      // 3. Update shop subscription
      const subscriptionResult = await updateShopSubscription(shop.id, {
        plan: 'pro',
        start_date: startDate,
        end_date: endDate,
        payment_reference: reference.reference
      });

      if (!subscriptionResult.success) {
        throw new Error('Failed to update subscription');
      }

      console.log('Subscription updated successfully');

      // Call success callback
      if (onSuccess) {
        onSuccess(reference);
      }

      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Payment succeeded but failed to update subscription. Please contact support.');

      // Still reload to show payment in history
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Payment close handler
  const onPaymentClose = () => {
    console.log('Payment modal closed');
    // Note: We don't set isProcessing to false here because it's only set to true 
    // when the Paystack modal is successful, which is handled in onSuccess.
    // If you want to reset the state after close, you can add setIsProcessing(false) here.
  };

  // 🚀 REFRACTORED: Remove usePaystackPayment and use the Inline JS class instead.
  const handleClick = () => {
    if (!paystackConfig.publicKey) {
      setError('Payment system not configured. Please contact support.');
      return;
    }

    setError(null);
    setIsProcessing(true); // Indicate processing has started (button disabled)

    try {
      // 1. Instantiate the PaystackPop class
      const paystack = new PaystackPop();

      // 2. Call the newTransaction method. We map config properties to Paystack's expected names.
      paystack.newTransaction({
        key: config.publicKey, // Must be named 'key'
        email: config.email,
        amount: config.amount,
        reference: config.reference,
        currency: config.currency,
        channels: config.channels,
        metadata: config.metadata,

        // 3. Define the callbacks
        onSuccess: onPaymentSuccess,
        onCancel: onPaymentClose,
      });

    } catch (e) {
      console.error("Paystack Initialization Error:", e);
      setError("Failed to initialize payment popup.");
      setIsProcessing(false);
    }
  };

  // Button variants (no change needed here)
  const getButtonClasses = () => {
    const base = "font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    switch (variant) {
      case 'large':
        return `${base} px-8 py-4 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105`;
      case 'compact':
        return `${base} px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg`;
      default:
        return `${base} px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl`;
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={getButtonClasses()}
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="w-5 h-5" />
            <span>Upgrade to Pro - ₵{PLANS.PRO.displayAmount}/month</span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}