import sys
from github import Github
from os import linesep

# Getting the command line arguments as inputs
token = sys.argv[1]
version = str(sys.argv[2])
sha256 = sys.argv[3]
url = sys.argv[4]
sha256_replacement = '  sha256 "' + sha256 + '"'
url_replacement = 'url "' + url + '"'
license_replacement = '  license "Apache-2.0"'
ballerina_rb_file_contents = ""

github_instance = Github(token)

# Getting an instance of the Homebrew/homebrew-core repo
# TODO: Change this to homebrew_user = github_instance.get_user("Homebrew") in production usage. 
# And change to homebrew_user = github_instance.get_user("iHomebrew") when testing.
homebrew_user = github_instance.get_user("Homebrew")
homebrew_core_repo = homebrew_user.get_repo("homebrew-core")

# Reading the current ballerina.rb Formula file and updating it.
ballerina_rb_file = homebrew_core_repo.get_contents("Formula/ballerina.rb")


# Count and return the number of preceeding Whitespaces
def getPreceedingWsCount(line):
    ws_count = 0
    while(line[ws_count] == " " or ws_count > 120):
        ws_count += 1
    return ws_count

previous_line = ""
for line in ballerina_rb_file.decoded_content.decode("utf-8").split("\n"):
    previous_line = line
    updated_line = line
    if(line.strip().startswith('url')):
        if(previous_line.strip().startswith('livecheck')):
            continue
        updated_line = getPreceedingWsCount(updated_line) * " "
        updated_line += url_replacement
    elif(line.strip().startswith('sha256')):
        if(updated_line == sha256_replacement):
            print("metadata.json is not yet updated!")
            exit()
        updated_line = sha256_replacement + "\n" + license_replacement
    elif(line.strip().startswith('license')):
        continue

    ballerina_rb_file_contents += updated_line+"\n"

ballerina_rb_file_contents = ballerina_rb_file_contents.rstrip()
ballerina_rb_file_contents += linesep
commit_msg_title = " ".join(["ballerina", version])

current_user = github_instance.get_user()
current_user_login = current_user.login

# TODO: Check if there are any other Ballerina related PRs sent by another user.
# This needs to be checked by iteration over all the PRs in the Homebrew Repo.
# https://github.com/Homebrew/homebrew-core/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+ballerina is not supported by the Github API yet.

# Commiting and pushing the updated ballerina.rb file to the current users forked homebrew-core repo
# [Important] The user who provides the access token also should fork the Homebrew/homebrew-core repo in order for this to work

repo = github_instance.get_repo(current_user_login+"/homebrew-core")
contents = repo.get_contents("Formula/ballerina.rb", ref="master")
update = repo.update_file(contents.path, commit_msg_title, ballerina_rb_file_contents, contents.sha, branch="master")

# Opening a PR in Homebrew/homebrew-core repo

body = '''
This PR is created by @ballerina-bot.
In case any issue arises, please feel free to contact @sAnjana or @shafreenAnfar. 
Otherwise, drop us a message at ballerina-dev@googlegroups.com regarding any concerns.
'''

pr = homebrew_core_repo.create_pull(title=commit_msg_title, body=body, base="master", head='{}:{}'.format(current_user_login, 'master'))