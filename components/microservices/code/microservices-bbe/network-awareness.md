---
title: 'Network-Awareness for Seamless Integration'
description: Microservices communicate extensively over networks, making integration a crucial aspect of their design. Ballerina shines in this area with its built-in network-awareness. It seamlessly integrates with various protocols (HTTP, gRPC, and more) and data formats (JSON, XML) commonly used in microservices architectures.
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/graphql_bookstore_service/main.bal'
---
```
service class Book {
    private final readonly & BookData bookData;

    function init(BookData bookData) {
        self.bookData = bookData.cloneReadOnly();
    }

    resource function get isbn() returns string {
        return self.bookData.isbn;
    }

    resource function get title() returns string {
        return self.bookData.title;
    }

    resource function get year() returns int {
        return self.bookData.year;
    }

    resource function get author() returns string {
        return self.bookData.author;
    }

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