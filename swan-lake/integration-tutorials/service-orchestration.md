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

To implement this use case, you will develop a REST service with a single resource using Visual Studio Code with the Ballerina Swan Lake extension, and then run the service. This resource will receive the user request, call the backend services to make the appointment, and respond to the user request with the appointment details.

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

4. Finally, call the payment backend service to make the payment and retrieve the reservation status.

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

    ```
    $ bal new service-orchestration
    ```

2. Remove the generated content in the `main.bal` file and open the diagram view in VS Code. 
   
   ![Open diagram view](/learn/images/integration-tutorials/service-orchestration/open_diagram_view.gif)

3. Generate record types corresponding to the payloads from the hospital and payment backend services by providing samples of the expected JSON payloads.

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

    ![Define records](/learn/images/integration-tutorials/service-orchestration/define_records.gif)

    The generated records will be as follows

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

    type Appointment record {
        int appointmentNumber;
        Doctor doctor;
        Patient patient;
        boolean confirmed;
        string hospital;
        string appointmentDate;
    };
    ```

    Similarly, generate records corresponding to the request payload (e.g., `ReservationRequest`). Update the duplicate `Patient` record to `PatientWithCardNo` and use [record type inclusion](https://ballerina.io/learn/by-example/type-inclusion-for-records/) to include all the fields from the `Patient` record along with the `cardNo` field.

    ```ballerina
    type PatientWithCardNo record {
        *Patient;
        string cardNo;
    };

    type ReservationRequest record {
        PatientWithCardNo patient;
        string doctor;
        string hospital_id;
        string hospital;
        string appointment_date;
    };

    type Fee record {
        string patientName;
        string doctorName;
        string actualFee;
    };

    type ReservationStatus record {
        int appointmentNo;
        string doctorName;
        string patient;
        decimal actualFee;
        int discount;
        decimal discounted;
        string paymentID;
        string status;
    };
    ```

    > **Note:**
    > While it is possible to work with the JSON payload directly, using record types offers several advantages including enhanced type safety, data validation, and better tooling experience (e.g., completion).

    > **Note:** 
    > When the fields of the JSON objects are expected to be exactly those specified in the sample payload, the generated records can be updated to be [closed records](https://ballerina.io/learn/by-example/controlling-openness/), which would indicate that no other fields are allowed or expected.

4. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, makes calls to the backend services to make an appointment, and responds to the client.

    - Open the [Ballerina HTTP API Designer](https://wso2.com/ballerina/vscode/docs/design-the-services/http-api-designer) in VS Code.

    - Use `/healthcare` as the service path (or the context) for the service attached to the listener that is listening on port `8290`.

        ![Define the service](/learn/images/integration-tutorials/service-orchestration/define_a_service.gif)

    - Define an HTTP resource that allows the `POST` operation on the resource path `/categories/{category}/reserve` and accepts the `category` path parameter (corresponding to the specialization). Use `ReservationRequest` as a parameter indicating that the resource expects a JSON object corresponding to `ReservationRequest` as the payload. Use `ReservationStatus`, `http:NotFound`, and `http:InternalServerError` as the response types.

        ![Define the resource](/learn/images/integration-tutorials/service-orchestration/define_a_resource.gif)

        The generated service will be as follows.

        ```ballerina
        service /healthcare on new http:Listener(8290) {
            resource function post categories/[string category]/reserve(ReservationRequest payload) 
                    returns ReservationStatus|http:NotFound|http:InternalServerError {
                
            }
        }
        ```

5. Define [configurable variables](https://ballerina.io/learn/by-example/#configurability) for the URLs of the backend services and two [`http:Client`](https://ballerina.io/learn/by-example/#http-client) objects to send requests to the backend services.

    ![Define a configurable variable and a client](/learn/images/integration-tutorials/service-orchestration/define_a_configurable_variable_and_a_client.gif)

    The generated code will be as follows.

    ```ballerina
    configurable string hospitalServicesBackend = "http://localhost:9090";
    configurable string paymentBackend = "http://localhost:9090/healthcare/payments";

    final http:Client hospitalServicesEP = check new (hospitalServicesBackend);
    final http:Client paymentEP = check new (paymentBackend);
    ```

6. Implement the logic.

    ```ballerina
    service /healthcare on new http:Listener(8290) {
        resource function post categories/[string category]/reserve(ReservationRequest payload) 
                returns ReservationStatus|http:NotFound|http:InternalServerError {
            PatientWithCardNo patient = payload.patient;

            Appointment|http:ClientError appointment =
                    hospitalServicesEP->/[payload.hospital_id]/categories/[category]/reserve.post({
                patient: {
                    name: patient.name,
                    dob: patient.dob,
                    ssn: patient.ssn,
                    address: patient.address,
                    phone: patient.phone,
                    email: patient.email
                },
                doctor: payload.doctor,
                hospital: payload.hospital,
                appointment_date: payload.appointment_date
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
                    hospitalServicesEP->/[payload.hospital_id]/categories/appointments/[appointmentNumber]/fee;

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
                patient: appointment.patient,
                fee: actualFee,
                confirmed: false,
                card_number: patient.cardNo
            });

            if status !is ReservationStatus {
                log:printError("Payment failed", status);
                if status is http:ClientRequestError {
                    return <http:NotFound> {body: string `unknown appointment ID`};
                }
                return <http:InternalServerError> {body: status.message()};
            }

            return status;
        }
    }
    ```

    - The first backend call is a `POST` request to the hospital service to reserve the appointment. The `hospital_id` and `category` values are used as path parameters.

    - Use the `is` check to decide the flow based on the response to the client call. If the request failed with a `4xx` status code, respond with an `http:NotFound` response. Else, if the payload could not be bound to `Appointment` as expected or there was some other failure, respond with an `http:InternalServerError` response. If the client call was successful and the response payload was successfully bound to `Appointment`, we can proceed with the subsequent calls.  

    - If the appointment reservation was successful, we can now retrieve the fee, by making a `GET` request to the hospital service, with `hospital_id` and `appointmentNumber` from the `Appointment` payload as path parameters.

    - If fee retrieval is successful, the next and last step is to make the payment by making a `POST` request to the payment service. The payload includes details extracted out from the original request (for `patient` and `card_number`), the appointment reservation response (for `appointmentNumber` and `doctor`), and the response to the fee retrieval request (for `fee`).

    - If the payment request fails, the response to the original request will be an appropriate error response. If not, the response will be the response from the payment service.

You have successfully developed the required service.

#### Complete source

```ballerina
import ballerina/http;
import ballerina/log;

