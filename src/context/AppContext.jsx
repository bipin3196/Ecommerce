import React, { createContext, useContext, useState, useMemo } from "react";
import { INITIAL_PRODUCTS } from "../data/mockProducts";
import { calculateProfitability } from "../utils/calculator";

const AppContext = createContext();

export const COUNTRIES = [
  { code: "USA", name: "United States", currency: "USD", symbol: "$", rate: 1.0, taxRate: 0.00 },
  { code: "AUS", name: "Australia", currency: "AUD", symbol: "A$", rate: 1.52, taxRate: 0.10 },
  { code: "UK", name: "United Kingdom", currency: "GBP", symbol: "£", rate: 0.79, taxRate: 0.20 },
  { code: "CAN", name: "Canada", currency: "CAD", symbol: "C$", rate: 1.36, taxRate: 0.05 },
  { code: "UAE", name: "United Arab Emirates", currency: "AED", symbol: "AED", rate: 3.67, taxRate: 0.05 }
];

export const INITIAL_ALERTS = [
  {
    id: "alert-1",
    type: "SURGE_SPIKE",
    title: "Surge Detected: 7-Color LED Face Mask",
    message: "TikTok search volume spiked +74% in last 72 hours. Trend score elevated to 94.",
    time: "12m ago",
    severity: "critical",
    productId: "prod-001"
  },
  {
    id: "alert-2",
    type: "TOP20_ENTRY",
    title: "New Top 20 Entry: Smart Wireless Meat Thermometer",
    message: "Wireless Meat Thermometer crossed 85k monthly searches with 60% gross margin.",
    time: "1h ago",
    severity: "info",
    productId: "prod-013"
  },
  {
    id: "alert-3",
    type: "MARGIN_WARNING",
    title: "Supplier Price Drop: Shenzhen BaseLink",
    message: "MagSafe Foldable Charger bulk tier price decreased to $8.80 (+$1.40 profit/unit).",
    time: "3h ago",
    severity: "info",
    productId: "prod-005"
  },
  {
    id: "alert-4",
    type: "COMPETITOR_OOS",
    title: "Competitor Stock Out: Anker 633",
    message: "Primary competitor went Out-Of-Stock on Amazon US for 48 hours. Opportunity to capture buy-box.",
    time: "5h ago",
    severity: "warning",
    productId: "prod-011"
  }
];

