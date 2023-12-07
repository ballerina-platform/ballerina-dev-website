---
layout: ballerina-health-support-left-nav-pages-swanlake
title: Health tool (FHIR/HL7)
description: The health tool generates pre-built Ballerina services and library packages for developing healthcare integrations.
keywords: ballerina, programming language, healthcare, contract
permalink: /learn/health-tool/
active: health-tool
intro: The health tool generates pre-built Ballerina services and library packages for developing healthcare integrations.
---

They are primarily focused on the [Fast Healthcare Interoperability Resources (FHIR)](https://www.hl7.org/fhir/overview.html) standard and are developed using Ballerina.

>**Info:** It is supported from Ballerina Swan Lake version 2201.7.0 onwards.

## Prerequisites

Download a directory containing all FHIR specification definition files. You can download a preferred standard implementation guide from the [FHIR Implementation Guide registry](https://fhir.org/guides/registry/).

>**Note:** It is recommended to use a Standard for Trial Use (STU) or higher release level of the implementation guides. Make sure that the downloaded specification archive has the StructureDefinition, ValueSet, and CodeSystem files for the Implementation Guide (IG) resources when extracted.

## Install the tool

Execute the command below to pull the Health tool from Ballerina Central.

```
$ bal tool pull health
health:1.0.0 pulled successfully.
health:1.0.0 successfully set as the active version.
```

## Usage

The Ballerina Health tool support provides the main capabilities below.

- [**Package generation:**](#package-generation) generate a Ballerina package from a given FHIR implementation guide.
- [**Template generation:**](#template-generation) generate pre-built Ballerina services from a given FHIR implementation guide.

The general usage of the tool is as follows.

```
$ bal health fhir -m <Mode: package|template> [OPTIONS] <fhir-specification-directory-path>
```

>**Note:** Make sure to give the directory path of the downloaded FHIR definitions as the last argument. 

## Command options

The parameters that are available with the tool are listed below.

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Usage |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-m, --mode`     | Generation mode, which can be to generate a `package` or `template`.                                                                                                                                                                                                      | <ul><li><a href="#package-generation-command-options">package generation</a></li><li><a href="#template-generation-command-options">template generation</a></li></ul>          |
| `-o, --output`   | Location of the generated Ballerina artifacts.                                                                                                                                                                                                                   | <ul><li><a href="#package-generation-command-options">package generation</a></li><li><a href="#template-generation-command-options">template generation</a></li></ul>           |
| `--package-name` | Name of the Ballerina package to be generated.   | <ul><li><a href="#package-generation-command-options">package generation</a></li></ul>           |
| `--dependent-package` | Ballerina package name, which contains the IG resources. | <ul><li><a href="#template-generation-command-options">template generation</a></li></ul>           |
| `--org-name`     | Organization name of the Ballerina package to be generated.                                                                                                                                                                  | <ul><li><a href="#package-generation-command-options">package generation</a></li><li><a href="#template-generation-command-options">template generation</a></li></ul>           |
| `-v, --version`  | Print the version information of the Health tool.                                                                                                                                                                                                                                                                                                                               | <ul><li><a href="#package-generation-command-options">package generation</a></li><li><a href="#template-generation-command-options">template generation</a></li></ul>           |
| `-h, --help`     | Print the usage information of the Health tool.                                                                                                                                                                                                                                                                                                                                     | <ul><li><a href="#package-generation-command-options">package generation</a></li><li><a href="#template-generation-command-options">template generation</a></li></ul>           |
| `--included-profile`     | Generate only a specific profile/s as a pre-built Ballerina service.                                                                                                                                                                                                                                                                                                                                     | <ul><li><a href="#template-generation-command-options">template generation</a></li></ul>           |
| `--excluded-profile`     | Skip a specific profile/s when generating pre-built services.                                                                                                                                                                                                                                                                                                                                      | <ul><li><a href="#template-generation-command-options">template generation</a></li></ul>           |

## Package generation

The FHIR resources in the implementation guide will be represented as Ballerina records including the correct cardinality constraints and metadata. FHIR integration developers can leverage the generated package when transforming custom health data into FHIR format without referring to the specification.

### Package generation usage

The tool supports the package generation usage as follows.

```
bal health fhir -m package [OPTIONS] <fhir-specification-directory-path>
```

### Package generation command options


| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-m, --mode`     | If `mode` is set to `package`, a Ballerina package will be generated including all the records and types. In the `template` mode, pre-built Ballerina services can be generated for implementing FHIR APIs.                                                                                                                                                                                                      | Mandatory          |
| `-o, --output`   | Location of the generated Ballerina artifacts. If this path is not specified, the output will be written to the same directory from which the command is run.                                                                                                                                                                                                                   | Optional           |
| `--package-name` | Name of the Ballerina package to be generated. The package name can be explicitly set using this argument. Unless specified, the default name of the implementation guide will be taken to construct the name of the package. For more information, see the <a href="https://ballerina.io/learn/package-references/#the-name-field" target="_blank">the <code>name</code> field</a>. | Optional           |
| `--org-name`     | Organization name of the Ballerina package to be generated. For more information, see <a href="https://ballerina.io/learn/package-references/#the-org-field" target="_blank"> the <code>org</code> field</a>.                                                                                                                                                                   | Optional           |
| `-v, --version`  | Print the version information of the Health tool.                                                                                                                                                                                                                                                                                                                               | Optional           |
| `-h, --help`     | Print the usage information of the Health tool.                                                                                                                                                                                                                                                                                                                                     | Optional           |

### Package generation example

Follow the steps below to try out an example package generation use case of the Health tool.

#### Clone the example project

Clone the [artifacts of the example](https://github.com/ballerina-guides/healthcare-samples/tree/main/working_with_health_tool/package_gen) and extract them to a preferred location.

The cloned directory includes the artifacts below that will be required to try out this example (Ballerina project and the FHIR specification files). 

- The [`/ig_carinbb/definitions`](https://github.com/ballerina-guides/healthcare-samples/tree/main/working_with_health_tool/package_gen/ig_carinbb/definitions) directory: includes the definition files of the FHIR specification.
- The [`carinbb_patient_service`](https://github.com/ballerina-guides/healthcare-samples/tree/main/working_with_health_tool/package_gen/carinbb_patient_service) directory: includes the Ballerina project containing the Ballerina project with the artifacts (i.e., the `Ballerina.toml`, `Dependencies.toml`, and `service.bal` files) to be executed.

#### Generate the package

Follow the steps below to run the Health tool and create the Ballerina package.

1. Navigate to the cloned `working_with_health_tool/package_gen` directory.

2. Run the tool with the [required arguments](#package-generation-command-options) to generate the package.

    >**Note:** This example uses the [definitions files](https://github.com/ballerina-guides/healthcare-samples/tree/main/working_with_health_tool/package_gen/ig_carinbb/definitions) downloaded from the **JSON Definitions ZIP archive** of the [Carin BB implementation guide](https://hl7.org/fhir/us/carin-bb/STU2/downloads.html) to generate the package.

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

#### Use the generated package

Follow the steps below to use the generated package by running the cloned Ballerina project.

1. Navigate to the cloned `working_with_health_tool/carinbb_patient_service` directory.

    >**Info:** You can change the dependency (name and version) of the generated package in the [`carinbb_patient_service/Ballerina.toml`](https://github.com/ballerina-guides/healthcare-samples/blob/main/working_with_health_tool/package_gen/carinbb_patient_service/Ballerina.toml) file of this cloned Ballerina project directory as preferred. 

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

    ```json
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

## Template generation

The tool can also be used to generate a pre-built Ballerina service for each FHIR resource in the implementation guide. FHIR integration developers can leverage any of these generated Ballerina packages by implementing the business logic for FHIR RESTful APIs and expose them as standard FHIR APIs.

### Template generation usage

The tool supports the template generation usage as follows.

```
$ bal health fhir -m template --dependent-package <fully-qualified-ballerina-package> [OPTIONS] <fhir-specification-directory-path>
```

### Template generation command options


| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-m, --mode`     | If `mode` is set to `template`, pre-built Ballerina services can be generated for implementing FHIR APIs.                                                                                                                                                                                                      | Mandatory          |
| `--dependent-package` | Fully qualified name of the published Ballerina package containing the IG resources (e.g., `<org>/<package>`. This option can be used to generate pre-built Ballerina service specifically for the resources in the given IG. The package name part of this value will be added as a prefix to the service name. | Mandatory           |
| `-o, --output`   | Location of the generated Ballerina artifacts. If this path is not specified, the output will be written to the same directory from which the command is run.                                                                                                                                                                                                                   | Optional           |
| `--org-name`     | Organization name of the Ballerina package to be generated. For more information, see <a href="https://ballerina.io/learn/package-references/#the-org-field" target="_blank"> the <code>org</code> field</a>.                                                                                                                                                                   | Optional           |
| `-v, --version`  | Print the version information of the Health tool.                                                                                                                                                                                                                                                                                                                               | Optional           |
| `-h, --help`     | Print the usage information of the Health tool.                                                                                                                                                                                                                                                                                                                                     | Optional           |
| `--included-profile`     | If only a specific profile/s needs to be generated as a pre-built Ballerina service, specify the profile URL as the value of this parameter. This argument can be used more than once.                                                                                                                                                                                                                                                                                                                                     | Optional           |
| `--excluded-profile`     | If only a specific profile/s needs to be skipped when generating pre-built services, specify the profile URL as the value of this parameter. This argument can be used more than once.                                                                                                                                                                                                                                                                                                                                     | Optional           |

### Template generation example

Follow the steps below to try out an example template generation use case of the Health tool.

#### Clone the example project

Clone the [artifacts of the example](https://github.com/ballerina-guides/healthcare-samples/tree/main/working_with_health_tool/template_gen) and extract them to a preferred location.

The cloned directory includes the [`/ig_uscore/definitions`](https://github.com/ballerina-guides/healthcare-samples/tree/main/working_with_health_tool/package_gen/ig_carinbb/definitions) directory, which includes the definition files of the FHIR specification.

#### Generate the template

Follow the steps below to run the Health tool and generate the pre-built service templates for the selected package.

>**Note:** You need to have a Ballerina package generated using FHIR definitions and the Health tool as a prerequisite for generating the pre-built service templates for them. This example uses the [`health.fhir.r4.uscore501`](https://central.ballerina.io/ballerinax/health.fhir.r4.uscore501/1.2.0) package in Ballerina Central.

1. Navigate to the cloned `working_with_health_tool/template-gen` directory.

2. Run the tool with the [required arguments](#template-generation-command-options) to generate the pre-built services.

    >**Note:** This example uses the [definitions files](https://github.com/ballerina-guides/healthcare-samples/tree/main/working_with_health_tool/template_gen/ig_uscore/definitions) downloaded from the **JSON Definitions ZIP archive** of the [US Core implementation guide](https://build.fhir.org/ig/HL7/US-Core/downloads.html) to generate the templates.

    ```
    $ bal health fhir -m template -o ig_uscore/gen --org-name healthcare_samples --dependent-package healthcare_samples/carinbb_package ig_uscore/definitions/
    Ballerina FHIR template generation completed successfully.
    ```

    The generated folder (i.e., `working_with_health_tool/template-gen/ig_uscore/gen`) will contain the following directory structure.

    ```
    .
    |____organization
    | 	|____api_config.bal
    | 	|____service.bal
    |	|____.gitignore
    |	|____Package.md
    | 	|____Ballerina.toml
    |____relatedperson
    |	|____api_config.bal
    | 	|____service.bal
    | 	|____.gitignore
    | 	|____Package.md
    | 	|____Ballerina.toml
    |____practitioner
    | 	|____api_config.bal
    | 	|____service.bal
    | 	|____Dependencies.toml
    | 	|____.gitignore
    | 	|____Package.md
    | 	|____Ballerina.toml
    |____explanationofbenefit
    | 	|____api_config.bal
    | 	|____service.bal
    | 	|____Dependencies.toml
    | 	|____.gitignore
    | 	|____Package.md
    | 	|____Ballerina.toml
    |____patient
    |	|____api_config.bal
    |	|____service.bal
    | 	|____.gitignore
    | 	|____Package.md
    | 	|____Ballerina.toml
    |____coverage
    | 	|____api_config.bal
    | 	|____service.bal
    | 	|____.gitignore
    | 	|____Package.md
    | 	|____Ballerina.toml  
    ```

3. Update the `get fhir/r4/Practitioner/[string id]corresponding` method in the `service.bal` file of the `practitioner` pre-built service with the code below to implement the business logic.

    >**Info:** Refer to the provided sample when implementing the data element mappings and how the response needs to be set in an FHIR API. You can use VS Code to open the generated pre-built service and implement the business logic in it. It has Ballerina language support via an extension, which assists on both syntactic and semantic aspects.

    ```ballerina
    isolated resource function get fhir/r4/Practitioner/[string id] (r4:FHIRContext fhirContext) returns Practitioner|r4:OperationOutcome|r4:FHIRError {
        Practitioner practitioner = {
            resourceType: "Practitioner",
            id: "1",
            meta: {
                lastUpdated: "2021-08-24T10:10:10Z",
                profile: [
                    "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner"
                ]
            },
            identifier: [
                {
                    use: "official",
                    system: "http://hl7.org/fhir/sid/us-npi",
                    value: "1234567890"
                }
            ],
            name: [
                {
                    use: "official",
                    family: "Smith",
                    given: [
                        "John",
                        "Jacob"
                    ],
                    prefix: [
                        "Dr."
                    ]
                }
            ]
        };
        return practitioner;
    }
    ```

#### Use the generated template

Follow the steps below to use the generated service template by running the cloned Ballerina project.

1. Navigate to the generated `working_with_health_tool/template-gen/ig_uscore/gen/practitioner/` directory.

2. Run the service and verify the output response.

    ```
    $ bal run
    Compiling source
            healthcare_samples/health.fhir.r4.uscore501.practitioner:1.0.0

    Running executable
    ```

3. Invoke the API to try it out.

    ```
    $ curl http://localhost:9090/fhir/r4/Practitioner/12
    ```

    You can view the response shown below.

    ```json
    {
    "resourceType": "Practitioner",
    "identifier": [
        {
            "system": "http://hl7.org/fhir/sid/us-npi",
            "use": "official",
            "value": "1234567890"
        }
    ],
    "meta": {
        "lastUpdated": "2021-08-24T10:10:10Z",
        "profile": [
            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner"
        ]
    },
    "name": [
        {
            "given": [
                "John",
                "Jacob"
            ],
            "prefix": [
                "Dr."
            ],
            "use": "official",
            "family": "Smith"
        }
    ],
    "id": "1"
    }
    ```
