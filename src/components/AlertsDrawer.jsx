import React from "react";
import { useApp } from "../context/AppContext";
import { 
  X, 
  Bell, 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export function AlertsDrawer() {
  const { 
    isAlertsOpen, 
    setIsAlertsOpen, 
    alerts, 
    setAlerts, 
    products, 
    setSelectedProduct, 
    setActiveTabInModal 
  } = useApp();

  if (!isAlertsOpen) return null;

  const handleOpenProduct = (productId) => {
    const found = products.find(p => p.id === productId);
    if (found) {
      setSelectedProduct(found);
      setActiveTabInModal("overview");
      setIsAlertsOpen(false);
    }
  };

  const getAlertIcon = (type, severity) => {
    if (severity === "critical") return <Flame size={18} className="text-rose" />;
    if (type === "SURGE_SPIKE") return <TrendingUp size={18} className="text-cyan" />;
    if (type === "COMPETITOR_OOS") return <AlertTriangle size={18} className="text-amber" />;
    return <Bell size={18} className="text-emerald" />;
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsAlertsOpen(false)}>
      <div className="drawer-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-left">
            <Bell size={18} className="text-cyan" />
            <h3 className="drawer-title">Real-Time Opportunity Alerts</h3>
            <span className="badge badge-primary">{alerts.length} New</span>
          </div>
          <button onClick={() => setIsAlertsOpen(false)} className="drawer-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {alerts.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} className="text-muted" />
              <p>No unread alerts at this time.</p>
            </div>
          ) : (
            <div className="alerts-list">
              {alerts.map(a => (
                <div key={a.id} className={`alert-card ${a.severity}`}>
                  <div className="alert-card-top">
                    <div className="alert-type-icon">{getAlertIcon(a.type, a.severity)}</div>
                    <div className="alert-meta">
                      <h4 className="alert-title">{a.title}</h4>
                      <span className="alert-time">{a.time}</span>
                    </div>
                  </div>
                  <p className="alert-message">{a.message}</p>

                  {a.productId && (
                    <button 
                      onClick={() => handleOpenProduct(a.productId)} 
                      className="alert-action-btn"
                    >
                      <span>Investigate Product Opportunity</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button onClick={() => setAlerts([])} className="btn-clear-alerts">
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
}
