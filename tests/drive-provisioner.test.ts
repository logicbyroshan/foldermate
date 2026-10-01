import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { DriveProvisioner } from "../apps/engine/src/organization/drive-provisioner.js";
import { SystemSoftwareDetector } from "../apps/engine/src/integrations/software-detector.js";
import { loadConfig } from "@foldermate/config";

describe("DriveProvisioner & Software Detector Tests", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fm-drive-test-"));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it("should reject C: drive assignment for system protection", async () => {
    const config = loadConfig();
    await expect(
      DriveProvisioner.provisionDrive({
        driveLetter: "C:",
        config,
      })
    ).rejects.toThrow(/Drive C: is your Windows System Volume/);
  });

  it("should detect installed software and file associations", () => {
    const apps = SystemSoftwareDetector.getInstalledSoftware();
    expect(apps.length).toBeGreaterThan(0);
    expect(apps.some((a) => a.id === "coreldraw")).toBe(true);
    expect(apps.some((a) => a.id === "photoshop")).toBe(true);
    expect(apps.some((a) => a.id === "illustrator")).toBe(true);
    expect(apps.some((a) => a.id === "excel")).toBe(true);

    const associations = SystemSoftwareDetector.getFileAssociations();
    expect(associations.length).toBeGreaterThan(0);
    expect(associations.some((a) => a.extension === "cdr")).toBe(true);
    expect(associations.some((a) => a.extension === "psd")).toBe(true);
    expect(associations.some((a) => a.extension === "ai")).toBe(true);
    expect(associations.some((a) => a.extension === "pdf")).toBe(true);
  });

  it("should list available drives", () => {
    const drives = DriveProvisioner.listAvailableDrives();
    expect(drives.length).toBeGreaterThan(0);
    expect(drives.some((d) => d.letter === "C:" && d.isSystem)).toBe(true);
  });
});
