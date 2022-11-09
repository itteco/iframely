# Result codes & error handling

If everything went well, Iframely will return HTTP status code 200. If there was a problem with processing of your URL, Iframely will return HTTP error code `4xx`.

In addition, the body of the response will also include the error code and message:

		{
			"status": "404",
			"error": "Not Found"
		}

The URLs that resulted an error will not be applied towards your API usage and limits. Morever, you can configure API through [your settings](https://iframely.com/settings) to return error code if there was no media matching your desired charecteristics. Such URLs will also not affect our billing.

The error statuses that you may encounter are these:

 - `404`, an obvious case when the origin URL is no longer available and can not be found.

 - `408`, time-out, is returned when the origin server takes too long to respond. To avoid causing more problems to what already appears to be a troubled page, Iframely will cache 408 for 10 mins before trying to fetch that page another time.

 - `401` and `403` are for access-restricted pages that Iframely could not fetch. 

 - `415` is for unsupported media type. At the moment, ISO2022 encoding is not supported.

 - `410`, gone - is for domains that were ignored by Iframely. Most likely, due to inadequate content. 

 - `417`, last but not least, the "expectation failed". It is if you asked us to return it for URLs that do not match your media requirements.


In an unlikely event that you received `5xx` HTTP error, [let us know](mailto:support@iframely.com) ASAP so that we can fix the server-side problem.