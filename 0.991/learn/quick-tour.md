---
layout: ballerina-inner-page
permalink: /0.991/learn/quick-tour/

---

# Quick Tour

Now that you know a little bit [about Ballerina](/philosophy), let's take it for a spin! 

## Install Ballerina

1. [Download](https://ballerina.io/downloads) Ballerina based on the Operating System you are using. 
1. Follow the instructions given on the [Getting Started](/0.991/learn/getting-started) page to set it up. 

> **Note**: Throughout this documentation, `<ballerina_home>` refers to the directory in which you just installed Ballerina.

## Start a Project, Run a Service, and Invoke It

Start your project by navigating to a directory of your choice and running the following command.

```bash
$ ballerina init
```

You see a response confirming that your project is initialized. This automatically creates a typical Hello World service for you in your directory. A Ballerina service represents a collection of network accessible entry points in Ballerina. A resource within a service represents one such entry point. The generated sample service exposes a network entry point on port 9090.

You can run the service using the `ballerina run` command.

```bash
$ ballerina run hello_service.bal
```

You get the following output.

```bash
ballerina: initiating service(s) in 'hello_service.bal'
ballerina: started HTTP/WS endpoint 0.0.0.0:9090
```

This means your service is up and running. You can invoke the service using an HTTP client. In this case, we use cURL.

```bash
$ curl http://localhost:9090/hello/sayHello
```

> **Tip**: If you do not have cURL installed, you can download it from [https://curl.haxx.se/download.html](https://curl.haxx.se/download.html).

You get the following response.

```
Hello Ballerina!
```

You just started Ballerina, created a project, started a service, invoked the service you created, and received a response.

## Set up the Editor

Let's try this on VS Code.

> **Tip:** You can use your [favorite editor to work on Ballerina code](https://ballerina.io/0.991/learn/tools-ides/).

Open your service in VS Code. You can use the following command to do this on Linux or OSX. Replace '/<folder_path>/' with the actual folder path in which the Ballerina project was initialized.
=======
1. Download and install [VS Code][#https://code.visualstudio.com/Download](https://code.visualstudio.com/Download).

2. Execute the below commands based on your OS to open your service in VS Code. 

```bash
$ code /<folder_path>/hello_service.bal
```

On Windows, use the following.

```bash
$ code <folder_path>\hello_service.bal
```

> **Tip**: If you want to create new .bal files in addition to the Hello World service, you can open the initial project folder into editor using `code /<folder_path>` (on Windows it is `code <folder_path>`. You can also open VS Code and directly navigate to the directory or file.

You can view your service in VS Code.

```ballerina
// A system module containing protocol access constructs
// Module objects referenced with 'http:' in code
import ballerina/http;

# A service is a network-accessible API
# Advertised on '/hello', port comes from listener endpoint
service hello on new http:Listener(9090) {

    # A resource is an invokable API method
    # Accessible at '/hello/sayHello
    # 'caller' is the client invoking this resource

    # + caller - Server Connector
    # + request - Request
    # + return - error, if there is an issue
    resource function sayHello(http:Caller caller, http:Request request) returns error? {

        // Create object to carry data back to caller
        http:Response response = new;

        // Objects and records can have function calls
        response.setTextPayload("Hello Ballerina!");

        // Send a response back to caller
        // Errors are ignored with '_'
        // -> indicates a synchronous network-bound call
        check caller->respond(response);
    }
}
```

You can find an extension for Ballerina in the VS Code marketplace. For instructions on installing and using it, see [The Visual Studio Code Extension](#https://ballerina.io/0.991/learn/tools-ides/vscode-plugin/).

## Use an Endpoint
Ballerina endpoint is a component that interacts with a network accessible service. It aggregates one or more actions that can be executed on the network accessible service. An endpoint can be used to configure parameters related to the network accessible service.

There are two kinds of endpoints in Ballerina, inbound (or ingress) and outbound (or egress) endpoints, a client object is an outbound endpoint, which we would use to send messages to a network service.

Ballerina Central stores numerous modules that can be used with your service. You can search for them using the `ballerina search` command. Use the following command to search for modules where the module name, description, or org name contains the word "twitter".

```
$ ballerina search twitter
```

This results in a list of available modules. You can pull the one you want from Ballerina Central.

```
$ ballerina pull wso2/twitter
```

You can use the `wso2/twitter` module to integrate with a Twitter endpoint.

In your `hello_service.bal` file, import the Twitter module.

```ballerina
import wso2/twitter;
```

> **Note**: You can import the module and use it without using `ballerina pull`. `ballerina pull` ensures code completion.

You can now use Ballerina to integrate with Twitter.

## Send a Tweet

### Before you Begin

Prior to sending a Tweet, you need to create a Twitter app and get some information from Twitter.

> **Note**: You need to have a Twitter account set up with a valid mobile number to try this.

1. Go to [https://apps.twitter.com/](https://apps.twitter.com/) and click **Create New App**.

2. Fill the form that appears and click **Create your Twitter application**.

3. Once your app is created, navigate to the **Keys and Access Tokens** tab. Make note of the **Consumer Key (API Key)** and **Consumer Secret (API Secret)**. Generate an access token in the **Your Access Token** section by clicking **Create my access token**.

4. In the directory where you have your service, create a **twitter.toml** file and add the details you obtained above within the quotes.

```
    # Ballerina demo config file
    consumerKey = ""
    consumerSecret = ""
    accessToken = ""
    accessTokenSecret = ""
```

Now you can program Ballerina to send a tweet.

### Program Ballerina to Send a Tweet

In your `hello_service.bal` file, import the `ballerina/config` module.

```ballerina
import ballerina/config;
```

Add this code after the import statement.

```ballerina
twitter:Client twitterClient = new({
   clientId: config:getAsString("consumerKey"),
   clientSecret: config:getAsString("consumerSecret"),
   accessToken: config:getAsString("accessToken"),
   accessTokenSecret: config:getAsString("accessTokenSecret")
});
```

Here we are creating an client object to connect with the Twitter service. The above configuration is used to configure the connectivity to the Twitter service.

Now you have the Twitter endpoint.

In the `sayHello` resource function, add the following to get the payload as a string.

```ballerina
string status = check request.getTextPayload();
```

Change the signature of the `sayHello` resource function to add `returns error?`, so that `check` will return the error value if `request.getTextPayload()` evaluates to `error`.

> **Tip**: The `check` keyword denotes that if the expression evaluates to `error`, then the returned error is not handled within the same function. For example, when `check` is used with the `sayHello` `resource` `function` and if the given expression evaluates to `error`, the function execution would stop and "500 Internal Server Error" would be set as the response.

Now, you can get the response from Twitter by calling the tweet function. Replace `response.setTextPayload("Hello Ballerina!\n");` in the `sayHello` resource with the following lines of code:

```ballerina
twitter:Status st = check twitterClient->tweet(status);
http:Response response = new;
response.setTextPayload("ID:" + string.convert(st.id) + "\n");
```

The completed source code should look similar to the following:
```ballerina
import ballerina/config;
// A system module containing protocol access constructs
// Module objects referenced with 'http:' in code
import ballerina/http;
import wso2/twitter;

twitter:Client twitterClient = new({
   clientId: config:getAsString("consumerKey"),
   clientSecret: config:getAsString("consumerSecret"),
   accessToken: config:getAsString("accessToken"),
   accessTokenSecret: config:getAsString("accessTokenSecret")
});

@http:ServiceConfig {
   basePath: "/"
}
service hello on new http:Listener(9090) {
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request request) returns error? {
        string status = check request.getTextPayload();
        twitter:Status st = check twitterClient->tweet(status);
        http:Response response = new;
        response.setTextPayload("ID:" + string.convert(untaint st.id) + "\n");

        check caller->respond(response);
    }
}
```


Go ahead and run it and this time pass the config file:

```bash
$ ballerina run --config twitter.toml hello_service.bal
```

Now go to the terminal window and send a request containing the text for the tweet:

```bash
$ curl -d "Ballerina" -X POST localhost:9090/
```

> **Tip**: To ensure that you have root access, run the cURL command using `sudo`.

You just tweeted using Ballerina!

## Deploying on Docker

Now that you have verified your service, let's go ahead and deploy this on Docker.

> **Tip**: This was tested on the community edition version of Docker Edge. You need to have Docker installed to use this. Also start/restart Docker prior to running your code. Windows users should enable **[Expose Daemon without TLS](https://github.com/ballerinax/docker/tree/master/samples#prerequisites)** option.

Import the Docker module.

```ballerina
import ballerinax/docker;
```

Now, let’s add the annotations you need to run the service in Docker. These annotations need to be added to the `listener` endpoint as shown below. The `@docker:CopyFiles` annotation copies the configuration file into the Docker image and the `@docker:Expose` annotation allows you to map an external port to the container port.

```ballerina
// Docker configurations
@docker:Config {
    registry:"registry.hub.docker.com",
    name:"helloworld",
    tag:"v1.0"
}
@docker:CopyFiles {
    files:[
        {source:"./twitter.toml", target:"/home/ballerina/conf/twitter.toml", isBallerinaConf:true}
    ]
}
@docker:Expose {}
listener http:Listener cmdListener = new(9090);

@http:ServiceConfig {
   basePath: "/"
}
service hello on cmdListener {
```

> **Note**: On Windows, make sure Docker runs with Linux containers, and in the general settings, enable `Expose daemon on tcp://localhost:2375 without TLS`. For more information, see the [Docker README file](https://github.com/ballerinax/docker/blob/master/samples/README.md).

Now your code is ready to generate the deployment artifacts. In this case it is a Docker image.

```bash
 $ ballerina build hello_service.bal
```

You see something similar to the following output if this is successful.

```
Compiling source
    hello_service.bal

Generating executable
    hello_service.balx
        @docker                  - complete 3/3

        Run the following command to start a Docker container:
        docker run -d -p 9090:9090 registry.hub.docker.com/helloworld:v1.0

```

Run the following command to start the Docker container:

```bash
$ docker run -d -p 9090:9090 registry.hub.docker.com/helloworld:v1.0
```

> **Tip**: You can run a Docker container and access it with your code by just copying and pasting the `docker run` command that displays as output of the Ballerina build command.

Run the following command to check if Docker is running.

```bash
$ docker images
```

If Docker is running, you will see an output similar to the following.

```
REPOSITORY                                      TAG                 IMAGE ID            CREATED              SIZE
registry.hub.docker.com/helloworld              v1.0                eb4f9888f72f        About a minute ago   127MB
```

Run the following to get details of the Docker container.

```bash
$ docker ps
```

You will see an output similar to the following.

```
CONTAINER ID        IMAGE                                     COMMAND                  CREATED                  STATUS              PORTS                    NAMES
130ded2ae413        registry.hub.docker.com/helloworld:v1.0   "/bin/sh -c 'balleri…"   Less than a second ago   Up 3 seconds        0.0.0.0:9090->9090/tcp   thirsty_hopper
```

Use the following cURL command to invoke your Docker-hosted service.

```bash
$ curl -d "Hello Ballerina" -X POST localhost:9090
```

You have now posted a tweet using the Docker hosted service.

## Push your Module to Ballerina Central

For the `ballerina push` command to work, you need to copy and paste your Ballerina Central access token in `Settings.toml` in your home repository `<USER_HOME>/.ballerina/`.

Register on Ballerina Central and visit the user dashboard at [https://central.ballerina.io/dashboard](https://central.ballerina.io/dashboard) to gain access to your user token.  

When you push a module to Ballerina Central, the runtime validates organizations for the user against the `org-name` defined in your module’s `Ballerina.toml` file.

Therefore, when you have more than one organization in Ballerina Central, be sure to pick the organization name that you intend to push the module into and set that as the `org-name` in `Ballerina.toml` inside the project directory.

You need to build the module prior to pushing the module to Ballerina Central. The `ballerina` build command compiles and creates an executable binary file (i.e., a .balx file).

For more information on the `ballerina build` command run the following.

```bash
$ ballerina help build
```

> **Tip**: You can use `ballerina help <command-name>` for more information on any of the commands.

By default, the output filename for a module is the module name suffixed with `.balx`. The default output replaces the `.bal` suffix with `.balx`.

Build your module.

```bash
$ ballerina build <module-name>
```

Once that is done, push your module to Ballerina Central.

```bash
$ ballerina push <module-name>
```

For example, if you have a Ballerina module named `math`, the following command will push it to Ballerina Central.

```bash
$ ballerina push math
```

For more information on the `ballerina push` command run the following.

```bash
$ ballerina help push
```

## Follow the Repo

<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p> <p data-button="iGitWatchText">"Watch"</p></div>

Star [GitHub repo](https://github.com/ballerina-platform/ballerina-lang)  and show appreciation to Ballerina maintainers for their work. Watch the repo to keep track of Ballerina issues.

## What's Next

Now that you have taken Ballerina around for a quick twirl, you can explore Ballerina more.

* Go through [Ballerina by Example](/0.991/learn/by-example/) to learn Ballerina incrementally with commented examples that cover every nuance of the syntax.
* See [Ballerina by Guide](/0.991/learn/by-guide/) for long form examples that showcase how to build different types of integrations using a complete development lifecycle including IDE configuration, modules, dependencies, coding, unit testing, deployment, and observability.
