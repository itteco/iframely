if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.iframely = {

    init: function() {

        this.buttonAdd('video', 'iframely', function() {
            this.modalInit('iframely', '#iframelyModal', 800, $.proxy(this.initForm, this));
        });
    },

    initForm: function() {

        var that = this;

        //that.insertWidget("TEST");

        this.selectionSave();
        this.bufferSet();

        this.$input = $('#redactor_modal input').focus();
        this.$result = $('#redactor_modal .results').html('');

        this.$input.keypress(function(e) {
            if (e.keyCode == "13") {
                that.fetchUrl();
            }
        });

        $('#redactor_modal .iframely_form button').click(function() {
            that.fetchUrl();
        });

        $('#redactor_modal .results').on("click", "button", function() {
            var html = $(this).data('embedCode');
            that.insertWidget(html);
        });
    },

    fetchUrl: function() {

        var that = this;

        var uri = this.$input.val();

        if (!uri) {
            return;
        }

        this.$result.html("Loading...");

        $.iframely.getPageData(uri, function(error, data) {

            if (error) {
                that.$result.html('Error loading embeds.');
                return;
            }

            var embeddables = data.links.filter(function(link) {
                return link.rel.indexOf('player') > -1 || link.rel.indexOf('thumbnail') > -1 || link.rel.indexOf('image') > -1;
            });

            if (embeddables.length == 0) {
                that.$result.html('No embeddable data found on this page.');
                return;
            }

            that.renderLinks(embeddables);
        });
    },

    renderLinks: function(links) {

        var $result = this.$result

        $result.html('');

        links.forEach(function(link) {
            var $el = $.iframely.generateLinkElement(link);

            if ($el) {
                var $div = $('<div/>');

                $div.append($('<div/>').addClass("insert").append($('<button />').data('embedCode', $('<div/>').append($el).html()).html("Insert this:")))
                $div.append($el);

                $result.append($div);
            }
        });
    },

    insertWidget: function(html) {
        this.selectionRestore();
        this.insertHtml($.trim(html));
        this.modalClose();
    }
};