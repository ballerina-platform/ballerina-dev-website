```
public function main() returns error? {
    // Get information on upcoming and recently released movies from TMDB
    final themoviedb:Client moviedb = check new themoviedb:Client({apiKey: moviedbApiKey});
    themoviedb:InlineResponse2001 upcomingMovies = check moviedb->getUpcomingMovies();

    // Generate a creative tweet using Azure OpenAI   
    string prompt = "Instruction: Generate a creative and short tweet " +
        "below 250 characters about the following " +
        "upcoming and recently released movies. Movies: ";
    foreach int i in 1 ... NO_OF_MOVIES {
        prompt += string `${i}. ${upcomingMovies.results[i - 1].title} `;
    }

    text:Deploymentid_completions_body completionsBody = {
        prompt,
        max_tokens: MAX_TOKENS
    };
    final text:Client azureOpenAI = check new (
        config = {auth: {apiKey: openAIToken}},
        serviceUrl = serviceUrl
    );
    text:Inline_response_200 completion = 
        check azureOpenAI->/deployments/[deploymentId]/completions.post(
            API_VERSION, completionsBody
        );
    string? tweetContent = completion.choices[0].text;

    if tweetContent is () {
        return error("Failed to generate a tweet on upcoming and recently released movies.");
    }

    if tweetContent.length() > MAX_TWEET_LENGTH {
        return error("The generated tweet exceeded the maximum supported character length.");
    }

    // Tweet it out!
    final twitter:Client twitter = check new (twitterConfig);
    twitter:Tweet tweet = check twitter->tweet(tweetContent);
    io:println("Tweet: ", tweet.text);
}
```