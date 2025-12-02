import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account to access your dashboard.",
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto flex flex-col items-center px-4">
        {/* Logo */}
        <Link 
          href="/" 
          className="mb-8 flex items-center gap-2 text-2xl font-bold"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="gradient-text">SaaSKit</span>
        </Link>

        {/* Sign In Card */}
        <div className="w-full max-w-md animate-fade-in">
          <div className="rounded-2xl border bg-card/50 p-8 shadow-xl backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="mt-2 text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}>
              <SignInForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
