---
lang: ballerina
---
```
// ... answerOf, checkToolCalls, and judgeModel (temperature 0.0) are in the full sample

type JudgeVerdict record {|
    # Score from 1 (wrong or unhelpful) to 5 (the same facts and action as the reference answer)
    @constraint:Int {minValue: 1, maxValue: 5}
    int score;
    # One sentence that explains the score
    string reason;
|};

# Execution order: an order must be looked up before it is cancelled.
isolated function checkSequence(ai:FunctionCall[] actual) returns string[] {
    string[] lookedUp = [];
    string[] violations = [];
    foreach ai:FunctionCall call in actual {
        string orderId = (call.arguments ?: {})["orderId"].toString();
        if call.name == "getOrder" {
            lookedUp.push(orderId);
        } else if call.name == "cancelOrder" && lookedUp.indexOf(orderId) == () {
            violations.push(string `cancelOrder(${orderId}) called before getOrder(${orderId})`);
        }
    }
    return violations;
}

# Model-based judge: compares the answer with the reference answer.
isolated function judgeAnswer(ai:ModelProvider judge, string question, string reference, string actual)
        returns JudgeVerdict|error {
    JudgeVerdict|error verdict = judge->generate(`Compare the actual answer of an order support agent
        with the reference answer. Score 5 if it gives the same facts and action, 1 if it is wrong.
        Customer message: ${question}
        Reference answer: ${reference}
        Actual answer: ${actual}`);
    if verdict is error {
        return error(string `[EXEC] judge failed: ${verdict.message()}`, verdict);
    }
    return constraint:validate(verdict); // generate checks the shape, not the 1-5 range
}
```
