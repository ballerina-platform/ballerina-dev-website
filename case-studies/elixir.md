---
layout: ballerina-publishing-to-central-left-nav-pages-swanlake
title: 'Conquer  medical crisis of Sri Lanka with Red Cross Elixir'
description: 
keywords: ballerina, programming language, donors, medical needs
permalink: /learn/case-studies/elixir
active: elixir
intro: The Red Cross Society of Sri Lanka (SLRCS) is a humanitarian organization that provides assistance to vulnerable people and communities in Sri Lanka.
logo: '/images/home-page/user-logos/redcross-elixir.png'
user: 'elixir'
---

## Overview

In 2022, Sri Lanka experienced a severe economic crisis, which led to an acute shortage of medicines and medical supplies. In response to this crisis, the SLRCS, in collaboration with a group of concerned Sri Lankan expatriates, initiated the Elixir project. The [Elixir project](https://elixir.redcross.lk/) aimed to create a digital solution to enable coordination of medical needs, suppliers, and donor funding.

## Challenges

The Elixir project team faced a number of challenges, including the below.

- **Rapid development and deployment of a 3-tier web application:** Given the urgency of the healthcare crisis, the need for speed in both development and deployment was critical. Meeting tight deadlines while ensuring the application's reliability and scalability presented a significant challenge.

- **Meeting the regulatory requirements for importing medicines into Sri Lanka** Importing medicines into Sri Lanka involves navigating a complex and highly regulated process. Meeting all regulatory requirements, which include safety, quality, and legal compliance, was a substantial challenge for the Elixir project team.

- **Providing transparency and accountability to donors** Donors are crucial to projects like Elixir, and ensuring complete transparency and accountability in how their contributions are used is paramount. The team needed to implement a system that would provide real-time visibility into how donations were being utilized, ensuring donor trust and confidence.

- **Archiving development with mostly volunteers with each person having limited time to contribute:** Coordinating the efforts of a geographically dispersed, volunteer-driven team while maintaining consistent progress and quality development was a substantial challenge. This required effective communication, task management, and resource allocation strategies to ensure that the project advanced smoothly despite these constraints.

## Solution

The solution comprised two web applications, the Admin Portal and Donor Portal, both built on React-based frontend frameworks. These 3-tier web applications relied on REST APIs hosted on the [WSO2 Choreo](https://wso2.com/choreo/) platform, a developer-friendly ecosystem with robust support for Ballerina. Both applications shared an SQL database hosted on Microsoft Azure's cloud infrastructure. User authentication was efficiently managed through the [WSO2 Asgardeo](https://wso2.com/asgardeo/) configuration on the Choreo platform.

A dedicated development environment mirroring the production setup was established for rapid development and testing, ensuring a smooth deployment transition.

<img src="/images/case-studies/red-cross-elixir-solution.png" alt="Red Cross Elixir implementation" width="546" height="400" style='width:auto !important; padding-top:20px; padding-bottom:20px;'>

The Elixir project team chose to use Ballerina, which is a programming language designed for writing integrations, in order to implement their solution. Ballerina is well-suited for developing cloud-native applications, and it is also easy to learn and use.

The Ballerina sql package was harnessed to connect seamlessly to the Microsoft Azure database. Its inherent support for automatic value escaping relieved developers from the burden of explicit SQL injection prevention.

The Elixir project team chose to use Ballerina, which is a programming language designed for writing integrations, in order to implement their solution. Ballerina is well-suited for developing cloud-native applications, and it is also easy to learn and use. Furthermore, Ballerina's data-centric nature helped to handle both JSON and CSV data types with ease. Record types were used to model the domain and provided a level of automatic validation on inputs form both users side and database side.

## Benefits

Since its successful launch in October 2021, the Elixir project has gone on to facilitate more than 15 vital medical aid packages, delivering a substantial and enduring positive influence on healthcare support in Sri Lanka.

The Elixir project team has been very pleased with the results of their Ballerina implementation. 
Given that many people in the project did not have prior ballerina experience, almost no one with prior experience with developing web apps with Ballerina, timely delivery of the project is evidence to the the learnability of the Ballerina language.

Deployment was effortless due to the help of WSO2 Choreo platform. Team was able to focus more on the development without complications of availability, security, monitoring and other deployment features provided by WSO2 Choreo.

## Conclusion

The Elixir project is a powerful showcase of Ballerina's ability to create complex, cloud-native applications tailored to the practical demands of organizations. The project team's ability to swiftly develop and deploy a solution that significantly impacted the lives of Sri Lankan citizens underscores the language's effectiveness in addressing complex, critical challenges.

>*The successful delivery of the Elixir system was only possible because of the rapid development and deployment capabilities of the Ballerina ecosystem, which included the support of the Ballerina development and support team.*<br/><br/>Prof. Arosha Bandara - Product Owner, Elixir / Professor of Software Engineering, Red Cross Sri Lanka.
