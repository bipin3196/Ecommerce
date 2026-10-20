import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  calculateProfitability, 
  calculateAffiliateEconomics, 
  compareMonetizationCohort, 
  recommendMonetizationRoute 
} from "../utils/calculator";
import { 
  X, 
  TrendingUp, 
  Truck, 
  Calculator, 
  Users, 
  Rocket, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  DollarSign,
  Link2,
  Zap,
  ShoppingBag,
  Layers,
  ArrowRight
} from "lucide-react";

export function ProductDetailModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    activeTabInModal, 
    setActiveTabInModal, 
    formatCurrency, 
    selectedCountry,
    customStrategyOverrides,
    setProductStrategy
  } = useApp();

  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedAffiliateLink, setCopiedAffiliateLink] = useState(false);
  const [copiedDirectLink, setCopiedDirectLink] = useState(false);
  const [simVisitors, setSimVisitors] = useState(2500);

  // Profit Calculator State (allows interactive tweaking in Tab 3)
  const [calcOverrides, setCalcOverrides] = useState({
    buyPrice: selectedProduct?.unitEconomics?.buyPrice || 10,
    inboundShipping: selectedProduct?.unitEconomics?.inboundShipping || 3,
    packagingCost: selectedProduct?.unitEconomics?.packagingCost || 1,
    recommendedRetailPrice: selectedProduct?.unitEconomics?.recommendedRetailPrice || 49.99,
    adAllowance: selectedProduct?.unitEconomics?.adAllowance || 6,
    marketplaceReferralRate: selectedProduct?.unitEconomics?.marketplaceReferralRate || 0.15,
    paymentProcessingRate: 0.029,
    refundReserveRate: 0.03
  });

  if (!selectedProduct) return null;

  // Active user-selected strategy route
  const currentStrategy = customStrategyOverrides[selectedProduct.id] || selectedProduct.monetization?.recommendedRoute || "direct";

  // Recalculate profit with live overrides
  const liveEcon = calculateProfitability(selectedProduct.unitEconomics, {
    ...calcOverrides,
    taxDutyRate: selectedCountry.taxRate
  });

  // Calculate live affiliate economics
  const affiliateEcon = calculateAffiliateEconomics(selectedProduct, {
    recommendedRetailPrice: liveEcon.recommendedRetailPrice
  });

  // Calculate live traffic comparison
  const cohortComparison = compareMonetizationCohort(selectedProduct, simVisitors, {
    retailPrice: liveEcon.recommendedRetailPrice,
    directNetProfit: liveEcon.netProfit,
    affiliateCommissionRate: (selectedProduct.monetization?.affiliateCommissionRate || 0.08)
  });

  // AI Route recommendation
  const aiRecommendation = recommendMonetizationRoute(
    selectedProduct, 
    liveEcon.netProfit, 
    liveEcon.netMarginPct
  );

  const handleCopyOutreach = () => {
    if (selectedProduct.roadmap?.supplierOutreach) {
      navigator.clipboard.writeText(selectedProduct.roadmap.supplierOutreach);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2200);
    }
  };

  const handleCopyAffiliate = () => {
    const link = selectedProduct.monetization?.affiliateUrl || `https://amazon.com/dp/${selectedProduct.id}?tag=trendsource-20`;
    navigator.clipboard.writeText(link);
    setCopiedAffiliateLink(true);
    setTimeout(() => setCopiedAffiliateLink(false), 2200);
  };

  const handleCopyDirect = () => {
    const link = selectedProduct.monetization?.directCheckoutUrl || `https://shop.trendsource.io/products/checkout?item=${selectedProduct.id}`;
    navigator.clipboard.writeText(link);
    setCopiedDirectLink(true);
    setTimeout(() => setCopiedDirectLink(false), 2200);
  };

  const tabs = [
    { id: "overview", label: "Market & Demand", icon: TrendingUp },
    { id: "suppliers", label: "Supplier Matrix (3+)", icon: Truck },
    { id: "profit", label: "Live Profit Calculator", icon: Calculator },
    { id: "monetization", label: "Dual Monetization (Affiliate vs Direct)", icon: DollarSign },
    { id: "competitors", label: "Competitor Intelligence", icon: Users },
    { id: "roadmap", label: "30-Day Launch Roadmap", icon: Rocket }
  ];


  return (
    <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.title} 
              className="modal-header-thumb" 
            />
            <div>
              <div className="modal-pill-row">
                <span className="badge badge-primary">{selectedProduct.category.toUpperCase()}</span>
                <span className="badge badge-secondary">{selectedProduct.primaryMarketplace}</span>
                <span className={`badge badge-${selectedProduct.opportunityTier.toLowerCase()}`}>
                  {selectedProduct.opportunityTier} Opportunity
                </span>
                <span className="modal-score-pill">
                  Score: <strong>{selectedProduct.trendScore}/100</strong>
                </span>
              </div>
              <h2 className="modal-product-title">{selectedProduct.title}</h2>
            </div>
          </div>

          <button 
            onClick={() => setSelectedProduct(null)} 
            className="modal-close-btn"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabInModal(tab.id)}
                className={`modal-tab-btn ${activeTabInModal === tab.id ? "active" : ""}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="modal-body-scroll">
          {/* TAB 1: MARKET & DEMAND */}
          {activeTabInModal === "overview" && (
            <div className="tab-pane animate-fade-in">
              <div className="overview-grid">
                {/* Search Trend Trajectory Card */}
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-title">Search Trend Trajectory</span>
                    <span className="stat-card-badge rising">+{selectedProduct.searchTrend90d}% (90-Day)</span>
                  </div>
                  
                  {/* SVG Multi-Period Trend Chart */}
                  <div className="trend-chart-container">
                    <svg viewBox="0 0 500 120" className="trend-svg">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 10 100 Q 80 90, 140 82 T 260 60 T 380 35 T 490 15" 
                        fill="none" 
                        stroke="#06b6d4" 
                        strokeWidth="3.5" 
                      />
                      <path 
                        d="M 10 100 Q 80 90, 140 82 T 260 60 T 380 35 T 490 15 L 490 120 L 10 120 Z" 
                        fill="url(#chartGrad)" 
                      />
                      {/* Points */}
                      <circle cx="10" cy="100" r="4" fill="#06b6d4" />
                      <circle cx="140" cy="82" r="4" fill="#06b6d4" />
                      <circle cx="260" cy="60" r="4" fill="#06b6d4" />
                      <circle cx="380" cy="35" r="4" fill="#06b6d4" />
                      <circle cx="490" cy="15" r="5" fill="#38bdf8" />
                    </svg>

                    <div className="chart-x-labels">
                      <span>365 Days Ago (+{selectedProduct.searchTrend365d}%)</span>
                      <span>90 Days Ago (+{selectedProduct.searchTrend90d}%)</span>
                      <span>30 Days Ago (+{selectedProduct.searchTrend30d}%)</span>
                      <span className="text-cyan font-bold">Today</span>
                    </div>
                  </div>

                  <div className="search-stats-row">
                    <div className="sub-stat">
                      <span className="sub-label">Est. Monthly Searches</span>
                      <span className="sub-val">{selectedProduct.searchVolumeEst.toLocaleString()}</span>
                    </div>
                    <div className="sub-stat">
                      <span className="sub-label">Market Saturation</span>
                      <span className="sub-val text-emerald">
                        {selectedProduct.competitionLevel.toUpperCase()} ({selectedProduct.activeCompetitors} Sellers)
                      </span>
                    </div>
                    <div className="sub-stat">
                      <span className="sub-label">Review Velocity</span>
                      <span className="sub-val text-cyan">{selectedProduct.reviewVelocity}</span>
                    </div>
                  </div>
                </div>

                {/* Demand & Seasonality Breakdown */}
                <div className="stat-card">
                  <h4 className="section-subheading">Seasonality & Regional Fit</h4>
                  <p className="body-text">{selectedProduct.seasonality}</p>

                  <h4 className="section-subheading mt-4">Why This Opportunity Right Now</h4>
                  <p className="body-text highlight-box">{selectedProduct.whyNow}</p>

                  <h4 className="section-subheading mt-4">Recurring Customer Complaints (To Fix)</h4>
                  <ul className="complaints-list">
                    {selectedProduct.recurringComplaints.map((c, i) => (
                      <li key={i} className="complaint-item">
                        <AlertTriangle size={15} className="text-amber flex-shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Compliance & Risk Notice */}
              {selectedProduct.mainRisk && (
                <div className="alert-notice-box">
                  <ShieldAlert size={20} className="text-amber flex-shrink-0" />
                  <div>
                    <h5 className="notice-title">Compliance & Operational Safeguard</h5>
                    <p className="notice-desc">{selectedProduct.mainRisk}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUPPLIER COMPARISON MATRIX */}
          {activeTabInModal === "suppliers" && (
            <div className="tab-pane animate-fade-in">
              <div className="tab-header-banner">
                <div>
                  <h3 className="tab-title">Verified Supplier Comparison Matrix</h3>
                  <p className="tab-subtitle">
                    Benchmarked across Alibaba, AliExpress and Domestic verified wholesale sources.
                  </p>
                </div>
                <button onClick={handleCopyOutreach} className="btn-secondary-action">
                  {copiedScript ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
                  <span>{copiedScript ? "Script Copied!" : "Copy RFQ Outreach Script"}</span>
                </button>
              </div>

              <div className="suppliers-table-container">
                <table className="suppliers-table">
                  <thead>
                    <tr>
                      <th>Supplier & Platform</th>
                      <th>Country & Trust</th>
                      <th>Sample Price</th>
                      <th>Small Batch (50-200)</th>
                      <th>Bulk (500+)</th>
                      <th>MOQ</th>
                      <th>Shipping & Lead Time</th>
                      <th>Certifications</th>
                      <th>Customization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.suppliers.map((sup, idx) => (
                      <tr key={idx} className={idx === 0 ? "highlight-row" : ""}>
                        <td>
                          <div className="supplier-name-col">
                            <strong>{sup.name}</strong>
                            <span className="platform-tag">{sup.platform}</span>
                            {idx === 0 && <span className="recommended-badge">Recommended</span>}
                          </div>
                        </td>
                        <td>
                          <div className="supplier-trust-col">
                            <span>{sup.country}</span>
                            <span className="verification-text">{sup.verification}</span>
                            <span className="rating-pill">
                              <Star size={12} fill="#f59e0b" color="#f59e0b" />
                              {sup.rating} ({sup.reviews})
                            </span>
                          </div>
                        </td>
                        <td className="price-col">{formatCurrency(sup.samplePrice)}</td>
                        <td className="price-col highlight">{formatCurrency(sup.smallBatchPrice)}</td>
                        <td className="price-col bulk">{formatCurrency(sup.bulkPrice)}</td>
                        <td><strong>{sup.moq} units</strong></td>
                        <td>
                          <div className="shipping-info-col">
                            <span>{sup.shippingMethod}</span>
                            <span className="sub-val">{formatCurrency(sup.shippingCost)} / unit</span>
                            <span className="time-val">{sup.deliveryDays}d delivery ({sup.leadTimeDays}d lead)</span>
                          </div>
                        </td>
                        <td>
                          <span className="cert-badge">{sup.certifications}</span>
                        </td>
                        <td>
                          <div className="customization-col">
                            {sup.customBranding ? (
                              <span className="text-emerald">✓ Custom Logo</span>
                            ) : (
                              <span className="text-dim">✗ No OEM Logo</span>
                            )}
                            {sup.customPackaging ? (
                              <span className="text-emerald">✓ Custom Box</span>
                            ) : (
                              <span className="text-dim">✗ Generic Box</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE PROFIT CALCULATOR */}
          {activeTabInModal === "profit" && (
            <div className="tab-pane animate-fade-in">
              <div className="profit-calculator-layout">
                {/* Sliders & Controls */}
                <div className="calc-controls-panel">
                  <h3 className="section-title">Adjust Unit Cost & Price Variables</h3>
                  <p className="tab-subtitle mb-4">
                    Test live margins with custom supplier quotes, FBA fees, and PPC allowances.
                  </p>

                  <div className="calc-slider-group">
                    <div className="slider-header-row">
                      <label>Supplier Buy Price (FOB):</label>
                      <span className="slider-current-val">{formatCurrency(calcOverrides.buyPrice)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="150" 
                      step="0.5" 
                      value={calcOverrides.buyPrice}
                      onChange={(e) => setCalcOverrides(prev => ({ ...prev, buyPrice: parseFloat(e.target.value) }))}
                      className="calc-range"
                    />
                  </div>

                  <div className="calc-slider-group">
                    <div className="slider-header-row">
                      <label>Inbound Shipping & Freight (per unit):</label>
                      <span className="slider-current-val">{formatCurrency(calcOverrides.inboundShipping)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="30" 
                      step="0.2" 
                      value={calcOverrides.inboundShipping}
                      onChange={(e) => setCalcOverrides(prev => ({ ...prev, inboundShipping: parseFloat(e.target.value) }))}
                      className="calc-range"
                    />
                  </div>

                  <div className="calc-slider-group">
                    <div className="slider-header-row">
                      <label>Target Retail Sell Price:</label>
                      <span className="slider-current-val highlight">{formatCurrency(calcOverrides.recommendedRetailPrice)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="350" 
                      step="1" 
                      value={calcOverrides.recommendedRetailPrice}
                      onChange={(e) => setCalcOverrides(prev => ({ ...prev, recommendedRetailPrice: parseFloat(e.target.value) }))}
                      className="calc-range"
                    />
                  </div>

                  <div className="calc-slider-group">
                    <div className="slider-header-row">
                      <label>Advertising Allowance (PPC / CAC per unit):</label>
                      <span className="slider-current-val">{formatCurrency(calcOverrides.adAllowance)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="40" 
                      step="0.5" 
                      value={calcOverrides.adAllowance}
                      onChange={(e) => setCalcOverrides(prev => ({ ...prev, adAllowance: parseFloat(e.target.value) }))}
                      className="calc-range"
                    />
                  </div>

                  <div className="calc-presets-row">
                    <button 
                      onClick={() => setCalcOverrides({
                        buyPrice: selectedProduct.unitEconomics.buyPrice,
                        inboundShipping: selectedProduct.unitEconomics.inboundShipping,
                        packagingCost: selectedProduct.unitEconomics.packagingCost,
                        recommendedRetailPrice: selectedProduct.unitEconomics.recommendedRetailPrice,
                        adAllowance: selectedProduct.unitEconomics.adAllowance,
                        marketplaceReferralRate: selectedProduct.unitEconomics.marketplaceReferralRate,
                        paymentProcessingRate: 0.029,
                        refundReserveRate: 0.03
                      })}
                      className="btn-reset-calc"
                    >
                      Reset to Recommended Defaults
                    </button>
                  </div>
                </div>

                {/* Live Output Card */}
                <div className="calc-results-panel">
                  <div className="results-card">
                    <div className="results-badge-row">
                      <span className="results-title">Calculated Unit Economics</span>
                      <span className={`badge badge-${liveEcon.netMarginPct >= 40 ? "excellent" : liveEcon.netMarginPct >= 25 ? "good" : "risky"}`}>
                        {liveEcon.netMarginPct >= 40 ? "High Profitability" : liveEcon.netMarginPct >= 25 ? "Viable Margin" : "Low Margin"}
                      </span>
                    </div>

                    <div className="margin-hero-block">
                      <div className="hero-margin-number">{liveEcon.netMarginPct}%</div>
                      <div className="hero-margin-label">Net Profit Margin (After All Fees)</div>
                    </div>

                    <div className="waterfall-breakdown">
                      <div className="waterfall-row">
                        <span>Landed Cost (Product + Freight + Box):</span>
                        <strong>-{formatCurrency(liveEcon.landedCost)}</strong>
                      </div>
                      <div className="waterfall-row">
                        <span>Marketplace Commission (15%):</span>
                        <strong>-{formatCurrency(liveEcon.marketplaceFee)}</strong>
                      </div>
                      <div className="waterfall-row">
                        <span>Payment Processing (2.9% + $0.30):</span>
                        <strong>-{formatCurrency(liveEcon.paymentFee)}</strong>
                      </div>
                      <div className="waterfall-row">
                        <span>PPC / Social Ad Allowance:</span>
                        <strong>-{formatCurrency(liveEcon.adAllowance)}</strong>
                      </div>
                      <div className="waterfall-row">
                        <span>Refund & Return Reserve (3%):</span>
                        <strong>-{formatCurrency(liveEcon.refundReserve)}</strong>
                      </div>
                      {liveEcon.taxDutyFee > 0 && (
                        <div className="waterfall-row">
                          <span>Regional GST / VAT ({(selectedCountry.taxRate * 100).toFixed(0)}%):</span>
                          <strong>-{formatCurrency(liveEcon.taxDutyFee)}</strong>
                        </div>
                      )}
                      <div className="waterfall-divider" />
                      <div className="waterfall-row total">
                        <span>Net Profit Per Unit:</span>
                        <strong className="text-emerald">+{formatCurrency(liveEcon.netProfit)}</strong>
                      </div>
                    </div>

                    <div className="breakeven-box">
                      <div className="be-col">
                        <span className="be-label">Monthly Break-Even Units:</span>
                        <span className="be-val">{liveEcon.breakevenUnits} units</span>
                      </div>
                      <div className="be-col">
                        <span className="be-label">Suggested Initial Order:</span>
                        <span className="be-val highlight">{selectedProduct.unitEconomics.suggestedInitialStock} units</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPETITOR BENCHMARKING */}
          {activeTabInModal === "competitors" && (
            <div className="tab-pane animate-fade-in">
              <h3 className="tab-title">Active Top Competitors</h3>
              <p className="tab-subtitle mb-4">
                Identified listings currently capturing market share, pricing patterns, and critical weaknesses to exploit.
              </p>

              <div className="competitors-grid">
                {selectedProduct.competitors.map((comp, idx) => (
                  <div key={idx} className="competitor-card">
                    <div className="comp-header">
                      <div>
                        <h4 className="comp-seller">{comp.seller}</h4>
                        <span className="comp-channel">{comp.marketplace}</span>
                      </div>
                      <div className="comp-price">{formatCurrency(comp.price)}</div>
                    </div>

                    <div className="comp-stats-row">
                      <div className="comp-stat">
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span>{comp.rating} ({comp.reviews.toLocaleString()} reviews)</span>
                      </div>
                      <div className="comp-stat">
                        <span>Est. Monthly Sales: <strong>{comp.monthlyUnits.toLocaleString()} units</strong></span>
                      </div>
                    </div>

                    <div className="comp-quality-bar-wrap">
                      <div className="comp-quality-label">
                        <span>Listing Quality Score</span>
                        <span>{comp.qualityScore}/100</span>
                      </div>
                      <div className="quality-progress-track">
                        <div 
                          className="quality-progress-fill" 
                          style={{ width: `${comp.qualityScore}%` }} 
                        />
                      </div>
                    </div>

                    <div className="comp-gap-box">
                      <span className="gap-title">Differentiation & Vulnerability Opportunity:</span>
                      <p className="gap-text">{comp.gap}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 30-DAY LAUNCH ROADMAP */}
          {activeTabInModal === "roadmap" && (
            <div className="tab-pane animate-fade-in">
              <div className="roadmap-layout">
                {/* Positioning & Customer Persona */}
                <div className="roadmap-card">
                  <h3 className="section-title">Brand Positioning & Ideal Customer Profile</h3>
                  <div className="persona-box">
                    <strong>Target Persona:</strong> {selectedProduct.roadmap.targetCustomer}
                  </div>
                  <div className="usp-box mt-3">
                    <strong>Unique Selling Proposition (USP):</strong> {selectedProduct.roadmap.usp}
                  </div>

                  <h4 className="section-subheading mt-5">High-Converting Amazon / Store Listing Outline</h4>
                  <div className="listing-outline-card">
                    <div className="outline-item">
                      <span className="outline-label">Optimized SEO Title:</span>
                      <p className="outline-title">{selectedProduct.roadmap.listingTitle}</p>
                    </div>

                    <div className="outline-item">
                      <span className="outline-label">High-Ranking Search Keywords:</span>
                      <div className="keywords-wrap">
                        {selectedProduct.roadmap.keywords.map((kw, i) => (
                          <span key={i} className="keyword-chip">{kw}</span>
                        ))}
                      </div>
                    </div>

                    <div className="outline-item">
                      <span className="outline-label">Feature Bullet Points:</span>
                      <ul className="bullets-list">
                        {selectedProduct.roadmap.bulletPoints.map((bp, i) => (
                          <li key={i}>{bp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="outline-item">
                      <span className="outline-label">Creative Visual Brief:</span>
                      <p className="brief-text">{selectedProduct.roadmap.creativeBrief}</p>
                    </div>
                  </div>
                </div>

                {/* 30-Day Calendar & Outreach Script */}
                <div className="roadmap-card">
                  <h3 className="section-title">First 30-Day Execution Calendar</h3>
                  
                  <div className="timeline-step">
                    <div className="timeline-badge">Days 1 - 7</div>
                    <div className="timeline-content">
                      <h5>Sampling & Compliance Validation</h5>
                      <p>{selectedProduct.roadmap.week1Plan}</p>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <div className="timeline-badge">Days 8 - 15</div>
                    <div className="timeline-content">
                      <h5>Content Creation & Influencer Seeding</h5>
                      <p>{selectedProduct.roadmap.week2Plan}</p>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <div className="timeline-badge">Days 16 - 22</div>
                    <div className="timeline-content">
                      <h5>Listing Setup & Initial Production Dispatch</h5>
                      <p>{selectedProduct.roadmap.week3Plan}</p>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <div className="timeline-badge">Days 23 - 30</div>
                    <div className="timeline-content">
                      <h5>PPC Launch & Review Acquisition Flywheel</h5>
                      <p>{selectedProduct.roadmap.week4Plan}</p>
                    </div>
                  </div>

                  {/* Supplier RFQ Script */}
                  <div className="rfq-script-card">
                    <div className="rfq-header">
                      <h5>Sample Outreach Message to Suppliers</h5>
                      <button onClick={handleCopyOutreach} className="btn-copy-small">
                        {copiedScript ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                        <span>{copiedScript ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <pre className="rfq-pre">{selectedProduct.roadmap.supplierOutreach}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DUAL MONETIZATION ENGINE (Affiliate vs Direct) */}
          {activeTabInModal === "monetization" && (
            <div className="tab-pane animate-fade-in">
              <div className="monetization-tab-root">
                {/* AI Recommendation Alert */}
                <div className={`monetization-recommendation-banner ${aiRecommendation.strategy}`}>
                  <div className="banner-left">
                    <div className="banner-icon-wrap">
                      {aiRecommendation.strategy === "affiliate" && <Link2 size={22} />}
                      {aiRecommendation.strategy === "direct" && <Zap size={22} />}
                      {aiRecommendation.strategy === "hybrid" && <Sparkles size={22} />}
                    </div>
                    <div>
                      <div className="banner-badge-row">
                        <span className="banner-title">AI Recommendation Engine</span>
                        <span className={`badge ${aiRecommendation.pillClass}`}>
                          {aiRecommendation.badgeText}
                        </span>
                      </div>
                      <p className="banner-description">{aiRecommendation.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Strategy Selector (Choose active mode for this product) */}
                <div className="strategy-selector-section">
                  <h4 className="section-heading-sm">
                    Select Monetization Strategy for This Product
                  </h4>
                  <p className="section-heading-sub">
                    Choose whether to sell directly via your own store (dropship/private label), curate via affiliate referral links (like Shut Up And Take My Money), or run both concurrently.
                  </p>

                  <div className="strategy-cards-grid">
                    {/* Option 1: Direct Storefront */}
                    <div 
                      className={`strategy-select-card ${currentStrategy === "direct" ? "selected" : ""}`}
                      onClick={() => setProductStrategy(selectedProduct.id, "direct")}
                    >
                      <div className="strategy-card-header">
                        <div className="strategy-icon-box cyan">
                          <Zap size={18} />
                        </div>
                        <div className="strategy-meta">
                          <h5>Track A: Direct Storefront</h5>
                          <span className="strategy-sub">You Sell &amp; Fulfill (High Margin)</span>
                        </div>
                        {currentStrategy === "direct" && (
                          <div className="strategy-active-tag">
                            <CheckCircle2 size={14} /> Active
                          </div>
                        )}
                      </div>
                      <div className="strategy-card-body">
                        <div className="strategy-stat">
                          <span className="stat-label">Net Profit / Unit</span>
                          <span className="stat-val text-emerald">+{formatCurrency(liveEcon.netProfit)}</span>
                        </div>
                        <div className="strategy-stat">
                          <span className="stat-label">Net Margin</span>
                          <span className="stat-val">{liveEcon.netMarginPct}%</span>
                        </div>
                        <div className="strategy-pros">
                          ✓ Full customer data &amp; email capture<br />
                          ✓ 5x higher profit per sale than affiliate
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Affiliate Curation */}
                    <div 
                      className={`strategy-select-card ${currentStrategy === "affiliate" ? "selected" : ""}`}
                      onClick={() => setProductStrategy(selectedProduct.id, "affiliate")}
                    >
                      <div className="strategy-card-header">
                        <div className="strategy-icon-box amber">
                          <Link2 size={18} />
                        </div>
                        <div className="strategy-meta">
                          <h5>Track B: Affiliate Curation</h5>
                          <span className="strategy-sub">Shut Up And Take My Money Model</span>
                        </div>
                        {currentStrategy === "affiliate" && (
                          <div className="strategy-active-tag">
                            <CheckCircle2 size={14} /> Active
                          </div>
                        )}
                      </div>
                      <div className="strategy-card-body">
                        <div className="strategy-stat">
                          <span className="stat-label">Commission / Sale</span>
                          <span className="stat-val text-cyan">+{formatCurrency(affiliateEcon.commissionPerSale)}</span>
                        </div>
                        <div className="strategy-stat">
                          <span className="stat-label">Inventory Risk</span>
                          <span className="stat-val text-emerald">Zero (100% Passive)</span>
                        </div>
                        <div className="strategy-pros">
                          ✓ Safe for trademarked / artisan products<br />
                          ✓ Zero fulfillment, shipping, or customer support
                        </div>
                      </div>
                    </div>

                    {/* Option 3: Dual Hybrid Route */}
                    <div 
                      className={`strategy-select-card ${currentStrategy === "hybrid" ? "selected" : ""}`}
                      onClick={() => setProductStrategy(selectedProduct.id, "hybrid")}
                    >
                      <div className="strategy-card-header">
                        <div className="strategy-icon-box purple">
                          <Sparkles size={18} />
                        </div>
                        <div className="strategy-meta">
                          <h5>Track C: Dual Hybrid Engine</h5>
                          <span className="strategy-sub">Sell Direct + Affiliate Fallback</span>
                        </div>
                        {currentStrategy === "hybrid" && (
                          <div className="strategy-active-tag">
                            <CheckCircle2 size={14} /> Active
                          </div>
                        )}
                      </div>
                      <div className="strategy-card-body">
                        <div className="strategy-stat">
                          <span className="stat-label">Conversion Coverage</span>
                          <span className="stat-val text-purple">100% Traffic Yield</span>
                        </div>
                        <div className="strategy-stat">
                          <span className="stat-label">Strategy</span>
                          <span className="stat-val">Direct CTA + Amazon/Etsy Link</span>
                        </div>
                        <div className="strategy-pros">
                          ✓ Convert high-intent buyers on direct store<br />
                          ✓ Monetize skeptical buyers via trusted affiliate link
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deep-Dive Side-by-Side Comparison Matrix */}
                <div className="monetization-matrix-section">
                  <h4 className="section-heading-sm">Economics Comparison: Direct Store vs. Affiliate Model</h4>
                  
                  <div className="dual-matrix-grid">
                    {/* Direct Store Column */}
                    <div className="matrix-column direct">
                      <div className="column-header">
                        <Zap size={18} className="text-emerald" />
                        <div>
                          <h5>Direct Storefront Route</h5>
                          <span className="col-sub">Private Label / Dropship Fulfillment</span>
                        </div>
                      </div>

                      <div className="matrix-rows">
                        <div className="matrix-row">
                          <span className="row-label">Retail Sale Price:</span>
                          <span className="row-value">{formatCurrency(liveEcon.recommendedRetailPrice)}</span>
                        </div>
                        <div className="matrix-row">
                          <span className="row-label">Total Landed Cost:</span>
                          <span className="row-value text-rose">-{formatCurrency(liveEcon.landedCost)}</span>
                        </div>
                        <div className="matrix-row">
                          <span className="row-label">Ad Spend &amp; Processing Fees:</span>
                          <span className="row-value text-rose">-{formatCurrency(liveEcon.totalCost - liveEcon.landedCost)}</span>
                        </div>
                        <div className="matrix-row highlight">
                          <span className="row-label">Net Profit Per Order:</span>
                          <span className="row-value profit-highlight">+{formatCurrency(liveEcon.netProfit)} ({liveEcon.netMarginPct}%)</span>
                        </div>
                        <div className="matrix-row">
                          <span className="row-label">Customer Ownership:</span>
                          <span className="row-value text-emerald">100% (Email, SMS, LTV)</span>
                        </div>
                        <div className="matrix-row">
                          <span className="row-label">Operational Overhead:</span>
                          <span className="row-value text-amber">High (Fulfillment &amp; Returns)</span>
                        </div>
                      </div>

                      <div className="matrix-actions">
                        <button onClick={handleCopyDirect} className="btn-matrix direct">
                          {copiedDirectLink ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedDirectLink ? "Payload Copied!" : "Copy Direct Store Link"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Affiliate Column */}
                    <div className="matrix-column affiliate">
                      <div className="column-header">
                        <Link2 size={18} className="text-cyan" />
                        <div>
                          <h5>Affiliate Curation Route</h5>
                          <span className="col-sub">Shut Up And Take My Money Model</span>
                        </div>
                      </div>

                      <div className="matrix-rows">
                        <div className="matrix-row">
                          <span className="row-label">Target Marketplace:</span>
                          <span className="row-value">{selectedProduct.monetization?.affiliatePlatform || "Amazon / Etsy"}</span>
                        </div>
                        <div className="matrix-row">
                          <span className="row-label">Commission Rate:</span>
                          <span className="row-value text-cyan">{selectedProduct.monetization?.affiliateCommissionRate ? `${Math.round(selectedProduct.monetization.affiliateCommissionRate * 100)}%` : "8% - 12%"}</span>
                        </div>
                        <div className="matrix-row">
                          <span className="row-label">Cookie Referral Window:</span>
                          <span className="row-value">{selectedProduct.monetization?.cookieDays || 30} Days (Full Basket Credit)</span>
                        </div>
                        <div className="matrix-row highlight">
                          <span className="row-label">Net Commission Per Sale:</span>
                          <span className="row-value comm-highlight">+{formatCurrency(affiliateEcon.commissionPerSale)} (Zero Risk)</span>
                        </div>
                        <div className="matrix-row">
                          <span className="row-label">IP &amp; Trademark Liability:</span>
                          <span className="row-value text-emerald">Zero (Partner bears liability)</span>
                        </div>
                        <div className="matrix-row">
                          <span className="row-label">Operational Overhead:</span>
                          <span className="row-value text-emerald">Zero (100% Automated)</span>
                        </div>
                      </div>

                      <div className="matrix-actions">
                        <button onClick={handleCopyAffiliate} className="btn-matrix affiliate">
                          {copiedAffiliateLink ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedAffiliateLink ? "Affiliate Link Copied!" : "Copy Tracked Affiliate Link"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Cohort Traffic & Revenue Simulator */}
                <div className="simulator-section">
                  <div className="simulator-header">
                    <div>
                      <h4 className="section-heading-sm">Traffic &amp; Revenue Projection Simulator</h4>
                      <p className="section-heading-sub">
                        Adjust monthly social media &amp; search visitors to project revenue under each monetization track.
                      </p>
                    </div>
                    <div className="simulator-traffic-badge">
                      <span className="traffic-val">{simVisitors.toLocaleString()}</span>
                      <span className="traffic-sub">Monthly Visitors</span>
                    </div>
                  </div>

                  <div className="simulator-slider-wrap">
                    <input 
                      type="range"
                      min="500"
                      max="20000"
                      step="500"
                      value={simVisitors}
                      onChange={(e) => setSimVisitors(Number(e.target.value))}
                      className="sim-range-slider"
                    />
                    <div className="slider-ticks">
                      <span>500 clicks</span>
                      <span>5,000</span>
                      <span>10,000</span>
                      <span>15,000</span>
                      <span>20,000 clicks</span>
                    </div>
                  </div>

                  <div className="simulator-results-grid">
                    <div className="sim-result-card">
                      <span className="sim-card-badge direct">100% Direct Store</span>
                      <div className="sim-sales-count">{cohortComparison.direct.salesUnits} direct sales</div>
                      <div className="sim-profit-number text-emerald">
                        +{formatCurrency(cohortComparison.direct.netProfit)}
                      </div>
                      <span className="sim-card-note">Net Profit (Handles fulfillment &amp; returns)</span>
                    </div>

                    <div className="sim-result-card">
                      <span className="sim-card-badge affiliate">100% Affiliate (SUATMM)</span>
                      <div className="sim-sales-count">{cohortComparison.affiliate.salesUnits} affiliate referrals</div>
                      <div className="sim-profit-number text-cyan">
                        +{formatCurrency(cohortComparison.affiliate.netProfit)}
                      </div>
                      <span className="sim-card-note">Pure Commission (0 inventory, 0 support)</span>
                    </div>

                    <div className="sim-result-card highlighted">
                      <span className="sim-card-badge hybrid">⭐ Dual Hybrid Model</span>
                      <div className="sim-sales-count">
                        {cohortComparison.hybrid.directUnits} direct + {cohortComparison.hybrid.affiliateUnits} affiliate
                      </div>
                      <div className="sim-profit-number text-purple">
                        +{formatCurrency(cohortComparison.hybrid.netProfit)}
                      </div>
                      <span className="sim-card-note">
                        +{cohortComparison.hybrid.upliftVsAffiliatePct}% more revenue than affiliate alone!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Practical Execution Blueprint */}
                <div className="blueprint-box">
                  <div className="blueprint-header">
                    <Sparkles size={16} className="text-amber" />
                    <h5>How to Benefit Both Ways in Practice</h5>
                  </div>
                  <div className="blueprint-steps">
                    <div className="b-step">
                      <span className="b-step-num">1</span>
                      <p>
                        <strong>For Trademarked / Artisan Items (e.g. Adventure Time Nintendo Dock):</strong> Use <em>Track B (Affiliate)</em>. Feature on your discovery catalog with a "Check Price / Buy on Etsy" button. You avoid trademark lawsuits and pocket 8%–12% commission effortlessly.
                      </p>
                    </div>
                    <div className="b-step">
                      <span className="b-step-num">2</span>
                      <p>
                        <strong>For High-Margin Breakouts (e.g. 7-Color LED Mask / Pet Gadgets):</strong> Use <em>Track A (Direct Store)</em>. Source via verified Alibaba/dropship suppliers to pocket +$35–$50 profit per order instead of giving 90% of the margin away to Amazon.
                      </p>
                    </div>
                    <div className="b-step">
                      <span className="b-step-num">3</span>
                      <p>
                        <strong>The Hybrid Sweet Spot:</strong> Place a primary <em>"Add to Cart (Free Shipping)"</em> button on your product page, and a secondary <em>"Or Buy with Amazon Prime"</em> affiliate link underneath. You capture maximum margin from direct buyers, and earn affiliate commissions from shoppers who insist on buying from Amazon!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
