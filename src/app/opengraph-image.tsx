import { ImageResponse } from "next/og";
export const alt = "easymail reusable Gmail and SMTP API";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0b0b0d", color: "white", fontFamily: "sans-serif" }}><div style={{ color: "#FF9100", fontSize: 76, fontWeight: 800 }}>easymail</div><div style={{ marginTop: 28, maxWidth: 900, fontSize: 54, lineHeight: 1.1, fontWeight: 700 }}>One reusable email API for every application.</div><div style={{ marginTop: 30, fontSize: 28, color: "#b7b7bd" }}>Gmail · SMTP · Rotatable API keys · Delivery tracking</div></div>, size); }
