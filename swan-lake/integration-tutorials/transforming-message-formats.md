---
layout: ballerina-transforming-message-formats-left-nav-pages-swanlake
title: Transforming message formats
permalink: /learn/transforming-message-formats
description: Integration tutorial to transform messages into different formats.
keywords: ballerina, programming language, client, restful-api, integration
active: transforming-message-formats
intro: This tutorial helps you understand how Ballerina can be used to transform messages.
---

## Overview

In this tutorial, you will develop a service via which you can reserve appointments at hospitals. The requests are transformed from one format to another and forwarded to the hospital service to reserve the appointment.

To implement this use case, you will develop a REST service with a single resource using Visual Studio Code with the Ballerina Swan Lake extension. The resource will receive the user request, transform the payload to the format expected by the hospital service, send a request with the transformed payload to the hospital service to make a reservation, and respond with the reservation details.

The flow is as follows.

1. Receive a request with a JSON payload similar to the following.

    ```json
    {
        "firstName": "John",
        "lastName": "Doe",
        "dob": "1940-03-19",
        "ssn": [234, 23, 525],
        "address": "California",
        "phone": "8770586755",
        "email": "johndoe@gmail.com",
        "doctor": "thomas collins",
        "hospitalId": "grandoak",
        "hospital": "grand oak community hospital",
        "cardNo": "7844481124110331",
        "appointmentDate": "2023-10-02"
    }
    ```

