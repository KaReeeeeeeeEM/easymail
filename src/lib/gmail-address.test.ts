import { describe, expect, it } from "vitest";

import { normalizeGmailAddress } from "./gmail-address";

describe("normalizeGmailAddress", () => {
  it("normalizes a Gmail address", () => {
    expect(normalizeGmailAddress("  User.Name+mail@GMAIL.COM ")).toBe("user.name+mail@gmail.com");
  });

  it.each([
    "user@example.com",
    "user@googlemail.com",
    "user@gmail.com.example.org",
    "@gmail.com",
    "user @gmail.com",
  ])("rejects non-Gmail or malformed address %s", (email) => {
    expect(() => normalizeGmailAddress(email)).toThrow("@gmail.com");
  });
});
