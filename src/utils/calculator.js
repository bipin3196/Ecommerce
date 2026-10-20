// Profit calculation and unit economics engine for TrendSource AI

export function calculateProfitability(unitEconomics, customOverrides = {}) {
  const econ = { ...unitEconomics, ...customOverrides };
  
  const buyPrice = Number(econ.buyPrice) || 0;
  const inboundShipping = Number(econ.inboundShipping) || 0;
  const packagingCost = Number(econ.packagingCost) || 0;
  const recommendedRetailPrice = Number(econ.recommendedRetailPrice) || 0;
  
  const paymentProcessingRate = Number(econ.paymentProcessingRate) ?? 0.029;
  const paymentProcessingFixed = Number(econ.paymentProcessingFixed) ?? 0.30;
  const marketplaceReferralRate = Number(econ.marketplaceReferralRate) ?? 0.15;
  const adAllowance = Number(econ.adAllowance) || 0;
  const refundReserveRate = Number(econ.refundReserveRate) ?? 0.03;
  const taxDutyRate = Number(econ.taxDutyRate) || 0;

  // 1. Landed Cost
  const landedCost = buyPrice + inboundShipping + packagingCost;

  // 2. Fees & Allowances
  const paymentFee = (recommendedRetailPrice * paymentProcessingRate) + paymentProcessingFixed;
  const marketplaceFee = recommendedRetailPrice * marketplaceReferralRate;
  const refundReserve = recommendedRetailPrice * refundReserveRate;
  const taxDutyFee = recommendedRetailPrice * taxDutyRate;

  // 3. Totals
  const totalCost = landedCost + paymentFee + marketplaceFee + adAllowance + refundReserve + taxDutyFee;
  const grossProfit = Math.max(0, recommendedRetailPrice - landedCost);
  const netProfit = recommendedRetailPrice - totalCost;
  const netMarginPct = recommendedRetailPrice > 0 ? (netProfit / recommendedRetailPrice) * 100 : 0;
  const grossMarginPct = recommendedRetailPrice > 0 ? (grossProfit / recommendedRetailPrice) * 100 : 0;

  // 4. Break-even analysis (assuming $1,000 monthly operational fixed costs)
  const breakevenUnits = netProfit > 0 ? Math.ceil(1000 / netProfit) : 999;
  const roiPct = landedCost > 0 ? (netProfit / landedCost) * 100 : 0;

  return {
    buyPrice,
    inboundShipping,
    packagingCost,
    landedCost: round2(landedCost),
    paymentFee: round2(paymentFee),
    marketplaceFee: round2(marketplaceFee),
    adAllowance: round2(adAllowance),
    refundReserve: round2(refundReserve),
    taxDutyFee: round2(taxDutyFee),
    totalCost: round2(totalCost),
    recommendedRetailPrice: round2(recommendedRetailPrice),
    grossProfit: round2(grossProfit),
    netProfit: round2(netProfit),
    grossMarginPct: round1(grossMarginPct),
    netMarginPct: round1(netMarginPct),
    breakevenUnits,
    roiPct: round1(roiPct)
  };
}

export function classifyTier(netMarginPct, trendScore, competitionLevel, isRestricted = false) {
  if (isRestricted || netMarginPct < 15) return "Avoid";
  if (netMarginPct >= 45 && trendScore >= 88 && competitionLevel !== "high") return "Excellent";
  if (netMarginPct >= 30 && trendScore >= 75) return "Good";
  return "Risky";
}

// Dual Monetization Engine: Affiliate vs Direct Selling
export function calculateAffiliateEconomics(product, customOverrides = {}) {
  const retailPrice = Number(customOverrides.recommendedRetailPrice ?? product?.unitEconomics?.recommendedRetailPrice ?? 50);
  const commissionRate = Number(customOverrides.commissionRate ?? product?.monetization?.affiliateCommissionRate ?? 0.08); // default 8%
  const monthlyClicks = Number(customOverrides.monthlyClicks ?? Math.round((product?.searchVolumeEst || 50000) * 0.04));
  const conversionRate = Number(customOverrides.conversionRate ?? 0.038); // typical 3.8% e-commerce affiliate conv
  
  const commissionPerSale = round2(retailPrice * commissionRate);
  const projectedMonthlySales = Math.round(monthlyClicks * conversionRate);
  const monthlyCommission = round2(projectedMonthlySales * commissionPerSale);
  const epc = round2((monthlyCommission / (monthlyClicks || 1)) * 100); // Earnings per 100 clicks

  return {
    retailPrice,
    commissionRate: round1(commissionRate * 100),
    commissionPerSale,
    monthlyClicks,
    conversionRate: round1(conversionRate * 100),
    projectedMonthlySales,
    monthlyCommission,
    epc,
    capitalRequired: 0,
    inventoryRisk: "Zero (Managed by merchant)",
    customerSupportCost: "$0.00"
  };
}

