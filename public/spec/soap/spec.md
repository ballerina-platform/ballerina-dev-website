# Specification: Ballerina SOAP Library

_Owners_: @shafreenAnfar @MadhukaHarith92 @Nuvindu \
_Reviewers_: @shafreenAnfar \
_Created_: 2023/06/07 \
_Updated_: 2023/12/01 \
_Edition_: Swan Lake

## Introduction

This is the specification for the SOAP package of [Ballerina language](https://ballerina.io/), which provides APIs to send an ordinary XML request to a SOAP backend by specifying the necessary details to construct a SOAP envelope.

The SOAP package specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the package, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Components](#2-components)
    * 2.1 [Client](#21-client)
    * 2.2 [Supported APIs](#22-supported-apis)
        * 2.2.1 [Send & Receive](#221-send--receive)
        * 2.2.2 [Send Only](#222-send-only)
        * 2.2.3 [Examples](#223-examples)
            * 2.2.3.1 [`sendReceive()` with SOAP 1.1](#2231-sendreceive-with-soap-11)
            * 2.2.3.2 [`sendReceive()` with SOAP 1.2](#2232-sendreceive-with-soap-12)
            * 2.2.3.3 [`sendOnly()` with SOAP 1.1](#2233-sendonly-with-soap-11)
            * 2.2.3.4 [`sendOnly()` with SOAP 1.2](#2234-sendonly-with-soap-12)
    * 2.3 [Response Types](#23-response-types)
        * 2.3.1 [`xml`](#231-xml)
        * 2.3.2 [`mime:Entity[]`](#232-mimeentity)
        * 2.3.3 [Examples](#233-examples)
3. [Security](#3-security)
    * 3.1 [Policies](#31-policies)
    * 3.2 [Security Policy Configuration Types](#32-security-policy-configuration-types)
        * 3.2.1 [Inbound Security Configurations](#321-inbound-security-configurations)
        * 3.2.2 [Outbound Security Configurations](#322-outbound-security-configurations)
    * 3.3 [Configure Security Policies](#33-configure-security-policies)
        * [UsernameToken and TranportBinding Policy with SOAP 1.1 Client](#331-usernametoken-and-tranportbinding-policy-with-soap-11-client)
        * [Asymmetric Binding and Outbound Security Configuration with SOAP 1.2 Client](#332-asymmetric-binding-and-outbound-security-configuration-with-soap-12-client)

## 1. Overview

This specification elaborates on the functions available in the SOAP package.

The soap module abstracts out the details of the creation of a SOAP envelope, headers, and the body in a SOAP message.

## 2. Components

This section describes the components of the Ballerina SOAP package. To use the Ballerina SOAP package, a user must import one of the following sub modules of the Ballerina SOAP package first.

* Importing SOAP 1.1 Module

    ```ballerina
    import ballerina/soap.soap11;
    ```

* Importing SOAP 1.2 Module

    ```ballerina
    import ballerina/soap.soap12;
    ```

## 2.1 Client

The `Client` is used to connect to and interact with SOAP endpoints.

> **_NOTE:_**
The SOAP module supports SOAP 1.1 and 1.2 versions. Users can specify the SOAP version when importing the SOAP package. In the SOAP package there are sub modules as `soap11` and `soap12` to support SOAP 1.1 and SOAP 1.2 in that order.

### 2.1.1 SOAP 1.1 Client

```ballerina
import ballerina/soap.soap11;

soap11:Client soapClient = check new ("http://www.dneonline.com/calculator.asmx?WSDL");
```

### 2.1.2 SOAP 1.2 Client

```ballerina
import ballerina/soap.soap12;

soap12:Client soapClient = check new ("http://www.dneonline.com/calculator.asmx?WSDL");
```

## 2.2 Supported APIs

This section outlines the APIs supported by the Ballerina SOAP package, providing an overview of their functionalities.

### 2.2.1 Send & Receive

The `sendReceive()` API provides a mechanism to send SOAP requests to a specified endpoint and receive a relevant response. This is a synchronous operation where the client sends a SOAP request and waits for the service to process the request and return a response. This API is suitable for scenarios where the client requires both sending a request and receiving the associated response to proceed with further actions.

### 2.2.2 Send Only

The `sendOnly()` API is designed for scenarios where the client needs to send a SOAP request but does not require or expect a response from the service. Here, it follows the "fire and forget" approach, where the client sends a SOAP request to the service without waiting for or processing any response. This API is useful when the client is only interested in triggering a specific action on the service side without needing the result.

The SOAP 1.1 specification requires the inclusion of the `action` parameter as a mandatory component within its APIs. In contrast, SOAP 1.2 relaxes this requirement, making the action parameter optional.

### 2.2.3 Examples

Following examples provideds practical use cases for both `sendReceive()` and `sendOnly()` APIs.

#### 2.2.3.1 `sendReceive()` with SOAP 1.1

```ballerina
import ballerina/soap.soap11;

public function main() returns error? {
    soap11:Client soapClient = check new ("http://www.dneonline.com/calculator.asmx?WSDL");

    xml envelope = xml `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                            <soap:Body>
                            <quer:Add xmlns:quer="http://tempuri.org/">
                                <quer:intA>2</quer:intA>
                                <quer:intB>3</quer:intB>
                            </quer:Add>
                            </soap:Body>
                        </soap:Envelope>`;
    xml response = check soapClient->sendReceive(envelope, "http://tempuri.org/Add");
}
```

#### 2.2.3.2 `sendReceive()` with SOAP 1.2

```ballerina
import ballerina/io;
import ballerina/soap.soap12;
  
public function main () returns error? {
    soap12:Client soapClient = check new("http://ws.cdyne.com/phoneverify/phoneverify.asmx?wsdl");

    xml envelope = xml `<soap:Envelope 
                        xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
                        soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
                        <soap:Body>
                            <quer:CheckPhoneNumber xmlns:quer="http://ws.cdyne.com/PhoneVerify/query"> 
                                <quer:PhoneNumber>18006785432</quer:PhoneNumber>
                                <quer:LicenseKey>0</quer:LicenseKey>
                            </quer:CheckPhoneNumber>
                        </soap:Body>
                    </soap:Envelope>`;
    xml response = check soapClient->sendReceive(envelope);
    io:println(response);
}
```

#### 2.2.3.3 `sendOnly()` with SOAP 1.1

```ballerina
import ballerina/soap.soap11;

public function main() returns error? {
    soap11:Client soapClient = check new ("http://www.dneonline.com/calculator.asmx?WSDL");

    xml envelope = xml `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                            <soap:Body>
                            <quer:Add xmlns:quer="http://tempuri.org/">
                                <quer:intA>2</quer:intA>
                                <quer:intB>3</quer:intB>
                            </quer:Add>
                            </soap:Body>
                        </soap:Envelope>`;
    check soapClient->sendOnly(envelope, "http://tempuri.org/Add");
}
```

#### 2.2.3.4 `sendOnly()` with SOAP 1.2

```ballerina
import ballerina/io;
import ballerina/soap.soap12;
  
public function main () returns error? {
    soap12:Client soapClient = check new("http://ws.cdyne.com/phoneverify/phoneverify.asmx?wsdl");

    xml body = xml `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
                        soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
                        <soap:Body>
                            <quer:CheckPhoneNumber xmlns:quer="http://ws.cdyne.com/PhoneVerify/query"> 
                                <quer:PhoneNumber>18006785432</quer:PhoneNumber>
                                <quer:LicenseKey>0</quer:LicenseKey>
                            </quer:CheckPhoneNumber>
                        </soap:Body>
                    </soap:Envelope>`;
    check soapClient->sendOnly(body);
}
```

## 2.3 Response Types

Responses of the SOAP APIs supports either `xml` or `mime:Entity[]` types. Since these APIs supports type inference, either type can be assign to the variables as a single type instead of a union type of `xml` and `mime:Entity[]`.

### 2.3.1 `xml`

The `xml` type is the common return type for SOAP responses. When a SOAP request is made using either the `sendReceive()` API, the response is typically in `xml` format. The `xml` type captures this response, allowing users to work with and manipulate the `xml` data received from the SOAP service.

### 2.3.2 `mime:Entity[]`

The `mime:Entity[]` type represents the return type for SOAP endpoints that support multimedia types in responses. In scenarios where SOAP services return multimedia content, such as images or files, the response is represented as an array of MIME entities (`mime:Entity[]`). This allows users to handle and process multimedia data received from SOAP services.

### 2.3.3 Examples

The following examples provides details on handling SOAP responses with different types (xml and mime:Entity[]).

#### 2.3.3.1 Send & Receive with `xml` Response

```ballerina
import ballerina/io;
import ballerina/soap.soap12;
  
public function main () returns error? {
    soap12:Client soapClient = check new("http://ws.cdyne.com/phoneverify/phoneverify.asmx?wsdl");

    xml envelope = xml `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
                        soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
                        <soap:Body>
                            <quer:CheckPhoneNumber xmlns:quer="http://ws.cdyne.com/PhoneVerify/query"> 
                                <quer:PhoneNumber>18006785432</quer:PhoneNumber>
                                <quer:LicenseKey>0</quer:LicenseKey>
                            </quer:CheckPhoneNumber>
                        </soap:Body>
                    </soap:Envelope>`;
    xml response = check soapClient->sendReceive(envelope);
    io:println(response);
}
```

#### 2.3.3.2 Send & Receive with `mime:Entity[]` Response

```ballerina
import ballerina/io;
import ballerina/soap.mime;
import ballerina/soap.soap12;

public function main () returns error? {
    soap12:Client soapClient = check new ("http://soap-endpoint-url");
    xml body = xml `<soap:Envelope
                        xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
                        soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
                        <soap:Body>
                          <quer:Add xmlns:quer="http://tempuri.org/">
                            <quer:intA>2</quer:intA>
                            <quer:intB>3</quer:intB>
                          </quer:Add>
                        </soap:Body>
                    </soap:Envelope>`;

    mime:Entity[] mtomMessage = [];
    mime:Entity envelope = new;
    check envelope.setContentType("application/xop+xml");
    envelope.setContentId("<soap@envelope>");
    envelope.setBody(body);
    mtomMessage.push(envelope);

    mime:Entity bytesPart = new;
    string readContent = check io:fileReadString(FILE_PATH);
    bytesPart.setFileAsEntityBody(FILE_PATH);
    string|byte[]|io:ReadableByteChannel|mime:EncodeError bytes = mime:base64Encode(readContent.toBytes());
    if bytes !is byte[] {
        return error("Encoded characters are not in the correct format");
    }
    bytesPart.setBody(bytes);
    check bytesPart.setContentType("image/jpeg");
    bytesPart.setContentId("<image1>");
    mtomMessage.push(bytesPart);

    mime:Entity[] response = check soapClient->sendReceive(mtomMessage, "http://tempuri.org/Add");
}
```

## 3. Security

The SOAP client module introduces a robust framework for configuring security measures in SOAP communication. Security is a critical concern when exchanging data via web services, and this module offers comprehensive options to fortify SOAP requests and responses.

There are two primary security configurations available for SOAP clients:

* `inboundSecurity`: This configuration is applied to the SOAP envelope when a request is made. It includes various ws security policies such as Username Token, Timestamp Token, X509 Token, Symmetric Binding, Asymmetric Binding, and Transport Binding, either individually or in combination with each other.

* `outboundSecurity`: This configuration is applied to the SOAP envelope when a response is received. Its purpose is to decrypt the data within the envelope and verify the digital signature for security validation.

### 3.1 Policies

This package currently supports the following WS Security policies:

* **Username Token**: Provides authentication through username and password credentials.
* **Timestamp Token**: Enhances message integrity by incorporating timestamp information.
* **X509 Token**: Allows the use of X.509 certificates for secure communication.
* **Symmetric Binding**: Enables symmetric key-based security mechanisms.
* **Asymmetric Binding**: Facilitates the use of asymmetric cryptography for enhanced security.

These policies empower SOAP clients to enhance the security of their web service communications by selecting and implementing the appropriate security mechanisms to safeguard their SOAP envelopes.

### 3.2 Security Policy Configuration Types

This subsection introduces the configuration types for inbound and outbound security, providing detailed information on each type.

#### 3.2.1 Inbound Security Configurations

* `TimestampTokenConfig`: Represents the record for Timestamp Token policy.
  * Fields:
    * `int` timeToLive : The time to get expired

* `UsernameTokenConfig`: Represents the record for Username Token policy.
  * Fields:
    * `string` username : The name of the user
    * `string` password : The password of the user
    * `PasswordType` passwordType : The password type of the username token

* `SymmetricBindingConfig`: Represents the record for Symmetric Binding policy.
  * Fields:
    * `crypto:PrivateKey` symmetricKey : The key to sign and encrypt the SOAP envelope
    * `crypto:PublicKey` servicePublicKey : The key to encrypt the symmetric key
    * `SignatureAlgorithm` signatureAlgorithm : The algorithm to sign the SOAP envelope
    * `EncryptionAlgorithm` encryptionAlgorithm : The algorithm to encrypt the SOAP envelope
    * `string` x509Token : The path or token of the X509 certificate

* `AsymmetricBindingConfig`: Represents the record for Username Token with Asymmetric Binding policy.
  * Fields:
    * `crypto:PrivateKey` signatureKey : The private key to sign the SOAP envelope
    * `crypto:PublicKey` encryptionKey : The public key to encrypt the SOAP body
    * `SignatureAlgorithm` signatureAlgorithm : The algorithm to sign the SOAP envelope
    * `EncryptionAlgorithm` encryptionAlgorithm : The algorithm to encrypt the SOAP body
    * `string` x509Token : field description

#### 3.2.2 Outbound Security Configurations

* `OutboundSecurityConfig`: Represents the record for outbound security configurations to verify and decrypt SOAP envelopes.
  * Fields:
    * `crypto:PublicKey` verificationKey : The public key to verify the signature of the SOAP envelope
    * `crypto:PrivateKey`|`crypto:PublicKey` decryptionKey : The private key to decrypt the SOAP envelope
    * `SignatureAlgorithm` signatureAlgorithm : The algorithm to verify the SOAP envelope
    * `EncryptionAlgorithm` decryptionAlgorithm : The algorithm to decrypt the SOAP body

### 3.3 Configure Security Policies

The following examples shows on configuring security policies for SOAP clients, covering scenarios like Username Token with Transport Binding and Asymmetric Binding with SOAP 1.2 clients.

#### 3.3.1 UsernameToken and TranportBinding Policy with SOAP 1.1 Client

```ballerina
import ballerina/crypto;
import ballerina/soap;
import ballerina/soap.soap11;

public function main() returns error? {
    soap11:Client soapClient = check new ("https://www.secured-soap-endpoint.com", 
        {
            inboundSecurity: [
            {
                username: "username",
                password: "password",
                passwordType: soap:TEXT
            },
            TRANSPORT_BINDING
            ]
        });

    xml envelope = xml `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
                            soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                            <soap:Body>
                            <quer:Add xmlns:quer="http://tempuri.org/">
                                <quer:intA>2</quer:intA>
                                <quer:intB>3</quer:intB>
                            </quer:Add>
                            </soap:Body>
                        </soap:Envelope>`;
    xml response = check soapClient->sendReceive(envelope, "http://tempuri.org/Add");
}
```

#### 3.3.2 Asymmetric Binding and Outbound Security Configuration with SOAP 1.2 Client

```ballerina
import ballerina/crypto;
import ballerina/soap;
import ballerina/soap.soap12;

public function main() returns error? {
    configurable crypto:PrivateKey clientPrivateKey = ?;
    configurable crypto:PublicKey clientPublicKey = ?;
    configurable ​crypto:PublicKey serverPublicKey = ?;

    soap12:Client soapClient = check new ("https://www.secured-soap-endpoint.com",
    {
        inboundSecurity: {
                signatureAlgorithm: soap:RSA_SHA256,
                encryptionAlgorithm: soap:RSA_ECB,
                signatureKey: clientPrivateKey,
                encryptionKey: serverPublicKey,
        },
        outboundSecurity: {
                verificationKey: serverPublicKey,
                signatureAlgorithm: soap:RSA_SHA256,
                decryptionKey: clientPrivateKey,
                decryptionAlgorithm: soap:RSA_ECB
        }
    });
    xml envelope = xml `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
                            soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                            <soap:Body>
                            <quer:Add xmlns:quer="http://tempuri.org/">
                                <quer:intA>2</quer:intA>
                                <quer:intB>3</quer:intB>
                            </quer:Add>
                            </soap:Body>
                        </soap:Envelope>`;
    xml response = check soapClient->sendReceive(envelope, "http://tempuri.org/Add");
}
```
