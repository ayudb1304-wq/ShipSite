"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/db/types";

/**
 * Create a Supabase client for use in Client Components
 * 
 * @example
 * const supabase = createClient();
 * const { data: user } = await supabase.auth.getUser();
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
