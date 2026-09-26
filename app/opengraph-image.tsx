import { ImageResponse } from "next/og";

export const alt =
  "Marketa AI turns one promotion idea into a complete campaign.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#07080d",
          backgroundImage:
            "radial-gradient(circle at 75% 20%, rgba(34, 211, 238, 0.24), transparent 34%), radial-gradient(circle at 18% 70%, rgba(59, 130, 246, 0.3), transparent 38%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(103, 232, 249, 0.2)",
            borderRadius: "40px",
            display: "flex",
            flexDirection: "column",
            padding: "64px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#67e8f9",
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            MARKETA AI
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.04,
              marginTop: 34,
              maxWidth: 920,
            }}
          >
            Turn one thought into a complete campaign.
          </div>
          <div
            style={{
              color: "#94a3b8",
              display: "flex",
              fontSize: 28,
              lineHeight: 1.4,
              marginTop: 34,
            }}
          >
            Brand-aware copy, WhatsApp promotions, ads and static posters.
          </div>
        </div>
      </div>
    ),
    size
  );
}
