import { MetadataRoute } from "next";

/**
 * Dynamic Sitemap Generation
 * 
 * Automatically generates sitemap.xml for better SEO.
 * Add more routes as your application grows.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static routes
  const staticRoutes = [
    "",
    "/sign-in",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // TODO: Add dynamic routes (e.g., blog posts, documentation pages)
  // const posts = await db.select().from(blogPosts);
  // const dynamicRoutes = posts.map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.6,
  // }));

  return [...staticRoutes];
}
