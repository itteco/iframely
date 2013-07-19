## oEmbed/2 quick draft
[oembed2]: #oembed2-quick-draft "oEmbed/2 draft"

Iframely is based on [oEmbed/2][oembed2]:

 - Name it "oEmbed two" or "half oEmbed", because - 
 - It removes the semantics part of [oEmbed](http://oembed.com) out of the scope of the spec (as there is plenty of `meta` available already on the page)
 - Keeps the discovery part through `<link>` tag in the `<head>` of the page
 - And specifies technological approaches and use case for embeds to improve end user's experience in modern realities (HTML5, CSS3, HTTP1.1)


[oEmbed spec](http://oembed.com) was remarkable and ingenious in 2008. It was unlocking numerous opportunities for developers and businesses alike. 
All of a sudden, as a publisher you could get enormous distribution of your content into all the apps (and their user base) that consume it per spec.

For app developers it meant they could provide significantly more engaging user experience and higher value to better retain their customers. However, due to inconsistencies in implementations, security considerations and lack of progress on semantics part, the progress towards a movable web stumbled.

oEmbed/2 eliminates the semantic part of [oEmbed](http://oembed.com) as other semantic protocols such as [Open Graph]((http://ogp.me/)) and RDFa in general have clearly gone mainstream. Besides, there is plenty of other `<meta>` data, available for a web page. 

Thus, oEmbed/2 is primarily for discovery of what publisher has got to offer and agreeing on the use cases.

**Discovery is expected to happen when publisher puts `<link>` tag in the head of their webpage:**


    <link rel="player twitter"            // intended use case
    type="text/html"                      // embed as iframe
    href="//iframe.ly/234rds"             // with this src
    media="min-width: 100"                // when these sizes are ok
    title="Thanks for all the fish!" >    


- The use cases shall be listed in `rel` attributed, separated by a space. The dictionary of use cases is not fixed, and it is up to publisher and provider to choose what to publish or consume. 
Iframely endpoint can currently output the following `rel` functional use cases: `favicon`, `thumnail`, `image`, `player`, `reader`, `logo`. In addition, we supplement with `rel` indicating origin, such as `twitter` for example.

- `type` attribute of a link specified the MIME type of the link, and so dicttes the way the embed resources shall be embedded. Iframely supports embeds as iframe, image and javascript.

- `href` attributes is preferrably via https protocol to ensure maximum distribution for publishers' content, as consumers may opt not to consider http-only embeds.

- `media` is for media queries, indicating the sizes of the containers where embed content would fit. 


As a "good citizen" policy and business etiquette, it is worth to remind that both consumer and publisher work together towards a common goal of providing the best user experience possible for their shared audience, and not against each other in order to solicit a customer. Never should it be acceptable to undermine user experience in lieu of providing value.

This is a draft idea. More specific description will be published once we gather sufficient feedback from the community.