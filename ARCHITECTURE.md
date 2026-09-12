# ONWA - Architecture Document

## Executive Summary

ONWA is a luxury digital museum and marketplace for African storytelling through AI-assisted digital art. This architecture prioritizes scalability, maintainability, security, accessibility, and exceptional user experience for millions of visitors.

---

## Technology Stack Decisions

### Frontend Framework: Next.js 15+ with App Router

**Decision:** Next.js 15+ with App Router over alternatives (Nuxt.js, SvelteKit, Remix)

**Rationale:**
- **Server Components by Default:** Reduces JavaScript bundle size, improves SEO, and enhances performance
- **Built-in Optimization:** Automatic code splitting, image optimization, and font optimization
- **Streaming Support:** Enables progressive rendering for large museum collections
- **Strong Ecosystem:** Mature ecosystem with excellent TypeScript support
- **Vercel Integration:** Seamless deployment with edge functions and ISR
- **Route Handlers:** Built-in API routes for server-side logic without separate backend

**Trade-offs:**
- Learning curve for Server Components mental model
- Some client-side libraries require explicit client component boundaries

### Database: MongoDB with Prisma ORM

**Decision:** MongoDB over PostgreSQL/MySQL

**Rationale:**
- **Flexible Schema:** Artworks have varying metadata (different regions, ethnic groups, spiritual meanings)
- **Scalability:** Horizontal scaling for large media collections
- **Document Model:** Natural fit for nested structures (artwork stories, galleries, curator notes)
- **Performance:** Excellent read performance for gallery browsing
- **Geospatial Queries:** Built-in support for region-based filtering

**Trade-offs:**
- Less strict schema validation than relational databases
- Complex transactions require careful design
- Prisma's MongoDB support is newer than PostgreSQL

**Mitigation:**
- Use Zod validation at API boundaries
- Design schema with clear relationships
- Use Prisma for type safety and migrations

### Authentication: Clerk

**Decision:** Clerk over Auth.js/NextAuth

**Rationale:**
- **Modern UX:** Beautiful pre-built authentication components
- **Multi-factor Authentication:** Built-in MFA support for collector security
- **Organization Support:** Future-proof for team accounts
- **Session Management:** Advanced session handling with JWT
- **User Management:** Built-in user profile and metadata management
- **Quick Integration:** Faster implementation than custom Auth.js setup

**Trade-offs:**
- Vendor lock-in
- Cost at scale (though reasonable for startup phase)

**Mitigation:**
- Use Clerk's webhooks for data synchronization
- Keep authentication logic isolated for future migration if needed

### Storage: Cloudflare R2 (with AWS S3 compatibility)

**Decision:** Cloudflare R2 over AWS S3

**Rationale:**
- **Zero Egress Fees:** Significant cost savings for artwork downloads
- **Global Edge Network:** Faster delivery worldwide
- **S3 Compatible:** Drop-in replacement for AWS SDK
- **Security:** Built-in DDoS protection and edge security
- **Privacy:** No data surveillance by cloud provider

**Trade-offs:**
- Smaller ecosystem than AWS S3
- Fewer integrations with third-party tools

**Mitigation:**
- Use AWS S3 SDK for compatibility
- Implement custom integrations as needed

### Payment Processing: Lemon Squeezy (International) + Paystack (Nigeria)

**Decision:** Dual payment providers over single provider

**Rationale:**
- **Lemon Squeezy:** Best for international collectors, handles tax compliance globally
- **Paystack:** Best for Nigerian collectors, local payment methods (bank transfer, USSD)
- **Regional Optimization:** Provides best UX for each market
- **Redundancy:** Backup if one provider has issues

**Trade-offs:**
- Complex integration logic
- Dual reconciliation processes
- Different fee structures

**Mitigation:**
- Abstract payment logic behind unified interface
- Implement unified order management
- Automated reconciliation scripts

### UI Components: shadcn/ui

**Decision:** shadcn/ui over Chakra UI, MUI, or custom components

