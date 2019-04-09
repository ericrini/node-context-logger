class Logger {
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

    beginScopeSync(action) {
        if (action) {
            const clone = JSON.parse(JSON.stringify(this._scope));
            return action(new Logger(clone));
        }
    }

    async beginScope(action) {
        return await this.beginScopeSync(action);
    }
}

module.exports = new Logger({});
