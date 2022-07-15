/** @type {import('next').NextConfig} */
// const ss = `/gggggggg/`;
const redirectBase = process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : '';
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    nextImageExportOptimizer: {
      imageFolderPath: "public/images",
      exportFolderPath: "out",
      quality: 75,
    },
  },
  env: {
    storePicturesInWEBP: true,
    generateAndUseBlurImages: true,
    distServer: 'https://dist.ballerina.io',
    gitHubPath: 'https://github.com/sm1990/sarani.github.io/blob/main/'
  },
  async rewrites() {
    return [
      {
        source: `/learn/build-a-data-service-in-ballerina`,
        destination: `/learn/featured-use-cases/build-a-data-service-in-ballerina`,
      },
      {
        source: `/${redirectBase}learn/deploy-ballerina-on-kubernetes`,
        destination: `/${redirectBase}learn/featured-use-cases/deploy-ballerina-on-kubernetes`,
      },
      {
        source: `/${redirectBase}learn/get-started-with-ballerina`,
        destination: `/${redirectBase}learn/get-started/get-started-with-ballerina`,
      },
      {
        source: `/${redirectBase}learn/language-basics`,
        destination: `/${redirectBase}learn/learn-the-language/language-basics`,
      },
      {
        source: `/${redirectBase}learn/language-walkthrough`,
        destination: `/${redirectBase}learn/learn-the-language/language-walkthrough`,
      },
      {
        source: `/${redirectBase}learn/work-with-data-using-queries-in-ballerina`,
        destination: `/${redirectBase}learn/featured-use-cases/work-with-data-using-queries-in-ballerina`,
      },
      {
        source: `/${redirectBase}learn/write-a-graphql-api-with-ballerina`,
        destination: `/${redirectBase}learn/featured-use-cases/write-a-graphql-api-with-ballerina`,
      },
      {
        source: `/${redirectBase}learn/write-a-grpc-service-with-ballerina`,
        destination: `/${redirectBase}learn/featured-use-cases/write-a-grpc-service-with-ballerina`,
      },
      {
        source: `/${redirectBase}learn/write-a-restful-api-with-ballerina`,
        destination: `/${redirectBase}learn/featured-use-cases/write-a-restful-api-with-ballerina`,
      },
      {
        source: `/${redirectBase}learn/install-ballerina/:slug`,
        destination: `/${redirectBase}learn/get-started/install-ballerina/:slug`,
      },
      {
        source: '/learn',
        destination: '/learn/get-started/install-ballerina/set-up-ballerina',
      },



      {
        source: `/${redirectBase}learn/openapi-tool`,
        destination: `/${redirectBase}learn/learn-the-platform/ballerina-tooling/openapi-tool`,
      },
      {
        source: `/${redirectBase}learn/graphql-client-tool`,
        destination: `/${redirectBase}learn/learn-the-platform/ballerina-tooling/graphql-client-tool`,
      },
      {
        source: `/${redirectBase}learn/asyncapi-tool`,
        destination: `/${redirectBase}learn/learn-the-platform/ballerina-tooling/asyncapi-tool`,
      },
      {
        source: `/${redirectBase}learn/ballerina-shell`,
        destination: `/${redirectBase}learn/learn-the-platform/ballerina-tooling/ballerina-shell`,
      },
      {
        source: `/${redirectBase}learn/call-java-code-from-ballerina`,
        destination: `/${redirectBase}learn/learn-the-platform/java-interoperability/call-java-code-from-ballerina`,
      },
      {
        source: `/${redirectBase}learn/debug-ballerina-programs`,
        destination: `/${redirectBase}learn/learn-the-platform/test-document-the-code/debug-ballerina-programs`,
      },
      {
        source: `/${redirectBase}learn/generate-code-documentation`,
        destination: `/${redirectBase}learn/learn-the-platform/test-document-the-code/generate-code-documentation`,
      },
      {
        source: `/${redirectBase}learn/manage-dependencies`,
        destination: `/${redirectBase}learn/learn-the-platform/source-code-dependencies/manage-dependencies`,
      },
      {
        source: `/${redirectBase}learn/observe-ballerina-programs`,
        destination: `/${redirectBase}learn/learn-the-platform/configure-observe/observe-ballerina-programs`,
      },
      {
        source: `/${redirectBase}learn/organize-ballerina-code`,
        destination: `/${redirectBase}learn/learn-the-platform/source-code-dependencies/organize-ballerina-code`,
      },
      {
        source: `/${redirectBase}learn/publish-packages-to-ballerina-central`,
        destination: `/${redirectBase}learn/learn-the-platform/ballerina-central/publish-packages-to-ballerina-central`,
      },
      {
        source: `/${redirectBase}learn/configure-ballerina-programs/:slug`,
        destination: `/${redirectBase}learn/learn-the-platform/configure-observe/configure-ballerina-programs/:slug`,
      },
      {
        source: `/${redirectBase}learn/distinctive-language-features/:slug`,
        destination: `/${redirectBase}learn/learn-the-language/distinctive-language-features/:slug`,
      },
      {
        source: `/${redirectBase}learn/run-in-the-cloud/code-to-cloud/code-to-cloud-deployment`,
        destination: `/${redirectBase}learn/learn-the-platform/run-in-the-cloud/code-to-cloud/code-to-cloud-deployment`,
      },
      {
        source: `/${redirectBase}learn/run-in-the-cloud/function-as-a-service/:slug`,
        destination: `/${redirectBase}learn/learn-the-platform/run-in-the-cloud/function-as-a-service/:slug`,
      },
      {
        source: `/${redirectBase}learn/test-ballerina-code/:slug`,
        destination: `/${redirectBase}learn/learn-the-platform/test-document-the-code/test-ballerina-code/:slug`,
      },


      {
        source: `/${redirectBase}learn/package-references`,
        destination: `/${redirectBase}learn/learn-the-platform/source-code-dependencies/package-references`,
      },
      {
        source: `/${redirectBase}learn/cli-documentation/:slug`,
        destination: `/${redirectBase}learn/learn-the-platform/ballerina-tooling/cli-documentation/:slug`,
      },
      {
        source: `/${redirectBase}learn/java-interoperability-guide/:slug`,
        destination: `/${redirectBase}learn/learn-the-platform/java-interoperability/java-interoperability-guide/:slug`,
      },
      {
        source: `/${redirectBase}learn/style-guide/:slug`,
        destination: `/${redirectBase}learn/learn-the-platform/source-code-dependencies/style-guide/:slug`,
      },
      {
        source: `/${redirectBase}learn/style-guide/coding-conventions/:slug`,
        destination: `/${redirectBase}learn/references/style-guide/coding-conventions/:slug`,
      },

      {
        source: `/${redirectBase}downloads/swan-lake-release-notes`,
        destination: `/${redirectBase}downloads/swan-lake-release-notes/2201.0.2`,
      }
    ]
  },
  trailingSlash: true,
  resolve: [{"path":false,"fs": false}],


}

module.exports = nextConfig
