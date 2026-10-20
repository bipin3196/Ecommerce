import React from "react";
import { useApp, COUNTRIES } from "../context/AppContext";
import { 
  Sparkles, 
  RefreshCw, 
  Bell, 
  Bookmark, 
  Settings, 
  Download, 
  Globe2,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

export function Header() {
  const { 
    selectedCountry, 
    setSelectedCountry, 
    isScanning, 
    scanStep, 
    triggerDailyScan, 
    watchlist, 
    alerts, 
    setIsAlertsOpen, 
    setIsWatchlistOpen, 
    setIsSettingsOpen, 
    setIsExportOpen 
  } = useApp();

  const unreadAlertsCount = alerts.length;

  return (
    <header className="header-root">
      <div className="header-container">
        {/* Brand / Logo */}
        <div className="brand-group">
          <div className="logo-icon-wrap">
            <TrendingUp className="logo-icon" size={24} />
            <div className="logo-glow" />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">TrendSource AI</h1>
              <span className="brand-pill">
                <span className="live-dot" />
                Daily Autonomous Engine
              </span>
            </div>
            <p className="brand-subtitle">
              Global E-Commerce Trend Discovery, Supplier Sourcing & Launch Intelligence
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Target Country Selector */}
          <div className="country-select-wrapper">
            <Globe2 size={16} className="country-icon" />
            <select 
              value={selectedCountry.code} 
              onChange={(e) => {
                const found = COUNTRIES.find(c => c.code === e.target.value);
                if (found) setSelectedCountry(found);
              }}
              className="country-select"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.symbol} {c.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Daily Scan Button */}
          <button 
            onClick={triggerDailyScan} 
            disabled={isScanning}
            className={`scan-btn ${isScanning ? "scanning" : ""}`}
            title="Scan market best sellers, rising keywords and supplier price changes"
          >
            <RefreshCw size={16} className={isScanning ? "animate-spin-slow" : ""} />
            <span>{isScanning ? "Running Daily Scan..." : "Run Daily Scan"}</span>
          </button>

          {/* Watchlist Button */}
          <button 
            onClick={() => setIsWatchlistOpen(true)}
            className="icon-action-btn"
            title="Saved Watchlist"
          >
            <Bookmark size={18} />
            {watchlist.length > 0 && (
              <span className="action-badge">{watchlist.length}</span>
            )}
          </button>

          {/* Alerts Bell */}
          <button 
            onClick={() => setIsAlertsOpen(true)}
            className="icon-action-btn"
            title="Real-Time Alerts"
          >
            <Bell size={18} />
            {unreadAlertsCount > 0 && (
              <span className="action-badge alert">{unreadAlertsCount}</span>
            )}
          </button>

          {/* Export Report */}
          <button 
            onClick={() => setIsExportOpen(true)}
            className="icon-action-btn"
            title="Export Daily Report"
          >
            <Download size={18} />
          </button>

          {/* Admin Settings */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="icon-action-btn"
            title="API Settings & Daily Automation Schedule"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Live Scanning Progress Banner if active */}
      {isScanning && (
        <div className="scanning-banner animate-fade-in">
          <div className="scanning-banner-content">
            <RefreshCw size={15} className="animate-spin-slow banner-spinner" />
            <span className="banner-text"><strong>Automated Research Pipeline:</strong> {scanStep}</span>
          </div>
          <div className="scanning-progress-bar">
            <div className="scanning-progress-fill" />
          </div>
        </div>
      )}
    </header>
  );
}
