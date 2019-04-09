**Problem Definition**

This is an example of a logger that:

1. Is a singleton.
1. Isolates each call stack so that it is affiliated with a logging context.
1. Transparently includes the log context each time a message is logged.
1. Never requires business logic to handle the log context directly as a method parameter.

The solution involves using the node.js hooks API.

**Expected Output**

```console
root log (logger context = {"requestId":"???"})
begin (logger context = {"requestId":"A"})
end (logger context = {"requestId":"A"})
begin (logger context = {"requestId":"B"})
database call 1 (logger context = {"requestId":"B","transactionId":"tx-1"})
database call 2 (logger context = {"requestId":"B","transactionId":"tx-1"})
end (logger context = {"requestId":"B","transactionId":"tx-1"})
promise beginning (logger context = {"requestId":"C","key":"value-1"})
promise middle (logger context = {"requestId":"C","key":"value-2"})
promise end (logger context = {"requestId":"???"})
```
