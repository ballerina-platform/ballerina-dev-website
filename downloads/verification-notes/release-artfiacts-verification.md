# Official Ballerina {{ version }} release artifacts


## Signatures and verification

Ballerina uses [`sigstore/cosign`](https://github.com/sigstore/cosign) for signing and verifying the release artifacts. The release artifacts along with their verification files are listed below.

| Platform | Installer | Certificate | Signature |
| :-------- | :-------: | :-------: | :-------: |
| linux-deb | [ballerina-{{ version }}-swan-lake-linux-x64.deb](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.deb) | [ballerina-{{ version }}-swan-lake-linux-x64.deb.pem](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.deb.pem) | [ballerina-{{ version }}-swan-lake-linux-x64.deb.sig](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.deb.sig) |
| linux-rpm | [ballerina-{{ version }}-swan-lake-linux-x64.rpm](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.rpm) | [ballerina-{{ version }}-swan-lake-linux-x64.rpm.pem](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.rpm.pem) | [ballerina-{{ version }}-swan-lake-linux-x64.rpm.sig](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.rpm.sig) | 
| macos | [ballerina-{{ version }}-swan-lake-macos-x64.pkg](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg) | [ballerina-{{ version }}-swan-lake-macos-x64.pkg.pem](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg.pem) | [ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig) | 
| macos-arm | [ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg) | [ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg.pem](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg.pem) | [ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg.sig](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg.sig) |
| windows | [ballerina-{{ version }}-swan-lake-windows-x64.msi](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-windows-x64.msi) | [ballerina-{{ version }}-swan-lake-windows-x64.msi.pem](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-windows-x64.msi.pkg.pem) | [ballerina-{{ version }}-swan-lake-windows-x64.msi.sig](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-windows-x64.msi.sig) |


### Verification using the Cosign CLI

Below is an example of using the Cosign CLI to verify the release artifacts. Select the verification artifacts based on your installer from the ones listed above. 

>Info: The artifacts used for this example are the `macos` platform artifacts listed in the table above.

Execute the command below to verify the artifacts using Cosign CLI.

    ```
    cosign verify-blob ballerina-{{ version }}-swan-lake-macos-x64.pkg --certificate ballerina-{{ version }}-swan-lake-macos-x64.pkg.pem --signature ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig --certificate-identity=https://github.com/ballerina-platform/ballerina-distribution/.github/workflows/publish-release.yml@refs/heads/{{ branch }} --certificate-oidc-issuer=https://token.actions.githubusercontent.com
    ```
If the `ballerina-{{ version }}-swan-lake-macos-x64.pkg`  artifact matches the one signed by Cosign, you will receive the following message.     
```
Verified OK
```

### Verification using the Rekor API

The following signatures applied on the Ballerina release artifacts are recorded in [Rekor](https://github.com/sigstore/rekor), which is a Sigstore Transparency Log. API calls can be made to the Rekor API and details of the `signature` and the `certificate chain` can be retrieved and verified as shown in the example below. 

>Info: The artifacts used for this example are the `macos` platform artifacts listed in the table above.


1. Download the desired artifact from the table above.
2. Generate a SHA256 Hash for the artifact and store it in a variable.

    ```
    SHASUM=$(shasum -a 256 ballerina-{{ version }}-swan-lake-macos-x64.pkg |awk '{print $1}')
    ```
    
3. Invoke the Rekor API to retrieve the entry of the signature and store it as the UUID value.
 
    ```
    curl -X POST -H "Content-type: application/json" 'https://rekor.sigstore.dev/api/v1/index/retrieve' --data-raw "{\"hash\":\"sha256:$SHASUM\"}
    ```
    
    - The following API call will return a UUID in the following format: `["**************************************"]` assign the UUID to a variable thereafter.

        ```
        UUID="**************************************"
        ```

4. Use the assigned UUID variable in an API call to Rekor to retrieve the log entry of the artifact signature. 

     
    ```
     curl -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}"
    ```

5. API calls can be made to Rekor to retrieve the signature and public certificate, which can be used to verify the artifact. 

    -   Use the following commands to retrieve the signature.
        
        ```
        curl -s -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?} \ | jq -r '.[] | .body' \ | base64 -d |jq -r '.spec .signature .content' \ | base64 -d > ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig
        ```

    -   Use the following commands to retrieve the certificate.

        ``` 
        curl -s -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}" \ | jq -r '.[] | .body' \ | base64 -d |jq -r '.spec .signature .publicKey .content' \ | base64 -d > ballerina-{{ version }}-swan-lake-macos-x64.pkg.crt
        ```

6. Use `openssl` to extract the `public key` portion from the `certificate` file.

    ```
    openssl x509 -in ballerina-{{ version }}-swan-lake-macos-x64.pkg.crt -noout -pubkey > ballerina-{{ version }}-swan-lake-macos-x64.pkg.pubkey.crt
    ```

7. Verify the artifact using `openssl` the public key.
    
    ```
    openssl sha256 -verify ballerina-{{ version }}-swan-lake-macos-x64.pkg.pubkey.crt -signature ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig ballerina-{{ version }}-swan-lake-macos-x64.pkg
    ```

 If the artifact `ballerina-{{ version }}-swan-lake-macos-x64.pkg` matches the one signed by `Cosign`, you will receive the following message. 

``` 
Verified OK
```
