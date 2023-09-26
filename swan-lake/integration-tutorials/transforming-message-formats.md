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

The flow is as follows

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
        "appointmentDate": "2017-04-02"
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
            "email": "johndoe@gmail.com",
            "card_no": "7844481124110331"
        },
        "doctor": "thomas collins",
        "hospital": "grand oak community hospital",
        "appointment_date": "2017-04-02"
    }
    ```

3. Send a request to the hospital service and retrieve the response which will be similar to the following. 

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
        "fee": 7000.0,
        "hospital": "grand oak community hospital",
        "confirmed": false,
        "appointmentDate": "2017-04-02"
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

    ```bash
    $ bal new transforming-message-formats
    ```

2. Introduce the source code in files with the `.bal` extension (e.g., the `main.bal` file).

    Import the
    - `ballerina/http` module to develop the REST API and define the client that can be used to send requests to the backend services
    - `ballerina/log` module to log debug, error, or info level information for each client request

    ```ballerina
    import ballerina/http;
    import ballerina/log;
    ```

3. Define two [configurable variables](https://ballerina.io/learn/by-example/#configurability) for the port on which the listener should listen and the URL of the hospital service.

    ```ballerina
    configurable int port = 8290;
    configurable string hospitalServiceUrl = "http://localhost:9090";
    ```

4. Define an [`http:Client`](https://ballerina.io/learn/by-example/#http-client) client to send requests to the backend hospital service.

    ```ballerina
    final http:Client hospitalServiceEP = check initializeHttpClient();

    function initializeHttpClient() returns http:Client|error => new (hospitalServiceUrl);
    ```

    > **Note** The argument passed to the `new` expression (`hospitalServiceUrl`) is the URL of the backend hospital service.
    > 
    > Here, a separate function is used to initialize the client to aid with testing. Alternatively, the `new` expression can be used directly to initialize the client.
    >
    > ```ballerina
    > final http:Client hospitalServiceEP = new (hospitalServiceUrl);
    >```

5. Use the data mapper to define the `transform` function which transforms a `HealthcareReservation` record, representing the payload, to a `HospitalReservation` record.

    ![Data mapper guide](/learn/images/tutorial_transforming_message_formats_data_mapper_guide.gif)

    The data mapper view of the completed `transform` function is shown below.

    ![Data mapper view](/learn/images/tutorial_transforming_message_formats_data_mapper_view.png)

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

6. Define the rest of the records corresponding to the response payload from the hospital service.

    ```ballerina
    type Doctor record {|
        string name;
        string hospital;
        string category;
        string availability;
        float fee;
    |};

    type ReservationResponse record {|
        int appointmentNumber;
        Doctor doctor;
        Patient patient;
        float fee;
        string hospital;
        boolean confirmed;
        string appointmentDate;
    |};
    ```

7. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, transforms the payload, makes a call to the backend hospital service to make the reservation, and responds to the client.

    ```ballerina
    service /healthcare on new http:Listener(port) {
        isolated resource function post categories/[string category]/reserve(HealthcareReservation payload)
                returns ReservationResponse|http:NotFound|http:InternalServerError {
            
        }
    }
    ```

    - Use `/healthcare` as the service path (or the context) of the service which is attached to the listener listening on port `port`. 

    - The HTTP resource allows the `POST` operation on resource path `/categories/{category}/reserve`, where `category` (corresponding to the specialization) is a path parameter.

    - Use `HealthcareReservation` as a parameter indicating that the resource expects a JSON object corresponding to `HealthcareReservation` as the payload. 

    - Use `ReservationResponse|http:NotFound|http:InternalServerError` as the return type to indicate that the response will have a JSON payload corresponding to `ReservationResponse` on success or the response will be an `http:NotFound` or `http:InternalServerError` response on error.

8. Implement the logic.

    ```ballerina
    service /healthcare on new http:Listener(port) {
        isolated resource function post categories/[string category]/reserve(HealthcareReservation payload)
                returns ReservationResponse|http:NotFound|http:InternalServerError {
            HospitalReservation hospitalReservation = transform(payload);

            ReservationResponse|http:ClientError resp =
                        hospitalServiceEP->/[payload.hospitalId]/categories/[category]/reserve.post(hospitalReservation);

            if resp is ReservationResponse {
                log:printDebug("Reservation request successful",
                                name = hospitalReservation.patient.name,
                                appointmentNumber = resp.appointmentNumber);
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

        ```ballerina
        HospitalReservation hospitalReservation = transform(payload);
        ```

    - Use the transformed payload in the request to the hospital service and get the response. Here, The `hospitalId` and `category` values are used as path parameters.

        ```ballerina
        ReservationResponse|http:ClientError resp =
                        hospitalServiceEP->/[payload.hospitalId]/categories/[category]/reserve.post(hospitalReservation);
        ```

    - The `log` functions are used to [log](https://ballerina.io/learn/by-example/#log) information at `INFO`, `DEBUG`, and `ERROR` log levels.

    - Use the `is` check to check whether the response is `ReservationResponse` and return it as is (i.e., reservation successful).

        ```ballerina
        if resp is ReservationResponse {
            log:printDebug("Reservation request successful",
                            name = hospitalReservation.patient.name,
                            appointmentNumber = resp.appointmentNumber);
            return resp;
        }
        ```

    - If the response is not a `ReservationResponse` record, log the information at `ERROR` level. Return a "NotFound" response if the response from the hospital service is a `http:ClientRequestError` response or an "InternalServerError" response otherwise.

        ```ballerina
        log:printError("Reservation request failed", resp);
        if resp is http:ClientRequestError {
            return <http:NotFound> {body: "Unknown hospital, doctor or category"};
        }

        return <http:InternalServerError> {body: resp.message()};
        ```

You have successfully developed the required service.

#### Complete source code

```ballerina
import ballerina/http;
import ballerina/log;

configurable int port = 8290;
configurable string hospitalServiceUrl = "http://localhost:9090";

final http:Client hospitalServiceEP = check initializeHttpClient();

function initializeHttpClient() returns http:Client|error => new (hospitalServiceUrl);

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
    float fee;
|};

type ReservationResponse record {|
    int appointmentNumber;
    Doctor doctor;
    Patient patient;
    float fee;
    string hospital;
    boolean confirmed;
    string appointmentDate;
|};

service /healthcare on new http:Listener(port) {
    isolated resource function post categories/[string category]/reserve(HealthcareReservation payload)
            returns ReservationResponse|http:NotFound|http:InternalServerError {
        HospitalReservation hospitalReservation = transform(payload);

        ReservationResponse|http:ClientError resp =
                    hospitalServiceEP->/[payload.hospitalId]/categories/[category]/reserve.post(hospitalReservation);

        if resp is ReservationResponse {
            log:printDebug("Reservation request successful",
                            name = hospitalReservation.patient.name,
                            appointmentNumber = resp.appointmentNumber);
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

<img src="/learn/images/tutorial_transforming_message_formats_diagram.png" alt="Sequence Diagram" height="800" style="width:auto; max-width:100%">

### Step 3: Build and run the service

You can run this service by navigating to the project root and using the `bal run` command.

```bash
transforming-message-formats$ bal run
Compiling source
        integration_tutorials/transforming_message_formats:0.1.0

Running executable
```

### Step 4: Try out the use case

Let's test the use case by sending a request to the service.

#### Start the backend service

Download the JAR file for the [backend service](https://github.com/ballerina-guides/integration-tutorials/blob/main/backends/hospital-service/hospitalservice.jar) and execute the following command to start the service:

```bash
bal run hospitalservice.jar
```

#### Send a request

Let's send a request to the service using cURL as follows.

1. Install and set up [cURL](https://curl.se/) as your client.

2. Create a file named `request.json` with the request payload.

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
        "appointmentDate": "2017-04-02"
    }
    ```

3. Execute the following command.

    ```bash
    curl -v -X POST --data @request.json http://localhost:8290/healthcare/categories/surgery/reserve --header "Content-Type:application/json"
    ```

#### Verify the response

You will see a response similar to the following for a successful appointment reservation.

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
    "fee": 7000.0,
    "hospital": "grand oak community hospital",
    "confirmed": false,
    "appointmentDate": "2017-04-02"
}
```

## Complete implementation

Check out the [complete implementation](https://github.com/ballerina-guides/integration-tutorials/tree/main/transforming-message-formats) on GitHub.

## References

- [`ballerina/http` API docs](https://lib.ballerina.io/ballerina/http/latest)
- [`ballerina/log` API docs](https://lib.ballerina.io/ballerina/log/latest)
