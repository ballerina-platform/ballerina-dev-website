---
layout: ballerina-configurable-left-nav-pages-swanlake
title: Configure a sample Ballerina service
description: Ballerina supports configurability through the configurable, module-level variables.
keywords: ballerina, programming language, configurable, variables
permalink: /learn/configure-ballerina-programs/configure-a-sample-ballerina-service/
active: configure-a-sample-ballerina-service/
intro: Configurability enables users to modify the system behavior through external user inputs. Ballerina Language provides an in-built functionality to configure values at runtime through configurable  module-level variables.
redirect_from:
- /learn/user-guide/configurability/defining-configurable-variables
- /learn/user-guide/configurability/defining-configurable-variables/
- /learn/user-guide/configurability/
- /learn/user-guide/configurability
- /learn/making-ballerina-programs-configurable/
- /learn/making-ballerina-programs-configurable
- /learn/making-ballerina-programs-configurable/defining-configurable-variables
- /learn/user-guide/configurability/trying-it-out
- /learn/user-guide/configurability/trying-it-out/
- /learn/making-ballerina-programs-configurable/trying-it-out
- /learn/making-ballerina-programs-configurable/trying-it-out/
- /learn/making-ballerina-programs-configurable/trying-out-configurability
- /learn/configuring-ballerina-programs
- /learn/configuring-ballerina-programs/
- /learn/configure-ballerina-programs/
- /learn/configure-ballerina-programs
- /learn/configuring-ballerina-programs/quick-start-on-configurable-variables
- /learn/configuring-ballerina-programs/quick-start-on-configurable-variables/
- /learn/making-ballerina-programs-configurable/defining-configurable-variables/
- /learn/making-ballerina-programs-configurable/defining-configurable-variables
- /learn/configure-ballerina-programs/quick-start-on-configurable-variables/ 
- /learn/configure-ballerina-programs/quick-start-on-configurable-variables
- /learn/guides/configuring-ballerina-programs/quick-start-on-configurable-variables/
- /learn/guides/configuring-ballerina-programs/quick-start-on-configurable-variables
- /learn/configure-ballerina-programs/configure-a-sample-ballerina-service
---

Consider the following step-by-step guide to configuring a Ballerina package that contains an HTTP service.

1. Create a Ballerina package using the following command.

    ```bash
    bal new greetings
    ```

2. Replace the content of the file `main.bal` with the following.

   ```ballerina
   import ballerina/http;
   
   type Greeting record {|
      string to;
      string content;
   |};
   
   configurable int port = 9090;
   configurable Greeting greeting = ?;
   
   service http:Service / on new http:Listener(port) {
      resource function post greeting() returns string {
         string message = string `Hello ${greeting.to}! ${greeting.content}`;
         return message;
      }
   }
   ```

   Here, we created a Ballerina package named `greetings` that contains configurable variables `port` and `greeting` with
   respective types `int` and  `Greeting`. These variables are used in the HTTP service where the resource function
   `greeting()` provides a configured message.<br>
   The variable `port` is initialized with a default value `9090`, which indicates that the configuration is optional. This
   value will be used for the variable initialization in case the configuration value will not be provided by the user at the runtime.<br>
   The variable `greeting` is initialized with the `?` syntax, which indicates that providing a configuration value is mandatory. Therefore,
   the program will finish the execution abruptly with a runtime exception, if the value is not provided at the runtime.

3. To provide the values for `port` and `greeting` through a configuration file, create a file named `Config.toml`
   with the following content in the package root directory.

   ```toml
   port = 8080
 
   [greeting]
   to = "Tom"
   content = "Good Morning!"
   ```

4. Execute the following command to build and execute the program.
   ```bash
   bal run
   ```

   The output will be as follows.

   ```
   Compiling source
        sample/greetings:0.1.0

   Running executable
   ```
   This will start the HTTP service on the configured endpoint `8080`.


6. To verify the configuration, execute the following command.
   ```bash
   curl http://localhost:8080/greeting -X POST
   ```
   The response will be similar to the following.
   ```
   Hello Tom! Good Morning!
   ```
