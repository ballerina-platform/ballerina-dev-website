---
title: C-CDA to FHIR data transformation
description: This service transforms Consolidated Clinical Document Architecture (C-CDA) messages to FHIR resources.
keywords: healthcare, data transformation, pre-built service, C-CDA, FHIR
permalink: /learn/ccda-to-fhir-transformation/
active: ccda-to-fhir-transformation
intro: This service transforms Consolidated Clinical Document Architecture (C-CDA) messages to FHIR resources. 
---

Data transformation conditions are taken from the [official C-CDA to FHIR mappings](http://hl7.org/fhir/us/ccda/2023May/) and based on the feedback received from the users.

You do not have to write code from scratch. Instead, you can reuse these existing services when implementing your FHIR services. You can deploy the pre-built service [in your environment](#deploy-in-your-environment), [in WSO2 Choreo](#deploy-in-wso2-choreo) as a standard Ballerina service, or [use the FHIR tools user interface](#use-the-fhir-tools) to perform C-CDA to FHIR data transformations.

> **Note:** This supports the FHIR version 4.0.1.

Also, this pre-built service exposes the following CCDA-to-FHIR transformations.

- C-CDA Allergy Intolerance Observation to FHIR Allergy Intolerance.
- C-CDA Problem observation to FHIR Condition.
- C-CDA Results to FHIR Diagnostic Report.
- C-CDA Immunization Activity to FHIR Immunization.
- C-CDA Medication Activity to FHIR Medication.
- C-CDA Patient Role Header to FHIR Patient.
- C-CDA Author Header to FHIR Practitioner.
- C-CDA Procedure Activity to FHIR Procedure.

## Deploy in your environment

Follow the steps below to deploy this C-CDA to FHIR data transformation service on your environment.

1. Clone the [`open-healthcare-prebuilt-services`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main) GitHub repository.

2. Navigate to the `ccda-to-fhirr4-service` directory, which has the pre-built service.

3. Run the project.

    ```
    $ bal run
    ```

4. Invoke the API by sending the sample request below.

    ```
    $ curl 'http://<host>:<port>/transform' \ 
    --header 'Content-Type: application/xml' \
    --data-raw '<ClinicalDocument/>'
    ```

## Deploy in WSO2 Choreo

[WSO2 Choreo](https://wso2.com/choreo/) is an internal developer platform that redefines how you create digital experiences. You can deploy this C-CDA to FHIR data transformation service in Choreo as follows. 

### Set up the prerequisites

If you are signing in to the Choreo Console for the first time, create an organization as follows.

1. Sign in to the [Choreo Console](https://console.choreo.dev/) using your preferred method.

2. Enter a unique organization name (e.g., Stark Industries).

3. Read and accept the privacy policy and terms of use.

4. Click **Create**. 

This creates the organization and opens the home page of the default project created for you.

### Create the service component

Follow the steps below to create the service component in Choreo.

1. Fork the [pre-built Ballerina services repository](https://github.com/wso2/open-healthcare-prebuilt-services) to your GitHub organization.

2. Create and configure a service component pointing to the `ccda-to-fhirr4-service`. 

    > **Info:** For instructions, see [Create a service component](https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-1-create-a-service-component).

3. Click **Create**. 

Once the component creation is complete, you will see the component overview page.

### Build and deploy

Deploy the C-CDA to FHIR transformation service in your organization. 

> **Info:** For instructions, see [Build and deploy](https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-2-build-and-deploy).

## Use the FHIR tools

Follow the steps below to use the FHIR tools user interface to convert C-CDA data to FHIR standards. 

1. Access the [FHIR tools user interface](https://fhirtools.io/) and click **Try It Out**.

2. Enter the C-CDA message and click **Perform Transformation**.
