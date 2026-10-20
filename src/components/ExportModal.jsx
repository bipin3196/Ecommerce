import React from "react";
import { useApp } from "../context/AppContext";
import { exportToCSV, exportToJSON } from "../utils/exporter";
import { X, Download, FileSpreadsheet, FileCode, Printer, CheckCircle2 } from "lucide-react";

export function ExportModal() {
  const { isExportOpen, setIsExportOpen, filteredProducts, selectedCountry } = useApp();

  if (!isExportOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsExportOpen(false)}>
      <div className="modal-content small animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Download size={20} className="text-cyan" />
            <div>
              <h2 className="modal-product-title">Export Intelligence Report</h2>
              <p className="tab-subtitle">Download today's Top 20 opportunities with full financial models.</p>
            </div>
          </div>
          <button onClick={() => setIsExportOpen(false)} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-scroll">
          <div className="export-options-list">
            {/* CSV Export */}
            <div className="export-card" onClick={() => exportToCSV(filteredProducts, selectedCountry.currency)}>
              <div className="export-icon-wrap emerald">
                <FileSpreadsheet size={24} />
              </div>
              <div className="export-info">
                <h4>Download CSV Spreadsheet</h4>
                <p>Includes all 20 products, landed costs, margins, top suppliers, and competitor metrics. Ready for Excel or Google Sheets.</p>
              </div>
              <button className="btn-export-action">Download CSV</button>
            </div>

            {/* JSON Export */}
            <div className="export-card" onClick={() => exportToJSON(filteredProducts)}>
              <div className="export-icon-wrap cyan">
                <FileCode size={24} />
              </div>
              <div className="export-info">
                <h4>Export Full Raw JSON Dataset</h4>
                <p>Complete data structure including multi-tier suppliers, 30-day marketing roadmaps, and supplier RFQ templates.</p>
              </div>
              <button className="btn-export-action">Export JSON</button>
            </div>

            {/* Print / PDF Report */}
            <div className="export-card" onClick={handlePrint}>
              <div className="export-icon-wrap purple">
                <Printer size={24} />
              </div>
              <div className="export-info">
                <h4>Print / Save as Executive PDF</h4>
                <p>Generate a formatted printer-ready dossier suitable for business partners, investors, or sourcing review meetings.</p>
              </div>
              <button className="btn-export-action">Print / PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
