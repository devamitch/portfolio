// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.devamit.co.in", // Your website URL
  generateRobotsTxt: true, // Generate robots.txt file
  // Optional: Additional options can be specified here
  exclude: ["/api/*"], // Exclude specific paths (adjust as needed)
  // Other options can be added here if needed
};
