var searchData = {
  "modules": [
    {
      "id": "http",
      "description": "\u003cp\u003eThis module provides an implementation for connecting and interacting with HTTP, HTTP2, and WebSocket endpoints.\u003c/p\u003e"
    }
  ],
  "classes": [
    {
      "id": "PushPromise",
      "description": "\u003cp\u003eRepresents an HTTP/2 \u003ccode\u003ePUSH_PROMISE\u003c/code\u003e frame.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "LoadBalancerRoundRobinRule",
      "description": "\u003cp\u003eImplementation of round robin load balancing strategy.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "HttpCache",
      "description": "\u003cp\u003eImplements a cache for storing HTTP responses.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ResponseCacheControl",
      "description": "\u003cp\u003eConfigures cache control directives for an \u003ccode\u003ehttp:Response\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "HttpFuture",
      "description": "\u003cp\u003eRepresents a \u0027future\u0027 that returns as a result of an asynchronous HTTP request submission.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Request",
      "description": "\u003cp\u003eRepresents an HTTP request.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "AuthnFilter",
      "description": "\u003cp\u003eRepresentation of the Authentication filter.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "AuthzHandler",
      "description": "\u003cp\u003eRepresentation of Authorization Handler for HTTP.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Cookie",
      "description": "\u003cp\u003eRepresents a Cookie.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "AuthzFilter",
      "description": "\u003cp\u003eRepresentation of the Authorization filter.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CsvPersistentCookieHandler",
      "description": "\u003cp\u003eRepresents a default persistent cookie handler, which stores persistent cookies in a CSV file.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Response",
      "description": "\u003cp\u003eRepresents an HTTP response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "BearerAuthHandler",
      "description": "\u003cp\u003eRepresentation of the Bearer Auth header handler for both inbound and outbound HTTP traffic.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "FilterContext",
      "description": "\u003cp\u003eRepresentation of request filter Context.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CookieStore",
      "description": "\u003cp\u003eRepresents the cookie store.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "BasicAuthHandler",
      "description": "\u003cp\u003eDefines the Basic Auth header handler for inbound and outbound HTTP traffic.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RequestCacheControl",
      "description": "\u003cp\u003eConfigures the cache control directives for an \u003ccode\u003ehttp:Request\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    }
  ],
  "functions": [
    {
      "id": "createHttpCachingClient",
      "description": "\u003cp\u003eCreates an HTTP client capable of caching HTTP responses.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "createHttpSecureClient",
      "description": "\u003cp\u003eCreates an HTTP client capable of securing HTTP requests with authentication.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "addCookies",
      "description": "\u003cp\u003eAdds cookies to the custom header.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "parseHeader",
      "description": "\u003cp\u003eParses the given header value to extract its value and parameter map.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "invokeEndpoint",
      "description": "\u003cp\u003eThe HEAD remote function implementation of the Circuit Breaker.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "extractAuthorizationHeaderValue",
      "description": "\u003cp\u003eExtracts the Authorization header value from the request.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "isResourceSecured",
      "description": "\u003cp\u003eChecks whether the calling resource is secured by evaluating the authentication hierarchy.\u003c/p\u003e",
      "moduleId": "http"
    }
  ],
  "records": [
    {
      "id": "CacheConfig",
      "description": "\u003cp\u003eProvides a set of configurations for controlling the caching behaviour of the endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "TargetService",
      "description": "\u003cp\u003eRepresents a single service and its related configurations.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ClientConfiguration",
      "description": "\u003cp\u003eProvides a set of configurations for controlling the behaviours when communicating with a remote HTTP endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ClientHttp1Settings",
      "description": "\u003cp\u003eProvides settings related to HTTP/1.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ClientHttp2Settings",
      "description": "\u003cp\u003eProvides settings related to HTTP/2 protocol.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RetryConfig",
      "description": "\u003cp\u003eProvides configurations for controlling the retrying behavior in failure scenarios.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ClientSecureSocket",
      "description": "\u003cp\u003eProvides configurations for facilitating secure communication with a remote HTTP endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "FollowRedirects",
      "description": "\u003cp\u003eProvides configurations for controlling the endpoint\u0027s behaviour in response to HTTP redirect related responses.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ProxyConfig",
      "description": "\u003cp\u003eProxy server configurations to be used with the HTTP client endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "OutboundAuthConfig",
      "description": "\u003cp\u003eThe \u003ccode\u003eOutboundAuthConfig\u003c/code\u003e record can be used to configure the authentication mechanism used by the HTTP endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CookieConfig",
      "description": "\u003cp\u003eClient configuration for cookies.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Protocols",
      "description": "\u003cp\u003eA record for configuring SSL/TLS protocol and version to be used.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ValidateCert",
      "description": "\u003cp\u003eA record for providing configurations for certificate revocation status checks.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ListenerOcspStapling",
      "description": "\u003cp\u003eA record for providing configurations for certificate revocation status checks.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CompressionConfig",
      "description": "\u003cp\u003eA record for providing configurations for content compression.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CommonClientConfiguration",
      "description": "\u003cp\u003eCommon client configurations for the next level clients.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Remote",
      "description": "\u003cp\u003ePresents a read-only view of the remote address.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Local",
      "description": "\u003cp\u003ePresents a read-only view of the local address.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ListenerConfiguration",
      "description": "\u003cp\u003eProvides a set of configurations for HTTP service endpoints.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ListenerHttp1Settings",
      "description": "\u003cp\u003eProvides settings related to HTTP/1.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ListenerAuth",
      "description": "\u003cp\u003eAuthentication configurations for the listener.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ListenerSecureSocket",
      "description": "\u003cp\u003eConfigures the SSL/TLS options to be used for HTTP service.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "MutualSslHandshake",
      "description": "\u003cp\u003eA record for providing mutual SSL handshake results.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CircuitHealth",
      "description": "\u003cp\u003eMaintains the health of the Circuit Breaker.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CircuitBreakerConfig",
      "description": "\u003cp\u003eProvides a set of configurations for controlling the behaviour of the Circuit Breaker.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RollingWindow",
      "description": "\u003cp\u003eRepresents a rolling window in the Circuit Breaker.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Bucket",
      "description": "\u003cp\u003eRepresents a discrete sub-part of the time window (Bucket).\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CircuitBreakerInferredConfig",
      "description": "\u003cp\u003eDerived set of configurations from the \u003ccode\u003eCircuitBreakerConfig\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Detail",
      "description": "\u003cp\u003eHolds the details of an HTTP error\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HttpTimeoutError",
      "description": "\u003cp\u003eDefines a timeout error occurred during service invocation.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "LoadBalanceActionErrorData",
      "description": "\u003cp\u003eRepresents the error attributes in addition to the message and the cause of the \u003ccode\u003eLoadBalanceActionError\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "LoadBalanceClientConfiguration",
      "description": "\u003cp\u003eThe configurations related to the load balance client endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "PoolConfiguration",
      "description": "\u003cp\u003eConfigurations for managing HTTP client connection pool.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketFailoverClientConfiguration",
      "description": "\u003cp\u003eConfigurations for the WebSocket client endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "FailoverConfig",
      "description": "\u003cp\u003eProvides a set of configurations for controlling the failover behaviour of the endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "FailoverInferredConfig",
      "description": "\u003cp\u003eRepresents the inferred failover configurations passed into the failover client.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "FailoverClientConfiguration",
      "description": "\u003cp\u003eProvides a set of HTTP related configurations and failover related configurations.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "HttpServiceConfig",
      "description": "\u003cp\u003eContains the configurations for an HTTP service.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CorsConfig",
      "description": "\u003cp\u003eConfigurations for CORS support.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Versioning",
      "description": "\u003cp\u003eConfigurations for service versioning.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WSServiceConfig",
      "description": "\u003cp\u003eConfigurations for a WebSocket service.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "HttpResourceConfig",
      "description": "\u003cp\u003eConfiguration for an HTTP resource.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketUpgradeConfig",
      "description": "\u003cp\u003eResource configuration to upgrade from HTTP to WebSocket.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ServiceAuth",
      "description": "\u003cp\u003eConfigures the authentication scheme for a service.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ResourceAuth",
      "description": "\u003cp\u003eConfigures the authentication scheme for a resource.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketClientConfiguration",
      "description": "\u003cp\u003eConfigurations for the WebSocket client.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CommonWebSocketClientConfiguration",
      "description": "\u003cp\u003eCommon client configurations for WebSocket clients.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketRetryConfig",
      "description": "\u003cp\u003eRetry configurations for WebSocket.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RetryInferredConfig",
      "description": "\u003cp\u003eDerived set of configurations from the \u003ccode\u003eRetryConfig\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    }
  ],
  "constants": [
    {
      "id": "CACHE_CONTROL_AND_VALIDATORS",
      "description": "\u003cp\u003eThis is a more restricted mode of RFC 7234.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RFC_7234",
      "description": "\u003cp\u003eCaching behaviour is as specified by the RFC 7234 specification.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "STATUS_CONTINUE",
      "description": "\u003cp\u003eThe HTTP response status code: 100 Continue\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_SWITCHING_PROTOCOLS",
      "description": "\u003cp\u003eThe HTTP response status code: 101 Switching Protocols\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_OK",
      "description": "\u003cp\u003eThe HTTP response status code: 200 OK\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_CREATED",
      "description": "\u003cp\u003eThe HTTP response status code: 201 Created\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_ACCEPTED",
      "description": "\u003cp\u003eThe HTTP response status code: 202 Accepted\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_NON_AUTHORITATIVE_INFORMATION",
      "description": "\u003cp\u003eThe HTTP response status code: 203 Non Authoritative Information\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_NO_CONTENT",
      "description": "\u003cp\u003eThe HTTP response status code: 204 No Content\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_RESET_CONTENT",
      "description": "\u003cp\u003eThe HTTP response status code: 205 Reset Content\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_PARTIAL_CONTENT",
      "description": "\u003cp\u003eThe HTTP response status code: 206 Partial Content\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_MULTIPLE_CHOICES",
      "description": "\u003cp\u003eThe HTTP response status code: 300 Multiple Choices\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_MOVED_PERMANENTLY",
      "description": "\u003cp\u003eThe HTTP response status code: 301 Moved Permanently\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_FOUND",
      "description": "\u003cp\u003eThe HTTP response status code: 302 Found\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_SEE_OTHER",
      "description": "\u003cp\u003eThe HTTP response status code: 303 See Other\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_NOT_MODIFIED",
      "description": "\u003cp\u003eThe HTTP response status code: 304 Not Modified\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_USE_PROXY",
      "description": "\u003cp\u003eThe HTTP response status code: 305 Use Proxy\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_TEMPORARY_REDIRECT",
      "description": "\u003cp\u003eThe HTTP response status code: 307 Temporary Redirect\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_PERMANENT_REDIRECT",
      "description": "\u003cp\u003eThe HTTP response status code: 308 Permanent Redirect\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_BAD_REQUEST",
      "description": "\u003cp\u003eThe HTTP response status code: 400 Bad Request\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_UNAUTHORIZED",
      "description": "\u003cp\u003eThe HTTP response status code: 401 Unauthorized\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_PAYMENT_REQUIRED",
      "description": "\u003cp\u003eThe HTTP response status code: 402 Payment Required\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_FORBIDDEN",
      "description": "\u003cp\u003eThe HTTP response status code: 403 Forbidden\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_NOT_FOUND",
      "description": "\u003cp\u003eThe HTTP response status code: 404 Not Found\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_METHOD_NOT_ALLOWED",
      "description": "\u003cp\u003eThe HTTP response status code: 405 Method Not Allowed\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_NOT_ACCEPTABLE",
      "description": "\u003cp\u003eThe HTTP response status code: 406 Not Acceptable\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_PROXY_AUTHENTICATION_REQUIRED",
      "description": "\u003cp\u003eThe HTTP response status code: 407 Proxy Authentication Required\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_REQUEST_TIMEOUT",
      "description": "\u003cp\u003eThe HTTP response status code: 408 Request Timeout\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_CONFLICT",
      "description": "\u003cp\u003eThe HTTP response status code: 409 Conflict\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_GONE",
      "description": "\u003cp\u003eThe HTTP response status code: 410 Gone\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_LENGTH_REQUIRED",
      "description": "\u003cp\u003eThe HTTP response status code: 411 Length Required\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_PRECONDITION_FAILED",
      "description": "\u003cp\u003eThe HTTP response status code: 412 Precondition Failed\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_PAYLOAD_TOO_LARGE",
      "description": "\u003cp\u003eThe HTTP response status code: 413 Payload Too Large\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_URI_TOO_LONG",
      "description": "\u003cp\u003eThe HTTP response status code: 414 URI Too Long\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_UNSUPPORTED_MEDIA_TYPE",
      "description": "\u003cp\u003eThe HTTP response status code: 415 Unsupported Media Type\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_RANGE_NOT_SATISFIABLE",
      "description": "\u003cp\u003eThe HTTP response status code: 416 Range Not Satisfiable\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_EXPECTATION_FAILED",
      "description": "\u003cp\u003eThe HTTP response status code: 417 Expectation Failed\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_UPGRADE_REQUIRED",
      "description": "\u003cp\u003eThe HTTP response status code: 426 Upgrade Required\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_INTERNAL_SERVER_ERROR",
      "description": "\u003cp\u003eThe HTTP response status code: 500 Internal Server Error\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_NOT_IMPLEMENTED",
      "description": "\u003cp\u003eThe HTTP response status code: 501 Not Implemented\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_BAD_GATEWAY",
      "description": "\u003cp\u003eThe HTTP response status code: 502 Bad Gateway\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_SERVICE_UNAVAILABLE",
      "description": "\u003cp\u003eThe HTTP response status code: 503 Service Unavailable\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_GATEWAY_TIMEOUT",
      "description": "\u003cp\u003eThe HTTP response status code: 504 Gateway Timeout\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "STATUS_HTTP_VERSION_NOT_SUPPORTED",
      "description": "\u003cp\u003eThe HTTP response status code: 505 HTTP Version Not Supported\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "AGE",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eage\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "AUTHORIZATION",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eauthorization\u003c/code\u003e\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "CACHE_CONTROL",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003ecache-control\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CONTENT_LENGTH",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003econtent-length\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CONTENT_TYPE",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003econtent-type\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "DATE",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003edate\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ETAG",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eetag\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "EXPECT",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eexpect\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "EXPIRES",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eexpires\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "IF_MATCH",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eif-match\u003c/code\u003e\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "IF_MODIFIED_SINCE",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eif-modified-since\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "IF_NONE_MATCH",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eif-none-match\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "IF_RANGE",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eif-range\u003c/code\u003e\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "IF_UNMODIFIED_SINCE",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eif-unmodified-since\u003c/code\u003e\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "LAST_MODIFIED",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003elast-modified\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "LOCATION",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003elocation\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "PRAGMA",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003epragma\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "PROXY_AUTHORIZATION",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eproxy-authorization\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "SERVER",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eserver\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WARNING",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003ewarning\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "TRANSFER_ENCODING",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003etransfer-encoding\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CONNECTION",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003econnection\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "UPGRADE",
      "description": "\u003cp\u003eHTTP header key \u003ccode\u003eupgrade\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "KEEPALIVE_AUTO",
      "description": "\u003cp\u003eDecides to keep the connection alive or not based on the \u003ccode\u003econnection\u003c/code\u003e header of the client request }\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "KEEPALIVE_ALWAYS",
      "description": "\u003cp\u003eKeeps the connection alive irrespective of the \u003ccode\u003econnection\u003c/code\u003e header value }\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "KEEPALIVE_NEVER",
      "description": "\u003cp\u003eCloses the connection irrespective of the \u003ccode\u003econnection\u003c/code\u003e header value }\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "SERVICE_NAME",
      "description": "\u003cp\u003eConstant for the service name reference.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RESOURCE_NAME",
      "description": "\u003cp\u003eConstant for the resource name reference.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REQUEST_METHOD",
      "description": "\u003cp\u003eConstant for the request method reference.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "PASSED",
      "description": "\u003cp\u003eMutual SSL handshake is successful.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "FAILED",
      "description": "\u003cp\u003eMutual SSL handshake has failed.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "NONE",
      "description": "\u003cp\u003eNot a mutual ssl connection.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CB_OPEN_STATE",
      "description": "\u003cp\u003eRepresents the open state of the circuit.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CB_HALF_OPEN_STATE",
      "description": "\u003cp\u003eRepresents the half-open state of the circuit.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CB_CLOSED_STATE",
      "description": "\u003cp\u003eRepresents the closed state of the circuit.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REDIRECT_MULTIPLE_CHOICES_300",
      "description": "\u003cp\u003eRepresents the HTTP redirect status code \u003ccode\u003e300 - Multiple Choices\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REDIRECT_MOVED_PERMANENTLY_301",
      "description": "\u003cp\u003eRepresents the HTTP redirect status code \u003ccode\u003e301 - Moved Permanently\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REDIRECT_FOUND_302",
      "description": "\u003cp\u003eRepresents the HTTP redirect status code \u003ccode\u003e302 - Found\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REDIRECT_SEE_OTHER_303",
      "description": "\u003cp\u003eRepresents the HTTP redirect status code \u003ccode\u003e303 - See Other\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REDIRECT_NOT_MODIFIED_304",
      "description": "\u003cp\u003eRepresents the HTTP redirect status code \u003ccode\u003e304 - Not Modified\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REDIRECT_USE_PROXY_305",
      "description": "\u003cp\u003eRepresents the HTTP redirect status code \u003ccode\u003e305 - Use Proxy\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REDIRECT_TEMPORARY_REDIRECT_307",
      "description": "\u003cp\u003eRepresents the HTTP redirect status code \u003ccode\u003e307 - Temporary Redirect\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "REDIRECT_PERMANENT_REDIRECT_308",
      "description": "\u003cp\u003eRepresents the HTTP redirect status code \u003ccode\u003e308 - Permanent Redirect\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "MULTIPART_AS_PRIMARY_TYPE",
      "description": "\u003cp\u003eRepresents multipart primary type\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_FORWARD",
      "description": "\u003cp\u003eConstant for the HTTP FORWARD method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_GET",
      "description": "\u003cp\u003eConstant for the HTTP GET method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_POST",
      "description": "\u003cp\u003eConstant for the HTTP POST method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_DELETE",
      "description": "\u003cp\u003eConstant for the HTTP DELETE method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_OPTIONS",
      "description": "\u003cp\u003eConstant for the HTTP OPTIONS method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_PUT",
      "description": "\u003cp\u003eConstant for the HTTP PUT method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_PATCH",
      "description": "\u003cp\u003eConstant for the HTTP PATCH method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_HEAD",
      "description": "\u003cp\u003eConstant for the HTTP HEAD method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_SUBMIT",
      "description": "\u003cp\u003econstant for the HTTP SUBMIT method\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HTTP_NONE",
      "description": "\u003cp\u003eConstant for the identify not an HTTP Operation\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "CHUNKING_AUTO",
      "description": "\u003cp\u003eIf the payload is less than 8KB, content-length header is set in the outbound request/response,\notherwise chunking header is set in the outbound request/response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CHUNKING_ALWAYS",
      "description": "\u003cp\u003eAlways set chunking header in the response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CHUNKING_NEVER",
      "description": "\u003cp\u003eNever set the chunking header even if the payload is larger than 8KB in the outbound request/response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "COMPRESSION_AUTO",
      "description": "\u003cp\u003eWhen service behaves as a HTTP gateway inbound request/response accept-encoding option is set as the\noutbound request/response accept-encoding/content-encoding option.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "COMPRESSION_ALWAYS",
      "description": "\u003cp\u003eAlways set accept-encoding/content-encoding in outbound request/response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "COMPRESSION_NEVER",
      "description": "\u003cp\u003eNever set accept-encoding/content-encoding header in outbound request/response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "LEADING",
      "description": "\u003cp\u003eHeader is placed before the payload of the request/response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "TRAILING",
      "description": "\u003cp\u003eHeader is placed after the payload of the request/response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "NO_CACHE",
      "description": "\u003cp\u003eForces the cache to validate a cached response with the origin server before serving.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "NO_STORE",
      "description": "\u003cp\u003eInstructs the cache to not store a response in non-volatile storage.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "NO_TRANSFORM",
      "description": "\u003cp\u003eInstructs intermediaries not to transform the payload.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "MAX_AGE",
      "description": "\u003cp\u003eWhen used in requests, \u003ccode\u003emax-age\u003c/code\u003e implies that clients are not willing to accept responses whose age is greater\nthan \u003ccode\u003emax-age\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "MAX_STALE",
      "description": "\u003cp\u003eIndicates that the client is willing to accept responses which have exceeded their freshness lifetime by no more\nthan the specified number of seconds.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "MIN_FRESH",
      "description": "\u003cp\u003eIndicates that the client is only accepting responses whose freshness lifetime \u0026gt;\u003d current age + min-fresh.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ONLY_IF_CACHED",
      "description": "\u003cp\u003eIndicates that the client is only willing to accept a cached response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "MUST_REVALIDATE",
      "description": "\u003cp\u003eIndicates that once the response has become stale, it should not be reused for subsequent requests without\nvalidating with the origin server.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "PUBLIC",
      "description": "\u003cp\u003eIndicates that any cache may store the response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "PRIVATE",
      "description": "\u003cp\u003eIndicates that the response is intended for a single user and should not be stored by shared caches.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "PROXY_REVALIDATE",
      "description": "\u003cp\u003eHas the same semantics as \u003ccode\u003emust-revalidate\u003c/code\u003e, except that this does not apply to private caches.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "S_MAX_AGE",
      "description": "\u003cp\u003eIn shared caches, \u003ccode\u003es-maxage\u003c/code\u003e overrides the \u003ccode\u003emax-age\u003c/code\u003e or \u003ccode\u003eexpires\u003c/code\u003e header field.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "MAX_STALE_ANY_AGE",
      "description": "\u003cp\u003eSetting this as the \u003ccode\u003emax-stale\u003c/code\u003e directives indicates that the \u003ccode\u003emax-stale\u003c/code\u003e directive does not specify a limit.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "AUTH_HEADER",
      "description": "\u003cp\u003eRepresents the Authorization header name.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "AUTH_HEADER_BEARER",
      "description": "\u003cp\u003eIndicates that the authentication credentials should be sent via the Authentication header.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "POST_BODY_BEARER",
      "description": "\u003cp\u003eIndicates that the Authentication credentials should be sent via the body of the POST request.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "NO_BEARER",
      "description": "\u003cp\u003eIndicates that the authentication credentials should not be sent.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "STATUS_CODE",
      "description": "\u003cp\u003eIndicates the status code.\u003c/p\u003e",
      "moduleId": "http"
    }
  ],
  "errors": [
    {
      "id": "FailoverAllEndpointsFailedError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to all the failover endpoint failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "FailoverActionFailedError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to failover action failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "UpstreamServiceUnavailableError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to upstream service unavailability\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "AllLoadBalanceEndpointsFailedError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to all the load balance endpoint failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "CircuitBreakerConfigError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to circuit breaker configuration error.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "AllRetryAttemptsFailed",
      "description": "\u003cp\u003eRepresents a client error that occurred due to all the the retry attempts failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "IdleTimeoutError",
      "description": "\u003cp\u003eRepresents the error that triggered upon a request/response idle timeout\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "AuthenticationError",
      "description": "\u003cp\u003eRepresents a listener error that occurred due to inbound request authentication failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "AuthorizationError",
      "description": "\u003cp\u003eRepresents a listener error that occurred due to inbound request authorization failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "InitializingOutboundRequestError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to outbound request initialization failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WritingOutboundRequestHeadersError",
      "description": "\u003cp\u003eRepresents a client error that occurred while writing outbound request headers\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WritingOutboundRequestBodyError",
      "description": "\u003cp\u003eRepresents a client error that occurred while writing outbound request entity body\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "InitializingInboundResponseError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to inbound response initialization failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "ReadingInboundResponseHeadersError",
      "description": "\u003cp\u003eRepresents a client error that occurred while reading inbound response headers\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "ReadingInboundResponseBodyError",
      "description": "\u003cp\u003eRepresents a client error that occurred while reading inbound response entity body\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "InitializingInboundRequestError",
      "description": "\u003cp\u003eRepresents a listener error that occurred due to inbound request initialization failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "ReadingInboundRequestHeadersError",
      "description": "\u003cp\u003eRepresents a listener error that occurred while reading inbound request headers\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "ReadingInboundRequestBodyError",
      "description": "\u003cp\u003eRepresents a listener error that occurred while writing the inbound request entity body\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "InitializingOutboundResponseError",
      "description": "\u003cp\u003eRepresents a listener error that occurred due to outbound response initialization failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WritingOutboundResponseHeadersError",
      "description": "\u003cp\u003eRepresents a listener error that occurred while writing outbound response headers\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WritingOutboundResponseBodyError",
      "description": "\u003cp\u003eRepresents a listener error that occurred while writing outbound response entity body\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "Initiating100ContinueResponseError",
      "description": "\u003cp\u003eRepresents an error that occurred due to 100 continue response initialization failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "Writing100ContinueResponseError",
      "description": "\u003cp\u003eRepresents an error that occurred while writing 100 continue response\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "InvalidCookieError",
      "description": "\u003cp\u003eRepresents a cookie error that occurred when sending cookies in the response\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "GenericClientError",
      "description": "\u003cp\u003eRepresents a generic client error\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "GenericListenerError",
      "description": "\u003cp\u003eRepresents a generic listener error\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "UnsupportedActionError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to unsupported action invocation\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "Http2ClientError",
      "description": "\u003cp\u003eRepresents an HTTP/2 client generic error\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "MaximumWaitTimeExceededError",
      "description": "\u003cp\u003eRepresents a client error that occurred exceeding maximum wait time\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "SslError",
      "description": "\u003cp\u003eRepresents a client error that occurred due to SSL failure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "CookieHandlingError",
      "description": "\u003cp\u003eRepresents a cookie error that occurred when using the cookies\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "IllegalDataBindingStateError",
      "description": "\u003cp\u003eRepresents an illegal data-binding  state error\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "ClientRequestError",
      "description": "\u003cp\u003eRepresents an error, which occurred due to bad syntax or incomplete info in the client request(4xx HTTP response)\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "RemoteServerError",
      "description": "\u003cp\u003eRepresents an error, which occurred due to a failure of the remote server(5xx HTTP response)\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "LoadBalanceActionError",
      "description": "\u003cp\u003eRepresents an error occurred in an remote function of the Load Balance connector.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WsConnectionClosureError",
      "description": "\u003cp\u003eRaised during failures in connection closure\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WsInvalidHandshakeError",
      "description": "\u003cp\u003eRaised during the handshake when the WebSocket upgrade fails\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WsPayloadTooBigError",
      "description": "\u003cp\u003eRaised when receiving a frame with a payload exceeding the maximum size\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WsProtocolError",
      "description": "\u003cp\u003eRaised when the other side breaks the protocol\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WsConnectionError",
      "description": "\u003cp\u003eRaised during connection failures\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WsInvalidContinuationFrameError",
      "description": "\u003cp\u003eRaised when an out of order/invalid continuation frame is received\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "WsGenericError",
      "description": "\u003cp\u003eRaised for errors not captured by the specific errors\u003c/p\u003e\n",
      "moduleId": "http"
    }
  ],
  "types": [
    {
      "id": "CachingPolicy",
      "description": "\u003cp\u003eUsed for configuring the caching behaviour.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RequestMessage",
      "description": "\u003cp\u003eThe types of messages that are accepted by HTTP \u003ccode\u003eclient\u003c/code\u003e when sending out the outbound request.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ResponseMessage",
      "description": "\u003cp\u003eThe types of messages that are accepted by HTTP \u003ccode\u003elistener\u003c/code\u003e when sending out the outbound response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Payload",
      "description": "\u003cp\u003eThe types of the response payload that are returned by the HTTP \u003ccode\u003eclient\u003c/code\u003e after the data binding operation\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HttpOperation",
      "description": "\u003cp\u003eDefines the HTTP operations related to circuit breaker, failover and load balancer.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "KeepAlive",
      "description": "\u003cp\u003eDefines the possible values for the keep-alive configuration in service and client endpoints.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "MutualSslStatus",
      "description": "\u003cp\u003eDefines the possible values for the mutual ssl status.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CircuitState",
      "description": "\u003cp\u003eA finite type for modeling the states of the Circuit Breaker.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RedirectCode",
      "description": "\u003cp\u003eDefines the HTTP redirect codes as a type.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ResiliencyError",
      "description": "\u003cp\u003eDefines the resiliency error types that returned from client\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "ClientAuthError",
      "description": "\u003cp\u003eDefines the Auth error types that returned from client\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "OutboundRequestError",
      "description": "\u003cp\u003eDefines the client error types that returned while sending outbound request\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "InboundResponseError",
      "description": "\u003cp\u003eDefines the client error types that returned while receiving inbound response\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "InboundRequestError",
      "description": "\u003cp\u003eDefines the listener error types that returned while receiving inbound request\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "OutboundResponseError",
      "description": "\u003cp\u003eDefines the listener error types that returned while sending outbound response\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "ClientError",
      "description": "\u003cp\u003eDefines the possible client error types\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "ListenerError",
      "description": "\u003cp\u003eDefines the possible listener error types\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "HttpVersion",
      "description": "\u003cp\u003eDefines the supported HTTP protocols.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Chunking",
      "description": "\u003cp\u003eDefines the possible values for the chunking configuration in HTTP services and clients.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Compression",
      "description": "\u003cp\u003eOptions to compress using gzip or deflate.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "HeaderPosition",
      "description": "\u003cp\u003eDefines the position of the headers in the request/response.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketError",
      "description": "\u003cp\u003eThe union of all the WebSocket related errors\u003c/p\u003e\n",
      "moduleId": "http"
    },
    {
      "id": "CredentialBearer",
      "description": "\u003cp\u003eSpecifies how to send the authentication credentials when exchanging tokens.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "InboundAuthHandlers",
      "description": "\u003cp\u003eRepresents inbound auth handler patterns.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Scopes",
      "description": "\u003cp\u003eRepresents scopes patterns.\u003c/p\u003e",
      "moduleId": "http"
    }
  ],
  "clients": [
    {
      "id": "CookieClient",
      "description": "\u003cp\u003eProvides the cookie functionality across HTTP client actions.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketCaller",
      "description": "\u003cp\u003eRepresents a WebSocket caller.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Client",
      "description": "\u003cp\u003eThe HTTP client provides the capability for initiating contact with a remote HTTP service.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "HttpCachingClient",
      "description": "\u003cp\u003eAn HTTP caching client implementation which takes an \u003ccode\u003eHttpActions\u003c/code\u003e instance and wraps it with an HTTP caching layer.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "HttpSecureClient",
      "description": "\u003cp\u003eProvides secure HTTP remote functions for interacting with HTTP endpoints.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "CircuitBreakerClient",
      "description": "\u003cp\u003eA Circuit Breaker implementation which can be used to gracefully handle network failures.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "Caller",
      "description": "\u003cp\u003eThe caller actions for responding to client requests.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "HttpClient",
      "description": "\u003cp\u003eProvides the HTTP actions for interacting with an HTTP server.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "LoadBalanceClient",
      "description": "\u003cp\u003eLoadBalanceClient endpoint provides load balancing functionality over multiple HTTP clients.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RedirectClient",
      "description": "\u003cp\u003eProvides redirect functionality for HTTP client remote functions.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketFailoverClient",
      "description": "\u003cp\u003eA WebSocket client endpoint, which provides failover support for multiple WebSocket targets.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "FailoverClient",
      "description": "\u003cp\u003eAn HTTP client endpoint which provides failover support over multiple HTTP clients.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketClient",
      "description": "\u003cp\u003eRepresents a WebSocket client endpoint.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RetryClient",
      "description": "\u003cp\u003eProvides the HTTP remote functions for interacting with an HTTP endpoint.\u003c/p\u003e",
      "moduleId": "http"
    }
  ],
  "listeners": [
    {
      "id": "Listener",
      "description": "\u003cp\u003eThis is used for creating HTTP server endpoints.\u003c/p\u003e",
      "moduleId": "http"
    }
  ],
  "annotations": [
    {
      "id": "ServiceConfig",
      "description": "\u003cp\u003eThe annotation which is used to configure an HTTP service.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "WebSocketServiceConfig",
      "description": "\u003cp\u003eThe annotation which is used to configure a WebSocket service.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ResourceConfig",
      "description": "\u003cp\u003eThe annotation which is used to configure an HTTP resource.\u003c/p\u003e",
      "moduleId": "http"
    }
  ],
  "abstractObjects": [
    {
      "id": "InboundAuthHandler",
      "description": "\u003cp\u003eThe representation of an inbound authentication handler object type for HTTP traffic.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "OutboundAuthHandler",
      "description": "\u003cp\u003eThe representation of an outbound authentication handler object type for HTTP traffic.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "PersistentCookieHandler",
      "description": "\u003cp\u003eThe representation of a persistent cookie handler object type for managing persistent cookies.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "RequestFilter",
      "description": "\u003cp\u003eThe representation of a HTTP Request Filter Object type.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "ResponseFilter",
      "description": "\u003cp\u003eThe representation of a HTTP Response Filter Object type.\u003c/p\u003e",
      "moduleId": "http"
    },
    {
      "id": "LoadBalancerRule",
      "description": "\u003cp\u003eLoadBalancerRule object type provides a required abstraction to implement different algorithms.\u003c/p\u003e",
      "moduleId": "http"
    }
  ]
};