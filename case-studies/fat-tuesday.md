---
layout: ballerina-publishing-to-central-left-nav-pages-swanlake
title: 'How Ballerina empowered Fat Tuesday’s digital transformation'
description: 
keywords: ballerina, programming language, integration, api-driven, fat tuesday
permalink: /learn/case-studies/fat-tuesday
active: fat-tuesday
intro: In 1984, situated in the vibrant surroundings of Bourbon Street in New Orleans, Fat Tuesday inaugurated its operations as a humble establishment specializing in superior frozen beverages. As time progressed, Fat Tuesday was able to achieve a commendable expansion. From its solitary inception, it has grown to an extensive network of 90 outlets across the globe. With a strategic presence in renowned tourist destinations, vibrant entertainment hubs, and outdoor malls, the brand has ensured that a diverse range of enthusiasts worldwide enjoy its premium frozen beverages.
logo: '/images/home-page/user-logos/fat-tuesday.svg'
user: 'fat-tuesday'
---

## Overview

Across its 90+ worldwide stores, Fat Tuesday collected data from its Point of Sales system using a file-based approach. This data was transferred via file transfer protocols to a central storage server. The legacy integration system then processed this data, saving crucial information to a data storage. This stored information was then visualized on dashboards for analysis and decision-making.

## Challenges

In a typical user registration scenario, the civil registry must be notified to register the birth of a newborn. This event creates a digital persona in the identity platform and will be used in various contexts, from providing services involving vaccinations, education, and other aspects throughout the person’s lifespan, including the registration of their death. Initially, a minimum set of attributes, such as gender, date of birth, and biometrics, can be used to form the identity and be associated with their parents and birth certificate. This event is a core identity registration event.

Subsequently, governments can use the platform to authenticate users when providing various services and reliable, timely information and data to other government entities, such as the Department of Health, population registers, pension funds systems, electoral and personal identification services, research institutions, etc.

## Solution

In light of the discussed limitations, Fat Tuesday aspired to shift from its existing file-centric process to an API-driven approach, with the goal of enhancing its data integration speed into its analytics dashboard and reducing errors significantly.
During this digital transformation, data is directly accessed using REST APIs from the Point of Sales service. This removes the necessity for centralized file storage and the manual handling and processing of data. In the updated system, data is processed in real time, and errors are handled more efficiently.

The new solution is developed in Ballerina incorporating its inherent support for integrations. The Ballerina integration is scheduled to get the data via REST APIs frequently, process the data, and persist the analysis in databases for future reference.

Ballerina is an open-source, cloud-native programming language tailored for integration purposes. Beyond being a language, it is an ecosystem with a wide range of network protocols, data formats, and connectors, eliminating the need for external tools and simplifying system integrations, from cloud services to enterprise backends. The graphical tooling including the service designing and data mapping capabilities makes integration development easier and much more productive.

The diagram below provides a side-by-side comparison of the traditional legacy solution and the new solution implemented with Ballerina. It highlights the shift from manual operations to automation.

<img src="/images/case-studies/fat-tuesday-solution.png" alt="Fat Tuesday implementation" width="546" height="400" style='width:auto !important; padding-top:20px; padding-bottom:20px;'>

## Benefits

Fat Tuesday benefitted  by using the Ballerina language for its digital transformation in several key areas as listed below.

- **Modern cloud-ready integration:** Leveraging Ballerina's lightweight, cloud-ready integration technology, Fat Tuesday achieved seamless data automation. The Ballerina platform's native data support enhanced task efficiency, streamlining the API-driven integrations and reducing the risk of manual errors.

- **Enhanced system interoperability:** Ballerina inherently understands and simplifies network interactions, making API integrations more intuitive and straightforward. Moreover, Ballerina offers a diverse set of connectors, simplifying integrations with various services, databases, and platforms. For Fat Tuesday, the data storage integration is conveniently managed using a readily available database connector.

- **Robust monitoring and advanced analytics:** Ballerina programs are inherently observable providing comprehensive control and insights into the program execution and efficiency. Observability combined into API-centric model, empowered Fat Tuesday with enhanced analytics capabilities. This lead to actionable insights, proactive issue resolution, and improved user satisfaction.

- **Enhanced development productivity:** Ballerina's integrated graphical tooling enables users to model distributed systems. Coupled with its concise and efficient syntax, this ensures a seamless development experience. The combination of graphical tooling and streamlined syntax not only reduced the learning curve but also supported long term code readability, thereby, promoting innovative solutions for Fat Tuesday. 

- **Operational efficiency and strategic growth:** Transitioning to an API-centric model via Ballerina has expanded Fat Tuesday's operational capabilities. This move ensures that their store network operates with enhanced efficiency, accuracy, and the flexibility to meet dynamic business needs.

In essence, Ballerina offers a holistic, efficient, and intuitive approach to integration, making it the ideal choice for Fat Tuesday as it embarks on its journey of digital transformation.

## Conclusion

The transition to an API-centric solution using Ballerina has started a new era of efficiency and reliability for Fat Tuesday. Gone are the days of receiving complaints regarding inaccurate analytics and the integration has seen a considerable improvement in data precision. Furthermore, the dependency on manual intervention to access restaurant data has been eliminated, allowing for a streamlined, hassle-free experience. This seamless integration has not only benefitted from the operational side improvements but has also significantly reduced the overhead for the Engineering Team. Their focus can now shift from constant maintenance and troubleshooting to innovation and enhancing the overall system. In essence, Ballerina has transformed the digital operations landscape of Fat Tuesday, ensuring optimal performance and stakeholder satisfaction.

The evolution of Fat Tuesday's integration capabilities, thanks to Ballerina, doesn't stop at its current achievements. The roadmap ahead is planned with potential improvements that promise to optimize and expand the system further. With Ballerina's adaptability and robustness, the possibilities for improvement and expansion are truly boundless, ensuring that Fat Tuesday remains at the forefront of digital innovation in the food and beverages industry.
