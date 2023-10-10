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
                const regex = /https:\/\/twitter\.com\/[^/]+\/status\/(\d+)\/quotes/;
                const match = window.location.href.match(regex);
                if (match) {
                    resolve(match[1]);  // resolve with the tweet ID
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

        async fetchAllQuoteTweets(headers, tweetId) {

            //first
            let isFirst = true;
            let cursor = "";

            let allTweets = [];

            while (true) {
                let content;
                if (isFirst) {
                    content = await fetch(`https://twitter.com/i/api/graphql/-gmCbDQT9PsGve4uWNVGiQ/SearchTimeline?variables=%7B%22rawQuery%22%3A%22quoted_tweet_id%3A${tweetId}%22%2C%22count%22%3A100%2C%22querySource%22%3A%22tdqt%22%2C%22product%22%3A%22Top%22%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_home_pinned_timelines_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`, {
                        "credentials": "include",
                        "headers": headers,
                        "referrer": `https://twitter.com/elonmusk/status/${tweetId}/quotes`,
                        "method": "GET",
                        "mode": "cors"
                    });
                } else {
                    content = await fetch(`https://twitter.com/i/api/graphql/-gmCbDQT9PsGve4uWNVGiQ/SearchTimeline?variables=%7B%22rawQuery%22%3A%22quoted_tweet_id%3A${tweetId}%22%2C%22count%22%3A100%2C%22cursor%22%3A%22${cursor}%22%2C%22querySource%22%3A%22tdqt%22%2C%22product%22%3A%22Top%22%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_home_pinned_timelines_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`, {
                        "headers": headers,
                        "referrer": `https://twitter.com/BillAckman/status/${tweetId}/quotes`,
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "include"
                    });
                }
                //second cursor onwards doesn't work.
                let json = await content.json();
                let tweetsList = json.data.search_by_raw_query.search_timeline.timeline.instructions[0].entries;
                cursor = encodeURIComponent(tweetsList[0].content.clientEventInfo.details.timelinesDetails.controllerData);
                isFirst = false;
                let tweets =  tweetsList.filter(tweet => tweet.content.entryType === "TimelineTimelineItem").map(function (tweet) {
                    let result = tweet.content.itemContent.tweet_results.result;
                    let userResults = (result.core?result.core:result.tweet.core).user_results;
                    let tweetDetails = result.legacy?result.legacy:result.tweet.legacy
                    return {
                        "id": tweet.entryId,
                        "name": userResults.result.legacy.screen_name,
                        "profile_image_url": userResults.result.legacy.profile_image_url_https,
                        "is_blue_verified": userResults.result.is_blue_verified,
                        "created_at": tweetDetails.created_at,
                        "likes": tweetDetails.favorite_count,
                        "retweets": tweetDetails.retweet_count,
                        "replies": tweetDetails.reply_count,
                        "text": tweetDetails.full_text,
                    }
                });

                allTweets = allTweets.concat(tweets);

                //if the returned tweets are less than 20, then we have reached the end of the quote tweets
                if (tweetsList.length < 20) {
                    break;
                }
            }
            console.log(allTweets);

        },

        async runAnalysis() {
            let tweetId = await this.quotesPageReady;
            //batch load all the quote tweets
            // Send a message to request the local storage object
            // Send a message to request the local storage object
            let headers = await this.getRequestHeaders();
            var flattenedHeaders = {};

            headers.forEach(function (header) {
                //is an array of { name: 'header name', value: 'header value' }, convert to single object
                flattenedHeaders[header.name] = header.value;
            });

            await this.fetchAllQuoteTweets(flattenedHeaders, tweetId);




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