---
title: FHIR R4 metadata service
description: This service provides the implementation of the FHIR metadata API.
keywords: healthcare, pre-built service, metadata
permalink: /learn/metadata-service/
active: metadata-service
intro: This service provides the implementation of the FHIR metadata API.
---

It implements the <a target="_blank" href="https://www.hl7.org/fhir/http.html#capabilities">capabilities</a> interaction, which is used to retrieve a Capability Statement describing the server's current operational functionality by FHIR client applications.

This FHIR server interaction returns a <a target="_blank" href="https://hl7.org/fhir/capabilitystatement.html">Capability Statement</a> FHIR resource that specifies which resource types and interactions are supported by the FHIR server.

> **Note:** This supports the FHIR version 4.0.1.

## Run the pre-built service

Follow the steps below to run an EHR connectivity pre-built service.

1. Clone the [`open-healthcare-prebuilt-services`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main) GitHub repository.

2. Navigate to the `metadata-fhirr4-service` directory, which has the pre-built service.

3. Configure the `Config.toml` file project with the required [configurations](#define-configurations).

4. Add the required [resources](#define-resourceses) in a `/resources/fhir_resources.json` file.

5. Run the project.

    ```
    $ bal run
    ```

6. Invoke the API by sending the sample request below to get the FHIR Capability Statement.

    ```
    $ curl 'http://<host>:<port>/fhir/r4/metadata'
    ```

## Deploy in WSO2 Choreo

<a target="_blank" href="https://www.hl7.org/fhir/http.html#capabilities">WSO2 Choreo</a> is an internal developer platform that redefines how you create digital experiences. You can deploy this FHIR R4 metadata pre-built service in Choreo as follows. 

### Set up the prerequisites

If you are signing in to the Choreo Console for the first time, create an organization as follows.

1. Sign in to the <a target="_blank" href="https://console.choreo.dev/">Choreo Console</a> using your preferred method.

2. Enter a unique organization name (e.g., Stark Industries).

3. Read and accept the privacy policy and terms of use.

4. Click **Create**. 

This creates the organization and opens the home page of the default project created for you.

### Create the service component

Follow the steps below to create the service component in Choreo.

1. Fork the <a target="_blank" href="https://github.com/wso2/open-healthcare-prebuilt-services">pre-built Ballerina services repository</a> to your GitHub organization.

2. Create and configure a service component pointing to the `metadata-fhirr4-service`. 

    > **Info:** For instructions, see <a target="_blank" href="https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-1-create-a-service-component">Create a service component</a>

3. Click **Create**. 

Once the component creation is complete, you will see the component overview page.

### Define configurations

Configure the deployment configurables in **Configurations/Configs** using the Choreo configurable editor as described below.

| Configuration               | Description                                                                                   | Example                                                                                     |
|-----------------------------|-----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| `version`                   | Business version of the capability statement                                                  | 0.1.7                                                                                       |
| `name`                      | Name for this capability statement (computer friendly)                                        | WSO2OpenHealthcareFHIR                                                                      |
| `title`                     | Name for this capability statement (human friendly)                                           | FHIR Server                                                                                 |
| `status`                    | `draft`/`active`/`retired`/`unknown`                                                          | active                                                                                      |
| `experimental`              | For testing purposes, not real usage                                                          | true                                                                                        |
| `date`                      | Date last changed                                                                             | 26-01-2023                                                                                  |
| `kind`                      | `instance`/`capability`/`requirements`                                                        | instance                                                                                    |
| `fhirVersion`               | FHIR version supported by the system                                                          | 4.0.1                                                                                       |
| `format`                    | Supported formats                                                                             | json                                                                                        |
| `patchFormat`               | Supported patch formats                                                                       | application/json-patch+json                                                                 |
| `implementationUrl`         | Base URL for the installation                                                                 | https://choreoapis/dev/fhir_server/0.1.5                                                    |
| `implementationDescription` | Describes this specific instance                                                              | WSO2 Healthcare FHIR                                                                        |
| `interaction`               | Supported operations                                                                          | search-system, history-system                                                               |
| `cors`                      | CORS Headers availability                                                                     | true                                                                                        |
| `discoveryEndpoint`         | The discovery endpoint for the server                                                         | https://api.asgardeo.io/t/&lt;organization_name&gt;/oauth2/token/.well-known/openid-configuration |
| `tokenEndpoint`             | OAUTH2 access token URL (This is optional. Add if a `discoveryEndpoint` is not provided.)     | https://api.asgardeo.io/t/<organization_name>/oauth2/token                                  |
| `revocationEndpoint`        | OAUTH2 access revoke url (This is optional. Add if a `discoveryEndpoint` is not provided.)    | https://api.asgardeo.io/t/<organization_name>/oauth2/revoke                                 |
| `authorizeEndpoint`         | OAUTH2 access authorize url (This is optional. Add if a `discoveryEndpoint` is not provided.) | https://api.asgardeo.io/t/<organization_name>/oauth2/authorize                              |

Below is a sample `Config.toml` file consisting of the above configurations.

```toml
## server related configurables
[configFHIRServer]
version = "1.2.0"
name = "WSO2OpenHealthcareFHIR"
title = "FHIR Server"
status = "active"
experimental = true
date = "2022-11-24"
kind = "instance"
fhirVersion = "4.0.1"
format = ["json"]
patchFormat = ["application/json-patch+json"]
implementationUrl = "<FHIR_BASE_URL>"
implementationDescription = "WSO2 Open Healthcare FHIR"

## server security related configurables
[configRest]
mode = "server"
resourceFilePath = "resources/fhir_resources.json"
interaction = ["search-system"]
[configRest.security]
cors = false
discoveryEndpoint = "https://api.asgardeo.io/t/<organization_name>/oauth2/token/.well-known/openid-configuration"
managementEndpoint = "https://api.asgardeo.io/t/<organization_name>/oauth2/manage"
```

### Define resources

Add the FHIR resource details in **Configurations/Resources**. A sample `fhir_resources.json` file consisting of `Patient` resource details is shown below.

```json
[
    {
        "type": "Patient",
        "versioning": "versioned",
        "conditionalCreate": false,
        "conditionalRead": "not-supported",
        "conditionalUpdate": false,
        "conditionalDelete": "not-supported",
        "referencePolicies": ["resolves"],
        "searchRevIncludes": ["null"],
        "supportedProfiles": ["http://hl7.org/fhir/StructureDefinition/Patient"],
        "interaction": ["create", "delete", "update", "history-type", "search-type", "vread", "read"],
        "stringSearchParams": ["_lastUpdated", "_security", "_tag", "_source", "_profile"],
        "numberSearchParams": ["_id"]
    }
]  
```

### Build and deploy

<a target="_blank" href="https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-2-build-and-deploy">Deploy</a> the FHIR R4 metadata service in your organization. 

> **Info:** When deploying in Choreo, <a target="_blank" href="https://wso2.com/choreo/docs/devops-and-ci-cd/manage-configurations-and-secrets/#apply-a-file-mount-to-your-container">Choreo's File Mount</a> can be used to mount the `fhir_resources.json` file. The **Mount Path** should be provided as `/resources/fhir_resources.json`.
