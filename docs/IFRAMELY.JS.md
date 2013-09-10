### iframely.js: JavaScript client lib

Iframely package includes the client wrapper over the API, so you don't need to spend time on it yourself. 
You may access it in `/static/js/iframely.js` folder. It provides calls to fetch data from `/iframely` API endpoint and render links.

#### Add to your page

Insert similar lines in your page head (iframely.js requires jQuery and Underscore):

    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
    <script type="text/javascript" src="http://your.domain/r3/js/iframely.js"></script>

Replace `your.domain` with your actual domain name. You may also copy `iframely.js` script file to your apps main domain and accordingly.

#### Fetch oEmbed/2

    // Setup endpoint path.
    $.iframely.defaults.endpoint = 'http://your.iframely.server.domain/iframely';

    // Start data fetching. Specify page uri and result callback.
    $.iframely.getPageData("http://vimeo.com/67452063", function(error, data) {
        console.log(data);
    });

This code will create following [log](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063):

    {
      "meta": {
        "canonical": "http://vimeo.com/67452063",
        "title": "BLACK&BLUE",
        "author": "ruud bakker",
        "author_url": "http://vimeo.com/ruudbakker",
        "duration": 262,
        "site": "Vimeo",
        "description": "Is it bad luck?\nIs it fate?\nOr just stupid?\n\nBLACK&BLUE is my graduation film from AKV st. Joost, Breda, The Netherlands.\n\nWritten, animated and directed by Ruud Bakker\nMusic and sounddesign by Bram Meindersma, Audiobrand\n\nScreenings\n\nPictoplasma Berlin, Germany 2013\nKlik! Amsterdam, The Netherlands 2012\nMultivision, st Petersburg, Russia 2012\nCut-Out Fest, Querétaro, Mexico 2012\nFête de l'anim, Lille, France 2012\nPlaygrounds Festival, Tilburg, The Netherlands, 2012\n\nwww.thisisbeker.com"
      },
      "links": [
        {
          "href": "//player.vimeo.com/video/67452063",
          "type": "text/html",
          "rel": [
            "player",
            "iframely"
          ],
          "title": "BLACK&BLUE",
          "media": {
            "aspect-ratio": 1.778
          }
        },
        {
          "href": "http://a.vimeocdn.com/images_v6/apple-touch-icon-72.png",
          "type": "image",
          "rel": [
            "icon",
            "iframely"
          ],
          "title": "BLACK&BLUE",
          "media": {
            "width": 72,
            "height": 72
          }
        },
        {
          "href": "http://b.vimeocdn.com/ts/439/417/439417999_1280.jpg",
          "type": "image",
          "rel": [
            "thumbnail",
            "oembed"
          ],
          "title": "BLACK&BLUE",
          "media": {
            "width": 1280,
            "height": 720
          }
        }
      ]
    }

This is parsed JSON object. You can use `data.meta` to get page meta attributes or `data.links` to render some objects from the page.

#### Render links

Each link in result from previous example can be rendered:

    // Iterate through all links.
    data.links.forEach(function(link) {

        // Call generator to create html element for link.
        var $el = $.iframely.generateLinkElement(link, data);

        // Add element to body.
        $('body').append($el);
    });


If you'd like to make `reader` iframes to be without horizontal scrolling call after rendering widgets:

    $.iframely.registerIframesIn($('body'));

You can call it once after all or after each rendering operation.

This is useful with [github.gist](http://iframely.com/debug?uri=https%3A%2F%2Fgist.github.com%2Fkswlee%2F3054754) or
[storify](http://iframely.com/debug?uri=http%3A%2F%2Fstorify.com%2FCNN%2F10-epic-fast-food-fails) pages,
where js widget is inserted in iframe and we don't know exact size before it launched.
After widget is rendered, custom script in that iframe sends message to parent about new window size.
So iframely.js will resize that iframe to fit content without horizontal scrolling.