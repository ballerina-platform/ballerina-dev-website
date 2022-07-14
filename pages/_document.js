import { Html, Head, Main, NextScript } from 'next/document';

import { prefix } from '../utils/prefix';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="noindex" />
        <meta name="googlebot" content="noindex"></meta>
        <meta name="author" content="WSO2, Inc." />
        {/* <!--FB--> */}
        <meta property="og:image" content={`${prefix}/images/ballerina-swan-lake-sm-banner-general.png`} />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina" />
        <meta property="og:image" content={`${prefix}/images/ballerina-swan-lake-sm-banner-general.png`} />

        {/* <!--TWITTER--> */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${prefix}/images/ballerina-swan-lake-sm-banner-general.png`} />
        <meta property="twitter:image" content={`${prefix}/images/ballerina-swan-lake-sm-banner-general.png`} />

        <link rel="shortcut icon" href={`${prefix}/images/favicon.ico`}></link>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />

        {/* <script type="text/javascript" async="" src="https://www.google-analytics.com/analytics.js"/>
        <script async="" src="https://www.googletagmanager.com/gtm.js?id=GTM-PSL2TX4"/>
        <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-92163714-2"/> */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />
        <link rel="stylesheet" href={`${prefix}/css/ballerina-search-button.css`} />
        <link rel="stylesheet" href={`${prefix}/css/ballerina-search-modal.css`} />
        <link rel="stylesheet" href={`${prefix}/css/ballerina-search-variables.css`} />
        <link rel="stylesheet" href={`${prefix}/css/ballerina-search-style.css`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}