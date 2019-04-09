class RootLogger {
    beginScope(callback) {
        if (callback) {
            callback(new ChildLogger({}));
        }
    }
}

class ChildLogger {
    constructor (scope) {
        this._scope = scope;
    }

    setProperty (name, value) {
        if (name) {
            this._scope[name] = value;
        }
    }

    logInfo () {
        let serialized = "";

        for (let name in this._scope) {
            if (this._scope.hasOwnProperty(name)) {
                if (serialized.length > 0) {
                    serialized += "; ";
                }

                serialized += name;
                serialized += " = ";
                serialized += this._scope[name];
            }
        }

        const args = Array.prototype.slice.call(arguments);
        args.push(`(${serialized})`);
        console.log.apply(console, args);
    }

    async beginScope(callback) {
        if (callback) {
            const clone = JSON.parse(JSON.stringify(this._scope));
            await callback(new ChildLogger(clone));
        }
    }
}

module.exports = RootLogger;
