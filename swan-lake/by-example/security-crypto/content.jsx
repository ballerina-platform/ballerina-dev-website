import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/crypto;
import ballerina/io;
import ballerina/random;

function hash() returns error? {
    // Input value for hash operations.
    string value = "Hello Ballerina!";
    byte[] input = value.toBytes();

    // Hashing input value using the MD5 hashing algorithm, and printing the hash value using the Hex encoding.
    // For details, see https://lib.ballerina.io/ballerina/crypto/latest#hashMd5
    byte[] output = crypto:hashMd5(input);
    io:println("Hex encoded hash with MD5: " + output.toBase16());

    // Hashing the input value using the SHA1 hashing algorithm, and printing the hash value using the Base64 encoding.
    output = crypto:hashSha1(input);
    io:println("Base64 encoded hash with SHA1: " + output.toBase64());

    // Hashing the input value using the SHA256 hashing algorithm, and printing the hash value using the Hex encoding.
    output = crypto:hashSha256(input);
    io:println("Hex encoded hash with SHA256: " + output.toBase16());

    // Hashing the input value using the SHA384 hashing algorithm, and printing the hash value using the Base64 encoding.
    output = crypto:hashSha384(input);
    io:println("Base64 encoded hash with SHA384: " + output.toBase64());

    // Hashing the input value using the SHA512 hashing algorithm, and printing the hash value using the Hex encoding.
    output = crypto:hashSha512(input);
    io:println("Hex encoded hash with SHA512: " + output.toBase16());

    // The Hex-encoded CRC32B checksum generation for the input value.
    io:println("CRC32B for text: " + crypto:crc32b(input));
}

function hmac() returns error? {
    // Input value for HMAC operations.
    string value = "Hello Ballerina!";
    byte[] input = value.toBytes();

    // The key used for the HMAC generation.
    string secret = "somesecret";
    byte[] key = secret.toBytes();

    // HMAC generation for the input value using the MD5 hashing algorithm, and printing the HMAC value using the Hex encoding.
    byte[] output = check crypto:hmacMd5(input, key);
    io:println("Hex encoded HMAC with MD5: " + output.toBase16());

    // HMAC generation for input the value using the SHA1 hashing algorithm, and printing the HMAC value using the Base64 encoding.
    output = check crypto:hmacSha1(input, key);
    io:println("Base64 encoded HMAC with SHA1: " + output.toBase64());

    // HMAC generation for the input value using the SHA256 hashing algorithm, and printing the HMAC value using the Hex encoding.
    output = check crypto:hmacSha256(input, key);
    io:println("Hex encoded HMAC with SHA256: " + output.toBase16());

    // HMAC generation for the input value using the SHA384 hashing algorithm, and printing the HMAC value using the Base64 encoding.
    output = check crypto:hmacSha384(input, key);
    io:println("Base64 encoded HMAC with SHA384: " + output.toBase64());

    // HMAC generation for the input value using the SHA512 hashing algorithm, and printing the HMAC value using the Hex encoding.
    output = check crypto:hmacSha512(input, key);
    io:println("Hex encoded HMAC with SHA512: " + output.toBase16());
}

function decodePrivateKey() returns crypto:PrivateKey|error {
    // Obtaining the reference to an RSA private key by a key file.
    string keyFile = "../resource/path/to/private.key";
    crypto:PrivateKey privateKey = check crypto:decodeRsaPrivateKeyFromKeyFile(keyFile);

    // Obtaining the reference to an RSA private key by an encrypted key file.
    string encryptedKeyFile = "../resource/path/to/encryptedPrivate.key";
    privateKey = check crypto:decodeRsaPrivateKeyFromKeyFile(encryptedKeyFile, "ballerina");

    // Obtaining the reference to an RSA private key stored within a PKCS#12 or PFX format archive file.
    crypto:KeyStore keyStore = {
        path: "../resource/path/to/ballerinaKeystore.p12",
        password: "ballerina"
    };
    privateKey = check crypto:decodeRsaPrivateKeyFromKeyStore(keyStore, "ballerina", "ballerina");

    return privateKey;
}

