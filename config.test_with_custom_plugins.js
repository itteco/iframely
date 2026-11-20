import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {

    CUSTOM_PLUGINS_PATH: __dirname + '/test/fixtures/custom-plugins',

    DEBUG: true,
    RICH_LOG_ENABLED: true,
    DISABLE_SERVE_STATIC: true,

    baseAppUrl: "https://localhost",
    port: 8080,

    RESPONSE_TIMEOUT: 1 * 100, //ms

    IGNORE_DOMAINS_RE: /blacklisted.*/,

    // Mocked target servers in e2e tests run on localhost.
    SSRF_ALLOWED_HOSTS: ['localhost']
  };