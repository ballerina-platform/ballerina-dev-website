# Debug sessions

The VS Code extension provides the three types of sessions below to debug your Ballerina code.

- **Program debug sessions** - debug a Ballerina program
- **Test debug sessions** - debug a test function
- **Remote debug sessions** - debug a Ballerina program that is running remotely

## Debug methods

There are two methods to debug the above sessions.

1. Click on the [**Debug** CodeLens](#debug-using-codelens), which appears at the top of a Ballerina program or a test function.

2. Create a [`launch.json` file](#debug-using-configurations) with the required configuration attributes (use the default configurations or edit them as required) and use either of the options below.
    - **Ballerina Debug**
    - **Ballerina Test**
    - **Ballerina Remote**

## Debug using CodeLens

The Ballerina extension provides multiple options to debug Ballerina applications and the most convenient way is to use the context-aware debug CodeLens support.

You can use the CodeLens for program and test debug sessions as shown in the sections below.

!!! Info
    Use the `launch.json` configurations to launch debug sessions with additional configurations (i.e., program arguments, environment variables), or to start a remote debug session. For more information, see [Debug using configurations](#debug-using-configurations).

### Program debug sessions

Follow the steps below to start a quick debug session using the CodeLens.

1. Open the folder, which includes the Ballerina program you want to debug and open the source file in the editor.

2. Click in front of the line numbers of the file you want to debug to add the required debug points.

3. Click the `Debug` CodeLens, which will appear just above the `main()` method.

<img src="https://wso2.com/ballerina/vscode/docs/img/debug/start-quick-main-debug-session.gif" class="cInlineImage-full"/>

### Test debug sessions

You can use the CodeLens to debug Ballerina test functions as well. The `debug` CodeLens will automatically appear on top of each Ballerina test function. Click on the corresponding CodeLens as shown below to execute/debug only the selected test case.

<img src="https://wso2.com/ballerina/vscode/docs/img/debug/start-quick-test-debug-session.gif" class="cInlineImage-full"/>

## Debug using configurations

Follow the steps below to start a debug session with configurations. All the configurations need to be added in the `launch.json` file.

!!!Info 
    If you launch the debug session through VS Code, the working directory will be the Ballerina package root. However, you can use remote debugging for alternative working directories.

1. Create the `launch.json` file. For instructions, see [Create the configuration file](../../debug-the-code/debug-configurations/#create-the-configuration-file).

    !!! Info
        This enables the **Ballerina Program**, **Ballerina Test**, and **Ballerina Remote** options that are required to debug your code using configurations.

2. Click in front of the line numbers of the file you want to debug to add the required debug points.

3. Start a program, test, or remote debug session as shown below.        

### Program debug sessions

Follow the steps below to start a program debug session.

1. Select **Ballerina Debug** from the drop-down menu available in the upper left corner to start a program debug session.

2. Click the **Start Debugging** icon on the upper left corner to start debugging.

    You will see the output in the **DEBUG CONSOLE**.

    <img src="https://wso2.com/ballerina/vscode/docs/img/debug/program-debug.gif" class="cInlineImage-full"/>

### Test debug sessions 

Follow the steps below to start a test debug session.

1. Select **Ballerina Test** from the drop-down menu available in the upper-left corner to start a test debug session.

2. Click the **Start Debugging** icon in the upper-left corner to start debugging.

    You will see the output in the **DEBUG CONSOLE** as shown below.

    <img src="https://wso2.com/ballerina/vscode/docs/img/debug/test-debug.gif" class="cInlineImage-full"/>

### Remote debug sessions

Follow the steps below to start a remote debug session.

1. Create the `launch.json` configuration file if it is not created already. 

    !!! Info
        For instructions on creating the `launch.json` file, see [Set up debugging configurations](#debugging-configurations).

2. Open the `launch.json` file and configure the `debuggeeHost` and `debuggeePort` attributes under the `Ballerina Remote` configurations section accordingly.

3. After setting the remote debug configurations, select **Ballerina Remote** from the drop-down available in the upper left corner to start a remote debug session.

4. Open a terminal and execute the debug command that is relevant to your requirement from the ones below.

      | Command                   	| Description                                                          	|
      |---------------------------------	|----------------------------------------------------------------------	|
      | `bal run --debug <DEBUGGEE_PORT> <BAL_FILE_PATH/PACKAGE_PATH>`                 	| Debug a Ballerina package or a single file
      | `bal run --debug <DEBUGGEE_PORT> <EXECUTABLE_JAR_FILE_PATH>`                	| Debug a Ballerina executable JAR
      | `bal test --debug <DEBUGGEE_PORT> <PACKAGE_PATH>`                	| Debug Ballerina tests

      The terminal will show the following log.

      ```ballerina
      Listening for transport dt_socket at address: 5005
      ```

5. Click the **Start Debugging** icon on the upper-left corner to start debugging.

      You will see the output in the **DEBUG CONSOLE** as shown below.

      <img src="https://wso2.com/ballerina/vscode/docs/img/debug/remote-debug.gif" class="cInlineImage-full"/>

!!!Info 
    For detailed information on the feature-rich debugging experience for troubleshooting Ballerina applications provided via the Ballerina VS Code extension, see [Debugging features](../debug-features/).