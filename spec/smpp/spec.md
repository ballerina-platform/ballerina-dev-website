# Specification: Ballerina SMPP Library

_Owners_: @dilanp \
_Reviewers_: @daneshk @DimuthuMadushan \
_Created_: 2026/09/10 \
_Updated_: 2026/09/10 \
_Edition_: Swan Lake

## Introduction

This is the specification for the SMPP standard library of the [Ballerina language](https://ballerina.io/), which provides a `Client` and a `Listener` for sending and receiving SMS traffic through a Short Message Service Centre (SMSC) using **SMPP v3.4** (Short Message Peer-to-Peer Protocol, Issue 1.2).

The SMPP library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification, is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` on GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Addressing](#2-addressing)
3. [Security](#3-security)
   * 3.1 [TLS](#31-tls)
   * 3.2 [Insecure connections](#32-insecure-connections)
4. [Client](#4-client)
   * 4.1 [Bind types](#41-bind-types)
   * 4.2 [Initializing the Client](#42-initializing-the-client)
   * 4.3 [Outbound message shapes](#43-outbound-message-shapes)
   * 4.4 [Client operations](#44-client-operations)
      * 4.4.1 [submit](#441-submit)
      * 4.4.2 [submitMulti](#442-submitmulti)
      * 4.4.3 [submitData](#443-submitdata)
      * 4.4.4 [queryStatus](#444-querystatus)
      * 4.4.5 [cancel](#445-cancel)
      * 4.4.6 [replace](#446-replace)
      * 4.4.7 [close](#447-close)
5. [Listener](#5-listener)
   * 5.1 [Bind types](#51-bind-types)
   * 5.2 [Initializing the Listener](#52-initializing-the-listener)
   * 5.3 [Service declaration](#53-service-declaration)
   * 5.4 [The `Sms` record](#54-the-sms-record)
   * 5.5 [Delivery receipts](#55-delivery-receipts)
   * 5.6 [Response mode](#56-response-mode)
   * 5.7 [The `Caller`](#57-the-caller)
   * 5.8 [Resilience and rebinding](#58-resilience-and-rebinding)
   * 5.9 [Lifecycle](#59-lifecycle)
6. [Error handling](#6-error-handling)
   * 6.1 [`FailureMode`](#61-failuremode)
   * 6.2 [`ErrorDetail`](#62-errordetail)
7. [Character encoding](#7-character-encoding)
8. [Protocol conformance and known limitations](#8-protocol-conformance-and-known-limitations)

## 1. Overview

The SMPP library provides two entry points into a single underlying protocol implementation:

- **`smpp:Client`** — an active ESME that submits messages and manages previously submitted ones. It may bind as `TRANSMITTER`, `RECEIVER`, or `TRANSCEIVER`.
- **`smpp:Listener`** — a passive ESME that binds as `RECEIVER` or `TRANSCEIVER` and dispatches inbound PDUs (mobile-originated SMS and delivery receipts) to an attached service. A `TRANSCEIVER`-bound listener also exposes an `smpp:Caller` so a service can reply on the same session.

Both wrap the Java library [`org.jsmpp:jsmpp`](https://jsmpp.org/) through Ballerina's Java interoperability, and share one set of public types (`ballerina/smpp` module: `BindType`, `OutboundSms`, `SubmitResult`, `Sms`, `DeliveryReceipt`, `SecureSocket`, `Error`, and so on) so that error handling and message shapes are identical on both sides of a conversation.

An SMPP session always plays the ESME (External Short Messaging Entity) role against a peer SMSC; this library does not implement the SMSC side of the protocol.

## 2. Addressing

An SMPP address is a digit string plus two fields that say how to interpret it: `typeOfNumber` (type of number, §5.2.5) and `numberingPlanIndicator` (numbering plan indicator, §5.2.6). The `smpp:Address` record carries all three:

```ballerina
public type Address record {|
    string value;
    TypeOfNumber typeOfNumber = TON_INTERNATIONAL;
    NumberingPlanIndicator numberingPlanIndicator = NPI_ISDN;
|};
```

Anywhere the API accepts `string|Address`, a plain `string` is shorthand for `{value: <the string>}` — an ordinary E.164 MSISDN without the leading `+`. Short codes and alphanumeric sender IDs need an explicit `Address` (typically `typeOfNumber: TON_ABBREVIATED` or `TON_ALPHANUMERIC`).

Address values are validated to be ASCII: SMPP address fields are octet-counted C-octet strings on the wire, and a platform-charset string could silently inflate on encode.

## 3. Security

### 3.1 TLS

An SMPP bind sends `system_id`/`password` — and every PDU thereafter — as-is over the transport; nothing in the protocol itself encrypts it. Both `ClientConfig.secureSocket` and `ListenerConfig.secureSocket` accept a `SecureSocket` to wrap the connection in TLS before the bind is attempted:

```ballerina
public type SecureSocket record {|
    crypto:TrustStore|string cert;
    crypto:KeyStore key?;
    string[] protocolVersions = ["TLSv1.3", "TLSv1.2"];
    string[] ciphers = [];
    boolean verifyHostName = true;
|};
```

- `cert` is required — a TLS connection with no way to authenticate the peer is not an accepted configuration (see 3.2 for the deliberate escape hatch).
- Only `TLSv1.2` and `TLSv1.3` are ever negotiated; any other value in `protocolVersions` (including `TLSv1.1`) is rejected at `init`.
- `key` supplies client certificate material for mutual TLS, when the SMSC authenticates the ESME by certificate.
- `verifyHostName` (default `true`) controls whether the certificate's subject must match the configured `host`; turning it off relaxes only the hostname check, not chain verification.

### 3.2 Insecure connections

`InsecureSocket` accepts a TLS connection with **all** server-certificate verification disabled:

```ballerina
public type InsecureSocket record {|
    true disableSslVerification;
|};
```

This is a development/testing escape hatch only — the connection is encrypted but not authenticated, and is open to a man-in-the-middle. A warning is logged once, at `init`, whenever it is in effect. It must never be pointed at a production SMSC.

## 4. Client

### 4.1 Bind types

```ballerina
public enum BindType {
    TRANSMITTER,
    RECEIVER,
    TRANSCEIVER
}
```

A `Client` accepts any of the three. `TRANSMITTER` is send-only (the SMSC never delivers `deliver_sm`/`data_sm` to it — irrelevant to a `Client`, which has no receive path regardless); `RECEIVER` can only `queryStatus`/`cancel`/`replace` against messages it did not itself submit through this session; `TRANSCEIVER` can do everything the protocol allows on one session.

### 4.2 Initializing the Client

```ballerina
public type ClientConfig record {|
    int port = 2775;
    string systemType = "";
    BindType bindType = TRANSCEIVER;
    decimal bindTimeout = 60;
    decimal transactionTimeout = 30;
    decimal enquireLinkInterval = 60;
    (SecureSocket|InsecureSocket)? secureSocket = ();
|};

public isolated function init(string host, string systemId, string password,
        *ClientConfig config) returns Error?;
```

`host`, `systemId`, and `password` are required parameters of `init` itself, not `ClientConfig` fields — matching the convention other multi-field-config Ballerina connectors use (e.g. `rabbitmq:Client.init(string host, int port, *ConnectionConfiguration connectionData)`) so a caller cannot forget them. `init` connects and binds synchronously; a `Client` that returns from `init` without error is bound and ready to submit. `bindTimeout` bounds the connect-and-bind handshake; `transactionTimeout` bounds every subsequent submit-family request's wait for its response; `enquireLinkInterval` is the client's own keepalive/idle-probe cadence, used to detect a silently dead link.

### 4.3 Outbound message shapes

Every submit-family operation that sends a message body takes an `OutboundSms`:

```ballerina
public type OutboundBase record {|
    string|Address destinationAddress;
    string|Address sourceAddress?;
    DeliveryReceiptRequest registeredDelivery = NONE;
    string serviceType = "";
    string validityPeriod?;
|};

public type TextSms record {|
    *OutboundBase;
    string shortMessage;
    Encoding encoding = LATIN1;
|};

public type BinarySms record {|
    *OutboundBase;
    byte[] shortMessageBytes;
    int dataCoding;
    boolean udhi = false;
|};

public type OutboundSms TextSms|BinarySms;
```

A `TextSms` is encoded by the connector per `encoding` (`ASCII`, `LATIN1`, or `UCS2`); a `BinarySms` is sent verbatim with an explicit `dataCoding` byte and an optional `udhi` bit for UDH-bearing (e.g. concatenated) payloads. `shortMessage`/`shortMessageBytes` must not be empty, and a single PDU's payload must not exceed 254 octets — this library does not implement concatenation/reassembly; build multi-part messages yourself with `BinarySms` and `udhi: true`.

### 4.4 Client operations

#### 4.4.1 submit

```ballerina
remote isolated function submit(OutboundSms sms) returns SubmitResult|Error;
```

Issues `submit_sm` and waits for `submit_sm_resp` (bounded by `transactionTimeout`). On success, `SubmitResult.messageId` is the SMSC's `message_id` — the key to correlate a later delivery receipt against, via `Sms.receiptedMessageId` on the receiving side.

#### 4.4.2 submitMulti

```ballerina
remote isolated function submitMulti(OutboundSms sms, string[] destinationAddresses) returns MultiSubmitResult|Error;
```

Issues `submit_multi` against a list of destinations in one PDU. `MultiSubmitResult.unsuccessfulAddresses` carries the subset of `destinationAddresses` the SMSC's `submit_multi_resp` reported as unsuccessful (its `unsuccess_sme` list); the batch as a whole still succeeds (returns non-`Error`) as long as the SMSC accepted the request.

#### 4.4.3 submitData

```ballerina
remote isolated function submitData(OutboundSms data) returns SubmitResult|Error;
```

Issues `data_sm` — the alternative MT transfer PDU, preferred by some SMSCs for binary/WAP-push traffic. Same request/response shape as `submit`.

#### 4.4.4 queryStatus

```ballerina
remote isolated function queryStatus(string messageId, string sourceAddress) returns QueryResult|Error;
```

Issues `query_sm` for a previously submitted message's current delivery state. `QueryResult.messageState` reuses the `DeliveryReceiptStatus` enum — jsmpp's `MessageState` names the same states a delivery receipt's `stat:` token does, under different Java identifiers (e.g. `DELIVERED`→`DELIVRD`, `UNDELIVERABLE`→`UNDELIV`), so callers branch on one enum regardless of which path the state came from. `finalDate` is `()` while the message has not yet reached a final state.

#### 4.4.5 cancel

```ballerina
remote isolated function cancel(string messageId, string sourceAddress, string destinationAddress) returns Error?;
```

Issues `cancel_sm`. Returns `()` on success (the SMSC accepted the cancellation) or an `Error` — most commonly `REJECTED` if the message has already been delivered or does not exist.

#### 4.4.6 replace

```ballerina
remote isolated function replace(string messageId, string sourceAddress, OutboundSms sms) returns Error?;
```

Issues `replace_sm`, substituting the body (and other replaceable fields) of a previously submitted, not-yet-delivered message.

#### 4.4.7 close

```ballerina
public isolated function close() returns Error?;
```

Unbinds and closes the underlying session. Idempotent; a `Client` cannot be reused after `close` — construct a new one to reconnect.

## 5. Listener

### 5.1 Bind types

```ballerina
public type ListenerBindType RECEIVER|TRANSCEIVER;
```

`TRANSMITTER` is excluded at the type level: a transmitter-bound session structurally cannot receive `deliver_sm`/`data_sm`, so configuring it on a `Listener` would connect successfully and then never invoke the attached service. This is rejected at compile time rather than left as a silent runtime dead end.

### 5.2 Initializing the Listener

```ballerina
public type ListenerConfig record {|
    int port = 2775;
    string systemType = "";
    ListenerBindType bindType = RECEIVER;
    int maxConcurrentDispatch = 3;
    ResponseMode responseMode = SYNC;
    boolean decodeGsm7 = false;
    decimal gracefulStopTimeout = 30;
    RebindPolicy rebindPolicy = {};
    decimal enquireLinkInterval = 60;
    decimal bindTimeout = 60;
    decimal transactionTimeout = 30;
    (SecureSocket|InsecureSocket)? secureSocket = ();
|};

public isolated function init(string host, string systemId, string password,
        *ListenerConfig config) returns error?;
```

As with `Client`, `host`, `systemId`, and `password` are required parameters of `init` itself, not `ListenerConfig` fields. `init` validates configuration only; the connect-and-bind happens at `'start()` (called automatically by the runtime for a `listener` declaration, or explicitly for a dynamically-registered one). `maxConcurrentDispatch` bounds how many inbound PDUs run through the attached service at once — excess is answered `ESME_RTHROTTLED` so the SMSC backs off and retains the message, per SMPP's at-least-once delivery model.

### 5.3 Service declaration

A service attached to a `Listener` implements at least one of:

```ballerina
remote function onDeliverSm(Sms sms) returns error?;
remote function onDeliverSm(Sms sms, Caller caller) returns error?;   // TRANSCEIVER only
remote function onDataSm(Sms sms) returns error?;
remote function onDataSm(Sms sms, Caller caller) returns error?;      // TRANSCEIVER only
remote function onError(error err) returns error?;
```

`onDeliverSm` handles an inbound `deliver_sm` (an MO message, or a delivery receipt when `Sms.deliveryReceipt` is `true`); `onDataSm` handles the alternative `data_sm` transfer PDU. `onError` is notified on an unexpected session drop (see 5.8); if not implemented, drops are logged via `ballerina/log` instead. The `Caller` parameter, where declared, is matched by type rather than position — a handler may write it before or after `Sms`.

A PDU whose corresponding handler is not implemented by the attached service is NACKed with `ESME_RX_P_APPN` (permanent application error) rather than silently acknowledged, so the SMSC's at-least-once guarantee is not discharged against a message nothing consumed.

### 5.4 The `Sms` record

```ballerina
public type Sms record {|
    string sourceAddress;
    string destinationAddress;
    string shortMessage;
    byte[] shortMessageBytes = [];
    boolean deliveryReceipt = false;
    string? receiptedMessageId = ();
    map<anydata> properties = {};
    DeliveryReceipt? receipt = ();
|};
```

`shortMessage` is decoded per the PDU's `data_coding` where the scheme is unambiguous (IA5/ASCII, Latin-1, UCS2); anything else falls back to UTF-8 (or, with `decodeGsm7: true`, unpacked GSM 03.38 for `data_coding 0x00`). `shortMessageBytes` is the same payload before any charset decoding, for callers that need to decode it themselves. `properties` carries protocol metadata not promoted to a typed field: `dataCoding`, per-address `typeOfNumber`/`numberingPlanIndicator`, `esmClass`, and `udhi`.

### 5.5 Delivery receipts

When `deliveryReceipt` is `true`, the PDU is an SMSC delivery receipt. `receipt` (`DeliveryReceipt?`) is jsmpp's parse of its Appendix-B body:

```ballerina
public type DeliveryReceipt record {|
    string id?;
    int submitted?;
    int delivered?;
    string submitDate?;
    string doneDate?;
    DeliveryReceiptStatus finalStatus?;
    string errorCode?;
    string text?;
|};
```

`receipt` is `()` when the body doesn't conform to the Appendix-B format even though `deliveryReceipt` is `true` — the raw text is always available on `shortMessage`. **`receiptedMessageId`** (the `receipted_message_id` TLV, §5.3.2.12) is the only field SMPP *guarantees* equals the `message_id` a submit returned; `receipt.id`, parsed from the human-readable body, is vendor-specific and may differ in radix.

### 5.6 Response mode

```ballerina
public enum ResponseMode {
    SYNC,
    ASYNC
}
```

`SYNC` (default) waits for the handler to return before acking the SMSC: success acks `ESME_ROK`, a returned `error` acks `ESME_RX_T_APPN` (temporary application error), which most SMSCs treat as a redeliver signal. `ASYNC` acks `ESME_ROK` immediately and runs the handler independently; a later failure cannot be reflected to the SMSC and is logged instead. `maxConcurrentDispatch` bounds concurrency in both modes.

`ASYNC` is the documented recommendation for a reply-style service (one that calls `caller->submit` from its handler): in `SYNC`, a slow inline reply can delay `deliver_sm_resp` past the SMSC's own transaction timer, causing the SMSC to redeliver the inbound message and the handler to answer it twice.

### 5.7 The `Caller`

```ballerina
public isolated client class Caller {
    remote isolated function submit(OutboundSms sms) returns SubmitResult|Error;
}
```

Obtained only by declaring it as a service-method parameter — never constructed directly. One `Caller` exists per `Listener` and stays valid across a rebind (see 5.8): every `submit` call resolves the listener's *current* session. `submit` requires the listener to be bound `TRANSCEIVER`; on a `RECEIVER` bind it fails fast with an `INVALID_REQUEST` error naming the fix. Its semantics otherwise match `Client.submit` (4.4.1).

### 5.8 Resilience and rebinding

```ballerina
public type RebindPolicy record {|
    decimal initialRebindDelay = 1;
    decimal maxRebindDelay = 60;
    decimal backOffMultiplier = 2.0;
    int maxRebindAttempts = -1;
|};
```

After an unexpected drop (detected via jsmpp's session-state listener — not engaged for a user-initiated stop), the `Listener` notifies `onError` and rebinds with exponential backoff bounded by `maxRebindDelay`. `onError` fires once for the initial drop, again for every failed rebind attempt, and once more if rebinding is exhausted. `maxRebindAttempts` counts *consecutive* failures, resetting only after a stability window; `0` disables automatic rebinding, `-1` (default) retries indefinitely. Once rebinding is exhausted or disabled, the listener latches permanently dead: every subsequent operation fails with `LINK_ABANDONED`, and only a new `Listener` recovers.

### 5.9 Lifecycle

```ballerina
public isolated function 'start() returns error?;
public isolated function gracefulStop() returns error?;
public isolated function immediateStop() returns error?;
```

`'start()` connects and binds; calling it twice, or on a stopped listener, is rejected (a stopped listener cannot be restarted). `gracefulStop` cancels any pending rebind, drains in-flight dispatches and submits (bounded by `gracefulStopTimeout`), then unbinds and closes. `immediateStop` skips the drain. Both stops are idempotent and bounded by an internal force-close watchdog even against an unresponsive SMSC.

## 6. Error handling

### 6.1 `FailureMode`

```ballerina
public enum FailureMode {
    REJECTED,
    TIMEOUT_DELIVERY_UNKNOWN,
    LINK_DOWN,
    LINK_ABANDONED,
    INVALID_REQUEST,
    PROTOCOL_ERROR
}
```

Every submit-family failure (on the `Client` or the `Caller`) is classified by *what the caller should do*, not by exception shape:

| `FailureMode` | Meaning | Retry? |
|---|---|---|
| `REJECTED` | The SMSC answered with a negative `command_status`. | Depends on the status (`0x58` throttling: yes, after backoff; invalid destination: no). |
| `TIMEOUT_DELIVERY_UNKNOWN` | No response within `transactionTimeout`. SMPP cannot distinguish "never received" from "received, response lost". | Only if `possiblySubmitted` is `false`, or duplicates are acceptable. |
| `LINK_DOWN` | The link died in flight, or was already down/rebinding. | Yes, once the link (or a `Listener`'s rebind) recovers. |
| `LINK_ABANDONED` | The link is down and rebinding is disabled or exhausted. | No — only a new `Client`/`Listener` recovers. |
| `INVALID_REQUEST` | Local validation or lifecycle rejected the request before anything reached the wire. | Only after fixing the request/config. |
| `PROTOCOL_ERROR` | An unclassified jsmpp failure (malformed response, unexpected internal error). | Treat like `TIMEOUT_DELIVERY_UNKNOWN`. |

### 6.2 `ErrorDetail`

```ballerina
public type ErrorDetail record {
    FailureMode failureMode?;
    int commandStatus?;
    boolean possiblySubmitted?;
};

public type Error distinct error<ErrorDetail>;
```

`ErrorDetail` is deliberately open, so new fields can be added without a breaking change. `possiblySubmitted` is populated on every submit-family failure and is the single bit to branch retry logic on: `false` means a retry cannot duplicate the message (it either provably never left the connector, or the SMSC definitively refused it); `true` means the SMSC may already have accepted it, so a retry may deliver a duplicate.

## 7. Character encoding

Outbound text (`TextSms.encoding`) supports `ASCII` (`data_coding 0x01`), `LATIN1` (`0x03`, the default), and `UCS2` (`0x08`, UTF-16BE). Packed GSM 03.38 7-bit encoding is deliberately not offered for sending — use a `BinarySms` with `dataCoding: 0` for a raw `data_coding 0x00` payload (plain-ASCII text under `0x00` is byte-identical to what a GSM-7 encoder would produce).

Inbound decoding (`Sms.shortMessage`) handles the same three schemes precisely and falls back to UTF-8 otherwise; `ListenerConfig.decodeGsm7` opts into decoding unpacked (not packed) GSM 03.38 for `data_coding 0x00` instead of the UTF-8 fallback.

## 8. Protocol conformance and known limitations

This library conforms to **SMPP v3.4** (Issue 1.2) for the ESME role — `bind_transmitter`/`bind_receiver`/`bind_transceiver` (`interface_version 0x34`), `submit_sm`/`submit_multi`/`data_sm`/`query_sm`/`cancel_sm`/`replace_sm` with their responses, `deliver_sm`/`data_sm` inbound with responses, `enquire_link` keepalive, and `unbind`.

Deliberate, documented limitations (raw protocol fields are surfaced so an application can handle most of these itself where needed):

- **No concatenation/multipart reassembly** in either direction. A single PDU's payload is capped at 254 octets outbound; inbound long messages arrive as separate PDUs with `properties.udhi` exposed for an application to reassemble.
- **No packed GSM 7-bit** encoding or decoding — only unpacked GSM 03.38 decoding (`decodeGsm7`) and the three `Encoding` schemes for sending.
- **No outbound `message_payload` TLV** — the 254-octet `short_message` field is the only outbound carrier. Inbound `message_payload` is read.
- **UDH is not validated.** `BinarySms.udhi` sets the wire bit only; the payload's actual UDH structure is the caller's responsibility.
- **A submit already awaiting its response is not woken by a stop or a dropped link** — it completes only at `transactionTimeout`, since the underlying library has no fail-pending-on-close.
- **No rate limiting or metrics.** Carrier throttling policy is the application's to respect; counting throttles, timeouts, and rebinds is the application's job (all such events are logged via `ballerina/log`).
- **`FailureMode`, `Encoding`, `DeliveryReceiptRequest`, `TypeOfNumber`, and `NumberingPlanIndicator` are closed enums** — members cannot be added within a major version without risking an exhaustive `match` becoming non-exhaustive. `ErrorDetail` is deliberately open, so new detail fields are always additive.

The underlying `jsmpp` version is pinned and bundled; this library depends on a number of its internal behaviours.
