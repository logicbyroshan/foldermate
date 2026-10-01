/**
 * Explorer Domain Mapping Service
 * Pure functions converting raw database records into UI Explorer entries.
 */

import {
  ExplorerEntry,
  ExplorerFileEntry,
  ExplorerFolderEntry,
  ManagedDrive,
} from "../types/explorer.js";
import { formatFileSize, getExtBadgeColors } from "../utils/formatters.js";

export interface ExplorerMappingParams {
  currentPath: string;
  searchQuery: string;
  rawFiles: any[];
  rawClients: any[];
  rawProjects: any[];
  controlledDrive: ManagedDrive;
}

export function mapRawFileToExplorerFile(f: any): ExplorerFileEntry {
  const { extColor, extBg } = getExtBadgeColors(f.extension);
  const size = f.fileSizeBytes || f.sizeBytes || 24600000;

  return {
    id: f.id,
    name: f.filename,
    type: "file",
    ext: f.extension,
    extColor,
    extBg,
    clientName: f.clientName,
    projectName: f.projectName,
    year: f.year,
    versionNumber: f.version,
    sizeBytes: size,
    formattedSize: formatFileSize(size),
    modifiedAt: "Today, 12:45 PM",
    targetPath: f.path,
    sha256: f.sha256Hash,
    lineage: f.versionChain?.map((v: any) => ({
      versionNumber: v.version,
      filename: v.name,
      createdAt: v.date,
      isCurrent: Boolean(v.isCurrent),
    })),
  };
}

export function mapRawClientToExplorerFolder(
  c: any,
  rawProjects: any[],
  rawFiles: any[],
  controlledDriveLetter: string
): ExplorerFolderEntry {
  return {
    id: c.id,
    name: c.name,
    type: "folder",
    color: c.color || "#f59e0b",
    emblem: c.emblem || "client",
    clientCode: c.code,
    projectCount: rawProjects.filter((p) => p.clientId === c.id).length,
    fileCount: rawFiles.filter((f) => f.clientId === c.id).length,
    modifiedAt: "Today, 12:45 PM",
    folderPath: `${controlledDriveLetter}\\Clients\\${c.name}`,
  };
}

export function mapToRecentFiles(rawFiles: any[], limit = 10): ExplorerFileEntry[] {
  return rawFiles.slice(0, limit).map(mapRawFileToExplorerFile);
}

