if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.iframely = {

    init: function() {

        var callback = $.proxy(function() {
            $('#redactor_modal').find('.redactor_clip_link').each($.proxy(function(i, s) {
                $(s).click($.proxy(function() {
                    this.insertClip($(s).next().html());
                    return false;

                }, this));
            }, this));

            this.selectionSave();
            this.bufferSet();

        }, this );

        this.buttonAdd('video', 'iframely', function(e) {
            this.modalInit('Clips', '#clipsmodal', 500, callback);
        });
    },

    insertClip: function(html) {
        this.selectionRestore();
        this.insertHtml($.trim(html));
        this.modalClose();
    }
};