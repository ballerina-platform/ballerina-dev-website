---
layout: ballerina-content-based-message-routing-left-nav-pages-swanlake
title: Content-based message routing 
permalink: /learn/content-based-message-routing/
description: Integration tutorial for message routing based on the content.
keywords: ballerina, programming language, client, restful-api, integration
active: content-based-message-routing
intro: This tutorial helps you understand how content-based routing can be done in Ballerina.
---

## Overview

In this tutorial, you will develop a service via which you can reserve appointments at several hospitals. The requests are routed to the relevant hospital based on the content of the request payload.

To implement this use case, you will develop a REST service with a single resource using Visual Studio Code with the Ballerina Swan Lake extension. The resource will receive the user request, select the hospital endpoint based on the hospital ID, send a request to the relevant hospital service to make a reservation, and respond with the reservation details.

The flow is as follows.

1. Receive a request with a JSON payload similar to the following.

    ```json
    {
        "patient": {
            "name": "John Doe",
            "dob": "1940-03-19",
            "ssn": "234-23-525",
            "address": "California",
            "phone": "8770586755",
            "email": "johndoe@gmail.com"
        },
        "doctor": "thomas collins",
        "hospital": "grand oak community hospital",
        "hospital_id": "grandoak",
        "appointment_date": "2023-10-02"
    }
    ```

2. Extract the `hospital_id` field and select the corresponding hospital service endpoint.

   - grandoak -> `http://localhost:9090/grandoak/categories`
   - clemency -> `http://localhost:9090/clemency/categories`
   - pinevalley -> `http://localhost:9090/pinevalley/categories`

3. Send a request to the selected hospital endpoint and retrieve the response which will be similar to the following.

    ```json
    {
        "appointmentNumber": 8,
        "doctor": {
            "name": "thomas collins",
            "hospital": "grand oak community hospital",
            "category": "surgery",
            "availability": "9.00 a.m - 11.00 a.m",
            "fee": 7000.0
        },
        "patient": {
            "name": "John Doe",
            "dob": "1940-03-19",
            "ssn": "234-23-525",
            "address": "California",
            "phone": "8770586755",
            "email": "johndoe@gmail.com"
        },
        "hospital": "grand oak community hospital",
        "confirmed": false,
        "appointmentDate": "2023-10-02"
    }
    ```

### Concepts covered

- REST API
- HTTP Client

## Develop the application

### Step 1: Set up the workspace

