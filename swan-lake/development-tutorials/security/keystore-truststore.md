---
layout: ballerina-left-nav-pages-swanlake
title: Keystores and truststores
description: Create, configure, and manage keystores and truststores for TLS, mutual TLS, and secure connections in Ballerina services.
keywords: ballerina, programming language, security, keystore, truststore, TLS, mutual TLS, mTLS, secureSocket, PKCS12
permalink: /learn/keystore-truststore/
active: keystore-truststore
intro: Keystores and truststores are foundational to securing communication in production deployments. This guide explains what each is, how to create them, and how to configure them in Ballerina services and clients.
---

| Concept | What it stores | Primary use |
|---------|---------------|-------------|
| **Keystore** | Private key + the service's own certificate | Proves the identity of your service to clients |
| **Truststore** | Trusted CA or peer certificates (public certs only) | Decides which remote parties your service trusts |

## Prerequisites

The examples below use the **Java `keytool`** utility, which is bundled with every JDK. Verify it is available:

```
$ keytool -version
```

For production deployments you will also need access to a **Certificate Authority (CA)** or a **PKCS12 certificate bundle** (`.p12`) already issued by your CA.

## Create a keystore

A keystore stores your service's private key and its certificate. Use the following steps to create a new keystore.

### Step 1 — Generate a new key pair and self-signed certificate

Use a self-signed certificate during development and testing only. **Always replace it with a CA-signed certificate in production.**

```
$ keytool -genkeypair \
  -alias integration \
  -keyalg RSA \
  -keysize 2048 \
  -sigalg SHA256withRSA \
  -validity 365 \
  -keystore keystore.p12 \
  -storetype PKCS12 \
  -storepass <keystore-password> \
  -keypass <keystore-password> \
  -dname "CN=integration.example.com, OU=Engineering, O=Example Inc, L=Colombo, ST=Western, C=LK"
```

| Flag | Description |
|------|-------------|
| `-alias` | Logical name for this key entry inside the keystore |
| `-keyalg RSA -keysize 2048` | RSA 2048-bit key (use 4096 for higher security requirements) |
| `-sigalg SHA256withRSA` | Signature algorithm; SHA256withRSA is the minimum recommended |
| `-validity 365` | Certificate validity in days |
| `-storetype PKCS12` | The keystore type |
| `-storepass` | Password to protect the keystore file |
| `-dname` | Distinguished name embedded in the certificate |

### Step 2 — Generate a Certificate Signing Request (CSR)

This step is required for production environments. Skip it if you are using a self-signed certificate.

```
$ keytool -certreq \
  -alias integration \
  -keystore keystore.p12 \
  -storetype PKCS12 \
  -storepass <keystore-password> \
  -file integration.csr
```

Submit `integration.csr` to your CA. The CA returns a signed certificate file (e.g., `integration.crt`) together with any intermediate CA certificates.

### Step 3 — Import the CA-signed certificate into the keystore

Skip this step if you are using a self-signed certificate. Otherwise, import the CA certificate chain (root and any intermediates) so that `keytool` can verify the chain of trust.

```
# Import the root CA certificate
$ keytool -importcert \
  -alias rootCA \
  -file rootCA.crt \
  -keystore keystore.p12 \
  -storetype PKCS12 \
  -storepass <keystore-password> \
  -noprompt

# Import an intermediate CA certificate (if present)
$ keytool -importcert \
  -alias intermediateCA \
  -file intermediateCA.crt \
  -keystore keystore.p12 \
  -storetype PKCS12 \
  -storepass <keystore-password> \
  -noprompt
```

Then import the signed service certificate under the same alias used when generating the key pair:

```
$ keytool -importcert \
  -alias integration \
  -file integration.crt \
  -keystore keystore.p12 \
  -storetype PKCS12 \
  -storepass <keystore-password>
```

### Verify the keystore

```
$ keytool -list -keystore keystore.p12 -storetype PKCS12 -storepass <keystore-password> -v
```

The output lists all entries. Confirm the `integration` entry shows type **PrivateKeyEntry** and that the certificate chain is complete.

## Create a truststore

A truststore holds the public certificates of CAs (or specific peers) that your service should trust. How you populate it depends on whether you are using CA-signed or self-signed certificates.

### CA-signed certificates

Import the root CA certificate (and any intermediates) from your CA into the truststore. You do not need to import individual service certificates — any certificate signed by a trusted CA is automatically trusted.

