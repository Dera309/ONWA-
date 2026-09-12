# ONWA Database Schema

## Prisma Schema

This document contains the complete Prisma schema for ONWA's MongoDB database.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// ============================================
// COLLECTOR & AUTHENTICATION
// ============================================

model Collector {
  id            String    @id @default(cuid()) @map("_id") @db.ObjectId
  clerkId       String    @unique
  email         String    @unique
  name          String?
  avatar        String?
  bio           String?   @db.Text
  location      String?
  website       String?
  
  // Preferences
  museumMode    Boolean   @default(true)
  ambientAudio  Boolean   @default(true)
  emailNotifications Boolean @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  orders        Order[]
  wishlist      WishlistItem[]
  reviews       Review[]
  licenses      License[]
  notifications Notification[]
  
  @@index([clerkId])
  @@index([email])
}

model Admin {
  id        String    @id @default(cuid()) @map("_id") @db.ObjectId
  clerkId   String    @unique
  email     String    @unique
  name      String?
  role      AdminRole @default(ADMIN)
  permissions String[] // Array of permission strings
  
  lastLoginAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@index([clerkId])
  @@index([email])
}

// ============================================
// ARTWORK & COLLECTIONS
// ============================================

model Artwork {
  id                String    @id @default(cuid()) @map("_id") @db.ObjectId
  slug              String    @unique
  
  // Basic Info
  title             String
  subtitle          String?
  description       String?   @db.Text
  
  // Media
  heroImage         String    // R2 storage key
  heroImageAlt      String?
  gallery           Json      // Array of {key, alt, width, height}
  ambientAudio      String?   // R2 storage key
  ambientAudioDuration Int? // in seconds
  
  // Content
  story             String    @db.Text
  curatorNote       String?   @db.Text
  historicalContext String?   @db.Text
  spiritualMeaning  String?   @db.Text
  creativeProcess   String?   @db.Text
  artistNotes       String?   @db.Text
  
  // Classification
  collectionId      String    @db.ObjectId
  collection        Collection @relation(fields: [collectionId], references: [id])
  moonCycleId       String    @db.ObjectId
  moonCycle         MoonCycle  @relation(fields: [moonCycleId], references: [id])
  
  // Metadata
  tags              Tag[]     @relation("ArtworkTags")
  region            String    // e.g., "West Africa", "East Africa"
  country           String    // e.g., "Nigeria", "Kenya"
  ethnicGroup       String?   // e.g., "Yoruba", "Hausa"
  era               String?   // e.g., "Ancient", "Medieval", "Modern"
  medium            String?   // e.g., "Digital", "Mixed Media"
  style             String?   // e.g., "Abstract", "Realistic"
  
  // Commerce
  price             Float
  currency          String    @default("USD")
  availableResolutions Json  // Array of {width, height, dpi, priceMultiplier}
  licenseType       LicenseType @default(PERSONAL)
  
  // Status
  status            Status    @default(DRAFT)
  featured          Boolean   @default(false)
  publishedAt       DateTime?
  scheduledFor      DateTime?
  
  // Analytics
  viewCount         Int       @default(0)
  favoriteCount     Int       @default(0)
  downloadCount     Int       @default(0)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  orderItems        OrderItem[]
  wishlistItems     WishlistItem[]
  reviews           Review[]
  licenses          License[]
  relatedArtworks   RelatedArtwork[] @relation("ArtworkRelated")
  relatedTo         RelatedArtwork[] @relation("RelatedToArtwork")
  
  @@index([slug])
  @@index([collectionId])
  @@index([moonCycleId])
  @@index([status])
  @@index([publishedAt])
  @@index([country])
  @@index([region])
  @@index([featured])
}

model Collection {
  id          String    @id @default(cuid()) @map("_id") @db.ObjectId
  slug        String    @unique
  name        String
  description String    @db.Text
  coverImage  String    // R2 storage key
  coverImageAlt String?
  
  // Curation
  moonCycleId String    @db.ObjectId
  moonCycle   MoonCycle @relation(fields: [moonCycleId], references: [id])
  curatorNote String?   @db.Text
  
  // Metadata
  tags        Tag[]    @relation("CollectionTags")
  region      String?
  country     String?
  era         String?
  
  // Status
  status      Status    @default(DRAFT)
  featured    Boolean   @default(false)
  publishedAt DateTime?
  scheduledFor DateTime?
  
  // Analytics
  viewCount   Int       @default(0)
  artworkCount Int      @default(0)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  artworks    Artwork[]
  
  @@index([slug])
  @@index([moonCycleId])
  @@index([status])
  @@index([featured])
}

