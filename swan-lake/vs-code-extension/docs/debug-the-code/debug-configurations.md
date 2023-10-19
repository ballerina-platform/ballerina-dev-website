# Debug configurations

The Ballerina debugger supports various debug configuration options via the `launch.json` file.

## Create the configuration file

Follow the steps below to generate the `launch.json` configurations file with the [default attributes](#default-configurations).

!!! Info
      Creating the `launch.json` file enables the **Ballerina Program**, **Ballerina Test**, and **Ballerina Remote** options that are required to [debug your code using configurations](#default-configurations).

1. Open the folder, which includes the Ballerina program you want to debug and select the file.

2. Press the `Ctrl + Shift + D` keys (for macOS: `⌘ + ↑ + D`) to launch the Debugger view.

3. Click **create a launch.json** file and then select **Ballerina Debug** as the **Environment**. 

    <img src="https://wso2.com/ballerina/vscode/docs/img/debug/start-debug-session.gif" class="cInlineImage-full"/>

    !!! Info
        This generates a `launch.json` file in your workspace root under the `.vscode` directory. You can edit the [configuration attributes](#configuration-attributes) to perform advanced debugging operations.

4. Add/edit the relevant configurations for debugging in the opened `launch.json` file.   

## Default configurations

Given below are the default configurations generated in the `launch.json` file for debugging Ballerina.

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Ballerina Debug",
            "type": "ballerina",
            "request": "launch",
            "programArgs": [],
            "commandOptions": [],
            "env": {}
        },
        {
            "name": "Ballerina Test",
            "type": "ballerina",
            "request": "launch",
            "debugTests": true,
            "programArgs": [],
            "commandOptions": [],
            "env": {}
        },
        {
            "name": "Ballerina Remote",
            "type": "ballerina",
            "request": "attach",
            "debuggeeHost": "127.0.0.1",
            "debuggeePort": "5005"
        }
    ]
}
```

## Configuration attributes

You can edit the configurations of the auto-generated `launch.json` file, which is located in your workspace root under the `.vscode` directory. 

!!! Info
    This file consists of three debug configurations named `Ballerina Debug`, `Ballerina Test`, and `Ballerina Remote`. Each configuration supports a different set of attributes, which will be provided via IntelliSense completion suggestions.

### Attributes for all configurations

The following attributes are mandatory for all configurations.

| Attribute                     	| Description                                                          	|
|---------------------------------	|----------------------------------------------------------------------	|
| `name`                 	| The reader-friendly name to appear in the debug launch configuration drop-down menu.                                  	|
| `type`  	| The type of debugger to use for this launch configuration. The attribute value must be kept as `ballerina` for all Ballerina debug configuration types.                   	|
| `request` 	| The request type of this launch configuration. Currently, `launch` and `attach` are supported.                                               	|

### Attributes for the `launch` configurations

The following attributes are supported by all the Ballerina `launch` configurations related to the Ballerina code available locally.

| Attribute        	| Description                                                                                                                                                                                                                                                                                                                                                           	|
|------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `programArgs`    	| Any program arguments that are required to be passed into the `main` function of the Ballerina program to be launched can be passed as a list of strings.                                                                                                                                                                                                              	|
| `commandOptions` 	| If required, you can configure command options for the Ballerina program to be launched as a list of strings. You can see the list of all the available command options by executing the following CLI commands in your terminal. <br/><br/> - For the `Ballerina debug` configuration: `bal run --help` <br/> - For the `Ballerina test` configuration: `bal test --help` 	|
| `env`            	| Any environment variables you need to configure for launching the Ballerina program can be passed as a map of strings (name and value).                                                                                                                                                                                                                                	|
| `debugTests`     	| Indicates whether to debug the tests for the given script.                                                                                                                                                                                                                                                                                                             	|
| `terminal`     	| By setting this attribute value to `integrated`, you can launch the Ballerina program in a separate integrated VS Code terminal. The program evaluations can be carried out on the **Debug Console** as usual.                                                                                                                                                                                                                                                                                                             	|

### Attributes for the `attach` configurations

The following attributes are supported by all the Ballerina `attach` configurations related to the Ballerina code available remotely.

| Attribute                      	| Description                                                          	|
|---------------------------------	|----------------------------------------------------------------------	|
| `debuggeeHost`                 	| Host address of the remote process to be attached (if not specified, the default value will be the localhost(`127.0.0.1`)).  |
| `debuggeePort`                 	| Port number of the remote process to be attached. 
