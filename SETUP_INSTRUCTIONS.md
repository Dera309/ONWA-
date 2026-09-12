# ONWA Setup Instructions

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Clerk account (free tier works)
- Git installed

## Installation Steps

### 1. Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install:
- Next.js 15+ and React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- Clerk authentication
- shadcn/ui dependencies
- Framer Motion
- React Hook Form
- Zod validation
- And all other dependencies listed in package.json

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials:

#### Required Variables

```env
# Database (MongoDB Atlas)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/onwa?retryWrites=true&w=majority"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Optional Variables (for full functionality)

```env
# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=onwa-artworks
R2_PUBLIC_URL=https://your-bucket.r2.dev

# Lemon Squeezy (International payments)
LEMON_SQUEEZY_API_KEY=your_api_key
LEMON_SQUEEZY_STORE_ID=your_store_id
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL=https://your-store.lemonsqueezy.com/checkout

# Paystack (Nigeria payments)
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

# Resend Email
RESEND_API_KEY=re_...

# Analytics
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_CLARITY_ID=...
```

### 3. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier: M0)
4. Create a database user with username and password
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get the connection string and add it to `DATABASE_URL`

### 4. Set Up Clerk

1. Go to [Clerk](https://clerk.com)
2. Create a free account
3. Create a new application
4. In your application settings:
   - Copy the Publishable Key to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy the Secret Key to `CLERK_SECRET_KEY`
5. Configure allowed redirect URLs in Clerk dashboard:
   - Add `http://localhost:3000`
   - Add `http://localhost:3000/sign-in`
   - Add `http://localhost:3000/sign-up`
   - Add `http://localhost:3000/dashboard`

### 5. Initialize Database

Run the following commands to set up the database schema:

```bash
npm run db:push
```

This will push the Prisma schema to your MongoDB database.

### 6. Seed Database (Optional)

To populate the database with sample data:

```bash
npm run db:seed
```

Note: You'll need to create the seed file at `prisma/seed.ts` first.

### 7. Start Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Status

### Completed ✅

- Architecture design
- Database schema design
- Project structure
- Next.js initialization
- Tailwind CSS configuration with Lunar Noir Luxury design system
- Prisma ORM setup with complete schema
- Base layout with Clerk authentication
- Homepage (ONWA the African Story)
- Configuration files (site, moon phases, payments)
- Documentation (README, DEPLOYMENT)
- Essential UI components (Button, Input, Label, Tag, LoadingSpinner)

### In Progress 🚧

- shadcn/ui component setup

### Pending ⏳

- Clerk authentication integration
- Base layout and navigation components
- Museum Mode experience
- Gallery Mode
- Artwork detail pages
- Collection pages
- Collector dashboard
- Admin dashboard
- Payment integration (Lemon Squeezy + Paystack)
- Search functionality
- SEO optimization
- Cloudflare R2/AWS S3 storage setup
- Download security with signed URLs
- Analytics integration
- Email setup with Resend
- GitHub Actions CI/CD

## Next Steps

1. **Install dependencies**: Run `npm install`
2. **Set up environment variables**: Configure MongoDB and Clerk
3. **Initialize database**: Run `npm run db:push`
4. **Start development**: Run `npm run dev`
5. **Build navigation**: Create Header and Footer components
6. **Build Museum Mode**: Implement the flagship museum experience
7. **Build Gallery Mode**: Create the gallery browsing interface
8. **Integrate authentication**: Complete Clerk setup
9. **Build admin dashboard**: Create content management system
10. **Implement payments**: Add Lemon Squeezy and Paystack

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors about missing modules:
- Run `npm install` to install all dependencies
- Restart your TypeScript server in your IDE

### Database Connection Issues

- Verify your MongoDB Atlas connection string
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure your database user has the correct permissions

### Clerk Authentication Issues

- Verify your API keys are correct
- Check that redirect URLs are configured in Clerk dashboard
- Ensure NEXT_PUBLIC_APP_URL matches your local development URL

### Build Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run build`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Support

For issues or questions:
- Check the ARCHITECTURE.md for system design details
- Check the DATABASE_SCHEMA.md for database documentation
- Check the DEPLOYMENT.md for deployment guidance
- Review the design system in `stitch_onwa_african_digital_museum/lunar_noir_luxury/DESIGN.md`

---

Last updated: July 2026