**Rationale:**
- **Radix UI Primitives:** Accessible, unstyled components as foundation
- **Tailwind CSS:** Consistent with design system
- **Copy-Paste Components:** Full ownership, no npm dependencies
- **Customizable:** Easy to adapt to luxury aesthetic
- **TypeScript Native:** Full type safety
- **Modern Design:** Contemporary component patterns

**Trade-offs:**
- Requires manual component updates (no automatic updates)
- Initial setup time for custom styling

**Mitigation:**
- Track component versions in repository
- Create design system tokens for consistency

### Animation: Framer Motion

**Decision:** Framer Motion over GSAP or CSS-only

**Rationale:**
- **React Native:** Built for React components
- **Gesture Support:** Touch gestures for mobile gallery browsing
- **Performance:** Hardware-accelerated animations
- **Declarative API:** Easy to maintain complex animations
- **Layout Animations:** Smooth layout transitions for gallery

### Form Handling: React Hook Form + Zod

**Decision:** React Hook Form over Formik or controlled inputs

**Rationale:**
- **Performance:** Minimal re-renders
- **TypeScript Integration:** Excellent type inference with Zod
- **Small Bundle Size:** Optimized for production
- **Validation:** Zod provides runtime and compile-time validation

---

## System Architecture

### Architecture Pattern: Clean Architecture with Feature-Based Organization

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  (Next.js App Router, Server Components, Client Components)  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                        │
│  (Server Actions, Route Handlers, Business Logic)            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer                            │
│  (Prisma Models, Domain Services, Validation)                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                       │
│  (Database, Storage, Authentication, Payments, Email)        │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Server-First Rendering:** Use Server Components by default, Client Components only for interactivity
2. **Progressive Enhancement:** Core functionality works without JavaScript, enhanced with JS
3. **Edge Computing:** Use Vercel Edge Functions for geo-distributed authentication and API routes
4. **ISR (Incremental Static Regeneration):** Cache artwork pages, revalidate on updates
5. **Streaming:** Stream large collections for faster perceived performance
6. **Feature-Based Folders:** Organize by feature (artworks, collections, collectors) not by file type

---

## Database Schema Design

### Core Entities

