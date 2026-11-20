import http from 'node:http';
import { assert } from 'chai';

import CONFIG from '../config.loader.js';
global.CONFIG = CONFIG;

import { fetchStream, fetchData } from '../lib/fetch.js';
import { matchesUrlRegexps } from '../lib/utils.js';

describe('SSRF guard', function() {

    let server, port;
    const hits = [];

    before(function(done) {
        server = http.createServer((req, res) => {
            hits.push(req.url);
            if (req.url.startsWith('/redirect-private')) {
                res.writeHead(302, { location: `http://127.0.0.1:${port}/private` });
                return res.end();
            }
            if (req.url.startsWith('/redirect-allowed')) {
                res.writeHead(301, { location: `/ok` });
                return res.end();
            }
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end('{"ok":true}');
        }).listen(0, () => {
            port = server.address().port;
            // `localhost` plays a trusted "public" host: it's exempt from the guard as the prerender host.
            CONFIG.PRERENDER_URL = `http://localhost:${port}/render?url=`;
            done();
        });
    });

    after(function() {
        server.close();
    });

    beforeEach(function() {
        hits.length = 0;
    });

    const fetchOptions = (uri, extra) => ({ uri, timeout: 5000, ...extra });

    async function assertBlocked(promise) {
        try {
            await promise;
        } catch (error) {
            assert.equal(error.code, 'DNS_NO_PUBLIC_ADDRESS_AVAILABLE', `unexpected error: ${error.message || error}`);
            return;
        }
        assert.fail('request was not blocked');
    }

    const privateUrls = () => [
        `http://127.0.0.1:${port}/a`,
        `http://user:pass@127.0.0.1:${port}/b`,
        `http://user@127.0.0.1:${port}/c`,
        `http://a@b@127.0.0.1:${port}/d`,
        `http://127.1:${port}/e`,
        `http://0x7f000001:${port}/f`,
        `http://2130706433:${port}/g`,
        `http://127.0.0.1.:${port}/h`,
        `http://[::1]:${port}/i`,
        `http://[::ffff:127.0.0.1]:${port}/j`,
        `http://u@[::ffff:7f00:1]:${port}/k`,
    ];

    it('blocks IP-literal private hosts in fetchStream', async function() {
        for (const uri of privateUrls()) {
            await assertBlocked(fetchStream(fetchOptions(uri)));
        }
        assert.deepEqual(hits, []);
    });

    it('blocks IP-literal private hosts in fetchData', async function() {
        for (const uri of privateUrls()) {
            await assertBlocked(fetchData(fetchOptions(uri)));
        }
        assert.deepEqual(hits, []);
    });

    it('blocks redirects to private IPs in fetchStream', async function() {
        await assertBlocked(fetchStream(fetchOptions(`http://localhost:${port}/redirect-private`)));
        assert.deepEqual(hits, ['/redirect-private']);
    });

    it('blocks redirects to private IPs in fetchData', async function() {
        await assertBlocked(fetchData(fetchOptions(`http://localhost:${port}/redirect-private`)));
        assert.deepEqual(hits, ['/redirect-private']);
    });

    it('follows allowed redirects and reports final url', async function() {
        const stream = await fetchStream(fetchOptions(`http://localhost:${port}/redirect-allowed`));
        stream.resume();
        assert.equal(stream.status, 200);
        assert.equal(stream.url, `http://localhost:${port}/ok`);
        assert.deepEqual(hits, ['/redirect-allowed', '/ok']);
    });

    it('returns redirect as is in manual mode', async function() {
        const stream = await fetchStream(fetchOptions(`http://localhost:${port}/redirect-private`, { redirect: 'manual', follow: 0 }));
        stream.resume();
        assert.equal(stream.status, 302);
        assert.deepEqual(hits, ['/redirect-private']);
    });

    it('respects `follow` limit', async function() {
        try {
            await fetchStream(fetchOptions(`http://localhost:${port}/redirect-allowed`, { redirect: 'follow', follow: 0 }));
            assert.fail('expected max-redirect');
        } catch (error) {
            assert.equal(error.type, 'max-redirect');
        }
    });
});

describe('Ignore list matching', function() {

    // Same patterns as default `IGNORE_DOMAINS_RE` in config.js (test config overrides it).
    const IGNORE_RE = [
        /^https?:\/\/localhost/i,
        /^https?:\/\/\d+(?:\.\d+){0,3}(?::\d+)?(?:[/?#]|$)/i,
        /^https?:\/\/0x[0-9a-f]+(?:\.(?:0x[0-9a-f]+|\d+)){0,3}(?::\d+)?(?:[/?#]|$)/i,
        /^https?:\/\/\[/i,
    ];

    it('matches private IPs regardless of userinfo or IP notation', function() {
        for (const url of [
            'http://127.0.0.1/',
            'http://user:pass@127.0.0.1/',
            'http://a@b@10.0.0.1/',
            'http://user@127.1/',
            'http://user@0x7f000001/',
            'http://user@[::1]/',
            'http://localhost/',
            'http://user@localhost:8080/',
        ]) {
            assert.isTrue(matchesUrlRegexps(url, IGNORE_RE), url);
        }
    });

    it('does not match regular domains', function() {
        for (const url of [
            'https://example.com/',
            'https://user@example.com/path',
            'https://127example.com/',
        ]) {
            assert.isFalse(matchesUrlRegexps(url, IGNORE_RE), url);
        }
    });
});
