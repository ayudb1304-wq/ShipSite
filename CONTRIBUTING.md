# Contributing Guide

Thank you for your interest in contributing to the SaaS Starter Kit! This guide will help you understand the codebase structure and development workflow.

## 🏗️ Architecture Overview

This starter kit follows a modular, opinionated architecture:

- **App Router**: Next.js 14+ App Router for routing and layouts
- **Server Actions**: Preferred over API routes for mutations
- **Type Safety**: Strict TypeScript with Zod validation
- **Component Structure**: Server components by default, client components only when needed

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (webhooks only)
│   ├── auth/              # Auth callback handlers
│   ├── dashboard/         # Protected dashboard routes
│   ├── pricing/           # Public pricing page
│   ├── sign-in/           # Sign in page
│   ├── sign-up/           # Sign up page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── actions/               # Server Actions
│   ├── auth.ts            # Authentication actions
│   ├── profile.ts         # Profile management
│   └── stripe.ts          # Payment actions
├── components/
│   ├── features/          # Feature-specific components
│   ├── ui/                # Shadcn/UI components
│   └── *.tsx              # Shared components
├── db/
│   ├── schema.ts          # Drizzle schema
│   ├── index.ts           # Database connection
│   └── migrations/        # SQL migrations
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── stripe/            # Stripe clients
│   ├── config.ts          # Configuration
│   └── utils.ts           # Utilities
└── middleware.ts          # Route protection
```

## 🛠️ Development Setup

1. **Clone and Install**:
   ```bash
   git clone <repo-url>
   cd saas-starter-kit
   npm install
   ```

2. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env.local
   # Fill in all required variables
   ```

3. **Set Up Database**:
   ```bash
   npm run db:push
   # Run the trigger migration in Supabase SQL Editor
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 📝 Coding Standards

### TypeScript

- Use strict mode (enabled in `tsconfig.json`)
- No `any` types - use proper types or `unknown`
- Define interfaces for all props and data structures
- Use Zod for runtime validation

### Component Patterns

**Server Components (Default)**:
```tsx
// app/example/page.tsx
export default async function ExamplePage() {
  const data = await getData()
  return <div>{data}</div>
}
```

**Client Components (When Needed)**:
```tsx
// components/example.tsx
"use client"

import { useState } from "react"

export function Example() {
  const [state, setState] = useState()
  // ...
}
```

**Server Actions**:
```tsx
// actions/example.ts
"use server"

export async function exampleAction(formData: FormData) {
  // Validation
  // Database operations
  // Return result
}
```

### File Naming

- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Actions: camelCase (`updateUser.ts`)
- Pages: lowercase with hyphens (`user-profile/page.tsx`)

### Import Organization

1. React/Next.js imports
2. Third-party libraries
3. Internal components
4. Utilities and types
5. Styles

```tsx
import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getUser } from "@/actions/auth"
import { cn } from "@/lib/utils"
```

## 🧪 Testing

While this starter kit doesn't include tests by default, you can add:

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright or Cypress
- **Type Tests**: TypeScript compiler

## 🔍 Code Review Checklist

- [ ] TypeScript types are correct
- [ ] No `any` types used
- [ ] Server components used by default
- [ ] Client components only when needed
- [ ] Proper error handling
- [ ] Environment variables validated
- [ ] Database queries are optimized
- [ ] No console.logs in production code
- [ ] Code is properly commented

## 📚 Adding New Features

### 1. Database Changes

1. Update `db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Push to database: `npm run db:push`
4. Update types if needed

### 2. New Server Action

1. Create file in `actions/`
2. Add "use server" directive
3. Validate inputs with Zod
4. Handle errors gracefully
5. Return typed results

### 3. New UI Component

1. Create in `components/` or `components/ui/`
2. Use Shadcn/UI patterns
3. Make it reusable
4. Add TypeScript types
5. Document props

### 4. New Page

1. Create in `app/` directory
2. Add metadata export
3. Use server components when possible
4. Add to navigation if needed
5. Update sitemap if public

## 🐛 Debugging

### Common Issues

1. **Environment Variables**: Check `env.mjs` validation
2. **Database**: Verify connection string and migrations
3. **Auth**: Check Supabase configuration
4. **Payments**: Verify Stripe keys and webhooks

### Debug Tools

- Next.js DevTools
- React DevTools
- Supabase Dashboard
- Stripe Dashboard
- Browser DevTools

## 📖 Documentation

When adding features:

1. Update README.md if it's user-facing
2. Add JSDoc comments for complex functions
3. Update this guide if patterns change
4. Add inline comments for non-obvious code

## 🚀 Deployment Checklist

Before deploying:

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Stripe webhooks configured
- [ ] Supabase triggers set up
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] SEO metadata updated
- [ ] Analytics configured (if using)

## ❓ Questions?

- Check existing documentation
- Review code comments
- Open an issue for bugs
- Check Next.js, Supabase, and Stripe docs

---

Happy coding! 🎉
