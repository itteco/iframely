module.exports = {

    prepareLink: function(link) {

        if (link.rel.indexOf(CONFIG.R.player) > -1) {
            link.href = link.href.replace(/(auto_play)=true/i, '$1=false');
            link.href = link.href.replace(/(auto)=true/i, '$1=false');
            link.href = link.href.replace(/(autoPlay)=1/i, '$1=0');
            link.href = link.href.replace(/(autoPlay)=true/i, '$1=false');
            link.href = link.href.replace(/(autoStart)=true/i, '$1=false');
            link.href = link.href.replace(/(autoStart)=1/i, '$1=0');
        }
    }
};