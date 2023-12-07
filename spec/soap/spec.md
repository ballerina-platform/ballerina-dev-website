# Specification: Ballerina Soap Library

_Owners_: @shafreenAnfar @MadhukaHarith92  
_Reviewers_: @shafreenAnfar  
_Created_: 2023/06/07  
_Updated_: 2023/08/14  
_Edition_: Swan Lake

## Introduction
This is the specification for the Soap standard library of [Ballerina language](https://ballerina.io/), which provides APIs to send an ordinary XML request to a SOAP backend by specifying the necessary details to construct a SOAP envelope.

The Soap library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Components](#2-components)
   * 2.1 [Client](#21-client)
       * 2.1.1 [Initializing the Client](#211-initializing-the-client)
       * 2.1.2 [SendReceive](#211-sendreceive)
       * 2.1.3 [SendOnly](#213-sendonly)
3. [Supported SOAP Versions](#3-supported-soap-versions)

## 1. Overview
This specification elaborates on the functions available in the Soap library.

The soap module abstracts out the details of the creation of a SOAP envelope, headers, and the body in a SOAP message.

## 2. Components
This section describes the components of the Ballerina SOAP package. To use the Ballerina SOAP package, a user must import the Ballerina SOAP package first.
```ballerina
import ballerina/soap;
```

### 2.1 Client

The SOAP client can be used to connect to a SOAP service and retrieve data. 

#### 2.1.1 Initializing the Client

The `soap:Client` `init` method requires a valid URL and optional configuration to initialize the client.

#### 2.1.2 SendReceive

The `sendReceive` function sends SOAP request and expects a response.

```ballerina
import ballerina/io;
import ballerina/soap;
import ballerina/mime;
  
public function main () returns error? {

    soap:Client soapClient = check new("http://ws.cdyne.com/phoneverify/phoneverify.asmx?wsdl");

    xml body = xml `<quer:CheckPhoneNumber xmlns:quer="http://ws.cdyne.com/PhoneVerify/query"> 
         <quer:PhoneNumber>18006785432</quer:PhoneNumber>
         <quer:LicenseKey>0</quer:LicenseKey>
      </quer:CheckPhoneNumber>`;

    xml|mime:Entity[] response = check soapClient->sendReceive(body);
    io:println(response);
}
```

#### 2.1.3 SendOnly

The `sendOnly` function fires and forgets requests. It sends the request without the possibility of any response from the service (even an error).

```ballerina
import ballerina/io;
import ballerina/soap;
import ballerina/mime;
  
public function main () returns error? {

    soap:Client soapClient = check new("http://ws.cdyne.com/phoneverify/phoneverify.asmx?wsdl");

    xml body = xml `<quer:CheckPhoneNumber xmlns:quer="http://ws.cdyne.com/PhoneVerify/query"> 
         <quer:PhoneNumber>18006785432</quer:PhoneNumber>
         <quer:LicenseKey>0</quer:LicenseKey>
      </quer:CheckPhoneNumber>`;

    check soapClient->sendOnly(body);
}
```

## 3. Supported SOAP Versions

The soap module supports SOAP 1.1 and 1.2 versions. By default, the soap client is configured to work with SOAP 1.1. Users can overwrite this to support SOAP 1.2 by passing `soapVersion`
parameter during client initialization.

```ballerina
import ballerina/soap;
  
public function main () returns error? {

    soap:Client soapClient = check new("http://ws.cdyne.com/phoneverify/phoneverify.asmx?wsdl", soapVersion = SOAP12);
}
```
