/** @type {import('next-sitemap').IConfig} */

const config = {
    siteUrl: 'https://ballerina.io/',
    generateRobotsTxt: false, // (optional)
    sitemapSize: 5000,
    generateIndexSitemap: false,
    additionalPaths: async (config) => {
      const result = []

      // using transformation from the current configuration
      // result.push(await config.transform(config, '/additional-page-3'))
      
      async function asyncCall(element) {
        result.push(await config.transform(config, element))
      }
  
      return result
    }
    // ...other options
  }
  
  // export default config
  module.exports = config;
  