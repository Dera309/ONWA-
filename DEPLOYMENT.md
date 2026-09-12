# ONWA Deployment Guide

This guide covers deploying ONWA to production using Vercel.

## Prerequisites

- Vercel account
- MongoDB Atlas account
- Clerk account
- Cloudflare R2 account
- Domain name (optional)

## Environment Variables

Add these environment variables in Vercel:

### Database
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/onwa?retryWrites=true&w=majority
```

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Cloudflare R2
```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=onwa-artworks
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### Lemon Squeezy
```
LEMON_SQUEEZY_API_KEY=your_api_key
LEMON_SQUEEZY_STORE_ID=your_store_id
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL=https://your-store.lemonsqueezy.com/checkout
```

### Paystack
```
PAYSTACK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
```

### Resend
```
RESEND_API_KEY=re_...
```

### Analytics
```
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_CLARITY_ID=...
```

### App
```
NEXT_PUBLIC_APP_URL=https://onwa.art
```

## Deployment Steps

### 1. Prepare MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier for development)
3. Create a database user
4. Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for development)
5. Get the connection string

### 2. Set up Clerk

1. Create a Clerk account
2. Create a new application
3. Configure JWT template
4. Add allowed redirect URLs:
   - `https://onwa.art`
   - `https://onwa.art/sign-in`
   - `https://onwa.art/sign-up`
   - `https://onwa.art/dashboard`
5. Copy API keys

### 3. Set up Cloudflare R2

1. Create a Cloudflare account
2. Enable R2 in your account
3. Create a bucket named `onwa-artworks`
4. Create an API token with R2 permissions
5. Configure CORS for the bucket:
```json
{
  "AllowedOrigins": ["https://onwa.art"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3600
}
```

### 4. Set up Lemon Squeezy

1. Create a Lemon Squeezy account
2. Create a store
3. Create products for each artwork resolution
4. Configure webhook URL: `https://onwa.art/api/webhooks/lemon-squeezy`
5. Copy API keys

### 5. Set up Paystack

1. Create a Paystack account
2. Get your API keys
3. Configure webhook URL: `https://onwa.art/api/webhooks/paystack`

### 6. Set up Resend

1. Create a Resend account
2. Verify your domain
3. Create an API key
4. Set up email templates

### 7. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add all environment variables
7. Click "Deploy"

### 8. Configure Domain

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Wait for SSL certificate to provision

### 9. Seed Database

After deployment, seed the database:

```bash
vercel env pull .env.local
npm run db:push
npm run db:seed
```

Or use Vercel CLI:

```bash
vercel run db:push
vercel run db:seed
```

### 10. Configure Webhooks

Update webhook URLs in:
- Lemon Squeezy dashboard
- Paystack dashboard

## Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Test payment flow (Lemon Squeezy)
- [ ] Test payment flow (Paystack)
- [ ] Test download generation
- [ ] Test email delivery
- [ ] Verify analytics tracking
- [ ] Test search functionality
- [ ] Verify image optimization
- [ ] Test responsive design
- [ ] Run Lighthouse audit
- [ ] Set up error monitoring (Sentry)
- [ ] Configure backup strategy
- [ ] Set up monitoring alerts

## Performance Optimization

### Image Optimization

Ensure all images are optimized:
- Use WebP format
- Implement lazy loading
- Use appropriate sizes
- Enable CDN caching

### Caching Strategy

Configure caching headers in `next.config.js`:
- Static assets: 1 year
- API responses: 5 minutes
- HTML pages: revalidate on demand

### Database Indexing

Ensure all critical queries have indexes:
- Slug lookups
- Status filters
- Date ranges
- Foreign keys

## Security Checklist

- [ ] Enable HTTPS only
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Enable CORS for R2
- [ ] Rotate API keys regularly
- [ ] Enable audit logging
- [ ] Set up intrusion detection
- [ ] Configure firewall rules
- [ ] Enable DDoS protection

## Monitoring

### Vercel Analytics

Enable Vercel Analytics for:
- Web Vitals
- Page views
- User demographics

### Google Analytics

Add GA tracking ID to environment variables.

### Microsoft Clarity

Add Clarity ID to environment variables.

### Error Tracking

Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Backup Strategy

### Database Backups

MongoDB Atlas provides:
- Automated daily backups
- Point-in-time recovery
- Cross-region replication

### Storage Backups

Enable R2 bucket replication:
- Cross-region replication
- Versioning enabled
- Lifecycle policies

## Scaling

### Horizontal Scaling

Vercel automatically scales:
- Serverless functions
- Edge functions
- Static assets

### Database Scaling

MongoDB Atlas scales:
- Read replicas
- Sharding
- Auto-scaling

### CDN Scaling

Cloudflare R2 provides:
- Global edge network
- Automatic caching
- DDoS protection

## Troubleshooting

### Build Errors

Check:
- Node version compatibility
- Environment variables
- Dependency versions
- TypeScript errors

### Runtime Errors

Check:
- Database connection
- API credentials
- CORS configuration
- Network connectivity

### Performance Issues

Check:
- Image sizes
- Bundle size
- Database queries
- CDN caching

## Support

For deployment issues:
- Vercel documentation: https://vercel.com/docs
- MongoDB Atlas docs: https://docs.atlas.mongodb.com
- Clerk docs: https://clerk.com/docs
- Cloudflare R2 docs: https://developers.cloudflare.com/r2

---

Last updated: July 2026
