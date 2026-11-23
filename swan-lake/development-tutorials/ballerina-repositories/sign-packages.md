---
layout: ballerina-sign-packages-left-nav-pages-swanlake
title: Sign packages
description: Sign a Ballerina package with Sigstore's cosign before you push it to Ballerina Central. Central checks the signature, marks the package as signed, and shows who signed it.
keywords: ballerina, programming language, ballerina packages, ballerina central, sigstore, cosign, signing
permalink: /learn/sign-packages/
active: sign-packages
intro: Signing is optional. You sign your package with cosign (Sigstore's tool), then push as usual. Ballerina Central checks the signature, marks the package as Signed, and shows who signed it.
---

>**Info:** "Signed" means the package is exactly what the signer signed. It does not mean Ballerina Central vouches for the signer, so check that the signer shown is the one you expect.

## How it works

Every case below runs the same three commands.

```
$ bal pack
$ cosign sign-blob ...
$ bal push
```

How you run `cosign sign-blob` depends on where you run it.

`cosign sign-blob` writes a signature file next to the package, `<package>.bala.sigstore.json`. `bal push` finds it and sends it to Ballerina Central with the package.

The examples use the package `myorg-mypkg-any-1.0.0.bala`. Use the file name `bal pack` creates in `target/bala/`.

## Prerequisites

- Ballerina [next release] or later. Earlier versions push the package without the signature file.
- cosign 2.x. Newer cosign versions may not work with Ballerina Central yet.
    - On GitHub Actions, the `sigstore/cosign-installer` step installs it for you (see [Sign on GitHub Actions](#sign-on-github-actions)).
    - Anywhere else, follow the <a href="https://docs.sigstore.dev/cosign/system_config/installation/" target="_blank">Sigstore installation guide</a>.

## Sign on your local machine

1. Build the package.

    ```
    $ bal pack
    ```

2. Sign it.

    ```
    $ cosign sign-blob --new-bundle-format --bundle target/bala/myorg-mypkg-any-1.0.0.bala.sigstore.json target/bala/myorg-mypkg-any-1.0.0.bala
    ```

    cosign shows Sigstore's terms and asks `Are you sure you would like to continue? [y/N]`. Type `y`. A browser opens. Log in with GitHub, Google, or Microsoft. Your email is recorded in Sigstore's public log and cannot be removed.

    cosign then prints the certificate, a `tlog entry created with index: …` line, and the signature. It has worked when you see `Wrote bundle to file target/bala/…sigstore.json`.

3. Push the package.

    ```
    $ bal push
    ```

Ballerina Central shows your email as the signer.

## Sign on GitHub Actions

GitHub proves to Sigstore which workflow is running, so you do not need a key.

1. In your package's GitHub repository, add your Ballerina Central access token as a secret. Go to **Settings → Secrets and variables → Actions → New repository secret** and name it `BALLERINA_CENTRAL_ACCESS_TOKEN`.

2. In the same repository, create the `.github/workflows/release.yml` file with the content below.

    ```yaml
    name: Release

    on:
      workflow_dispatch:        # adds a "Run workflow" button in the Actions tab

    permissions:
      contents: read
      id-token: write           # lets cosign get GitHub's identity token

    jobs:
      release:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4

          - uses: ballerina-platform/setup-ballerina@v1
            with:
              version: 2201.14.1      # use an exact version, [next release] or later

          - uses: sigstore/cosign-installer@v3     # installs cosign

          - name: Build, sign and push
            run: |
              bal pack
              cosign sign-blob --yes --new-bundle-format --bundle target/bala/myorg-mypkg-any-1.0.0.bala.sigstore.json target/bala/myorg-mypkg-any-1.0.0.bala
              bal push
            env:
              BALLERINA_CENTRAL_ACCESS_TOKEN: ${{ secrets.BALLERINA_CENTRAL_ACCESS_TOKEN }}
    ```

    Change `myorg-mypkg-any-1.0.0.bala` to your package's file name (`<org>-<name>-<platform>-<version>.bala`). The `--yes` flag skips cosign's confirmation prompt, since nobody is there to answer it.

    >**Tip:** If you already have a release workflow, add the `id-token: write` permission, the `cosign-installer` step, and the `cosign sign-blob` line between `bal pack` and `bal push`.

3. Commit the file. Then, go to the repository's **Actions** tab, choose **Release**, and click **Run workflow**.

Ballerina Central shows the workflow as the signer. For example, `https://github.com/myorg/mypkg/.github/workflows/release.yml@refs/heads/main`.

## Sign on GitLab.com

GitLab.com proves to Sigstore which pipeline is running, so you do not need a key.

1. Let the job get GitLab's identity token. Add the following to the job.

    ```yaml
    id_tokens:
      SIGSTORE_ID_TOKEN:
        aud: sigstore
    ```

2. Install cosign 2.x in the job. Follow the <a href="https://docs.sigstore.dev/cosign/system_config/installation/" target="_blank">Sigstore installation guide</a>.

3. In the job's script, build, sign, and push the package.

    ```
    bal pack
    cosign sign-blob --yes --new-bundle-format --identity-token "$SIGSTORE_ID_TOKEN" --bundle target/bala/myorg-mypkg-any-1.0.0.bala.sigstore.json target/bala/myorg-mypkg-any-1.0.0.bala
    bal push
    ```

Ballerina Central shows the GitLab project and branch as the signer.

## Sign on Jenkins and other CI systems without an identity token

Jenkins cannot prove its identity to Sigstore, so you sign with a key you create once.

This also applies to self-managed GitLab and GitHub Enterprise Server.

1. **Once:** Create a key pair. cosign asks for a password.

    ```
    $ cosign generate-key-pair
    ```

    This creates `cosign.key` (private, keep it secret) and `cosign.pub` (public).

2. **Once:** In Jenkins, add `cosign.key` as a **Secret file** credential named `cosign-key`, and its password as a **Secret text** credential named `cosign-password`.

3. **Once:** Publish `cosign.pub` (for example, in your repository's README), so users can tell your signatures apart from others.

4. In the pipeline, build, sign, and push the package.

    ```groovy
    withCredentials([
        file(credentialsId: 'cosign-key', variable: 'COSIGN_KEY'),
        string(credentialsId: 'cosign-password', variable: 'COSIGN_PASSWORD')
    ]) {
        sh '''
            bal pack
            cosign sign-blob --yes --new-bundle-format --key "$COSIGN_KEY" --bundle target/bala/myorg-mypkg-any-1.0.0.bala.sigstore.json target/bala/myorg-mypkg-any-1.0.0.bala
            bal push
        '''
    }
    ```

Ballerina Central shows the key's fingerprint (`SHA256:…`) as the signer.

## Verify the signature before pushing (optional)

If you signed on GitHub Actions, execute the command below.

```
$ cosign verify-blob --bundle target/bala/myorg-mypkg-any-1.0.0.bala.sigstore.json --certificate-oidc-issuer https://token.actions.githubusercontent.com --certificate-identity https://github.com/myorg/mypkg/.github/workflows/release.yml@refs/heads/main target/bala/myorg-mypkg-any-1.0.0.bala
```

If you signed with a key, execute the command below.

```
$ cosign verify-blob --bundle target/bala/myorg-mypkg-any-1.0.0.bala.sigstore.json --key cosign.pub target/bala/myorg-mypkg-any-1.0.0.bala
```
