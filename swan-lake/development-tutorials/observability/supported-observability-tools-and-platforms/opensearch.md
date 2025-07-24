---
title: Observe metrics, tracing and logs using OpenSearch
description: See how Ballerina supports observability by exposing itself via metrics, tracing and logs to OpenSearch.
keywords: ballerina, observability, metrics, tracing, logs, opensearch
permalink: /learn/supported-observability-tools-and-platforms/opensearch/
active: opensearch
intro: Users can observe Ballerina programs with [OpenSearch](https://opensearch.org/), which is a community-driven, Apache 2.0-licensed open source search and analytics suite that makes it easy to ingest, search, visualize, and analyze data. It provides a highly scalable system for providing fast access and response to large volumes of data with an integrated visualization tool, OpenSearch Dashboards, that makes it easy for users to explore their data.
---

The sample [shop service](/learn/overview-of-ballerina-observability/#example-observe-a-ballerina-service) will be used in this guide.

Follow the steps given below to view Ballerina metrics, traces and logs in OpenSearch.

## Step 1 - Set up Ballerina application for observability

1. Open the `main.bal` file in the Ballerina package and add the following imports.

   ```ballerina
   import ballerinax/metrics.logs as _;
   import ballerinax/jaeger as _;
   ```
   
2. Add `cloud = "docker"` under the `[build-options]` table into the `Ballerina.toml` file in the package.

    ```toml
    [build-options]
    cloud = "docker"
    ```
3. Create a file named `Cloud.toml` in the package directory and add the content below.

    ```toml
    [container.image]
    repository="wso2inc" # Docker repository name
    name="sample-service" # container name
    tag="v0.1.0"

    [settings]
    buildImage=true
    ```
    
    This file is used to build the Docker image for the Ballerina application.

4. Create the `Config.toml` file in the package directory or anywhere else and paste the following content.

    ```toml
    [ballerina.observe]
    metricsLogsEnabled = true
    tracingEnabled = true
    tracingProvider = "jaeger"
    
    [ballerinax.jaeger]
    agentHostname = "data-prepper"
    agentPort = 4317
    samplerType = "const"
    samplerParam = 1.0
    reporterFlushInterval = 2000
    reporterBufferSize = 1000
    
    [ballerinax.metrics.logs]
    logFilePath = "/var/log/ballerina/sample-service/app.log"
    ```
    
    This configuration enables metrics logs and tracing in the Ballerina application and configures the Jaeger exporter.

5. Build the Ballerina application as a Docker image using the command below.

   ```
   $ bal build
   ```

   This will create a Docker image named `wso2inc/sample-service:v0.1.0`.

## Step 2 - Set up OpenSearch

This section focuses on configuring OpenSearch with Docker as a quick installation.

1. Create the following folder structure in your local machine.

   ```
   ├── config
   │   ├── ballerina
   │   │   └── Config.toml
   │   ├── dashboards
   │   │   └── opensearch_dashboards.yml
   │   ├── data-prepper
   │   │   └── pipelines.yaml
   │   └── fluent-bit
   │       ├── fluent-bit.conf
   │       ├── parsers.conf
   │       └── scripts
   │           └── scripts.lua
   ├── logs
   │   └── ballerina
   ├── setup
   │   ├── opensearch-integration-artifacts.ndjson
   │   └── index-template-request.json
   └── docker-compose.yml
   ```

2. Create `docker-compose.yml` file with the following content.
    
    ```yaml
    version: '3.8'

    services:
      opensearch:
        image: opensearchproject/opensearch:latest
        container_name: opensearch
        environment:
          - discovery.type=single-node
          - bootstrap.memory_lock=true
          - "OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g"
          - "OPENSEARCH_INITIAL_ADMIN_PASSWORD=Ballerina@123"
          - "plugins.security.disabled=false"
        ulimits:
          memlock:
            soft: -1
            hard: -1
          nofile:
            soft: 65536
            hard: 65536
        ports:
          - "9200:9200"
          - "9600:9600"
        volumes:
          - opensearch_data:/usr/share/opensearch/data
        networks:
          - observability
        healthcheck:
          test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health?wait_for_status=yellow&timeout=10s || exit 1"]
          interval: 15s
          timeout: 10s
          retries: 10
          start_period: 60s  # Give more time for initial startup

      opensearch-dashboards:
        image: opensearchproject/opensearch-dashboards:latest
        container_name: opensearch-dashboards
        ports:
          - "5601:5601"
        environment:
          - 'OPENSEARCH_HOSTS=["https://opensearch:9200"]'
          - "DISABLE_SECURITY_DASHBOARDS_PLUGIN=false"
        volumes:
          - ./config/dashboards/opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml
        depends_on:
          opensearch:
            condition: service_healthy
        networks:
          - observability

      data-prepper:
        image: opensearchproject/data-prepper:latest
        container_name: data-prepper
        ports:
          - "4900:4900"  # Data Prepper API
          - "4317:4317"  # OTLP gRPC receiver
          - "8021:8021"
        volumes:
          - ./config/data-prepper/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml
        depends_on:
          opensearch:
            condition: service_healthy
        networks:
          - observability

      fluent-bit:
        image: fluent/fluent-bit:latest
        container_name: fluent-bit
        ports:
          - "2020:2020"
        volumes:
          - ./config/fluent-bit/fluent-bit.conf:/fluent-bit/etc/fluent-bit.conf
          - ./config/fluent-bit/parsers.conf:/fluent-bit/etc/parsers.conf
          - ./config/fluent-bit/scripts:/fluent-bit/scripts
          - ./logs/ballerina:/var/log/ballerina:ro
        depends_on:
          opensearch:
            condition: service_healthy
        networks:
          - observability

      opensearch-setup:
        image: curlimages/curl:latest
        container_name: opensearch-setup
        volumes:
          - ./setup:/setup
        networks:
          - observability
        depends_on:
          opensearch-dashboards:
            condition: service_started
        command: >
          sh -c "
            echo 'Waiting for OpenSearch to be ready...' &&
            until curl -ku admin:Ballerina@123 https://opensearch:9200/_cluster/health; do
              echo 'Waiting for OpenSearch...' &&
              sleep 10
            done &&

            echo 'Creating index templates...' &&
            curl -X PUT 'https://opensearch:9200/_index_template/wso2_integration_application_log_template' -ku admin:Ballerina@123 -H 'Content-Type: application/json' -d @/setup/index-template-request.json &&

            echo 'Waiting for OpenSearch Dashboards to be ready...' &&
            until curl -f -u admin:Ballerina@123 http://opensearch-dashboards:5601/api/status; do
              echo 'Waiting for OpenSearch Dashboards...' &&
              sleep 10
            done &&

            echo 'Importing dashboards...' &&
            curl -X POST 'http://opensearch-dashboards:5601/api/saved_objects/_import' -ku admin:Ballerina@123 -H 'osd-xsrf: true' -F file=@/setup/opensearch-integration-artifacts.ndjson &&

            echo 'Setup completed successfully!'
          "

      sample-service:
        image: wso2inc/sample-service:v0.1.0
        container_name: sample-service
        ports:
          - "8090:8090"
        volumes:
          - ./config/ballerina/Config.toml:/home/ballerina/Config.toml
          - ./logs/ballerina/sample-service:/var/log/ballerina/sample-service
        environment:
          - BAL_CONFIG_FILES=/home/ballerina/Config.toml
        depends_on:
          opensearch:
            condition: service_healthy
        networks:
          - observability

    volumes:
      opensearch_data:

    networks:
      observability:
        driver: bridge
    ```

3. Create the following configuration files in the `config` folder.

    - `config/ballerina/Config.toml`

        Use the same content as in the previous step, which enables metrics logs and tracing in the Ballerina application and configures the Jaeger exporter.
   
    - `config/dashboards/opensearch_dashboards.yml`
    
       ```yaml
       # Server configuration
       server.name: opensearch-dashboards
       server.host: "0.0.0.0"
       server.port: 5601
      
       # OpenSearch connection
       opensearch.hosts: ["http://opensearch:9200"]
      
       opensearch.ssl.verificationMode: none
       opensearch.username: "admin"
       opensearch.password: "Ballerina@123"
       opensearch.requestHeadersWhitelist: [authorization, securitytenant]

       opensearch_security.multitenancy.enabled: true
       opensearch_security.multitenancy.tenants.preferred: [Private, Global]
       opensearch_security.readonly_mode.roles: [kibana_read_only]
       # Use this setting if you are running opensearch-dashboards without https
       opensearch_security.cookie.secure: false

       # Branding configuration
       opensearchDashboards.branding.logo.defaultUrl: "https://raw.githubusercontent.com/wso2/observability-resources/main/images/wso2-dashboard-logo.png"
       opensearchDashboards.branding.mark.defaultUrl: "https://raw.githubusercontent.com/wso2/observability-resources/main/images/wso2-dashboard-icon.png"
       opensearchDashboards.branding.loadingLogo.defaultUrl: "https://raw.githubusercontent.com/wso2/observability-resources/main/images/loading.png"
       opensearchDashboards.branding.applicationTitle: "WSO2 Dashboard"

       # Logging configuration for debugging
       logging.dest: stdout
       logging.silent: false
       logging.quiet: false
       ```
   
    - `config/data-prepper/pipelines.yaml`
    
       ```yaml
       entry-pipeline:
         delay: "100"
         source:
           otel_trace_source:
             port: 4317
             ssl: false
         sink:
           - pipeline:
               name: "raw-pipeline"
           - pipeline:
               name: "service-map-pipeline"
           - stdout: {}
   
       raw-pipeline:
         source:
           pipeline:
             name: "entry-pipeline"
         processor:
           - otel_traces:
         sink:
           - opensearch:
               hosts: [ "https://opensearch:9200" ]
               username: "admin"
               password: "Ballerina@123"
               insecure: true        
               index_type: trace-analytics-raw
    
       service-map-pipeline:
         delay: "100"
         source:
           pipeline:
             name: "entry-pipeline"
         processor:
           - service_map:
         sink:
           - opensearch:
               hosts: [ "https://opensearch:9200" ]
               username: "admin"
               password: "Ballerina@123"
               insecure: true
               index_type: trace-analytics-service-map
       ```

    - `config/fluent-bit/fluent-bit.conf`

       ```apache
       [SERVICE]
          Flush         1
          Log_Level     info
          Daemon        off
          Parsers_File  parsers.conf
          HTTP_Server   On
          HTTP_Listen   0.0.0.0
          HTTP_Port     2020

       # Input from Ballerina log files
       [INPUT]
          Name              tail
          Path              /var/log/ballerina/*/app.log
          Parser            bal_logfmt_parser
          Tag               ballerina.*
          Refresh_Interval  5
          Mem_Buf_Limit     256MB
          Skip_Long_Lines   On
          Read_from_Head    On
          Path_Key          log_file_path

       # Add application name from file path
       [FILTER]
          Name    lua
          Match   *
          Script  /fluent-bit/scripts/scripts.lua
          Call    extract_app_from_path

       # ========== BALLERINA LOG PROCESSING ==========

       # Enrich all Ballerina logs with common fields
       [FILTER]
          Name    lua
          Match   ballerina.*
          Script  /fluent-bit/scripts/scripts.lua
          Call    enrich_bal_logs

       # Construct Ballerina app names
       [FILTER]
          Name    lua
          Match   ballerina.*
          Script  /fluent-bit/scripts/scripts.lua
          Call    construct_bal_app_name

       # First: Separate Ballerina metrics logs (those with logger="metrics")
       [FILTER]
          Name rewrite_tag
          Match ballerina.*
          Rule $logger ^metrics$ ballerina_metrics false
          Emitter_Name re_emitted_bal_metrics

       # Second: Route remaining ballerina logs to application logs
       # This catches all ballerina.* logs that weren't retagged as metrics
       [FILTER]
          Name rewrite_tag
          Match ballerina.*
          Rule $module .* ballerina_app_logs false
          Emitter_Name re_emitted_bal_app_logs

       # Process Ballerina metrics
       [FILTER]
          Name    lua
          Match   ballerina_metrics
          Script  /fluent-bit/scripts/scripts.lua
          Call    extract_bal_metrics_data

       # ========== OUTPUT CONFIGURATIONS ==========

       # Ballerina Application Logs
       [OUTPUT]
          Name opensearch
          Host opensearch
          HTTP_User admin
          HTTP_Passwd Ballerina@123
          Logstash_Format On
          Logstash_DateFormat %Y-%m-%d
          Logstash_Prefix ballerina-application-logs
          Match ballerina_app_logs
          Port 9200
          Replace_Dots On
          Suppress_Type_Name On
          tls On
          tls.verify Off
          Trace_Error On

       # Ballerina Metrics Logs
       [OUTPUT]
          Name opensearch
          Host opensearch
          HTTP_User admin
          HTTP_Passwd Ballerina@123
          Logstash_Format On
          Logstash_DateFormat %Y-%m-%d
          Logstash_Prefix ballerina-metrics-logs
          Match ballerina_metrics
          Port 9200
          Replace_Dots On
          Suppress_Type_Name On
          tls On
          tls.verify Off
          Trace_Error On

       # Fallback for any unmatched logs
       [OUTPUT]
          Name opensearch
          Host opensearch
          HTTP_User admin
          HTTP_Passwd Ballerina@123
          Logstash_Format On
          Logstash_DateFormat %Y-%m-%d
          Logstash_Prefix general-logs
          Match_regex ^(wso2mi|wso2apim).*
          Port 9200
          Replace_Dots On
          Suppress_Type_Name On
          tls On
          tls.verify Off
          Trace_Error On
       ```
   
    - `config/fluent-bit/parsers.conf`

       ```apache
       [PARSER]
          Name        bal_logfmt_parser
          Format      logfmt
          Types       response_time_seconds:float
          Time_Key    time
          Time_Format %Y-%m-%dT%H:%M:%S.%L%z
          Time_Keep   On
   
       [PARSER]
          Name        bal_parser
          Format      logfmt
          Types       response_time_seconds:float
   
       [PARSER]
          Name        jsonparser
          Format      json
          Time_Key    time
          Time_Keep   On
   
       [PARSER]
          Name        docker
          Format      json
          Time_Key    time
          Time_Format %Y-%m-%dT%H:%M:%S.%L
          Time_Keep   On
       ```

    - `config/fluent-bit/scripts/scripts.lua`
    
      ```lua
      function extract_app_from_path(tag, timestamp, record)
         if record["log_file_path"] then
            local path = record["log_file_path"]
            -- Extract application name from path like /var/log/ballerina/*/app.log
            local app_name = string.match(path, "/var/log/[^/]+/([^/]+)/")
            if app_name then
               record["app_name"] = app_name
            else
               record["app_name"] = "unknown"
            end
   
            -- Extract service type from path
            local service_type = string.match(path, "/var/log/([^/]+)/")
            if service_type then
               record["service_type"] = service_type
            end
         end
         return 1, timestamp, record
      end
   
      function construct_bal_app_name(tag, timestamp, record)
         local deployment = record["app_name"] or "unknown"
    
         local moduleName = record["module"]
         if record["src.module"] then
            moduleName = record["src.module"]
         end

         if moduleName then
            record["app"] = deployment .. " - " .. moduleName
         else
            record["app"] = deployment 
         end
    
         record["deployment"] = deployment
         return 1, timestamp, record
      end
   
      function extract_bal_metrics_data(tag, timestamp, record)
         -- Only process if this is a metrics log
         if record["logger"] ~= "metrics" then
            return 1, timestamp, record
         end

         local transport = record["protocol"] or "Unknown"
         local integration = record["src.object.name"] or "Unknown"
    
         if record["src.main"] == "true" then
            integration = "main"
         end
    
         local sublevel = record["entrypoint.function.name"] or ""
         local method = record["http.method"] or ""
         local response_time = record["response_time_seconds"] or 0
         local status = "successful"
    
         if record["http.status_code_group"] == "4xx" or record["http.status_code_group"] == "5xx" then
            status = "failed"
         end

         -- Convert to milliseconds and round
         response_time = response_time * 1000
         response_time = math.floor(response_time + 0.5)

         record["response_time"] = response_time
         record["status"] = status
         record["protocol"] = transport
         record["integration"] = integration
         record["sublevel"] = sublevel
         record["method"] = method
         record["url"] = record["http.url"] or ""
         record["status_code_group"] = record["http.status_code_group"] or ""

         return 1, timestamp, record
      end
   
      function enrich_bal_logs(tag, timestamp, record)
         -- Add common fields for all Ballerina logs
         record["product"] = "integration"
         record["component"] = "ballerina"
    
         -- Extract module info if available
         if record["module"] then
            local module_parts = {}
            for part in string.gmatch(record["module"], "[^/]+") do
               table.insert(module_parts, part)
            end
            if #module_parts > 0 then
               record["app_module"] = module_parts[1]
            end
         end
    
         return 1, timestamp, record
      end   
      ```

    - `setup/opensearch-integration-artifacts.ndjson`
   
       ```json
       {"attributes":{"fields":"[{\"count\":0,\"name\":\"@timestamp\",\"type\":\"date\",\"esTypes\":[\"date\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"_id\",\"type\":\"string\",\"esTypes\":[\"_id\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"count\":0,\"name\":\"_index\",\"type\":\"string\",\"esTypes\":[\"_index\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"count\":0,\"name\":\"_score\",\"type\":\"number\",\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"_source\",\"type\":\"_source\",\"esTypes\":[\"_source\"],\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"_type\",\"type\":\"string\",\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"app\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"app.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"app\"}}},{\"count\":0,\"name\":\"component\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"component.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"component\"}}},{\"count\":0,\"name\":\"host\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"host.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"host\"}}},{\"count\":0,\"name\":\"integration\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"integration.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"integration\"}}},{\"count\":0,\"name\":\"level\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"level.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"level\"}}},{\"count\":0,\"name\":\"log\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"log.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"log\"}}},{\"count\":0,\"name\":\"message\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"message.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"message\"}}},{\"count\":0,\"name\":\"module\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"module.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"module\"}}},{\"count\":0,\"name\":\"product\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"product.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"product\"}}},{\"count\":0,\"name\":\"protocol\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"protocol.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"protocol\"}}},{\"count\":0,\"name\":\"response_time\",\"type\":\"number\",\"esTypes\":[\"long\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"status\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"status.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"status\"}}},{\"count\":0,\"name\":\"sublevel\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"sublevel.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"sublevel\"}}},{\"count\":0,\"name\":\"time\",\"type\":\"date\",\"esTypes\":[\"date\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}]","timeFieldName":"time","title":"ballerina-metrics-logs-*"},"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","migrationVersion":{"index-pattern":"7.6.0"},"references":[],"type":"index-pattern","updated_at":"2025-02-19T05:59:32.264Z","version":"WzAsMV0="}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[]}"},"title":"Integration - Metrics control","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Integration - Metrics control\",\"type\":\"input_control_vis\",\"aggs\":[],\"params\":{\"controls\":[{\"fieldName\":\"app.keyword\",\"id\":\"1729066473443\",\"label\":\"Deployment\",\"options\":{\"dynamicOptions\":true,\"multiselect\":true,\"order\":\"desc\",\"size\":5,\"type\":\"terms\"},\"parent\":\"\",\"type\":\"list\",\"indexPatternRefName\":\"control_0_index_pattern\"},{\"id\":\"1732018993376\",\"fieldName\":\"protocol.keyword\",\"parent\":\"\",\"label\":\"Protocol\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"},\"indexPatternRefName\":\"control_1_index_pattern\"},{\"id\":\"1732019076548\",\"fieldName\":\"integration.keyword\",\"parent\":\"\",\"label\":\"Integration \",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"},\"indexPatternRefName\":\"control_2_index_pattern\"}],\"pinFilters\":false,\"updateFiltersOnChange\":true,\"useTimeFilter\":false}}"},"id":"04bec0a0-8b96-11ef-8aa3-7f37389b131d","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"control_0_index_pattern","type":"index-pattern"},{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"control_1_index_pattern","type":"index-pattern"},{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"control_2_index_pattern","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzEsMV0="}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Total deployments","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Total deployments\",\"type\":\"metric\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"cardinality\",\"params\":{\"field\":\"app.keyword\",\"customLabel\":\"Deployments\"},\"schema\":\"metric\"}],\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":28}}}}"},"id":"f8c1ead0-a674-11ef-8062-134cf166371a","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzIsMV0="}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Total integrations","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Total integrations\",\"type\":\"metric\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"cardinality\",\"params\":{\"field\":\"integration.keyword\",\"customLabel\":\"Total integrations\"},\"schema\":\"metric\"}],\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":28}}}}"},"id":"12e370c0-a673-11ef-8062-134cf166371a","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzMsMV0="}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integration - Total requests","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Integration - Total requests\",\"type\":\"metric\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"params\":{\"customLabel\":\"Total requests\"},\"schema\":\"metric\"}],\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":28}}}}"},"id":"d410e410-8b86-11ef-8aa3-7f37389b131d","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzQsMV0="}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"status:5* or status:4* or status:failed\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integration - Error count","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Integration - Error count\",\"type\":\"metric\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"params\":{\"customLabel\":\"Errors\"},\"schema\":\"metric\"}],\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":28}}}}"},"id":"bdfe6f50-8a2b-11ef-b202-c55dd46cb2a8","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzUsMV0="}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Average response time","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Average response time\",\"type\":\"metric\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"params\":{\"field\":\"response_time\",\"customLabel\":\"Average response time (ms)\"},\"schema\":\"metric\"}],\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":28}}}}"},"id":"d80d9280-a674-11ef-8062-134cf166371a","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzYsMV0="}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integration - Requests over time","uiStateJSON":"{\"vis\":{\"colors\":{\"Errors\":\"#e7664c\"}}}","version":1,"visState":"{\"title\":\"Integration - Requests over time\",\"type\":\"histogram\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"params\":{\"customLabel\":\"Request count\"},\"schema\":\"metric\"},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"params\":{\"field\":\"time\",\"timeRange\":{\"from\":\"now/d\",\"to\":\"now/d\"},\"useNormalizedOpenSearchInterval\":true,\"scaleMetricValues\":false,\"interval\":\"auto\",\"drop_partials\":false,\"min_doc_count\":1,\"extended_bounds\":{},\"customLabel\":\"Time\"},\"schema\":\"segment\"},{\"id\":\"3\",\"enabled\":true,\"type\":\"filters\",\"params\":{\"filters\":[{\"input\":{\"query\":\"status:2* OR status:NA OR status:successful\",\"language\":\"kuery\"},\"label\":\"Success\"},{\"input\":{\"query\":\"status:5* OR status:4* OR status:3* OR status:failed\",\"language\":\"kuery\"},\"label\":\"Errors\"}]},\"schema\":\"group\"}],\"params\":{\"type\":\"histogram\",\"grid\":{\"categoryLines\":false},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"filter\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Request count\"}}],\"seriesParams\":[{\"show\":true,\"type\":\"histogram\",\"mode\":\"stacked\",\"data\":{\"label\":\"Request count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false,\"labels\":{\"show\":false},\"thresholdLine\":{\"show\":false,\"value\":10,\"width\":1,\"style\":\"full\",\"color\":\"#E7664C\"}}}"},"id":"79b68ce0-8b86-11ef-8aa3-7f37389b131d","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-24T06:22:48.245Z","version":"WzM0LDFd"}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integration - Requests per integration","uiStateJSON":"{\"vis\":{\"colors\":{\"Errors\":\"#e7664c\",\"status_code:5* OR status_code:4*\":\"#e7664c\"}}}","version":1,"visState":"{\"title\":\"Integration - Requests per integration\",\"type\":\"horizontal_bar\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"params\":{\"customLabel\":\"Request count\"},\"schema\":\"metric\"},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"params\":{\"field\":\"integration.keyword\",\"orderBy\":\"_key\",\"order\":\"desc\",\"size\":10,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Integration\"},\"schema\":\"segment\"},{\"id\":\"4\",\"enabled\":true,\"type\":\"filters\",\"params\":{\"filters\":[{\"input\":{\"query\":\"status:NA OR status:2* OR status:successful\",\"language\":\"kuery\"},\"label\":\"Success\"},{\"input\":{\"query\":\"status:5* OR status:4* OR status:failed\",\"language\":\"kuery\"},\"label\":\"Errors\"}]},\"schema\":\"group\"}],\"params\":{\"type\":\"histogram\",\"grid\":{\"categoryLines\":false},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":200},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":75,\"filter\":true,\"truncate\":100},\"title\":{\"text\":\"Request count\"}}],\"seriesParams\":[{\"show\":true,\"type\":\"histogram\",\"mode\":\"stacked\",\"data\":{\"label\":\"Request count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false,\"labels\":{},\"thresholdLine\":{\"show\":false,\"value\":10,\"width\":1,\"style\":\"full\",\"color\":\"#E7664C\"},\"row\":true}}"},"id":"e6d884d0-8b87-11ef-8aa3-7f37389b131d","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-24T06:22:01.102Z","version":"WzMzLDFd"}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integration - Response time per integration","uiStateJSON":"{\"vis\":{\"colors\":{\"90th percentile of 90th percentile\":\"#e7664c\",\"90th percentile of response_time\":\"#e7664c\"}}}","version":1,"visState":"{\"title\":\"Integration - Response time per integration\",\"type\":\"horizontal_bar\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"params\":{\"field\":\"response_time\",\"customLabel\":\"Average\"},\"schema\":\"metric\"},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"params\":{\"field\":\"integration.keyword\",\"orderBy\":\"1\",\"order\":\"desc\",\"size\":10,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Integration\"},\"schema\":\"segment\"},{\"id\":\"3\",\"enabled\":true,\"type\":\"percentiles\",\"params\":{\"field\":\"response_time\",\"percents\":[90],\"customLabel\":\"\"},\"schema\":\"metric\"}],\"params\":{\"type\":\"histogram\",\"grid\":{\"categoryLines\":false},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":200},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":75,\"filter\":true,\"truncate\":100},\"title\":{\"text\":\"Response time (ms)\"}}],\"seriesParams\":[{\"show\":true,\"type\":\"histogram\",\"mode\":\"normal\",\"data\":{\"label\":\"Average\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"showCircles\":true},{\"show\":true,\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"id\":\"3\",\"label\":\"Percentiles of response_time\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false,\"labels\":{},\"thresholdLine\":{\"show\":false,\"value\":10,\"width\":1,\"style\":\"full\",\"color\":\"#E7664C\"}}}"},"id":"64724190-8c70-11ef-8aa3-7f37389b131d","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzksMV0="}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integration - Transaction summary","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Integration - Transaction summary\",\"type\":\"table\",\"aggs\":[{\"id\":\"8\",\"enabled\":true,\"type\":\"terms\",\"params\":{\"field\":\"protocol.keyword\",\"orderBy\":\"5\",\"order\":\"desc\",\"size\":5,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Protocol\"},\"schema\":\"bucket\"},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"params\":{\"field\":\"integration.keyword\",\"orderBy\":\"_key\",\"order\":\"desc\",\"size\":10,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\" Integration\"},\"schema\":\"bucket\"},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"params\":{\"field\":\"sublevel.keyword\",\"orderBy\":\"_key\",\"order\":\"desc\",\"size\":5,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\" \"},\"schema\":\"bucket\"},{\"id\":\"5\",\"enabled\":true,\"type\":\"count\",\"params\":{\"customLabel\":\"Request count\"},\"schema\":\"metric\"},{\"id\":\"6\",\"enabled\":true,\"type\":\"avg\",\"params\":{\"field\":\"response_time\",\"customLabel\":\"Average response time (ms)\"},\"schema\":\"metric\"}],\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"showTotal\":false,\"totalFunc\":\"sum\",\"percentageCol\":\"\"}}"},"id":"b1a9bd90-8b84-11ef-8aa3-7f37389b131d","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"b4440b60-88ae-11ef-b202-c55dd46cb2a8","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzEwLDFd"}
       {"attributes":{"description":"","hits":0,"kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[]}"},"optionsJSON":"{\"hidePanelTitles\":false,\"useMargins\":true}","panelsJSON":"[{\"version\":\"2.15.0\",\"gridData\":{\"x\":0,\"y\":0,\"w\":48,\"h\":4,\"i\":\"882b1dd1-5aa2-4f85-9589-732853b60c4d\"},\"panelIndex\":\"882b1dd1-5aa2-4f85-9589-732853b60c4d\",\"embeddableConfig\":{\"hidePanelTitles\":true},\"panelRefName\":\"panel_0\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":0,\"y\":4,\"w\":9,\"h\":5,\"i\":\"9c9125e8-371a-443e-acb8-898aec74d9f1\"},\"panelIndex\":\"9c9125e8-371a-443e-acb8-898aec74d9f1\",\"embeddableConfig\":{\"hidePanelTitles\":true},\"panelRefName\":\"panel_1\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":9,\"y\":4,\"w\":9,\"h\":5,\"i\":\"4aa65360-de4c-4962-8a49-1fdc3bb2912d\"},\"panelIndex\":\"4aa65360-de4c-4962-8a49-1fdc3bb2912d\",\"embeddableConfig\":{\"hidePanelTitles\":true},\"panelRefName\":\"panel_2\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":18,\"y\":4,\"w\":9,\"h\":5,\"i\":\"624e73df-06ee-4e9b-a408-b9de15093457\"},\"panelIndex\":\"624e73df-06ee-4e9b-a408-b9de15093457\",\"embeddableConfig\":{\"hidePanelTitles\":true},\"panelRefName\":\"panel_3\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":27,\"y\":4,\"w\":9,\"h\":5,\"i\":\"34c90450-3c58-41ed-b6f9-bf10a5bb5c2e\"},\"panelIndex\":\"34c90450-3c58-41ed-b6f9-bf10a5bb5c2e\",\"embeddableConfig\":{\"hidePanelTitles\":true},\"panelRefName\":\"panel_4\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":36,\"y\":4,\"w\":12,\"h\":5,\"i\":\"ad980547-880f-4d3a-a719-92ca7a101899\"},\"panelIndex\":\"ad980547-880f-4d3a-a719-92ca7a101899\",\"embeddableConfig\":{\"hidePanelTitles\":true},\"panelRefName\":\"panel_5\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":0,\"y\":9,\"w\":48,\"h\":9,\"i\":\"b09342b6-ca32-41e3-a029-b3a19e616570\"},\"panelIndex\":\"b09342b6-ca32-41e3-a029-b3a19e616570\",\"embeddableConfig\":{},\"panelRefName\":\"panel_6\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":0,\"y\":18,\"w\":23,\"h\":15,\"i\":\"55ea1612-e3b1-42e0-8cab-f5ae478c85e8\"},\"panelIndex\":\"55ea1612-e3b1-42e0-8cab-f5ae478c85e8\",\"embeddableConfig\":{},\"panelRefName\":\"panel_7\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":23,\"y\":18,\"w\":25,\"h\":15,\"i\":\"cd89a3b8-ee03-4288-bddb-4fb08dd86877\"},\"panelIndex\":\"cd89a3b8-ee03-4288-bddb-4fb08dd86877\",\"embeddableConfig\":{},\"panelRefName\":\"panel_8\"},{\"version\":\"2.15.0\",\"gridData\":{\"x\":0,\"y\":33,\"w\":48,\"h\":18,\"i\":\"51142362-787a-44ff-aaaa-b1a946996514\"},\"panelIndex\":\"51142362-787a-44ff-aaaa-b1a946996514\",\"embeddableConfig\":{},\"panelRefName\":\"panel_9\"}]","timeRestore":false,"title":"Integration metrics dashboard","version":1},"id":"a3d98750-8b88-11ef-8aa3-7f37389b131d","migrationVersion":{"dashboard":"7.9.3"},"references":[{"id":"04bec0a0-8b96-11ef-8aa3-7f37389b131d","name":"panel_0","type":"visualization"},{"id":"f8c1ead0-a674-11ef-8062-134cf166371a","name":"panel_1","type":"visualization"},{"id":"12e370c0-a673-11ef-8062-134cf166371a","name":"panel_2","type":"visualization"},{"id":"d410e410-8b86-11ef-8aa3-7f37389b131d","name":"panel_3","type":"visualization"},{"id":"bdfe6f50-8a2b-11ef-b202-c55dd46cb2a8","name":"panel_4","type":"visualization"},{"id":"d80d9280-a674-11ef-8062-134cf166371a","name":"panel_5","type":"visualization"},{"id":"79b68ce0-8b86-11ef-8aa3-7f37389b131d","name":"panel_6","type":"visualization"},{"id":"e6d884d0-8b87-11ef-8aa3-7f37389b131d","name":"panel_7","type":"visualization"},{"id":"64724190-8c70-11ef-8aa3-7f37389b131d","name":"panel_8","type":"visualization"},{"id":"b1a9bd90-8b84-11ef-8aa3-7f37389b131d","name":"panel_9","type":"visualization"}],"type":"dashboard","updated_at":"2025-02-19T05:59:32.264Z","version":"WzExLDFd"}
       {"attributes":{"fields":"[{\"count\":0,\"name\":\"@timestamp\",\"type\":\"date\",\"esTypes\":[\"date\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"_id\",\"type\":\"string\",\"esTypes\":[\"_id\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"count\":0,\"name\":\"_index\",\"type\":\"string\",\"esTypes\":[\"_index\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"count\":0,\"name\":\"_score\",\"type\":\"number\",\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"_source\",\"type\":\"_source\",\"esTypes\":[\"_source\"],\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"_type\",\"type\":\"string\",\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"app\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"component\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"integration\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"kubernetes.labels.app\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"kubernetes.labels.component\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"level\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"log\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"log.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"log\"}}},{\"count\":0,\"name\":\"log_type\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"message\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"module\",\"type\":\"string\",\"esTypes\":[\"text\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"count\":0,\"name\":\"module.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"module\"}}},{\"count\":0,\"name\":\"package\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"product\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"count\":0,\"name\":\"time\",\"type\":\"date\",\"esTypes\":[\"date\"],\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}]","timeFieldName":"time","title":"ballerina-application-logs-*"},"id":"874b51b0-5f99-11ef-8763-b373806b0892","migrationVersion":{"index-pattern":"7.6.0"},"references":[],"type":"index-pattern","updated_at":"2025-02-19T05:59:32.264Z","version":"WzEyLDFd"}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"},"title":"Integration - Log controls","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Integration - Log controls\",\"type\":\"input_control_vis\",\"aggs\":[],\"params\":{\"controls\":[{\"id\":\"1732080985577\",\"fieldName\":\"app\",\"parent\":\"\",\"label\":\"Deployment\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"},\"indexPatternRefName\":\"control_0_index_pattern\"},{\"id\":\"1732081021428\",\"fieldName\":\"level\",\"parent\":\"\",\"label\":\"Log level\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"},\"indexPatternRefName\":\"control_1_index_pattern\"}],\"updateFiltersOnChange\":true,\"useTimeFilter\":false,\"pinFilters\":false}}"},"id":"95078a80-a701-11ef-8062-134cf166371a","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"874b51b0-5f99-11ef-8763-b373806b0892","name":"control_0_index_pattern","type":"index-pattern"},{"id":"874b51b0-5f99-11ef-8763-b373806b0892","name":"control_1_index_pattern","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzEzLDFd"}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"level:ERROR\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integrations - Error log count","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Integrations - Error log count\",\"type\":\"metric\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"params\":{\"customLabel\":\"Errors\"},\"schema\":\"metric\"}],\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"Labels\",\"colorsRange\":[{\"from\":0,\"to\":0},{\"from\":1,\"to\":9999999999}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":26}}}}"},"id":"8b781290-a702-11ef-8062-134cf166371a","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"874b51b0-5f99-11ef-8763-b373806b0892","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzE0LDFd"}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"level:WARN\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integrations - Warning logs count","uiStateJSON":"{}","version":1,"visState":"{\"title\":\"Integrations - Warning logs count\",\"type\":\"metric\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"params\":{\"customLabel\":\"Warnings\"},\"schema\":\"metric\"}],\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Yellow to Red\",\"metricColorMode\":\"Labels\",\"colorsRange\":[{\"from\":0,\"to\":999999999},{\"from\":999999999,\"to\":999999999}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":26}}}}"},"id":"5bf4b900-a703-11ef-8062-134cf166371a","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"874b51b0-5f99-11ef-8763-b373806b0892","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzE1LDFd"}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integration - Logs over time","uiStateJSON":"{\"vis\":{\"colors\":{\"ERROR\":\"#d36086\",\"INFO\":\"#71c0aa\",\"WARN\":\"#ddca73\"}}}","version":1,"visState":"{\"title\":\"Integration - Logs over time\",\"type\":\"histogram\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"params\":{},\"schema\":\"metric\"},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"params\":{\"field\":\"time\",\"timeRange\":{\"from\":\"now/w\",\"to\":\"now/w\"},\"useNormalizedOpenSearchInterval\":true,\"scaleMetricValues\":false,\"interval\":\"auto\",\"drop_partials\":false,\"min_doc_count\":1,\"extended_bounds\":{},\"customLabel\":\"Time\"},\"schema\":\"segment\"},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"params\":{\"field\":\"level\",\"orderBy\":\"1\",\"order\":\"desc\",\"size\":5,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"schema\":\"group\"}],\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"labels\":{\"filter\":true,\"show\":true,\"truncate\":100},\"position\":\"bottom\",\"scale\":{\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{},\"type\":\"category\"}],\"grid\":{\"categoryLines\":false},\"labels\":{\"show\":false},\"legendPosition\":\"right\",\"seriesParams\":[{\"data\":{\"id\":\"1\",\"label\":\"Count\"},\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"mode\":\"stacked\",\"show\":true,\"showCircles\":true,\"type\":\"histogram\",\"valueAxis\":\"ValueAxis-1\"}],\"thresholdLine\":{\"color\":\"#E7664C\",\"show\":false,\"style\":\"full\",\"value\":10,\"width\":1},\"times\":[],\"type\":\"histogram\",\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"labels\":{\"filter\":false,\"rotate\":0,\"show\":true,\"truncate\":100},\"name\":\"LeftAxis-1\",\"position\":\"left\",\"scale\":{\"mode\":\"normal\",\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{\"text\":\"Count\"},\"type\":\"value\"}]}}"},"id":"40febe60-6ba4-11ef-ae9a-db3cb86323f4","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"874b51b0-5f99-11ef-8763-b373806b0892","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzE2LDFd"}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"title":"Integration - Logs by deployment","uiStateJSON":"{\"vis\":{\"colors\":{\"ERROR\":\"#d36086\",\"INFO\":\"#71c0aa\",\"WARN\":\"#ddca73\"}}}","version":1,"visState":"{\"title\":\"Integration - Logs by deployment\",\"type\":\"histogram\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"params\":{},\"schema\":\"metric\"},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"params\":{\"field\":\"app\",\"orderBy\":\"1\",\"order\":\"desc\",\"size\":5,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Deployment\"},\"schema\":\"segment\"},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"params\":{\"field\":\"level\",\"orderBy\":\"1\",\"order\":\"desc\",\"size\":5,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"schema\":\"group\"}],\"params\":{\"type\":\"histogram\",\"grid\":{\"categoryLines\":false},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"filter\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":true,\"type\":\"histogram\",\"mode\":\"stacked\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false,\"labels\":{\"show\":false},\"thresholdLine\":{\"show\":false,\"value\":10,\"width\":1,\"style\":\"full\",\"color\":\"#E7664C\"}}}"},"id":"86ce4b90-6ba4-11ef-ae9a-db3cb86323f4","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"874b51b0-5f99-11ef-8763-b373806b0892","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzE3LDFd"}
       {"attributes":{"description":"","kibanaSavedObjectMeta":{"searchSourceJSON":"{\n  \"query\": {\n    \"language\": \"kuery\",\n    \"query\": \"\"\n  },\n  \"filter\": [],\n  \"indexRefName\": \"kibanaSavedObjectMeta.searchSourceJSON.index\"\n}"},"title":"Integration - Logs by integration","uiStateJSON":"{\n  \"vis\": {\n    \"colors\": {\n      \"ERROR\": \"#d36086\",\n      \"INFO\": \"#71c0aa\",\n      \"WARN\": \"#ddca73\"\n    }\n  }\n}","version":1,"visState":"{\n  \"title\": \"Integration - Logs by integration\",\n  \"type\": \"histogram\",\n  \"aggs\": [\n    {\n      \"id\": \"1\",\n      \"enabled\": true,\n      \"type\": \"count\",\n      \"params\": {},\n      \"schema\": \"metric\"\n    },\n    {\n      \"id\": \"2\",\n      \"enabled\": true,\n      \"type\": \"terms\",\n      \"params\": {\n        \"field\": \"integration\",\n        \"orderBy\": \"1\",\n        \"order\": \"desc\",\n        \"size\": 5,\n        \"otherBucket\": false,\n        \"otherBucketLabel\": \"Unkown\",\n        \"missingBucket\": true,\n        \"missingBucketLabel\": \"Unknown\",\n        \"customLabel\": \"Entry point\"\n      },\n      \"schema\": \"segment\"\n    },\n    {\n      \"id\": \"3\",\n      \"enabled\": true,\n      \"type\": \"terms\",\n      \"params\": {\n        \"field\": \"level\",\n        \"orderBy\": \"1\",\n        \"order\": \"desc\",\n        \"size\": 5,\n        \"otherBucket\": false,\n        \"otherBucketLabel\": \"Other\",\n        \"missingBucket\": false,\n        \"missingBucketLabel\": \"Missing\"\n      },\n      \"schema\": \"group\"\n    }\n  ],\n  \"params\": {\n    \"type\": \"histogram\",\n    \"grid\": {\n      \"categoryLines\": false\n    },\n    \"categoryAxes\": [\n      {\n        \"id\": \"CategoryAxis-1\",\n        \"type\": \"category\",\n        \"position\": \"bottom\",\n        \"show\": true,\n        \"style\": {},\n        \"scale\": {\n          \"type\": \"linear\"\n        },\n        \"labels\": {\n          \"show\": true,\n          \"filter\": true,\n          \"truncate\": 100\n        },\n        \"title\": {}\n      }\n    ],\n    \"valueAxes\": [\n      {\n        \"id\": \"ValueAxis-1\",\n        \"name\": \"LeftAxis-1\",\n        \"type\": \"value\",\n        \"position\": \"left\",\n        \"show\": true,\n        \"style\": {},\n        \"scale\": {\n          \"type\": \"linear\",\n          \"mode\": \"normal\"\n        },\n        \"labels\": {\n          \"show\": true,\n          \"rotate\": 0,\n          \"filter\": false,\n          \"truncate\": 100\n        },\n        \"title\": {\n          \"text\": \"Count\"\n        }\n      }\n    ],\n    \"seriesParams\": [\n      {\n        \"show\": true,\n        \"type\": \"histogram\",\n        \"mode\": \"stacked\",\n        \"data\": {\n          \"label\": \"Count\",\n          \"id\": \"1\"\n        },\n        \"valueAxis\": \"ValueAxis-1\",\n        \"drawLinesBetweenPoints\": true,\n        \"lineWidth\": 2,\n        \"showCircles\": true\n      }\n    ],\n    \"addTooltip\": true,\n    \"addLegend\": true,\n    \"legendPosition\": \"right\",\n    \"times\": [],\n    \"addTimeMarker\": false,\n    \"labels\": {\n      \"show\": false\n    },\n    \"thresholdLine\": {\n      \"show\": false,\n      \"value\": 10,\n      \"width\": 1,\n      \"style\": \"full\",\n      \"color\": \"#E7664C\"\n    }\n  }\n}"},"id":"c8713eb0-6ba7-11ef-ae9a-db3cb86323f4","migrationVersion":{"visualization":"7.10.0"},"references":[{"id":"874b51b0-5f99-11ef-8763-b373806b0892","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"visualization","updated_at":"2025-02-19T05:59:32.264Z","version":"WzE4LDFd"}
       {"attributes":{"columns":["level","component","app","integration","message"],"description":"","hits":0,"kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"highlightAll\":true,\"version\":true,\"aggs\":{\"2\":{\"date_histogram\":{\"field\":\"time\",\"fixed_interval\":\"3h\",\"time_zone\":\"Asia/Colombo\",\"min_doc_count\":1}}},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"},"sort":[],"title":"Integration - Logs","version":1},"id":"12049d90-6b9b-11ef-ae9a-db3cb86323f4","migrationVersion":{"search":"7.9.3"},"references":[{"id":"874b51b0-5f99-11ef-8763-b373806b0892","name":"kibanaSavedObjectMeta.searchSourceJSON.index","type":"index-pattern"}],"type":"search","updated_at":"2025-02-19T05:59:32.264Z","version":"WzE5LDFd"}
       {"attributes":{"description":"","hits":0,"kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[]}"},"optionsJSON":"{\"hidePanelTitles\":false,\"useMargins\":true}","panelsJSON":"[{\"embeddableConfig\":{\"hidePanelTitles\":true},\"gridData\":{\"h\":4,\"i\":\"36f0f782-f7fc-449c-a521-37de58e897cb\",\"w\":28,\"x\":0,\"y\":0},\"panelIndex\":\"36f0f782-f7fc-449c-a521-37de58e897cb\",\"version\":\"2.15.0\",\"panelRefName\":\"panel_0\"},{\"embeddableConfig\":{\"hidePanelTitles\":true},\"gridData\":{\"h\":4,\"i\":\"a3fe0919-a7a4-44e8-9117-4f1cad7e7cb0\",\"w\":10,\"x\":28,\"y\":0},\"panelIndex\":\"a3fe0919-a7a4-44e8-9117-4f1cad7e7cb0\",\"version\":\"2.15.0\",\"panelRefName\":\"panel_1\"},{\"embeddableConfig\":{\"hidePanelTitles\":true},\"gridData\":{\"h\":4,\"i\":\"8d74295e-fd01-4930-92c5-c80bf7c28b42\",\"w\":10,\"x\":38,\"y\":0},\"panelIndex\":\"8d74295e-fd01-4930-92c5-c80bf7c28b42\",\"version\":\"2.15.0\",\"panelRefName\":\"panel_2\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":8,\"i\":\"1419738f-90ed-48d7-b0fc-59275f981964\",\"w\":48,\"x\":0,\"y\":4},\"panelIndex\":\"1419738f-90ed-48d7-b0fc-59275f981964\",\"version\":\"2.15.0\",\"panelRefName\":\"panel_3\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":12,\"i\":\"18e146df-7ff6-4045-bae7-2513ea02f75b\",\"w\":24,\"x\":0,\"y\":12},\"panelIndex\":\"18e146df-7ff6-4045-bae7-2513ea02f75b\",\"version\":\"2.15.0\",\"panelRefName\":\"panel_4\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":12,\"i\":\"7bd7bd1e-9d31-4ab6-b860-8b0b270eb01f\",\"w\":24,\"x\":24,\"y\":12},\"panelIndex\":\"7bd7bd1e-9d31-4ab6-b860-8b0b270eb01f\",\"version\":\"2.15.0\",\"panelRefName\":\"panel_5\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":19,\"i\":\"fe74ed96-8e92-40ad-9a28-a165176fb225\",\"w\":48,\"x\":0,\"y\":24},\"panelIndex\":\"fe74ed96-8e92-40ad-9a28-a165176fb225\",\"version\":\"2.15.0\",\"panelRefName\":\"panel_6\"}]","timeRestore":false,"title":"Integration logs dashboard","version":1},"id":"ea16dc30-6ba4-11ef-ae9a-db3cb86323f4","migrationVersion":{"dashboard":"7.9.3"},"references":[{"id":"95078a80-a701-11ef-8062-134cf166371a","name":"panel_0","type":"visualization"},{"id":"8b781290-a702-11ef-8062-134cf166371a","name":"panel_1","type":"visualization"},{"id":"5bf4b900-a703-11ef-8062-134cf166371a","name":"panel_2","type":"visualization"},{"id":"40febe60-6ba4-11ef-ae9a-db3cb86323f4","name":"panel_3","type":"visualization"},{"id":"86ce4b90-6ba4-11ef-ae9a-db3cb86323f4","name":"panel_4","type":"visualization"},{"id":"c8713eb0-6ba7-11ef-ae9a-db3cb86323f4","name":"panel_5","type":"visualization"},{"id":"12049d90-6b9b-11ef-ae9a-db3cb86323f4","name":"panel_6","type":"search"}],"type":"dashboard","updated_at":"2025-02-19T05:59:32.264Z","version":"WzIwLDFd"}
       {"attributes":{"timeFieldName":"@timestamp","title":"general-logs-*"},"id":"cf012bf0-770f-11ef-8068-19e64337e292","migrationVersion":{"index-pattern":"7.6.0"},"references":[],"type":"index-pattern","updated_at":"2025-02-19T05:59:32.264Z","version":"WzI0LDFd"}
       {"attributes":{"description":"","filters":[],"query":{"language":"kuery","query":"level:ERROR"},"title":"Error logs"},"id":"Error logs","references":[],"type":"query","updated_at":"2025-02-19T05:59:32.264Z","version":"WzI3LDFd"}
       {"attributes":{"description":"","filters":[],"query":{"language":"kuery","query":"component:ballerina"},"title":"Ballerina logs"},"id":"Ballerina logs","references":[],"type":"query","updated_at":"2025-02-19T05:59:32.264Z","version":"WzI4LDFd"}
       {"attributes":{"description":"","filters":[],"query":{"language":"kuery","query":"component:mi"},"title":"MI logs"},"id":"MI logs","references":[],"type":"query","updated_at":"2025-02-19T05:59:32.264Z","version":"WzI5LDFd"}
       {"attributes":{"description":"","filters":[],"query":{"language":"kuery","query":"status_code:5* or status_code:4* or status_code:3*"},"title":"HTTP Errors"},"id":"HTTP Errors","references":[],"type":"query","updated_at":"2025-02-19T05:59:32.264Z","version":"WzMwLDFd"}
       {"exportedCount":31,"missingRefCount":0,"missingReferences":[]}
       ```
   
    - `setup/index-template-request.json`
   
       ```json
       {
           "index_patterns": [
               "wso2-integration-application-logs-*"
           ],
           "template": {
               "mappings": {
                   "properties": {
                       "kubernetes": {
                           "type": "object",
                           "properties": {
                               "labels": {
                                   "type": "object",
                                   "properties": {
                                       "app": {
                                           "type": "keyword"
                                       },
                                       "component": {
                                           "type": "keyword"
                                       }
                                   }
                               }
                           }
                       },
                       "level": {
                           "type": "keyword"
                       },
                       "time": {
                           "type": "date"
                       },
                       "integration": {
                           "type": "keyword"
                       },
                       "message": {
                          "type": "keyword"
                       },
                       "product": {
                           "type": "keyword"
                       },
                       "component": {
                           "type": "keyword"
                       },
                       "package": {
                           "type": "keyword"
                       },
                       "log_type": {
                          "type": "keyword"
                       },
                       "app": {
                           "type": "keyword"
                      }
                   } 
               }
           }
       }
       ```

4. Run `docker compose` to start the OpenSearch server along with Ballerina service.

   ```
   docker compose -f docker-compose.yml up -d
   ```

## Step 3 - Send requests
Send requests to <http://localhost:8090/shop/products>.

Example cURL commands:

```
$ curl -X GET http://localhost:8090/shop/products
```
```
$ curl -X POST http://localhost:8090/shop/product \
-H "Content-Type: application/json" \
-d '{
    "id": 4, 
    "name": "Laptop Charger", 
    "price": 50.00
}'
```
```
$ curl -X POST http://localhost:8090/shop/order \
-H "Content-Type: application/json" \
-d '{
    "productId": 1, 
    "quantity": 1
}'
```
```
$ curl -X GET http://localhost:8090/shop/order/0
```

## Step 4 - View distributed tracing on OpenSearch Dashboard

Open the OpenSearch Dashboard in your browser at <http://localhost:5601> and navigate to the "Traces" tab under "Observability" section.

The image below is the sample tracing information you can see in Opensearch.

![OpenSearch tracing Dashboard](/learn/images/opensearch-tracing-dashboard.png "OpenSearch tracing Dashboard")

![Span details in OpenSearch](/learn/images/span-details-opensearch.png "Span details in OpenSearch") 

Service map shows the relationship between different services in the system.

![Service map in OpenSearch](/learn/images/service-map-opensearch.png "Service map in OpenSearch")

![Service details in OpenSearch](/learn/images/service-details-opensearch.png "Service details in OpenSearch")

## Step 5 - View metrics on OpenSearch Dashboard

Open the OpenSearch Dashboard in your browser at <http://localhost:5601> and navigate to the "Dashboards" tab under "OpenSearch Dashboards" section.

Then click on the "Integration metrics dashboard" to view the metrics.

![OpenSearch metrics dashboard](/learn/images/opensearch-metrics-dashboard-1.png "OpenSearch metrics dashboard")

![OpenSearch metrics dashboard](/learn/images/opensearch-metrics-dashboard-2.png "OpenSearch metrics dashboard")

## Step 6 - View logs on OpenSearch Dashboard

Open the OpenSearch Dashboard in your browser at <http://localhost:5601> and navigate to the "Dashboards" tab under "OpenSearch Dashboards" section.

Then click on the "Integration logs dashboard" to view the integration logs.

![OpenSearch logs dashboard](/learn/images/opensearch-logs-dashboard-1.png "OpenSearch logs dashboard")

![OpenSearch logs dashboard](/learn/images/opensearch-logs-dashboard-2.png "OpenSearch logs dashboard")

