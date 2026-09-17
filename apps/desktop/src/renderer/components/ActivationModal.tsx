import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  Heart,
  Star,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Key,
  Globe,
  Share2,
  MessageSquare,
  Lock,
  Layers,
  FileCheck2,
} from "lucide-react";
import { Button } from "./ui/Button.js";
import { Badge } from "./ui/Badge.js";
import { Card } from "./ui/Card.js";
import { Input } from "./ui/Input.js";
import { useToast } from "./ui/Toast.js";
import {
  DEFAULT_COMMUNITY_TASKS,
  generateCommunityKey,
  validateLicenseKey,
} from "../utils/license-validator.js";
import { CommunityTask, LicenseStatus } from "@foldermate/shared";

interface ActivationModalProps {
  isOpen: boolean;
  onActivated: (status: LicenseStatus) => void;
  onClose?: () => void;
  isClosable?: boolean;
}

type WizardStep = "welcome" | "choose-path" | "community-tasks" | "sponsor-info" | "enter-key";

export const ActivationModal: React.FC<ActivationModalProps> = ({
  isOpen,
  onActivated,
  onClose,
  isClosable = false,
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>("welcome");
  const [tasks, setTasks] = useState<CommunityTask[]>(() => {
    try {
      const saved = localStorage.getItem("foldermate_community_tasks");
      return saved ? JSON.parse(saved) : DEFAULT_COMMUNITY_TASKS;
    } catch {
      return DEFAULT_COMMUNITY_TASKS;
    }
  });

  const [inputKey, setInputKey] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [donorName, setDonorName] = useState("");

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const isTasksComplete = completedCount >= 3;

  useEffect(() => {
    try {
      localStorage.setItem("foldermate_community_tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  if (!isOpen) return null;

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleOpenTaskUrl = (task: CommunityTask) => {
    window.open(task.actionUrl, "_blank", "noopener,noreferrer");
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, isCompleted: true } : t))
    );
    showToast(`Marked "${task.title}" as done`, "success");
  };

  const handleGenerateKey = () => {
    const key = generateCommunityKey();
    setGeneratedKey(key);
    setInputKey(key);
    showToast("Generated unique Community License Key!", "success");
    setCurrentStep("enter-key");
  };

  const handleCopyKey = (keyToCopy: string) => {
    navigator.clipboard.writeText(keyToCopy);
    setIsCopied(true);
    showToast("Key copied to clipboard", "info");
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleActivate = async () => {
    const key = inputKey.trim();
    const validation = validateLicenseKey(key);

    if (!validation.isValid) {
      showToast(validation.error || "Invalid license key", "error");
      return;
    }

    setIsActivating(true);

    try {
      const licenseStatus: LicenseStatus = {
        isActivated: true,
        licenseType: validation.type,
        key: key,
        activatedAt: new Date().toISOString(),
        sponsorTier: validation.tier,
        donorName: donorName.trim() || undefined,
        features: {
          unlimitedOrganize: true,
          folderCustomization: true,
          versionLineage: true,
          corelDrawBridge: true,
          priorityUpdates: validation.type === "SPONSOR" || validation.type === "VIP",
        },
      };

      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.activateLicense", {
          key,
          licenseType: validation.type,
          donorName: donorName.trim(),
        });
      } else {
        localStorage.setItem("foldermate_license", JSON.stringify(licenseStatus));
      }

      showToast(`FolderMate activated successfully as ${validation.tier}!`, "success");
      onActivated(licenseStatus);
    } catch (err: any) {
      showToast(`Activation failed: ${err.message}`, "error");
    } finally {
      setIsActivating(false);
    }
  };

  const validationState = inputKey ? validateLicenseKey(inputKey) : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(3, 7, 18, 0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 12,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px 0 rgba(247, 199, 29, 0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, rgba(23, 33, 54, 0.8), rgba(16, 24, 39, 0.6))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--accent-amber-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/logo.png?v=2" alt="Logo" style={{ width: 22, height: 22, objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                FolderMate Activation & Onboarding
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Offline-First • Open Source Desktop Automation
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge variant="amber" size="sm">
              v1.0.0
            </Badge>
            {isClosable && onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Modal Body with Multi-Step Wizard */}
        <div style={{ padding: "22px 26px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* ================= STEP 1: WELCOME ================= */}
          {currentStep === "welcome" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 12px",
                    borderRadius: 20,
                    backgroundColor: "var(--accent-amber-subtle)",
                    color: "var(--accent-amber)",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  <Sparkles size={14} /> Welcome to FolderMate for Windows
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
                  Effortless File Organization & Versioning
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto", lineHeight: 1.5 }}>
                  FolderMate sits in your Windows background, watches incoming design and office files, classifies them by client and project, safely handles versions, and styles your Windows Explorer folders.
                </p>
              </div>

              {/* Value Highlight Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div
                  style={{
                    padding: "14px 16px",
                    backgroundColor: "var(--bg-canvas)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <Lock size={20} color="var(--status-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                      100% Offline & Private
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      Your files never leave your computer. Everything runs locally with zero telemetry.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    backgroundColor: "var(--bg-canvas)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <FileCheck2 size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                      Smart Classification
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      Autonomously categorizes CDR, PDF, AI, PSD, and Docs by client and year.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    backgroundColor: "var(--bg-canvas)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <ShieldCheck size={20} color="var(--status-info)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                      Safe Two-Phase Mover
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      SHA-256 hash verified copying protects against data corruption and collisions.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    backgroundColor: "var(--bg-canvas)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <Layers size={20} color="#c084fc" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                      Explorer Folder Branding
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      Custom colored folders and tips in Windows Explorer for every active client.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight size={15} />}
                  onClick={() => setCurrentStep("choose-path")}
                >
                  Get License Key & Unlock
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: CHOOSE PATH ================= */}
          {currentStep === "choose-path" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                  Choose How You Want to Unlock FolderMate
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  FolderMate is open source and community-supported. Select your preferred unlock method:
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* Free Community Option */}
                <div
                  onClick={() => setCurrentStep("community-tasks")}
                  style={{
                    padding: "20px 18px",
                    backgroundColor: "var(--bg-canvas)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 14,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-amber)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(247, 199, 29, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-medium)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Badge variant="success" size="sm">
                        100% Free
                      </Badge>
                      <Star size={18} color="var(--accent-amber)" />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                      Community License
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      Complete any <strong>3 quick community tasks</strong> (Star GitHub repo, comment on blog, follow LinkedIn/X) to generate your free single-device key.
                    </div>
                  </div>

                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight size={13} />}>
                    Complete 3 Tasks →
                  </Button>
                </div>

                {/* Sponsor Supporter Option */}
                <div
                  onClick={() => setCurrentStep("sponsor-info")}
                  style={{
                    padding: "20px 18px",
                    backgroundColor: "rgba(247, 199, 29, 0.04)",
                    border: "1px solid var(--border-focus)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 14,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-amber)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(247, 199, 29, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-focus)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Badge variant="amber" size="sm">
                        ⭐ Supporter VIP
                      </Badge>
                      <Heart size={18} color="#f43f5e" fill="#f43f5e" />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-amber-text)" }}>
                      Sponsor / Superchat Key
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      Support ongoing development. Get a <strong>Universal Reusable License Key</strong> for all your machines, VIP badge, and direct feature support.
                    </div>
                  </div>

                  <Button variant="primary" size="sm" rightIcon={<ArrowRight size={13} />}>
                    Sponsor & Get Key →
                  </Button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => setCurrentStep("welcome")}>
                  Back
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep("enter-key")}>
                  Already have a key? Enter Key →
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 3A: COMMUNITY TASKS (PICK ANY 3) ================= */}
          {currentStep === "community-tasks" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                    Pick Any 3 Tasks to Unlock Your Free Key
                  </h3>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Support FolderMate on your preferred platform (GitHub, Blog, LinkedIn, or X)
                  </p>
                </div>

                <Badge variant={isTasksComplete ? "success" : "amber"} size="md">
                  {completedCount} of 3 Completed
                </Badge>
              </div>

              {/* Progress Bar */}
              <div style={{ width: "100%", height: 6, backgroundColor: "var(--bg-canvas)", borderRadius: 3, overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                <div
                  style={{
                    width: `${Math.min(100, (completedCount / 3) * 100)}%`,
                    height: "100%",
                    backgroundColor: isTasksComplete ? "var(--status-success)" : "var(--accent-amber)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Tasks List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 310, overflowY: "auto", paddingRight: 4 }}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: task.isCompleted ? "var(--accent-amber-subtle)" : "var(--bg-canvas)",
                      border: `1px solid ${task.isCompleted ? "var(--border-focus)" : "var(--border-subtle)"}`,
                      gap: 12,
                      transition: "all 0.12s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleToggleTask(task.id)}
                        style={{ width: 16, height: 16, accentColor: "var(--accent-amber)", cursor: "pointer" }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {task.description}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={task.isCompleted ? "secondary" : "amber"}
                      rightIcon={<ExternalLink size={12} />}
                      onClick={() => handleOpenTaskUrl(task)}
                      style={{ flexShrink: 0 }}
                    >
                      {task.actionLabel}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Key Generation Action Box */}
              {isTasksComplete && (
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid var(--status-success)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={18} color="var(--status-success)" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--status-success-text)" }}>
                      Great job! 3 tasks completed. Your free key is ready.
                    </span>
                  </div>

                  <Button variant="primary" size="sm" onClick={handleGenerateKey}>
                    Generate Free Key →
                  </Button>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => setCurrentStep("choose-path")}>
                  Back
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep("enter-key")}>
                  Enter Key Manually →
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 3B: SPONSOR / SUPPORTER ================= */}
          {currentStep === "sponsor-info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ textAlign: "center", padding: "6px 0" }}>
                <Heart size={28} color="#f43f5e" fill="#f43f5e" style={{ margin: "0 auto 8px" }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                  Support FolderMate Development
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
                  By sponsoring FolderMate, you help keep this software actively maintained, get universal reusable keys, and unlock lifetime perks.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div
                  style={{
                    padding: "14px 16px",
                    backgroundColor: "var(--bg-canvas)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                      GitHub Sponsors & Patrons
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      Monthly or one-time sponsorship on GitHub. Receive an instant universal sponsor key via email.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="amber"
                    rightIcon={<ExternalLink size={12} />}
                    onClick={() => window.open("https://github.com/sponsors/FolderMate", "_blank")}
                  >
                    GitHub Sponsor Portal 💖
                  </Button>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    backgroundColor: "var(--bg-canvas)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                      Superchat / Tip Donation
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      Quick one-time tip/coffee contribution to support server costs and engineering.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    rightIcon={<ExternalLink size={12} />}
                    onClick={() => window.open("https://buymeacoffee.com/foldermate", "_blank")}
                  >
                    Send Tip / Superchat ☕
                  </Button>
                </div>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  backgroundColor: "var(--accent-amber-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-focus)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-amber-text)" }}>
                    Already contributed or sponsored?
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                    Paste your Universal Lifetime key or Gold code below to activate.
                  </div>
                </div>

                <Button variant="primary" size="sm" onClick={() => setCurrentStep("enter-key")}>
                  Enter Sponsor Key →
                </Button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => setCurrentStep("choose-path")}>
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: ENTER KEY & ACTIVATE ================= */}
          {currentStep === "enter-key" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                  Activate FolderMate
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Enter your unique Community or Universal Sponsor License Key:
                </p>
              </div>

              {generatedKey && (
                <div
                  style={{
                    padding: "12px 14px",
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid var(--status-success)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "var(--status-success-text)", fontWeight: 600 }}>
                      Generated Community Key:
                    </div>
                    <code className="mono-font" style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 700 }}>
                      {generatedKey}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={isCopied ? <Check size={13} /> : <Copy size={13} />}
                    onClick={() => handleCopyKey(generatedKey)}
                  >
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  License Key
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <Input
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="e.g. FM-COMMUNITY-XXXX-XXXX-XXXX or FM-SPONSOR-XXXX..."
                    autoFocus
                  />
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={async () => {
                      try {
                        const txt = await navigator.clipboard.readText();
                        setInputKey(txt.trim());
                      } catch {}
                    }}
                  >
                    Paste
                  </Button>
                </div>

                {/* Validation Status Indicator */}
                {validationState && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: validationState.isValid ? "var(--status-success)" : "var(--status-danger)",
                    }}
                  >
                    {validationState.isValid ? (
                      <>
                        <CheckCircle2 size={14} /> Valid {validationState.tier || validationState.type} Key
                      </>
                    ) : (
                      <>
                        ✕ {validationState.error || "Invalid license format"}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Supporter Name / Credit (Optional) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Your Name / Studio Name (Optional credit)
                </label>
                <Input
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Apex Graphic Studio"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => setCurrentStep("choose-path")}>
                  Back to Options
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  isLoading={isActivating}
                  disabled={!validationState?.isValid}
                  onClick={handleActivate}
                  leftIcon={<Key size={14} />}
                >
                  Activate & Unlock FolderMate
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
