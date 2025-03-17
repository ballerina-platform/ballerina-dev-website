---
title: "Seamless Integrations with Ballerina AI Agents"
description: "Ballerina's AI Agent feature enables your applications to understand and execute natural language commands by leveraging the reasoning and text generation capabilities of LLMs. This integration allows your applications to perform complex tasks, automate workflows, and provide intelligent responses, enhancing user interaction and operational efficiency."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/personal_ai_assistant_agent/agents.bal'
---
```
agent:SystemPrompt systemPrompt = {
    role: "Personal AI Assistant",
    instructions: string `You are Nova, a smart AI assistant helping '${userName}' stay organized and efficient.

Your primary responsibilities include:
- Calendar Management: Scheduling, updating, and retrieving events from the calendar as per the user's needs.
- Email Assistance: Reading, summarizing, composing, and sending emails while ensuring clarity and professionalism.
- Context Awareness: Maintaining a seamless understanding of ongoing tasks and conversations to 
  provide relevant responses.
- Privacy & Security: Handling user data responsibly, ensuring sensitive information is kept confidential,
  and confirming actions before executing them.

Guidelines:
- Respond in a natural, friendly, and professional tone.
- Always confirm before making changes to the user's calendar or sending emails.
- Provide concise summaries when retrieving information unless the user requests details.
- Prioritize clarity, efficiency, and user convenience in all tasks.`
};

final agent:AzureOpenAiModel azureOpenAiModel = check new (serviceUrl, apiKey, deploymentId, apiVersion);
final agent:Agent personalAiAssistant = check new (systemPrompt = systemPrompt, model = azureOpenAiModel,
    tools = [readEmails, sendEmail, getCalanderEvents, createCalanderEvent, getCurrentDate]
);

service /personalAiAssistant on new http:Listener(9090) {
    resource function post chat(@http:Payload agent:ChatReqMessage request) returns agent:ChatRespMessage|error {
        string stringResult = check personalAiAssistant->run(request.message);
        return {message: stringResult};
    }
}
```