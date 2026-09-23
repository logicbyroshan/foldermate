import React from "react";
import { FileFormatIcon } from "./FileFormatIcon.js";
import { ViewMode } from "../../types/explorer.js";

export interface FileThumbnailCardProps {
  name: string;
  ext?: string;
  clientName?: string;
  projectName?: string;
  year?: number;
  versionNumber?: number;
  viewMode: ViewMode;
  isSelected?: boolean;
  className?: string;
}

export const FileThumbnailCard: React.FC<FileThumbnailCardProps> = ({
  name,
  ext = "",
  clientName = "Client",
  projectName = "Design Deliverable",
  year = 2026,
  versionNumber = 1,
  viewMode,
  isSelected = false,
  className = "",
}) => {
  const extension = (ext || name.split(".").pop() || "").toLowerCase().replace(".", "");
  const lowerName = name.toLowerCase();

  const isIdCard = lowerName.includes("id") || lowerName.includes("card") || lowerName.includes("badge");
  const isSignage = lowerName.includes("sign") || lowerName.includes("board") || lowerName.includes("emergency");

  // Determine thumbnail canvas dimensions based on viewMode
  let canvasHeight = 64;
  let badgeSize = 20;

  if (viewMode === "medium-icons") {
    canvasHeight = 56;
    badgeSize = 18;
  } else if (viewMode === "large-icons") {
    canvasHeight = 84;
    badgeSize = 26;
  } else if (viewMode === "extra-large-icons") {
    canvasHeight = 118;
    badgeSize = 34;
  }

  return (
    <div className={`file-thumbnail-surface view-${viewMode} ${className}`}>
      {/* 1. CorelDRAW Thumbnail Artwork */}
      {extension === "cdr" ? (
        <div className="thumb-canvas-box cdr-thumb-bg" style={{ height: canvasHeight }}>
          {isIdCard ? (
            /* Student / Employee ID Card Thumbnail */
            <div className="thumb-id-card-sheet">
              <div className="thumb-id-header">
                <span className="thumb-org-name">{clientName.toUpperCase()}</span>
                <span className="thumb-id-badge-tag">ID</span>
              </div>
              <div className="thumb-id-content">
                <div className="thumb-photo-box">
                  <svg width="60%" height="60%" viewBox="0 0 24 24" fill="#94a3b8">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="thumb-text-lines">
                  <div className="thumb-line bold" style={{ width: "85%" }} />
                  <div className="thumb-line" style={{ width: "95%" }} />
                  <div className="thumb-line" style={{ width: "70%" }} />
                </div>
              </div>
              <div className="thumb-id-footer">
                <div className="thumb-barcode-strip" />
              </div>
            </div>
          ) : isSignage ? (
            /* Emergency Signage Thumbnail */
            <div className="thumb-signage-sheet">
              <div className="thumb-signage-top">⚡ EMERGENCY</div>
              <div className="thumb-signage-arrow">➜</div>
              <div className="thumb-signage-text">{clientName}</div>
            </div>
          ) : (
            /* Brochure / Publication Thumbnail */
            <div className="thumb-brochure-sheet">
              <div className="thumb-brochure-top">{clientName.toUpperCase()}</div>
              <div className="thumb-brochure-title">{projectName}</div>
              <div className="thumb-brochure-banner" />
              <div className="thumb-line" style={{ width: "90%" }} />
              <div className="thumb-line" style={{ width: "75%" }} />
            </div>
          )}

          {/* Official CorelDRAW App Icon Corner Badge */}
          <div className="thumb-corner-app-badge">
            <FileFormatIcon extension="cdr" size={badgeSize} />
          </div>
        </div>
      ) : extension === "pdf" ? (
        /* 2. Adobe Acrobat PDF Document Sheet Thumbnail */
        <div className="thumb-canvas-box pdf-thumb-bg" style={{ height: canvasHeight }}>
          <div className="thumb-pdf-sheet">
            <div className="thumb-pdf-red-header" />
            <div className="thumb-pdf-title">{projectName}</div>
            <div className="thumb-line" style={{ width: "92%" }} />
            <div className="thumb-line" style={{ width: "80%" }} />
            <div className="thumb-line" style={{ width: "88%" }} />
            <div className="thumb-pdf-table">
              <div className="thumb-table-row" />
              <div className="thumb-table-row" />
            </div>
            <div className="thumb-line" style={{ width: "70%" }} />
          </div>

          {/* Official Adobe Acrobat Corner Badge */}
          <div className="thumb-corner-app-badge">
            <FileFormatIcon extension="pdf" size={badgeSize} />
          </div>
        </div>
      ) : extension === "psd" ? (
        /* 3. Adobe Photoshop Canvas Thumbnail */
        <div className="thumb-canvas-box psd-thumb-bg" style={{ height: canvasHeight }}>
          <div className="thumb-psd-sheet">
            <div className="thumb-psd-art-glow" />
            <div className="thumb-psd-title">{projectName}</div>
            <div className="thumb-psd-sub">{clientName}</div>
          </div>

          {/* Official Photoshop Corner Badge */}
          <div className="thumb-corner-app-badge">
            <FileFormatIcon extension="psd" size={badgeSize} />
          </div>
        </div>
      ) : extension === "ai" || extension === "eps" ? (
        /* 4. Adobe Illustrator Vector Canvas Thumbnail */
        <div className="thumb-canvas-box ai-thumb-bg" style={{ height: canvasHeight }}>
          <div className="thumb-ai-sheet">
            <svg width="100%" height="100%" viewBox="0 0 100 60">
              <polygon points="10,55 50,10 90,55" fill="rgba(249, 115, 22, 0.25)" stroke="#ea580c" strokeWidth="1.5" />
              <circle cx="50" cy="30" r="14" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Official Illustrator Corner Badge */}
          <div className="thumb-corner-app-badge">
            <FileFormatIcon extension="ai" size={badgeSize} />
          </div>
        </div>
      ) : ["xlsx", "xls", "csv"].includes(extension) ? (
        /* 5. Microsoft Excel Sheet Thumbnail */
        <div className="thumb-canvas-box excel-thumb-bg" style={{ height: canvasHeight }}>
          <div className="thumb-excel-sheet">
            <div className="thumb-excel-header-row">
              <span className="th-cell">#</span>
              <span className="th-cell">A</span>
              <span className="th-cell">B</span>
              <span className="th-cell">C</span>
            </div>
            <div className="thumb-excel-row">
              <span className="td-cell">1</span>
              <span className="td-cell">{clientName.slice(0, 5)}</span>
              <span className="td-cell">v{versionNumber}</span>
              <span className="td-cell status">OK</span>
            </div>
            <div className="thumb-excel-row">
              <span className="td-cell">2</span>
              <span className="td-cell">SCH</span>
              <span className="td-cell">{year}</span>
              <span className="td-cell status">OK</span>
            </div>
            <div className="thumb-excel-row">
              <span className="td-cell">3</span>
              <span className="td-cell">Data</span>
              <span className="td-cell">Final</span>
              <span className="td-cell status">OK</span>
            </div>
          </div>

          {/* Official Excel Corner Badge */}
          <div className="thumb-corner-app-badge">
            <FileFormatIcon extension="xlsx" size={badgeSize} />
          </div>
        </div>
      ) : ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(extension) ? (
        /* 6. Image Graphic Thumbnail */
        <div className="thumb-canvas-box img-thumb-bg" style={{ height: canvasHeight }}>
          <div className="thumb-img-sheet">
            <div className="thumb-img-checkerboard" />
            <div className="thumb-img-icon-center">
              <FileFormatIcon extension={extension} size={Math.round(canvasHeight * 0.45)} />
            </div>
          </div>

          {/* Official Photos Corner Badge */}
          <div className="thumb-corner-app-badge">
            <FileFormatIcon extension="png" size={badgeSize} />
          </div>
        </div>
      ) : (
        /* 7. Generic Windows Document Thumbnail */
        <div className="thumb-canvas-box generic-thumb-bg" style={{ height: canvasHeight }}>
          <div className="thumb-generic-sheet">
            <FileFormatIcon extension={extension} size={Math.round(canvasHeight * 0.5)} />
          </div>
        </div>
      )}
    </div>
  );
};
