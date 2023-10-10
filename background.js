chrome.webRequest.onBeforeSendHeaders.addListener(
    function(requestDetails) {
        const url = new URL(requestDetails.url);

        if (url.hostname === "twitter.com" && url.pathname.startsWith("/i/api/graphql")) {
            const params = url.searchParams;

            if (params.has("variables") && params.get("variables").includes("quoted_tweet_id")) {
                const tabId = requestDetails.tabId;

                chrome.storage.local.set({[`tab_${tabId}_headers`]: requestDetails.requestHeaders}, function() {
                    console.log(`Headers stored for tab: ${tabId}`);
                });
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
);