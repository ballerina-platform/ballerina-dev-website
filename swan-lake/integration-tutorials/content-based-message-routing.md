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

The flow is as follows:

1. Receive a request with a JSON payload similar to the following.

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
        "hospital_id": "grandoak",
        "appointment_date": "2017-04-02"
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
        "fee": 7000.0,
        "hospital": "grand oak community hospital",
        "confirmed": false,
        "appointmentDate": "2017-04-02"
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

    ```bash
    $ bal new content-based-message-routing
    ```

2. Introduce the source code in files with the `.bal` extension. (e.g., the `main.bal` file)

    Import the
    - `ballerina/http` module to develop the REST API and define the clients that can be used to send requests to the backend services
    - `ballerina/log` module to log debug, error, or info level information for each client request

    ```ballerina
    import ballerina/http;
    import ballerina/log;
    ```

3. Define a [configurable variable](https://ballerina.io/learn/by-example/#configurability) for the port on which the listener should listen.

    ```ballerina
    configurable int port = 8290;
    ```

4. Define three [`http:Client`](https://ballerina.io/learn/by-example/#http-client) clients to send requests to the backend services.

    ```ballerina
    final http:Client grandOakEP = check initializeHttpClient("http://localhost:9090/grandoak/categories");
    final http:Client clemencyEP = check initializeHttpClient("http://localhost:9090/clemency/categories");
    final http:Client pineValleyEP = check initializeHttpClient("http://localhost:9090/pinevalley/categories");

    function initializeHttpClient(string url) returns http:Client|error => new (url);
    ```

    > **Note:** The argument passed to the `new` expression is the URL of the backend service.
    >
    > Here, a separate function is used to initialize the clients to aid with testing. Alternatively, the `new` expression can be used directly to initialize the clients.
    >
    > ```ballerina
    > final http:Client grandoakEP = new ("http://localhost:9090/grandoak/categories");
    > final http:Client clemencyEP = new ("http://localhost:9090/clemency/categories");
    > final http:Client pinevalleyEP = new ("http://localhost:9090/pinevalley/categories");
    >```

5. Introduce an [enum](https://ballerina.io/learn/by-example/enumerations/) to define the hospital IDs.

    ```ballerina
    enum HospitalId {
        GRAND_OAK = "grandoak",
        CLEMENCY = "clemency",
        PINE_VALLEY = "pinevalley"
    };
    ```

6. Define records corresponding to the request payload and response payload.

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
        Patient patient;
        string doctor;
        string hospital_id;
        HospitalId hospital;
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
    ```

7. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, makes calls to the relevant hospital backend service to retrieve relevant details, and responds to the client.

    ```ballerina
    service /healthcare on new http:Listener(port) {
        resource function post categories/[string category]/reserve(ReservationRequest payload) 
                returns ReservationResponse|http:NotFound|http:InternalServerError {
            
        }
    }
    ```

    - Use `/healthcare` as the service path (or the context) of the service which is attached to the listener listening on port `port`. 

    - The HTTP resource allows the `POST` operation on resource path `/categories/{category}/reserve`, where `category` is a path parameter. 

    - Use `ReservationRequest` as a parameter indicating that the resource expects a JSON object corresponding to `ReservationRequest` as the payload. 

    - Use `ReservationResponse|http:NotFound|http:InternalServerError` as the return type to indicate that the response will have a JSON payload corresponding to `ReservationResponse` on success or the response will be an `http:NotFound` or `http:InternalServerError` response on error.

8. Implement the logic.

    ```ballerina
    service /healthcare on new http:Listener(port) {
        resource function post categories/[string category]/reserve(ReservationRequest payload)
                returns ReservationResponse|http:NotFound|http:InternalServerError {
            ReservationRequest {hospital_id, patient, ...reservationRequest} = payload;

            log:printDebug("Routing reservation request",
                            hospital_id = hospital_id,
                            patient = patient.name,
                            doctor = reservationRequest.doctor);

            http:Client hospitalEP;
            match hospital_id {
                GRAND_OAK => {
                    hospitalEP = grandOakEP;
                }
                CLEMENCY => {
                    hospitalEP = clemencyEP;
                }
                _ => {
                    hospitalEP = pineValleyEP;
                }
            }

            ReservationResponse|http:ClientError resp = hospitalEP->/[category]/reserve.post({
                patient,
                ...reservationRequest
            });

            if resp is ReservationResponse {
                log:printDebug("Reservation request successful",
                                name = patient.name,
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

    - Define the `hospitalEP` variable. Later, the relevant client is assigned to this variable based on the `hospital_id` value.

        ```ballerina
        http:Client hospitalEP;
        ```

    - Use a [typed binding pattern with a mapping binding pattern to destructure](https://ballerina.io/learn/by-example/rest-binding-pattern-in-mapping-binding-pattern/) the payload and assign required components of the value to separate variables.
        
        ```ballerina
        ReservationRequest {hospital_id, patient, doctor, ...reservationRequest} = payload;
        ```
    
        Here,
        - The `hospital_id` value is assigned to the `hospital_id` variable. 
        - The `patient` value is assigned to the `patient` variable of type `Patient` (fields are exactly those expected by the `Patient` record). 
        - The remaining components of the payload are collected in a mapping value and assigned to the `reservationRequest` variable.

    - The `log` functions are used to [log](https://ballerina.io/learn/by-example/#log) information at `INFO`, `DEBUG`, and `ERROR` log levels.

    - Use a [match statement](https://ballerina.io/learn/by-example/match-statement) to assign the relevant client to the `hospitalEP` variable based on the `hospital_id` value.

        ```ballerina
            match hospital_id {
                GRAND_OAK => {
                    hospitalEP = grandOakEP;
                }
                CLEMENCY => {
                    hospitalEP = clemencyEP;
                }
                _ => {
                    hospitalEP = pineValleyEP;
                }
            }
        ```

    - Make a `POST` request to the backend hospital service to make the reservation. The `category` value is used as a path parameter.

        ```ballerina
        ReservationResponse|http:ClientError resp = hospitalEP->/[category]/reserve.post({
            patient,
            doctor,
            ...reservationRequest
        });
        ```

        The expected payload in the request to make the reservation consists of four fields, namely `patient`, `doctor`, `hospital`, and `appointment_date`. The `reservationRequest` variable is used as a rest argument since it contains `hospital`, and `appointment_date`. The payload is specified directly as an argument to the remote method call.

        ```ballerina
        {patient, doctor, ...reservationRequest}
        ```

    - Use the `is` check to check whether the response is a `ReservationResponse` and return it as is (i.e., reservation successful).

        ```ballerina
        if resp is ReservationResponse {
            log:printDebug("Reservation request successful",
                            name = patient.name,
                            appointmentNumber = resp.appointmentNumber);
            return resp;
        }
        ```

    - If the response is not a `ReservationResponse`, log the failure at `ERROR` level.  Return a "NotFound" response if the response is a `http:ClientRequestError`, or an "InternalServerError" response if the response is a `http:ServerError`.

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

final http:Client grandOakEP = check initializeHttpClient("http://localhost:9090/grandoak/categories");
final http:Client clemencyEP = check initializeHttpClient("http://localhost:9090/clemency/categories");
final http:Client pineValleyEP = check initializeHttpClient("http://localhost:9090/pinevalley/categories");

function initializeHttpClient(string url) returns http:Client|error => new (url);

enum HospitalId {
    GRAND_OAK = "grandoak",
    CLEMENCY = "clemency",
    PINE_VALLEY = "pinevalley"
};

type Patient record {|
    string name;
    string dob;
    string ssn;
    string address;
    string phone;
    string email;
|};

type ReservationRequest record {|
    Patient patient;
    string doctor;
    HospitalId hospital_id;
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
    resource function post categories/[string category]/reserve(ReservationRequest payload)
            returns ReservationResponse|http:NotFound|http:InternalServerError {
        ReservationRequest {hospital_id, patient, ...reservationRequest} = payload;

        log:printDebug("Routing reservation request",
                        hospital_id = hospital_id,
                        patient = patient.name,
                        doctor = reservationRequest.doctor);

        http:Client hospitalEP;
        match hospital_id {
            GRAND_OAK => {
                hospitalEP = grandOakEP;
            }
            CLEMENCY => {
                hospitalEP = clemencyEP;
            }
            _ => {
                hospitalEP = pineValleyEP;
            }
        }

        ReservationResponse|http:ClientError resp = hospitalEP->/[category]/reserve.post({
            patient,
            ...reservationRequest
        });

        if resp is ReservationResponse {
            log:printDebug("Reservation request successful",
                            name = patient.name,
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

#### Sequence diagram

The [sequence diagram view](https://wso2.com/ballerina/vscode/docs/implement-the-code/sequence-diagram-view/) for the implemented resource method is the following.

<img src="/learn/images/tutorial_content_based_message_routing_diagram.png" alt="Sequence Diagram" height="700" style="width:auto; max-width:100%">

### Step 3: Build and run the service

You can run this service by navigating to the project root and using the `bal run` command.

```bash
content-based-message-routing$ bal run
Compiling source
        integration_tutorials/content_based_message_routing:0.1.0

Running executable
```

### Step 4: Try out the use case

Let's test the use case by sending a request to the service.

#### Start the backend service

Download the JAR file for the [backend service](https://github.com/ballerina-guides/integration-tutorials/blob/main/backends/hospital-service/hospitalservice.jar), and execute the following command to start the service:

```bash
bal run hospitalservice.jar
```

#### Send a request to the service

Let's send a request to the service using cURL as follows.

1. Install and set up [cURL](https://curl.se/) as your client.

3. Create a file named `request.json` with the request payload.

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

Check out the [complete implementation](https://github.com/ballerina-guides/integration-tutorials/tree/main/content-based-message-routing) on GitHub.

## References

- [`ballerina/http` API docs](https://lib.ballerina.io/ballerina/http/latest)
- [`ballerina/log` API docs](https://lib.ballerina.io/ballerina/log/latest)
