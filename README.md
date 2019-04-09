**Problem Definition**

This is an example of a logger that:

1. Is a singleton.
1. Isolates each call stack so that it is affiliated with its own log context.
1. Transparently includes the log context each time a message is logged.
1. Can mutate the log context at any time and transparently pass those mutations to subsequent calls.
1. Never requires business logic to handle the log context directly as a method parameter.

The solution involves using the node.js hooks API.

**Expected Output**

Note that the exact order of the logs will likely vary each time it is run.

```console
root log (logger context = {"requestId":"???"})
beginning (logger context = {"requestId":"A"})
middle (logger context = {"requestId":"A"})
end (logger context = {"requestId":"A"})
begin (logger context = {"requestId":"B"})
database call 1 (logger context = {"requestId":"B","transactionId":"tx-1"})
database call 2 (logger context = {"requestId":"B","transactionId":"tx-1"})
end (logger context = {"requestId":"B","transactionId":"tx-1"})
promise beginning (logger context = {"requestId":"C","key":"value-1"})
promise middle (logger context = {"requestId":"C","key":"value-2"})
promise end (logger context = {"requestId":"C","key":"value-1"})
```