model MoonCycle {
  id          String       @id @default(cuid()) @map("_id") @db.ObjectId
  name        String       // "New Moon", "Full Moon", etc.
  phase       MoonPhase
  description String?      @db.Text
  
  // Date Range
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean      @default(false)
  
  // Theme
  theme       String?      // Optional theme for this cycle
  color       String?      // Hex color for UI accents
  
  // Analytics
  artworkCount Int         @default(0)
  collectionCount Int      @default(0)
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  collections Collection[]
  artworks    Artwork[]
  
  @@index([phase])
  @@index([isActive])
  @@index([startDate])
  @@index([endDate])
}

// ============================================
// ORDERS & PAYMENTS
// ============================================

model Order {
  id              String    @id @default(cuid()) @map("_id") @db.ObjectId
  orderNumber     String    @unique
  
  // Collector
  collectorId     String    @db.ObjectId
  collector       Collector  @relation(fields: [collectorId], references: [id])
  collectorEmail  String    // Email at time of purchase
  collectorName   String?
  
  // Payment
  paymentProvider PaymentProvider
  paymentId       String    // External payment ID
  paymentStatus   PaymentStatus
  paymentMethod   String?   // e.g., "card", "bank_transfer"
  
  // Pricing
  currency        String    @default("USD")
  subtotal        Float
  tax            Float
  taxRate        Float?
  total          Float
  discount       Float     @default(0)
  
  // Status
  status          OrderStatus @default(PENDING)
  
  // Timestamps
  paidAt         DateTime?
  completedAt    DateTime?
  cancelledAt    DateTime?
  refundedAt     DateTime?
  
  // Metadata
  ipAddress      String?
  userAgent      String?
  
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  // Relations
  items          OrderItem[]
  licenses       License[]
  
  @@index([orderNumber])
  @@index([collectorId])
  @@index([paymentId])
  @@index([status])
  @@index([createdAt])
}

model OrderItem {
  id        String   @id @default(cuid()) @map("_id") @db.ObjectId
  orderId   String   @db.ObjectId
  order     Order    @relation(fields: [orderId], references: [id])
  artworkId String   @db.ObjectId
  artwork   Artwork  @relation(fields: [artworkId], references: [id])
  
  // Artwork snapshot at time of purchase
  artworkTitle String
  artworkSlug  String
  artworkImage String // R2 key
  
  // Selection
  resolution Json
  licenseType LicenseType
  
  // Pricing
  unitPrice  Float
  price      Float
  
  createdAt  DateTime @default(now())
  
  @@index([orderId])
  @@index([artworkId])
}

model License {
  id          String    @id @default(cuid()) @map("_id") @db.ObjectId
  licenseKey  String    @unique
  
  // Owner
  collectorId String    @db.ObjectId
  collector   Collector @relation(fields: [collectorId], references: [id])
  artworkId   String    @db.ObjectId
  artwork     Artwork   @relation(fields: [artworkId], references: [id])
  orderId     String    @db.ObjectId
  order       Order     @relation(fields: [orderId], references: [id])
  
  // License Details
  type        LicenseType
  resolution  Json
  expiresAt   DateTime?
  
  // Download Management
  downloadCount Int     @default(0)
  maxDownloads Int      @default(5)
  lastDownloadAt DateTime?
  
  // Status
  active      Boolean   @default(true)
  revoked     Boolean   @default(false)
  revokedAt   DateTime?
  revokeReason String?
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([licenseKey])
  @@index([collectorId])
  @@index([artworkId])
  @@index([orderId])
  @@index([active])
}

// ============================================
// CONTENT & STORYTELLING
// ============================================

model Journal {
  id          String    @id @default(cuid()) @map("_id") @db.ObjectId
  slug        String    @unique
  title       String
  excerpt     String    @db.Text
  content     String    @db.Text
  coverImage  String?
  coverImageAlt String?
  author      String
  authorAvatar String?
  authorBio   String?   @db.Text
  
  // SEO
  metaTitle   String?
  metaDescription String? @db.Text
  metaKeywords String?
  
  // Classification
  tags        Tag[]    @relation("JournalTags")
  category    String?
  
  // Status
  status      Status    @default(DRAFT)
  featured    Boolean   @default(false)
  publishedAt DateTime?
  scheduledFor DateTime?
  
  // Analytics
  viewCount   Int       @default(0)
  readTime    Int?      // in minutes
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([slug])
  @@index([status])
  @@index([publishedAt])
  @@index([featured])
}

