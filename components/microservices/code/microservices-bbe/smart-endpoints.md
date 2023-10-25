---
title: 'Smart endpoints, dumb pipes'
description: Ballerina enables developers to create smart endpoints that encapsulate business logic and functionality, making them capable of understanding and processing specific types of data. This allows for precise control and manipulation of the data flowing through the microservices, while keeping the communication infrastructure(the pipe or the protocol) simple and agnostic to the data being processed. 
url: https://github.com/ballerina-guides/integration-samples/blob/main/graphql_bookstore_service/main.bal
---
```
service class Book {
    private final readonly & BookData bookData;

    function init(BookData bookData) {
        self.bookData = bookData.cloneReadOnly();
    }

    // resource functions represents smart endpoints
    resource function get reviews() returns Review|error {
        string isbn = self.bookData.isbn;
        GoogleBook googleBook = check bookEp->/books/v1/volumes.get(q = string `isbn:${isbn}`);
        return let var volInfo = googleBook.items[0].volumeInfo in {
                averageRating: volInfo.averageRating,
                ratingsCount: volInfo.ratingsCount,
                maturityRating: volInfo.maturityRating
            };
    }
}
```