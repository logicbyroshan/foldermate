import React from "react";

export interface FileFormatIconProps {
  extension?: string;
  size?: number | "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
}

export const FileFormatIcon: React.FC<FileFormatIconProps> = ({
  extension = "",
  size = "md",
  className = "",
  style,
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

  // CorelDRAW Vector File (.cdr)
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
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#047857" />
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#059669" />
        <path
          d="M16 6C11.58 6 8 9.58 8 14C8 17.5 10.5 20.5 14 21.5V25H18V21.5C21.5 20.5 24 17.5 24 14C24 9.58 20.42 6 16 6Z"
          fill="#10b981"
          opacity="0.9"
        />
        <circle cx="16" cy="13" r="4.5" fill="#34d399" />
        <path d="M14 25L16 28L18 25H14Z" fill="#a7f3d0" />
        <text
          x="16"
          y="20"
          textAnchor="middle"
          fontSize="7"
          fontWeight="900"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.4px"
        >
          CDR
        </text>
      </svg>
    );
  }

  // Adobe Photoshop (.psd)
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
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#03254c" />
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#001e36" stroke="#31a8ff" strokeWidth="1.5" />
        <text
          x="16"
          y="21"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#31a8ff"
          fontFamily="'Segoe UI', Roboto, sans-serif"
          letterSpacing="-0.5px"
        >
          Ps
        </text>
      </svg>
    );
  }

  // Adobe Illustrator (.ai)
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
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#331400" />
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#260f00" stroke="#ff9a00" strokeWidth="1.5" />
        <text
          x="16"
          y="21"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#ff9a00"
          fontFamily="'Segoe UI', Roboto, sans-serif"
          letterSpacing="-0.5px"
        >
          Ai
        </text>
      </svg>
    );
  }

  // Adobe InDesign (.indd)
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
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#49021f" />
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#2b0012" stroke="#ff3366" strokeWidth="1.5" />
        <text
          x="16"
          y="21"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#ff3366"
          fontFamily="'Segoe UI', Roboto, sans-serif"
          letterSpacing="-0.5px"
        >
          Id
        </text>
      </svg>
    );
  }

  // Adobe Acrobat PDF (.pdf)
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
        <title>Portable Document Format (.pdf)</title>
        <path d="M5 4C5 2.89543 5.89543 2 7 2H20L27 9V28C27 29.1046 26.1046 30 25 30H7C5.89543 30 5 29.1046 5 28V4Z" fill="#dc2626" />
        <path d="M20 2V9H27L20 2Z" fill="#b91c1c" />
        <rect x="3" y="16" width="26" height="11" rx="3" fill="#ffffff" />
        <text
          x="16"
          y="24.5"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="900"
          fill="#dc2626"
          fontFamily="'Segoe UI', Roboto, sans-serif"
          letterSpacing="0.5px"
        >
          PDF
        </text>
      </svg>
    );
  }

  // Encapsulated PostScript (.eps)
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
        <title>Encapsulated PostScript (.eps)</title>
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#be185d" />
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#9d174d" stroke="#f472b6" strokeWidth="1" />
        <text
          x="16"
          y="20.5"
          textAnchor="middle"
          fontSize="9"
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

  // Raster Images (.png, .jpg, .jpeg, .webp, .svg)
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
        <path d="M5 4C5 2.89543 5.89543 2 7 2H20L27 9V28C27 29.1046 26.1046 30 25 30H7C5.89543 30 5 29.1046 5 28V4Z" fill="#0284c7" />
        <path d="M20 2V9H27L20 2Z" fill="#0369a1" />
        <circle cx="11" cy="14" r="2.5" fill="#fef08a" />
        <path d="M8 25L14 18L18 22L20 20L24 25H8Z" fill="#bae6fd" />
        <text
          x="16"
          y="28"
          textAnchor="middle"
          fontSize="6"
          fontWeight="800"
          fill="#ffffff"
          fontFamily="'Segoe UI', Roboto, sans-serif"
        >
          {ext.toUpperCase()}
        </text>
      </svg>
    );
  }

  // Spreadsheets (.xlsx, .xls, .csv)
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
        <title>{`Spreadsheet file (.${ext})`}</title>
        <path d="M5 4C5 2.89543 5.89543 2 7 2H20L27 9V28C27 29.1046 26.1046 30 25 30H7C5.89543 30 5 29.1046 5 28V4Z" fill="#15803d" />
        <path d="M20 2V9H27L20 2Z" fill="#166534" />
        <rect x="3" y="16" width="26" height="11" rx="3" fill="#ffffff" />
        <text
          x="16"
          y="24.5"
          textAnchor="middle"
          fontSize="8"
          fontWeight="900"
          fill="#15803d"
          fontFamily="'Segoe UI', Roboto, sans-serif"
        >
          XLSX
        </text>
      </svg>
    );
  }

  // Word Documents (.docx, .doc)
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
        <title>{`Word document (.${ext})`}</title>
        <path d="M5 4C5 2.89543 5.89543 2 7 2H20L27 9V28C27 29.1046 26.1046 30 25 30H7C5.89543 30 5 29.1046 5 28V4Z" fill="#1d4ed8" />
        <path d="M20 2V9H27L20 2Z" fill="#1e40af" />
        <rect x="3" y="16" width="26" height="11" rx="3" fill="#ffffff" />
        <text
          x="16"
          y="24.5"
          textAnchor="middle"
          fontSize="8"
          fontWeight="900"
          fill="#1d4ed8"
          fontFamily="'Segoe UI', Roboto, sans-serif"
        >
          DOCX
        </text>
      </svg>
    );
  }

  // Compressed Archives (.zip, .rar, .7z, .tar, .gz)
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
        <path d="M5 4C5 2.89543 5.89543 2 7 2H20L27 9V28C27 29.1046 26.1046 30 25 30H7C5.89543 30 5 29.1046 5 28V4Z" fill="#7c3aed" />
        <path d="M20 2V9H27L20 2Z" fill="#6d28d9" />
        <rect x="14" y="6" width="4" height="2" fill="#ede9fe" />
        <rect x="14" y="10" width="4" height="2" fill="#ede9fe" />
        <rect x="14" y="14" width="4" height="2" fill="#ede9fe" />
        <rect x="13" y="18" width="6" height="6" rx="1.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
      </svg>
    );
  }

  // Default Windows 11 Document
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
      <path d="M5 4C5 2.89543 5.89543 2 7 2H20L27 9V28C27 29.1046 26.1046 30 25 30H7C5.89543 30 5 29.1046 5 28V4Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M20 2V9H27L20 2Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="9" y1="14" x2="23" y2="14" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="18" x2="23" y2="18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="22" x2="18" y2="22" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      {ext && (
        <text
          x="16"
          y="28"
          textAnchor="middle"
          fontSize="6"
          fontWeight="700"
          fill="#64748b"
          fontFamily="'Segoe UI', Roboto, sans-serif"
        >
          {ext.slice(0, 4).toUpperCase()}
        </text>
      )}
    </svg>
  );
};
