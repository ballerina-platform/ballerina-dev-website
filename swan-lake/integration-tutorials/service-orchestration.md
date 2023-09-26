---
layout: ballerina-service-orchestration-left-nav-pages-swanlake
title: Service orchestration
permalink: /learn/service-orchestration/
description: Integration tutorial for service orchestration
keywords: ballerina, programming language, client, restful-api, service orchestration, integration
active: service-orchestration
intro: This tutorial helps you understand the basics of how Ballerina can be used to integrate several services and expose them as a single service.
---

## Overview

In this tutorial, you will develop a service that accepts requests to make an appointment at a hospital, makes multiple calls to different backend services to make the appointment, and responds to the client with the relevant details. Calls to the backend services are made one after the other, given that information from one call is required for the next. This effectively integrates several services and exposes them as a single service, also known as service orchestration.

To implement this use case, you will develop a REST service with a single resource using Visual Studio Code with the Ballerina Swan Lake extension, and then run the service. This resource will receive the user request, retrieve details from the backend services, and respond to the user request with the appointment details.

The flow is as follows.

1. Receive a request with a JSON payload in the following form.

    ```json
    {
        "patient": {
            "name": "John Doe",
            "dob": "1940-03-19",
            "ssn": "234-23-525",
            "address": "California",
            "phone": "8770586755",
            "email": "johndoe@gmail.com",
            "cardNo": "7844481124110331"
        },
        "doctor": "thomas collins",
        "hospital_id": "grandoaks",
        "hospital": "grand oak community hospital",
        "appointment_date": "2023-10-02"
    }
    ```

