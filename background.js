function logURL(requestDetails) {
    const url = new URL(requestDetails.url);

    if (url.hostname === "twitter.com" && url.pathname.startsWith("/i/api/graphql")) {
        const params = url.searchParams;

        // Check for specific parameters in the query string
        if (params.has("variables") && params.get("variables").includes("quoted_tweet_id")) {
            console.log("Headers:", requestDetails.requestHeaders);
        }
    }
}

chrome.webRequest.onBeforeSendHeaders.addListener(logURL, {
        urls: ["<all_urls>"],
    },
    ['requestHeaders']
);
