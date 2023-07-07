---
title: 'Better security'
description: 'Ballerina provides robust security features such as encryption, authentication, and authorization, which are essential for businesses dealing with sensitive data.'
url: 'https://github.com/ballerina-guides/integration-samples/blob/graphql-security/graphql-social-media-service/service.bal'
---
```
listener graphql:Listener graphqlListener = new (9090,
    secureSocket = {
        key: {
            certFile: "../resource/path/to/public.crt",
            keyFile: "../resource/path/to/private.key"
        }
    }
);

@graphql:ServiceConfig {
    auth: [
        {
            oauth2IntrospectionConfig: {
                url: "https://mytoken.endpoint/oauth2/introspect",
                tokenTypeHint: "access_token",
                scopeKey: "scp",
                clientConfig: {
                    customHeaders: {"Authorization": "Basic YWRtaW46YWRtaW4="},
                    secureSocket: {
                        cert: "../resource/path/to/public.crt"
                    }
                }
            },
            scopes: ["admin"]
        }
    ],
    // Validate the query depth
    maxQueryDepth: 5
}
service /graphql on graphqlListener {
    resource function get users() returns User[] {
        // ...
    }
    remote function createPost(graphql:Context context, NewPost newPost) returns Post|error {
        // ...
    }
}

public type NewPost readonly & record {|
    // Validate user inputs
    @constraint:String {
        maxLength: 25,
        minLength: 5
    }
    string title;
|};
```
