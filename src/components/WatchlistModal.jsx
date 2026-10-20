import React from "react";
import { useApp } from "../context/AppContext";
import { calculateProfitability } from "../utils/calculator";
import { X, Bookmark, Trash2, ArrowRight, TrendingUp } from "lucide-react";

export function WatchlistModal() {
  const { 
    isWatchlistOpen, 
    setIsWatchlistOpen, 
    watchlist, 
    toggleWatchlist, 
    products, 
    formatCurrency, 
    selectedCountry,
    setSelectedProduct,
    setActiveTabInModal
  } = useApp();

  if (!isWatchlistOpen) return null;

  const savedProducts = products.filter(p => watchlist.includes(p.id));

  const handleOpenProduct = (prod, tab = "overview") => {
    setSelectedProduct(prod);
    setActiveTabInModal(tab);
    setIsWatchlistOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsWatchlistOpen(false)}>
      <div className="modal-content small animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Bookmark size={20} className="text-cyan" />
            <div>
              <h2 className="modal-product-title">Saved Watchlist ({savedProducts.length})</h2>
              <p className="tab-subtitle">Shortlisted high-margin products ready for sourcing.</p>
            </div>
          </div>
          <button onClick={() => setIsWatchlistOpen(false)} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {savedProducts.length === 0 ? (
            <div className="empty-state py-12">
              <Bookmark size={40} className="text-dim" />
              <p>Your watchlist is currently empty.</p>
              <span className="text-xs text-muted">Click the bookmark icon on any product card to track it here.</span>
            </div>
          ) : (
            <div className="watchlist-table-wrap">
              <table className="watchlist-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Niche</th>
                    <th>Trend Score</th>
                    <th>Buy / Landed</th>
                    <th>Retail Price</th>
                    <th>Net Margin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedProducts.map(p => {
                    const econ = calculateProfitability(p.unitEconomics, {
                      taxDutyRate: selectedCountry.taxRate
                    });

                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="watchlist-prod-cell">
                            <img src={p.image} alt={p.title} className="thumb-tiny" />
                            <strong 
                              className="watchlist-prod-title" 
                              onClick={() => handleOpenProduct(p, "overview")}
                            >
                              {p.title}
                            </strong>
                          </div>
                        </td>
                        <td><span className="badge badge-primary">{p.category}</span></td>
                        <td>
                          <span className="text-cyan font-bold">{p.trendScore}/100</span>
                        </td>
                        <td>{formatCurrency(econ.buyPrice)} / {formatCurrency(econ.landedCost)}</td>
                        <td><strong>{formatCurrency(econ.recommendedRetailPrice)}</strong></td>
                        <td>
                          <span className="text-emerald font-bold">{econ.netMarginPct}%</span>
                        </td>
                        <td>
                          <div className="watchlist-actions-cell">
                            <button 
                              onClick={() => handleOpenProduct(p, "roadmap")} 
                              className="btn-roadmap-mini"
                            >
                              <span>Roadmap</span>
                              <ArrowRight size={12} />
                            </button>
                            <button 
                              onClick={() => toggleWatchlist(p.id)} 
                              className="btn-trash-mini" 
                              title="Remove"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
