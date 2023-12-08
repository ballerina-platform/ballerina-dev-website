---
layout: ballerina-left-nav-release-notes
title: Swan Lake Update 8 (2201.8.3) 
permalink: /downloads/swan-lake-release-notes/2201.8.3/
active: 2201.8.3
---

## Overview of Ballerina Swan Lake Update 8 (2201.8.3)

<em>Swan Lake Update 8 (2201.8.3) is the third patch release of Ballerina 2201.8.0 (Swan Lake Update 8) and it includes a new set of bug fixes to the runtime and developer tooling.</em>

## Update Ballerina

Run the command below to update your current Ballerina installation directly to 2201.8.3 by using the [Ballerina Update Tool](/learn/update-tool/) as follows.

```
$ bal dist pull 2201.8.3
```

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Runtime updates

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.3 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.3+label%3AType%2FBug+is%3Aclosed+label%3ATeam%2FjBallerina).

## Developer tools updates

### Improvements

#### Observability

##### View the `response_errors_total_value` metric

Ballerina observability now provides the total number of errors in responses as a metric via the `response_errors_total_value`.

##### Define the `service name` in traces

You can now add a suffix to the service name shown in the tracer providers ([Jaeger](https://www.jaegertracing.io/), [Zipkin](https://zipkin.io/), and [New Relic](https://newrelic.com/welcome-back)) by passing an environment variable in the runtime as given below. 

```
$ BAL_OBSERVE_SERVICE_NAME_SUFFIX=<suffix> bal run
```

By default, the service name will be the base path or the display name of the service.

#### XML to record converter

Improved the XML to Ballerina record conversion logic with enhanced support for the intersection of child nodes and XML namespaces, ensuring a more accurate and versatile experience for the Ballerina VS Code extension's `Paste XML as record` feature.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 8 (2201.8.3) of the repositories below.

- [Test framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.3+label%3ATeam%2FDevTools+label%3AType%2FBug+is%3Aclosed)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-library/issues?q=is%3Aissue+label%3Amodule%2Fopenapi-tools+label%3AType%2FBug+milestone%3A2201.8.3+is%3Aclosed)

## Backward-incompatible changes

- Changed the OpenAPI tool client code generation from representing the OpenAPI Specification byte format of the string type as Ballerina `byte[]`, to using Ballerina `string` type as shown in the example below, due to an issue with the previously generated code. This change will break the compatibility of any existing generated code.

  **OpenAPI sample**

  ```yaml
  components:
    schemas:
      ByteExample:
        type: string
        format: byte
  ```

  **Generated Ballerina code - before**

  ```ballerina
  type ByteExample byte[];
  ```

  **Generated Ballerina code - after**

  ```ballerina
  type ByteExample string;
  ```

- Changed the OpenAPI tool `client resource/remote code` generation of the `http:Response` to a `nil` return type when the operation in the OpenAPI specification has a response with no content. With this improvement, the already generated code will be altered when regenerated with the Ballerina Swan Lake Update 8 (2201.8.3) version as shown in the example below.

  **OpenAPI sample**

  ```yaml
  /user/draft:
      delete:
        operationId: deleteDraft
        parameters:
          - in: query
            name: userId
            schema:
              type: string    
        responses:
          "200":
            description: Successful response //No content type
  ```

  **Generated client resource/remote function - before**

  ```ballerina
  resource isolated function delete user/draft(string? userId = ()) returns http:Response|error {
      string resourcePath = string `/users/drafts/${getEncodedUri(id)}`;
      map<anydata> queryParam = {"userId": userId};
      resourcePath = resourcePath + check getPathForQueryParam(queryParam);
      http:Response response = check self.clientEp->delete(resourcePath);
      return response;
  }
  ```

  **Generated client resource/remote function - after**

  ```ballerina
  resource isolated function delete user/draft(string? userId = ()) returns error? {
      string resourcePath = string `/user/draft`;
      map<anydata> queryParam = {"userId": userId};
      resourcePath = resourcePath + check getPathForQueryParam(queryParam);
      return self.clientEp->delete(resourcePath);
  }
  ```
