/**
 * FolderMate Data Hook
 * Coordinates data synchronization from the engine IPC service.
 */

import { useState, useEffect, useCallback } from "react";
import { LicenseStatus } from "@foldermate/shared";
import { FolderMateApi, EngineStatusResponse } from "../services/foldermate-api.js";
import { ManagedDrive } from "../types/explorer.js";

const DEFAULT_CONTROLLED_DRIVE: ManagedDrive = {
  letter: "D:",
  label: "Data Storage",
  totalGb: 512,
  freeGb: 341,
  isControlled: true,
  color: "#3b82f6",
  emblem: "hard-drive",
  rootFolder: "D:\\Data Storage",
};

export function useFolderMateData() {
  const [rawFiles, setRawFiles] = useState<any[]>([]);
  const [rawClients, setRawClients] = useState<any[]>([]);
  const [rawProjects, setRawProjects] = useState<any[]>([]);
  const [pendingReviewCount, setPendingReviewCount] = useState<number>(0);
  const [engineConnected, setEngineConnected] = useState<boolean>(true);
  const [engineStatus, setEngineStatus] = useState<EngineStatusResponse>({
    status: "running",
    uptimeSeconds: 14820,
    inboxPath: "C:\\FolderMate\\Inbox",
  });
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(null);

  const [managedDrives, setManagedDrives] = useState<ManagedDrive[]>([
    DEFAULT_CONTROLLED_DRIVE,
    {
      letter: "C:",
      label: "Local Disk",
      totalGb: 256,
      freeGb: 88,
      isControlled: false,
      color: "#64748b",
      emblem: "hard-drive",
      rootFolder: "C:\\FolderMate",
    },
    {
      letter: "E:",
      label: "Work Partition",
      totalGb: 1024,
      freeGb: 780,
      isControlled: false,
      color: "#10b981",
      emblem: "database",
      rootFolder: "E:\\Work Partition",
    },
  ]);

  const [controlledDrive, setControlledDrive] = useState<ManagedDrive>(DEFAULT_CONTROLLED_DRIVE);

  const loadData = useCallback(async () => {
    try {
      const [
        queueItems,
        statusRes,
        filesItems,
        clientsItems,
        projectsItems,
        licRes,
        drivesList,
      ] = await Promise.all([
        FolderMateApi.reviewQueue.list(),
        FolderMateApi.system.getStatus(),
        FolderMateApi.files.list(),
        FolderMateApi.clients.list(),
        FolderMateApi.projects.list(),
        FolderMateApi.system.getLicenseStatus(),
        FolderMateApi.drives.list(),
      ]);

      setPendingReviewCount(queueItems.length);
      setEngineStatus(statusRes);
      setEngineConnected(statusRes.status !== "offline");
      setRawFiles(filesItems);
      setRawClients(clientsItems);
      setRawProjects(projectsItems);
      if (licRes) setLicenseStatus(licRes);

      if (drivesList && drivesList.length > 0) {
        setManagedDrives(drivesList);
        const active = drivesList.find((d) => d.isControlled) || drivesList[0];
        if (active) setControlledDrive(active);
      }
    } catch {
      setEngineConnected(false);
      setEngineStatus({ status: "offline" });
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  return {
    rawFiles,
    setRawFiles,
    rawClients,
    setRawClients,
    rawProjects,
    setRawProjects,
    pendingReviewCount,
    engineConnected,
    engineStatus,
    setEngineStatus,
    licenseStatus,
    setLicenseStatus,
    managedDrives,
    setManagedDrives,
    controlledDrive,
    setControlledDrive,
    loadData,
  };
}
