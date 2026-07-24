import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? site.name).slice(0, 120);
  const subtitle = (searchParams.get("subtitle") ?? site.role).slice(0, 160);
  const tag = searchParams.get("tag") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090d",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(99,102,241,0.35), transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -140,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(34,211,238,0.22), transparent 60%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            DP
          </div>
          <div style={{ color: "#9a9db0", fontSize: 28, fontWeight: 600 }}>
            {site.name}
          </div>
          {tag ? (
            <div
              style={{
                marginLeft: "auto",
                color: "#818cf8",
                fontSize: 24,
                border: "1px solid #23273a",
                borderRadius: 9999,
                padding: "6px 18px",
              }}
            >
              {tag}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#e8e9ee",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ color: "#9a9db0", fontSize: 30, maxWidth: 900 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#6a6d80",
            fontSize: 24,
          }}
        >
          <div
            style={{
              width: 40,
              height: 6,
              borderRadius: 9999,
              background: "linear-gradient(90deg, #818cf8, #22d3ee)",
            }}
          />
          {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
