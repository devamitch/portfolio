// /** @type {import('next-sitemap').IConfig} */
// module.exports = {
//   siteUrl: "https://www.devamit.co.in",
//   generateRobotsTxt: true,
//   exclude: ["/api/*"],

//   // Add this to prevent build errors
//   generateIndexSitemap: false,
// };
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://devamit.co.in",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "monthly",
  priority: 1.0,
  sitemapSize: 5000,
  exclude: ["/api/*", "/404", "/500"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/"],
      },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "facebookexternalhit", allow: "/" },
    ],
    additionalSitemaps: ["https://devamit.co.in/sitemap.xml"],
  },
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
    await config.transform(config, "/#about"),
    await config.transform(config, "/#work"),
    await config.transform(config, "/#experience"),
    await config.transform(config, "/#skills"),
    await config.transform(config, "/#story"),
    await config.transform(config, "/#testimonials"),
    await config.transform(config, "/#github"),
    await config.transform(config, "/#contact"),
  ],
  transform: async (config, path) => ({
    loc: path,
    changefreq: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1.0 : 0.8,
    lastmod: new Date().toISOString(),
    alternateRefs: [
      { href: `https://devamit.co.in${path}`, hreflang: "en-IN" },
      { href: `https://devamit.co.in${path}`, hreflang: "en-US" },
    ],
  }),
};
