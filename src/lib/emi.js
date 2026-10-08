/**
 * Calculate the monthly EMI
 * Example: ₹50,00,000 at 8.5% for 20 years gives an EMI of about ₹43,391
 * calculateEmi(5000000, 8.5, 20) -> 43391.16
 */
export function calculateEmi(principal, annualRate, tenureYears) {
  const p = Number(principal);
  const r = Number(annualRate);
  const t = Number(tenureYears);

  if (isNaN(p) || p <= 0) return 0;
  if (isNaN(t) || t <= 0) return 0;
  if (isNaN(r) || r <= 0) return p / (t * 12);

  const monthlyRate = (r / 12) / 100;
  const n = t * 12;

  // EMI = P x r x (1+r)^n / ((1+r)^n - 1)
  const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  return isNaN(emi) || !isFinite(emi) ? 0 : emi;
}

/**
 * Generate yearly amortization schedule
 */
export function generateAmortizationSchedule(principal, annualRate, tenureYears) {
  const schedule = [];
  const p = Number(principal);
  const r = Number(annualRate);
  const t = Number(tenureYears);
  
  if (isNaN(p) || p <= 0 || isNaN(t) || t <= 0) return [];
  
  let balance = p;
  const emi = calculateEmi(p, r, t);
  const monthlyRate = isNaN(r) || r <= 0 ? 0 : (r / 12) / 100;
  
  if (!emi) return [];

  for (let year = 1; year <= t; year++) {
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) break;
      
      const interestForMonth = balance * monthlyRate;
      let principalForMonth = emi - interestForMonth;
      
      if (principalForMonth > balance) {
        principalForMonth = balance;
      }
      
      yearlyInterest += interestForMonth;
      yearlyPrincipal += principalForMonth;
      balance -= principalForMonth;
    }
    
    schedule.push({
      year,
      principalPaid: isNaN(yearlyPrincipal) ? 0 : yearlyPrincipal,
      interestPaid: isNaN(yearlyInterest) ? 0 : yearlyInterest,
      balance: Math.max(0, isNaN(balance) ? 0 : balance)
    });
    
    if (balance <= 0) break;
  }
  
  return schedule;
}

/**
 * Format Indian Rupees in compact scale (Lakh/Cr)
 */
export function formatCurrencyCompact(value) {
  if (value === undefined || value === null) return '₹0';
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

/**
 * Format standard Indian Rupees
 */
export function formatCurrency(value) {
  return `₹${Math.round(value || 0).toLocaleString('en-IN')}`;
}
