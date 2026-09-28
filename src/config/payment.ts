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
  {
    name: "High-Resolution Artwork",
    label: "High-Resolution Artwork",
    aspectRatio: "Master",
    width: 4800,
    height: 6000,
    dpi: 300,
    description: "Ultra high-resolution archival master file",
    priceMultiplier: 1,
  },
  {
    name: "4:5 print version",
    label: "4:5 print version",
    aspectRatio: "4:5",
    width: 4000,
    height: 5000,
    dpi: 300,
    description: "Standard ratio for 8×10, 16×20, 24×30 in prints",
    priceMultiplier: 1,
  },
  {
    name: "2:3 print version",
    label: "2:3 print version",
    aspectRatio: "2:3",
    width: 4000,
    height: 6000,
    dpi: 300,
    description: "Standard ratio for 4×6, 8×12, 12×18, 20×30, 24×36 in prints",
    priceMultiplier: 1,
  },
  {
    name: "3:4 print version",
    label: "3:4 print version",
    aspectRatio: "3:4",
    width: 4500,
    height: 6000,
    dpi: 300,
    description: "Standard ratio for 6×8, 9×12, 12×16, 18×24 in prints",
    priceMultiplier: 1,
  },
] as const;
