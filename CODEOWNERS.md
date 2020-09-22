# Lines starting with '#' are comments.
# Each line is a file pattern followed by one or more owners.

# These owners will be the default owners for everything in the repo.
*       @praneesha 
*       @Samallama 
*       @lafernando

# Order is important. The last matching pattern has the most precedence.
# So if a pull request only touches javascript files, only these owners
# will be requested to review.
*.md    @praneesha @github/md
*.html  @praneesha @github/html
*learn/*    @praneesha
*swan-lake/*    @praneesha
*1.1/*    @praneesha
*1.0/*    @praneesha
*0.990/*    @praneesha
*community/*    @Samallama

# You can also use email addresses if you prefer.
