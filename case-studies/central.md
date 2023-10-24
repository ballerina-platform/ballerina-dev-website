---
layout: ballerina-publishing-to-central-left-nav-pages-swanlake
title: 'Streamline Ballerina package management via Ballerina Central'
description: 
keywords: ballerina, programming language, packages, central
permalink: /learn/case-studies/central
active: central
intro: With the rapidly increasing growth of a wide range of miscellaneous packages written using the Ballerina language, a globally hosted robust package management system to discover, download, and publish Ballerina packages was in high demand.
logo: '/images/home-page/user-logos/central.svg'
user: 'central'
---

## Overview

When evaluating and selecting a programming language to develop this package management system, which was named Ballerina Central, Ballerina was emphasized over many other languages due to the fact that its features were able to meet the specific requirements of the Ballerina Central team, prompting them to come up with a fresh an innovative solution.

## Challenges

The primary challenge or objective of Ballerina Central was to effectively manage the wide spectrum of Ballerina packages being developed via different channels in multiple categories. These categories include the Ballerina packages that are developed by the Ballerina team, which are shipped with the Ballerina distribution, the BallerinaX packages that are developed by the Ballerina team but are not shipped with the distribution, and the packages that are developed by third-party users, which are also not shipped with the distribution. Furthermore, the Ballerina Central team faced a few other critical challenges when designing the solution, such as scaling the platform on demand when the load is getting high and preserving consistent high availability. 

## Solution

After extensive research and evaluation, the Ballerina Central team decided to implement the API management platform using the Ballerina programming language. Ballerina was the ideal choice as the packages published in Central are also written in Ballerina. It made sense to use the same language in which they are written to manage them. As for the main highlights of the solution, WSO2 Choreo was used to provide the hosting capabilities, WSO2 Asgardeo was used as the identity service provider, and Microsoft Azure products and SQL were used in implementing the cloud-based network and data storage requirements.

<img src="/images/case-studies/ballerina-central-solution.png" alt="Ballerina Central implementation" width="546" height="400" style='width:auto !important; padding-top:20px; padding-bottom:20px;'>

## Benefits

The implementation of the Ballerina Central platform had a profound impact on managing Ballerina packages in an optimized manner based on the key areas listed below.

- **Scalability:** The platform easily accommodated increased uploads of Ballerina packages, ensuring a seamless experience for customers on pulling or downloading them.

- **Positive developer experience:** With the easiness provided in discovering, downloading, and publishing Ballerina packages, the overall customer experience was improved, resulting in higher customer satisfaction and retention rates.

- **Security:** Ballerina's strong security features such as OAuth2 authentication and rate limiting were used in implementing security in Ballerina Central to secure and safeguard sensitive information associated with the packages.

- **Monitoring and analytics:** Together with the Azure log analyzer, Ballerina's observability capabilities were utilized to gain real-time insights into package performance. 

## Conclusion

The journey of the Ballerina Central team to implement a Ballerina package management platform was successful mainly due to the choice of the Ballerina language. The platform not only paved the way for them to meet their expectations of managing the Ballerina packages in a smooth and effective manner but also helped them to ensure a positive user experience for the Ballerina developers, thereby, safeguarding and strengthening the simplicity and powerfulness of the Ballerina language ecosystem for continued growth in the enterprise integration solutions arena.
