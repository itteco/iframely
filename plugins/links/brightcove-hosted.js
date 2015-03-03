module.exports = {

    provides: '__promoUri',    

    getData: function(url, twitter) {
        
        var video_src = (twitter.player && twitter.player.value) || twitter.player;
        if (!video_src || url.match(/^https?:\/\/link\.brightcove\.com\/services\/player\/bcpid(\d+)\?/i) ) {
            return;
        }
        // do not process links to itself, otherwise -> infinite recursion 

        var urlMatch = video_src.match(/^https?:\/\/link\.brightcove\.com\/services\/player\/bcpid(\d+)\?/i);

        if (urlMatch) {

            return {
                __promoUri: video_src
            };
        }
    }

    /* Sample direct-video URLs:
        http://video-embed.masslive.com/services/player/bcpid1949030308001?bctid=3082707357001&bckey=AQ~~,AAAAQBxUOok~,jSZP67EiqBfkIeiCdBewgHg1-uVWQxpS
        http://video-embed.cleveland.com/services/player/bcpid1949055968001?bctid=3086114271001&bckey=AQ~~,AAAAQBxUNqE~,xKBGzTdiYSSRqIKPsPdkNW3W_DNtPBTa
        http://video.archstl.org/services/player/bcpid1697747652001?bckey=AQ~~,AAABKmWKzxE~,jhq2mLafyYPtb2fDysY2ou3LA4sZBXej&bctid=2766873636001&iframe=true&height=275&width=485
        http://video.popularmechanics.com/services/player/bcpid16382224001?bckey=AQ~~,AAAAAAyqBbs~,3zLG8i7OTQIWSRZG2AhyY0vOQ2Zz32h-&bctid=3087691540001
        http://video.billboard.com/services/player/bcpid3063835940001?bckey=AQ~~,AAAAAEMcC3Y~,NII8yi9nN4ynMSuZMypu6TcjvNjfaYWZ&bclid=3064795148001&bctid=3082031207001
        http://video-embed.nj.com/services/player/bcpid1950981419001?bctid=3092316229001&bckey=AQ~~,AAAAPLMILBk~,Vn8u6tPOf8Us2eD8W1ez5Zw-Ss_6Anfe
        http://video.bafta.org/services/player/bcpid601325186001?bckey=AQ~~,AAAABxWZS7k~,uLPjGIDNpTmMdurNjyFkV6rYlN-J6re3&bctid=753252127001

        http://video-embed.masslive.com/services/player/bcpid1949030308001?bctid=3082707357001&bckey=AQ~~,AAAAQBxUOok~,jSZP67EiqBfkIeiCdBewgHg1-uVWQxpS
        http://video.symantec.com/services/player/bcpid975006955001?bckey=AQ%7E%7E%2CAAAABuIiy9k%7E%2CI8BhasVwr9wjJz4AWmdUlYymEtyorXkA&bctid=976391207001
        http://video.elcolombiano.com/services/player/bcpid2115059022001?bckey=AQ~~,AAABMdBKz4k~,kXKBkGGWjAV3BlMLVMYIIJUmR9KeWfwc&bctid=3082494089001
        http://video.scholastic.com/services/player/bcpid2602614477001?bckey=AQ~~,AAAAAFv844g~,BASb5BU03X9zO_bolhfjuH41AJVXYFl_&bctid=3027833348001
        http://trvideo.technologyreview.com/services/player/bcpid1237507476001?bckey=AQ~~,AAAAAAEgZvo~,jStb8wH-jnIlhYFjMUYJttcZynWzN1UG&bctid=1238876339001
    */

    /* Sample URLs with BrightCove Twitter Players:
        http://www.channel4.com/programmes/the-mill/videos/all/s1-ep2-the-introduction
        
    */
};