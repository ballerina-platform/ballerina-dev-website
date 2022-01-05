---
layout: ballerina-configurable-left-nav-pages-swanlake title: Configuring Ballerina Programs description: Ballerina
supports configurability through the configurable, module-level variables. keywords: ballerina, programming language,
configurable, variables, permalink: /learn/configuring-ballerina-programs/ active: configuring-ballerina-programs intro:
Ballerina supports configurability through the configurable, module-level variables. redirect_from:

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
- /learn/configuring-ballerina-programs/configuring-a-sample-ballerina-service
- /learn/configuring-ballerina-programs/configuring-a-sample-ballerina-service/

---

## Configuring a Sample Ballerina Service

Configurability enables users to modify the system behavior through external user inputs. Ballerina Language provides an
in-built functionality to configure values at runtime through configurable variables.

Consider the following step-by-step guide to configure a Ballerina package that contains an HTTP service.

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

   Here, we created a Ballerina Package `greetings` that contains configurable variables `port` and `greeting` with
   respective types `int` and  `Greeting`. These variables are used in an HTTP service where the resource function
   `greeting()` provides a configured message.<br><br>
   The variable `port` is initialized with a default value `9090` which indicates the configuration is optional. This
   value will be used for the variable initialization, if the configuration value is not provided.<br><br>
   The variable `greeting` is initialized with a `?`  expression which indicates the configuration is mandatory. The
   program will fail if such a value is not provided.


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

## Additional Information

For more information on the configurable variables, please refer:

- [Providing Values to Configurable Variables](/learn/configuring-ballerina-programs/providing-values-to-configurable-variables/)
    - [Providing configuration values through Command Line Arguments](/learn/configuring-ballerina-programs/providing-values-to-configurable-variables/#providing-configuration-values-through-command-line-arguments)
    - [Providing configuration values through TOML Syntax](/learn/configuring-ballerina-programs/providing-values-to-configurable-variables/#providing-configuration-values-through-toml-syntax)
- [Providing module information of the configurable variable](/learn/configuring-ballerina-programs/providing-values-to-configurable-variables/#providing-module-information-of-the-configurable-variable)
- [Configure values in Kubernetes Environment](/learn/configuring-ballerina-programs/configure-values-in-kubernetes-environment)
    - [Securing sensitive data using configurable variables](/learn/configuring-ballerina-programs/configure-values-in-kubernetes-environment/#securing-sensitive-data-using-configurable-variables)
