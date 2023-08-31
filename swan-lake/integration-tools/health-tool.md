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

## Prerequisites

- <a href="https://ballerina.io/downloads/" target="_blank">Ballerina 2201.7.0 (Swan Lake Update 7)</a>
- A text editor
  >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the 
  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
-  A directory containing all FHIR specification definition files. You can download a preferred standard implementation guide from the [FHIR Implementation Guide registry](http://fhir.org/guides/registry/)

    >**Note:** It is recommended to use the STU version of the implementation guides. Make sure that the downloaded specification archive has the `StructureDefinition`, `ValueSet`, and `CodeSystem` files for the Implementation Guide (IG) resources when extracted.

## Usage

This tool generates a Ballerina package for a given FHIR implementation guide. The FHIR resources in the implementation guide will be represented as Ballerina records including the correct cardinality constraints and metadata.

FHIR integration developers can leverage the generated package when transforming custom health data into FHIR format without referring to the specification.

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

## Install the tool

Pull the Health tool from Ballerina Central.

    ```
    $ bal tool pull health
    health:1.0.0 pulled successfully.
    health:1.0.0 successfully set as the active version.
    ```

## Create the package

Follow the steps below to create the package.

1. Download the **JSON Definitions ZIP archive** from the [Carin BB implementation guide](http://hl7.org/fhir/us/carin-bb/STU2/downloads.html) and extract it to your current directory.

2. Run the tool with the [required arguments](#available-parameters) to generate the package.

    >**Note:** Provide values for mandatory arguments. Make sure to give the directory path of the downloaded FHIR definitions as the last argument.

    ```
    $ bal health fhir -m package --org-name healthcare --package-name carinbb.lib -o gen ./definitions.json
    Ballerina FHIR package generation completed successfully.
    ```

3. Build the generated package.

    >**Info:** You can push either to the local repository or the remote repository in Ballerina Central.

    ```
    $ cd gen/carinbb.lib
    $ bal pack
    Compiling source
            healthcare/carinbb.lib:0.0.1

    Creating bala
            target/bala/healthcare-carinbb.lib-any-0.0.1.bala
    ```

4. Push it to a repository.

    >**Tip:** You can push either to the local repository or the remote repository in Ballerina Central.

    ```
    $ bal push --repository local
    Successfully pushed target/bala/healthcare-carinbb.lib-any-0.0.1.bala to 'local' repository.
    ```

## Example

Follow the steps below to try out an example use case of the Health tool.

1. Clone the [artifacts of the sample](https://github.com/ballerina-guides/healthcare-samples/tree/main/working_with_health_tool) and extract them to a preferred location.

    >**Note:** Make sure to add the correct version and repository to the [`Ballerina.toml`](https://github.com/ballerina-guides/healthcare-samples/blob/main/working_with_health_tool/Ballerina.toml) file. The generated package is imported and the business logic/mapping is implemented using the generated FHIR resource records in the [`main.bal`](https://github.com/ballerina-guides/healthcare-samples/blob/main/working_with_health_tool/main.bal) file.

2. Run the Ballerina project and validate the output.

    ```
    $ bal run
    Compiling source
            healthcare/integration.carinbb:1.0.0

    Running executable
    ```

3. Invoke the API to try it out.

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
