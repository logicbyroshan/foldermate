/**
 * Browser Mock Bridge for FolderMate
 * Provides an interactive in-memory RPC mock when running in a standalone browser dev server.
 */

export function setupBrowserMockBridge() {
  if (typeof window === "undefined" || (window as any).foldermate) {
    return;
  }

  let clients = [
    {
      id: "client-1",
      name: "ABC School",
      code: "ABCSCH",
      aliases: ["ABC", "ABCS", "ABC SCHOOL", "ABC HIGH"],
      color: "Amber",
      folderPath: "D:\\Clients\\ABC School",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "client-2",
      name: "Apex Healthcare",
      code: "APEXHC",
      aliases: ["APEX", "APEX HOSPITAL", "APEX HEALTH"],
      color: "Blue",
      folderPath: "D:\\Clients\\Apex Healthcare",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "client-3",
      name: "Zenith Corp",
      code: "ZENITH",
      aliases: ["ZENITH CORP", "ZENITH TECH"],
      color: "Purple",
      emblem: "briefcase",
      folderPath: "D:\\Clients\\Zenith Corp",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  let drives = [
    {
      letter: "D:",
      label: "Data Storage",
      totalGb: 512,
      freeGb: 341,
      isControlled: true,
      color: "#3b82f6",
      emblem: "hard-drive",
      rootFolder: "D:\\Data Storage",
    },
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
  ];

  let projects = [
    {
      id: "proj-1",
      clientId: "client-1",
      name: "Student ID Card",
      category: "ID Card",
      year: 2026,
      subfolderPath: "2026\\ID Card",
    },
    {
      id: "proj-2",
      clientId: "client-1",
      name: "Annual Magazine",
      category: "Publication",
      year: 2026,
      subfolderPath: "2026\\Publication",
    },
    {
      id: "proj-3",
      clientId: "client-1",
      name: "Admission Brochure",
      category: "Marketing",
      year: 2025,
      subfolderPath: "2025\\Marketing",
    },
    {
      id: "proj-4",
      clientId: "client-2",
      name: "Staff Identity Card",
      category: "ID Card",
      year: 2026,
      subfolderPath: "2026\\ID Card",
    },
    {
      id: "proj-5",
      clientId: "client-2",
      name: "Hospital Signage & Banner",
      category: "Signage",
      year: 2026,
      subfolderPath: "2026\\Signage",
    },
    {
      id: "proj-6",
      clientId: "client-3",
      name: "Corporate Lanyard",
      category: "Merchandise",
      year: 2025,
      subfolderPath: "2025\\Merchandise",
    },
  ];

  let files = [
    {
      id: "file-1",
      clientId: "client-1",
      projectId: "proj-1",
      filename: "ABC School ID Card 2026 v8.cdr",
      originalName: "abc school id card 2026 v8.cdr",
      currentName: "ABC School ID Card 2026 v8.cdr",
      path: "D:\\Clients\\ABC School\\2026\\CDR - CorelDRAW Designs\\ID Card\\ABC School ID Card 2026 v8.cdr",
      currentPath: "D:\\Clients\\ABC School\\2026\\CDR - CorelDRAW Designs\\ID Card\\ABC School ID Card 2026 v8.cdr",
      extension: "cdr",
      fileSizeBytes: 24580000,
      sizeBytes: 24580000,
      version: 8,
      versionNumber: 8,
      status: "ORGANIZED",
      classificationConfidence: 0.98,
      clientName: "ABC School",
      projectName: "Student ID Card",
      category: "ID Card",
      categoryName: "ID Card",
      year: 2026,
      sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      versionChain: [
        { version: 8, name: "ABC School ID Card 2026 v8.cdr", date: "Today, 12:45 PM", isCurrent: true },
        { version: 7, name: "ABC School ID Card 2026 v7.cdr", date: "Yesterday, 4:20 PM" },
        { version: 6, name: "ABC School ID Card 2026 v6.cdr", date: "Sep 10, 2026" },
        { version: 5, name: "ABC School ID Card 2026 v5.cdr", date: "Sep 08, 2026" },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "file-2",
      clientId: "client-2",
      projectId: "proj-4",
      filename: "Apex Healthcare Staff ID Card 2026 v3.pdf",
      originalName: "apex staff id card 2026 v3.pdf",
      currentName: "Apex Healthcare Staff ID Card 2026 v3.pdf",
      path: "D:\\Clients\\Apex Healthcare\\2026\\PDF - Deliverables\\ID Card\\Apex Healthcare Staff ID Card 2026 v3.pdf",
      currentPath: "D:\\Clients\\Apex Healthcare\\2026\\PDF - Deliverables\\ID Card\\Apex Healthcare Staff ID Card 2026 v3.pdf",
      extension: "pdf",
      fileSizeBytes: 4200000,
      sizeBytes: 4200000,
      version: 3,
      versionNumber: 3,
      status: "ORGANIZED",
      classificationConfidence: 0.96,
      clientName: "Apex Healthcare",
      projectName: "Staff Identity Card",
      category: "ID Card",
      categoryName: "ID Card",
      year: 2026,
      sha256Hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      versionChain: [
        { version: 3, name: "Apex Healthcare Staff ID Card 2026 v3.pdf", date: "Today, 11:15 AM", isCurrent: true },
        { version: 2, name: "Apex Healthcare Staff ID Card 2026 v2.pdf", date: "Sep 11, 2026" },
        { version: 1, name: "Apex Healthcare Staff ID Card 2026 v1.pdf", date: "Sep 09, 2026" },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "file-3",
      clientId: "client-3",
      projectId: "proj-6",
      filename: "Zenith Corp Corporate Lanyard 2025 v1.cdr",
      originalName: "zenith lanyard design 2025 v1.cdr",
      currentName: "Zenith Corp Corporate Lanyard 2025 v1.cdr",
      path: "D:\\Clients\\Zenith Corp\\2025\\CDR - CorelDRAW Designs\\Merchandise\\Zenith Corp Corporate Lanyard 2025 v1.cdr",
      currentPath: "D:\\Clients\\Zenith Corp\\2025\\CDR - CorelDRAW Designs\\Merchandise\\Zenith Corp Corporate Lanyard 2025 v1.cdr",
      extension: "cdr",
      fileSizeBytes: 18900000,
      sizeBytes: 18900000,
      version: 1,
      versionNumber: 1,
      status: "ORGANIZED",
      classificationConfidence: 0.92,
      clientName: "Zenith Corp",
      projectName: "Corporate Lanyard",
      category: "Merchandise",
      categoryName: "Merchandise",
      year: 2025,
      sha256Hash: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
      versionChain: [
        { version: 1, name: "Zenith Corp Corporate Lanyard 2025 v1.cdr", date: "Aug 28, 2025", isCurrent: true },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "file-4",
      clientId: "client-1",
      projectId: "proj-2",
      filename: "ABC School Annual Magazine 2026 v2.pdf",
      originalName: "abc magazine final print 2026 v2.pdf",
      currentName: "ABC School Annual Magazine 2026 v2.pdf",
      path: "D:\\Clients\\ABC School\\2026\\PDF - Deliverables\\Publication\\ABC School Annual Magazine 2026 v2.pdf",
      currentPath: "D:\\Clients\\ABC School\\2026\\PDF - Deliverables\\Publication\\ABC School Annual Magazine 2026 v2.pdf",
      extension: "pdf",
      fileSizeBytes: 84100000,
      sizeBytes: 84100000,
      version: 2,
      versionNumber: 2,
      status: "ORGANIZED",
      classificationConfidence: 0.95,
      clientName: "ABC School",
      projectName: "Annual Magazine",
      category: "Publication",
      categoryName: "Publication",
      year: 2026,
      sha256Hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      versionChain: [
        { version: 2, name: "ABC School Annual Magazine 2026 v2.pdf", date: "Sep 05, 2026", isCurrent: true },
        { version: 1, name: "ABC School Annual Magazine 2026 v1.pdf", date: "Aug 15, 2026" },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
    {
      id: "file-5",
      clientId: "client-2",
      projectId: "proj-5",
      filename: "Apex Healthcare Emergency Signage 2026 v1.ai",
      originalName: "emergency board apex 2026 v1.ai",
      currentName: "Apex Healthcare Emergency Signage 2026 v1.ai",
      path: "D:\\Clients\\Apex Healthcare\\2026\\AI - Illustrator Artwork\\Signage\\Apex Healthcare Emergency Signage 2026 v1.ai",
      currentPath: "D:\\Clients\\Apex Healthcare\\2026\\AI - Illustrator Artwork\\Signage\\Apex Healthcare Emergency Signage 2026 v1.ai",
      extension: "ai",
      fileSizeBytes: 38200000,
      sizeBytes: 38200000,
      version: 1,
      versionNumber: 1,
      status: "ORGANIZED",
      classificationConfidence: 0.94,
      clientName: "Apex Healthcare",
      projectName: "Hospital Signage & Banner",
      category: "Signage",
      categoryName: "Signage",
      year: 2026,
      sha256Hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      versionChain: [
        { version: 1, name: "Apex Healthcare Emergency Signage 2026 v1.ai", date: "Sep 01, 2026", isCurrent: true },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    },
  ];

  let reviewQueue = [
    {
      id: "review-1",
      filePath: "C:\\FolderMate\\Inbox\\draft id final ok.cdr",
      originalName: "draft id final ok.cdr",
      reason: "Missing unambiguous client name in filename",
      suggestedClientId: "client-1",
      suggestedClientName: "ABC School",
      suggestedProjectName: "Student ID Card",
      suggestedCategory: "ID Card",
      suggestedYear: 2026,
      suggestedConfidence: 0.65,
      detectedMetadata: {
        extension: "cdr",
        sizeBytes: 15400000,
        detectedYear: 2026,
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "review-2",
      filePath: "C:\\FolderMate\\Inbox\\hospital badge print.pdf",
      originalName: "hospital badge print.pdf",
      reason: "Low classification confidence score (0.72 < 0.85 threshold)",
      suggestedClientId: "client-2",
      suggestedClientName: "Apex Healthcare",
      suggestedProjectName: "Staff Identity Card",
      suggestedCategory: "ID Card",
      suggestedYear: 2026,
      suggestedConfidence: 0.72,
      detectedMetadata: {
        extension: "pdf",
        sizeBytes: 2100000,
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
  ];

  let folderRules = [
    {
      id: "frule-1",
      name: "Active Clients",
      scope: "CLIENT",
      colorPreset: "Amber",
      customIconPath: null,
      customColorHex: "#f59e0b",
      priority: 100,
      isActive: true,
    },
    {
      id: "frule-2",
      name: "Design & ID Card Projects",
      scope: "PROJECT",
      colorPreset: "Blue",
      customIconPath: null,
      customColorHex: "#3b82f6",
      priority: 90,
      isActive: true,
    },
    {
      id: "frule-3",
      name: "Rush & High Priority Orders",
      scope: "PRIORITY",
      colorPreset: "Red",
      customIconPath: null,
      customColorHex: "#ef4444",
      priority: 110,
      isActive: true,
    },
    {
      id: "frule-4",
      name: "Completed Archive",
      scope: "STATUS",
      colorPreset: "Gray",
      customIconPath: null,
      customColorHex: "#64748b",
      priority: 50,
      isActive: true,
    },
  ];

  let settings = {
    ingestion: {
      inboxPath: "C:\\FolderMate\\Inbox",
      stabilizationMs: 1500,
    },
    storage: {
      organizationRoot: "D:\\Clients",
      archiveRoot: "D:\\Archive",
      safeMode: true,
      collisionPolicy: "AUTO_INCREMENT",
    },
    coreldraw: {
      enabled: true,
      timeoutMs: 10000,
    },
  };

  let licenseStatus = (() => {
    try {
      const saved = localStorage.getItem("foldermate_license");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isActivated: false,
      licenseType: "TRIAL",
      features: {
        unlimitedOrganize: true,
        folderCustomization: true,
        versionLineage: true,
        corelDrawBridge: true,
        priorityUpdates: false,
      },
    };
  })();

  let isAutomationPaused = false;
  let pauseExpiresAt: string | null = null;
  let resourceMode: "battery" | "balanced" | "performance" = "balanced";

  const listeners: Array<(event: any) => void> = [];

  (window as any).foldermate = {
    call: async (method: string, payload?: any) => {
      console.log(`[Browser Mock RPC] ${method}`, payload);

      switch (method) {
        case "system.getLicenseStatus":
          return licenseStatus;

        case "system.activateLicense": {
          const type = payload?.licenseType || "COMMUNITY";
          licenseStatus = {
            isActivated: true,
            licenseType: type,
            key: payload?.key || "FM-COMMUNITY-MOCK-KEY",
            activatedAt: new Date().toISOString(),
            sponsorTier: type === "VIP" ? "Universal Lifetime VIP" : type === "SPONSOR" ? "Project Sponsor" : "Community License",
            donorName: payload?.donorName || undefined,
            features: {
              unlimitedOrganize: true,
              folderCustomization: true,
              versionLineage: true,
              corelDrawBridge: true,
              priorityUpdates: type === "SPONSOR" || type === "VIP",
            },
          };
          try {
            localStorage.setItem("foldermate_license", JSON.stringify(licenseStatus));
          } catch {}
          return licenseStatus;
        }

        case "system.resetLicense": {
          licenseStatus = {
            isActivated: false,
            licenseType: "TRIAL",
            features: {
              unlimitedOrganize: true,
              folderCustomization: true,
              versionLineage: true,
              corelDrawBridge: true,
              priorityUpdates: false,
            },
          };
          try {
            localStorage.removeItem("foldermate_license");
          } catch {}
          return licenseStatus;
        }

        case "system.getStatus":
          return {
            status: isAutomationPaused ? "PAUSED" : "RUNNING",
            isIdle: true,
            inboxPath: settings.ingestion.inboxPath,
            organizationRoot: settings.storage.organizationRoot,
            archiveRoot: settings.storage.archiveRoot,
            pendingReviewCount: reviewQueue.length,
            totalOrganized: files.length + 144,
            activeRulesCount: folderRules.filter((r) => r.isActive).length,
            memoryUsageMB: 42.8,
            license: licenseStatus,
          };

        case "system.getBackgroundMetrics":
          return {
            status: isAutomationPaused ? "PAUSED" : "RUNNING",
            pauseExpiresAt,
            pauseReason: isAutomationPaused ? "User requested pause" : undefined,
            uptimeSeconds: 14820,
            cpuPercent: isAutomationPaused ? 0.1 : resourceMode === "battery" ? 0.2 : resourceMode === "performance" ? 1.4 : 0.6,
            memoryMb: 42.8,
            dbWalStatus: "OPTIMAL",
            dbSizeBytes: 14200000,
            activeQueueSize: isAutomationPaused ? 1 : 0,
            filesIndexedCount: 12482,
            totalOrganizedCount: files.length + 144,
            watcherStatus: isAutomationPaused ? "IDLE" : "ACTIVE",
            inboxPath: settings.ingestion.inboxPath,
            organizationRoot: settings.storage.organizationRoot,
            lastActivityTimestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
            resourceMode,
          };

        case "system.pauseAutomation": {
          isAutomationPaused = true;
          const dur = payload?.duration || "1h";
          const ms = dur === "1h" ? 3600000 : dur === "tomorrow" ? 86400000 : 0;
          pauseExpiresAt = ms > 0 ? new Date(Date.now() + ms).toISOString() : null;
          return { success: true, status: "PAUSED", pauseExpiresAt };
        }

        case "system.resumeAutomation": {
          isAutomationPaused = false;
          pauseExpiresAt = null;
          return { success: true, status: "RUNNING" };
        }

        case "system.setResourceMode": {
          if (payload?.mode) resourceMode = payload.mode;
          return { success: true, resourceMode };
        }

        case "explorer.browse": {
          const currentPath = payload?.path || "D:\\Clients";
          // If at root
          if (currentPath === "D:\\Clients" || currentPath === "root") {
            const folderItems = clients.map((c) => ({
              id: c.id,
              name: c.name,
              type: "folder" as const,
              folderType: "client" as const,
              path: `D:\\Clients\\${c.name}`,
              color: c.color || "Amber",
              itemCount: projects.filter((p) => p.clientId === c.id).length,
              fileCount: files.filter((f) => f.clientId === c.id).length,
              modifiedDate: "Today, 12:45 PM",
            }));

            const rootFiles = files.slice(0, 2).map((f) => ({
              id: f.id,
              name: f.filename,
              type: "file" as const,
              extension: f.extension,
              path: f.path,
              sizeBytes: f.fileSizeBytes,
              version: f.version,
              clientName: f.clientName,
              projectName: f.projectName,
              category: f.category,
              year: f.year,
              modifiedDate: "Today, 12:45 PM",
              sha256Hash: f.sha256Hash,
            }));

            return {
              path: "D:\\Clients",
              items: [...folderItems, ...rootFiles],
            };
          }

          // If browsing a specific client folder
          const matchedClient = clients.find((c) => currentPath.includes(c.name));
          if (matchedClient) {
            const clientProjects = projects.filter((p) => p.clientId === matchedClient.id);
            const clientFolders = clientProjects.map((p) => ({
              id: p.id,
              name: `${p.year} \\ ${p.name}`,
              type: "folder" as const,
              folderType: "project" as const,
              path: `D:\\Clients\\${matchedClient.name}\\${p.year}\\${p.name}`,
              color: matchedClient.color || "Amber",
              itemCount: files.filter((f) => f.projectId === p.id).length,
              fileCount: files.filter((f) => f.projectId === p.id).length,
              modifiedDate: "Yesterday",
            }));

            const clientFiles = files
              .filter((f) => f.clientId === matchedClient.id)
              .map((f) => ({
                id: f.id,
                name: f.filename,
                type: "file" as const,
                extension: f.extension,
                path: f.path,
                sizeBytes: f.fileSizeBytes,
                version: f.version,
                clientName: f.clientName,
                projectName: f.projectName,
                category: f.category,
                year: f.year,
                modifiedDate: "Today, 12:45 PM",
                sha256Hash: f.sha256Hash,
              }));

            return {
              path: currentPath,
              items: [...clientFolders, ...clientFiles],
            };
          }

          return {
            path: currentPath,
            items: [],
          };
        }

        case "system.triggerScan":
          return { status: "OK", scannedFiles: 0, newFilesOrganized: 0 };

        case "system.simulateIngest": {
          const rawName = (payload?.filename || "Sample file.cdr").trim();
          const ext = rawName.split(".").pop()?.toLowerCase() || "cdr";
          const lower = rawName.toLowerCase();

          // Check if matches any existing client
          let matchedClient = clients.find(
            (c) =>
              lower.includes(c.name.toLowerCase()) ||
              lower.includes(c.code.toLowerCase()) ||
              c.aliases.some((a) => lower.includes(a.toLowerCase()))
          );

          if (matchedClient) {
            const yearMatch = rawName.match(/\b(202[0-9])\b/);
            const year = yearMatch ? Number(yearMatch[1]) : 2026;
            const versionMatch = rawName.match(/\bv?([0-9]+)\b/i);
            const ver = versionMatch ? Number(versionMatch[1]) : 1;
            const category = lower.includes("card") ? "ID Card" : lower.includes("sign") ? "Signage" : lower.includes("magazine") ? "Publication" : "Design";

            const fileTypeFolder =
              ext === "cdr"
                ? "CDR - CorelDRAW Designs"
                : ext === "psd"
                ? "PSD - Photoshop Documents"
                : ext === "ai"
                ? "AI - Illustrator Artwork"
                : ext === "indd"
                ? "INDD - InDesign Layouts"
                : ext === "pdf"
                ? "PDF - Deliverables"
                : ["png", "jpg", "jpeg", "webp", "svg"].includes(ext)
                ? "Images & Assets"
                : ["xlsx", "xls", "csv"].includes(ext)
                ? "Spreadsheets & Data"
                : "Other Files";

            const canonicalFilename = `${matchedClient.name} ${category} ${year} v${ver}.${ext}`;
            const targetPath = `${settings.storage.organizationRoot}\\${matchedClient.name}\\${year}\\${fileTypeFolder}\\${category}\\${canonicalFilename}`;

            const newFile = {
              id: `file-${Date.now()}`,
              clientId: matchedClient.id,
              projectId: `proj-sim-${Date.now()}`,
              filename: canonicalFilename,
              originalName: rawName,
              currentName: canonicalFilename,
              path: targetPath,
              currentPath: targetPath,
              extension: ext,
              fileSizeBytes: payload?.sizeBytes || 18500000,
              sizeBytes: payload?.sizeBytes || 18500000,
              version: ver,
              versionNumber: ver,
              status: "ORGANIZED",
              classificationConfidence: 0.96,
              clientName: matchedClient.name,
              projectName: `${category} Project`,
              category: category,
              categoryName: category,
              year: year,
              sha256Hash: "b6c97a5f3d2e1048491827461928471928374619283746192837461928374619",
              versionChain: [
                { version: ver, name: canonicalFilename, date: "Just now", isCurrent: true },
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            files.unshift(newFile);
            listeners.forEach((cb) => cb({ eventType: "FILE_ORGANIZED", file: newFile }));
            return { outcome: "ORGANIZED", file: newFile };
          } else {
            // Low confidence -> Review Queue
            const newItem = {
              id: `review-${Date.now()}`,
              filePath: `C:\\FolderMate\\Inbox\\${rawName}`,
              originalName: rawName,
              originalPath: `C:\\FolderMate\\Inbox\\${rawName}`,
              reason: "Unrecognized client name in filename",
              reasons: ["No confident client alias match found in local database", "Confidence score 0.45 below threshold (0.85)"],
              suggestedClientId: clients[0]?.id,
              suggestedClientName: clients[0]?.name,
              suggestedProjectName: "General Deliverable",
              suggestedCategory: "Design",
              suggestedYear: 2026,
              suggestedVersion: 1,
              suggestedConfidence: 0.45,
              confidenceScore: 0.45,
              detectedMetadata: {
                extension: ext,
                sizeBytes: payload?.sizeBytes || 8400000,
              },
              createdAt: new Date().toISOString(),
            };

            reviewQueue.unshift(newItem);
            listeners.forEach((cb) => cb({ eventType: "REVIEW_REQUIRED", item: newItem }));
            return { outcome: "REVIEW_REQUIRED", item: newItem };
          }
        }

        case "files.list": {
          let res = [...files];
          if (payload?.clientId) {
            res = res.filter((f) => f.clientId === payload.clientId);
          }
          if (payload?.projectId) {
            res = res.filter((f) => f.projectId === payload.projectId);
          }
          return {
            items: res,
            total: res.length,
          };
        }

        case "files.search":
        case "search.query": {
          const q = (typeof payload === "string" ? payload : payload?.query || "").toLowerCase();
          if (!q.trim()) return files;

          const filtered = files.filter(
            (f) =>
              f.filename.toLowerCase().includes(q) ||
              f.originalName.toLowerCase().includes(q) ||
              f.clientName?.toLowerCase().includes(q) ||
              f.projectName?.toLowerCase().includes(q) ||
              f.category?.toLowerCase().includes(q) ||
              f.extension.toLowerCase().includes(q) ||
              String(f.year).includes(q) ||
              `v${f.version}`.toLowerCase().includes(q)
          );
          return filtered;
        }

        case "clients.list":
          return clients;

        case "clients.create": {
          const newClient = {
            id: `client-${Date.now()}`,
            name: payload.name,
            code: payload.code || payload.name.replace(/\s+/g, "").toUpperCase().slice(0, 6),
            aliases: payload.aliases || [],
            color: payload.color || "Amber",
            folderPath: `${settings.storage.organizationRoot}\\${payload.name}`,
            isActive: true,
            createdAt: new Date().toISOString(),
          };
          clients.push(newClient);

          // If initial project provided, create it automatically
          if (payload.initialProjectName) {
            projects.push({
              id: `proj-${Date.now()}`,
              clientId: newClient.id,
              name: payload.initialProjectName,
              category: payload.initialProjectCategory || "Design",
              year: payload.initialProjectYear || new Date().getFullYear(),
              subfolderPath: `${payload.initialProjectYear || new Date().getFullYear()}\\${payload.initialProjectCategory || "Design"}`,
            });
          }

          return newClient;
        }

        case "projects.list": {
          if (payload?.clientId) {
            return projects.filter((p) => p.clientId === payload.clientId);
          }
          return projects;
        }

        case "projects.create": {
          const newProj = {
            id: `proj-${Date.now()}`,
            clientId: payload.clientId,
            name: payload.name,
            category: payload.category || "General",
            year: payload.year || new Date().getFullYear(),
            subfolderPath: `${payload.year || new Date().getFullYear()}\\${payload.name}`,
          };
          projects.push(newProj);
          return newProj;
        }

        case "reviewQueue.list":
          return reviewQueue;

        case "reviewQueue.resolve": {
          const foundIdx = reviewQueue.findIndex((r) => r.id === payload.queueId);
          if (foundIdx !== -1) {
            const item = reviewQueue[foundIdx];
            reviewQueue.splice(foundIdx, 1);
            const client = clients.find((c) => c.id === payload.clientId);
            const project = projects.find((p) => p.id === payload.projectId);
            const ext = (item.originalName.split(".").pop() || "cdr").toLowerCase();
            const fileTypeFolder =
              ext === "cdr"
                ? "CDR - CorelDRAW Designs"
                : ext === "psd"
                ? "PSD - Photoshop Documents"
                : ext === "ai"
                ? "AI - Illustrator Artwork"
                : ext === "indd"
                ? "INDD - InDesign Layouts"
                : ext === "pdf"
                ? "PDF - Deliverables"
                : ["png", "jpg", "jpeg", "webp", "svg"].includes(ext)
                ? "Images & Assets"
                : ["xlsx", "xls", "csv"].includes(ext)
                ? "Spreadsheets & Data"
                : "Other Files";

            const canonicalFilename = `${client?.name || "Client"} ${project?.name || payload.category || "Deliverable"} ${payload.year || 2026} v${payload.versionNumber || 1}.${ext}`;
            const targetPath = `${settings.storage.organizationRoot}\\${client?.name || "Client"}\\${payload.year || 2026}\\${fileTypeFolder}\\${payload.category || "Design"}\\${canonicalFilename}`;

            files.unshift({
              id: `file-${Date.now()}`,
              clientId: payload.clientId,
              projectId: payload.projectId,
              filename: canonicalFilename,
              originalName: item.originalName,
              currentName: canonicalFilename,
              path: targetPath,
              currentPath: targetPath,
              extension: ext,
              fileSizeBytes: item.detectedMetadata?.sizeBytes || 5400000,
              sizeBytes: item.detectedMetadata?.sizeBytes || 5400000,
              version: payload.versionNumber || 1,
              versionNumber: payload.versionNumber || 1,
              status: "ORGANIZED",
              classificationConfidence: 1.0,
              clientName: client?.name || "Client",
              projectName: project?.name || "Project",
              category: payload.category || "Design",
              categoryName: payload.category || "Design",
              year: payload.year || 2026,
              sha256Hash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
              versionChain: [{ version: payload.versionNumber || 1, name: canonicalFilename, date: "Just now", isCurrent: true }],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          return { success: true };
        }

        case "folderRules.list":
          return folderRules;

        case "folderRules.create": {
          const newRule = {
            id: `frule-${Date.now()}`,
            name: payload.name,
            scope: payload.scope || "CLIENT",
            colorPreset: payload.colorPreset || "Amber",
            customIconPath: payload.customIconPath || null,
            customColorHex: payload.customColorHex || "#f59e0b",
            priority: payload.priority || 100,
            isActive: payload.isActive !== undefined ? payload.isActive : true,
          };
          folderRules.push(newRule);
          return newRule;
        }

        case "folderRules.delete": {
          folderRules = folderRules.filter((r) => r.id !== payload.id);
          return { success: true };
        }

        case "folderRules.apply":
          return { success: true, count: 3 };

        case "settings.get":
          return settings;

        case "settings.update":
          settings = { ...settings, ...payload };
          return settings;

        case "drives.list":
          return drives;

        case "drives.assign": {
          drives = drives.map((d) => {
            const isMatch = d.letter.toUpperCase() === payload.letter.toUpperCase();
            return {
              ...d,
              isControlled: isMatch,
              ...(isMatch
                ? {
                    label: payload.label || d.label,
                    color: payload.color || d.color,
                    emblem: payload.emblem || d.emblem,
                    rootFolder: `${payload.letter}\\${payload.label || "Data Storage"}`,
                  }
                : {}),
            };
          });
          return { success: true, drives };
        }

        case "drives.reindex": {
          return {
            success: true,
            indexedCount: files.length + 38,
            message: `Scanned and indexed entire drive ${payload.letter}.`,
          };
        }

        case "folders.customize": {
          const client = clients.find((c) => c.id === payload.folderId || c.name === payload.folderName);
          if (client) {
            client.color = payload.color;
            (client as any).emblem = payload.emblem;
          }
          return { success: true };
        }

        // DPDP Act 2023 & DPDP Rules 2025 Privacy & Data Governance Mocks
        case "privacy.getGovernanceSummary":
          return {
            dpdpReadinessScore: 96,
            totalDataPrincipals: clients.length + 2,
            activeConsentRecords: 6,
            withdrawnConsentRecords: 1,
            pendingDSRRequests: 1,
            completedDSRRequests: 3,
            openGrievances: 0,
            slaBreachedGrievances: 0,
            totalBreachIncidents: 0,
            activeRetentionPolicies: 4,
            childDataProtectedCount: 2,
            piiMaskingActive: true,
            storageIsolationActive: true,
            offlineFirstMode: true,
          };

        case "privacy.getNotice":
          return {
            version: "v1.0-DPDP-2026",
            effectiveDate: "2026-09-26",
            fiduciaryName: "FolderMate Workspace Administrator",
            fiduciaryContact: "privacy@foldermate.local",
            grievanceOfficerName: "Data Protection & Grievance Redressal Officer",
            grievanceOfficerEmail: "grievance@foldermate.local",
            grievanceOfficerPhone: "+91-98765-43210",
            itemisedPurposes: [
              {
                purposeId: "file_organization",
                purposeName: "Client & Project File Organization",
                dataCollected: ["Client Names", "Project Titles", "File Paths", "Timestamps"],
                lawfulBasis: "Legitimate Use / Contract Performance",
                retentionPeriod: "Duration of active client engagement",
                isChildDataApplicable: true,
              },
              {
                purposeId: "metadata_indexing",
                purposeName: "Local FTS5 Metadata Indexing",
                dataCollected: ["Filenames", "Document Text", "Metadata Tags"],
                lawfulBasis: "Legitimate Use",
                retentionPeriod: "Duration of active workspace usage",
                isChildDataApplicable: false,
              },
              {
                purposeId: "ocr_text_extraction",
                purposeName: "Document & ID Card Text Analysis",
                dataCollected: ["Student/Staff Names", "ID Badges", "Document Text"],
                lawfulBasis: "Consent (Revocable)",
                retentionPeriod: "Active school/client year",
                isChildDataApplicable: true,
              },
              {
                purposeId: "community_rewards",
                purposeName: "Community Tasks & Free Key Verification",
                dataCollected: ["Public GitHub Username", "Community Task Status"],
                lawfulBasis: "Voluntary Consent",
                retentionPeriod: "14 days post verification",
                isChildDataApplicable: false,
              },
              {
                purposeId: "support_ticket",
                purposeName: "Privacy & Technical Grievance Redressal",
                dataCollected: ["Complainant Name", "Contact Email/Phone", "Grievance Description"],
                lawfulBasis: "Section 13 DPDP Act 2023 Statutory Obligation",
                retentionPeriod: "90 days post-resolution",
                isChildDataApplicable: false,
              },
            ],
            rightsSummary: [
              "Right to Access Information regarding Personal Data & Processing Activities (Sec 11)",
              "Right to Correction, Completion, and Updating of inaccurate Personal Data (Sec 12)",
              "Right to Erasure / Deletion of Personal Data no longer required (Sec 12(3))",
              "Right to Grievance Redressal with statutory resolution <= 90 days (Sec 13)",
              "Right to Nominate an individual in the event of death or incapacity (Sec 14)",
            ],
            grievanceProcedure: "Contact the Grievance Redressal Officer at grievance@foldermate.local. Complaints are acknowledged within 48 hours and resolved within 90 days as mandated by DPDP Rules 2025.",
            consentWithdrawalInstructions: "Consent can be withdrawn at any time via the Privacy Center. Processing will cease immediately upon withdrawal.",
          };

        case "privacy.listConsentRecords":
          return [
            {
              id: "consent-1",
              principalId: "client-1",
              principalType: "client",
              principalName: "ABC School",
              principalContact: "admin@abcschool.edu",
              purposeId: "ocr_text_extraction",
              purposeDescription: "Student ID card raster & roster text analysis for batch generation",
              status: "granted",
              noticeVersion: "v1.0",
              lawfulBasis: "consent",
              isChildData: true,
              parentalConsentVerified: true,
              parentGuardianIdentifier: "PARENT-ROSTER-2026",
              grantedAt: "2026-09-01T10:00:00.000Z",
              createdAt: "2026-09-01T10:00:00.000Z",
              updatedAt: "2026-09-01T10:00:00.000Z",
            },
            {
              id: "consent-2",
              principalId: "client-1",
              principalType: "client",
              principalName: "ABC School",
              principalContact: "admin@abcschool.edu",
              purposeId: "file_organization",
              purposeDescription: "Autonomous filing and archiving of student publications and annual magazines",
              status: "granted",
              noticeVersion: "v1.0",
              lawfulBasis: "contractual",
              isChildData: true,
              parentalConsentVerified: true,
              grantedAt: "2026-09-01T10:00:00.000Z",
              createdAt: "2026-09-01T10:00:00.000Z",
              updatedAt: "2026-09-01T10:00:00.000Z",
            },
            {
              id: "consent-3",
              principalId: "client-2",
              principalType: "client",
              principalName: "Apex Healthcare",
              principalContact: "operations@apexhealth.org",
              purposeId: "file_organization",
              purposeDescription: "Medical staff badge formatting and signage versioning",
              status: "granted",
              noticeVersion: "v1.0",
              lawfulBasis: "consent",
              isChildData: false,
              parentalConsentVerified: false,
              grantedAt: "2026-09-10T14:30:00.000Z",
              createdAt: "2026-09-10T14:30:00.000Z",
              updatedAt: "2026-09-10T14:30:00.000Z",
            },
          ];

        case "privacy.recordConsent":
          return {
            id: `consent-${Date.now()}`,
            principalId: payload.principalId,
            principalType: payload.principalType || "client",
            principalName: payload.principalName,
            principalContact: payload.principalContact,
            purposeId: payload.purposeId,
            purposeDescription: payload.purposeDescription || "Recorded consent",
            status: "granted",
            noticeVersion: "v1.0",
            lawfulBasis: payload.lawfulBasis || "consent",
            isChildData: !!payload.isChildData,
            parentalConsentVerified: !!payload.parentalConsentVerified,
            parentGuardianIdentifier: payload.parentGuardianIdentifier,
            grantedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

        case "privacy.withdrawConsent":
          return { success: true, count: 1 };

        case "privacy.listDSRs":
          return [
            {
              id: "dsr-1",
              requestNumber: "DSR-2026-0001",
              principalId: "client-1",
              principalName: "ABC School (Parent Representative)",
              principalContact: "guardian@abcschool.edu",
              requestType: "access",
              status: "completed",
              details: "Request for comprehensive copy of all student design metadata and versions under Section 11.",
              assignedTo: "Data Protection Officer",
              dueDate: "2026-10-15T00:00:00.000Z",
              completedAt: "2026-09-20T11:00:00.000Z",
              resolutionSummary: "Delivered verified machine-readable JSON archive with full audit trail.",
              createdAt: "2026-09-15T09:30:00.000Z",
              updatedAt: "2026-09-20T11:00:00.000Z",
            },
            {
              id: "dsr-2",
              requestNumber: "DSR-2026-0002",
              principalId: "client-2",
              principalName: "Apex Healthcare (Staff Secretary)",
              principalContact: "hr@apexhealth.org",
              requestType: "correction",
              status: "in_progress",
              details: "Update phone number and designation details in hospital staff identity cards roster.",
              assignedTo: "Data Protection Officer",
              dueDate: "2026-10-25T00:00:00.000Z",
              createdAt: "2026-09-25T14:15:00.000Z",
              updatedAt: "2026-09-25T14:15:00.000Z",
            },
          ];

        case "privacy.createDSR":
          return {
            id: `dsr-${Date.now()}`,
            requestNumber: `DSR-2026-000${Math.floor(Math.random() * 900 + 100)}`,
            principalId: payload.principalId,
            principalName: payload.principalName,
            principalContact: payload.principalContact,
            requestType: payload.requestType,
            status: "received",
            details: payload.details,
            assignedTo: "Data Protection Officer",
            dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

        case "privacy.generateDSRExport":
          return {
            exportMetadata: {
              exportVersion: "DPDP-DSR-v1.0",
              generatedAt: new Date().toISOString(),
              dataPrincipalIdentifier: payload.principalId,
              legalBasis: "Section 11 DPDP Act 2023 - Right to Access Personal Data",
              fiduciaryName: "FolderMate Workspace",
            },
            principalDetails: clients.find((c) => c.id === payload.principalId) || { id: payload.principalId, name: "Data Principal" },
            associatedProjects: projects.filter((p) => p.clientId === payload.principalId),
            filesProcessed: files.filter((f) => f.clientId === payload.principalId),
            consentAuditTrail: [
              { purpose: "file_organization", status: "granted", grantedAt: "2026-09-01T10:00:00Z" }
            ],
          };

        case "privacy.executeDSRErasure":
          return { success: true, purgedFiles: 3, purgedRecords: 4 };

        case "privacy.listGrievances":
          return [
            {
              id: "grv-1",
              ticketNumber: "GRV-2026-0001",
              complainantName: "Dr. Rajesh Sharma",
              complainantContact: "rajesh.sharma@apexhealth.org",
              category: "unauthorized_processing",
              description: "Inquiry regarding temporary CDR backup copy retention in workspace inbox.",
              status: "resolved",
              grievanceOfficer: "Grievance Redressal Officer",
              resolutionNotes: "Explained local staging buffer auto-purge (7 days retention policy) and verified zero cloud transmission.",
              slaDeadline: "2026-12-01T00:00:00.000Z",
              resolvedAt: "2026-09-18T16:00:00.000Z",
              createdAt: "2026-09-12T11:00:00.000Z",
              updatedAt: "2026-09-18T16:00:00.000Z",
            },
          ];

        case "privacy.submitGrievance":
          return {
            id: `grv-${Date.now()}`,
            ticketNumber: `GRV-2026-000${Math.floor(Math.random() * 900 + 100)}`,
            complainantName: payload.complainantName,
            complainantContact: payload.complainantContact,
            category: payload.category,
            description: payload.description,
            status: "open",
            grievanceOfficer: "Grievance Redressal Officer",
            slaDeadline: new Date(Date.now() + 90 * 86400000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

        case "privacy.listBreachIncidents":
          return [];

        case "privacy.logBreachIncident":
          return {
            id: `inc-${Date.now()}`,
            incidentNumber: `INC-2026-0001`,
            title: payload.title,
            severity: payload.severity || "medium",
            natureAndScope: payload.natureAndScope,
            affectedDataCategories: payload.affectedDataCategories || [],
            estimatedAffectedPrincipals: payload.estimatedAffectedPrincipals || 0,
            status: "detected",
            containmentActions: payload.containmentActions || "Quarantined affected paths.",
            dpbiNotified: false,
            principalsNotified: false,
            detectedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

        case "privacy.generateBreachNotification":
          return {
            dpbiNotice: `FORM OF INTIMATION OF PERSONAL DATA BREACH TO THE DATA PROTECTION BOARD OF INDIA\n(Section 8(6) DPDP Act 2023)\nIncident: INC-2026-0001\nStatus: Contained & Triaged locally.`,
            principalNotice: `NOTICE OF PERSONAL DATA SECURITY INCIDENT\nDear Client,\nWe have contained and resolved a security incident. Zero external data transmission occurred.`,
          };

        case "privacy.listRetentionPolicies":
          return [
            {
              id: "ret-1",
              name: "Inbox Temporary Staging Buffer",
              category: "inbox_staging",
              retentionDays: 7,
              action: "delete",
              justification: "Temporary unclassified staging files waiting for ingestion debounce or resolution.",
              isActive: true,
              lastRunAt: "2026-09-26T12:00:00.000Z",
            },
            {
              id: "ret-2",
              name: "Review Queue Ambiguous Files",
              category: "review_queue",
              retentionDays: 30,
              action: "flag_for_review",
              justification: "Low confidence items requiring human operator intervention before auto-purge.",
              isActive: true,
              lastRunAt: "2026-09-26T12:00:00.000Z",
            },
            {
              id: "ret-3",
              name: "Audit Event Security Logs",
              category: "audit_logs",
              retentionDays: 365,
              action: "archive",
              justification: "Statutory audit logs retained for security forensic compliance.",
              isActive: true,
              lastRunAt: "2026-09-26T12:00:00.000Z",
            },
            {
              id: "ret-4",
              name: "Data Subject Access Exports",
              category: "exports",
              retentionDays: 14,
              action: "delete",
              justification: "Ephemeral portable JSON/CSV export packages provided to Data Principals.",
              isActive: true,
              lastRunAt: "2026-09-26T12:00:00.000Z",
            },
          ];

        case "privacy.runRetentionCleanup":
          return [
            {
              policyId: "ret-1",
              policyName: "Inbox Temporary Staging Buffer",
              category: "inbox_staging",
              itemsProcessed: 14,
              itemsPurged: 3,
              bytesFreed: 48500000,
              executedAt: new Date().toISOString(),
              durationMs: 42,
            },
            {
              policyId: "ret-2",
              policyName: "Review Queue Ambiguous Files",
              category: "review_queue",
              itemsProcessed: 2,
              itemsPurged: 0,
              bytesFreed: 0,
              executedAt: new Date().toISOString(),
              durationMs: 12,
            },
          ];

        default:
          return {};
      }
    },


    openPath: async (p: string) => {
      console.log(`[Browser Mock] Open folder path in Windows Explorer: ${p}`);
      alert(`[Windows Explorer] Opened folder:\n${p}`);
    },

    showItemInFolder: async (p: string) => {
      console.log(`[Browser Mock] Reveal item in Windows Explorer: ${p}`);
      alert(`[Windows Explorer] Selected file:\n${p}`);
    },

    onEvent: (callback: (event: any) => void) => {
      listeners.push(callback);
      return () => {
        const idx = listeners.indexOf(callback);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },
  };

  console.info(
    "%c[FolderMate]%c Initialized browser mock RPC bridge with live interactive state.",
    "color: #f59e0b; font-weight: bold;",
    "color: #94a3b8;"
  );
}
