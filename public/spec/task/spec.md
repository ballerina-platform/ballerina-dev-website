# Specification: Ballerina Task Library

_Owners_: @daneshk @kalaiyarasiganeshalingam
_Reviewers_: @daneshk  
_Created_: 2021/12/12  
_Updated_: 2025/07/24  
_Edition_: Swan Lake  

## Introduction
This is the specification for the Task standard library of [Ballerina language](https://ballerina.io/), which provides APIs to schedule a Ballerina job either once or periodically and manage the execution of those jobs.

The Task library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Job](#2-job)
3. [Worker Pool and Waiting Time](#3-worker-pool-and-waiting-time)
4. [Job Scheduling](#4-job-scheduling)
5. [Manage Scheduled Jobs](#5-manage-scheduled-jobs)
    * 5.1. [Pause All Jobs](#51-pause-all-jobs)
    * 5.2. [Resume All Jobs](#52-resume-all-jobs)
    * 5.3. [Pause Job](#53-pause-job)
    * 5.4. [Resume Job](#54-resume-job)
    * 5.5. [Get Running Jobs](#55-get-running-jobs)
6. [Unschedule a Particular Scheduled Job](#6-unschedule-a-particular-scheduled-job)
7. [Task listener](#7-task-listener)
    * 7.1. [Configuration](#71-configuration)
      * 7.1.1. [Trigger configuration](#711-trigger-configuration)
      * 7.1.2. [Warm backup configuration](#712-warm-backup-configuration)
      * 7.1.3. [Retry configuration](#713-retry-configuration)
    * 7.2. [Functions](#72-functions)
    * 7.3. [Service implementation](#73-service-implementation)
    * 7.4. [Listener example](#74-listener-example)
8. [Task coordination](#8-task-coordination)
    * 8.1. [Configurations](#81-configurations)
      * 8.1.1. [Configuration parameters](#811-configuration-parameters)
      * 8.1.2. [Database configuration](#812-database-configuration)
    * 8.2. [Task coordination example](#82-task-coordination-example)
    * 8.3. [Database schema](#83-database-schema)

## 1. Overview

This specification elaborates on the functionalities available in the Task library.

This library provides APIs based on the following category:
- Job
- Worker Pool and Waiting time
- Schedule Jobs
- Manage Job
- UnSchedule Job

## 2. Job
The Ballerina Job object provides the abstraction for a job instance, which execution() method will be executed by triggering the task. Hence, Users have to create a class with custom logic and pass it to schedule a job. 
```ballerina
public type Job object {

  # Executes by the Scheduler when the scheduled trigger fires.
  public function execute();
};
```

## 3. Worker Pool and Waiting Time

The worker pool provides a set of threads for tasks to use when executing Jobs. If more threads are in the pool, the greater number of jobs can be run concurrently. The waiting time is the number of seconds as a decimal. The scheduler will tolerate this period before being considered as `ignored the trigger`. The following API provides to manage these configurations:
```ballerina
public isolated function configureWorkerPool(int workerCount = 5, time:Seconds waitingTime = 5) returns Error?
```

## 4. Job Scheduling

The package has two scheduling systems to schedule the job:

- **One-time Job Execution**

  Schedule the given Ballerina job at a specified date and time. Once scheduled, it will return a `JobId` which can be used to manage the job.
  ```ballerina
   public isolated function scheduleOneTimeJob(Job job, time:Civil triggerTime) returns JobId|Error
  ```
- **Frequency-based Job Execution**
  
  Schedule the recurring Ballerina job according to the given duration. Once scheduled, it will return the job ID, which can be used to manage the job.
  Users can configure the following configurations to create different triggers.
    - Interval: The duration of the trigger (in seconds), which is used to run the job frequently
    - maxCount: The maximum number of trigger counts
    - startTime: The start time of the trigger is in Ballerina `time:Civil`. If it is not provided, a trigger will start immediately
    - endTime: The end time of the trigger is in Ballerina `time:Civil`
    - taskPolicy: The policy, which is used to handle the error and will be waiting during the trigger time
        ```ballerina
        public isolated function scheduleJobRecurByFrequency(Job job,  decimal interval,  int maxCount = -1, time:Civil? startTime = (), time:Civil? endTime = (), TaskPolicy taskPolicy = {}) returns JobId|Error
        ```
**Task Policy**

This package provides the following two policies to manage triggers:

- **Error Policy**
  
  This policy is used to give instruction on what to do when there is an error by executing `Job` by the trigger. 
  Users can use one of the policies to handle the error.
  - LOG_AND_TERMINATE: This is used to log that error message and unschedule that job from the scheduler.
  - LOG_AND_CONTINUE: This is used to log that error message and continue that job.
  - TERMINATE: This is used to unschedule that job from the scheduler without logging that message.
  - CONTINUE: This is used to continue that job without logging that message.
    
- **Waiting Policy**

  The policy is used to give instruction on what to do when the task is triggering while the resource is not available/enough to run this task.
  Users can use one of the policies to execute the pending job.
    - WAIT: The pending task will wait until getting the resources to execute that job.
    - IGNORE: Ignore the pending task
    - LOG_AND_IGNORE: Log and ignore the pending task

## 5. Manage Scheduled Jobs

The following APIs provide by this package to manage the scheduled jobs.

### 5.1. Pause All Jobs
The following API is used to pause all the jobs.
```ballerina
public isolated function pauseAllJobs() returns Error?
```
### 5.2. Resume All Jobs
The following API is used to resume all the jobs.
```ballerina
public isolated function resumeAllJobs() returns Error?
```
### 5.3. Pause Job
The following API is used to pause all the jobs.
```ballerina
public isolated function pauseJob(JobId jobId) returns Error?
```
### 5.4. Resume Job
The following API is used to resume all the jobs.
```ballerina
public isolated function resumeJob(JobId jobId) returns Error?
```
### 5.5. Get Running Jobs
The following API is used to get all the running jobs.
```ballerina
public isolated function getRunningJobs() returns JobId[]
```

## 6. Unschedule a Particular Scheduled Job
Unschedule the `Job`, which is associated with the given job ID. If no job is running in 
the scheduler, the scheduler will be shut down automatically.
```ballerina
public isolated function unscheduleJob(JobId jobId) returns Error?
```

## 7. Task Listener

Scheduling a task in Ballerina typically requires blocking the main strand when running in the main function. In both monolithic and microservice architectures, applications are usually deployed as long-running services rather than as main functions with explicit termination. The task listener addresses this by allowing developers to implement scheduled tasks as services.

### 7.1. Configuration

The task listener requires a schedule configuration (one-time or recurring) and supports an optional worker pool.

```ballerina
# Listener configuration.
#
# + schedule - The schedule configuration for the listener
public type ListenerConfiguration record {|
  TriggerConfiguration trigger;
  WarmBackupConfig? warmBackupConfig = ();
|};
```

#### 7.1.1. Trigger Configuration

The trigger configuration defines how and when a task should be executed. It specifies the execution interval, timing constraints, and policies for handling errors and resource availability during task execution.

```ballerina
# Recurring schedule configuration.
#
# + interval - The duration of the trigger (in seconds), which is used to run the job frequently
# + maxCount - The maximum number of trigger counts
# + startTime - The trigger start time in Ballerina `time:Civil`. If not provided, the trigger will
#               start immediately
# + endTime - The trigger end time in Ballerina `time:Civil`
# + taskPolicy - The policy used to handle errors and waiting during the trigger time
public type TriggerConfiguration record {|
  decimal interval;
  int maxCount = -1;
  time:Civil startTime?;
  time:Civil endTime?;
  task:TaskPolicy taskPolicy = {};
  task:RetryConfig retryConfig = ();
|};
```

#### 7.1.2. Warm Backup Configuration

The warm backup configuration enables high availability for distributed task execution by coordinating multiple nodes through a database. It ensures that only one node executes the task while others remain on standby, automatically switching over if the active node fails. More details can be found in the [Task Coordination](#8-task-coordination) section.

```ballerina
# Represents the configuration required for task coordination.
#
# + databaseConfig - The database configuration for task coordination
# + livenessCheckInterval - The interval (in seconds) to check the liveness of the job. Default is 30 seconds.
# + taskId - Unique identifier for the current task
# + groupId - The identifier for the group of tasks. This is used to identify the group of tasks that are
#             coordinating the task. It is recommended to use a unique identifier for each group of tasks.
# + heartbeatFrequency - The interval (in seconds) for the node to update its heartbeat. Default is one second.
public type WarmBackupConfig record {
  DatabaseConfig databaseConfig = <MysqlConfig>{};
  int livenessCheckInterval = 30;
  string taskId;
  string groupId;
  int heartbeatFrequency = 1;
};

# Represents the configuration required to connect to a database related to task coordination.
public type DatabaseConfig MysqlConfig|PostgresqlConfig;
```

#### 7.1.3. Retry Configuration

The retry configuration defines the behavior for retrying failed job executions. It allows you to specify the maximum number of attempts, retry intervals, and backoff strategies to handle transient failures gracefully.

Retry functionality is activated only when `retryConfig` is explicitly configured. Once enabled, the system will automatically retry failed job executions until one of the following conditions is met.

* The job execution succeeds
* The maximum number of attempts is reached
* The retry interval exceeds the trigger interval

The initial retry attempt occurs after the time period specified by retryInterval. The behavior of subsequent retry intervals depends on the chosen backoff strategy.

* **FIXED**: The retry interval remains constant for all retry attempts. For example, if `retryInterval` is set to 5 seconds, each retry will occur exactly 5 seconds after the previous failure.

* **EXPONENTIAL**: The retry interval increases exponentially with each attempt. For instance, with an initial `retryInterval` of 2 seconds, subsequent retries might occur at 4, 8, 16, 32 seconds, and so on.

If the time taken for retry attempts exceeds the trigger's execution interval, retries are automatically stopped. This prevents scenarios where retry attempts would occur after the next scheduled execution.

The `maxInterval` parameter sets an upper bound on retry intervals, particularly useful with exponential backoff to prevent excessively long wait times between attempts.

```ballerina
# Retry configuration for job execution.
#
# + maxAttempts - Maximum number of retry attempts
# + retryInterval - Initial wait time before the first retry attempt
# + backoffStrategy - Strategy for calculating subsequent retry intervals
# + maxInterval - Maximum allowed interval between retry attempts
public type RetryConfiguration record {|
  int maxAttempts;
  int retryInterval;
  RetryStrategy backoffStrategy;
  int maxInterval;
|};

# Supported retry strategies for job execution.
public enum RetryStrategy {
  FIXED,
  EXPONENTIAL
};
```

### 7.2. Functions

The task listener provides the following APIs:

* Lifecycle Management
  * `start()`: Starts the task listener.
  * `gracefulStop()`: Stops the task listener gracefully.
  * `immediateStop()`: Stops the task listener immediately.
  * `attach(service)`/`scheduleJob(service)`: Attaches or schedules a task service to the task listener.
  * `detach(service)`/`unscheduleJob(service)`: Detaches or unschedules a task service from the task listener.

### 7.3. Service Implementation

Each task service should have a unique task ID for job management, specified in the service declaration as an attachment point. The service must also implement the `execute` function, which defines the job's execution logic and handles errors.

```ballerina
service "job-1" on taskListener {
  function execute() returns error? {
    // Job implementation
  }
}
```

> **Note:** If a job is implemented without an ID, the listener generates a unique one. However, this prevents explicit job management, making it difficult to track individual jobs when multiple are running.

### 7.4. Listener Example

The following example demonstrates using a task listener to execute a scheduled job:

```ballerina
import ballerina/io;
import ballerina/task;

listener task:Listener taskListener = new(trigger = {interval: 1});

service "job-1" on taskListener {
  private int i = 1;

  function execute() returns error? {
    lock {
      self.i += 1;
      io:println("MyCounter: ", self.i);
    }
  }
}
```

## 8. Task Coordination

Task coordination support is designed for distributed systems where high availability is necessary. The coordination mechanism ensures that when tasks are running on multiple nodes, only one node is active while others remain on standby. If the active node fails, one of the standby nodes automatically takes over, maintaining system availability.

Here, an RDBMS-based coordination system is used to handle system availability across multiple nodes, improving the reliability and uptime of distributed applications.

The task coordination system follows a warm backup approach where:

* Multiple nodes run the same program logic on separate tasks
* One node is designated as the token bearer and executes the program logic
* Other nodes act as watchdogs by monitoring the status of the token bearer node
* If the active node fails, one of the candidate nodes takes over automatically

## 8.1. Configurations

The task coordination system can be configured using the `WarmBackupConfig` record under `ListenerConfiguration`. Coordination can only be done through a task listener. This handles how each node participates in coordination, how frequently it checks for liveness, updates its status, and connects to the coordination database. The types for warm backup configurations are defined in the [7.1.2. Warm Backup Configuration](#712-warm-backup-configuration) section.

### 8.1.1. Configuration Parameters

| Parameter | Description |
|-----------|-------------|
| **databaseConfig** | Database configuration for task coordination |
| **livenessCheckInterval** | Interval (in seconds) to check the liveness of the active node |
| **taskId** | Unique identifier for the current node |
| **groupId** | Identifier for the group of nodes coordinating the task |
| **heartbeatFrequency** | Interval (in seconds) for the node to update its heartbeat |

### 8.1.2. Database Configuration

The `databaseConfig` can be either MySQL or PostgreSQL. This is defined using a union type as `DatabaseConfig`. Users can choose either `task:MysqlConfig` or `task:PostgresqlConfig` based on their preferred database.

**For PostgreSQL:**

```ballerina
# Represents the configuration required to connect to a database related to task coordination.
#
# + host - The hostname of the database server
# + user - The username for the database connection
# + password - The password for the database connection
# + port - The port number of the database server
# + database - The name of the database to connect to
public type PostgresqlConfig record {
  string host = "localhost";
  string? user = ();
  string? password = ();
  int port = 5432;
  string? database = ();
};
```

**For MySQL:**

```ballerina
# Represents the configuration required to connect to a database related to task coordination.
#
# + host - The hostname of the database server
# + user - The username for the database connection
# + password - The password for the database connection
# + port - The port number of the database server
# + database - The name of the database to connect to
public type MysqlConfig record {
  string host = "localhost";
  string? user = ();
  string? password = ();
  int port = 3306;
  string? database = ();
};
```

## 8.2. Task Coordination Example

**Listener with coordination support:**

```ballerina
listener task:Listener taskListener = new (
  trigger = {
    interval,
    maxCount
  }, 
  warmBackupConfig = {
    databaseConfig,
    livenessCheckInterval,
    taskId, // must be unique for each node
    groupId,
    heartbeatFrequency
  }
);
```

**Service with coordination support:**

Create a service with your business logic in the `execute` method.

```ballerina
service "job-1" on taskListener {
  private int i = 1;

  isolated function execute() {
    // Add the business logic
  }
}
```

On a different node, deploy the same code but with a different value for `taskId`. For example, if the `taskId` on one node is `node-1`, set it to `node-2` on the other node to ensure uniqueness.

### 8.3. Database Schema

The task coordination system requires two essential tables that must be created before starting your application.

**Token Holder Table:**

The `token_holder` table maintains information about which node is currently the active token bearer.

| Column | Type | Description |
|--------|------|-------------|
| group_id | VARCHAR(255) | Primary key, identifies the coordination group |
| task_id | VARCHAR(255) | The ID of the node |
| term | INTEGER | Increments with each leadership change, prevents split-brain scenarios |

> **Note:** A database lock needs to be added to prevent concurrent rewrites to the `token_holder` table.

**Health Check Table:**

The `health_check` table stores heartbeat information for each node.

| Column | Type | Description |
|--------|------|-------------|
| task_id | VARCHAR(255) | Node identifier (part of compound primary key) |
| group_id | VARCHAR(255) | Group identifier (part of compound primary key) |
| last_heartbeat | TIMESTAMP | Last time the node sent a heartbeat |
