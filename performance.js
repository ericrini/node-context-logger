const ContextLogger = require('./ContextLogger');
const logger = new ContextLogger();
const { performance, PerformanceObserver } = require('perf_hooks');

async function runOne(id, maximum) {
    let iteration = 0;
    logger.set("id", id);

    while (++iteration <= maximum) {
        logger.set("iteration", iteration);

        await Promise.resolve().then(async function () {
            await Promise.resolve().then(async function () {
                logger.log("callback");
            });
        });
    }
}

async function runMany(stacks, iterations) {
    const promises = [];

    for (let i = 0; i < stacks; i++) {
        promises.push(runOne(i, iterations));
    }

    await Promise.all(promises);
}

(async function () {
    const begin1 = performance.now();
    await runMany(20, 1000);
    const end1 = performance.now();

    logger.toggleScope(false);
    
    const begin2 = performance.now();
    await runMany(20, 1000);
    const end2 = performance.now();

    console.log("Hooks Enabled", end1 - begin1);
    console.log("Hooks Disabled", end2 - begin2);
})();
