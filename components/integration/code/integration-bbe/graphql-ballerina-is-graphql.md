---
title: 'GraphQL? Ballerina is GraphQL'
description: 'When you go beyond just toy GraphQL applications where you simply map GraphQL queries to database queries, Ballerina gives you first-class concepts to write any code that executes as part of the GraphQL query. <br/><br/> No GraphQL service is out of reach with Ballerina. It can create a custom-tailored, typed GraphQL client for your unique queries with ease.'
url: 'https://github.com/ballerina-guides/integration-samples/tree/main/graphql_bookstore_service/main.bal'
---
```
final http:Client bookEp = check new ("https://www.googleapis.com");

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

    resource function get reviews() returns Review|error {
        string isbn = self.bookData.isbn;
        GoogleBook googleBook = check bookEp->/books/v1/volumes.get(q=string `isbn:${isbn}`);
        return let var volInfo = googleBook.items[0].volumeInfo in {
                averageRating: volInfo.averageRating,
                ratingsCount: volInfo.ratingsCount,
                maturityRating: volInfo.maturityRating
            };
    }
}

service /graphql on new graphql:Listener(9090) {
    resource function get book(string isbn) returns Book? {
        BookData? data = books[isbn];
        return data is BookData ? new Book(data) : ();
    }

    resource function get allBooks() returns Book[] {
        return from var bookData in books
            select new Book(bookData);
    }

    remote function addBook(BookData bookData) returns Book|error {
        books.add(bookData);
        return new Book(bookData);
    }
}
```