import { describe, expect, it } from "vitest";

import { sendEmailSchema } from "./send-email";

describe("sendEmailSchema", () => {
  it("accepts a text email", () => {
    expect(sendEmailSchema.safeParse({ to: "person@example.com", subject: "Hello", text: "World" }).success).toBe(true);
  });

  it("requires a body", () => {
    expect(sendEmailSchema.safeParse({ to: "person@example.com", subject: "Hello" }).success).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(sendEmailSchema.safeParse({ to: "person@example.com", subject: "Hello", text: "World", from: "spoof@example.com" }).success).toBe(false);
  });
});
