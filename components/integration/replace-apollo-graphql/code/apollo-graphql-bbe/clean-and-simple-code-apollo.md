---
title: "Apollo"
description: null
---

```javascript
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
    type Book {
        title: String
        author: String
    }

    type Query {
        books: [Book]
    }
`;

const books = [
    {
        title: 'Harry Potter',
        author: 'J. K. Rowling',
    },
    {
        title: 'The Lord of the Rings',
        author: 'J. R. R. Tolkien',
    },
];

const resolvers = {
    Query: {
        books: () => books,
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

await startStandaloneServer(server, {
    listen: { port: 4000 },
});
```
