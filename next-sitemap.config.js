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
      const additionalUrls=['/1.2/learn/generating-ballerina-code-for-protocol-buffer-definitions/',
      '/1.2/learn/keeping-ballerina-up-to-date/',
      '/1.2/learn/calling-java-code-from-ballerina/',
      '/1.2/learn/structuring-ballerina-code/',
      '/1.2/learn/observing-ballerina-code/',
      '/1.2/learn/quick-tour/',
      '/1.2/learn/setting-up-visual-studio-code/run-and-debug/',
      '/1.2/learn/setting-up-visual-studio-code/graphical-editor/',
      '/1.2/learn/setting-up-visual-studio-code/language-intelligence/',
      '/1.2/learn/setting-up-visual-studio-code/',
      '/1.2/learn/deployment/azure-functions/',
      '/1.2/learn/deployment/aws-lambda/',
      '/1.2/learn/using-the-openapi-tools/',
      '/1.2/learn/testing-ballerina-code/testing-quick-start/',
      '/1.2/learn/testing-ballerina-code/mocking/',
      '/1.2/learn/testing-ballerina-code/executing-tests/',
      '/1.2/learn/testing-ballerina-code/writing-tests/',
      '/1.2/learn/installing-ballerina/',
      '/1.2/learn/documenting-ballerina-code/',
      '/1.2/learn/using-the-cli-tools/',
      '/1.2/learn/coding-conventions/expressions/',
      '/1.2/learn/coding-conventions/annotations_documentation_and_comments/',
      '/1.2/learn/coding-conventions/top-level-definitions/',
      '/1.2/learn/coding-conventions/operators_keywords_and_types/',
      '/1.2/learn/coding-conventions/statements/',
      '/1.2/learn/coding-conventions/',
      '/1.2/learn/cli-documentation/grpc/',
      '/1.2/learn/cli-documentation/grpc',
      '/1.2/learn/cli-documentation/update-tool/',
      '/1.2/learn/cli-documentation/update-tool',
      '/1.2/learn/calling-java-code-from-ballerina-and-vice-versa/',
      '/1.2/learn/calling-java-code-from-ballerina-and-vice-versa',
      '/1.2/learn/organizing-ballerina-code/package-layout/',
      '/1.2/learn/organizing-ballerina-code/package-layout',
      '/1.2/learn/organizing-ballerina-code/modules/',
      '/1.2/learn/organizing-ballerina-code/modules',
      '/1.2/learn/observing-ballerina-programs/observing-your-application-with-prometheus-grafana-and-jaeger/',
      '/1.2/learn/observing-ballerina-programs/observing-your-application-with-prometheus-grafana-and-jaeger',
      '/1.2/learn/hello-world/writing-your-first-ballerina-program/',
      '/1.2/learn/hello-world/writing-your-first-ballerina-program',
      '/1.2/learn/hello-world/creating-your-first-ballerina-package/',
      '/1.2/learn/hello-world/creating-your-first-ballerina-package',
      '/1.2/learn/visual-studio-code-extension/debugging/',
      '/1.2/learn/visual-studio-code-extension/debugging',
      '/1.2/learn/visual-studio-code-extension/diagram-editor/',
      '/1.2/learn/visual-studio-code-extension/diagram-editor',
      '/1.2/learn/visual-studio-code-extension/language-support/',
      '/1.2/learn/visual-studio-code-extension/language-support',
      '/1.2/learn/visual-studio-code-extension/vs-code-quick-start/',
      '/1.2/learn/visual-studio-code-extension/vs-code-quick-start',
      '/1.2/learn/deployment/azure-functions/',
      '/1.2/learn/deployment/azure-functions',
      '/1.2/learn/deployment/aws-lambda/',
      '/1.2/learn/deployment/aws-lambda',
      '/1.2/learn/cli-documentation/openapi/',
      '/1.2/learn/cli-documentation/openapi',
      '/1.2/learn/testing-ballerina-code/quick-start-on-testing/',
      '/1.2/learn/testing-ballerina-code/quick-start-on-testing',
      '/1.2/learn/testing-ballerina-code/mocking/',
      '/1.2/learn/testing-ballerina-code/mocking',
      '/1.2/learn/visual-studio-code-extension/executing-tests/',
      '/1.2/learn/visual-studio-code-extension/executing-tests',
      '/1.2/learn/testing-ballerina-code/writing-tests/',
      '/1.2/learn/testing-ballerina-code/writing-tests',
      '/1.2/learn/installing-ballerina/setting-up-ballerina/',
      '/1.2/learn/installing-ballerina/setting-up-ballerina',
      '/1.2/learn/installing-ballerina/installation-options/',
      '/1.2/learn/installing-ballerina/installation-options',
      '/1.2/learn/installing-ballerina/building-from-source/',
      '/1.2/learn/installing-ballerina/building-from-source',
      '/1.2/learn/generating-code-documentation/',
      '/1.2/learn/generating-code-documentation',
      '/1.2/learn/cli-documentation/cli-commands/ment/azure-functions/',
      '/1.2/learn/cli-documentation/cli-commands',
      '/1.2/learn/style-guide/expressions/',
      '/1.2/learn/style-guide/expressions',
      '/1.2/learn/style-guide/annotations-documentation-and-comments/',
      '/1.2/learn/style-guide/annotations-documentation-and-comments',
      '/1.2/learn/style-guide/top-level-definitions/',
      '/1.2/learn/style-guide/top-level-definitions/',
      '/1.2/learn/style-guide/operators-keywords-and-types/',
      '/1.2/learn/style-guide/operators-keywords-and-types',
      '/1.2/learn/style-guide/statements/',
      '/1.2/learn/style-guide/statements',
      '/1.2/learn/style-guide/coding-conventions/',
      '/1.2/learn/style-guide/coding-conventions',
      '/spec/lang/2019R2/',
      '/spec/lang/draft/',
      '/spec/lang/master/',
      '/spec/lang/2019R1/',
      '/spec/lang/2020R1/',
      '/spec/lang/2019R3/',
      '/spec/lang/draft/latest/',
      '/spec/lang/2019R3/experimental.html',
      '/spec/lang/2021R1/',
      '/spec/lang/2022R1/',
      '/spec/lang/2022R2/',
      '/spec/lang/2022R3/',
      '/spec/lang/2022R4/',
      ]
      
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
  