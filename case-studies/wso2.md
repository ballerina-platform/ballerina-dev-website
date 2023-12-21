---
title: 'Transform WSO2 internal apps to enhance efficiency and collaboration'
description: WSO2’s digital transformation team realized that they needed to modernize the company’s own internal applications to improve operational efficiency, collaboration, and productivity. To drive these efforts, the company leveraged the Ballerina language to achieve remarkable results and empower its workforce.
keywords: ballerina, programming language, digital transformation, internal apps, wso2
permalink: /learn/case-studies/wso2
active: wso2
intro: WSO2’s digital transformation team realized that they needed to modernize the company’s own internal applications to improve operational efficiency, collaboration, and productivity. To drive these efforts, the company leveraged the Ballerina language to achieve remarkable results and empower its workforce.
logo: '/images/home-page/user-logos/wso2.svg'
user: 'wso2'
---

## Overview

[WSO2](https://wso2.com/) offers a suite of application development and IAM technologies available as open source or SaaS. These technologies enable thousands of enterprises, including hundreds of the world’s largest corporations, top universities, and governments, to drive their digital efforts rapidly, efficiently, and cost-effectively. However, WSO2’s digital transformation team realized that they needed to modernize the company’s own internal applications to improve operational efficiency, collaboration, and productivity. To drive these efforts, the company leveraged the Ballerina language to achieve remarkable results and empower its workforce.

## Challenges

Previously, WSO2 had many manual operations involved in its internal applications based on multiple domains such as sales, finance, customer success, marketing, legal, and procurement and it was considerably time-consuming to build and release new applications using conventional technologies. Also, performing internal operations manually by maintaining Google Sheets and Google Forms, etc., caused delays, redundancies, and inefficiencies in various parts of the processes. Employees faced difficulties when accessing critical information from remote locations, hindering their ability to work flexibly and efficiently. Also, there were requirements from the different domains to connect to various third-party systems such as NetSuite, PeopleHR, and Salesforce, necessitating additional customizations.

## Solution

WSO2 initiated a strategic plan to modernize its applications, migrate to cloud-based solutions, and introduce automation for repetitive tasks using Ballerina services and connectors as illustrated in the diagram below. The backend of the apps was written in Ballerina, the front end was developed using React, and they were deployed in [WSO2 Choreo](https://wso2.com/choreo/).

<img src="/images/case-studies/wso2-internal-apps.png" alt="WSO2 internal apps solution">

The key components of the solution are listed below.

- **Application modernization:** WSO2 revamped its internal apps, adopting Ballerina, which is a modern programming language, together with the React web library to create a more intuitive and user-friendly interface. The Ballerina language provided advantages in handling data manipulation, logical operations, and error handling. The redesigned applications provided a seamless user experience across devices, enhancing employee productivity.

- **Seamless integration:** Ballerina was selected as the ideal solution for the re-building of the applications mostly because of the integration features and abstractions provided by the language to connect to third-party applications and data sources. For example, Ballerina supports technologies such as GraphQL, which can be used for external parties to access employee information through a GraphQL endpoint. REST services were also used for different use cases.

- **Cloud adoption:** The cloud-native nature of the Ballerina language assisted WSO2 in migrating its internal applications to cloud-based solutions by deploying them on the WSO2 Choreo platform, utilizing its private data plane configuration. This move not only improved scalability, observability, and developer support, but also enabled employees to access critical tools and data from anywhere, empowering remote work and global collaboration.

- **Data analytics:** The integration of various internal processes done through the Ballerina connectors allowed for seamless data sharing, and gaining deeper real-time data insights into the organizational data of the internal operations. The observability feature provided by the Ballerina language enabled stakeholders to make decisions on increasing resources, scaling, etc. Also, the data-driven approach of Ballerina allowed for identifying inefficiencies, optimizing business processes, and enhancing the user experiences significantly via the built-in observability features of the new applications. 

- **Data storage:** The data storage capabilities facilitated by the Ballerina language, such as connecting to a MySQL database, could be used to address the data storage requirements of the internal apps efficiently. The system architecture included MySQL databases, Salesforce, NetSuite, and PeopleHR as data sources.

## Benefits

WSO2 benefitted by using the Ballerina language for the digital transformation of its internal operations in several key areas as listed below. 

- **Improved collaboration:** The revamped internal apps and automation of processes led to a substantial increase in employee productivity. Employees could now access the internal apps easily, enabling them to collaborate more efficiently. 

- **Seamless integration:** Ballerina’s built-in connectors for Salesforce, NetSuite, and other systems aided in simplifying the integration process. These connectors together with the cloud-based infrastructure facilitated real-time communication among employees, breaking down silos and improving cross-functional collaboration. 

- **Streamlined operations:** The adoption of the Ballerina language for developing the backend services streamlined various internal operations, resulting in reduced delays, minimized errors, and optimized resource utilization.

- **Effective app maintenance:** All internal apps are currently developed using the latest Ballerina Swan Lake distribution. As Ballerina is an evolving language, the internal apps can also be maintained up-to-date with the latest enhancements, security patches, and fixes by applying Ballerina patch releases. 

- **Receipt of development assistance:** In implementing the planned solution, the WSO2 Digital Transformation team was able to receive on-time customer support on Ballerina from the available channels like Discord and Stack Overflow. Also, Ballerina is a language that can be learned quickly (by experience) through the learning resources available such as [Ballerina By Example](https://ballerina.io/learn/by-example/), [Ballerina Visual Studio Code extension documentation](https://wso2.com/ballerina/vscode/), and [Ballerina Documentation](https://ballerina.io/learn/). 

## Conclusion

The flexibility provided by the Ballerina language to integrate with various third-party endpoints together with its other integration-focused features such as the support provided for cloud adoption, effective data storage mechanisms, and data analytics leveraged the digital transformation strategy of WSO2 internal apps. The combination of all these factors contributed towards achieving the established time, cost, and quality objectives in successfully completing the WSO2 internal apps digital transformation effort. 

>*Ballerina language has played a vital role as a key enabler in our digital transformation strategy of internal apps. The main reason why we chose Ballerina is its ability to facilitate seamless integrations with a vast number of third-party applications. The fully automated internal operations reduce the waste due to manual tasks, which resulted in focusing more on what truly matters for WSO2: becoming the market leader in building great technologies.*<br/><br/>Yasith Nakandala - Director Digital Operations, WSO2 LLC.
