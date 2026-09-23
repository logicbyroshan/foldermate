import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  Heart,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Key,
  Lock,
  Globe,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "./ui/Button.js";
import { Badge } from "./ui/Badge.js";
import { Input } from "./ui/Input.js";
import { useToast } from "./ui/Toast.js";
import { validateLicenseKey } from "../utils/license-validator.js";
import { LicenseStatus } from "@foldermate/shared";

interface ActivationModalProps {
  isOpen: boolean;
  onActivated: (status: LicenseStatus) => void;
  onClose?: () => void;
  isClosable?: boolean;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({
  isOpen,
  onActivated,
  onClose,
  isClosable = true,
}) => {
  const { showToast } = useToast();
  const [inputKey, setInputKey] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && (isClosable || onClose)) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isClosable, onClose]);

  if (!isOpen) return null;

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputKey(text.trim());
        showToast("Key pasted from clipboard", "info");
      }
    } catch {
      showToast("Unable to read clipboard. Please paste manually (Ctrl+V)", "warning");
    }
  };

  const handleOpenLandingPageTasks = () => {
    // Open the landing page free key generator
    const landingUrl = window.location.hostname === "localhost"
      ? "http://localhost:5200/#get-key"
      : "https://foldermate.app/#get-key";
    window.open(landingUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenSponsorPortal = () => {
    window.open("https://github.com/sponsors/FolderMate", "_blank", "noopener,noreferrer");
  };

  const handleActivate = async () => {
    const key = inputKey.trim();
    const validation = validateLicenseKey(key);

    if (!validation.isValid) {
      showToast(validation.error || "Invalid license key format", "error");
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

      showToast(`FolderMate activated successfully as ${validation.tier || validation.type}!`, "success");
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
      onClick={(e) => {
        if (e.target === e.currentTarget && (isClosable || onClose)) {
          onClose?.();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
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
          maxWidth: 620,
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border-medium)",
          borderRadius: 12,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
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
            background: "var(--bg-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: "var(--accent-amber-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--border-medium)",
              }}
            >
              <img src="/logo.png?v=2" alt="Logo" style={{ width: 24, height: 24, objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                FolderMate License Activation
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
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: "4px 8px" }} title="Close">
                <X size={15} />
              </Button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "22px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Main Direct Key Entry Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Key size={15} color="var(--accent-amber)" /> Enter License Key
                </label>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  Paste your Community key, Sponsor key, or Lifetime VIP code
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Input
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="FM-COMMUNITY-XXXX-XXXX-XXXX or FM-SPONSOR-..."
                autoFocus
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              />
              <Button
                variant="secondary"
                size="md"
                onClick={handlePasteKey}
                style={{ flexShrink: 0 }}
              >
                📋 Paste
              </Button>
            </div>

            {/* Validation State Feedback */}
            {validationState && (
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "8px 12px",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: validationState.isValid
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${
                    validationState.isValid ? "var(--status-success)" : "var(--status-danger)"
                  }`,
                  color: validationState.isValid
                    ? "var(--status-success-text)"
                    : "var(--status-danger-text)",
                }}
              >
                {validationState.isValid ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Valid {validationState.tier || validationState.type} Key</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={15} />
                    <span>{validationState.error || "Invalid license key"}</span>
                  </>
                )}
              </div>
            )}

            {/* Optional Studio / User Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                Your Name / Studio Name (Optional)
              </label>
              <Input
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Apex Graphic Studio"
                style={{ fontSize: 12 }}
              />
            </div>

            {/* Activation Submit Button */}
            <Button
              variant="primary"
              size="lg"
              isLoading={isActivating}
              disabled={!validationState?.isValid}
              onClick={handleActivate}
              leftIcon={<Sparkles size={16} />}
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 6,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Activate & Unlock FolderMate
            </Button>
          </div>

          <div
            style={{
              height: 1,
              backgroundColor: "var(--border-subtle)",
              margin: "4px 0",
            }}
          />

          {/* Helper Section: Don't have a key yet? */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>
              Don't have a license key yet?
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Option 1: Free Community Key on Website */}
              <div
                style={{
                  padding: "14px 14px",
                  backgroundColor: "var(--bg-canvas)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <Badge variant="success" size="sm">
                      100% Free
                    </Badge>
                    <Globe size={14} color="var(--status-success)" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>
                    Community Key
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                    Complete 3 quick tasks on our website (Star repo, follow) to generate a free key.
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<ExternalLink size={12} />}
                  onClick={handleOpenLandingPageTasks}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Get Free Key ↗
                </Button>
              </div>

              {/* Option 2: Sponsor / Supporter */}
              <div
                style={{
                  padding: "14px 14px",
                  backgroundColor: "var(--bg-canvas)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <Badge variant="amber" size="sm">
                      Supporter
                    </Badge>
                    <Heart size={14} color="#f43f5e" fill="#f43f5e" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>
                    Project Supporter
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                    Support project development and get a universal lifetime reusable key for all machines.
                  </div>
                </div>

                <Button
                  variant="amber"
                  size="sm"
                  rightIcon={<ExternalLink size={12} />}
                  onClick={handleOpenSponsorPortal}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Support Project
                </Button>
              </div>
            </div>
          </div>

          {/* Offline Security Footer Note */}
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "var(--bg-canvas)",
              borderRadius: 6,
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              color: "var(--text-secondary)",
            }}
          >
            <Lock size={13} color="var(--status-success)" style={{ flexShrink: 0 }} />
            <span>
              <strong>100% Offline Cryptographic Validation</strong> — No internet connection required to validate or run FolderMate.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
