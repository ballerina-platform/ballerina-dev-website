---
title: 'Concurrent programming made simple'
description: Sequence diagrams have been used to model concurrency for decades. Ballerina’s concurrent programming model is sequence diagrams along with various concurrency control capabilities that make concurrent programming visual and accessible to all.
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/pattern-scatter-gather/main.bal#L23'
---
```
type Quote record {
    string customerName;
    string product;
    int quantity;
    decimal price;
};

function findBestQuote(QuoteRequest quoteReq) returns Quote {
    // The fork statement starts with one or more named workers, 
    //  which run in parallel with each other 
    fork {
        worker venderA returns Quote|error {
            http:Client venderAEP = check new (venderAURL);
            return venderAEP -> /quote.get(p = quoteReq.product, q = quoteReq.quantity);
        }

        worker venderB returns Quote|error {
            http:Client venderBEP = check new (venderBURL);
            return venderBEP -> /quote.get(p = quoteReq.product, q = quoteReq.quantity);
        }

        worker venderC returns Quote|error {
            http:Client venderCEP = check new (venderCURL);
            return venderCEP -> /quote.get(p = quoteReq.product, q = quoteReq.quantity);
        }
    }

    // Wait for all the workers to finish and collect the results.
    map<Quote|error> quotes = wait {venderA, venderB, venderC};
    return bestQuote(quotes);
}
```