```
$ keytool -importcert \
  -alias rootCA \
  -file rootCA.crt \
  -keystore truststore.p12 \
  -storetype PKCS12 \
  -storepass <truststore-password> \
  -noprompt
```

Repeat the command for each intermediate CA certificate if your chain includes them. Use a distinct `-alias` for each entry.

### Self-signed certificates

With self-signed certificates, there is no CA, so you must import each peer's certificate individually.

First, export the certificate from the peer's keystore:

```
$ keytool -exportcert \
  -alias integration \
  -keystore keystore.p12 \
  -storetype PKCS12 \
  -storepass <keystore-password> \
  -file integration.crt \
  -rfc
```

Then import the exported certificate into your truststore:

```
$ keytool -importcert \
  -alias integration \
  -file integration.crt \
  -keystore truststore.p12 \
  -storetype PKCS12 \
  -storepass <truststore-password> \
  -noprompt
```

Repeat this for every peer that uses a self-signed certificate, using a unique `-alias` each time.

### Verify the truststore

```
$ keytool -list -keystore truststore.p12 -storetype PKCS12 -storepass <truststore-password>
```

## Configure Ballerina services

The examples below show how to use the keystore and truststore files in Ballerina services.

### HTTP client with TLS

One-way TLS authenticates the **server** to the client. The client only needs a truststore containing the CA that signed the server's certificate.

```ballerina
import ballerina/http;

configurable string truststorePath = ?;
configurable string truststorePassword = ?;

http:Client secureClient = check new ("https://api.example.com", {
    secureSocket: {
        cert: {
            path: truststorePath,
            password: truststorePassword
        }
    }
});
```

### Mutual TLS (mTLS) for HTTP

Mutual TLS requires both sides to authenticate. The server presents its certificate (from its keystore) and validates the client certificate against its truststore, and the client does the same in reverse.

#### HTTP listener — server side

```ballerina
import ballerina/http;

configurable string keystorePath = ?;
configurable string keystorePassword = ?;
configurable string truststorePath = ?;
configurable string truststorePassword = ?;

listener http:Listener secureListener = new (9443, {
    secureSocket: {
        key: {
            path: keystorePath,
            password: keystorePassword
        },
        mutualSsl: {
            verifyClient: http:REQUIRE,
            cert: {
                path: truststorePath,
                password: truststorePassword
            }
        }
    }
});
```

#### HTTP client — client side

```ballerina
import ballerina/http;

configurable string keystorePath = ?;
configurable string keystorePassword = ?;
configurable string truststorePath = ?;
configurable string truststorePassword = ?;

http:Client mtlsClient = check new ("https://api.example.com", {
    secureSocket: {
        key: {
            path: keystorePath,
            password: keystorePassword
        },
        cert: {
            path: truststorePath,
            password: truststorePassword
        }
    }
});
```

#### gRPC with mutual TLS

gRPC uses the same `secureSocket` structure. The example below shows a secured gRPC listener with mutual TLS enabled.

```ballerina
import ballerina/grpc;

configurable string keystorePath = ?;
configurable string keystorePassword = ?;
configurable string truststorePath = ?;
configurable string truststorePassword = ?;

listener grpc:Listener secureGrpcListener = new (9090, {
    secureSocket: {
        key: {
            path: keystorePath,
            password: keystorePassword
        },
        mutualSsl: {
            verifyClient: grpc:REQUIRE,
            cert: {
                path: truststorePath,
                password: truststorePassword
            }
        }
    }
});
```

### Externalizing passwords

All keystore and truststore paths and passwords are declared as `configurable` variables in the examples above. Never hardcode them in source code.

**Environment variables:**

Ballerina maps `BAL_CONFIG_VAR_<name>` environment variables to `configurable` variables at runtime. Use this for secrets so they are never written to disk:

```
$ export BAL_CONFIG_VAR_keystorePassword="<keystore-password>"
$ export BAL_CONFIG_VAR_truststorePassword="<truststore-password>"
```

**Config.toml:**

```toml
keystorePath = "/opt/ballerina/security/keystore.p12"
truststorePath = "/opt/ballerina/security/truststore.p12"
```

## References

- [Ballerina HTTP Module — SSL/TLS](https://lib.ballerina.io/ballerina/http/latest)
- [Ballerina gRPC Module — Secured Communication](https://lib.ballerina.io/ballerina/grpc/latest)
- [Ballerina Crypto Module](https://central.ballerina.io/ballerina/crypto/latest)
- [Java keytool documentation](https://docs.oracle.com/en/java/javase/17/docs/specs/man/keytool.html)