function decodePublicKey() returns crypto:PublicKey|error {
    // Obtaining the reference to an RSA public key by a cert file.
    string certFile = "../resource/path/to/public.crt";
    crypto:PublicKey publicKey = check crypto:decodeRsaPublicKeyFromCertFile(certFile);

    // Obtaining reference to a RSA public key stored within a PKCS#12 or PFX format archive file.
    crypto:TrustStore trustStore = {
        path: "../resource/path/to/ballerinaTruststore.p12",
        password: "ballerina"
    };
    publicKey = check crypto:decodeRsaPublicKeyFromTrustStore(trustStore, "ballerina");

    return publicKey;
}

function sign() returns error? {
    // Input value for the \`sign\` operations.
    string value = "Hello Ballerina!";
    byte[] input = value.toBytes();

    // Private and public keys for the \`sign\` and \`verify\` operations.
    crypto:PrivateKey privateKey = check decodePrivateKey();
    crypto:PublicKey publicKey = check decodePublicKey();

    // Signing the input value using the RSA-MD5 signature algorithms, and printing the signature value using the Hex encoding.
    byte[] output = check crypto:signRsaMd5(input, privateKey);
    io:println("Hex encoded RSA-MD5 signature: " + output.toBase16());

    boolean verified = check crypto:verifyRsaMd5Signature(input, output, publicKey);
    io:println("RSA-MD5 signature verified: " + verified.toString());

    // Signing the input value using the RSA-MD5 signature algorithms, and printing the signature value using the Base64 encoding.
    output = check crypto:signRsaSha1(input, privateKey);
    io:println("Base64 encoded RSA-SHA1 signature: " + output.toBase64());

    verified = check crypto:verifyRsaSha1Signature(input, output, publicKey);
    io:println("RSA-SHA1 signature verified: " + verified.toString());

    // Signing the input value using the RSA-MD5 signature algorithms, and printing the signature value using the Hex encoding.
    output = check crypto:signRsaSha256(input, privateKey);
    io:println("Hex encoded RSA-SHA256 signature: " + output.toBase16());

    verified = check crypto:verifyRsaSha256Signature(input, output, publicKey);
    io:println("RSA-SHA256 signature verified: " + verified.toString());

    // Signing the input value using the RSA-MD5 signature algorithms, and printing the signature value using the Base64 encoding.
    output = check crypto:signRsaSha384(input, privateKey);
    io:println("Base64 encoded RSA-SHA384 signature: " + output.toBase64());

    verified = check crypto:verifyRsaSha384Signature(input, output, publicKey);
    io:println("RSA-SHA384 signature verified: " + verified.toString());

    // Signing the input value using the RSA-MD5 signature algorithms, and printing the signature value using the Hex encoding.
    output = check crypto:signRsaSha512(input, privateKey);
    io:println("Hex encoded RSA-SHA512 signature: " + output.toBase16());

    verified = check crypto:verifyRsaSha512Signature(input, output, publicKey);
    io:println("RSA-SHA512 signature verified: " + verified.toString());
}

