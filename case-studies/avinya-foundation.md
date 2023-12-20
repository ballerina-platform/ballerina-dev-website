---
title: "Avinya Academy excels with Ballerina for effective education delivery"
description: The Avinya Academy is a non-profit organization focused on aiding underprivileged individuals aged 17 to 22 who have opted out of traditional higher education. Its mission is to provide them with 21st-century skills and guide them toward practical training programs that foster the necessary knowledge and skills to seize employment opportunities. 
keywords: ballerina, programming language, education, avinya foundation, academy
permalink: /learn/case-studies/avinya-foundation
active: avinya-foundation
intro: The Avinya Academy is a non-profit organization focused on aiding underprivileged individuals aged 17 to 22 who have opted out of traditional higher education. Its mission is to provide them with 21st-century skills and guide them toward practical training programs that foster the necessary knowledge and skills to seize employment opportunities. 
logo: '/images/home-page/user-logos/avinya-foundation.webp'
user: 'avinya-foundation'
---

## Overview

The project-based learning method used at the [Avinya Academy](https://avinyafoundation.org/2023/09/04/avinya-academy-bandaragama-embarks-on-its-second-journey-welcoming-126-new-students/) aims to equip these students with essential resources, enabling them to shape their futures, pursue their passions, and contribute meaningfully to the society through their unique talents.

In the course of advancing its mission, the Avinya Academy found it essential to implement a digital platform to serve the critical function of systematically capturing and recording information about all stakeholders involved, encompassing not only students and instructors but also extending to the proficient management of various assets, business functions, and operations. Integrating such a technology solution is pivotal in ensuring the effectiveness of the [Avinya Foundation](https://avinyafoundation.org/) in managing its diverse stakeholders and optimizing its overall operational efficiency.

## Challenges

The Avinya Academy team faced several challenges, including those listed below.

- **Creating a holistic platform:** 

    The primary hurdle faced by the Avinya Academy was creating a comprehensive platform that could effectively connect students and teachers. This challenge necessitated the incorporation of critical functionalities, including the accurate recording of student attendance, the evaluation of student progress, providing access to learning materials, and facilitating efficient class scheduling. The foundation aimed to build a platform that addressed the current needs and anticipated future requirements, emphasizing the importance of fostering effective communication and collaboration between students and teachers.

- **Handling integrations seamlessly:** 

    A significant challenge for the Avinya Academy revolved around integrating diverse services responsible for operational tasks like recording attendance. This complexity extended to integrating with external platforms such as Google Classroom and Google Sheets. Overcoming this challenge required a meticulous approach to ensure seamless coordination among various services, ultimately enhancing the overall functionality of the system and its interoperability with external tools.

- **Utilizing limited resources:**

    Avinya encountered the challenge of having resource constraints and a small development team for the digital solution development project. Consequently, a solid mechanism was needed to deploy weekly updates in accordance with Avinya's preferred incremental development strategy, enabling the organization to overcome this challenge successfully.

- **Implementing the data layer:**

    The implementation of a robust data layer was a critical requirement on the technical front. This layer needed to encompass administrative, strategic, and operational data for different stakeholders, including students and tutors in making informative decisions. The challenge lay in creating a system that not only efficiently managed the diverse data types but also ensured its accessibility and security, catering to the distinct needs of each stakeholder group.

- **Implementing the cloud architecture:**

    Implementing a resilient cloud-based architecture demanded a balance between robustness, scalability, and concurrency. Meeting the specific requirement of serving concurrent requests from students, trainers, and administrative staff added an additional layer of complexity. Successfully overcoming this challenge was pivotal in establishing a reliable and scalable foundation for the organization's operations.

- **Adopting security and user management best practices:**

    The Avinya Academy faced the imperative of implementing robust security measures to safeguard sensitive data, including the personal details of students and teachers. Adhering to proper user management practices and procedures was crucial for maintaining stringent security standards. This challenge underscored the importance of ensuring data privacy and protecting user information within the system.

- **Enabling observability and analytics:**

    Addressing the challenge of enabling observability and analytics involved monitoring the system's performance via logging and troubleshooting errors and generating comprehensive reports and dashboards. This was essential for analyzing business performance concerning students and tutors. Conquering this challenge required the implementation of effective tools and practices to gather insights and optimize the platform's functionality based on observed patterns and user interactions.

## Solution

The backend of the solution for Avinya Academy comprises a modular architecture featuring three main modules: Finance, Campus (PCTI - project, class, teacher, instance), and Admissions. Also, there will be separate modules for the functions of attendance (for staff and students), admission (for student applications), asset management (for laptops, mobile phones, other equipment, etc.), managing day-to-day classroom activities (pick tee), and viewing reports. 

Ballerina's concurrency model and built-in understanding of networked application patterns are leveraged to create a robust Backend for Frontend (BFF) services, which act as an intermediary layer facilitating the communication between the Flutter frontend and the core backend services. These BFFs, written in Ballerina, are optimized for specific user interface requirements, ensuring a seamless and efficient user experience.

The core of Avinya Academy's backend is the Global Data Service, which is constructed using Ballerina. This pivotal service is a centralized data management gateway, guaranteeing efficient data operations. Ballerina's innate capabilities for the GraphQL API offer a flexible and powerful means for the frontend to query and manipulate data, facilitating a smooth and responsive user interface experience.

The frontend interfaces with the backend deployed on [WSO2 Choreo](https://wso2.com/choreo/), which handles the continuous deployment of weekly updates to the backend. Identity and Access Management (IAM) in the backend is managed through [WSO2 Asgardeo](https://wso2.com/asgardeo/), which is an IDP provided by the Choreo platform. 

<img src="/images/case-studies/avinya-foundation-architecture.png" alt="Avinya Academy solution">

## Benefits

The Avinya Academy benefitted by using the Ballerina language to implement the IT system to carry out its business operations in several key areas, as listed below.

- Inherent compatibility with the distributed cloud architecture, stemming from its integration-centric design.
- User-friendly and easily graspable syntax, promoting an effective development experience.
- Seamless system operation with a track record free of production issues.
- Enhanced development speed and heightened codebase maintainability.
- Built-in support for REST API and GraphQL API development, streamlining the business processes.
- Scalability to accommodate future student enrollments with ease.
- Ensured high availability, enabling students to access resources from any location at any time through the system.
- Refined database connectors for MySQL and seamless integration with Azure services.

## Conclusion

Avinya Academy's adoption of Ballerina has proven to be a game-changer in revolutionizing its integration and collaboration practices. The language's seamless integration capabilities, clean syntax, and robust type system have not only significantly accelerated development speed but also greatly enhanced the maintainability of the codebase. The positive experience is attributed to Ballerina's developer-friendly features, offering an efficient learning curve that aligns with the Academy's modern integration requirements in the educational industry. The vibrant community support surrounding Ballerina further underscores its value, providing valuable resources and contributing to the overall success of Avinya Academy's endeavors.

>*Ballerina has revolutionized our integration and collaboration processes at Avinya Academy over the past year. Its seamless integration capabilities, clean syntax, and powerful type system have significantly improved our development speed and codebase maintainability. The vibrant community support and manageable learning curve make Ballerina an excellent choice for modern integration projects at Avinya Academy. Our experience has been nothing short of stellar, and I wholeheartedly recommend Ballerina for its efficiency and developer-friendly features.*<br/><br/>W. Yujith Isura - Software Engineer, Avinya Academy.
