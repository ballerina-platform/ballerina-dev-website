# Official Ballerina {{ version }} release artifacts


## Signatures and verification

Ballerina uses [`Sigstore/cosign`](https://github.com/sigstore/cosign) for signing and verifying the release artifacts. The release artifacts are listed below:


### Linux

The artifacts listed below are the Linux installers along with their respective certificate and signature files:

- [Linux-Deb-Installer](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.deb)  - [Linux-Deb-Certificate](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.deb.pem)  - [Linux-Deb-Signature](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.deb.sig)

- [Linux-Rpm-Installer](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.rpm)  - [Linux-Rpm-Certificate](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.rpm.pem)  - [Linux-Rpm-Signature](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.rpm.sig)


### MacOS

The artifacts listed below are the MacOS installers along with their respective certificate and signature files:

- [MacOS-Installer](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg)  - [MacOS-Certificate](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg.pem)  - [MacOS-Signature](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig)

- [MacOS-Arm-Installer](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg)  - [MacOS-Arm-Certificate](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg.pem)  - [MacOS-Arm-Signature](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-arm-x64.pkghttps://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.rpm.sig)


### Windows

The artifacts listed below are the Windows installer along with its respective certificate and signature files:

- [Windows-Installer](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-windows-x64.msi)  - [Windows-Certificate](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-windows-x64.msi.pem)  - [Windows-Signature](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-windows-x64.msi.sig)


### Verification using the Cosign CLI

Below is an example of using the `cosign cli` to verify the release artifacts. Please refer to the verification artifacts as per your installer which are listed above. The artifacts used in the example are listed below:

- [ballerina-{{ version }}-swan-lake-macos-x64.pkg](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg)

- [ballerina-{{ version }}-swan-lake-macos-x64.pkg.pem](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg.pem)

- [ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig)

```
cosign verify-blob ballerina-{{ version }}-swan-lake-macos-x64.pkg --certificate ballerina-{{ version }}-swan-lake-macos-x64.pkg.pem --signature ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig --certificate-identity=https://github.com/ballerina-platform/ballerina-distribution/.github/workflows/publish-release.yml@refs/heads/{{ branch }} --certificate-oidc-issuer=https://token.actions.githubusercontent.com
```
- If the artifact `ballerina-{{ version }}-swan-lake-macos-x64.pkg` matches the one signed by `Cosign`, you will receive the following message.       
    `Verified OK`


### Verification using the Rekor API

The following signatures done to the Ballerina release artifacts are recorded in [Rekor](https://github.com/sigstore/rekor), which is a Sigstore Transparency Log. API calls can be made to the `Rekor` API and details of the `signature` and the `certificate chain` can be retrieved and verified as shown in the example below.

1. Download the desired artifact.
2. Generate a SHA256 Hash for the artifact and store it in a variable.

     `SHASUM=$(shasum -a 256 ballerina-{{ version }}-swan-lake-macos-x64.pkg |awk '{print $1}')`
    
3. Invoke the Rekor API to retrieve the entry of the signature and store it as the UUID value.
 
    `curl -X POST -H "Content-type: application/json" 'https://rekor.sigstore.dev/api/v1/index/retrieve' --data-raw "{\"hash\":\"sha256:$SHASUM\"}`
    
 - The following API call will return a UUID in the following format: `["**************************************"]` assign the UUID to a variable thereafter.

    `UUID="**************************************"`
4. Use the assigned UUID variable in an API call to Rekor to retrieve the log entry of the artifact signature. API calls can be made to Rekor to retrieve the signature and public certificate, which can be used to verify the artifact. Tools such as `base64`, `jq`, and `openssl` will be needed.

     `curl -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}"`

- Use the following commands to retrieve the signature and public certificate.
    
    `curl -s -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}" \
  | jq -r '.[] | .body' \
  | base64 -d |jq -r '.spec .signature .content' \
  | base64 -d > ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig`

    `curl -s -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}" \
  | jq -r '.[] | .body' \
  | base64 -d |jq -r '.spec .signature .publicKey .content' \
  | base64 -d > ballerina-{{ version }}-swan-lake-macos-x64.pkg.crt`

5. Use `openssl` to extract the `public key` portion from the `certificate` file.

    `openssl x509 -in ballerina-{{ version }}-swan-lake-macos-x64.pkg.crt -noout -pubkey > ballerina-{{ version }}-swan-lake-macos-x64.pkg.pubkey.crt`

6. Verify the artifact using `openssl` and the `public key` file.
    
    `openssl sha256 -verify ballerina-{{ version }}-swan-lake-macos-x64.pkg.pubkey.crt -signature ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig ballerina-{{ version }}-swan-lake-macos-x64.pkg`

- If the artifact `ballerina-{{ version }}-swan-lake-macos-x64.pkg` matches the one signed by `Cosign`, you will receive the following message.       
    `Verified OK`
