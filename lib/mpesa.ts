/**
 * M-Pesa Daraja Utility Helper Library
 * Provides phone number normalization, password generation,
 * OAuth token management, and STK Push utilities.
 */

export interface PhoneNormalizationResult {
  valid: boolean;
  formatted: string;
  original: string;
  error?: string;
}

/**
 * Normalizes Kenyan mobile numbers to Safaricom's required format: 2547XXXXXXXX or 2541XXXXXXXX
 * Handles formats:
 * - 0712345678 -> 254712345678
 * - 0112345678 -> 254112345678 (newer Safaricom prefixes)
 * - +254 712 345 678 -> 254712345678
 * - 254712345678 -> 254712345678
 * - 712345678 -> 254712345678
 * - 112345678 -> 254112345678
 */
export function normalizeKenyanPhoneNumber(rawPhone: string): PhoneNormalizationResult {
  if (!rawPhone || typeof rawPhone !== "string") {
    return {
      valid: false,
      formatted: "",
      original: String(rawPhone || ""),
      error: "Phone number is required.",
    };
  }

  // Remove spaces, hyphens, plus signs, brackets
  let cleaned = rawPhone.replace(/[\s\-\+\(\)]/g, "");

  // Convert 07... or 01... to 2547... or 2541...
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  }
  // Convert 7... or 1... (9 digits) to 2547... or 2541...
  else if (cleaned.length === 9 && (cleaned.startsWith("7") || cleaned.startsWith("1"))) {
    cleaned = "254" + cleaned;
  }

  // Validate standard Kenyan MSISDN: 254 followed by 7 or 1 and 8 digits (12 digits total)
  const kenyanRegex = /^254(7|1)\d{8}$/;

  if (!kenyanRegex.test(cleaned)) {
    return {
      valid: false,
      formatted: cleaned,
      original: rawPhone,
      error: `Invalid Kenyan mobile number "${rawPhone}". Must be a valid Safaricom/Airtel number (e.g. 07XXXXXXXX or 01XXXXXXXX).`,
    };
  }

  return {
    valid: true,
    formatted: cleaned,
    original: rawPhone,
  };
}

/**
 * Generates Daraja STK Push timestamp in YYYYMMDDHHmmss format
 */
export function getDarajaTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Generates Daraja STK Push Base64 password:
 * Base64.encode(BusinessShortCode + Passkey + Timestamp)
 */
export function generateDarajaPassword(
  shortCode: string,
  passkey: string,
  timestamp: string
): string {
  return Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
}

/**
 * Fetches OAuth bearer access token from Safaricom Daraja
 */
export async function getDarajaAccessToken(): Promise<string | null> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const env = process.env.MPESA_ENVIRONMENT || "sandbox";

  // Check if live credentials are configured
  if (
    !consumerKey ||
    !consumerSecret ||
    consumerKey === "mock_daraja_consumer_key" ||
    consumerSecret.startsWith("mock")
  ) {
    return null; // Dev/simulation mode
  }

  const authUrl =
    env === "production"
      ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
      : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const res = await fetch(authUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    });

    if (!res.ok) {
      console.warn("[Daraja OAuth] Failed to get token, status:", res.status);
      return null;
    }

    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.warn("[Daraja OAuth] Network error fetching access token:", err);
    return null;
  }
}