```prisma
// Core Models
model Collector {
  id            String    @id @default(cuid())
  clerkId       String    @unique
  email         String    @unique
  name          String?
  avatar        String?
  bio           String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  orders        Order[]
  wishlist      WishlistItem[]
  reviews       Review[]
  licenses      License[]
  notifications Notification[]
}

model Artwork {
  id                String    @id @default(cuid())
  slug              String    @unique
  title             String
  subtitle          String?
  heroImage         String    // R2 key
  gallery           Json      // Array of image keys
  story             String    @db.Text
  curatorNote       String?   @db.Text
  historicalContext String?   @db.Text
  spiritualMeaning  String?   @db.Text
  creativeProcess   String?   @db.Text
  artistNotes       String?   @db.Text
  ambientAudio      String?   // R2 key
  
  collectionId      String
  collection        Collection @relation(fields: [collectionId], references: [id])
  moonCycleId       String
  moonCycle         MoonCycle  @relation(fields: [moonCycleId], references: [id])
  
  tags              Tag[]
  region            String
  country           String
  ethnicGroup       String?
  
  price             Float
  availableResolutions Json // Array of {width, height, price}
  
  status            Status    @default(DRAFT)
  publishedAt       DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  orderItems        OrderItem[]
  wishlistItems     WishlistItem[]
  reviews           Review[]
  licenses          License[]
  relatedArtworks   RelatedArtwork[] @relation("ArtworkRelated")
  relatedTo         RelatedArtwork[] @relation("RelatedToArtwork")
}

model Collection {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  description String    @db.Text
  coverImage  String    // R2 key
  moonCycleId String
  moonCycle   MoonCycle @relation(fields: [moonCycleId], references: [id])
  
  artworks    Artwork[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model MoonCycle {
  id          String       @id @default(cuid())
  name        String       // "New Moon", "Full Moon", etc.
  phase       MoonPhase
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean      @default(false)
  
  collections Collection[]
  artworks    Artwork[]
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Order {
  id              String    @id @default(cuid())
  orderNumber     String    @unique
  collectorId     String
  collector       Collector  @relation(fields: [collectorId], references: [id])
  
  paymentProvider PaymentProvider
  paymentId       String    // External payment ID
  paymentStatus   PaymentStatus
  
  subtotal        Float
  tax            Float
  total          Float
  
  status          OrderStatus @default(PENDING)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  items           OrderItem[]
  licenses        License[]
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  artworkId String
  artwork   Artwork  @relation(fields: [artworkId], references: [id])
  
  resolution Json
  price      Float
  
  createdAt  DateTime @default(now())
}

model License {
  id          String    @id @default(cuid())
  licenseKey  String    @unique
  collectorId String
  collector   Collector @relation(fields: [collectorId], references: [id])
  artworkId   String
  artwork     Artwork   @relation(fields: [artworkId], references: [id])
  orderId     String
  order       Order     @relation(fields: [orderId], references: [id])
  
  type        LicenseType
  resolution  Json
  expiresAt   DateTime?
  downloadCount Int     @default(0)
  maxDownloads Int      @default(5)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Review {
  id        String    @id @default(cuid())
  rating    Int
  comment   String?   @db.Text
  collectorId String
  collector Collector @relation(fields: [collectorId], references: [id])
  artworkId String
  artwork   Artwork   @relation(fields: [artworkId], references: [id])
  
  status    ReviewStatus @default(PENDING)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Journal {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  excerpt     String    @db.Text
  content     String    @db.Text
  coverImage  String?
  author      String
  publishedAt DateTime?
  
  tags        Tag[]
  
  status      Status    @default(DRAFT)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Story {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  content     String    @db.Text
  coverImage  String?
  region      String
  country     String
  
  relatedArtworks Json // Array of artwork IDs
  
  status      Status    @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Tag {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  
  artworks  Artwork[]
  journals  Journal[]
  
  createdAt DateTime  @default(now())
}

model WishlistItem {
  id        String   @id @default(cuid())
  collectorId String
  collector   Collector @relation(fields: [collectorId], references: [id])
  artworkId   String
  artwork     Artwork   @relation(fields: [artworkId], references: [id])
  
  createdAt  DateTime @default(now())
}

model Notification {
  id        String   @id @default(cuid())
  collectorId String
  collector   Collector @relation(fields: [collectorId], references: [id])
  type      NotificationType
  title     String
  message   String   @db.Text
  read      Boolean  @default(false)
  
  createdAt DateTime @default(now())
}

model Admin {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  role      AdminRole @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Enums
enum Status {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
}

enum MoonPhase {
  NEW_MOON
  WAXING_CRESCENT
  FIRST_QUARTER
  WAXING_GIBBOUS
  FULL_MOON
  WANING_GIBBOUS
  LAST_QUARTER
  WANING_CRESCENT
}

enum PaymentProvider {
  LEMON_SQUEEZY
  PAYSTACK
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum OrderStatus {
  PENDING
  COMPLETED
  PROCESSING
  CANCELLED
  REFUNDED
}

enum LicenseType {
  PERSONAL
  COMMERCIAL
  EXTENDED_COMMERCIAL
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

enum NotificationType {
  ORDER_CONFIRMED
  DOWNLOAD_AVAILABLE
  NEW_ARTWORK
  COLLECTION_PUBLISHED
  JOURNAL_PUBLISHED
}

enum AdminRole {
  ADMIN
  EDITOR
  MODERATOR
}

model RelatedArtwork {
  id          String   @id @default(cuid())
  artworkId   String
  artwork     Artwork  @relation("ArtworkRelated", fields: [artworkId], references: [id])
  relatedId   String
  related     Artwork  @relation("RelatedToArtwork", fields: [relatedId], references: [id])
  
  @@unique([artworkId, relatedId])
}
```

