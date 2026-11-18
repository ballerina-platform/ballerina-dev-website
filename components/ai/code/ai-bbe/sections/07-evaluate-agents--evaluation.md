---
lang: ballerina
---
```
import ballerina/ai;
import ballerina/test;

const EVALSET_PATH = "tests/resources/evalsets/order_support.evalset.json";

isolated function orderThreads() returns map<[readonly & ai:ConversationThread]>|error =>
    ai:loadConversationThreads(EVALSET_PATH);

@test:Config {groups: ["live-eval"], dataProvider: orderThreads, runs: 3, minPassRate: 0.8}
isolated function evaluateOrderAgent(ai:ConversationThread thread) returns error? {
    ai:Agent agent = check createOrderAgent(model); // fresh memory for each thread
    foreach ai:Trace expected in thread.traces {
        string question = ai:getUserQuery(expected);
        ai:Trace actual = check agent.run(question, thread.id); // expected type ai:Trace
        string answer = check answerOf(actual, expected.id);    // [EXEC] if the run failed

        ai:FunctionCall[] calls = actual.toolCalls ?: [];
        string[] violations = [
            ...checkToolCalls(expected.toolCalls ?: [], calls), // tool names and arguments
            ...checkSequence(calls)                             // execution order
        ];
        test:assertTrue(violations.length() == 0,
                string `[CHECK] [${expected.id}] rule violations: ${violations.toString()}`);

        JudgeVerdict verdict = check judgeAnswer(judgeModel, question, check answerOf(expected), answer);
        test:assertTrue(verdict.score >= MIN_JUDGE_SCORE,
                string `[CHECK] [${expected.id}] judge score ${verdict.score}: ${verdict.reason}`);
    }
}
```
