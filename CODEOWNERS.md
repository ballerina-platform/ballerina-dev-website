# Lines starting with '#' are comments.
# Each line is a file pattern followed by one or more owners.

# These owners will be the default owners for everything in the repo.
*       @defunkt 
*       @praneesha 
*       @Samallama 
*       @lafernando

# Order is important. The last matching pattern has the most precedence.
# So if a pull request only touches javascript files, only these owners
# will be requested to review.
*.js    @octocat @github/js
*.md    @opraneesha @github/md

# You can also use email addresses if you prefer.
docs/*  docs@example.com
learn/* praneesha@wso2.com
swan-lake/* praneesha@wso2.com
1.1/* praneesha@wso2.com
1.0/* praneesha@wso2.com
0.990/* praneesha@wso2.com
community/* samudra@wso2.com