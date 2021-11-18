/*
* Based on htmlparser2.CollectingHandler.
*
* Can send parsing events to multiple targets.
*
* */

export function CollectingHandlerForMutliTarget(cbsArray){
    this._cbsArray = cbsArray || [];
    this.events = [];
}

// Got from `export interface Handler {` (Parser.d.ts).
const EVENTS = [
    'onparserinit',
    'onreset',
    'onend',
    'onerror',
    'onclosetag',
    'onopentagname',
    'onattribute',
    'onopentag',
    'ontext',
    'oncomment',
    'oncdatastart',
    'oncdataend',
    'oncommentend',
    'onprocessinginstruction',
];

EVENTS.forEach(function(name) {
    CollectingHandlerForMutliTarget.prototype[name] = function() {
        let args = [name, ...arguments];
        this.emitCb(args);
    };
});

CollectingHandlerForMutliTarget.prototype.addHandler = function(cbs) {
    this._cbsArray.push(cbs);
    this._emitEventsFor(cbs);

    if (this._cbsArray.length === 1) {
        // Got first handler, resume stream.
        this.onFirstHandler();
    }
};

CollectingHandlerForMutliTarget.prototype.removeHandler = function(cbs) {
    var that = this;
    // Remove in next tick in case if event fired in handlers 'for' cycle to prevent index conflict.
    process.nextTick(function() {
        var idx = that._cbsArray.indexOf(cbs);
        if (idx > -1) {
            that._cbsArray.splice(idx, 1);
            if (that._cbsArray.length === 0) {
                // No handlers, pause stream.
                that.onNoHandlers();
            }
        }
    });
};

CollectingHandlerForMutliTarget.prototype.emitCb = function(event) {
    this.events.push(event);
    this.callCb(event);
};

CollectingHandlerForMutliTarget.prototype._onreset = function(cbs) {

    if (cbs) {

        if (cbs.onreset) {
            cbs.onreset();
        }

    } else {

        for(var i = 0, len = this._cbsArray.length; i < len; i++) {

            var cbs = this._cbsArray[i];

            if (cbs.onreset) {
                cbs.onreset();
            }
        }
    }
};

CollectingHandlerForMutliTarget.prototype.callCb = function(event, cbs) {

    function cb(cbs) {
        const name = event[0];
        if (cbs[name]) {
            cbs[name].apply(cbs, event.slice(1));
        }
    }

    if (cbs) {

        cb(cbs);

    } else {

        for (var i = 0, len = this._cbsArray.length; i < len; i++) {
            cb(this._cbsArray[i]);
        }
    }

};

CollectingHandlerForMutliTarget.prototype.onreset = function() {
    this.events = [];
    this._onreset();
};

CollectingHandlerForMutliTarget.prototype.restartFor = function(cbs) {
    this._onreset(cbs);
    this._emitEventsFor(cbs);
};

CollectingHandlerForMutliTarget.prototype._emitEventsFor = function(cbs) {

    for(var i = 0, len = this.events.length; i < len; i++){

        var event = this.events[i];

        this.callCb(event, cbs);
    }
};

export const notPlugin = true;