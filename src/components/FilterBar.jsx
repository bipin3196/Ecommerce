import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag,
  Layers,
  Factory,
  DollarSign
} from "lucide-react";

export function FilterBar() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMarketplace,
    setSelectedMarketplace,
    selectedBusinessModel,
    setSelectedBusinessModel,
    selectedStrategy,
    setSelectedStrategy,
    minMargin,
    setMinMargin,
    selectedCompetition,
    setSelectedCompetition,
    selectedSupplierCountry,
    setSelectedSupplierCountry,
    avoidRestrictions,
    setAvoidRestrictions
  } = useApp();


  const categories = [
    { id: "all", label: "All Niches" },
    { id: "beauty", label: "Beauty & Skincare" },
    { id: "pets", label: "Pet Supplies" },
    { id: "home", label: "Home & Kitchen" },
    { id: "fitness", label: "Fitness & Recovery" },
    { id: "electronics", label: "Smart Electronics" }
  ];

  return (
    <div className="filter-bar-root">
      {/* Category Tabs */}
      <div className="category-scroll-strip">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`cat-pill ${selectedCategory === cat.id ? "active" : ""}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Advanced Filter Controls Row */}
      <div className="filter-controls-grid">
        {/* Search Input */}
        <div className="filter-field search-field">
          <Search size={16} className="field-icon" />
          <input
            type="text"
            placeholder="Search trending products, keywords, niches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="clear-btn">
              ×
            </button>
          )}
        </div>

        {/* Marketplace Filter */}
        <div className="filter-field">
          <ShoppingBag size={15} className="field-icon" />
          <select
            value={selectedMarketplace}
            onChange={(e) => setSelectedMarketplace(e.target.value)}
            className="filter-select"
          >
            <option value="all">Marketplace: All Channels</option>
            <option value="amazon">Amazon FBA / SP</option>
            <option value="ebay">eBay</option>
            <option value="aliexpress">AliExpress</option>
            <option value="tiktok shop">TikTok Shop</option>
            <option value="etsy">Etsy</option>
          </select>
        </div>

        {/* Business Model Filter */}
        <div className="filter-field">
          <Layers size={15} className="field-icon" />
          <select
            value={selectedBusinessModel}
            onChange={(e) => setSelectedBusinessModel(e.target.value)}
            className="filter-select"
          >
            <option value="all">Model: All Models</option>
            <option value="private_label">Private Label / OEM</option>
            <option value="dropshipping">Dropshipping</option>
            <option value="wholesale">Wholesale</option>
          </select>
        </div>

        {/* Dual Monetization Strategy Filter */}
        <div className="filter-field">
          <DollarSign size={15} className="field-icon text-amber" />
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="filter-select"
          >
            <option value="all">Monetization: All Routes</option>
            <option value="direct">Direct Storefront (High Margin)</option>
            <option value="affiliate">Affiliate Curation (SUATMM Model)</option>
            <option value="hybrid">Dual Route (Sell + Affiliate)</option>
          </select>
        </div>


        {/* Supplier Country Filter */}
        <div className="filter-field">
          <Factory size={15} className="field-icon" />
          <select
            value={selectedSupplierCountry}
            onChange={(e) => setSelectedSupplierCountry(e.target.value)}
            className="filter-select"
          >
            <option value="all">Supplier: All Origins</option>
            <option value="china">China (Alibaba/1688)</option>
            <option value="usa">USA Domestic Hubs</option>
          </select>
        </div>

        {/* Min Margin Slider */}
        <div className="margin-slider-wrap">
          <div className="margin-slider-header">
            <span className="margin-slider-label">Min Net Margin:</span>
            <span className="margin-slider-val">{minMargin}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="60"
            step="5"
            value={minMargin}
            onChange={(e) => setMinMargin(Number(e.target.value))}
            className="margin-range-slider"
          />
        </div>

        {/* Avoid Restrictions Checkbox */}
        <label className="restrictions-toggle">
          <input
            type="checkbox"
            checked={avoidRestrictions}
            onChange={(e) => setAvoidRestrictions(e.target.checked)}
          />
          <span className="toggle-label">
            <ShieldCheck size={15} className="text-emerald" />
            Safe Only (Exclude Restricted/Fragile)
          </span>
        </label>
      </div>
    </div>
  );
}
