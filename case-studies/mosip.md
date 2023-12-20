---
title: 'How MOSIP uses Ballerina WebSubHub for event-driven integration'
description: Ballerina is an open source programming language for the cloud that makes it easier to use, combine, and create network services. In addition to the powerful language features, it comes with a rich Ballerina library, which covers network data, messaging, and communication protocols. The Modular Open Source Identity Platform (MOSIP), an open-source identity platform currently being adopted by several countries to manage the digitization of their civil registries, uses the Ballerina WebSubHub module for event-driven communication.
keywords: ballerina, programming language, integration, websubhub, mosip
permalink: /learn/case-studies/mosip
active: mosip
intro: Ballerina is an open source programming language for the cloud that makes it easier to use, combine, and create network services. In addition to the powerful language features, it comes with a rich Ballerina library, which covers network data, messaging, and communication protocols. The Modular Open Source Identity Platform (MOSIP), an open-source identity platform currently being adopted by several countries to manage the digitization of their civil registries, uses the Ballerina WebSubHub module for event-driven communication.
logo: '/images/home-page/user-logos/mosip.png'
user: 'mosip'
---

## Overview

A country’s personal identification system is the backbone for effectively delivering public and private services. With multipurpose foundational ID systems, citizens receive a unique identifier from the government that can be used for identity assertion and verification.

### The Modular Open Source Identity Platform (MOSIP)

