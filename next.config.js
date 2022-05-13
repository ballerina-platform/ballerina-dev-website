/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/learn/build-a-data-service-in-ballerina',
        destination: '/learn/get-started/build-a-data-service-in-ballerina',
      },
      {
        source: '/learn/deploy-ballerina-on-kubernetes',
        destination: '/learn/get-started/deploy-ballerina-on-kubernetes',
      },
      {
        source: '/learn/get-started-with-ballerina',
        destination: '/learn/get-started/get-started-with-ballerina',
      },
      {
        source: '/learn/language-basics',
        destination: '/learn/get-started/language-basics',
      },
      {
        source: '/learn/work-with-data-in-ballerina',
        destination: '/learn/get-started/work-with-data-in-ballerina',
      },
      {
        source: '/learn/write-a-graphql-api-with-ballerina',
        destination: '/learn/get-started/write-a-graphql-api-with-ballerina',
      },
      {
        source: '/learn/write-a-grpc-service-with-ballerina',
        destination: '/learn/get-started/write-a-grpc-service-with-ballerina',
      },
      {
        source: '/learn/write-a-restful-api-with-ballerina',
        destination: '/learn/get-started/write-a-restful-api-with-ballerina',
      },
      {
        source: '/learn/install-ballerina/:slug',
        destination: '/learn/get-started/install-ballerina/:slug',
      },



      {
        source: '/learn/ballerina-openapi-support',
        destination: '/learn/guides/ballerina-openapi-support',
      },
      {
        source: '/learn/ballerina-shell',
        destination: '/learn/guides/ballerina-shell',
      },
      {
        source: '/learn/call-java-code-from-ballerina',
        destination: '/learn/guides/call-java-code-from-ballerina',
      },
      {
        source: '/learn/debug-ballerina-programs',
        destination: '/learn/guides/debug-ballerina-programs',
      },
      {
        source: '/learn/generate-code-documentation',
        destination: '/learn/guides/generate-code-documentation',
      },
      {
        source: '/learn/manage-dependencies',
        destination: '/learn/guides/manage-dependencies',
      },
      {
        source: '/learn/observe-ballerina-programs',
        destination: '/learn/guides/observe-ballerina-programs',
      },
      {
        source: '/learn/organize-ballerina-code',
        destination: '/learn/guides/organize-ballerina-code',
      },
      {
        source: '/learn/publish-packages-to-ballerina-central',
        destination: '/learn/guides/publish-packages-to-ballerina-central',
      },
      {
        source: '/learn/configure-ballerina-programs/:slug',
        destination: '/learn/guides/configure-ballerina-programs/:slug',
      },
      {
        source: '/learn/distinctive-language-features/:slug',
        destination: '/learn/guides/distinctive-language-features/:slug',
      },
      {
        source: '/learn/run-ballerina-programs-in-the-cloud/:slug',
        destination: '/learn/guides/run-ballerina-programs-in-the-cloud/:slug',
      },
      {
        source: '/learn/test-ballerina-code/:slug',
        destination: '/learn/guides/test-ballerina-code/:slug',
      },


      {
        source: '/learn/package-references',
        destination: '/learn/references/package-references',
      },
      {
        source: '/learn/cli-documentation/:slug',
        destination: '/learn/references/cli-documentation/:slug',
      },
      {
        source: '/learn/java-interoperability/:slug',
        destination: '/learn/references/java-interoperability/:slug',
      },
      {
        source: '/learn/style-guide/coding-conventions',
        destination: '/learn/references/style-guide/coding-conventions',
      },
      {
        source: '/learn/style-guide/coding-conventions/:slug',
        destination: '/learn/references/style-guide/coding-conventions/:slug',
      }
      
    ]
  },
  resolve: [{"path":false}],

}

module.exports = nextConfig