export function mapToExplorerEntries(params: ExplorerMappingParams): ExplorerEntry[] {
  const { currentPath, searchQuery, rawFiles, rawClients, rawProjects, controlledDrive } = params;
  const driveLetter = controlledDrive.letter;

  // 1. GLOBAL SEARCH OVERRIDE: Search across ALL files and clients
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    const matchingFiles: ExplorerFileEntry[] = rawFiles
      .filter(
        (f) =>
          f.filename?.toLowerCase().includes(q) ||
          f.originalName?.toLowerCase().includes(q) ||
          f.clientName?.toLowerCase().includes(q) ||
          f.projectName?.toLowerCase().includes(q) ||
          f.category?.toLowerCase().includes(q) ||
          f.extension?.toLowerCase().includes(q) ||
          String(f.year || "").includes(q) ||
          `v${f.version || ""}`.toLowerCase().includes(q) ||
          f.path?.toLowerCase().includes(q)
      )
      .map(mapRawFileToExplorerFile);

    const matchingClientFolders: ExplorerFolderEntry[] = rawClients
      .filter((c) => c.name.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q))
      .map((c) => mapRawClientToExplorerFolder(c, rawProjects, rawFiles, driveLetter));

    return [...matchingClientFolders, ...matchingFiles];
  }

  // 2. DRIVE ROOT DIRECTORY (e.g. D:\ or D:)
  const isDriveRoot =
    currentPath.toLowerCase() === driveLetter.toLowerCase() ||
    currentPath.toLowerCase() === `${driveLetter.toLowerCase()}\\` ||
    currentPath.toLowerCase() === "d:" ||
    currentPath.toLowerCase() === "d:\\";

  if (isDriveRoot) {
    const rootStandardFolders: ExplorerFolderEntry[] = [
      {
        id: "dir-inbox",
        name: "Inbox",
        type: "folder",
        color: "#f59e0b",
        emblem: "inbox",
        fileCount: rawFiles.filter((f) => !f.clientId || f.path?.toLowerCase().includes("inbox")).length,
        modifiedAt: "Just now",
        folderPath: `${driveLetter}\\Inbox`,
      },
      {
        id: "dir-clients",
        name: "Clients",
        type: "folder",
        color: "#3b82f6",
        emblem: "client",
        fileCount: rawFiles.filter((f) => Boolean(f.clientId)).length,
        projectCount: rawClients.length,
        modifiedAt: "Today, 12:45 PM",
        folderPath: `${driveLetter}\\Clients`,
      },
      {
        id: "dir-review",
        name: "Review",
        type: "folder",
        color: "#d97706",
        emblem: "shield",
        fileCount: 2,
        modifiedAt: "5 mins ago",
        folderPath: `${driveLetter}\\Review`,
      },
      {
        id: "dir-archive",
        name: "Archive",
        type: "folder",
        color: "#0284c7",
        emblem: "archive",
        fileCount: 6,
        modifiedAt: "Yesterday",
        folderPath: `${driveLetter}\\Archive`,
      },
      {
        id: "dir-old",
        name: "Old",
        type: "folder",
        color: "#64748b",
        emblem: "backup",
        fileCount: 12,
        modifiedAt: "Pre-FolderMate Migration",
        folderPath: `${driveLetter}\\Old`,
      },
    ];

    return rootStandardFolders;
  }

  // 3. CLIENTS DIRECTORY (e.g. D:\Clients)
  const isClientsRoot =
    currentPath.toLowerCase() === `${driveLetter.toLowerCase()}\\clients` ||
    currentPath.toLowerCase() === "d:\\clients" ||
    currentPath === "root" ||
    currentPath === "Clients";

  if (isClientsRoot) {
    const folderEntries: ExplorerFolderEntry[] = rawClients.map((c) =>
      mapRawClientToExplorerFolder(c, rawProjects, rawFiles, driveLetter)
    );

    const rootFileEntries: ExplorerFileEntry[] = rawFiles
      .slice(0, 4)
      .map(mapRawFileToExplorerFile);

    return [...folderEntries, ...rootFileEntries];
  }

  // 4. INBOX FOLDER
  if (currentPath.toLowerCase().includes("inbox")) {
    const inboxFiles: ExplorerFileEntry[] = rawFiles
      .filter((f) => !f.clientId || f.path?.toLowerCase().includes("inbox"))
      .slice(0, 10)
      .map(mapRawFileToExplorerFile);

    return inboxFiles;
  }

  // 5. ARCHIVE FOLDER
  if (currentPath.toLowerCase().includes("archive")) {
    const archiveFolders: ExplorerFolderEntry[] = rawClients.map((c) => ({
      id: `arch-${c.id}`,
      name: `${c.name} (Archive)`,
      type: "folder",
      color: "#94a3b8",
      emblem: "archive",
      clientCode: c.code,
      projectCount: 2,
      fileCount: 4,
      modifiedAt: "Yesterday, 4:10 PM",
      folderPath: `${driveLetter}\\Archive\\${c.name}`,
    }));

    const archiveFiles: ExplorerFileEntry[] = rawFiles.slice(2, 6).map(mapRawFileToExplorerFile);

    return [...archiveFolders, ...archiveFiles];
  }

  // 6. OLD FOLDER (Pre-existing files moved safely)
  if (currentPath.toLowerCase().includes("old") || currentPath.toLowerCase().includes("legacy")) {
    const oldFolders: ExplorerFolderEntry[] = [
      {
        id: "old-1",
        name: "Legacy Documents & Backups",
        type: "folder",
        color: "#64748b",
        emblem: "backup",
        fileCount: 8,
        modifiedAt: "Migrated on Drive Setup",
        folderPath: `${driveLetter}\\Old\\Legacy Documents & Backups`,
      },
      {
        id: "old-2",
        name: "Pre-2025 Graphic Archives",
        type: "folder",
        color: "#64748b",
        emblem: "archive",
        fileCount: 14,
        modifiedAt: "Migrated on Drive Setup",
        folderPath: `${driveLetter}\\Old\\Pre-2025 Graphic Archives`,
      },
    ];

    const oldFiles: ExplorerFileEntry[] = [
      {
        id: "old-f1",
        name: "Old Staff Directory 2024.xlsx",
        type: "file",
        ext: "xlsx",
        extColor: "#107c41",
        extBg: "rgba(16, 124, 65, 0.1)",
        sizeBytes: 1240000,
        formattedSize: "1.2 MB",
        modifiedAt: "Oct 14, 2024",
        targetPath: `${driveLetter}\\Old\\Old Staff Directory 2024.xlsx`,
      },
      {
        id: "old-f2",
        name: "Unsorted Designs 2023.zip",
        type: "file",
        ext: "zip",
        extColor: "#f59e0b",
        extBg: "rgba(245, 158, 11, 0.1)",
        sizeBytes: 84500000,
        formattedSize: "84.5 MB",
        modifiedAt: "Aug 20, 2023",
        targetPath: `${driveLetter}\\Old\\Unsorted Designs 2023.zip`,
      },
    ];

    return [...oldFolders, ...oldFiles];
  }

  // 5. CLIENT SUBFOLDER: e.g. D:\Clients\Apex Healthcare\2026\AI - Illustrator Artwork
  const pathParts = currentPath.split("\\").filter(Boolean);
  const matchedClient = rawClients.find((c) =>
    pathParts.some((part) => part.toLowerCase() === c.name.toLowerCase())
  );

  if (matchedClient) {
    const isFileTypeSubfolder = pathParts.some((p) =>
      p.toLowerCase().includes("artwork") ||
      p.toLowerCase().includes("designs") ||
      p.toLowerCase().includes("deliverables") ||
      p.toLowerCase().includes("documents") ||
      p.toLowerCase().includes("spreadsheets") ||
      p.toLowerCase().includes("assets")
    );

    const clientFiles = rawFiles.filter((f) => f.clientId === matchedClient.id);

    if (isFileTypeSubfolder) {
      const activeTypePart = pathParts[pathParts.length - 1].toLowerCase();
      const filteredByType = clientFiles.filter((f) => {
        const ext = (f.extension || "").toLowerCase().replace(".", "");
        if (activeTypePart.includes("illustrator") || activeTypePart.includes("ai")) {
          return ext === "ai" || ext === "eps";
        }
        if (activeTypePart.includes("coreldraw") || activeTypePart.includes("cdr")) {
          return ext === "cdr";
        }
        if (activeTypePart.includes("photoshop") || activeTypePart.includes("psd")) {
          return ext === "psd";
        }
        if (activeTypePart.includes("deliverables") || activeTypePart.includes("pdf")) {
          return ext === "pdf";
        }
        if (activeTypePart.includes("spreadsheets")) {
          return ext === "xlsx" || ext === "xls" || ext === "csv";
        }
        if (activeTypePart.includes("assets") || activeTypePart.includes("images")) {
          return ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp";
        }
        return true;
      });

      return filteredByType.length > 0
        ? filteredByType.map(mapRawFileToExplorerFile)
        : clientFiles.slice(0, 2).map(mapRawFileToExplorerFile);
    }

    // Inside Client root: render subfolders divided by year & file type
    const fileTypeConfigs = [
      { typeLabel: "CDR - CorelDRAW Designs", folderColor: "#f59e0b", ext: "cdr" },
      { typeLabel: "AI - Illustrator Artwork", folderColor: "#f97316", ext: "ai" },
      { typeLabel: "PSD - Photoshop Documents", folderColor: "#3b82f6", ext: "psd" },
      { typeLabel: "PDF - Deliverables", folderColor: "#ef4444", ext: "pdf" },
      { typeLabel: "Spreadsheets & Data", folderColor: "#10b981", ext: "xlsx" },
      { typeLabel: "Images & Assets", folderColor: "#06b6d4", ext: "png" },
    ];

    const fileTypeFolders: ExplorerFolderEntry[] = fileTypeConfigs.map(
      ({ typeLabel, folderColor, ext }, idx) => {
        const matchingCount = clientFiles.filter((f) => {
          const e = (f.extension || "").toLowerCase().replace(".", "");
          if (ext === "ai") return e === "ai" || e === "eps";
          if (ext === "xlsx") return e === "xlsx" || e === "xls" || e === "csv";
          if (ext === "png") return e === "png" || e === "jpg" || e === "jpeg";
          return e === ext;
        }).length;

        return {
          id: `ft-${matchedClient.id}-${idx}`,
          name: `2026 \\ ${typeLabel}`,
          type: "folder",
          color: folderColor,
          emblem: "folder",
          projectCount: 1,
          fileCount: matchingCount || 1,
          modifiedAt: "Today, 12:45 PM",
          folderPath: `${driveLetter}\\Clients\\${matchedClient.name}\\2026\\${typeLabel}`,
        };
      }
    );

    const directClientFiles: ExplorerFileEntry[] = clientFiles.map(mapRawFileToExplorerFile);

    return [...fileTypeFolders, ...directClientFiles];
  }

  return [];
}
