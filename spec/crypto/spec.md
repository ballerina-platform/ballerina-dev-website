# Specification: Ballerina Crypto Library

_Owners_: @shafreenAnfar @bhashinee  
_Reviewers_: @shafreenAnfar  
_Created_: 2022/08/23  
_Updated_: 2022/08/25  
_Edition_: Swan Lake  

## Introduction

This is the specification for the Crypto standard library of [Ballerina language](https://ballerina.io/), which provides Crypto functionalities.

The Crypto library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Hash](#2-hash)
   * 2.1. [MD5](#21-md5)
   * 2.2. [SHA1](#22-sha1)
   * 2.3. [SHA256](#23-sha256)
   * 2.4. [SHA384](#24-sha384)
   * 2.5. [SHA512](#25-sha512)
   * 2.6. [CRC32B](#26-crc32b)
3. [HMAC](#3-hmac)
   * 3.1. [MD5](#31-md5)
   * 3.2. [SHA1](#32-sha1)
   * 3.3. [SHA256](#33-sha256)
   * 3.4. [SHA384](#34-sha384)
   * 3.5. [SHA512](#35-sha512)
4. [Decode private/public key](#4-decode-private-public-keys)
   * 4.1. [Decode RSA Private key from PKCS12 file](#41-rsa-decode-private-key-from-pkcs12-file)
   * 4.2. [Decode RSA Private key using Private key and Password](#42-decode-rsa-private-key-using-private-key-and-password)
   * 4.3. [Decode RSA Public key from PKCS12 file](#43-decode-rsa-public-key-from-pkcs12-file)
   * 4.4. [Decode RSA Public key from the certificate file](#44-decode-rsa-public-key-from-the-certificate-file)
   * 4.5. [Decode EC Private key from PKCS12 file](#45-decode-ec-private-key-from-pkcs12-file)
   * 4.6. [Decode EC Private key using Private key and Password](#46-decode-ec-private-key-using-private-key-and-password)
   * 4.7. [Decode EC Public key from PKCS12 file](#47-decode-ec-public-key-from-pkcs12-file)
   * 4.8. [Decode EC Public key from the certificate file](#48-decode-ec-public-key-from-the-certificate-file)
   * 4.9. [Build RSA Public key from modulus and exponent parameters](#49-build-rsa-public-key-from-modulus-and-exponent-parameters)
5. [Encrypt-Decrypt](#5-encrypt-decrypt)   
   * 5.1. [Encryption](#51-encryption)
     * 5.1.1. [RSA](#511-rsa)
     * 5.1.2. [AES-CBC](#512-aes-cbc)
     * 5.1.3. [AES-ECB](#513-aes-ecb)
     * 5.1.4. [AES-GCM](#514-aes-gcm)
   * 5.2. [Decryption](#52-decryption)
     * 5.2.1. [RSA-ECB](#521-rsa-ecb)
     * 5.2.2. [AES-CBC](#522-aes-cbc)
     * 5.2.3. [AES-ECB](#523-aes-ecb)
     * 5.2.4. [AES-GCM](#524-aes-gcm)
6. [Sign and Verify](#6-sign-and-verify)
    * 6.1. [Sign messages](#61-sign-messages)
      * 6.1.1. [RSA-MD5](#611-rsa-md5)
      * 6.1.2. [RSA-SHA1](#612-rsa-sha1)
      * 6.1.3. [RSA-SHA256](#613-rsa-sha256)
      * 6.1.4. [RSA-SHA384](#614-rsa-sha384)
      * 6.1.5. [RSA-SHA512](#615-rsa-sha512)
      * 6.1.6. [SHA384withECDSA](#616-sha384withecdsa)
      * 6.1.7. [SHA256withECDSA](#617-sha256withecdsa)
   * 6.2. [Verify signature](#62-verify-signature)
       * 6.2.1. [RSA-MD5](#621-rsa-md5)
       * 6.2.2. [RSA-SHA1](#622-rsa-sha1)
       * 6.2.3. [RSA-SHA256](#623-rsa-sha256)
       * 6.2.4. [RSA-SHA384](#624-rsa-sha384)
       * 6.2.5. [RSA-SHA512](#625-rsa-sha512)
       * 6.2.6. [SHA384withECDSA](#626-sha384withecdsa)
       * 6.2.7. [SHA256withECDSA](#627-sha256withecdsa)
       
## 1. [Overview](#1-overview)

The Ballerina `crypto` library facilitates APIs to do operations like hashing, HMAC generation, checksum generation, encryption, decryption, signing data digitally, verifying digitally signed data, etc., with different cryptographic algorithms.

## 2. [Hash](#2-hash)

The `crypto` library supports generating hashes with 5 different hash algorithms MD5, SHA1, SHA256, SHA384, and SHA512. Also, it supports generating the CRC32B checksum.

### 2.1. [MD5](#21-md)

This API can be used to create the MD5 hash of the given data.
```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashMd5(data);
```

### 2.2. [SHA1](#22-sha1)

This API can be used to create the SHA-1 hash of the given data.
```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashSha1(data);
```

### 2.3. [SHA256](#23-sha256)

This API can be used to create the SHA-256 hash of the given data.
```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashSha256(data);
```

### 2.4. [SHA384](#24-sha384)

This API can be used to create the SHA-384 hash of the given data.
```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashSha384(data);
```

### 2.5. [SHA512](#25-sha512)

This API can be used to create the SHA-512 hash of the given data.
```ballerina
string dataString = "Hello Ballerina";
byte[] data = dataString.toBytes();
byte[] hash = crypto:hashSha512(data);
```

### 2.6. [CRC32B](#26-crc32b)

This API can be used to create the Hex-encoded CRC32B value of the given data.
```ballerina
string stringData = "Hello Ballerina";
byte[] data = stringData.toBytes();
string checksum = crypto:crc32b(data);
```

## 3. [HMAC](#3-hmac)

The `crypto` library supports generating HMAC with 5 different hash algorithms: MD5, SHA1, SHA256, SHA384, and SHA512.

### 3.1. [MD5](#31-md5)

This API can be used to create HMAC using the MD5 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = check crypto:hmacMd5(data, key);
```

### 3.2. [SHA1](#32-sha1)

This API can be used to create HMAC using the SHA-1 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = crypto:hmacSha1(data, key);
```

### 3.3. [SHA256](#33-sha256)

This API can be used to create HMAC using the SHA-256 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = check crypto:hmacSha256(data, key);
```

### 3.4. [SHA384](#34-sha384)

This API can be used to create HMAC using the SHA-384 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = check crypto:hmacSha384(data, key);
```

### 3.5. [SHA512](#35-sha512)

This API can be used to create HMAC using the SHA-512 hash function of the given data.

```ballerina
string input = "Hello Ballerina";
byte[] data = input.toBytes();
string secret = "some-secret";
byte[] key = secret.toBytes();
byte[] hmac = check crypto:hmacSha512(data, key);
```

## 4. [Decode private/public key](#4-decode-private-public-keys)

The `crypto` library supports decoding the RSA private key from a `.p12` file and a key file in the `PEM` format. Also, it supports decoding a public key from a `.p12` file and a certificate file in the `X509` format. Additionally, this supports building an RSA public key with the modulus and exponent parameters.

### 4.1. [Decode RSA Private key from PKCS12 file](#41-rsa-decode-private-key-from-pkcs12-file)

This API can be used to decode the RSA private key from the given PKCS#12 file.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
```

### 4.2. [Decode RSA Private key using Private key and Password](#42-decode-rsa-private-key-using-private-key-and-password)

This API can be used to decode the RSA private key from the given private key and private key password.

```ballerina
string keyFile = "/path/to/private.key";
crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyFile(keyFile, "keyPassword");
```

### 4.3. [Decode RSA Public key from PKCS12 file](#43-decode-rsa-public-key-from-pkcs12-file)

This API can be used to decode the RSA public key from the given PKCS#12 archive file.

```ballerina
crypto:TrustStore trustStore = {
    path: "/path/tp/truststore.p12",
    password: "truststorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(trustStore, "keyAlias");
```

### 4.4. [Decode RSA Public key from the certificate file](#44-decode-rsa-public-key-from-the-certificate-file)

This API can be used to decode the RSA public key from the given public certificate file.

```ballerina
string certFile = "/path/to/public.cert";
crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromCertFile(certFile);
```

### 4.5. [Decode EC Private key from PKCS12 file](#45-decode-ec-private-key-from-pkcs12-file)

This API can be used to decode the EC private key from the given PKCS#12 file.

```ballerina
crypto:KeyStore keyStore = {
    path: "/path/to/keyStore.p12",
    password: "keyStorePassword"
};
crypto:PrivateKey privateKey = check crypto:decodeEcPrivateKeyFromKeyStore(keyStore, "keyAlias", "keyPassword");
```

### 4.6. [Decode EC Private key using Private key and Password](#46-decode-ec-private-key-using-private-key-and-password)

This API can be used to decode the EC private key from the given private key and private key password.

```ballerina
string keyFile = "/path/to/private.key";
crypto:PrivateKey privateKey = check crypto:decodeEcPrivateKeyFromKeyFile(keyFile, "keyPassword");
```

### 4.7. [Decode EC Public key from PKCS12 file](#47-decode-ec-public-key-from-pkcs12-file)

This API can be used to decode the RSA public key from the given PKCS#12 archive file.

```ballerina
crypto:TrustStore trustStore = {
    path: "/path/tp/truststore.p12",
    password: "truststorePassword"
};
crypto:PublicKey publicKey = check crypto:decodeEcPublicKeyFromTrustStore(trustStore, "keyAlias");
```

### 4.8. [Decode EC Public key from the certificate file](#48-decode-ec-public-key-from-the-certificate-file)

This API can be used to decode the EC public key from the given public certificate file.

```ballerina
string certFile = "/path/to/public.cert";
crypto:PublicKey publicKey = check crypto:decodeEcPublicKeyFromCertFile(certFile);
```

### 4.9. [Build RSA Public key from modulus and exponent parameters](#49-build-rsa-public-key-from-modulus-and-exponent-parameters)

This API can be used to build the RSA public key from the given modulus and exponent parameters.

```ballerina
string modulus = "luZFdW1ynitztkWLC6xKegbRWxky-5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9-" +
        "PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0-s6kMl2EhB-rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsy" +
        "L4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z_73OOVhkh_mvTmWZLM7GM6sApmyLX6OXUp8z0pkY-v" +
        "T_9-zRxxQs7GurC4_C1nK3rI_0ySUgGEafO1atNjYmlFN-M3tZX6nEcA6g94IavyQ";
string exponent = "AQAB";
crypto:PublicKey publicKey = check crypto:buildRsaPublicKey(modulus, exponent);
```

## 5. [Encrypt-Decrypt](#5-encrypt-decrypt) 

The `crypto` library supports both symmetric key encryption/decryption and asymmetric key encryption/decryption. The RSA algorithm can be used for asymmetric-key encryption/decryption with the use of private and public keys. The AES algorithm can be used for symmetric-key encryption/decryption with the use of a shared key.

### 5.1. [Encryption](#51-encryption)

#### 5.1.1. [RSA](#511-rsa)

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

#### 5.1.2. [AES-CBC](#512-aes-cbc)

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

#### 5.1.3. [AES-ECB](#513-aes-ecb)

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

#### 5.1.4. [AES-GCM](#514-aes-gcm)

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

### 5.2. [Decryption](#52-decryption)

#### 5.2.1. [RSA-ECB](#521-rsa-ecb)

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

#### 5.2.2. [AES-CBC](#522-aes-cbc)

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

#### 5.2.3. [AES-ECB](#523-aes-ecb)

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

#### 5.2.4. [AES-GCM](#524-aes-gcm)

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

## 6. [Sign and Verify](#6-sign-and-verify)

The `crypto` library supports signing data using the RSA private key and verification of the signature using the RSA public key. This supports MD5, SHA1, SHA256, SHA384, and SHA512 digesting algorithms as well.

### 6.1. [Sign messages](#51-sign-messages)

#### 6.1.1. [RSA-MD5](#611-rsa-md5)

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

#### 6.1.2. [RSA-SHA1](#612-rsa-sha1)

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

#### 6.1.3. [RSA-SHA256](#613-rsa-sha256)

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

#### 6.1.4. [RSA-SHA384](#614-rsa-sha384)

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

#### 6.1.5. [RSA-SHA512](#615-rsa-sha512)

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

#### 6.1.6. [SHA384withECDSA](#616-sha384withecdsa)

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

#### 6.1.7. [SHA256withECDSA](#617-sha256withecdsa)

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

### 6.2. [Verify signature](#62-verify-signature)

#### 6.2.1. [RSA-MD5](#621-rsa-md5)

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

#### 6.2.2. [RSA-SHA1](#622-rsa-sha1)

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

#### 6.2.3. [RSA-SHA256](#623-rsa-sha256)

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

#### 6.2.4. [RSA-SHA384](#624-rsa-sha384)

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

#### 6.2.5. [RSA-SHA512](#625-rsa-sha512)

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

#### 6.2.6. [SHA384withECDSA](#626-sha384withecdsa)

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

#### 6.2.7. [SHA256withECDSA](#627-sha256withecdsa)

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
