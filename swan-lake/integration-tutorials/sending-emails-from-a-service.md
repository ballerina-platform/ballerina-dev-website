---
layout: ballerina-sending-emails-from-a-service-left-nav-pages-swanlake
title: Sending emails from a service
permalink: /learn/sending-emails-from-a-service/
description: Integration tutorial for sending emails from a service.
keywords: ballerina, programming language, client, restful-api, integration, smtp, email
active: sending-emails-from-a-service
intro: This tutorial helps you understand the basics of Ballerina constructs, which allow you to do client calls, develop RESTful APIs, and send emails using the SMTP protocol.
---

## Overview

In this tutorial, you will develop a service that accepts requests to make an appointment at a hospital, makes the appointment, and sends an email to the client confirming the appointment details.

To implement this use case, you will develop a REST service with a single resource using Visual Studio Code with the Ballerina Swan Lake extension. This resource will receive the user request, reserve the appointment, and send an email to the user with the appointment details.

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

3. Call the payment backend service to make the payment to confirm the appointment. If the payment is successful, the response payload will be similar to that shown below.

    ```json
    {
        "appointmentNo": 1,
        "doctorName": "thomas collins",
        "patient": "John Doe",
        "actualFee": 7000,
        "discount": 20,
        "discounted": 5600.0,
        "paymentID": "8458c75a-c8e0-4d49-8da4-5e56043b1a20",
        "status": "settled"
    }
    ```

4. If the payment is successful, send an email to the user with the appointment details. 

### Concepts covered

- REST API
- HTTP Client
- Email Client

## Develop the application

### Step 1: Set up the workspace