### Schema Design Rationale

1. **Collector-Centric:** All relationships flow from the collector for easy data retrieval
2. **Moon Cycle Integration:** Collections and artworks are tied to moon phases for thematic curation
3. **License Management:** Separate license entity for download tracking and expiration
4. **Flexible Metadata:** JSON fields for varying artwork resolutions and gallery images
5. **Audit Trail:** createdAt and updatedAt on all entities
6. **Soft Deletion:** Status enums instead of hard deletes for recovery
7. **SEO-Friendly:** Slug fields on all public-facing entities

---

## Folder Structure

```
onwa/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── test.yml
├── .vscode/
│   └── settings.json
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── fonts/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (collector)/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── archive/
│   │   │   ├── collected-works/
│   │   │   ├── future-collection/
│   │   │   ├── licenses/
│   │   │   └── settings/
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── artworks/
│   │   │   ├── collections/
│   │   │   ├── stories/
│   │   │   ├── journal/
│   │   │   ├── orders/
│   │   │   ├── collectors/
│   │   │   ├── payments/
│   │   │   ├── licenses/
│   │   │   ├── media/
│   │   │   ├── reviews/
│   │   │   ├── newsletter/
│   │   │   └── settings/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── collections/
│   │   │   ├── collection/[slug]/
│   │   │   ├── artwork/[slug]/
│   │   │   ├── museum/
│   │   │   ├── gallery/
│   │   │   ├── journal/
│   │   │   ├── journal/[slug]/
│   │   │   ├── story/[slug]/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   ├── privacy/
│   │   │   ├── terms/
│   │   │   └── search/
│   │   ├── api/
│   │   │   ├── artworks/
│   │   │   ├── collections/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── search/
│   │   │   ├── webhooks/
│   │   │   │   ├── lemon-squeezy/
│   │   │   │   └── paystack/
│   │   │   └── downloads/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   └── (shadcn components)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── artwork/
│   │   │   ├── ArtworkCard.tsx
│   │   │   ├── ArtworkGrid.tsx
│   │   │   ├── ArtworkHero.tsx
│   │   │   ├── ArtworkGallery.tsx
│   │   │   └── ArtworkStory.tsx
│   │   ├── museum/
│   │   │   ├── MuseumMode.tsx
│   │   │   ├── CuratorNote.tsx
│   │   │   ├── AmbientAudio.tsx
│   │   │   └── MoonPhaseIndicator.tsx
│   │   ├── gallery/
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── GalleryFilter.tsx
│   │   │   └── GallerySort.tsx
│   │   ├── collector/
│   │   │   ├── CollectorDashboard.tsx
│   │   │   ├── CollectorProfile.tsx
│   │   │   ├── CollectedWorks.tsx
│   │   │   └── FutureCollection.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ArtworkEditor.tsx
│   │   │   ├── CollectionEditor.tsx
│   │   │   ├── MediaUploader.tsx
│   │   │   └── Analytics.tsx
│   │   ├── shared/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Tag.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       ├── QueryProvider.tsx
│   │       └── ClerkProvider.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── validations.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── types.ts
│   ├── services/
│   │   ├── artwork.service.ts
│   │   ├── collection.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── storage.service.ts
│   │   ├── email.service.ts
│   │   └── search.service.ts
│   ├── hooks/
│   │   ├── useArtwork.ts
│   │   ├── useCollection.ts
│   │   ├── useCollector.ts
│   │   ├── useAuth.ts
│   │   └── usePayment.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── themes.css
│   └── config/
│       ├── site.ts
│       ├── moon-phases.ts
│       └── payment.ts
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── DEPLOYMENT.md
```

---

## API Design

### RESTful Route Handlers

