import dotenv from "dotenv";
import { getIPGeolocation } from "../utils/analyticsHelpers.js";

dotenv.config();

const ip = "102.219.153.194";

console.log("🔎 Testing IP:", ip);

const result = await getIPGeolocation(ip);

console.log("🌍 Geolocation result:");
console.dir(result, { depth: null });
