# Verify Ballerina artifacts

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

>**Info:** The artifacts used for this example are the MacOS platform artifacts listed in the table above.

Execute the command below to verify the artifacts using Cosign CLI.

```bash
$ cosign verify-blob ballerina-{{ version }}-swan-lake-macos-x64.pkg --certificate ballerina-{{ version }}-swan-lake-macos-x64.pkg.pem --signature ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig --certificate-identity=https://github.com/ballerina-platform/ballerina-distribution/.github/workflows/publish-release.yml@refs/heads/{{ branch }} --certificate-oidc-issuer=https://token.actions.githubusercontent.com
```
If the `ballerina-{{ version }}-swan-lake-macos-x64.pkg`  artifact matches the one signed by Cosign, you will receive the following message.  

```bash
Verified OK
```

### Verification using the Rekor API

The signatures applied on the Ballerina release artifacts are recorded in [Rekor](https://github.com/sigstore/rekor), which is a Sigstore Transparency Log.  

>**Info:** The artifacts used for this example are the MacOS platform artifacts listed in the table above.

Follow the steps below to send an API call to Rekor to retrieve and verify the details of the `signature` and the `certificate chain`.

1. Download the desired artifact from the table above.

2. Generate a SHA256 Hash for the artifact and store it in a variable.

    ```bash
    $ SHASUM=$(shasum -a 256 ballerina-{{ version }}-swan-lake-macos-x64.pkg |awk '{print $1}')
    ```
    
3. Invoke the Rekor API to retrieve the entry of the signature and store it as the UUID value.
 
    ```bash
    $ curl -X POST -H "Content-type: application/json" 'https://rekor.sigstore.dev/api/v1/index/retrieve' --data-raw "{\"hash\":\"sha256:$SHASUM\"}
    ```
    
4. Assign the UUID returned by the above API call to a variable  as shown below.

    > **Tip:** Replace the `<UUID_VALUE>` in the below exmaple with the UUID value you recieved 

    ```bash
    $ UUID=<UUID_VALUE>
    ```

4. Retrieve the log entry of the artifact signature by sending an API call to Rekor with the assigned UUID variable.

     
    ```bash
     $ curl -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}"
    ```

5. Retrieve the signature and public certificate, which are required to verify the artifact. 

    -   **Retrieve the signature:**
        
        ```bash
        $ curl -s -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?} \ | jq -r '.[] | .body' \ | base64 -d |jq -r '.spec .signature .content' \ | base64 -d > ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig
        ```

    -   **Retrieve the certificate:**

        ```bash 
        $ curl -s -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}" \ | jq -r '.[] | .body' \ | base64 -d |jq -r '.spec .signature .publicKey .content' \ | base64 -d > ballerina-{{ version }}-swan-lake-macos-x64.pkg.crt
        ```

6. Extract the `public key` from the `certificate` file using `openssl`

    ```bash
    $ openssl x509 -in ballerina-{{ version }}-swan-lake-macos-x64.pkg.crt -noout -pubkey > ballerina-{{ version }}-swan-lake-macos-x64.pkg.pubkey.crt
    ```

7. Verify the artifact using the public key.
    
    ```bash
    $ openssl sha256 -verify ballerina-{{ version }}-swan-lake-macos-x64.pkg.pubkey.crt -signature ballerina-{{ version }}-swan-lake-macos-x64.pkg.sig ballerina-{{ version }}-swan-lake-macos-x64.pkg
    ```

 If the artifact matches the one signed by `Cosign`, you will receive the following message. 

```bash 
Verified OK
```
