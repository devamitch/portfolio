import { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://old.devamit.co.in/";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "en-IN": BASE_URL,
          "en-US": BASE_URL,
        },
      },
    },
  ];
}
