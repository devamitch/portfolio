/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.devamit.co.in",
  generateRobotsTxt: true,
  exclude: ["/api/*"],

  // Add this to prevent build errors
  generateIndexSitemap: false,
};
