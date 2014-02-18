/*
* Based on htmlparser2.CollectingHandler.
*
* Can send parsing events to multiple targets.
*
* */

function CollectingHandlerForMutliTarget(cbsArray){
    this._cbsArray = cbsArray || [];
    this.events = [];
}

var EVENTS = require("htmlparser2").EVENTS;

Object.keys(EVENTS).forEach(function(name) {

    if (EVENTS[name] === 0) {

        name = "on" + name;
        CollectingHandlerForMutliTarget.prototype[name] = function() {
            this.emitCb([name]);
        };

    } else if (EVENTS[name] === 1) {

        name = "on" + name;
        CollectingHandlerForMutliTarget.prototype[name] = function(a) {
            this.emitCb([name, a]);
        };

    } else if (EVENTS[name] === 2) {

        name = "on" + name;
        CollectingHandlerForMutliTarget.prototype[name] = function(a, b) {
            this.emitCb([name, a, b]);
        };

    } else {
        throw Error("wrong number of arguments");
    }
});

CollectingHandlerForMutliTarget.prototype.addHandler = function(cbs) {
    this._cbsArray.push(cbs);
    this._emitEventsFor(cbs);
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

        if (cbs[event[0]]) {

            var num = event.length;

            if (num === 1) {
                cbs[event[0]]();

            } else if (num === 2) {
                cbs[event[0]](event[1]);

            } else {
                cbs[event[0]](event[1], event[2]);
            }
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

module.exports = CollectingHandlerForMutliTarget;

module.exports.notPlugin = true;