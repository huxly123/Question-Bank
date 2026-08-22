# Communication Techniques

## 1. Short polling

The client repeatedly sends requests to the server at fixed intervals to check for new data.

## 2. Long polling

The client sends a request and the server keeps it open until new data is available. Instead of replying immediately, the server waits. When new data arrives, the server responds, and the client immediately sends another request.

## 3. Server-Sent Events (SSE)

SSE lets a server continuously push updates to the client over a single HTTP connection. The connection stays open and the server sends updates whenever needed.

**Important:** SSE is one-way communication (server → client).

## 4. WebSockets

WebSockets provide a persistent, two-way communication channel between client and server. Once the connection is established, both sides can send data at any time.

## 5. Webhooks

A webhook is a way for one system to automatically notify another system when an event happens. Instead of the client repeatedly asking the server "did something happen?", the server pushes the information immediately to a predefined URL — so the receiving system doesn't need to poll.

Webhooks are **not** a frontend technique, because they require a public API endpoint, and browsers cannot expose secure webhook endpoints.

**Example — payment flow:**

```text
User clicks Pay
        ↓
Frontend calls backend
        ↓
User completes payment
        ↓
Payment gateway sends a webhook
        ↓
Backend updates the DB
        ↓
Frontend detects the update
(polling / WebSocket / SSE)
        ↓
UI shows "Payment Success"
```
