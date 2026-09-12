# ONWA - African Digital Museum

ONWA is a luxury digital museum and marketplace dedicated to African storytelling through AI-assisted digital art. The name "Onwa" means Moon in Igbo, representing the cyclical nature of African traditions and wisdom.

## Mission

Preserve, celebrate, and reimagine African culture, spirituality, traditions, heritage, history, kingdoms, folklore, architecture, symbols, rituals, and everyday life through AI-assisted digital artwork.

## Technology Stack

### Frontend
- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js App Router** - Server-side rendering and API routes
- **Prisma ORM** - Database ORM
- **MongoDB** - NoSQL database

### Authentication
- **Clerk** - Authentication and user management

### Storage
- **Cloudflare R2** - Object storage (AWS S3 compatible)

### Payments
- **Lemon Squeezy** - International payments
- **Paystack** - Nigeria payments

### Email
- **Resend** - Transactional email

### Analytics
- **Google Analytics** - User analytics
- **Microsoft Clarity** - Heatmaps and recordings

### Deployment
- **Vercel** - Hosting and CI/CD

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Clerk account
- Cloudflare R2 account
- Lemon Squeezy account (optional)
- Paystack account (optional)
- Resend account (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/onwa.git
cd onwa
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/onwa"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_access_key_id"
R2_SECRET_ACCESS_KEY="your_secret_access_key"
R2_BUCKET_NAME="onwa-artworks"
R2_PUBLIC_URL="https://your-bucket.r2.dev"
```

4. Initialize the database:
```bash
npm run db:push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
onwa/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/
│   ├── fonts/                 # Custom fonts
│   └── images/                # Static images
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (collector)/       # Collector dashboard
│   │   ├── (admin)/           # Admin dashboard
│   │   ├── (public)/          # Public pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── artwork/           # Artwork components
│   │   ├── museum/            # Museum mode components
│   │   ├── gallery/           # Gallery components
│   │   ├── collector/         # Collector components
│   │   ├── admin/             # Admin components
│   │   ├── shared/            # Shared components
│   │   └── providers/         # Context providers
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── validations.ts     # Zod schemas
│   │   └── utils.ts           # Utility functions
│   ├── services/              # Business logic
│   ├── hooks/                 # React hooks
│   ├── styles/                # Additional styles
│   └── config/                # Configuration files
├── ARCHITECTURE.md            # System architecture
├── DATABASE_SCHEMA.md         # Database documentation
└── README.md                  # This file
```

## Key Features

### Museum Mode
- Full-screen artwork viewing
- Ambient audio support
- Curator notes and historical context
- Story-driven navigation
- Moon phase integration

### Gallery Mode
- Grid-based browsing
- Filtering and sorting
- Quick preview
- Traditional e-commerce interface

### Collector Dashboard
- Order history (Collector Archive)
- Download management (Collected Works)
- Wishlist (Future Collection)
- License management
- Profile settings

### Admin Dashboard
- Artwork management
- Collection curation
- Order processing
- Analytics and insights
- Media library
- Journal management

## Design System

ONWA uses the **Lunar Noir Luxury** design system:

- **Colors**: Deep black (#000000), metallic silver, white
- **Typography**: Bodoni Moda (headlines), Manrope (body)
- **Spacing**: Generous whitespace, 160px section gaps
- **Shapes**: Sharp corners (0px radius), circles for moon motifs
- **Animations**: Subtle, elegant transitions

See `stitch_onwa_african_digital_museum/lunar_noir_luxury/DESIGN.md` for complete design system documentation.

## Collector Language

We use museum-inspired terminology:

- Customer → Collector
- Products → Artworks
- Wishlist → Future Collection
- Order History → Collector Archive
- Downloads → Collected Works
- Related Products → More to Discover
- Add to Cart → Add to Ritual
- Cart → Ritual Selection
- Checkout → The Ritual of Collection

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See `DEPLOYMENT.md` for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

Copyright © 2026 ONWA. All rights reserved.

## Contact

- Website: https://onwa.art
- Email: hello@onwa.art
- Twitter: @onwa

---

Built with ❤️ for African culture and heritage.
