---
layout: ballerina-create-your-first-connector-left-nav-pages-swanlake
title: Create your first connector with Ballerina
description: step-by-step guide to create Ballerina connectors using OpenAPI specifications.
keywords: ballerina, connector, library, REST, API, openAPI, Ballerina Central
permalink: /learn/create-your-first-connector-with-ballerina/
active: create-your-first-connector-with-ballerina
intro: This guide walks you through creating your first Ballerina connector using an OpenAPI specification.
---

## Introduction

Ballerina is a programming language that simplifies integration by providing a large library of pre-built connectors. These connectors are special packages consisting of one or more [Ballerina clients](https://ballerina.io/learn/by-example/client-class/), which allow communication with external services, usually via REST APIs. By using connectors, developers can quickly integrate third-party services into their Ballerina applications without having to worry about the technical details of API interactions.

Along with its powerful library ecosystem, Ballerina also allows developers to easily create, share, and manage client connectors. These connectors are typically published on Ballerina Central as public connectors, available to the entire community, but you can also publish them as private connectors for internal use within your organization.

In this guide, we'll walk you through how to generate your first Ballerina connector using an OpenAPI specification. This is one of the fastest and easiest ways to build connectors, enabling you to quickly integrate external services into your Ballerina projects.

## Prerequisites

Before we begin, make sure you have:

1. A basic understanding of Ballerina Swan Lake and the [latest version installed](https://ballerina.io/downloads/).
2. An OpenAPI specification of the API for which you’re building the connector, along with the relevant API credentials where required (e.g., Twitter Developer account keys).
3. A GitHub account, and Git installed locally.
4. Visual Studio Code with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.

## Step 1: Set the project structure

**Important**: If you'd like to contribute your project as an official Ballerina connector, you can skip the steps below and contact the Ballerina team through the [Discord community](https://discord.com/invite/ballerinalang). In this case, the repository will be created under the [`ballerina-platform`](https://github.com/ballerina-platform/) organization, and the team will set up the initial project structure for you.

1. Create a new GitHub repository to host your connector. Ballerina official connector repositories follow the naming pattern: `module-ballerinax-<connector-name>` (e.g., module-ballerinax-twitter). But for other connectors, you can choose a name that best represents your connector.

2. Clone your newly created repository to your local machine:

   ```
   git clone https://github.com/<your-username>/<connector-repo-name>.git
   cd <connector-repo-name>
   ```

3. Visit the [Ballerina generated connector template on GitHub](https://github.com/ballerina-platform/ballerina-library/tree/main/library-templates/generated-connector-template/files) and copy the entire project structure and content to your local repository folder, making sure to include all files and directories.

4. Your local project structure should now look similar to this:

   ```
   module-ballerinax-myconnector/
   ├── .github/
   ├── ballerina/
   |   ├── tests/
   │   ├── Ballerina.toml
   │   ├── README.md
   │   ├── build.gradle
   │   └── client.bal
   ├── build-config/
   ├── docs/
   │   └── spec/
   │       └── sanitations.md
   ├── examples/
   │   ├── README.md
   │   ├── build.gradle
   │   └── build.sh
   ├── gradle/
   ├── .gitignore
   ├── LICENSE
   ├── README.md
   ├── build.gradle
   ├── gradle.properties
   ├── gradlew
   ├── gradlew.bat
   └── settings.gradle
   ```

> **Tip**: The template includes placeholders for various fields. To update them with your connector-specific metadata, use the provided [Ballerina script](https://github.com/ballerina-platform/ballerina-library/blob/main/library-templates/generated-connector-template/scripts/replace_placeholders.bal).

Detailed information on the Ballerina connector structure can be found in the [Ballerina module contribution guide](https://github.com/ballerina-platform/ballerina-library/blob/main/docs/adding-a-new-ballerina-module.md#directory-structure).

## Step 2: Prepare the OpenAPI definition

1. Find the OpenAPI definition for the API you want to create a connector. This is usually available in the API documentation.
   Example: For Twitter, you can get the latest API definition from the [Twitter OpenAPI endpoint](https://api.twitter.com/2/openapi.json).

2. Save the file as `openapi.yaml` (or `openapi.json`) in the `docs/spec` directory of your project.

3. To improve compatibility and readability before generating the Ballerina client, run the following preprocessing steps using the Ballerina OpenAPI tool:

   **a. Flatten the OpenAPI definition**

   This step relocates all inline embedded schemas to the `components` section to improve readability and reduce redundancy.
   
   ```
   $ bal openapi flatten -i docs/spec/openapi.yaml -o docs/spec
   ```
   
   This command will generate a `flattened_openapi.yaml` file in the `docs/spec` directory.

   **b. Align the flattened OpenAPI definition**

   This aligns the OpenAPI definition according to the best practices of Ballerina..
   
   ```
   $ bal openapi align -i docs/spec/flattened_openapi.yaml -o docs/spec
   ```

   This command will generate a file named `aligned_ballerina_openapi.yaml` in the `docs/spec` directory.

   **Next steps:**
   - Remove the original `openapi.yaml` and `flattened_openapi.yaml` from the `docs/spec` directory.
   - Rename `aligned_ballerina_openapi.yaml` to `openapi.yaml`.
   - Use the new `openapi.yaml` for generating the Ballerina client in the Step 3.

> **Note:**
> - These preprocessing steps often reduce the need for manual sanitization. However, if further changes are needed (e.g. modifying security schemes or redefining schemas), document them in `docs/spec/sanitations.md`.
> - You may need to perform additional sanitization after generating the client code (Step 3) and testing the connector (Step 4) to address any compile-time or runtime issues. Make sure to update the `sanitations.md` file accordingly.

## Step 3: Generate the Ballerina client code

With your OpenAPI definition ready, use the [Ballerina OpenAPI tool](https://ballerina.io/learn/openapi-tool/) to generate the connector code.

1. In your terminal, run the following command from the project root:
      
   ```
   $ bal openapi -i docs/spec/openapi.yaml --mode client -o ballerina
   ```

   This will generate the ballerina source code of the client connector in your `ballerina/` directory.

> **Note:** The Ballerina OpenAPI tool supports multiple customization options when generating clients. For more details, check the [Ballerina OpenAPI tool documentation](https://ballerina.io/learn/openapi-tool/).

2. Make sure that the generated client implementation consists of the following files:
   - `client.bal`: Contains the client implementation with all the API operations.
   - `types.bal`: Contains the data types used in the client.
   - `utils.bal`: Contains utility functions used in the client.

## Step 4: Test the connector

Now that your connector is generated, it is important to write tests to ensure everything works as expected.

1. In the `ballerina/tests` directory, add the required test files and write test cases for the key operations of your connector. Aim to cover as many API use cases as possible.

2. Execute the tests using the `bal test` command to verify the functionality of your connector.

> For detailed guidance on writing tests, check the [Ballerina testing guide](https://ballerina.io/learn/test-ballerina-code/test-a-simple-function/).

> For sample implementations, refer to the [test implementation of the Ballerina Twitter connector](https://github.com/ballerina-platform/module-ballerinax-twitter/tree/main/ballerina/tests).

## Step 5: Document the connector

Follow these steps to ensure your connector is well-documented:

1. Update the `ballerina/README.md` file.

   This file will be displayed on the Ballerina Central package landing page. Make sure it provides a clear and comprehensive introduction to the connector, including the following sections:
   
   - **Overview**: Provide a concise introduction to the connector, explaining its purpose and key features.
   - **Setup**: Offer step-by-step instructions on configuring the connector and any necessary prerequisites, such as API keys or environment setup.
   - **Quickstart**: Include a basic and clear example that helps users to start using the connector immediately.
   - **Examples**: Link to additional use cases, providing context on how the connector can be used in different scenarios.

   > For reference, check the [Twitter connector documentation](https://github.com/ballerina-platform/module-ballerinax-twitter/blob/main/ballerina/README.md).

2. Update the root level `README.md` file.

   This file will be displayed on the GitHub repository landing page. Therefore, it should include the same information as `ballerina/README.md` with a few additional sections such as `Building from Source`, `Contributing`, `License`, etc.
   
   > For reference, check the [Twitter connector README](https://github.com/ballerina-platform/module-ballerinax-twitter/blob/main/README.md).

3. Write example use cases.

   Providing practical examples helps users understand the connector better. These examples should show how the connector is used in real-world scenarios.

   - All the examples should be added under the `examples/` directory.
   - Each example should be added as a Ballerina package with its own `README.md` file, explaining the use case and how to run the example.

   > For reference, check the [Twitter connector examples](https://github.com/ballerina-platform/module-ballerinax-twitter/tree/main/examples).

## Step 6: Publish the connector

Once you have completed the development and testing of your connector, you can publish it for others to use.

1. Make sure to update the `Ballerina.toml` file with the following details:
   - `org`: Your organization name.
   - `name`: The name of your connector.
   - `version`: The version of your connector.
   - `license`: The license under which your connector is distributed (Optional).
   - `authors`: Your name and email address (Optional).
   - `keywords`: Keywords to help users find your connector (Optional).
   - `icon`: The relative path to the icon file, which will be shown as the connector logo in the [Ballerina Central](https://central.ballerina.io/) (Optional).
   - `repository`: The URL of your GitHub repository (Optional).

2. Follow the steps in the [Ballerina package publishing guide](https://ballerina.io/learn/publish-packages-to-ballerina-central/) to publish your connector to [Ballerina Central](https://central.ballerina.io/) under your organization.

## Conclusion

You have successfully created your first Ballerina connector! This process allows you to quickly integrate external services and share your connector with the Ballerina community.

Remember to keep your connector up to date with any changes in the API’s OpenAPI specification and to test thoroughly whenever updates are made.

Also, ensure you comply with the API’s terms of service when developing and distributing your connector.
