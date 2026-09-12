import axios from "axios";
import { createHmac } from "crypto";

const LEMON_SQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";
const API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
const STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL;

const api = axios.create({
  baseURL: LEMON_SQUEEZY_API_URL,
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

export interface CheckoutOptions {
  artworkId: string;
  resolution: string;
  licenseType: string;
  price: number;
  customerEmail?: string;
  customerName?: string;
}

export async function createCheckout(options: CheckoutOptions) {
  try {
    const response = await api.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              artwork_id: options.artworkId,
              resolution: options.resolution,
              license_type: options.licenseType,
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: options.artworkId, // In production, this would be the variant ID
            },
          },
        },
      },
    });

    const checkoutUrl = response.data.data.attributes.url;
    return checkoutUrl;
  } catch (error) {
    console.error("Lemon Squeezy checkout error:", error);
    throw new Error("Failed to create checkout");
  }
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!webhookSecret) return false;

  const hmac = createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  return hmac === signature;
}

export interface WebhookEvent {
  meta: {
    event_name: string;
    custom_data: {
      artwork_id: string;
      resolution: string;
      license_type: string;
    };
  };
  data: {
    id: string;
    attributes: {
      first_order_item: {
        total: number;
      };
      customer_email: string;
      customer_name: string;
      status: string;
    };
  };
}

export async function handleWebhook(event: WebhookEvent) {
  const { meta, data } = event;

  switch (meta.event_name) {
    case "order_created":
      // Handle order creation
      break;
    case "order_refunded":
      // Handle refund
      break;
    default:
      console.log(`Unhandled event: ${meta.event_name}`);
  }
}