type Doctor record {|
    string name;
    string hospital;
    string category;
    string availability;
    decimal fee;
|};

type Patient record {|
    string name;
    string dob;
    string ssn;
    string address;
    string phone;
    string email;
|};

type Appointment record {|
    int appointmentNumber;
    Doctor doctor;
    Patient patient;
    boolean confirmed;
    string hospital;
    string appointmentDate;
|};

type PatientWithCardNo record {|
    *Patient;
    string cardNo;
|};

type ReservationRequest record {|
    PatientWithCardNo patient;
    string doctor;
    string hospital_id;
    string hospital;
    string appointment_date;
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

configurable string hospitalServicesBackend = "http://localhost:9090";
configurable string paymentBackend = "http://localhost:9090/healthcare/payments";

final http:Client hospitalServicesEP = check new (hospitalServicesBackend);
final http:Client paymentEP = check new (paymentBackend);

service /healthcare on new http:Listener(8290) {
    resource function post categories/[string category]/reserve(ReservationRequest payload) 
            returns ReservationStatus|http:NotFound|http:InternalServerError {
        PatientWithCardNo patient = payload.patient;

        Appointment|http:ClientError appointment =
                hospitalServicesEP->/[payload.hospital_id]/categories/[category]/reserve.post({
            patient: {
                name: patient.name,
                dob: patient.dob,
                ssn: patient.ssn,
                address: patient.address,
                phone: patient.phone,
                email: patient.email
            },
            doctor: payload.doctor,
            hospital: payload.hospital,
            appointment_date: payload.appointment_date
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
                hospitalServicesEP->/[payload.hospital_id]/categories/appointments/[appointmentNumber]/fee;

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
            patient: appointment.patient,
            fee: actualFee,
            confirmed: false,
            card_number: patient.cardNo
        });

        if status !is ReservationStatus {
            log:printError("Payment failed", status);
            if status is http:ClientRequestError {
                return <http:NotFound> {body: string `unknown appointment ID`};
            }
            return <http:InternalServerError> {body: status.message()};
        }

        return status;
    }
}
```

### Step 3: Build and run the service

![Run the service](/learn/images/integration-tutorials/service-orchestration/run_the_service.gif)

> **Note:**
> Alternatively, you can run this service by navigating to the project root and using the `bal run` command.
>
> ```
> service-orchestration$ bal run
> Compiling source
>         integration_tutorials/service_orchestration:0.1.0
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

![Send a request](/learn/images/integration-tutorials/service-orchestration/try_it.gif)

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
