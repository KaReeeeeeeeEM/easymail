export function normalizeGmailAddress(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@gmail\.com$/.test(normalized)) {
    throw new Error("Use a valid Gmail address ending in @gmail.com.");
  }
  return normalized;
}