// Compare Direct Selling vs Affiliate for a fixed traffic cohort (e.g. 1,000 visitors)
export function compareMonetizationCohort(product, visitors = 1000, options = {}) {
  const retailPrice = Number(options.retailPrice ?? product?.unitEconomics?.recommendedRetailPrice ?? 50);
  const directNetProfitPerUnit = Number(options.directNetProfit ?? 25);
  const affiliateCommissionRate = Number(options.affiliateCommissionRate ?? product?.monetization?.affiliateCommissionRate ?? 0.08);

  const directConv = Number(options.directConv ?? 0.024); // 2.4% direct checkout
  const affiliateConv = Number(options.affiliateConv ?? 0.038); // 3.8% affiliate partner checkout (trusted platforms like Amazon/Etsy convert higher)

  // 1. Direct Model (You sell & fulfill)
  const directSalesUnits = Math.round(visitors * directConv);
  const directGrossRevenue = round2(directSalesUnits * retailPrice);
  const directNetProfit = round2(directSalesUnits * directNetProfitPerUnit);

  // 2. Affiliate Model (Like Shut Up And Take My Money)
  const affiliateReferrals = Math.round(visitors * affiliateConv);
  const commissionPerSale = round2(retailPrice * affiliateCommissionRate);
  const affiliateNetProfit = round2(affiliateReferrals * commissionPerSale);

  // 3. Hybrid Model (Sell direct, with "Or buy on Amazon/Etsy" affiliate secondary CTA)
  // Direct captures high margin buyers (~1.8%), residual undecided traffic clicks affiliate link (~2.2% conv)
  const hybridDirectUnits = Math.round(visitors * 0.018);
  const hybridAffiliateUnits = Math.round(visitors * 0.022);
  const hybridDirectProfit = round2(hybridDirectUnits * directNetProfitPerUnit);
  const hybridAffiliateProfit = round2(hybridAffiliateUnits * commissionPerSale);
  const hybridTotalProfit = round2(hybridDirectProfit + hybridAffiliateProfit);

  return {
    visitors,
    retailPrice,
    direct: {
      salesUnits: directSalesUnits,
      grossRevenue: directGrossRevenue,
      netProfit: directNetProfit,
      marginPerUnit: directNetProfitPerUnit,
      requiresInventory: true,
      requiresSupport: true
    },
    affiliate: {
      salesUnits: affiliateReferrals,
      grossRevenue: round2(affiliateReferrals * retailPrice),
      netProfit: affiliateNetProfit,
      marginPerUnit: commissionPerSale,
      requiresInventory: false,
      requiresSupport: false
    },
    hybrid: {
      directUnits: hybridDirectUnits,
      affiliateUnits: hybridAffiliateUnits,
      directProfit: hybridDirectProfit,
      affiliateProfit: hybridAffiliateProfit,
      netProfit: hybridTotalProfit,
      upliftVsAffiliatePct: affiliateNetProfit > 0 ? round1(((hybridTotalProfit - affiliateNetProfit) / affiliateNetProfit) * 100) : 0,
      upliftVsDirectPct: directNetProfit > 0 ? round1(((hybridTotalProfit - directNetProfit) / directNetProfit) * 100) : 0
    }
  };
}

export function recommendMonetizationRoute(product, netProfit, netMarginPct) {
  const isTrademarkedOrLicensed = Boolean(
    product?.isLicensedOrTrademarked ||
    product?.title?.toLowerCase().includes("nintendo") ||
    product?.title?.toLowerCase().includes("adventure time") ||
    product?.title?.toLowerCase().includes("magsafe") ||
    product?.mainRisk?.toLowerCase().includes("ip") ||
    product?.mainRisk?.toLowerCase().includes("trademark") ||
    product?.mainRisk?.toLowerCase().includes("patent")
  );

  const isRestrictedOrFragile = Boolean(
    product?.isRestricted ||
    product?.mainRisk?.toLowerCase().includes("fda") ||
    product?.mainRisk?.toLowerCase().includes("certification")
  );

  const hasHighMarginSupplier = netMarginPct >= 42 && netProfit >= 25;

  if (isTrademarkedOrLicensed) {
    return {
      strategy: "affiliate",
      badgeText: "Affiliate Only (IP Safe)",
      reason: "Trademarked or licensed elements detected. Avoid direct sales to prevent merchant account suspension; monetize safely via affiliate referral links (Amazon/Etsy).",
      actionLabel: "Promote via Affiliate",
      pillClass: "badge-affiliate"
    };
  }

  if (isRestrictedOrFragile && netMarginPct < 35) {
    return {
      strategy: "affiliate",
      badgeText: "Affiliate Recommended",
      reason: "Compliance barriers (FDA / electronics certification) make direct fulfillment complex. Earn risk-free affiliate commissions while partners handle liability.",
      actionLabel: "Promote via Affiliate",
      pillClass: "badge-affiliate"
    };
  }

  if (hasHighMarginSupplier) {
    return {
      strategy: "hybrid",
      badgeText: "Dual Route (Sell + Affiliate)",
      reason: "Exceptional net unit margin (+$" + netProfit.toFixed(2) + "). Sell direct to capture 60%+ margins, while offering an Amazon affiliate link as secondary CTA for skeptical buyers.",
      actionLabel: "Sell Direct & Affiliate",
      pillClass: "badge-hybrid"
    };
  }

  return {
    strategy: "direct",
    badgeText: "Direct Storefront Winner",
    reason: "Strong supplier availability with healthy unit economics. Launch directly on your storefront to capture the full customer value and build your brand.",
    actionLabel: "Sell Direct",
    pillClass: "badge-direct"
  };
}

function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function round1(num) {
  return Math.round((num + Number.EPSILON) * 10) / 10;
}

