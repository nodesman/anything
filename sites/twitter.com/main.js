(function() {

    var TwitterAdditions = {

        headersReady: new Promise((resolve) => {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.action === "headersReady") {
                    resolve();
                }
            });
        }),

        quotesPageReady: new Promise((resolve) => {
            const debounce = (func, delay) => {
                let debounceTimer;
                return function() {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
                };
            };

            const onQuotesPage = () => {
                if (/https:\/\/twitter\.com\/[^/]+\/status\/\d+\/quotes/.test(window.location.href)) {
                    resolve();
                }
            };

            const observer = new MutationObserver(debounce(() => {
                onQuotesPage();
            }, 5000));

            observer.observe(document, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false,
            });

            // Run initial check
            onQuotesPage();
        }),

        run() {
            var self = this;
            Promise.all([this.headersReady, this.quotesPageReady]).then(() => {
                self.onQuoteTweets();
            });

            window.addEventListener('load', function () {
                // Future logic here, if needed
            });
        },

        onQuoteTweets() {
            //add a position fixed element that allows you to trigger the advanced quote tweet
            var bodyElement = document.getElementsByTagName('body')[0];
            var button = document.createElement('button');
            button.innerHTML = 'Advanced Quote Tweet';
            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.right = '20px';
            button.style.zIndex = '9999';
            button.style.padding = '10px';

            bodyElement.appendChild(button);
            var self = this;

            button.addEventListener('click', function () {
                self.runAnalysis();
            });

        },

        async runAnalysis() {

            //batch load all the quote tweets
            // Send a message to request the local storage object
            // Send a message to request the local storage object
            let headers = await this.getRequestHeaders();
            var flattenedHeaders = {};

            headers.forEach(function (header) {
                //is an array of { name: 'header name', value: 'header value' }, convert to single object
                flattenedHeaders[header.name] = header.value;
            });

            let content = await fetch("https://twitter.com/i/api/graphql/-gmCbDQT9PsGve4uWNVGiQ/SearchTimeline?variables=%7B%22rawQuery%22%3A%22quoted_tweet_id%3A1709237315632079183%22%2C%22count%22%3A100%2C%22querySource%22%3A%22tdqt%22%2C%22product%22%3A%22Top%22%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_home_pinned_timelines_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D", {
                "credentials": "include",
                "headers": flattenedHeaders,
                "referrer": "https://twitter.com/elonmusk/status/1709237315632079183/quotes",
                "method": "GET",
                "mode": "cors"
            });
            let json = await content.json();


            //get all the text of all teh quote tweets


            //trigger analysis with the whole json of all the quote tweets


        },

        getRequestHeaders() {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({action: "getRequestHeaders"}, function(response) {
                    if(chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }
                    resolve(response);
                });
            });
        }
    };

    TwitterAdditions.run();
})();