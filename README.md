**Problem Definition**

Is it possible to create a logger with the following constraints:

1. The logger object is a singleton.
1. Every call to the logger automatically includes a log context.
1. The log context is isolated such that each call stack has it's own independent context.
1. The log context can be mutated during the call stacks execution.
1. The log context (or an object wrapping the log context) is never passed directly as method parameter. It is completely ambient for a given call stack.

The solution involves using the node.js hooks API and taking advantage of the fact that all user code in node.js joins back into a single thread.

Expected Output

```console
begin (logger context = {"asyncId":4,"triggerAsyncId":1,"requestId":"A"})
begin (logger context = {"asyncId":6,"triggerAsyncId":1,"requestId":"B"})
begin (logger context = {"asyncId":7,"triggerAsyncId":1,"requestId":"C"})
end (logger context = {"asyncId":9,"triggerAsyncId":4,"requestId":"A"})
end (logger context = {"asyncId":11,"triggerAsyncId":6,"requestId":"B"})
database call 1 (logger context = {"asyncId":13,"triggerAsyncId":7,"requestId":"C"})
database call 2 (logger context = {"asyncId":17,"triggerAsyncId":13,"requestId":"C"})
end (logger context = {"asyncId":19,"triggerAsyncId":17,"requestId":"C"})
```