2. Transform the request payload to the following form.

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
        "appointment_date": "2023-10-02"
    }
    ```

3. Send a request to the hospital service and retrieve the response which will be similar to the following. 

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

### Concepts covered

- REST API
- HTTP client
- Data mapper

## Develop the application

### Step 1: Set up the workspace

Install [Ballerina Swan Lake](https://ballerina.io/downloads/) and the [Ballerina Swan Lake VS Code extension](https://marketplace.visualstudio.com/items?itemName=wso2.ballerina) on VS Code.

### Step 2: Develop the service

Follow the instructions given in this section to develop the service.

1. Create a new Ballerina project using the `bal` command and open it in VS Code.

    ```
    $ bal new transforming-message-formats
    ```
2. Remove the generated content in the `main.bal` file and open the diagram view in VS Code.

    ![Open diagram view](/learn/images/integration-tutorials/transforming-message-formats/open_diagram_view.gif)

3. Generate record types corresponding to the response from the hospital service by providing a sample of the expected JSON payload.

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

    ![Define records](/learn/images/integration-tutorials/transforming-message-formats/define_record_types.gif)

    The generated record types will be as follows.

    ```ballerina
    type Doctor record {
        string name;
        string hospital;
        string category;
        string availability;
        decimal fee;
    };

    type Patient record {
        string name;
        string dob;
        string ssn;
        string address;
        string phone;
        string email;
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

    Similarly, generate the record types corresponding to the request payloads to the healthcare service being developed (e.g. `HealthcareReservation`) and the request payload expected by the backend hospital service (e.g.,`HospitalReservation`). The transformation will be done from the former type to the latter. Also remove the duplicate `Patient` record if the same type has already been generated.

    ```ballerina
    type HospitalReservation record {
        Patient patient;
        string doctor;
        string hospital;
        string appointment_date;
    };

    type HealthcareReservation record {
        string firstName;
        string lastName;
        string dob;
        int[3] ssn;
        string address;
        string phone;
        string email;
        string doctor;
        string hospitalId;
        string hospital;
        string cardNo;
        string appointmentDate;
    };
    ```

    > **Note:**
    > Since the `ssn` field is required to be an array of three integers, update the type to a [fixed-length array](https://ballerina.io/learn/by-example/arrays/).

    > **Note:**
    > While it is possible to work with the JSON payload directly, using record types offers several advantages including enhanced type safety, data validation, and better tooling experience (e.g., completion).

    > **Note:**
    > When the fields of the JSON objects are expected to be exactly those specified in the sample payload, the generated records can be updated to be [closed records](https://ballerina.io/learn/by-example/controlling-openness/), which would indicate that no other fields are allowed or expected.

4. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, retrieves relevant details from the backend service, and responds to the request.

    - Open the [Ballerina HTTP API Designer](https://wso2.com/ballerina/vscode/docs/design-the-services/http-api-designer) in VS Code.

    - Use `/healthcare` as the service path (or the context) for the service attached to the listener that is listening on port `8290`.

        ![Define the service](/learn/images/integration-tutorials/transforming-message-formats/define_a_service.gif)
     
    - Define an HTTP resource that allows the `POST` operation on the resource path `/categories/{category}/reserve` and accepts the `category` path parameter (corresponding to the specialization). Use `HealthcareReservation` as a parameter indicating that the resource expects a JSON object corresponding to `HealthcareReservation` as the payload. Use `ReservationResponse`, `http:NotFound`, and `http:InternalServerError` as the response types.

        ![Define the resource](/learn/images/integration-tutorials/transforming-message-formats/define_a_resource.gif)

        The generated service will be as follows.

        ```ballerina
        service /healthcare on new http:Listener(8290) {
            resource function post categories/[string category]/reserve(HealthcareReservation reservation) 
                    returns ReservationResponse|http:NotFound|http:InternalServerError {
                        
            }
        }
        ```

5. Use the data mapper to define the `transform` function which transforms a `HealthcareReservation` record, representing the payload (`reservation`), to a `HospitalReservation` record.

    ![Data mapper guide](/learn/images/integration-tutorials/transforming-message-formats/data_mapper_guide.gif)

    The data mapper view of the completed `transform` function is shown below.

    ![Data mapper view](/learn/images/integration-tutorials/transforming-message-formats/data_mapper_view.png)

    The source code of the `transform` function will be as follows.

    ```ballerina
    isolated function transform(HealthcareReservation reservation) returns HospitalReservation => 
        let var ssn = reservation.ssn in {
            patient: {
                name: reservation.firstName + " " + reservation.lastName,
                dob: reservation.dob,
                ssn: string `${ssn[0]}-${ssn[1]}-${ssn[2]}`,
                address: reservation.address,
                phone: reservation.phone,
                email: reservation.email
            },
            doctor: reservation.doctor,
            hospital: reservation.hospital,
            appointment_date: reservation.appointmentDate
        };
    ```
6. Define an [`http:Client`](https://ballerina.io/learn/by-example/#http-client) object to send requests to the backend service.
   
    ![Define a client](/learn/images/integration-tutorials/transforming-message-formats/define_a_client.gif)

    The generated code will be as follows.

    ```ballerina
    final http:Client hospitalServiceEP = check new ("http://localhost:9090");
    ```

7. Implement the logic.

    ```ballerina
    service /healthcare on new http:Listener(8290) {
        isolated resource function post categories/[string category]/reserve(HealthcareReservation reservation)
                returns ReservationResponse|http:NotFound|http:InternalServerError {
            HospitalReservation hospitalReservation = transform(reservation);

            ReservationResponse|http:ClientError resp =
                        hospitalServiceEP->/[reservation.hospitalId]/categories/[category]/reserve.post(hospitalReservation);

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

    - Use the `transform` function to transform the payload from a `HealthcareReservation` record to a `HospitalReservation` record.

    - Use the transformed payload in the request to the hospital service and get the response. Here, The `hospitalId` and `category` values are used as path parameters.

    - Use the `is` check to check whether the response is `ReservationResponse` and return it as is (i.e., reservation successful).

    - If the response is not a `ReservationResponse` record, log the information at `ERROR` level. Return an `http:NotFound` response if the response from the hospital service is an `http:ClientRequestError` response or an `http:InternalServerError` response otherwise.

You have successfully developed the required service.

#### Complete source code

```ballerina
import ballerina/http;
import ballerina/log;

final http:Client hospitalServiceEP = check new ("http://localhost:9090");

type HealthcareReservation record {|
    string firstName;
    string lastName;
    string dob;
    int[3] ssn;
    string address;
    string phone;
    string email;
    string doctor;
    string hospitalId;
    string hospital;
    string cardNo;
    string appointmentDate;
|};

type Patient record {|
    string name;
    string dob;
    string ssn;
    string address;
    string phone;
    string email;
|};

type HospitalReservation record {|
    Patient patient;
    string doctor;
    string hospital;
    string appointment_date;
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

service /healthcare on new http:Listener(8290) {
    isolated resource function post categories/[string category]/reserve(HealthcareReservation reservation)
            returns ReservationResponse|http:NotFound|http:InternalServerError {
        HospitalReservation hospitalReservation = transform(reservation);

        ReservationResponse|http:ClientError resp =
                    hospitalServiceEP->/[reservation.hospitalId]/categories/[category]/reserve.post(hospitalReservation);

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

isolated function transform(HealthcareReservation reservation) returns HospitalReservation => 
    let var ssn = reservation.ssn in {
        patient: {
            name: reservation.firstName + " " + reservation.lastName,
            dob: reservation.dob,
            ssn: string `${ssn[0]}-${ssn[1]}-${ssn[2]}`,
            address: reservation.address,
            phone: reservation.phone,
            email: reservation.email
        },
        doctor: reservation.doctor,
        hospital: reservation.hospital,
        appointment_date: reservation.appointmentDate
    };
```

#### Sequence Diagram

The [sequence diagram view](https://wso2.com/ballerina/vscode/docs/implement-the-code/sequence-diagram-view/) for the implemented resource method is the following.

<img src="/learn/images/integration-tutorials/transforming-message-formats/sequence_diagram.png" alt="Sequence Diagram" height="800" style="width:auto; max-width:100%">

### Step 3: Build and run the service

![Run the service](/learn/images/integration-tutorials/transforming-message-formats/run_the_service.gif)

> **Note:**
> Alternatively, you can run this service by navigating to the project root and using the `bal run` command.
>
> ```
> transforming-message-formats$ bal run
> Compiling source
>         integration_tutorials/transforming_message_formats:0.1.0
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

#### Send a request

Use the [Try it](https://wso2.com/ballerina/vscode/docs/try-the-services/try-http-services/) feature to send a request to the service. Specify `surgery` as the path parameter. Use the following as the request payload.

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1940-03-19",
    "ssn": [234, 23, 525],
    "address": "California",
    "phone": "8770586755",
    "email": "johndoe@gmail.com",
    "doctor": "thomas collins",
    "hospitalId": "grandoak",
    "hospital": "grand oak community hospital",
    "cardNo": "7844481124110331",
    "appointmentDate": "2023-10-02"
}
```

![Send a request](/learn/images/integration-tutorials/transforming-message-formats/try_it.gif)

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

Check out the [complete implementation](https://github.com/ballerina-guides/integration-tutorials/tree/main/transforming-message-formats) on GitHub.

## References

- [`ballerina/http` API docs](https://lib.ballerina.io/ballerina/http/latest)
- [`ballerina/log` API docs](https://lib.ballerina.io/ballerina/log/latest)
