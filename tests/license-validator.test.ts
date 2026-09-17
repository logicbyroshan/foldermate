import { describe, it, expect } from "vitest";
import {
  generateCommunityKey,
  generateSponsorKey,
  validateLicenseKey,
} from "../apps/desktop/src/renderer/utils/license-validator.js";

describe("License Validator & Key Generator", () => {
  it("generates and validates community keys correctly", () => {
    const key = generateCommunityKey();
    expect(key).toMatch(/^FM-COMMUNITY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);

    const validation = validateLicenseKey(key);
    expect(validation.isValid).toBe(true);
    expect(validation.type).toBe("COMMUNITY");
  });

  it("generates and validates sponsor & VIP keys correctly", () => {
    const sponsorKey = generateSponsorKey("SPONSOR");
    expect(sponsorKey).toMatch(/^FM-SPONSOR-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    const v1 = validateLicenseKey(sponsorKey);
    expect(v1.isValid).toBe(true);
    expect(v1.type).toBe("SPONSOR");

    const vipKey = generateSponsorKey("VIP");
    expect(vipKey).toMatch(/^FM-VIP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    const v2 = validateLicenseKey(vipKey);
    expect(v2.isValid).toBe(true);
    expect(v2.type).toBe("VIP");
  });

  it("recognizes universal lifetime hero master keys", () => {
    const res = validateLicenseKey("FM-SPONSOR-GOLD-LIFETIME-VIP");
    expect(res.isValid).toBe(true);
    expect(res.type).toBe("VIP");
  });

  it("rejects invalid or tampered license keys", () => {
    const res1 = validateLicenseKey("FM-COMMUNITY-AAAA-BBBB-FFFF");
    expect(res1.isValid).toBe(false);

    const res2 = validateLicenseKey("INVALID-KEY");
    expect(res2.isValid).toBe(false);

    const res3 = validateLicenseKey("");
    expect(res3.isValid).toBe(false);
  });
});
