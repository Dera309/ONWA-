export const paymentConfig = {
  lemonSqueezy: {
    apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    storeId: process.env.LEMON_SQUEEZY_STORE_ID,
    webhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET,
    checkoutUrl: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL,
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
};

export const licenseTypes = {
  PERSONAL: {
    name: "Personal Use",
    description: "For personal projects and non-commercial use",
    priceMultiplier: 1,
    maxDownloads: 5,
    expiresIn: null,
  },
  COMMERCIAL: {
    name: "Commercial Use",
    description: "For commercial projects and client work",
    priceMultiplier: 2.5,
    maxDownloads: 10,
    expiresIn: null,
  },
  EXTENDED_COMMERCIAL: {
    name: "Extended Commercial",
    description: "For unlimited commercial use and resale",
    priceMultiplier: 5,
    maxDownloads: 25,
    expiresIn: null,
  },
} as const;

export const resolutions = [
  { name: "Web", width: 1920, height: 1080, dpi: 72, priceMultiplier: 1 },
  { name: "Print", width: 6000, height: 4000, dpi: 300, priceMultiplier: 2 },
  { name: "Ultra", width: 12000, height: 8000, dpi: 300, priceMultiplier: 3 },
] as const;
