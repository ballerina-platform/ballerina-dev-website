# Specification: Ballerina Crypto Library

_Owners_: @shafreenAnfar @bhashinee  
_Reviewers_: @shafreenAnfar  
_Created_: 2022/08/23  
_Updated_: 2025/01/20  
_Edition_: Swan Lake

## Introduction

This is the specification for the Crypto standard library of [Ballerina language](https://ballerina.io/), which provides Crypto functionalities.

The Crypto library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Hash](#2-hash)
    - 2.1. [MD5](#21-md5)
    - 2.2. [SHA1](#22-sha1)
    - 2.3. [SHA256](#23-sha256)
    - 2.4. [SHA384](#24-sha384)
    - 2.5. [SHA512](#25-sha512)
    - 2.6. [CRC32B](#26-crc32b)
    - 2.7. [KECCAK256](#27-keccak256)
3. [HMAC](#3-hmac)
    - 3.1. [MD5](#31-md5)
    - 3.2. [SHA1](#32-sha1)
    - 3.3. [SHA256](#33-sha256)
    - 3.4. [SHA384](#34-sha384)
    - 3.5. [SHA512](#35-sha512)
4. [Decode private/public key](#4-decode-privatepublic-key)
    - 4.1. [Decode RSA Private key from PKCS12 file](#41-decode-rsa-private-key-from-pkcs12-file)
    - 4.2. [Decode RSA Private key using Private key and Password](#42-decode-rsa-private-key-using-private-key-and-password)
    - 4.3. [Decode RSA Private key using Private key content and Password](#43-decode-rsa-private-key-using-private-key-content-and-password)
    - 4.4. [Decode RSA Public key from PKCS12 file](#44-decode-rsa-public-key-from-pkcs12-file)
    - 4.5. [Decode RSA Public key from the certificate file](#45-decode-rsa-public-key-from-the-certificate-file)
    - 4.6. [Decode RSA Public key from the certificate content](#46-decode-rsa-public-key-from-the-certificate-content)
    - 4.7. [Decode EC Private key from PKCS12 file](#47-decode-ec-private-key-from-pkcs12-file)
    - 4.8. [Decode EC Private key using Private key and Password](#48-decode-ec-private-key-using-private-key-and-password)
    - 4.9. [Decode EC Public key from PKCS12 file](#49-decode-ec-public-key-from-pkcs12-file)
    - 4.10. [Decode EC Public key from the certificate file](#410-decode-ec-public-key-from-the-certificate-file)
    - 4.11. [Build RSA Public key from modulus and exponent parameters](#411-build-rsa-public-key-from-modulus-and-exponent-parameters)
    - 4.12. [Decode ML-DSA-65 Private key from PKCS12 file](#412-decode-ml-dsa-65-private-key-from-pkcs12-file)
    - 4.13. [Decode ML-DSA-65 Private key using Private key and Password](#413-decode-ml-dsa-65-private-key-using-private-key-and-password)
    - 4.14. [Decode ML-DSA-65 Public key from PKCS12 file](#414-decode-ml-dsa-65-public-key-from-pkcs12-file)
    - 4.15. [Decode ML-DSA-65 Public key from the certificate file](#415-decode-ml-dsa-65-public-key-from-the-certificate-file)
    - 4.16. [Decode ML-KEM-768 Private key from PKCS12 file](#416-decode-ml-kem-768-private-key-from-pkcs12-file)
    - 4.17. [Decode ML-KEM-768 Private key using Private key and Password](#417-decode-ml-kem-768-private-key-using-private-key-and-password)
    - 4.18. [Decode ML-KEM-768 Public key from PKCS12 file](#418-decode-ml-kem-768-public-key-from-pkcs12-file)
    - 4.19. [Decode ML-KEM-768 Public key from the certificate file](#419-decode-ml-kem-768-public-key-from-the-certificate-file)
5. [Encrypt-Decrypt](#5-encrypt-decrypt)
    - 5.1. [Encryption](#51-encryption)
        - 5.1.1. [RSA](#511-rsa)
        - 5.1.2. [AES-CBC](#512-aes-cbc)
        - 5.1.3. [AES-ECB](#513-aes-ecb)
        - 5.1.4. [AES-GCM](#514-aes-gcm)
        - 5.1.5. [PGP](#515-pgp)
    - 5.2. [Decryption](#52-decryption)
        - 5.2.1. [RSA-ECB](#521-rsa-ecb)
        - 5.2.2. [AES-CBC](#522-aes-cbc)
        - 5.2.3. [AES-ECB](#523-aes-ecb)
        - 5.2.4. [AES-GCM](#524-aes-gcm)
        - 5.2.5. [PGP](#525-pgp)
6. [Sign and Verify](#6-sign-and-verify)
    - 6.1. [Sign messages](#61-sign-messages)
        - 6.1.1. [RSA-MD5](#611-rsa-md5)
        - 6.1.2. [RSA-SHA1](#612-rsa-sha1)
        - 6.1.3. [RSA-SHA256](#613-rsa-sha256)
        - 6.1.4. [RSA-SHA384](#614-rsa-sha384)
        - 6.1.5. [RSA-SHA512](#615-rsa-sha512)
        - 6.1.6. [RSASSA-PSS-SHA256](#616-rsassa-pss-sha256)
        - 6.1.7. [SHA384withECDSA](#617-sha384withecdsa)
        - 6.1.8. [SHA256withECDSA](#618-sha256withecdsa)
        - 6.1.9. [ML-DSA-65](#619-mldsa65)
    - 6.2. [Verify signature](#62-verify-signature)
        - 6.2.1. [RSA-MD5](#621-rsa-md5)
        - 6.2.2. [RSA-SHA1](#622-rsa-sha1)
        - 6.2.3. [RSA-SHA256](#623-rsa-sha256)
        - 6.2.4. [RSA-SHA384](#624-rsa-sha384)
        - 6.2.5. [RSA-SHA512](#625-rsa-sha512)
        - 6.2.6. [RSASSA-PSS-SHA256](#626-rsassa-pss-sha256)
        - 6.2.7. [SHA384withECDSA](#627-sha384withecdsa)
        - 6.2.8. [SHA256withECDSA](#628-sha256withecdsa)
        - 6.2.9. [ML-DSA-65](#629-mldsa65)
7. [Key Derivation Function (KDF)](#7-key-derivation-function-kdf)
    - 7.1. [HKDF-SHA256](#71-hkdf-sha256)
8. [Key Exchange Mechanism (KEM)](#8-key-exchange-mechanism-kem)
    - 8.1 [Encapsulation](#81-encapsulation)
        - 8.1.1 [RSA-KEM](#811-rsa-kem)
        - 8.1.2 [ML-KEM-768](#812-ml-kem-768)
        - 8.1.3 [RSA-KEM-ML-KEM-768](#813-rsa-kem-ml-kem-768)
    - 8.2 [Decapsulation](#81-encapsulation)
        - 8.2.1 [RSA-KEM](#821-rsa-kem)
        - 8.2.2 [ML-KEM-768](#822-ml-kem-768)
        - 8.2.3 [RSA-KEM-ML-KEM-768](#823-rsa-kem-ml-kem-768)
9. [Hybrid Public Key Encryption (HPKE)](#9-hybrid-public-key-encryption-hpke)
    - 9.1 [Encrypt](#91-encrypt)
        - 9.1.1 [ML-KEM-768-HPKE](#911-ml-kem-768-hpke)
        - 9.1.2 [RSA-KEM-ML-KEM-768-HPKE](#912-rsa-kem-ml-kem-768-hpke)
    - 9.2 [Decrypt](#92-decrypt)
        - 9.2.1 [ML-KEM-768-HPKE](#921-ml-kem-768-hpke)
        - 9.2.2 [RSA-KEM-ML-KEM-768-HPKE](#922-rsa-kem-ml-kem-768-hpke)
10. [Password hashing](#10-password-hashing)
    - 10.1 [BCrypt](#101-bcrypt)
    - 10.2 [Argon2](#102-argon2)
    - 10.3 [PBKDF2](#103-pbkdf2)
11. [Static Code Rules](#11-static-code-rules)
    - 11.1 [Avoid using insecure cipher modes or padding schemes](#111-avoid-using-insecure-cipher-modes-or-padding-schemes)
    - 11.2 [Avoid using fast hashing algorithms](#112-avoid-using-fast-hashing-algorithms)
    - 11.3 [Avoid reusing counter mode initialization vectors](#113-avoid-reusing-counter-mode-initialization-vectors)

## 1. Overview

The Ballerina `crypto` library facilitates APIs to do operations like hashing, HMAC generation, checksum generation, encryption, decryption, signing data digitally, verifying digitally signed data, etc., with different cryptographic algorithms.

## 2. Hash

The `crypto` library supports generating hashes with 5 different hash algorithms MD5, SHA1, SHA256, SHA384, and SHA512. Also, it supports generating the CRC32B checksum.

### 2.1. MD5

This API can be used to create the MD5 hash of the given data.

```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashMd5(data);
```

### 2.2. SHA1

This API can be used to create the SHA-1 hash of the given data.

```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashSha1(data);
```

### 2.3. SHA256

This API can be used to create the SHA-256 hash of the given data.

```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashSha256(data);
```

### 2.4. SHA384

This API can be used to create the SHA-384 hash of the given data.

```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashSha384(data);
```

### 2.5. SHA512

This API can be used to create the SHA-512 hash of the given data.

```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashSha512(data);
```

### 2.6. CRC32B

This API can be used to create the Hex-encoded CRC32B value of the given data.

```ballerina
string stringData = "Hello Ballerina";
byte[] data = stringData.toBytes();
string checksum = crypto:crc32b(data);
```

### 2.7. KECCAK256

This API can be used to create the Hex-encoded KECCAK-256 value of the given data.

```ballerina
string stringData = "Hello Ballerina";
byte[] data = stringData.toBytes();
string checksum = crypto:hashKeccak256(data);
```

## 3. HMAC

The `crypto` library supports generating HMAC with 5 different hash algorithms: MD5, SHA1, SHA256, SHA384, and SHA512.

### 3.1. MD5

This API can be used to create HMAC using the MD5 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = check crypto:hmacMd5(data, key);
```

### 3.2. SHA1

This API can be used to create HMAC using the SHA-1 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = crypto:hmacSha1(data, key);
```

### 3.3. SHA256

This API can be used to create HMAC using the SHA-256 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = check crypto:hmacSha256(data, key);
```

### 3.4. SHA384

This API can be used to create HMAC using the SHA-384 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = check crypto:hmacSha384(data, key);
```

### 3.5. SHA512

This API can be used to create HMAC using the SHA-512 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = check crypto:hmacSha512(data, key);
```

## 4. Decode private/public key

The `crypto` library supports decoding the RSA private key from a `.p12` file and a key file in the `PEM` format. Also, it supports decoding a public key from a `.p12` file and a certificate file in the `X509` format. Additionally, this supports building an RSA public key with the modulus and exponent parameters.

### 4.1. Decode RSA Private key from PKCS12 file

This API can be used to decode the RSA private key from the given PKCS#12 file.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
```

### 4.2. Decode RSA Private key using Private key and Password

This API can be used to decode the RSA private key from the given private key and private key password.

```ballerina
string keyFile = "/path/to/private.key";
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyFile(keyFile, "keyPassword");
```

## 4.3. Decode RSA Private key using Private key content and Password

This API can be used to decode the RSA public key from the given public certificate content as a byte array.

```ballerina
byte[] keyContent = [45,45,45,45,45,66,69,71,73,78,...];
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromContent(keyContent);
```

### 4.4. Decode RSA Public key from PKCS12 file

This API can be used to decode the RSA public key from the given PKCS#12 archive file.

```ballerina
crypto:TrustStore trustStore = {
    path: "/path/tp/truststore.p12",
    password: "truststorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(trustStore, "keyAlias");
```

### 4.5. Decode RSA Public key from the certificate file

This API can be used to decode the RSA public key from the given public certificate file.

```ballerina
string certFile = "/path/to/public.cert";
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromCertFile(certFile);
```

### 4.6. Decode RSA Public key from the certificate content

This API can be used to decode the RSA public key from the given public certificate content as a byte array.

```ballerina
byte[] certFileContent = [45,45,45,45,45,66,69,71,73,78,...];
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromContent(certFileContent);
```

### 4.7. Decode EC Private key from PKCS12 file

This API can be used to decode the EC private key from the given PKCS#12 file.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeEcPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
```

### 4.8. Decode EC Private key using Private key and Password

This API can be used to decode the EC private key from the given private key and private key password.

```ballerina
string keyFile = "/path/to/private.key";
crypto:PrivateKey privateKey = check crypto:decodeEcPrivateKeyFromKeyFile(keyFile, "keyPassword");
```

### 4.9. Decode EC Public key from PKCS12 file

This API can be used to decode the RSA public key from the given PKCS#12 archive file.

```ballerina
crypto:TrustStore trustStore = {
    path: "/path/tp/truststore.p12",
    password: "truststorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeEcPublicKeyFromTrustStore(trustStore, "keyAlias");
```

### 4.10. Decode EC Public key from the certificate file

This API can be used to decode the EC public key from the given public certificate file.

```ballerina
string certFile = "/path/to/public.cert";
crypto:PublicKey publicKey = check crypto:decodeEcPublicKeyFromCertFile(certFile);
```

### 4.11. Build RSA Public key from modulus and exponent parameters

This API can be used to build the RSA public key from the given modulus and exponent parameters.

```ballerina
string modulus = "luZFdW1ynitztkWLC6xKegbRWxky-5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9-" +
        "PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0-s6kMl2EhB-rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsy" +
        "L4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z_73OOVhkh_mvTmWZLM7GM6sApmyLX6OXUp8z0pkY-v" +
        "T_9-zRxxQs7GurC4_C1nK3rI_0ySUgGEafO1atNjYmlFN-M3tZX6nEcA6g94IavyQ";
string exponent = "AQAB";
crypto:PublicKey publicKey = check crypto:buildRsaPublicKey(modulus, exponent);
```

### 4.12. Decode ML-DSA-65 Private key from PKCS12 file

This API can be used to decode the ML-DSA-65 private key from the given PKCS#12 file.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password
};
crypto:PrivateKey privateKey = check crypto:decodeMlDsa65PrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
```

### 4.13. Decode ML-DSA-65 Private key using Private key and Password

This API can be used to decode the ML-DSA-65 private key from the given private key and private key password.

```ballerina
string keyFile = "/path/to/private.key";
crypto:PrivateKey privateKey = check crypto:decodeMlDsa65PrivateKeyFromKeyFile(keyFile, "keyPassword");
```

### 4.14. Decode ML-DSA-65 Public key from PKCS12 file

This API can be used to decode the ML-DSA-65 public key from the given PKCS#12 archive file.

```ballerina
crypto:TrustStore trustStore = {
    path: "/path/tp/truststore.p12",
    password: "truststorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeMlDsa65PublicKeyFromTrustStore(trustStore, "keyAlias");
```

### 4.15. Decode ML-DSA-65 Public key from the certificate file

This API can be used to decode the ML-DSA-65 public key from the given public certificate file.

```ballerina
string certFile = "/path/to/public.cert";
crypto:PublicKey publicKey = check crypto:decodeMlDsa65PublicKeyFromCertFile(certFile);
```

### 4.16. Decode ML-KEM-768 Private key from PKCS12 file

This API can be used to decode the ML-KEM-768 private key from the given PKCS#12 file.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password
};
crypto:PrivateKey privateKey = check crypto:decodeMlKem768PrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
```

### 4.17. Decode ML-KEM-768 Private key using Private key and Password

This API can be used to decode the ML-KEM-768 private key from the given private key and private key password.

```ballerina
string keyFile = "/path/to/private.key";
crypto:PrivateKey privateKey = check crypto:decodeMlKem768PrivateKeyFromKeyFile(keyFile, "keyPassword");
```

### 4.18. Decode ML-KEM-768 Public key from PKCS12 file

This API can be used to decode the ML-KEM-768 public key from the given PKCS#12 archive file.

```ballerina
crypto:TrustStore trustStore = {
    path: "/path/tp/truststore.p12",
    password: "truststorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(trustStore, "keyAlias");
```

### 4.19. Decode ML-KEM-768 Public key from the certificate file

This API can be used to decode the ML-KEM-768 public key from the given public certificate file.

```ballerina
string certFile = "/path/to/public.cert";
crypto:PublicKey publicKey = check crypto:decodeMlKem768PublicKeyFromCertFile(certFile);
```

## 5. Encrypt-Decrypt

The `crypto` library supports both symmetric key encryption/decryption and asymmetric key encryption/decryption. The RSA algorithm can be used for asymmetric-key encryption/decryption with the use of private and public keys. The AES algorithm can be used for symmetric-key encryption/decryption with the use of a shared key.

### 5.1. Encryption

#### 5.1.1. RSA

This API can be used to create the RSA-encrypted value of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
byte[] cipherText = check crypto:encryptRsaEcb(data, publicKey);
```

#### 5.1.2. AES-CBC

This API can be used to create the AES-CBC-encrypted value for the given data.

```ballerina
string dataString = "Hello Ballerina!";
byte[] data = dataString.toBytes();
byte[16] key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    key[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[16] initialVector = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    initialVector[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[] cipherText = check crypto:encryptAesCbc(data, key, initialVector);
```

#### 5.1.3. AES-ECB

This API can be used to create the AES-ECB-encrypted value for the given data.

```ballerina
string dataString = "Hello Ballerina!";
byte[] data = dataString.toBytes();
byte[16] key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    key[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[] cipherText = check crypto:encryptAesEcb(data, key);
```

#### 5.1.4. AES-GCM

This API can be used to create the AES-GCM-encrypted value for the given data.

```ballerina
string dataString = "Hello Ballerina!";
byte[] data = dataString.toBytes();
byte[16] key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    key[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[16] initialVector = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    initialVector[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[] cipherText = check crypto:encryptAesGcm(data, key, initialVector);
```

#### 5.1.5. PGP

This API can be used to create the PGP-encrypted value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string publicKeyPath = "/path/to/publickey.asc";

byte[] cipherText = check crypto:encryptPgp(data, publicKeyPath);
```

The following encryption options can be configured in the PGP encryption.

| Option                | Description                                                       | Default Value |
|-----------------------|-------------------------------------------------------------------|---------------|
| compressionAlgorithm  | Specifies the compression algorithm used for PGP encryption       | ZIP           |
| symmetricKeyAlgorithm | Specifies the symmetric key algorithm used for encryption         | AES_256       |
| armor                 | Indicates whether ASCII armor is enabled for the encrypted output | true          |
| withIntegrityCheck    | Indicates whether integrity check is included in the encryption   | true          |

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string publicKeyPath = "/path/to/publickey.asc";

byte[] cipherText = check crypto:encryptPgp(data, publicKeyPath, armor = false);
```

In addition to the above, the following API can be used to read a content from a stream, encrypt it using the PGP public
key and return an encrypted stream

```ballerina
stream<byte[], error?> inputStream = check io:fileReadBlocksAsStream("input.txt");
stream<byte[], crypto:Error?>|crypto:Error encryptedStream = crypto:encryptStreamAsPgp(inputStream, "public_key.asc");
```

### 5.2. Decryption

#### 5.2.1. RSA-ECB

This API can be used to create the RSA-decrypted value for the given RSA-encrypted data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] cipherText = check crypto:encryptRsaEcb(data, publicKey);
byte[] plainText = check crypto:decryptRsaEcb(cipherText, privateKey);
```

#### 5.2.2. AES-CBC

This API can be used to create the AES-CBC-decrypted value for the given AES-CBC-encrypted data.

```ballerina
string dataString = "Hello Ballerina!";
byte[] data = dataString.toBytes();
byte[16] key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    key[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[16] initialVector = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    initialVector[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[] cipherText = check crypto:encryptAesCbc(data, key, initialVector);
byte[] plainText = check crypto:decryptAesCbc(cipherText, key, initialVector);
```

#### 5.2.3. AES-ECB

This API can be used to create the AES-ECB-decrypted value for the given AES-ECB-encrypted data.

```ballerina
string dataString = "Hello Ballerina!";
byte[] data = dataString.toBytes();
byte[16] key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    key[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[] cipherText = check crypto:encryptAesEcb(data, key);
byte[] plainText = check crypto:decryptAesEcb(cipherText, key);
```

#### 5.2.4. AES-GCM

This API can be used to create the AES-GCM-decrypted value for the given AES-GCM-encrypted data.

```ballerina
string dataString = "Hello Ballerina!";
byte[] data = dataString.toBytes();
byte[16] key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    key[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[16] initialVector = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
foreach int i in 0...15 {
    initialVector[i] = <byte>(check random:createIntInRange(0, 255));
}
byte[] cipherText = check crypto:encryptAesGcm(data, key, initialVector);
byte[] plainText = check crypto:decryptAesGcm(cipherText, key, initialVector);
```

#### 5.2.5. PGP

This API can be used to create the PGP-decrypted value for the given PGP-encrypted data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string publicKeyPath = "/path/to/publickey.asc";
string privateKeyPath = "/path/to/privatekey.asc";
string passPhrase = "passphrase";

byte[] cipherText = check crypto:encryptPgp(data, publicKeyPath);
byte[] plainText = check crypto:decryptPgp(cipherText, privateKeyPath, passPhrase.toBytes());
```

In addition to the above, the following API can be used to read an encrypted content from a stream, decrypt it using the
PGP private key and passphrase and return a decrypted stream.

```ballerina
stream<byte[], error?> inputStream = check io:fileReadBlocksAsStream("pgb_encrypted.txt");
stream<byte[], crypto:Error?>|crypto:Error decryptedStream = crypto:decryptStreamFromPgp(inputStream, "private_key.asc", passphrase);
```

## 6. Sign and Verify

The `crypto` library supports signing data using the RSA private key and verification of the signature using the RSA public key. This supports MD5, SHA1, SHA256, SHA384, and SHA512 digesting algorithms, and ML-DSA-65 post-quantum signature algorithm as well.

### 6.1. Sign messages

#### 6.1.1. RSA-MD5

This API can be used to create the RSA-MD5 based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaMd5(data, privateKey);
```

#### 6.1.2. RSA-SHA1

This API can be used to create the RSA-SHA1 based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSha1(data, privateKey);
```

#### 6.1.3. RSA-SHA256

This API can be used to create the RSA-SHA256 based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSha256(data, privateKey);
```

#### 6.1.4. RSA-SHA384

This API can be used to create the RSA-SHA384 based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSha384(data, privateKey);
```

#### 6.1.5. RSA-SHA512

This API can be used to create the RSA-SHA512 based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSha512(data, privateKey);
```

#### 6.1.6. RSASSA-PSS-SHA256

This API can be used to create the RSASSA-PSS based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSsaPss256(data, privateKey);
```

#### 6.1.7. SHA384withECDSA

This API can be used to create the SHA384withECDSA based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeEcPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signSha384withEcdsa(data, privateKey);
```

#### 6.1.8. SHA256withECDSA

This API can be used to create the SHA256withECDSA based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeEcPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signSha256withEcdsa(data, privateKey);
```

#### 6.1.9. ML-DSA-65

This API can be used to create the ML-DSA-65 based signature value for the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeMlDsa65PrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signMlDsa65(data, privateKey);
```

### 6.2. Verify signature

#### 6.2.1. RSA-MD5

This API can be used to verify the RSA-MD5 based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword")
byte[] signature = check crypto:signRsaMd5(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifyRsaMd5Signature(data, signature, publicKey);
```

#### 6.2.2. RSA-SHA1

This API can be used to verify the RSA-SHA1 based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSha1(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifyRsaSha1Signature(data, signature, publicKey);
```

#### 6.2.3. RSA-SHA256

This API can be used to verify the RSA-SHA256 based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSha256(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifyRsaSha256Signature(data, signature, publicKey);
```

#### 6.2.4. RSA-SHA384

This API can be used to verify the RSA-SHA384 based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSha384(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifyRsaSha384Signature(data, signature, publicKey);
```

#### 6.2.5. RSA-SHA512

This API can be used to verify the RSA-SHA512 based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSha512(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifyRsaSha512Signature(data, signature, publicKey);
```

#### 6.2.6. RSASSA-PSS-SHA256

This API can be used to verify the RSASSA-PSS based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signRsaSsaPss256(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifyRsaSsaPss256Signature(data, signature, publicKey);
```

#### 6.2.7. SHA384withECDSA

This API can be used to verify the SHA384withECDSA based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeEcPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signSha384withEcdsa(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeEcPublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifySha384withEcdsaSignature(data, signature, publicKey);
```

#### 6.2.8. SHA256withECDSA

This API can be used to verify the SHA256withECDSA based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeEcPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signSha256withEcdsa(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeEcPublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifySha256withEcdsaSignature(data, signature, publicKey);
```

#### 6.2.9. ML-DSA-65

This API can be used to verify the ML-DSA-65 based signature.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeMlDsa65PrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
byte[] signature = check crypto:signMlDsa65(data, privateKey);
crypto:PublicKey publicKey = check crypto:decodeMlDsa65PublicKeyFromTrustStore(keyStore, "keyAlias");
boolean validity = check crypto:verifyMlDsa65Signature(data, signature, publicKey);
```

## 7. Key Derivation Function (KDF)

The `crypto` module supports HMAC-based Key Derivation Function (HKDF). HKDF is a key derivation function that uses a Hash-based Message Authentication Code (HMAC) to derive keys.

### 7.1. HKDF-SHA256

This API can be used to create HKDF using the SHA256 hash function of the given data.

```ballerina
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hash = crypto:hkdfSha256(key, 32);
```

## 8. Key Exchange Mechanism (KEM)

The `crypto` module supports Key Exchange Mechanisms (KEM). It includes RSA-KEM and post-quantum ML-KEM-768 for both encapsulation and decapsulation.

### 8.1. Encapsulation

#### 8.1.1. RSA-KEM

This API can be used to create shared secret and its encapsulation using RSA-KEM function.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
crypto:EncapsulationResult encapsulationResult = check crypto:encapsulateRsaKem(publicKey);
```

#### 8.1.2. ML-KEM-768

This API can be used to create shared secret and its encapsulation using ML-KEM-768 function.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(keyStore, "keyAlias");
crypto:EncapsulationResult encapsulationResult = check crypto:encapsulateMlKem768(publicKey);
```

#### 8.1.3. RSA-KEM-ML-KEM-768

This API can be used to create shared secret and its encapsulation using RSA-KEM-ML-KEM-768 function.

```ballerina
crypto:KeyStore mlkemKeyStore = {
    path: "/path/to/mlkem/keyStore.p12",
    password: "keyStorePassword"
};
crypto:KeyStore rsaKeyStore = {
    path: "/path/to/rsa/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey mlkemPublicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(mlkemKeyStore, "keyAlias");
crypto:PublicKey rsaPublicKey = check crypto:decodeRsaPublicKeyFromTrustStore(rsaKeyStore, "keyAlias");
crypto:EncapsulationResult encapsulationResult = check crypto:encapsulateRsaKemMlKem768(rsaPublicKey, mlkemPublicKey);
byte[] encapsulatedSecret = encapsulationResult.encapsulatedSecret;
crypto:PrivateKey mlkemPrivateKey = check crypto:decodeMlKem768PrivateKeyFromKeyStore(mlkemKeyStore, "keyAlias", "keyStorePassword");
crypto:PrivateKey rsaPrivateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(rsaKeyStore, "keyAlias", "keyStorePassword");
byte[] sharedSecret = check crypto:decapsulateRsaKemMlKem768(encapsulatedSecret, rsaPrivateKey, mlkemPrivateKey);
```

### 8.2. Decapsulation

#### 8.2.1. RSA-KEM

This API can be used to decapsulate shared secret using RSA-KEM function of the given data.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(keyStore, "keyAlias");
crypto:EncapsulationResult encapsulationResult = check crypto:encapsulateRsaKem(publicKey);
byte[] encapsulatedSecret = encapsulationResult.encapsulatedSecret;
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyStorePassword");
byte[] sharedSecret = check crypto:decapsulateRsaKem(encapsulatedSecret, privateKey);
```

#### 8.2.2. ML-KEM-768

This API can be used to decapsulate shared secret using ML-KEM-768 function of the given data.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(keyStore, "keyAlias");
crypto:EncapsulationResult encapsulationResult = check crypto:encapsulateMlKem768(publicKey);
byte[] encapsulatedSecret = encapsulationResult.encapsulatedSecret;
crypto:PrivateKey privateKey = check crypto:decodeMlKem768PrivateKeyFromKeyStore(keyStore, "keyAlias", "keyStorePassword");
byte[] sharedSecret = check crypto:decapsulateMlKem768(encapsulatedSecret, privateKey);
```

#### 8.2.3. RSA-KEM-ML-KEM-768

This API can be used to decapsulate shared secret using RSA-KEM-ML-KEM-768 function of the given data.

```ballerina
crypto:KeyStore mlkemKeyStore = {
    path: "/path/to/mlkem/keyStore.p12",
    password: "keyStorePassword"
};
crypto:KeyStore rsaKeyStore = {
    path: "/path/to/rsa/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey mlkemPublicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(mlkemKeyStore, "keyAlias");
crypto:PublicKey rsaPublicKey = check crypto:decodeRsaPublicKeyFromTrustStore(rsaKeyStore, "keyAlias");
crypto:EncapsulationResult encapsulationResult = check crypto:encapsulateRsaKemMlKem768(rsaPublicKey, mlkemPublicKey);
byte[] encapsulatedSecret = encapsulationResult.encapsulatedSecret;
crypto:PrivateKey mlkemPrivateKey = check crypto:decodeMlKem768PrivateKeyFromKeyStore(mlkemKeyStore, "keyAlias", "keyStorePassword");
crypto:PrivateKey rsaPrivateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(rsaKeyStore, "keyAlias", "keyStorePassword");
byte[] sharedSecret = check crypto:decapsulateRsaKemMlKem768(encapsulatedSecret, rsaPrivateKey, mlkemPrivateKey);
```

## 9. Hybrid Public Key Encryption (HPKE)

The `crypto` module supports Hybrid Public Key Encryption (HPKE). It supports post-quantum ML-KEM-768-HPKE and RSA-KEM-ML-KEM-768-HPKE for encryption and decryption.

### 9.1. Encrypt

#### 9.1.1. ML-KEM-768-HPKE

This API can be used to create the ML-KEM-768-hybrid-encrypted value of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(keyStore, "keyAlias");
crypto:HybridEncryptionResult encryptionResult = check crypto:encryptMlKem768Hpke(data, publicKey);
```

#### 9.1.2. RSA-KEM-ML-KEM-768-HPKE

This API can be used to create the RSA-KEM-ML-KEM-768-hybrid-encrypted value of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore mlkemKeyStore = {
    path: "/path/to/mlkem/keyStore.p12",
    password: "keyStorePassword"
};
crypto:KeyStore rsaKeyStore = {
    path: "/path/to/rsa/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey mlkemPublicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(mlkemKeyStore, "keyAlias");
crypto:PublicKey rsaPublicKey = check crypto:decodeRsaPublicKeyFromTrustStore(rsaKeyStore, "keyAlias");
crypto:HybridEncryptionResult encryptionResult = check crypto:encryptRsaKemMlKem768Hpke(data, rsaPublicKey, mlkemPublicKey);
```

### 9.2. Decrypt

#### 9.2.1. ML-KEM-768-HPKE

This API can be used to create the ML-KEM-768-hybrid-decrypted value of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(keyStore, "keyAlias");
crypto:HybridEncryptionResult encryptionResult = check crypto:encryptMlKem768Hpke(data, publicKey);
byte[] cipherText = encryptionResult.cipherText;
byte[] encapsulatedKey = encryptionResult.encapsulatedSecret;
crypto:PrivateKey privateKey = check crypto:decodeMlKem768PrivateKeyFromKeyStore(keyStore, "keyAlias", "keyStorePassword");
byte[] decryptedData = check crypto:decryptMlKem768Hpke(cipherText, encapsulatedKey, privateKey);
```

#### 9.2.2. RSA-KEM-ML-KEM-768-HPKE

This API can be used to create the RSA-KEM-ML-KEM-768-hybrid-decrypted value of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
crypto:KeyStore mlkemKeyStore = {
    path: "/path/to/mlkem/keyStore.p12",
    password: "keyStorePassword"
};
crypto:KeyStore rsaKeyStore = {
    path: "/path/to/rsa/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PublicKey mlkemPublicKey = check crypto:decodeMlKem768PublicKeyFromTrustStore(mlkemKeyStore, "keyAlias");
crypto:PublicKey rsaPublicKey = check crypto:decodeRsaPublicKeyFromTrustStore(rsaKeyStore, "keyAlias");
crypto:HybridEncryptionResult encryptionResult = check crypto:encryptRsaKemMlKem768Hpke(data, rsaPublicKey, mlkemPublicKey);
byte[] cipherText = encryptionResult.cipherText;
byte[] encapsulatedKey = encryptionResult.encapsulatedSecret;
crypto:PrivateKey mlkemPrivateKey = check crypto:decodeMlKem768PrivateKeyFromKeyStore(mlkemKeyStore, "keyAlias", "keyStorePassword");
crypto:PrivateKey rsaPrivateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(rsaKeyStore, "keyAlias", "keyStorePassword");
byte[] decryptedData = check crypto:decryptRsaKemMlKem768Hpke(cipherText, encapsulatedKey, rsaPrivateKey, mlkemPrivateKey);
```

## 10. Password Hashing

The `crypto` module provides password hashing using BCrypt and Argon2id algorithms for secure password storage.

### 10.1 BCrypt

Implements the BCrypt password hashing algorithm based on the Blowfish cipher.

```ballerina
public isolated function hashBcrypt(string password, int workFactor = 12) returns string|Error
```

Parameters:

- `password`: The plain text password to hash
- `workFactor`: Computational complexity factor (4-31, default: 12)

```ballerina
public isolated function verifyBcrypt(string password, string hashedPassword) returns boolean|Error
```

Example:

```ballerina
string password = "your-password";
// Hash with default work factor (12)
string hashedPassword1 = check crypto:hashBcrypt(password);
// Hash with custom work factor
string hashedPassword2 = check crypto:hashBcrypt(password, 14);
boolean isValid = check crypto:verifyBcrypt(password, hashedPassword1);
```

### 10.2 Argon2

Implements the Argon2id variant of the Argon2 password hashing algorithm, optimized for both high memory usage and GPU resistance.

```ballerina
public isolated function hashArgon2(string password, int iterations = 3, 
    int memory = 65536, int parallelism = 4) returns string|Error
```

Parameters:

- `password`: The plain text password to hash
- `iterations`: Number of iterations (default: 3)
- `memory`: Memory usage in KB (minimum: 8192, default: 65536)
- `parallelism`: Degree of parallelism (default: 4)

Output hash length is fixed at 256 bits for optimal security and performance.

```ballerina
public isolated function verifyArgon2(string password, string hashedPassword) returns boolean|Error
```

Example:

```ballerina
string password = "your-password";
// Hash with default parameters
string hashedPassword1 = check crypto:hashArgon2(password);
// Hash with custom parameters
string hashedPassword2 = check crypto:hashArgon2(password, iterations = 4, memory = 131072, parallelism = 8);
boolean isValid = check crypto:verifyArgon2(password, hashedPassword1);
```

### 10.3 PBKDF2

Implements the PBKDF2 (Password-Based Key Derivation Function 2) algorithm for password hashing.

```ballerina
public enum HmacAlgorithm {
    SHA1,
    SHA256,
    SHA512
}
public isolated function hashPbkdf2(string password, int iterations = 10000,
    HmacAlgorithm algorithm = SHA256) returns string|Error
```

Parameters:

- `password`: The plain text password to hash
- `iterations`: Optional number of iterations (default: 10000)
- `algorithm`: Optional HMAC algorithm (SHA1, SHA256, SHA512). Default is SHA256

Example:

```ballerina
string password = "mySecurePassword123";
// Hash with default parameters
string hashedPassword = check crypto:hashPbkdf2(password);
// Hash with custom parameters
string customHashedPassword = check crypto:hashPbkdf2(password, iterations = 15000, algorithm = SHA512);
```

```ballerina
public isolated function verifyPbkdf2(string password, string hashedPassword) returns boolean|Error
```

Parameters:

- `password`: The plain text password to verify
- `hashedPassword`: PBKDF2 hashed password to verify against

Example:

```ballerina
string password = "mySecurePassword123";
string hashedPassword = "$pbkdf2-sha256$i=10000$salt$hash";
// Verify the hashed password
boolean isValid = check crypto:verifyPbkdf2(password, hashedPassword);
```

## 11. Static Code Rules

The following static code rules are applied to the Crypto module.

| Id                 | Kind          | Description                                                                                                       |
|--------------------|---------------|-------------------------------------------------------------------------------------------------------------------|
| ballerina/crypto:1 | VULNERABILITY | [Avoid using insecure cipher modes or padding schemes](#111-avoid-using-insecure-cipher-modes-or-padding-schemes) |
| ballerina/crypto:2 | VULNERABILITY | [Avoid using fast hashing algorithms](#112-avoid-using-fast-hashing-algorithms)                                   |
| ballerina/crypto:3 | VULNERABILITY | [Avoid reusing counter mode initialization vectors](#113-avoid-reusing-counter-mode-initialization-vectors)       |

### 11.1 Avoid using insecure cipher modes or padding schemes

Using weak or outdated encryption modes and padding schemes can compromise the security of encrypted data, even when strong algorithms are used.

## 11.1.1. Why this is an issue?

Encryption algorithms are essential for protecting sensitive information and ensuring secure communications. When implementing encryption, it's critical to select not only strong algorithms but also secure modes of operation and padding schemes. Using weak or outdated encryption modes can compromise the security of otherwise strong algorithms.

The security risks of using weak encryption modes include:

- Data confidentiality breaches where encrypted content becomes readable
- Modification of encrypted data without detection
- Pattern recognition in encrypted data that reveals information about the plaintext
- Replay attacks where valid encrypted data is reused maliciously
- Known-plaintext attacks that can reveal encryption keys

## 11.1.2. What is the potential impact?

Common vulnerable patterns include:

- Using ECB (Electronic Codebook) mode which doesn't hide data patterns
- Implementing CBC (Cipher Block Chaining) without integrity checks
- Using RSA encryption without proper padding schemes
- Relying on outdated padding methods like PKCS1v1.5
- Using stream ciphers with insufficient initialization vectors

## 11.1.3. How can I fix this?

Choose secure encryption modes and padding schemes that provide both confidentiality and integrity protection.

### 11.1.3.1 AES Encryption Example

**Non-compliant code :**

```ballerina
byte[] cipherText = check crypto:encryptAesEcb(data, key);
```

For AES, the weakest mode is ECB (Electronic Codebook). Repeated blocks of data are encrypted to the same value, making them easy to identify and reducing the difficulty of recovering the original cleartext.

```ballerina
byte[] cipherText = check crypto:encryptAesCbc(data, key, initialVector);
```

Unauthenticated modes such as CBC (Cipher Block Chaining) may be used but are prone to attacks that manipulate the ciphertext (like padding oracle attacks). They must be used with caution and additional integrity checks.

**Compliant code:**

```ballerina
byte[] cipherText = check crypto:encryptAesGcm(data, key, initialVector);
```

AES-GCM (Galois/Counter Mode) provides authenticated encryption, ensuring both confidentiality and integrity of the encrypted data.

### 11.1.3.2 RSA Encryption Example

**Non-compliant code :**

```ballerina
// Default padding is PKCS1
byte[] cipherText = check crypto:encryptRsaEcb(data, publicKey);

cipherText = check crypto:encryptRsaEcb(data, publicKey, crypto:PKCS1);
```

For RSA, avoid using PKCS1v1.5 padding as it is vulnerable to various attacks. Instead, use OAEP (Optimal Asymmetric Encryption Padding) which provides better security.

**Compliant code:**

```ballerina
byte[] cipherText = check crypto:encryptRsaEcb(data, publicKey, crypto:OAEPwithMD5andMGF1);
```

OAEP such as OAEPwithMD5andMGF1, OAEPWithSHA1AndMGF1, OAEPWithSHA256AndMGF1, OAEPwithSHA384andMGF1, and OAEPwithSHA512andMGF1 should be used for RSA encryption to enhance security.

## Additional Resources

- OWASP - [Top 10 2021 Category A2 - Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
- OWASP - [Top 10 2017 Category A3 - Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure)
- OWASP - [Top 10 2017 Category A6 - Security Misconfiguration](https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration)
- OWASP - [Mobile AppSec Verification Standard - Cryptography Requirements](https://mas.owasp.org/checklists/MASVS-CRYPTO/)
- OWASP - [Mobile Top 10 2016 Category M5 - Insufficient Cryptography](https://owasp.org/www-project-mobile-top-10/2016-risks/m5-insufficient-cryptography)
- OWASP - [Mobile Top 10 2024 Category M10 - Insufficient Cryptography](https://owasp.org/www-project-mobile-top-10/2023-risks/m10-insufficient-cryptography)
- CWE - [CWE-327 - Use of a Broken or Risky Cryptographic Algorithm](https://cwe.mitre.org/data/definitions/327)
- CWE - [CWE-780 - Use of RSA Algorithm without OAEP](https://cwe.mitre.org/data/definitions/780)
- [CERT, MSC61-J.](https://wiki.sei.cmu.edu/confluence/x/hDdGBQ) - Do not use insecure or weak cryptographic algorithms

### 11.2 Avoid using fast hashing algorithms

Storing passwords in plaintext or using fast hashing algorithms creates significant security vulnerabilities. If an attacker gains access to your database, plaintext passwords are immediately compromised. Similarly, passwords hashed with fast algorithms (like MD5, SHA-1, or SHA-256 without sufficient iterations) can be rapidly cracked using modern hardware.

## 11.2.1. Why this is an issue?

When using PBKDF2 (Password-Based Key Derivation Function 2), the iteration count is critical for security. Higher iteration counts increase the computational effort required to hash passwords, making brute-force attacks more difficult and time-consuming.

Following are the OWASP recommended parameters:

For BCrypt:

- Use a work factor of 10 or more
- Only use BCrypt for password storage in legacy systems where Argon2 and scrypt are not available
- Be aware of BCrypt's 72-byte password length limit

For Argon2:

- Use the Argon2id variant (which Ballerina implements)
- Minimum configuration of 19 MiB (19,456 KB) of memory
- An iteration count of at least 2
- At least 1 degree of parallelism (this is enforced by Ballerina)

For PBKDF2:

- PBKDF2-HMAC-SHA1: 1,300,000 iterations
- PBKDF2-HMAC-SHA256: 600,000 iterations (recommended by NIST)
- PBKDF2-HMAC-SHA512: 210,000 iterations

If performance constraints make these recommendations impractical, the iteration count should never be lower than 100,000.

## 11.2.2. What is the potential impact?

The security risks of using fast hashing algorithms include:

- Password databases become vulnerable to brute-force attacks
- Dictionary attacks can quickly test common passwords
- Rainbow table attacks can reverse hash values
- GPU-accelerated cracking tools can process billions of hashes per second
- Credential stuffing attacks using compromised password lists

## 11.2.3. How can I fix this?

Use secure password hashing algorithms with appropriate parameters that provide sufficient computational cost to resist brute-force attacks.

### 11.2.3.1 BCrypt Hashing Example

**Non-compliant code:**

```ballerina
public function main() returns error? {
    string password = "mySecurePassword123";
    // Using insufficient work factor
    string hashedPassword = check crypto:hashBcrypt(password, 4);
    io:println("Hashed Password: ", hashedPassword);
}
```

Using BCrypt with a work factor below 10 is insufficient and vulnerable to brute-force attacks.

**Compliant code:**

```ballerina
public function hashPassword() returns error? {
    string password = "mySecurePassword123";
    // Using sufficient work factor (14 or higher for better security)
    string hashedPassword = check crypto:hashBcrypt(password, 14);
    io:println("Hashed Password: ", hashedPassword);
}
```

### 11.2.3.2 Argon2 Hashing Example

**Non-compliant code:**

```ballerina
public function main() returns error? {
    string password = "mySecurePassword123";
    // Using insufficient memory configuration
    string hashedPassword = check crypto:hashArgon2(password, memory = 4096);
    io:println("Hashed Password: ", hashedPassword);
}
```

Using Argon2 with insufficient memory (less than 19,456 KB) makes it vulnerable to attacks.

**Compliant code:**

```ballerina
public function hashPassword() returns error? {
    string password = "mySecurePassword123";
    // Using recommended parameters: sufficient memory, iterations, and parallelism
    string hashedPassword = check crypto:hashArgon2(password, iterations = 3, memory = 65536, parallelism = 4);
    io:println("Hashed Password: ", hashedPassword);
}
```

### 11.2.3.3 PBKDF2 Hashing Example

**Non-compliant code:**

```ballerina
public function main() returns error? {
    string password = "mySecurePassword123";
    // Using default settings with insufficient iterations
    string hashedPassword = check crypto:hashPbkdf2(password);
    io:println("Hashed Password: ", hashedPassword);
}
```

Using PBKDF2 with insufficient iterations (default 10,000) is vulnerable to brute-force attacks.

**Compliant code:**

```ballerina
public function hashPassword() returns error? {
    string password = "mySecurePassword123";
    // Using sufficient iterations as recommended by NIST
    string hashedPassword = check crypto:hashPbkdf2(password, iterations = 600000, algorithm = crypto:SHA256);
    io:println("Hashed Password: ", hashedPassword);
}
```

## 11.2.4 Additional Resources

- OWASP - [Top 10 2021 Category A2 - Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
- OWASP - [Top 10 2021 Category A4 - Insecure Design](https://owasp.org/Top10/A04_2021-Insecure_Design/)
- OWASP - [Top 10 2017 Category A3 - Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure)
- OWASP - [Mobile Top 10 2024 Category M10 - Insufficient Cryptography](https://owasp.org/www-project-mobile-top-10/2023-risks/m10-insufficient-cryptography)
- CWE - [CWE-256 - Plaintext Storage of a Password](https://cwe.mitre.org/data/definitions/256)
- CWE - [CWE-916 - Use of Password Hash With Insufficient Computational Effort](https://cwe.mitre.org/data/definitions/916)
- STIG Viewer - [Application Security and Development: V-222542](https://stigviewer.com/stigs/application_security_and_development/2024-12-06/finding/V-222542) - The application must only store cryptographic representations of passwords.

### 11.3 Avoid reusing counter mode initialization vectors

When using encryption algorithms in counter mode (such as AES-GCM, AES-CCM, or AES-CTR), initialization vectors (IVs) or nonces should never be reused with the same encryption key. Reusing IVs with the same key can completely compromise the security of the encryption.

## 11.3.1. Why this is an issue?

Counter mode encryption relies on unique initialization vectors to ensure security. When the same IV is used with the same encryption key for different plaintexts, it creates serious vulnerabilities that can lead to:

- Exposure of encrypted data
- Ability for attackers to forge authenticated messages
- Recovery of the authentication key in some cases
- Disclosure of plaintext by XORing two ciphertexts created with the same IV and key

In modes like GCM (Galois Counter Mode), the initialization vector must be unique for each encryption operation. When an IV is reused, an attacker who observes multiple encrypted messages can perform cryptanalysis to recover the plaintext or even the encryption key.

The security risks of reusing IVs in counter mode include:

- Complete compromise of confidentiality
- Potential loss of message authentication
- Violation of the security guarantees provided by the encryption algorithm
- Exposure of sensitive data even when using strong encryption algorithms

## 11.3.2. What is the potential impact?

Reusing initialization vectors in counter mode encryption creates critical security vulnerabilities:

- **Confidentiality breach**: Attackers can XOR two ciphertexts encrypted with the same IV and key to reveal patterns in the plaintext
- **Authentication forgery**: In authenticated encryption modes like GCM, IV reuse can allow attackers to create valid forged messages
- **Key recovery**: In some scenarios, repeated IV usage can lead to recovery of the encryption key itself
- **Complete system compromise**: Once the encryption is broken, all data encrypted with that key becomes vulnerable

## 11.3.3. How can I fix this?

Generate cryptographically secure random initialization vectors for each encryption operation and ensure they are never reused with the same key.

### 11.3.3.1 AES-GCM Encryption Example

**Non-compliant code:**

```ballerina
public function encryptData(string data) returns byte[]|error {
    byte[16] initialVector = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    byte[16] key = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    byte[] dataBytes = data.toBytes();
    return crypto:encryptAesGcm(dataBytes, key, initialVector);
}
```

In this non-compliant example, the initialization vector is hardcoded, meaning every encryption operation uses the same IV. This completely undermines the security of AES-GCM encryption, regardless of key strength.

**Compliant code:**

```ballerina
import ballerina/crypto;
import ballerina/random;

public function encryptData(string data) returns [byte[], byte[16]]|error {
    byte[16] initialVector = [];
    foreach int i in 0...15 {
        initialVector[i] = <byte>(check random:createIntInRange(0, 255));
    }
    byte[16] key = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    byte[] dataBytes = data.toBytes();
    byte[] encryptedData = check crypto:encryptAesGcm(dataBytes, key, initialVector);
    return [encryptedData, initialVector];
}
```

This compliant approach generates a cryptographically secure random initialization vector for each encryption operation and returns it along with the encrypted data. The IV must be stored alongside the encrypted data (but doesn't need to be kept secret) to allow for decryption later.

### 11.3.3.2 AES-CBC Encryption Example

**Non-compliant code:**

```ballerina
public function encryptMessage(string message) returns byte[]|error {
    // Static nonce - this is vulnerable!
    byte[12] nonce = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    byte[16] key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    byte[] messageBytes = message.toBytes();
    return crypto:encryptAesCbc(messageBytes, key, nonce);
}
```

**Compliant code:**

```ballerina
import ballerina/crypto;
import ballerina/random;

public function encryptMessage(string message) returns [byte[], byte[12]]|error {
    // Generate unique nonce for each encryption
    byte[12] nonce = [];
    foreach int i in 0...11 {
        nonce[i] = <byte>(check random:createIntInRange(0, 255));
    }
    byte[16] key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    byte[] messageBytes = message.toBytes();
    byte[] encryptedData = check crypto:encryptAesCbc(messageBytes, key, nonce);
    return [encryptedData, nonce];
}
```

## 11.3.4 Additional Resources

- OWASP - [Top 10 2021 Category A2 - Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
- OWASP - [Top 10 2017 Category A3 - Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure)
- OWASP - [Mobile AppSec Verification Standard - Cryptography Requirements](https://mas.owasp.org/checklists/MASVS-CRYPTO/)
- OWASP - [Mobile Top 10 2016 Category M5 - Insufficient Cryptography](https://owasp.org/www-project-mobile-top-10/2016-risks/m5-insufficient-cryptography)
- OWASP - [Mobile Top 10 2024 Category M10 - Insufficient Cryptography](https://owasp.org/www-project-mobile-top-10/2023-risks/m10-insufficient-cryptography)
- CWE - [CWE-323 - Reusing a Nonce, Key Pair in Encryption](https://cwe.mitre.org/data/definitions/323)
- [NIST, SP-800-38A](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf) - Recommendation for Block Cipher Modes of Operation
- [NIST, SP-800-38C](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38c.pdf) - Recommendation for Block Cipher Modes of Operation: The CCM Mode for Authentication and Confidentiality
- [NIST, SP-800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) - Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC