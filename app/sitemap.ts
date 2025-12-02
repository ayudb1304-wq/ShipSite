import { MetadataRoute } from "next"
import { env } from "@/env.mjs"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.NEXT_PUBLIC_APP_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]
}
