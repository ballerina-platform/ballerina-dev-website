---
title: "Configurations in the ballerina file"
---

```
type DataBaseConfig record {|
    string host;
    int port;
    string user;
    string password;
    string database;
|};

configurable DataBaseConfig databaseConfig = ?;
```