Install [Ballerina Swan Lake](https://ballerina.io/downloads/) and the [Ballerina Swan Lake VS Code extension](https://marketplace.visualstudio.com/items?itemName=wso2.ballerina) on VS Code.

### Step 2: Develop the service

Follow the instructions given in this section to develop the service.

1. Create a new Ballerina project using the `bal` command and open it in VS Code.

    ```
    $ bal new sending-emails-from-a-service
    ```

2. Remove the generated content in the `main.bal` file and open the diagram view in VS Code.

    ![Open diagram view](/learn/images/integration-tutorials/sending-emails-from-a-service/open_diagram_view.gif)

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

    ![Define records](/learn/images/integration-tutorials/sending-emails-from-a-service/define_records.gif)

    The generated records will be as follows.

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

    type Appointment record {
        int appointmentNumber;
        Doctor doctor;
        Patient patient;
        boolean confirmed;
        string hospital;
        string appointmentDate;
    };

    type Payment record {
        int appointmentNo;
        string doctorName;
        string patient;
        decimal actualFee;
        int discount;
        decimal discounted;
        string paymentID;
        string status;
    };

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

    type ReservationResponse record {
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

4. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, retrieves relevant details from the backend service, and sends an email to the client.

    - Open the [Ballerina HTTP API Designer](https://wso2.com/ballerina/vscode/docs/design-the-services/http-api-designer) in VS Code.

    - Use `/healthcare` as the service path (or the context) for the service attached to the listener that is listening on port `8290`.

        ![Define the service](/learn/images/integration-tutorials/sending-emails-from-a-service/define_a_service.gif)
     
    - Define an HTTP resource that allows the `POST` operation on the resource path `/categories/{category}/reserve` and accepts the `category` path parameter (corresponding to the specialization). Use `ReservationRequest` as a parameter indicating that the resource expects a JSON object corresponding to `ReservationRequest` as the payload. Use `http:Created`, `http:NotFound`, and `http:InternalServerError` as the response types.

        ![Define the resource](/learn/images/integration-tutorials/sending-emails-from-a-service/define_a_resource.gif)

        The generated service will be as follows.

        ```ballerina
        service /healthcare on new http:Listener(8290) {
            resource function post categories/[string category]/reserve(ReservationRequest payload) 
                    returns http:Created|http:NotFound|http:InternalServerError {
                
            }
        }
        ```

5. Define [configurable variables](https://ballerina.io/learn/by-example/#configurability) for the URLs of the backend services. Also, define configurable variables for the host, username, and password of the SMTP client.

    ![Define a configurable variable](/learn/images/integration-tutorials/sending-emails-from-a-service/define_a_configurable_variable.gif)

    The generated code will be as follows.

    ```ballerina
    configurable string hospitalServicesBackend = "http://localhost:9090";
    configurable string paymentBackend = "http://localhost:9090/healthcare/payments";
    configurable string host = "smtp.gmail.com";
    configurable string username = ?;
    configurable string password = ?;
    ```

    > **Note:** Enable two factor authentication on your Google account, generate an app password, and use the app password in place of your email password. The app password can be generated with [this link](https://myaccount.google.com/apppasswords).

6. Define two [`http:Client`](https://ballerina.io/learn/by-example/#http-client) objects to send requests to the backend services and one [`email:SmtpClient`](https://ballerina.io/learn/by-example/#email-client) object to send emails.
   
   ![Define the clients](/learn/images/integration-tutorials/sending-emails-from-a-service/define_a_client.gif)

   The generated code will be as follows.

   ```ballerina
   final http:Client hospitalServicesEP = check new (hospitalServicesBackend);
   final http:Client paymentEP = check new (paymentBackend);
   final email:SmtpClient smtpClient = check new (host, username, password);
   ```

7. Implement the logic.

    ```ballerina
    service /healthcare on new http:Listener(8290) {

        resource function post categories/[string category]/reserve(ReservationRequest payload)
                returns http:Created|http:NotFound|http:InternalServerError {

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
                    return <http:NotFound>{body: string `unknown hospital, doctor, or category`};
                }
                return <http:InternalServerError>{body: appointment.message()};
            }

            int appointmentNumber = appointment.appointmentNumber;

            Payment|http:ClientError payment = paymentEP->/.post({
                appointmentNumber,
                doctor: appointment.doctor,
                patient: appointment.patient,
                fee: appointment.doctor.fee,
                confirmed: appointment.confirmed,
                card_number: patient.cardNo
            });

            if payment !is Payment {
                log:printError("Payment settlement failed", payment);
                if payment is http:ClientRequestError {
                    return <http:NotFound>{body: string `payment failed: unknown appointment number`};
                }
                return <http:InternalServerError>{body: payment.message()};
            }

            email:Error? sendMessage = smtpClient->sendMessage({
                to: patient.email,
                subject: "Appointment reservation confirmed at " + payload.hospital,
                body: getEmailContent(appointmentNumber, appointment, payment)
            });

            if sendMessage is email:Error {
                return <http:InternalServerError>{body: sendMessage.message()};
            }
            return <http:Created>{};
        }
    }

    function getEmailContent(int appointmentNumber, Appointment appointment, Payment payment)
            returns string =>
        let Patient patient = appointment.patient, Doctor doctor = appointment.doctor in
        string `Appointment Confirmation

        Appointment Details
            Appointment Number: ${appointmentNumber}
            Appointment Date: ${appointment.appointmentDate}

        Patient Details
            Name: ${patient.name}
            Contact Number: ${patient.phone}

        Doctor Details
            Name: ${doctor.name}
            Specialization: ${doctor.category}

        Payment Details
            Doctor Fee: ${payment.actualFee}
            Discount: ${payment.discount}
            Total Fee: ${payment.discounted}
            Payment Status: ${payment.status}`;
    ```

   - The first backend call is a `POST` request to the hospital service to reserve the appointment. The `hospital_id` and `category` values are used as path parameters.

   - Use the `is` check to decide the flow based on the response to the client call. If the request failed with a `4xx` status code, return an `http:NotFound` response. Else, if the payload could not be bound to `Appointment` as expected or if there were any other failures, respond with an `http:InternalServerError` response.

   - If the appointment reservation was successful, we can make the payment by making a `POST` request to the payment service. The payload includes details extracted out from the original request (for `card_number`) and the appointment reservation response (for `appointmentNumber`, `doctor`, `patient`, `fee`, and `confirmed`).

   - If the payment was successful, the next and final step is to send an email to the user with the appointment details. We send the email specifying the user's email address, the subject, and the email body.

   - If the email is sent successfully, the response will be an `http:Created` response. If the email sending process resulted in an error, an `http:InternalServerError` response will be returned.

You have successfully developed the required service.

#### Complete source

```ballerina
import ballerina/email;
import ballerina/http;
import ballerina/log;

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

type Appointment record {|
    int appointmentNumber;
    Doctor doctor;
    Patient patient;
    boolean confirmed;
    string hospital;
    string appointmentDate;
|};

type Payment record {|
    int appointmentNo;
    string doctorName;
    string patient;
    decimal actualFee;
    int discount;
    decimal discounted;
    string paymentID;
    string status;
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

type ReservationResponse record {|
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
configurable string host = "smtp.gmail.com";
configurable string username = ?;
configurable string password = ?;

final http:Client hospitalServicesEP = check new (hospitalServicesBackend);
final http:Client paymentEP = check new (paymentBackend);
final email:SmtpClient smtpClient = check new (host, username, password);

service /healthcare on new http:Listener(8290) {

    resource function post categories/[string category]/reserve(ReservationRequest payload)
            returns http:Created|http:NotFound|http:InternalServerError {

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
                return <http:NotFound>{body: string `unknown hospital, doctor, or category`};
            }
            return <http:InternalServerError>{body: appointment.message()};
        }

        int appointmentNumber = appointment.appointmentNumber;

        Payment|http:ClientError payment = paymentEP->/.post({
            appointmentNumber,
            doctor: appointment.doctor,
            patient: appointment.patient,
            fee: appointment.doctor.fee,
            confirmed: appointment.confirmed,
            card_number: patient.cardNo
        });

        if payment !is Payment {
            log:printError("Payment settlement failed", payment);
            if payment is http:ClientRequestError {
                return <http:NotFound>{body: string `payment failed: unknown appointment number`};
            }
            return <http:InternalServerError>{body: payment.message()};
        }

        email:Error? sendMessage = smtpClient->sendMessage({
            to: patient.email,
            subject: "Appointment reservation confirmed at " + payload.hospital,
            body: getEmailContent(appointmentNumber, appointment, payment)
        });

        if sendMessage is email:Error {
            return <http:InternalServerError>{body: sendMessage.message()};
        }
        return <http:Created>{};
    }
}

function getEmailContent(int appointmentNumber, Appointment appointment, Payment payment)
        returns string =>
    let Patient patient = appointment.patient, Doctor doctor = appointment.doctor in
    string `Appointment Confirmation

    Appointment Details
        Appointment Number: ${appointmentNumber}
        Appointment Date: ${appointment.appointmentDate}

    Patient Details
        Name: ${patient.name}
        Contact Number: ${patient.phone}

    Doctor Details
        Name: ${doctor.name}
        Specialization: ${doctor.category}

    Payment Details
        Doctor Fee: ${payment.actualFee}
        Discount: ${payment.discount}
        Total Fee: ${payment.discounted}
        Payment Status: ${payment.status}`;
```

### Step 3: Build and run the service

![Run the service](/learn/images/integration-tutorials/sending-emails-from-a-service/run_the_service.gif)

> **Note:**
> Alternatively, you can run this service by navigating to the project root and using the `bal run` command.
>
> ```
> sending-emails-from-a-service$ bal run
> Compiling source
>         integration_tutorials/sending-emails-from-a-service:0.1.0
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

![Send a request](/learn/images/integration-tutorials/sending-emails-from-a-service/try_it.gif)

#### Verify the email

You will receive an email with information similar to the following for a successful appointment reservation.

![Email](/learn/images/integration-tutorials/sending-emails-from-a-service/email.png)

## Complete implementation

Check out the [complete implementation](https://github.com/ballerina-guides/integration-tutorials/tree/main/sending-emails-from-a-service) on GitHub.

## References

- [`ballerina/http` API docs](https://lib.ballerina.io/ballerina/http/latest)
- [`ballerina/email` API docs](https://lib.ballerina.io/ballerina/email/latest)
- [`ballerina/log` API docs](https://lib.ballerina.io/ballerina/log/latest)
