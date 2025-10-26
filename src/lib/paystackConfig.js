// Paystack configuration
export const paystackConfig = {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'GHS', // Ghana Cedis
    channels: ['card', 'mobile_money', 'bank'], // Payment methods
  };
  
  // Plan pricing
  export const PLANS = {
    PRO: {
      name: 'Pro',
      amount: 2999, // Amount in pesewas (29.99 GHS = 2999 pesewas)
      duration: 30, // days
      displayAmount: '29.99',
    }
  };
  
  // Convert amount to pesewas (Paystack uses smallest currency unit)
  export const toPesewas = (amount) => Math.round(amount * 100);
  
  // Convert pesewas to cedis
  export const toCedis = (pesewas) => (pesewas / 100).toFixed(2);
  
  // Calculate subscription end date
  export const calculateEndDate = (days = 30) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    return endDate.toISOString();
  };