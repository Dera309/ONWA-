import axios from "axios";
import { createHmac } from "crypto";

const PAYSTACK_API_URL = "https://api.paystack.co";
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

const api = axios.create({
  baseURL: PAYSTACK_API_URL,
  headers: {
    Authorization: `Bearer ${SECRET_KEY}`,
  },
});

export interface CheckoutOptions {
  artworkId: string;
  resolution: string;
  licenseType: string;
  amount: number;
  email: string;
  metadata?: Record<string, any>;
}

export async function initializeTransaction(options: CheckoutOptions) {
  try {
    const baseUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    ).replace(/\/$/, "");

    const response = await api.post("/transaction/initialize", {
      amount: options.amount * 100, // Paystack expects amount in kobo
      email: options.email,
      metadata: {
        artwork_id: options.artworkId,
        resolution: options.resolution,
        license_type: options.licenseType,
        ...options.metadata,
      },
      callback_url: `${baseUrl}/payment/paystack/verify`,
    });

    return response.data.data;
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw new Error("Failed to initialize transaction");
  }
}

export async function verifyTransaction(reference: string) {
  try {
    const response = await api.get(`/transaction/verify/${reference}`);
    return response.data.data;
  } catch (error) {
    console.error("Paystack verification error:", error);
    throw new Error("Failed to verify transaction");
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
  const hash = createHmac("sha512", SECRET_KEY || "")
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