2. Extract necessary details from the request (e.g., hospital, patient, doctor, etc.) and make a call to the hospital backend service to request an appointment. A response similar to the following will be returned from the hospital backend service on success.

    ```json
    {
        "appointmentNumber": 1,
        "doctor": {
            "name": "thomas collins",
            "hospital": "grand oak community hospital",
            "category": "surgery",
            "availability": "9.00 a.m - 11.00 a.m",
            "fee": 7000
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

3. Use the hospital ID and the appointment number and call the hospital backend service to retrieve the fee for the appointment. The response will be similar to the following.

    ```json
    {
        "patientName": "John Doe",
        "doctorName": "thomas collins",
        "actualFee": "7000"
    }
    ```

4. Finally, call the payment backend service to make the payment and retrieve the reservation status. Log some information and respond to the client with the reservation status as the payload.

    ```json
    {
        "appointmentNo": 2,
        "doctorName": "thomas collins",
        "patient": "John Doe",
        "actualFee": 7000,
        "discount": 20,
        "discounted": 5600.0,
        "paymentID": "f130e2ed-a34e-4434-9b40-6a0a8054ee6b",
        "status": "settled"
    }
    ```

### Concepts covered

- REST API
- HTTP client

## Develop the application

### Step 1: Set up the workspace

Install [Ballerina Swan Lake](https://ballerina.io/downloads/) and the [Ballerina Swan Lake extension](https://marketplace.visualstudio.com/items?itemName=wso2.ballerina) on VS Code.

### Step 2: Develop the service

Follow the instructions given in this section to develop the service.

1. Create a new Ballerina project using the `bal` command and open it in VS Code.

    ```bash
    $ bal new service-orchestration
    ```

2. Introduce the source code in files with the `.bal` extension (e.g., the `main.bal` file). 

    Import the 
    - `ballerina/http` module to develop the REST API and define the clients that can be used to send requests to the backend services
    - `ballerina/log` module to log debug/error information for each client request

    ```ballerina
    import ballerina/http;
    import ballerina/log;
    ```

3. Define three [configurable variables](https://ballerina.io/learn/by-example/#configurability) for the port the listener should listen on and the URLs of the backend services.

    ```ballerina
    configurable int port = 8290;
    configurable string hospitalServicesBackend = "http://localhost:9090";
    configurable string paymentBackend = "http://localhost:9090/healthcare/payments";
    ```

4. Define two [`http:Client`](https://ballerina.io/learn/by-example/#http-client) clients to send requests to the backend services.

    ```ballerina
    final http:Client hospitalServicesEP = check initializeHttpClient(hospitalServicesBackend);
    final http:Client paymentEP = check initializeHttpClient(paymentBackend);

    function initializeHttpClient(string url) returns http:Client|error => new (url);
    ```

    > **Note:** The argument to the `new` expression is the URL for the backend service. 
    > 
    > Alternatively, the clients can be initialized directly with `new` expressions, but a separate function is used to aid with testing.
    > 
    > ```ballerina
    > final http:Client hospitalServicesEP = check new (hospitalServicesBackend);
    > final http:Client paymentEP = check new (paymentBackend);
    > ```

5. Define records corresponding to the request payload and response payloads.

    ```ballerina
    type Patient record {|
        string name;
        string dob;
        string ssn;
        string address;
        string phone;
        string email;
    |};

    type ReservationRequest record {|
        record {|
            *Patient;
            string cardNo;
        |} patient;
        string doctor;
        string hospital_id;
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

    type Appointment record {|
        int appointmentNumber;
        Doctor doctor;
        Patient patient;
        boolean confirmed;
        string hospital;
        string appointmentDate;
    |};

    type Fee record {|
        string patientName;
        string doctorName;
        string actualFee;
    |};

    type ReservationStatus record {|
        int appointmentNo;
        string doctorName;
        string patient;
        decimal actualFee;
        int discount;
        decimal discounted;
        string paymentID;
        string status;
    |};
    ```

    - The `ReservationRequest` record uses [record type inclusion](https://ballerina.io/learn/by-example/type-inclusion-for-records/) in the type of the `patient` field to include all the fields from the `Patient` record along with the `cardNo` field.

    - The initial record definitions can be generated using the "Paste JSON as record" VS Code command with the relevant JSON payloads and the records can then be modified as necessary.

6. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, makes calls to the backend services to retrieve relevant details, and responds to the client.

    ```ballerina
    service /healthcare on new http:Listener(port) {
        resource function post categories/[string category]/reserve(ReservationRequest payload) 
                returns ReservationStatus|http:NotFound|http:InternalServerError {
            
        }
    }
    ```

    - Use `/healthcare` as the service path (or the context) of the service which is attached to the listener listening on port `port`. 

    - The HTTP resource allows the `POST` operation on resource path `/categories/{category}/reserve`, where `category` (corresponding to the specialization) is a path parameter. 

    - Use `ReservationRequest` as a parameter indicating that the resource expects a JSON object corresponding to `ReservationRequest` as the payload. 

    - Use `ReservationStatus|http:NotFound|http:InternalServerError` as the return type to indicate that the response will have a JSON payload corresponding to `ReservationStatus` on success or the response will be a "NotFound" or "InternalServerError" response on error.

7. Implement the logic.

    ```ballerina
    service /healthcare on new http:Listener(port) {
        resource function post categories/[string category]/reserve(ReservationRequest payload) 
                returns ReservationStatus|http:NotFound|http:InternalServerError {
            ReservationRequest {
                patient: {cardNo, ...patient},
                doctor, 
                hospital,
                hospital_id,
                appointment_date
            } = payload;

            log:printDebug("Initiating reservation process", 
                        specialization = category, 
                        doctor = doctor,
                        patient = patient.name);

            Appointment|http:ClientError appointment =
                    hospitalServicesEP->/[hospital_id]/categories/[category]/reserve.post({
                patient,
                doctor,
                hospital,
                appointment_date
            });

            if appointment !is Appointment {
                log:printError("Appointment reservation failed", appointment);
                if appointment is http:ClientRequestError {
                    return <http:NotFound> {body: string `unknown hospital, doctor, or category`};
                }
                return <http:InternalServerError> {body: appointment.message()};
            }

            int appointmentNumber = appointment.appointmentNumber;

            Fee|http:ClientError fee = 
                    hospitalServicesEP->/[hospital_id]/categories/appointments/[appointmentNumber]/fee;

            if fee !is Fee {
                log:printError("Retrieving fee failed", fee);
                if fee is http:ClientRequestError {
                    return <http:NotFound> {body: string `unknown appointment ID`};
                }
                return <http:InternalServerError> {body: fee.message()};
            }

            decimal|error actualFee = decimal:fromString(fee.actualFee);
            if actualFee is error {
                return <http:InternalServerError> {body: "fee retrieval failed"};
            }

            ReservationStatus|http:ClientError status = paymentEP->/.post({
                appointmentNumber,
                doctor: appointment.doctor,
                patient,
                fee: actualFee,
                confirmed: false,
                card_number: cardNo
            });

            if status !is ReservationStatus {
                log:printError("Payment failed", status);
                if status is http:ClientRequestError {
                    return <http:NotFound> {body: string `unknown appointment ID`};
                }
                return <http:InternalServerError> {body: status.message()};
            }

            log:printDebug("Appointment reservation successful", 
                        name = patient.name, 
                        appointmentNumber = appointmentNumber);
            return status;
        }
    }
    ```

    - Use a [typed binding pattern with a mapping binding pattern to destructure](https://ballerina.io/learn/by-example/rest-binding-pattern-in-mapping-binding-pattern/) the payload and assign required components of the value to separate variables.

        ```ballerina
        ReservationRequest {
            patient: {cardNo, ...patient},
            doctor, 
            hospital,
            hospital_id,
            appointment_date
        } = payload;
        ```

        The value assigned to the `patient` variable will belong to the `Patient` type since the fields are exactly those expected by the `Patient` record.

    - The `log` functions are used to [log](https://ballerina.io/learn/by-example/#log) information at `DEBUG` and `ERROR` log levels.

    - The first backend call is a `POST` request to the hospital service to reserve the appointment. The `hospital_id` and `category` values are used as path parameters.

        ```ballerina
        Appointment|http:ClientError appointment =
                hospitalServicesEP->/[hospital_id]/categories/[category]/reserve.post({
            patient,
            doctor,
            hospital,
            appointment_date
        });
        ```

        The expected payload in the request to reserve the appointment consists of four fields, namely `patient`, `doctor`, `hospital`, and `appointment_date`. The payload is specified directly as an argument to the remote method call. 

        ```ballerina
        {patient, doctor, hospital, appointment_date}
        ```

        This is shorthand for

        ```ballerina
        {patient: patient, doctor: doctor, hospital: hospital, appointment_date: appointment_date}
        ```

        [Client data binding](https://ballerina.io/learn/by-example/http-client-data-binding/) is used to directly try and bind the JSON response on success to the expected record.

        ```ballerina
        Appointment|http:ClientError appointment =
                hospitalServicesEP->/[hospital_id]/categories/[category]/reserve.post({
            patient,
            doctor,
            hospital,
            appointment_date
        });
        ```

        Use the `is` check to decide the flow based on the response to the client call. If the request failed with a `4xx` status code, respond with an `http:NotFound` response. Else, if the payload could not be bound to `Appointment` as expected or there was some other failure, respond with an `http:InternalServerError` response. If the client call was successful and the response payload was successfully bound to `Appointment` we can proceed with the subsequent calls.  

        ```ballerina
        if appointment !is Appointment {
            log:printError("Appointment reservation failed", appointment);
            if appointment is http:ClientRequestError {
                return <http:NotFound> {body: string `unknown hospital, doctor, or category`};
            }
            return <http:InternalServerError> {body: appointment.message()};
        }
        ```

    - If the appointment reservation was successful, we can now retrieve the fee, by making a `GET` request to the hospital service, with `hospital_id` and `appointmentNumber` from the `Appointment` payload as path parameters.

        ```ballerina
        int appointmentNumber = appointment.appointmentNumber;

        Fee|http:ClientError fee = 
                hospitalServicesEP->/[hospital_id]/categories/appointments/[appointmentNumber]/fee;

        if fee !is Fee {
            log:printError("Retrieving fee failed", fee);
            if fee is http:ClientRequestError {
                return <http:NotFound> {body: string `unknown appointment ID`};
            }
            return <http:InternalServerError> {body: fee.message()};
        }
        ```

    - If fee retrieval is successful, the next and last step is to make the payment by making a `POST` request to the payment service. The payload includes details extracted out from the original request (for `patient` and `card_number`), the appointment reservation response (for `appointmentNumber` and `doctor`), and the response to the fee retrieval request (for `fee`).

        ```ballerina
        ReservationStatus|http:ClientError status = paymentEP->/.post({
            appointmentNumber,
            doctor: appointment.doctor,
            patient,
            fee: actualFee,
            confirmed: false,
            card_number: cardNo
        });

        if status !is ReservationStatus {
            log:printError("Payment failed", status);
            if status is http:ClientRequestError {
                return <http:NotFound> {body: string `unknown appointment ID`};
            }
            return <http:InternalServerError> {body: status.message()};
        }

        log:printDebug("Appointment reservation successful", 
                        name = patient.name, 
                        appointmentNumber = appointmentNumber);
        return status;
        ```

        If the payment request fails, the response to the original request will be an appropriate error response. If not, the response will be the response from the payment service.

You have successfully developed the required service.

#### Complete source

```ballerina
import ballerina/http;
import ballerina/log;

configurable int port = 8290;
configurable string hospitalServicesBackend = "http://localhost:9090";
configurable string paymentBackend = "http://localhost:9090/healthcare/payments";

final http:Client hospitalServicesEP = check initializeHttpClient(hospitalServicesBackend);
final http:Client paymentEP = check initializeHttpClient(paymentBackend);

function initializeHttpClient(string url) returns http:Client|error => new (url);

type Patient record {|
    string name;
    string dob;
    string ssn;
    string address;
    string phone;
    string email;
|};

type ReservationRequest record {|
    record {|
        *Patient;
        string cardNo;
    |} patient;
    string doctor;
    string hospital_id;
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

type Appointment record {|
    int appointmentNumber;
    Doctor doctor;
    Patient patient;
    boolean confirmed;
    string hospital;
    string appointmentDate;
|};

type Fee record {|
    string patientName;
    string doctorName;
    string actualFee;
|};

type ReservationStatus record {|
    int appointmentNo;
    string doctorName;
    string patient;
    decimal actualFee;
    int discount;
    decimal discounted;
    string paymentID;
    string status;
|};

service /healthcare on new http:Listener(port) {
    resource function post categories/[string category]/reserve(ReservationRequest payload) 
            returns ReservationStatus|http:NotFound|http:InternalServerError {
        ReservationRequest {
            patient: {cardNo, ...patient},
            doctor, 
            hospital,
            hospital_id,
            appointment_date
        } = payload;

        log:printDebug("Initiating reservation process", 
                       specialization = category, 
                       doctor = doctor,
                       patient = patient.name);

        Appointment|http:ClientError appointment =
                hospitalServicesEP->/[hospital_id]/categories/[category]/reserve.post({
            patient,
            doctor,
            hospital,
            appointment_date
        });

        if appointment !is Appointment {
            log:printError("Appointment reservation failed", appointment);
            if appointment is http:ClientRequestError {
                return <http:NotFound> {body: string `unknown hospital, doctor, or category`};
            }
            return <http:InternalServerError> {body: appointment.message()};
        }

        int appointmentNumber = appointment.appointmentNumber;

        Fee|http:ClientError fee = 
                hospitalServicesEP->/[hospital_id]/categories/appointments/[appointmentNumber]/fee;

        if fee !is Fee {
            log:printError("Retrieving fee failed", fee);
            if fee is http:ClientRequestError {
                return <http:NotFound> {body: string `unknown appointment ID`};
            }
            return <http:InternalServerError> {body: fee.message()};
        }

        decimal|error actualFee = decimal:fromString(fee.actualFee);
        if actualFee is error {
            return <http:InternalServerError> {body: "fee retrieval failed"};
        }

        ReservationStatus|http:ClientError status = paymentEP->/.post({
            appointmentNumber,
            doctor: appointment.doctor,
            patient,
            fee: actualFee,
            confirmed: false,
            card_number: cardNo
        });

        if status !is ReservationStatus {
            log:printError("Payment failed", status);
            if status is http:ClientRequestError {
                return <http:NotFound> {body: string `unknown appointment ID`};
            }
            return <http:InternalServerError> {body: status.message()};
        }

        log:printDebug("Appointment reservation successful", 
                       name = patient.name, 
                       appointmentNumber = appointmentNumber);
        return status;
    }
}
```

### Step 3: Build and run the service

You can run this service by navigating to the project root and using the `bal run` command.

```bash
service-orchestration$ bal run
Compiling source
        integration_tutorials/service_orchestration:0.1.0

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
        "patient": {
            "name": "John Doe",
            "dob": "1940-03-19",
            "ssn": "234-23-525",
            "address": "California",
            "phone": "8770586755",
            "email": "johndoe@gmail.com",
            "cardNo": "7844481124110331"
        },
        "doctor": "thomas collins",
        "hospital_id": "grandoaks",
        "hospital": "grand oak community hospital",
        "appointment_date": "2023-10-02"
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
    "appointmentNo": 1,
    "doctorName": "thomas collins",
    "patient": "John Doe",
    "actualFee": 7000.0,
    "discount": 20,
    "discounted": 5600.0,
    "paymentID": "f55314dc-0d82-4cff-8eae-7ce941f98451",
    "status": "settled"
}
```

## Complete implementation

Check out the [complete implementation](https://github.com/ballerina-guides/integration-tutorials/tree/main/service-orchestration) on GitHub.

## References

- [`ballerina/http` API docs](https://lib.ballerina.io/ballerina/http/latest)
- [`ballerina/log` API docs](https://lib.ballerina.io/ballerina/log/latest)
