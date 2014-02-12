module.exports = {

    re: [
        /^http:\/\/link\.brightcove\.com\/services\/player\/bcpid(\d+)\?/i,
        /\.(com|org)\/services\/player\/bcpid(\d+)\?/i  //the hosted players
    ],

    mixins: [
        "og-description",
        "og-image",
        "og-title",
        "og-video-responsive" // Twitter video, though it is https, does not have the cover image and is plain grey when loaded.
    ],

    tests: [
        "http://link.brightcove.com/services/player/bcpid1989148206001?bckey=AQ~~,AAAAAFSL1bg~,CmS1EFtcMWELN_eSE9A7gpcGWF5XAVmI&bctid=3123935084001",
        "http://video-embed.masslive.com/services/player/bcpid1949030308001?bctid=3082707357001&bckey=AQ~~,AAAAQBxUOok~,jSZP67EiqBfkIeiCdBewgHg1-uVWQxpS",
        "http://video-embed.cleveland.com/services/player/bcpid1949055968001?bctid=3086114271001&bckey=AQ~~,AAAAQBxUNqE~,xKBGzTdiYSSRqIKPsPdkNW3W_DNtPBTa",
        "http://video.archstl.org/services/player/bcpid1697747652001?bckey=AQ~~,AAABKmWKzxE~,jhq2mLafyYPtb2fDysY2ou3LA4sZBXej&bctid=2766873636001&iframe=true&height=275&width=485",
        "http://video.popularmechanics.com/services/player/bcpid16382224001?bckey=AQ~~,AAAAAAyqBbs~,3zLG8i7OTQIWSRZG2AhyY0vOQ2Zz32h-&bctid=3087691540001",
        "http://video.billboard.com/services/player/bcpid3063835940001?bckey=AQ~~,AAAAAEMcC3Y~,NII8yi9nN4ynMSuZMypu6TcjvNjfaYWZ&bclid=3064795148001&bctid=3082031207001",
        "http://v.thestar.com/services/player/bcpid2071349530001?bckey=AQ~~,AAAAuO4KaJE~,gatFNwSKdGDmDpIYqNJ-fTHn_c4z_LH_&bctid=3088222317001",
        "http://video-embed.nj.com/services/player/bcpid1950981419001?bctid=3092316229001&bckey=AQ~~,AAAAPLMILBk~,Vn8u6tPOf8Us2eD8W1ez5Zw-Ss_6Anfe",        
        "http://video.bafta.org/services/player/bcpid601325186001?bckey=AQ~~,AAAABxWZS7k~,uLPjGIDNpTmMdurNjyFkV6rYlN-J6re3&bctid=753252127001"
    ]
};