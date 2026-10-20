import React from "react";
import { useApp } from "../context/AppContext";
import { calculateProfitability } from "../utils/calculator";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Bookmark, 
  ExternalLink, 
  Calculator, 
  Truck, 
  ShieldAlert, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  DollarSign
} from "lucide-react";

export function ProductCard({ product, rank }) {
  const { 
    formatCurrency, 
    selectedCountry, 
    watchlist, 
    toggleWatchlist, 
    setSelectedProduct, 
    setActiveTabInModal,
    customStrategyOverrides
  } = useApp();


  const isSaved = watchlist.includes(product.id);

  // Calculate profitability with active country tax/duty
  const econ = calculateProfitability(product.unitEconomics, {
    taxDutyRate: selectedCountry.taxRate
  });

  const topSupplier = product.suppliers?.[0] || {};

  const handleOpenDetail = (tab = "overview") => {
    setActiveTabInModal(tab);
    setSelectedProduct(product);
  };

  return (
    <div className="product-card-root animate-fade-in">
      {/* Top Banner: Rank & Trend Score */}
      <div className="card-top-bar">
        <div className="rank-badge">#{rank}</div>
        
        <div className="top-badges-right">
          {/* Trend Score Pill */}
          <div className="trend-score-badge" title="Daily Algorithmic Trend Score (0-100)">
            <span className="score-val">{product.trendScore}</span>
            <span className="score-label">/100</span>
            {product.trendDirection === "rising" && <TrendingUp size={13} className="text-emerald" />}
            {product.trendDirection === "stable" && <Minus size={13} className="text-amber" />}
            {product.trendDirection === "declining" && <TrendingDown size={13} className="text-rose" />}
          </div>

          {/* Opportunity Tier Badge */}
          <span className={`badge badge-${product.opportunityTier.toLowerCase()}`}>
            {product.opportunityTier}
          </span>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleWatchlist(product.id)}
            className={`card-bookmark-btn ${isSaved ? "saved" : ""}`}
            title={isSaved ? "Remove from watchlist" : "Save to watchlist"}
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Main Image & Quick Info */}
      <div className="card-media-wrap" onClick={() => handleOpenDetail("overview")}>
        <img 
          src={product.image} 
          alt={product.title} 
          className="card-img" 
          loading="lazy" 
        />
        <div className="card-category-tag">
          {product.category.toUpperCase()} • {product.subCategory}
        </div>
        <div className="card-channel-tag">
          {product.primaryMarketplace}
        </div>
      </div>

      {/* Content Body */}
      <div className="card-body">
        <h3 className="card-title" onClick={() => handleOpenDetail("overview")} title={product.title}>
          {product.title}
        </h3>

        {/* Why Now Highlight */}
        <div className="why-now-box">
          <Sparkles size={14} className="sparkle-icon" />
          <p className="why-now-text">{product.whyNow}</p>
        </div>

        {/* Supplier Snippet */}
        <div className="supplier-snippet-row">
          <Truck size={14} className="text-cyan" />
          <span className="snippet-label">Best Supplier:</span>
          <span className="snippet-val" title={topSupplier.name}>
            {topSupplier.name} ({topSupplier.country})
          </span>
        </div>

        {/* Unit Economics Matrix Bar */}
        <div className="unit-economics-grid">
          <div className="econ-col">
            <span className="econ-title">Buy / Landed</span>
            <span className="econ-number">
              {formatCurrency(econ.buyPrice)} / {formatCurrency(econ.landedCost)}
            </span>
          </div>

          <div className="econ-col">
            <span className="econ-title">Target Retail</span>
            <span className="econ-number retail">
              {formatCurrency(econ.recommendedRetailPrice)}
            </span>
          </div>

          <div className="econ-col">
            <span className="econ-title">Net Profit</span>
            <span className="econ-number profit">
              +{formatCurrency(econ.netProfit)}
            </span>
          </div>

          <div className="econ-col">
            <span className="econ-title">Net Margin</span>
            <span className={`econ-number margin ${econ.netMarginPct >= 40 ? "high" : ""}`}>
              {econ.netMarginPct}%
            </span>
          </div>
        </div>

        {/* Dual Monetization Route Pill */}
        {(() => {
          const activeRoute = customStrategyOverrides[product.id] || product.monetization?.recommendedRoute || "direct";
          const commRate = product.monetization?.affiliateCommissionRate || 0.08;
          const commVal = econ.recommendedRetailPrice * commRate;

          return (
            <div 
              className={`card-monetization-strip strip-${activeRoute}`}
              onClick={() => handleOpenDetail("monetization")}
              title="Click to view Dual Monetization strategy comparison"
            >
              <div className="strip-left">
                <DollarSign size={13} className="strip-icon" />
                <span className="strip-label">
                  {activeRoute === "affiliate" && `Affiliate Curation (${Math.round(commRate * 100)}%)`}
                  {activeRoute === "direct" && `Direct Store Winner`}
                  {activeRoute === "hybrid" && `Dual Route (Sell + Affiliate)`}
                </span>
              </div>
              <div className="strip-right">
                {activeRoute === "affiliate" && `+${formatCurrency(commVal)}/sale (0 Risk)`}
                {activeRoute === "direct" && `+${formatCurrency(econ.netProfit)} net profit`}
                {activeRoute === "hybrid" && `Max Yield`}
              </div>
            </div>
          );
        })()}

        {/* Risk Callout */}
        {product.mainRisk && (
          <div className="risk-indicator-row">
            <ShieldAlert size={13} className="text-amber" />
            <span className="risk-text">Risk: {product.mainRisk}</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="card-actions-footer">
        <button 
          onClick={() => handleOpenDetail("monetization")} 
          className="btn-monetize-action"
          title="Compare Direct Selling vs Affiliate (SUATMM Model)"
        >
          <DollarSign size={14} />
          <span>Monetize</span>
        </button>

        <button 
          onClick={() => handleOpenDetail("roadmap")} 
          className="btn-launch-roadmap"
        >
          <span>Roadmap</span>
          <ArrowRight size={14} />
        </button>

        <button 
          onClick={() => handleOpenDetail("profit")} 
          className="btn-calc-action"
          title="Open Live Unit Profit Calculator"
        >
          <Calculator size={15} />
        </button>

        <button 
          onClick={() => handleOpenDetail("overview")} 
          className="btn-details-action"
          title="Open Full Market Deep-Dive"
        >
          <ExternalLink size={15} />
        </button>
      </div>

    </div>
  );
}
