---
layout: ballerina-left-nav-pages-swanlake
title: Trying it Out
description: The example below demonstrates how to use configurable variables inside a Ballerina project. 
keywords: ballerina, programming language, configurable, variables, 
permalink: /learn/user-guide/configurability/trying-it-out/
active: trying-it-out
intro: The example below demonstrates how to use configurable variables inside a Ballerina project.
redirect_from:
- /learn/user-guide/configurability/trying-it-out
---

1. Execute the command below to create a Ballerina package.

    ```bash
    bal new userPortal
    ```

2. Navigate to the created `userPortal` directory, and execute the command below to add a module. 

    ```bash
    bal add users
    ```

3. Replace the  content of the `main.bal` file  with the content below.

    ```ballerina
    import ballerina/io;
    import ballerina/log;
    import userPortal.users;
    
    configurable string url = ?;
    configurable int[] ports = [9090];
    
    public function main() {
    io:println("Page URL : ", url);
    io:println("Available ports : ", ports);
    io:println("Admin : ", users:getAdminUser());
    
    table<users:UserInfo> key(username) userTable = users:getUsers();
    io:println("Other users : ", userTable );
    
    if(userTable.length() > 2) {
        log:printError("Maximum number of users is 2");
    }
    }
    ```

4. Copy the content below to the `users.bal` file.

    ```ballerina
    public type UserInfo record {|
    readonly string username;
    int age;
    |};
    
    public type UserTable table<UserInfo> key(username);
    
    configurable UserInfo admin = ?;
    configurable UserTable users = ?;
    
    public function getAdminUser() returns UserInfo {
    return admin;
    }
    
    public function getUsers() returns UserTable {
    return users;
    }
    ```

5. Create a file named `Config.toml` with the content below in the package root directory to provide the values through the configuration file.

    ```toml
    url = "http://google.com"
    ports = [9090, 9091, 9092]
    
    [userPortal.users.admin]
    username = "Bob"
    age = 25
    
    [[userPortal.users.users]]
    username = "John"
    age = 56
    
    [[userPortal.users.users]]
    username = "Tom"
    age = 14
    
    [[userPortal.users.users]]
    username = "Anna"
    age = 27
    
    [ballerina.log]
    format = "json"
    ```

    >**Note:** The values for the `url` and `port` variables are given without a module-name header as those variables are defined in the `userPortal` root module.

    Similarly, the `admin` and `users` variables  are defined in a `userPortal.users` non-root module . Therefore, they are provided with the module-name prefix as `userPortal.users`. Also, the project uses a `ballerina/log` imported module, which contains a configurable variable `format`, which is configured in the `Config.toml` file. As `ballerina/log` is neither the root module nor from the root package, it is provided with its org-name and module-name as a `ballerina.log` prefix. 

    The created package will have the structure below.

    ```bash
    .
    └── userPortal
        ├── Ballerina.toml
        ├── Config.toml
        ├── main.bal
        └── modules
            └── users
                └── users.bal

    ```

6. Execute the command below to build an executable of the package. 
    ```bash
    bal build
    ```
    
    The output will be as shown below.

    ```bash
    Compiling source
            sample/userPortal:0.1.0

    Generating executable
            target/bin/userPortal.jar
    ```

7. Execute the command below to run the program.

    ```bash
    bal run target/bin/userPortal.jar
    ```

    The output will be as shown below.

    ```bash
    Page URL : http://google.com
    Available ports : [9090,9091,9092]
    Admin : {"username":"Bob","age":25}
    Other users : [{"username":"John","age":56},{"username":"Tom","age":14},{"username":"Anna","age":27}]
    {"time":"2021-05-25T14:01:27.948+05:30", "level":"ERROR", "module":"sample/userPortal", "message":"Maximum number of users is 2"}
    ```
