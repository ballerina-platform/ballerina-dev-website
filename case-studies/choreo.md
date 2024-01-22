---
title: 'The role of Ballerina in building an Internal Developer Platform (IDevP)'
description: WSO2 Choreo is an internal developer platform (IDevP) that revolutionizes the creation of digital experiences.
keywords: ballerina, programming language, platformless, internal developer platform, wso2
permalink: /learn/case-studies/choreo
active: choreo
intro: WSO2 Choreo is an internal developer platform (IDevP) that revolutionizes the creation of digital experiences.
logo: '/images/home-page/user-logos/choreo.svg'
user: 'choreo'
---

## Overview

 It enables enterprises to go [platformless](https://github.com/wso2/reference-architecture/blob/master/platformless.md) by streamlining the entire process of designing, developing, deploying, and governing cloud-native applications. Advanced capabilities like domain-driven design and cell-based architecture, ensure end-to-end security, governance, and operational efficiency in implementing best practices for deploying applications and making them available as SaaS offerings. 

 [Choreo](https://wso2.com/choreo/) facilitates efficient development and flexible deployment across diverse cloud environments by supporting multiple programming languages and native integration with tools like Visual Studio Code, GitHub, and CI/CD. It excels in managing APIs, integrations, and web applications, enabling security, seamless scaling with Kubernetes, and reliable deployment through configuration management. The platform promotes the reuse of digital assets, providing comprehensive observability and robust governance capabilities.

## Challenges

To redefine the digital experience of deploying cloud-based applications, Choreo required a solution to address the challenges outlined below effectively.

- **Designing the application architecture:** Overcoming the challenge of managing domain-driven developments in microservice architectures involved ensuring robust support for adequately creating the architectural components of the complete solution.

- **Managing infrastructure:** The platform needed to provide comprehensive support for various infrastructure components associated with SaaS offerings, including Kubernetes containers, serverless and multi-cloud environments, firewalls, load balancing, geo routing, and Domain Name System (DNS) management.

- **Engineering the platform:** Essential cloud deployment governance features such as CI/CD, GitOps, release management, secrets, configurations, and cost optimization demanded meticulous handling during the engineering process.

- **Managing APIs:** The platform had to holistically handle APIs involving all aspects of API governance, gateway, developer portal, lifecycle management, API marketplace, API security, and API analytics.

- **Implementing security:** Emphasizing cloud-based application security concepts like zero trust, encryption, secret management, Transport Layer Security, authentication, and authorization was crucial for implementing security features.

- **Implementing observability:** Implementing observability features woven around cloud-native deployments presented challenges, including the handling of logs, traces, metrics, alerting, anomaly detection, troubleshooting, debugging, and performance predictions.

- **Providing insights:** The Choreo platform was expected to incorporate analytical capabilities for delivering strategic information about the deployed applications, such as business insights, operational insights, API analytics, and DORA metrics, which are essential for stakeholders in making informed strategic decisions.

## Solution

Choreo is an application featuring a [cell-based architecture](https://github.com/wso2/reference-architecture/blob/master/reference-architecture-cell-based.md), as illustrated in the diagram below. It primarily consists of two planes: the data plane, ensuring meticulous data management for the projects published to it and other data-related services, and the control plane, handling administrative functions related to the deployed projects and the platform itself. 

Choreo is developed using the [Platformer](https://wso2.com/acquired/platformer/) framework, which was recently acquired by WSO2. In addition to the notable use of Ballerina, a few other programming languages such as Java, Go, and NodeJS were also used in developing some components of the solution mainly due to the official SDK support provided by them for Microsoft Azure, Kubernetes, and Platformer. The user interface features, implemented using React and identity access management functionalities powered by [WSO2 Asgardeo](https://wso2.com/asgardeo/), contribute to a feature-rich solution focused on efficient and comprehensive project management.

<img src="/images/case-studies/choreo-solution-diagram.png" alt="WSO2 Choreo solution" height="700" style='width:auto !important; padding-top:20px; padding-bottom:20px;'>

## Benefits

The benefits of how Ballerina was effectively used in Choreo for redefining the cloud-based artifact deployment experience include the following.

- Ballerina facilitated smooth integrations between microservices, enhancing the overall product quality. Ballerina made it easier to handle mediations such as Mutual TLS (mTLS), message transformation, etc.
- Writing microservices was also made easier with Ballerina's network-focused design and support for interceptor-based services and network-related data types such as JSON, allowing Choreo to rapidly adapt to the requirement changes.
- Defining APIs and collaborating with developers became more intuitive and efficient. Ballerina simplified the design and implementation of GraphQL APIs significantly.
- With Ballerina's cloud-native capabilities, applications could be seamlessly deployed to Kubernetes with minimal effort.
- Integrations were made more accessible with Ballerina's out-of-the-box support for reliability features like retry and failover.
- Ballerina's compiler extensibility allowed for transparent code modifications through user-friendly plugins.
- The performance improvements in Ballerina done using GraalVM enhanced the overall efficiency.
- The support extended by the Ballerina community through [Visual Studio Code](https://code.visualstudio.com/) and [GitHub Copilot](https://github.com/features/copilot) facilitated an effective development experience. The active Discord server ensured fast communication, and GitHub issues were promptly created and addressed.

## Conclusion

In essence, using the Ballerina language in developing Choreo has revolutionized the deployment of cloud-based applications by making the platform excel in promoting seamless microservices integrations, enhancing its product quality, and adapting swiftly to dynamic requirements. 

Beyond this, Ballerina simplifies the API definitions and collaboration in Choreo and supports effortless container-based deployment to Kubernetes. Being backed by a vibrant community and developer-friendly tools, the integration of Ballerina brought a comprehensive and user-friendly approach to redefining the digital experience in Choreo's cloud application deployment.

>*We are grateful for the transformative impact that Ballerina has had on our development journey, making Choreo a more agile, adaptable, and user-centric platform for deploying cloud-based applications. This transformative success underscores Ballerina's role in fostering adaptability, agility, and efficiency in modern cloud-based deployments.*<br/><br/>Manjula Rathnayaka - Director, Engineering, WSO2 LLC.
