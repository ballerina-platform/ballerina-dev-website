How to run a test case
----------------------

1. Start mock server pointing to the test case directory

    eg:
    ```sh
    bal run -- -Cpath=../content-enricher/tests -Ccase=1
    ``````

2. Add host entries to point to the mock server

    eg: on *nix open `/etc/hosts` and add entry
    ```sh
    127.0.0.1	api.iban.com.balmock.io
    127.0.0.1	api.intuit.com.balmock.io
    ```

3. Run the patten sample

    eg:
    ```sh
    bal run content-enricher.bal
    ``````

4. Run the test case using VSCode

    Make sure you have installed VSCode extension `humao.rest-client`.
    Open test case .http file, use VSCode to `Send Request`.

