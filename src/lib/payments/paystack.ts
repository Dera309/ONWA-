import axios from "axios";
import { createHmac } from "crypto";

const PAYSTACK_API_URL = "https://api.paystack.co";

function getClient() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  return axios.create({
    baseURL: PAYSTACK_API_URL,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });
}

export interface CheckoutOptions {
  artworkId: string;
  resolution: string;
  licenseType: string;
  amount: number;
  email: string;
  currency?: string;
  metadata?: Record<string, any>;
}

export async function initializeTransaction(options: CheckoutOptions) {
  const client = getClient();
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/$/, "");

  const targetCurrency = process.env.PAYSTACK_CURRENCY || "NGN";
  const rate = parseFloat(process.env.USD_NGN_RATE || "1500");

  let chargeAmount = options.amount;
  let chargeCurrency = targetCurrency;

  if (chargeCurrency === "NGN" && (options.currency === "USD" || !options.currency)) {
    chargeAmount = options.amount * rate;
  }

  const payload = {
    amount: Math.round(chargeAmount * 100), // Lowest currency unit (cents/kobo)
    email: options.email,
    currency: chargeCurrency,
    metadata: {
      artwork_id: options.artworkId,
      resolution: options.resolution,
      license_type: options.licenseType,
      original_amount_usd: options.amount,
      ...options.metadata,
    },
    callback_url: `${baseUrl}/payment/paystack/verify`,
  };

  try {
    const response = await client.post("/transaction/initialize", payload);
    return response.data.data;
  } catch (error: any) {
    // If USD is rejected because the integration is in NGN mode, auto-retry with NGN
    if (error.response?.data?.code === "unsupported_currency" && chargeCurrency !== "NGN") {
      try {
        const retryPayload = {
          ...payload,
          amount: Math.round(options.amount * rate * 100),
          currency: "NGN",
        };
        const retryResponse = await client.post("/transaction/initialize", retryPayload);
        return retryResponse.data.data;
      } catch (retryError: any) {
        const msg = retryError.response?.data?.message || retryError.message || "Failed to initialize transaction";
        console.error("Paystack initialization retry error:", msg, retryError.response?.data);
        throw new Error(msg);
      }
    }

    const msg = error.response?.data?.message || error.message || "Failed to initialize transaction";
    console.error("Paystack initialization error:", msg, error.response?.data);
    throw new Error(msg);
  }
}

export async function verifyTransaction(reference: string) {
  try {
    const client = getClient();
    const response = await client.get(`/transaction/verify/${reference}`);
    return response.data.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Failed to verify transaction";
    console.error("Paystack verification error:", msg, error.response?.data);
    throw new Error(msg);
  }
}

export interface WebhookEvent {
  event: string;
  data: {
    reference: string;
    amount: number;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
    metadata: {
      artwork_id: string;
      resolution: string;
      license_type: string;
    };
    status: string;
  };
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || "";
  const hash = createHmac("sha512", secretKey)
    .update(payload)
    .digest("hex");

  return hash === signature;
}

export async function handleWebhook(event: WebhookEvent) {
  const { event: eventName, data } = event;

  switch (eventName) {
    case "charge.success":
      // Handle successful payment
      break;
    case "charge.failed":
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event: ${eventName}`);
  }
}
