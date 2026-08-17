import { afterEach, describe, expect, it } from "vitest";

import { decryptCredential, encryptCredential } from "./credential-crypto";

const originalKey = process.env.APP_ENCRYPTION_KEY;
afterEach(() => { process.env.APP_ENCRYPTION_KEY = originalKey; });

describe("credential encryption", () => {
  it("round-trips without storing plaintext", () => {
    process.env.APP_ENCRYPTION_KEY = "a".repeat(64);
    const encrypted = encryptCredential("google-app-password");
    expect(encrypted).not.toContain("google-app-password");
    expect(decryptCredential(encrypted)).toBe("google-app-password");
  });

  it("rejects an invalid key", () => {
    process.env.APP_ENCRYPTION_KEY = "short";
    expect(() => encryptCredential("secret")).toThrow(/64-character/);
  });
});