#### Artworks
- `GET /api/artworks` - List artworks (pagination, filtering, sorting)
- `GET /api/artworks/[slug]` - Get artwork details
- `POST /api/artworks` - Create artwork (admin only)
- `PUT /api/artworks/[id]` - Update artwork (admin only)
- `DELETE /api/artworks/[id]` - Delete artwork (admin only)

#### Collections
- `GET /api/collections` - List collections
- `GET /api/collections/[slug]` - Get collection details
- `POST /api/collections` - Create collection (admin only)
- `PUT /api/collections/[id]` - Update collection (admin only)

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `GET /api/collectors/[id]/orders` - Get collector orders

#### Payments
- `POST /api/payments/lemon-squeezy/checkout` - Create Lemon Squeezy checkout
- `POST /api/payments/paystack/checkout` - Create Paystack checkout
- `POST /api/webhooks/lemon-squeezy` - Lemon Squeezy webhook
- `POST /api/webhooks/paystack` - Paystack webhook

#### Downloads
- `GET /api/downloads/[licenseKey]` - Generate signed download URL
- `POST /api/downloads/[licenseKey]/track` - Track download

#### Search
- `GET /api/search` - Global search (artworks, stories, journal, collections)

### Server Actions

Use Server Actions for:
- Form submissions (contact, newsletter)
- User preferences (museum mode toggle)
- Wishlist management
- Review submissions

### Validation

All API endpoints use Zod schemas for validation:

```typescript
// Example validation schema
const createOrderSchema = z.object({
  items: z.array(z.object({
    artworkId: z.string().cuid(),
    resolution: z.object({
      width: z.number(),
      height: z.number(),
    }),
  })),
  paymentProvider: z.enum(['LEMON_SQUEEZY', 'PAYSTACK']),
  email: z.string().email(),
});
```

---

## Security Architecture

### Authentication Flow

1. **Clerk Authentication:**
   - User signs up/logs in via Clerk components
   - Clerk issues JWT token
   - Middleware validates token on protected routes
   - Server components access user via `auth()`

2. **Role-Based Access Control:**
   - Admin roles stored in database
   - Middleware checks role for admin routes
   - Server actions verify permissions

3. **CSRF Protection:**
   - Next.js built-in CSRF tokens for Server Actions
   - Double-submit cookie pattern for API routes

### Data Security

1. **Input Validation:**
   - Zod schemas at API boundaries
   - Parameterized queries via Prisma
   - XSS protection via React escaping

2. **SQL Injection Prevention:**
   - Prisma ORM prevents SQL injection
   - No raw SQL queries

3. **Download Security:**
   - Signed URLs with expiration (Cloudflare R2)
   - License verification before URL generation
   - Download count tracking
   - IP-based rate limiting

4. **Environment Variables:**
   - All secrets in `.env.local`
   - Server-side only access
   - Never exposed to client

