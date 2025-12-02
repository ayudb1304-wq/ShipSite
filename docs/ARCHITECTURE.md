# Architecture Documentation

This document explains the architecture and design decisions of the SaaS Starter Kit.

## Overview

The SaaS Starter Kit is built with a modern, type-safe, server-first architecture using Next.js 14+ App Router. It follows best practices for scalability, maintainability, and developer experience.

## Core Principles

1. **Server-First**: Default to Server Components, use Client Components only when needed
2. **Type Safety**: Strict TypeScript with runtime validation via Zod
3. **Modularity**: Features are loosely coupled and easily replaceable
4. **Security**: Environment variables validated, authentication required for protected routes
5. **Performance**: Optimized for Core Web Vitals and SEO

## Technology Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Accessible component library
- **Radix UI**: Unstyled, accessible primitives

### Backend
- **Supabase**: Authentication and PostgreSQL database
- **Drizzle ORM**: Type-safe database queries
- **Stripe**: Payment processing
- **Resend**: Transactional emails
- **PostHog**: Product analytics (optional)

### Development
- **ESLint**: Code linting
- **TypeScript**: Compile-time type checking
- **Zod**: Runtime schema validation

## Architecture Layers

### 1. Presentation Layer

**Location:** `app/`, `components/`

- **Pages**: Next.js App Router pages
- **Components**: Reusable UI components
- **Layouts**: Shared layouts and navigation

**Pattern:**
- Server Components by default
- Client Components for interactivity
- Server Actions for mutations

### 2. Business Logic Layer

**Location:** `actions/`, `lib/`

- **Server Actions**: Form handling and mutations
- **Utilities**: Helper functions and business logic
- **Configuration**: App-wide settings

**Pattern:**
- Server Actions for mutations
- Utilities for reusable logic
- Type-safe with Zod validation

### 3. Data Access Layer

**Location:** `db/`, `lib/supabase/`, `lib/stripe/`

- **Database**: Drizzle ORM schema and queries
- **Supabase**: Auth and database clients
- **Stripe**: Payment client
- **External APIs**: Third-party service clients

**Pattern:**
- ORM for type-safe queries
- Client factories for service connections
- Environment-based configuration

## Data Flow

### Authentication Flow

```
User → Sign In Page → Server Action → Supabase Auth
                                    ↓
                            Auth Callback → Create Profile → Dashboard
```

### Payment Flow

```
User → Pricing Page → Checkout Action → Stripe Checkout
                                        ↓
                                Webhook → Update Subscription → Database
```

### Data Fetching

```
Page Component → Server Action → Database Query → Return Data → Render
```

## File Organization

### App Router Structure

```
app/
├── (auth)/              # Auth-related routes (grouped)
├── (dashboard)/         # Protected dashboard routes
├── api/                 # API routes (webhooks)
├── layout.tsx          # Root layout
└── page.tsx            # Landing page
```

### Component Organization

```
components/
├── ui/                  # Base UI components (Shadcn)
├── features/            # Feature-specific components
└── *.tsx               # Shared components
```

### Server Actions

```
actions/
├── auth.ts             # Authentication actions
├── profile.ts          # Profile management
└── stripe.ts           # Payment actions
```

## Security Architecture

### Authentication

- **Supabase Auth**: Handles all authentication
- **Middleware**: Protects routes server-side
- **Session Management**: Cookie-based via Supabase SSR

### Authorization

- **Route Protection**: Middleware checks authentication
- **Server Actions**: Verify user in each action
- **Database**: Row-level security via Supabase (optional)

### Data Validation

- **Zod Schemas**: Validate all inputs
- **Environment Variables**: Type-safe validation
- **TypeScript**: Compile-time type checking

## Database Architecture

### Schema Design

- **Profiles**: User profile data linked to auth.users
- **Subscriptions**: Subscription data linked to Stripe

### Relationships

```
auth.users (Supabase)
    ↓ (1:1)
profiles
    ↓ (1:1)
subscriptions
```

### Migrations

- **Drizzle**: Type-safe migrations
- **SQL Triggers**: Automatic profile creation
- **Version Control**: Migration files in `db/migrations/`

## Payment Architecture

### Stripe Integration

1. **Checkout**: Server Action creates session
2. **Webhook**: Updates subscription status
3. **Customer Portal**: Self-service management

### Subscription States

- `active`: Active subscription
- `trialing`: In trial period
- `past_due`: Payment failed
- `canceled`: Subscription canceled
- `incomplete`: Payment incomplete

## Performance Optimizations

### Server Components

- Default rendering on server
- Reduced JavaScript bundle
- Faster initial page load

### Caching

- Next.js automatic caching
- Revalidation after mutations
- Static generation where possible

### Database

- Indexed foreign keys
- Efficient queries via Drizzle
- Connection pooling via Supabase

## Scalability Considerations

### Horizontal Scaling

- Stateless server actions
- External database (Supabase)
- External payment processing (Stripe)

### Vertical Scaling

- Server Components reduce load
- Efficient database queries
- Optimized bundle sizes

## Error Handling

### Server Actions

```typescript
try {
  // Operation
  return { success: true, data }
} catch (error) {
  return { error: "User-friendly message" }
}
```

### Client Components

```typescript
const result = await action()
if (result.error) {
  // Display error to user
}
```

## Environment Configuration

### Development

- Local environment variables
- Stripe test mode
- Supabase local development

### Production

- Environment variables in hosting platform
- Stripe live mode
- Supabase production project

## Deployment Architecture

### Recommended: Vercel

- Automatic deployments
- Edge functions support
- Environment variable management

### Alternative Platforms

- **Netlify**: Similar to Vercel
- **Railway**: Docker-based
- **AWS**: More control, more setup

## Future Enhancements

Potential additions:

1. **Testing**: Unit and E2E tests
2. **Monitoring**: Error tracking (Sentry)
3. **Caching**: Redis for sessions
4. **Queue**: Background job processing
5. **Multi-tenancy**: Organization support

## Design Decisions

### Why Server Actions?

- Better type safety
- Simpler than API routes
- Automatic form handling
- Built-in error handling

### Why Drizzle ORM?

- Type-safe queries
- Better performance than Prisma
- SQL-like syntax
- Excellent TypeScript support

### Why Supabase?

- Built-in authentication
- PostgreSQL database
- Real-time capabilities
- Generous free tier

### Why Stripe?

- Industry standard
- Excellent documentation
- Webhook reliability
- Customer portal included

---

This architecture is designed to be:
- **Maintainable**: Clear separation of concerns
- **Scalable**: Can handle growth
- **Secure**: Multiple layers of protection
- **Developer-Friendly**: Type-safe and well-documented
