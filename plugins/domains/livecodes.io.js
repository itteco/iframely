export default {
  re: /^https?:\/\/(?:[a-z0-9-]+\.)?livecodes\.io\/(?:index\.html)?(?:\?[^#]*)?(?:#.*)?$/i,

  mixins: [
    "oembed-title",
    "oembed-site",
    "oembed-thumbnail",
    "oembed-iframe",
    "domain-icon",
  ],

  getLink: function (oembed, iframe, options) {
    const params = Object.assign({}, iframe.query);

    const height = options.getRequestOptions(
      "livecodes.height",
      oembed.height || 400,
    );

    const theme = options.getRequestOptions(
      "players.theme",
      params.theme || "auto",
    );

    if (theme === "auto") {
      delete params.theme;
    } else {
      params.theme = theme;
    }

    const click_to_load = options.getRequestOptions(
      "livecodes.click_to_load",
      params.loading === "click",
    );

    if (click_to_load) {
      params.loading = "click";
    } else {
      delete params.loading;
    }

    const href = iframe.assignQuerystring(params);

    return {
      href,
      type: CONFIG.T.text_html,
      rel: [CONFIG.R.app, CONFIG.R.oembed],
      height,
      options: {
        height: {
          label: CONFIG.L.height,
          value: height,
          placeholder: "ex.: 400, in px",
        },
        click_to_load: {
          label: "Use click-to-load",
          value: click_to_load,
        },
        theme: {
          label: CONFIG.L.theme,
          value: theme,
          values: {
            light: CONFIG.L.light,
            dark: CONFIG.L.dark,
            auto: CONFIG.L.default,
          },
        },
      },
    };
  },

  tests: [
    "https://livecodes.io/?template=react",
    "https://livecodes.io/?x=id/nvpsgtwr6em",
    "https://livecodes.io/?js=console.log(%27Hello,%20LiveCodes!%27)&console=open",
    "https://v49.livecodes.io/?template=vue",
  ],
};
