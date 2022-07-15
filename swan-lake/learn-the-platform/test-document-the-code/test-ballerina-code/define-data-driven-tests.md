---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Define data-driven tests
description: Learn how to do write data-driven tests using the ballerina test framework.
keywords: ballerina, programming language, testing, data-driven, data providers
permalink: /learn/test-ballerina-code/define-data-driven-tests/
active: define-data-driven-tests
intro: The Ballerina Test Framework allows you to specify a function that returns a set of data values as a data-provider.
redirect_from:
- /swan-lake/learn/testing-ballerina-code/defining-data-driven-tests/
- /swan-lake/learn/testing-ballerina-code/defining-data-driven-tests
- /learn/user-guide/testing-ballerina-code/defining-data-driven-tests
- /learn/user-guide/testing-ballerina-code/defining-data-driven-tests/
- /learn/user-guide/testing-ballerina-code/
- /learn/user-guide/testing-ballerina-code
- /learn/user-guide/testing-ballerina-code/defining-data-driven-tests/
- /learn/testing-ballerina-code/defining-data-driven-tests/
- /learn/testing-ballerina-code/defining-data-driven-tests
- /learn/testing-ballerina-code/define-data-driven-tests/
- /learn/testing-ballerina-code/define-data-driven-tests
- /learn/test-ballerina-code/define-data-driven-tests
- /learn/guides/testing-ballerina-code/defining-data-driven-tests/
- /learn/guides/testing-ballerina-code/defining-data-driven-tests
---

## Use data providers

A data provider is a function, which will be used to provide the data sets for a test function.
A data provider function supports one of the following return types.

### Map of tuple or error

The key to represent a specific data set can be specified using the key of an entry and data can be specified using the 
value of an entry. The data provider function can return an error to indicate an issue with the data sets.
 
***Example:***

```ballerina
import ballerina/test;

@test:Config {
    dataProvider: dataGen
}
function fruitsDataProviderTest(int value1, int value2, string fruit) returns error? {
    test:assertEquals(value1, value2, msg = "The sum is not correct");
    test:assertEquals(fruit.length(), 6);
}

function dataGen() returns map<[int, int, string]>|error {
    map<[int, int, string]> dataSet = {
        "banana": [10, 10, "banana"],
        "cherry": [5, 5, "cherry"]
    };
    return dataSet;
}
```

***Output:***

```bash
Compiling source
        ballerina_tests/dataproviders:0.1.0

Running Tests

        dataproviders

		[pass] fruitsDataProviderTest#'banana'
		[pass] fruitsDataProviderTest#'cherry'

		2 passing
		0 failing
		0 skipped
```


### Array of arrays or error

***Example:***

```ballerina
import ballerina/test;

@test:Config{
    dataProvider: dataGen
}
function stringDataProviderTest (string fValue, string sValue, string result) returns error? {
    int value1 = check 'int:fromString(fValue);
    int value2 = check 'int:fromString(sValue);
    int result1 = check 'int:fromString(result);
    test:assertEquals(value1 + value2, result1, msg = "The sum is not correct");
    return;
}

function dataGen() returns (string[][]) {
    return [["1", "2", "3"], ["10", "20", "30"], ["5", "6", "11"]];
}
```

***Output:***

```bash
Compiling source
        ballerina_tests/dataproviders:0.1.0

Running Tests

        dataproviders

                [pass] stringDataProviderTest#0
                [pass] stringDataProviderTest#1
                [pass] stringDataProviderTest#2

                3 passing
                0 failing
                0 skipped
```

## Execute specific data sets

If you need to run only a specific case from the given data set, you can use the test name with the key to do that.
You can make use of wild cards(`*`) to capture multiple cases as well.

***Example:***

The following is an example to execute map data sets.
>**Note:** Include the key within double-quotes.

```bash
$ bal test --tests fruitsDataProviderTest#"'banana'"

Compiling source
	intg_tests/dataproviders:0.0.0

Running Tests

	dataproviders

		[pass] fruitsDataProviderTest#'banana'

		1 passing
		0 failing
		0 skipped
```

***Example:***

The following is an example to execute array data sets.

```bash
$ bal test --tests stringDataProviderTest#1

Compiling source
        ballerina_tests/dataproviders:0.1.0

Running Tests

        dataproviders

                [pass] stringDataProviderTest#1
                
                1 passing
                0 failing
                0 skipped
```
