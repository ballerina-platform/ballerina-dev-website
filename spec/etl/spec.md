# Specification: Ballerina ETL Library

_Authors_: [@InduwaraGayashan001](https://github.com/InduwaraGayashan001) \
_Reviewers_: [@ThisaruGuruge](https://github.com/ThisaruGuruge) \
_Created_: 2025/04/25 \
_Edition_: Swan Lake

## Introduction

This is the specification for the ETL library of the [Ballerina language](https://ballerina.io), which provides a collection of ETL operations designed for data processing and manipulation.

The ETL library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` on GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Configurations](#2-configurations)
3. [Data Categorization](#3-data-categorization)  
    * 3.1 [Categorization by Numeric Ranges](#31-categorization-by-numeric-ranges)  
    * 3.2 [Categorization by Regular Expressions](#32-categorization-by-regular-expressions)  
    * 3.3 [Categorization by Semantic Matching](#33-categorization-by-semantic-matching)
4. [Data Cleaning](#4-data-cleaning)
    * 4.1 [Group Approximate Duplicates](#41-group-approximate-duplicates)
    * 4.2 [Handle Whitespaces](#42-handle-whitespaces)
    * 4.3 [Remove Dupicates](#43-remove-duplicates)
    * 4.4 [Remove a Field](#44-remove-a-field)
    * 4.5 [Remove Empty Values](#45-remove-empty-values)
    * 4.6 [Replace Text](#46-replace-text)
    * 4.7 [Sort](#47-sort)
    * 4.8 [Standardize](#48-standardize)
5. [Data Enrichment](#5-data-enrichment)
    * 5.1 [Join](#51-join)
    * 5.2 [Merge](#52-merge)
6. [Data Filtering](#6-data-filtering)
    * 6.1 [Filter by Random Sampling](#61-filter-by-random-sampling)
    * 6.2 [Filter by a Regular Expression](#62-filter-by-a-regular-expression)
    * 6.3 [Filter by a Relative Expression](#63-filter-by-a-relative-expression)
7. [Data Security](#7-data-security)
    * 7.1 [Encryption](#71-encryption)
    * 7.2 [Decryption](#72-decryption)
    * 7.3 [Masking](#73-masking)
8. [Unstructured Data Extraction](#8-unstructured-data-extraction)
    * 8.1 [Extract from Text](#81-extract-from-text)

## 1. Overview

The APIs in this package are categorized into the following ETL process stages:

1. Data Categorization
2. Data Cleaning
3. Data Enrichment
4. Data Filtering
5. Data Security
6. Unstructured Data Extraction

## 2. Configurations

Following APIs in this package utilize **OpenAI services** and require an **OpenAI API key** for operation.

* [`categorizeSemantic`](#33-categorization-by-semantic-matching)
* [`extractFromText`](#81-extract-from-text)
* [`groupApproximateDuplicates`](#41-group-approximate-duplicates)
* [`maskSensitiveData`](#73-masking)
* [`standardizeData`](#48-standardize)

> **Note**: Configuration is required only for the APIs listed above. It is not needed for the use of any other APIs in this package.

### Setting up the OpenAI API Key

1. [Create an OpenAI account](https://platform.openai.com) and obtain an [API key](https://platform.openai.com/account/api-keys).
2. Add the obtained [API key](https://platform.openai.com/account/api-keys) and a supported [GPT model](#supported-gpt-models) in the `Config.toml` file as shown below:

```toml
[ballerina.etl.modelConfig]
openAiToken = "<OPENAI_API_KEY>"
model = "<GPT_MODEL>"
```

#### Supported GPT Models

* `"gpt-4-turbo"`
* `"gpt-4o"`
* `"gpt-4o-mini"`

### **(Optional)** Overriding Client Timeout

The default client timeout is set to 60 seconds. This value can be adjusted by specifying the `timeout` field as shown below:

```toml
[ballerina.etl.modelConfig]
openAiToken = "<OPENAI_API_KEY>"
model = "<GPT_MODEL>"
timeout = 120.0
```

## 3. Data Categorization

APIs for categorizing datasets based on numeric ranges, regular expressions, and semantic classification.

### 3.1 Categorization by Numeric Ranges

This API Categorizes a dataset based on the value of a numeric field using defined range boundaries.

```ballerina
# Categorizes a dataset based on a numeric field and specified ranges.
# ```ballerina
# Order[] dataset = [
#     { orderId: 1, customerName: "Alice", totalAmount: 5.3 },
#     { orderId: 2, customerName: "Bob", totalAmount: 10.5 },
#     { orderId: 3, customerName: "John", totalAmount: 15.0 },
#     { orderId: 4, customerName: "Charlie", totalAmount: 25.0 },
#     { orderId: 5, customerName: "David", totalAmount: 29.2 }
# ];
# CategoryRanges categoryRanges = [0, [10,20], 30];
# Order[][] categorized = check etl:categorizeNumeric(dataset, "totalAmount", categoryRanges);
#
# =>[[{ orderId: 1, customerName: "Alice", totalAmount: 5.3 }],
#    [{ orderId: 2, customerName: "Bob", totalAmount: 10.5 }, { orderId: 3, customerName: "John", totalAmount: 15.0 }],
#    [{ orderId: 4, customerName: "Charlie", totalAmount: 25.0 }, { orderId: 5, customerName: "David", totalAmount: 29.2 }]]
# ```
#
# + dataset - Array of records containing numeric values.
# + fieldName - Name of the numeric field to categorize.
# + categoryRanges - Numeric ranges for categorization.
# + returnType - The type of the return value (Ballerina record array).
# + return - A nested array of categorized records or an `etl:Error`.
public function categorizeNumeric(record {}[] dataset, string fieldName, CategoryRanges categoryRanges, typedesc<record {}> returnType = <>) returns returnType[][]|Error;
```

This API expects category boundaries to be defined using the `CategoryRanges` tuple type:

```ballerina
# Represents the category ranges in the `categorizeNumeric` API.
# - `float` - Represents the minimum value.
# - `float[]` - Represents the intermediate breakpoints.
# - `float` - Represents the maximum value.
public type CategoryRanges [float, float[], float];
```

### 3.2 Categorization by Regular Expressions

This API Categorizes a dataset based on a specified string field using a list of regular expressions.

```ballerina
# Categorizes a dataset based on a string field using a set of regular expressions.
# ```ballerina
# Customer[] dataset = [
#     { name: "Alice", city: "New York" },
#     { name: "Bob", city: "Colombo" },
#     { name: "Charlie", city: "Los Angeles" },
#     { name: "John", city: "Boston" }
# ];
# regexp:RegExp[] regexArray = [re `A.*$`, re `^B.*$`, re `^C.*$`];
# Customer[][] categorized = check etl:categorizeRegex(dataset, "city", regexArray);
#
# =>[[{ name: "Alice", city: "New York" }],
#    [{ name: "Bob", city: "Colombo" }],
#    [{ name: "Charlie", city: "Los Angeles" }]]
# ```
#
# + dataset - Array of records containing string values.
# + fieldName - Name of the string field to categorize.
# + regexArray - Array of regular expressions for matching categories.
# + returnType - The type of the return value (Ballerina record array).
# + return - A nested array of categorized records or an `etl:Error`.
public function categorizeRegex(record {}[] dataset, string fieldName, regexp:RegExp[] regexArray, typedesc<record {}> returnType = <>) returns returnType[][]|Error;
```

### 3.3 Categorization by Semantic Matching

This API uses semantic similarity to classify records based on the content of a given string field. It maps each record to the most relevant category provided by the user.

> **Note**: [Required configurations](#2-configurations) must be provided before invoking this API.

```ballerina
# Categorizes a dataset based on a string field using semantic classification.
# ```ballerina
# Review[] dataset = [
#     { id: 1, comment: "Great service!" },
#     { id: 2, comment: "Good service!" },
#     { id: 3, comment: "blh blh blh" },
#     { id: 4, comment: "Terrible experience" },
# ];
# Review[][] categorized = check etl:categorizeSemantic(dataset, "comment", ["Positive", "Negative"]);
#
# =>[[{ id: 1, comment: "Great service!" }, { id: 2, comment: "Good service!" }],
#    [{ id: 4, comment: "Terrible experience" }]]
# ```
#
# + dataset - Array of records containing textual data.
# + fieldName - Name of the field to categorize.
# + categories - Array of category names for classification.
# + returnType - The type of the return value (Ballerina record array).
# + return - A nested array of categorized records or an `etl:Error`.
public function categorizeSemantic(record {}[] dataset, string fieldName, string[] categories, typedesc<record {}> returnType = <>) returns returnType[][]|Error;
```

## 4. Data Cleaning

APIs for cleaning and formatting datasets.

### 4.1 Group Approximate Duplicates

This API identifies and groups approximate duplicates in a dataset. It returns a nested array where the first array contains unique records, and the subsequent arrays contain groups of similar (approximate) duplicates.

> **Note**: [Required configurations](#2-configurations) must be provided before invoking this API. It is recommended to use datasets with fewer than 200 records for optimal performance.

```ballerina
# Identifies and groups approximate duplicates in a dataset, returning a nested array with unique records first, followed by groups of similar records.
# ```ballerina
# Customer[] dataset = [
#     { name: "Alice", city: "New York" },
#     { name: "Alice", city: "new york" },
#     { name: "Bob", city: "Boston" },
#     { name: "Charlie", city: "Los Angeles" },
#     { name: "Charlie", city: "los angeles - usa" },
#     { name: "John", city: "Chicago" }
# ];
# Customer[][] result = check etl:groupApproximateDuplicates(dataset);
#
# => [[{ name: "Bob", city: "Boston" },{ name: "John", city: "Chicago" }],
#     [{ name: "Alice", city: "New York" },{ name: "Alice", city: "new york" }],
#     [{ name: "Charlie", city: "Los Angeles" },{ name: "Charlie", city: "los angeles - usa" }]]
# ```
#
# + dataset - Array of records that may contain approximate duplicates.
# + returnType - The type of the return value (Ballerina record).
# + return - A nested array of records where the first array contains all unique records that do not have any duplicates,
# and the remaining arrays contain duplicate groups or an `etl:Error`.
public function groupApproximateDuplicates(record {}[] dataset, typedesc<record {}> returnType = <>) returns returnType[][]|Error;
```

### 4.2 Handle Whitespaces

This API processes the given dataset of records and returns a new dataset where leading and trailing whitespace in string fields are removed, and multiple consecutive spaces within strings are replaced with a single space.

```ballerina
# Returns a new dataset with all extra whitespace removed from string fields.
# ```ballerina
# Customer[] dataset = [
#     { name: "  Alice  ", city: "  New   York  " },
#     { name: "  Bob  ", city: "  Los Angeles  " },
#     { name: "  Charlie  ", city: "  Chicago  " }
# ];
# Customer[] cleanedData = check etl:handleWhiteSpaces(dataset);
#
# => [{ name: "Alice", city: "New York" },
#     { name: "Bob", city: "Los Angeles" },
#     { name: "Charlie", city: "Chicago" }]
# ```
#
# + dataset - Array of records with possible extra spaces.
# + returnType - The type of the return value (Ballerina record).
# + return - A dataset where multiple spaces are replaced with a single space, and values are trimmed or an `etl:Error`.
public function handleWhiteSpaces(record {}[] dataset, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 4.3 Remove Duplicates

This API processes the given dataset of records and returns a new dataset with all duplicate records removed.

```ballerina
# Returns a new dataset with all duplicate records removed.
# ```ballerina
# Customer[] dataset = [
#     { name: "Alice", city: "New York" },
#     { name: "Alice", city: "New York" },
#     { name: "Bob", city: "Los Angeles" },
#     { name: "Charlie", city: "Chicago" },
#     { name: "Charlie", city: "Chicago" }
# ];
# Customer[] uniqueData = check etl:removeDuplicates(dataset);
#
# => [{ name: "Alice", city: "New York" },
#     { name: "Bob", city: "Los Angeles" },
#     { name: "Charlie", city: "Chicago" }]
# ```
#
# + dataset - Array of records that may contain duplicates.
# + returnType - The type of the return value (Ballerina record).
# + return - A dataset with duplicates removed or an `etl:Error`.
public function removeDuplicates(record {}[] dataset, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 4.4 Remove a Field

This API processes the given dataset of records and returns a new dataset with a specified field removed from each record.

```ballerina
# Returns a new dataset with a specified field removed from each record.
# ```ballerina
# Customer[] dataset = [
#     { name: "Alice", city: "New York", age: 25 },
#     { name: "Bob", city: "Los Angeles", age: 30 },
#     { name: "Charlie", city: "Chicago", age: 35 }
# ];
# NewCustomer[] updatedData = check etl:removeField(dataset, "age");
#
# => [{ name: "Alice", city: "New York" },
#     { name: "Bob", city: "Los Angeles" },
#     { name: "Charlie", city: "Chicago" }]
# ```
#
# + dataset - Array of records with fields to be removed.
# + fieldName - The name of the field to remove from each record.
# + returnType - The type of the return value (Ballerina record).
# + return - A new dataset with the specified field removed from each record or an `etl:Error`.
public function removeField(record {}[] dataset, string fieldName, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 4.5 Remove Empty Values

This API processes the given dataset of records and returns a new dataset with all records containing nil or empty string values removed.

```ballerina
# Returns a new dataset with all records containing nil or empty string values removed.
# ```ballerina
# Customer[] dataset = [
#     { name: "Alice", city: "New York" },
#     { name: "Bob", city: null },
#     { name: "", city: "Los Angeles" },
#     { name: "Charlie", city: "Boston" },
#     { name: "David", city: () }
# ];
# NewCustomer[] filteredData = check etl:removeNull(dataset);
#
# => [{ name: "Alice", city: "New York" },
#     { name: "Charlie", city: "Boston" }]
# ```
#
# + dataset - Array of records containing potential null or empty fields.
# + returnType - The type of the return value (Ballerina record).
# + return - A dataset with records containing nil or empty string values removed or an `etl:Error`.
public function removeEmptyValues(record {}[] dataset, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 4.6 Replace Text

This API processes the given dataset of records and returns a new dataset where all occurrences that match a specified regular expression in a specific string field are replaced with a new value.

```ballerina
# Returns a new dataset where matches of the given regex pattern in a specified string field are replaced with a new value.
# ```ballerina
# Customer[] dataset = [
#     { name: "Alice", city: "New York" },
#     { name: "Bob", city: "Los Angeles" },
#     { name: "Charlie", city: "Chicago" }
# ];
# Customer[] updatedData = check etl:replaceText(dataset, "city", re `New York`, "San Francisco");
#
# => [{ name: "Alice", city: "San Francisco" },
#     { name: "Bob", city: "Los Angeles" },
#     { name: "Charlie", city: "Chicago" }]
# ```
#
# + dataset - Array of records where text in a specified field will be replaced.
# + fieldName - The name of the field where text replacement will occur.
# + searchValue - A regular expression to match text that will be replaced.
# + replaceValue - The value that will replace the matched text.
# + returnType - The type of the return value (Ballerina record).
# + return - A new dataset with the replaced text in the specified field or an `etl:Error`.
public function replaceText(record {}[] dataset, string fieldName, regexp:RegExp searchValue, string replaceValue, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 4.7 Sort

This API processes the given dataset of records and returns a new dataset sorted by a specified field in ascending or descending order.

```ballerina
# Returns a new dataset with all string values in a specified field standardized to a set of standard values.
# ```ballerina
# Customer[] dataset = [
#     { name: "Alice", age: 25 },
#     { name: "Bob", age: 30 },
#     { name: "Charlie", age: 22 }
# ];
# Customer[] sortedData = check etl:sort(dataset, "age");
#
# => [{ name: "Charlie", age: 22 },
#     { name: "Alice", age: 25 },
#     { name: "Bob", age: 30 }]
# ```
#
# + dataset - Array of records to be sorted.
# + fieldName - The field by which sorting is performed.
# + direction - direction in which to sort the data.
# + returnType - The type of the return value (Ballerina record).
# + return - A sorted dataset based on the specified field or an `etl:Error`.
public function sortData(record {}[] dataset, string fieldName, SortDirection direction = ASCENDING, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

This API expects sorting direction to be defined using the `SortDirection` enum:

```ballerina
# Represents the direction for the `sortData` API
#
# + ASCENDING - Sorts the data in ascending order.
# + DESCENDING - Sorts the data in descending order.
public enum SortDirection {
    ASCENDING = "ascending",
    DESCENDING = "descending"
}
```

### 4.8 Standardize

This API processes the given dataset of records and returns a new dataset with all string values in a specified field standardized to a set of standard values.

> **Note**: [Required configurations](#2-configurations) must be provided before invoking this API.

```ballerina
# Returns a new dataset with all string values in a specified field standardized to a set of standard values.
# ```ballerina
# Customer[] dataset = [
#     { name: "Alice", city: "New York" },
#     { name: "Bob", city: "new york" },
#     { name: "Charlie", city: "los-angeles" },
#     { name: "John", city: "newyork -usa" }    
# ];
# Customer[] standardizedData = check etl:standardizeData(dataset, "city", ["New York", "Los Angeles"]);
#
# => [{ name: "Alice", city: "New York" },
#     { name: "Bob", city: "New York" },
#     { name: "Charlie", city: "Los Angeles" },
#     { name: "John", city: "New York" }]
# ```
#
# + dataset - Array of records containing string values to be standardized.
# + fieldName - The name of the field to standardize.
# + standardValues - An array of standard values to replace approximate matches.
# + returnType - The type of the return value (Ballerina record).
# + return - An updated dataset with standardized string values or an error if the operation fails or an `etl:Error`.
public function standardizeData(record {}[] dataset, string fieldName, string[] standardValues, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

## 5. Data Enrichment

APIs for enriching datasets by merging and combining them with additional information.

### 5.1 Join

This API performs a join operation between two datasets using a common field and returns a new dataset where matching records from both datasets are merged into single records.

```ballerina
# Merges two datasets based on a common specified field and returns a new dataset with the merged records.
# ```ballerina
# CustomerPersonalDetails[] dataset1 = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
# CustomerContactDetails[] dataset2 = [{ id: 1, phone: 0123456789 }, { id: 2, phone: 0987654321 }];
# Customer[] mergedData = check etl:joinData(dataset1, dataset2, "id");
#
# => [{ id: 1, name: "Alice", phone: 0123456789 },
#     { id: 2, name: "Bob", phone: 0987654321 }]
# ```
#
# + dataset1 - First dataset containing base records.
# + dataset2 - Second dataset with additional data to be merged.
# + fieldName - The field used to match records between the datasets.
# + returnType - The type of the return value (Ballerina record).
# + return - A merged dataset with updated records or an `etl:Error`.
public function joinData(record {}[] dataset1, record {}[] dataset2, string fieldName, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 5.2 Merge

This API takes a nested array of datasets and flattens it into a single dataset by combining all inner arrays into one continuous array of records.

```ballerina
# Merges multiple datasets into a single dataset by flattening a nested array of records.
# ```ballerina
# Customer[][] dataSets = [
#     [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }],
#     [{ id: 3, name: "Charlie" }, { id: 4, name: "David" }]
# ];
# Customer[] mergedData = check etl:mergeData(dataSets);
#
# => [{ id: 1, name: "Alice" },
#     { id: 2, name: "Bob" },
#     { id: 3, name: "Charlie" },
#     { id: 4, name: "David" }]
# ```
#
# + datasets - An array of datasets, where each dataset is an array of records.
# + returnType - The type of the return value (Ballerina record).
# + return - A single merged dataset containing all records or an `etl:Error`.
public function mergeData(record {}[][] datasets, typedesc<record {}> returnType = <>) returns returnType[]|Error:
```

## 6. Data Filtering

APIs for filtering datasets based on different conditions.

### 6.1 Filter by Random Sampling

This API randomly selects a portion of the input dataset according to the given ratio and returns it as a new dataset.

```ballerina
# Filters a random set of records from a dataset based on a specified ratio.
# ```ballerina
# Customer[] dataset = [
#     { id: 1, name: "Alice" },
#     { id: 2, name: "Bob" },
#     { id: 3, name: "Charlie" },
#     { id: 4, name: "David" }
# ];
# Customer[] filteredDataset = check etl:filterDataByRatio(dataset, 0.75);
#
# => [{ id: 4, name: "David" }, { id: 2, name: "Bob" }, { id: 3, name: "Charlie" }]
# ```
#
# + dataset - Array of records to be split.
# + ratio - The ratio for splitting the dataset (e.g., `0.75` means 75% in the first set).
# + returnType - The type of the return value (Ballerina record array).
# + return - Filtered dataset containing a random subset of records or an `etl:Error`.
public function filterDataByRatio(record {}[] dataset, float ratio, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 6.2 Filter by a Regular Expression

This API returns a new dataset containing only the records where the values in a specified field match the provided regex pattern.

```ballerina
# Filters a dataset based on a regex pattern match.
# ```ballerina
# Customer[] dataset = [
#     { id: 1, city: "New York" },
#     { id: 2, city: "Los Angeles" },
#     { id: 3, city: "San Francisco" }
# ];
# string fieldName = "city";
# regexp:RegExp regexPattern = re `^New.*$`;
# Customer[] filteredDataset = check etl:filterDataByRegex(dataset, "city", regexPattern);
#
# => [{ id: 1, city: "New York"}]
# ```
#
# + dataset - Array of records to be filtered.
# + fieldName - Name of the field to apply the regex filter.
# + regexPattern - Regular expression to match values in the field.
# + returnType - The type of the return value (Ballerina record array).
# + return - Filtered dataset containing records that match the regex pattern or an `etl:Error`.
public function filterDataByRegex(record {}[] dataset, string fieldName, regexp:RegExp regexPattern, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 6.3 Filter by a Relative Expression

This API returns a new dataset by comparing values in a specified numeric field against a given value using a comparison operation, and includes only the records that satisfy the comparison.

```ballerina
# Filters a dataset based on a relative numeric comparison expression.
#
# ```ballerina
# Customer[] dataset = [
#     { id: 1, name: "Alice", age: 25 },
#     { id: 2, name: "Bob", age: 30 },
#     { id: 3, name: "Charlie", age: 22 },
#     { id: 4, name: "David", age: 28 }
# ];
# Customer[] filteredDataset = check etl:filterDataByRelativeExp(dataset, "age", etl:GREATER_THAN, 25);
#
# => [{ id: 2, name: "Bob", age: 30}, {id: 4, name: "David", age: 28}]
# ```
#
# + dataset - Array of records containing numeric fields for comparison.
# + fieldName - Name of the field to evaluate.
# + operation - Comparison operation to apply as `etl:Operation`.
# + value - Numeric value to compare against.
# + returnType - The type of the return value (Ballerina record array).
# + return - Filtered dataset containing records that match the comparison or an `etl:Error`.
public function filterDataByRelativeExp(record {}[] dataset, string fieldName, Operation operation, float value, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

This API expects the comparison operation to be defined using the `Operation` enum:

```ballerina
# Represents the available comparison operations for the `filterDataByRelativeExp` API.
#
# + GREATER_THAN - Checks if the left operand is greater than the right operand.
# + LESS_THAN - Checks if the left operand is less than the right operand.
# + EQUAL - Checks if the left and right operands are equal.
# + NOT_EQUAL - Checks if the left and right operands are not equal.
# + GREATER_THAN_OR_EQUAL - Checks if the left operand is greater than or equal to the right operand.
# + LESS_THAN_OR_EQUAL - Checks if the left operand is less than or equal to the right operand.
public enum Operation {
    GREATER_THAN = ">",
    LESS_THAN = "<",
    EQUAL = "==",
    NOT_EQUAL = "!=",
    GREATER_THAN_OR_EQUAL = ">=",
    LESS_THAN_OR_EQUAL = "<="
}
```

## 7. Data Security

APIs for secure encryption, decryption, and data masking.

### 7.1 Encryption

This API returns a new dataset with the specified fields encrypted using AES-ECB encryption and a given symmetric key.

```ballerina
# Returns a new dataset with specified fields encrypted using AES-ECB encryption with a given symmetric key.
#
# ```ballerina
# Customer[] dataset = [
#     { id: 1, name: "Alice", age: 25 },
#     { id: 2, name: "Bob", age: 30 }
# ];
# byte[16] key = [78, 45, 73, 76, 56, 73, 116, 116, 72, 70, 105, 108, 97, 110, 65, 100];
# EncryptedCustomer[] encryptedData = check etl:encryptData(dataset, ["name"], key);
#
# =>[{ id: 1, name: "kHKa63v98rbDm+FB2DJ3ig==", age: 25 },
#    { id: 2, name: "S0x+hpmvSOIT7UE8hOGZkA==", age: 30 }]
# ```
#
# + dataset - The dataset containing records where specific fields need encryption.
# + fieldNames - An array of field names that should be encrypted.
# + key - The AES encryption key in byte array format.
# + returnType - The type of the return value (Ballerina record ).
# + return - A dataset with specified fields encrypted and Base64-encoded or an `etl:Error`.
public function encryptData(record {}[] dataset, string[] fieldNames, byte[16] key, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 7.2 Decryption

This API returns a new dataset with the specified fields decrypted using AES-ECB decryption and a given symmetric key.

```ballerina
# Returns a new dataset with specified fields decrypted using AES-ECB decryption with a given symmetric key.
#
# ```ballerina
# Customer[] encryptedDataset = [
#     { name: "kHKa63v98rbDm+FB2DJ3ig==", age: 23 },
#     { name: "S0x+hpmvSOIT7UE8hOGZkA==", age: 35 }
# ];
# byte[16] key = [78, 45, 73, 76, 56, 73, 116, 116, 72, 70, 105, 108, 97, 110, 65, 100];
# DecryptedCustomer[] decryptedData = check etl:decryptData(encryptedDataset, ["name"], key);
#
# => [{ name: "Alice", age: 23 },
#     { name: "Bob", age: 35 }]
# ```
#
# + dataset - The dataset containing records with Base64-encoded encrypted fields.
# + fieldNames - An array of field names that should be decrypted.
# + key - The AES decryption key in byte array format.
# + returnType - The type of the return value (Ballerina record).
# + return - A dataset with the specified fields decrypted or an `etl:Error`.
public function decryptData(record {}[] dataset, string[] fieldNames, byte[16] key, typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

### 7.3 Masking

This API returns a new dataset with PII (Personally Identifiable Information) fields masked using a specified character.

> **Note**: [Required configurations](#2-configurations) must be provided before invoking this API.

```ballerina
# Returns a new dataset with PII (Personally Identifiable Information) fields masked using a specified character.
#
# ```ballerina
# Customer[] dataset = [
#     { id: 1, name: "John Doe", email: "john@example.com" },
#     { id: 2, name: "Jane Smith", email: "jane@example.com" }
# ];
# MaskedCustomer[] maskedData = check etl:maskSensitiveData(dataset);
#
# => [{ id: 1, name: "XXX XXX", email: "XXXXXXXXXXXXXXX" },
#     { id: 2, name: "XXXX XXXX", email: "XXXXXXXXXXXXXXX" }]
# ```
#
# + dataset - The dataset containing records where sensitive fields should be masked.
# + maskingCharacter - The character to use for masking sensitive fields. Default is 'X'.
# + returnType - The type of the return value (Ballerina record).
# + return - A dataset where the specified fields containing PII are masked with the given masking character or an `etl:Error`.
public function maskSensitiveData(record {}[] dataset, string:Char maskingCharacter = "X", typedesc<record {}> returnType = <>) returns returnType[]|Error;
```

## 8. Unstructured Data Extraction

APIs for extracting structured information from unstructured sources.

### 8.1. Extract from Text

This API extracts relevant information from unstructured text and maps it to a Ballerina record.

> **Note**: [Required configurations](#2-configurations) must be provided before invoking this API.

```ballerina
# Extracts structured data from a raw text input and maps it to a Ballerina record. 
# ```ballerina
# type Review record{|
#     string goodPoints;
#     string badPoints;
#     string improvements;
# |};
#
# string reviews = "The smartphone has an impressive camera and smooth performance, making it great for photography and gaming. However, the battery drains quickly, and the charging speed could be improved. The UI is intuitive, but some features feel outdated and need a refresh.";
# Review extractedDetails = check etl:extractFromText(reviews);
#
# => { goodPoints: "The smartphone has an impressive camera and smooth performance, making it great for photography and gaming.",
#      badPoints: "However, the battery drains quickly, and the charging speed could be improved.",
#      improvements: "The UI is intuitive, but some features feel outdated and need a refresh." }
# ```
#
# + sourceText - The raw text input from which structured data is to be extracted.
# + returnType - The type of the return value (Ballerina record).
# + return - A record with extracted details mapped to the specified field names or an `etl:Error`.
public function extractFromText(string sourceText, typedesc<record {}> returnType = <>) returns returnType|Error;
```
