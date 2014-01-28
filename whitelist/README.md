If you put a whitelist json file here, Iframely will start covering extra domains, converting responsive players, photos, etc. 

The file name is expected to be of "iframely-*.json" pattern. Lastest filename uploaded to this directory is used. 

- You can get whitelist file with over 2000 domains at [http://iframely.com/qa/buy](http://iframely.com/qa/buy). 
- Or get free extract file with top 100 domains from the same page.
- Configure `WHITELIST_URL` and `WHITELIST_URL_RELOAD_PERIOD` with your unique access link to download files automatically

If you wish to create your own whitelist, please, follow this [file format](http://iframely.com/qa/format).