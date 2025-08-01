---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Deployment guidelines overview
description: This guideline is intended to provide a comprehensive overview of best practices and considerations when deploying Ballerina in a production environment. It covers deployment patterns, recommended configurations, Java compatibility, and security hardening tips to ensure your Ballerina applications run efficiently and securely. 
keywords: ballerina, programming language, services, cloud, kubernetes, docker, monolithic
active: ballerina-deployment-guidelines
intro: This guideline is intended to provide a comprehensive overview of best practices and considerations when deploying Ballerina in a production environment. It covers deployment patterns, recommended configurations, Java compatibility, and security hardening tips to ensure your Ballerina applications run efficiently and securely. 
---

When deploying Ballerina applications in production, you can choose from several deployment types depending on your needs.
Each option balances flexibility, control, and operational overhead based on your specific deployment types:

1. [Monolithic Deployment](/learn/monolithic-deployment): Provides full control over the infrastructure, making it suitable for high-performance or legacy systems requiring custom configurations or direct hardware access.
2. [Containerized Deployment](/learn/containerized-deployment): Ideal for containerized, cloud-native microservices, offering scalability and orchestration with Ballerina’s built-in support for Kubernetes and Docker artifacts.
3. [Serverless](/learn/serverless-deployment): Suitable for event-driven, cost-critical applications where cloud providers manage the infrastructure, such as Azure Functions or AWS Lambda.

## Compatible  Java versions

The Ballerina distribution always includes the JRE. The supported Java versions can be found in the table below.

| Ballerina Swan Lake version                                                             | Compatible Java version |
|-----------------------------------------------------------------------------------------|-------------------------|
| Ballerina Swan Lake (2201.0.0) up to Ballerina Swan Lake Update 7 (2201.7.0)            | Java 11.x               |
| Ballerina Swan Lake Update 8 (2201.8.0) up to Ballerina Swan Lake Update 10 (2201.10.0) | Java 17.x               |
| Ballerina Swan Lake Update 11 (2201.11.0)                                               | Java 21.x               |
