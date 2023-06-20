# Official Ballerina {{ version }} Release Artifacts


## Linux

- [ballerina-{{ version }}-swan-lake-linux-x64.deb](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.deb)

- [ballerina-{{ version }}-swan-lake-linux-x64.rpm](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-linux-x64.rpm)


## MacOS

- [ballerina-{{ version }}-swan-lake-macos-x64.pkg](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-x64.pkg)

- [ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-macos-arm-x64.pkg)


## Windows

- [ballerina-{{ version }}-swan-lake-windows-x64.msi](https://github.com/ballerina-platform/ballerina-distribution/releases/download/v{{ version }}/ballerina-{{ version }}-swan-lake-windows-x64.msi)


For more builds across platforms and architectures see the `Assets` section below.


## Signatures and Verification

`Ballerina` uses [sigstore/cosign](https://github.com/sigstore/cosign) for signing and verifying the release artifacts.

### Verification using Cosign CLI

Below is an example of using `cosign cli` to verify the release artifact:

```
cosign verify-blob ballerina-{{ version }}-swan-lake-linux-x64.deb  --certificate ballerina-{{ version }}-swan-lake-linux-x64.deb.pem --signature ballerina-{{ version }}-swan-lake-linux-x64.deb.sig --certificate-identity=https://github.com/ballerina-platform/ballerina-distribution/.github/workflows/publish-release.yml@refs/heads/master --certificate-oidc-issuer=https://token.actions.githubusercontent.com
```

### Verification using Rekor API

The following signatures done to the `Ballerina` release artifacts are recorded in [Rekor](https://github.com/sigstore/rekor) which is a `Sigstore Transparency Log`. API calls can be made to the `Rekor` API and details of the `signature`, `certifcate chain` can be retrieved and verified. Follow the below example:

1. Download the desired artifact.
2. Generate a sha256 Hash for the artifact and store it in a variable
`SHASUM=$(shasum -a 256 ballerina-{{ version }}-swan-lake-linux-x64.deb |awk '{print $1}')` 
3. Make a call to the `rekor` api to retrieve the entry of the signature and store it as the UUID value.
 `curl -X POST -H "Content-type: application/json" 'https://rekor.sigstore.dev/api/v1/index/retrieve' --data-raw "{\"hash\":\"sha256:$SHASUM\"}`
    
 - The following API call will return a UUID in the following format: `["**************************************"]` assign the UUID to a variable there after.

    `UUID="**************************************"`
4. Use the assigned UUID variable in an API call to `rekor` to retrieve the log entry of artifact signature. API calls can be made to `rekor` to retrieve the `signature` and `public certificate` which can be used to verify the artifact. Tools such as `base64`, `jq` and `openssl` will be needed.

     `curl -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}"`

- Use the following commands to retrieve the `signature` and `public certificate`.
    `curl -s -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}" \
  | jq -r '.[] | .body' \
  | base64 -d |jq -r '.spec .signature .content' \
  | base64 -d > ballerina-{{ version }}-swan-lake-linux-x64.deb.sig`

    `curl -s -X GET "https://rekor.sigstore.dev/api/v1/log/entries/${UUID?}" \
  | jq -r '.[] | .body' \
  | base64 -d |jq -r '.spec .signature .publicKey .content' \
  | base64 -d > ballerina-{{ version }}-swan-lake-linux-x64.deb.crt`

5. Use `openssl` to extract the `public key` portion from `certificate` file.

    `openssl x509 -in ballerina-{{ version }}-swan-lake-linux-x64.deb.crt -noout -pubkey > ballerina-{{ version }}-swan-lake-linux-x64.deb.pubkey.crt`

6. Verify the artifact using `openssl` and the `public key` file.
    `openssl sha256 -verify ballerina-{{ version }}-swan-lake-linux-x64.deb.pubkey.crt -signature ballerina-{{ version }}-swan-lake-linux-x64.deb.sig ballerina-{{ version }}-swan-lake-linux-x64.deb`
- If the artifact `ballerina-{{ version }}-swan-lake-linux-x64.deb` matches the one signed by `Cosign`, you will recieve the following message.       
    `Verified OK`