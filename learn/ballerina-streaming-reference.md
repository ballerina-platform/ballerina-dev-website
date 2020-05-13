---
layout: ballerina-left-nav-pages
title: Ballerina Streaming Reference Guide
permalink: /learn/ballerina-streaming-reference/
active: ballerina-streaming-reference
redirect_from:
  - /learn/ballerina-streaming-reference
  - /v1-2/learn/ballerina-streaming-reference
  - /v1-2/learn/ballerina-streaming-reference/
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
            e.g., The following query select all the attributes in the `tempStream` stream.
            <pre>from tempStream<br>select *<br>=> ( ) { <br/><br/>}</pre>
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
                         == ()
                    </td>
                    <td>
                        Nil check
                    </td>
                    <td>
                        <pre>deviceID == ()</pre>
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

    `externalTimeBatch(timeStamp, int windowTime, int? startTime, int? timeout, boolean? replaceTimestampWithBatchEndTime)`

    A batch (tumbling) time window based on external time, that holds events arrived during `windowTime` periods, and
     gets updated for every `windowTime`. Here the `timeStamp` should be an attribute of the record which is used as
     the constraint type of relevant input stream. As the `timeStamp` parameter you should pass `<streamName>
     .<attiributeName>`. Parameters `startTime` and `timeout` are optional parameters. `startTime` can be used to
     specify a user defined time to start the first batch. `timeout` is time to wait for arrival of new event, before
     flushing and giving output for events belonging to a specific batch. Usually `timeout` is greater than
     `windowTime`. If `replaceTimestampWithBatchEndTime` is true replaces the event time with the current time batch’s end time.

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

The syntax for the `group by` aggregate function is as follows:

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
