const requiredVariables = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "GEMINI_API_KEY",
];

const problems = [];

for (const name of requiredVariables) {
  if (!process.env[name]?.trim()) {
    problems.push(`${name} is missing.`);
  }
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "";
const secretKey = process.env.CLERK_SECRET_KEY?.trim() || "";

function hasValidProductionPublishableKey(value) {
  if (!value.startsWith("pk_live_")) return false;

  const encodedValue = value.slice("pk_live_".length);

  try {
    const decodedValue = Buffer.from(encodedValue, "base64").toString("utf8");
    return decodedValue.endsWith("$") && decodedValue.slice(0, -1).includes(".");
  } catch {
    return false;
  }
}

if (appUrl && !appUrl.startsWith("https://")) {
  problems.push("NEXT_PUBLIC_APP_URL must use HTTPS for production.");
}

if (publishableKey && !hasValidProductionPublishableKey(publishableKey)) {
  problems.push("Clerk is not using a valid production publishable key.");
}

if (secretKey && !secretKey.startsWith("sk_live_")) {
  problems.push("Clerk is not using a production secret key.");
}

if (!process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim()) {
  console.warn(
    "Warning: NEXT_PUBLIC_SUPPORT_EMAIL is empty; the support page will use the founder-beta Instagram contact."
  );
}

if (problems.length > 0) {
  console.error("\nMarketa AI is not ready for a public production launch:\n");
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

console.log("Launch environment check passed.");
