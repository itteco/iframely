function linkify(text) {
    if (typeof text === "string") {
        return text.replace(/((https?:)?\/\/[^"\s]+)/gi, '<a target="_blank" href="$1">$1</a>');
    } else {
        return text;
    }
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
    text = text.replace(/"((https?:)?\/\/[^"\s]+)"/gi, '"<a target="_blank" href="$1">$1</a>"');
    text = text.replace(/\[contextLink](\w+)\[\/contextLink\]/gi, '<a href="#" data-context-link="$1">$1</a>');
    this.html(text);
    return this;
};

function findDebugInfo(link, data) {

    // Find debug data for specific link.

    var result;

    _.find(data.allData, function(dataItem) {

        if (dataItem.method.name.indexOf('getLink') === -1) {
            return;
        }

        var linkData = dataItem.data;

        if (!linkData) {
            return;
        }

        if (!(linkData instanceof Array)) {
            linkData = [linkData];
        }

        var goodLinks = linkData.filter(function(l) {
            return l.sourceId === link.sourceId;
        });

        if (goodLinks.length) {
            result = _.extend({}, dataItem);
            result.data = goodLinks[0];
            return true;
        }
    });

    return result;
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
    var usedPlugins = {};

    var counter = 0;

    data.links.forEach(function(link) {

        if (filterByRel && link.rel.indexOf(filterByRel) == -1) {
            return;
        }

        // 2) Get html.
        var $el = $.iframely.generateLinkElement(link, data);
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
                    $embeds.append('<h4>Embed As</h4>');
                    var $code = $('<pre>').text($el.parent().html());
                    $embeds.append($code);
                }

            } else {

                var debug = findDebugInfo(link, data);

                var pluginId = debug && debug.method.pluginId;

                // Links head.
                plugins.push(pluginId + '-' + counter);
                usedPlugins[pluginId] = true;
                var head;
                if (DEBUG) {
                    head = pluginId;
                } else {
                    var rels = _.intersection(link.rel, REL_GROUPS);
                    if (rels.length) {
                        head = rels[0];
                    } else if (link.rel.length) {
                        head = link.rel[0];
                    } else {
                        head = pluginId;
                    }
                }
                $embeds.append('<h2 data-plugin="' + pluginId + '-' + counter + '">' + head + '</h2>');
                counter += 1;

                // Links preview.
                $embeds.append('<h4>Preview</h4>');
                var $well = $('<div>').addClass('well');
                // 3) Render element.
                $well.append($el);
                $embeds.append($well);

                // Embed code.
                if (!link.html) {
                    $embeds.append('<h4>Embed As</h4>');
                    var $code = $('<pre>').text($el.parent().html());
                    $embeds.append($code);
                }

                // Links data (result).
                $embeds.append('<h4>Link</h4>');
                var $pre = $('<pre>').renderObject(link);
                $embeds.append($pre);

                if (DEBUG) {
                    // Link debug data with raw source.
                    var $debug = $('<pre>').renderObject(debug);

                    var $div = $('<div>').addClass("row-fluid")
                        .append($('<div>').addClass("span1"))
                        .append($('<div>').addClass("span11").append('<h4>Debug</h4>').append($debug));

                    $embeds.append($div);
                }
            }

            $embeds.append('<hr/>');
        }
    });

    // Render plugins list (links table of contents).
    if (!filterByRel && plugins.length > 0) {

        var $prePlugins = $("<div>").addClass('well');
        if (!filterByRel && DEBUG) {
            // Prapare table of contents.
            $embeds.prepend('<hr/>');
            $embeds.prepend($prePlugins);
            $embeds.prepend('<h4>Used link plugins</h4>');
        }

        plugins.forEach(function(p) {
            $prePlugins.append('<a href="#" data-link-pointer="' + p + '">' + p.replace(/-\d+$/i, "") + '</a><br>');
        });
    } else if (!filterByRel) {
        $embeds.prepend($('<div>').addClass('alert alert-error').text('No links returned by plugins for this URI'));
    }

    if (!filterByRel) {

        // Unified meta.
        var $meta = $('<table>')
            .addClass("table table-bordered")
            .append('<thead><tr>' + (DEBUG ? '<th>plugin</th><th>requirements</th>' : '') + '<th>key</th><th>value</th></tr></thead>');

        var metaKeys = _.keys(data.meta);
        metaKeys.sort();
        metaKeys.forEach(function(key) {
            if (key == "_sources") {
                return;
            }
            var pluginId = data.meta._sources && data.meta._sources[key] || '';
            usedPlugins[pluginId] = true;

            $meta.append('<tr>' + (DEBUG ? ('<td>' + pluginId + '</td><td></td>') : '') + '<td><strong>' + key + '</strong></td><td>' + linkify(data.meta[key]) + '</td></tr>')
        });

        $embeds.prepend($meta);
        $embeds.prepend('<h4>Unified meta</h4>');

        var pluginsList = _.keys(usedPlugins);
        var $textarea = $('<textarea>')
            .hide()
            .attr('rows', pluginsList.length + 2)
            .html("mixins: " + JSON.stringify(pluginsList, null, 4));

        var $a = $('<a href="#">')
            .text('[show plugins as mixins]')
            .click(function(e) {
                e.preventDefault();
                $textarea
                    .show()
                    .focus()
                    .select();
                $a.hide();
            });

        $embeds.prepend($textarea);
        $embeds.prepend($a);
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
    var uri = $.trim($('.s-uri').focus().val());

    if (!uri) {
        return;
    }

    var $loader = $('.s-loader').show();

    var $resultTabs = $('.s-result-div').hide();

    var $result = $('.s-debug-result');
    var $context = $('.s-debug-context');
    var $response = $('.s-json');
    var $embeds = $('.s-embeds');
    var $status = $('#status').hide();
    var $errors = $('#errors').hide().html('');
    var $apiUri = $('#api-uri');

    // 0) Setup.
    $.iframely.defaults.endpoint = baseAppUrl + '/iframely';


    // Render api call uri.
    $apiUri.parent().show();
    
    var APICall = $.iframely.defaults.endpoint + '?uri=' + encodeURIComponent(uri);
    $apiUri.text(APICall).attr('href', APICall);

    // 1) Fetch data.
    var query = {
        debug: true,
        group: false,
        mixAllWithDomainPlugin: $('[name="mixAllWithDomainPlugin"]').is(":checked"),
        refresh: $('[name="refresh"]').is(":checked")
    };
    $.extend(query, QUERY);
    $.iframely.getPageData(uri, query, function(error, data, jqXHR) {

        $loader.hide();

        if (error) {
            $status.attr('class', 'alert alert-error').show().text(jqXHR.status + ' - ' + error + ' - ' +jqXHR.responseText);
            $result.renderObject(data);
            return;
        }

        $resultTabs.show();
        $resultTabs.find('li:first-child a').tab('show');

        if (!DEBUG) {
            $('.s-all-debug').hide();
        }

        // Response status.
        $status.attr('class', 'alert alert-success').show().text(jqXHR.status + ' ' + jqXHR.statusText + ' - ' + data.time.total + 'ms');

        // Errors.
        data.allData.forEach(function(result) {
            if (result.error) {
                var error = result.error;
                if (typeof error === 'object') {
                    error = JSON.stringify(error);
                }
                $errors.append('<li><strong>' + result.method.pluginId + '-' + result.method.name + ':</strong> ' + error + '</li>').show();
            }
        });
        //

        // Messages.
        data.messages && data.messages.forEach(function(message) {
            $errors.append('<li>' + message + '</li>').show();
        });

        // Render all debug data.
        $result.renderObject(data);

        var clearData = $.extend(true, {}, data);
        delete clearData.allData;
        delete clearData.time;
        if (clearData.meta) {
            delete clearData.meta._sources;
        }
        clearData.links.forEach(function(link) {
            delete link.sourceId;
        });

        $response.renderObject(clearData);

        // Render context.
        var contexts = data.allData && data.allData
            .filter(function(d) {
                return d.method.name === 'getData';
            })
            .map(function(d) {
                return d.data;
            }) || [];
        var DISABLED_REQUIREMENTS = [
            "cb"
        ];
        contexts.forEach(function(context) {
            for(var k in context) {
                if (DISABLED_REQUIREMENTS.indexOf(k) > -1) {
                    continue;
                }
                $context.append('<h4>' + k + '</h4>');
                var $pre = $('<pre>').attr('data-context', k).renderObject(context[k]);
                $context.append($pre);
            }
        });
        if ($context.children().length == 0) {
            $('.s-context-tab').hide();
        }

        // Good links.
        showEmbeds($embeds, data);

        findAllRels(data).forEach(function(rel) {
            $('.s-links').parent().after('<li><a href="#' + rel +'" data-rel="' + rel + '" data-toggle="tab">rel: ' + rel + '</a></li>');
            $('#2').after('<div class="tab-pane" id="' + rel + '"></div>');
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

        $('a[data-rel]').on('shown', function (e) {

            var $l = $(e.target);

            if ($l.attr('data-rendered')) {
                return;
            }

            var rel = $l
                .attr('data-rendered', true)
                .attr('data-rel');

            var $c = $("#" + rel);
            showEmbeds($c, data, rel);
            $.iframely.registerIframesIn($c);
        })

        $.iframely.registerIframesIn($('body'));
    });
}

$(document).ready(function(){

    processUrl();

    $('.s-uri').click(function() {
        $(this).select();
    })

    $('[type="checkbox"]').change(function() {
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