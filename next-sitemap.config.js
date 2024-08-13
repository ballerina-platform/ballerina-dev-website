/** @type {import('next-sitemap').IConfig} */

const fs = require('fs');

var traverseFolder = function (dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    var filex = dir + "/" + file;
    var stat = fs.statSync(filex);
    if (stat && stat.isDirectory()) {
      /* Add the directory to results, but do not recurse into it */
      filex = filex.replace(/public/g, "").replace(/\/?$/, '/');
      results.push(filex);
    }
  });

  return results;
};


const files = traverseFolder("public/spec/lang");


const config = {
    siteUrl: 'https://ballerina.io/',
    generateRobotsTxt: false, // (optional)
    sitemapSize: 5000,
    generateIndexSitemap: false,
    additionalPaths: async (config) => {
      const result = []

      // using transformation from the current configuration
      // result.push(await config.transform(config, '/additional-page-3'))
      const additionalUrls = traverseFolder("public/spec/lang");
           
      async function asyncCall(element) {
        result.push(await config.transform(config, element))
      }
      
      additionalUrls.forEach(element => {
        asyncCall(element);
      });
      
  
      return result
    }
    // ...other options
  }
  
  // export default config
  module.exports = config;
  