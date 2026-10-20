// Exporter utility for TrendSource AI (CSV, JSON, and Print)

export function exportToCSV(products, countryCode = "USD") {
  const headers = [
    "Rank",
    "Product Title",
    "Category",
    "Marketplace",
    "Trend Score (0-100)",
    "Demand Trend",
    "Competition",
    "Opportunity Tier",
    "Buy Price",
    "Landed Cost",
    "Recommended Sell Price",
    "Net Profit",
    "Net Margin %",
    "Top Supplier",
    "Supplier Country",
    "Main Risk",
    "Why Now Pitch"
  ];

  const rows = products.map((p, idx) => {
    const topSupplier = p.suppliers?.[0] || {};
    const econ = p.unitEconomics || {};
    const landed = (econ.buyPrice || 0) + (econ.inboundShipping || 0) + (econ.packagingCost || 0);
    const estFee = (econ.recommendedRetailPrice || 0) * 0.15;
    const estPay = (econ.recommendedRetailPrice || 0) * 0.029 + 0.3;
    const estNet = (econ.recommendedRetailPrice || 0) - landed - estFee - estPay - (econ.adAllowance || 0);
    const margin = econ.recommendedRetailPrice > 0 ? (estNet / econ.recommendedRetailPrice) * 100 : 0;

    return [
      idx + 1,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category,
      p.primaryMarketplace,
      p.trendScore,
      p.trendDirection,
      p.competitionLevel,
      p.opportunityTier,
      econ.buyPrice?.toFixed(2),
      landed.toFixed(2),
      econ.recommendedRetailPrice?.toFixed(2),
      estNet.toFixed(2),
      `${margin.toFixed(1)}%`,
      `"${(topSupplier.name || '').replace(/"/g, '""')}"`,
      topSupplier.country || 'N/A',
      `"${(p.mainRisk || '').replace(/"/g, '""')}"`,
      `"${(p.whyNow || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `TrendSource_AI_Top_Opportunities_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(products) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `TrendSource_AI_Dataset_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