### Headers & CSP

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' https://api.clerk.com",
    ].join('; ')
  }
]
```

---

## Performance Optimization

### Image Optimization

1. **Next.js Image Component:**
   - Automatic WebP/AVIF conversion
   - Responsive images with srcset
   - Lazy loading
   - Blur placeholders

2. **CDN Delivery:**
   - Cloudflare R2 with edge caching
   - Cache headers for artwork images
   - Different sizes for different use cases

### Code Splitting

1. **Route-based Splitting:**
   - Automatic with Next.js App Router
   - Dynamic imports for heavy components

2. **Component Splitting:**
   - Lazy load admin dashboard
   - Dynamic imports for 3D viewers

3. **Server Components:**
   - Reduce client JavaScript
   - Stream large collections

### Caching Strategy

1. **Static Generation:**
   - Homepage (ISR, revalidate every hour)
   - Artwork pages (ISR, revalidate on update)
   - Collection pages (ISR, revalidate daily)

2. **Data Caching:**
   - Prisma query caching
   - Redis for session data (future)
   - CDN for static assets

3. **Browser Caching:**
   - Cache headers for static assets
   - Service Worker for offline gallery (future)

### Performance Targets

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

---

## SEO Strategy

### Metadata

Every page has metadata:

```typescript
export const metadata: Metadata = {
  title: 'The Moon Queen | ONWA - African Digital Museum',
  description: 'An AI-assisted digital artwork exploring Yoruba spirituality and lunar symbolism...',
  openGraph: {
    title: 'The Moon Queen | ONWA',
    description: '...',
    images: ['/og-images/moon-queen.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-images/moon-queen.jpg'],
  },
  alternates: {
    canonical: 'https://onwa.art/artwork/the-moon-queen',
  },
}
```

### Structured Data

JSON-LD for:

- Artwork (CreativeWork)
- Collection (Collection)
- Organization (Organization)
- WebSite (WebSite)
- BreadcrumbList (BreadcrumbList)

### Sitemap

Dynamic sitemap generation:

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const artworks = await prisma.artwork.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  })
  
  return [
    {
      url: 'https://onwa.art',
      lastModified: new Date(),
    },
    ...artworks.map(artwork => ({
      url: `https://onwa.art/artwork/${artwork.slug}`,
      lastModified: artwork.updatedAt,
    })),
  ]
}
```

### robots.txt

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/'],
    },
    sitemap: 'https://onwa.art/sitemap.xml',
  }
}
```

---

## Development Roadmap

### Phase 1: Foundation (Week 1-2)
- Project initialization
- Database schema and migrations
- Authentication setup
- Design system implementation
- Base layout and navigation

### Phase 2: Core Features (Week 3-4)
- Artwork management (CRUD)
- Collection management
- Gallery view
- Basic search
- Artwork detail pages

### Phase 3: Museum Experience (Week 5-6)
- Museum mode implementation
- Ambient audio
- Curator notes
- Story presentation
- Moon phase integration

### Phase 4: Commerce (Week 7-8)
- Payment integration (Lemon Squeezy + Paystack)
- Order management
- Download system with security
- Email notifications
- License generation

### Phase 5: Collector Dashboard (Week 9)
- Collector profile
- Order history (Collector Archive)
- Collected works
- Future collection (wishlist)
- License management

### Phase 6: Admin Dashboard (Week 10-11)
- Admin authentication
- Artwork editor
- Collection editor
- Media upload
- Order management
- Analytics

### Phase 7: Content & Polish (Week 12)
- Journal/blog system
- Story pages
- About page
- Contact page
- FAQ
- Privacy & Terms

### Phase 8: Optimization & Launch (Week 13-14)
- Performance optimization
- SEO implementation
- Analytics setup
- Testing (E2E, accessibility)
- Deployment
- Documentation

---

## Deployment Strategy

### Vercel Deployment

1. **Environment Variables:**
   - Database URL
   - Clerk keys
   - Payment provider keys
   - Storage credentials
   - Email API keys

2. **Build Configuration:**
   - Next.js build output
   - Image optimization
   - Edge function configuration

3. **CI/CD Pipeline:**
   - GitHub Actions for testing
   - Automatic deployment on merge to main
   - Preview deployments for PRs

### Monitoring

- Vercel Analytics
- Google Analytics
- Microsoft Clarity
- Error tracking (Sentry, future)

---

## Testing Strategy

### Unit Testing
- Jest for utility functions
- React Testing Library for components
- Prisma test database

### Integration Testing
- API route testing
- Payment flow testing
- Authentication flow testing

### E2E Testing
- Playwright for critical user flows
- Museum mode experience
- Checkout process
- Download process

### Accessibility Testing
- Axe DevTools
- Keyboard navigation
- Screen reader testing
- WCAG AA compliance

---

## Conclusion

This architecture provides a solid foundation for ONWA to scale to millions of visitors while maintaining the luxury museum experience. The technology choices balance performance, developer experience, and long-term maintainability. The clean architecture ensures the codebase remains organized and testable as the application grows.

Next steps: Implement the database schema and initialize the Next.js project.
