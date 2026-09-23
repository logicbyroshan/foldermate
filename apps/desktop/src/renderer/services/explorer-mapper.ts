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

  // 2. ROOT / CLIENTS DIRECTORY
  const isRoot =
    currentPath.toLowerCase() === `${driveLetter.toLowerCase()}\\clients` ||
    currentPath.toLowerCase() === "d:\\clients" ||
    currentPath === "root" ||
    currentPath === "Clients" ||
    currentPath === `${driveLetter}\\` ||
    currentPath === driveLetter;

  if (isRoot) {
    const folderEntries: ExplorerFolderEntry[] = rawClients.map((c) =>
      mapRawClientToExplorerFolder(c, rawProjects, rawFiles, driveLetter)
    );

    const rootFileEntries: ExplorerFileEntry[] = rawFiles
      .slice(0, 4)
      .map(mapRawFileToExplorerFile);

    return [...folderEntries, ...rootFileEntries];
  }

  // 3. INBOX FOLDER
  if (currentPath.toLowerCase().includes("inbox")) {
    const inboxFiles: ExplorerFileEntry[] = rawFiles
      .filter((f) => !f.clientId || f.path?.toLowerCase().includes("inbox"))
      .slice(0, 10)
      .map(mapRawFileToExplorerFile);

    return inboxFiles;
  }

  // 4. ARCHIVE FOLDER
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