model Story {
  id          String    @id @default(cuid()) @map("_id") @db.ObjectId
  slug        String    @unique
  title       String
  content     String    @db.Text
  excerpt     String?   @db.Text
  coverImage  String?
  coverImageAlt String?
  
  // Classification
  region      String
  country     String
  ethnicGroup String?
  era         String?
  category    String?
  
  // Related Content
  relatedArtworks Json // Array of artwork IDs
  relatedStories Json? // Array of story IDs
  
  // SEO
  metaTitle   String?
  metaDescription String? @db.Text
  
  // Status
  status      Status    @default(DRAFT)
  featured    Boolean   @default(false)
  publishedAt DateTime?
  scheduledFor DateTime?
  
  // Analytics
  viewCount   Int       @default(0)
  readTime    Int?      // in minutes
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([slug])
  @@index([status])
  @@index([publishedAt])
  @@index([country])
  @@index([region])
  @@index([featured])
}

// ============================================
// SOCIAL & ENGAGEMENT
// ============================================

model Review {
  id        String    @id @default(cuid()) @map("_id") @db.ObjectId
  rating    Int       // 1-5
  title     String?
  comment   String?   @db.Text
  
  // Author
  collectorId String
  collector   Collector @relation(fields: [collectorId], references: [id])
  collectorName String? // Snapshot at time of review
  collectorAvatar String?
  
  // Artwork
  artworkId String
  artwork   Artwork   @relation(fields: [artworkId], references: [id])
  artworkTitle String // Snapshot
  
  // Moderation
  status    ReviewStatus @default(PENDING)
  moderatedBy String? // Admin ID
  moderatedAt DateTime?
  moderationNote String?
  
  // Helpful votes
  helpfulCount Int @default(0)
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@index([artworkId])
  @@index([collectorId])
  @@index([status])
  @@index([rating])
}

model WishlistItem {
  id        String   @id @default(cuid()) @map("_id") @db.ObjectId
  collectorId String
  collector   Collector @relation(fields: [collectorId], references: [id])
  artworkId   String
  artwork     Artwork   @relation(fields: [artworkId], references: [id])
  
  // Artwork snapshot
  artworkTitle String
  artworkSlug  String
  artworkImage String
  
  createdAt  DateTime @default(now())
  
  @@unique([collectorId, artworkId])
  @@index([collectorId])
  @@index([artworkId])
}

model Notification {
  id        String   @id @default(cuid()) @map("_id") @db.ObjectId
  collectorId String
  collector   Collector @relation(fields: [collectorId], references: [id])
  
  type      NotificationType
  title     String
  message   String   @db.Text
  actionUrl String?
  
  read      Boolean  @default(false)
  readAt    DateTime?
  
  createdAt DateTime @default(now())
  
  @@index([collectorId])
  @@index([read])
  @@index([createdAt])
}

// ============================================
// TAXONOMY
// ============================================

model Tag {
  id        String    @id @default(cuid()) @map("_id") @db.ObjectId
  name      String    @unique
  slug      String    @unique
  description String? @db.Text
  color     String?   // Hex color for UI
  
  // Usage count
  artworkCount Int    @default(0)
  journalCount Int    @default(0)
  collectionCount Int @default(0)
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  // Relations
  artworks  Artwork[] @relation("ArtworkTags")
  journals  Journal[] @relation("JournalTags")
  collections Collection[] @relation("CollectionTags")
  
  @@index([slug])
  @@index([name])
}

// ============================================
// RELATIONSHIPS
// ============================================

