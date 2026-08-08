import dotenv from "dotenv";

dotenv.config();

const response = await fetch("http://localhost:8000/api/analytics/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    "X-Forwarded-For": "102.219.153.194",
  },
  body: JSON.stringify({
    event: "page_view",
    page: "/geolocation-test",
    title: "Geolocation Test",
    source: "website",
  }),
});

const data = await response.json();

console.log("HTTP Status:", response.status);
console.dir(data, { depth: null });
