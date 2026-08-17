import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: ["/", "/docs"], disallow: ["/dashboard/", "/superadmin/", "/api/", "/two-factor", "/verify-email", "/reset-password"] }, sitemap: "https://easymail.almareem.com/sitemap.xml", host: "https://easymail.almareem.com" }; }
