import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://etc-club.vercel.app";

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/registrations`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        ...["/privacy", "/terms"].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.3,
        })),
    ];
}
