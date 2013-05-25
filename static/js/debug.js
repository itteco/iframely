function linkify(text) {
    return text.replace(/((https?:)?\/\/[^" ]+)/gi, '<a target="_blank" href="$1">$1</a>');
}

// Render json in PRE.
$.fn.renderObject = function(o) {

    function trimString(v) {
        var MAX = 600;
        if (typeof v === "string" && v.length > MAX) {
            return v.substring(0, MAX) + '... (truncated)';
        } else {
            return v;
        }
    }

    function trimObjectValues(o) {
        for(var k in o) {
            var v = o[k];
            if (typeof v === 'object') {
                trimObjectValues(v);
            } else if (typeof v === "string") {
                o[k] = trimString(v);
            }
        }
    }

    function createTrimmedObject(o) {
        if (typeof o === "string") {
            return trimString(o);
        }
        var r = $.extend(true, {}, o);
        trimObjectValues(r);
        delete r.sourceId;
        return r;
    }

    var text = JSON.stringify(createTrimmedObject(o), null, 4);
    text = $('<div>').text(text).html();
    text = text.replace(/\\"/gi, '"');
    text = text.replace(/"((https?:)?\/\/[^" ]+)"/gi, '"<a target="_blank" href="$1">$1</a>"');
    text = text.replace(/\[contextLink](\w+)\[\/contextLink\]/gi, '<a href="#" data-context-link="$1">$1</a>');
    this.html(text);
    return this;
};

function findDebugInfo(options, data) {

    // Find debug data for specific link.

    var defaultContext = data.debug[0] && data.debug[0].context;
    defaultContext.request = true;
    defaultContext.$selector = true;

    var result = [];
    var onLevel;
    data.debug.forEach(function(level, levelIdx) {
        if (options.maxLevel <= levelIdx) {
            return;
        }
        level.data.forEach(function(methodData) {

            if (!methodData.data) {
                return;
            }

            var linkData = methodData.data;
            if (!(linkData instanceof Array)) {
                linkData = [linkData];
            }

            linkData.forEach(function(l) {

                var good = false;
                if (options.link) {
                    good = l.sourceId == options.link.sourceId;
                }

                if (options.findByData) {
                    good = _.intersection(_.keys(l), options.findByData).length > 0;
                }

                if (good) {

                    var r = {};
                    r.plugin = methodData.method.pluginId;
                    r.method = methodData.method.name;
                    if (methodData.method.parents) {
                        r["mixed-in"] = methodData.method.parents;
                    }
                    var params = data.plugins[methodData.method.pluginId].methods[methodData.method.name];
                    r.context = params.slice();
                    r.data = $.extend(true, {}, l);
                    r.time = methodData.time;
                    delete r.data.sourceId;

                    // Find parent.
                    var findSourceForRequirements = [];
                    params.forEach(function(param) {
                        if (!(param in defaultContext)) {
                            findSourceForRequirements.push(param);
                        }
                    })

                    if (findSourceForRequirements.length > 0) {
                        r.customContextSource = findDebugInfo({
                            maxLevel: levelIdx,
                            findByData: findSourceForRequirements
                        }, data);
                    }

                    for(var k in r.context) {
                        var c = r.context[k];
                        if (c in defaultContext && c != "cb") {
                            // Link to context.
                            r.context[k] = "[contextLink]" + c + "[/contextLink]";
                        }
                    }

                    result.push(r);
                }
            });
        });
    });

    return (result.length == 1 && result[0]) || result;
}

function storeHistoryState() {
    // Store current position.
    window.history.replaceState({
        position: $(window).scrollTop(),
        tab: $('li.active a').attr('href')
    }, null, document.location);
}

function pushHistoryState() {
    // Store current position.
    window.history.pushState({
        position: $(window).scrollTop(),
        tab: $('li.active a').attr('href')
    }, null, document.location);
}

function hlContext(context) {
    // Switch to context tab and highlight needed meta section.

    storeHistoryState();

    $('.s-context-tab').tab('show');
    $('pre[data-context]').css('border-width', '').css('border-color', '');
    var $pre = $('pre[data-context="' + context +'"]').css('border-width', '2px').css('border-color', 'black');

    var position = $pre.prev().position().top;

    $(window).scrollTop(position);

    // Add new history item.
    pushHistoryState();
}

function showEmbeds($embeds, data, filterByRel) {

    $embeds.html('');

    var plugins = [];

    var counter = 0;

    data.links.forEach(function(link) {

        if (filterByRel && link.rel.indexOf(filterByRel) == -1) {
            return;
        }

        // 2) Get html.
        var $el = $.iframely.generateLinkElement(link);
        if ($el) {
            if (filterByRel) {

                // Links preview.
                $embeds.append('<h4>Preview</h4>');
                var $well = $('<div>').addClass('well');
                // 3) Render element.
                $well.append($el);
                $embeds.append($well);

                // Links data (result).
                $embeds.append('<h4>Link</h4>');
                var $pre = $('<pre>').renderObject(link);
                $embeds.append($pre);

                // Embed code.
                if (!link.html) {
                    $embeds.append('<h4>Embed code</h4>');
                    var $code = $('<pre>').text($el.parent().html());
                    $embeds.append($code);
                }

            } else {

                var debug = findDebugInfo({link: link}, data);

                // Links head.
                plugins.push(debug.plugin + '-' + counter);
                $embeds.append('<h2 data-plugin="' + debug.plugin + '-' + counter + '">' + debug.plugin + '</h2>');
                counter += 1;

                // Links preview.
                $embeds.append('<h4>Preview</h4>');
                var $well = $('<div>').addClass('well');
                // 3) Render element.
                $well.append($el);
                $embeds.append($well);

                // Embed code.
                if (!link.html) {
                    $embeds.append('<h4>Embed code</h4>');
                    var $code = $('<pre>').text($el.parent().html());
                    $embeds.append($code);
                }

                // Links data (result).
                $embeds.append('<h4>Link</h4>');
                var $pre = $('<pre>').renderObject(link);
                $embeds.append($pre);

                // Link debug data with raw source.
                var $debug = $('<pre>').renderObject(debug);

                var $div = $('<div>').addClass("row-fluid")
                    .append($('<div>').addClass("span1"))
                    .append($('<div>').addClass("span11").append('<h4>Debug</h4>').append($debug));

                $embeds.append($div);
            }

            $embeds.append('<hr/>');
        }
    });

    // Render plugins list (links table of contents).
    if (!filterByRel && plugins.length > 0) {

        var $prePlugins = $("<div>").addClass('well');
        if (!filterByRel) {
            // Prapare table of contents.
            $embeds.prepend('<hr/>');
            $embeds.prepend($prePlugins);
            $embeds.prepend('<h4>Used plugins</h4>');
        }

        plugins.forEach(function(p) {
            $prePlugins.append('<a href="#" data-link-pointer="' + p + '">' + p.replace(/-\d+$/i, "") + '</a><br>');
        });

        // Unified meta.
        var $meta = $('<table>')
            .addClass("table table-bordered")
            .append('<thead><tr><th>plugin</th><th>key</th><th>value</th></tr></thead>');

        var metaKeys = _.keys(data.meta);
        metaKeys.sort();
        metaKeys.forEach(function(key) {
            if (key == "_sources") {
                return;
            }
            $meta.append('<tr><td>' + data.meta._sources[key] + '</td><td><strong>' + key + '</strong></td><td>' + linkify(data.meta[key]) + '</td></tr>')
        });

        $embeds.prepend($meta);
        $embeds.prepend('<h4>Unified meta</h4>');
    } else if (!filterByRel) {
        $embeds.prepend($('<div>').addClass('alert alert-error').text('No links returned by plugins for this URI'));
    }
}

function findAllRels(data) {
    var result = [];
    data.links.forEach(function(link) {
        var $el = $.iframely.generateLinkElement(link);
        if ($el) {
            result = _.union(result, link.rel);
        }
    });

    return _.intersection(result, REL_GROUPS);
}

function processUrl() {
    var uri = $.trim($('.s-uri').val());

    if (!uri) {
        return;
    }

    var $loader = $('.s-loader').show();

    var $resultTabs = $('.s-result-div').hide();

    var $result = $('.s-debug-result');
    var $context = $('.s-debug-context');
    var $embeds = $('.s-embeds');
    var $status = $('#status').hide();
    var $apiUri = $('#api-uri');
    var $apiUriG = $('#api-uri-grouped');

    // 0) Setup.
    $.iframely.defaults.endpoint = baseAppUrl + '/oembed2';


    // Render api call uri.
    $apiUri.parent().show();
    
    var APICall = $.iframely.defaults.endpoint + '?uri=' + encodeURIComponent(uri);
    $apiUri.text(APICall).attr('href', APICall);

    var APICall2 = $.iframely.defaults.endpoint + '?group=true&uri=' + encodeURIComponent(uri);
    $apiUriG.text(APICall2).attr('href', APICall2);

    // 1) Fetch data.
    $.iframely.getPageData(uri, {
        debug: true,
        mixAllWithDomainPlugin: $('[name="mixAllWithDomainPlugin"]').is(":checked")
    }, function(error, data, jqXHR) {

        $loader.hide();

        if (error) {
            $status.attr('class', 'alert alert-error').show().text(jqXHR.status + ' ' + error);
            $result.renderObject(data);
            return;
        }

        $resultTabs.show();
        $resultTabs.find('li:first-child a').tab('show');

        // Response status.
        $status.attr('class', 'alert alert-success').show().text(jqXHR.status + ' ' + jqXHR.statusText + ' - ' + data.time.total + 'ms');

        // Render all debug data.
        $result.renderObject(data);

        // Render context.
        var contexts = data.debug && data.debug.map(function(d) { return d.context; }) || null;
        for(var k in contexts[0]) {
            if (k == "cb") {
                continue;
            }
            $context.append('<h4>' + k + '</h4>');
            var $pre = $('<pre>').attr('data-context', k).renderObject(contexts[0][k]);
            $context.append($pre);
        }

        // Good links.
        showEmbeds($embeds, data);

        findAllRels(data).forEach(function(rel) {
            $('.s-context-tab').parent().after('<li><a href="#' + rel +'" data-toggle="tab">rel: ' + rel + '</a></li>');
            $('#2').after('<div class="tab-pane" id="' + rel + '"></div>');

            showEmbeds($("#" + rel), data, rel);
        });

        // Links tab: click on context - show context tab.
        $('a[data-context-link]').click(function() {
            var $a = $(this);
            var context = $a.attr('data-context-link');
            hlContext(context);
            return false;
        });

        // Links tab: plugins list - table of contents clicks.
        $('a[data-link-pointer]').click(function() {

            storeHistoryState();

            var $a = $(this);
            var p = $a.attr('data-link-pointer');
            var position = $('[data-plugin="' + p + '"]').position().top;
            $(window).scrollTop(position);

            pushHistoryState();

            return false;
        });
    });
}

$(document).ready(function(){

    processUrl();

    $('.s-uri').click(function() {
        $(this).select();
    })

    $('[name="mixAllWithDomainPlugin"]').change(function() {
        $('form').submit();
    });

    window.onpopstate = function(event) {
        if (event.state && 'position' in event.state && event.state.tab) {
            setTimeout(function() {
                $('a[href="' + event.state.tab + '"]').tab('show');
                $(window).scrollTop(event.state.position);
            }, 0);
        }
    };
});