---
layout: ballerina-health-support-left-nav-pages-swanlake
title: Health tool (FHIR/HL7)
description: The health tool generates API templates and library packages for developing healthcare integrations.
keywords: ballerina, programming language, health, contract
permalink: /learn/health-tool/
active: health-tool
intro: The health tool generates API templates and library packages for developing healthcare integrations.
---

They are primarily focused on the [Fast Healthcare Interoperability Resources (FHIR)](https://www.hl7.org/fhir/overview.html) standard and are developed using Ballerina.

>**Info:** It is supported from Ballerina Swan Lake version 2201.7.0 onwards.

## Prerequisites

Download a directory containing all FHIR specification definition files. You can download a preferred standard implementation guide from the [FHIR Implementation Guide registry](https://fhir.org/guides/registry/).

>**Note:** It is recommended to use a Standard for Trial Use (STU) or higher release level of the implementation guides. Make sure that the downloaded specification archive has the StructureDefinition, ValueSet, and CodeSystem files for the Implementation Guide (IG) resources when extracted.

## Usage

This tool uses the command below to generate a Ballerina package for a given FHIR implementation guide. 

```
$ bal health fhir -m <Mode: package> [OPTIONS] <fhir-specification-directory-path>
```

>**Note:** Make sure to give the directory path of the downloaded FHIR definitions as the last argument. 

The FHIR resources in the implementation guide will be represented as Ballerina records including the correct cardinality constraints and metadata. FHIR integration developers can leverage the generated package when transforming custom health data into FHIR format without referring to the specification.

## Command options

The parameters that are available with the tool are listed below.

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-m, --mode`     | Mode can be `package`. If `mode` is set to `package`, a Ballerina package will be generated including all the records and types. New modes will be added in future releases.                                                                                                                                                                                                      | Mandatory          |
| `-o, --output`   | Location of the generated Ballerina artifacts. If this path is not specified, the output will be written to the same directory from which the command is run.                                                                                                                                                                                                                   | Optional           |
| `--package-name` | Name of the Ballerina package to be generated. The package name can be explicitly set using this argument. Unless specified, the default name of the implementation guide will be taken to construct the name of the package. For more information, see the <a href="https://ballerina.io/learn/package-references/#the-name-field" target="_blank">the <code>name</code> field</a>. | Optional           |
| `--org-name`     | Organization name of the Ballerina package to be generated. For more information, see <a href="https://ballerina.io/learn/package-references/#the-org-field" target="_blank"> the <code>org</code> field</a>.                                                                                                                                                                   | Optional           |
| `-v, --version`  | Print the version information of the Health tool.                                                                                                                                                                                                                                                                                                                               | Optional           |
| `-h, --help`     | Print the usage information of the Health tool.                                                                                                                                                                                                                                                                                                                                     | Optional           |

## Install the tool

Execute the command below to pull the Health tool from Ballerina Central.

```
$ bal tool pull health
health:1.0.0 pulled successfully.
health:1.0.0 successfully set as the active version.
```

## Example

Follow the steps below to try out an example use case of the Health tool.

### Clone the example project

Clone the [artifacts of the example](https://github.com/ballerina-guides/healthcare-samples/tree/main/working-with-health-tool/package-generation) and extract them to a preferred location.

The cloned directory includes the artifacts below that will be required to try out this example (Ballerina project and the FHIR specification files). 

- The [`Ballerina.toml`](https://github.com/ballerina-guides/healthcare-samples/blob/main/working-with-health-tool/package-generation/carinbb-patient-service/Ballerina.toml) file: specifies the dependency of the package (name and version) that is to be generated. 
- The [`service.bal`](https://github.com/ballerina-guides/healthcare-samples/blob/main/working-with-health-tool/package-generation/carinbb-patient-service/service.bal) file: includes the import of the generated package together with the business logic/mapping implemented using the generated FHIR resource records.

### Generate the package

Follow the steps below to run the Health tool and create the Ballerina package.

1. Navigate to the cloned `working-with-health-tool` directory.

2. Run the tool with the [required arguments](#command-options) to generate the package.

    >**Note:** This example uses the [definitions files](https://github.com/ballerina-guides/healthcare-samples/tree/main/working-with-health-tool/package-generation/ig-carinbb/definitions) downloaded from the **JSON Definitions ZIP archive** of the [Carin BB implementation guide](https://hl7.org/fhir/us/carin-bb/STU2/downloads.html) to generate the package.

    ```
    $ bal health fhir -m package -o ig_carinbb/gen --org-name healthcare_samples --package-name carinbb_package ig_carinbb/definitions/
    Ballerina FHIR package generation completed successfully.
    ```

3. Build the generated package.

    ```
    $ cd ig_carinbb/gen/carinbb_package
    $ bal pack
    Compiling source
            healthcare_samples/carinbb_package:0.0.1

    Creating bala
            target/bala/healthcare_samples-carinbb_package-any-0.0.1.bala
    ```

4. Push it to a repository.

    >**Tip:** You can push either to the local repository or to [Ballerina Central](https://central.ballerina.io/), which is a remote repository.

    ```
    $ bal push --repository local
    Successfully pushed target/bala/healthcare_samples-carinbb_package-any-0.0.1.bala to 'local' repository.
    ```

### Use the generated package

Follow the steps below to use the generated package by running the cloned Ballerina project.

1. Navigate to the cloned `working-with-health-tool/carinbb-patient-service` directory.

    >**Info:** You can change the dependency (name and version) of the generated package in the [`carinbb-patient-service/Ballerina.toml`](https://github.com/ballerina-guides/healthcare-samples/blob/main/working-with-health-tool/package-generation/carinbb-patient-service/Ballerina.toml) file of this cloned Ballerina project directory as preferred. 

2. Run the cloned Ballerina project and validate the output.

    ```
    $ bal run
    Compiling source
            healthcare_samples/carinbb_ballerina:1.0.0

    Running executable
    ```

3. Invoke the API to try it out.

    ```
    $ curl http://localhost:9090/Patient/2121
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