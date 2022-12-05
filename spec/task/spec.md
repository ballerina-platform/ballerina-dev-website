# Specification: Ballerina Task Library

_Owners_: @daneshk @kalaiyarasiganeshalingam                                      
_Reviewers_: @daneshk  
_Created_: 2021/12/12  
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction
This is the specification for the Task standard library of [Ballerina language](https://ballerina.io/), which provides APIs to schedule a Ballerina job either once or periodically and manage the execution of those jobs.

The Task library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

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