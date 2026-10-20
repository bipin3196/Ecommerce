import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Settings, Key, Clock, ShieldCheck, Bell, Check, Save } from "lucide-react";

export function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, settings, setSettings } = useApp();
  const [formState, setFormState] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
      <div className="modal-content medium animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Settings size={20} className="text-cyan" />
            <div>
              <h2 className="modal-product-title">System Settings & Automation Engine</h2>
              <p className="tab-subtitle">Configure marketplace APIs, daily scheduler, and compliance filters.</p>
            </div>
          </div>
          <button onClick={() => setIsSettingsOpen(false)} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body-scroll">
          {/* API Keys Section */}
          <div className="settings-section">
            <div className="section-header-row">
              <Key size={16} className="text-cyan" />
              <h4 className="section-subheading m-0">Marketplace & Intelligence API Credentials</h4>
            </div>
            <p className="text-xs text-muted mb-3">
              TrendSource AI uses official developer APIs to query best sellers, BSR velocity, and supplier quotes compliant with terms of service.
            </p>

            <div className="settings-grid">
              <div className="form-group">
                <label>Amazon SP-API Client Secret / Token</label>
                <input 
                  type="password" 
                  value={formState.amazonApiKey}
                  onChange={(e) => setFormState(prev => ({ ...prev, amazonApiKey: e.target.value }))}
                  className="settings-input"
                />
              </div>

              <div className="form-group">
                <label>eBay Buy Browse API OAuth Token</label>
                <input 
                  type="password" 
                  value={formState.ebayApiKey}
                  onChange={(e) => setFormState(prev => ({ ...prev, ebayApiKey: e.target.value }))}
                  className="settings-input"
                />
              </div>

              <div className="form-group">
                <label>AliExpress Open Platform App Key</label>
                <input 
                  type="password" 
                  value={formState.aliexpressApiKey}
                  onChange={(e) => setFormState(prev => ({ ...prev, aliexpressApiKey: e.target.value }))}
                  className="settings-input"
                />
              </div>

              <div className="form-group">
                <label>Keepa Enterprise API Token</label>
                <input 
                  type="password" 
                  value={formState.keepaApiKey}
                  onChange={(e) => setFormState(prev => ({ ...prev, keepaApiKey: e.target.value }))}
                  className="settings-input"
                />
              </div>
            </div>
          </div>

          {/* Automation Scheduler Section */}
          <div className="settings-section mt-5">
            <div className="section-header-row">
              <Clock size={16} className="text-amber" />
              <h4 className="section-subheading m-0">Autonomous Daily Cron Execution Schedule</h4>
            </div>
            <p className="text-xs text-muted mb-3">
              The automated research crawler runs once every 24 hours to track day-over-day search volume and review velocity.
            </p>

            <div className="cron-config-card">
              <div className="cron-row">
                <span>Cron Frequency:</span>
                <strong className="text-cyan font-mono">0 2 * * * (Every Day at 02:00 AM UTC)</strong>
              </div>
              <div className="cron-row mt-2">
                <span>Alert Trigger:</span>
                <span>Send notification whenever a product's Trend Score spikes by &gt;15 points or enters the Top 20.</span>
              </div>
            </div>
          </div>

          {/* Alert Thresholds Section */}
          <div className="settings-section mt-5">
            <div className="section-header-row">
              <Bell size={16} className="text-emerald" />
              <h4 className="section-subheading m-0">Thresholds & Notifications</h4>
            </div>

            <div className="settings-grid">
              <div className="form-group">
                <label>Minimum Acceptable Profit Margin Alert Threshold (%)</label>
                <input 
                  type="number" 
                  min="15" 
                  max="60" 
                  value={formState.minMarginAlertThreshold}
                  onChange={(e) => setFormState(prev => ({ ...prev, minMarginAlertThreshold: parseInt(e.target.value) }))}
                  className="settings-input"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formState.emailAlertsEnabled}
                    onChange={(e) => setFormState(prev => ({ ...prev, emailAlertsEnabled: e.target.checked }))}
                  />
                  <span>Dispatch Daily Top 20 Executive PDF Briefing to user email</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer-sticky">
            <button type="submit" className="btn-primary-action">
              {savedSuccess ? <Check size={16} className="text-emerald" /> : <Save size={16} />}
              <span>{savedSuccess ? "Settings Saved!" : "Save Configuration"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
