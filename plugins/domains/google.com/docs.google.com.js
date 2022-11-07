import { decodeHTML5 } from 'entities';

export default {

    provides: "schemaFileObject",

    re: [
        /^https:\/\/(?:docs|drive)\.google\.com\/(?:a\/[a-zA-Z0-9\-\_\.]+\/)?(forms|document|presentation|spreadsheets|file|drawings)\/(?:u\/\d\/)?d(?:\/e)?\/([a-zA-Z0-9_-]+)/i
    ],

    mixins: [
        "favicon",
        "og-title",
        "og-image",
        "og-description"
    ],

    getMeta: function (schemaFileObject) {

        return {
            title: schemaFileObject.name,
            site: "Google Docs"

            // Mute canonical to bypass the validation and allow player.href=canonical
            // Especially for video files and presentations:

            // canonical: schemaFileObject.url
        };

    },

    getLink: function(url, urlMatch, schemaFileObject) {

        if (schemaFileObject.embedURL || schemaFileObject.embedUrl) {

            var file = {
                rel: [CONFIG.R.file],
                href: schemaFileObject.embedURL || schemaFileObject.embedUrl,
                accept: CONFIG.T.text_html
            };

            if (schemaFileObject.playerType) {

                // HEADS UP:
                // There is a problem with player as embedURL: x-frame-options is SAMEORIGIN
                file.href = "https://drive.google.com/file/d/" + urlMatch[2] + "/preview";
                file.rel.push(CONFIG.R.player, 'accelerometer', 'picture-in-picture', 'gyroscope'); // allow attributes are copied from YouTube.
                // use default aspect

            } else if (urlMatch[1] === "forms" && schemaFileObject.height) {
                file.height = schemaFileObject.height && (schemaFileObject.height + 65 + 48);

                if (file.height > 1500) {
                    file.message = "If there's an extra vertical space, it is used up on next step (after \"Next\" is clicked in the form).";
                }

                // "App" to prevent Google Forms be presented as Player through Twitter-player mixin as Player prevails on Readers
                file.rel.push (CONFIG.R.app);
                // Make forms resizeable
                file.rel.push (CONFIG.R.resizable);

            } else if (urlMatch[1] === "forms" || urlMatch[1] === "document" || urlMatch[1] === "file") {
                file["aspect-ratio"] = CONFIG.DOC_ASPECT_RATIO;
                // "App" to prevent Google Forms be presented as Player through Twitter-player mixin as Player prevails on Readers
                file.rel.push (urlMatch[1] === "forms" ? CONFIG.R.app : CONFIG.R.reader);

            /// } else if (urlMatch[1] === "file" && schemaFileObject.playerType) {

            } else if (urlMatch[1] === "spreadsheets" ) {
                file["aspect-ratio"] = 1 / CONFIG.DOC_ASPECT_RATIO;
                file.rel.push (CONFIG.R.reader);

            } else if (urlMatch[1] === "drawings" ) {
                file["aspect-ratio"] = 4/3; // default aspect. Google resizes the embed to fit
                file.rel.push (CONFIG.R.image);

            } else { // presentation
                // file["aspect-ratio"] = 4/3; // use default aspect ratio
                file.rel.push (CONFIG.R.player);
                file.rel.push (CONFIG.R.slideshow);
                file['aspect-ratio'] = 16/9;
                file['padding-bottom'] = 30;

                if (/\/preview(?:\?.+)$/.test(file.href)) {
                    file.href = file.href.replace(/\/preview(?:\?.+)$/, '/embed');
                }
            }

            return file;

        } else if (!/^https?:\/\/drive/.test(schemaFileObject.url)){
            return {
                message: 'Google has no preview available for this document.'
            }
        }
    },

    getData: function(meta, url, urlMatch, cheerio, decode, options, cb) {

        var embedded_url = (url + (/\?/.test(url) ? '&' : '?') + 'embedded=true').replace(/\/edit/, '/viewform');
        
        if (urlMatch[1] === "forms" && /\/closedform(?:\?.*)?$/.test(url)) {
            return cb ({
                responseStatusCode: 410,
                message: `This Google form is no longer accepting responses.`
            });
        } else if (urlMatch[1] === "forms" && !/&embedded=true/i.test(url) && meta.og && !meta.og.embed && (!options.redirectsHistory || options.redirectsHistory.indexOf(embedded_url) == -1)) {
            return cb ({
                redirect: embedded_url
            })
        }

        var $scope = cheerio('[itemscope]');

        if ($scope.length) {

            var $aScope = cheerio($scope);

            var result = {};

            $aScope.find('[itemprop]').each(function() {
                var $el = cheerio(this);

                var scope = $el.attr('itemscope');
                if (typeof scope !== 'undefined') {
                    return;
                }

                var key = $el.attr('itemprop');
                if (key) {
                    var value = decodeHTML5(decode($el.attr('content') || $el.attr('href')));
                    result[key] = value;
                }
            });

            if (meta.og && meta.og.embed && meta.og.embed.height) {
                result.height = meta.og.embed.height;
                result.width = meta.og.embed.width;
            }

            return cb(null, {
                schemaFileObject: result
            });
        } else if (/\/(pub|pubhtml|viewform|mobilebasic|htmlview)(\?[^\?\/]+)?(?:#.*)?$/i.test(url)) {
            return cb(null, {
                schemaFileObject: {
                    embedUrl: url
                }  
            });
        } else if (/\/pubchart(\?[^\?\/]+)?(?:#.*)?$/i.test(url)) {
            return cb({
                responseStatusCode: 415,
                message: 'Google speadsheet charts are fixed-size and cannot be supported. Try linking yours as an image.'
            })            
        } else if (!meta.og) {
            return cb({
                responseStatusCode: 415,
                message: 'Google Docs could not load the file. Perhaps it is too large.'
            })
        } else {
            return cb(null, null);
        }
    },

    tests: [
        "https://docs.google.com/document/d/17jg1RRL3RI969cLwbKBIcoGDsPwqaEdBxafGNYGwiY4/preview?sle=true",
        "https://docs.google.com/document/d/1KHLQiZkTFvMvBHmYgntEQtNxXswOQISjkbpnRO3jLrk/edit",
        "https://drive.google.com/file/d/0BwGT3x6igRtkTWNtLWlhV3paZjA/view",
        "https://docs.google.com/spreadsheets/d/10JLM1UniyGNuLaYTfs2fnki-U1iYFsQl4XNHPZTYunw/edit?pli=1#gid=0",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRKtFs55r6ow0rVvoGJLlDyqxD_455wR6_eZ42z8izYGT_UM6hNW0ruFhn26m_SzsoT4AQxZZA968Lp/pubhtml?gid=1443541234&single=true&widget=true&headers=false",
        "https://docs.google.com/spreadsheets/u/1/d/1_tsspyfiH8ZVAOmoCbGJ3gvzGU5zLUb-PEG0-RyjP5E/edit#gid=1926296709",
        "https://docs.google.com/document/d/e/2PACX-1vSeGAfeYcpPAGLX4h0krdMR8HBuCxf3M0H0MlyeQ9GYQzJsJ2KTfZ_iSopp5dUwX3JVOfCpAoEyoXdh/pub",
        "https://drive.google.com/open?id=1rKcaLuY0WzhPqQFCGy_4aIJblnEziy7-",
        "https://docs.google.com/presentation/d/e/2PACX-1vQmrymNWFltfprLl9IX-irRcmvjsL1ahOKAt8YTzuWTdcWyIH2EX6wyUmmJ4ftG3dICaTZ9DCpqXiht/pub?start=false&loop=false&delayms=3000",
        {
            skipMixins: [
                "og-image", "og-title", "og-description"
            ],
            skipMethods: [
                "getLink",
                "getMeta",
                "getData"
            ]
        }

    ]

};