Install [Ballerina Swan Lake](https://ballerina.io/downloads/) and the [Ballerina Swan Lake VS Code extension](https://marketplace.visualstudio.com/items?itemName=wso2.ballerina) on VS Code.

### Step 2: Develop the service

Follow the instructions given in this section to develop the service.

1. Create a new Ballerina project using the `bal` command and open it in VS Code.

    ```
    $ bal new content-based-message-routing
    ```

2. Remove the generated content in the `main.bal` file and open the diagram view in VS Code.

    ![Open diagram view](/learn/images/integration-tutorials/content-based-message-routing/open_diagram_view.gif)

3. Define an enum to represent the hospital IDs.

    ![Define an enum](/learn/images/integration-tutorials/content-based-message-routing/define_enum.gif)

    The generated `HospitalId` enum will be as follows.

    ```ballerina
    enum HospitalId {
        grandoak,
        clemency,
        pinevalley
    }
    ```

4. Generate record types corresponding to the response from the hospital backend service by providing a sample of the expected JSON payload.

    The payload from the hospital backend service will be a JSON object similar to the following.

    ```json
    {
        "appointmentNumber": 1,
        "doctor": {
            "name": "thomas collins",
            "hospital": "grand oak community hospital",
            "category": "surgery",
            "availability": "9.00 a.m - 11.00 a.m",
            "fee": 7000.0
        },
        "patient": {
            "name": "John Doe",
            "dob": "1940-03-19",
            "ssn": "234-23-525",
            "address": "California",
            "phone": "8770586755",
            "email": "johndoe@gmail.com"
        },
        "hospital": "grand oak community hospital",
        "confirmed": false,
        "appointmentDate": "2023-10-02"
    }
    ```

    ![Define record types](/learn/images/integration-tutorials/content-based-message-routing/define_record_types.gif)
   
    The generated record types will be as follows.

    ```ballerina
    type Patient record {
        string name;
        string dob;
        string ssn;
        string address;
        string phone;
        string email;
    };

    type Doctor record {
        string name;
        string hospital;
        string category;
        string availability;
        decimal fee;
    };

    type ReservationResponse record {
        int appointmentNumber;
        Doctor doctor;
        Patient patient;
        string hospital;
        boolean confirmed;
        string appointmentDate;
    };
    ```

    Similarly, generate a record corresponding to the request payload (e.g., `ReservationRequest`) and update the `hospital_id` field to be of the `HospitalId` type that was defined previously. Remove the duplicate `Patient` record if the same type has already been generated.

    ```ballerina
    type ReservationRequest record {
        Patient patient;
        string doctor;
        HospitalId hospital_id;
        string hospital;
        string appointment_date;
    };
    ```

    > **Note:**
    > While it is possible to work with the JSON payload directly, using record types offers several advantages including enhanced type safety, data validation, and better tooling experience (e.g., completion).

    > **Note:**
    > When the fields of the JSON objects are expected to be exactly those specified in the sample payload, the generated records can be updated to be [closed records](https://ballerina.io/learn/by-example/controlling-openness/), which would indicate that no other fields are allowed or expected.

5. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, retrieves relevant details from the backend service, and responds to the request.

    - Open the [Ballerina HTTP API Designer](https://wso2.com/ballerina/vscode/docs/design-the-services/http-api-designer) in VS Code.

    - Use `/healthcare` as the service path (or the context) of the service, which is attached to the listener listening on port `8290`.

        ![Define the service](/learn/images/integration-tutorials/content-based-message-routing/define_a_service.gif)

    - Define an HTTP resource that allows the `POST` operation on the resource path `/categories/{category}/reserve` and accepts the `category` path parameter (corresponding to the specialization). Use `ReservationRequest` as a parameter indicating that the resource expects a JSON object corresponding to `ReservationRequest` as the payload. Use `ReservationResponse`, `http:NotFound`, and `http:InternalServerError` as the response types.

        ![Define the resource](/learn/images/integration-tutorials/content-based-message-routing/define_a_resource.gif)

    The generated service will be as follows.

    ```ballerina
    service /healthcare on new http:Listener(8290) {
        resource function post categories/[string category]/reserve(ReservationRequest reservation) 
               returns ReservationResponse|http:NotFound|http:InternalServerError {
            
        }
    }
    ```

6. Define three [`http:Client`](https://ballerina.io/learn/by-example/#http-client) objects to send requests to the backend services.

    ![Define a client](/learn/images/integration-tutorials/content-based-message-routing/define_a_client.gif)

    The generated code will be as follows.

    ```ballerina
    final http:Client grandOakEP = check new ("http://localhost:9090/grandoak/categories");
    final http:Client clemencyEP = check new ("http://localhost:9090/clemency/categories");
    final http:Client pineValleyEP = check new ("http://localhost:9090/pinevalley/categories");
    ```

7. Implement the logic.

    ```ballerina
    service /healthcare on new http:Listener(8290) {
        resource function post categories/[string category]/reserve(ReservationRequest reservation)
                returns ReservationResponse|http:NotFound|http:InternalServerError {
            http:Client hospitalEP;
            match reservation.hospital_id {
                grandoak => {
                    hospitalEP = grandOakEP;
                }
                clemency => {
                    hospitalEP = clemencyEP;
                }
                _ => {
                    hospitalEP = pineValleyEP;
                }
            }

            ReservationResponse|http:ClientError resp = hospitalEP->/[category]/reserve.post({
                patient: reservation.patient,
                doctor: reservation.doctor,
                hospital: reservation.hospital,
                appointment_date: reservation.appointment_date
            });

            if resp is ReservationResponse {
                return resp;
            }

            log:printError("Reservation request failed", resp);
            if resp is http:ClientRequestError {
                return <http:NotFound> {body: "Unknown hospital, doctor or category"};
            }

            return <http:InternalServerError> {body: resp.message()};
        }
    }
    ```

    - Define an `http:Client` variable named `hospitalEP`. Later, the relevant client is assigned to this variable based on the `hospital_id` value.

    - Use a [match statement](https://ballerina.io/learn/by-example/match-statement) to assign the relevant client to the `hospitalEP` variable based on the `hospital_id` value.

    - Make a `POST` request to the relevant backend hospital service to make the reservation. The `category` value is used as a path parameter.

    - Use the `is` check to check whether the response is a `ReservationResponse` record, which would indicate a successful reservation. If the response is a `ReservationResponse` record, return the record from the resource method to send a `201 Created` response with the `ReservationResponse` value as the payload.

    - If the response is not a `ReservationResponse` record (i.e., `http:ClientError`) which indicates that the request failed, log the failure at `ERROR` level.  Return an `http:NotFound` response if the response is `http:ClientRequestError`, or an `http:InternalServerError` response if the response is `http:ServerError`.

You have successfully developed the required service.

#### Complete source code

```ballerina
import ballerina/http;
import ballerina/log;

final http:Client grandOakEP = check new ("http://localhost:9090/grandoak/categories");
final http:Client clemencyEP = check new ("http://localhost:9090/clemency/categories");
final http:Client pineValleyEP = check new ("http://localhost:9090/pinevalley/categories");

enum HospitalId {
    grandoak,
    clemency,
    pinevalley
};

type Patient record {|
    string name;
    string dob;
    string ssn;
    string address;
    string phone;
    string email;
|};

type Doctor record {|
    string name;
    string hospital;
    string category;
    string availability;
    decimal fee;
|};

type ReservationResponse record {|
    int appointmentNumber;
    Doctor doctor;
    Patient patient;
    string hospital;
    boolean confirmed;
    string appointmentDate;
|};

type ReservationRequest record {|
    Patient patient;
    string doctor;
    HospitalId hospital_id;
    string hospital;
    string appointment_date;
|};

service /healthcare on new http:Listener(8290) {
    resource function post categories/[string category]/reserve(ReservationRequest reservation)
            returns ReservationResponse|http:NotFound|http:InternalServerError {
        http:Client hospitalEP;
        match reservation.hospital_id {
            grandoak => {
                hospitalEP = grandOakEP;
            }
            clemency => {
                hospitalEP = clemencyEP;
            }
            _ => {
                hospitalEP = pineValleyEP;
            }
        }

        ReservationResponse|http:ClientError resp = hospitalEP->/[category]/reserve.post({
            patient: reservation.patient,
            doctor: reservation.doctor,
            hospital: reservation.hospital,
            appointment_date: reservation.appointment_date
        });

        if resp is ReservationResponse {
            return resp;
        }

        log:printError("Reservation request failed", resp);
        if resp is http:ClientRequestError {
            return <http:NotFound> {body: "Unknown hospital, doctor or category"};
        }

        return <http:InternalServerError> {body: resp.message()};
    }
}
```

#### Sequence diagram

The [sequence diagram view](https://wso2.com/ballerina/vscode/docs/implement-the-code/sequence-diagram-view/) for the implemented resource method is the following.

<img src="/learn/images/integration-tutorials/content-based-message-routing/sequence_diagram.png" alt="Sequence Diagram" height="700" style="width:auto; max-width:100%">

### Step 3: Build and run the service

![Run the service](/learn/images/integration-tutorials/content-based-message-routing/run_the_service.gif)

> **Note:** Alternatively, you can run this service by navigating to the project root and using the `bal run` command.
>
> ```
> content-based-message-routing$ bal run
> Compiling source
>         integration_tutorials/content_based_message_routing:0.1.0
> 
> Running executable
> ```

### Step 4: Try out the use case

Let's test the use case by sending a request to the service.

#### Start the backend service

Download the JAR file for the [backend service](https://github.com/ballerina-guides/integration-tutorials/blob/main/backends/hospital-service/hospitalservice.jar) and execute the following command to start the service.

```
$ bal run hospitalservice.jar
```

#### Send a request to the service

Use the [Try it](https://wso2.com/ballerina/vscode/docs/try-the-services/try-http-services/) feature to send a request to the service. Specify `surgery` as the path parameter. Use the following as the request payload.

```json
{
    "patient": {
        "name": "John Doe",
        "dob": "1940-03-19",
        "ssn": "234-23-525",
        "address": "California",
        "phone": "8770586755",
        "email": "johndoe@gmail.com"
    },
    "doctor": "thomas collins",
    "hospital_id": "grandoak",
    "hospital": "grand oak community hospital",
    "appointment_date": "2023-10-02"
}
```

![Send a request](/learn/images/integration-tutorials/content-based-message-routing/try_it.gif)

#### Verify the response

You will see a response similar to the following for a successful appointment reservation.

```json
{
    "appointmentNumber": 1,
    "doctor": {
        "name": "thomas collins",
        "hospital": "grand oak community hospital",
        "category": "surgery",
        "availability": "9.00 a.m - 11.00 a.m",
        "fee": 7000.0
    },
    "patient": {
        "name": "John Doe",
        "dob": "1940-03-19",
        "ssn": "234-23-525",
        "address": "California",
        "phone": "8770586755",
        "email": "johndoe@gmail.com"
    },
    "hospital": "grand oak community hospital",
    "confirmed": false,
    "appointmentDate": "2023-10-02"
}
```

## Complete implementation

Check out the [complete implementation](https://github.com/ballerina-guides/integration-tutorials/tree/main/content-based-message-routing) on GitHub.

## References

- [`ballerina/http` API docs](https://lib.ballerina.io/ballerina/http/latest)
- [`ballerina/log` API docs](https://lib.ballerina.io/ballerina/log/latest)
