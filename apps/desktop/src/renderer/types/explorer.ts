/**
 * Explorer Domain Types
 * Canonical definitions for file explorer navigation, tabs, entries, and drives.
 */

export type NavView =
  | "home"
  | "explorer"
  | "search"
  | "review"
  | "automation"
  | "rules"
  | "shortcuts"
  | "privacy"
  | "settings";


export type ViewMode =
  | "details"
  | "list"
  | "small-icons"
  | "medium-icons"
  | "large-icons"
  | "extra-large-icons";

export interface ExplorerFolderEntry {
  id: string;
  name: string;
  type: "folder";
  color?: string;
  emblem?: string;
  clientCode?: string;
  projectCount?: number;
  fileCount?: number;
  totalSize?: string;
  modifiedAt?: string;
  folderPath?: string;
}

export interface ExplorerFileEntry {
  id: string;
  name: string;
  type: "file";
  ext: string;
  extColor: string;
  extBg: string;
  clientName?: string;
  projectName?: string;
  year?: number;
  versionNumber?: number;
  sizeBytes?: number;
  formattedSize?: string;
  modifiedAt?: string;
  targetPath?: string;
  sha256?: string;
  lineage?: {
    versionNumber: number;
    filename: string;
    createdAt: string;
    isCurrent: boolean;
  }[];
}

export type ExplorerEntry = ExplorerFolderEntry | ExplorerFileEntry;

export interface BreadcrumbItem {
  id: string;
  label: string;
  type: "root" | "drive" | "client" | "folder";
}

export interface ExplorerTab {
  id: string;
  title: string;
  path: string;
  view: NavView;
}

export interface ManagedDrive {
  letter: string;
  label: string;
  totalGb: number;
  freeGb: number;
  isControlled: boolean;
  color?: string;
  emblem?: string;
  rootFolder?: string;
}
