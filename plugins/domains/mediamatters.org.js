module.exports = {

   re: [
       /https?:\/\/www\.mediamatters\.org/i
   ],

   mixins: ["*"],

   getMeta: function (og) {
       return {
           description: og.description
       };
   },

   tests: [
       "https://www.mediamatters.org/video/2017/10/02/foxs-ed-rollins-54-year-old-mayor-puerto-rico-very-young-woman-who-overcome-everything-around-her/218114",
       "https://www.mediamatters.org/blog/201004060044",
       "https://www.mediamatters.org/authors/erin-fitzgerald/319",
       "https://www.mediamatters.org/blog/2017/07/21/Hate-groups-hide-years-of-extremism-behind-baseless-fake-news-accusations/217343"
   ]
};