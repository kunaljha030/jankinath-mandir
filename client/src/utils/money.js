// 2100 -> "₹2,100"  (Indian digit grouping: 100000 -> "₹1,00,000")
export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
