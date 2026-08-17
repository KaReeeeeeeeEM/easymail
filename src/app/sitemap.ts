import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://easymail.almareem.com";
  return ["", "/docs", "/sign-in", "/sign-up", "/privacy", "/terms"].map(
    (path, index) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: index === 0 ? "weekly" : "monthly",
      priority: index === 0 ? 1 : path === "/docs" ? 0.9 : 0.6,
    }),
  );
}
