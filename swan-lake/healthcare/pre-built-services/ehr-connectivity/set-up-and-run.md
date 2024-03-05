---
title: Set up and run
description: The EHR connectivity pre-built services allow you to connect to Epic systems via the provided APIs.
keywords: healthcare, data transformation, EHR, connector, Epic, pre-built service
permalink: /learn/set-up-and-run
active: set-up-and-run
intro: The EHR connectivity pre-built services allow you to connect to Epic systems via the provided APIs.
---

> **Info:** These API services are built using Ballerina and they use the <a target="_blank" href="https://fhir.epic.com/Documentation?docId=developerguidelines"> FHIR API of Epic </a> to interact with its electronic health record system.

- [Epic FHIR administration](#epic-fhir-administration)
- [Epic FHIR clinical](#epic-fhir-clinical)
- [Epic FHIR diagnostics](#epic-fhir-diagnostics)
- [Epic FHIR financial](#epic-fhir-financial)
- [Epic FHIR medications](#epic-fhir-medications)
- [Epic FHIR workflow](#epic-fhir-workflow)

## Set up the prerequisites

To get started with this service, you need:

1. <a target="_blank" href="https://ballerina.io/downloads/">Ballerina 2201.0.0 (Swan Lake) or greater</a>

2. An application, a client key, and a public key of the Epic FHIR server to access their FHIR API. 

    > **Info:** For more information on creating the application on the Epic FHIR sandbox, see <a target="_blank" href="https://fhir.epic.com/Documentation?docId=oauth2&section=BackendOAuth2Guide">SMART Backend Services (Backend OAuth 2.0)</a>


## Run the pre-built service

Follow the steps below to run an EHR connectivity pre-built service.

1. Clone the [`open-healthcare-prebuilt-services`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main) GitHub repository.

2. Navigate to the `v2-to-fhirr4-service` directory, which has the pre-built service (e.g., `epic-fhirr4-administration-api-service
` for the Epic FHIR administration service).

3. Set the following values from environment variables.

    - `EPIC_FHIR_SERVER_URL` - The URL of the Epic FHIR server
    - `EPIC_FHIR_SERVER_TOKEN_URL` - The URL of the Epic FHIR server token endpoint
    - `EPIC_FHIR_APP_CLIENT_ID` - The client ID of the Epic FHIR application
    - `EPIC_FHIR_APP_PRIVATE_KEY_FILE` - File path for the private key file created for the Epic FHIR application

4. Run the project.

    ```
    $ bal run
    ```

5. Invoke the API by sending the sample request below to access FHIR patient records.

    ```
    $ curl --location 'localhost:9090/fhir/r4/Patient/erXuFYUfucBZaryVksYEcMg3'
    ```

## API reference

For information on the APIs supported by each EHR connectivity, see [API reference](/learn/healthcare/pre-built-services/ehr-connectivity/api-reference/).