Funded by the Bill & Melinda Gates Foundation, Sir Ratan Tata Trust, and the Omidyar Network, [MOSIP](https://mosip.io/) is a foundational identity platform that helps governments and other organizations implement digital and foundational identity systems in a cost-effective way.

Countries can use MOSIP freely to build their own identity systems and address common implementation challenges, such as ensuring uniqueness in the system, interoperability, privacy by design, scalability, no vendor lock-in, and affordability. With a database of identities in a country, MOSIP can be used for identity issuance and verification, and integrate with multiple service providers who offer wide-ranging products and solutions to organizations and nations alike. 

Due to its modular architecture, MOSIP provides flexibility in how governments can implement and configure their foundation ID system on top of MOSIP, as shown in the diagram below.

<img src="/images/case-studies/mosip-modular-architecture.png" alt="MOSIP modular architecture" width="546" height="400" style='width:auto !important; padding-top:20px; padding-bottom:20px;'>

## Challenges

In a typical user registration scenario, the civil registry must be notified to register the birth of a newborn. This event creates a digital persona in the identity platform and will be used in various contexts, from providing services involving vaccinations, education, and other aspects throughout the person’s lifespan, including the registration of their death. Initially, a minimum set of attributes, such as gender, date of birth, and biometrics, can be used to form the identity and be associated with their parents and birth certificate. This event is a core identity registration event.

Subsequently, governments can use the platform to authenticate users when providing various services and reliable, timely information and data to other government entities, such as the Department of Health, population registers, pension funds systems, electoral and personal identification services, research institutions, etc.

The foundational ID can access a variety of government and private services. If a change in the name, address, marital status, or other detail occurs, or if the said person dies, multiple systems must act on such events to perform various tasks.

Therefore, there is a need for event-driven communication between different systems. Because it may require complex integration and IP whitelisting, the MOSIP team decided that these events must be transmitted over HTTP (and not via a message broker such as Kafka) for external systems to consume them, keeping the integration simple and the deployment convenient for external systems.

An open protocol for distributed pub/sub communication, WebSub started life as PubSubHubbub, was refined in the W3C Social Web Working Group, and was subsequently published as a [W3C Recommendation](https://www.w3.org/TR/websub/). WebSub is widely adopted to replace server polling. A key advantage of WebSub is that it brings together publishers and subscribers to real-time data, allowing content to be published and updated in a secure, trustable way, and making it possible to avoid periodic requests to networks. WebSub’s secure communication environment is provided through a publisher-hub-subscriber data-transfer chain.

The main three entities in this pattern are publishers, hubs, and subscribers.

- The publisher is the producer party that generates content and publishes it online.
- The hub acts as an intermediary between the publisher and the subscriber. It accepts the content from the publishers and pushes them to the subscribers based on what they have subscribed to.
- A subscriber is the consumer party in the WebSub pattern. They find the hubs advertised by the publisher’s topic and subscribe to topics.

Publishers post new content or update changes to the hubs. The subscribers that register to these topics via hubs are served the relevant content securely through the HTTP Post calls from the hubs. Upon subscription, they will have securely shared the HTTP callback endpoint to the hubs.

## Solution

MOSIP needed an integration mechanism to communicate some key events. They used Ballerina’s [WebSubHub](https://github.com/ballerina-platform/module-ballerina-websubhub) package for event-driven communication over HTTP — message-broker-like functionalities exposed via APIs to external parties.

### Leveraging Ballerina WebSubHub

The Ballerina [WebSubHub package](https://lib.ballerina.io/ballerina/websubhub/latest) provides APIs for a WebSubHub service and WebSub publisher client. A WebSubHub is an implementation that handles subscription requests and distributes the content to subscribers when the corresponding topic URL has been updated. The hub, shown in the diagram below, is implemented using Ballerina, and event transmission happens over WebSub.

A single publisher is an implementation that advertises a topic and hub URL on one or more resource URLs. Subscribers are Java implementations since they must integrate with existing modules.

MOSIP currently uses this WebSub implementation for event-based communication between internal subsystems, such as ID repository and identity authentication, and to communicate with printing partners, to which the platform will convey the details to be printed on the identity card once the identity is created or updated.

### MOSIP’s WebSubHub implementation

<img src="/images/case-studies/mosip-websubhub-implementation.png" alt="MOSIP WebSubHub implementation" width="546" height="400" style='width:auto !important; padding-top:20px; padding-bottom:20px;'>

As illustrated above, the [MOSIP WebSub hub](https://github.com/mosip/websub) contains the key components required to talk to publishers and subscribers and performs the following functions:

- Perform standard operations such as register, publish, subscribe, and unsubscribe.
- Enables data persistence so the hub can recover, even after a restart.
- Resume message delivery in case subscribers become unavailable and available again after some time.
- Handles transient message delivery failures between the hub and the subscriber.
- Authenticates and authorizes hub operations such as publishing to the hub, subscribing, unsubscribing, etc.
- Scales based on the number of subscribers.

Apart from standard SSL/TLS for security at the transport level, an identity provider is used to handle authentication and authorization requests with OAuth2 and JWT tokens. The Kafka message broker enables message persistence, subscription management, etc. To avoid race conditions due to the duplication of subscription and topic registration events, the event consolidator updates the consolidated state of the system by removing duplicate events.

### Customizations

The solution includes the customizations below.

#### Data persistence and reliable delivery

- There can be situations where subscribers are down for long periods (for instance, over six hours). In such instances, the messages are stored in Kafka and an API is provided to retrieve them once the subscribers are back online. Another option is to keep track of undelivered messages and push the missed updates once they return and subscribe.
- Allow retrying when there are transient errors or network issues. With permanent errors (such as being unable to reach subscribers), the subscriber must resubscribe and continue from where they last received the message. If the hub crashes, it must recover the last state through persistence offered by a message broker (Kafka).

#### OAuth2 token validation for publishers and subscribers to access the hub

- There can be situations where only a given set of publishers are allowed to post on a given topic. So OAuth2 tokens and role validations were required to confirm whether publishers were authorized to publish on a certain topic. A publisher must have a token for publishing, and the hub will validate the role using the presented token.
- When publishing events to subscribers, the WebSub specification depends on the secret sent with the subscription to validate the incoming updates against the secret. Here, too, the Oauth2 token and role validation are required for subscribers when subscribing. The subscriber will use the secret to ensure that each event is delivered by the registered hub.

#### Planned enhancements

- In terms of scalability enhancements, the teams are looking at autoscaling the hub to deliver operations faster with the increasing number of messages and subscribers.
- In case of an unsubscription and then a resubscription, messages published on the topic in the interim should not be delivered to the subscriber.

## Benefits

MOSIP benefitted by using Ballerina in its current deployments as described below.

- The deployment in the Philippines has generated around 26 million Unique Identification Numbers (UINs) so far, with around 250,000 applications being processed daily to generate the UINs. The latest version was deployed in production in 2022.
- Morocco has a small deployment, an on-premise deployment on Openshift with a few components on AWS.
- There are more than eight internal deployments for dev, QA, testing, and production worldwide.

For more information on the ongoing partnerships with countries, see [MOSIP news and events](https://www.mosip.io/news-events.php).
