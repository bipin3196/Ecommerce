import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { KpiBar } from "./components/KpiBar";
import { FilterBar } from "./components/FilterBar";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { AlertsDrawer } from "./components/AlertsDrawer";
import { WatchlistModal } from "./components/WatchlistModal";
import { SettingsModal } from "./components/SettingsModal";
import { ExportModal } from "./components/ExportModal";
import { Flame, Sparkles, AlertCircle } from "lucide-react";
import "./App.css";

function TrendSourceMain() {
  const { filteredProducts, selectedCountry } = useApp();

  return (
    <div className="app-root">
      <Header />

      <main className="main-content">
        {/* KPI Strip */}
        <KpiBar />

        {/* Filter Controls */}
        <FilterBar />

        {/* Product Opportunities Section */}
        <section className="product-grid-section">
          <div className="product-grid-section-header">
            <div className="section-title-wrap">
              <h2>
                <Flame className="text-emerald" size={22} />
                Today's Top 20 Product Opportunities ({selectedCountry.code})
              </h2>
              <p className="section-subtitle">
                Autonomous daily ranking powered by search trend velocity, unit margin viability, and verified supplier networks.
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={40} className="text-amber" />
              <h3>No products match your active filter criteria</h3>
              <p>Try lowering the Minimum Margin slider or resetting category filters to view more opportunities.</p>
            </div>
          ) : (
            <div className="product-cards-grid">
              {filteredProducts.map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  rank={idx + 1} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <AlertsDrawer />
      <WatchlistModal />
      <SettingsModal />
      <ExportModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <TrendSourceMain />
    </AppProvider>
  );
}