export function AppProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [watchlist, setWatchlist] = useState(["prod-001", "prod-003", "prod-005"]);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTabInModal, setActiveTabInModal] = useState("overview");
  
  // Modal states
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMarketplace, setSelectedMarketplace] = useState("all");
  const [selectedBusinessModel, setSelectedBusinessModel] = useState("all");
  const [selectedStrategy, setSelectedStrategy] = useState("all"); // 'all', 'direct', 'affiliate', 'hybrid'
  const [customStrategyOverrides, setCustomStrategyOverrides] = useState({});
  const [minMargin, setMinMargin] = useState(25);
  const [selectedCompetition, setSelectedCompetition] = useState("all");
  const [selectedSupplierCountry, setSelectedSupplierCountry] = useState("all");
  const [avoidRestrictions, setAvoidRestrictions] = useState(false);


  // Daily Scan Automated Workflow simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(null); // 'connecting', 'ingesting', 'scoring', 'calculating', 'complete'
  const [lastScannedTime, setLastScannedTime] = useState("Today, 02:00 AM UTC (Automated Daily Cron)");

  // Settings
  const [settings, setSettings] = useState({
    amazonApiKey: "sp-api-live-••••••••••••4902",
    ebayApiKey: "ebay-browse-live-••••••••8819",
    aliexpressApiKey: "ali-open-••••••••3310",
    keepaApiKey: "keepa-pro-••••••••9011",
    autoScanHour: 2, // 2:00 AM
    minMarginAlertThreshold: 35,
    emailAlertsEnabled: true
  });

  // Currency Converter helper
  const formatCurrency = (amountInUSD) => {
    if (amountInUSD === undefined || amountInUSD === null) return `${selectedCountry.symbol}0.00`;
    const converted = amountInUSD * selectedCountry.rate;
    return `${selectedCountry.symbol}${converted.toFixed(2)}`;
  };

  // Run automated scan
  const triggerDailyScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStep("Connecting to Amazon SP-API, eBay Browse API & AliExpress...");

    setTimeout(() => {
      setScanStep("Scanning Google Trends, TikTok Creative Center & BSR velocity...");
    }, 1200);

    setTimeout(() => {
      setScanStep("Matching 3-tier suppliers from Alibaba, AliExpress & Domestic hubs...");
    }, 2400);

    setTimeout(() => {
      setScanStep("Computing landed cost, marketplace commissions & net profit margins...");
    }, 3600);

    setTimeout(() => {
      // Simulate small dynamic updates to scores
      setProducts(prev => prev.map(p => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const newScore = Math.min(99, Math.max(70, p.trendScore + delta));
        return {
          ...p,
          trendScore: newScore,
          trendDirection: delta > 0 ? "rising" : delta < 0 ? "declining" : "stable"
        };
      }));

      // Add a fresh alert
      const newAlert = {
        id: `alert-${Date.now()}`,
        type: "SURGE_SPIKE",
        title: "Daily Scan Finished: 1,420 listings analyzed",
        message: "Automated scan discovered 20 verified high-margin opportunities meeting your criteria.",
        time: "Just now",
        severity: "info"
      };
      setAlerts(prev => [newAlert, ...prev]);

      const now = new Date();
      setLastScannedTime(`Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (On-Demand)`);
      setIsScanning(false);
      setScanStep(null);
    }, 4800);
  };

  // Toggle watchlist item
  const toggleWatchlist = (productId) => {
    setWatchlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Set user custom monetization strategy route per product
  const setProductStrategy = (productId, strategy) => {
    setCustomStrategyOverrides(prev => ({
      ...prev,
      [productId]: strategy
    }));
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesWhy = p.whyNow.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesWhy) return false;
      }

      // Strategy Filter (Direct vs Affiliate vs Hybrid)
      if (selectedStrategy !== "all") {
        const activeRoute = customStrategyOverrides[p.id] || p.monetization?.recommendedRoute || "direct";
        if (activeRoute !== selectedStrategy) return false;
      }

      // Category
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;

      // Marketplace
      if (selectedMarketplace !== "all" && p.primaryMarketplace.toLowerCase() !== selectedMarketplace.toLowerCase()) return false;

      // Business Model
      if (selectedBusinessModel !== "all" && p.businessModel !== selectedBusinessModel) return false;

      // Competition
      if (selectedCompetition !== "all" && p.competitionLevel !== selectedCompetition) return false;

      // Supplier Country
      if (selectedSupplierCountry !== "all") {
        const hasMatchingSupplier = p.suppliers.some(s => s.country.toLowerCase() === selectedSupplierCountry.toLowerCase());
        if (!hasMatchingSupplier) return false;
      }

      // Avoid Restrictions
      if (avoidRestrictions && (p.isRestricted || p.opportunityTier === "Avoid")) return false;

      // Min Margin (applied to direct/hybrid fulfillment; affiliate curation has 0 COGS / pure commission)
      const activeRoute = customStrategyOverrides[p.id] || p.monetization?.recommendedRoute || "direct";
      if (activeRoute !== "affiliate") {
        const econ = calculateProfitability(p.unitEconomics, { taxDutyRate: selectedCountry.taxRate });
        if (econ.netMarginPct < minMargin) return false;
      }

      return true;
    }).sort((a, b) => b.trendScore - a.trendScore);

  }, [
    products, 
    searchQuery, 
    selectedStrategy,
    customStrategyOverrides,
    selectedCategory, 
    selectedMarketplace, 
    selectedBusinessModel, 
    selectedCompetition, 
    selectedSupplierCountry, 
    avoidRestrictions, 
    minMargin,
    selectedCountry
  ]);


  const value = {
    products,
    filteredProducts,
    selectedCountry,
    setSelectedCountry,
    watchlist,
    toggleWatchlist,
    alerts,
    setAlerts,
    selectedProduct,
    setSelectedProduct,
    activeTabInModal,
    setActiveTabInModal,
    // Modals
    isAlertsOpen,
    setIsAlertsOpen,
    isWatchlistOpen,
    setIsWatchlistOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isExportOpen,
    setIsExportOpen,
    // Filters
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
    customStrategyOverrides,
    setProductStrategy,
    minMargin,
    setMinMargin,
    selectedCompetition,
    setSelectedCompetition,
    selectedSupplierCountry,
    setSelectedSupplierCountry,
    avoidRestrictions,
    setAvoidRestrictions,
    // Daily Scan
    isScanning,
    scanStep,
    lastScannedTime,
    triggerDailyScan,
    // Formatters
    formatCurrency,
    settings,
    setSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
