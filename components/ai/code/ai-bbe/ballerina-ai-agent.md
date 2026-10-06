---
title: "Seamless integrations with Ballerina AI agents"
description: "Ballerina's AI agents enable your applications to understand and execute natural language commands by leveraging the reasoning capabilities of LLMs. Define the tools as Ballerina functions, and the agent decides when to call them, automating workflows and driving intelligent outcomes."
url: 'https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/chat-agents'
---
```
import ballerina/ai;
import ballerina/http;
import ballerina/time;

// Define the functions that the agent can use as tools.
@ai:AgentTool
isolated function addTask(string description, time:Date? dueBy) returns error? {
    // ...
}

@ai:AgentTool
isolated function listTasks() returns Task[] {
    // ...
}

// Define an AI agent with a system prompt and a set of tools.
final ai:Agent taskAssistantAgent = check new ({
    systemPrompt: {
        role: "Task Assistant",
        instructions: string `You are a helpful assistant for 
            managing a to-do list. You can manage tasks and
            help a user plan their schedule.`
    },
    tools: [addTask, listTasks],
    // Use the default model provider, or a `ballerinax/ai.<provider>` 
    // model provider with your own keys.
    model: check ai:getDefaultModelProvider()
});

// Expose the agent as a chat service.
service /tasks on new ai:Listener(8080) {
    resource function post chat(@http:Payload ai:ChatReqMessage request) 
            returns ai:ChatRespMessage|error {
        string response = check taskAssistantAgent.run(request.message, request.sessionId);
        return {message: response};
    }
}
```
