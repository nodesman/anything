chrome.webRequest.onBeforeSendHeaders.addListener(
    function(requestDetails) {
        const url = new URL(requestDetails.url);

        if (url.hostname === "twitter.com" && url.pathname.startsWith("/i/api/graphql")) {
            const params = url.searchParams;

            if (params.has("variables") && params.get("variables").includes("quoted_tweet_id")) {
                const tabId = requestDetails.tabId;

                // Store the headers into local storage
                chrome.storage.local.set({[`tab_${tabId}_headers`]: requestDetails.requestHeaders}, function() {
                    console.log(`Headers stored for tab: ${tabId}`);

                    // Notify the content script that headers are ready
                    chrome.tabs.sendMessage(tabId, {action: "headersReady"});
                });
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
);


// Listener for message from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getRequestHeaders") {
        const tabId = sender.tab.id;
        const key = `tab_${tabId}_headers`;

        // Retrieve the headers from local storage
        chrome.storage.local.get([key], function(result) {
            sendResponse(result[key]);
        });

        return true;  // Keeps the message channel open for sendResponse
    }
});