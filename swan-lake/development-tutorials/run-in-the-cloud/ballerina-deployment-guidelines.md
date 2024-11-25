---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Ballerina Production Deployment Guidelines
description: This guideline is intended to provide a comprehensive overview of best practices and considerations when deploying Ballerina in a production environment. It covers deployment patterns, recommended configurations, Java compatibility, and security hardening tips to ensure your Ballerina applications run efficiently and securely. 
keywords: ballerina, programming language, services, cloud, kubernetes, docker
permalink: /learn/run-ballerina-programs-in-the-cloud/code-to-cloud-deployment/
active: code-to-cloud-deployment
intro: This guideline is intended to provide a comprehensive overview of best practices and considerations when deploying Ballerina in a production environment. It covers deployment patterns, recommended configurations, Java compatibility, and security hardening tips to ensure your Ballerina applications run efficiently and securely. 
---

## Introduction 
When deploying Ballerina applications in production, you can choose from several deployment types depending on your needs.
Each option balances flexibility, control, and operational overhead based on your specific deployment types:

1. Virtual Machines or Bare Metal: Provides full control over the infrastructure, making it suitable for high-performance or legacy systems requiring custom configurations or direct hardware access.
2. Kubernetes/Docker: Ideal for containerized, cloud-native microservices, offering scalability and orchestration with Ballerina’s built-in support for Kubernetes and Docker artifacts.
3. Serverless: Suitable for event-driven, cost-critical applications, where cloud providers manage the infrastructure, such as AWS Lambda.

## Compatible  Java Versions

The Ballerina distribution always includes the JDK, the supported Java versions can be found in the table below,

| Ballerina Swan Lake Version                                         | Compatible Java Version |
|---------------------------------------------------------------------|-------------------------|
| 2201.0.0 (Ballerina SwanLake) up to 2201.7.0 (Ballerina SwanLakeUpdate 7)  | JDK temurin 11.         |
| 2201.8.0 (Ballerina SwanLake Update 8) up to 2201.10.0 (Ballerina SwanLake Update 10) | JDK temurin 17.0.7      |
| 2201.11.0 (Ballerina SwanLake Update 11)                            | JDK temurin 21.0.3      |

