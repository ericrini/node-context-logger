const asyncHooks = require('async_hooks');

// Initialize a context for the main call stack (which is always asyncId = 1).
const allContexts = {
    1: {}
};

// Set the context for the main call stack active, since the application will always start in the main call stack.
let activeContext = allContexts[1];

// Create an async hook.
const hook = asyncHooks.createHook({

    // When a new call stack is created, initialize its context to a clone of the context from its parent's call stack.
    init: (asyncId, type, triggerAsyncId, resource) => {

        // This is tricksy, but we need to break the references between objects.
        const clone = JSON.parse(JSON.stringify(allContexts[asyncHooks.executionAsyncId()]));

        // This is purely for demo/debug purposes.
        // clone.asyncId = asyncId;
        // clone.triggerAsyncId = triggerAsyncId;
        // clone.executionAsyncId = asyncHooks.executionAsyncId();

        allContexts[asyncId] = clone;
    },

    // Each time a call stack joins the user thread, set its context active.
    before: (asyncId) => {
        activeContext = allContexts[asyncId];
    },

    // Each time a call stack completes, free the memory its context was using.
    destroy: (asyncId) => {
        delete allContexts[asyncId];
    }
});

hook.enable();

// This is pretty self explanatory?
class ContextLogger
{
    set (key, value) {
        activeContext[key] = value;
    }

    log () {
        const args = Array.prototype.slice.call(arguments);
        args.push(`(logger context = ${JSON.stringify(activeContext)})`);
        console.log.apply(console.log, args);
    }
}

module.exports = ContextLogger;
