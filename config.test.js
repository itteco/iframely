export default {
    DEBUG: true,
    RICH_LOG_ENABLED: true,

    baseAppUrl: "https://localhost",
    port: 8080,

    RESPONSE_TIMEOUT: 1 * 100, //ms

    IGNORE_DOMAINS_RE: /blacklisted.*/,

    // Mocked target servers in e2e tests run on localhost.
    SSRF_ALLOWED_HOSTS: ['localhost']
};