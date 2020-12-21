var searchData = {
  "modules": [
    {
      "id": "oauth2",
      "description": "\u003cp\u003eThis module provides an inbound OAuth2 authentication provider, which can be used to authenticate the provided credentials against an introspection endpoint and an outbound OAuth2 authentication provider, which can be used to authenticate an external endpoint.\u003c/p\u003e",
      "orgName": "ballerina",
      "version": "1.0.4"
    }
  ],
  "classes": [
    {
      "id": "OutboundOAuth2Provider",
      "description": "\u003cp\u003eRepresents the outbound OAuth2 provider, which generates OAtuh2 tokens.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "InboundOAuth2Provider",
      "description": "\u003cp\u003eRepresents the inbound OAuth2 provider, which calls the introspection server, validates the received credentials,\nand performs authentication and authorization.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "functions": [
    {
      "id": "validateOAuth2Token",
      "description": "\u003cp\u003eValidates the given OAuth2 token by calling the OAuth2 introspection endpoint.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "records": [
    {
      "id": "ClientConfiguration",
      "description": "\u003cp\u003eRepresents the configurations of the client used to call the introspection endpoint.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "SecureSocket",
      "description": "\u003cp\u003eRepresents the SSL/TLS configurations.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "ClientCredentialsGrantConfig",
      "description": "\u003cp\u003eThe data structure, which is used to configure the OAuth2 client credentials grant type.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "PasswordGrantConfig",
      "description": "\u003cp\u003eThe data structure, which is used to configure the OAuth2 password grant type.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "DirectTokenConfig",
      "description": "\u003cp\u003eThe data structure, which is used to configure the OAuth2 access token directly.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "RefreshConfig",
      "description": "\u003cp\u003eThe data structure, which can be used to pass the configurations for refreshing the access token of\nthe password grant type.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "DirectTokenRefreshConfig",
      "description": "\u003cp\u003eThe data structure, which can be used to pass the configurations for refreshing the access token directly.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "OutboundOAuth2CacheEntry",
      "description": "\u003cp\u003eThe data structure, which stores the values received from the authorization/token server to use them\nfor the latter requests without requesting tokens again.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "IntrospectionServerConfig",
      "description": "\u003cp\u003eRepresents the introspection server configurations.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "IntrospectionResponse",
      "description": "\u003cp\u003eRepresents the introspection server response.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "constants": [],
  "errors": [
    {
      "id": "OAuth2Error",
      "description": "\u003cp\u003eRepresents the OAuth2 distinct error.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "types": [
    {
      "id": "Error",
      "description": "\u003cp\u003eRepresents the OAuth2 error.\u003c/p\u003e",
      "moduleId": "oauth2",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "clients": [],
  "listeners": [],
  "annotations": [],
  "abstractObjects": []
};