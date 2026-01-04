import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Luframe - Agentic Meeting Platform for Real-Time Execution";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #f0f9ff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #eff6ff 0%, transparent 50%)",
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "9999px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "18px", color: "#6b7280" }}>
            Backed by Microsoft for Startups
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#111827",
              lineHeight: 1.1,
              margin: 0,
              padding: "0 40px",
            }}
          >
            From post-meeting chaos
          </h1>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#111827",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            to{" "}
            <span style={{ color: "#2563eb" }}>real-time execution</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "24px",
            color: "#6b7280",
            marginTop: "32px",
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          AI-powered transcription, automatic insight detection, agenda tracking,
          and instant drafts
        </p>

        {/* Logo and brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "48px",
            padding: "16px 32px",
            backgroundColor: "#111827",
            borderRadius: "12px",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Luframe
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
