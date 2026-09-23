import React, { useState } from "react";
import {
  FileText,
  Layers,
  Palette,
  CheckCircle,
  Shield,
  Maximize2,
  Copy,
  Info,
  Sparkles,
  QrCode,
  ZoomIn,
} from "lucide-react";
import { FileFormatIcon } from "./FileFormatIcon.js";

export interface FilePreviewCanvasProps {
  filename: string;
  extension?: string;
  clientName?: string;
  projectName?: string;
  year?: number;
  versionNumber?: number;
  formattedSize?: string;
  sizeBytes?: number;
  modifiedAt?: string;
  targetPath?: string;
  sha256?: string;
}

export const FilePreviewCanvas: React.FC<FilePreviewCanvasProps> = ({
  filename,
  extension = "",
  clientName = "General Client",
  projectName = "Design Deliverable",
  year = 2026,
  versionNumber = 1,
  formattedSize = "24.6 MB",
  sizeBytes,
  modifiedAt = "Today",
  targetPath,
  sha256,
}) => {
  const ext = (extension || filename.split(".").pop() || "").toLowerCase().replace(".", "");
  const lowerName = filename.toLowerCase();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyColor = (colorName: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  // 1. CorelDRAW (.cdr) Preview Canvas
  if (ext === "cdr") {
    const isIdCard = lowerName.includes("id") || lowerName.includes("card") || lowerName.includes("badge");
    const isSignage = lowerName.includes("sign") || lowerName.includes("board") || lowerName.includes("emergency");

    return (
      <div className="file-preview-canvas win-cdr-preview">
        {/* Preview Viewport Header */}
        <div className="preview-canvas-header">
          <div className="preview-canvas-title-group">
            <span className="preview-canvas-badge cdr">CorelDRAW Vector Canvas</span>
            <span className="preview-canvas-sub">Vector Lossless • CMYK 300 DPI</span>
          </div>
          <span className="preview-canvas-dimensions">
            {isIdCard ? "CR80 (85.6 × 54.0 mm)" : isSignage ? "A3 (297 × 420 mm)" : "A4 (210 × 297 mm)"}
          </span>
        </div>

        {/* Realistic Design Rendering */}
        <div className="preview-viewport-box">
          {isIdCard ? (
            /* Student / Employee ID Card Layout */
            <div className="cdr-id-card-mockup animate-fade-in">
              <div className="id-card-lanyard-hole" />
              <div className="id-card-header">
                <div className="id-card-logo-emblem">🎓</div>
                <div className="id-card-org-names">
                  <div className="id-card-org-title">{clientName.toUpperCase()}</div>
                  <div className="id-card-org-sub">ACCREDITED EDUCATIONAL INSTITUTION • {year}</div>
                </div>
              </div>

              <div className="id-card-body">
                <div className="id-card-photo-frame">
                  <div className="id-card-photo-avatar">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="id-card-photo-tag">PHOTO ID</span>
                </div>

                <div className="id-card-data-fields">
                  <div className="id-card-name">ARJUN SHARMA</div>
                  <div className="id-card-role">Student • Grade 11-A</div>
                  <div className="id-card-field-row">
                    <span className="id-k">ID No:</span>
                    <span className="id-v">SCH-2026-8841</span>
                  </div>
                  <div className="id-card-field-row">
                    <span className="id-k">Valid:</span>
                    <span className="id-v">JUNE 2026 - MAY 2027</span>
                  </div>
                  <div className="id-card-field-row">
                    <span className="id-k">Blood:</span>
                    <span className="id-v">O+ POSITIVE</span>
                  </div>
                </div>
              </div>

              <div className="id-card-footer">
                <div className="id-card-barcode-lines">
                  <div className="barcode-stripe" />
                  <div className="barcode-stripe thick" />
                  <div className="barcode-stripe" />
                  <div className="barcode-stripe thin" />
                  <div className="barcode-stripe thick" />
                  <div className="barcode-stripe" />
                  <div className="barcode-stripe thin" />
                  <div className="barcode-stripe thick" />
                  <div className="barcode-stripe" />
                  <span className="barcode-number">*SCH-8841-2026*</span>
                </div>
                <div className="id-card-auth-seal">
                  <div className="auth-seal-stamp">OFFICIAL SEAL</div>
                </div>
              </div>
            </div>
          ) : isSignage ? (
            /* Emergency Signage Layout */
            <div className="cdr-signage-mockup animate-fade-in">
              <div className="signage-header-strip">
                <div className="signage-symbol">⚡</div>
                <span className="signage-header-text">EMERGENCY FIRST AID &amp; EVACUATION</span>
              </div>
              <div className="signage-body">
                <div className="signage-main-arrow">➜</div>
                <div className="signage-details">
                  <div className="signage-primary-text">{clientName.toUpperCase()}</div>
                  <div className="signage-sub-text">{projectName.toUpperCase()} • ROOM B-104</div>
                  <div className="signage-iso-badge">ISO 7010 COMPLIANT</div>
                </div>
              </div>
              <div className="signage-footer-strip">
                <span>IN CASE OF EMERGENCY DIAL 112 / INTERNAL 99</span>
              </div>
            </div>
          ) : (
            /* Publication / Brochure Layout */
            <div className="cdr-brochure-mockup animate-fade-in">
              <div className="brochure-crop-mark top-left" />
              <div className="brochure-crop-mark top-right" />
              <div className="brochure-crop-mark bottom-left" />
              <div className="brochure-crop-mark bottom-right" />
              <div className="brochure-cover-content">
                <div className="brochure-client-tag">{clientName.toUpperCase()}</div>
                <h4 className="brochure-title">{projectName}</h4>
                <div className="brochure-graphic-banner">
                  <div className="banner-triangle" />
                  <span className="banner-text">ANNUAL DELIVERABLE {year}</span>
                </div>
                <div className="brochure-summary-lines">
                  <div className="summary-line" style={{ width: "90%" }} />
                  <div className="summary-line" style={{ width: "75%" }} />
                  <div className="summary-line" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vector Intelligence & Color Palette */}
        <div className="preview-canvas-palette-box">
          <div className="palette-label">
            <Palette size={12} />
            <span>Extracted CMYK Swatches</span>
            {copiedColor && <span className="copied-note">Copied {copiedColor}!</span>}
          </div>
          <div className="swatches-row">
            {[
              { name: "Brand Primary", hex: "#047857", cmyk: "C:86 M:24 Y:78 K:13" },
              { name: "Accent Gold", hex: "#f59e0b", cmyk: "C:0 M:40 Y:96 K:2" },
              { name: "Safety Red", hex: "#dc2626", cmyk: "C:0 M:95 Y:90 K:0" },
              { name: "Rich Neutral", hex: "#0f172a", cmyk: "C:75 M:65 Y:55 K:70" },
            ].map((s) => (
              <div
                key={s.name}
                className="swatch-item"
                onClick={() => handleCopyColor(s.name, s.cmyk)}
                title={`${s.name} (${s.cmyk}) - Click to copy`}
              >
                <div className="swatch-color-chip" style={{ background: s.hex }} />
                <span className="swatch-name">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vector Stats Specs Grid */}
        <div className="preview-specs-grid">
          <div className="spec-tile">
            <span className="spec-k">Color Model</span>
            <span className="spec-v">CMYK FOGRA39</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Curves &amp; Nodes</span>
            <span className="spec-v">48 Curves • 312 Nodes</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Fonts Used</span>
            <span className="spec-v">Inter, Segoe UI</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Corel Version</span>
            <span className="spec-v">CorelDRAW 2024 (v25)</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Photoshop (.psd) Preview Canvas
  if (ext === "psd") {
    return (
      <div className="file-preview-canvas win-psd-preview">
        <div className="preview-canvas-header">
          <div className="preview-canvas-title-group">
            <span className="preview-canvas-badge psd">Photoshop Artboard Canvas</span>
            <span className="preview-canvas-sub">Raster • 300 DPI • RGB 8-bit</span>
          </div>
          <span className="preview-canvas-dimensions">2400 × 3000 px</span>
        </div>

        <div className="preview-viewport-box">
          <div className="psd-canvas-mockup animate-fade-in">
            <div className="psd-layer-background" />
            <div className="psd-artwork-center">
              <div className="psd-art-glow" />
              <div className="psd-art-title">{projectName.toUpperCase()}</div>
              <div className="psd-art-subtitle">{clientName} • {year} MASTER</div>
            </div>
            <div className="psd-badge-overlay">MASTER PSD</div>
          </div>
        </div>

        {/* Layer Stack Breakdown */}
        <div className="preview-canvas-palette-box">
          <div className="palette-label">
            <Layers size={12} />
            <span>Photoshop Layer Hierarchy (5 Layers)</span>
          </div>
          <div className="psd-layer-list">
            <div className="psd-layer-row">
              <span className="layer-type-tag">T</span>
              <span className="layer-name">Headline &amp; Brand Typography</span>
              <span className="layer-state">Normal • 100%</span>
            </div>
            <div className="psd-layer-row">
              <span className="layer-type-tag fx">FX</span>
              <span className="layer-name">Color Grading Curves &amp; LUT</span>
              <span className="layer-state">Soft Light • 80%</span>
            </div>
            <div className="psd-layer-row">
              <span className="layer-type-tag smart">SO</span>
              <span className="layer-name">Smart Object: High-Res Composite</span>
              <span className="layer-state">Normal • 100%</span>
            </div>
            <div className="psd-layer-row">
              <span className="layer-type-tag">BG</span>
              <span className="layer-name">Deep Navy Gradient Fill</span>
              <span className="layer-state">Locked</span>
            </div>
          </div>
        </div>

        <div className="preview-specs-grid">
          <div className="spec-tile">
            <span className="spec-k">Resolution</span>
            <span className="spec-v">300 DPI (Print Ready)</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Color Space</span>
            <span className="spec-v">sRGB IEC61966-2.1</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Bit Depth</span>
            <span className="spec-v">8 Bits / Channel</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Compatibility</span>
            <span className="spec-v">Photoshop 2024 (v25)</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Adobe Illustrator (.ai / .eps) Preview Canvas
  if (ext === "ai" || ext === "eps") {
    return (
      <div className="file-preview-canvas win-ai-preview">
        <div className="preview-canvas-header">
          <div className="preview-canvas-title-group">
            <span className="preview-canvas-badge ai">Illustrator Vector Artwork</span>
            <span className="preview-canvas-sub">Resolution Independent • CMYK</span>
          </div>
          <span className="preview-canvas-dimensions">Artboard 1 • 297 × 420 mm</span>
        </div>

        <div className="preview-viewport-box">
          <div className="ai-artboard-mockup animate-fade-in">
            <div className="ai-artboard-bounds">
              <div className="ai-anchor-point p1" />
              <div className="ai-anchor-point p2" />
              <div className="ai-anchor-point p3" />
              <div className="ai-anchor-point p4" />
              <div className="ai-vector-shapes">
                <svg width="100%" height="100%" viewBox="0 0 200 120">
                  <polygon points="10,110 70,20 130,110" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="2" />
                  <circle cx="130" cy="50" r="35" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
                  <path d="M40 90 Q 90 30 170 80" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeDasharray="4 2" />
                </svg>
              </div>
              <div className="ai-artboard-label">
                <strong>{clientName}</strong> — {projectName}
              </div>
            </div>
          </div>
        </div>

        <div className="preview-canvas-palette-box">
          <div className="palette-label">
            <Palette size={12} />
            <span>Spot &amp; Process Swatches (PANTONE Validated)</span>
          </div>
          <div className="swatches-row">
            <div className="swatch-item">
              <div className="swatch-color-chip" style={{ background: "#ea580c" }} />
              <span className="swatch-name">PANTONE 1505 C</span>
            </div>
            <div className="swatch-item">
              <div className="swatch-color-chip" style={{ background: "#0284c7" }} />
              <span className="swatch-name">PANTONE 2925 C</span>
            </div>
            <div className="swatch-item">
              <div className="swatch-color-chip" style={{ background: "#0f172a" }} />
              <span className="swatch-name">Process Black C</span>
            </div>
          </div>
        </div>

        <div className="preview-specs-grid">
          <div className="spec-tile">
            <span className="spec-k">Color Mode</span>
            <span className="spec-v">CMYK (Coated FOGRA39)</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Artboards</span>
            <span className="spec-v">1 Active Artboard</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Compatibility</span>
            <span className="spec-v">Illustrator CC 2024</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Spot Colors</span>
            <span className="spec-v">2 Pantone Inks</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. PDF Document (.pdf) Preview Canvas
  if (ext === "pdf") {
    return (
      <div className="file-preview-canvas win-pdf-preview">
        <div className="preview-canvas-header">
          <div className="preview-canvas-title-group">
            <span className="preview-canvas-badge pdf">Adobe Acrobat Document</span>
            <span className="preview-canvas-sub">PDF/X-1a Certified • Print Ready</span>
          </div>
          <span className="preview-canvas-dimensions">Page 1 of 4 • US Letter</span>
        </div>

        <div className="preview-viewport-box">
          <div className="pdf-sheet-mockup animate-fade-in">
            <div className="pdf-sheet-header">
              <div className="pdf-red-strip" />
              <div className="pdf-sheet-meta">
                <span className="pdf-doc-title">{projectName}</span>
                <span className="pdf-doc-client">{clientName} • Final Certified Print Release</span>
              </div>
            </div>
            <div className="pdf-sheet-body">
              <div className="pdf-text-para" style={{ width: "95%" }} />
              <div className="pdf-text-para" style={{ width: "88%" }} />
              <div className="pdf-text-para" style={{ width: "70%" }} />
              <div className="pdf-table-block">
                <div className="pdf-table-header-row" />
                <div className="pdf-table-data-row" />
                <div className="pdf-table-data-row" />
              </div>
              <div className="pdf-text-para" style={{ width: "92%" }} />
            </div>
            <div className="pdf-sheet-footer">
              <span>FolderMate Ingestion Pipeline Certified</span>
              <span>Page 1 / 4</span>
            </div>
          </div>
        </div>

        <div className="preview-specs-grid">
          <div className="spec-tile">
            <span className="spec-k">Standard</span>
            <span className="spec-v">PDF/X-1a:2001 (ISO 15930-1)</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Page Count</span>
            <span className="spec-v">4 Pages (Single-Spread)</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Embedded Fonts</span>
            <span className="spec-v">100% Embedded Subsets</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Output Intent</span>
            <span className="spec-v">U.S. Web Coated (SWOP) v2</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Spreadsheet (.xlsx / .csv) Preview Canvas
  if (["xlsx", "xls", "csv"].includes(ext)) {
    return (
      <div className="file-preview-canvas win-excel-preview">
        <div className="preview-canvas-header">
          <div className="preview-canvas-title-group">
            <span className="preview-canvas-badge excel">Microsoft Excel Sheet</span>
            <span className="preview-canvas-sub">Structured Data Table</span>
          </div>
          <span className="preview-canvas-dimensions">Sheet 1 (Active)</span>
        </div>

        <div className="preview-viewport-box">
          <div className="excel-table-mockup animate-fade-in">
            <div className="excel-row header-row">
              <span className="col-cell col-index">#</span>
              <span className="col-cell col-a">A: Client ID</span>
              <span className="col-cell col-b">B: Student / Staff Name</span>
              <span className="col-cell col-c">C: Project Deliverable</span>
              <span className="col-cell col-d">D: Status</span>
            </div>
            <div className="excel-row">
              <span className="col-cell col-index">1</span>
              <span className="col-cell col-a">SCH-8841</span>
              <span className="col-cell col-b">Arjun Sharma</span>
              <span className="col-cell col-c">Student ID Card (v2)</span>
              <span className="col-cell col-d status-verified">Verified</span>
            </div>
            <div className="excel-row">
              <span className="col-cell col-index">2</span>
              <span className="col-cell col-a">SCH-8842</span>
              <span className="col-cell col-b">Priya Patel</span>
              <span className="col-cell col-c">Student ID Card (v2)</span>
              <span className="col-cell col-d status-verified">Verified</span>
            </div>
            <div className="excel-row">
              <span className="col-cell col-index">3</span>
              <span className="col-cell col-a">SCH-8843</span>
              <span className="col-cell col-b">Rahul Verma</span>
              <span className="col-cell col-c">Student ID Card (v2)</span>
              <span className="col-cell col-d status-verified">Verified</span>
            </div>
            <div className="excel-row">
              <span className="col-cell col-index">4</span>
              <span className="col-cell col-a">SCH-8844</span>
              <span className="col-cell col-b">Sneha Gupta</span>
              <span className="col-cell col-c">Student ID Card (v2)</span>
              <span className="col-cell col-d status-verified">Verified</span>
            </div>
          </div>
        </div>

        <div className="preview-specs-grid">
          <div className="spec-tile">
            <span className="spec-k">Format</span>
            <span className="spec-v">Office Open XML (.xlsx)</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Rows &amp; Columns</span>
            <span className="spec-v">48 Rows • 6 Columns</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Formulas</span>
            <span className="spec-v">Clean Data Values</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Encoding</span>
            <span className="spec-v">UTF-8 Unicode</span>
          </div>
        </div>
      </div>
    );
  }

  // 6. Raster Images (.png, .jpg, .webp, .svg)
  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) {
    return (
      <div className="file-preview-canvas win-img-preview">
        <div className="preview-canvas-header">
          <div className="preview-canvas-title-group">
            <span className="preview-canvas-badge img">Raster Graphic Asset</span>
            <span className="preview-canvas-sub">sRGB • Transparent Alpha</span>
          </div>
          <span className="preview-canvas-dimensions">1920 × 1080 px (16:9)</span>
        </div>

        <div className="preview-viewport-box">
          <div className="image-frame-mockup animate-fade-in">
            <div className="image-checkerboard-bg" />
            <div className="image-artwork-content">
              <FileFormatIcon extension={ext} size={54} />
              <div className="image-name-tag">{filename}</div>
            </div>
          </div>
        </div>

        <div className="preview-specs-grid">
          <div className="spec-tile">
            <span className="spec-k">Dimensions</span>
            <span className="spec-v">1920 × 1080 px</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Aspect Ratio</span>
            <span className="spec-v">16:9 Landscape</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">Alpha Channel</span>
            <span className="spec-v">RGBA 32-bit</span>
          </div>
          <div className="spec-tile">
            <span className="spec-k">File Size</span>
            <span className="spec-v">{formattedSize}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default Windows 11 Document Preview
  return (
    <div className="file-preview-canvas win-generic-preview">
      <div className="preview-canvas-header">
        <div className="preview-canvas-title-group">
          <span className="preview-canvas-badge doc">Standard Windows Document</span>
          <span className="preview-canvas-sub">Encapsulated Content</span>
        </div>
        <span className="preview-canvas-dimensions">{formattedSize}</span>
      </div>

      <div className="preview-viewport-box">
        <div className="generic-doc-mockup animate-fade-in">
          <FileFormatIcon extension={ext} size={64} />
          <div className="generic-doc-title">{filename}</div>
          <div className="generic-doc-sub">{clientName} • Version v{versionNumber}</div>
        </div>
      </div>

      <div className="preview-specs-grid">
        <div className="spec-tile">
          <span className="spec-k">File Size</span>
          <span className="spec-v">{formattedSize}</span>
        </div>
        <div className="spec-tile">
          <span className="spec-k">Last Modified</span>
          <span className="spec-v">{modifiedAt}</span>
        </div>
      </div>
    </div>
  );
};
