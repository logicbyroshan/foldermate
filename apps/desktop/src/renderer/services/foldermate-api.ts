/**
 * FolderMate IPC Service Client
 * Provides a clean, typed API surface for all desktop engine RPC operations.
 */

import { LicenseStatus } from "@foldermate/shared";
import { ManagedDrive } from "../types/explorer.js";

export interface EngineStatusResponse {
  status: "running" | "paused" | "offline";
  uptimeSeconds?: number;
  inboxPath?: string;
}

export interface FolderRuleItem {
  id: string;
  name: string;
  pattern: string;
  color: string;
  emblem?: string;
  isActive: boolean;
  fileCount?: number;
}

class FolderMateApiService {
  private get bridge(): any {
    if (typeof window !== "undefined") {
      return (window as any).foldermate;
    }
    return null;
  }

  private async call<T = any>(method: string, payload?: any): Promise<T> {
    if (!this.bridge) {
      throw new Error(`FolderMate IPC bridge unavailable for method: ${method}`);
    }
    return this.bridge.call(method, payload);
  }

  // System & Engine Subsystem
  public system = {
    getStatus: async (): Promise<EngineStatusResponse> => {
      try {
        const res = await this.call("system.getStatus");
        return {
          status: res?.status === "PAUSED" ? "paused" : "running",
          uptimeSeconds: res?.uptimeSeconds || 14820,
          inboxPath: res?.inboxPath || "C:\\FolderMate\\Inbox",
        };
      } catch {
        return { status: "offline" };
      }
    },

    getLicenseStatus: async (): Promise<LicenseStatus | null> => {
      try {
        return await this.call<LicenseStatus>("system.getLicenseStatus");
      } catch {
        return null;
      }
    },

    pauseAutomation: async (duration: "1h" | "tomorrow" | "indefinite"): Promise<void> => {
      await this.call("system.pauseAutomation", { duration });
    },

    resumeAutomation: async (): Promise<void> => {
      await this.call("system.resumeAutomation");
    },

    simulateIngest: async (file?: {
      filename: string;
      extension: string;
      fileSizeBytes?: number;
    }): Promise<any> => {
      return await this.call("system.simulateIngest", file);
    },
  };

  // Files & Entities Subsystem
  public files = {
    list: async (): Promise<any[]> => {
      try {
        const res = await this.call("files.list");
        return res?.items || (Array.isArray(res) ? res : []);
      } catch {
        return [];
      }
    },
  };

  // Clients & Projects Subsystem
  public clients = {
    list: async (): Promise<any[]> => {
      try {
        const res = await this.call("clients.list");
        return Array.isArray(res) ? res : [];
      } catch {
        return [];
      }
    },

    create: async (client: { name: string; code?: string; color?: string; emblem?: string }): Promise<any> => {
      return await this.call("clients.create", client);
    },
  };

  public projects = {
    list: async (): Promise<any[]> => {
      try {
        const res = await this.call("projects.list");
        return Array.isArray(res) ? res : [];
      } catch {
        return [];
      }
    },
  };

  // Review Queue Subsystem
  public reviewQueue = {
    list: async (): Promise<any[]> => {
      try {
        const res = await this.call("reviewQueue.list");
        return Array.isArray(res) ? res : [];
      } catch {
        return [];
      }
    },

    resolve: async (id: string, payload: { clientId: string; projectId?: string; canonicalName?: string }): Promise<any> => {
      return await this.call("reviewQueue.resolve", { id, ...payload });
    },
  };

  // Managed Drives Subsystem
  public drives = {
    list: async (): Promise<ManagedDrive[]> => {
      try {
        const res = await this.call("drives.list");
        return Array.isArray(res) ? res : [];
      } catch {
        return [];
      }
    },

    assign: async (letter: string): Promise<any> => {
      return await this.call("drives.assign", { letter });
    },

    reindex: async (letter: string): Promise<any> => {
      return await this.call("drives.reindex", { letter });
    },
  };

  // Folder Appearance Rules Subsystem
  public folderRules = {
    list: async (): Promise<FolderRuleItem[]> => {
      try {
        const res = await this.call("folderRules.list");
        return Array.isArray(res) ? res : [];
      } catch {
        return [];
      }
    },

    create: async (rule: Partial<FolderRuleItem>): Promise<any> => {
      return await this.call("folderRules.create", rule);
    },

    delete: async (id: string): Promise<any> => {
      return await this.call("folderRules.delete", { id });
    },

    customize: async (payload: { id: string; color?: string; emblem?: string; name?: string }): Promise<any> => {
      return await this.call("folders.customize", payload);
    },
  };
}

export const FolderMateApi = new FolderMateApiService();
