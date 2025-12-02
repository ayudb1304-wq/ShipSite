# 🚀 SaaS Starter Kit

The ultimate Next.js 14+ SaaS boilerplate with everything you need to ship your product fast.

![SaaSKit Preview](public/og-image.png)

## ✨ Features

- **🔐 Authentication** - Supabase Auth with Google OAuth and Magic Link
- **💳 Payments** - Stripe subscriptions with checkout and customer portal
- **📧 Transactional Emails** - Resend integration with beautiful templates
- **📊 Analytics** - PostHog for product analytics
- **🗃️ Database** - Supabase PostgreSQL with Drizzle ORM (type-safe)
- **🎨 Beautiful UI** - Tailwind CSS + Shadcn/UI components
- **📱 Responsive** - Mobile-first, works on all devices
- **🌙 Dark Mode** - Built-in dark mode support
- **🔍 SEO Ready** - Meta tags, OpenGraph images, sitemap, robots.txt
- **📝 TypeScript** - 100% TypeScript with strict mode

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 14+](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (Strict) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [Supabase Auth](https://supabase.com/docs/guides/auth) |
| Payments | [Stripe](https://stripe.com/) |
| Email | [Resend](https://resend.com/) |
| Analytics | [PostHog](https://posthog.com/) |
| Validation | [Zod](https://zod.dev/) |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (sign-in, callback)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes & webhooks
├── components/
│   ├── ui/                # Shadcn/UI primitive components
│   └── features/          # Complex feature components
├── lib/                   # Utility functions & clients
│   ├── supabase/          # Supabase client setup
│   ├── stripe/            # Stripe configuration
│   ├── email/             # Resend email templates
│   └── analytics/         # PostHog analytics
├── db/                    # Database schema & migrations
├── actions/               # Server Actions
└── middleware.ts          # Auth middleware
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- [Supabase account](https://supabase.com/)
- [Stripe account](https://stripe.com/)
- [Resend account](https://resend.com/)
- (Optional) [PostHog account](https://posthog.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/saas-starter-kit.git
cd saas-starter-kit
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=onboarding@resend.dev

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy your URL and keys
3. Go to **Settings > Database** and copy your connection string
4. Enable **Google OAuth** in **Authentication > Providers**

### 4. Set Up Database Schema

Push the database schema to Supabase:

```bash
npm run db:push
```

### 5. Set Up Stripe

1. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Create your products and pricing in the Stripe Dashboard
3. Update the price IDs in `src/lib/stripe/config.ts`

### 6. Set Up Stripe Webhooks

For local development, use the Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret and add it to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## 🔧 Configuration

### Updating Pricing Plans

Edit `src/lib/stripe/config.ts` to update your pricing:

```typescript
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses",
    prices: {
      monthly: {
        amount: 2900, // $29.00
        priceId: "price_xxx", // Your Stripe Price ID
      },
      yearly: {
        amount: 29000,
        priceId: "price_xxx",
      },
    },
    features: [
      "Unlimited API calls",
      "Advanced analytics",
      // ...
    ],
  },
];
```

### Customizing the Theme

Edit `src/app/globals.css` to customize colors:

```css
:root {
  --primary: 262 83.3% 57.8%; /* Violet */
  --accent: 173 80% 40%;      /* Teal */
  /* ... */
}
```

### Adding New UI Components

This project uses Shadcn/UI. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- [Render](https://render.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)

## 🔒 Security Best Practices

- Environment variables are validated with Zod on startup
- All inputs are validated with Zod schemas
- Server Actions are used for mutations (not API routes)
- Stripe webhook signatures are verified
- Row Level Security (RLS) should be enabled in Supabase

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com/)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Next.js, Tailwind CSS, and Supabase
