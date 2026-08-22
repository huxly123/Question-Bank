# Networking

## 1. How the web works

When a user enters a URL, the browser first performs a DNS lookup to convert the domain name into an IP address. It then establishes a TCP connection with the server and performs a TLS handshake if HTTPS is used. The browser sends an HTTP request; the server processes it and returns an HTTP response containing HTML, CSS, or JavaScript. The browser parses these resources, builds the DOM and CSSOM, creates the render tree, performs layout and paint, and finally displays the webpage.

```text
URL entered
    ↓
DNS lookup
    ↓
TCP + TLS connection
    ↓
HTTP request
    ↓
Server processing
    ↓
HTTP response
    ↓
Browser rendering
```

## 2. REST APIs

REST APIs are a way for clients and servers to communicate over HTTP. In REST, everything is treated as a resource identified by a URL. Clients operate on these resources using standard HTTP methods like GET, POST, PUT, and DELETE. REST APIs are stateless — each request contains all the information required to process it. Responses are usually returned as JSON.

## 3. GraphQL

GraphQL is a query language for APIs that lets clients request exactly the data they need. Unlike REST APIs, which expose multiple endpoints, GraphQL uses a single endpoint where clients send queries specifying the required fields. This avoids over-fetching and under-fetching. GraphQL APIs define a schema and use resolvers to fetch data from databases or services.

## 4. REST vs GraphQL

Both are API communication styles. REST uses multiple endpoints with fixed response structures; GraphQL uses a single endpoint where the client specifies exactly which data it needs. REST is simpler and works well with HTTP caching, while GraphQL offers more flexibility and avoids over- and under-fetching — at the cost of added backend complexity and the need for additional caching strategies.

## 5. gRPC

gRPC is a high-performance RPC framework developed by Google. It lets clients call methods on remote servers as if they were local functions. gRPC uses HTTP/2 for transport and Protocol Buffers for efficient binary serialization, making it faster than traditional REST APIs. It also supports streaming and is widely used for communication between microservices in distributed systems.

## 6. CDN (Content Delivery Network)

A CDN stores cached copies of static content on servers located around the world. Instead of requesting files from the origin server, the browser gets them from the nearest CDN server.

## 7. Load balancer

A load balancer distributes incoming traffic across multiple servers, instead of all users hitting one server.

**Why it is needed:** if one server receives too many requests, it can crash. A load balancer prevents this by spreading the traffic.

## 8. API Gateway

An API Gateway is a centralized entry point for all client requests in a microservices architecture. Instead of the client calling multiple backend services directly, it sends requests to the gateway, which routes them to the appropriate service. The gateway also handles cross-cutting concerns like authentication, rate limiting, request aggregation, and logging — simplifying client communication and improving security and scalability.
