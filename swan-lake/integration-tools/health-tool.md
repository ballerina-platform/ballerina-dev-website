---
layout: ballerina-health-support-left-nav-pages-swanlake
title: Health tool (FHIR/HL7)
description: The health tool generates accelerators for developing healthcare integrations in Ballerina.
keywords: ballerina, programming language, health, contract
permalink: /learn/health-tool/
active: health-tool
intro: The health tool generates accelerators for developing healthcare integrations in Ballerina.
---

The Health tool can generate accelerators primarily focussed on the <a href="https://www.hl7.org/fhir/overview.html" target="_blank">Fast Healthcare Interoperability Resources (FHIR)</a> standard. The Health tool is supported from Ballerina Swan Lake version 2201.7.0 onwards.

## Ballerina FHIR package generator

This tool generates a Ballerina package for a given FHIR implementation guide. The FHIR resources in the implementation guide will be represented as Ballerina records including the correct cardinality constraints and metadata.

FHIR integration developers can leverage the generated package when transforming custom health data into FHIR format without referring to the specification.

## Prerequisites

- <a href="https://ballerina.io/downloads/" target="_blank">Ballerina 2201.7.0 (Swan Lake Update 7)</a>
- A directory containing all FHIR specification definition files. You can download a preferred standard implementation guide from the <a href="http://fhir.org/guides/registry/" target="_blank">FHIR Implementation Guide registry</a>

    >**Note:** It is recommended to use the STU version of the implementation guides. Make sure that the downloaded specification archive has the `StructureDefinition`, `ValueSet`, and `CodeSystem` files for the Implementation Guide (IG) resources when extracted.

## Available parameters

The parameters that are available with the tool are listed below.

| Parameter      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-m, --mode`     | Mode can be `package`. If `mode` is set to `package`, a Ballerina package will be generated including all the records and types. New modes will be added in future releases.                                                                                                                                                                                                      | mandatory          |
| `-o, --output`   | Location of the generated Ballerina artifacts. If this path is not specified, the output will be written to the same directory from which the command is run.                                                                                                                                                                                                                   | optional           |
| `--package-name` | Name of the Ballerina package to be generated. The package name can be explicitly set using this argument. Unless specified, the default name of the implementation guide will be taken to construct the name of the package. For more information, see <a href="https://ballerina.io/learn/package-references/#the-name-field" target="_blank">the <code>name</code> field</a>. | optional           |
| `--org-name`     | Organization name of the Ballerina package to be generated. For more information, see <a href="https://ballerina.io/learn/package-references/#the-org-field" target="_blank"> the <code>org</code> field</a>.                                                                                                                                                                   | optional           |
| `-v, --version`  | Print the version information of the Health tool.                                                                                                                                                                                                                                                                                                                               | optional           |
| `-h, --help`     | Print the usage details of the Health tool.                                                                                                                                                                                                                                                                                                                                     | optional           |

## Example

Follow the steps below to try out an example of using the Health tool.

1. Pull the Health tool from Ballerina Central.

    ```
    $ bal tool pull health
    health:1.0.0 pulled successfully.
    health:1.0.0 successfully set as the active version.
    ```

2. Download the **JSON Definitions ZIP archive** from the <a href="http://hl7.org/fhir/us/carin-bb/STU2/downloads.html" target="_blank">Carin BB implementation guide</a> and extract it to your current directory.

3. Run the tool with the [required arguments](#available-parameters).

    >**Note:** Provide values for mandatory arguments. Make sure to give the directory path of the downloaded FHIR definitions as the last argument.

    ```
    $ bal health fhir -m package --org-name healthcare --package-name carinbb.lib -o gen ./definitions.json
    Ballerina FHIR package generation completed successfully.
    ```

4. Build the generated package and push it to a repository.

    >**Info:** You can push either to the local repository or the remote repository in Ballerina Central.

    ```
    $ cd gen/carinbb.lib
    $ bal pack
    Compiling source
            healthcare/carinbb.lib:0.0.1

    Creating bala
            target/bala/healthcare-carinbb.lib-any-0.0.1.bala
    ```

    ```
    $ bal push --repository local
    Successfully pushed target/bala/healthcare-carinbb.lib-any-0.0.1.bala to 'local' repository.
    ```

5. Create a Ballerina project and import the generated package. 

    >**Note:** Make sure to add the correct version and repository to the `Ballerina.toml` file.

    ```
    [package]
    org = "healthcare"
    name = "integration.carinbb"
    version = "1.0.0"
    distribution = "2201.7.0"

    [[dependency]]
    org = "healthcare"
    name = "carinbb.lib"
    version = "0.0.1"
    repository = "local"
    ```

6. Implement the business logic/mapping using the generated FHIR resource records.

    ```ballerina
    import ballerina/http;
    import ballerinax/health.fhir.r4;
    import healthcare/carinbb.lib as carinbb;

    listener http:Listener httpListener = new (9090);

    public type Patient record {
        string id;
        string lastName?;
        string firstName;
        string middleName;
        string gender?;
    };

    service / on httpListener {

        isolated resource function get [string fhirType]/[string id]() returns @http:Payload {mediaType: ["application/fhir+json", "application/fhir+xml"]} r4:FHIRWireFormat|error {

            // Mock the patient payload from the legacy healthcare system.

            Patient patient = {
                id: "2121",
                lastName: "Doe",
                firstName: "John",
                middleName: "Hemish",
                gender: "male"
            };

            // Convert to the Carin BB Patient structure.
            carinbb:C4BBPatient c4bbPatient = {
                id: patient.id,
                identifier: [
                    {
                        system: "http://hl7.org/fhir/sid/us-ssn",
                        value: patient.id
                    }
                ]
        ,
                gender: <carinbb:PatientGender>patient.gender,
                name: [
                    {
                        family: patient.lastName,
                        given: [patient.firstName, patient.middleName]
                    }
                ]
            };

            return c4bbPatient.toJson();
        }
    }
    ```

7. Run the Ballerina project and validate the output.

    ```
    $ bal run
    Compiling source
            healthcare/integration.carinbb:1.0.0

    Running executable
    ```

8. Invoke the API to test it.

    ```
    $ curl --location --request GET 'http://localhost:9090/Patient/2121'
    ```

    You can view the response shown below.

    ```
    {
    "resourceType": "Patient",
    "gender": "male",
    "id": "2121",
    "identifier": [
        {
        "system": "http://hl7.org/fhir/sid/us-ssn",
        "value": "2121"
        }
    ],
    "meta": {
        "profile": [
        "http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient"
        ]
    },
    "name": [
        {
        "family": "Doe",
        "given": [
            "John",
            "Hemish"
        ]
        }
    ]
    }  
    ```
