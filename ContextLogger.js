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

        // I'm not super clear what the difference is between the executionId and triggerId. They are both some correlation
        // to the parent call and thus to the call stack that the call belongs to. The executionId seems to correlate
        // the user code function that is awaiting the event loop, while the triggerId seems to relate to anything that initiated 
        // the action. Possibly outside of the user code. For example, when using promise/async magic the triggerId seems to 
        // reference unknown calls. I'm guessing this has to do with the way async functions are internally broken up by the 
        // runtime. In any case, using the executionId produces better results for this use case.
        let contextId = asyncHooks.executionAsyncId();
        
        // This is tricksy, but we need to break the references between objects.
        const clone = JSON.parse(JSON.stringify(allContexts[contextId]));

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
