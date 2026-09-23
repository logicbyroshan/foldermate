import React from "react";

export interface FileFormatIconProps {
  extension?: string;
  size?: number | "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
  isBadgeOverlay?: boolean;
}

export const FileFormatIcon: React.FC<FileFormatIconProps> = ({
  extension = "",
  size = "md",
  className = "",
  style,
  isBadgeOverlay = false,
}) => {
  const ext = (extension || "").toLowerCase().replace(".", "");

  let pixelSize = 20;
  if (typeof size === "number") {
    pixelSize = size;
  } else {
    switch (size) {
      case "sm": pixelSize = 16; break;
      case "md": pixelSize = 22; break;
      case "lg": pixelSize = 44; break;
      case "xl": pixelSize = 64; break;
    }
  }

  // 1. CorelDRAW Official Windows Application Icon (.cdr)
  if (ext === "cdr") {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-cdr ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>CorelDRAW Vector Drawing (.cdr)</title>
        {/* Drop shadow / border for pure white background */}
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#047857" />
        <rect x="2.5" y="2.5" width="27" height="27" rx="5.5" fill="url(#cdr-gradient)" stroke="#10b981" strokeWidth="0.8" />
        
        {/* CorelDRAW Official Diamond-Cut Pencil */}
        <g transform="translate(6, 5) scale(0.65)">
          {/* Pencil body segments */}
          <polygon points="12,2 18,2 24,18 18,18" fill="#10b981" />
          <polygon points="6,2 12,2 18,18 12,18" fill="#34d399" />
          <polygon points="0,2 6,2 12,18 6,18" fill="#059669" />
          {/* Gold ferrule */}
          <polygon points="0,0 24,0 24,3 0,3" fill="#f59e0b" />
          {/* Diamond faceted tip */}
          <polygon points="6,18 18,18 12,28" fill="#047857" />
          <polygon points="12,18 18,18 12,28" fill="#065f46" />
          <polygon points="6,18 12,18 12,28" fill="#34d399" />
          {/* Pencil graphite point highlight */}
          <polygon points="10.5,24 13.5,24 12,28" fill="#ffffff" />
        </g>

        {/* CDR Text Badge at bottom */}
        <rect x="5" y="21" width="22" height="7" rx="2" fill="#064e3b" fillOpacity="0.85" />
        <text
          x="16"
          y="26.8"
          textAnchor="middle"
          fontSize="5.5"
          fontWeight="900"
          fill="#34d399"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="0.6px"
        >
          CDR
        </text>

        <defs>
          <linearGradient id="cdr-gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 2. Adobe Acrobat Official PDF Icon (.pdf)
  if (ext === "pdf") {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-pdf ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>Adobe Acrobat PDF Document (.pdf)</title>
        {/* Document sheet with subtle drop shadow and folded corner */}
        <path
          d="M5 3C5 1.89543 5.89543 1 7 1H20.5L27 7.5V29C27 30.1046 26.1046 31 25 31H7C5.89543 31 5 30.1046 5 29V3Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="1.2"
        />
        {/* Folded Corner */}
        <path d="M20.5 1V7.5H27L20.5 1Z" fill="#dc2626" />
        
        {/* Red App Ribbon Box */}
        <rect x="3" y="10" width="26" height="18" rx="3" fill="url(#pdf-gradient)" />
        
        {/* Official Adobe Acrobat Ribbon Curve */}
        <path
          d="M10 23.5C12 23.5 13.5 21 14.5 18C15 16.5 15.5 14.5 16 13C16.5 14.5 17 16.5 17.5 18C18.5 21 20 23.5 22 23.5C23.5 23.5 24 22.5 24 21.5C24 19.5 20.5 17.5 18 17C16.5 16.8 15.5 16.8 14 17C11.5 17.5 8 19.5 8 21.5C8 22.5 8.5 23.5 10 23.5Z"
          fill="#ffffff"
          fillOpacity="0.95"
        />
        <circle cx="16" cy="14" r="1.5" fill="#ffffff" />
        
        {/* Top PDF text banner */}
        <text
          x="11"
          y="7"
          fontSize="5.5"
          fontWeight="900"
          fill="#dc2626"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="0.4px"
        >
          PDF
        </text>

        <defs>
          <linearGradient id="pdf-gradient" x1="3" y1="10" x2="29" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 3. Adobe Photoshop Official Application Icon (.psd)
  if (ext === "psd") {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-psd ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>Adobe Photoshop Document (.psd)</title>
        {/* Official Photoshop dark navy blue rounded square */}
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#001e36" />
        <rect x="2.5" y="2.5" width="27" height="27" rx="5.5" stroke="#31a8ff" strokeWidth="1.5" />
        {/* Official Ps Typography */}
        <text
          x="16"
          y="21.5"
          textAnchor="middle"
          fontSize="13.5"
          fontWeight="800"
          fill="#31a8ff"
          fontFamily="'Segoe UI', Roboto, Helvetica, sans-serif"
          letterSpacing="-0.5px"
        >
          Ps
        </text>
      </svg>
    );
  }

  // 4. Adobe Illustrator Official Application Icon (.ai)
  if (ext === "ai") {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-ai ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>Adobe Illustrator Artwork (.ai)</title>
        {/* Official Illustrator dark brownish-black rounded square */}
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#260f00" />
        <rect x="2.5" y="2.5" width="27" height="27" rx="5.5" stroke="#ff9a00" strokeWidth="1.5" />
        {/* Official Ai Typography */}
        <text
          x="16"
          y="21.5"
          textAnchor="middle"
          fontSize="13.5"
          fontWeight="800"
          fill="#ff9a00"
          fontFamily="'Segoe UI', Roboto, Helvetica, sans-serif"
          letterSpacing="-0.5px"
        >
          Ai
        </text>
      </svg>
    );
  }

  // 5. Adobe InDesign Official Application Icon (.indd)
  if (ext === "indd") {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-indd ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>Adobe InDesign Document (.indd)</title>
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#2b0012" />
        <rect x="2.5" y="2.5" width="27" height="27" rx="5.5" stroke="#ff3366" strokeWidth="1.5" />
        <text
          x="16"
          y="21.5"
          textAnchor="middle"
          fontSize="13.5"
          fontWeight="800"
          fill="#ff3366"
          fontFamily="'Segoe UI', Roboto, Helvetica, sans-serif"
          letterSpacing="-0.5px"
        >
          Id
        </text>
      </svg>
    );
  }

  // 6. Encapsulated PostScript (.eps)
  if (ext === "eps") {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-eps ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>Encapsulated PostScript Vector (.eps)</title>
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#831843" />
        <rect x="2.5" y="2.5" width="27" height="27" rx="5.5" stroke="#f472b6" strokeWidth="1.2" />
        <text
          x="16"
          y="20.5"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="900"
          fill="#ffffff"
          fontFamily="'Segoe UI', Roboto, sans-serif"
          letterSpacing="0.4px"
        >
          EPS
        </text>
      </svg>
    );
  }

  // 7. Microsoft 365 Excel Official Application Icon (.xlsx, .xls, .csv)
  if (["xlsx", "xls", "csv"].includes(ext)) {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-excel ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>{`Microsoft Excel Sheet (.${ext})`}</title>
        {/* Document Sheet */}
        <path
          d="M6 3C6 1.89543 6.89543 1 8 1H21L27 7V29C27 30.1046 26.1046 31 25 31H8C6.89543 31 6 30.1046 6 29V3Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="1.2"
        />
        {/* Folded Corner */}
        <path d="M21 1V7H27L21 1Z" fill="#107c41" />
        {/* Grid Preview Lines */}
        <rect x="15" y="11" width="9" height="15" rx="1" fill="#e2e8f0" />
        <line x1="15" y1="15" x2="24" y2="15" stroke="#ffffff" strokeWidth="1" />
        <line x1="15" y1="19" x2="24" y2="19" stroke="#ffffff" strokeWidth="1" />
        <line x1="15" y1="23" x2="24" y2="23" stroke="#ffffff" strokeWidth="1" />
        
        {/* Excel Green 'X' App Badge Box */}
        <rect x="3" y="10" width="14" height="16" rx="3" fill="#107c41" />
        <text
          x="10"
          y="22.5"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="#ffffff"
          fontFamily="'Segoe UI', Roboto, sans-serif"
        >
          X
        </text>
      </svg>
    );
  }

  // 8. Microsoft 365 Word Official Application Icon (.docx, .doc, .rtf)
  if (["docx", "doc", "rtf"].includes(ext)) {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-word ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>{`Microsoft Word Document (.${ext})`}</title>
        {/* Document Sheet */}
        <path
          d="M6 3C6 1.89543 6.89543 1 8 1H21L27 7V29C27 30.1046 26.1046 31 25 31H8C6.89543 31 6 30.1046 6 29V3Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="1.2"
        />
        <path d="M21 1V7H27L21 1Z" fill="#185abd" />
        {/* Document Lines */}
        <line x1="15" y1="13" x2="23" y2="13" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="15" y1="17" x2="23" y2="17" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="15" y1="21" x2="21" y2="21" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Word Blue 'W' App Badge Box */}
        <rect x="3" y="10" width="14" height="16" rx="3" fill="#185abd" />
        <text
          x="10"
          y="22.5"
          textAnchor="middle"
          fontSize="10"
          fontWeight="900"
          fill="#ffffff"
          fontFamily="'Segoe UI', Roboto, sans-serif"
        >
          W
        </text>
      </svg>
    );
  }

  // 9. Raster Graphic Images (.png, .jpg, .jpeg, .webp, .svg, .gif)
  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-img ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>{`Image file (.${ext})`}</title>
        {/* Windows 11 Photos Frame */}
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
        <rect x="4.5" y="4.5" width="23" height="23" rx="4" fill="url(#photo-gradient)" />
        {/* Sun */}
        <circle cx="10" cy="11" r="2.5" fill="#fde047" />
        {/* Mountains */}
        <path d="M5 24L12 15L17 21L21 16L27 24H5Z" fill="#ffffff" fillOpacity="0.9" />
        <defs>
          <linearGradient id="photo-gradient" x1="4.5" y1="4.5" x2="27.5" y2="27.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 10. Compressed Archives (.zip, .rar, .7z, .tar, .gz)
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`file-format-icon icon-zip ${className}`}
        style={{ flexShrink: 0, ...style }}
      >
        <title>{`Archive (.${ext})`}</title>
        {/* Folder Back */}
        <path d="M3 7C3 5.89543 3.89543 5 5 5H12L15 8H27C28.1046 8 29 8.89543 29 10V25C29 26.1046 28.1046 27 27 27H5C3.89543 27 3 26.1046 3 25V7Z" fill="#f59e0b" />
        {/* Zipper Teeth */}
        <rect x="14" y="6" width="4" height="2" fill="#334155" />
        <rect x="14" y="10" width="4" height="2" fill="#334155" />
        <rect x="14" y="14" width="4" height="2" fill="#334155" />
        {/* Zipper Puller */}
        <rect x="13" y="18" width="6" height="6" rx="1.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
      </svg>
    );
  }

  // 11. Default Windows 11 Document
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`file-format-icon icon-generic ${className}`}
      style={{ flexShrink: 0, ...style }}
    >
      <title>{`File (.${ext})`}</title>
      <path
        d="M5 3C5 1.89543 5.89543 1 7 1H20.5L27 7.5V29C27 30.1046 26.1046 31 25 31H7C5.89543 31 5 30.1046 5 29V3Z"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1.2"
      />
      <path d="M20.5 1V7.5H27L20.5 1Z" fill="#cbd5e1" />
      <line x1="9" y1="13" x2="23" y2="13" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="17" x2="23" y2="17" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="21" x2="19" y2="21" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      {ext && (
        <text
          x="16"
          y="28"
          textAnchor="middle"
          fontSize="5.5"
          fontWeight="800"
          fill="#64748b"
          fontFamily="'Segoe UI', Roboto, sans-serif"
        >
          {ext.slice(0, 4).toUpperCase()}
        </text>
      )}
    </svg>
  );
};
