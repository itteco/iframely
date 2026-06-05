export class HtmlHandler {

    constructor() {
        this.text = '';
        this._onEndCallbacks = [];
        this._ended = false;
    }

    onData(chunk) {
        // TODO: decode?
        this.text += chunk;
    }

    onEnd(callback) {
        if (typeof callback === 'function') {
            if (this._ended) {
                callback(this.text);
            } else {
                this._onEndCallbacks.push(callback);
            }
        }
    }

    end() {
        this._ended = true;
        for (const cb of this._onEndCallbacks) {
            cb(this.text);
        }
        this._onEndCallbacks = [];
    }

    attach(resp) {
        resp.on('data', chunk => this.onData(chunk));
        resp.on('end', () => this.end());
        return this;
    }
}

export const notPlugin = true;
