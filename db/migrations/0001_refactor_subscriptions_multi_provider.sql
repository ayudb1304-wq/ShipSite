-- Migration: Refactor subscriptions table for multi-provider support
-- 
-- PURPOSE: This migration is ONLY for existing databases that have the old 
-- Stripe-specific schema (with columns like stripe_customer_id, stripe_subscription_id, etc.)
-- 
-- MIGRATION STRATEGY:
-- - First-time users: Run 0000_initial_schema.sql which creates tables with the correct schema
-- - Existing users: Run this migration (0001) to upgrade from Stripe-only to multi-provider
-- 
-- SAFETY: This migration uses conditional logic (DO $$ blocks) to check if old columns exist
-- before attempting to rename them. It's safe to run even on fresh databases, as it will
-- detect that the old columns don't exist and skip the migration steps.
--
-- If you're setting up a fresh database, you can skip this migration entirely and just
-- run 0000_initial_schema.sql, which already has the correct multi-provider structure.

-- Check if old columns exist before attempting to migrate
DO $$
BEGIN
  -- Step 1: Add the new provider column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'provider'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN provider text;
    
    -- Step 2: Set default provider to 'stripe' for existing records
    UPDATE subscriptions SET provider = 'stripe' WHERE provider IS NULL;
    
    -- Step 3: Make provider column NOT NULL after setting defaults
    ALTER TABLE subscriptions ALTER COLUMN provider SET NOT NULL;
  END IF;

  -- Step 4: Rename columns from Stripe-specific to provider-agnostic (if they exist)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN stripe_customer_id TO customer_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN stripe_subscription_id TO subscription_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_price_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN stripe_price_id TO price_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_current_period_end'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN stripe_current_period_end TO current_period_end;
  END IF;

  -- Step 5: Add constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'subscriptions' AND constraint_name = 'subscriptions_provider_check'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_provider_check 
      CHECK (provider IN ('stripe', 'lemonsqueezy', 'razorpay', 'dodo'));
  END IF;
END $$;
