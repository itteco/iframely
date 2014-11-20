# Iframely JS Client Lib

[Iframely Open-Source](https://github.com/itteco/iframely) package includes the client javascript wrapper of the API, so you don't need to spend time on it yourself. If you'd prefer to render a widget from the data yourself, please refer to [How to Render a Widget](https://iframely.com/docs/links). 

If you are using [Cloud API](https://iframely.com), you don't need iframely.js as the embed code will be provided to you by API as the `html` field of JSON response.

You may find `iframely.js` lib in `/static/js/iframely.js` folder. 

It facilitates calls and fetches information from `/iframely` API endpoint and renders responsive embed widgets from the data received.



## Add iframely.js to Your App

iframely.js requires jQuery. Include it in the `<head>` section of your page:

    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="http://{YOUR.DOMAIN}}/r3/js/iframely.js"></script>

Where `{YOUR.DOMAIN}}` is the domain name you host Iframely Gateway at.

You may also copy iframely.js file to your apps main domain and serve it from there. 

If you have not [set up host](https://iframely.com/docs/host) yet, you can load iframel.js from [this source](http://iframely.com/r3/js/iframely.js). However, don't use it for production purposes. But rather copy it to your servers.



## Fetch API Response

    // Set endpoint address
    $.iframely.defaults.endpoint = 'http://{YOUR.IFRAMELY.SERVER.DOMAIN}/iframely';

    // Get Data. Specify page {URI} and your callback if required
    $.iframely.getPageData("http://vimeo.com/67452063", function(error, data) {
        console.log(data);
    });

Sample code abovewill log the following JSON into console [log](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063):

    {
      "meta": {
        "canonical": "http://vimeo.com/67452063",
        "title": "BLACK&BLUE",
        "author": "ruud bakker",
        "author_url": "http://vimeo.com/ruudbakker",
        "duration": 262,
        "site": "Vimeo",
        "description": "..."
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


The format of this JSON object is given in [API description](https://iframely.com/docs/api).

You can use `data.meta` to get available meta attributes of your `uri` or `data.links` to render some widgets from it.



## Render `links` Widgets

You would need to make a choice which links/widgets you'd like to render from a list given in the response code. [API response parameters](https://iframely.com/docs/api).

Each link in API response from previous example can be rendered in a following way:

    // Iterate through all links.
    data.links.forEach(function(link) {

        // Call generator to create html element for a link.
        var $el = $.iframely.generateLinkElement(link, data);

        // Add element to body.
        $('body').append($el);
    });


If you'd like to rid `reader` rel iframes (`type="text/html"`) from horizontal (and sometimes vertical) scrollbar, call the following method after rendering widgets:

    $.iframely.registerIframesIn($('body'));

You can call it once after all or after each rendering operation.

This method is useful for example with [Github Gist](http://iframely.com/debug?uri=https%3A%2F%2Fgist.github.com%2Fkswlee%2F3054754) or
[Storify](http://iframely.com/debug?uri=http%3A%2F%2Fstorify.com%2FCNN%2F10-epic-fast-food-fails) pages. 

They insert javascript widget in iframe and we don't know exact size before it is actually loaded.

After widget is rendered, custom script in that iframe sends message to parent about new window size.
This way, iframely.js will resize that iframe to fit content without horizontal scrolling.
