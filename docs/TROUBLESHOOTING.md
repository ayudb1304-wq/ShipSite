# Troubleshooting Guide

Common issues and solutions when working with the SaaS Starter Kit.

## Environment Variables

### Issue: "Invalid environment variables" error

**Symptoms:**
- App crashes on startup
- Error message about missing environment variables

**Solutions:**
1. Check `.env.local` exists and has all required variables
2. Verify variable names match exactly (case-sensitive)
3. Ensure URLs are valid (no trailing slashes)
4. Check `env.mjs` for required vs optional variables

**Common Mistakes:**
- Missing `NEXT_PUBLIC_` prefix for client-side variables
- Invalid URL format
- Extra spaces or quotes in values

## Authentication Issues

### Issue: Sign in not working

**Symptoms:**
- Magic link not received
- OAuth redirect fails
- "Invalid credentials" error

**Solutions:**

1. **Magic Link:**
   - Check email spam folder
   - Verify email in Supabase Auth settings
   - Check Supabase project is active
   - Verify `NEXT_PUBLIC_APP_URL` is correct

2. **Google OAuth:**
   - Verify OAuth credentials in Supabase
   - Check redirect URLs match exactly
   - Ensure Google OAuth is enabled in Supabase
   - Check client ID and secret are correct

3. **General:**
   - Check Supabase project URL and keys
   - Verify middleware is not blocking requests
   - Check browser console for errors

### Issue: Profile not created after signup

**Symptoms:**
- User can sign in but no profile exists
- Dashboard shows errors

**Solutions:**
1. Run the database trigger migration:
   ```sql
   -- Copy from db/migrations/0000_create_profiles_trigger.sql
   ```
2. Check trigger exists in Supabase SQL Editor
3. Verify trigger function is working
4. Manually create profile if needed (fallback in code)

## Database Issues

### Issue: Database connection errors

**Symptoms:**
- "Connection refused" errors
- Timeout errors
- Migration failures

**Solutions:**
1. Verify `DATABASE_URL` is correct
2. Check Supabase project is active
3. Verify database password is correct
4. Check IP restrictions in Supabase
5. Ensure connection string format is correct:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

### Issue: Migration errors

**Symptoms:**
- `npm run db:push` fails
- Schema conflicts
- Type errors

**Solutions:**
1. Check schema syntax in `db/schema.ts`
2. Verify Drizzle version matches
3. Try `npm run db:generate` first
4. Check for conflicting migrations
5. Reset database if in development (⚠️ deletes data)

## Payment Issues

### Issue: Stripe checkout not working

**Symptoms:**
- Checkout button does nothing
- "Invalid price ID" error
- Redirect fails

**Solutions:**
1. Verify Stripe keys are correct (test vs live)
2. Check Price IDs exist in Stripe Dashboard
3. Ensure Price IDs match in `lib/config.ts` or `.env.local`
4. Check Stripe account is active
5. Verify webhook endpoint is accessible

### Issue: Webhooks not received

**Symptoms:**
- Subscriptions not updating
- Payment succeeds but status unchanged

**Solutions:**

1. **Local Development:**
   ```bash
   # Ensure Stripe CLI is running
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   - Copy webhook secret from CLI output
   - Update `STRIPE_WEBHOOK_SECRET` in `.env.local`

2. **Production:**
   - Verify webhook endpoint URL in Stripe Dashboard
   - Check webhook secret matches
   - Verify events are selected:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Check webhook logs in Stripe Dashboard

3. **General:**
   - Verify webhook handler is accessible
   - Check server logs for errors
   - Verify signature validation

### Issue: Customer Portal not working

**Symptoms:**
- Portal button does nothing
- "No subscription found" error

**Solutions:**
1. Verify user has a subscription
2. Check `stripeCustomerId` exists in database
3. Ensure Customer Portal is configured in Stripe Dashboard
4. Check Stripe account permissions

## Build and Deployment

### Issue: Build fails

**Symptoms:**
- `npm run build` errors
- TypeScript errors
- Missing dependencies

**Solutions:**
1. Clear `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npx tsc --noEmit`
4. Verify all environment variables are set
5. Check for missing imports

### Issue: Deployment fails on Vercel

**Symptoms:**
- Build fails on Vercel
- Environment variable errors
- Runtime errors

**Solutions:**
1. Verify all environment variables in Vercel dashboard
2. Check build logs for specific errors
3. Ensure Node.js version matches (18+)
4. Verify database is accessible from Vercel
5. Check webhook URLs are correct for production

## TypeScript Issues

### Issue: Type errors

**Symptoms:**
- Red squiggles in IDE
- Build fails with type errors

**Solutions:**
1. Run `npx tsc --noEmit` to see all errors
2. Check imports are correct
3. Verify types are exported
4. Ensure `tsconfig.json` is correct
5. Restart TypeScript server in IDE

### Issue: "Cannot find module" errors

**Solutions:**
1. Check import paths use `@/` alias
2. Verify file exists at path
3. Check `tsconfig.json` paths configuration
4. Restart development server

## UI/Component Issues

### Issue: Styles not applying

**Symptoms:**
- Tailwind classes not working
- Components look broken

**Solutions:**
1. Verify `tailwind.config.ts` includes file paths
2. Check `globals.css` imports Tailwind
3. Restart development server
4. Clear browser cache
5. Verify PostCSS is configured

### Issue: Shadcn components not working

**Symptoms:**
- Components don't render
- Missing dependencies

**Solutions:**
1. Install missing Radix UI packages
2. Check component imports
3. Verify `lib/utils.ts` exists
4. Check for version conflicts

## Performance Issues

### Issue: Slow page loads

**Solutions:**
1. Check database query performance
2. Verify images are optimized
3. Check bundle size
4. Enable Next.js caching
5. Use Server Components where possible

### Issue: High database usage

**Solutions:**
1. Add database indexes
2. Optimize queries
3. Use connection pooling
4. Cache frequently accessed data
5. Check for N+1 queries

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Review error messages carefully
3. Check browser console and server logs
4. Verify environment variables
5. Try clearing cache and rebuilding

### Useful Commands

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint

# Clear Next.js cache
rm -rf .next

# Reset database (⚠️ deletes data)
npm run db:push -- --force

# Check environment variables
node -e "require('./env.mjs')"
```

### Debug Mode

Enable debug logging:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| "Invalid environment variables" | Check `.env.local` and `env.mjs` |
| "Unauthorized" | Verify authentication and middleware |
| "Database connection failed" | Check `DATABASE_URL` and Supabase status |
| "Stripe API error" | Verify Stripe keys and account status |
| "Module not found" | Check import paths and dependencies |

---

If you continue to experience issues, please:
1. Check the error logs carefully
2. Review the relevant documentation
3. Search for similar issues
4. Open an issue with detailed error information
