import dotenv from "dotenv";

dotenv.config();

const ip = "102.219.153.216";
const token = process.env.IPINFO_TOKEN;

if (!token) {
  console.error("❌ IPINFO_TOKEN is not configured.");
  process.exit(1);
}

console.log("✅ IPINFO_TOKEN is loaded.");
console.log("🔎 Testing IP:", ip);

try {
  const response = await fetch(
    `https://api.ipinfo.io/lite/${ip}?token=${token}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  console.log("HTTP Status:", response.status);

  const data = await response.json();

  console.dir(data, { depth: null });
} catch (error) {
  console.error("❌ IPinfo request failed:");
  console.error(error);
}
