import React from "react";
import { useApp } from "../context/AppContext";
import { 
  BarChart3, 
  Flame, 
  Percent, 
  Clock, 
  ShieldAlert,
  CheckCircle2
} from "lucide-react";

export function KpiBar() {
  const { filteredProducts, lastScannedTime } = useApp();

  const totalScanned = 1420;
  const countFiltered = filteredProducts.length;
  
  // Compute average margin
  const avgMargin = filteredProducts.length > 0 
    ? (filteredProducts.reduce((acc, p) => {
        const buy = p.unitEconomics.buyPrice + p.unitEconomics.inboundShipping + p.unitEconomics.packagingCost;
        const refFee = p.unitEconomics.recommendedRetailPrice * 0.15;
        const payFee = (p.unitEconomics.recommendedRetailPrice * 0.029) + 0.3;
        const net = p.unitEconomics.recommendedRetailPrice - buy - refFee - payFee - p.unitEconomics.adAllowance;
        const pct = (net / p.unitEconomics.recommendedRetailPrice) * 100;
        return acc + pct;
      }, 0) / filteredProducts.length).toFixed(1)
    : "48.2";

  const excellentCount = filteredProducts.filter(p => p.opportunityTier === "Excellent").length;

  return (
    <div className="kpi-bar-root">
      <div className="kpi-item">
        <div className="kpi-icon-wrap cyan">
          <BarChart3 size={18} />
        </div>
        <div>
          <div className="kpi-label">Market Listings Scanned</div>
          <div className="kpi-val-row">
            <span className="kpi-val">{totalScanned.toLocaleString()}</span>
            <span className="kpi-sub">Daily Multi-Channel</span>
          </div>
        </div>
      </div>

      <div className="kpi-divider" />

      <div className="kpi-item">
        <div className="kpi-icon-wrap emerald">
          <Flame size={18} />
        </div>
        <div>
          <div className="kpi-label">Top Opportunities Today</div>
          <div className="kpi-val-row">
            <span className="kpi-val">{countFiltered}</span>
            <span className="kpi-sub highlight-green">{excellentCount} High Potential</span>
          </div>
        </div>
      </div>

      <div className="kpi-divider" />

      <div className="kpi-divider" />

      <div className="kpi-item">
        <div className="kpi-icon-wrap purple">
          <Percent size={18} />
        </div>
        <div>
          <div className="kpi-label">Avg. Direct Margin</div>
          <div className="kpi-val-row">
            <span className="kpi-val">{avgMargin}%</span>
            <span className="kpi-sub">Direct Net Yield</span>
          </div>
        </div>
      </div>

      <div className="kpi-divider" />

      <div className="kpi-item">
        <div className="kpi-icon-wrap amber">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <div className="kpi-label">Dual Revenue Model</div>
          <div className="kpi-val-row">
            <span className="kpi-val text-sm">Direct + Affiliate</span>
            <span className="kpi-sub highlight-amber">Passive Curation &amp; Store</span>
          </div>
        </div>
      </div>

    </div>
  );
}
