-- Migration: Refactor subscriptions table for multi-provider support
-- This migration renames Stripe-specific columns to provider-agnostic names
-- and adds a provider column to support multiple payment providers

-- Step 1: Add the new provider column (nullable initially)
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider text;

-- Step 2: Set default provider to 'stripe' for existing records
UPDATE subscriptions SET provider = 'stripe' WHERE provider IS NULL;

-- Step 3: Make provider column NOT NULL after setting defaults
ALTER TABLE subscriptions ALTER COLUMN provider SET NOT NULL;

-- Step 4: Rename columns from Stripe-specific to provider-agnostic
ALTER TABLE subscriptions RENAME COLUMN stripe_customer_id TO customer_id;
ALTER TABLE subscriptions RENAME COLUMN stripe_subscription_id TO subscription_id;
ALTER TABLE subscriptions RENAME COLUMN stripe_price_id TO price_id;
ALTER TABLE subscriptions RENAME COLUMN stripe_current_period_end TO current_period_end;

-- Step 5: Add constraint to ensure provider is one of the supported values
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_provider_check 
  CHECK (provider IN ('stripe', 'lemonsqueezy', 'razorpay', 'dodo'));
