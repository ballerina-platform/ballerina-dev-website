---
layout: ballerina-inner-page
permalink: /0.991/learn/ballerina-streaming-reference/
---

# Ballerina Streaming Reference Guide

Ballerina streaming is designed to process event streams in a streaming manner, detect complex event occurrences,
and produce notifications in real-time.

Note: Ballerina Streaming capabilities are shipped as the experimental feature in the latest release. Please use `--experimental` flag when compiling Ballerina files which have streaming constructs.

For example, following scenarios are supported by Ballerina stream processing:

* Data preprocessing
* Generating alerts based on thresholds
* Calculating aggregations over a short window or a long time period
* Joining multiple data streams
* Correlating data while finding missing and erroneous events
* Detecting temporal event patterns
* Tracking (something over space or time)
* Analyzing trends (rise, fall, turn, triple bottom)

The following topics explains the high level concepts about Ballerina streaming

* [Stream](#stream)
* [Forever Statement](#forever-statement)
* [Query](#query)

### Stream

A stream is a logical series of events ordered in time. Its schema is defined/constrained via the **record definition**.
A record definition contains a unique name and a set of uniquely identifiable attributes with specific types
within the record. All the events of a specific stream have the same schema (i.e., have the same attributes in the same order).

###### Purpose

Defining a schema unifies common types of events together. This enables them to be processed via queries
using their defined attributes, in a streaming manner.

###### Syntax

The syntax for defining a new stream is as follows.

```ballerina
type <record name> record {
    <attribute type> <attribute name>;
    <attribute type> <attribute name>;
    <attribute type> <attribute name>;
    ...
};

stream<record name> <stream name> = new;
```
The following parameters are configured in a stream definition.

| Parameter     | Description |
| ------------- |-------------|
| `stream name`      | The name of the created stream. |
| `record name`      | The name of the record that constrains the stream. |
| `attribute name`   | The uniquely identifiable attribute name. The schema of a record is defined by its attributes.|
| `attribute type`   | The type of each attribute defined in the record. |


###### Example
```ballerina
type Employee record {
    string name;
    int age;
    string status;
};

stream<Employee> employeeStream = new;
```

The code given above creates a stream named `employeeStream` that is constrained by the `Employee` type having 
the following attributes.

+ `name` of type `string`
+ `age` of type `int`
+ `status` of type `string`

### Forever Statement
The `forever` statement block can include one or more streaming queries defining stream processing and complex event 
processing rules.

###### Purpose

The `forever` statement block let streaming queries to run continuously till the Ballerina program is exited. 
Here each streaming query within the `forever` block executes as an independent isolated processing unit to one another.

###### Grammar

One or more streaming queries can be defined in a single `forever` statement block as shown in the syntax given below.

```antlrv4
foreverStatement
    :   FOREVER LEFT_BRACE  streamingQueryStatement+ RIGHT_BRACE
    ;

streamingQueryStatement
    :   FROM (streamingInput (joinStreamingInput)? | patternClause)
        selectClause?
        orderByClause?
        outputRateLimit?
        streamingAction
    ;
```

###### Sample query

This query filters out the sensor events, which have the temperature greater than 30 celsius, and for every 100 sensor
events, it groups them based on their type, count number of sensor events for each type and publishes all the types have
more than one event to the `highTemperatureSensorStream` stream.

```ballerina
    forever {
        from sensorTemperatureStream
            where sensorTemperatureStream.temperature > 30
            window lengthBatch (100)
        select sensorTemperatureStream.type, count() as totalCount
            group by sensorTemperatureStream.type
            having totalCount > 1
        =>  (HighTemperature [] values) {
                foreach var value in values {
                    highTemperatureSensorStream.publish(value);
                }
            }
    }
```

### Query

Each streaming query can consume one or more streams, process the events continuously in a streaming manner, 
and simultaneously generate output.

###### Purpose

A query enables you to perform complex event processing and stream processing operations by processing incoming events
one by one in the order they arrive.

###### Syntax

Each query contains an input and an output section. Some also contain a projection section. 
The following is a simple query with all three sections.

```ballerina
from <input stream>
select <attribute name>, <attribute name>, ...
=> (<array type> <parameter name>) {
      ...
      ...
}
```

###### Example

This query consumes events from the `tempStream` stream (that is already defined) and outputs the room temperature and 
the room number to the `roomTempStream` stream.

```ballerina
type temperature record {
  int deviceID;
  int roomNo;
  float value;
};

type roomTemperature record {
  int roomNo;
  float value;
};

stream<temperature> tempStream = new;
stream<roomTemperature> roomTempStream = new;

public function initQuery() {
    forever {
        from tempStream
        select tempStream.roomNo, tempStream.value
        => (roomTemperature[] temperatures) {
            foreach var value in temperatures {
                roomTempStream.publish(value);
            }
        }
    }
}
```

**For more information about streaming queries, see the following subsections:**

* [Query Projection](#query-projection)
* [Filter](#filter)
* [Window](#window)
* [Aggregation Function](#aggregate-function)
* [Group By](#group-by)
* [Having](#having)
* [Order By](#order-by)
* [Join](#join)
* [Pattern](#pattern)
* [Sequence](#sequence)
* [Output Rate Limiting](#output-rate-limiting)


#### Query Projection

Streaming queries support the following for query projections.

<table style="width:100%">
    <tr>
        <th>Action</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Selecting required objects for projection</td>
        <td>This involves selecting only some of the attributes from the input stream to be inserted into an output stream.
            <br><br>
            e.g., The following query selects only the `roomNo` and `temp` attributes from the `tempStream` stream.
            <pre style="align:left">from tempStream<br>select tempStream.roomNo, tempStream.temp<br>=> ( ) { <br/><br/>}</pre>
        </td>
    </tr>
    <tr>
        <td>Selecting all attributes for projection</td>
        <td>This involves selecting all the attributes in an input stream to be inserted into an output stream. This can be done by using an asterisk ( * ) or by omitting the `select` statement.
            <br><br>
            e.g., Both the following queries select all the attributes in the `tempStream` stream.
            <pre>from tempStream<br>select *<br>=> ( ) { <br/><br/>}</pre>
            or
            <pre>from tempStream<br>=> ( ) { <br/><br/>}</pre>
        </td>
    </tr>
    <tr>
        <td>Renaming attributes</td>
        <td>This selects attributes from the input streams and inserts them into the output stream with different names.
            <br><br>
            e.g., This query renames `roomNo` to `roomNumber` and `temp` to `temperature`.
            <pre>from tempStream <br>select tempStream.roomNo as roomNumber, tempStream.temp as temperature<br>=> ( ) { <br/><br/>}</pre>
        </td>
    </tr>
    <tr>
        <td>Introducing the constant value</td>
        <td>This adds constant values by assigning it to an attribute using `as`.
            <br></br>
            e.g., This query specifies 'C' to be used as the constant value for the `scale` attribute.
            <pre>from tempStream<br>select tempStream.roomNo, tempStream.temp, 'C' as scale<br>=> ( ) { <br/><br/>}</pre>
        </td>
    </tr>
    <tr>
        <td>Using mathematical and logical expressions</td>
        <td>This uses attributes with mathematical and logical expressions in the precedence order given below, and assigns them to the output attribute using `as`.
            <br><br>
            <b>Operator precedence</b><br>
            <table style="width:100%">
                <tr>
                    <th>Operator</th>
                    <th>Distribution</th>
                    <th>Example</th>
                </tr>
                <tr>
                    <td>
                        ()
                    </td>
                    <td>
                        Scope
                    </td>
                    <td>
                        <pre>(cost + tax) * 0.05</pre>
                    </td>
                </tr>
                <tr>
                    <td>
                         == NULL
                    </td>
                    <td>
                        Null check
                    </td>
                    <td>
                        <pre>deviceID == null</pre>
                    </td>
                </tr>
                <tr>
                    <td>
                        !
                    </td>
                    <td>
                        Logical NOT
                    </td>
                    <td>
                        <pre>! (price > 10)</pre>
                    </td>
                </tr>
                <tr>
                    <td>
                         *   /   %
                    </td>
                    <td>
                        Multiplication, division, modulo
                    </td>
                    <td>
                        <pre>temp * 9/5 + 32</pre>
                    </td>
                </tr>
                <tr>
                    <td>
                        +   -
                    </td>
                    <td>
                        Addition, substraction
                    </td>
                    <td>
                        <pre>temp * 9/5 - 32</pre>
                    </td>
                </tr>
                <tr>
                    <td>
                        <   <=   >   >=
                    </td>
                    <td>
                        Comparators: less-than, greater-than-equal, greater-than, less-than-equal
                    </td>
                    <td>
                        <pre>totalCost >= price * quantity</pre>
                    </td>
                </tr>
                <tr>
                    <td>
                        ==   !=
                    </td>
                    <td>
                        Comparisons: equal, not equal
                    </td>
                    <td>
                        <pre>totalCost !=  price * quantity</pre>
                    </td>
                </tr>
                <tr>
                    <td>
                        &&
                    </td>
                    <td>
                        Logical AND
                    </td>
                    <td>
                        <pre>temp < 40 &&<br>     (humidity < 40 or humidity >= 60)</pre>
                    </td>
                </tr>
                <tr>
                    <td>
                        ||
                    </td>
                    <td>
                        Logical OR
                    </td>
                    <td>
                        <pre>temp < 40 ||<br>     (humidity < 40 && humidity >= 60)</pre>
                    </td>
                </tr>
            </table>
            e.g., This query converts Celsius to Fahrenheit, and identifies rooms of which the room number is between 10 and 15 as server rooms.
            <pre>from tempStream<br>select tempStream.roomNo, tempStream.temp * 9/5 + 32 as temp, 'F' as scale,<br>       tempStream.roomNo > 10 && tempStream.roomNo < 15 as isServerRoom<br>=> (RoomFahrenheit [] events ) { <br/><br/>}</pre>
    </tr>
</table>

#### Filter

Filters are included in queries to filter information from input streams based on a specified condition.

###### Purpose

A filter allows you to separate events that match a specific condition as the output or for further processing.

###### Syntax

Filter conditions should be defined with the `where` keyword next to the input stream name as shown below.

```ballerina
from <input stream> where <filter condition>
select <attribute name>, <attribute name>, ...
=> ( ) {

}
```

###### Example

This query filters all the server rooms of which the room number is within the range of 100-210, and that have temperature greater than 40 degrees
from the `tempStream` stream, and inserts the results into the `highTempStream` stream.

```ballerina
from tempStream where (tempStream.roomNo >= 100 && tempStream.roomNo < 210) && tempStream.temp > 40
select tempStream.roomNo, tempStream.temp
=> (RoomTemperature [] values) {
    foreach var value in values {
        highTempStream.publish(value);
    }
}
```


#### Window

Windows allow you to capture a subset of events based on a specific criterion from an input stream for calculation.
Each input stream can only have a maximum of one window.

###### Purpose

To create subsets of events within a stream based on time duration, number of events, etc for processing.
A window can operate in a sliding or tumbling (batch) manner.

###### Syntax

The `window` prefix should be inserted next to the relevant stream in order to use a window.

```ballerina
from <input stream> window <window name>(<parameter>, <parameter>, ... )
select <attribute name>, <attribute name>, ...
=> ( ) {

}
```
Note : Filter condition can be applied both before and/or after the window

###### Example

If you want to identify the maximum temperature out of the last 10 events, you need to define a `length` window of 10 events.
 This window operates in a sliding mode where the following 3 subsets are calculated when a list of 12 events are received in a sequential order.

|Subset|Event Range|
|------|-----------|
| 1 | 1-10 |
| 2 | 2-11 |
|3| 3-12 |

The following query finds the maximum temperature out of **last 10 events** from the `tempStream` stream,
and inserts the results into the `maxTempStream` stream.

```ballerina
from tempStream window length(10)
select max(tempStream.temp) as maxTemp
=> ( ) {

}
```

If you define the maximum temperature reading out of every 10 events, you need to define a `lengthBatch` window of 10 events.
This window operates as a batch/tumbling mode where the following 3 subsets are calculated when a list of 30 events are received in a sequential order.

|Subset|Event Range|
|------|-----------|
| 1    | 1-10      |
| 2    | 11-20     |
| 3    | 21-30     |

The following query finds the maximum temperature out of **every 10 events** from the `tempStream` stream,
and inserts the results into the `maxTempStream` stream.

```ballerina
from tempStream window lengthBatch(10)
select max(tempStream.temp) as maxTemp
=> ( ) {

}
```

Note : Similar operations can be done based on time via `time` windows and `timeBatch` windows and for others.
    Code segments such as `window time(10000)` considers events that arrive during the last 10 seconds in a sliding manner, and the `window timeBatch(2000)` considers events that arrive every 2 seconds in a tumbling manner.

Following are some inbuilt windows shipped with Ballerina Streams.

* time
* timeBatch
* timeLength
* length
* lengthBatch
* sort
* externalTime
* externalTimeBatch
* uniqueLength
* delay
* timeAccum
* hopping
* timeOrder


1.  time window

    `time(int windowTime)`

    A sliding time window that holds events that arrived during the last `windowTime` period at a given time, and
    gets updated for each event arrival and expiry.

2.  timeBatch window

    `timeBatch(int windowTime)`

    A batch (tumbling) time window that holds events that arrive during `windowTime` periods, and gets updated for
    each `windowTime`.

3. timeLength window

    `timelength(int windowTime, int windowLength)`

    A sliding time window that, at a given time holds the last `windowLength` events that arrived during last
    `windowTime` period, and gets updated for every event arrival and expiry.

4. length window
    `length(int windowLength)`

    A sliding length window that holds the last `windowLength` events at a given time, and gets updated for each
    arrival and expiry.

5. lengthBatch window

    `lengthBatch(int windowLength)`

    A batch (tumbling) length window that holds a number of events specified as the `windowLength`. The window is
    updated each time a batch of events that equals the number specified as the `windowLength` arrives.

6. externalTime window

    `externalTime(timeStamp, int windowTime)`

    A sliding time window based on external time. It holds events that arrived during the last `windowTime` period
    from the external `timestamp`, and gets updated on every monotonically increasing `timestamp`. Here the
    `timeStamp` should be an attribute of the record which is used as the constraint type of relevant input stream.
    As the `timeStamp` parameter you should pass `<streamName>.<attiributeName>`.

7. externalTimeBatch window

    `externalTimeBatch(timeStamp, int windowTime, int? startTime, int? timeout)`

    A batch (tumbling) time window based on external time, that holds events arrived during `windowTime` periods, and
     gets updated for every `windowTime`. Here the `timeStamp` should be an attribute of the record which is used as
     the constraint type of relevant input stream. As the `timeStamp` parameter you should pass `<streamName>
     .<attiributeName>`. Parameters `startTime` and `timeout` are optional parameters. `startTime` can be used to
     specify a user defined time to start the first batch. `timeout` is time to wait for arrival of new event, before
      flushing and giving output for events belonging to a specific batch. Usually `timeout` is greater than
      `windowTime`.

8. uniqueLength window

    `uniqueLength(uniqueAttribute, int windowLength)`

    A sliding length window that returns unique events within the `windowLength` based on the given `uniqueAttribute`
    . Here the `uniqueAttribute` should be an attribute of the record which is used as the constraint type of
    relevant input stream.

9. delay window

    `delay(int delayTime)`

    A delay window holds events for a specific time period(`delayTime`) that is regarded as a delay period before
    processing them.

10. sort window

    `sort(int windowLength, attributeName, string order)`

    A sort sort window holds a batch of events that equal the number specified as the `windowLength` and sorts them
    in the given `order` of given `attributeName`. Here the `attributeName` should be an attribute of the record
    which is used as the constraint type of relevant input stream. You can have multiple `attributeName` fields
    followed by it's `order`.

11. timeAccum window

    `timeAccum(int timePeriod)`

    A sliding window that accumulates events until no more events arrive within the `timePeriod`, and only then
    releases the accumulated events.

12. hopping window

    `hopping(int windowTime, int hoppingTime)`

    A hopping window holds the events arrived within last `windowTime` and release them in every `hoppingTime` period.

13. timeOrder window

    `timeOrder(timestamp, int windowTime, boolean dropOlderEvents)`

    A timeOrder window orders events that arrive out-of-order, using timestamp values provided by `timestamp`, and
    bycomparing that `timestamp` value to system time. `windowTime` is the window duration. `dropOlderEvents` flag
    determines whether to drop the events which has timestamp value less than the tail-time of current window.
    Tail-time is the time, an amount of `windowTime` before the system time. Here the `timeStamp` should be an
    attribute of the record which is used as the constraint type of relevant input stream. As the `timeStamp`
    parameter you should pass `<streamName>.<attiributeName>`.


#### Aggregate function

Aggregate functions perform aggregate calculations in the query.
When a window is defined the aggregation is restricted within that window. If no window is provided aggregation is performed from the start.

###### Syntax

```ballerina
from <input stream> window <window name>(<parameter>, <parameter>, ... )
select <aggregate function>(<parameter>, <parameter>, ... ) as <attribute name>,
            <attribute2 name>, ...
=> ( ) {

}
```

**Aggregate Parameters**

Aggregate parameters can be attributes, constant values, results of other functions or aggregates, results of mathematical or logical expressions, or time parameters.
Aggregate parameters configured in a query  depends on the aggregate function being called.

###### Example

The following query calculates the average value for the `temp` attribute of the `tempStream` stream. This calculation is done for the last 10 minutes in a sliding manner, and the result is output as `avgTemp` to the `avgTempStream` output stream.

```ballerina
from tempStream window time(600000)
select avg(tempStream.temp) as avgTemp, tempStream.roomNo, tempStream.deviceID
=> (AvgTemperature [] values) {
    foreach var value in values {
        avgTempStream.publish(value);
    }
}
```
Following are some inbuilt aggregation functions shipped with Ballerina, for more aggregation functions, see execution.

* avg : Calculates the average for a given argument for all the events.
* sum : Returns the sum of a given argument for all the events.
* max : Returns the maximum value of a given argument for all the events.
* min : Returns the minimum value of a given argument for all the events.
* count : Returns the count of all the events.
* distinctCount : Returns the count of distinct occurrences for a given argument.
* maxForever : This stores the maximum value for a given attribute throughout the lifetime of the query regardless of any windows in-front.
* minForever : This stores the minimum value for a given attribute throughout the lifetime of the query regardless of any windows in-front.
* stdDev : Returns the calculated standard deviation of a given argument for all the events.

###### More samples with above aggregation functions.

 *  The following query calculates the distinct count of page visits of each user.

```ballerina
from pageVisitStream window time(5000)
select pageVisitStream.userID, pageVisitStream.pageID,
        distinctCount(pageVisitStream.pageID) as distinctPages
group by pageVisitStream.userID
=> (UserPageVisit [] visits) {
    foreach var visit in visits {
        outputStream.publish(visit);
    }
}
```

 *  The following query calculates the forever max temperature of the room.

```ballerina
from tempStream
select tempStream.room, tempStream.timestamp, maxForever(tempStream.temperature) as maxTemp
=> (RoomTemperature [] roomTemps) {
    foreach var roomTemp in roomTemps {
        maxTempStream.publish(roomTemp);
    }
}
```

 *  The following query calculates standard deviation value of the stock price for the price change of each 1000 stock.

```ballerina
from stockExchangeStream window lengthBatch(1000)
select stdDev(stockExchangeStream.price) as deviation, stockExchangeStream.symbol
=> (SymbolDeviation[] deviations) {
    foreach var deviation in deviations {
        priceDeviationStream.publish(deviation);
    }
}
```


#### Group By

The `group by` clause allows you to group the aggregate based on specified attributes.

###### Syntax

The syntax for the 'group by` aggregate function is as follows:

```ballerina
from <input stream> window <window name>(...)
select <aggregate function>( <parameter>, <parameter>, ...) as <attribute1 name>,
            <attribute2 name>, ...
group by <attribute1 name>, <attribute2 name> ...
=> ( ) {

}
```

###### Example

The following query calculates the average temperature per `roomNo` and `deviceID` combination, for events that arrive at the `tempStream` stream
for a sliding time window of 10 minutes.

```ballerina
from tempStream window time(600000)
select avg(tempStream.temp) as avgTemp, tempStream.roomNo, tempStream.deviceID
group by tempStream.roomNo, tempStream.deviceID
=> (AvgTemperature [] values) {
    foreach var value in values {
        avgTempStream.publish(value);
    }
}
```

#### Having

The `having` clause allows you to filter events after processing the `select` statement.

###### Purpose

This allows you to filter the aggregation output.

###### Syntax

The syntax for the `having` clause is as follows:

```ballerina
from <input stream> window <window name>( ... )
select <aggregate function>( <parameter>, <parameter>, ...) as <attribute1 name>,
            <attribute2 name>, ...
group by <attribute1 name>, <attribute2 name> ...
having <condition>
=> ( ) {

}
```

###### Example

The following query calculates the average temperature per room for the last 10 minutes, and alerts if it exceeds 30 degrees.
```ballerina
from tempStream window time(600000)
select avg(tempStream.temp) as avgTemp, tempStream.roomNo
group by tempStream.roomNo
having avgTemp > 30
=> (Alert [] values) {
    foreach var value in values {
        alertStream.publish(value);
    }
}
```

#### Order By

The `order by` clause allows you to order the aggregated result in ascending and/or descending order based on specified attributes. By default ordering will be done in
ascending manner. User can use `descending` keyword to order in descending manner.

###### Syntax

The syntax for the `order by` clause is as follows:

```ballerina
from <input stream> window <window name>( ... )
select <aggregate function>( <parameter>, <parameter>, ...) as <attribute1 name>,
            <attribute2 name>, ...
group by <attribute1 name>, <attribute2 name> ...
having <condition>
order by <attribute1 name> (ascending | descending)?,
            <attribute2 name> (<ascending | descending>)?, ...
=> ( ) {

}
```

###### Example

The following query calculates the average temperature per per `roomNo` and `deviceID` combination for every 10 minutes, and generate output events
by ordering them in the ascending order of the room's avgTemp and then by the descending order of roomNo.

```ballerina
from tempStream window timeBatch(600000)
select avg(tempStream.temp) as avgTemp, tempStream.roomNo, tempStream.deviceID
group by tempStream.roomNo, tempStream.deviceID
order by avgTemp, roomNo descending
=> (AvgTemperature [] values) {
    foreach var value in values {
        avgTempStream.publish(value);
    }
}
```

#### Join
Joins allow you to get a combined result from two streams in real-time based on a specified condition.

###### Purpose

Streams are stateless. Therefore, in order to join two streams, they need to be connected to a window
so that there is a pool of events that can be used for joining. Joins also accept conditions to join
the appropriate events from each stream.

During the joining process each incoming event of each stream is matched against all the events in the other
stream's window based on the given condition, and the output events are generated for all the matching event pairs.


###### Syntax

The syntax for a `join` is as follows:

```ballerina
from <input stream> window <window name>(<parameter>, ... )
        {unidirectional} {as <reference>}
        join <input stream> window <window name>(<parameter>,  ... )
        {unidirectional} {as <reference>}
    on <join condition>
select <attribute name>, <attribute name>, ...
=> ( ) {

}
```
Here, the `<join condition>` allows you to match the attributes from both the streams.

**Unidirectional join operation**

By default, events arriving at either stream can trigger the joining process. However, if you want to control the
join execution, you can add the `unidirectional` keyword next to a stream in the join definition as depicted in the
syntax in order to enable that stream to trigger the join operation. Here, events arriving at other stream only update the
 window of that stream, and this stream does not trigger the join operation.

Note : The `unidirectional` keyword cannot be applied to both the input streams because the default
behaviour already allows both streams to trigger the join operation.

###### Example

Assuming that the temperature of regulators are updated every minute.
Following is a streaming query that controls the temperature regulators if they are not already `on`
for all the rooms with a room temperature greater than 30 degrees.

```ballerina
from tempStream where (tempStream.temp > 30.0) window time(60000) as T
  join regulatorStream where (regulatorStream.isOn == false) window length(1) as R
  on T.roomNo == R.roomNo
select T.roomNo, R.deviceID, 'start' as action
=> (RegulatorAction [] values) {
    foreach var value in values {
        regulatorActionStream.publish(value);
    }
}
```

**Supported join types**

Following are the supported operations of a join clause.

 *  **Inner join (join)**

    This is the default behaviour of a join operation. `join` is used as the keyword to join both
    the streams. The output is generated only if there is a matching event in both the streams.

 *  **Left outer join**

    The left outer join operation allows you to join two streams to be merged based on a condition.
    `left outer join` is used as the keyword to join both the streams.

    Here, it returns all the events of left stream even if there are no matching events in the right
    stream by having null values for the attributes of the right stream.

    ###### Example

    The following query generates output events for all events from the `stockStream` stream
    regardless of whether a matching symbol exists in the `twitterStream` stream or not.

    ```ballerina
    from stockStream window time(60000) as S
        left outer join twitterStream window length(1) as T
        on S.symbol== T.symbol
    select S.symbol as symbol, T.tweet, S.price
    => ( ) {

    }
    ```

 *  **Right outer join**

    This is similar to a left outer join. `right outer join` is used as the keyword to join both
    the streams. It returns all the events of the right stream even if there are no matching events
    in the left stream.

 *  **Full outer join**

    The full outer join combines the results of left outer join and right outer join. `full outer join` is used as the keyword to join both the streams.
    Here, output events are generated for each incoming event even if there are no matching events in
    the other stream.

    ###### Example

    The following query generates output events for all the incoming events of each stream regardless of whether there is a
    match for the `symbol` attribute in the other stream or not.

    ```ballerina
    from stockStream window time(60000) as S
        full outer join twitterStream window length(1) as T
        on S.symbol== T.symbol
    select S.symbol as symbol, T.tweet, S.price
    => ( ) {

    }
    ```


#### Table Operations
Ballerina provides extensive support to deal with tables. It provides various types of operations such as create, insert, delete, etc. with in-memory or external storage tables.

###### Purpose
In Streaming context, a table is a stored version of a stream or a table of events. Ballerina provides support to interactively query the state of the stored events in the table when processing events which are arrived through a stream.
We could perform operations such as add, delete, update and join with tables.

###### Example - Add
In the following example, query events that arrive in `stockStream` are added into the table `itemStockTable` after projecting a few attributes from the event.

```ballerina
import ballerina/io;
import ballerina/runtime;

//This is the record that holds item details in the stockTable.
type Item record {|
    string name;
    float price;
    int stockAmount;
|};

//This is the record that holds stock details.
type Stock record {|
    string name;
    float price;
    int stockAmount;
    string manufactureName;
    int manufactureId;
|};

// This is the input stream that uses `Stock` as the constraint type.
stream<Stock> stockStream = new;

// This is the table that holds the item stock data.
table<Item> itemStockTable = table {
    { name, price, stockAmount },
    [
        {"Book", 100.0, 10},
        {"Pen", 20.0, 4}
    ]
};

public function main() {
    initQuery();

    Stock d = {name : "FOO", price: 100.3, stockAmount: 2000, manufactureName: "BAR", manufactureId: 23};
    stockStream.publish(d);

    runtime:sleep(2000);

    io:println("Records in table after inserting new record: ");
    while(itemStockTable.hasNext()) {
        io:println(" ", itemStockTable.getNext());
    }
}

public function initQuery() {
    forever {
        from stockStream
        select stockStream.name, stockStream.price, stockStream.stockAmount
        => (Item[] items) {
            foreach var item in items {
                _ = checkpanic itemStockTable.add(item);
            }
        }
    }
}
```


###### Example - Join with Table
In the following query, we perform a join operation between the event stream and table. Whenever an order event is published to `orderStream`, it is matched against the `itemStockTable` through the `queryItemTable` function. If there is a match,
an alert event is published to `orderAlertStream`.

```ballerina
import ballerina/io;
import ballerina/runtime;

//This is the record that holds item details in the stockTable.
type Item record {
    string name;
    float price;
    int stockAmount;
};

// This is the record that holds order events from the customer.
type Order record {
    string itemName;
    int orderingAmount;
};

//This is the record that holds alert events.
type OutOfStockAlert record {
    string itemName;
    int stockAmount;
};

// This is the input stream that uses `Order` as the constraint type.
stream<Order> orderStream = new;

// This is the table that holds the item stock data.
table<Item> itemStockTable = table {
    { name, price, stockAmount },
    [
        {"Book", 100.0, 10},
        {"Pen", 20.0, 4}
    ]
};

// This is the output stream that contains the events/alerts that are generated based on streaming logic.
stream<OutOfStockAlert> orderAlertStream = new;

function initOutOfStockAlert() {
    forever {
        from orderStream window length(1) as itemOrder
        join queryItemTable(itemOrder.itemName, itemOrder.orderingAmount) as item
        select item.name as itemName, item.stockAmount
        => (OutOfStockAlert[] alerts) {
            foreach var alert in alerts {
                orderAlertStream.publish(alert);
            }
        }
    }
}

//`queryItemTable` function returns a table of items whose stock is not enough to satisfy the order.
public function queryItemTable(string itemName, int orderingAmount)
        returns table<Item> {
    table<Item> result = table {
        { name, price, stockAmount }, []
    };
    foreach var item in itemStockTable {
        if (item.name == itemName && orderingAmount > item.stockAmount) {
            var ret = result.add(item);
        }
    }
    return result;
}

public function main() {

    initOutOfStockAlert();

    Order o1 = {itemName: "Book", orderingAmount: 20};
    Order o2 = {itemName: "Pen", orderingAmount: 3};

    orderAlertStream.subscribe(function(OutOfStockAlert alert) {
            io:println("Aert: Stocks unavailable for: ", alert.itemName, " Available stocks: ", alert.stockAmount);
    });

    orderStream.publish(o1);
    orderStream.publish(o2);

    runtime:sleep(2000);
}
```


****

Capabilities mentioned in below sections are not supported by the native Ballerina-based
stream processing. They are only available when using Siddhi CEP engine for stream processing capabilities
in Ballerina. If you want to enable Siddhi runtime-based stream processing with Ballerina; please use
the compile time flag `--siddhiruntime`.


#### Pattern

This is a state machine implementation that allows you to detect patterns in the events that arrive over time.
This can correlate events within a single stream or between multiple streams.

###### Purpose

Patterns allow you to identify trends in events over a time period.

###### Syntax

The following is the syntax for a pattern query:

```ballerina
from (every)? <input stream> where <filter condition> as <event reference> followed by
     <input stream where <filter condition> as <event reference> followed by
    ...
    (within <time gap>)?
select <event reference>.<attribute name>, <event reference>.<attribute name>, ...
=> ( ) {

}
```
| Items| Description |
|-------------------|-------------|
| `followed by` | This is used to indicate an event that should be following another event. The subsequent event does not necessarily have to occur immediately after the preceding event. The condition to be met by the preceding event should be added before the sign, and the condition to be met by the subsequent event should be added after the sign. |
| `<event reference>` | This allows you to add a reference to the the matching event so that it can be accessed later for further processing. |
| `(within <time gap>)?` | The `within` clause is optional. It defines the time duration within which all the matching events should occur. |
| `every` | `every` is an optional keyword. This defines whether the event matching should be triggered for every event arrival in the specified stream with the matching condition. <br/> When this keyword is not used, the matching is carried out only once. |

Ballerina Streams also supports pattern matching with counting events and matching events in a logical order such
as (`&&`, `||`, and `!`). These are described in detail further below in this documentation.

###### Example

This query sends an alert if the temperature of a room increases by 5 degrees within 10 min.

```ballerina
from every tempStream as e1
    followed by tempStream where (e1.roomNo == roomNo && (e1.temp + 5) <= temp) as e2
    within 10 minute
select e1.roomNo, e1.temp as initialTemp, e2.temp as finalTemp
=> (Alert [] alerts) {
    foreach var alert in alerts {
        alertStream.publish(alert);
    }
}
```

Here, the matching process begins for each event in the `tempStream` stream (because `every` is used with `e1=tempStream`),
and if  another event arrives within 10 minutes with a value for the `temp` attribute that is greater than or equal to `e1.temp + 5`
of the event e1, an output is generated via the `alertStream`.

##### Counting Pattern

Counting patterns allow you to match multiple events that may have been received for the same matching condition.
The number of events matched per condition can be limited via condition postfixes.

###### Syntax

Each matching condition can contain a collection of events with the minimum and maximum number of events to be matched as shown in the syntax below.

```ballerina
from (every)? <input stream>
        where <filter condition> ([<min count> .. <max count>])? as <event reference> followed by
    ...
    (within <time gap>)?
select <event reference>([event index])?.<attribute name>, ...
=> ( ) {

}
```

|Postfix|Description|Example
---------|---------|---------
|`[n1..n2]`|This matches `n1` to `n2` events (including `n1` and not more than `n2`).| `[1..4]` matches 1 to 4 events.
|`[n..]`|This matches `n` or more events (including `n`).|`[2..]` matches 2 or more events.
|`[..n]`|This matches up to `n` events (excluding `n`).|`[..5]` matches up to 5 events.
|`[n]`|This matches exactly `n` events.|`[5]` matches exactly 5 events.

Specific occurrences of the event in a collection can be retrieved by using an event index with its reference.
Square brackets can be used to indicate the event index where `1` can be used as the index of the first event and `last` can be used as the index
 for the `last` available event in the event collection. If you provide an index greater then the last event index,
 the system returns `null`. The following are some valid examples.

+ `e1[3]` refers to the 4rd event.
+ `e1[e1.length - 1]` refers to the last event.
+ `e1[e1.length - 2]` refers to the event before the last event.

###### Example

The following streaming query calculates the temperature difference between two regulator events.

```ballerina
type Temperature record {
    int deviceID;
    int roomNo;
    float temp;
};

type Regulator record {
    int deviceID;
    int roomNo;
    float tempSet;
    boolean isOn;
};

stream<Temperature> tempStream = new;
stream<Regulator> regulatorStream = new;

from every regulatorStream as e1 
    followed by tempStream where (e1.roomNo==roomNo) [1..] as e2
    followed by regulatorStream where (e1.roomNo==roomNo) as e3
select e1.roomNo, e2[0].temp - e2[last].temp as tempDiff
=> (TemperatureDiff [] values) {
    foreach var value in values {
        tempDiffStream.publish(value);
    }
}
```

##### Logical Patterns

Logical patterns match events that arrive in temporal order and correlate them with logical relationships such as `&&`,
`||` and `!`.

###### Syntax

```ballerina
from (every)? (!)? <input stream> where <filter condition> as <event reference>
          ((&& | ||) <input stream> where <filter condition>)? as <event reference>
          (within <time gap>)? followed by
    ...
select <event reference>([event index])?.<attribute name>, ...
=> ( ) {

}
```

Keywords such as `&&`, `||`, or `!` can be used to illustrate the logical relationship.

Key Word|Description
---------|---------
`&&`|This allows both conditions of `&&` to be matched by two events in any order.|
<code>&#124;&#124;</code>|The state succeeds if either condition of <code>&#124;&#124;</code> is satisfied. Here the event reference of the other condition is `null`.|
`! <condition1> && <condition2>`| When `!` is included with `&&`, it identifies the events that match <condition2> arriving before any event that match <condition1>.|
`! <condition> for <time period>`| When `!` is included with `for`, it allows you to identify a situation where no event that matches `<condition1>` arrives during the specified `<time period>`.  e.g.,`from ! temperatureStream where (temp > 60) for 5 second`.|

Here the `!` pattern can be followed by either an `&&` clause or the effective period of `!` can be concluded after a given `<time period>`. Further in Ballerina Streams, more than two streams cannot be matched with logical conditions using `&&`, `||`, or `!` clauses at this point.

###### Example

Following streaming query, sends the `stop` control action to the regulator when the key is removed from the hotel room.
```ballerina

import ballerina/io;
import ballerina/runtime;

// Create a record type that represents the regulator state.
type RegulatorState record {
    int deviceId;
    int roomNo;
    float tempSet;
    string userAction;
};

// Create a record type that represents the user actions on the hotel key.
type RoomKeyAction record {
    int roomNo;
    string userAction;
};

stream<RegulatorState> regulatorStateChangeStream = new;
stream<RoomKeyAction> roomKeyStream = new;
stream<RoomKeyAction> regulatorActionStream = new;

// Deploy the decision rules for the regulator's next action based on the current regulator state and the user action on
// the hotel key. If the regulator was on before and is still on after the user has removed the hotel key from the
// room, the `stop` control action is called.
function deployRegulatorActionDecisionRules() {
    forever {
        from every regulatorStateChangeStream
            where userAction == "on" as e1
        followed by roomKeyStream
            where e1.roomNo == roomNo && userAction == "removed" as e2
        || regulatorStateChangeStream
            where e1.roomNo == roomNo && userAction == "off" as e3
        select e1.roomNo as roomNo,
            e2 == null ? "none" : "stop" as userAction
        having userAction != "none"
        => (RoomKeyAction[] keyActions) {
            foreach var keyAction in keyActions {
                regulatorActionStream.publish(keyAction);
            }
        }
    }
}

public function main() {

    // Deploys the streaming pattern rules that define how the regulator is controlled based on received events.
    deployRegulatorActionDecisionRules();

    // Sample events that represent the different regulator states.
    RegulatorState regulatorState1 = { deviceId: 1, roomNo: 2, tempSet: 23.56, userAction: "on" };
    RegulatorState regulatorState2 = { deviceId: 1, roomNo: 2, tempSet: 23.56, userAction: "off" };

    // A sample event that represents the user action on the door of the room. 'removed' indicates that the owner has left the room.
    RoomKeyAction roomKeyAction = { roomNo: 2, userAction: "removed" };

    // The `RegulatorActionStream` subscribes to the `alertRoomAction` function. Whenever the
    // 'RegulatorActionStream' stream receives a valid event, this function is called.
    regulatorActionStream.subscribe(alertRoomAction);

    // Publish/simulate the sample event that represents the regulator `switch on` event.
    regulatorStateChangeStream.publish(regulatorState1);
    runtime:sleep(200);

    // Simulate the sample event that represents the door/room closed event.
    roomKeyStream.publish(roomKeyAction);
    runtime:sleep(3000);
}

function alertRoomAction(RoomKeyAction action) {
    io:println("alertRoomAction function invoked for Room : " +
            action.roomNo + " and the action : " +
            action.userAction);
}

```

This streaming query generates an alert if we have switch off the regulator before the temperature reaches 12 degrees.

```ballerina

type RegulatorState record {
    int deviceID;
    int roomNo;
    float tempSet;
    string action;
};

type Temperature record {
    int deviceID;
    int roomNo;
    float temp;
};

stream<RegulatorState> regulatorStateChangeStream = new;
stream<Temperature> tempStream = new;

from regulatorStateChangeStream where (action == 'start') as e1
    followed by  !tempStream where (e1.roomNo == roomNo && temp < 12) 
    && regulatorStateChangeStream where (action == 'off') as e2
select e1.roomNo as roomNo
=> (Alert [] alerts) {
    foreach var alert in alerts {
        alertStream.publish(alert);
    }
}
```

This streaming query generates an alert if the temperature does not reduce to 12 degrees within 5 minutes of switching on the regulator.

```ballerina

type RegulatorState record {
    int deviceID;
    int roomNo;
    float tempSet;
    string action;
};

type Temperature record {
    int deviceID;
    int roomNo;
    float temp;
};

stream<RegulatorState> regulatorStateChangeStream = new;
stream<Temperature> tempStream = new;

from regulatorStateChangeStream where (action == 'start') as e1
        followed by !tempStream
        where (e1.roomNo == roomNo && temp < 12)
        for 5 minutes
select e1.roomNo as roomNo
=> (Alert [] alerts) {
    foreach var alert in alerts {
        alertStream.publish(alert);
    }
}
```


#### Sequence

Sequence is a state machine implementation that allows you to detect the sequence of event occurrences over time.
Here **all matching events need to arrive consecutively** to match the sequence condition, and there cannot be any non-matching events arriving within a matching sequence of events.
This can correlate events within a single stream or between multiple streams.

###### Purpose

This allows you to detect a specified event sequence over a specified time period.

###### Syntax

The syntax for a sequence query is as follows:

```ballerina
from (every)? <input stream> where <filter condition> as <event reference>,
    <input stream where <filter condition> as <event reference>,
    ...
    (within <time gap>)?
select <event reference>.<attribute name>, <event reference>.<attribute name>, ...
=> ( ) {

}
```

| Items | Description |
|-------------------|-------------|
| `,` | This represents the immediate next event, i.e., when an event that matches the first condition arrives, the event that arrives immediately after it should match the second condition. |
| `<event reference>` | This allows you to add a reference to the the matching event so that it can be accessed later for further processing. |
| `(within <time gap>)?` | The `within` clause is optional. It defines the time duration within which all the matching events should occur. |
| `every` | `every` is an optional keyword. This defines whether the matching event should be triggered for every event that arrives at the specified stream with the matching condition. <br/> When this keyword is not used, the matching is carried out only once. |


###### Example

This query generates an alert if the increase in the temperature between two consecutive temperature events exceeds one degree.

```ballerina
from every tempStream as e1, tempStream where (e1.temp + 1 < temp) as e2
select e1.temp as initialTemp, e2.temp as finalTemp
=> (Alert [] alerts) {
    foreach var alert in alerts {
        alertStream.publish(alert);
    }
}
```

##### Counting Sequence

Counting sequences allow you to match multiple events for the same matching condition.
The number of events matched per condition can be limited via condition postfixes such as **Counting Patterns**, or by using the
`[0..]`, `[1..]`, and `[0..1]` operators.

The matching events can also be retrieved using event indexes, similar to how it is done in **Counting Patterns**.

###### Syntax

Each matching condition in a sequence can contain a collection of events as shown below.

```ballerina
from (every)? <input stream>
        where <filter condition> ([0..]|[1..]|[0..1])? as <event reference>,
        <input stream where <filter condition>([0..]|[1..]|[0..1])? as <event reference>,
    ...
    (within <time gap>)?
select <event reference>.<attribute name>, <event reference>.<attribute name>, ...
=> ( ) {

}
```

|Postfix symbol|Required/Optional |Description|
|---------|---------|---------|
| `[1..]` | Optional |This matches **one or more** events to the given condition. |
| `[0..]` | Optional |This matches **zero or more** events to the given condition. |
| `[0..1]` | Optional |This matches **zero or one** events to the given condition. |


###### Example

This streaming query identifies temperature peeks.

```ballerina
import ballerina/runtime;
import ballerina/io;

// Create a record type that represents the device temperature reading.
type DeviceTempInfo record {
    int deviceID;
    int roomNo;
    float temp;
};

// Create a record type that represents the initial temperature and the peak temperature.
type TempDiffInfo record {
    float initialTemp;
    float peakTemp;
};

// The stream that gets the input temperature readings.
stream<DeviceTempInfo> tempStream = new;

// The output stream with peak temperature values.
stream<TempDiffInfo> tempDiffInfoStream = new;

// This is the function that contains the rules that detect the temperature peak values. The first event's temperature
// should be greater than the temperature values that are returned with the next event, which is e2. The last
// temperature value in e2 should be greater than the temperature value that is given in the event e3. This makes
// the last value of e2, the peak temperature.
function deployPeakTempDetectionRules() {
    forever {
        from every tempStream as e1, tempStream
            where e1.temp <= temp [1..] as e2,
        tempStream where e2[e2.length - 1].temp > temp as e3
        select e1.temp as initialTemp,
            e2[e2.length - 1].temp as peakTemp
        => (TempDiffInfo[] tempDiffInfos) {
        // If the sequence is matched, the data is pushed/published to the output stream.
            foreach var tempDiffInfo in tempDiffInfos {
                tempDiffInfoStream.publish(tempDiffInfo);
            }
        }
    }
}

public function main() {

    // Deploy the streaming sequence rules.
    deployPeakTempDetectionRules();

    // Subscribe to the `printInitialAndPeakTemp` function. This prints the peak temperature values.
    tempDiffInfoStream.subscribe(printInitalAndPeakTemp);

    // Simulating the data that is being sent to the `tempStream` stream.
    DeviceTempInfo t1 = { deviceID: 1, roomNo: 23, temp: 20.0 };
    DeviceTempInfo t2 = { deviceID: 1, roomNo: 23, temp: 22.5 };
    DeviceTempInfo t3 = { deviceID: 1, roomNo: 23, temp: 23.0 };
    DeviceTempInfo t4 = { deviceID: 1, roomNo: 23, temp: 21.0 };
    DeviceTempInfo t5 = { deviceID: 1, roomNo: 23, temp: 24.0 };
    DeviceTempInfo t6 = { deviceID: 1, roomNo: 23, temp: 23.9 };

    // Start simulating the events with the temperature readings.
    tempStream.publish(t1);
    runtime:sleep(200);

    tempStream.publish(t2);
    runtime:sleep(200);

    tempStream.publish(t3);
    runtime:sleep(200);

    tempStream.publish(t4);
    runtime:sleep(200);

    tempStream.publish(t5);
    runtime:sleep(200);

    tempStream.publish(t6);
    runtime:sleep(2000);
}

// The function that prints the peak temperature readings.
function printInitalAndPeakTemp(TempDiffInfo tempDiff) {
    io:println("printInitalAndPeakTemp function is invoked. " +
                    "InitialTemp : " + tempDiff.initialTemp +
                        " and Peak temp : " + tempDiff.peakTemp);
}

```

##### Logical Sequence

Logical sequences identify logical relationships using `&&`, `||` and `!` on consecutively arriving events.

###### Syntax
The syntax for a logical sequence is as follows:

```ballerina
from (every)? (!)? <input stream> where <filter condition> as <event reference>
          ((&& | ||) <input stream> where <filter condition>)? as <event reference>
          (within <time gap>)?,
    ...
select <event reference>([event index])?.<attribute name>, ...
=> ( ) {

}
```

Keywords such as `&&`, `||`, or `!` can be used to illustrate the logical relationship, similar to how it is done in **Logical Patterns**.

###### Example

This streaming query notifies the state when a regulator event is immediately followed by both temperature and humidity events.

```ballerina

type Temperature record {
    int deviceID;
    float temp;
};

type Humidity record {
    int deviceID;
    float humid;
};

type Regulator record {
    int deviceID;
    boolean isOn;
};

stream<Temperature> tempStream = new;
stream<Humidity> humidStream = new;
stream<Regulator> regulatorStream = new;

from every regulatorStream as e1, tempStream as e2 && humidStream as e3
select e2.temp, e3.humid
=> (Notification [] notifications) {
    foreach var notification in notifications {
        stateNotificationStream.publish(notification);
    }
}
```


#### Output rate limiting

Output rate limiting allows queries to output events periodically based on a specified condition.

###### Purpose

This allows you to limit the output to avoid overloading the subsequent executions, and to remove unnecessary
information.

###### Syntax

The syntax of an output rate limiting configuration is as follows:

```ballerina
from <input stream> ...
select <attribute name>, <attribute name>, ...
output <rate limiting configuration>
=> ( ) {

}
```
Ballerina stream processing supports three types of output rate limiting configurations as explained in the following table:

Rate limiting configuration|Syntax| Description
---------|---------|--------
Based on time | `<output event> every <time interval>` | This outputs `<output event>` every `<time interval>` time interval.
Based on number of events | `<output event> every <event interval> events` | This outputs `<output event>` for every `<event interval>` number of events.
Snapshot based output | `snapshot every <time interval>`| This outputs all events in the window (or the last event if no window is defined in the query) for every given `<time interval>` time interval.

Here the `<output event>` specifies the event(s) that should be returned as the output of the query.
The possible values are as follows:
* `first` : Only the first event processed by the query during the specified time interval/sliding window is emitted.
* `last` : Only the last event processed by the query during the specified time interval/sliding window is emitted.
* `all` : All the events processed by the query during the specified time interval/sliding window are emitted. **When no `<output event>` is defined, `all` is used by default.**

###### Examples

+ Returning events based on the number of events

    Here, events are emitted every time the specified number of events arrive. You can also specify whether to emit only the first event/last event, or all the events out of the events that arrived.

    In this example, the last temperature per sensor is emitted for every 10 events.

```ballerina
from tempStream
select temp, deviceID
group by deviceID
output last every 10 events
=> (LowRateTemperature [] values) {

}
```

+ Returning events based on time

    Here events are emitted for every predefined time interval. You can also specify whether to emit only the first event, last event, or all events out of the events that arrived during the specified time interval.

    In this example, emits all temperature events every 10 seconds

```ballerina
from tempStream
output every 10 seconds
=> (LowRateTemperature [] values) {

}
```

+ Returning a periodic snapshot of events

    This method works best with windows. If the input stream is not connected to a window, only the last current event for each predefined time interval is emitted.

    This query emits a snapshot of the events in a time window of 5 seconds every 1 second.

```ballerina
from tempStream window time(5000)
output snapshot every 1 second
=> (SnapshotTemperature [] values) {

}
```
