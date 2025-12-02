import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Star } from "lucide-react";

interface HeroProps {
  badge?: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  socialProof?: {
    avatars: string[];
    text: string;
    rating?: number;
  };
}

export function Hero({
  badge,
  title,
  highlight,
  description,
  primaryCta,
  secondaryCta,
  socialProof,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Gradient orbs */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />
        </div>
        <div className="absolute right-0 top-1/4">
          <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-accent/20 to-transparent blur-3xl" />
        </div>
        <div className="absolute left-0 bottom-0">
          <div className="h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          {badge && (
            <Badge 
              className="mb-6 animate-fade-in gap-2 py-1.5 px-4 text-sm font-medium"
              variant="secondary"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              {badge}
            </Badge>
          )}

          {/* Title */}
          <h1 className="animate-slide-up text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}{" "}
            {highlight && (
              <span className="gradient-text">{highlight}</span>
            )}
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl animate-slide-up text-lg text-muted-foreground animation-delay-100 md:text-xl">
            {description}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 animate-slide-up animation-delay-200 sm:flex-row">
            <Link href={primaryCta.href}>
              <Button size="xl" variant="gradient" className="gap-2 px-8">
                {primaryCta.text}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            {secondaryCta && (
              <Link href={secondaryCta.href}>
                <Button size="xl" variant="outline" className="gap-2 px-8">
                  {secondaryCta.text}
                </Button>
              </Link>
            )}
          </div>

          {/* Social Proof */}
          {socialProof && (
            <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in animation-delay-300">
              <div className="flex -space-x-3">
                {socialProof.avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background"
                  >
                    <Image
                      src={avatar}
                      alt={`User ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-semibold text-primary-foreground">
                  +99
                </div>
              </div>
              <div className="flex items-center gap-2">
                {socialProof.rating && (
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < socialProof.rating!
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm text-muted-foreground">
                  {socialProof.text}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hero Image/Demo Preview */}
        <div className="relative mx-auto mt-16 max-w-5xl animate-scale-in animation-delay-400">
          <div className="relative rounded-xl border bg-card/50 p-2 shadow-2xl backdrop-blur">
            {/* Browser-like header */}
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 rounded-md bg-muted/50 py-1.5 text-center text-xs text-muted-foreground">
                saaskit.app/dashboard
              </div>
            </div>
            {/* Dashboard Preview */}
            <div className="aspect-[16/9] overflow-hidden rounded-b-lg bg-gradient-to-br from-background via-muted/30 to-background p-6">
              <div className="grid h-full gap-4 md:grid-cols-3">
                {/* Sidebar placeholder */}
                <div className="hidden md:block space-y-3">
                  <div className="h-8 w-3/4 rounded-lg bg-muted/50" />
                  <div className="h-6 w-full rounded-lg bg-muted/30" />
                  <div className="h-6 w-5/6 rounded-lg bg-muted/30" />
                  <div className="h-6 w-2/3 rounded-lg bg-muted/30" />
                </div>
                {/* Main content placeholder */}
                <div className="col-span-2 space-y-4">
                  <div className="h-10 w-1/2 rounded-lg bg-primary/20" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-lg bg-muted/40" />
                    <div className="h-24 rounded-lg bg-accent/20" />
                  </div>
                  <div className="h-40 rounded-lg bg-muted/30" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -left-4 top-1/4 animate-bounce rounded-lg border bg-card p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Payment received!</span>
            </div>
          </div>
          
          <div className="absolute -right-4 bottom-1/4 animate-bounce animation-delay-500 rounded-lg border bg-card p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium">New subscriber!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
