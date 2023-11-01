How to test run the sample
----------------------------

1. Start the mock graphql service `inventoryService.bal` from inside the `tests` folder.
    ```
    bal run inventoryService.bal
    ```

2. Change the graphql client pointing to `http://blackwellsbooks.myshopify.com.balmock.io` and point it to `http://localhost:8080` in `selective-consumer.bal` file.

3. Inside the `selective-consumer` folder, run the sample.
    ```
    bal run selective-consumer.bal -- electronics
    ```
