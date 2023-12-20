---
title: "Ballerina joins forces with Red Cross Sri Lanka to conquer Sri Lanka's medical crisis"
description: The Red Cross Society of Sri Lanka (SLRCS) is a humanitarian organization that provides assistance to vulnerable people and communities in Sri Lanka.
keywords: ballerina, programming language, red cross, elixir, wso2, case study
permalink: /learn/case-studies/redcross-elixir
active: redcross-elixir
intro: The Red Cross Society of Sri Lanka (SLRCS) is a humanitarian organization that provides assistance to vulnerable people and communities in Sri Lanka.
logo: '/images/home-page/user-logos/redcross-elixir.png'
user: 'redcross-elixir'
---

## Overview

In 2022, Sri Lanka experienced a severe economic crisis, which led to an acute shortage of medicine and medical supplies. In response to this crisis, the [SLRCS](https://www.redcross.lk/), in collaboration with a group of concerned Sri Lankan expatriates, initiated the [Elixir project](https://www.redcross.lk/news/sri-lanka-red-cross-societys-elixir-a-source-of-strength-to-the-health-sector-of-sri-lanka/). This project aimed to create a digital solution to coordinate medical needs, suppliers, and donor funding.

In the realm of digital volunteering, the diverse Red Cross Elixir group united without meeting physically, using technology to raise nearly a million dollars worth of resources. This initiative substantially impacted the crisis-affected health system, showcasing the transformative power of digital connections to bring about positive change in the medical industry.

## Challenges

The Elixir project team faced several challenges, including those listed below.

- **Rapid development and deployment of a 3-tier web application**

    Given the urgency of the healthcare crisis, the need for speed in both development and deployment was critical. Meeting tight deadlines while ensuring the application's reliability and scalability presented a significant challenge.

- **Meeting the regulatory requirements for importing medicines into Sri Lanka**

    Importing medicines into Sri Lanka involves navigating a complex and highly regulated process. Meeting all regulatory requirements, which include safety, quality, and legal compliance, was a substantial challenge for the Elixir project team.

- **Providing transparency and accountability to donors**

    Donors are crucial to projects like Elixir, and ensuring complete transparency and accountability in how their contributions are used is paramount. The team needed to implement a system to provide real-time visibility into how donations were being utilized, ensuring donor trust and confidence.

- **Working from different time zones**

    Coordinating the efforts of a geographically dispersed, volunteer-driven team while maintaining consistent progress and quality development was a substantial challenge. As the volunteers of the team were from different locations around the world, meeting each other virtually by adhering to different time zones was one of the main challenges faced when carrying out the implementation.

- **Commitment and dedication of volunteers**

    Carrying out development with primarily volunteers, with each person having limited time to contribute, was also challenging. Together with the continuous commitment and dedication of the voluntary stakeholders, this required effective communication, task management, and resource allocation strategies to ensure the project advanced smoothly despite these constraints.

## Solution

The solution comprised two web applications, the Admin Portal and Donor Portal, built on React-based frontend frameworks. These 3-tier web applications relied on REST APIs hosted on the [WSO2 Choreo](https://wso2.com/choreo/) platform, a developer-friendly ecosystem with robust support for Ballerina. Both applications shared an SQL database hosted on Microsoft Azure's cloud infrastructure. User authentication was efficiently managed through the [WSO2 Asgardeo](https://wso2.com/asgardeo/) configuration on the Choreo platform.

A dedicated development environment mirroring the production setup was established for rapid development and testing, ensuring a smooth deployment transition.

<img src="/images/case-studies/red-cross-elixir-solution.png" alt="Red Cross Elixir solution" width="700" height="600" style='width:auto !important; padding-top:20px; padding-bottom:20px;'>

The Elixir project team chose to use Ballerina, which is a programming language designed for writing integrations, in order to implement their solution. Ballerina is well-suited for developing cloud-native applications and is easy to learn and use.

The Ballerina SQL package was harnessed to connect seamlessly to the Microsoft Azure database. Its inherent support for automatic value escaping relieved developers from the burden of explicit SQL injection prevention.

Furthermore, the data-centric nature of Ballerina facilitated easy handling of both JSON and CSV data types. Record types were used to model the domain and provided a level of automatic validation on inputs from both the users’ and database sides.

## Benefits

Since its successful launch in October 2021, the Elixir project has begun to facilitate more than 15 vital medical aid packages, delivering a substantial and enduring positive influence on healthcare support in Sri Lanka.

The Elixir project team has been delighted with the results of their Ballerina implementation. 
Given that many people in the project did not have prior Ballerina experience, and almost no one had previous experience in developing web apps with Ballerina, the timely delivery of the project is evidence of the learnability of the Ballerina language.

Deployment was effortless due to the help of the WSO2 Choreo platform. The team was able to focus more on the development without complications of availability, security, monitoring, and other deployment features provided by WSO2 Choreo.

## Conclusion

The Elixir project is a powerful showcase of Ballerina's ability to create complex, cloud-native applications tailored to the practical demands of organizations. The project team's ability to swiftly develop and deploy a solution that significantly impacted the lives of Sri Lankan citizens underscores the language's effectiveness in addressing complex, critical challenges.

In essence, the collective efforts in digital volunteering during the crisis highlighted the resilience of volunteerism, showcasing the capacity to serve communities from afar. Substantial resources were raised remotely through the synergy of technology and shared dedication, significantly aiding the affected health systems.  The development of the solution using Ballerina underscored the innovative potential of virtual collaboration. This experience demonstrates the power of shared humanity and Ballerina's technological capabilities for positive change,  irrespective of physical boundaries.

>*The successful delivery of the Elixir system was only possible because of the rapid development and deployment capabilities of the Ballerina ecosystem, which included the support of the Ballerina development and support team.*<br/><br/>Prof. Arosha K. Bandara - Product Owner, Elixir - Red Cross Sri Lanka / Professor of Software Engineering, The Open University, UK.