function encrypt() returns error? {
    // Input value for the \`encrypt\` operations.
    string value = "Hello Ballerina!";
    byte[] input = value.toBytes();

    // Private and public keys for the \`encrypt\` and \`decrypt\` operations.
    crypto:PrivateKey privateKey = check decodePrivateKey();
    crypto:PublicKey publicKey = check decodePublicKey();

    // Encrypts and decrypts an input value using the \`RSA ECB PKCS1\` padding.
    byte[] output = check crypto:encryptRsaEcb(input, publicKey);
    output = check crypto:decryptRsaEcb(output, privateKey);
    io:println("RSA ECB PKCS1 decrypted value: " + check string:fromBytes(output));

    // Encrypts and decrypts an input value using the \`RSA ECB OAEPwithSHA512andMGF1\` padding.
    output = check crypto:encryptRsaEcb(input, publicKey, crypto:OAEPwithSHA512andMGF1);
    output = check crypto:decryptRsaEcb(output, privateKey, crypto:OAEPwithSHA512andMGF1);
    io:println("RSA ECB OAEPwithSHA512andMGF1 decrypted value: " + check string:fromBytes(output));

    // Randomly generates a 128 bit key for the AES encryption.
    byte[16] aesKey = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    foreach var i in 0 ... 15 {
        aesKey[i] = <byte>(check random:createIntInRange(0, 255));
    }

    // Randomly generates a 128 bit IV for the AES encryption.
    byte[16] iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    foreach var i in 0 ... 15 {
        iv[i] = <byte>(check random:createIntInRange(0, 255));
    }

    // Encrypts and decrypts an input value using the \`AES CBC PKCS5\` padding.
    output = check crypto:encryptAesCbc(input, aesKey, iv);
    output = check crypto:decryptAesCbc(output, aesKey, iv);
    io:println("AES CBC PKCS5 decrypted value: " + check string:fromBytes(output));

    // Encrypts and decrypts an input value using the \`AES CBC\` without padding.
    output = check crypto:encryptAesCbc(input, aesKey, iv, crypto:NONE);
    output = check crypto:decryptAesCbc(output, aesKey, iv, crypto:NONE);
    io:println("AES CBC no padding decrypted value: " + check string:fromBytes(output));

    // Encrypts and decrypts an input value using the \`AES GCM PKCS5\` padding.
    output = check crypto:encryptAesGcm(input, aesKey, iv);
    output = check crypto:decryptAesGcm(output, aesKey, iv);
    io:println("AES GCM PKCS5 decrypted value: " + check string:fromBytes(output));

    // Encrypts and decrypts an input value using the \`AES GCM\` without padding.
    output = check crypto:encryptAesGcm(input, aesKey, iv, crypto:NONE);
    output = check crypto:decryptAesGcm(output, aesKey, iv, crypto:NONE);
    io:println("AES GCM no padding decrypted value: " + check string:fromBytes(output));

    // Encrypts and decrypts an input value using the \`AES ECB PKCS5 padding\`.
    output = check crypto:encryptAesEcb(input, aesKey);
    output = check crypto:decryptAesEcb(output, aesKey);
    io:println("AES ECB PKCS5 decrypted value: " + check string:fromBytes(output));

    // Encrypts and decrypts an input value using the \`AES ECB\` without padding.
    output = check crypto:encryptAesEcb(input, aesKey, crypto:NONE);
    output = check crypto:decryptAesEcb(output, aesKey, crypto:NONE);
    io:println("AES ECB no padding decrypted value: " + check string:fromBytes(output));
}

