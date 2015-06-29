var Twitter = require("twitter");
var version = require('./package.json').version;

function TonicTwitter(options)
{
    if (!options) { options = {} }

    if (process.env.TONIC_OAUTH_PROXY && !options.consumer_key && !options.consumer_secret)
    {
        // These will be overwritten by the Tonic proxy
        options.consumer_key = "TONIC_CONSUMER_KEY"
        options.consumer_secret = "TONIC_CONSUMER_SECRET"

        // Let people provide these, but set them if they are empty
        options.access_token = options.access_token || process.env.TWITTER_ACCESS_TOKEN
        options.access_token_secret = options.access_token_secret || process.env.TWITTER_ACCESS_TOKEN_SECRET

        // Point the API endpoints at our proxy
        var tonicBase = "https://"+process.env.TONIC_OAUTH_PROXY;

        options.rest_base = tonicBase + '/api.twitter.com/1.1';
        options.stream_base = tonicBase + '/stream.twitter.com/1.1';
        options.user_stream_base = tonicBase + '/userstream.twitter.com/1.1';
        options.site_stream_base = tonicBase + '/sitestream.twitter.com/1.1';
        options.media_base = tonicBase + '/upload.twitter.com/1.1';

        if (!options.request_options) { options.request_options = {} }
        if (!options.request_options.headers) { options.request_options.headers = {} }

        // We need to send the secret key to the proxy so it can regenerate the signatures
        options.request_options.headers['Tonic-Token-Secret'] = options.access_token_secret;
        options.request_options.headers['Tonic-Token'] = options.access_token;
        options.request_options.headers['User-Agent'] = "tonic-twitter/" + version
    }

    var client = new Twitter(options);

    // Don't bother with signing the request
    client.request = client.request.defaults({
        oauth: null
    })

    return client;
}

module.exports = TonicTwitter;
