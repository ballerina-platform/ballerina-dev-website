let redirections = {
    // "/SOURCE (BROKEN) URL without trailing slash":"/DESTINATION (CORRECT) URL with slash"

    // Learn pages not available

    "/1.0/learn/keeping-ballerina-up-to-date":"/page-not-available.html",
    "/1.1/learn/calling-java-code-from-ballerina":"/page-not-available.html",
    "/1.0/learn/calling-java-code-from-ballerina":"/page-not-available.html",
    "/1.1/learn/deployment/aws-lambda/":"/page-not-available.html",
    "/1.0/learn/deployment/aws-lambda/":"/page-not-available.html",
    "/1.1/learn/deployment/azure-functions/":"/page-not-available.html",
    "/1.0/learn/deployment/azure-functions/":"/page-not-available.html",
    "/learn/by-example/jdbc-streaming-big-dataset.html":"/page-not-available.html",
    "/1.1/learn/testing-ballerina-code/testing-quick-start":"/page-not-available.html",
    "/1.1/learn/testing-ballerina-code/writing-tests":"/page-not-available.html",
    "/1.1/learn/testing-ballerina-code/mocking":"/page-not-available.html",
    "/1.1/learn/testing-ballerina-code/executing-tests":"/page-not-available.html",
    "/1.0/learn/testing-ballerina-code/testing-quick-start":"/page-not-available.html",
    "/1.0/learn/testing-ballerina-code/writing-tests":"/page-not-available.html",
    "/1.0/learn/testing-ballerina-code/mocking":"/page-not-available.html",
    "/1.0/learn/testing-ballerina-code/executing-tests":"/page-not-available.html",
    "/1.2/learn/structuring-ballerina-code/working-with-ballerina-modules/":"/page-not-available",
    "/1.1/learn/structuring-ballerina-code/working-with-ballerina-modules/":"/page-not-available",
    "/1.0/learn/structuring-ballerina-code/working-with-ballerina-modules/":"/page-not-available",
    "/learn/extending-with-compiler-extensions/":"/page-not-available.html",
    "/1.0/learn/how-to-keep-ballerina-up-to-date/":"/page-not-available.html",
    "/1.2/learn/deployment/code-to-cloud/":"/page-not-available.html",
    "/1.1/learn/deployment/code-to-cloud/":"/page-not-available.html",
    "/1.0/learn/deployment/code-to-cloud/":"/page-not-available.html",
    

    // BBEs not available.
    "/1.1/learn/by-example/jdbc-streaming-big-dataset.html":"/page-not-available.html",
    "/1.0/learn/by-example/jdbc-streaming-big-dataset.html":"/page-not-available.html",
    "/1.1/learn/by-example/knative-deployment.html": "/page-not-available.html",
    "/1.0/learn/by-example/knative-deployment.html": "/page-not-available.html",
    "/1.1/learn/by-example/azure-functions-deployment.html": "/page-not-available.html",
    "/1.0/learn/by-example/azure-functions-deployment": "/page-not-available.html",
    "/1.1/learn/api-docs/ballerina/azure.functions/index.html": "/page-not-available.html",
    "/1.0/learn/api-docs/ballerina/azure.functions/index.html": "/page-not-available.html",
    "/1.1/learn/api-docs/ballerina/knative/index.html": "/page-not-available.html",
    "/1.0/learn/api-docs/ballerina/knative/index.html": "/page-not-available.html",
    "/learn/by-example/documentation.html":"/1.2/learn/by-example/basic-documentation.html",
    "/1.2/learn/by-example/documentation.html":"/1.2/learn/by-example/basic-documentation.html",
    "/1.2/learn/ballerina-streaming-reference/":"/1.2/learn/by-example/streams",
    "/learn/ballerina-streaming-reference/":"/learn/by-example/streams",
    "/1.1/learn/by-example/aws-lambda-deployment.html": "/1.1/learn/by-example/awslambda-deployment.html",
    "/1.0/learn/by-example/aws-lambda-deployment.html": "/1.0/learn/by-example/awslambda-deployment.html",
    "/1.2/learn/by-example/object-final-fields.html":"/page-not-available.html",
    "/1.1/learn/by-example/object-final-fields.html":"/page-not-available.html",
    "/1.0/learn/by-example/object-final-fields.html":"/page-not-available.html",
    "/1.2/learn/by-example/isolated-functions.html":"/page-not-available.html",
    "/1.1/learn/by-example/isolated-functions.html":"/page-not-available.html",
    "/1.0/learn/by-example/isolated-functions.html":"/page-not-available.html",
    "/1.2/learn/by-example/error-handling-in-single-place.html":"/page-not-available.html",
    "/1.1/learn/by-example/error-handling-in-single-place.html":"/page-not-available.html",
    "/1.0/learn/by-example/error-handling-in-single-place.html":"/page-not-available.html",
    "/1.2/learn/by-example/fail.html":"/page-not-available.html",
    "/1.1/learn/by-example/fail.html":"/page-not-available.html",
    "/1.0/learn/by-example/fail.html":"/page-not-available.html",
    "/learn/by-example/xa-transactions.html":"/page-not-available.html",
    "/learn/by-example/local-transactions-with-participants.html":"/page-not-available.html",
    "/learn/by-example/transactions-distributed.html":"/page-not-available.html",
    "/1.2/learn/by-example/readonly-objects.html":"/page-not-available.html",
    "/1.1/learn/by-example/readonly-objects.html":"/page-not-available.html",
    "/1.0/learn/by-example/readonly-objects.html":"/page-not-available.html",
    "/1.2/learn/by-example/websocket-cookie.html":"/page-not-available.html",
    "/1.1/learn/by-example/websocket-cookie.html":"/page-not-available.html",
    "/1.0/learn/by-example/websocket-cookie.html":"/page-not-available.html",
    "/learn/by-example/tracing.html":"/page-not-available.html",
    "/learn/by-example/counter-metrics.html":"/page-not-available.html",
    "/learn/by-example/gauge-metrics.html":"/page-not-available.html",
    "learn/by-example/http-client-data-binding.html":"/page-not-available.html",
    "/1.1/learn/by-example/http-client-data-binding.html":"/page-not-available.html",
    "/1.0/learn/by-example/http-client-data-binding.html":"/page-not-available.html",
    "/learn/by-example/http-filters.html":"/page-not-available",

    // BBE Updates

    "/learn/by-example/objects.html":"/learn/by-example/class-definition.html",
    "/learn/by-example/abstract-objects.html":"/learn/by-example/object-type.html",
    "/learn/by-example/anonymous-objects.html":"/learn/by-example/object-constructor-expression.html",
    "/learn/by-example/readonly-objects-and-fields.html":"/learn/by-example/readonly-objects.html",

    // API Docs not available

    "/learn/api-docs/ballerina/*/objects/*":"/learn/api-docs/ballerina/*/classes/*",
    "/1.2/learn/api-docs/ballerina/ftp/index.html":"/page-not-available.html",
    "/1.1/learn/api-docs/ballerina/ftp/index.html":"/page-not-available.html",
    "/1.0/learn/api-docs/ballerina/ftp/index.html":"/page-not-available.html",



}
