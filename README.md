# Iframely URL engine for previews and embeds

This is the engine behind the [Iframely](https://iframely.com) service. Give it a URL and it returns the metadata: title, description, thumbnails, author, canonical URL. If allowed, and if the provider supports it, you also get embed HTML for videos, posts, maps, slideshows, etc.

This engine has powered Iframely in production since 2013. Use it if you’d like to self-host rather than rely on the cloud version.

## How it works

Iframely uses two kinds of parsers.

Custom domain plugins handle specific providers, from YouTube to Google Maps. You'll find them in the `/plugins/domains` folder.

Generic parsers read standard markup like oEmbed, Open Graph, Twitter Cards and JSON-LD.

Domain plugins work for the providers they cover. For everything else, the generic parsers only return rich media embeds for providers on the allowlist. We maintain that list for both the open-source and cloud versions, and it's synced to your instance by default. If you'd rather curate your own, you can swap in [your own allowlist](https://iframely.com/docs/whitelist-format).

Any other URL still returns metadata and thumbnails, if available.

Some additional plugins are private and only used in the cloud. You can write your own for your instance.

## API

There are two endpoints. Both take `url` and return JSON:

- `{your.server}/iframely?url=` returns the [Iframely format](https://iframely.com/docs/iframely-api). It looks like the `<head>` of a page: `meta` for data, `links` for media.
- `{your.server}/oembed?url=` returns a simplified [oEmbed](https://iframely.com/docs/oembed-api) version of the same data. It's an adapter, so the engine does the same work for both endpoints.

There's also a visual debugger at `{your.server}/debug`.

Sample responses from the cloud API: [Iframely format](https://iframe.ly/ACcM3Y.json) and [the same URL as oEmbed](https://iframe.ly/ACcM3Y.oembed).

## Getting started

You'll need Node.js 20.19.3 or later.

Start with the [install and configuration guide](https://iframely.com/docs/host). Then see [link rels and types](https://iframely.com/docs/links) and [meta semantics](https://iframely.com/docs/meta) for what comes back.

Coming from a version before 2.0.0? Here are the [migration steps](https://github.com/itteco/iframely/issues/350).

## Open source vs. cloud

The Iframely cloud Preview APIs run on the same parsers and the same allowlist, so responses match apart from minor differences. If you keep the default allowlist, coverage is almost the same, apart from the private plugins.

The cloud also adds:

- Hosted iframe rendering in the `html` field: preview cards, GIF support, player events, AMP and more.
- [Per-URL options](https://iframely.com/docs/options), predictive sizing to reduce layout shift, lazy-loading and media allowlists by type.
- The [Data API](https://iframely.com/docs/data-api), for apps that process URLs automatically (assistants, search, AI). It builds on the preview data and adds entities, excerpts and full text where the provider allows it.

## Contributing

Issues and pull requests are welcome. Please open PRs against `develop`. Everything lands there before it goes to `master`. Contributions are under the same MIT license. Questions: support@iframely.com.

## License

MIT License. © 2012–2026 Itteco Software Corp. [Nazar Leush](https://github.com/nleush), [Ivan Paramonau](https://github.com/iparamonau) and the [contributors](https://github.com/itteco/iframely/graphs/contributors).