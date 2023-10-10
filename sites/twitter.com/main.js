(function() {

    var TwitterAdditions = {

        watchForQuoteTweets() {
            const debounce = (func, delay) => {
                let debounceTimer;
                return function() {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
                };
            };

            var self= this;

            // Function to execute when the URL matches "/quotes"
            const onQuotesPage = () => {
                if (/https:\/\/twitter\.com\/[^/]+\/status\/\d+\/quotes/.test(window.location.href)) {
                    // Your code for successful detection
                    self.onQuoteTweets();
                }
            };

            // Initialize MutationObserver
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
        },

        run() {
            //check if the URL is /quotes
            var self = this;
            window.addEventListener('load', function () {
                self.watchForQuoteTweets();
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

            let content = await fetch("https://twitter.com/i/api/graphql/-gmCbDQT9PsGve4uWNVGiQ/SearchTimeline?variables=%7B%22rawQuery%22%3A%22quoted_tweet_id%3A1709237315632079183%22%2C%22count%22%3A100%2C%22querySource%22%3A%22tdqt%22%2C%22product%22%3A%22Top%22%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_home_pinned_timelines_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/json",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
                },
                "referrer": "https://twitter.com/elonmusk/status/1709237315632079183/quotes",
                "method": "GET",
                "mode": "cors"
            });

            let json = await content.json();

            console.log(json);


            //get all the text of all teh quote tweets


            //trigger analysis with the whole json of all the quote tweets


        }

    };

    TwitterAdditions.run();
})();