public function main() returns error? {
    check hash();
    check hmac();
    check sign();
    check encrypt();
}
`,
];

export function SecurityCrypto({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Cryptographic operations</h1>

      <p>
        The <code>crypto</code> stdlib provides functions usable to perform
        different cryptographic operations such as hashing, HMAC generation,
        checksum generation, encryption, decryption, digitally signing data and
        verifying digitally signed data.
      </p>

      <p>
        For more information on the underlying module, see the{" "}
        <a href="https://lib.ballerina.io/ballerina/crypto/latest/">
          <code>crypto</code> module
        </a>
        .
      </p>

      <blockquote>
        <p>
          <strong>Tip:</strong> You may need to change the certificate file
          path, private key file path, and trusted certificate file path in the
          code below.
        </p>
      </blockquote>

      <Row
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          <button
            className="bg-transparent border-0 m-0 p-2 ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.8.4/examples/security-crypto",
                "_blank",
              );
            }}
            aria-label="Edit on Github"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#000"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <title>Edit on Github</title>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </button>
          {codeClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2"
              disabled
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2"
              onClick={() => {
                updateCodeClick1(true);
                copyToClipboard(codeSnippetData[0]);
                setTimeout(() => {
                  updateCodeClick1(false);
                }, 3000);
              }}
              aria-label="Copy to Clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-clipboard"
                viewBox="0 0 16 16"
              >
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          {codeSnippets[0] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[0]),
              }}
            />
          )}
        </Col>
      </Row>

      <p>Run the program by executing the command below.</p>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
        style={{ marginLeft: "0px" }}
      >
        <Col sm={12} className="d-flex align-items-start">
          {outputClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="output-btn bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              onClick={() => {
                updateOutputClick1(true);
                const extractedText = extractOutput(ref1.current.innerText);
                copyToClipboard(extractedText);
                setTimeout(() => {
                  updateOutputClick1(false);
                }, 3000);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#EEEEEE"
                className="output-btn bi bi-clipboard"
                viewBox="0 0 16 16"
                aria-label="Copy to Clipboard"
              >
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref1}>
            <code className="d-flex flex-column">
              <span>{`\$ bal run security_crypto.bal`}</span>
              <span>{`Hex encoded hash with MD5: 0605402ee16d8e96511a58ff105bc24a`}</span>
              <span>{`Base64 encoded hash with SHA1: /8fwbGIevBvv2Nl3gEL9DtWas+Q=`}</span>
              <span>{`Hex encoded hash with SHA256: a984a643c350b17f0738bac0fef17f2cd91d91e04596351d0af`}</span>
              <span>{`    670c79adc12d5`}</span>
              <span>{`Base64 encoded hash with SHA384: lselzItgAZHQmqNbkf/s2aRjBSd93O3ayc0PB0Dxk6AEo1s4`}</span>
              <span>{`    4zyTz/Qp0FJO1n6b`}</span>
              <span>{`Hex encoded hash with SHA512: a6f0770f1582f49396a97fbd5973ac22a3a578ac6a991786427`}</span>
              <span>{`    dfec17dbd984d8d6289771ac6f44176160a3dcd59f4a8c6b3ab97bef0caa5c67a3fac78c8e946`}</span>
              <span>{`CRC32B for text: db9230c5`}</span>
              <span>{`Hex encoded HMAC with MD5: b69fa2cc698e0923a7eea9d8f2b156fe`}</span>
              <span>{`Base64 encoded HMAC with SHA1: AkWFajkb/gml703Zf4pPgxrjam4=`}</span>
              <span>{`Hex encoded HMAC with SHA256: 13a3369b8ba326fd311d4500b06a5214a02ed2a033917108f6b`}</span>
              <span>{`    9af58b7ede381`}</span>
              <span>{`Base64 encoded HMAC with SHA384: 0AjKoWLhNPgdobGTPJs0PdkA0W9wkJtzUvXigzC1ZmXDJJsx`}</span>
              <span>{`    p4icks4JrPiwHGm6`}</span>
              <span>{`Hex encoded HMAC with SHA512: 27588ad08e772a6bba5fca5f45cf467819c8de69a70a42be6fe`}</span>
              <span>{`    3eb09ceb3bfeb8b2976bda8ea5c10dcfa2294b12cb0b50b22a06309bada98af21857904a03205`}</span>
              <span>{`Hex encoded RSA-MD5 signature: 2cfd121e4ff2409d1b2482ebbf37d0c035884d6d858e307e44`}</span>
              <span>{`    60b092d79cb20abb624a0dfae76b73b1fc85447be3060a36b318813f0115b1919e5efa7a7f9b1`}</span>
              <span>{`    173ec869f56fd9448d99770e1565db1c69a04fd0075fa0e33423a7e829a8b9c25a4dd2c68f3ee`}</span>
              <span>{`    e021c0c4ff27979750b395384e280afd87af5274c8d2d99ad4438d9bfc9b2c5a2814212ba29ce`}</span>
              <span>{`    6ff70cbe30a5c23f86b0330e143c4d8813ff10092cd313c6861706d37df5f4bb4e9fc72354975`}</span>
              <span>{`    ee1786cf24c79b9edfa909968f198c4da37464f3d214a68fb39956717e92d667bb5a9a7f5986b`}</span>
              <span>{`    a055d431813d4053a028873499f98c94fd6b5c6fd5aefad432669f957ab4ce9e91c5e77b36ec0`}</span>
              <span>{`RSA-MD5 signature verified: true`}</span>
              <span>{`Base64 encoded RSA-SHA1 signature: bYMHKKVkjbOUp9ly3AdW9/euxF94krkkF9SDk2FfbVEc0m`}</span>
              <span>{`    qpGIxVoZlPiFxszurZF1YPcqOSeOehDkaHXUMfQkTjBq7XlcePtkywy0fChqw8/SWqZR8nbYv97tt`}</span>
              <span>{`    8+MVTkymbm26syQLwYNLiGp/EsN6X+fJpkdakwHE+TrdE+rEFrNysGyAm1DWwc4c+l7MEmSYMUnh/`}</span>
              <span>{`    GWPY5r2knOOdDA3mr+XyrsxzFRWZgO7ebVvEQfq9XkRp8kdiGVgpLS5au0jKj3EpbCdS1prFgy3gr`}</span>
              <span>{`    kuSJTTUQCwgPo7WSjWbuehFGni7rbas8HIqNlyWF0qUyznJ3eqbUwZ95QqOoVWZoQ==`}</span>
              <span>{`RSA-SHA1 signature verified: true`}</span>
              <span>{`Hex encoded RSA-SHA256 signature: 215c6ea96c9e82348430c6bb02e715560b4fbd3afcf24fb`}</span>
              <span>{`    eb41ff12d4d68a797d61c4d6f822807688e4dc604e212b3cc7ac563b3cbe4e5690e2aebaf4e3d`}</span>
              <span>{`    f35c19d4b0f7043f50501f390634303577053b029d495104c0e98bc887f0be744ef6f726f7192`}</span>
              <span>{`    01907ad4e86cef82eb030b60c384f7034a85159081e598e197bb8904a9123f39d190796dc7fd9`}</span>
              <span>{`    46157547c10523999b8fa956d4119dbfe3c1435911c0585cf3c537964516706772e87f2470557`}</span>
              <span>{`    40cc4867ac6b99d7bf699fce1b59956c7f55368c8c88c9d47e51ef120ed3f27c3e555691a6971`}</span>
              <span>{`    42c78cbd72c23b81b43fa5ab67164a35f8e8c6bf1da187d3feb866add13f1fb9576a2f7887535`}</span>
              <span>{`    311`}</span>
              <span>{`RSA-SHA256 signature verified: true`}</span>
              <span>{`Base64 encoded RSA-SHA384 signature: BjQ40dffGiRQ4zo1s+ld+zKhJL21RbO5sW3L2+4xmonU`}</span>
              <span>{`    t126u9D4/FZ2sM1QGGamj8btB9otiYmWr9sFm4fTs1EX6vrxcCGCAiDdkMxiRs7kShaz2x/BjJQ7c`}</span>
              <span>{`    Od9OY+amwo7DQ/FAk9mNOt4lFUpjc9WyEW9F1PEJRXZQvMmVabDu8lp/Fh02lmEquG15DT5qT0jRx`}</span>
              <span>{`    RJiS8CNa+97cMZdOmF2KeADfRbNJSz70mZ76MrsNxYIXYIiJzJBQod0efQr0Sr/HDn4JDVph9rpDM`}</span>
              <span>{`    3p8m94TyXvSOwxwxzZWRLEwB0ANdfDmbrW4bOpxfZZFmy1hltqNJQ9G0BcKOHsZDj6Q==`}</span>
              <span>{`RSA-SHA384 signature verified: true`}</span>
              <span>{`Hex encoded RSA-SHA512 signature: 15428fdc7b26d18b1f3eae4569399ae6ebfd430c8f073bf`}</span>
              <span>{`    2fa77ebfe1ad5645640374ea4a4aeadd252af3a198e55e69ad2a910e28470d9b54748887de06a`}</span>
              <span>{`    5c3ed7ab12399a404359332553e051e8ae0f3ef741faa15a21ad17a9c235e5f91d567bcca0e5a`}</span>
              <span>{`    6117689dccada4a33ee897514f7a8a32f12dac0087f5dcbb094c93c792f672e1685618ac5d93a`}</span>
              <span>{`    a9d30f6d8e306145ef2d1b9cfdc04d6c61b43376089a78471e8e03d97ee3b57e1b734a23f4436`}</span>
              <span>{`    6a99234a0abeb1d36d01c474833b4c2beaf430dae06ab95a1c951645fb1e0a5e7b9eed44d40e3`}</span>
              <span>{`    5036f2cd2764df6cc04fe1248e1bb772a53c8201a974109333a318ce57930494d4cb5e41d0dc8`}</span>
              <span>{`    f1c`}</span>
              <span>{`RSA-SHA512 signature verified: true`}</span>
              <span>{`RSA ECB PKCS1 decrypted value: Hello Ballerina!`}</span>
              <span>{`RSA ECB OAEPwithSHA512andMGF1 decrypted value: Hello Ballerina!`}</span>
              <span>{`AES CBC PKCS5 decrypted value: Hello Ballerina!`}</span>
              <span>{`AES CBC no padding decrypted value: Hello Ballerina!`}</span>
              <span>{`AES GCM PKCS5 decrypted value: Hello Ballerina!`}</span>
              <span>{`AES GCM no padding decrypted value: Hello Ballerina!`}</span>
              <span>{`AES ECB PKCS5 decrypted value: Hello Ballerina!`}</span>
              <span>{`AES ECB no padding decrypted value: Hello Ballerina!`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link title="Read/write XML" href="/learn/by-example/io-xml">
            <div className="btnContainer d-flex align-items-center me-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[0] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([true, false])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <div className="d-flex flex-column ms-4">
                <span className="btnPrev">Previous</span>
                <span
                  className={btnHover[0] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([true, false])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Read/write XML
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="JWT issue/validate"
            href="/learn/by-example/security-jwt-issue-validate"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  JWT issue/validate
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[1] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([false, true])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
