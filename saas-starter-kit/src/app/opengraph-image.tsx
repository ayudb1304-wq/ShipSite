import { ImageResponse } from "next/og";

/**
 * OpenGraph Image Generation
 * 
 * Generates dynamic OG images for better social media sharing.
 * This creates the /opengraph-image route automatically.
 */

export const runtime = "edge";
export const alt = "SaaSKit - Ship Your SaaS in Days, Not Months";
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
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139, 92, 246, 0.15), transparent)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #8B5CF6, #14B8A6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "white",
              }}
            >
              S
            </span>
          </div>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "white",
            }}
          >
            SaaSKit
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 600,
            color: "white",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Ship your SaaS in{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #14B8A6)",
              backgroundClip: "text",
              color: "transparent",
              marginLeft: 12,
            }}
          >
            days, not months
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: "#9CA3AF",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          The complete Next.js starter kit with auth, payments, and beautiful UI
        </div>

        {/* Tech stack pills */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            gap: 16,
          }}
        >
          {["Next.js", "TypeScript", "Supabase", "Stripe", "Tailwind"].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 20px",
                  borderRadius: 100,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#E5E7EB",
                  fontSize: 18,
                }}
              >
                {tech}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