model RelatedArtwork {
  id          String   @id @default(cuid()) @map("_id") @db.ObjectId
  artworkId   String   @db.ObjectId
  artwork     Artwork  @relation("ArtworkRelated", fields: [artworkId], references: [id])
  relatedId   String   @db.ObjectId
  related     Artwork  @relation("RelatedToArtwork", fields: [relatedId], references: [id])
  
  relationshipType String // "similar", "same_collection", "same_artist", "same_region"
  
  createdAt   DateTime @default(now())
  
  @@unique([artworkId, relatedId])
  @@index([artworkId])
  @@index([relatedId])
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

model PageView {
  id          String   @id @default(cuid()) @map("_id") @db.ObjectId
  path        String
  title       String?
  referrer    String?
  userAgent   String?
  ipAddress   String?
  sessionId   String?
  
  // If authenticated
  collectorId String?  @db.ObjectId
  
  createdAt   DateTime @default(now())
  
  @@index([path])
  @@index([createdAt])
  @@index([collectorId])
  @@index([sessionId])
}

model SearchQuery {
  id          String   @id @default(cuid()) @map("_id") @db.ObjectId
  query       String
  resultsCount Int
  clickedResultId String? // Artwork ID if clicked
  clickedResultType String? // "artwork", "collection", "journal"
  
  // If authenticated
  collectorId String?  @db.ObjectId
  
  createdAt   DateTime @default(now())
  
  @@index([query])
  @@index([createdAt])
  @@index([collectorId])
}

// ============================================
// NEWSLETTER
// ============================================

model NewsletterSubscription {
  id          String   @id @default(cuid()) @map("_id") @db.ObjectId
  email       String    @unique
  name        String?
  
  // Preferences
  categories  String[]  // Array of categories to receive
  
  status      String    @default("active") // "active", "unsubscribed", "bounced"
  
  // Tracking
  subscribedAt DateTime @default(now())
  unsubscribedAt DateTime?
  lastEmailSentAt DateTime?
  emailCount  Int       @default(0)
  
  // If collector
  collectorId String?   @db.ObjectId
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([email])
  @@index([status])
}

// ============================================
// ENUMS
// ============================================

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
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
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
  ORDER_SHIPPED
  DOWNLOAD_AVAILABLE
  NEW_ARTWORK
  COLLECTION_PUBLISHED
  JOURNAL_PUBLISHED
  REVIEW_APPROVED
  ACCOUNT_UPDATE
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  EDITOR
  MODERATOR
}
```

## Schema Design Decisions

### 1. MongoDB over PostgreSQL

**Rationale:**
- Flexible schema for artwork metadata (different regions have different attributes)
- Natural document structure for nested data (gallery images, resolutions)
- Better performance for read-heavy gallery browsing
- Built-in geospatial queries for region-based filtering
- Horizontal scaling for large media collections

### 2. ObjectId for Primary Keys

**Rationale:**
- MongoDB's native identifier
- Efficient indexing
- Distributed generation
- Includes timestamp information

### 3. Slug Fields for SEO

**Rationale:**
- Human-readable URLs
- SEO-friendly
- Type-safe lookups
- Unique constraints prevent conflicts

### 4. Status Enums over Boolean

**Rationale:**
- More expressive state management
- Easy to extend (add new states)
- Clear workflow (DRAFT → PUBLISHED → ARCHIVED)
- Type-safe with Prisma

### 5. Snapshot Data in Relations

**Rationale:**
- Preserve data at time of transaction (orders, reviews)
- Allow artwork/title changes without affecting historical records
- Maintain data integrity
- Enable accurate historical reporting

### 6. Separate License Entity

**Rationale:**
- Track downloads independently of orders
- Support license expiration
- Enable license revocation
- Separate concerns (order vs. license)

### 7. JSON Fields for Flexible Data

**Rationale:**
- Varying artwork resolutions
- Gallery image arrays with metadata
- Related content references
- Avoid rigid schema for evolving needs

### 8. Audit Trail (createdAt, updatedAt)

**Rationale:**
- Track when records were created
- Monitor changes
- Enable data recovery
- Support analytics

### 9. Indexes for Performance

**Rationale:**
- Fast lookups by slug, status, dates
- Efficient filtering and sorting
- Optimized queries for common patterns
- Support pagination

### 10. Soft Deletion via Status

**Rationale:**
- Recover deleted content
- Maintain referential integrity
- Audit trail
- Undo capability

## Index Strategy

### High-Performance Indexes

1. **Slug Indexes:** All public-facing entities (artworks, collections, journal, stories)
2. **Status Indexes:** Filter published vs. draft content
3. **Date Indexes:** Pagination, sorting by date
4. **Relation Indexes:** Fast joins (collectorId, artworkId, etc.)
5. **Search Indexes:** country, region, tags for filtering

### Future: Full-Text Search

Consider adding MongoDB Atlas Search or external search (Algolia, Meilisearch) for:
- Full-text search in stories and journal
- Fuzzy matching
- Faceted search
- Analytics on search behavior

## Migration Strategy

1. **Development:** Use Prisma Migrate for schema changes
2. **Staging:** Test migrations on copy of production data
3. **Production:** 
   - Backup before migration
   - Run during low-traffic period
   - Monitor for errors
   - Rollback plan ready

## Data Seeding

Initial seed data will include:
- Moon cycles for the year
- Sample collections
- Featured artworks
- Admin user
- Sample journal articles
- Sample stories

## Security Considerations

1. **Input Validation:** All inputs validated via Zod before database operations
2. **SQL Injection:** Prisma ORM prevents injection attacks
3. **Access Control:** Server-side checks for admin operations
4. **Data Sanitization:** Remove sensitive data from logs
5. **Encryption:** Consider encryption for sensitive fields (PII)

## Performance Optimization

1. **Connection Pooling:** Prisma connection pool configuration
2. **Query Optimization:** Use `select` to limit returned fields
3. **Caching:** Cache frequently accessed data (moon cycles, featured content)
4. **Pagination:** Limit query results with cursor-based pagination
5. **Read Replicas:** Consider read replicas for scaling reads

## Backup Strategy

1. **Automated Backups:** Daily MongoDB backups
2. **Point-in-Time Recovery:** Enable if available
3. **Cross-Region Replication:** For disaster recovery
4. **Backup Testing:** Regular restore testing
